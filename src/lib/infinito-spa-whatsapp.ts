/** Limit the message without leaving a partial UTF-16 surrogate or controls. */
export function sanitizeInfinitoSpaMessage(raw: string): string {
  return Array.from(raw, (character) =>
    /^[\uD800-\uDFFF]$/.test(character) ? "\uFFFD" : character,
  )
    .join("")
    // eslint-disable-next-line no-control-regex -- intentional: strip control characters from WhatsApp text
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700)
    .replace(/[\uD800-\uDBFF]$/, "");
}
