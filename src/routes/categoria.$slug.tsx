import { createFileRoute, Link } from "@tanstack/react-router";
import { getCategoryBySlug } from "@/lib/marketplace.functions";
import { ORIGIN, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/categoria/$slug")({
  // SSR: a listagem sai pronta no HTML para o Google conseguir rastrear.
  loader: async ({ params }) => getCategoryBySlug({ data: { slug: params.slug } }),
  head: ({ params, loaderData }) => {
    const url = `${ORIGIN}/categoria/${params.slug}`;
    const category = loaderData?.category;
    const companies = loaderData?.companies ?? [];
    const providers = loaderData?.providers ?? [];
    const total = companies.length + providers.length;
    const name = category?.name ?? params.slug.replace(/-/g, " ");
    const indexable = Boolean(category) && total > 0;

    const title = indexable
      ? `${name}: ${total} profissionais e empresas | Marketplace 0WEB`
      : `${name} | Marketplace 0WEB`;
    const desc = category?.description
      ? `${category.description} ${total > 0 ? `${total} perfis ativos no marketplace 0WEB.` : ""}`.trim()
      : indexable
        ? `${total} empresas e profissionais de ${name} com cadastro ativo no marketplace 0WEB. Veja cidades atendidas e avaliações.`
        : `Categoria ${name} no marketplace 0WEB. Cadastre seu perfil e receba pedidos de serviço da sua região.`;

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "pt_BR" },
        { name: "robots", content: indexable ? "index, follow, max-image-preview:large" : "noindex, follow" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: indexable
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "CollectionPage",
                    "@id": `${url}#collection`,
                    url,
                    name: title,
                    description: desc,
                    inLanguage: "pt-BR",
                    isPartOf: { "@type": "WebSite", url: ORIGIN, name: "0WEB" },
                  },
                  {
                    "@type": "ItemList",
                    "@id": `${url}#itemlist`,
                    numberOfItems: total,
                    itemListElement: [
                      ...companies.map((c: any, i: number) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        name: c.trade_name,
                        url: `${ORIGIN}/empresa/${c.slug}`,
                      })),
                      ...providers.map((p: any, i: number) => ({
                        "@type": "ListItem",
                        position: companies.length + i + 1,
                        name: p.display_name,
                        url: `${ORIGIN}/profissional/${p.slug}`,
                      })),
                    ],
                  },
                  breadcrumbLd([
                    { name: "Marketplace", path: "/servicos/marketplace" },
                    { name: "Categorias", path: "/servicos/marketplace" },
                    { name, path: `/categoria/${params.slug}` },
                  ]),
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const data = Route.useLoaderData();

  if (!data.category) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-display">Categoria não encontrada</h1>
        <Link to="/servicos/marketplace" className="text-primary mt-4 inline-block">Voltar ao marketplace</Link>
      </div>
    );
  }

  const total = data.companies.length + data.providers.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <Link to="/servicos/marketplace" className="text-sm text-muted-foreground">← Marketplace</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-4">{data.category.name}</h1>
        {data.category.description && <p className="text-muted-foreground mt-2 max-w-2xl">{data.category.description}</p>}
        <p className="text-muted-foreground mt-2">
          {total > 0
            ? `${total} perfis com cadastro ativo nesta categoria.`
            : "Nenhum perfil ativo nesta categoria por enquanto."}
        </p>

        {data.companies.length > 0 && <h2 className="text-xl font-display mt-10 mb-4">Empresas</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.companies.map((c: any) => (
            <Link key={c.id} to="/empresa/$slug" params={{ slug: c.slug }} className="rounded-xl border border-border p-5 hover:border-primary">
              <div className="font-semibold">{c.trade_name} {c.verified && <span className="text-primary text-xs">✓</span>}</div>
              <div className="text-xs text-muted-foreground">{[c.city, c.state].filter(Boolean).join(", ")}</div>
            </Link>
          ))}
        </div>

        {data.providers.length > 0 && <h2 className="text-xl font-display mt-10 mb-4">Profissionais</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.providers.map((p: any) => (
            <Link key={p.id} to="/profissional/$slug" params={{ slug: p.slug }} className="rounded-xl border border-border p-5 hover:border-primary">
              <div className="font-semibold">{p.display_name} {p.verified && <span className="text-primary text-xs">✓</span>}</div>
              <div className="text-xs text-muted-foreground">{[p.city, p.state].filter(Boolean).join(", ")}</div>
            </Link>
          ))}
        </div>

        {total === 0 && (
          <p className="text-muted-foreground mt-8">
            Nenhum perfil cadastrado nesta categoria ainda.{" "}
            <Link to="/app/marketplace/provider" className="text-primary">Cadastre o seu</Link>.
          </p>
        )}

        <div className="mt-14 border-t border-border pt-8 flex flex-wrap gap-4 text-sm font-semibold">
          <Link to="/servicos/marketplace" className="text-primary hover:underline">Todas as categorias</Link>
          <Link to="/cidades" className="text-primary hover:underline">Buscar por cidade</Link>
          <Link to="/servicos" className="text-primary hover:underline">Serviços da 0WEB</Link>
        </div>
      </div>
    </div>
  );
}
