export async function sha256Bytes(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
}

export async function assistedCheckoutProtocol(sessionKey: string) {
  const bytes = await sha256Bytes(`0web-assisted:${sessionKey}`);
  const code = Array.from(bytes)
    .slice(0, 5)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `0W-${code}`;
}

export async function deterministicCheckoutOrderId(userId: string, sessionKey: string) {
  const digest = await sha256Bytes(`0web-order:${userId}:${sessionKey}`);
  const bytes = digest.slice(0, 16);

  // UUID v8: conteúdo determinístico próprio, mantendo formato e variante RFC.
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x80;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

export function readAssistedProtocol(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const protocol = (metadata as Record<string, unknown>).protocol;
  return typeof protocol === "string" && /^0W-[A-F0-9]{10}$/.test(protocol)
    ? protocol
    : null;
}
