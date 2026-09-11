import { useEffect, useState } from "react";
import { MOTION_FLOATING } from "@/lib/global-motion-contract";
import { useNearFooter } from "@/hooks/useNearFooter";

/**
 * Ciclo único do CTA flutuante (contrato global de motion).
 *
 * Aparece depois da primeira dobra e desaparece ao encostar no rodapé ou no
 * crédito de hospedagem, para nunca cobrir cidade, créditos ou avisos legais.
 * Institucional e Blueprint compartilham exatamente este comportamento.
 */
export function useFloatingConversionVisibility(): boolean {
  const [scrolled, setScrolled] = useState(false);
  const nearFooter = useNearFooter();

  useEffect(() => {
    const ratio = MOTION_FLOATING.appearAfterViewportRatio;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * ratio);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled && !(MOTION_FLOATING.hideNearFooter && nearFooter);
}
