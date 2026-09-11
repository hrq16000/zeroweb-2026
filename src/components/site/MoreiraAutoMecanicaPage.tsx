/**
 * Moreira Auto Mecânica — segundo projeto nascido inteiro no pipeline oficial
 * de /portfolio/:slug (docs/PORTFOLIO_PROJECT_LIFECYCLE.md).
 *
 * A arquitetura da página é declarada como Blueprint e montada pelo
 * `PortfolioBlueprintRenderer`. Nada aqui foi copiado de outro cliente:
 * composição, ritmo, tipografia, paleta, mídia, narrativa e CTA são desta
 * oficina.
 *
 * Regras editoriais aplicadas:
 * - fato publicado = fato verificado na ficha pública do Google
 *   (Place ID ChIJgYYezAz63JQRk2SRKP5Usqk), ingerida server-side em
 *   docs/portfolio/enrichment/serpapi/moreira-auto-mecanica.json: nome,
 *   categoria, endereço, telefone, horários, nota, número de avaliações,
 *   distribuição de estrelas, formas de pagamento e acessibilidade;
 * - as fotos são públicas da ficha do Google (GOOGLE_USER_MEDIA), exibidas
 *   com atribuição; nenhuma imagem gerada representa a oficina, a equipe,
 *   clientes ou serviços executados;
 * - nada de prazo, preço, garantia, tempo de mercado, marcas atendidas ou
 *   lista de serviços que a oficina não publicou;
 * - contactMode = funnelOnly: o telefone é informação institucional (texto),
 *   nunca `tel:`, WhatsApp ou botão de ligar. Toda conversão passa pelo funil
 *   individual.
 */
import type { CSSProperties } from "react";
import {
  Accessibility,
  CalendarClock,
  ClipboardList,
  CreditCard,
  Gauge,
  MapPin,
  Star,
  Warehouse,
  Wrench,
} from "lucide-react";
import { PortfolioBlueprintRenderer } from "@/components/portfolio/blueprint/PortfolioBlueprintRenderer";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

/** Ficha pública confirmada por Place ID — usada para "como chegar" e atribuição. */
const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/search/?api=1&query=Moreira%20Auto%20Mec%C3%A2nica&query_place_id=ChIJgYYezAz63JQRk2SRKP5Usqk";

/** Atribuição obrigatória da mídia pública reaproveitada da ficha do Google. */
const MEDIA_ATTRIBUTION =
  "Fotos públicas da ficha da oficina no Google, exibidas com atribuição à fonte.";

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Barulho ou ruído",
    "Suspensão",
    "Motor",
    "Freios",
    "Revisão geral",
    "Luz acesa no painel",
    "Ainda não sei dizer",
  ],
  experienceOptions: [
    "Aparece o tempo todo",
    "Só quando o carro esquenta",
    "Só em buraco ou lombada",
    "Só ao frear",
    "Começou depois de outro serviço",
    "Prefiro explicar na oficina",
  ],
  periodOptions: ["Manhã (08h–12h)", "Tarde (13h–18h30)", "Tanto faz"],
  timingOptions: ["Esta semana", "Semana que vem", "Ainda estou me organizando"],
  stepTitles: {
    service: "O que está acontecendo com o carro?",
    experience: "Quando o problema aparece?",
    period: "Qual período fica melhor para levar?",
    timing: "Para quando você precisa?",
  },
  notePlaceholder: "Conte o modelo, o ano e como o carro está se comportando.",
};

/** Funil individual da oficina — único canal comercial do projeto. */
function renderCta({ children, className }: CtaRenderOptions) {
  return (
    <PortfolioCTAQuiz
      clientKey="moreira-auto-mecanica"
      studioName="Moreira Auto Mecânica"
      recipientName="a equipe da Moreira Auto Mecânica"
      theme="steel"
      mode="proposal"
      quizConfig={quizConfig}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

/** Grafite azulado de galpão + laranja de sinalização. Identidade só desta oficina. */
const theme = {
  "--background": "oklch(0.16 0.017 249)",
  "--foreground": "oklch(0.96 0.005 250)",
  "--card": "oklch(0.21 0.019 249)",
  "--card-foreground": "oklch(0.96 0.005 250)",
  "--muted": "oklch(0.24 0.019 249)",
  "--muted-foreground": "oklch(0.79 0.012 250)",
  "--primary": "oklch(0.67 0.187 41)",
  "--primary-foreground": "oklch(0.15 0.02 249)",
  "--border": "oklch(0.31 0.018 249)",
  "--ring": "oklch(0.67 0.187 41)",
} as CSSProperties;

/** Quebra de ritmo: um único bloco claro no meio da página (adendo §2). */
const lightSurface = {
  "--background": "oklch(0.955 0.006 250)",
  "--foreground": "oklch(0.21 0.02 249)",
  "--card": "oklch(0.99 0.002 250)",
  "--card-foreground": "oklch(0.21 0.02 249)",
  "--muted": "oklch(0.92 0.006 250)",
  "--muted-foreground": "oklch(0.44 0.017 250)",
  "--primary": "oklch(0.55 0.17 41)",
  "--primary-foreground": "oklch(0.98 0.004 250)",
  "--border": "oklch(0.86 0.008 250)",
} as CSSProperties;

export const blueprint: PortfolioBlueprint = {
  slug: "moreira-auto-mecanica",
  identity: {
    name: "Moreira Auto Mecânica",
    /**
     * IDENTITY_COMPLETENESS_GATE = WORDMARK_CREATED (adendo de autonomia §3–§6).
     * A pesquisa pública não encontrou logotipo da oficina. Este wordmark foi
     * criado pela 0WEB para a apresentação digital (GENERATED_BRAND_ASSET);
     * não é, e não pode ser apresentado como, marca histórica do cliente. Uma
     * logo real enviada pelo proprietário substitui este asset.
     */
    logo: {
      src: "/images/moreira-auto-mecanica/logo.png",
      alt: "Moreira Auto Mecânica",
      width: 1536,
      height: 512,
      managedField: "logoUrl",
    },
    tagline: "Mecânica para carros — Cidade Jardim, São José dos Pinhais — PR",
    nav: [
      { label: "Atendimento", href: "#atendimento" },
      { label: "A oficina", href: "#a-oficina" },
      { label: "Avaliações", href: "#avaliacoes" },
      { label: "Onde fica", href: "#onde-fica" },
    ],
  },
  /**
   * Motion profile desta oficina (docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md §4).
   * Nada copiado: o movimento é mecânico e contido — a mídia real tem leve
   * profundidade, a contagem revela um número verificado, as linhas de
   * atendimento respondem ao cursor e o agendamento se preenche conforme
   * o scroll avança, como uma etapa concluída na bancada.
   */
  motionProfile: {
    intensity: "BALANCED",
    personality: "mechanical-contained",
    entrance: ["fade", "slide", "stagger", "maskReveal"],
    scroll: ["scrollReveal", "imageParallax", "scrollProgress", "stickyScroll"],
    hover: ["hoverLift", "iconMotion", "imageZoom"],
    typography: ["textReveal"],
    media: ["imageReveal", "imageParallax"],
    transitions: ["colorTransition"],
    signatureEffects: ["mechanical-step-progress", "verified-review-counter"],
    reducedMotionStrategy: "instant-with-opacity",
    mobileStrategy: "sem parallax e sem efeitos de hover; entradas curtas e scroll natural",
  },
  theme,
  layout: {
    motionIntensity: "BALANCED",
    maxWidth: "max-w-[1500px]",
    headerCtaLabel: "Agendar avaliação",
    /** Acesso persistente ao funil da oficina (adendo de autonomia §10–§13). */
    floatingConversion: {
      mode: "enabled",
      label: "Descrever o problema",
      hint: "Agendamento",
    },
  },
  sections: [
    {
      type: "hero",
      variant: "asymmetric",
      order: 10,
      id: "inicio-oficina",
      motion: { intensity: "BALANCED", reveal: "up", stagger: 80, parallax: 26 },
      content: {
        eyebrow: "Mecânica para carros · São José dos Pinhais — PR",
        headline: "A oficina do bairro que o cliente indica para o vizinho.",
        subheadline:
          "A Moreira Auto Mecânica atende no Cidade Jardim, em São José dos Pinhais, e tem 4,8 de nota pública no Google em 105 avaliações — 93 delas de cinco estrelas. Descreva pelo formulário o que o carro está apresentando e escolha o período para levar.",
        image: {
          src: "/images/moreira-auto-mecanica/google-oficina-coberta.jpg",
          alt: "Galpão coberto da Moreira Auto Mecânica com vários carros em manutenção e um veículo sobre o elevador",
          width: 1600,
          height: 1200,
          priority: true,
        },
        highlights: ["Cidade Jardim · SJP", "Segunda a sexta, 08h–18h30", "Atendimento presencial na oficina"],
        ctaLabel: "Descrever o problema do carro",
        secondary: { label: "Ver onde fica", href: "#onde-fica" },
      },
    },
    {
      type: "signals",
      variant: "strip",
      order: 60,
      motion: { reveal: "fade", stagger: 60 },
      content: {
        items: [
          { value: "4,8 de 5", label: "Nota pública no Google", icon: Star },
          {
            value: "105 avaliações",
            countTo: 105,
            countSuffix: " avaliações",
            label: "93 delas com cinco estrelas",
            icon: ClipboardList,
          },
          { value: "Seg a sex · 08h–18h30", label: "Sábado e domingo fechado", icon: CalendarClock },
          { value: "Cidade Jardim", label: "R. Padre Alberto Müler, 279 — SJP/PR", icon: MapPin },
        ],
        attribution:
          "Dados da ficha pública da oficina no Google (Place ID confirmado), coletados em 11/09/2026. Distribuição completa das notas: 93 de cinco estrelas, 8 de quatro, 1 de duas e 3 de uma estrela.",
      },
    },
    {
      type: "offers",
      variant: "list",
      order: 30,
      id: "atendimento",
      motion: { reveal: "up", stagger: 70, hover: "lift" },
      content: {
        eyebrow: "Atendimento",
        title: "O que chega até a oficina",
        intro:
          "A Moreira é registrada no Google como mecânica para carros e o atendimento é presencial, na própria oficina. A lista abaixo parte dessa categoria e do que os próprios clientes relatam publicamente — o serviço específico do seu carro é definido na avaliação, olhando o veículo.",
        items: [
          {
            title: "Barulhos e ruídos",
            text: "Ruído em buraco, ao frear, ao esterçar ou em velocidade. Descreva quando o barulho aparece: isso encurta a avaliação.",
            icon: Gauge,
            meta: "Sintoma mais citado nas avaliações públicas",
          },
          {
            title: "Suspensão",
            text: "Componentes de suspensão e o comportamento do carro em piso irregular, um dos assuntos que aparecem nos relatos de clientes no Google.",
            icon: Wrench,
          },
          {
            title: "Manutenção mecânica do carro",
            text: "Atendimento de mecânica automotiva em geral, dentro do galpão coberto da oficina, com o carro no elevador.",
            icon: Warehouse,
          },
          {
            title: "Avaliação antes de decidir",
            text: "Você leva o carro, a equipe avalia e conversa com você sobre o que encontrou. Prazo e valor são tratados diretamente com a oficina, presencialmente.",
            icon: ClipboardList,
          },
        ],
        ctaLabel: "Contar o que está acontecendo",
      },
    },
    {
      type: "useCases",
      variant: "imageGrid",
      order: 20,
      id: "a-oficina",
      motion: { reveal: "scale", stagger: 90, hover: "lift" },
      content: {
        eyebrow: "A oficina por dentro",
        title: "Estrutura real, sem cenário montado",
        intro:
          "Estas são fotos públicas da própria ficha da oficina no Google. Nenhuma imagem foi gerada, encenada ou emprestada de outro negócio.",
        items: [
          {
            title: "Galpão coberto",
            text: "Vários carros atendidos ao mesmo tempo, com elevador e área de circulação interna.",
            image: {
              src: "/images/moreira-auto-mecanica/google-mecanico-atendimento.jpg",
              alt: "Mecânico trabalhando no compartimento do motor de um carro dentro do galpão da oficina",
              width: 1100,
              height: 1466,
            },
          },
          {
            title: "Motor aberto na avaliação",
            text: "Boa parte do trabalho começa com o capô aberto e o problema sendo conferido no lugar.",
            image: {
              src: "/images/moreira-auto-mecanica/google-motor-aberto.jpg",
              alt: "Compartimento do motor aberto de um carro em avaliação na oficina",
              width: 1800,
              height: 810,
            },
          },
          {
            title: "Entrada pela Padre Alberto Müler",
            text: "Fachada e portão de acesso da oficina, no Cidade Jardim, em São José dos Pinhais.",
            image: {
              src: "/images/moreira-auto-mecanica/google-fachada.jpg",
              alt: "Fachada da oficina com portão metálico e árvore na calçada, em rua residencial",
              width: 1160,
              height: 868,
            },
          },
        ],
      },
    },
    {
      type: "capabilities",
      variant: "band",
      order: 50,
      motion: { reveal: "fade", stagger: 70 },
      content: {
        eyebrow: "Como funciona na prática",
        title: "O que a ficha pública da oficina confirma",
        intro:
          "Só entram aqui informações registradas na ficha da oficina no Google. Nada foi presumido a partir do segmento.",
        groups: [
          {
            title: "Pagamento",
            icon: CreditCard,
            items: ["Cartão de crédito", "Cartão de débito", "Pagamentos por aproximação (NFC)"],
          },
          {
            title: "Acesso",
            icon: Accessibility,
            items: [
              "Entrada com acessibilidade para pessoas em cadeira de rodas",
              "Atendimento presencial no endereço da oficina",
              "Rua residencial, com espaço em frente ao portão",
            ],
          },
          {
            title: "Funcionamento",
            icon: CalendarClock,
            items: [
              "Segunda a sexta, das 08h às 18h30",
              "Sábado e domingo: fechado",
              "Agendamento pelo formulário desta página",
            ],
          },
        ],
        image: {
          src: "/images/moreira-auto-mecanica/google-motor-aberto.jpg",
          alt: "",
          width: 1800,
          height: 810,
        },
        note: "Formas de pagamento, acessibilidade e horários conforme a ficha pública da oficina no Google em 11/09/2026.",
      },
    },
    {
      type: "process",
      variant: "timeline",
      order: 40,
      theme: lightSurface,
      motion: { reveal: "left", stagger: 90, scrollProgress: true },
      content: {
        eyebrow: "Agendamento",
        title: "Como marcar sua avaliação por aqui",
        intro:
          "Este é o caminho do agendamento pelo site. O que será feito no carro, o prazo e o valor continuam sendo definidos pela oficina, presencialmente.",
        steps: [
          {
            title: "Descreva o sintoma",
            meta: "1 minuto",
            text: "Barulho, luz no painel, comportamento estranho em buraco ou ao frear. Quanto mais concreto, melhor a equipe se prepara.",
          },
          {
            title: "Escolha o período",
            meta: "Seg a sex, 08h–18h30",
            text: "Manhã, tarde ou tanto faz. A oficina não abre aos sábados e domingos.",
          },
          {
            title: "A oficina retorna o contato",
            text: "Sua mensagem chega direto para a equipe da Moreira, com o modelo do carro e o que você relatou.",
          },
          {
            title: "Avaliação com o carro na oficina",
            text: "O diagnóstico acontece com o veículo no elevador, no galpão coberto — não pelo formulário.",
          },
        ],
        ctaLabel: "Começar o agendamento",
      },
    },
    {
      type: "proof",
      variant: "reviews",
      order: 15,
      id: "avaliacoes",
      motion: { reveal: "right", stagger: 80, hover: "glow" },
      content: {
        eyebrow: "Avaliações",
        title: "O que os clientes escreveram no Google",
        intro:
          "Avaliações públicas, com autor, nota e link para a origem. Nenhum depoimento foi escrito, editado ou encomendado.",
        summary: {
          value: "4,8",
          count: "105 avaliações",
          label: "93 de cinco estrelas · 8 de quatro · 1 de duas · 3 de uma",
          sourceLabel: "Ver a ficha no Google",
          sourceHref: GOOGLE_PLACE_URL,
        },
        items: [
          {
            author: "Vitor H.",
            rating: 5,
            date: "há 4 meses",
            text: "Conheci a oficina através de uma indicação de um amigo meu falando a seguinte frase: vou te levar em um lugar que não vão te enganar. E ele estava certo. O atendimento de toda a equipe é sensacional. São extremamente sinceros com a questão do carro e justos no quesito valor também.",
            sourceLabel: "Google",
            sourceHref:
              "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2poVFgyYzVZemx1T1dJMVoxRnRTRUpwZWtFelZYYxAB!2m1!1s0x0:0xa9b254fe28916493!3m1!1s2@1:CAIQACodChtycF9oOjhTX2c5YzluOWI1Z1FtSEJpekEzVXc%7C%7C?hl=pt-BR",
          },
          {
            author: "Antonio Francisco Ulrich",
            rating: 5,
            date: "há 9 meses",
            text: "Sou cliente há mais de 15 anos e sempre que me pedem informações sobre oficina mecânica, recomendo sempre a Moreira Auto Mecânica.",
            sourceLabel: "Google",
            sourceHref:
              "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2twa2R6bDZhbU5PY1hoa2J6VkNaMXB6TmxkNFJHYxAB!2m1!1s0x0:0xa9b254fe28916493!3m1!1s2@1:CAIQACodChtycF9oOkpkdzl6amNOcXhkbzVCZ1pzNld4RGc%7C%7C?hl=pt-BR",
          },
          {
            author: "joao pedro sabatke",
            rating: 5,
            date: "há 1 ano",
            text: "Meu falecido pai me mostrou o caminho: só levava os carros nesta oficina. Quando precisei, levei e fui igualmente bem atendido.",
            sourceLabel: "Google",
            sourceHref:
              "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21KV1JUYzNXVWR6UVVkSk0yRkZkRFoxVFd0emVYYxAB!2m1!1s0x0:0xa9b254fe28916493!3m1!1s2@1:CAIQACodChtycF9oOmJWRTc3WUdzQUdJM2FFdDZ1TWtzeXc%7C%7C?hl=pt-BR",
          },
          {
            author: "Aramis Machado",
            rating: 5,
            date: "há 9 meses",
            text: "Prestação de serviço profissional muito bom com preços acessíveis!!!",
            sourceLabel: "Google",
            sourceHref:
              "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2t0a2QydHRNbk5vTld0d1dWb3RObVJMTUhKTlZsRRAB!2m1!1s0x0:0xa9b254fe28916493!3m1!1s2@1:CAIQACodChtycF9oOktkd2ttMnNoNWtwWVotNmRLMHJNVlE%7C%7C?hl=pt-BR",
          },
        ],
        attribution:
          "Avaliações públicas no Google, coletadas em 11/09/2026. A ficha também registra avaliações negativas — a distribuição completa das 105 notas está acima e o histórico integral pode ser lido no Google.",
        ctaLabel: "Falar sobre o meu carro",
      },
    },
    {
      type: "location",
      variant: "panel",
      order: 80,
      id: "onde-fica",
      motion: { reveal: "left", stagger: 70 },
      content: {
        eyebrow: "Onde fica",
        title: "Cidade Jardim, São José dos Pinhais",
        intro:
          "O atendimento é presencial, no endereço da oficina. O agendamento e o contato comercial acontecem pelo formulário desta página.",
        address: [
          "R. Padre Alberto Müler, 279",
          "Cidade Jardim — São José dos Pinhais — PR",
          "CEP 83035-070",
        ],
        hours: [
          { days: "Segunda a sexta", hours: "08:00 – 18:30" },
          { days: "Sábado", hours: "Fechado" },
          { days: "Domingo", hours: "Fechado" },
        ],
        contact: [
          { label: "Telefone da oficina (informação da ficha pública)", value: "(41) 99794-0764" },
        ],
        mapsLink: { label: "Abrir no Google Maps", href: GOOGLE_PLACE_URL },
        image: {
          src: "/images/moreira-auto-mecanica/google-fachada.jpg",
          alt: "Portão de acesso da Moreira Auto Mecânica na R. Padre Alberto Müler",
          width: 1160,
          height: 868,
        },
        note: `O telefone acima é informação institucional da ficha pública, não um canal de atendimento deste site: o pedido de avaliação chega à oficina pelo formulário. ${MEDIA_ATTRIBUTION}`,
        ctaLabel: "Agendar minha avaliação",
      },
    },
    {
      type: "cta",
      variant: "panel",
      order: 90,
      motion: { reveal: "right" },
      content: {
        eyebrow: "Próximo passo",
        title: "Conte o que o carro está fazendo.",
        text: "Modelo, ano e o sintoma que você percebe. A equipe da Moreira recebe a descrição e combina o melhor dia para você levar o carro.",
        ctaLabel: "Descrever e agendar",
        image: {
          src: "/images/moreira-auto-mecanica/google-mecanico-atendimento.jpg",
          alt: "",
          width: 1100,
          height: 1466,
        },
      },
    },
    {
      type: "faq",
      variant: "accordion",
      order: 100,
      motion: { reveal: "fade", stagger: 60 },
      content: {
        eyebrow: "Perguntas frequentes",
        title: "Antes de levar o carro",
        items: [
          {
            q: "Onde fica a oficina?",
            a: "Na R. Padre Alberto Müler, 279, Cidade Jardim, São José dos Pinhais — PR, CEP 83035-070. O link do Google Maps está na seção “Onde fica”.",
          },
          {
            q: "Qual é o horário de atendimento?",
            a: "De segunda a sexta, das 08h às 18h30. Sábado e domingo a oficina não abre, conforme a ficha pública no Google.",
          },
          {
            q: "Preciso agendar?",
            a: "Você pode descrever o problema pelo formulário desta página e indicar o período que prefere. A confirmação e a organização da agenda são feitas pela própria oficina.",
          },
          {
            q: "Quais formas de pagamento a oficina aceita?",
            a: "A ficha pública registra cartão de crédito, cartão de débito e pagamentos por aproximação (NFC). Condições específicas são tratadas na oficina.",
          },
          {
            q: "Consigo saber o preço pelo site?",
            a: "Não. Preço e prazo dependem da avaliação do carro e são informados pela oficina, presencialmente. Este site organiza o pedido e o agendamento.",
          },
          {
            q: "As avaliações mostradas aqui são reais?",
            a: "Sim. São avaliações públicas do Google, com autor, nota, data aproximada e link para a origem, além da distribuição completa das 105 notas.",
          },
          {
            q: "A oficina tem acessibilidade?",
            a: "A ficha pública informa entrada com acessibilidade para pessoas em cadeira de rodas.",
          },
        ],
        ctaLabel: "Agendar avaliação",
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

export function MoreiraAutoMecanicaPage() {
  return <PortfolioBlueprintRenderer blueprint={blueprint} />;
}
