#!/usr/bin/env node
/**
 * Worker de regeneração manual das imagens sociais dos projetos /portfolio.
 *
 * Regenera, a partir das fontes reais de cada cliente:
 *   - og:image / twitter:image  → JPEG 1200x630 (WhatsApp/Facebook não leem WebP)
 *   - apple-touch-icon          → PNG 180x180
 *
 * Também recalcula o `socialVersion` (SHA-1) usado para cache-busting das
 * prévias sociais e grava o histórico de execuções em
 * `public/audit/social-regen-history.json`, exibido no /painel-auditorias.
 *
 * Roda como worker/CLI (Node + ImageMagick) — não como função serverless:
 * o runtime de borda do site não possui ImageMagick nem filesystem gravável.
 *
 * Uso:
 *   node scripts/regenerate-social-images.mjs                 # todos os clientes
 *   node scripts/regenerate-social-images.mjs rm-fretes dyz…  # apenas alguns
 *   ACTOR="henrique" node scripts/regenerate-social-images.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";

const assetsFile = resolve("src/config/portfolio-assets.json");
const historyFile = resolve("public/audit/social-regen-history.json");
const MAX_HISTORY = 50;
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const actor = process.env.ACTOR ?? "cli";

const cfg = JSON.parse(readFileSync(assetsFile, "utf8"));
const results = [];

function magick(args) {
  execFileSync("magick", args, { stdio: ["ignore", "ignore", "pipe"] });
}

for (const [key, entry] of Object.entries(cfg.clients)) {
  if (only.length && !only.includes(key)) continue;
  const src = entry.socialImage;
  if (typeof src !== "string" || !src.startsWith("/images/")) continue;

  const jpgRel = src.endsWith(".jpg") ? src : src.replace(/\.[a-z0-9]+$/i, "-og.jpg");
  const sourceRel = entry.socialSource ?? src;
  const srcPath = resolve("public", sourceRel.slice(1));
  const outPath = resolve("public", jpgRel.slice(1));
  if (!existsSync(srcPath)) {
    results.push({ client: key, status: "skipped", reason: "fonte ausente", source: sourceRel });
    continue;
  }

  try {
    mkdirSync(dirname(outPath), { recursive: true });
    magick([
      srcPath, "-resize", "1200x630^", "-gravity", "center", "-extent", "1200x630",
      "-background", "white", "-flatten", "-quality", "82", outPath,
    ]);

    // apple-touch-icon: PNG 180x180 (iOS ignora WebP e SVG neste slot).
    const touchRel = jpgRel.replace(/(-og)?\.jpg$/i, "-touch.png");
    const touchPath = resolve("public", touchRel.slice(1));
    magick([
      srcPath, "-resize", "180x180^", "-gravity", "center", "-extent", "180x180",
      "-background", "white", "-flatten", touchPath,
    ]);

    entry.socialImage = jpgRel;
    entry.socialVersion = createHash("sha1").update(readFileSync(outPath)).digest("hex").slice(0, 8);
    entry.touchIcon = touchRel;
    results.push({ client: key, status: "ok", socialImage: jpgRel, touchIcon: touchRel, version: entry.socialVersion });
  } catch (error) {
    results.push({ client: key, status: "failed", reason: error instanceof Error ? error.message : String(error) });
  }
}

writeFileSync(assetsFile, `${JSON.stringify(cfg, null, 2)}\n`);

mkdirSync(dirname(historyFile), { recursive: true });
const history = existsSync(historyFile) ? JSON.parse(readFileSync(historyFile, "utf8")) : [];
const ok = results.filter((r) => r.status === "ok").length;
const failed = results.filter((r) => r.status === "failed").length;
const skipped = results.filter((r) => r.status === "skipped").length;
history.unshift({
  runAt: new Date().toISOString(),
  actor,
  scope: only.length ? only : "all",
  totals: { ok, failed, skipped },
  results,
});
writeFileSync(historyFile, `${JSON.stringify(history.slice(0, MAX_HISTORY), null, 2)}\n`);

// Espelha a execução no backend (`ops_job_runs`) quando as credenciais do
// scheduler estão presentes — em produção o painel lê dessa fonte, já que o
// JSON acima só existe no repositório/artefato de build.
const hookBase = process.env.SOCIAL_REGEN_HOOK_URL;
const cronSecret = process.env.CRON_SECRET;
if (hookBase && cronSecret) {
  try {
    const res = await fetch(hookBase, {
      method: "POST",
      headers: { "content-type": "application/json", "x-cron-secret": cronSecret },
      body: JSON.stringify({
        actor,
        scope: only.length ? only : "all",
        totals: { ok, failed, skipped },
        results,
      }),
    });
    console.log(`[social-regen] histórico enviado ao painel (${res.status})`);
  } catch (error) {
    console.warn(`[social-regen] falha ao enviar histórico: ${error instanceof Error ? error.message : error}`);
  }
}

console.log(`[social-regen] ${ok} ok · ${failed} falha(s) · ${skipped} pulado(s) — histórico em public/audit/social-regen-history.json`);
if (failed > 0) process.exit(1);
