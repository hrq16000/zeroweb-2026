import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitPortfolioHostLead } from "@/lib/portfolio-host-leads.functions";
import { readClientAttribution } from "@/lib/portfolio-host-leads";
import { trackEvent, trackConversion } from "@/lib/analytics";

/**
 * Formulário de captação da 0WEB aberto pelo pop-up comercial do portfólio.
 *
 * Coleta apenas nome, WhatsApp e cidade. Nada é enviado para GA4/Pixel além
 * de slug e estado do envio — nenhum dado pessoal sai para analytics.
 * O número da 0WEB não existe neste bundle: o destino vem do redirect opaco
 * `/r/whatsapp/:token` devolvido pelo servidor.
 */
export function PortfolioHostLeadDialog({
  open,
  onClose,
  slug,
  businessName,
  sessionId,
  visitorId,
}: {
  open: boolean;
  onClose: () => void;
  slug: string | null;
  businessName?: string | null;
  sessionId?: string | null;
  visitorId?: string | null;
}) {
  const submit = useServerFn(submitPortfolioHostLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const startedAtRef = useRef<number>(Date.now());
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    startedAtRef.current = Date.now();
    setStatus("idle");
    setError(null);
    trackEvent("host_lead_form_open", { slug: slug ?? "", event_category: "engagement" });
    const first = cardRef.current?.querySelector<HTMLInputElement>("input");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, onClose, slug]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status === "sending") return;
      setStatus("sending");
      setError(null);
      try {
        const res = await submit({
          data: {
            name,
            phone,
            city,
            company,
            startedAt: startedAtRef.current,
            attribution: {
              ...readClientAttribution(),
              portfolioSlug: slug ?? undefined,
              portfolioBusinessName: businessName ?? undefined,
              sessionId: sessionId ?? null,
              visitorId: visitorId ?? null,
            },
          },
        });

        if (!res.ok) {
          setStatus("error");
          setError(
            res.reason === "invalid_phone"
              ? "Confira o WhatsApp com DDD (ex.: 41 99999-9999)."
              : res.reason === "rate_limited"
                ? "Muitos envios seguidos. Tente novamente em alguns minutos."
                : "Não foi possível enviar agora. Tente novamente.",
          );
          return;
        }

        trackConversion("host_lead_submit", { slug: slug ?? "", event_category: "conversion" });
        if (res.redirectPath) {
          trackConversion("host_lead_whatsapp_redirect", { slug: slug ?? "" });
          window.location.assign(res.redirectPath);
        } else {
          onClose();
        }
      } catch {
        setStatus("error");
        setError("Não foi possível enviar agora. Tente novamente.");
      }
    },
    [status, submit, name, phone, city, company, slug, businessName, sessionId, visitorId, onClose],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background/80 backdrop-blur-sm p-4">
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="host-lead-title"
        data-testid="portfolio-host-lead-dialog"
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar formulário"
          className="absolute right-3 top-3 grid place-items-center w-10 h-10 rounded-full bg-muted text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 id="host-lead-title" className="pr-10 text-lg font-bold text-foreground">
          Quer um site assim para o seu negócio?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deixe seu contato e a 0WEB continua a conversa no WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
          <label className="block text-sm">
            <span className="text-foreground font-medium">Nome</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
              className="mt-1 w-full min-h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="block text-sm">
            <span className="text-foreground font-medium">WhatsApp</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              inputMode="tel"
              maxLength={40}
              placeholder="41 99999-9999"
              autoComplete="tel"
              className="mt-1 w-full min-h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="block text-sm">
            <span className="text-foreground font-medium">Cidade</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              autoComplete="address-level2"
              className="mt-1 w-full min-h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          {/* Honeypot — invisível para pessoas, preenchido por bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label>
              Empresa
              <input value={company} onChange={(e) => setCompany(e.target.value)} tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "sending"}
            data-testid="portfolio-host-lead-submit"
            className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg outline-none transition hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-60"
          >
            {status === "sending" ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null}
            {status === "sending" ? "Enviando…" : "Falar com a 0WEB"}
          </button>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Ao enviar, você autoriza o contato da 0WEB por WhatsApp sobre este assunto.
          </p>
        </form>
      </div>
    </div>
  );
}
