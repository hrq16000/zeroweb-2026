import knownLegacyCoverPaths from "@/config/service-legacy-image-recovery.json";

/**
 * Somente caminhos comprovadamente quebrados na produção; novos uploads têm
 * prioridade normal. Não bloqueia todos os assets /__l5e/ indiscriminadamente.
 */
export function isKnownLegacyServiceImage(
  slug: string,
  path: string | null | undefined,
): boolean {
  const entry = (knownLegacyCoverPaths as Record<string, { brokenPath: string }>)[slug];
  return Boolean(path && entry && path === entry.brokenPath);
}
