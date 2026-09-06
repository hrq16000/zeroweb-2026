import { ArrowRight, Building2, Check, Clock3, Droplets, MapPin, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal, MotionScope, MotionStagger } from "@/components/motion";

const quiz = {
  proposalKind: "service" as const,
  services: ["Limpeza e conservação", "Escritório ou ambiente comercial", "Limpeza pós-obra", "Vidros, pisos e fachadas", "Serviço periódico personalizado"],
  experienceOptions: ["Empresa ou escritório", "Condomínio", "Obra em andamento", "Casa ou apartamento"],
  periodOptions: ["Curitiba", "Região Metropolitana", "Ainda preciso confirmar o local"],
  timingOptions: ["Preciso avaliar com urgência", "Nos próximos dias", "Serviço periódico", "Estou planejando"],
  stepTitles: { service: "Qual limpeza você precisa?", experience: "Que tipo de ambiente?", period: "Onde será o serviço?", timing: "Quando pretende começar?" },
  notePlaceholder: "Conte a metragem, frequência e detalhes do ambiente.",
};

const services = [
  { icon: Sparkles, title: "Limpeza e conservação", text: "Rotinas de cuidado para manter cada ambiente organizado, saudável e pronto para receber." },
  { icon: Building2, title: "Escritórios e empresas", text: "Atendimento profissional para ambientes comerciais, com escopo ajustado à sua operação." },
  { icon: ShieldCheck, title: "Limpeza pós-obra", text: "Remoção de resíduos e acabamento cuidadoso para entregar o espaço pronto para usar." },
  { icon: Droplets, title: "Vidros, pisos e fachadas", text: "Detalhes que mudam a percepção do ambiente, com planejamento para cada superfície." },
];

function CTA({ children }: { children: React.ReactNode }) {
  return <PortfolioCTAQuiz clientKey="popys-conservacao-limpeza" studioName="POPYS Conservação e Limpeza" recipientName="a equipe POPYS" theme="pink" mode="proposal" quizConfig={quiz}>{children}<ArrowRight className="h-4 w-4" /></PortfolioCTAQuiz>;
}

export function PopysConservacaoLimpezaPage() {
  return (
    <MotionScope>
      <div className="min-h-dvh overflow-hidden bg-[#fff9f6] text-[#211c20]">
        <header className="sticky top-0 z-30 border-b border-[#e8cbd1] bg-[#fff9f6]/95 px-5 py-4 backdrop-blur lg:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><a href="#inicio" className="flex items-center gap-3 font-display text-xl font-black"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#f0a3b5] text-[#211c20]">P</span><span>POPYS <span className="text-[#c95f7b]">Conservação</span></span></a><nav className="hidden gap-6 text-sm font-bold md:flex"><a href="#servicos">Soluções</a><a href="#processo">Como funciona</a><a href="#contato">Contato</a></nav><CTA>Solicitar orçamento</CTA></div></header>
        <main>
          <section id="inicio" className="relative overflow-hidden bg-[#f9e7e8] px-5 py-14 lg:px-8 lg:py-24"><div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#f0a3b5]/40 blur-3xl" /><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.88fr_1.12fr]"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#b84f6c]">Conservação · limpeza · Curitiba</p><MotionReveal variant="up"><h1 className="mt-5 max-w-xl font-display text-5xl font-black leading-[.95] sm:text-7xl">Seu ambiente limpo, <span className="text-[#c95f7b]">organizado e bem cuidado.</span></h1></MotionReveal><p className="mt-6 max-w-xl text-lg leading-8 text-[#5b4750]">Soluções profissionais para empresas, escritórios e obras, com atendimento personalizado para a necessidade de cada cliente.</p><div className="mt-8 flex flex-wrap gap-3"><CTA>Solicitar orçamento</CTA><a href="#servicos" className="inline-flex min-h-12 items-center rounded-full border border-[#c95f7b]/50 px-6 py-3.5 font-semibold text-[#83394f] hover:bg-white/60">Conhecer soluções</a></div><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[#694c56]"><span><MapPin className="mr-1 inline h-4 w-4 text-[#c95f7b]" />Curitiba e Região</span><span><Clock3 className="mr-1 inline h-4 w-4 text-[#c95f7b]" />Periódico ou sob medida</span></div></div><MotionImageReveal direction="left"><PortfolioImage src="/images/popys-conservacao-limpeza/hero-cleaning.png" alt="Profissionais realizando limpeza em um escritório moderno" priority width={1536} height={1024} className="mx-auto w-full max-w-2xl rounded-[2rem] object-cover shadow-2xl ring-1 ring-white/80" /></MotionImageReveal></div></section>
          <section id="servicos" className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#c95f7b]">Soluções POPYS</p><h2 className="mt-3 max-w-2xl font-display text-4xl font-black sm:text-5xl">Limpeza que sustenta a rotina.</h2><MotionStagger className="mt-10 grid gap-5 md:grid-cols-2">{services.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[2rem] border border-[#e8cbd1] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Icon className="h-8 w-8 text-[#c95f7b]" /><h3 className="mt-7 text-2xl font-black">{title}</h3><p className="mt-3 leading-7 text-[#684d57]">{text}</p><a href="#contato" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#a74461]">Organizar este serviço <ArrowRight className="h-4 w-4" /></a></article>)}</MotionStagger></div></section>
          <section id="processo" className="bg-[#211c20] px-5 py-20 text-white lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#f0a3b5]">Cuidado em cada detalhe</p><h2 className="mt-3 font-display text-4xl font-black sm:text-5xl">Um atendimento pensado para o seu ambiente.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">A POPYS entende o local, organiza a rotina e combina o escopo adequado antes de começar.</p><ul className="mt-8 grid gap-4 text-sm font-semibold text-white/85"><li><Check className="mr-2 inline h-5 w-5 text-[#f0a3b5]" />Atendimento personalizado</li><li><Check className="mr-2 inline h-5 w-5 text-[#f0a3b5]" />Profissionais preparados</li><li><Check className="mr-2 inline h-5 w-5 text-[#f0a3b5]" />Serviço periódico ou pontual</li></ul></div><div className="rounded-[2rem] border border-[#f0a3b5]/35 bg-white/5 p-8"><Waves className="h-8 w-8 text-[#f0a3b5]" /><h3 className="mt-6 font-display text-3xl font-black">Seu espaço merece constância.</h3><p className="mt-3 leading-7 text-white/70">Da primeira avaliação à manutenção, a equipe monta uma solução clara para sua realidade.</p><CTA>Descrever meu ambiente</CTA></div></div></section>
          <section id="contato" className="bg-[#f9e7e8] px-5 py-20 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[2rem] bg-[#c95f7b] p-8 text-white shadow-xl sm:p-12 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-white/80">Curitiba e região</p><h2 className="mt-3 font-display text-4xl font-black">Vamos cuidar do seu ambiente?</h2><p className="mt-4 max-w-xl leading-7 text-white/85">Conte o tipo de espaço, a frequência e o que precisa. A POPYS organiza o próximo passo.</p></div><CTA>Falar com a POPYS</CTA></div></section>
        </main>
        <footer className="bg-[#160f12] px-5 py-8 text-sm text-[#f8d7dd] lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-white">POPYS Conservação e Limpeza</p><p className="mt-1">Seu ambiente limpo, organizado e bem cuidado.</p></div><PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" /></div></footer>
        <PortfolioSocialProofPopup clientKey="popys-conservacao-limpeza" eyebrow="POPYS Conservação e Limpeza" title="Seu ambiente merece cuidado constante." description="Conte o tipo de espaço e receba um próximo passo personalizado." ctaLabel="Conhecer soluções" ctaHref="#servicos" delayMs={10000} className="border-[#f0a3b5]/40 bg-[#211c20]/95 text-white" accentClassName="text-[#f0a3b5]" />
        <PortfolioUpsellPopup pageName="portfolio-popys-conservacao-limpeza" />
      </div>
    </MotionScope>
  );
}
