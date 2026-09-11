import { createFileRoute } from "@tanstack/react-router";
import { MotionPilotPage } from "@/components/site/MotionPilotPage";

const TITLE = "LAB · Piloto de motion (amostra interna)";
const DESC =
  "Página interna de validação do pipeline de motion do Portfolio Blueprint. Conteúdo fictício, sem cliente e sem dados reais.";

export const Route = createFileRoute("/lab/motion-pilot")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MotionPilotPage,
});
