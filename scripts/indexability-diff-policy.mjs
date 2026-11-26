export function classifyIndexabilityDelta(before, after, { newDraft = false, beforeInSitemap = false, afterInSitemap = false } = {}) {
  // A rota nova de demonstração nunca esteve indexável. Sua proteção é uma
  // exigência, não uma regressão. Não dispensar páginas anteriormente públicas.
  if (newDraft && before?.status === 404 && after?.status === 200) {
    const reasons = [];
    if (beforeInSitemap || afterInSitemap) reasons.push("rascunho presente no sitemap");
    if (!after.noindex) reasons.push("rascunho sem noindex");
    if (!after.route?.startsWith("/portfolio/") ||
        after.canonical !== `https://0web.com.br${after.route}`) reasons.push("canonical inválida no rascunho");
    if (after.redirectedTo) reasons.push("rascunho redirecionado");
    for (const problem of after.problems ?? []) {
      if (problem !== "noindex") reasons.push(problem);
    }
    return {
      hard: reasons.length > 0,
      reason: reasons.join("; ") || "nova demonstração protegida, fora do sitemap",
      schemaDelta: (after.schemas?.length ?? 0) - (before.schemas?.length ?? 0),
    };
  }
  if (before && !after) return { hard: true, reason: "rota removida", schemaDelta: 0 };
  if (!before || !after) return { hard: false, reason: "", schemaDelta: 0 };

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
