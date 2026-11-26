/** Limit the message without leaving a partial UTF-16 surrogate or controls. */
export function sanitizeInfinitoSpaMessage(raw: string): string {
  return Array.from(raw, (character) =>
    /^[\uD800-\uDFFF]$/.test(character) ? "\uFFFD" : character,
  )
    .join("")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700)
    .replace(/[\uD800-\uDBFF]$/, "");
}
