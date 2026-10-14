/** Ordem de recuperação sem I/O, aplicável a qualquer novo /portfolio/:slug. */
export type PortfolioImageCandidate = { src: string; srcSet?: string };

export function portfolioImageCandidates({
  authoredSrc,
  managedSrc,
  responsiveSrcSet,
}: {
  authoredSrc: string;
  managedSrc: string;
  responsiveSrcSet?: string;
}): PortfolioImageCandidate[] {
  const candidates: PortfolioImageCandidate[] = [];
  const authored = authoredSrc.trim();
  const managed = managedSrc.trim();
  // Se uma variante responsiva falha, tentamos o arquivo original sem srcset.
  if (managed && managed === authored && responsiveSrcSet?.trim()) {
    candidates.push({ src: managed, srcSet: responsiveSrcSet });
  }
  if (managed) candidates.push({ src: managed });
  // Se a imagem editada no painel falhar, usamos o arquivo original versionado.
  if (authored && managed !== authored) candidates.push({ src: authored });
  return candidates;
}
