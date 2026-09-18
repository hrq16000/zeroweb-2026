#!/usr/bin/env node
/**
 * Validador de imagens do catálogo de serviços.
 *
 * Para cada serviço ativo no banco (table `services` via REST Supabase),
 * garante:
 *   - image_path não nulo OU og_image_path não nulo
 *   - a imagem responde HEAD 200 com Content-Type image/*
 *
 * Falha o processo se houver qualquer órfão (exit 1), permitindo gating em CI.
 *
 * Uso:
 *   node scripts/validate-catalog-images.mjs
 *
 * Variáveis:
 *   SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (ou VITE_*)
 *   SKIP_CATALOG_IMAGE_CHECK=1 → pula
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const SKIP = process.env.SKIP_CATALOG_IMAGE_CHECK === "1";
if (SKIP) {
  console.log("[catalog-images] skipped via SKIP_CATALOG_IMAGE_CHECK=1");
  process.exit(0);
}


/**
 * O SEO Diff é acionado também por mudanças em rotas de portfolio. O catálogo
 * de /servicos é um domínio separado e não pode bloquear uma PR que não o toca.
 * Em pull requests, conferimos o diff real contra a base; se não houver arquivo
 * de serviços, este gate é explicitamente fora de escopo. Em push/manual ou
 * se a detecção falhar, o comportamento continua estrito (fail-safe).
 */
function prTouchesServiceCatalog() {
  if (process.env.GITHUB_EVENT_NAME !== "pull_request") return true;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) return true;

  let baseSha = "";
  let headSha = "";
  try {
    const event = JSON.parse(readFileSync(eventPath, "utf8"));
    baseSha = event?.pull_request?.base?.sha ?? "";
    headSha = event?.pull_request?.head?.sha ?? "";
  } catch {
    return true;
  }
  if (!baseSha || !headSha) return true;

  // GitHub Actions faz checkout do merge sintético refs/pull/*/merge. Usar HEAD
  // aqui inclui mudanças recentes de main e pode atribuir dívida de /servicos
  // a uma PR que só toca /portfolio. Compare os SHAs reais base...head.
  const diffArgs = ["diff", "--name-only", `${baseSha}...${headSha}`];
  let diff = spawnSync("git", diffArgs, { encoding: "utf8" });
  if (diff.status !== 0) {
    const fetchRefs = spawnSync(
      "git",
      ["fetch", "--no-tags", "--depth=1", "origin", baseSha, headSha],
      { encoding: "utf8" },
    );
    if (fetchRefs.status !== 0) return true;
    diff = spawnSync("git", diffArgs, { encoding: "utf8" });
  }
  if (diff.status !== 0) return true;

  const files = String(diff.stdout || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const serviceScoped = files.some((path) =>
    /^(src\/(routes\/servicos|lib\/services?|components\/servic|config\/servic|data\/servic)|supabase\/migrations\/.*servic)/i.test(path),
  );
  if (!serviceScoped) {
    console.log("[catalog-images] skipped: PR não altera o escopo /servicos");
  }
  return serviceScoped;
}

if (!prTouchesServiceCatalog()) process.exit(0);

// Leitura pública (RLS + chave publicável). Sem dependência de segredo de CI.
const { resolvePublicSupabaseUrl, resolvePublicSupabaseKey } = await import("./lib/public-supabase.mjs");
const URL_BASE = resolvePublicSupabaseUrl();
const ANON = resolvePublicSupabaseKey();

async function fetchServices() {
  const url = `${URL_BASE.replace(/\/$/, "")}/rest/v1/services?select=slug,name,image_path,og_image_path,is_active&is_active=eq.true&order=slug.asc`;
  const r = await fetch(url, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.json();
}

const SITE_BASE = (process.env.CATALOG_SITE_BASE || "https://0web.com.br").replace(/\/$/, "");

/**
 * Resolve o alvo verificável da capa.
 * - URL absoluta: verificada diretamente.
 * - Caminho `/...`: asset estático do site (verifica arquivo local; senão HEAD no site).
 * - Caminho de bucket: objeto privado `service-images`, lido com a chave publicável.
 */
function imageTarget(path) {
  if (/^https?:\/\//.test(path)) return { url: path };
  if (path.startsWith("/")) {
    return { url: `${SITE_BASE}${path}`, localFile: `public${path}` };
  }
  return {
    url: `${URL_BASE.replace(/\/$/, "")}/storage/v1/object/service-images/${path}`,
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  };
}

async function headOk(target) {
  if (target.localFile && existsSync(target.localFile)) return { ok: true };
  try {
    const r = await fetch(target.url, { method: "HEAD", headers: target.headers });
    if (!r.ok) return { ok: false, reason: `HTTP ${r.status}` };
    const ct = r.headers.get("content-type") ?? "";
    if (!/^image\//.test(ct)) return { ok: false, reason: `content-type=${ct}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

(async () => {
  let services;
  try {
    services = await fetchServices();
  } catch (e) {
    console.error(`[catalog-images] failed to fetch services: ${e.message}`);
    process.exit(2);
  }
  console.log(`[catalog-images] checking ${services.length} active service(s)`);

  const orphans = [];
  const broken = [];

  for (const s of services) {
    const path = s.image_path || s.og_image_path;
    if (!path) {
      orphans.push(s.slug);
      continue;
    }
    const target = imageTarget(path);
    const r = await headOk(target);
    if (!r.ok) broken.push({ slug: s.slug, url: target.url, reason: r.reason });
  }


  if (orphans.length === 0 && broken.length === 0) {
    console.log(`[catalog-images] ✅ all ${services.length} services have valid cover images`);
    process.exit(0);
  }

  if (orphans.length) {
    console.error(`\n[catalog-images] ❌ ${orphans.length} service(s) with NO image_path:`);
    for (const slug of orphans) console.error(`  - ${slug}`);
  }
  if (broken.length) {
    console.error(`\n[catalog-images] ❌ ${broken.length} broken image URL(s):`);
    for (const b of broken) console.error(`  - ${b.slug} → ${b.url} (${b.reason})`);
  }
  process.exit(1);
})();
