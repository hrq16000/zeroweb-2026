import { createFileRoute } from "@tanstack/react-router";
import { SalgadosDaFranPage } from "@/components/site/SalgadosDaFranPage";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { graph, breadcrumbNode, organizationNode } from "@/lib/portfolio-seo";
import type { PortfolioComposition } from "@/lib/portfolio-composition";

const slug = "salgados-da-fran";
const url = "https://0web.com.br/portfolio/salgados-da-fran";
const title = "Salgados da Fran | Encomendas em São José dos Pinhais";
const description = "Salgados da Fran em Águas Belas, São José dos Pinhais: veja uma demonstração de apresentação digital e consulte opções de salgados por encomenda.";
// JPEG derivado em prebuild a partir da fonte SVG; fonte canônica permanece imutável.
const social = "https://0web.com.br/images/salgados-da-fran/social-og-og.jpg";

export const composition: PortfolioComposition = {
  slug,
  motionIntensity: "BALANCED",
  renderCta: ({ children, placement }) => <a href="#encomendas" data-cta-placement={placement}>{children}</a>,
  brief: {
    businessPersonality: "Próxima, alegre e direta; identidade original com três salgadinhos ilustrados e cor de destaque amarela.",
    creativeConcept: "Um cartaz de sabores com carimbo de encomenda, adaptado do cartão físico enviado pelo operador.",
    visualMetaphor: "Selo amarelo e trio de salgadinhos como assinatura gráfica; não simular fotos de produtos inexistentes.",
    spatialLanguage: "Tipografia de cartaz grande, noite grafite, amarelo vivo, massas de cor alaranjada e papel creme.",
    heroConcept: "Cartaz vertical central, com selo gráfico superdimensionado e palavras empilhadas em vez de split hero.",
    navigationConcept: "Wordmark compacta, navegação por âncoras e convite de consulta persistente.",
    contentRhythm: "Cartaz de marca → guia curto de encomenda → perguntas essenciais → localidade → grande convite final.",
    mediaNarrative: "Arte gráfica SVG autoral baseada nas cores e mascotes do cartão; nenhuma fotografia fabricada.",
    proofNarrative: "Identidade/WhatsApp no cartão e ficha pública com telefone correspondente; produtos e condições ainda sujeitos a confirmação.",
    conversionNarrative: "Quiz próprio para intenção de encomenda, persistência server-side e roteamento protegido para o contato do próprio cliente.",
    motionNarrative: "Hover leve e gradação estática; reduced-motion respeitado por motion-safe.",
    signatureMoments: ["Três mascotes em selo central", "Trilha de encomenda em cartões com grandes numerais", "Faixa amarela de consulta final"],
    compositionFingerprint: {
      heroGeometry: "stacked vertical centered poster 3 mascot seal and massive editorial typography",
      headerTreatment: "compact white editorial line on deep-charcoal background",
      sectionGraph: "dark poster→cream three-step ticket→charcoal factual FAQ→white local notes→yellow closing stamp",
      contentOrder: ["identidade", "encomenda", "escolha de ocasião", "respostas factuais", "localidade", "consulta"],
      gridTopology: "centered narrow typographic hero, asymmetrical process tickets, FAQ compact two-column, full-width closing",
      mediaDistribution: "vector stamp in hero and OG; no synthetic product photography",
      backgroundRhythm: "charcoal→cream→charcoal→white→yellow",
      proofPlacement: "status demonstrativo visible in top banner and FAQ",
      ctaDistribution: "header, hero, process, closing",
      navigationPattern: "two anchors and client quiz",
      motionSignature: "optional micro lift on ticket and CTA only",
      closingStructure: "yellow final editorial band with enquiry CTA",
      roleGraph: ["brand", "ordering guidance", "information clarity", "local relevance", "conversion"],
      mediaCadence: ["brand mascot", "typographic process", "location pin", "stamp close"],
      interactionLoci: ["quiz from header", "quiz in hero", "FAQ native details", "final quiz"],
      decisionAidPlacement: ["no invented menu", "explain quote factors", "FAQ before submit"],
      densityRhythm: ["bold", "airy", "compact", "quiet", "bold"],
      mobileCompositionStrategy: "390px single column center hero, process tickets stacked, no overflow"
    }
  }
};

export const Route = createFileRoute("/portfolio/salgados-da-fran")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      // Demonstrativo em revisão: somente promover a indexação após readiness e QA.
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" }, { property: "og:site_name", content: "Salgados da Fran | Demonstração 0WEB" },
      { property: "og:image", content: social }, { property: "og:image:alt", content: "Arte gráfica demonstrativa inspirada na marca Salgados da Fran" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title }, { name: "twitter:description", content: description },
      { name: "twitter:image", content: social }
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "pt-BR", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/salgados-da-fran/marca.svg" }
    ],
    scripts: [{
      type: "application/ld+json",
      children: graph([
        organizationNode(),
        { "@type": "WebPage", "@id": url + "#webpage", url, name: title, description,
          about: { "@id": url + "#business" }, inLanguage: "pt-BR", genre: "Portfólio demonstrativo 0WEB; não é o site oficial" },
        { "@type": "FoodEstablishment", "@id": url + "#business", name: "Salgados da Fran",
          description: "Salgados por encomenda em São José dos Pinhais.",
          address: { "@type": "PostalAddress", addressLocality: "São José dos Pinhais",
            addressRegion: "PR", addressCountry: "BR", addressCountryName: "Brasil" },
          areaServed: "São José dos Pinhais, PR", image: social },
        breadcrumbNode([
          { name: "Início", path: "/" }, { name: "Portfólio", path: "/portfolio" },
          { name: "Salgados da Fran", path: "/portfolio/salgados-da-fran" }
        ])
      ])
    }]
  }),
  component: SalgadosDaFranPortfolio
});

function SalgadosDaFranPortfolio() {
  return (
    <PortfolioStandardShell slug={slug} siteNameOverride="Salgados da Fran" contactLabelOverride="Consultar encomenda"
      seoContextOverride={{ city: "São José dos Pinhais", state: "PR", neighborhood: "Águas Belas" }}>
      <PortfolioCompositionRoot composition={composition}>
        <SalgadosDaFranPage />
      </PortfolioCompositionRoot>
    </PortfolioStandardShell>
  );
}
