import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function PortfolioShareButton() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const data = { title: document.title, text: "Confira este projeto publicado pela 0WEB", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    } catch { /* usuário cancelou o compartilhamento */ }
  };
  return <button type="button" onClick={share} aria-label="Compartilhar este projeto" className="fixed right-4 top-20 z-40 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-bold text-slate-700 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700">{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}{copied ? "Link copiado" : "Compartilhar"}</button>;
}
