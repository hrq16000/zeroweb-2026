import { createFileRoute } from "@tanstack/react-router";
import { BplLocacoesBrinquedosPage } from "@/components/site/BplLocacoesBrinquedosPage";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { breadcrumbNode, graph, organizationNode } from "@/lib/portfolio-seo";
import type { PortfolioComposition } from "@/lib/portfolio-composition";

const slug = "bpl-locacoes-de-brinquedos";
const url = "https://0web.com.br/portfolio/bpl-locacoes-de-brinquedos";
const image = "https://0web.com.br/images/bpl-locacoes-de-brinquedos/social-og.svg";
const title = "BPL Locações de Brinquedos | Cama Elástica e Piscina de Bolinhas em São José dos Pinhais";
const description = "Conheça o portfólio demonstrativo da BPL Locações de Brinquedos, com cama elástica e piscina de bolinhas anunciadas em São José dos Pinhais e região. Criação 0WEB.";

export const composition: PortfolioComposition = {
  slug,
  motionIntensity: "BALANCED",
  renderCta: ({ children, placement }) => <a href="#consulta" data-cta-placement={placement}>{children}</a>,
  brief: {
    businessPersonality: "Alegre, acessível, colorida e voltada à diversão infantil conforme panfleto enviado.",
    creativeConcept: "O grande portal da brincadeira: a página se abre como a entrada de uma festa, em camadas de cor.",
    visualMetaphor: "Arco de entrada e brinquedos em cartões de parque, preservando a paleta azul, amarelo e rosa do panfleto.",
    spatialLanguage: "Arcos largos, painéis em escala, etiquetas inclinadas e módulos grandes com microdetalhes lúdicos.",
    heroConcept: "Palco azul de texto gigante ao lado de ilustração editorial autoral de cama elástica.",
    navigationConcept: "Marca de impacto e âncoras para brinquedos, compromissos e perguntas.",
    contentRhythm: "Palco de festa, catálogo de duas atrações, compromissos anunciados, checklist para consulta, FAQ e convite de demonstração.",
    mediaNarrative: "Ilustrações editoriais próprias baseadas nas categorias reais mostradas no panfleto; não se passam por fotos do estoque.",
    proofNarrative: "Compromissos citados do panfleto com atribuição; sem avaliações, fotos de clientes ou licenças inventadas.",
    conversionNarrative: "CTA isolado por clientKey no funil compartilhado, sem WhatsApp no código e sem afirmar reserva oficial.",
    motionNarrative: "Hover discreto nos CTAs e composição estática com reduced motion respeitado.",
    signatureMoments: ["Palco azul com selo inclinado rosa", "Duas atrações com ilustrações independentes", "Checklist amarelo de preparação da festa"],
    compositionFingerprint: {
      heroGeometry: "left huge joyful headline on royal-blue parade stage beside yellow rotated graphic card",
      headerTreatment: "compact white parade identity with three text anchors and bright yellow bottom edge",
      sectionGraph: "parade-stage→dual-attraction-display→night-blue-promises→sunshine-planning-checklist→ice-blue-faq→yellow-finale",
      contentOrder: ["proposta de diversão", "equipamentos anunciados", "diferenciais", "preparação da consulta", "perguntas", "demonstração"],
      gridTopology: "asymmetric hero split, twin attraction halves, triple promise band, planning split card, FAQ split, centered closing",
      mediaDistribution: "editorial trampoline SVG hero, individual SVG attraction cards, graphic shapes throughout",
      backgroundRhythm: "royal-blue→cream→midnight-navy→warm-white→ice-blue→saturated-yellow",
      proofPlacement: "attributed promises in dark stage, caveat under descriptions, source label in final section",
      ctaDistribution: "hero, each attraction card, final invitation and floating isolated funnel",
      navigationPattern: "logo anchor and three simple content anchors, no copied client nav",
      motionSignature: "gentle transform lift on action and static layered graphics with reduced motion support",
      closingStructure: "yellow-wide festival poster with transparent demo disclosure and funnel entry",
      roleGraph: ["orientation:party-stage", "selection:two-equipment-panels", "trust:source-attributed-promises", "decision:party-checklist", "objections:faq", "conversion:demo-close"],
      mediaCadence: ["trampoline editorial graphic", "two illustration cards", "icon-led promises", "text checklist", "typographic finish"],
      interactionLoci: ["inquiry modal", "section navigation", "native faq accordion"],
      decisionAidPlacement: ["equipment distinction", "date location age checklist before inquiry"],
      densityRhythm: ["expressive", "visual", "compact", "airy", "informative", "high-energy"],
      mobileCompositionStrategy: "stack hero and two cards with 44px targets; no horizontal scroll or aggressive motion",
    }
  }
};

export const Route = createFileRoute("/portfolio/bpl-locacoes-de-brinquedos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "BPL Locações de Brinquedos — Demonstração 0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: "Arte editorial ilustrativa da BPL: cama elástica e piscina de bolinhas" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/bpl-locacoes-de-brinquedos/logo.svg" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: graph([
        organizationNode(),
        {
          "@type": "WebPage",
          "@id": url + "#webpage",
          url,
          name: title,
          description,
          inLanguage: "pt-BR",
          genre: "Portfólio demonstrativo 0WEB; não é o site oficial do estabelecimento",
          image,
          about: {
            "@type": "Service",
            serviceType: "Locação de brinquedos para festas",
            name: "Cama elástica e piscina de bolinhas — BPL",
            areaServed: { "@type": "City", name: "São José dos Pinhais", address: { "@type": "PostalAddress", addressRegion: "PR", addressCountry: "BR" } },
          },
        },
        breadcrumbNode([{ name: "0WEB", path: "/" }, { name: "Portfólio", path: "/portfolio" }, { name: "BPL Locações de Brinquedos", path: "/portfolio/bpl-locacoes-de-brinquedos" }]),
      ]),
    }],
  }),
  component: BplPortfolio,
});

function BplPortfolio() {
  return (
    <PortfolioStandardShell slug={slug} siteNameOverride="BPL Locações de Brinquedos" contactLabelOverride="Consultar locação" seoContextOverride={{ city: "São José dos Pinhais", state: "PR" }}>
      <PortfolioCompositionRoot composition={composition}>
        <BplLocacoesBrinquedosPage />
      </PortfolioCompositionRoot>
    </PortfolioStandardShell>
  );
}
