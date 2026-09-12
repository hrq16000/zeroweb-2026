import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Megaphone,
  Search,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioCover } from "@/components/portfolio/PortfolioCover";
import { Footer } from "@/components/site/Footer";
import logoAsset from "@/assets/logo-0web.png.asset.json";
import portfolioCatalog from "@/config/portfolio-catalog.json";

type CatalogItem = {
  slug: string;
  clientKey?: string;
  title: string;
  segment?: string;
  status?: string;
  live?: boolean;
  image?: string;
  fallbackImage?: string;
};

const publishedProjects = (portfolioCatalog as CatalogItem[]).filter(
  (item) => item.status === "published" && item.live !== false && Boolean(item.slug),
);

const featuredProjects = publishedProjects.slice(0, 6);

const solutions = [
  {
    eyebrow: "01 · Presença",
    title: "Sites e landing pages",
    description:
      "Páginas para explicar valor com clareza, carregar rápido e conduzir o visitante ao próximo passo.",
    to: "/servicos/site-express",
    icon: Code2,
    span: "lg:col-span-7 lg:row-span-2",
  },
  {
    eyebrow: "02 · Descoberta",
    title: "Google e presença local",
    description: "Estrutura para ser encontrado quando a procura já existe.",
    to: "/servicos/google-meu-negocio",
    icon: Search,
    span: "lg:col-span-5",
  },
  {
    eyebrow: "03 · Aquisição",
    title: "Tráfego e campanhas",
    description: "Campanhas conectadas à página certa, mensuração e conversão.",
    to: "/servicos/trafego-pago",
    icon: Megaphone,
    span: "lg:col-span-5",
  },
  {
    eyebrow: "04 · Conversão",
    title: "Funis e automações",
    description: "Menos atrito entre interesse, contato, diagnóstico, pedido ou agendamento.",
    to: "/servicos",
    icon: Workflow,
    span: "lg:col-span-5",
  },
  {
    eyebrow: "05 · Estratégia",
    title: "Do clique ao resultado",
    description:
      "Site, tráfego e automação deixam de ser ilhas e passam a funcionar como uma única jornada.",
    to: "/solucoes",
    icon: Target,
    span: "lg:col-span-7",
  },
] as const;

const editorialLinks = [
  ["Sites", "O que uma página precisa resolver antes de pensar em efeitos", "/blog/sites"],
  ["SEO", "Estrutura, conteúdo e descoberta trabalhando juntos", "/blog/seo"],
  ["Aquisição", "Quando tráfego pago precisa conversar com a landing page", "/blog/trafego-pago"],
] as const;

function Home2Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-24 max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          to="/$service"
          params={{ service: "home2" }}
          aria-label="0WEB Home2"
          className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <img src={logoAsset.url} alt="0WEB" width={920} height={250} className="h-10 w-auto sm:h-12" />
        </Link>
        <div className="flex items-center gap-4 sm:gap-7">
          <Link
            to="/portfolio"
            className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-primary sm:inline-flex"
          >
            Projetos
          </Link>
          <Link
            to="/servicos"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background/80 px-4 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur transition-colors hover:border-primary hover:text-primary sm:px-5"
          >
            Soluções <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Home2Prototype() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Home2Header />
      <MotionScope intensity="BALANCED">
        <main>
          <section className="relative isolate min-h-[92svh] overflow-hidden border-b border-border pt-32 sm:pt-36 lg:flex lg:min-h-screen lg:items-end lg:pt-40">
            <div className="pointer-events-none absolute -right-40 top-16 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto w-full max-w-[1480px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-16">
              <MotionReveal variant="mask" intensity="EXPRESSIVE">
                <p className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Do zero ao digital
                </p>
                <h1 className="max-w-[1280px] font-display text-[clamp(3.7rem,9.5vw,9.5rem)] font-bold leading-[0.86] tracking-[-0.07em]">
                  Presença digital <span className="block text-primary">com direção.</span>
                </h1>
              </MotionReveal>
              <div className="mt-10 grid gap-10 border-t border-border pt-7 lg:grid-cols-12 lg:items-end">
                <MotionReveal variant="left" intensity="BALANCED" className="lg:col-span-5">
                  <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                    Sites, campanhas, presença local e automações organizados em uma experiência que leva o cliente da descoberta até a ação.
                  </p>
                </MotionReveal>
                <MotionReveal variant="right" intensity="SUBTLE" className="lg:col-span-7 lg:flex lg:justify-end">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <FunnelCTAButton
                      intent={{ purpose: "commercial", source: "home2_hero", pagePath: "/home2", placement: "hero" }}
                      label="Quero colocar meu projeto no ar"
                      location="home2_hero"
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-6 py-3.5 font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transform-none"
                    />
                    <Link to="/portfolio" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 font-semibold transition-colors hover:border-primary hover:text-primary">
                      Ver projetos <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </MotionReveal>
              </div>
            </div>
          </section>

          <section className="py-24 sm:py-28 lg:py-36" aria-labelledby="home2-manifesto">
            <div className="mx-auto grid max-w-[1480px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
              <MotionReveal variant="left" className="lg:col-span-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Criamos · conectamos · evoluímos</p>
              </MotionReveal>
              <MotionReveal variant="mask" intensity="BALANCED" className="lg:col-span-8">
                <h2 id="home2-manifesto" className="font-display text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                  Não é sobre encher uma página de recursos.
                  <span className="text-muted-foreground"> É sobre dar função a cada parte da jornada.</span>
                </h2>
                <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
                  <p className="leading-relaxed text-muted-foreground">Uma boa experiência digital precisa explicar rapidamente quem você é, o que resolve e qual é o próximo passo.</p>
                  <p className="leading-relaxed text-muted-foreground">A 0WEB une estrutura, conteúdo, tecnologia, aquisição e conversão sem transformar o site em um catálogo de efeitos desconectados.</p>
                </div>
              </MotionReveal>
            </div>
          </section>

          <section className="border-y border-border bg-foreground py-24 text-background sm:py-28 lg:py-36" aria-labelledby="home2-solutions">
            <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
              <div className="grid gap-8 border-b border-background/20 pb-10 lg:grid-cols-12 lg:items-end">
                <MotionReveal variant="left" className="lg:col-span-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Soluções</p>
                  <h2 id="home2-solutions" className="mt-4 font-display text-4xl font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl">Uma estrutura para cada objetivo.</h2>
                </MotionReveal>
                <MotionReveal variant="right" className="lg:col-span-4 lg:text-right">
                  <Link to="/servicos" className="inline-flex items-center gap-2 font-semibold text-background/70 transition-colors hover:text-primary">
                    Explorar todos os serviços <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </MotionReveal>
              </div>
              <div className="mt-8 grid gap-3 lg:grid-cols-12">
                {solutions.map((solution, index) => {
                  const Icon = solution.icon;
                  return (
                    <MotionReveal key={solution.title} variant={index % 3 === 0 ? "left" : index % 3 === 1 ? "scale" : "right"} intensity={index === 0 ? "BALANCED" : "SUBTLE"} className={solution.span}>
                      <Link to={solution.to} className="group flex h-full min-h-[280px] flex-col justify-between border border-background/15 bg-background/[0.035] p-7 transition-colors hover:border-primary/70 hover:bg-background/[0.07] sm:p-9 lg:min-h-[320px]">
                        <div className="flex items-start justify-between gap-6">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-background/50">{solution.eyebrow}</span>
                          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="max-w-2xl font-display text-3xl font-bold tracking-[-0.035em] sm:text-4xl">{solution.title}</h3>
                          <p className="mt-4 max-w-xl leading-relaxed text-background/60">{solution.description}</p>
                          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">Acessar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" /></span>
                        </div>
                      </Link>
                    </MotionReveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-24 sm:py-28 lg:py-36" aria-labelledby="home2-proof">
            <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
              <div className="grid gap-12 lg:grid-cols-12">
                <MotionReveal variant="left" className="lg:col-span-7">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Experiência visível</p>
                  <h2 id="home2-proof" className="mt-4 max-w-4xl font-display text-4xl font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl">O portfólio é a prova, não o enfeite.</h2>
                </MotionReveal>
                <MotionReveal variant="right" className="lg:col-span-5 lg:pt-14">
                  <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Cada projeto publicado tem identidade própria, conteúdo e fluxo compatíveis com o negócio atendido.</p>
                </MotionReveal>
              </div>
              <div className="mt-16 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
                <div className="border-b border-border py-8 sm:border-r lg:border-b-0 lg:pr-8">
                  <p className="font-display text-5xl font-bold tracking-[-0.05em] sm:text-6xl">{publishedProjects.length}</p>
                  <p className="mt-2 text-sm text-muted-foreground">projetos publicados no catálogo atual</p>
                </div>
                {[
                  ["Arquitetura", "Funil por projeto"],
                  ["Descoberta", "SEO e rotas próprias"],
                  ["Experiência", "Mobile, acessível e mensurável"],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-border py-8 sm:border-r sm:px-8 lg:border-b-0 last:border-r-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{label}</p>
                    <p className="mt-3 text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-border bg-muted/20 py-24 sm:py-28 lg:py-36" aria-labelledby="home2-projects">
            <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
              <div className="flex flex-col gap-8 border-b border-border pb-10 lg:flex-row lg:items-end lg:justify-between">
                <MotionReveal variant="mask">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Projetos no ar</p>
                  <h2 id="home2-projects" className="mt-4 font-display text-4xl font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl">Trabalhos que você pode abrir agora.</h2>
                </MotionReveal>
                <Link to="/portfolio" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">Ver portfólio completo <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
              <div className="mt-10 grid gap-x-6 gap-y-12 lg:grid-cols-12">
                {featuredProjects.map((item, index) => (
                  <MotionReveal key={item.slug} variant={index % 2 === 0 ? "left" : "right"} intensity="SUBTLE" className={index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5"}>
                    <Link to="/portfolio/$slug" params={{ slug: item.slug }} className="group block">
                      <div className="overflow-hidden border border-border bg-card">
                        <PortfolioCover clientKey={item.clientKey} slug={item.slug} title={item.title} image={item.image} fallbackImage={item.fallbackImage} sizes="(min-width: 1024px) 56vw, 100vw" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none" />
                      </div>
                      <div className="mt-5 flex items-start justify-between gap-5 border-t border-border pt-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{item.segment ?? "Projeto publicado"}</p>
                          <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl">{item.title}</h3>
                        </div>
                        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary motion-reduce:transform-none" aria-hidden="true" />
                      </div>
                    </Link>
                  </MotionReveal>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 sm:py-28 lg:py-36" aria-labelledby="home2-trust">
            <div className="mx-auto grid max-w-[1480px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
              <MotionReveal variant="left" className="lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Confiança sem maquiagem</p>
                <h2 id="home2-trust" className="mt-4 font-display text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Mostramos o que existe. Medimos o que acontece.</h2>
              </MotionReveal>
              <MotionReveal variant="right" className="lg:col-span-7">
                <div className="grid border-y border-border sm:grid-cols-2">
                  {[
                    ["Projetos reais", "A vitrine aponta para páginas publicadas e navegáveis."],
                    ["Conversão integrada", "CTAs e funis fazem parte da arquitetura, não entram como remendo."],
                    ["Qualidade técnica", "Responsividade, acessibilidade, performance e SEO entram na validação."],
                    ["Evolução contínua", "A experiência pode mudar quando dados reais indicam uma decisão melhor."],
                  ].map(([title, description], index) => (
                    <div key={title} className={`py-7 sm:p-7 ${index % 2 === 0 ? "sm:border-r" : ""} ${index < 2 ? "border-b border-border" : ""}`}>
                      <p className="text-lg font-semibold">{title}</p>
                      <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </MotionReveal>
            </div>
          </section>

          <section className="border-y border-border bg-foreground py-24 text-background sm:py-28 lg:py-36" aria-labelledby="home2-editorial">
            <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
              <MotionReveal variant="mask">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Conteúdo e autoridade</p>
                <h2 id="home2-editorial" className="mt-4 max-w-5xl font-display text-4xl font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl">A presença digital também precisa ensinar.</h2>
              </MotionReveal>
              <div className="mt-14 border-t border-background/20">
                {editorialLinks.map(([label, title, to], index) => (
                  <MotionReveal key={title} variant={index % 2 === 0 ? "left" : "right"} intensity="SUBTLE">
                    <Link to={to} className="group grid gap-5 border-b border-background/20 py-8 sm:grid-cols-[140px_1fr_auto] sm:items-center">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{label}</span>
                      <span className="font-display text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{title}</span>
                      <ArrowUpRight className="h-5 w-5 text-background/50 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary motion-reduce:transform-none" aria-hidden="true" />
                    </Link>
                  </MotionReveal>
                ))}
              </div>
              <div className="mt-10 text-right"><Link to="/blog" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">Acessar o blog <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            </div>
          </section>

          <section className="py-24 sm:py-28 lg:py-36" aria-labelledby="home2-final-cta">
            <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
              <MotionReveal variant="scale" intensity="EXPRESSIVE">
                <div className="border border-border bg-primary px-6 py-12 text-primary-foreground sm:px-10 sm:py-16 lg:px-14 lg:py-20">
                  <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-8">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">Próximo passo</p>
                      <h2 id="home2-final-cta" className="mt-4 font-display text-4xl font-bold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">Tem uma ideia? Vamos dar direção a ela.</h2>
                    </div>
                    <div className="lg:col-span-4 lg:flex lg:justify-end">
                      <FunnelCTAButton intent={{ purpose: "commercial", source: "home2_final", pagePath: "/home2", placement: "section" }} label="Falar sobre meu projeto" location="home2_final" className="inline-flex min-h-12 items-center justify-center rounded-full bg-background px-6 py-3.5 font-semibold text-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background motion-reduce:transform-none" />
                    </div>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </section>
        </main>
      </MotionScope>
      <Footer />
    </div>
  );
}
