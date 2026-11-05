import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AgropetFiltPreviewPage } from "@/components/site/AgropetFiltPreviewPage";

/**
 * Preview-only route.
 * No public production page, catalog entry, canonical, sitemap or conversion endpoint.
 * Cannot be promoted before owner permission, data validation and lifecycle gates.
 */
const isPreviewEnvironment = createServerFn({ method: "GET" }).handler(async () =>
  Boolean(import.meta.env.DEV || process.env.VERCEL_ENV === "preview")
);

export const Route = createFileRoute("/portfolio-preview/agropet-filt")({
  loader: async () => {
    if (!(await isPreviewEnvironment())) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Agropet Filt | Estudo de portfólio — prévia 0WEB" },
      { name: "description", content: "Conceito independente de presença digital para Agropet Filt em Pinhais. Prévia não oficial, sem canal de atendimento." },
      { name: "robots", content: "noindex,nofollow,noarchive,noimageindex" },
      { property: "og:title", content: "Agropet Filt — Prévia não oficial | 0WEB" },
      { property: "og:description", content: "Pesquisa e conceito de portfólio ainda não autorizado para publicação comercial." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AgropetFiltPreviewPage,
});
