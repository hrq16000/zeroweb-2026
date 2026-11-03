import { describe, expect, test } from "bun:test";
import {
  checkDonaGarimpeiraSubmission,
  DONA_GARIMPEIRA_CLIENT_KEY,
  DONA_GARIMPEIRA_FORM_SLUG,
  donaGarimpeiraIntakeReady,
  isDonaGarimpeiraRoutingConsistent,
  type DonaGarimpeiraSubmissionContext,
} from "@/lib/dona-garimpeira-funnel-guard";

const good: DonaGarimpeiraSubmissionContext = {
  formSlug: DONA_GARIMPEIRA_FORM_SLUG,
  clientKey: DONA_GARIMPEIRA_CLIENT_KEY,
  registered: true,
  catalogPublished: true,
  ownWhatsAppConfigured: true,
  answers: {
    interesse: "comprar",
    detalhes: "Gostaria de conhecer a loja.",
    nome: "Maria Silva",
    whatsapp: "(41) 99837-9642",
    privacidade: ["ciente"],
  },
};
function withChanges(
  overrides: Partial<DonaGarimpeiraSubmissionContext>,
): DonaGarimpeiraSubmissionContext {
  return { ...good, ...overrides };
}
const deny = (request: DonaGarimpeiraSubmissionContext, reason: string) =>
  expect(checkDonaGarimpeiraSubmission(request)).toEqual({ ok: false, reason });

describe("Dona Garimpeira — gate server-side de envio do funil", () => {
  test("não altera outros funis institucionais ou de portfolio", () => {
    expect(checkDonaGarimpeiraSubmission(withChanges({
      formSlug: "funnel-arildo-madeiras",
      registered: false,
      clientKey: null,
      answers: {},
    }))).toEqual({ ok: true });
  });

  test("bloqueia ativação antes de clientKey, catálogo published/live e WhatsApp próprio", () => {
    deny(withChanges({ registered: false }), "NOT_READY");
    deny(withChanges({ catalogPublished: false }), "NOT_READY");
    deny(withChanges({ ownWhatsAppConfigured: false }), "NOT_READY");
    deny(withChanges({
      registered: false, ownWhatsAppConfigured: false,
    }), "NOT_READY");
  });

  test("jamais roteia sem clientKey ou com chave de outro cliente", () => {
    deny(withChanges({ clientKey: undefined }), "WRONG_CLIENT");
    deny(withChanges({ clientKey: "arildo-madeiras" }), "WRONG_CLIENT");
    deny(withChanges({ clientKey: "0web" }), "WRONG_CLIENT");
  });

  test("recusa usar clientKey da Dona Garimpeira com formulário de outro cliente", async () => {
    deny(withChanges({
      formSlug: "funnel-arildo-madeiras",
      clientKey: DONA_GARIMPEIRA_CLIENT_KEY,
    }), "WRONG_CLIENT");
    deny(withChanges({
      formSlug: "funnel-0web",
      clientKey: DONA_GARIMPEIRA_CLIENT_KEY,
    }), "WRONG_CLIENT");

    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(resolve(process.cwd(), "src/lib/dynamic-funnel.functions.ts"), "utf8");
    const submit = source.slice(source.indexOf("export const submitFunnel ="));
    expect(submit).toContain('String(data.client_metadata?.client_key ?? "") === "dona-garimpeira-brecho"');
    expect(submit.indexOf('String(data.client_metadata?.client_key ?? "") === "dona-garimpeira-brecho"'))
      .toBeLessThan(submit.indexOf('.from("dynamic_form_leads")'));
  });

  test("aceita somente as três intenções comerciais corretas", () => {
    for (const interesse of ["comprar", "vender", "doar"]) {
      expect(checkDonaGarimpeiraSubmission(withChanges({
        answers: { ...good.answers, interesse },
      }))).toEqual({ ok: true });
    }
    deny(withChanges({ answers: { ...good.answers, interesse: "contratar-0web" } }), "INVALID_INTEREST");
    deny(withChanges({ answers: { ...good.answers, interesse: undefined } }), "INVALID_INTEREST");
    deny(withChanges({ answers: { ...good.answers, interesse: ["comprar"] } }), "INVALID_INTEREST");
  });

  test("não aceita ausência de dados mínimos de contato", () => {
    deny(withChanges({ answers: { ...good.answers, nome: " " } }), "INVALID_NAME");
    deny(withChanges({ answers: { ...good.answers, whatsapp: "123" } }), "INVALID_PHONE");
    deny(withChanges({ answers: { ...good.answers, whatsapp: "sem telefone" } }), "INVALID_PHONE");
    expect(checkDonaGarimpeiraSubmission(withChanges({
      answers: { ...good.answers, whatsapp: "5541998379642" },
    }))).toEqual({ ok: true });
  });

  test("exige aceite explícito do checkbox de privacidade", () => {
    deny(withChanges({ answers: { ...good.answers, privacidade: undefined } }), "PRIVACY_NOT_ACKNOWLEDGED");
    deny(withChanges({ answers: { ...good.answers, privacidade: [] } }), "PRIVACY_NOT_ACKNOWLEDGED");
    deny(withChanges({ answers: { ...good.answers, privacidade: "ciente" } }), "PRIVACY_NOT_ACKNOWLEDGED");
    deny(withChanges({ answers: { ...good.answers, privacidade: ["não"] } }), "PRIVACY_NOT_ACKNOWLEDGED");
  });

  test("não libera o funil por simples UPDATE de status sem versão publicada", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(resolve(process.cwd(), "src/lib/dynamic-funnel.functions.ts"), "utf8");
    const publicRead = source.slice(source.indexOf("export const getPublicFunnel ="), source.indexOf("// ============ submitFunnel"));
    const submit = source.slice(source.indexOf("export const submitFunnel ="));
    expect(publicRead).toContain('.select("id, slug, name, description, status, published_version_id, config_json, whatsapp_config")');
    expect(publicRead).toContain('if (form.slug === "funnel-dona-garimpeira-brecho" && !form.published_version_id) return null;');
    expect(submit).toContain('.select("id, name, slug, status, published_version_id, whatsapp_config")');
    expect(submit).toContain('if (form.slug === "funnel-dona-garimpeira-brecho" && !form.published_version_id)');
    // Os outros funis usam as mesmas regras de status que já existiam.
    expect(submit).toContain('if (!form || form.status !== "published")');
  });

  test("a leitura pública retorna null antes do registro completo", async () => {
    expect(donaGarimpeiraIntakeReady(false, true, true)).toBe(false);
    expect(donaGarimpeiraIntakeReady(true, false, true)).toBe(false);
    expect(donaGarimpeiraIntakeReady(true, true, false)).toBe(false);
    expect(donaGarimpeiraIntakeReady(true, true, true)).toBe(true);
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const src = readFileSync(resolve(process.cwd(), "src/lib/dynamic-funnel.functions.ts"), "utf8");
    const publicHandler = src.slice(src.indexOf("export const getPublicFunnel ="), src.indexOf("export const submitFunnel ="));
    expect(publicHandler).toContain('form.slug === "funnel-dona-garimpeira-brecho"');
    expect(publicHandler).toContain("donaGarimpeiraIntakeReady(");
    expect(publicHandler).toContain('form.slug !== "funnel-dona-garimpeira-brecho" && wa.enabled');
    expect(publicHandler).toContain(")) return null;");
  });

  test("não envia dados sensíveis ao contato institucional da 0WEB", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(resolve(process.cwd(), "src/lib/dynamic-funnel.functions.ts"), "utf8");
    const submitStart = source.indexOf("export const submitFunnel =");
    const submitEnd = source.indexOf("export const submitPortfolioQuiz =");
    const submit = source.slice(submitStart, submitEnd);
    expect(submit).toContain('form.slug !== "funnel-dona-garimpeira-brecho" && wa.enabled');
    expect(submit).toContain("const operationalAlert =");
    const alert = submit.indexOf("const operationalAlert =");
    const insert = submit.indexOf('.from("dynamic_form_leads")');
    expect(alert).toBeGreaterThan(0);
    expect(insert).toBeGreaterThan(alert);
    // Prova estática de isolamento; o E2E real exige Supabase autorizado.
  });

  test("código de submit checa o guard antes de inserir lead e criar token", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const src = readFileSync(resolve(process.cwd(), "src/lib/dynamic-funnel.functions.ts"), "utf8");
    const guard = src.indexOf("checkDonaGarimpeiraSubmission({");
    const insert = src.indexOf('.from("dynamic_form_leads")\n      .insert(');
    const token = src.indexOf("await createWhatsAppRedirectToken({");
    expect(guard).toBeGreaterThan(0);
    expect(insert).toBeGreaterThan(guard);
    expect(token).toBeGreaterThan(insert);
  });

  test("recusa tokens com formulário ou chave incompatíveis", () => {
    expect(isDonaGarimpeiraRoutingConsistent(DONA_GARIMPEIRA_FORM_SLUG, DONA_GARIMPEIRA_CLIENT_KEY)).toBe(true);
    expect(isDonaGarimpeiraRoutingConsistent("funnel-service", "arildo-madeiras")).toBe(true);
    expect(isDonaGarimpeiraRoutingConsistent("funnel-service", DONA_GARIMPEIRA_CLIENT_KEY)).toBe(false);
    expect(isDonaGarimpeiraRoutingConsistent(undefined, DONA_GARIMPEIRA_CLIENT_KEY)).toBe(false);
    expect(isDonaGarimpeiraRoutingConsistent(DONA_GARIMPEIRA_FORM_SLUG, null)).toBe(false);
    expect(isDonaGarimpeiraRoutingConsistent(DONA_GARIMPEIRA_FORM_SLUG, "arildo-madeiras")).toBe(false);
  });

  test("protege o quiz genérico e o redirect antes de persistir ou resolver o destino", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
    const quiz = src.slice(src.indexOf("export const submitPortfolioQuiz ="));
    const quizGuard = quiz.indexOf("if (data.clientKey === DONA_GARIMPEIRA_CLIENT_KEY)");
    expect(quizGuard).toBeGreaterThan(0);
    expect(quizGuard).toBeLessThan(quiz.indexOf("const { supabaseAdmin }"));

    const redirect = readFileSync("src/routes/r.whatsapp.$token.ts", "utf8");
    const redirectGuard = redirect.indexOf("if (!form || !isDonaGarimpeiraRoutingConsistent(form.slug, clientKey))");
    expect(redirectGuard).toBeGreaterThan(0);
    expect(redirectGuard).toBeLessThan(redirect.indexOf("await resolvePortfolioWhatsAppContactAsync(clientKey)"));
  });
});
