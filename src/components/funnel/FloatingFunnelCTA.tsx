import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { FunnelModalWrapper } from "./FunnelModalWrapper";
import { trackEvent } from "@/lib/analytics";
import type { ContactIntent } from "@/lib/contact-intent";
import { useNearFooter } from "@/hooks/useNearFooter";

/**
 * Botão flutuante (canto inferior ESQUERDO — para não colidir com o
 * WhatsAppFloat à direita) que abre o funil comum. Use nas páginas
 * institucionais (sobre, faq, planos, cases, etc.).
 */
export function FloatingFunnelCTA({
  funnelSlug = "funnel-common",
  label = "Fale com um especialista",
  location = "floating_common",
}: {
  funnelSlug?: string;
  label?: string;
  location?: string;
}) {
  const [open, setOpen] = useState(false);
  const intent: ContactIntent = {
    purpose: "diagnosis",
    source: location,
    pagePath: typeof window === "undefined" ? "/" : window.location.pathname,
    placement: "sticky-mobile",
  };
  const nearFooter = useNearFooter();
  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackEvent("cta_click", { label: "floating_funnel", location, funnel: funnelSlug });
          setOpen(true);
        }}
        className={`fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 z-40 sm:bottom-24 sm:left-6 ${nearFooter ? "pointer-events-none opacity-0 translate-y-6" : "opacity-100"} transition-[opacity,transform] duration-300 inline-flex items-center gap-2 rounded-full
                   bg-secondary text-secondary-foreground border border-border
                   px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl
                   hover:bg-secondary/90 active:scale-95 transition-all
                   max-[420px]:px-3 max-[420px]:py-2.5`}
        aria-label={label}
        aria-hidden={nearFooter}
        tabIndex={nearFooter ? -1 : 0}
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">Fale conosco</span>
      </button>
      <FunnelModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        funnelSlug="diagnostico-0web"
        intent={intent}
      />
    </>
  );
}
