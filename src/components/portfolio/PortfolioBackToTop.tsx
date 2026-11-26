import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { usePrefersReducedMotion } from "@/components/motion";
import { FLOATING_SLOT, FLOATING_Z } from "@/lib/floating-stack";

/** Controle universal de retorno ao topo para páginas longas de clientes. */
export function PortfolioBackToTop({ locale }: { locale?: "es-CL" } = {}) {
  const spanish = locale === "es-CL";
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      aria-label={spanish ? "Volver arriba" : "Voltar ao topo"}
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
      className={`fixed ${FLOATING_SLOT.rightTwo} right-4 sm:right-6 ${FLOATING_Z.fab} grid min-h-11 min-w-11 place-items-center rounded-full border border-white/20 bg-slate-950/90 text-white shadow-lg backdrop-blur ${reducedMotion ? "" : "transition hover:-translate-y-0.5"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
