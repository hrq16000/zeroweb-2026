/**
 * STRUCTURAL_SKELETON_SIMILARITY — adendo de autonomia §18–§21.
 *
 * Extrai o esqueleto (sequência ordenada de type.variant) direto do
 * componente do cliente e compara com os demais projetos gerenciados.
 * Originalidade não é só estilo: dois projetos com a mesma topologia
 * pertencem ao mesmo esqueleto mesmo com cores e fotos diferentes.
 */
export function extractSkeleton(source = "") {
  const sections = [];
  const re = /type:\s*"([a-zA-Z]+)",\s*\n\s*variant:\s*"([a-zA-Z]+)",\s*\n\s*order:\s*(\d+)/g;
  let m;
  while ((m = re.exec(source))) sections.push({ type: m[1], variant: m[2], order: Number(m[3]) });
  return sections.sort((a, b) => a.order - b.order).map((s) => `${s.type}.${s.variant}`);
}

/** Razão da maior subsequência comum (0..1). */
export function skeletonSimilarity(a = [], b = []) {
  if (!a.length || !b.length) return 0;
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const at = a[i - 1].split(".")[0];
      const bt = b[j - 1].split(".")[0];
      dp[i][j] = at === bt ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length] / Math.max(a.length, b.length);
}

export const SKELETON_SIMILARITY_LIMIT = 0.8;
