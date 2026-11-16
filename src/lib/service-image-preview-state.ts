/**
 * Diagnóstico determinístico. A validade real de uma URL remota só pode ser
 * observada no navegador via onError; não faz probes de rede nem usa keys.
 */
export type ServiceImagePreviewState = "missing-path" | "missing-url" | "failed-load" | "ready";

export function serviceImagePreviewState(
  imagePath: string | null | undefined,
  imageUrl: string | null | undefined,
  failedLoad = false,
): ServiceImagePreviewState {
  if (!imagePath?.trim()) return "missing-path";
  if (!imageUrl?.trim()) return "missing-url";
  return failedLoad ? "failed-load" : "ready";
}
