import { createFileRoute } from "@tanstack/react-router";
import { AgropetFiltPreviewPage } from "@/components/site/AgropetFiltPreviewPage";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
import { graph, breadcrumbNode, organizationNode } from "@/lib/portfolio-seo";

const slug = "agropet-filt";
const url = "https://0web.com.br/portfolio/agropet-filt";
const social = "https://0web.com.br/images/agropet-filt/social-og-og.jpg";
const title = "Agropet Filt em Pinhais | Rações, Aviário, Banho e Tosa";
const description = "Conheça a Agropet Filt na Rua Monteiro Lobato, 160, Vargem Grande, Pinhais. Rações, artigos para aves, acessórios, pesca, jardinagem e consulta de banho e tosa. Consulte disponibilidade.";

export const composition: PortfolioComposition = {
  slug,
  motionIntensity: "BALANCED",
  renderCta: ({ children, placement }) => (
    <a href="#encontre" data-cta-placement={placement}>{children}</a>
  ),
  brief: {
    businessPersonality: "Comércio de bairro versátil e acolhedor, próximo de quem cuida de pets e aves.",
    creativeConcept: "Do bico ao focinho: navegação por intenção num universo agropet de Pinhais.",
    visualMetaphor: "Pôster editorial ilustrado com cão e pássaro, jardim verde e etiquetas de categorias.",
    spatialLanguage: "Cartazes assimétricos, mosaico de categorias e guia interativo, com espaços de respiro.",
    heroConcept: "Título monumental à esquerda e ilustração vetorial autoral à direita.",
    navigationConcept: "Wordmark compacta, âncoras de categorias, guia e endereço.",
    contentRhythm: "Pôster editorial → faixas de categorias → mosaico 3x2 → ferramenta de escolha → história local → endereço ilustrado → FAQ.",
    mediaNarrative: "Ilustração vetorial contextual; fotos oficiais ausentes não são simuladas.",
    proofNarrative: "Endereço e categorias com origem pública e horários tratados como sujeitos a confirmação.",
    conversionNarrative: "Seis intenções abrem funil de três etapas com consentimento, persistência e protocolo.",
    motionNarrative: "Microflutuação da ilustração e elevação sutil dos cards, desativados em reduced motion.",
    signatureMoments: [
      "Cão e ave ilustrados em grande escala com etiqueta circular autoral.",
      "Mosaico multicolorido de caminhos comerciais por categoria.",
      "Guia de tipo de pet que informa a próxima ação antes do contato.",
    ],
    compositionFingerprint: {
      heroGeometry: "asymmetric 53/47 hand-illustrated pet poster with extra-large evergreen typography",
      headerTreatment: "rounded illustrated pet monogram with small local wordmark",
      sectionGraph: "pet-poster→category-marquee→six-square-merchandise-grid→dark-green-choice-tool→neighborhood-disc→illustrated-wayfinding→faq-notes",
      contentOrder: ["proximidade e oferta", "categorias", "guia interativo", "contexto de bairro", "como chegar", "dúvidas e contato"],
      gridTopology: "hero 53/47, colored 3x2 merch tiles, half-half dark guide utility, elliptical accent shape and location duo",
      mediaDistribution: "original SVG hero illustration, category icons, poster-style map placeholder clearly identified as illustrative",
      backgroundRhythm: "lively lime→warm paper→cream tiles→forest panel→warm paper→sage map panel→forest close",
      proofPlacement: "address and source disclosure next to the location and product-intent sections",
      ctaDistribution: "hero consultation, six interest-specific category points, guide CTA, closing CTA",
      navigationPattern: "three section jump anchors with local wordmark",
      motionSignature: "quiet floating SVG hero and tactile lift on intent categories",
      closingStructure: "oversized forest typographic invitation beside business-locality details",
      roleGraph: ["discovery", "category selection", "guided inquiry", "local trust", "visit information", "conversion"],
      mediaCadence: ["editorial illustration", "colored category icon grid", "type-led interaction", "abstract location diagram"],
      interactionLoci: ["six category inquiries", "pet type selector", "three-step inquiry capture", "accordion FAQ"],
      decisionAidPlacement: ["category choices above long editorial copy", "guide before location", "privacy at submit"],
      densityRhythm: ["high-impact hero", "compact marquee", "airy cards", "focused tool", "local pause", "brief FAQ"],
      mobileCompositionStrategy: "illustration below hero copy, touch-size tiles in two columns, clear links and single-column conversion",
    },
  },
};

export const Route = createFileRoute("/portfolio/agropet-filt")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Agropet Filt" },
      { property: "og:image", content: social },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: social },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/agropet-filt/logo.svg" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: graph([
        organizationNode(),
        {
          "@type": "PetStore",
          "@id": `${url}#business`,
          name: "Aviário Agropet Filt",
          url,
          description,
          image: social,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rua Monteiro Lobato, 160",
            addressLocality: "Pinhais",
            addressRegion: "PR",
            postalCode: "83321-260",
            addressCountry: "BR",
          },
          hasMap: "https://www.google.com/maps/search/?api=1&query=Rua%20Monteiro%20Lobato%20160%20Vargem%20Grande%20Pinhais%20PR",
        },
        breadcrumbNode([
          { name: "Início", path: "/" },
          { name: "Portfólio", path: "/portfolio" },
          { name: "Agropet Filt", path: "/portfolio/agropet-filt" },
        ]),
      ]),
    }],
  }),
  component: AgropetFiltPortfolio,
});

function AgropetFiltPortfolio() {
  return (
    <PortfolioStandardShell slug={slug} contactLabelOverride="Consultar produtos" funnelIntentOverride="orcamento">
      <PortfolioCompositionRoot composition={composition}>
        <AgropetFiltPreviewPage mode="live" />
      </PortfolioCompositionRoot>
    </PortfolioStandardShell>
  );
}
