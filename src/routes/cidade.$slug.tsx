import { createFileRoute, Link } from "@tanstack/react-router";
import { getCityCatalog } from "@/lib/marketplace.functions";
import { ORIGIN, breadcrumbLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

const titleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => (word.length <= 2 ? word : word[0].toUpperCase() + word.slice(1)))
    .join(" ");

export const Route = createFileRoute("/cidade/$slug")({
  // Carregado no servidor: o HTML já sai com os perfis da cidade,
  // condição para o Google conseguir rastrear e indexar a página.
  loader: async ({ params }) => getCityCatalog({ data: { slug: params.slug } }),
  head: ({ params, loaderData }) => {
    const url = `${ORIGIN}/cidade/${params.slug}`;
    const cityName = titleCase(loaderData?.city ?? params.slug.replace(/-/g, " "));
    const companies = loaderData?.companies ?? [];
    const providers = loaderData?.providers ?? [];
    const total = companies.length + providers.length;
    const empty = total === 0;

    const title = empty
      ? `Serviços em ${cityName} | Marketplace 0WEB`
      : `${total} profissionais e empresas em ${cityName} | Marketplace 0WEB`;
    const names = [...companies.map((c: any) => c.trade_name), ...providers.map((p: any) => p.display_name)]
      .filter(Boolean)
      .slice(0, 4)
      .join(", ");
    const description = empty
      ? `Marketplace 0WEB em ${cityName}: cadastre sua empresa ou encontre prestadores atendendo a região.`
      : `${total} perfis atendendo ${cityName}${names ? `, entre eles ${names}` : ""}. Veja categorias, regiões atendidas e avaliações no marketplace 0WEB.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "pt_BR" },
        {
          name: "robots",
          content: empty ? "noindex, follow" : "index, follow, max-image-preview:large",
        },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: empty
        ? []
        : [
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
                    description,
                    inLanguage: "pt-BR",
                    isPartOf: { "@type": "WebSite", url: ORIGIN, name: "0WEB" },
                    about: { "@type": "City", name: cityName },
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
                    { name: "Cidades", path: "/cidades" },
                    { name: cityName, path: `/cidade/${params.slug}` },
                  ]),
                ],
              }),
            },
          ],
    };
  },
  component: CityPage,
});

function CityPage() {
  const { slug } = Route.useParams();
  const data = Route.useLoaderData();
  const cityName = titleCase(data.city);
  const total = data.companies.length + data.providers.length;

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumbs
        items={[
          { name: "Marketplace", path: "/servicos/marketplace" },
          { name: "Cidades", path: "/cidades" },
          { name: cityName, path: `/cidade/${slug}` },
        ]}
      />
      <div className="max-w-6xl mx-auto px-5 py-10">
        <Link to="/servicos/marketplace" className="text-sm text-muted-foreground">← Marketplace</Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold mt-4">
          Profissionais e empresas em {cityName}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          {total > 0
            ? `${total} perfis com cadastro ativo atendendo ${cityName}. Cada perfil traz categorias, regiões atendidas e as avaliações já aprovadas.`
            : `Ainda não há perfis ativos cadastrados em ${cityName}. O marketplace 0WEB conecta quem busca um serviço a empresas e profissionais da própria região.`}
        </p>

        {data.companies.length > 0 && <h2 className="text-xl font-display mt-10 mb-4">Empresas</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.companies.map((c: any) => (
            <Link key={c.id} to="/empresa/$slug" params={{ slug: c.slug }} className="rounded-xl border border-border p-5 hover:border-primary">
              <div className="font-semibold">{c.trade_name}</div>
              <div className="text-xs text-muted-foreground">{[c.city, c.state].filter(Boolean).join(", ")}</div>
            </Link>
          ))}
        </div>

        {data.providers.length > 0 && <h2 className="text-xl font-display mt-10 mb-4">Profissionais</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.providers.map((p: any) => (
            <Link key={p.id} to="/profissional/$slug" params={{ slug: p.slug }} className="rounded-xl border border-border p-5 hover:border-primary">
              <div className="font-semibold">{p.display_name}</div>
              <div className="text-xs text-muted-foreground">{[p.city, p.state].filter(Boolean).join(", ")}</div>
            </Link>
          ))}
        </div>

        {total === 0 && (
          <p className="text-muted-foreground mt-8">
            Nenhum profissional cadastrado nesta cidade ainda.{" "}
            <Link to="/app/marketplace/provider" className="text-primary">Cadastre-se</Link> e seja o primeiro.
          </p>
        )}

        <section className="mt-14 border-t border-border pt-8">
          <h2 className="text-xl font-display">Como funciona o marketplace em {cityName}</h2>
          <ol className="mt-4 space-y-3 text-muted-foreground max-w-3xl">
            <li>1. Você descreve o serviço que precisa e a região dentro de {cityName}.</li>
            <li>2. O pedido é encaminhado para perfis ativos que atendem essa área.</li>
            <li>3. Você compara propostas, avaliações aprovadas e regiões atendidas antes de decidir.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
            <Link to="/cidades" className="text-primary hover:underline">Ver outras cidades</Link>
            <Link to="/servicos" className="text-primary hover:underline">Serviços da 0WEB</Link>
            <Link to="/portfolio" className="text-primary hover:underline">Sites publicados</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
