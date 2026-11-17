import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Gauge, Layers3, MousePointerClick, Search, Sparkles } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioCover } from "@/components/portfolio/PortfolioCover";
import portfolioCatalog from "@/config/portfolio-catalog.json";

type CatalogItem = {
  slug: string;
  clientKey?: string;
  title: string;
  status?: string;
  live?: boolean;
  image?: string;
  fallbackImage?: string;
};

const PROJECTS = (portfolioCatalog as CatalogItem[])
  .filter((item) => item.status === "published" && item.live !== false && Boolean(item.slug))
  .slice(0, 3);

const PILLARS = [
  {
    icon: Layers3,
    title: "Mensagem antes do layout",
    text: "A landing page começa pela oferta, público, objeções e próxima ação. A estrutura visual vem depois, para dar hierarquia ao que realmente precisa ser entendido.",
  },
  {
    icon: Search,
    title: "Descoberta com intenção",
    text: "SEO e mídia paga apontam para páginas que respondem a uma intenção específica. Evitamos misturar vários objetivos comerciais em uma única página genérica.",
  },
  {
    icon: Gauge,
    title: "Performance como requisito",
    text: "Imagens, componentes e efeitos precisam caber no orçamento de performance. Uma experiência bonita não deve bloquear leitura, navegação ou ação no celular.",
  },
  {
    icon: MousePointerClick,
    title: "Conversão com contexto",
    text: "O CTA precisa carregar o contexto da página e da oferta. Formulários e funis curtos ajudam o atendimento a receber uma solicitação mais qualificada.",
  },
] as const;

const FAQ = [
  {
    q: "Qual é a diferença entre uma landing page e a home institucional?",
    a: "A home apresenta a empresa de forma ampla. Uma landing page trabalha uma oferta, campanha ou intenção principal com caminho de decisão mais curto e conteúdo específico.",
  },
  {
    q: "A mesma landing page serve para SEO e anúncios?",
    a: "Pode servir quando a intenção é compatível. Em campanhas diferentes, muitas vezes vale separar mensagem, prova e CTA para manter coerência entre busca, anúncio e página.",
  },
  {
    q: "Toda landing page precisa ser curta?",
    a: "Não. O tamanho depende do que o visitante precisa entender antes de agir. Ofertas simples podem exigir pouco texto; decisões mais complexas pedem contexto, prova, critérios e perguntas frequentes.",
  },
  {
    q: "A 0WEB garante primeira posição no Google ou uma taxa de conversão específica?",
    a: "Não. Ranking e conversão dependem de concorrência, oferta, autoridade, mídia, experiência e comportamento real do público. O trabalho é estruturar uma página tecnicamente sólida e mensurável.",
  },
] as const;

export function Home3MixExperience() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-hero pt-page pb-16 lg:pb-24">
          <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
          <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
              <Sparkles className="h-4 w-4 text-primary" /> Landing pages · Sites autorais · Conversão
            </p>
            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Landing pages autorais para transformar tráfego em próxima ação
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
              A Home3 é a frente da 0WEB dedicada a páginas de campanha e aquisição. Cada projeto parte da intenção de busca,
              da oferta real e do caminho de atendimento para construir uma experiência própria — sem copiar a home institucional
              e sem depender de um template genérico.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <FunnelCTAButton
                intent={{ purpose: "proposal", source: "home3_lp_hero", pagePath: "/home3", placement: "hero", serviceSlug: "landing-pages" }}
                label="Solicitar proposta de landing page"
                location="home3_lp_hero"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow-primary"
              />
              <Link to="/servicos/landing-pages" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 font-semibold">
                Ver serviço de landing pages <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Arquitetura da página</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Quatro decisões antes de publicar</h2>
              <p className="mt-4 text-muted-foreground leading-7">
                Uma landing page não melhora por receber mais blocos. Ela melhora quando cada seção tem uma função clara:
                responder a intenção, reduzir dúvida, mostrar prova legítima e conduzir o visitante para uma ação compatível com a oferta.
              </p>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {PILLARS.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-2xl border border-border bg-card p-6">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/30 py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Campanha → página → atendimento</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A página precisa conversar com a origem do tráfego</h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Busca orgânica, Google Ads, redes sociais e indicação chegam com expectativas diferentes. Por isso a Home3 trabalha
                a coerência entre promessa, conteúdo e CTA. O objetivo é reduzir o salto entre o que trouxe a pessoa até a página e
                o que ela encontra ao abrir o site.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-6">
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> SEO: página focada em uma intenção real e conteúdo suficiente para responder a busca.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Ads: mensagem alinhada ao anúncio, sem esconder preço, escopo ou condição importante.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Atendimento: CTA leva contexto para o funil em vez de abrir uma conversa genérica.</li>
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/servicos/trafego-pago" className="text-sm font-semibold text-primary underline underline-offset-4">Tráfego pago</Link>
                <Link to="/servicos/seo" className="text-sm font-semibold text-primary underline underline-offset-4">SEO</Link>
                <Link to="/home2" className="text-sm font-semibold text-primary underline underline-offset-4">Operação digital integrada</Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {PROJECTS.map((project) => (
                <Link key={project.slug} to="/portfolio/$slug" params={{ slug: project.slug }} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <PortfolioCover
                    clientKey={project.clientKey}
                    slug={project.slug}
                    title={project.title}
                    image={project.image}
                    fallbackImage={project.fallbackImage}
                    className="aspect-[4/5] w-full object-cover"
                    width={480}
                    height={600}
                    sizes="(max-width: 640px) 100vw, 28vw"
                  />
                  <div className="p-4">
                    <p className="text-sm font-semibold">{project.title}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">Ver projeto <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Quando uma LP própria faz mais sentido</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-border p-6">
                <h3 className="font-bold">Uma oferta específica</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Quando um serviço, produto ou campanha precisa de uma mensagem e CTA próprios, separados do restante do site.</p>
              </article>
              <article className="rounded-2xl border border-border p-6">
                <h3 className="font-bold">Uma intenção de busca clara</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Quando existe uma consulta relevante que merece resposta completa, sem repetir conteúdo de outra página apenas para criar volume.</p>
              </article>
              <article className="rounded-2xl border border-border p-6">
                <h3 className="font-bold">Uma campanha mensurável</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Quando origem, formulário, CTA e conversão precisam ser medidos de forma isolada para orientar a próxima rodada.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Perguntas frequentes sobre landing pages</h2>
            <div className="mt-7 divide-y divide-border rounded-2xl border border-border bg-card">
              {FAQ.map((item) => (
                <details key={item.q} className="p-5">
                  <summary className="cursor-pointer font-semibold">{item.q}</summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground py-20 text-background">
          <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Uma página para uma intenção. Uma próxima ação clara.</h2>
            <p className="mt-4 text-background/70">
              Envie a oferta, origem do tráfego e objetivo da campanha. A proposta é montada a partir do contexto real, sem prometer ranking ou conversão antes de medir.
            </p>
            <FunnelCTAButton
              intent={{ purpose: "proposal", source: "home3_lp_final", pagePath: "/home3", placement: "footer", serviceSlug: "landing-pages" }}
              label="Descrever minha landing page"
              location="home3_lp_final"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-4 font-semibold text-primary-foreground"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
