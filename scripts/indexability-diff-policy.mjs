export function classifyIndexabilityDelta(before, after) {
  if (before && !after) return { hard: true, reason: "rota removida", schemaDelta: 0 };
  if (!before || !after) return { hard: false, reason: "", schemaDelta: 0 };

  const reasons = [];
  if (before.status === 200 && after.status !== 200) reasons.push(`status ${before.status}→${after.status}`);
  if (before.canonical && !after.canonical) reasons.push("canonical removida");
  if (before.canonical && after.canonical && before.canonical !== after.canonical) reasons.push("canonical alterada");
  // Rotas ainda inexistentes (404) não perdem indexabilidade ao ganhar um
  // 200 temporariamente noindex para revisão. Páginas já existentes (200)
  // continuam protegidas integralmente pelos mesmos limites estritos.
  if (before.status === 200 && !before.noindex && after.noindex) reasons.push("noindex introduzido");
  if (before.status === 200 && !before.nofollow && after.nofollow) reasons.push("nofollow introduzido");

  const beforeProblems = new Set(before.problems ?? []);
  const afterProblems = new Set(after.problems ?? []);
  if (before.status === 200 && !beforeProblems.has("ausente do sitemap") && afterProblems.has("ausente do sitemap")) {
    reasons.push("removida do sitemap");
  }

  return {
    hard: reasons.length > 0,
    reason: reasons.join("; "),
    schemaDelta: (after.schemas?.length ?? 0) - (before.schemas?.length ?? 0),
  };
}
