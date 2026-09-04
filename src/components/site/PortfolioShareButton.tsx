import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { buildPortfolioShareMessage } from "@/lib/portfolio-share";

type SharePosition = "top-right" | "top-left" | "bottom-right";
type SurfaceVariant = "light" | "dark";
type Placement = "floating" | "inline";

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

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

export function PortfolioShareButton({
  position = "top-right",
  variant = "light",
  label = "Copiar divulgação",
  slug,
  siteName,
  placement = "floating",
  className = "",
}: {
  position?: SharePosition;
  variant?: SurfaceVariant;
  label?: string;
  slug?: string;
  siteName?: string;
  placement?: Placement;
  className?: string;
} = {}) {
  const [copied, setCopied] = useState(false);
  const runtime = usePortfolioRuntime();
  const copyPromotion = async () => {
    // Isolamento por projeto: o override só vale quando é do MESMO slug.
    const override =
      runtime && runtime.slug === (slug ?? "") && runtime.shareCopy ? runtime.shareCopy : undefined;
    const text = override ?? buildPortfolioShareMessage(slug ?? "portfolio", siteName);
    trackEvent("portfolio_share_click", {
      portfolio_slug: slug ?? "unknown",
      page_type: "portfolio_client",
      method: "clipboard",
    });
    try {
      await copyText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard pode estar indisponível em contextos não seguros.
    }
  };
  const placementClass = placement === "floating" ? `fixed z-40 ${POSITION[position]}` : "";
  const baseClass = placement === "floating"
    ? "min-h-11 rounded-full border px-4 py-2 text-xs font-bold shadow-lg backdrop-blur transition hover:-translate-y-0.5"
    : "min-h-10 rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  return (
    <button
      type="button"
      onClick={copyPromotion}
      aria-label={`Copiar divulgação de ${siteName ?? "este projeto"}`}
      className={`inline-flex items-center justify-center gap-2 ${baseClass} ${placementClass} ${VARIANT[variant]} ${className}`}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? "Divulgação copiada" : label}
    </button>
  );
}
