import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import { normalizePath, shouldEmitPageView } from "@/lib/telemetry-v2";

/**
 * Evento canônico `page_view` (MEASUREMENT_TRUTH V2).
 *
 * Cobre carregamento inicial e navegação SPA; uma navegação real produz
 * exatamente um evento. Re-render, hidratação e StrictMode repetem a mesma
 * chave de transição e não geram evento adicional. O path é normalizado, então
 * `?foo=1` e `?foo=2` continuam sendo a mesma página.
 */
export function TelemetryPageView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastPath = useRef<string | null>(null);
  const transition = useRef(0);

  useEffect(() => {
    const path = normalizePath(pathname);
    if (lastPath.current === path) return;
    lastPath.current = path;
    transition.current += 1;
    if (!shouldEmitPageView(path, transition.current)) return;

    const slug = /^\/portfolio\/([^/]+)$/.exec(path)?.[1];
    const service = /^\/servicos\/([^/]+)$/.exec(path)?.[1];
    trackEvent("page_view", {
      path,
      ...(slug ? { portfolio_slug: slug } : {}),
      ...(service ? { service_slug: service } : {}),
      event_category: "navigation",
    });
  }, [pathname]);

  return null;
}
