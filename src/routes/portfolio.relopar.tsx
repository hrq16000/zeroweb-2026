import { createFileRoute } from "@tanstack/react-router";
import { ReloparPage } from "@/components/site/ReloparPage";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { graph, breadcrumbNode, organizationNode } from "@/lib/portfolio-seo";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
const slug="relopar";
const url="https://0web.com.br/portfolio/relopar";
const title="Relopar Curitiba | Relógios de Ponto e Assistência Técnica";
const description="Conheça a Relopar na Rua Cruz Machado, 344, Centro de Curitiba: relógios de ponto, controle de acesso e consulta sobre assistência técnica. Portfólio demonstrativo 0WEB.";
const social="https://0web.com.br/images/relopar/social-og.svg";
export const composition: PortfolioComposition = {
 slug, motionIntensity:"BALANCED",
 renderCta:({children,placement})=><a href="#solucoes" data-cta-placement={placement}>{children}</a>,
 brief:{
  businessPersonality:"Comércio técnico local, precisão, conhecimento de equipamentos empresariais.",
  creativeConcept:"Precisão que vira clareza: uma ficha técnica editorial de soluções de ponto.",
  visualMetaphor:"Relógio de ponto e tela de marcação com serial 344.",
  spatialLanguage:"Alto contraste, grids técnicos assimétricos e divisórias numeradas.",
  heroConcept:"Tipografia monumental industrial à esquerda, placa de identificação 344 à direita.",
  navigationConcept:"Wordmark compacto, âncoras curtas e CTA de triagem.",
  contentRhythm:"Engineering hero → linha de precisão → soluções numeradas → fotos documentais → guia de consulta → endereço → dúvidas → fechamento.",
  mediaNarrative:"Fotos reais do imóvel enviadas pelo operador; nenhuma fotografia de cliente ou equipe sintética.",
  proofNarrative:"Endereço e fachada verificados visualmente; fatos não comprovados rotulados.",
  conversionNarrative:"Assunto → descrição técnica → contato salvo em funil de amostra, sem WhatsApp inventado.",
  motionNarrative:"Elevação sutil de CTA e microfeedback, sem movimento automático obrigatório.",
  signatureMoments:["Placa de serial 344 amarela no hero","Serviços como matriz técnica com índices 01–04","Mosaico documental de fotos reais da rua"],
  compositionFingerprint:{
   heroGeometry:"dark technical editorial huge left typography and yellow serial plate right",
   headerTreatment:"compact squared R monogram and blue wordmark with navigation",
   sectionGraph:"dark-serial-hero→precision-ribbon→indexed-services→documentary-storefront→yellow-technical-intake→location-344→faq→dark-close",
   contentOrder:["proposta","serviços","evidências","triagem","endereço","dúvidas"],
   gridTopology:"hero 1.08/.92, numbered service list rows, documental photo 2-up, 3 steps, location split, FAQ columns",
   mediaDistribution:"real facade photos in documentary band; brand vector 344 instead of invented product stock",
   backgroundRhythm:"navy→stone→ink→yellow→paper→white→navy",
   proofPlacement:"photo documentary credits under each photo, sourced location and disclaimers",
   ctaDistribution:"header, hero, service rows, technical step, close and floating button",
   navigationPattern:"small industrial header and contextual jump anchors",
   motionSignature:"micro lift on yellow CTA, no automatic parallax, reduced motion safe",
   closingStructure:"dark editorial manifesto with demo disclaimer",
   roleGraph:["industrial introduction","service selection","documentary proof","technical triage","local wayfinding","FAQ"],
   mediaCadence:["technical graphic","icon service rows","two real user photos","typographic map"],
   interactionLoci:["CTA modal","service consultation","FAQ","maps link"],
   decisionAidPlacement:["service descriptions","three-step triage guide"],
   densityRhythm:["bold","measured","proof-led","compact","open","quiet"],
   mobileCompositionStrategy:"stacked hero, full-width service rows, two photos stacked, sticky floating consult CTA"
  }
 }
};
export const Route=createFileRoute("/portfolio/relopar")({
 head:()=>({
  meta:[
   {title},{name:"description",content:description},{name:"robots",content:"index,follow,max-image-preview:large,max-snippet:-1"},
   {property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},
   {property:"og:url",content:url},{property:"og:locale",content:"pt_BR"},{property:"og:site_name",content:"Relopar — Portfólio demonstrativo"},
   {property:"og:image",content:social},{name:"twitter:card",content:"summary_large_image"},
   {name:"twitter:title",content:title},{name:"twitter:description",content:description},{name:"twitter:image",content:social}
  ],
  links:[{rel:"canonical",href:url},{rel:"alternate",hrefLang:"pt-BR",href:url},{rel:"icon",type:"image/svg+xml",href:"/images/relopar/logo.svg"}],
  scripts:[{type:"application/ld+json",children:graph([
   organizationNode(),
   {"@type":"LocalBusiness","@id":`${url}#business`,name:"Relopar — Relógios de Ponto",url,description,image:social,
    address:{"@type":"PostalAddress",streetAddress:"Rua Cruz Machado, 344",addressLocality:"Curitiba",addressRegion:"PR",addressCountry:"BR"},
    hasMap:"https://www.google.com/maps/search/?api=1&query=Relopar%20Rua%20Cruz%20Machado%20344%20Curitiba"},
   breadcrumbNode([{name:"Início",path:"/"},{name:"Portfólio",path:"/portfolio"},{name:"Relopar",path:"/portfolio/relopar"}])
  ])}]
 }),
 component:ReloparPortfolio
});
function ReloparPortfolio(){return <PortfolioStandardShell slug={slug} clientKeyOverride="relopar" siteNameOverride="Relopar — Relógios de Ponto" contactLabelOverride="Consultar serviços" seoContextOverride={{city:"Curitiba",state:"PR",neighborhood:"Centro"}}><PortfolioCompositionRoot composition={composition}><ReloparPage/></PortfolioCompositionRoot></PortfolioStandardShell>}
