import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, CheckCircle2, Search, ShieldCheck, Target } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";

const TITLE = "Google Ads para advogados | Marketing jurídico 0WEB";
const DESCRIPTION = "Gestão de Google Ads para advogados e escritórios: campanhas de pesquisa, orçamento controlado, relatórios e publicidade jurídica responsável.";
const URL = "https://0web.com.br/marketing-juridico";
const intent = { purpose: "diagnosis", source: "marketing-juridico", pagePath: "/marketing-juridico", placement: "hero" } as const;

export const Route = createFileRoute("/marketing-juridico")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: "https://0web.com.br/og-default.jpg" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Service", "@id": URL + "#service", name: "Gestão de Google Ads para advogados", description: DESCRIPTION, url: URL, serviceType: "Marketing digital", areaServed: "BR", provider: { "@type": "Organization", name: "0WEB", url: "https://0web.com.br/" } },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
            { "@type": "ListItem", position: 2, name: "Marketing jurídico", item: URL },
          ] },
        ],
      }),
    }],
  }),
  component: MarketingJuridico,
});

const steps = [
  { icon: Search, title: "Diagnóstico da conta", text: "Avaliamos o histórico, o site existente, as buscas e os custos antes de sugerir novos investimentos." },
  { icon: Target, title: "Uma área por vez", text: "Começamos pela especialidade prioritária e pela região de atendimento. Expandimos após avaliar os dados." },
  { icon: ShieldCheck, title: "Publicidade responsável", text: "Textos informativos aprovados pelo advogado, sem promessas de êxito, sensacionalismo ou captação indevida." },
  { icon: BarChart3, title: "Acompanhamento", text: "Monitoramos buscas, cliques, custos e indicadores de contato compatíveis com as regras de privacidade." },
];

const faq = [
  ["Preciso trocar meu site?", "Não necessariamente. Primeiro avaliamos a página existente. Ajustes ou novas páginas são propostos apenas quando úteis e orçados separadamente."],
  ["Posso aproveitar minha conta do Google Ads?", "Sim. O ideal é manter a conta e o histórico sob sua titularidade e conceder acesso de gestão, sem compartilhar senhas."],
  ["Posso começar com Direito de Família?", "Sim. Uma campanha inicial pode priorizar essa área e sua região de atendimento. Direito Criminal e outras áreas podem ser avaliadas posteriormente."],
  ["Quanto preciso investir em anúncios?", "A verba depende da concorrência, região e palavras-chave. O investimento é definido em conjunto após diagnóstico e pago diretamente ao Google, separado da gestão."],
  ["Existe garantia de novos contratos?", "Não. Buscas, concorrência, atendimento e outros fatores influenciam o resultado. A proposta é mensurar e otimizar o investimento, sem promessa de clientes, posição ou retorno financeiro."],
  ["A publicidade jurídica pode usar Google Ads?", "A aquisição de palavras-chave em resposta a buscas do público é admitida nos limites éticos da OAB. A campanha deve respeitar também as políticas do Google e a privacidade, com aprovação do advogado."],
] as const;

function MarketingJuridico() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="border-b border-border bg-card/60">
          <div className="mx-auto max-w-6xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20 lg:pt-32">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground"><Link to="/" className="underline underline-offset-4">Início</Link> / Marketing jurídico</nav>
            <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">0WEB · Marketing jurídico</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Google Ads para advogados. Com estratégia e controle.</h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Apareça nas buscas relevantes para sua atuação, aproveite sua estrutura atual e acompanhe o investimento com clareza. Comece por uma área jurídica e evolua com dados.</p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <FunnelCTAButton intent={intent} label="Solicitar diagnóstico" location="marketing-juridico-hero" />
                  <a href="#plano" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">Conhecer o plano <ArrowRight aria-hidden="true" className="size-4" /></a>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">Sem obrigação de contratar site novo ou gestão de redes sociais.</p>
              </div>
              <aside aria-label="Diretrizes da gestão" className="rounded-3xl border border-border bg-background p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Controle do começo ao fim</p>
                <div className="mt-6 space-y-5">
                  {["Conta Google Ads em seu nome", "Verba paga diretamente ao Google", "Campanhas de pesquisa por especialidade", "Relatórios de desempenho e revisão periódica"].map((item) => (
                    <div key={item} className="flex items-start gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" /><span className="font-medium">{item}</span></div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="processo">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Método de trabalho</p>
          <h2 id="processo" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Menos suposições. Mais decisões baseadas em dados.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between"><Icon aria-hidden="true" className="size-7 text-primary" /><span className="text-sm text-muted-foreground">0{index + 1}</span></div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="plano" className="scroll-mt-28 border-y border-border bg-card/60 py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Plano inicial · Google Ads</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Comece com uma campanha enxuta.</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">Ideal para escritórios que já possuem site e querem melhorar a eficiência dos anúncios, sem contratar serviços que não precisam. O escopo definitivo é confirmado em proposta.</p>
              <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                <h3 className="font-bold">Expansão gradual</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Após analisar o desempenho, podemos avaliar novas especialidades, regiões e campanhas. Nenhuma expansão de orçamento sem aprovação.</p>
              </div>
            </div>
            <article className="rounded-3xl border border-primary/40 bg-background p-6 sm:p-8">
              <h3 className="text-xl font-bold">Gestão Essencial</h3>
              <p className="mt-4 text-sm text-muted-foreground">Referência inicial de gestão mensal</p>
              <p className="mt-1 text-4xl font-bold tracking-tight">R$ 297 <span className="text-base font-normal text-muted-foreground">/mês a partir de</span></p>
              <p className="mt-3 text-sm text-muted-foreground">Verba de anúncios não inclusa. Referência sujeita à confirmação do escopo e diagnóstico.</p>
              <ul className="mt-6 space-y-3">
                {["Uma especialidade prioritária", "Configuração e gestão de campanha de pesquisa", "Segmentação regional e palavras-chave negativas", "Revisão periódica de termos e desempenho", "Relatório mensal de investimento e indicadores"].map((item) => (
                  <li key={item} className="flex gap-3 text-sm"><CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-primary" />{item}</li>
                ))}
              </ul>
              <div className="mt-7"><FunnelCTAButton intent={{ ...intent, placement: "section" }} label="Conversar sobre o plano" location="marketing-juridico-plano" /></div>
            </article>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="duvidas">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div><h2 id="duvidas" className="text-3xl font-bold tracking-tight">Perguntas frequentes</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">A 0WEB presta serviços de marketing e tecnologia, não serviços advocatícios. A aprovação ética das peças cabe ao profissional responsável.</p>
              <p className="mt-4 text-sm leading-relaxed">Referências: <a className="text-primary underline" href="https://www.oab.org.br/leisnormas/legislacao/provimentos/205-2021">Provimento 205/2021 da OAB</a> e <a className="text-primary underline" href="https://support.google.com/adspolicy/answer/7475709?hl=pt-br">políticas de dados do Google Ads</a>.</p>
            </div>
            <div className="space-y-3">{faq.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-card p-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}</div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-border pt-8">
            <FunnelCTAButton intent={{ ...intent, placement: "section" }} label="Solicitar diagnóstico da conta" location="marketing-juridico-final" />
            <Link to="/servicos" className="text-sm font-medium text-primary underline">Conheça os serviços da 0WEB</Link>
            <a href="/sites/advocacia" className="text-sm font-medium text-primary underline">Sites para advocacia</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
