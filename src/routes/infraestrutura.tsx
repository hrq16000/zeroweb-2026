import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Gauge,
  ShieldCheck,
  Image as ImageIcon,
  Code2,
  Activity,
  Layers3,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { TrustStrip } from "@/components/site/TrustStrip";
import { buildHead } from "@/components/site/IntentLanding";
import { absUrl } from "@/lib/seo";

const URL = absUrl("/infraestrutura");
const TITLE = "Infraestrutura de Sites: Performance, SEO Técnico e Deploy | 0WEB";
const DESC =
  "Como a 0WEB organiza performance, renderização, imagens, dados estruturados, segurança, validação e deploy em projetos web sem prometer métricas universais.";

export const Route = createFileRoute("/infraestrutura")({
  head: () => buildHead({ title: TITLE, description: DESC, url: URL }),
  component: InfraestruturaPage,
});

type Pillar = {
  icon: typeof Gauge;
  title: string;
  desc: string;
  details: string[];
};

const PILLARS: Pillar[] = [
  {
    icon: Gauge,
    title: "Performance medida por projeto",
    desc: "Core Web Vitals e Lighthouse são usados como sinais de diagnóstico, não como números garantidos.",
    details: [
      "Orçamento de JavaScript e divisão de código por rota quando aplicável",
      "Monitoramento de regressões no fluxo de CI",
      "Revisão de carregamento, hidratação e elementos que afetam estabilidade visual",
      "Decisões de performance baseadas na página real, não em promessa universal",
    ],
  },
  {
    icon: Layers3,
    title: "Renderização e arquitetura",
    desc: "A estrutura separa rotas, conteúdo e componentes para que cada página entregue apenas o contexto necessário.",
    details: [
      "React e TanStack Start no projeto atual",
      "SSR e roteamento por página",
      "Componentes reaproveitados apenas quando não apagam a identidade da página",
      "Separação entre portfólio, serviços, hubs e landing pages",
    ],
  },
  {
    icon: ImageIcon,
    title: "Mídia com tamanho e contexto",
    desc: "Imagens são tratadas como parte da experiência e precisam chegar com dimensão, texto alternativo e carregamento adequados.",
    details: [
      "Dimensões declaradas para reduzir deslocamento de layout",
      "Lazy loading fora da área crítica quando apropriado",
      "Mídia real do cliente priorizada no portfólio",
      "Fallbacks controlados quando o ativo específico não existe",
    ],
  },
  {
    icon: Code2,
    title: "SEO técnico por intenção",
    desc: "Canonical, robots, sitemap e dados estruturados variam conforme a função e a evidência de cada rota.",
    details: [
      "WebPage, Service, FAQPage, BreadcrumbList e outros tipos apenas quando aplicáveis",
      "Noindex para conteúdo utilitário, blueprint ou página sem evidência suficiente",
      "Sitemaps separados por famílias de conteúdo",
      "Malha interna voltada a páginas canônicas e publicadas",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Entrega segura e controlada",
    desc: "Deploy, dependências e configurações de segurança são tratados como parte da engenharia do projeto.",
    details: [
      "HTTPS no ambiente publicado",
      "Validação de build antes de integrar mudanças relevantes",
      "Revisão de dependências e configurações do aplicativo",
      "Rollback e histórico preservados pelo fluxo de versionamento e deploy",
    ],
  },
  {
    icon: Activity,
    title: "Validação contínua",
    desc: "SEO e qualidade não terminam no primeiro deploy: Search Console, testes e auditorias indicam a próxima correção.",
    details: [
      "Build e testes automatizados no GitHub",
      "Inspeção de URLs e sitemaps no Google Search Console",
      "Revisão de indexabilidade, schema e conteúdo factual",
      "Evolução em micro-rodadas para reduzir regressões",
    ],
  },
];


const PROCESS = [
  {
    step: "01",
    title: "Definir intenção e arquitetura",
    desc: "A rota nasce com função clara: informar, vender, reunir serviços, provar trabalho ou apoiar uma intenção de busca específica.",
  },
  {
    step: "02",
    title: "Construir conteúdo e interface",
    desc: "Componentes, mídia e texto são organizados para o contexto daquela página, evitando depender de um único template para todo o portal.",
  },
  {
    step: "03",
    title: "Aplicar SEO técnico",
    desc: "Canonical, robots, metadata, dados estruturados, sitemap e links internos são alinhados à intenção e à evidência disponível.",
  },
  {
    step: "04",
    title: "Validar antes de publicar",
    desc: "Build, testes e verificações de regressão ajudam a separar falha de código, problema visual e limitação de infraestrutura.",
  },
  {
    step: "05",
    title: "Medir e corrigir",
    desc: "Search Console e auditorias on-page mostram quais URLs foram descobertas, indexadas ou ainda precisam de conteúdo e descoberta interna.",
  },
];


function InfraestruturaPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/40 border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-3 py-1">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Stack técnica
            </p>
            <h1 className="mt-4 text-4xl lg:text-6xl font-bold font-display tracking-tight">
              Infraestrutura para <span className="text-primary">publicar, medir e evoluir</span> páginas web
            </h1>
            <p className="mt-5 text-lg lg:text-xl text-muted-foreground">
              A camada técnica combina renderização, performance, mídia, SEO técnico, validação e deploy.
              O objetivo é reduzir problemas mensuráveis sem transformar Lighthouse, ranking ou uptime em promessa universal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/servicos"
                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:opacity-90 transition shadow-elegant"
              >
                Ver Serviços
              </Link>
              <Link
                to="/solicitar-diagnostico"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 font-semibold hover:border-primary/40 transition"
              >
                Solicitar diagnóstico técnico
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <TrustStrip variant="compact" />

      {/* PILARES TÉCNICOS */}
      <section className="py-16 lg:py-24" aria-labelledby="pillars-title">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Pilares técnicos
            </p>
            <h2 id="pillars-title" className="mt-2 text-3xl lg:text-4xl font-bold font-display">
              6 frentes técnicas que precisam trabalhar juntas
            </h2>
            <p className="mt-3 text-muted-foreground">
              Performance, arquitetura, mídia, SEO técnico, segurança e validação precisam refletir a página real.
              Nenhuma métrica isolada substitui conteúdo útil ou evidência suficiente para indexação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {PILLARS.map(({ icon: Icon, title, desc, details }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-elegant transition"
              >
                <span className="grid place-items-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                <ul className="mt-4 space-y-2">
                  {details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <section className="py-16 lg:py-24 bg-muted/30 border-y border-border" aria-labelledby="process-title">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Processo
            </p>
            <h2 id="process-title" className="mt-2 text-3xl lg:text-4xl font-bold font-display">
              Como uma página passa de intenção a validação técnica
            </h2>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROCESS.map(({ step, title, desc }) => (
              <li
                key={step}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition"
              >
                <span className="text-xs font-bold text-primary">{step}</span>
                <h3 className="mt-2 font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="proof-title">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">O que é verificável</p>
            <h2 id="proof-title" className="mt-2 text-3xl lg:text-4xl font-bold font-display">
              A infraestrutura deixa rastros que podem ser auditados
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Em vez de publicar um número fixo para todos os projetos, a 0WEB usa sinais observáveis:
              build concluído, rota canônica, robots correto, sitemap coerente, schema compatível, imagens dimensionadas,
              links internos e dados do Search Console. Cada página pode então ser corrigida com base no que realmente aconteceu.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-6">
              <Gauge className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-bold">Performance é medida</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Lighthouse e Core Web Vitals ajudam a encontrar regressões, mas o valor observado depende da página, dispositivo, rede e momento da medição.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6">
              <Code2 className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-bold">Indexação é verificada</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                URL Inspection e sitemaps mostram se o Google conhece a página; conteúdo e descoberta interna são ajustados quando a URL continua fora do índice.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-bold">Mudanças são versionadas</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Git, testes e previews permitem revisar a alteração antes de tratá-la como produção concluída.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-muted/30 to-background border-t border-border">
        <div className="mx-auto max-w-4xl px-5 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-display">
            Quer uma base técnica que possa ser medida e evoluída?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Compare os serviços publicados e escolha o escopo compatível com o projeto. Performance e SEO são validados na página real, sem garantia artificial de posição ou pontuação.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/servicos/site-pro"
              className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:opacity-90 transition shadow-elegant"
            >
              Conhecer o Site Pro
            </Link>
            <Link
              to="/servicos"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 font-semibold hover:border-primary/40 transition"
            >
              Ver Serviços
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
