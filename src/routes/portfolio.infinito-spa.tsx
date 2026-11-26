import { createFileRoute } from "@tanstack/react-router";
import { InfinitoSpaPage } from "@/components/site/InfinitoSpaPage";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { graph, breadcrumbNode, organizationNode } from "@/lib/portfolio-seo";
import type { PortfolioComposition } from "@/lib/portfolio-composition";

const slug = "infinito-spa";
const url = "https://0web.com.br/portfolio/infinito-spa";
const social = "https://0web.com.br/images/infinito-spa/social-og.jpg";
const title = "Infinito Spa | Masajes y masoterapia en Santiago, Chile";
const description = "Propuesta visual demostrativa de Infinito Spa en Santiago, Chile. Consulta modalidades de masajes y coordina disponibilidad directamente con Roze.";

export const composition: PortfolioComposition = {
  slug,
  motionIntensity: "SUBTLE",
  renderCta: ({ children, placement }) => <a href="#contacto" data-cta-placement={placement}>{children}</a>,
  brief: {
    businessPersonality: "Serena, cercana, discreta y profesional; comunicación clara sin promesas terapéuticas.",
    creativeConcept: "Un espacio para volver a ti: pausa, conversación y coordinación consciente.",
    visualMetaphor: "Órbitas e infinito como continuidad entre pausa y movimiento; símbolo conceptual creado por 0WEB.",
    spatialLanguage: "Editorial asimétrico, verde bosque, marfil y arena; serif expresiva con sans utilitaria.",
    heroConcept: "Manifiesto tipográfico y arte abstracta circular; sin fotografía ficticia.",
    navigationConcept: "Wordmark conceptual, anclas cortas y CTA individual persistente.",
    contentRhythm: "Hero manifiesto → escucha → pasos de consulta → espacio privado → FAQ → cierre.",
    mediaNarrative: "Brand art SVG original; fotos reales del espacio aún no fueron aportadas.",
    proofNarrative: "Datos del intake; no se usan reseñas, certificaciones ni resultados inventados.",
    conversionNarrative: "Formulario breve en español chileno que continúa al WhatsApp del negocio.",
    motionNarrative: "Microinteracciones CSS sutiles, sin loops ni parallax; reduced motion elimina desplazamientos.",
    signatureMoments: ["Órbita infinita", "Manifiesto tipográfico", "Consulta en tres pasos"],
    compositionFingerprint: {
      heroGeometry: "cinematic editorial hero with asymmetric typography and orbit artwork",
      headerTreatment: "minimal conceptual wordmark",
      sectionGraph: "manifesto-hero→listening-intro→three-step-consultation→private-space→faq→dark-close",
      contentOrder: ["masajes", "escucha", "consulta", "espacio privado", "preguntas", "coordinación"],
      gridTopology: "asymmetric hero, editorial intro, three-step sequence, split private-space panel, FAQ stack, centered close",
      mediaDistribution: "abstract orbit SVG, conceptual mark, typographic cover and social card",
      backgroundRhythm: "forest→ivory→sand→ivory→forest",
      proofPlacement: "process and privacy facts; no testimonial module",
      ctaDistribution: "hero, private-space panel, final close and persistent funnel",
      navigationPattern: "concept wordmark, one anchor, persistent booking funnel",
      motionSignature: "static orbit, CTA lift, opacity transitions, reduced-motion safe",
      closingStructure: "quiet centered invitation on forest background",
      roleGraph: ["introduction", "service intent", "consultation process", "private space", "FAQ", "booking"],
      mediaCadence: ["abstract hero artwork", "brandmark", "typographic cover", "social OG"],
      interactionLoci: ["consultation funnel", "three-step narrative", "native FAQ"],
      decisionAidPlacement: ["what to ask", "availability confirmation", "privacy before booking"],
      densityRhythm: ["expressive", "airy", "compact", "quiet", "plain", "expressive"],
      mobileCompositionStrategy: "single-column editorial flow, no horizontal overflow, touch-sized FAQ and CTA"
    }
  }
};

export const Route = createFileRoute("/portfolio/infinito-spa")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description }, { name: "robots", content: "noindex,nofollow" },
      { property: "og:type", content: "website" }, { property: "og:site_name", content: "Infinito Spa" }, { property: "og:title", content: title },
      { property: "og:description", content: description }, { property: "og:url", content: url },
      { property: "og:image", content: social }, { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" }, { property: "og:locale", content: "es_CL" },
      { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }, { name: "twitter:image", content: social }
    ],
    links: [{ rel: "canonical", href: url }, { rel: "alternate", hrefLang: "es-CL", href: url }, { rel: "icon", type: "image/svg+xml", href: "/images/infinito-spa/mark.svg" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(graph([
      { "@type": "WebPage", "@id": url + "#webpage", url, name: title, description, inLanguage: "es-CL", isPartOf: { "@type": "WebSite", name: "0WEB", url: "https://0web.com.br" }, about: { "@id": url + "#service" } },
      { "@type": "Service", "@id": url + "#service", name: "Masajes y masoterapia", serviceType: "Masoterapia", provider: { "@type": "Organization", name: "Infinito Spa" }, areaServed: { "@type": "City", name: "Santiago", containedInPlace: { "@type": "Country", name: "Chile" } }, description: "Consulta de modalidades y coordinación de sesiones; detalles sujetos a confirmación directa." },
      organizationNode(), breadcrumbNode([{ name: "Inicio", url: "https://0web.com.br" }, { name: "Portafolio", url: "https://0web.com.br/portfolio" }, { name: "Infinito Spa", url }])
    ])) }]
  }),
  component: InfinitoSpaPortfolio
});

function InfinitoSpaPortfolio() {
  return <PortfolioStandardShell slug={slug} siteNameOverride="Infinito Spa" contactModeOverride="booking" contactLabelOverride="Consultar disponibilidad" localeOverride="es-CL" seoNetworkEnabled={false} seoContextOverride={{ city: "Santiago", state: "Chile", segment: "beleza", tags: ["masajes", "masoterapia", "bienestar"], summary: description }}>
    <PortfolioCompositionRoot composition={composition}><InfinitoSpaPage/></PortfolioCompositionRoot>
  </PortfolioStandardShell>;
}
