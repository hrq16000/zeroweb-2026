// Página pública /solucoes — lista serviços marcados como "solução" (via
// flag manual is_solution OU fallback automático quando preço é vazio/0).
// 100% gerenciada pelo painel administrativo: mesma tela de "Serviços", basta
// marcar/desmarcar a flag em Visibilidade → Tipo no catálogo.
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ServiceCTA } from "@/components/site/ServiceCTA";
import { ServiceImageFallback } from "@/components/site/ServiceImageFallback";
import { absUrl, ORIGIN, breadcrumbLd, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Sparkles, ArrowRight } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";

export const Route = createFileRoute("/solucoes")({
  loader: async () => {
    const { listServicesPublic } = await import("@/lib/services-public.functions");
    const { services: all } = await listServicesPublic();
    // Fallback consistente: se a query falhar, listServicesPublic já cai
    // para o catálogo do arquivo (todos sem preço → todos viram soluções).
    const solutions = all.filter((s) => s.isSolution);
    return { solutions };
  },
  head: ({ loaderData }) => {
    const url = absUrl("/solucoes");
    const title = "Soluções Web, SEO, IA e Marketing Digital | 0WEB";
    const desc =
      "Soluções web para empresas que precisam estruturar presença digital, sites, landing pages, SEO, tráfego, automação e IA com escopo coerente e próxima ação clara.";
    const items = loaderData?.solutions ?? [];
    const itemList = {
      "@type": "ItemList",
      "@id": `${url}#solutions`,
      name: "Soluções 0WEB",
      numberOfItems: items.length,
      itemListElement: items.map((s, i) => {
        const sUrl = absUrl(`/servicos/${s.slug}`);
        return {
          "@type": "ListItem",
          position: i + 1,
          url: sUrl,
          item: {
            "@type": "Service",
            "@id": `${sUrl}#solution`,
            name: s.name,
            serviceType: s.serviceType,
            description: s.description,
            category: s.category,
            url: sUrl,
            areaServed: { "@type": "Country", name: "Brasil" },
            provider: { "@id": `${ORIGIN}/#org` },
          },
        };
      }),
    };
    const graph = [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: title,
        description: desc,
        inLanguage: "pt-BR",
        isPartOf: { "@type": "WebSite", "@id": `${ORIGIN}/#website` },
        publisher: { "@id": `${ORIGIN}/#org` },
        mainEntity: { "@id": `${url}#solutions` },
      },
      breadcrumbLd([{ name: "Soluções", path: "/solucoes" }]),
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Qual solução web faz sentido para minha empresa?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Depende do objetivo. Site institucional organiza presença e autoridade; landing page trabalha uma oferta específica; SEO melhora descoberta orgânica; tráfego pago acelera aquisição; automação e IA reduzem tarefas repetitivas e conectam processos.",
            },
          },
          {
            "@type": "Question",
            name: "Preciso contratar tudo ao mesmo tempo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não. A melhor sequência depende do estágio do negócio, da oferta, dos canais já existentes e do que hoje impede descoberta, conversão ou atendimento.",
            },
          },
          {
            "@type": "Question",
            name: "Soluções sob medida substituem os serviços da loja?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não. A loja reúne serviços com escopo mais definido. A página de soluções ajuda quando o problema exige combinar etapas, integrações ou uma arquitetura específica.",
            },
          },
        ],
      },
      itemList,
    ];
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: "soluções digitais, consultoria, projeto sob medida, SEO, IA, sistemas, marketing, 0WEB" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "0WEB" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
        { name: "robots", content: "index, follow, max-image-preview:large" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
        },
      ],
    };
  },
  component: SolucoesPage,
});

function SolucoesPage() {
  const { solutions } = Route.useLoaderData();
  type Sol = (typeof solutions)[number];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs items={[{ name: "Soluções", path: "/solucoes" }]} />
      <main className="pt-6">
        <section className="px-5 py-12 sm:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Soluções consultivas
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
              Projetos sob medida para problemas reais
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Soluções web não começam pela ferramenta. Começam pelo problema: ser encontrado, explicar melhor a oferta,
              transformar tráfego em contato, organizar atendimento ou conectar tarefas repetitivas. A 0WEB combina
              estratégia, tecnologia e execução conforme a necessidade real do projeto.
            </p>
          </div>
        </section>

        <section className="px-5 pb-16 sm:pb-20" aria-labelledby="solucoes-decisao-title">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Como escolher</p>
              <h2 id="solucoes-decisao-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Qual solução web faz sentido para o seu momento?
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                O mesmo negócio pode precisar de caminhos diferentes em momentos diferentes. O ponto de partida é identificar
                o gargalo atual e escolher a menor estrutura capaz de resolvê-lo com clareza.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold">Preciso de uma base digital própria</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Um site institucional organiza proposta, serviços, prova, contato e conteúdo em um endereço próprio, sem depender de uma rede social específica.
                </p>
                <Link to="/servicos/criacao-de-sites" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Criação de sites <ArrowRight className="h-4 w-4" />
                </Link>
              </article>

              <article className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold">Tenho uma oferta ou campanha específica</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Landing pages fazem mais sentido quando existe uma única oferta, intenção de busca ou campanha que precisa de mensagem e CTA próprios.
                </p>
                <Link to="/servicos/landing-pages" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Landing pages <ArrowRight className="h-4 w-4" />
                </Link>
              </article>

              <article className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold">Meu site existe, mas quase não é encontrado</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  SEO exige arquitetura, conteúdo, sinais técnicos e páginas que respondam a buscas reais. Criar URLs em volume sem conteúdo próprio não resolve esse gargalo.
                </p>
                <Link to="/servicos/seo" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  SEO <ArrowRight className="h-4 w-4" />
                </Link>
              </article>

              <article className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold">Preciso gerar demanda mais rápido</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Tráfego pago pode acelerar aquisição quando anúncio, página, oferta e mensuração estão alinhados. O anúncio não corrige uma página confusa.
                </p>
                <Link to="/servicos/trafego-pago" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Tráfego pago <ArrowRight className="h-4 w-4" />
                </Link>
              </article>

              <article className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold">Meu problema é presença local</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Dados consistentes, perfil da empresa, páginas locais apenas onde existe evidência e um site que explique a operação ajudam mecanismos de busca a entender o negócio.
                </p>
                <Link to="/servicos/google-meu-negocio" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Presença local <ArrowRight className="h-4 w-4" />
                </Link>
              </article>

              <article className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold">Estou repetindo tarefas e perdendo contexto</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Automação e IA podem conectar formulários, atendimento e rotinas internas quando existe um processo claro para automatizar.
                </p>
                <Link to="/servicos/automacao-com-ia" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Automação com IA <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </div>

            <div className="mt-10 grid gap-6 rounded-3xl border border-border bg-muted/30 p-6 sm:p-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold">Serviço de catálogo ou solução sob medida?</h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  A loja de serviços é adequada quando o escopo já está claro. Uma solução consultiva entra quando o problema exige
                  combinar etapas, integrar ferramentas, validar prioridades ou desenhar uma sequência antes de contratar execução.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold">O que a 0WEB não promete</h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Não existe garantia responsável de primeira posição, volume fixo de leads ou conversão antes de medir oferta,
                  concorrência, canal e comportamento do público. A proposta é construir uma base verificável e evoluir com dados reais.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-3 sm:px-5 pb-20">
          <div className="mx-auto max-w-6xl">
            {solutions.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                <p>Nenhuma solução publicada no momento.</p>
                <Link to="/servicos" className="mt-3 inline-block text-primary font-semibold">
                  Ver catálogo de serviços →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {solutions.map((s: Sol, i: number) => (
                  <motion.article
                    key={s.slug}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: (i % 6) * 0.04 }}
                    className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary hover:shadow-elegant transition-all"
                  >
                    <Link
                      to="/servicos/$slug"
                      params={{ slug: s.slug }}
                      className="block aspect-[4/3] overflow-hidden bg-muted"
                    >
                      {s.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.imageUrl}
                          alt={s.imageAlt ?? s.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ServiceImageFallback slug={s.slug} name={s.name} category={s.category} />
                      )}
                    </Link>
                    <div className="p-3 sm:p-4">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.category}
                      </span>
                      <h2 className="mt-1 text-sm sm:text-base font-bold leading-tight line-clamp-2">
                        <Link to="/servicos/$slug" params={{ slug: s.slug }} className="hover:text-primary">
                          {s.name}
                        </Link>
                      </h2>
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {s.description}
                      </p>
                      <div className="mt-3">
                        <ServiceCTA
                          serviceSlug={s.slug}
                          funnels={s.funnels}
                          location="card"
                          label="Falar com especialista"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2 transition-all"
                          showArrow
                        />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-5 pb-20" aria-labelledby="solucoes-faq-title">
          <div className="mx-auto max-w-4xl">
            <h2 id="solucoes-faq-title" className="text-3xl font-bold">Perguntas frequentes sobre soluções web</h2>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              <details className="p-5">
                <summary className="cursor-pointer font-semibold">Qual solução web faz sentido para minha empresa?</summary>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Depende do objetivo atual. Site institucional organiza presença; landing page trabalha uma oferta; SEO melhora descoberta;
                  tráfego pago acelera aquisição; automação e IA conectam processos repetitivos.
                </p>
              </details>
              <details className="p-5">
                <summary className="cursor-pointer font-semibold">Preciso contratar tudo ao mesmo tempo?</summary>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Não. A sequência deve partir do principal gargalo do negócio. Muitas vezes uma única etapa bem resolvida cria base para a próxima.
                </p>
              </details>
              <details className="p-5">
                <summary className="cursor-pointer font-semibold">Soluções sob medida substituem os serviços da loja?</summary>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Não. A loja atende escopos mais definidos. A solução consultiva é mais adequada quando ainda é necessário combinar disciplinas
                  ou desenhar a arquitetura do projeto.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="px-5 pb-24">
          <div className="mx-auto max-w-3xl text-center rounded-3xl border border-border bg-card p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Não achou sua solução?</h2>
            <p className="mt-2 text-muted-foreground">
              Cada negócio é único. Conte seu desafio e desenhamos uma proposta dedicada.
            </p>
            <FunnelCTAButton
              intent={{ purpose: "diagnosis", source: "solucoes_footer_cta", pagePath: "/solucoes", placement: "footer" }}
              label="Falar com a 0WEB"
              location="solucoes_footer_cta"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary hover:opacity-95 transition-opacity"
            />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
