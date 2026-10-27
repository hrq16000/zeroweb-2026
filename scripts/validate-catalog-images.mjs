#!/usr/bin/env node
/**
 * Validador de imagens do catálogo de serviços.
 *
 * Para cada serviço ativo no banco (table `services` via REST Supabase),
 * garante:
 *   - image_path/og_image_path válido OU capa institucional canônica versionada
 *   - a imagem do CMS responde HEAD 200 com Content-Type image/*
 *   - o fallback canônico existe na rota pública e é consumido pelas duas
 *     camadas de catálogo/navegação
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
    path === "scripts/validate-catalog-images.mjs" ||
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
  const url = `${URL_BASE.replace(/\/$/, "")}/rest/v1/services?select=slug,name,image_path,og_image_path,gallery,is_active&is_active=eq.true&order=slug.asc`;
  const r = await fetch(url, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.json();
}

const SITE_BASE = (process.env.CATALOG_SITE_BASE || "https://0web.com.br").replace(/\/$/, "");
const COVER_BINDINGS_MANIFEST = JSON.parse(
  readFileSync("src/config/service-cover-bindings.json", "utf8"),
);
const COVER_BASE_PATH = String(COVER_BINDINGS_MANIFEST.basePath || "/api/public/catalog-image").replace(/\/$/, "");
const CANONICAL_FALLBACK_COVERS = new Map(
  Object.entries(COVER_BINDINGS_MANIFEST.bindings || {}),
);
const KNOWN_LEGACY_COVERS = JSON.parse(
  readFileSync("src/config/service-legacy-image-recovery.json", "utf8"),
);

// O manifesto JSON é a fonte única slug → arquivo.
const BUNDLED_ROUTE_SOURCE = readFileSync(
  "src/routes/api/public/catalog-image.$file.ts",
  "utf8",
);
const COVER_HELPER_SOURCE = readFileSync(
  "src/lib/service-cover-bindings.ts",
  "utf8",
);
const SERVICE_PUBLIC_SOURCE = readFileSync(
  "src/lib/services-public.functions.ts",
  "utf8",
);
const SERVICE_NAV_SOURCE = readFileSync(
  "src/lib/services-nav.functions.ts",
  "utf8",
);
const GMB_ROUTE_SOURCE = readFileSync(
  "src/routes/servicos.google-meu-negocio.tsx",
  "utf8",
);

// O CMS conserva três URLs comprovadamente 404 até o reenvio. Somente essas
// referências podem passar pelo recuperador editorial da PR #449.
const GALLERY_RECOVERY_SOURCE = readFileSync("src/lib/service-gallery-recovery.ts", "utf8");
const GOOGLE_ADS_LEGACY_GALLERY = new Map([
  ["/__l5e/assets-v1/bdb41320-73ca-45ee-bbef-8bdc4eed77e5/google-ads-299-capa.png", "src/assets/cover-google-ads.jpg"],
  ["/__l5e/assets-v1/52dfe9c7-f306-4a1c-befc-23f196b0c1c0/google-ads-299-horizontal.png", "src/assets/blog-google-ads.jpg"],
  ["/__l5e/assets-v1/c72d8859-f2ab-4ae1-b156-2033d42fd469/google-ads-299-vertical.png", "src/assets/blog-roi-trafego.jpg"],
]);
const GALLERY_RECOVERY_LINKED =
  (SERVICE_PUBLIC_SOURCE.match(/recoverGoogleAdsGallery\(/g) ?? []).length >= 2 &&
  SERVICE_PUBLIC_SOURCE.includes('import blogGoogleAdsCover from "@/assets/blog-google-ads.jpg"') &&
  SERVICE_PUBLIC_SOURCE.includes('import blogRoiTrafegoCover from "@/assets/blog-roi-trafego.jpg"');

function recoveredGalleryHasValidAsset(slug, path) {
  if (slug !== "google-ads-299" || !GOOGLE_ADS_LEGACY_GALLERY.has(path)) return false;
  if (!GALLERY_RECOVERY_LINKED || !GALLERY_RECOVERY_SOURCE.includes(path)) return false;
  const file = GOOGLE_ADS_LEGACY_GALLERY.get(path);
  if (!existsSync(file)) return false;
  const bytes = readFileSync(file);
  return bytes.length > 64 && bytes[0] === 0xff && bytes[1] === 0xd8;
}

function hasCanonicalFallback(slug) {
  const file = CANONICAL_FALLBACK_COVERS.get(slug);
  if (!file) return false;
  const routeHasBytes = BUNDLED_ROUTE_SOURCE.includes(`"${file}":`);
  const helperUsesManifest =
    COVER_HELPER_SOURCE.includes("service-cover-bindings.json") &&
    COVER_HELPER_SOURCE.includes("canonicalServiceCoverUrl");
  const publicUsesHelper =
    SERVICE_PUBLIC_SOURCE.includes('canonicalServiceCoverUrl(row.slug)');
  const navUsesHelper =
    SERVICE_NAV_SOURCE.includes('canonicalServiceCoverUrl(r.slug)');
  return routeHasBytes && helperUsesManifest && publicUsesHelper && navUsesHelper;
}

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
  const canonicalFallbacks = [];
  const recoveredLegacy = [];
  const recoveredGallery = [];
  const broken = [];

  for (const s of services) {
    const path = s.image_path || s.og_image_path;
    if (!path) {
      if (hasCanonicalFallback(s.slug)) {
        canonicalFallbacks.push(s.slug);
        continue;
      }
      orphans.push(s.slug);
      continue;
    }
    const target = imageTarget(path);
    const legacy = KNOWN_LEGACY_COVERS[s.slug];
    if (legacy && legacy.brokenPath === path) {
      // Não mascara URLs arbitrárias: esta única referência histórica é
      // substituída em runtime pela capa JPEG local versionada. O guard
      // exige bytes válidos e o helper ligado aos dois loaders públicos.
      const asset = legacy.fallbackAsset;
      const bytes = existsSync(asset) ? readFileSync(asset) : null;
      const validJpeg = bytes && bytes.length > 64 && bytes[0] === 0xff && bytes[1] === 0xd8;
      const runtimeHasRecovery =
        SERVICE_PUBLIC_SOURCE.includes("isKnownLegacyServiceImage") &&
        SERVICE_NAV_SOURCE.includes("isKnownLegacyServiceImage") &&
        SERVICE_PUBLIC_SOURCE.includes('"google-meu-negocio": coverLocal') &&
        GMB_ROUTE_SOURCE.includes('import coverLocal from "@/assets/cover-local.jpg"') &&
        !GMB_ROUTE_SOURCE.includes('google-meu-negocio-capa.png.asset.json') &&
        !GMB_ROUTE_SOURCE.includes("cover.url");
      if (validJpeg && runtimeHasRecovery) {
        recoveredLegacy.push(s.slug);
        continue;
      }
      broken.push({ slug: s.slug, url: target.url, reason: "fallback local ausente ou não conectado" });
      continue;
    }
    const r = await headOk(target);
    if (!r.ok) broken.push({ slug: s.slug, url: target.url, reason: r.reason });
  }

  // A checagem antiga cobria a capa, não as imagens secundárias.
  // URLs novas do CMS são verificadas individualmente por HTTP/Content-Type.
  for (const s of services) {
    if (s.gallery != null && !Array.isArray(s.gallery)) {
      broken.push({ slug: s.slug, url: "(gallery)", reason: "formato inválido no CMS (esperado array)" });
    }
    for (const [index, image] of (Array.isArray(s.gallery) ? s.gallery : []).entries()) {
      const raw = image && typeof image === "object" && !Array.isArray(image)
        ? image.path ?? image.url : null;
      const path = typeof raw === "string" ? raw.trim() : "";
      if (!path) {
        broken.push({ slug: s.slug, url: "gallery[" + index + "]", reason: "imagem sem path/url válido" });
        continue;
      }
      if (s.slug === "google-ads-299" && GOOGLE_ADS_LEGACY_GALLERY.has(path)) {
        if (recoveredGalleryHasValidAsset(s.slug, path)) {
          recoveredGallery.push(s.slug + ": " + path);
        } else {
          broken.push({ slug: s.slug, url: path, reason: "recuperação editorial ausente/inválida" });
        }
        continue;
      }
      const check = await headOk(imageTarget(path));
      if (!check.ok) broken.push({ slug: s.slug, url: path, reason: "galeria[" + index + "]: " + check.reason });
    }

    // Imagem social própria: auditar sem substituir pelo arquivo da capa.
    if (s.image_path && s.og_image_path && s.og_image_path !== s.image_path) {
      const legacy = KNOWN_LEGACY_COVERS[s.slug];
      if (legacy?.brokenPath === s.og_image_path &&
          SERVICE_PUBLIC_SOURCE.includes("og_image_path: isKnownLegacyServiceImage(row.slug, row.og_image_path) ? null : row.og_image_path")) {
        const bytes = existsSync(legacy.fallbackAsset) ? readFileSync(legacy.fallbackAsset) : null;
        if (bytes && bytes.length > 64 && bytes[0] === 0xff && bytes[1] === 0xd8) {
          recoveredLegacy.push(s.slug + " (OG)");
          continue;
        }
      }
      const check = await headOk(imageTarget(s.og_image_path));
      if (!check.ok) broken.push({ slug: s.slug, url: s.og_image_path, reason: "og:image: " + check.reason });
    }
  }
  if (recoveredGallery.length) {
    console.warn("[catalog-images] ⚠️ " + recoveredGallery.length + " imagem(ns) de galeria recuperadas por assets locais válidos; reenvio no CMS recomendado:");
    for (const entry of recoveredGallery) console.warn("  - " + entry);
  }

  if (recoveredLegacy.length) {
    console.warn(
      `[catalog-images] ⚠️ ${recoveredLegacy.length} capa(s) legadas inválidas substituídas na página pública por imagem JPEG local válida; reenvio no CMS ainda recomendado:`,
    );
    for (const slug of recoveredLegacy) console.warn(`  - ${slug}`);
  }

  if (canonicalFallbacks.length) {
    console.log(
      `[catalog-images] ℹ️ ${canonicalFallbacks.length} serviço(s) usando capa institucional canônica 0WEB:`,
    );
    for (const slug of canonicalFallbacks) console.log(`  - ${slug}`);
  }

  if (orphans.length === 0 && broken.length === 0) {
    console.log(
      `[catalog-images] ✅ catálogo operacional: ${services.length - canonicalFallbacks.length} capa(s) do CMS + ${canonicalFallbacks.length} capa(s) institucionais canônicas 0WEB`,
    );
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