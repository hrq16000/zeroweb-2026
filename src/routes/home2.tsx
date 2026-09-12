/**
 * /home2 — protótipo editorial da home 0WEB (comparação visual).
 *
 * A base de conteúdo permanece em Home2Prototype. A camada
 * Home2PersonalityExperience acrescenta direção visual e microinterações sem
 * alterar `/`, menu global ou sitemap. A rota segue `noindex,nofollow` enquanto
 * estiver em comparação visual.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Home2PersonalityExperience } from "@/components/site/Home2PersonalityExperience";

const TITLE = "0WEB · Protótipo editorial da home (home2)";
const DESC =
  "Protótipo interno de composição visual da home da 0WEB: criação de sites, presença digital e projetos publicados de clientes reais.";

export const Route = createFileRoute("/home2")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      // Protótipo: nunca indexar enquanto estiver em comparação visual.
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home2PersonalityExperience,
});
