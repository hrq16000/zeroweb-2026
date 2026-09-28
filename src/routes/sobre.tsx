import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Layers3, Search, Workflow, Target, Sparkles, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { FloatingFunnelCTA } from "@/components/funnel/FloatingFunnelCTA";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";

const TITLE = "Sobre a 0WEB | Sites, SEO, Automação e Presença Digital";
const DESC =
  "Conheça como a 0WEB organiza sites, SEO, tráfego, automação e presença digital com portfólio publicado, conteúdo factual e evolução orientada por dados.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://0web.com.br/sobre" },
      { property: "og:site_name", content: "0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      { property: "og:image:alt", content: "0WEB — tecnologia que gera crescimento" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "https://0web.com.br/og-default.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://0web.com.br/sobre" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": "https://0web.com.br/sobre#aboutpage",
              url: "https://0web.com.br/sobre",
              name: TITLE,
              description: DESC,
              inLanguage: "pt-BR",
              mainEntity: { "@id": "https://0web.com.br/#org" },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
                { "@type": "ListItem", position: 2, name: "Sobre", item: "https://0web.com.br/sobre" },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs items={[{ name: "Sobre", path: "/sobre" }]} />
      <main className="pt-6 pb-24">
        <section className="mx-auto max-w-5xl px-5 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-wider text-primary font-semibold"
          >
            Sobre nós
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.05]"
          >
            Presença digital com <span className="text-gradient">estrutura, prova e próxima ação</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-lg text-muted-foreground max-w-3xl"
          >
            A 0WEB reúne criação de sites, landing pages, SEO, tráfego, automação e outras frentes digitais
            dentro de uma mesma lógica: entender o objetivo, publicar uma base tecnicamente sólida, medir o que acontece
            e evoluir sem inventar resultados, localidades ou provas que o projeto não possui.
          </motion.p>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { k: "Portfólio publicado", v: "Projetos de clientes acessíveis em páginas próprias, cada um com contexto e identidade específicos." },
              { k: "Serviços conectados", v: "Sites, SEO, tráfego, automação e presença digital organizados conforme o problema real a resolver." },
              { k: "Evidência antes de escala", v: "Páginas locais e conteúdos só devem ganhar indexação quando houver informação própria e suporte factual suficiente." },
            ].map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="text-lg font-bold font-display">{s.k}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.v}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-24 mx-auto max-w-5xl px-5 lg:px-8">
          <h2 className="text-3xl font-bold font-display">Como a operação é organizada</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { i: <Target className="w-5 h-5" />, t: "Objetivo antes da ferramenta", d: "A solução começa pelo problema a resolver, não pelo recurso que parece mais sofisticado." },
              { i: <Layers3 className="w-5 h-5" />, t: "Arquitetura clara", d: "Home, serviços, portfólio, páginas locais e landing pages recebem funções diferentes para evitar duplicação." },
              { i: <Search className="w-5 h-5" />, t: "SEO com evidência", d: "Conteúdo local, cases e páginas programáticas precisam de prova real antes de competir no índice." },
              { i: <Workflow className="w-5 h-5" />, t: "Funil com contexto", d: "O contato registra a intenção antes de encaminhar a conversa para o canal adequado." },
              { i: <Sparkles className="w-5 h-5" />, t: "Design autoral", d: "Projetos de portfólio devem refletir o negócio do cliente, sem repetir um único esqueleto visual." },
              { i: <ShieldCheck className="w-5 h-5" />, t: "Factualidade", d: "Sem promessa de ranking, resultado ou presença local que não possa ser sustentada pelo conteúdo publicado." },
            ].map((v) => (
              <div key={v.t} className="rounded-2xl border border-border bg-card p-6 hover:shadow-elegant transition">
                <div className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary">{v.i}</div>
                <h3 className="mt-4 font-semibold">{v.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 mx-auto max-w-5xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-10 lg:p-14">
            <div className="absolute inset-0 bg-mesh opacity-40" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold font-display">Vamos conversar?</h2>
              <p className="mt-3 text-background/70 max-w-xl">
                Conte seu desafio pelo funil. O contexto da solicitação orienta a análise e o próximo passo, sem promessa artificial de prazo ou resultado.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <FunnelCTAButton
                  intent={{ purpose: "diagnosis", source: "sobre_footer_cta", pagePath: "/sobre", placement: "footer" }}
                  label="Falar com a 0WEB"
                  location="sobre_footer_cta"
                  showArrow={false}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3 shadow-glow-primary"
                />
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full glass-dark text-background font-semibold px-6 py-3 hover:bg-background/10"
                >
                  Ver projetos publicados
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-background/60">
                <Link to="/servicos" className="underline underline-offset-4 hover:text-background">Serviços</Link>
                <Link to="/solucoes" className="underline underline-offset-4 hover:text-background">Soluções</Link>
                <Link to="/portfolio" className="underline underline-offset-4 hover:text-background">Portfólio</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <FloatingFunnelCTA location="sobre_page" />
    </div>
  );
}
