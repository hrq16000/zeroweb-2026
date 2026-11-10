import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ToopAssadosPreviewPage } from "@/components/site/ToopAssadosPreviewPage";

// A demonstração não possui catálogo, sitemap, canonical público nem contato operacional.
// Vercel Preview e desenvolvimento apenas; qualquer ambiente de produção retorna 404.
const previewEnabled = createServerFn({ method: "GET" }).handler(async () =>
  Boolean(import.meta.env.DEV || process.env.VERCEL_ENV === "preview")
);

export const Route = createFileRoute("/portfolio-preview/toop-assados")({
  loader: async () => {
    if (!(await previewEnabled())) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Toop Assados | Conceito demonstrativo de portfólio 0WEB" },
      {
        name: "description",
        content: "Conceito não oficial para uma página de assados no Xaxim, Curitiba. Sem encomendas ou preços confirmados.",
      },
      { name: "robots", content: "noindex,nofollow,noarchive,noimageindex" },
      { property: "og:title", content: "Toop Assados — Estudo não oficial 0WEB" },
      { property: "og:description", content: "Prévia sem operação comercial ou vínculo confirmado com o restaurante." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ToopAssadosPreviewPage,
});
