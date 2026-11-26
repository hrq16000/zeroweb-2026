import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import type { CtaRenderOptions, PortfolioComposition } from "@/lib/portfolio-composition";

export const infinitoSpaComposition: PortfolioComposition = {
  slug: "infinito-spa",
  theme: { backgroundColor: "#f1eee5", color: "#1e3028" },
  motionIntensity: "SUBTLE",
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton clientKey="infinito-spa" companySlug="infinito-spa"
      formSlug="funnel-infinito-spa" location={`infinito-spa_${placement}`}
      className={className} showArrow={false}>{children}</FunnelCTAButton>
  ),
  brief: {
    businessPersonality: "Cercana, serena y personal; profesional independiente.",
    creativeConcept: "Cartograf铆a del descanso: recorrido visual hacia una pausa.",
    visualMetaphor: "Trazo de infinito y ciclos de respiraci贸n.",
    spatialLanguage: "P贸ster editorial, c铆rculos abiertos y cap铆tulos asim茅tricos.",
    heroConcept: "P贸ster verde profundo con t铆tulo monumental y arte orbital.",
    navigationConcept: "Anclas m铆nimas: experiencia, atenci贸n y preguntas.",
    contentRhythm: "P贸ster, recorrido, explicaci贸n, respuestas y cierre.",
    mediaNarrative: "Arte de marca; no se fingen fotos ni pruebas.",
    proofNarrative: "Solo hechos confirmados; sin rese帽as ni credenciales inventadas.",
    conversionNarrative: "Consultar con Roze mediante un 煤nico funil individual.",
    motionNarrative: "Revelaciones sutiles; si痘玘