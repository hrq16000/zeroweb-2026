import { createFileRoute } from "@tanstack/react-router";
import { CantinhoTiaMariPage } from "@/components/site/CantinhoTiaMariPage";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { graph, breadcrumbNode, organizationNode } from "@/lib/portfolio-seo";
import type { PortfolioComposition } from "@/lib/portfolio-composition";

const slug = "cantinho-da-tia-mari";
const url = "https://0web.com.br/portfolio/cantinho-da-tia-mari";
const social = "https://0web.com.br/images/cantinho-da-tia-mari/social-og.svg";
const title = "Cantinho da Tia Mari no Jardim Itália | Berçário e Cuidados Infantis";
const description = "Cantinho da Tia Mari em São José dos Pinhais: conheça os serviços anunciados de berçário, horários estendidos e leva e busca escolar. Portfólio demonstrativo 0WEB.";

export const composition: PortfolioComposition = {
  slug,
  motionIntensity: "BALANCED",
  renderCta: ({ children, placement }) => <a href="#cuidados" data-cta-placement={placement}>{children}</a>,
  brief: {
    businessPersonality: "Carinho, alegria e acolhimento infantil com comunicação objetiva para responsáveis.",
    creativeConcept: "Pequenos grandes dias no Jardim Itália, com identidade delicada proveniente do panfleto real.",
    visualMetaphor: "Adesivos de arco-íris sobre composição editorial de fotografia real da fachada.",
    spatialLanguage: "Peças arredondadas, paleta lilás-creme-rosa, respiros de revista infantil.",
    heroConcept: "Tipografia imersiva à esquerda e fachada real em recorte inclinado à direita.",
    navigationConcept: "Wordmark própria + âncoras curtas + CTA de consulta.",
    contentRhythm: "Hero fotográfico → fita valores → três intenções → mosaico fotos reais → horários → localização → perguntas → fechamento.",
    mediaNarrative: "Quatro recortes reais do panfleto fornecido; não usar imagem genérica de outra escola.",
    proofNarrative: "Distinguir descrição do anúncio de comprovações; não divulgar licenciamento como validado.",
    conversionNarrative: "CTA individual em modal com formulário hospedado, sem intermediação por WhatsApp não validado; 0WEB popup independente.",
    motionNarrative: "Microinterações contidas, sem parallax agressivo; reduced motion respeitado via CSS/Tailwind.",
    signatureMoments: ["Fachada inclinada com selo de carinho", "Três cartões por necessidade", "Faixa noturna violeta com horários legíveis"],
    compositionFingerprint: {
      heroGeometry: "asymmetric split 54/46 yellow-sun lilac-page authentic-building-angle",
      headerTreatment: "rainbow stamp small multicolor daycare wordmark",
      sectionGraph: "photo-angle-hero→violet-values-ticker→three-care-pastels→printed-photos-mosaic→violet-hours-stage→local-map→parents-faq→rose-close",
      contentOrder: ["proposta do estabelecimento", "serviços anunciados", "ambientes reais", "horários", "localização", "perguntas e consulta"],
      gridTopology: "split hero, three independent service panels, asymmetric intro and photo 2x2, two-up dark hours, map duo, FAQ split",
      mediaDistribution: "facade print photo hero, three authentic leaflet photo crops, brand-led social OG",
      backgroundRhythm: "lilac→dark purple strip→cream→warm yellow cream→dark violet→white→lilac→pink",
      proofPlacement: "source disclosure in hero/gallery and factual notes near FAQ",
      ctaDistribution: "hero, each service panel, gallery, hours, closing and floating",
      navigationPattern: "brand header, four anchors, funnel modal and standard external 0WEB popup",
      motionSignature: "subtle CTA lift, inclined photo, low-motion reveals",
      closingStructure: "centered pink manifesto with demonstrative booking consultation",
      roleGraph: ["business introduction", "service intent", "physical evidence", "hours", "local wayfinding", "privacy-conscious consultation"],
      mediaCadence: ["real facade", "care icon cards", "three real interior crops", "map"], 
      interactionLoci: ["intent inquiry", "floating form", "FAQ", "directions"],
      decisionAidPlacement: ["service cards", "schedule before inquiry", "modal intro and privacy reminder"],
      densityRhythm: ["expressive", "compact", "airy", "evidence-led", "contrast", "plain", "quiet"],
      mobileCompositionStrategy: "single-column hero, service stack, 2-column gallery, modal inset and floating CTA"
    }
  }
};
export const Route = createFileRoute("/portfolio/cantinho-da-tia-mari")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" }, { property: "og:site_name", content: "Cantinho da Tia Mari" },
      { property: "og:image", content: social }, { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title }, { name: "twitter:description", content: description },
      { name: "twitter:image", content: social }
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "pt-BR", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/cantinho-da-tia-mari/logo.svg" }
    ],
    scripts: [{
      type: "application/ld+json",
      children: graph([
        organizationNode(),
        {
          "@type": "LocalBusiness",
          "@id": `${url}#business`,
          name: "Cantinho da Tia Mari",
          url,
          description,
          image: social,
          address: {
            "@type": "PostalAddress", streetAddress: "Rua Pedro Alves da Rocha, 200",
            addressLocality: "São José dos Pinhais", addressRegion: "PR",
            postalCode: "83020-360", addressCountry: "BR"
          },
          hasMap: "https://www.google.com/maps/search/?api=1&query=Rua%20Pedro%20Alves%20da%20Rocha%20200%20Jardim%20Italia%20Sao%20Jose%20dos%20Pinhais%20PR",
        },
        breadcrumbNode([
          { name: "Início", path: "/" }, { name: "Portfólio", path: "/portfolio" },
          { name: "Cantinho da Tia Mari", path: "/portfolio/cantinho-da-tia-mari" }
        ])
      ])
    }]
  }),
  component: CantinhoTiaMariPortfolio
});
function CantinhoTiaMariPortfolio() {
  return <PortfolioStandardShell slug={slug} contactLabelOverride="Consultar vagas"
    siteNameOverride="Cantinho da Tia Mari"
    seoContextOverride={{ city: "São José dos Pinhais", state: "PR", neighborhood: "Jardim Itália" }}>
    <PortfolioCompositionRoot composition={composition}>
      <CantinhoTiaMariPage />
    </PortfolioCompositionRoot>
  </PortfolioStandardShell>;
}
