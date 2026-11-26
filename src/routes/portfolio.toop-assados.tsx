import { createFileRoute } from "@tanstack/react-router";
import { ToopAssadosPreviewPage } from "@/components/site/ToopAssadosPreviewPage";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
import { graph, breadcrumbNode, organizationNode } from "@/lib/portfolio-seo";

const slug = "toop-assados";
const url = "https://0web.com.br/portfolio/toop-assados";
const title = "Toop Assados em Curitiba | Estudo de site e cardápio 0WEB";
const description = "Portfólio demonstrativo da 0WEB para Toop Assados no Xaxim, Curitiba: costela na brasa, frango recheado e exemplo de experiência de encomenda. Página não oficial.";
const social = "https://0web.com.br/images/toop-assados/social-og.svg";

export const composition: PortfolioComposition = {
  slug, motionIntensity: "BALANCED",
  renderCta: ({ children, placement }) => (
    <a href="#simulacao" data-cta-placement={placement}>{children}</a>
  ),
  brief: {
    businessPersonality: "Assados de bairro, comunicação direta e calor de forno.",
    creativeConcept: "Caderno da Brasa — etiqueta editorial para escolher o assado.",
    visualMetaphor: "Papel kraft, chapa de metal, prato ilustrado em vez de parede de chamas.",
    spatialLanguage: "Hero tipográfico assimétrico e dois ledgers de pratos em paralelo.",
    heroConcept: "Da brasa para a sua mesa: texto monumental e prato gráfico original.",
    navigationConcept: "Três âncoras para assados, simulação e localização.",
    contentRhythm: "Cartaz → dois pratos → escolha assistida → referência de bairro.",
    mediaNarrative: "Composição vetorial editorial; não simula fotos reais dos pratos.",
    proofNarrative: "Dados do panfleto histórico explicitamente sujeitos a confirmação.",
    conversionNarrative: "Escolha sem pagamento; o Jotform é apenas uma simulação sem contato oficial.",
    motionNarrative: "Lift sutil de cartões e redução integral com prefers-reduced-motion.",
    signatureMoments: [
      "Pôster kraft com tipografia monumental e prato vetorial.",
      "Comparação de dois itens do folheto, com aviso de preço histórico.",
      "Simulador de quantidade sem coleta de contato no próprio site."
    ],
    compositionFingerprint: {
      heroGeometry: "oversized typographic left / illustrated semicircular plate right",
      headerTreatment: "small typographic Toop wordmark with thin anchor navigation",
      sectionGraph: "kraft-poster→two-dish-ledgers→dark-order-demo→local-fact-strip",
      contentOrder: ["greeting","dishes","order simulation","locality","non-official disclosure"],
      gridTopology: "offset split poster, equal two-item dish ledger, dark utility form",
      mediaDistribution: "handmade food SVG within layout and dedicated vector social/cover",
      backgroundRhythm: "kraft→paper→charcoal→paper→charcoal",
      proofPlacement: "source and validity warnings in each menu item",
      ctaDistribution: "hero, each dish, hosted demo form",
      navigationPattern: "anchor-jump menu",
      motionSignature: "subtle card lift only with motion preference",
      closingStructure: "address evidence adjacent to nonaffiliation notice",
      roleGraph: ["orient","compare","simulate","locate"],
      mediaCadence: ["graphic hero","typographic cards","interactive panel","local note"],
      interactionLoci: ["dish selection","quantity","hosted demo form"],
      decisionAidPlacement: ["dishes high","quantity next","form after summary"],
      densityRhythm: ["high impact","balanced ledger","focused utility","restful close"],
      mobileCompositionStrategy: "390px single column, no horizontally scrolling controls"
    }
  }
};

export const Route = createFileRoute("/portfolio/toop-assados")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Toop Assados — projeto demonstrativo 0WEB" },
      { property: "og:image", content: social },
      { property: "og:image:alt", content: "Cartaz conceitual ilustrado de Toop Assados — não é fotografia do restaurante" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: social }
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/toop-assados/icon.svg" }
    ],
    scripts: [{
      type: "application/ld+json",
      children: graph([
        organizationNode(),
        {
          "@type": "WebPage",
          "@id": url + "#webpage",
          url, name: title, description, inLanguage: "pt-BR",
          publisher: { "@type": "Organization", name: "0WEB", url: "https://0web.com.br" },
          about: {
            "@type": "Restaurant",
            name: "Toop Assados",
            description: "Estabelecimento de assados mencionado em panfleto físico fornecido à 0WEB; horários, preços e operação não confirmados.",
            address: { "@type": "PostalAddress", addressLocality: "Curitiba", addressRegion: "PR", addressCountry: "BR" }
          },
          genre: "Projeto demonstrativo independente, não afiliado ao estabelecimento"
        },
        breadcrumbNode([
          { name: "Início", path: "/" },
          { name: "Portfólio", path: "/portfolio" },
          { name: "Toop Assados", path: "/portfolio/toop-assados" }
        ])
      ])
    }]
  }),
  component: ToopAssadosPage
});

function ToopAssadosPage() {
  return (
    <PortfolioStandardShell slug={slug} contactLabelOverride="Simular encomenda" funnelIntentOverride="pedido">
      <PortfolioCompositionRoot composition={composition}>
        <ToopAssadosPreviewPage mode="live" />
      </PortfolioCompositionRoot>
    </PortfolioStandardShell>
  );
}
