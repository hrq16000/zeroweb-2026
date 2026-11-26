import { lazy, Suspense, useEffect, useState, type ReactNode, createContext, useContext, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getFunnelConfig, type FunnelConfig } from "@/lib/wa-funnel";
import { trackEvent } from "@/lib/analytics";
const FunnelModalWrapper = lazy(() => import("@/components/funnel/FunnelModalWrapper").then(({ FunnelModalWrapper }) => ({ default: FunnelModalWrapper })));
import type { ContactIntent } from "@/lib/contact-intent";

type Ctx = { open: (location: string) => void };
const FunnelCtx = createContext<Ctx>({ open: () => {} });

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
    void import("@/lib/persistence")
      .then(({ persistWaFunnelOpen }) => persistWaFunnelOpen(cfg.steps.length))
      .catch(() => {});
  }, [cfg.steps.length]);

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
        <Suspense fallback={null}>
          <FunnelModalWrapper
            open={isOpen && cfg.enabled}
            onClose={() => setOpen(false)}
            funnelSlug="diagnostico-0web"
            intent={intent}
          />
        </Suspense>
      ) : null}
    </FunnelCtx.Provider>
  );
}
