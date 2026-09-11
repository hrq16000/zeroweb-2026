/**
 * LAB — Landing piloto de MOTION (uso interno da 0WEB).
 *
 * Objetivo: validar o pipeline de motion do Portfolio Blueprint
 * (docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md) sem cliente real e sem
 * conteúdo real.
 *
 * Regras desta página:
 * - NÃO é um /portfolio/:slug e NÃO entra no catálogo, sitemap ou registry;
 * - todo o texto é rótulo de amostra (Lorem operacional). Nenhum nome de
 *   empresa, avaliação, número, endereço, telefone ou prova é real;
 * - as imagens são arte abstrata gerada, sem representar negócio, equipe,
 *   obra ou serviço;
 * - o CTA não abre funil de cliente: só rola até uma nota de amostra;
 * - a rota é noindex.
 *
 * Cobertura de motion exercitada aqui: reveal por seção, stagger, parallax de
 * mídia, contagem animada, hover lift, hover glow, zoom de imagem, progresso
 * de timeline por scroll, CTA flutuante e comportamento com
 * `prefers-reduced-motion`.
 */
import type { CSSProperties } from "react";
import { Activity, Baseline, Gauge, Layers, MousePointerClick, Sparkles, Timer } from "lucide-react";
import { PortfolioBlueprintRenderer } from "@/components/portfolio/blueprint/PortfolioBlueprintRenderer";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

const HERO_IMAGE = {
  src: "/images/_lab/motion-pilot-hero.jpg",
  alt: "Arte abstrata de amostra usada para testar parallax e profundidade",
  width: 1600,
  height: 1104,
  priority: true,
};

const MEDIA_IMAGE = {
  src: "/images/_lab/motion-pilot-media.jpg",
  alt: "Arte abstrata de amostra usada para testar zoom e hover em mídia",
  width: 1408,
  height: 912,
};

/** CTA de amostra: nunca um funil de cliente, nunca telefone ou WhatsApp. */
function renderCta({ children, className }: CtaRenderOptions) {
  return (
    <a href="#amostra-nota" className={className}>
      {children}
    </a>
  );
}

const theme: CSSProperties = {
  ["--background" as string]: "220 22% 8%",
  ["--foreground" as string]: "210 20% 96%",
  ["--card" as string]: "220 20% 12%",
  ["--border" as string]: "220 14% 24%",
  ["--primary" as string]: "174 72% 46%",
  ["--primary-foreground" as string]: "220 30% 8%",
  ["--muted-foreground" as string]: "215 14% 68%",
} as CSSProperties;

export const blueprint: PortfolioBlueprint = {
  slug: "lab-motion-pilot",
  identity: {
    name: "LAB · Motion Pilot",
    tagline: "Landing de amostra — sem conteúdo real",
    nav: [
      { label: "Parallax", href: "#inicio" },
      { label: "Contagem", href: "#amostra-sinais" },
      { label: "Timeline", href: "#amostra-processo" },
    ],
    footerNote: "Página interna de validação técnica. Não representa cliente algum.",
  },
  theme,
  motionProfile: {
    intensity: "EXPRESSIVE",
    personality: "Laboratório: cada efeito aparece isolado e rotulado para ser medido.",
    entrance: ["reveal up com stagger por item", "mask no título do hero"],
    scroll: ["parallax de mídia no hero (desktop)", "progresso da timeline do processo"],
    hover: ["lift em cards", "glow em blocos de capacidade", "zoom leve em mídia"],
    typography: ["reveal em duas camadas no headline"],
    media: ["parallax + zoom contido, sempre em transform/opacity"],
    transitions: ["300–520ms, ease-out"],
    signatureEffects: [
      "faixa de contagem animada com números de amostra",
      "timeline que preenche conforme o scroll",
    ],
    reducedMotionStrategy:
      "prefers-reduced-motion remove parallax, zoom e deslocamento; todo o conteúdo permanece visível.",
    mobileStrategy: "mobile sem parallax e sem hover; apenas reveal curto.",
  },
  layout: {
    motionIntensity: "EXPRESSIVE",
    maxWidth: "max-w-6xl",
    headerCtaLabel: "Ver nota de amostra",
    floatingConversion: {
      mode: "enabled",
      label: "CTA flutuante (amostra)",
      hint: "Valida aparecimento após 60% e ocultação junto ao rodapé.",
    },
  },
  sections: [
    {
      type: "hero",
      variant: "fullBleed",
      order: 10,
      motion: { reveal: "mask", intensity: "EXPRESSIVE", parallax: 30 },
      content: {
        eyebrow: "Amostra interna",
        headline: "Piloto de motion — conteúdo fictício",
        subheadline:
          "Esta página existe apenas para medir entrada, parallax, hover, contagem e timeline antes de aplicar motion em um projeto real.",
        image: HERO_IMAGE,
        ctaLabel: "Ver nota de amostra",
        secondary: { label: "Ir para a timeline", href: "#amostra-processo" },
        highlights: ["Sem cliente", "Sem dado real", "Somente validação técnica"],
      },
    },
    {
      id: "amostra-sinais",
      type: "signals",
      variant: "strip",
      order: 20,
      motion: { reveal: "up", stagger: 80 },
      content: {
        items: [
          { value: "000 amostra", label: "Contador em zero", icon: Gauge, countTo: 0, countSuffix: " amostra" },
          { value: "12 amostra", label: "Contador crescente", icon: Activity, countTo: 12, countSuffix: " amostra" },
          { value: "480 ms", label: "Duração alvo", icon: Timer, countTo: 480, countSuffix: " ms" },
        ],
        attribution: "Números fictícios de laboratório. Nenhuma métrica real.",
      },
    },
    {
      type: "capabilities",
      variant: "band",
      order: 30,
      motion: { reveal: "up", stagger: 70, hover: "glow" },
      content: {
        eyebrow: "Amostra",
        title: "Efeitos cobertos por este piloto",
        intro: "Cada grupo abaixo é texto de amostra; o que está sendo validado é o comportamento visual.",
        groups: [
          { title: "Entrada", items: ["reveal up", "reveal mask", "stagger"], icon: Sparkles },
          { title: "Scroll", items: ["parallax de mídia", "progresso de timeline"], icon: Layers },
          { title: "Ponteiro", items: ["lift", "glow", "zoom contido"], icon: MousePointerClick },
          { title: "Tipografia", items: ["headline em camadas", "baseline estável"], icon: Baseline },
        ],
        image: MEDIA_IMAGE,
        note: "Conteúdo de amostra — não usar como referência editorial.",
      },
    },
    {
      type: "useCases",
      variant: "imageGrid",
      order: 40,
      motion: { reveal: "up", stagger: 90, hover: "lift" },
      content: {
        eyebrow: "Amostra",
        title: "Cards com hover e zoom",
        intro: "Blocos fictícios para observar lift, borda e zoom de imagem sem quebra de layout.",
        items: [
          { title: "Bloco de amostra A", text: "Texto de amostra para medir altura, contraste e ritmo.", image: MEDIA_IMAGE },
          { title: "Bloco de amostra B", text: "Texto de amostra para medir altura, contraste e ritmo.", image: MEDIA_IMAGE },
          { title: "Bloco de amostra C", text: "Texto de amostra para medir altura, contraste e ritmo.", image: MEDIA_IMAGE },
        ],
      },
    },
    {
      id: "amostra-processo",
      type: "process",
      variant: "timeline",
      order: 50,
      motion: { reveal: "up", stagger: 70, scrollProgress: true },
      content: {
        eyebrow: "Amostra",
        title: "Timeline com progresso por scroll",
        intro: "Quatro etapas fictícias apenas para validar o preenchimento da linha.",
        steps: [
          { title: "Etapa 1 (amostra)", text: "Texto de amostra.", meta: "00" },
          { title: "Etapa 2 (amostra)", text: "Texto de amostra.", meta: "01" },
          { title: "Etapa 3 (amostra)", text: "Texto de amostra.", meta: "02" },
          { title: "Etapa 4 (amostra)", text: "Texto de amostra.", meta: "03" },
        ],
        note: "Nenhum prazo, preço ou garantia é declarado aqui.",
      },
    },
    {
      id: "amostra-nota",
      type: "cta",
      variant: "immersive",
      order: 60,
      motion: { reveal: "scale" },
      content: {
        eyebrow: "Nota de amostra",
        title: "Fim do piloto de motion",
        text: "Nenhum dado desta página é real e nenhum contato é coletado. O CTA existe só para validar posicionamento, foco e acessibilidade.",
        ctaLabel: "Recomeçar do topo",
        image: HERO_IMAGE,
      },
    },
  ],
  renderCta,
};

export function MotionPilotPage() {
  return <PortfolioBlueprintRenderer blueprint={blueprint} />;
}
