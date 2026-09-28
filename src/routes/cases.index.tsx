import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { FloatingFunnelCTA } from "@/components/funnel/FloatingFunnelCTA";
import { TrendingUp } from "lucide-react";

const URL = "https://0web.com.br/cases";
const TITLE = "Projetos 0WEB · Estudos em revisão editorial";
const DESC =
  "Projetos e estudos da 0WEB em revisão editorial. Métricas e depoimentos só voltam à indexação quando houver evidência versionada para cada afirmação.";

const cases = [
  {
    slug: "saas-b2b-seo",
    title: "+412% de tráfego orgânico para SaaS B2B em 8 meses",
    summary: "Reestruturação de SEO técnico, conteúdo programático e link building gerou crescimento orgânico recorrente.",
    metric: "+412% sessões orgânicas",
    segment: "SaaS B2B",
  },
  {
    slug: "ecommerce-trafego-pago",
    title: "ROAS 7,3 em e-commerce de moda no Meta Ads",
    summary: "Reestruturação completa de campanhas, criativos UGC e funil de remarketing aumentaram o retorno em 3x.",
    metric: "ROAS 7,3",
    segment: "E-commerce moda",
  },
  {
    slug: "clinica-google-meu-negocio",
    title: "Clínica passa de 12 para 187 contatos/mês via Google",
    summary: "Otimização de Google Meu Negócio, SEO local e landing pages para bairros aumentaram o volume de pacientes.",
    metric: "+1.458% leads locais",
    segment: "Saúde",
  },
  {
    slug: "automacao-ia-whatsapp",
    title: "Atendimento 24/7 com IA reduz custo em 62%",
    summary: "Chatbot com IA generativa qualifica leads no WhatsApp, integra com CRM e libera time comercial.",
    metric: "-62% custo de atendimento",
    segment: "Serviços",
  },
];

export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Cases de Sucesso 0WEB",
          itemListElement: cases.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://0web.com.br/cases/${c.slug}`,
            name: c.title,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://0web.com.br/" },
            { "@type": "ListItem", position: 2, name: "Cases", item: URL },
          ],
        }),
      },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs items={[{ name: "Cases", path: "/cases" }]} />
      <main>
        <section className="pt-6 pb-12 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <TrendingUp className="w-3.5 h-3.5" /> Revisão editorial
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
            Projetos e estudos <span className="text-gradient">em validação de evidências</span>
          </h1>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Esta seção permanece acessível para revisão, mas não participa do índice do Google enquanto métricas e depoimentos não tiverem fonte verificável.
          </p>
        </section>

        <section className="pb-24 px-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 text-left">
            <h2 className="text-xl font-bold">Critério de publicação dos cases</h2>
            <p className="mt-3 text-muted-foreground">
              Cada estudo precisa ter escopo, fonte das métricas, período de medição e autorização de uso
              documentados. Enquanto essa trilha não estiver versionada, o material não é apresentado como
              resultado comprovado nem enviado para indexação.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <FloatingFunnelCTA location="cases_page" />
    </div>
  );
}
