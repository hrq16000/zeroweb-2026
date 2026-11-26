export function classifyIndexabilityDelta(before, after, { expectedUnpublishedDraft = false } = {}) {
  if (before && !after) return { hard: true, reason: "rota removida", schemaDelta: 0 };
  if (!before || !after) return { hard: false, reason: "", schemaDelta: 0 };

  const reasons = [];
  if (before.status === 200 && after.status !== 200) reasons.push(`status ${before.status}→${after.status}`);
  if (before.canonical && !after.canonical) reasons.push("canonical removida");
  if (before.canonical && after.canonical && before.canonical !== after.canonical) reasons.push("canonical alterada");
  // A non-existent route becoming a verified unpublished draft is not a
  // loss of indexability. Existing public pages remain strictly protected.
  const newDraft =
    expectedUnpublishedDraft === true &&
    before.status === 404 &&
    after.status === 200 &&
    !before.canonical &&
    !before.redirectedTo &&
    !after.redirectedTo &&
    after.noindex === true &&
    after.canonical === `https://0web.com.br${after.route}` &&
    !after.problems?.some((problem) => !["noindex", "nofollow"].includes(problem));
  if (!before.noindex && after.noindex && !newDraft) reasons.push("noindex introduzido");
  if (!before.nofollow && after.nofollow && !newDraft) reasons.push("nofollow introduzido");

  const beforeProblems = new Set(before.problems ?? []);
  const afterProblems = new Set(after.problems ?? []);
  if (!beforeProblems.has("ausente do sitemap") && afterProblems.has("ausente do sitemap")) {
    reasons.push("removida do sitemap");
  }

  return {
    hard: reasons.length > 0,
    reason: reasons.join("; ") || (newDraft ? "novo rascunho não indexável; publicação ainda pendente" : ""),
    schemaDelta: (after.schemas?.length ?? 0) - (before.schemas?.length ?? 0),
  };
}
