/**
 * Inventario da malha de sitemaps de dois ambientes.
 * Uma rota presente no domínio publico e ausente no preview nao pode ser
 * ocultada por uma comparacao que olha apenas as paginas HTML da galeria.
 *
 * Páginas locais e categorias sao dependentes de publicação dinâmica; sua
 * ausência no preview gera PENDENCIA VISIVEL, nao uma aprovação de remoção.
 */
const CANONICAL = "https://0web.com.br";

function keyFromUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return (url.pathname.replace(/\/$/, "") || "/") + url.search;
  } catch {
    return null;
  }
}

function readInventory(urls) {
  const keys = new Set();
  const duplicatePaths = new Set();
  const nonCanonical = [];
  const invalid = [];
  for (const url of urls) {
    const key = keyFromUrl(url);
    if (!key) {
      invalid.push(url);
      continue;
    }
    if (keys.has(key)) duplicatePaths.add(key);
    keys.add(key);
    if (!url.startsWith(CANONICAL + "/") && url !== CANONICAL) {
      nonCanonical.push(url);
    }
  }
  return {
    keys,
    duplicatePaths: [...duplicatePaths].sort(),
    nonCanonical: nonCanonical.sort(),
    invalid: invalid.sort(),
  };
}

export function classifySitemapInventoryDelta(beforeUrls, afterUrls) {
  if (!Array.isArray(beforeUrls) || !Array.isArray(afterUrls)) {
    throw new TypeError("comparacao exige listas de URLs");
  }
  const before = readInventory(beforeUrls);
  const after = readInventory(afterUrls);
  const disappeared = [...before.keys].filter((key) => !after.keys.has(key)).sort();
  const added = [...after.keys].filter((key) => !before.keys.has(key)).sort();
  // Somente categorias publicadas dinamicamente e capitais institucionais
  // recebem classificação de pendencia. Nenhum portfolio é dispensado.
  const dynamicLocal = disappeared.filter((p) =>
    /^\/criacao-de-site-institucional\/[a-z0-9-]+$/.test(p));
  const dynamicCategories = disappeared.filter((p) =>
    /^\/categoria\/[a-z0-9-]+$/.test(p));
  const uncertain = new Set([...dynamicLocal, ...dynamicCategories]);
  const missingProtected = disappeared.filter((p) => !uncertain.has(p));
  const hardProblems = [
    ...missingProtected.map((p) => "URL estática ausente no preview: " + p),
    ...after.nonCanonical.map((p) => "URL não canônica no preview: " + p),
    ...after.invalid.map((p) => "URL inválida no preview: " + p),
    ...after.duplicatePaths.map((p) => "URL duplicada no preview: " + p),
  ];

  return {
    beforeCount: beforeUrls.length,
    afterCount: afterUrls.length,
    disappeared,
    added,
    dynamicLocal,
    dynamicCategories,
    missingProtected,
    nonCanonical: after.nonCanonical,
    invalid: after.invalid,
    duplicatePaths: after.duplicatePaths,
    hardProblems,
    warnings: [
      ...dynamicLocal.map((p) => "Publicação da capital não verificável no preview: " + p),
      ...dynamicCategories.map((p) => "Categoria dinâmica não verificável no preview: " + p),
    ],
  };
}
