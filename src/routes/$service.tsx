import { createFileRoute, redirect } from "@tanstack/react-router";
import { Home2Prototype } from "@/components/site/Home2Prototype";

// Rota legada: /$service → /servicos/$slug (301 permanente).
// Exceção temporária e isolada: /home2 renderiza o protótipo editorial.
// Todos os demais slugs preservam exatamente o redirect legado.
export const Route = createFileRoute("/$service")({
  head: ({ params }) =>
    params.service === "home2"
      ? {
          meta: [
            { title: "Home2 · 0WEB — Protótipo editorial" },
            {
              name: "description",
              content:
                "Protótipo editorial da 0WEB para avaliação de uma nova experiência de página inicial.",
            },
            { name: "robots", content: "noindex, nofollow" },
            { name: "googlebot", content: "noindex, nofollow" },
          ],
          links: [{ rel: "canonical", href: "https://0web.com.br/home2" }],
        }
      : {},
  beforeLoad: ({ params }) => {
    if (params.service === "home2") return;

    throw redirect({
      to: "/servicos/$slug",
      params: { slug: params.service },
      statusCode: 301,
      replace: true,
    });
  },
  component: Home2Prototype,
});
