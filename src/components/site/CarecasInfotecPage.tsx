/**
 * Careca's Infotec — primeiro projeto executado pelo Portfolio Blueprint.
 *
 * A arquitetura da página não é mais um JSX manual: este arquivo declara o
 * Blueprint (identidade, tema, composição e conteúdo) e o
 * `PortfolioBlueprintRenderer` monta a página a partir de `sections[]`.
 * Funil, telemetria, SEO e assets do cliente permanecem os mesmos.
 */
import type { CSSProperties } from "react";
import {
  BadgeCheck,
  Gamepad2,
  Laptop,
  MapPin,
  Monitor,
  Printer,
  ShieldCheck,
  Smartphone,
  Tablet,
  ThumbsUp,
  Wrench,
} from "lucide-react";
import { PortfolioBlueprintRenderer } from "@/components/portfolio/blueprint/PortfolioBlueprintRenderer";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

/**
 * Ficha pública do cliente no Google (Place ID confirmado). Usada para
 * atribuição de avaliações e para o link "como chegar".
 */
const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/search/?api=1&query=Careca%27s%20Infotec&query_place_id=ChIJjxhi67_73JQRgGgv4G2-G18";

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Celular",
    "Computador",
    "Notebook",
    "Impressora",
    "Monitor",
    "Tablet",
    "Videogame",
    "Recarga de cartucho ou toner",
  ],
  experienceOptions: [
    "Não liga",
    "Tela quebrada",
    "Lentidão ou travamento",
    "Bateria / carregamento",
    "Não imprime",
    "Ainda não sei o defeito",
  ],
  periodOptions: ["Levo na loja", "Prefiro combinar antes", "Quero só um orçamento"],
  timingOptions: ["Hoje", "Esta semana", "Sem pressa"],
  stepTitles: {
    service: "Qual aparelho precisa de atendimento?",
    experience: "O que está acontecendo com ele?",
    period: "Como prefere resolver?",
    timing: "Para quando você precisa?",
  },
  notePlaceholder: "Conte a marca, o modelo e o que aconteceu com o aparelho.",
};

/** Funil individual do cliente — inalterado nesta rodada. */
function renderCta({ children, className }: CtaRenderOptions) {
  return (
    <PortfolioCTAQuiz
      clientKey="carecas-infotec"
      studioName="Careca's Infotec"
      recipientName="Careca's Infotec"
      theme="gold"
      mode="proposal"
      quizConfig={quizConfig}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const theme = {
  "--background": "oklch(0.17 0.012 315)",
  "--foreground": "oklch(0.97 0.005 90)",
  "--card": "oklch(0.22 0.014 315)",
  "--card-foreground": "oklch(0.97 0.005 90)",
  "--muted": "oklch(0.25 0.014 315)",
  "--muted-foreground": "oklch(0.79 0.012 90)",
  "--primary": "oklch(0.85 0.16 92)",
  "--primary-foreground": "oklch(0.19 0.012 315)",
  "--border": "oklch(0.32 0.015 315)",
  "--ring": "oklch(0.85 0.16 92)",
} as CSSProperties;

/**
 * Regra editorial deste projeto (ver docs/PORTFOLIO_PROJECT_LIFECYCLE.md §7.1):
 * - mídia real tem prioridade, mas não prioridade cega. A faixa promocional
 *   enviada pelo proprietário é BRAND_REFERENCE / EVIDENCE_ONLY e não aparece
 *   em nenhuma posição editorial;
 * - o hero e os apoios usam GENERATED_CONTEXTUAL_MEDIA autoral (bancada
 *   técnica, carvão/amarelo), coerente com a capa aprovada. Nenhuma delas
 *   representa a loja, a bancada, funcionários, clientes ou serviços reais;
 * - endereço, bairro, telefone, horários, nota e avaliações passam a ser
 *   publicados como FATO VERIFICADO: vêm da ficha pública do Google
 *   (Place ID ChIJjxhi67_73JQRgGgv4G2-G18), ingerida server-side em
 *   docs/portfolio/enrichment/serpapi/carecas-infotec.json, com autoria,
 *   data, link de origem e atribuição preservados;
 * - garantia, prazo, marcas e redes sociais seguem não confirmados e por isso
 *   não são publicados como fato.
 */

export const blueprint: PortfolioBlueprint = {
  slug: "carecas-infotec",
  identity: {
    name: "Careca's Infotec",
    logo: {
      src: "/images/carecas-infotec/logo.png",
      alt: "Careca's Infotec — assistência especializada",
      width: 1016,
      height: 347,
      managedField: "logoUrl",
    },
    nav: [
      { label: "Equipamentos", href: "#equipamentos" },
      { label: "Quando procurar", href: "#quando-procurar" },
      { label: "Atendimento", href: "#atendimento" },
      { label: "Avaliações", href: "#avaliacoes" },
      { label: "Onde estamos", href: "#onde-estamos" },
      { label: "Dúvidas", href: "#duvidas" },
    ],
  },
  theme,
  /**
   * Motion profile próprio (docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md §4).
   * Nada copiado de outro cliente: aqui o movimento é de bancada — a peça
   * entra em foco, o diagnóstico se revela linha a linha e a nota pública
   * é contada como um número conferido, não como enfeite.
   */
  motionProfile: {
    intensity: "EXPRESSIVE",
    personality: "bench-diagnostic",
    entrance: ["fade", "slide", "stagger"],
    scroll: ["scrollReveal", "imageParallax"],
    hover: ["hoverLift", "imageZoom"],
    typography: ["textReveal"],
    media: ["imageReveal", "imageParallax"],
    transitions: ["colorTransition"],
    signatureEffects: ["verified-rating-counter", "bench-focus-parallax"],
    reducedMotionStrategy: "instant-with-opacity",
    mobileStrategy: "sem parallax e sem hover; entradas curtas e scroll natural",
  },
  layout: {
    motionIntensity: "EXPRESSIVE",
    maxWidth: "max-w-[1400px]",
    headerCtaLabel: "Agendar serviço",
    /** Acesso persistente ao funil individual — nunca telefone ou WhatsApp. */
    floatingConversion: {
      mode: "enabled",
      label: "Descrever o aparelho",
      hint: "Avaliação técnica",
    },
  },
  renderCta,
  afterContent: (
    <>
      <footer className="border-t border-border px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong className="uppercase tracking-wide">Careca's Infotec</strong>
            <p className="mt-1 text-sm text-muted-foreground">
              Assistência técnica especializada em São José dos Pinhais — PR.
            </p>
          </div>
          <PortfolioHostCredit
            className="text-sm text-muted-foreground"
            linkClassName="font-semibold text-primary"
          />
        </div>
      </footer>
    </>
  ),
  sections: [
    {
      type: "hero",
      variant: "fullBleed",
      order: 10,
      motion: { intensity: "IMMERSIVE", reveal: "up", stagger: 90, parallax: 22 },
      content: {
        eyebrow: "Assistência especializada · Santo Antônio, São José dos Pinhais — PR",
        headline: "Solução com qualidade, confiança e preço justo.",
        headlineField: "heroHeadline",
        subheadline:
          "Celular, computador, notebook, impressora, monitor, tablet e videogame. Descreva o aparelho e o que está acontecendo: a avaliação técnica vem antes de qualquer reparo.",
        subheadlineField: "heroSubheadline",
        image: {
          src: "/images/carecas-infotec/gen-hero-editorial.jpg",
          alt: "Ilustração técnica: notebook aberto com a tampa removida, celular desmontado, placa e ferramentas de precisão em bancada escura sob luz âmbar",
          width: 1920,
          height: 1088,
          managedField: "heroImageUrl",
        },

         ctaLabel: "Solicitar avaliação",
        secondary: { label: "Ver equipamentos atendidos", href: "#equipamentos" },
        stats: [
          /** Nota e contagem: ficha pública do Google, verificadas na ingestão. */
          { value: "4,9", label: "Nota no Google · 43 avaliações" },
          {
            value: "43 avaliações",
            countTo: 43,
            countSuffix: " avaliações",
            label: "Ficha pública no Google",
          },
          { value: "Antes do reparo", label: "Avaliação técnica" },
          { value: "Seg a sáb", label: "Santo Antônio — São José dos Pinhais" },
        ],
      },
    },
    {
      type: "trust",
      variant: "bar",
      order: 20,
      motion: { reveal: "fade", stagger: 60 },
      content: {
        items: [
          { title: "Serviço de qualidade", text: "Avaliação antes do reparo.", icon: ShieldCheck },
          { title: "Profissionais qualificados", text: "Atendimento de quem executa.", icon: BadgeCheck },
          { title: "Preço justo", text: "Orçamento antes da execução.", icon: ThumbsUp },
          { title: "Tecnologia em boas mãos", text: "Aparelho testado na entrega.", icon: Wrench },
        ],
        note: "Compromissos comunicados pela própria Careca's Infotec.",
      },
    },
    {
      type: "offers",
      variant: "featured",
      order: 30,
      id: "equipamentos",
      motion: { reveal: "up", stagger: 60, hover: "lift" },
      content: {
        eyebrow: "Equipamentos atendidos",
        title: "O que entra para avaliação",
        intro:
          "Cada aparelho passa por avaliação técnica antes de qualquer serviço. Você recebe o orçamento e decide se autoriza.",
        items: [
          {
            /**
             * Bloco principal da composição "featured": ocupava uma área grande
             * apenas com ícone + texto (VISUAL_DEAD_ZONE detectada pela quality
             * matrix). Recebe GENERATED_CONTEXTUAL_MEDIA própria desta seção —
             * composição diferente de `gen-notebook-bancada.jpg`, mesma família
             * visual (carvão + âmbar). Não representa a loja, a bancada,
             * equipe, clientes nem serviços executados pela Careca's Infotec.
             */
            title: "Computador",
            text: "Não liga, liga e desliga sozinho, fica lento, trava ou não completa a inicialização? Traga para avaliação.",
            icon: Monitor,
            meta: "Desktop",
            image: {
              src: "/images/carecas-infotec/gen-desktop-avaliacao.jpg",
              alt: "Ilustração técnica: gabinete de computador aberto mostrando placa-mãe, memórias, placa de vídeo e ferramentas sobre bancada escura",
              width: 1600,
              height: 1200,
            },
          },
          {
            title: "Notebook",
            text: "Não liga, aquece demais, desliga sem aviso, tela sem imagem ou dobradiça danificada.",
            icon: Laptop,
            meta: "Portátil",
            image: {
              src: "/images/carecas-infotec/google-notebook-bancada.jpg",
              alt: "Notebook aberto sobre bancada em imagem pública da Careca's Infotec no Google",
              width: 1800,
              height: 810,
            },
          },
          {
            title: "Celular",
            text: "Tela quebrada, não carrega, bateria acabando rápido, molhou ou parou de dar sinal de vida.",
            icon: Smartphone,
            meta: "Smartphone",
          },
          {
            title: "Tablet",
            text: "Tela sem resposta ao toque, não liga, não carrega ou o sistema não inicia.",
            icon: Tablet,
            meta: "Tablet",
          },
          {
            title: "Impressora",
            text: "Não imprime, puxa papel errado, sai borrado, com falhas ou perdeu a conexão.",
            icon: Printer,
            meta: "Jato de tinta e laser",
          },
          {
            title: "Recarga de cartucho e toner",
            text: "Recarga de cartucho e de toner para quem quer voltar a imprimir sem trocar o suprimento.",
            icon: Printer,
            meta: "Suprimentos",
          },
          {
            title: "Monitor",
            text: "Sem imagem, imagem tremida, manchas, cores erradas ou não reconhece o cabo.",
            icon: Monitor,
            meta: "Vídeo",
          },
          {
            title: "Videogame",
            text: "Console que não liga, superaquece, não lê o jogo, sem imagem na TV ou controle com falha.",
            icon: Gamepad2,
            meta: "Console e controle",
          },
        ],
         ctaLabel: "Informar o problema",
      },
    },
    {
      type: "useCases",
      variant: "editorial",
      order: 40,
      id: "quando-procurar",
      motion: { reveal: "right", stagger: 110 },
      content: {
        eyebrow: "Quando procurar a assistência",
        title: "Sinais de que o aparelho pede avaliação técnica.",
        intro:
          "Você não precisa saber a causa. Descrever o comportamento já adianta o trabalho da bancada — o defeito é identificado na avaliação, não no palpite. Imagem pública do serviço no Google, via SerpApi.",
        items: [
          {
            title: "Computador e notebook",
            text: "Não liga, reinicia sozinho, demora muito para abrir programas, trava no meio do uso, faz barulho fora do normal ou esquenta demais.",
          },
          {
            title: "Celular e tablet",
            text: "Tela trincada ou sem toque, aparelho que não carrega, bateria que dura pouco, aquecimento durante a carga ou queda que mudou o comportamento.",
          },
          {
            title: "Impressora, cartucho e toner",
            text: "Impressão falhada ou borrada, papel que enrosca, impressora que sumiu da rede ou suprimento no fim — a recarga de cartucho e toner é feita na loja.",
          },
          {
            title: "Monitor e videogame",
            text: "Tela sem imagem, sinal que some, console que não lê o jogo, desliga sozinho durante a partida ou controle que não responde.",
          },
        ],
        aside: {
          src: "/images/carecas-infotec/google-notebook-manutencao.jpg",
          alt: "Interior de notebook em manutenção em imagem pública da Careca's Infotec no Google",
          width: 1800,
          height: 810,
        },
      },

    },
    {
      /**
       * Blocos visuais por família de aparelho.
       * As três imagens são GENERATED_CONTEXTUAL_MEDIA (composição técnica
       * autoral): existem para diferenciar visualmente computadores, aparelhos
       * móveis e impressão. Não representam a loja, a bancada, funcionários,
       * clientes nem serviços executados pela Careca's Infotec.
       */
      type: "useCases",
      variant: "imageGrid",
      order: 45,
      id: "atendimento",
      motion: { reveal: "up", stagger: 90, hover: "lift" },
      content: {
        eyebrow: "Frentes de atendimento",
        title: "Três frentes, a mesma avaliação técnica.",
        items: [
          {
            title: "Computador e notebook",
            text: "Desktop e portátil que não ligam, ficam lentos, travam ou não completam a inicialização entram para avaliação antes de qualquer serviço.",
            image: {
              src: "/images/carecas-infotec/gen-notebook-bancada.jpg",
              alt: "Ilustração técnica: notebook aberto e placa de computador sobre bancada escura",
              width: 1280,
              height: 800,
            },
          },
          {
            title: "Celular e tablet",
            text: "Aparelho móvel com tela quebrada, sem carregar, com bateria durando pouco ou que parou de responder passa por avaliação antes do orçamento.",
            image: {
              src: "/images/carecas-infotec/gen-celular-tablet.jpg",
              alt: "Ilustração técnica: celular com tampa removida e tablet sobre bancada escura",
              width: 1280,
              height: 800,
            },
          },
          {
            title: "Impressora, cartucho e toner",
            text: "Impressora que não imprime, sai com falhas ou perdeu a conexão — e recarga de cartucho e de toner feita na loja.",
            image: {
              src: "/images/carecas-infotec/gen-impressora-toner.jpg",
              alt: "Ilustração técnica: cartucho de tinta colorido e toner laser sobre bancada escura",
              width: 1280,
              height: 800,
            },
          },
        ],
      },
    },
    {
      type: "offers",
      variant: "alternating",
      order: 50,
      id: "como-funciona",
      motion: { reveal: "up", stagger: 80, hover: "lift" },
      content: {
        eyebrow: "Como funciona a avaliação",
        title: "Do relato ao aparelho testado",
        intro:
          "Sem surpresa na retirada: o serviço só é executado depois que você sabe o que precisa ser feito e quanto custa.",
        items: [
          {
            title: "1. Você conta o que aconteceu",
            text: "Pelo formulário desta página, informe o aparelho, a marca, o modelo e o comportamento que percebeu. Se não souber o defeito, existe a opção “ainda não sei”.",
            meta: "Relato",
          },
          {
            title: "2. A bancada avalia e orça",
            text: "O aparelho é avaliado pela assistência e o orçamento é apresentado antes de qualquer reparo.",
            meta: "Avaliação",
          },
          {
            title: "3. Com a sua aprovação, o serviço é feito",
            text: "Aprovado o orçamento, o serviço é executado e o aparelho é testado antes de voltar para as suas mãos.",
            meta: "Execução",
          },
        ],
         ctaLabel: "Informar o problema",
      },
    },
    {
      /**
       * Prova social VERIFICADA. Nota, contagem e textos vêm da ficha pública
       * do Google (Place ID ChIJjxhi67_73JQRgGgv4G2-G18), ingerida server-side.
       * Nada é reescrito: autoria, texto, mês da publicação e origem são os do
       * próprio Google. A nota agregada não é publicada em Schema.org.
       */
      type: "proof",
      variant: "reviews",
      order: 55,
      id: "avaliacoes",
      motion: { reveal: "up", stagger: 80, hover: "glow" },
      content: {
        eyebrow: "Avaliações públicas",
        title: "O que os clientes registraram no Google.",
        intro:
          "Avaliações públicas da ficha da Careca's Infotec no Google, exibidas como foram escritas pelos próprios clientes.",
        summary: {
          value: "4,9",
          count: "43 avaliações",
          label: "Assistência Técnica de Informática",
          sourceLabel: "Ver a ficha no Google",
          sourceHref: GOOGLE_PLACE_URL,
        },
        items: [
          {
            author: "Daniel Strapasson",
            rating: 5,
            text: "Excelente experiência! Fiz alguns serviços nessa loja de celulares e o atendimento foi impecável. Resolveram tudo com rapidez, qualidade e transparência. Hoje é difícil encontrar lugares assim, mas aqui realmente passam confiança. Recomendo de olhos fechados!",
            date: "março de 2026",
            sourceLabel: "Ver no Google",
            sourceHref: GOOGLE_PLACE_URL,
          },
          {
            author: "Wesley Rodrigues",
            rating: 5,
            text: "Precisei trocar a tela do meu celular e ficou impecável a qualidade do serviço, super recomendo",
            date: "março de 2026",
            sourceLabel: "Ver no Google",
            sourceHref: GOOGLE_PLACE_URL,
          },
          {
            author: "Nutrigene Do Brasil",
            rating: 5,
            text: "Fui muito bem atendida, serviço rápido e profissional.",
            date: "abril de 2026",
            sourceLabel: "Ver no Google",
            sourceHref: GOOGLE_PLACE_URL,
          },
          {
            author: "sandra friedrich",
            rating: 5,
            text: "Gostei muito, realmente ótimo, moro em curitiba, motoboy veio buscar e trazer o celular, perfeito, rápido e excelente serviço, podem confiar",
            date: "novembro de 2023",
            sourceLabel: "Ver no Google",
            sourceHref: GOOGLE_PLACE_URL,
          },
        ],
        attribution:
          "Avaliações públicas no Google, atribuídas aos autores originais. Nota 4,9 com 43 avaliações registradas na ficha pública em setembro de 2026.",
         ctaLabel: "Solicitar avaliação",
      },
    },
    {
      type: "authority",
      variant: "split",
      order: 60,
      id: "loja",
      motion: { reveal: "left", parallax: 18 },
      content: {
        eyebrow: "Careca's Infotec em São José dos Pinhais",
        title: "Assistência técnica especializada, com atendimento de quem executa.",
        paragraphs: [
          "A Careca's Infotec atende celular, computador, notebook, impressora, monitor, tablet e videogame, além de recarga de cartucho e toner, no bairro Santo Antônio, em São José dos Pinhais — PR.",
          "O primeiro contato é feito pelo formulário desta página: você descreve o aparelho e o defeito percebido, e a equipe responde para combinar o atendimento.",
        ],
        points: [
          {
            title: "Onde",
            text: "Rua Margarida Petrelli Fogiatto, 118 — Santo Antônio, São José dos Pinhais — PR.",
            icon: MapPin,
          },
          { title: "Como começar", text: "Envie o relato pelo formulário e combine o atendimento.", icon: Wrench },
        ],
        /** GOOGLE_USER_MEDIA — foto pública do serviço, com atribuição abaixo. */
        image: {
          src: "/images/carecas-infotec/google-placa-microscopio.jpg",
          alt: "Placa eletrônica observada ao microscópio em imagem pública da Careca's Infotec no Google",
          width: 1800,
          height: 1013,
        },
        footnote:
          "Imagem pública do estabelecimento no Google, via SerpApi. Endereço, telefone e horários conferidos na mesma ficha em setembro de 2026.",
        ctaLabel: "Solicitar avaliação",
      },
    },
    {
      /** Localização e horários — ficha pública do Google, verificada. */
      type: "location",
      variant: "panel",
      order: 65,
      id: "onde-estamos",
      motion: { reveal: "up", stagger: 80 },
      content: {
        eyebrow: "Onde estamos",
        title: "Atendimento presencial no Santo Antônio.",
        intro:
          "A loja fica em São José dos Pinhais e atende de segunda a sábado. Você pode enviar o relato antes pelo formulário e levar o aparelho já com o atendimento combinado.",
        address: [
          "Rua Margarida Petrelli Fogiatto, 118",
          "Santo Antônio — São José dos Pinhais — PR",
          "CEP 83020-600",
        ],
        hours: [
          { days: "Segunda a sexta", hours: "08:00 – 18:00" },
          { days: "Sábado", hours: "09:00 – 18:00" },
          { days: "Domingo", hours: "Fechado" },
        ],
        contact: [
          { label: "Telefone", value: "(41) 99507-2700" },
        ],
        mapsLink: { label: "Como chegar", href: GOOGLE_PLACE_URL },
        image: {
          src: "/images/carecas-infotec/google-interior-balcao.jpg",
          alt: "Interior e balcão da Careca's Infotec em imagem pública do estabelecimento no Google",
          width: 1012,
          height: 1800,
        },
        note: "Imagem pública do estabelecimento no Google, via SerpApi. Endereço, telefone e horários conferidos na ficha em setembro de 2026.",
        ctaLabel: "Informar o problema antes de ir",
      },
    },
    {
      type: "cta",
      variant: "immersive",
      order: 70,
      motion: { intensity: "IMMERSIVE" },
      content: {
        eyebrow: "Agende já seu serviço",
        title: "Tecnologia em boas mãos.",
        text: "Em poucos toques você informa o aparelho, o que está acontecendo e o melhor momento para o atendimento.",
        ctaLabel: "Solicitar avaliação",
        /** GENERATED_CONTEXTUAL_MEDIA — textura de fundo, não evidência. */
        image: {
          src: "/images/carecas-infotec/gen-cta-textura.jpg",
          alt: "",
          width: 1920,
          height: 900,
        },
      },

    },
    {
      type: "faq",
      variant: "accordion",
      order: 80,
      id: "duvidas",
      motion: { reveal: "up", stagger: 60 },
      content: {
        eyebrow: "Dúvidas",
        title: "Antes de trazer o aparelho",
        items: [
          {
            q: "Quais aparelhos a Careca's Infotec atende?",
            a: "Celular, computador, notebook, impressora, monitor, tablet e videogame, além de recarga de cartucho e toner.",
          },
          {
            q: "Preciso saber qual é o defeito?",
            a: "Não. Descreva o comportamento do aparelho — no formulário há a opção “ainda não sei o defeito”. A identificação é feita na avaliação técnica.",
          },
          {
            q: "O orçamento vem antes do serviço?",
            a: "Sim. O orçamento é apresentado antes da execução e o serviço só acontece depois da sua aprovação.",
          },
          {
            q: "Meu notebook não liga. Vale levar?",
            a: "Vale. Aparelho que não liga é um dos casos mais comuns de avaliação: só depois de avaliado é possível dizer o que está acontecendo e quanto custa resolver.",
          },
          {
            q: "Vocês recarregam cartucho e toner?",
            a: "Sim, recarga de cartucho e de toner faz parte dos serviços da assistência.",
          },
          {
            q: "Como faço o primeiro contato?",
            a: "Pelo formulário desta página: você informa o aparelho, o que está acontecendo e o melhor momento, e a equipe responde para combinar o atendimento.",
          },
        ],
        ctaLabel: "Enviar meu caso",
      },
    },
  ],
};

export function CarecasInfotecPage() {
  return <PortfolioBlueprintRenderer blueprint={blueprint} />;
}
