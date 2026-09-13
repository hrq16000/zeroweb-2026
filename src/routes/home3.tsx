/**
 * /home3 — laboratório aditivo da próxima direção institucional 0WEB.
 *
 * A Home2 permanece intacta. Home3 nasce visualmente igual ao baseline aprovado
 * e recebe somente evoluções próprias, sem compartilhar novas mudanças com
 * `/home2`.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Home3MixExperience } from "@/components/site/Home3MixExperience";

const TITLE = "0WEB · Laboratório visual Home3";
const DESC =
  "Laboratório interno da próxima evolução visual da 0WEB, preservando a Home2 enquanto novas camadas de direção de arte, conteúdo e motion são avaliadas.";

export const Route = createFileRoute("/home3")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home3MixExperience,
});
