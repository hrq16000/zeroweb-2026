import { supportHelp } from "@/lib/support-help";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { FloatingFunnelCTA } from "@/components/funnel/FloatingFunnelCTA";
import { HelpCircle } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";

const URL = "https://0web.com.br/faq";
const TITLE = "Perguntas Frequentes · Sites, SEO, Tráfego e IA · 0WEB";
const DESC =
  "Dúvidas frequentes sobre criação de sites, SEO, tráfego pago, automações com IA, prazos, preços, contratos e resultados. Respostas claras da 0WEB.";

const faqs = supportHelp;

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:site_name", content: "0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      { property: "og:image:alt", content: "Perguntas frequentes — 0WEB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "https://0web.com.br/og-default.jpg" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
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
            { "@type": "ListItem", position: 2, name: "FAQ", item: URL },
          ],
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Breadcrumbs items={[{ name: "FAQ", path: "/faq" }]} />
      <main>
        <section className="pt-6 pb-12 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <HelpCircle className="w-3.5 h-3.5" /> Perguntas Frequentes
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
            Tudo o que você precisa saber sobre <span className="text-gradient">sites, SEO, tráfego e IA</span>
          </h1>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Respostas claras e diretas para as dúvidas mais comuns de quem contrata a 0WEB.
          </p>
        </section>

        <section className="pb-24 px-6">
          <div className="max-w-3xl mx-auto space-y-4 scroll-smooth">
            {faqs.map((f) => {
              const id =
                "q-" +
                f.q
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "")
                  .slice(0, 60);
              return (
                <details
                  key={f.q}
                  id={id}
                  className="group rounded-2xl border border-border bg-card p-6 open:shadow-md scroll-mt-24"
                >
                  <summary className="cursor-pointer font-semibold text-lg flex justify-between items-start gap-4">
                    <span>{f.q}</span>
                    <span className="text-primary group-open:rotate-45 transition">+</span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              );
            })}
          </div>
          <p className="text-center mt-12 text-muted-foreground">
            Não encontrou sua dúvida?{" "}
            <FunnelCTAButton
              intent={{ purpose: "diagnosis", source: "faq_inline", pagePath: "/faq", placement: "section" }}
              label="Fale com a gente"
              location="faq_inline"
              showArrow={false}
              className="text-primary font-medium underline"
            />
            .
          </p>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <FloatingFunnelCTA location="faq_page" />
    </div>
  );
}
