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
    links: [{ rel: "canonical", href: "https://0web.com.br/portfolio-preview/leticia-reiche" }],
    meta: [
      { title: "Letícia Reiche | Conceito não oficial — prévia 0WEB" },
      { name: "description", content: "Conceito visual 0WEB baseado em briefing não confirmado. Não é site oficial. Prévia restrita, sem formulário, contato, agenda ou coleta de dados." },
      { name: "robots", content: "noindex,nofollow,noarchive,noimageindex" },
      { property: "og:title", content: "Letícia Reiche — conceito visual não oficial | 0WEB" },
      { property: "og:description", content: "Demonstração restrita da 0WEB; identidade e informações aguardam aprovação da profissional." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://0web.com.br/portfolio-preview/leticia-reiche" },
      { property: "og:image", content: "https://0web.com.br/images/leticia-reiche/social-og.svg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeticiaReichePreviewPage,
});
