import { createFileRoute, notFound } from "@tanstack/react-router";
import { PrototypeSite, VERTICALS } from "./sites.$vertical";
import { absUrl } from "@/lib/seo";

const PORTFOLIO_SITES = {
  "clinica-integrada": "clinicas",
  "almeida-torres": "advocacia",
  "casa-nativa": "restaurantes",
} as const;

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const verticalSlug = PORTFOLIO_SITES[params.slug as keyof typeof PORTFOLIO_SITES];
    const vertical = verticalSlug ? VERTICALS[verticalSlug] : undefined;
    if (!vertical) throw notFound();
    return { vertical, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.vertical?.name ?? "Demonstração de site";
    const description = loaderData?.vertical?.subheadline ?? "Demonstração de site criado pela 0WEB.";
    const url = absUrl(`/portfolio/${loaderData?.slug ?? ""}`);
    return {
      meta: [
        { title: `${title} · Portfólio 0WEB` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} · Portfólio 0WEB` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PortfolioPrototypePage,
});

function PortfolioPrototypePage() {
  const { vertical } = Route.useLoaderData();
  return <PrototypeSite vertical={vertical} />;
}
