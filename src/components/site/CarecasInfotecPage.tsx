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

export const blueprint: PortfolioBlueprint = {
  slug: "carecas-infotec",
  identity: {
    name: "Careca's Infotec",
    logo: {
      src: "/images/carecas-infotec/logo.png",
      alt: "Careca's Infotec — assistência especializada",
      width: 535,
      height: 170,
      managedField: "logoUrl",
    },
    nav: [
      { label: "Bancada", href: "#bancada" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "A loja", href: "#loja" },
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
        eyebrow: "Assistência especializada · São José dos Pinhais",
        headline: "Solução com qualidade, confiança e preço justo.",
        headlineField: "heroHeadline",
        subheadline:
          "Assistência técnica em celular, computador, notebook, impressora, monitor, tablet e videogame em São José dos Pinhais — PR. Tecnologia em boas mãos, sempre.",
        subheadlineField: "heroSubheadline",
        image: {
          src: "/images/carecas-infotec/banner.webp",
          alt: "Comunicação da Careca's Infotec com os aparelhos atendidos pela assistência técnica",
          width: 1240,
          height: 550,
          managedField: "heroImageUrl",
        },
        ctaLabel: "Agende já seu serviço",
        secondary: { label: "Ver a bancada", href: "#bancada" },
        stats: [
          { value: "8 tipos", label: "Aparelhos atendidos" },
          { value: "Antes do reparo", label: "Diagnóstico" },
          { value: "Você aprova", label: "Orçamento" },
          { value: "Loja física", label: "São José dos Pinhais" },
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
          { title: "Serviço de qualidade", text: "Diagnóstico antes do reparo.", icon: ShieldCheck },
          { title: "Profissionais qualificados", text: "Atendimento de quem executa.", icon: BadgeCheck },
          { title: "Preço justo", text: "Orçamento antes da execução.", icon: ThumbsUp },
          { title: "Tecnologia em boas mãos", text: "Aparelho testado na entrega.", icon: Wrench },
        ],
      },
    },
    {
      type: "offers",
      variant: "featured",
      order: 30,
      id: "bancada",
      motion: { reveal: "up", stagger: 60 },
      content: {
        eyebrow: "Na bancada",
        title: "O que entra para conserto",
        intro:
          "Cada aparelho passa por diagnóstico antes de qualquer peça ser trocada. Você recebe o orçamento e decide.",
        items: [
          {
            title: "Celular",
            text: "Troca de tela, bateria, conector de carga e limpeza interna, com teste final antes da retirada.",
            icon: Smartphone,
            image: {
              src: "/images/carecas-infotec/servicos.webp",
              alt: "Aparelhos atendidos pela assistência técnica da Careca's Infotec",
              width: 670,
              height: 350,
            },
          },
          { title: "Computador", text: "Formatação, limpeza, upgrade de memória e troca de peças.", icon: Monitor },
          { title: "Notebook", text: "Teclado, dobradiça, tela, refrigeração e manutenção geral.", icon: Laptop },
          { title: "Impressora", text: "Revisão, limpeza de cabeçote e configuração de rede.", icon: Printer },
          { title: "Monitor", text: "Diagnóstico de imagem, fonte e conectores.", icon: Monitor },
          { title: "Tablet", text: "Tela, bateria, botões e restauração do sistema.", icon: Tablet },
          { title: "Videogame", text: "Console e controles: leitura de disco, HDMI e analógicos.", icon: Gamepad2 },
          { title: "Recargas", text: "Recarga de cartucho e toner com teste de impressão.", icon: Printer },
        ],
        ctaLabel: "Descrever o meu aparelho",
      },
    },
    {
      type: "useCases",
      variant: "editorial",
      order: 40,
      id: "como-funciona",
      motion: { reveal: "right", stagger: 110 },
      content: {
        eyebrow: "Como funciona",
        title: "Diagnóstico, orçamento e reparo.",
        intro:
          "Três passos simples, sem surpresa no momento da retirada: você só aprova o serviço depois de saber o que precisa ser feito e quanto custa.",
        items: [
          {
            title: "Você conta o que aconteceu",
            text: "Pelo formulário, informe o aparelho, a marca, o modelo e o defeito percebido. Isso adianta o diagnóstico.",
          },
          {
            title: "A equipe diagnostica e orça",
            text: "O aparelho é avaliado na bancada e o orçamento é apresentado antes de qualquer reparo.",
          },
          {
            title: "Aprovado, o reparo é executado",
            text: "O serviço é feito e o aparelho é testado antes de voltar para as suas mãos.",
          },
        ],
        aside: {
          src: "/images/carecas-infotec/servicos.webp",
          alt: "Lista de aparelhos atendidos pela assistência técnica da Careca's Infotec",
          width: 670,
          height: 350,
        },
      },
    },
    {
      type: "authority",
      variant: "split",
      order: 50,
      id: "loja",
      motion: { reveal: "left" },
      content: {
        eyebrow: "A loja",
        title: "Careca's Infotec — assistência que resolve.",
        paragraphs: [
          "Atendimento direto de quem executa o serviço, com explicação do que precisa ser feito no seu aparelho.",
          "Descreva o aparelho e o defeito pelo formulário: a equipe responde para combinar o atendimento na loja.",
        ],
        points: [
          { title: "Endereço", text: "Rua Margarida Petrelli Fogiatto, 118 — São José dos Pinhais/PR", icon: MapPin },
          { title: "Atendimento", text: "Leve na loja ou combine antes pelo formulário.", icon: Wrench },
        ],
        image: {
          src: "/images/carecas-infotec/banner.webp",
          alt: "Fachada e comunicação visual da Careca's Infotec",
          width: 1240,
          height: 550,
        },
        ctaLabel: "Combinar atendimento",
      },
    },
    {
      type: "offers",
      variant: "alternating",
      order: 60,
      motion: { reveal: "up", stagger: 80 },
      content: {
        eyebrow: "Compromissos",
        title: "O que você pode esperar da bancada",
        items: [
          {
            title: "Serviço de qualidade",
            text: "Diagnóstico antes do reparo e explicação do que precisa ser feito no seu aparelho.",
            meta: "Diagnóstico",
          },
          {
            title: "Profissionais qualificados",
            text: "Assistência técnica especializada, com atendimento direto de quem executa o serviço.",
            meta: "Equipe",
          },
          {
            title: "Preço justo",
            text: "Orçamento apresentado antes da execução, sem surpresa no momento da retirada.",
            meta: "Orçamento",
          },
        ],
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
        text: "Em poucos toques você informa o aparelho, o problema e o melhor momento para o atendimento.",
        ctaLabel: "Solicitar atendimento",
        image: {
          src: "/images/carecas-infotec/banner.webp",
          alt: "Comunicação visual da Careca's Infotec",
          width: 1240,
          height: 550,
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
            a: "Não. Basta descrever o que está acontecendo — no formulário há a opção “ainda não sei o defeito”. O diagnóstico é feito na bancada.",
          },
          {
            q: "O orçamento vem antes do conserto?",
            a: "Sim. O orçamento é apresentado antes da execução e o reparo só acontece depois da sua aprovação.",
          },
          {
            q: "Onde fica a loja?",
            a: "Na Rua Margarida Petrelli Fogiatto, 118, em São José dos Pinhais — PR.",
          },
          {
            q: "Como faço o primeiro contato?",
            a: "Pelo formulário desta página: você informa o aparelho, o defeito e o melhor momento, e a equipe responde para combinar o atendimento.",
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
