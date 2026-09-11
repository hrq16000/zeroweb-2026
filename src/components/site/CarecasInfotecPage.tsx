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
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

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
 * Regra editorial deste projeto:
 * - a única fotografia real disponível é `banner.webp` (faixa oficial). Ela
 *   aparece UMA vez, no hero. Nenhum recorte dela é reaproveitado para simular
 *   galeria;
 * - as demais seções são compostas com tipografia, ícones e composição;
 * - endereço, bairro, horário, garantia, prazo, marcas, avaliações e redes
 *   sociais seguem não confirmados e por isso não são publicados como fato.
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
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Dúvidas", href: "#duvidas" },
    ],
  },
  theme,
  layout: {
    motionIntensity: "EXPRESSIVE",
    maxWidth: "max-w-[1400px]",
    headerCtaLabel: "Agendar serviço",
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
      <PortfolioUpsellPopup pageName="portfolio-carecas-infotec" />
    </>
  ),
  sections: [
    {
      type: "hero",
      variant: "fullBleed",
      order: 10,
      motion: { intensity: "IMMERSIVE", reveal: "up", stagger: 90 },
      content: {
        eyebrow: "Assistência especializada · São José dos Pinhais — PR",
        headline: "Solução com qualidade, confiança e preço justo.",
        headlineField: "heroHeadline",
        subheadline:
          "Celular, computador, notebook, impressora, monitor, tablet e videogame. Descreva o aparelho e o que está acontecendo: a avaliação técnica vem antes de qualquer reparo.",
        subheadlineField: "heroSubheadline",
        image: {
          src: "/images/carecas-infotec/banner.webp",
          alt: "Faixa oficial da Careca's Infotec com os aparelhos atendidos pela assistência técnica",
          width: 1240,
          height: 550,
          managedField: "heroImageUrl",
        },
        ctaLabel: "Agende já seu serviço",
        secondary: { label: "Ver equipamentos atendidos", href: "#equipamentos" },
        stats: [
          { value: "8 tipos", label: "Aparelhos atendidos" },
          { value: "Antes do reparo", label: "Avaliação técnica" },
          { value: "Você aprova", label: "Orçamento" },
          { value: "Presencial", label: "São José dos Pinhais — PR" },
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
      motion: { reveal: "up", stagger: 60 },
      content: {
        eyebrow: "Equipamentos atendidos",
        title: "O que entra para avaliação",
        intro:
          "Cada aparelho passa por avaliação técnica antes de qualquer serviço. Você recebe o orçamento e decide se autoriza.",
        items: [
          {
            title: "Computador",
            text: "Não liga, liga e desliga sozinho, fica lento, trava ou não completa a inicialização? Traga para avaliação.",
            icon: Monitor,
            meta: "Desktop",
          },
          {
            title: "Notebook",
            text: "Não liga, aquece demais, desliga sem aviso, tela sem imagem ou dobradiça danificada.",
            icon: Laptop,
            meta: "Portátil",
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
        ctaLabel: "Descrever o meu aparelho",
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
          "Você não precisa saber a causa. Descrever o comportamento já adianta o trabalho da bancada — o defeito é identificado na avaliação, não no palpite.",
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
      motion: { reveal: "up", stagger: 90 },
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
      motion: { reveal: "up", stagger: 80 },
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
        ctaLabel: "Começar pelo relato",
      },
    },
    {
      type: "authority",
      variant: "split",
      order: 60,
      id: "loja",
      motion: { reveal: "left" },
      content: {
        eyebrow: "Careca's Infotec em São José dos Pinhais",
        title: "Assistência técnica especializada, com atendimento de quem executa.",
        paragraphs: [
          "A Careca's Infotec atende celular, computador, notebook, impressora, monitor, tablet e videogame, além de recarga de cartucho e toner, em São José dos Pinhais — PR.",
          "O primeiro contato é feito pelo formulário desta página: você descreve o aparelho e o defeito percebido, e a equipe responde para combinar o atendimento.",
        ],
        points: [
          { title: "Onde", text: "São José dos Pinhais — PR.", icon: MapPin },
          { title: "Como começar", text: "Envie o relato pelo formulário e combine o atendimento.", icon: Wrench },
        ],
        footnote:
          "Endereço completo, horário de funcionamento e canais oficiais serão publicados assim que confirmados pelo próprio negócio.",
        ctaLabel: "Combinar atendimento",
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
        ctaLabel: "Solicitar atendimento",
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
