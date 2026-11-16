#!/usr/bin/env node
/** Garante que capas de fallback dos serviços existam, sem banco nem keys. */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function auditServiceFallbackAssets({ coverSource, routeSource, bindings, imageIssue }) {
  const errors = [];
  const imports = [...coverSource.matchAll(/from\s+["\x27]@\/assets\/([^"\x27]+)["\x27]/g)].map((match) => match[1]);
  if (imports.length === 0) errors.push("Nenhuma capa local importada no fallback de serviços");
  for (const filename of new Set(imports)) {
    if (filename.includes("..") || filename.startsWith("/")) {
      errors.push(`Caminho de capa inválido: ${filename}`);
      continue;
    }
    const problem = imageIssue(filename);
    if (problem) errors.push(`Capa institucional ${filename}: ${problem}`);
  }
  if (bindings.basePath !== "/api/public/catalog-image") {
    errors.push("Caminho canônico do catálogo alterado inesperadamente");
  }
  for (const [slug, file] of Object.entries(bindings.bindings ?? {})) {
    if (!/^[a-z0-9-]+$/.test(slug) || !/^[a-z0-9-]+\.(?:jpg|jpeg|png|webp|avif)$/.test(file)) {
      errors.push(`Vínculo inválido no manifesto: ${slug} -> ${file}`);
    } else if (!routeSource.includes(`"${file}":`)) {
      errors.push(`Capa canônica sem bytes na rota: ${slug} -> ${file}`);
    }
  }
  return errors;
}

function imageIssue(filename) {
  const file = resolve("src/assets", filename);
  if (!existsSync(file)) return "arquivo não encontrado";
  const bytes = readFileSync(file);
  if (bytes.length < 64) return "arquivo vazio ou truncado";
  const ext = filename.split(".").pop()?.toLowerCase();
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const webp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  const avif = bytes.toString("ascii", 4, 8) === "ftyp";
  if (!(ext === "jpg" || ext === "jpeg") && ext !== "png" && ext !== "webp" && ext !== "avif") return "extensão inválida";
  if (!({ jpg: jpeg, jpeg, png, webp, avif }[ext] ?? false)) return "assinatura incompatível com o formato";
  return null;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = auditServiceFallbackAssets({
    coverSource: readFileSync("src/lib/service-cover-fallback.ts", "utf8"),
    routeSource: readFileSync("src/routes/api/public/catalog-image.$file.ts", "utf8"),
    bindings: JSON.parse(readFileSync("src/config/service-cover-bindings.json", "utf8")),
    imageIssue,
  });
  if (errors.length) {
    for (const error of errors) console.error(`[service-fallback-assets] FAIL ${error}`);
    process.exitCode = 1;
  } else console.log("[service-fallback-assets] OK — capas locais e vínculos canônicos verificados");
}
