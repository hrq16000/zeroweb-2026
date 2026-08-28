import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Controle universal de retorno ao topo para páginas longas de clientes. */
export function PortfolioBackToTop() {
  const [visible, setVisible] = useState(false);

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
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-4 z-40 grid min-h-11 min-w-11 place-items-center rounded-full border border-white/20 bg-slate-950/90 text-white shadow-lg backdrop-blur transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
