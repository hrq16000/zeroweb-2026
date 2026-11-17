/** Formulário hospedado pela 0WEB para demonstração. URL pública não é credencial. */
export const LETICIA_REICHE_HOSTED_FORM_URL = "https://form.jotform.com/263111116816044" as const;
export const LETICIA_REICHE_HOSTED_FORM_PROVIDER = "jotform" as const;

/** O domínio é fixo e não recebe dados de outro cliente via URL dinâmica. */
export function isLeticiaReicheHostedFormUrl(value: string): boolean {
  return value === LETICIA_REICHE_HOSTED_FORM_URL;
}
