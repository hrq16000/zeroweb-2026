import { MotionReveal, MotionScope } from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { ArrowRight, CheckCircle2, CircuitBoard, Fan, Sun, Wrench, Zap } from "lucide-react";

const quiz = {
  services: [
    "Instalação e manutenção residencial",
    "Instalação comercial ou predial",
    "Manutenção industrial",
    "Padrão Copel e quadros",
    "Sistema solar / fotovoltaico",
    "Ar-condicionado",
    "Motores, bombas e iluminação",
    "Reparo elétrico em geral",
  ],
  experienceOptions: ["Residencial", "Comercial", "Predial / condomínio", "Industrial"],
  periodOptions: ["Curitiba", "Região Metropolitana", "Vou confirmar o endereço"],
  timingOptions: ["Preciso avaliar com urgência", "Nos próximos dias", "Estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual solução você precisa?",
    experience: "Em qual tipo de ambiente?",
    period: "Onde será o serviço?",
    timing: "Quando você precisa?",
    note: "Conte os detalhes do atendimento",
  },
  notePlaceholder: "Ex.: equipamento, defeito, quantidade de pontos, foto do quadro ou prazo.",
};

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioCTAQuiz
      clientKey="js-eletrica-manutencao"
      studioName="JS Elétrica e Manutenção"
      recipientName="Joelton"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffd21d] px-7 py-3.5 font-bold text-[#07131d] shadow-lg shadow-[#ffd21d]/20 transition hover:-translate-y-1 hover:bg-[#ffe467] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd21d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07131d]"
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const services = [
  { code: "01", icon: Zap, title: "Instalações e manutenção", text: "Elétrica residencial, comercial, predial e industrial, com manutenção preventiva e corretiva." },
  { code: "02", icon: CircuitBoard, title: "Infraestrutura elétrica", text: "Quadros, circuitos, padrão Copel, motores, bombas e reparos para manter a operação segura." },
  { code: "03", icon: Sun, title: "Solar e eficiência", text: "Soluções de energia solar e fotovoltaica para quem quer produzir e usar energia com mais inteligência." },
  { code: "04", icon: Fan, title: "Climatização", text: "Instalação e manutenção de ar-condicionado e equipamentos que precisam de atenção técnica." },
];

const fieldNotes = [
  ["Residencial", "Tomadas, iluminação, quadros e circuitos para a casa."],
  ["Comercial", "Continuidade para lojas, escritórios e pequenos negócios."],
  ["Predial", "Manutenção e organização das áreas comuns e sistemas."],
  ["Industrial", "Reparos, motores e infraestrutura para a rotina da operação."],
];

export function JsEletricaManutencaoPage() {
  return (
    <MotionScope intensity="BALANCED">
      <div className="min-h-dvh overflow-hidden bg-[#07131d] font-sans text-[#eaf4f8]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07131d]/95 px-5 py-4 backdrop-blur lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
            <a href="#inicio" className="flex items-center gap-3" aria-label="JS Elétrica e Manutenção">
              <PortfolioImage src="/images/js-eletrica-manutencao/js-eletrica-marca.jpeg" alt="JS Elétrica e Manutenção" width={360} height={150} className="h-12 w-36 object-contain" priority />
            </a>
            <nav className="hidden gap-7 text-xs font-bold uppercase tracking-[.16em] text-[#a8c4d1] md:flex" aria-label="Navegação principal">
              <a href="#servicos" className="transition hover:text-[#ffd21d]">Serviços</a>
              <a href="#empresa" className="transition hover:text-[#ffd21d]">A empresa</a>
              <a href="#atuacao" className="transition hover:text-[#ffd21d]">Atuação</a>
              <a href="#contato" className="transition hover:text-[#ffd21d]">Contato</a>
            </nav>
            <CTA>Solicitar orçamento <ArrowRight className="h-4 w-4" /></CTA>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgba(23,150,216,.3),transparent_32%),linear-gradient(120deg,#07131d,#0b2c43)] px-5 py-16 lg:px-10 lg:py-24">
            <div className="pointer-events-none absolute -bottom-48 -left-48 h-[34rem] w-[34rem] rounded-full border border-[#ffd21d]/10" />
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.88fr_1.12fr]">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[#55d6ef]">JS Elétrica e Manutenção · Curitiba e região</p>
                <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-6 max-w-3xl font-display text-5xl font-bold uppercase leading-[.94] tracking-[-.04em] sm:text-7xl">
                  <ManagedText field="heroHeadline" fallback="Energia funcionando. Serviço bem feito." />
                </MotionReveal>
                <p className="mt-6 max-w-xl text-base leading-8 text-[#c1d6df]">
                  <ManagedText field="heroSubheadline" fallback="Atendimento técnico para residências, comércios, condomínios e indústrias: instalação, manutenção, padrão Copel, energia solar, motores, bombas e iluminação." />
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CTA>Falar com a JS <ArrowRight className="h-4 w-4" /></CTA>
                  <a href="#servicos" className="inline-flex min-h-12 items-center rounded-full border border-[#5e91aa] px-6 py-3.5 text-sm font-bold text-[#d6e9f0] transition hover:border-[#ffd21d] hover:text-[#ffd21d]">Ver serviços</a>
                </div>
                <div className="mt-9 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 text-xs font-bold text-[#b5ced8] sm:grid-cols-4">
                  {["Residencial", "Comercial", "Predial", "Industrial"].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#ffd21d]" />{item}</span>)}
                </div>
              </div>
              <MotionReveal variant="right" className="relative">
                <PortfolioImage src="/images/js-eletrica-manutencao/hero.png" alt="Imagem editorial de inspeção de um quadro elétrico" priority width={1680} height={945} className="aspect-video w-full rounded-[2rem] object-cover shadow-2xl ring-1 ring-white/15" managedField="heroImageUrl" />
                <p className="mt-3 text-right text-[10px] uppercase tracking-[.16em] text-[#8eb6c7]">Imagem editorial · identidade técnica JS</p>
              </MotionReveal>
            </div>
          </section>

          <section id="servicos" className="bg-[#f4f8fa] px-5 py-20 text-[#07131d] lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-6 lg:grid-cols-[1fr_.6fr] lg:items-end">
                <div><p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[#0781c8]">Serviços</p><h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">O que a JS resolve para você.</h2></div>
                <p className="text-sm leading-7 text-[#607580]">Sem foto genérica e sem enrolação: você descreve a necessidade, recebe orientação inicial e combina o próximo passo.</p>
              </div>
              <div className="mt-12 grid gap-px overflow-hidden border border-[#d6e2e7] bg-[#d6e2e7] sm:grid-cols-2 lg:grid-cols-4">
                {services.map(({ code, icon: Icon, title, text }, i) => <MotionReveal as="article" variant="up" delay={i * 90} key={code} className="min-h-72 bg-white p-6 transition hover:bg-[#eef9fd]">
                  <p className="font-mono text-xs font-bold tracking-[.2em] text-[#0781c8]">{code}</p><Icon className="mt-8 h-7 w-7 text-[#0781c8]" aria-hidden /><h3 className="mt-5 font-display text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#61737d]">{text}</p>
                </MotionReveal>)}
              </div>
              <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#07131d] px-6 py-5 text-sm text-[#c9dde5] sm:flex-row sm:items-center"><span>Não encontrou o que procura?</span><CTA>Descrever meu serviço <ArrowRight className="h-4 w-4" /></CTA></div>
            </div>
          </section>

          <section id="empresa" className="bg-[#0b2536] px-5 py-20 lg:px-10 lg:py-24">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
              <div><p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[#55d6ef]">A empresa</p><h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Elétrica não pode virar dor de cabeça.</h2><p className="mt-6 max-w-2xl text-base leading-8 text-[#c4d8e0]">O atendimento começa entendendo a necessidade do cliente para indicar o melhor caminho antes de executar o serviço. A conversa é direta do orçamento ao pós-serviço.</p><div className="mt-9 grid gap-4 sm:grid-cols-3">{[["Conversa clara", "Você entende o que será feito."], ["Atendimento direto", "Orientação pelo WhatsApp."], ["Frentes completas", "Da casa ao ambiente industrial."]].map(([title, text]) => <div key={title} className="border-l-2 border-[#ffd21d] pl-4"><p className="font-bold text-white">{title}</p><p className="mt-2 text-xs leading-5 text-[#9dbbc8]">{text}</p></div>)}</div></div>
              <figure className="relative m-0 pl-5 sm:pl-10"><div className="absolute inset-0 top-5 bg-[#0781c8]/30" /><PortfolioImage src="/images/js-eletrica-manutencao/medicao-energia-01.jpeg" alt="Atendimento técnico em medição elétrica" width={960} height={1280} className="relative h-[28rem] w-full object-cover shadow-2xl" /><figcaption className="absolute bottom-4 right-4 max-w-[15rem] border-l-2 border-[#ffd21d] bg-[#07131d]/95 px-4 py-3 text-xs leading-5 text-[#e2f1f5]">Foto oficial de atendimento técnico da JS Elétrica.</figcaption></figure>
            </div>
          </section>

          <section id="atuacao" className="bg-white px-5 py-20 text-[#07131d] lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl"><p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[#0781c8]">Área de atuação</p><h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">Uma frente técnica para cada tipo de ambiente.</h2><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{fieldNotes.map(([title, text], i) => <MotionReveal as="article" variant="up" delay={i * 80} key={title} className="border-t-2 border-[#0781c8] pt-5"><p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-[#0781c8]">0{i + 1}</p><h3 className="mt-3 font-display text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#61737d]">{text}</p></MotionReveal>)}</div></div>
          </section>

          <section id="contato" className="bg-[#ffd21d] px-5 py-16 text-[#07131d] lg:px-10 lg:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#07131d] p-8 text-white shadow-2xl sm:p-12 lg:flex-row lg:items-center"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[#55d6ef]">Vamos conversar</p><h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">Precisando de um eletricista?</h2><p className="mt-4 max-w-xl text-sm leading-7 text-[#c6d9e1]">Envie sua dúvida, foto ou vídeo pelo WhatsApp. A JS organiza uma orientação inicial para o seu atendimento.</p></div><CTA>Solicitar orçamento <ArrowRight className="h-4 w-4" /></CTA></div></section>
        </main>

        <footer className="border-t border-white/10 bg-[#050c12] px-5 py-8 text-sm text-[#9eb6c2] lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-display font-bold text-white">JS <span className="text-[#55d6ef]">Elétrica e Manutenção</span></p><p className="mt-1 text-xs">Residencial · Comercial · Predial · Industrial · Curitiba e região</p></div><div className="text-left sm:text-right"><p className="text-xs">Guaíra · Curitiba/PR</p><PortfolioHostCredit linkClassName="mt-2 inline-block font-semibold text-white underline underline-offset-4 hover:text-[#ffd21d]" /></div></div></footer>
        <PortfolioSocialProofPopup clientKey="js-eletrica-manutencao" eyebrow="JS Elétrica e Manutenção" title="Sua instalação merece uma avaliação clara." description="Conte o que precisa instalar, reparar ou modernizar e receba um próximo passo organizado." ctaLabel="Ver serviços" ctaHref="#servicos" delayMs={9000} className="border-[#ffd21d]/40 bg-[#07131d]/95 text-white" accentClassName="text-[#ffd21d]" />
        <PortfolioUpsellPopup pageName="portfolio-js-eletrica-manutencao" />
      </div>
    </MotionScope>
  );
}
