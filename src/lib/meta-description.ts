/**
 * Helpers estritamente editoriais para metadados de SERP.
 * Mantém o conteúdo completo da página e limita somente a meta description.
 */
export function compactMetaDescription(value: string, maxLength = 160): string {
  const clean = String(value ?? "").trim().replace(/\s+/g, " ");
  if (!clean || clean.length <= maxLength) return clean;

  const budget = Math.max(24, maxLength - 1);
  const slice = clean.slice(0, budget + 1);
  const breakAt = slice.lastIndexOf(" ");
  const base = (breakAt >= Math.floor(budget * 0.72) ? slice.slice(0, breakAt) : clean.slice(0, budget))
    .replace(/[\s,;:–—-]+$/g, "")
    .trim();

  return `${base}…`;
}
