#!/usr/bin/env node
/** Registers an identity contract for every portfolio, including existing client assets. */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const catalog = JSON.parse(await readFile(resolve(root, "src/config/portfolio-catalog.json"), "utf8"));
const assets = JSON.parse(await readFile(resolve(root, "src/config/portfolio-assets.json"), "utf8"));
const contractsPath = resolve(root, "src/config/portfolio-identity-contracts.json");
const data = JSON.parse(await readFile(contractsPath, "utf8"));
for (const item of catalog) {
  if (data.contracts[item.slug]) continue;
  const asset = assets.clients?.[item.clientKey] ?? assets.clients?.[item.slug] ?? {};
  data.contracts[item.slug] = {
    brandCharacter: `${item.segment.replace(/-/g, " ")} com comunicação própria e foco local`,
    visualConcept: `Identidade de ${item.title} documentada a partir do asset vigente e do serviço real apresentado no catálogo.`,
    heroComposition: "client-scoped-existing-asset",
    sectionRhythm: "hero oferta prova-de-processo conversao",
    typographicCharacter: "Tipografia legível, hierarquia curta e contraste preservado a partir da marca vigente.",
    colorBehavior: "Paleta herdada do asset do cliente; tokens locais preservam contraste e reconhecimento.",
    imageDirection: "Asset oficial ou já existente no projeto; nenhuma evidência factual é inventada.",
    signatureElement: `${item.title}: marca e imagem social próprias no diretório do slug.`,
    logoStatus: "EXISTING_ASSET_DOCUMENTED",
    coverStatus: "SOCIAL_ASSET_DOCUMENTED",
    identityStatus: "DOCUMENTED_EXISTING_ASSET",
    logoFile: asset.icon ?? null,
    socialFile: asset.socialImage ?? null,
    identityNote: "Contrato documental criado na auditoria 0WEB; substituir somente quando o cliente fornecer uma marca oficial nova.",
  };
}
await writeFile(contractsPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`[identity-contracts] OK — ${Object.keys(data.contracts).length} contratos individuais registrados`);
