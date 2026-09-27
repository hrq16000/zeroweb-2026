// Pure checks for published pages: head metadata + JSON-LD blocks.
// Errors = may stop Google from understanding/indexing the page.
// Warnings = degrade rich results but do not block recognition.

export function extractHead(html) {
  const meta = (key, attr = "property") => {
    const a = new RegExp(`<meta[^>]*${attr}=["']${key}["'][^>]*content=["']([^"']*)["']`, "i");
    const b = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${key}["']`, "i");
    return html.match(a)?.[1] ?? html.match(b)?.[1] ?? null;
  };
  const canon = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1] ?? null;
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  return {
    title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || null,
    description: meta("description", "name"),
    ogTitle: meta("og:title"),
    ogImage: meta("og:image"),
    robots: meta("robots", "name"),
    canonical: canon,
    canonicalCount: (html.match(/<link[^>]*rel=["']canonical["']/gi) || []).length,
    jsonLdRaw: blocks,
  };
}

const isAbs = (v) => typeof v === "string" && /^https:\/\//.test(v);
const typesOf = (node) => [].concat(node?.["@type"] ?? []);
const ENTITY_TYPES = new Set([
  "Thing", "LocalBusiness", "Organization", "Person", "Store", "ProfessionalService",
  "DrivingSchool", "BeautySalon", "FoodEstablishment", "Restaurant", "Bakery",
  "HomeAndConstructionBusiness", "Electrician", "Plumber", "AutoRepair",
  "ComputerStore", "ElectronicsStore", "HealthAndBeautyBusiness", "SportsActivityLocation",
]);

export function checkPage(html, expectedUrl) {
  const errors = [];
  const warnings = [];
  const h = extractHead(html);

  if (!h.title) errors.push("title ausente");
  else if (h.title.length > 65) warnings.push(`title com ${h.title.length} caracteres (>65)`);
  if (!h.description) errors.push("meta description ausente");
  if (h.canonicalCount === 0) errors.push("canonical ausente");
  if (h.canonicalCount > 1) errors.push(`${h.canonicalCount} canonicals na página`);
  if (h.canonical && expectedUrl && h.canonical !== expectedUrl) errors.push(`canonical aponta para ${h.canonical}`);
  if (h.robots && /noindex/i.test(h.robots)) errors.push("página publicada com noindex");
  if (!h.ogTitle) warnings.push("og:title ausente");
  if (h.ogImage && !isAbs(h.ogImage)) warnings.push("og:image não é URL absoluta");

  const nodes = [];
  h.jsonLdRaw.forEach((raw, i) => {
    let d;
    try { d = JSON.parse(raw); } catch { errors.push(`JSON-LD #${i + 1} inválido (não parseia)`); return; }
    if (d["@context"] && !/schema\.org/.test(String(d["@context"]))) errors.push(`JSON-LD #${i + 1} com @context inválido`);
    for (const n of Array.isArray(d["@graph"]) ? d["@graph"] : [d]) nodes.push(n);
  });
  if (nodes.length === 0) errors.push("nenhum dado estruturado (JSON-LD)");

  const types = nodes.flatMap(typesOf);
  const webPages = nodes.filter((n) => typesOf(n).includes("WebPage"));
  const entities = nodes.filter((n) => typesOf(n).some((type) => ENTITY_TYPES.has(type)));

  // Nem toda URL publicada precisa declarar WebPage: hubs/listas podem ser descritos
  // corretamente por ItemList + BreadcrumbList + Organization/ProfessionalService.
  if (!types.includes("WebPage")) warnings.push("WebPage ausente (aceitável para hub/lista estruturada)");
  if (!types.includes("BreadcrumbList")) warnings.push("BreadcrumbList ausente");
  if (!entities.length) warnings.push("entidade principal do portfolio não identificada no JSON-LD");

  for (const n of nodes) {
    const t = typesOf(n);
    if (!t.length && !n?.["@id"]) errors.push("nó JSON-LD sem @type");
    if (t.includes("BreadcrumbList")) {
      const items = n.itemListElement;
      if (!Array.isArray(items) || items.length < 2) errors.push("BreadcrumbList com menos de 2 itens");
      else items.forEach((it, i) => {
        if (it.position !== i + 1) errors.push(`BreadcrumbList posição ${i + 1} fora de ordem`);
        if (!it.name) errors.push(`BreadcrumbList item ${i + 1} sem name`);
        if (i < items.length - 1 && !isAbs(typeof it.item === "object" ? it.item?.["@id"] : it.item)) errors.push(`BreadcrumbList item ${i + 1} sem URL absoluta`);
      });
    }
    if (t.includes("FAQPage")) {
      const q = n.mainEntity;
      if (!Array.isArray(q) || !q.length) errors.push("FAQPage sem perguntas");
      else q.forEach((x, i) => { if (!x?.name || !x?.acceptedAnswer?.text) errors.push(`FAQPage pergunta ${i + 1} incompleta`); });
    }
    if (t.some((x) => ENTITY_TYPES.has(x)) && !n.name) errors.push(`${t.join("/")} sem name`);
    if (t.includes("AggregateRating") || n?.aggregateRating) {
      const r = n.aggregateRating ?? n;
      if (r.ratingValue == null || (r.reviewCount == null && r.ratingCount == null)) errors.push("AggregateRating sem ratingValue/reviewCount");
    }
    if (t.includes("WebPage")) {
      if (n.url && expectedUrl && n.url !== expectedUrl) errors.push(`WebPage.url difere do canonical (${n.url})`);
      if (n["@id"] && expectedUrl && n["@id"] !== expectedUrl && n["@id"] !== `${expectedUrl}#webpage`) warnings.push(`WebPage.@id não está ancorado no canonical (${n["@id"]})`);
      if (!n.name) warnings.push("WebPage sem name");
      if (!n.description) warnings.push("WebPage sem description");
    }
  }
  if (webPages.length > 1) warnings.push(`${webPages.length} nós WebPage encontrados`);
  return { ok: errors.length === 0, errors, warnings, head: { ...h, jsonLdRaw: undefined }, types };
}
