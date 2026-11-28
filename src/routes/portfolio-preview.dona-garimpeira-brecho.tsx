import { createFileRoute, notFound } from "@tanstack/react-router";
import { DonaGarimpeiraBrechoPage } from "@/components/site/DonaGarimpeiraBrechoPage";

const isPreviewEnvironment = () =>
  import.meta.env.DEV ||
  (typeof process !== "undefined" && process.env.VERCEL_ENV === "preview");

export const Route = createFileRoute("/portfolio-preview/dona-garimpeira-brecho")({
  loader: async () => {
    if (!isPreviewEnvironment()) throw notFound();
    return null;
  },
  head: () => ({
    links: [{ rel: "canonical", href: "https://0web.com.br/portfolio-preview/dona-garimpeira-brecho" }],
    meta: [
      { title: "Dona Garimpeira | Conceito não oficial — prévia 0WEB" },
      { name: "description", content: "Demonstração conceitual 0WEB, não é site oficial. Identidade e informações aguardam aprovação. Sem formulário, contato, endereço ou indexação." },
      { name: "robots", content: "noindex,nofollow,noarchive,noimageindex" },
      { property: "og:title", content: "Dona Garimpeira | Conceito não oficial — prévia 0WEB" },
      { property: "og:description", content: "Demonstração restrita 0WEB. Nenhum formulário ou contato está ativo." },
      { property: "og:url", content: "https://0web.com.br/portfolio-preview/dona-garimpeira-brecho" },
    ],
  }),
  component: DonaGarimpeiraBrechoPage,
});
