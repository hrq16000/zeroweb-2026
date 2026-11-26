import { createFileRoute } from "@tanstack/react-router";
import { EspacoMarliNailsGuaratubaPage } from "@/components/site/EspacoMarliNailsGuaratubaPage";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
import { graph, breadcrumbNode, organizationNode } from "@/lib/portfolio-seo";

const slug = "espaco-marli-nails-guaratuba";
const url = "https://0web.com.br/portfolio/espaco-marli-nails-guaratuba";
const title = "Espaço Marli Nails Designer | Manicure em Guaratuba – PR";
const description = "Conheça o Espaço Marli Nails Designer, em Coroados, Guaratuba (PR). Veja a localização e solicite informações sobre manicure, pedicure e horários disponíveis.";
const social = "https://0web.com.br/images/espaco-marli-nails-guaratuba/social-source-og.jpg";

/** Composição inédita. Infraestrutura compartilhada; ritmo e arte próprios. */
export const composition: PortfolioComposition = {
  slug,
  motionIntensity: "SUBTLE",
  renderCta: ({ children, placement }) => (
    <a href="#consulta" data-cta-placement={placement}>{children}</a>
  ),
  brief: {
    businessPersonality: "Cuidado local com clareza e delicadeza; hipótese editorial da 0WEB, não marca oficial.",
    creativeConcept: "Unhas, endereço e conversa em uma revista local interativa.",
    visualMetaphor: "Arcos de esmalte e precisão de traço, sem imagens falsas de trabalhos.",
    spatialLanguage: "Tipografia monumental com painel de arte, escolha de atendimento e cartão de endereço.",
    heroConcept: "Abertura editorial assimétrica de título monumental e ilustração abstrata.",
    navigationConcept: "Wordmark e três âncoras com consulta em desktop e CTA resumido no mobile.",
    contentRhythm: "Capa editorial → escolha interativa → endereço gráfico → transparência da galeria → FAQ → consulta.",
    mediaNarrative: "SVGs originais e abstratos; fotos de trabalhos reais pendentes de autorização.",
    proofNarrative: "Localidade e categorias documentadas; nenhuma avaliação textual inventada.",
    conversionNarrative: "Escolha de intenção → formulário individual → protocolo sem promessa de reserva.",
    motionNarrative: "Entrada editorial sutil, controles com estados e suporte reduced-motion.",
    signatureMoments: [
      "Capa tipográfica editorial e arte conceitual identificada.",
      "Seleção de preferência acessível com aria-pressed e formulário contextual.",
      "Localização tipográfica autoral separada de um trajeto real por link Maps."
    ],
    compositionFingerprint: {
      heroGeometry: "asymmetric 60-40 oversized editorial typographic cover with original abstract enamel panel",
      headerTreatment: "light small monogram and restrained beauty wordmark with desktop booking action",
      sectionGraph: "magazine-cover→three-choice-pressed-selector→geography-card→image-rights-editorial→faq→plum-close",
      contentOrder: ["reconhecimento local", "escolha de cuidado", "localização", "mídia com proveniência", "dúvidas", "consulta"],
      gridTopology: "poster typography + vertical art; three large pressed choices; oversized geographic panel; two abstract columns",
      mediaDistribution: "custom SVG on hero, vector logo and OG, graphic not photographic geography and gallery",
      backgroundRhythm: "porcelain→deep-plum→porcelain→dusty-pink→porcelain→deep-plum",
      proofPlacement: "source qualifications at service, location and image disclosure",
      ctaDistribution: "hero, context-prefilled choice, closing and shared floating funnel",
      navigationPattern: "three anchors and separate compact mobile CTA",
      motionSignature: "one subtle editorial heading reveal with reduced-motion safe state transitions",
      closingStructure: "full-plum typographic request and distinct demo disclaimer",
      roleGraph: ["local discovery", "care selection", "location reassurance", "media truth", "faq", "lead capture"],
      mediaCadence: ["vector magazine hero", "type-led selector", "typographic place", "two abstract graphic accents"],
      interactionLoci: ["pressed selection", "contextual booking modal", "native FAQ", "external maps"],
      decisionAidPlacement: ["choice before user details", "location ahead of questions", "qualification before submit"],
      densityRhythm: ["large impact", "medium decision", "open local", "quiet disclosure", "answers", "focused CTA"],
      mobileCompositionStrategy: "single column with full width hero art; options stacked; sticky contact anchor and no horizontal overflow"
    }
  }
};

export const Route = createFileRoute("/portfolio/espaco-marli-nails-guaratuba")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      // Draft. Promover a indexable somente depois de gates e autorização.
      { name: "robots", content: "noindex,nofollow,max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Espaço Marli Nails Designer — demonstração independente" },
      { property: "og:image", content: social },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Capa ilustrada do portfólio demonstrativo Espaço Marli Nails" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: social }
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "icon", type: "image/svg+xml", href: "/images/espaco-marli-nails-guaratuba/logo.svg" }
    ],
    scripts: [{
      type: "application/ld+json",
      children: graph([
        organizationNode(),
        {
          "@type": "BeautySalon",
          "@id": url + "#business",
          name: "Espaço Marli Nails designer",
          url,
          description,
          image: social,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Alvorada do Sul, 786",
            addressLocality: "Guaratuba",
            addressRegion: "PR",
            postalCode: "83280-000",
            addressCountry: "BR"
          },
          areaServed: { "@type": "Place", name: "Coroados, Guaratuba, PR" }
        },
        breadcrumbNode([
          { name: "Início", path: "/" },
          { name: "Portfólio", path: "/portfolio" },
          { name: "Espaço Marli Nails", path: "/portfolio/espaco-marli-nails-guaratuba" }
        ])
      ])
    }]
  }),
  component: MarliPortfolioRoute
});

function MarliPortfolioRoute() {
  return (
    <PortfolioStandardShell slug={slug} contactLabelOverride="Consultar atendimento" funnelIntentOverride="agendamento"
      quizConfigOverride={{
        services: ["Manicure", "Pedicure", "Quero consultar os cuidados disponíveis"],
        experienceOptions: ["Primeira visita", "Já conheço o espaço", "Quero tirar dúvidas"],
        periodOptions: ["Manhã", "Tarde", "Tenho flexibilidade"],
        timingOptions: ["Nesta semana", "Na próxima semana", "Gostaria de saber os próximos horários"]
      }}>
      <PortfolioCompositionRoot composition={composition}>
        <EspacoMarliNailsGuaratubaPage />
      </PortfolioCompositionRoot>
    </PortfolioStandardShell>
  );
}
