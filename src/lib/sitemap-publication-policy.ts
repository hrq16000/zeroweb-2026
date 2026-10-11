/**
 * Política de descoberta para páginas locais quando a fonte de publicação
 * fica indisponível. Não publica uma capital presumida sem confirmação.
 */
export function selectInstitutionalCapitals<T extends { slug: string }>(
  capitals: readonly T[],
  publishedSlugs: ReadonlySet<string>,
  unpublishedSlugs: ReadonlySet<string> | null,
): T[] {
  // Consulta de exclusões confirmada: preserva o comportamento normal.
  if (unpublishedSlugs !== null) {
    return capitals.filter((capital) => !unpublishedSlugs.has(capital.slug));
  }
  // Sem confirmação das exclusões: apenas publicações comprovadas.
  return capitals.filter((capital) => publishedSlugs.has(capital.slug));
}
