import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type SharePosition = "top-right" | "top-left" | "bottom-right";
type SurfaceVariant = "light" | "dark";

const POSITION: Record<SharePosition, string> = {
  "top-right": "right-4 top-20",
  "top-left": "left-4 top-20",
  "bottom-right": "right-4 bottom-20",
};

const VARIANT: Record<SurfaceVariant, string> = {
  light:
    "border-slate-200 bg-white/95 text-slate-700 hover:border-blue-300 hover:text-blue-700",
  dark: "border-white/20 bg-black/70 text-white hover:border-white/50 hover:text-white",
};

export function PortfolioShareButton({
  position = "top-right",
  variant = "light",
  label = "Compartilhar",
  slug,
}: {
  position?: SharePosition;
  variant?: SurfaceVariant;
  label?: string;
  slug?: string;
} = {}) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const data = {
      title: document.title,
      text: "Confira este projeto publicado pela 0WEB",
      url: window.location.href,
    };
    trackEvent("portfolio_share_click", {
      portfolio_slug: slug ?? "unknown",
      page_type: "portfolio_client",
      method: typeof navigator !== "undefined" && "share" in navigator ? "native" : "clipboard",
    });
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* usuário cancelou o compartilhamento */
    }
  };
  return (
    <button
      type="button"
      onClick={share}
      aria-label="Compartilhar este projeto"
      className={`fixed z-40 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold shadow-lg backdrop-blur transition hover:-translate-y-0.5 ${POSITION[position]} ${VARIANT[variant]}`}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copiado" : label}
    </button>
  );
}
