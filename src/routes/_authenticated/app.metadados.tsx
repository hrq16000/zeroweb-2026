import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/metadados")({
  head: () => ({
    meta: [
      { title: "Metadados por cliente · 0WEB Painel" },
      { name: "description", content: "Título, descrição, palavras-chave e canonical por cliente do portfólio." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: lazyRouteComponent(() => import("@/components/route-pages/AppMetadataPage.tsx"), "MetadataPage"),
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {(error instanceof Error ? error.message : String(error))}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});
