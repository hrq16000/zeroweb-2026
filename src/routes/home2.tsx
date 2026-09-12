/**
 * /home2 — protótipo editorial da home 0WEB (comparação visual).
 *
 * Fonte de verdade: branch `feat/home2-wcria-reference` no Git
 * (Home2Prototype.tsx + home2-wcria.css + home2-motion.ts, importados sem
 * reinterpretação). Rota isolada: não altera `/`, não entra no menu global
 * nem no sitemap e fica `noindex,nofollow` enquanto for protótipo.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Home2Prototype } from "@/components/site/Home2Prototype";

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
  component: Home2Prototype,
});
