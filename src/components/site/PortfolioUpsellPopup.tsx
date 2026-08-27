import { useCallback, useEffect, useRef, useState } from "react";
import { X, Sparkles, CalendarClock, Share2 } from "lucide-react";
import { FunnelModalWrapper } from "@/components/funnel/FunnelModalWrapper";
import { subscribeScroll } from "@/lib/scroll-bus";
import { trackEvent, trackConversion } from "@/lib/analytics";
import { shouldSuppressPortfolioHostOverlays } from "@/lib/portfolio-preview";

const STORAGE_KEY = "0web:portfolio-upsell-shown:v2";

type Trigger = "timer" | "scroll" | "fallback";

/** Guard de instância única por página (rota + componente do cliente). */
let mountedInstances = 0;


/**
 * Pop-up de captação exibido nas páginas de portfólio.
 * Regras de UX:
 *  - dispara UMA única vez por sessão (10s de leitura, 90% de scroll ou
 *    fallback de 25s quando a página não é rolável);
 *  - o container é pointer-events-none: só o card captura cliques, o conteúdo
 *    da página continua clicável no mobile;
 *  - acessível: role="dialog" + aria-modal, focus trap, ESC e restauração de foco.
 */
export function PortfolioUpsellPopup({ pageName = "portfolio" }: { pageName?: string }) {
  const [visible, setVisible] = useState(false);
  const [funnelOpen, setFunnelOpen] = useState(false);
  const firedRef = useRef(false);
  const ownerRef = useRef(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<Trigger>("timer");
  const storageKey = `${STORAGE_KEY}:${pageName}`;

  const routePath = typeof window === "undefined" ? "/portfolio" : window.location.pathname;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (shouldSuppressPortfolioHostOverlays()) return;
    // Instância única: a rota /portfolio/* renderiza o pop-up por padrão e o
    // site do cliente pode renderizá-lo também; só o primeiro assume.
    if (mountedInstances > 0 && !ownerRef.current) return;
    mountedInstances += 1;
    ownerRef.current = true;

    try {
      if (sessionStorage.getItem(storageKey) === "1") return;
    } catch {
      /* noop */
    }

    const fire = (trigger: Trigger) => {
      if (firedRef.current) return;
      firedRef.current = true;
      triggerRef.current = trigger;
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* noop */
      }
      lastFocusRef.current = (document.activeElement as HTMLElement) ?? null;
      setVisible(true);
      trackEvent("popup_view", {
        label: "portfolio_upsell",
        location: pageName,
        route: routePath,
        trigger,
        event_category: "engagement",
      });
    };

    const t = window.setTimeout(() => fire("timer"), 10000);
    // Fallback: páginas curtas (sem scroll possível) ou leitura longa sem rolar.
    const fb = window.setTimeout(() => fire("fallback"), 25000);
    const unsub = subscribeScroll((s) => {
      if (s.pct >= 0.9) fire("scroll");
    });

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(fb);
      unsub();
    };
  }, [pageName, routePath, storageKey]);

  const close = useCallback(
    (reason: "dismiss" | "cta") => {
      setVisible(false);
      if (reason === "dismiss") {
        trackEvent("popup_dismiss", {
          label: "portfolio_upsell",
          location: pageName,
          route: routePath,
          trigger: triggerRef.current,
          event_category: "engagement",
        });
        lastFocusRef.current?.focus?.();
      }
    },
    [pageName, routePath],
  );

  // Acessibilidade: ESC + focus trap enquanto o card está visível.
  useEffect(() => {
    if (!visible) return;
    const node = cardRef.current;
    const focusables = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute("disabled"));

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close("dismiss");
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !node?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [visible, close]);

  // Mede conversão do quiz/funil aberto a partir deste pop-up.
  useEffect(() => {
    if (!funnelOpen || typeof window === "undefined") return;
    const dl = (window.dataLayer = window.dataLayer ?? []);
    const original = dl.push.bind(dl);
    dl.push = ((...args: unknown[]) => {
      for (const a of args) {
        const ev = (a as { event?: string })?.event;
        if (ev === "funnel_complete") {
          trackConversion("popup_funnel_conversion", {
            label: "portfolio_upsell",
            location: pageName,
            route: routePath,
            trigger: triggerRef.current,
          });
        }
      }
      return original(...(args as never[]));
    }) as typeof dl.push;
    return () => {
      dl.push = original;
    };
  }, [funnelOpen, pageName, routePath]);

  const funnelModal = (
    <FunnelModalWrapper
      open={funnelOpen}
      onClose={() => setFunnelOpen(false)}
      funnelSlug="diagnostico-0web"
      intent={{
        purpose: "diagnosis",
        source: `portfolio_upsell_${pageName}`,
        pagePath: routePath,
        placement: "section",
      }}
      context={{ popup: "portfolio_upsell", popup_route: routePath, popup_trigger: triggerRef.current }}
    />
  );

  if (!visible) return funnelModal;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5 pointer-events-none">
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-upsell-title"
          aria-describedby="portfolio-upsell-desc"
          className="pointer-events-auto relative mx-auto w-full max-w-xl rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-4 sm:p-5 animate-in slide-in-from-bottom-6 fade-in duration-300"
        >
          <button
            type="button"
            onClick={() => close("dismiss")}
            aria-label="Fechar aviso"
            className="absolute right-3 top-3 grid place-items-center w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-muted text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="pr-12">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Gostou desta página?
            </p>
            <h2 id="portfolio-upsell-title" className="mt-1.5 text-lg sm:text-xl font-bold leading-snug text-foreground">
              Tenha seu site profissional com a 0WEB — esta página pode ser a sua também,
              com domínio <span className="text-primary">.com.br</span> próprio.
            </h2>
            <p id="portfolio-upsell-desc" className="mt-2 text-sm text-muted-foreground">
              Responda a 4 perguntas rápidas e receba um plano sob medida para o seu negócio,
              com prazo e valor na hora.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CalendarClock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                Site no ar primeiro: você tem <strong className="text-foreground">até 90 dias para começar a pagar</strong>.
              </li>
              <li className="flex gap-2">
                <Share2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                Redes sociais cuidadas por nós: artes e postagens a partir de{" "}
                <strong className="text-foreground">4 publicações por mês</strong>.
              </li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  trackEvent("cta_click", {
                    label: "portfolio_upsell",
                    location: pageName,
                    route: routePath,
                    trigger: triggerRef.current,
                    event_category: "engagement",
                  });
                  close("cta");
                  setFunnelOpen(true);
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring outline-none active:scale-95 transition"
              >
                Quero meu site — ver condições
              </button>
              <button
                type="button"
                onClick={() => close("dismiss")}
                className="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none transition"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      </div>

      {funnelModal}
    </>
  );
}
