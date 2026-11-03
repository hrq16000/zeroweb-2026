import { test } from "node:test";
import assert from "node:assert/strict";
import { diagnosePortfolio } from "../../scripts/portfolio-batch-preflight.mjs";

const slug = "loja-exemplo";
const ownUrl = "https://0web.com.br/portfolio/" + slug;
const share = "Loja Exemplo é um comércio local confirmado com atendimento pessoal, proposta singular e informações oficiais verificadas.\n\n" + ownUrl + "\n\n#Exemplo #0WEB";
function fixture(status = "published") {
  return {
    catalog: [{
      slug, clientKey: slug, title: "Loja Exemplo", city: "Curitiba", state: "PR",
      status, tags: ["comercio"],
    }],
    clients: [{
      slug, clientKey: slug, routeFile: "src/routes/portfolio.$slug.tsx",
    }],
    legacySlugs: new Set(),
    siteRegistry: 'slug: "loja-exemplo", vertical: "comercios", indexable: true',
    compositionRegistry: '"loja-exemplo": lazy(',
    shareCopy: { [slug]: share },
    formContexts: { [slug]: { intent: "contato" } },
    contacts: { [slug]: { whatsapp: "5541999999999" } },
    destinationLedger: { [slug]: { status: "VERIFIED" } },
    seed: [{ slug, published: status === "published" }],
    getMedia() {
      return { inventory: { realBusinessPhotos: ["/images/loja-exemplo/fachada.jpg"] },
        mediaApprovalGate: { status: "APPROVED" } };
    },
  };
}

test("publicação candidata informa que ainda precisa de E2E e CI, não dá certificado fictício", () => {
  const result = diagnosePortfolio(slug, fixture());
  assert.equal(result.stage, "CANDIDATE_FOR_FULL_GATES");
  assert.equal(result.blocks, 0);
  assert.equal(result.issues.length, 0);
});

test("draft pode ter rota disponível sem aparecer no catálogo; não vira published automaticamente", () => {
  const result = diagnosePortfolio(slug, fixture("draft"));
  assert.equal(result.stage, "DRAFT_PENDING");
  assert.ok(result.issues.some((x) => x.code === "DRAFT_PUBLIC_ROUTE"));
  assert.equal(result.issues.some((x) => x.severity === "BLOCK"), false);
});

test("faltas em um novo projeto publicado aparecem juntas, sem permitir fallback de WhatsApp", () => {
  const ctx = fixture();
  ctx.clients = [];
  ctx.contacts = {};
  ctx.formContexts = {};
  ctx.shareCopy = {};
  ctx.seed = [];
  ctx.getMedia = () => ({ inventory: { realBusinessPhotos: [] },
    mediaApprovalGate: { status: "BLOCKED" } });
  const result = diagnosePortfolio(slug, ctx);
  assert.equal(result.stage, "BLOCKED_PUBLISHED");
  for (const code of ["CLIENT_RECORD", "SHARE_COPY", "FUNNEL_CONTEXT", "ADMIN_SEED_MISSING", "REAL_MEDIA_PENDING", "MEDIA_APPROVAL", "LEAD_ONLY"]) {
    assert.ok(result.issues.some((x) => x.code === code), code);
  }
});

test("portfólios do baseline congelado não passam a exigir fotos novas retroativamente", () => {
  const ctx = fixture();
  ctx.legacySlugs.add(slug);
  ctx.clients[0].routeFile = "src/routes/portfolio.exemplo.tsx";
  ctx.siteRegistry = "";
  ctx.compositionRegistry = "";
  ctx.getMedia = () => null;
  const result = diagnosePortfolio(slug, ctx);
  assert.equal(result.blocks, 0);
  assert.ok(result.issues.some((x) => x.code === "MEDIA_PLAN_MISSING" && x.severity === "WARN"));
});

test("diagnóstico jamais inclui número operacional ou conteúdo das respostas", () => {
  const result = diagnosePortfolio(slug, fixture());
  assert.equal(JSON.stringify(result).includes("5541999999999"), false);
});

test("empresa ainda ausente recebe etapa de pesquisa, não publicação fictícia", () => {
  const result = diagnosePortfolio("empresa-nova", fixture());
  assert.equal(result.stage, "NOT_STARTED");
  assert.equal(result.issues[0].code, "ENTITY_NOT_ONBOARDED");
});

test("registry multilinha não transforma projetos legítimos em bloqueios falsos", () => {
  const ctx = fixture();
  ctx.siteRegistry = '{\\n  slug: "loja-exemplo",\\n  vertical: "comercios",\\n  indexable: true,\\n}';
  const result = diagnosePortfolio(slug, ctx);
  assert.equal(result.stage, "CANDIDATE_FOR_FULL_GATES");
  assert.equal(result.blocks, 0);
});

test("ausência de ledger no legado gera aviso, não bloqueia 90 projetos congelados", () => {
  const ctx = fixture();
  ctx.legacySlugs.add(slug);
  ctx.destinationLedger = {};
  const result = diagnosePortfolio(slug, ctx);
  assert.equal(result.blocks, 0);
  assert.ok(result.issues.some((x) => x.code === "CONTACT_LEDGER" && x.severity === "WARN"));
});
