/**
 * Painel deterministico do audit HTTP/SEO ja executado diariamente.
 * Este indicador mede ELEGIBILIDADE TECNICA, nao indexacao no Google.
 */
const PUBLIC_STATUSES = new Set(["approved", "published"]);

export function buildPortfolioIndexationReadiness(audit, manifests, catalog) {
  if (!audit || !Array.isArray(audit.rows) || !Array.isArray(catalog)) {
    throw new Error("PORTFOLIO_READINESS_REPORT: auditoria ou catalogo ausente/invalido");
  }
  const rows = audit.rows;
  const bySlug = new Map();
  for (const row of rows) {
    if (typeof row?.slug !== "string" || !Array.isArray(row.failures) || bySlug.has(row.slug)) {
      throw new Error("PORTFOLIO_READINESS_REPORT: linhas duplicadas ou sem lista de falhas");
    }
    bySlug.set(row.slug, row);
  }
  const catalogBySlug = new Map(catalog.map((item) => [item.slug, item]));
  const projects = manifests?.projects ?? {};
  const published = [];
  const hidden = [];
  for (const [slug, manifest] of Object.entries(projects)) {
    if (Number(manifest?.contractVersion ?? 0) < 4) continue;
    if (manifest?.stage === "published") published.push(slug);
    else hidden.push(slug);
  }
  const entries = published.sort().map((slug) => {
    const row = bySlug.get(slug);
    const item = catalogBySlug.get(slug);
    const blockers = [];
    if (!item || !PUBLIC_STATUSES.has(item.status) || item.live === false) {
      blockers.push("catalogo nao confirma publicacao");
    }
    if (!row) blockers.push("site publicado ausente da auditoria de URLs");
    else {
      blockers.push(...row.failures);
      if (row.sitemap === false && !blockers.includes("ausente do sitemap-portfolio.xml")) {
        blockers.push("ausente do sitemap-portfolio.xml");
      }
    }
    return { slug, eligible: blockers.length === 0, blockers };
  });
  const hiddenLeaks = hidden.filter((slug) => bySlug.get(slug)?.sitemap === true).sort();
  const eligible = entries.filter((e) => e.eligible).length;
  const overallPass = rows.filter((row) => row.failures.length === 0).length;
  const overall = {
    checked: rows.length,
    technicallyEligible: overallPass,
    blocked: rows.length - overallPass,
    percent: rows.length ? Math.round((overallPass / rows.length) * 1000) / 10 : null,
  };
  return {
    auditedAt: audit.generatedAt ?? null,
    scope: "technical_eligibility_not_google_indexation",
    googleIndexedCount: null,
    overall,
    newV4: {
      published: entries.length,
      technicallyEligible: eligible,
      blocked: entries.length - eligible,
      percent: entries.length ? Math.round((eligible / entries.length) * 1000) / 10 : null,
      entries,
      unpublishedLeakedToSitemap: hiddenLeaks,
    },
  };
}

export function formatPortfolioIndexationReadiness(scorecard) {
  const pct = (value) => value === null ? "N/A (nenhum v4 publicado)" : `${value}%`;
  const lines = [
    "## Portfólios 0WEB — elegibilidade técnica",
    "",
    "Este relatório **não** mostra URLs indexadas pelo Google; para isso é necessário GSC.",
    `- Total verificado: ${scorecard.overall.technicallyEligible}/${scorecard.overall.checked} elegíveis (${pct(scorecard.overall.percent)})`,
    `- Novos v4 publicados: ${scorecard.newV4.technicallyEligible}/${scorecard.newV4.published} elegíveis (${pct(scorecard.newV4.percent)})`,
    `- Novos v4 não publicados indevidamente no sitemap: ${scorecard.newV4.unpublishedLeakedToSitemap.length}`,
  ];
  for (const entry of scorecard.newV4.entries.filter((entry) => !entry.eligible)) {
    lines.push(`- BLOQUEADO ${entry.slug}: ${entry.blockers.join("; ")}`);
  }
  for (const slug of scorecard.newV4.unpublishedLeakedToSitemap) {
    lines.push(`- VAZAMENTO NO SITEMAP: ${slug} ainda não está publicado no manifesto`);
  }
  return `${lines.join("\n")}\n`;
}
