import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { LeticiaReichePreviewPage } from "@/components/site/LeticiaReichePreviewPage";

/**
 * R2 — prévia visual de Letícia Reiche.
 * Acessível somente em desenvolvimento ou Vercel Preview.
 * A página de produção (/portfolio/leticia-reiche) será criada após
 * funil individual testado, verificação de identidade e readiness.
 */
const isPreviewEnvironment = createServerFn({ method: "GET" }).handler(async () =>
  Boolean(import.meta.env.DEV || process.env.VERCEL_ENV === "preview")
);

export const Route = createFileRoute("/portfolio-preview/leticia-reiche")({
  loader: async () => {
    if (!(await isPreviewEnvironment())) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Letícia Reiche | Prévia de portfólio — 0WEB" },
      { name: "description", content: "Estudo visual para Letícia Reiche — Manicure e Pedicure em Belford Roxo, RJ. Prévia editorial, sem agenda ativa ou contato comercial." },
      { name: "robots", content: "noindex,nofollow,noarchive,noimageindex" },
      { property: "og:title", content: "Letícia Reiche — estudo de identidade e portfólio | 0WEB" },
      { property: "og:description", content: "Conceito de portfólio ainda não publicado comercialmente, sem agendamento online." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://0web.com.br/images/leticia-reiche/social-og.svg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeticiaReichePreviewPage,
});
