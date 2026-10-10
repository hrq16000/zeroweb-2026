/**
 * Gate de coerencia do indice de busca dos novos portfolios v4.
 *
 * Bloqueia anuncios de servicos/produtos e localidades que nao constam
 * sequer na apresentacao editorial aprovada no catalogo versionado.
 * Nao afirma que essa coerencia seja prova externa ou cobertura operacional:
 * fontes, licencas, disponibilidade e endereco permanecem sujeitos ao
 * contrato de evidencias do portfolio.
 */
const FIELDS = ["aliases", "categories", "services", "products", "equipment", "problems", "useCases", "locality", "keywords"];
const PLACEHOLDERS = /(?:lorem ipsum|preencher|sua empresa aqui|nome da empresa|cidade ficticia|exemplo de negocio|sem definir|a confirmar|todo)/i;

export function normalizeDiscoveryClaim(value) {
  if (typeof value !== "string") return "";
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function documented(claim, corpus) {
  const key = normalizeDiscoveryClaim(claim);
  if (!key) return false;
  return corpus.some((item) => {
    const normalized = normalizeDiscoveryClaim(item);
    return (` ${normalized} `).includes(` ${key} `);
  });
}

export function checkNewPortfolioDiscoveryClaims(slug, manifest, project, discoveryDoc) {
  if (Number(manifest?.contractVersion ?? 0) < 4 || manifest?.stage !== "published") return [];
  const errors = [];
  const label = `[${slug}] PORTFOLIO_DISCOVERY_CLAIMS_GATE`;
  if (!discoveryDoc || typeof discoveryDoc !== "object" || Array.isArray(discoveryDoc)) {
    return [`${label}: documento individual de descoberta ausente`];
  }
  const textual = [project?.title, project?.subtitle, project?.summary, ...(Array.isArray(project?.tags) ? project.tags : [])];
  const locations = [project?.city, project?.state, project?.location, project?.subtitle, project?.summary];

  for (const field of FIELDS) {
    const raw = discoveryDoc[field];
    if (raw === undefined) continue;
    if (!Array.isArray(raw)) {
      errors.push(`${label}: ${field} precisa ser uma lista de termos`);
      continue;
    }
    const seen = new Set();
    for (const value of raw) {
      const key = normalizeDiscoveryClaim(value);
      if (!key || PLACEHOLDERS.test(key) || key.length > 160) {
        errors.push(`${label}: ${field} tem termo vazio, placeholder ou excessivo`);
        continue;
      }
      if (seen.has(key)) errors.push(`${label}: ${field} contem termo repetido: ${value}`);
      seen.add(key);
      if (["services", "products"].includes(field) && !documented(value, textual)) {
        errors.push(`${label}: ${field} anuncia ${value} sem mencao na apresentacao aprovada do negocio`);
      }
      if (field === "locality" && !documented(value, locations)) {
        errors.push(`${label}: localidade ${value} nao documentada na apresentacao do negocio`);
      }
    }
  }

  const offers = [
    ...(Array.isArray(discoveryDoc.services) ? discoveryDoc.services : []),
    ...(Array.isArray(discoveryDoc.products) ? discoveryDoc.products : []),
  ];
  if (offers.length === 0) {
    errors.push(`${label}: registrar ao menos um produto ou servico real do negocio para descoberta`);
  }
  const categories = Array.isArray(discoveryDoc.categories) ? discoveryDoc.categories : [];
  const keywords = Array.isArray(discoveryDoc.keywords) ? discoveryDoc.keywords : [];
  if (categories.length === 0 && keywords.length === 0) {
    errors.push(`${label}: index de descoberta requer categoria ou termo de busca especifico`);
  }
  return errors;
}
