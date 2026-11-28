import { createFileRoute } from "@tanstack/react-router";
import { GaragemGirassolPage, garagemQuiz } from "@/components/site/GaragemGirassolPage";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { graph, breadcrumbNode, organizationNode } from "@/lib/portfolio-seo";
import type { PortfolioComposition } from "@/lib/portfolio-composition";

const slug = "garagem-girassol";
const url = "https://0web.com.br/portfolio/garagem-girassol";
const title = "Garagem & Girassol | Espetinhos e crepe suíço em São José dos Pinhais";
const description = "Conheça a Garagem & Girassol, na Rua Quirino Zagonel, 988, em São José dos Pinhais–PR. Espetinhos, crepe suíço, morango e uva com nata. Consulte as opções.";
const social = "https://0web.com.br/images/garagem-girassol/social-og.jpg";
const composition: PortfolioComposition = {
  slug, motionIntensity: "SUBTLE",
  renderCta: ({ children, placement }) => <a href="#sabores" data-cta-placement={placement}>{children}</a>,
  brief: {
    businessPersonality: "Lanche de bairro, identidade calorosa dos girassóis e comunicação direta.",
    creativeConcept: "Placa da noite: o cartaz de madeira e amarelo vira vitrine gastronômica.",
    visualMetaphor: "Moldura da placa real com faixa amarela de sabores.",
    spatialLanguage: "Fundo café, creme de papel, girassol amarelo e tipografia serifada de cartaz.",
    heroConcept: "Nome em duas linhas lado a lado com foto da placa real em moldura madeira.",
    navigationConcept: "Cabeçalho compacto e duas âncoras úteis.",
    contentRhythm: "Apresentação da placa → faixa de sabores → três opções → localização → dúvidas.",
    mediaNarrative: "Recortes das três fotos do operador, sem fotos sintéticas de alimentos.",
    proofNarrative: "Somente fatos visíveis nos anúncios e endereço indicado pelo operador.",
    conversionNarrative: "Consultar opções no quiz próprio; não promete pedido, pagamento, entrega ou preço.",
    motionNarrative: "Elevação do CTA e aproximação fotográfica discreta com reduced-motion.",
    signatureMoments: ["Moldura da placa", "Faixa amarela de sabores", "Três cartões com formas e fontes distintas"],
    compositionFingerprint: {
      heroGeometry: "wide wood-framed photographed night sign alongside oversized two-line serif name",
      headerTreatment: "small sunflower icon with brown sign typography and two anchor links",
      sectionGraph: "coffee sign hero→sunflower flavor strip→cream unequal three food cards→brown address frame→compact cream FAQ",
      contentOrder: ["identidade noturna", "sabores anunciados", "consulta de opções", "endereço exato", "dúvidas"],
      gridTopology: "asymmetric framed photo, unequal triple cards, dark map pair",
      mediaDistribution: "real sign photo in hero, cropped banner photos in food tiles, second sign angle in location",
      backgroundRhythm: "coffee→gold→vanilla→deep wood→vanilla",
      proofPlacement: "sign provenance in hero caption and facts in FAQ",
      ctaDistribution: "hero, menu consultation, final question and shell floating",
      navigationPattern: "two anchors and map deep link",
      motionSignature: "hover lift on yellow CTA and slight image zoom within photo cards",
      closingStructure: "native FAQ disclosure and compact contact close",
      roleGraph: ["identity", "food choice", "consultation", "wayfinding", "factual clarity"],
      mediaCadence: ["real sign", "skewer icon", "advertised crepe", "advertised desserts", "second sign"],
      interactionLoci: ["menu consultation", "map link", "FAQ disclosures"],
      decisionAidPlacement: ["options before contact", "address before map", "unconfirmed details FAQ"],
      densityRhythm: ["bold", "short", "medium", "wide", "quiet"],
      mobileCompositionStrategy: "stack serif title before framed sign; food cards stacked; map and FAQs full width"
    }
  }
};

export const Route = createFileRoute("/portfolio/garagem-girassol")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" }, { property: "og:site_name", content: "Garagem & Girassol" },
      { property: "og:image", content: social }, { property: "og:image:width", content: "1200" }, { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Garagem & Girassol, identidade e placa fotografada" },
      { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }, { name: "twitter:image", content: social }
    ],
    links: [
      { rel: "canonical", href: url }, { rel: "alternate", hrefLang: "pt-BR", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/garagem-girassol/logo.svg" }
    ],
    scripts: [{ type: "application/ld+json", children: graph([
      organizationNode(),
      { "@type": "FoodEstablishment", "@id": url+"#business", name: "Garagem & Girassol",
        url, description, image: social,
        address: { "@type": "PostalAddress", streetAddress: "Rua Quirino Zagonel, 988", addressLocality: "São José dos Pinhais", addressRegion: "PR", addressCountry: "BR" }},
      breadcrumbNode([{name:"Início",path:"/"},{name:"Portfólio",path:"/portfolio"},{name:"Garagem & Girassol",path:"/portfolio/garagem-girassol"}])
    ]) }]
  }),
  component: GaragemGirassolPortfolio
});
function GaragemGirassolPortfolio() {
  return <PortfolioStandardShell slug={slug} siteNameOverride="Garagem & Girassol" contactLabelOverride="Consultar cardápio"
    quizConfigOverride={garagemQuiz} seoContextOverride={{city:"São José dos Pinhais",state:"PR"}}>
    <PortfolioCompositionRoot composition={composition}><GaragemGirassolPage/></PortfolioCompositionRoot>
  </PortfolioStandardShell>;
}
