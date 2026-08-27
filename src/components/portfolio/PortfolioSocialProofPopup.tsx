import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { shouldSuppressPortfolioHostOverlays } from "@/lib/portfolio-preview";

type Props = {
  clientKey: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  delayMs?: number;
  autoDismissMs?: number;
  className?: string;
  accentClassName?: string;
};

export function PortfolioSocialProofPopup({
  clientKey,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  delayMs = 6000,
  autoDismissMs = 3500,
  className = "border-white/15 bg-slate-950/95 text-white",
  accentClassName = "text-amber-300",
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldSuppressPortfolioHostOverlays()) return;
    let dismissTimer: number | undefined;
    const timer = window.setTimeout(() => {
      setOpen(true);
      trackEvent("portfolio_social_proof_view", { client_key: clientKey, location: "portfolio_client_site" });
      dismissTimer = window.setTimeout(() => setOpen(false), autoDismissMs);
    }, delayMs);
    return () => {
      window.clearTimeout(timer);
      if (dismissTimer) window.clearTimeout(dismissTimer);
    };
  }, [autoDismissMs, clientKey, delayMs]);

  if (!open) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24, x: -12 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className={`fixed bottom-5 left-5 z-40 w-[min(360px,calc(100vw-2.5rem))] rounded-2xl border p-4 shadow-2xl backdrop-blur ${className}`}
      aria-label={`Prova social de ${clientKey}`}
    >
      <button type="button" onClick={() => setOpen(false)} aria-label="Fechar prova social" className="absolute right-2 top-2 rounded-full p-1.5 opacity-70 transition hover:bg-white/10 hover:opacity-100">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <p className={`pr-7 text-[10px] font-bold uppercase tracking-[0.2em] ${accentClassName}`}>{eyebrow}</p>
      <p className="mt-2 text-sm font-semibold leading-snug">{title}</p>
      <p className="mt-2 text-xs leading-relaxed opacity-75">{description}</p>
      <a href={ctaHref} onClick={() => setOpen(false)} className={`mt-3 inline-flex items-center gap-1 text-xs font-bold hover:underline ${accentClassName}`}>
        {ctaLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </motion.aside>
  );
}
