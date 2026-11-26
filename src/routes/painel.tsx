import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel · Funil de conversão · 0WEB" },
      { name: "description", content: "Acompanhe métricas de funil: CTA → WhatsApp → Formulário → Scroll." },
      { property: "og:title", content: "Painel · Funil de conversão · 0WEB" },
      { property: "og:description", content: "Consulta administrativa dos indicadores de conversão e auditorias Lighthouse da 0WEB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    
  }),
  component: lazyRouteComponent(() => import("@/components/route-pages/PainelGated"), "PainelGated"),
  ssr: false,
});
