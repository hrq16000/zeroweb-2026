import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FunnelRunner } from "@/components/funnel/FunnelRunner";
import { getPublicFunnel, type FunnelDefinition } from "@/lib/dynamic-funnel.functions";
import { parseContactIntent, resolveFunnelFromIntent } from "@/lib/contact-intent";

const TITLE = "Contato 0WEB · Diagnóstico pelo funil";
const DESC = "Inicie um diagnóstico com a 0WEB por formulário seguro. Sem exposição pública de e-mail, telefone ou canais diretos.";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://0web.com.br/contato" },
      { property: "og:site_name", content: "0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      { property: "og:image:alt", content: "Fale com a 0WEB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "https://0web.com.br/og-default.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://0web.com.br/contato" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": "https://0web.com.br/contato#contactpage",
              url: "https://0web.com.br/contato",
              name: TITLE,
              description: DESC,
              inLanguage: "pt-BR",
              mainEntity: { "@id": "https://0web.com.br/#org" },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
                { "@type": "ListItem", position: 2, name: "Contato", item: "https://0web.com.br/contato" },
              ],
            },
            {
              "@type": "FAQPage",
              "@id": "https://0web.com.br/contato#faq",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Como funciona o contato com a 0WEB?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "O contato começa pelo funil da 0WEB, que registra o contexto da solicitação. Quando o atendimento pede continuidade no WhatsApp, o encaminhamento ocorre depois desse contexto inicial.",
                  },
                },
                {
                  "@type": "Question",
                  name: "O que devo informar no primeiro contato?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Informe o objetivo, o que já existe hoje, o principal problema percebido e qualquer prazo real que afete o projeto. Não é necessário escolher uma solução técnica antes do diagnóstico.",
                  },
                },
                {
                  "@type": "Question",
                  name: "A página de contato publica telefone ou e-mail direto?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Não. A página usa o funil para organizar a solicitação sem expor canais diretos publicamente.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const fetchFunnel = useServerFn(getPublicFunnel);
  const [funnel, setFunnel] = useState<FunnelDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const intent = parseContactIntent(params);
    const slug = intent ? resolveFunnelFromIntent(intent) : "diagnostico-0web";
    fetchFunnel({ data: { slug } })
      .then((f) => {
        if (!f) setError("Funil indisponível no momento. Tente novamente em alguns instantes.");
        else setFunnel(f);
      })
      .catch(() => setError("Não foi possível carregar o formulário agora."));
  }, [fetchFunnel]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-24">
        <section className="mx-auto max-w-4xl px-5 lg:px-8">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs uppercase tracking-wider text-primary font-semibold">
            Diagnóstico seguro
          </motion.p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-display">Conte seu cenário pelo funil da 0WEB</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-7">
            Use este canal para explicar o objetivo do projeto, o que já existe hoje e o principal problema que precisa ser resolvido.
            O funil organiza essas informações antes de qualquer encaminhamento comercial.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-5">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-semibold">1. Conte o objetivo</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Explique se precisa ser encontrado, vender melhor, organizar uma oferta, automatizar um processo ou resolver outro gargalo digital.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-semibold">2. Envie contexto suficiente</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Site atual, serviço, campanha, cidade atendida e prazo real ajudam a entender o cenário. Não é necessário escolher tecnologia antes da análise.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-semibold">3. Siga para o próximo canal</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Quando o atendimento pede continuidade no WhatsApp, o encaminhamento acontece depois que o funil registra o contexto inicial.
              </p>
            </article>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card overflow-hidden">
            {error ? (
              <div className="p-8 text-center">
                <ShieldCheck className="w-8 h-8 mx-auto text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">{error}</p>
              </div>
            ) : funnel ? (
              <FunnelRunner funnel={funnel} embedded />
            ) : (
              <div className="min-h-[320px] grid place-items-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
          </div>

          <section className="mt-12" aria-labelledby="contato-o-que-informar">
            <h2 id="contato-o-que-informar" className="text-2xl font-bold font-display">O que ajuda a análise inicial</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/20 p-5">
                <h3 className="font-semibold">O que já existe</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Informe se já existe site, domínio, perfil no Google, campanha, catálogo, loja ou outro ativo relacionado ao projeto.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/20 p-5">
                <h3 className="font-semibold">O que precisa mudar</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Descreva o problema percebido: pouca descoberta, página confusa, contatos sem contexto, processo manual ou outra necessidade concreta.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/20 p-5">
                <h3 className="font-semibold">Quem precisa ser atendido</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Público, região realmente atendida e tipo de cliente ajudam a evitar uma solução genérica ou páginas locais sem evidência.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/20 p-5">
                <h3 className="font-semibold">Qual restrição é real</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Prazo, orçamento, integração obrigatória ou processo existente devem ser informados quando realmente condicionam a execução.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="contato-faq-title">
            <h2 id="contato-faq-title" className="text-2xl font-bold font-display">Perguntas sobre o contato</h2>
            <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
              <details className="p-5">
                <summary className="cursor-pointer font-semibold">Como funciona o contato com a 0WEB?</summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  O contato começa pelo funil, que registra o contexto da solicitação. Quando o atendimento pede continuidade no WhatsApp, o encaminhamento ocorre depois dessa etapa.
                </p>
              </details>
              <details className="p-5">
                <summary className="cursor-pointer font-semibold">Preciso saber qual serviço contratar?</summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Não. Descreva o objetivo e o problema atual. A definição técnica pode acontecer depois que o cenário estiver claro.
                </p>
              </details>
              <details className="p-5">
                <summary className="cursor-pointer font-semibold">Por que o telefone e o e-mail não ficam expostos aqui?</summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  O funil organiza a solicitação e evita que uma conversa comece sem contexto. A continuidade é definida conforme o atendimento aplicável.
                </p>
              </details>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
