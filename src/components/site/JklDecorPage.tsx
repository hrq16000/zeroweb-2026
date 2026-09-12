/**
 * JKL Decor — móveis planejados sob medida (São José dos Pinhais / Curitiba e região).
 *
 * Terceiro projeto nascido inteiro no pipeline oficial de /portfolio/:slug
 * (docs/PORTFOLIO_PROJECT_LIFECYCLE.md). A arquitetura é declarada como
 * Blueprint e montada pelo `PortfolioBlueprintRenderer`.
 *
 * Regras editoriais aplicadas:
 * - FATO VERIFICADO = ficha pública do Google resolvida por Place ID
 *   (ChIJX_1YSWLIYqoRuK5h3vDp5OY), ingerida server-side em
 *   docs/portfolio/enrichment/serpapi/jkl-decor.json: nome, categoria
 *   (marceneiro), endereço, telefone, horários, nota 5,0, 3 avaliações e fotos;
 * - CONTEÚDO DECLARADO PELO CLIENTE = condições comerciais (12x sem juros,
 *   desconto à vista, entrega em até 20 dias, garantia, 100% MDF) e a lista de
 *   ambientes atendidos. Aparecem sempre identificados como informação da
 *   própria JKL Decor, nunca como dado auditado por terceiros;
 * - as fotos são públicas da ficha do Google (GOOGLE_USER_MEDIA), publicadas
 *   por terceiros e exibidas com atribuição, em uso editorial. Nenhuma imagem
 *   gerada representa a marcenaria, a equipe ou um projeto executado;
 * - contactMode = funnelOnly: o telefone é informação institucional (texto),
 *   nunca `tel:`, WhatsApp ou botão de ligar. Toda conversão passa pelo funil
 *   individual `funnel-jkl-decor`. Única exceção de link externo: Google Maps.
 */
import type { CSSProperties } from "react";
import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Hammer,
  Images,
  PencilRuler,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { PortfolioBlueprintRenderer } from "@/components/portfolio/blueprint/PortfolioBlueprintRenderer";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

/** Ficha pública confirmada por Place ID — usada para "como chegar" e atribuição. */
const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/search/?api=1&query=JKL%20Decor%20m%C3%B3veis%20planejados&query_place_id=ChIJX_1YSWLIYqoRuK5h3vDp5OY";

/** Atribuição obrigatória da mídia pública reaproveitada da ficha do Google. */
const MEDIA_ATTRIBUTION =
  "Fotos de projetos publicadas na ficha pública da JKL Decor no Google, exibidas com atribuição à fonte.";

/** Marca a fronteira entre fato verificado e informação declarada pelo cliente. */
const CLIENT_DECLARED = "Condições informadas pela própria JKL Decor.";

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Cozinha planejada",
    "Guarda-roupa ou closet",
    "Painel e rack de TV",
    "Home office ou escritório",
    "Banheiro e lavanderia",
    "Cozinha infantil, nichos e porta-tempero",
    "Mais de um ambiente",
  ],
  experienceOptions: [
    "Já tenho as medidas",
    "Tenho projeto ou planta",
    "Tenho só uma ideia e fotos",
    "O ambiente ainda está em obra",
    "Quero renovar um móvel existente",
  ],
  periodOptions: [
    "São José dos Pinhais",
    "Curitiba",
    "Região metropolitana",
    "Vou confirmar o endereço",
  ],
  timingOptions: ["O quanto antes", "Nas próximas semanas", "Estou planejando", "Só levantando preço"],
  stepTitles: {
    service: "Qual ambiente você quer planejar?",
    experience: "Como está o projeto hoje?",
    period: "Onde o móvel vai ser instalado?",
    timing: "Para quando você precisa?",
    note: "Quer contar mais alguma coisa?",
  },
  notePlaceholder: "Conte as medidas aproximadas, as cores que gosta e como usa o ambiente.",
};

/** Funil individual da marcenaria — único canal comercial do projeto. */
function renderCta({ children, className }: CtaRenderOptions) {
  return (
    <PortfolioCTAQuiz
      clientKey="jkl-decor"
      studioName="JKL Decor"
      recipientName="o Jeferson, da JKL Decor"
      theme="gold"
      mode="proposal"
      quizConfig={quizConfig}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

/**
 * Identidade só desta marcenaria: base clara de ambiente entregue, verde
 * profundo de MDF fosco e um dourado de puxador como acento. Nada do carvão
 * do Careca's nem do grafite/laranja da Moreira.
 */
const theme = {
  "--background": "oklch(0.975 0.006 95)",
  "--foreground": "oklch(0.24 0.024 155)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.24 0.024 155)",
  "--muted": "oklch(0.94 0.009 95)",
  "--muted-foreground": "oklch(0.47 0.019 155)",
  "--primary": "oklch(0.36 0.056 158)",
  "--primary-foreground": "oklch(0.98 0.006 95)",
  "--border": "oklch(0.88 0.011 95)",
  "--ring": "oklch(0.36 0.056 158)",
} as CSSProperties;

/** Quebra de ritmo: uma única banda escura no meio da página. */
const darkSurface = {
  "--background": "oklch(0.24 0.032 158)",
  "--foreground": "oklch(0.96 0.008 95)",
  "--card": "oklch(0.29 0.032 158)",
  "--card-foreground": "oklch(0.96 0.008 95)",
  "--muted": "oklch(0.31 0.028 158)",
  "--muted-foreground": "oklch(0.83 0.014 95)",
  "--primary": "oklch(0.78 0.09 78)",
  "--primary-foreground": "oklch(0.22 0.03 158)",
  "--border": "oklch(0.38 0.028 158)",
} as CSSProperties;

export const blueprint: PortfolioBlueprint = {
  slug: "jkl-decor",
  identity: {
    name: "JKL Decor",
    /**
     * IDENTITY_COMPLETENESS_GATE = WORDMARK_CREATED (adendo de autonomia §3–§6).
     * A pesquisa pública não encontrou logotipo da marcenaria. Este wordmark foi
     * criado pela 0WEB para a apresentação digital (GENERATED_BRAND_ASSET); não
     * é marca histórica do cliente e será substituído por uma logo oficial.
     */
    logo: {
      src: "/images/jkl-decor/logo.png",
      alt: "JKL Decor — móveis planejados sob medida",
      width: 1536,
      height: 512,
      managedField: "logoUrl",
    },
    tagline: "Móveis planejados sob medida — São José dos Pinhais, Curitiba e região",
    nav: [
      { label: "Ambientes", href: "#ambientes" },
      { label: "Como fazemos", href: "#como-fazemos" },
      { label: "Avaliações", href: "#avaliacoes" },
      { label: "Atendimento", href: "#atendimento" },
    ],
  },
  /**
   * Motion profile desta marcenaria (docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md §4).
   * Movimento de marcenaria: peças que assentam no lugar. As fotos entram por
   * revelação em escala curta, os ambientes deslizam como gaveta ao hover, a
   * banda escura ganha profundidade leve e o roteiro do projeto se preenche
   * conforme o scroll — como um móvel montado etapa por etapa.
   */
  motionProfile: {
    intensity: "EXPRESSIVE",
    personality: "cabinetry-settling",
    entrance: ["fade", "slide", "scale", "stagger"],
    scroll: ["scrollReveal", "imageParallax", "scrollProgress"],
    hover: ["hoverLift", "imageZoom", "iconMotion"],
    typography: ["textReveal"],
    media: ["imageReveal", "imageParallax"],
    transitions: ["colorTransition"],
    signatureEffects: [
      "drawer-slide-ambientes",
      "assembly-progress-roteiro",
      "verified-google-counter",
    ],
    reducedMotionStrategy: "instant-with-opacity",
    mobileStrategy: "sem parallax e sem hover; entradas curtas em opacidade e deslocamento mínimo",
  },
  theme,
  layout: {
    // Percepção: BALANCED deixava as entradas quase imperceptíveis em tela
    // grande. EXPRESSIVE mantém a personalidade "cabinetry-settling" dentro
    // dos limites do contrato global (distância 26px, 520ms).
    motionIntensity: "EXPRESSIVE",
    maxWidth: "max-w-[1460px]",
    headerCtaLabel: "Pedir orçamento",
    /** Acesso persistente ao funil (adendo de autonomia §10–§13). */
    floatingConversion: {
      mode: "enabled",
      label: "Planejar meu ambiente",
      hint: "Orçamento",
    },
  },
  sections: [
    {
      type: "hero",
      variant: "fullBleed",
      order: 10,
      id: "inicio-jkl",
      motion: { intensity: "EXPRESSIVE", reveal: "scale", stagger: 90, parallax: 26 },
      content: {
        eyebrow: "Marcenaria · São José dos Pinhais, Curitiba e região",
        headline: "Cada centímetro do ambiente vira móvel planejado.",
        subheadline:
          "A JKL Decor projeta e fabrica móveis sob medida em MDF para cozinha, dormitório, banheiro, home office e ambientes em geral. Conte o ambiente pelo formulário e receba o orçamento do Jeferson.",
        image: {
          src: "/images/jkl-decor/google-estante-iluminada.jpg",
          alt: "Estante planejada de nichos escuros com iluminação embutida instalada em sala de estar",
          width: 1205,
          height: 1600,
          priority: true,
        },
        highlights: [
          "Nota 5,0 no Google",
          "Atendimento em Curitiba e região",
          "Orçamento à distância ou presencial",
        ],
        ctaLabel: "Pedir orçamento sem compromisso",
        secondary: { label: "Ver ambientes entregues", href: "#ambientes" },
      },
    },
    {
      /**
       * Faixa de sinais verificados. Todos os números vêm da ficha pública do
       * Google resolvida por Place ID — a contagem animada só existe sobre
       * valores auditáveis (MOTION: "verified-google-counter").
       */
      type: "signals",
      variant: "strip",
      order: 15,
      id: "sinais-jkl",
      motion: { reveal: "up", stagger: 60 },
      content: {
        items: [
          { value: "5,0 de 5", label: "Nota pública no Google", icon: Star },
          {
            value: "3 avaliações",
            countTo: 3,
            countSuffix: " avaliações",
            label: "Todas de cinco estrelas, com autor e link de origem",
            icon: BadgeCheck,
          },
          {
            value: "20 fotos",
            countTo: 20,
            countSuffix: " fotos",
            label: "Projetos publicados na ficha pública da marcenaria",
            icon: Images,
          },
          {
            value: "Seg a sex · 08h–18h",
            label: "Sábado e domingo fechado",
            icon: CalendarClock,
          },
          
        ],
        attribution:
          "Dados da ficha pública da JKL Decor no Google (Place ID confirmado), coletados em 11/09/2026.",
      },
    },
    {
      type: "useCases",
      variant: "imageGrid",
      order: 20,
      id: "ambientes",
      motion: { reveal: "up", stagger: 90, hover: "lift" },
      content: {
        eyebrow: "Ambientes entregues",
        title: "Projetos reais, fotografados nos próprios ambientes",
        intro:
          "Estas fotos vêm da ficha pública da JKL Decor no Google. Nenhuma imagem foi gerada, comprada em banco ou emprestada de outra marcenaria.",
        items: [
          {
            title: "Cozinha em MDF branco",
            text: "Armários de piso e torre com bancada em mármore, aproveitando o L completo do ambiente.",
            image: {
              src: "/images/jkl-decor/google-cozinha-marmore.jpg",
              alt: "Cozinha planejada em MDF branco com bancada e revestimento em mármore",
              width: 1600,
              height: 1205,
            },
          },
          {
            title: "Painel de TV com estante",
            text: "Painel em madeira, prateleiras suspensas e balcão baixo desenhados para a parede da sala.",
            image: {
              src: "/images/jkl-decor/google-painel-tv.jpg",
              alt: "Painel de TV planejado em madeira com prateleiras e balcão branco",
              width: 1205,
              height: 1600,
            },
          },
          {
            title: "Home office integrado",
            text: "Bancada de trabalho, armários altos e nichos combinando duas cores de MDF no mesmo ambiente.",
            image: {
              src: "/images/jkl-decor/google-home-office.jpg",
              alt: "Home office planejado com bancada, armários altos e nichos em dois tons de MDF",
              width: 1205,
              height: 1600,
            },
          },
          {
            title: "Cozinha em verde fosco",
            text: "Ilha central e armários em acabamento verde, um projeto inteiro pensado a partir da cor.",
            image: {
              src: "/images/jkl-decor/google-cozinha-verde.jpg",
              alt: "Cozinha planejada em MDF verde fosco com ilha central",
              width: 1205,
              height: 1600,
            },
          },
          {
            title: "Gabinete de banheiro",
            text: "Gabinete sob medida com tampo e cuba, resolvendo o espaço apertado do banheiro.",
            image: {
              src: "/images/jkl-decor/google-banheiro.jpg",
              alt: "Gabinete de banheiro planejado em MDF claro com tampo e cuba",
              width: 1205,
              height: 1600,
            },
          },
          {
            title: "Nichos e iluminação",
            text: "Estante de nichos assimétricos com fita de LED embutida, feita para a parede da sala.",
            image: {
              src: "/images/jkl-decor/google-estante-iluminada.jpg",
              alt: "Estante de nichos escuros com iluminação embutida em sala de estar",
              width: 1205,
              height: 1600,
            },
          },
        ],
      },
    },
    {
      type: "capabilities",
      variant: "band",
      order: 30,
      theme: darkSurface,
      motion: { reveal: "fade", stagger: 70, parallax: 18 },
      content: {
        eyebrow: "O que a JKL Decor faz",
        title: "Da cozinha inteira ao porta-tempero",
        intro:
          "A ficha pública registra a JKL Decor como marcenaria. A lista abaixo é a relação de ambientes e peças informada pela própria empresa — o que cabe no seu espaço é definido no projeto.",
        groups: [
          {
            title: "Ambientes completos",
            icon: PencilRuler,
            items: [
              "Cozinha planejada",
              "Dormitório, guarda-roupa e closet",
              "Sala com painel de TV e estante",
              "Home office e escritório",
              "Banheiro e lavanderia",
            ],
          },
          {
            title: "Peças sob medida",
            icon: Hammer,
            items: [
              "Cozinha infantil em MDF",
              "Porta-tempero",
              "Nichos para quarto e banheiro",
              "Balcões, bancadas e ilhas",
              "Móveis para ambientes em geral",
            ],
          },
          {
            title: "Como o projeto acontece",
            icon: Ruler,
            items: [
              "Orçamento à distância ou presencial",
              "Projeto conversado antes de produzir",
              "Fabricação sob medida do ambiente",
              "Instalação no local",
            ],
          },
        ],
        image: {
          src: "/images/jkl-decor/google-cozinha-verde.jpg",
          alt: "",
          width: 1205,
          height: 1600,
        },
        note: `Relação de ambientes e peças informada pela JKL Decor. Categoria "marceneiro" e localização conforme a ficha pública no Google em 11/09/2026.`,
      },
    },
    {
      type: "offers",
      variant: "alternating",
      order: 40,
      id: "como-fazemos",
      motion: { reveal: "left", stagger: 80, hover: "lift" },
      content: {
        eyebrow: "Como fazemos",
        title: "Móvel sob medida é medida, encaixe e acabamento",
        intro:
          "Cada projeto começa entendendo como a família usa o ambiente. É isso que decide altura de bancada, sentido de porta, quantidade de gaveta e onde entra a iluminação.",
        items: [
          {
            title: "Medida do ambiente",
            text: "O móvel é desenhado para as medidas reais da parede, do piso e do teto — inclusive quando o ambiente ainda está em obra.",
            icon: Ruler,
            meta: "Ponto de partida de todo orçamento",
          },
          {
            title: "Projeto conversado",
            text: "Cor do MDF, tipo de puxador, portas de correr ou de abrir, nichos, iluminação: tudo é combinado antes de a peça ir para produção.",
            icon: PencilRuler,
          },
          {
            title: "Fabricação e instalação",
            text: "As peças são produzidas sob medida e instaladas no ambiente pela própria equipe, com o acerto final feito no local.",
            icon: Hammer,
          },
          {
            title: "Um ambiente por vez ou a casa toda",
            text: "Dá para começar pela cozinha e voltar depois para o quarto — vários clientes retornam para o próximo cômodo.",
            icon: Sparkles,
            meta: "Retorno de clientes citado nas avaliações públicas",
          },
        ],
        ctaLabel: "Contar o meu ambiente",
      },
    },
    {
      type: "trust",
      variant: "cards",
      order: 50,
      motion: { reveal: "up", stagger: 70, hover: "lift" },
      content: {
        items: [
          {
            title: "12x sem juros",
            text: "Parcelamento informado pela JKL Decor para fechar o projeto.",
            icon: CreditCard,
          },
          {
            title: "Desconto à vista",
            text: "Condição especial para pagamento à vista, combinada no orçamento.",
            icon: BadgeCheck,
          },
          {
            title: "Entrega em até 20 dias",
            text: "Prazo informado pela empresa; o prazo do seu projeto é confirmado no orçamento.",
            icon: Truck,
          },
          {
            title: "100% MDF com garantia",
            text: "Material e garantia informados pela JKL Decor para os móveis produzidos.",
            icon: ShieldCheck,
          },
        ],
        note: `${CLIENT_DECLARED} Não são dados auditados por terceiros: prazo, condição de pagamento e cobertura da garantia são confirmados no orçamento do seu projeto.`,
      },
    },
    {
      type: "proof",
      variant: "reviews",
      order: 60,
      id: "avaliacoes",
      motion: { reveal: "up", stagger: 80 },
      content: {
        eyebrow: "Avaliações",
        title: "O que os clientes escreveram no Google",
        intro:
          "A ficha pública da JKL Decor tem nota 5,0 em 3 avaliações. São poucas e recentes — estão aqui na íntegra, com autor, data e link para a origem.",
        summary: {
          value: "5,0",
          count: "3 avaliações",
          label: "Nota pública no Google",
          sourceLabel: "Ver no Google",
          sourceHref: GOOGLE_PLACE_URL,
        },
        items: [
          {
            author: "Fabio JCP",
            rating: 5,
            date: "há 4 meses",
            text: "O Jeferson e sua empresa surpreenderam desde o primeiro contato, com orçamento à distância de forma precisa e rápida. Com qualidade de todo material, sendo o nossa cozinha 100% MDF. Além do melhor preço que encontrei, outra surpresa foi o prazo prometido de 20 dias montado, e entregou antes do prometido para nossa felicidade e conforto, pois tínhamos também pressa para a mudança. Super recomendo, com certeza teremos novas negociações para demais cômodos da casa.",
            sourceLabel: "Google",
            sourceHref:
              "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21VeWNWUmlkbEpLZEdsblpWOTJXakZzTlhGQmNHYxAB!2m1!1s0x0:0xe6e4e9f0de61aeb8!3m1!1s2@1:CAIQACodChtycF9oOmUycVRidlJKdGlnZV92WjFsNXFBcGc%7C%7C?hl=pt-BR",
          },
          {
            author: "Edilaine marques",
            rating: 5,
            date: "há 3 semanas",
            text: "Gostamos demais do trabalho, com certeza iremos fazer mais coisas com vcs. Foi tudo no prazo combinado, serviço muito bem feito! Além da Super Educação do proprietário…",
            sourceLabel: "Google",
            sourceHref:
              "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25SeWFXTnRWV2d4ZVRWWFpsOXRiMkZ2WVc5UGEwRRAB!2m1!1s0x0:0xe6e4e9f0de61aeb8!3m1!1s2@1:CAIQACodChtycF9oOnRyaWNtVWgxeTVXZl9tb2FvYW9Pa0E%7C%7C?hl=pt-BR",
          },
          {
            author: "Tiago Barbosa",
            rating: 5,
            date: "há 1 semana",
            text: "Muito bom o serviço, recomendo",
            sourceLabel: "Google",
            sourceHref:
              "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21OelkyWnZiVVE1VTI1aU0xaE5PSGMyUjJOcWNsRRAB!2m1!1s0x0:0xe6e4e9f0de61aeb8!3m1!1s2@1:CAIQACodChtycF9oOmNzY2ZvbUQ5U25iM1hNOHc2R2NqclE%7C%7C?hl=pt-BR",
          },
        ],
        attribution:
          "Avaliações públicas no Google, coletadas em 11/09/2026. A ficha tem 3 avaliações no total, todas de cinco estrelas — nada foi selecionado para esconder nota baixa.",
        ctaLabel: "Pedir meu orçamento",
      },
    },
    {
      type: "process",
      variant: "timeline",
      order: 70,
      motion: { reveal: "right", stagger: 90, scrollProgress: true },
      content: {
        eyebrow: "Do formulário ao móvel instalado",
        title: "Como começa o seu projeto",
        intro:
          "Este é o caminho a partir desta página. Valor, prazo e detalhes de fabricação são definidos no orçamento, direto com a JKL Decor.",
        steps: [
          {
            title: "Descreva o ambiente",
            meta: "1 minuto",
            text: "Diga qual cômodo, como está hoje e o que você imagina. Se já tiver medidas, planta ou fotos, melhor ainda.",
          },
          {
            title: "O Jeferson recebe e retorna",
            meta: "Seg a sex, 08h–18h",
            text: "A solicitação chega direto para a JKL Decor, com o ambiente e a região do atendimento.",
          },
          {
            title: "Orçamento à distância ou visita",
            text: "Um cliente descreveu publicamente o orçamento à distância como preciso e rápido; quando o projeto pede, a medição é feita no local.",
          },
          {
            title: "Produção e instalação",
            text: "Projeto aprovado, o móvel é fabricado sob medida e instalado no ambiente. O prazo do seu projeto é o combinado no orçamento.",
          },
        ],
        ctaLabel: "Começar pelo formulário",
        note: "Nenhum valor é fechado por esta página: ela organiza o pedido e leva a informação para a marcenaria.",
      },
    },
    {
      type: "cta",
      variant: "immersive",
      order: 80,
      motion: { reveal: "fade", parallax: 20 },
      content: {
        eyebrow: "Próximo passo",
        title: "Conte o ambiente. O orçamento é sem compromisso.",
        text: "Cozinha, quarto, banheiro, home office ou um móvel específico: descreva o que precisa e a JKL Decor responde com o próximo passo.",
        ctaLabel: "Pedir orçamento sem compromisso",
        image: {
          src: "/images/jkl-decor/google-home-office.jpg",
          alt: "",
          width: 1205,
          height: 1600,
        },
      },
    },
    {
      type: "location",
      variant: "panel",
      order: 90,
      id: "atendimento",
      motion: { reveal: "left", stagger: 70 },
      content: {
        eyebrow: "Atendimento",
        title: "Agaraú, São José dos Pinhais — atendendo Curitiba e região",
        intro:
          "A marcenaria fica em São José dos Pinhais e o atendimento acontece no ambiente do cliente. O pedido de orçamento é feito pelo formulário desta página.",
        address: [
          "R. Durval Moletta — Agaraú",
          "São José dos Pinhais — PR",
          "CEP 83149-899",
        ],
        hours: [
          { days: "Segunda a sexta", hours: "08:00 – 18:00" },
          { days: "Sábado", hours: "Fechado" },
          { days: "Domingo", hours: "Fechado" },
        ],
        contact: [
          { label: "Telefone da marcenaria (informação da ficha pública)", value: "(41) 99142-5088" },
          { label: "Área de atendimento informada pela empresa", value: "Curitiba e região metropolitana" },
        ],
        mapsLink: { label: "Abrir no Google Maps", href: GOOGLE_PLACE_URL },
        image: {
          src: "/images/jkl-decor/google-cozinha-marmore.jpg",
          alt: "Cozinha planejada em MDF branco entregue pela JKL Decor",
          width: 1600,
          height: 1205,
        },
        note: `O telefone acima é informação institucional da ficha pública, não um canal de atendimento deste site: o pedido de orçamento chega à marcenaria pelo formulário. ${MEDIA_ATTRIBUTION}`,
        ctaLabel: "Pedir orçamento agora",
      },
    },
    {
      type: "faq",
      variant: "accordion",
      order: 100,
      motion: { reveal: "fade", stagger: 60 },
      content: {
        eyebrow: "Perguntas frequentes",
        title: "Antes de pedir o orçamento",
        items: [
          {
            q: "A JKL Decor atende Curitiba?",
            a: "Sim. A marcenaria fica no Agaraú, em São José dos Pinhais, e a própria empresa informa atendimento em Curitiba e região.",
          },
          {
            q: "Consigo orçamento sem receber visita?",
            a: "Sim, é possível iniciar com orçamento à distância — um cliente descreveu publicamente esse atendimento como preciso e rápido. Quando o projeto pede, a medição é feita no local.",
          },
          {
            q: "Quanto tempo leva para ficar pronto?",
            a: "A JKL Decor informa entrega em até 20 dias. Esse é um prazo informado pela empresa: o prazo do seu projeto é o combinado no orçamento.",
          },
          {
            q: "Que material é usado?",
            a: "A empresa informa móveis 100% MDF, com garantia. As condições de garantia são tratadas diretamente com a marcenaria.",
          },
          {
            q: "Dá para fazer só um móvel pequeno?",
            a: "Sim. Além dos ambientes completos, a empresa informa cozinha infantil em MDF, porta-tempero, nichos para quarto e banheiro e móveis para ambientes em geral.",
          },
          {
            q: "Consigo saber o preço pelo site?",
            a: "Não. O valor depende do ambiente, das medidas e do acabamento escolhido. Esta página organiza o pedido e leva sua descrição para a JKL Decor.",
          },
          {
            q: "As avaliações mostradas aqui são reais?",
            a: "Sim. São as avaliações públicas do Google, com autor, nota, data aproximada e link para a origem. A ficha tem 3 avaliações, todas de cinco estrelas.",
          },
          {
            q: "Qual é o horário de atendimento?",
            a: "De segunda a sexta, das 08h às 18h, conforme a ficha pública no Google. Sábado e domingo não há atendimento.",
          },
        ],
        ctaLabel: "Pedir orçamento sem compromisso",
      },
    },
  ],
  renderCta,
  afterContent: (
    <>
      <PortfolioHostCredit />
    </>
  ),
};

export function JklDecorPage() {
  return <PortfolioBlueprintRenderer blueprint={blueprint} />;
}
