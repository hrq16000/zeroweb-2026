import { useEffect, useState } from "react";

/**
 * Retorna `true` quando o rodapé principal do site está visível.
 *
 * Usado pelos botões flutuantes para sumirem ao chegar no rodapé, evitando
 * cobrir links legais, redes sociais e o aviso de CNPJ. O rodapé é carregado
 * de forma preguiçosa, então o observer é reconectado até encontrá-lo.
 */
export function useNearFooter(): boolean {
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    let observer: IntersectionObserver | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const attach = () => {
      const footer = document.querySelector("footer.bg-foreground");
      if (!footer) return false;
      observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting), {
        threshold: 0.05,
      });
      observer.observe(footer);
      return true;
    };

    if (!attach()) {
      timer = setInterval(() => {
        if (attach() && timer) clearInterval(timer);
      }, 500);
    }

    return () => {
      observer?.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);

  return nearFooter;
}
