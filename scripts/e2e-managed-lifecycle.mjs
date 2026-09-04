#!/usr/bin/env bun
/**
 * Fixture ponta a ponta do projeto Managed (criado pelo painel, sem código).
 *
 * Percorre DRAFT → READY → PUBLISHED → ARCHIVED usando exatamente as mesmas
 * regras do painel (`buildManagedRow`, `managedStatus`, `canTransition`) e
 * valida, a cada etapa, o que o público realmente recebe:
 *
 *   rota /portfolio/<slug> · catálogo /portfolio · sitemap-portfolio.xml
 *   metadados/SEO · imagem social · pop-up 0WEB · origem do lead
 *
 * Uso: bun scripts/e2e-managed-lifecycle.mjs [baseUrl]
 * Requer SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (ambiente do projeto).
 */
import { buildManagedRow, canTransition, managedStatus, sanitizeManagedProject } from "../src/lib/portfolio-managed.ts";

const BASE = process.argv[2] ?? "http://localhost:8080";
const SLUG = "fixture-managed-demo";
const URL_BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) {
  console.error("SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY ausentes.");
  process.exit(1);
}

const rest = (path, init = {}) =>
  fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
  });

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const A = "/images/_fixture-managed";
const draftInput = {
  slug: SLUG,
  clientKey: SLUG,
  displayName: "Fixture Managed Demo",
  segment: "servicos",
  city: "Curitiba",
  state: "PR",
  summary: "Projeto técnico que valida o ciclo de vida administrável do portfólio.",
  preset: "impact",
  seoTitle: "Fixture Managed Demo — validação do painel 0WEB",
  seoDescription:
    "Projeto técnico criado pelo painel para validar rota pública, catálogo, sitemap, SEO, imagem social e captação de leads.",
  seoKeywords: "fixture, painel, portfolio",
  logoUrl: `${A}/logo.jpg`,
  heroImageUrl: `${A}/hero.jpg`,
  heroFocal: { x: 45, y: 35 },
  heroHeadline: "Presença digital criada pelo painel",
  heroSubheadline: "Sem editar código, sem criar componente, sem tocar no roteador.",
  catalogCoverUrl: `${A}/capa.jpg`,
  coverFocal: { x: 50, y: 40 },
  socialImageUrl: `${A}/social.jpg`,
  socialVersion: "1",
  ctaLabel: "Solicitar orçamento",
  shareCopy: "Conheça a Fixture Managed Demo: 0web.com.br/portfolio/fixture-managed-demo #0WEB",
  services: [
    { title: "Diagnóstico", description: "Levantamento do que o negócio precisa mostrar." },
    { title: "Construção", description: "Página completa montada pelo painel." },
    { title: "Publicação", description: "Rota pública, catálogo e sitemap atualizados." },
  ],
  gallery: [
    { url: `${A}/g1.jpg`, alt: "Amostra 1", focal: { x: 30, y: 60 } },
    { url: `${A}/g2.jpg`, alt: "Amostra 2", focal: { x: 70, y: 40 } },
  ],
  content: {
    about: "Fixture técnica usada para provar o fluxo completo do painel.",
    differentials: ["Sem código", "Conformidade obrigatória", "Publicação auditável"],
    steps: [{ title: "Cadastrar", description: "Dados e identidade no wizard." }],
    faq: [{ q: "Isto é um cliente real?", a: "Não: é uma fixture técnica de validação." }],
  },
  brandColors: { primary: "#0f172a", accent: "#f97316", surface: "#ffffff", ink: "#0b1220" },
};

const html = async (path) => {
  const res = await fetch(`${BASE}${path}`, { headers: { "user-agent": "0web-fixture" } });
  return { status: res.status, body: await res.text() };
};

async function transition(from, to, expectConformance = true) {
  if (!canTransition(from, to)) throw new Error(`transição inválida ${from} → ${to}`);
  const now = new Date().toISOString();
  const patch = {
    lifecycle_status: to,
    published: to === "published",
    archived_at: to === "archived" ? now : null,
    updated_at: now,
    ...(to === "ready" ? { ready_at: now } : {}),
  };
  if (expectConformance && (to === "ready" || to === "published")) {
    const current = await rest(`portfolio_client_settings?slug=eq.${SLUG}&select=*`).then((r) => r.json());
    const project = sanitizeManagedProject(current[0]);
    if (!managedStatus(project).canBeReady) throw new Error("conformidade bloqueou a transição");
  }
  const res = await rest(`portfolio_client_settings?slug=eq.${SLUG}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text());
  await rest("portfolio_client_settings_history", {
    method: "POST",
    body: JSON.stringify([{ client_key: SLUG, field: "lifecycle_status", old_value: from, new_value: to }]),
  });
}

try {
  // Limpeza de execuções anteriores.
  await rest(`portfolio_client_settings?slug=eq.${SLUG}`, { method: "DELETE" });

  // 1. DRAFT — criado pelo painel, ainda invisível.
  const row = { ...buildManagedRow(draftInput), lifecycle_status: "draft", published: false, content_version: 1 };
  const created = await rest("portfolio_client_settings", { method: "POST", body: JSON.stringify([row]) });
  check("DRAFT criado sem código", created.ok, created.ok ? "" : await created.text());

  const incomplete = managedStatus(sanitizeManagedProject({ ...row, logo_url: "" }));
  check("Conformidade bloqueia READY sem logo", !incomplete.canBeReady, incomplete.blockers.map((b) => b.code).join(","));

  const draftPage = await html(`/portfolio/${SLUG}`);
  check("DRAFT não expõe conteúdo público", !draftPage.body.includes("Presença digital criada pelo painel"));

  // 2. READY — conformidade aprovada, ainda fora do ar.
  await transition("draft", "ready");
  const readyPage = await html(`/portfolio/${SLUG}`);
  check("READY continua fora do público", !readyPage.body.includes("Presença digital criada pelo painel"));

  // 3. PUBLISHED — rota, catálogo, sitemap, SEO, social, pop-up.
  await transition("ready", "published");
  const live = await html(`/portfolio/${SLUG}`);
  check("Rota pública responde 200", live.status === 200, `status ${live.status}`);
  check("H1/headline do cliente no HTML", live.body.includes("Presença digital criada pelo painel"));
  check("Título de SEO próprio", live.body.includes("Fixture Managed Demo — validação do painel 0WEB"));
  check("Canonical próprio", live.body.includes(`https://0web.com.br/portfolio/${SLUG}`));
  check("Imagem social versionada", live.body.includes(`${A}/social.jpg?v=1`));
  check("Indexável quando publicado", live.body.includes("index,follow"));
  check("JSON-LD LocalBusiness", live.body.includes('"LocalBusiness"'));
  check("Serviços renderizados", live.body.includes("Diagnóstico") && live.body.includes("Publicação"));
  check("Galeria renderizada", live.body.includes(`${A}/g1.jpg`));
  check("Sem contato operacional no HTML", !/wa\.me|\b41\s?9\d{4}[- ]?\d{4}\b/.test(live.body));

  const catalog = await html("/portfolio");
  check("Catálogo lista o projeto", catalog.body.includes(`/portfolio/${SLUG}`));

  const sitemap = await html("/sitemap-portfolio.xml");
  check("Sitemap inclui o projeto", sitemap.body.includes(`/portfolio/${SLUG}`));

  check(
    "Pop-up de captação da 0WEB presente",
    /portfolio-fixture-managed-demo|PortfolioUpsell|upsell/i.test(live.body),
    "pageName do pop-up",
  );

  // 4. Origem do lead — o pop-up atribui o projeto correto.
  check("Atribuição de origem do lead", live.body.includes(`portfolio-${SLUG}`));

  // 5. ARCHIVED — some do público mantendo histórico.
  await transition("published", "archived");
  const archived = await html(`/portfolio/${SLUG}`);
  check("Arquivado sai do ar", !archived.body.includes("Presença digital criada pelo painel"));
  const catalogAfter = await html("/portfolio");
  check("Arquivado sai do catálogo", !catalogAfter.body.includes(`/portfolio/${SLUG}`));
  const sitemapAfter = await html("/sitemap-portfolio.xml");
  check("Arquivado sai do sitemap", !sitemapAfter.body.includes(`/portfolio/${SLUG}`));

  const history = await rest(
    `portfolio_client_settings_history?client_key=eq.${SLUG}&select=field,old_value,new_value`,
  ).then((r) => r.json());
  check("Histórico preservado", history.length >= 3, `${history.length} registros`);
} catch (error) {
  check("execução da fixture", false, String(error));
} finally {
  await rest(`portfolio_client_settings?slug=eq.${SLUG}`, { method: "DELETE" });
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} verificações OK`);
process.exit(failed.length ? 1 : 0);
