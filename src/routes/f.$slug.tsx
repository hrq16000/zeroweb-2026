import { createFileRoute, notFound } from "@tanstack/react-router";
import { FunnelRunner } from "@/components/funnel/FunnelRunner";
import { getPublicFunnel } from "@/lib/dynamic-funnel.functions";
import { isPortfolioClientKey } from "@/lib/portfolio-client-keys";

/**
 * Um funil aberto em rota própria (`/f/funnel-<cliente>`) precisa continuar
 * pertencendo ao cliente. Sem isso o lead cai no canal institucional da 0WEB.
 * A chave só é aceita quando existe na allowlist de clientes do portfólio.
 */
function clientKeyFromFunnelSlug(slug: string): string | undefined {
  const candidate = slug.replace(/^funnel-/, "");
  return isPortfolioClientKey(candidate) ? candidate : undefined;
}


export const Route = createFileRoute("/f/$slug")({
  ssr: false,
  loader: async ({ params }) => {
    const funnel = await getPublicFunnel({ data: { slug: params.slug } });
    if (!funnel) throw notFound();
    return { funnel };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.funnel ? `${loaderData.funnel.name} — 0web` : "Funil — 0web" },
      { name: "description", content: loaderData?.funnel?.description ?? "Diagnóstico rápido com a 0web." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center text-center p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Funil não encontrado</h1>
        <p className="text-muted-foreground">Verifique o link ou volte para a página inicial.</p>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center text-center p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Algo deu errado</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  component: FunnelPage,
});

function FunnelPage() {
  const { funnel } = Route.useLoaderData();
  const { slug } = Route.useParams();
  return <FunnelRunner funnel={funnel} clientKey={clientKeyFromFunnelSlug(slug)} />;
}
