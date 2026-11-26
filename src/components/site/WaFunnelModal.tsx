import { Component, lazy, Suspense, useEffect, useState, type ReactNode, createContext, useContext, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getFunnelConfig, type FunnelConfig } from "@/lib/wa-funnel";
import { trackEvent } from "@/lib/analytics";
import { getActiveUtms } from "@/lib/site-config";
const FunnelModalWrapper = lazy(() =>
  import("@/components/funnel/FunnelModalWrapper").then(({ FunnelModalWrapper }) => ({ default: FunnelModalWrapper })),
);
import type { ContactIntent } from "@/lib/contact-intent";

type Ctx = { open: (location: string) => void };
const FunnelCtx = createContext<Ctx>({ open: () => {} });

class FunnelChunkBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div
          role="alert"
          className="fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-md rounded-2xl border border-border bg-background p-4 shadow-xl"
        >
          <p className="text-sm text-foreground">
            Não foi possível carregar o formulário. O restante do site continua disponível.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Recarregar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function useWaFunnel() {
  return useContext(FunnelCtx);
}

export function WaFunnelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [location, setLocation] = useState("unknown");
  const [cfg, setCfg] = useState<FunnelConfig>(() => getFunnelConfig());
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const sync = () => setCfg(getFunnelConfig());
    window.addEventListener("0web:wa_funnel", sync);
    return () => window.removeEventListener("0web:wa_funnel", sync);
  }, []);

  const open = useCallback((loc: string) => {
    setLocation(loc);
    setHasOpened(true);
    setOpen(true);
    trackEvent("wa_funnel_open", { location: loc });
    const context = {
      path: typeof window !== "undefined" ? window.location.pathname || "/" : pathname || "/",
      utms: typeof window !== "undefined" ? getActiveUtms() : {},
    };
    void import("@/lib/persistence")
      .then(({ persistWaFunnelOpen }) => persistWaFunnelOpen(cfg.steps.length, context))
      .catch(() => {});
  }, [cfg.steps.length, pathname]);

  const intent: ContactIntent = {
    purpose: location.includes("partner") ? "partnership" : "diagnosis",
    source: location,
    pagePath: pathname || "/",
    placement: location.includes("footer") ? "footer" : location.includes("hero") ? "hero" : location.includes("floating") ? "sticky-mobile" : "section",
  };

  return (
    <FunnelCtx.Provider value={{ open }}>
      {children}
      {hasOpened ? (
        <FunnelChunkBoundary>
          <Suspense fallback={null}>
            <FunnelModalWrapper
              open={isOpen && cfg.enabled}
              onClose={() => setOpen(false)}
              funnelSlug="diagnostico-0web"
              intent={intent}
            />
          </Suspense>
        </FunnelChunkBoundary>
      ) : null}
    </FunnelCtx.Provider>
  );
}
