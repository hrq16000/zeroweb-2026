import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { VERTICAL_LIST } from "./sites.$vertical";
import { absUrl } from "@/lib/seo";

const TITLE = "Sites por Segmento: Estrutura e Conteúdo por Nicho | 0WEB";
const DESC =
  "Entenda como conteúdo, prova, contato e busca local mudam entre restaurantes, advocacia, clínicas, imobiliárias, oficinas, lojas e prestadores de serviços.";
const URL = absUrl("/sites");

export const Route = createFileRoute("/sites/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${URL}#collection`,
              url: URL,
              name: TITLE,
              description: DESC,
              inLanguage: "pt-BR",
              mainEntity: { "@id": `${URL}#segments` },
            },
            {
              "@type": "ItemList",
              "@id": `${URL}#segments`,
              numberOfItems: VERTICAL_LIST.length,
              itemListElement: VERTICAL_LIST.map((v, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: v.name,
                url: absUrl(`/sites/${v.slug}`),
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: absUrl("/") },
                { "@type": "ListItem", position: 2, name: "Sites por segmento", item: URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: SitesIndex,
});

function SitesIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="pt-page pb-12">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Sites por segmento</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold leading-tight">
              Site sob medida para o seu segmento
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
              Cada segmento exige informações, prova e caminho de contato diferentes. Escolha um nicho para ver uma estrutura
              pensada para a intenção real daquela atividade — sem assumir que o mesmo template ou a mesma estratégia de SEO serve para todos.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold">O que muda por segmento</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Restaurante precisa destacar cardápio, horário e reserva; escritório jurídico precisa organizar áreas de atuação e conteúdo informativo; oficina precisa tornar serviços, localização e contato operacionais fáceis de encontrar.
                </p>
              </article>
              <article className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold">O que não deve mudar</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Canonical própria, conteúdo factual, navegação clara, página rápida no celular e CTA coerente são requisitos comuns. O site não deve inventar endereço, ranking, estoque ou resultado para preencher uma seção.
                </p>
              </article>
              <article className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold">Quando criar outra página</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Uma nova página faz sentido quando existe intenção, serviço ou localidade realmente distintos e informação suficiente para responder aquela busca sem copiar outra rota.
                </p>
              </article>
            </div>

            <div className="mt-10 rounded-3xl border border-border bg-muted/20 p-6 sm:p-8">
              <h2 className="text-2xl font-bold">Segmento não é sinônimo de template</h2>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                As páginas abaixo funcionam como guias de decisão por nicho. Elas explicam o que precisa ser priorizado antes do projeto:
                oferta, conteúdo, prova, busca local, catálogo, agenda, atendimento ou integração. O layout final de um cliente deve partir
                da identidade e do material daquele negócio, não apenas da categoria em que ele se encaixa.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
                <Link to="/servicos/criacao-de-sites" className="text-primary underline underline-offset-4">Criação de sites</Link>
                <Link to="/servicos/landing-pages" className="text-primary underline underline-offset-4">Landing pages</Link>
                <Link to="/servicos/seo" className="text-primary underline underline-offset-4">SEO</Link>
                <Link to="/portfolio" className="text-primary underline underline-offset-4">Projetos publicados</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-5 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VERTICAL_LIST.map((v) => (
              <Link
                key={v.slug}
                to="/sites/$vertical"
                params={{ vertical: v.slug }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary hover:shadow-elegant transition"
              >
                <h2 className="text-lg font-bold">{v.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{v.subheadline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Ver soluções <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
