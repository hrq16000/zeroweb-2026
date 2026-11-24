import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import faviconAsset from "../assets/favicon-0web.png.asset.json";
import { WaFunnelProvider } from "../components/site/WaFunnelModal";
import { AnalyticsBootstrap } from "../components/site/AnalyticsBootstrap";
import { TelemetryPageView } from "../components/site/TelemetryPageView";
import { RouteLoader } from "../components/site/RouteLoader";
import { CartDrawerGate } from "../components/site/CartDrawerGate";


import { Toaster } from "../components/ui/sonner";
import { HYDRATION_GUARD_SCRIPT } from "@/lib/hydration-guard";
import { FUNNEL_EARLY_CLICK_SCRIPT } from "@/lib/funnel-early-click";

// Heavy and route-exclusive UI stays out of the public entry chunk.
const NotFoundComponent = lazy(() =>
  import("../components/site/NotFoundPage").then(({ NotFoundPage }) => ({ default: NotFoundPage })),
);
const ErrorState = lazy(() =>
  import("../components/site/ErrorState").then(({ ErrorState }) => ({ default: ErrorState })),
);
const AuthErrorGuard = lazy(() =>
  import("../components/site/AuthErrorGuard").then(({ AuthErrorGuard }) => ({ default: AuthErrorGuard })),
);
const SpacingDebugOverlay = lazy(() =>
  import("../components/site/SpacingDebugOverlay").then(({ SpacingDebugOverlay }) => ({ default: SpacingDebugOverlay })),
);

// 404 chrome is not needed on successful routes; keep its modules out of the shared entry chunk.
const Header = lazy(() => import("../components/site/Header").then(({ Header }) => ({ default: Header })));
const Footer = lazy(() => import("../components/site/Footer").then(({ Footer }) => ({ default: Footer })));

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    void import("../lib/lovable-error-reporting")
      .then(({ reportLovableError }) => reportLovableError(error, { boundary: "tanstack_root_error_component" }))
      .catch(() => {});
  }, [error]);

  const isDev = import.meta.env.DEV;
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  const message = normalizedError.message;
  const looksLikeMissingRoute = /Failed to (load|fetch dynamically imported|resolve).*\/routes\//i.test(
    message,
  );

  const diagnostics = isDev ? (
    <>
      <p className="font-mono text-[11px] leading-relaxed text-foreground/80 break-words">
        {normalizedError.name}: {message}
      </p>
      {looksLikeMissingRoute ? (
        <p className="text-foreground/80">
          Parece que um arquivo de rota foi renomeado/removido. Limpe o cache do Vite e reinicie:
          <code className="mt-1 block rounded bg-background px-2 py-1 text-foreground">
            rm -rf node_modules/.vite .vite .output && bun run dev
          </code>
        </p>
      ) : null}
    </>
  ) : null;

  return (
    <Suspense fallback={<div role="status" className="min-h-screen grid place-items-center bg-background text-muted-foreground">Carregando a tela de erro…</div>}>
      <ErrorState
        kind="500"
        onRetry={() => {
          router.invalidate();
          reset();
        }}
        diagnostics={diagnostics}
      />
    </Suspense>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0066FF" },
      { title: "0WEB · Tecnologia que gera crescimento" },
      { name: "description", content: "Sites, sistemas, IA e marketing digital para empresas que querem crescer." },
      { property: "og:site_name", content: "0WEB" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      // Google Search Console — verificação de propriedade (0web.com.br)
      { name: "google-site-verification", content: "8T74s_DMPj2w764HA4c_vL7zVpKJU9GU6o2piGK0Fbc" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      { children: HYDRATION_GUARD_SCRIPT },
      { children: FUNNEL_EARLY_CLICK_SCRIPT },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://0web.com.br/#org",
              name: "0WEB",
              url: "https://0web.com.br",
              logo: "https://0web.com.br/favicon.ico",
              taxID: "41.723.708/0001-58",
              areaServed: { "@type": "Country", name: "Brasil" },
              sameAs: [
                "https://www.instagram.com/0web.com.br",
                "https://www.linkedin.com/company/0web",
              ],
            },
            {
              "@type": "WebSite",
              "@id": "https://0web.com.br/#website",
              url: "https://0web.com.br",
              name: "0WEB",
              inLanguage: "pt-BR",
              publisher: { "@id": "https://0web.com.br/#org" },
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://0web.com.br/portfolio?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://0web.com.br/servicos?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* GTM noscript fallback is injected client-side by AnalyticsBootstrap when a valid GTM ID is configured. */}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hash) return; // preserve in-page anchor scrolling
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;
    // Se estiver muito longe do topo, faz um salto instantâneo para evitar
    // animação longa e travada; caso contrário, sobe de forma suave.
    if (reduce || currentY > 2400) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const needsAuthGuard = pathname.startsWith("/app") || pathname.startsWith("/painel");
  const showSpacingDebug = new URLSearchParams(searchStr ?? "").get("debug") === "spacing";

  // A estimativa de localidade por IP passou a ser resolvida sob demanda
  // (no início do funil), evitando uma chamada de terceiros no carregamento
  // de todas as páginas — o serviço responde 429 com frequência e sujava o
  // console/Best Practices sem benefício algum na primeira renderização.



  return (
    <QueryClientProvider client={queryClient}>
      <WaFunnelProvider>
        <AnalyticsBootstrap />
        <TelemetryPageView />
        {needsAuthGuard ? <Suspense fallback={null}><AuthErrorGuard /></Suspense> : null}
        <ScrollToTop />
        <RouteLoader />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <CartDrawerGate />
        <Toaster position="top-center" richColors />
        {showSpacingDebug ? <Suspense fallback={null}><SpacingDebugOverlay /></Suspense> : null}
      </WaFunnelProvider>
    </QueryClientProvider>
  );
}
