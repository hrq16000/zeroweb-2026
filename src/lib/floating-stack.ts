/**
 * Camada única de posicionamento dos elementos flutuantes do site.
 *
 * Todos os FABs/toasts usam estes tokens para evitar sobreposição entre si e
 * com o rodapé. As alturas seguem a escala de 4pt e respeitam a safe-area de
 * dispositivos móveis (`env(safe-area-inset-bottom)`).
 *
 * Ordem visual (coluna esquerda, de baixo para cima):
 *   slot 1 — CTA de proposta (LeadWidget)
 *   slot 2 — pílula do chatbot
 *   slot 3 — prova social
 */
export const FLOATING_SLOT = {
  /** ~20px acima da borda inferior segura. */
  one: "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]",
  /** Acima do slot 1 (altura do FAB + gap de 8pt). */
  two: "bottom-[calc(5.25rem+env(safe-area-inset-bottom))]",
  /** Acima do slot 2. */
  three: "bottom-[calc(9.5rem+env(safe-area-inset-bottom))]",
  /** Coluna direita (WhatsApp). */
  right: "bottom-[calc(5.5rem+env(safe-area-inset-bottom))]",
} as const;

/** z-index contextual: FABs < painéis abertos < consentimento/modais. */
export const FLOATING_Z = {
  fab: "z-40",
  panel: "z-[70]",
  consent: "z-[80]",
} as const;

/** Classe utilitária para sumir suavemente ao alcançar o rodapé. */
export function hideNearFooter(nearFooter: boolean): string {
  return `transition-[opacity,transform] duration-300 ${
    nearFooter ? "pointer-events-none translate-y-6 opacity-0" : "opacity-100"
  }`;
}
