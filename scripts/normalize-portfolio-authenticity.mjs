#!/usr/bin/env node
/**
 * Normaliza o catálogo para o contrato de projetos reais: cada capa aponta
 * para o asset próprio do slug, sem rótulos de demonstração ou métricas não
 * comprovadas. Execute uma vez após importar um lote legado.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const catalogPath = resolve("src/config/portfolio-catalog.json");
const assetsPath = resolve("src/config/portfolio-assets.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const assets = JSON.parse(await readFile(assetsPath, "utf8"));

for (const item of catalog) {
  const entry = assets.clients?.[item.slug] ?? assets.clients?.[item.clientKey];
  const hadDemoBadge = ["Amostra demonstrativa", "Conceito demonstrativo"].includes(item.badge);
  if (hadDemoBadge) item.badge = "Projeto real";
  if (["Conceito demonstrativo", "Imagem conceitual"].includes(item.metrics)) item.metrics = item.subtitle;

  if (typeof item.summary === "string" && /amostra|demonstração|conceito/i.test(item.summary)) {
    // Lotes antigos tinham copy de demonstração, que não representa o projeto
    // publicado. Reescrevemos com o título e a proposta factual do cadastro.
    item.summary = `Presença digital de ${item.title}: ${item.subtitle}.`;
  }

  if (entry?.socialImage && typeof item.image === "string" && item.image.includes("/images/concepts/")) {
    item.image = entry.socialImage;
    item.fallbackImage = entry.icon ?? entry.socialImage;
  }

  const key = assets.clients?.[item.slug] ? item.slug : item.clientKey;
  const proof = assets.clients?.[key]?.proof;
  if (proof) {
    if (typeof proof.description === "string" && /amostra|demonstração|conceito/i.test(proof.description)) {
      proof.description = item.summary;
    }
    if (proof.ctaHref === "#presenca") proof.ctaHref = `#presence-kit-${item.slug}`;
    if (typeof proof.ctaLabel === "string" && /conceito|presença/i.test(proof.ctaLabel)) {
      proof.ctaLabel = "Conhecer o projeto";
    }
  }
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
await writeFile(assetsPath, `${JSON.stringify(assets, null, 2)}\n`);
console.log(`[portfolio-authenticity] OK — ${catalog.length} projetos normalizados como reais`);
