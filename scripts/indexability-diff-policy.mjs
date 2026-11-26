export function classifyIndexabilityDelta(before, after, {
  expectedUnpublishedDraft = false,
  newDraft = false,
  beforeInSitemap = false,
  afterInSitemap = false,
} = {}) {
  if (before && !after) return { hard: true, reason: "rota removida", schemaDelta: 0 };
  if (!after) return { hard: false, reason: "", schemaDelta: 0 };

  // Todo rascunho acessível deve permanecer noindex e fora do sitemap,
  // inclusive depois da transição inicial de 404 para 200.
  const isDraftRoute = expectedUnpublishedDraft === true || newDraft === true;
  if (isDraftRoute) {
    const reasons = [];
    if (before?.status === 200 && before.status !== after.status) {
      reasons.push(`status ${before.status}→${after.status}`);
    }
    if (before?.status === 200 && !before.noindex) reasons.push("noindex introduzido em rota pública");
    if (afterInSitemap) reasons.push("rascunho presente no sitemap");

    if (after.status === 200) {
      if (!after.noindex) reasons.push("rascunho sem noindex");
      if (
        !after.route?.startsWith("/portfolio/") ||
        after.canonical !== `https://0web.com.br${after.route}`
      ) {
        reasons.push("canonical inválida no rascunho");
      }
      if (after.redirectedTo) reasons.push("rascunho redirecionado");
      for (const problem of after.problems ?? []) {
        if (!["noindex", "nofollow", "ausente do sitemap"].includes(problem)) reasons.push(problem);
      }
    }

    return {
      hard: reasons.length > 0,
      reason: reasons.join("; ") || "rascunho não indexável; publicação ainda pendente",
      schemaDelta: (after.schemas?.length ?? 0) - (before?.schemas?.length ?? 0),
    };
  }

  if (!before) return { hard: false, reason: "", schemaDelta: 0 };

  const reasons = [];
  if (before.status === 200 && after.status !== 200) reasons.push(`status ${before.status}→${after.status}`);
  if (before.canonical && !after.canonical) reasons.push("canonical removida");
  if (before.canonical && after.canonical && before.canonical !== after.canonical) reasons.push("canonical alterada");
  if (!before.noindex && after.noindex) reasons.push("noindex introduzido");
  if (!before.nofollow && after.nofollow) reasons.push("nofollow introduzido");

  const beforeProblems = new Set(before.problems ?? []);
  const afterProblems = new Set(after.problems ?? []);
  if (!beforeProblems.has("ausente do sitemap") && afterProblems.has("ausente do sitemap")) {
    reasons.push("removida do sitemap");
  }

  return {
    hard: reasons.length > 0,
    reason: reasons.join("; "),
    schemaDelta: (after.schemas?.length ?? 0) - (before.schemas?.length ?? 0),
  };
}
