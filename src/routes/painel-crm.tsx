import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/painel-crm")({
  head: () => ({
    meta: [
      { title: "CRM · Pipeline comercial · 0WEB" },
      { name: "description", content: "Consulta administrativa de leads, etapas comerciais e histórico de interações da 0WEB." },
      { property: "og:title", content: "CRM · Pipeline comercial · 0WEB" },
      { property: "og:description", content: "Leads, responsáveis e interações comerciais no CRM protegido da 0WEB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: lazyRouteComponent(() => import("@/components/route-pages/CrmGatedPage"), "CrmGatedPage"),
  ssr: false,
});
