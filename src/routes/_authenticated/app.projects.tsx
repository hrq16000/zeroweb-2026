import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/projects")({
  head: () => ({
    meta: [
      { title: "Projetos · 0WEB Painel" },
      { name: "description", content: "Projetos de clientes e landings do portfólio administradas pela 0WEB." },
      { property: "og:title", content: "Projetos · 0WEB Painel" },
      { property: "og:description", content: "Projetos de clientes e landings do portfólio administradas pela 0WEB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: lazyRouteComponent(() => import("@/components/route-pages/AppProjectsPage.tsx"), "ProjectsPage"),
});
