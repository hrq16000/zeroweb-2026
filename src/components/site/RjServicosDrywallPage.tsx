import { useState } from "react";
import { ArrowRight, Check, ChevronDown, CircleDot, Clock3, Hammer, Layers3, MapPin, PaintRoller, Ruler, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const services = [
  { icon: Layers3, title: "Paredes divisórias", text: "Novos ambientes com montagem seca, rápida e sem o quebra-quebra da alvenaria." },
  { icon: PaintRoller, title: "Paredes personalizadas", text: "Nichos, painéis de TV, efeitos 3D, temas infantis e detalhes decorativos sob medida." },
  { icon: Ruler, title: "Forros e rebaixamentos", text: "Teto liso, sancas e preparação precisa para valorizar a iluminação embutida." },
  { icon: Wrench, title: "Reparos em geral", text: "Correção de furos, áreas afetadas por infiltração e substituição de placas danificadas." },
] as const;
const faqs = [
  ["Vocês atendem fora de Curitiba?", "Sim. A RJ atende Curitiba e a Região Metropolitana, conforme endereço e disponibilidade da agenda."],
  ["O orçamento tem custo?", "Não. O orçamento é gratuito e sem compromisso. Fotos, medidas e o endereço ajudam a preparar uma avaliação mais objetiva."],
  ["Drywall faz muita sujeira?", "A montagem é mais limpa que a alvenaria tradicional. A equipe organiza e protege a área de trabalho para reduzir pó e resíduos."],
  ["Vocês fazem apenas obras completas?", "Não. Também são atendidos reparos pontuais, placas danificadas, furos, ajustes em forros e correções de acabamento."],
] as const;
const quizConfig = {
  proposalKind: "service" as const,
  services: services.map((service) => service.title),
  experienceOptions: ["Tenho fotos e medidas", "Tenho fotos, mas não as medidas", "Ainda preciso avaliar o local", "É um reparo urgente"],
  periodOptions: ["Curitiba", "São José dos Pinhais", "Colombo", "Pinhais", "Outra cidade da região"],
  timingOptions: ["O quanto antes", "Nos próximos 7 dias", "Ainda neste mês", "Estou planejando"],
  stepTitles: { service: "Qual serviço você precisa?", experience: "O que você já tem em mãos?", period: "Onde será o serviço?", timing: "Para quando você precisa?", note: "Conte os detalhes da obra" },
  stepSubtitles: { service: "Assim Rodnei entende o tipo de execução e acabamento.", experience: "Fotos e medidas ajudam a deixar a avaliação mais objetiva.", period: "A localização ajuda a confirmar o atendimento.", timing: "Uma previsão ajuda a organizar a agenda da obra.", note: "Inclua tudo que pode ajudar na primeira avaliação." },
  notePlaceholder: "Ex.: ambiente, medidas aproximadas, tipo de acabamento e melhor horário para visita.",
};

function BudgetButton({ location, label = "Pedir orçamento gratuito", className = "" }: { location: string; label?: string; className?: string }) {
  return <PortfolioCTAQuiz clientKey="rj-servicos-drywall" studioName="RJ Serviços de Drywall" recipientName="Rodnei" theme="navy" mode="proposal" quizConfig={quizConfig} ariaLabel={`${label} — ${location}`} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-black text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-4 focus-visible:ring-ring/40 ${className}`}>{label} <ArrowRight className="h-4 w-4" aria-hidden="true" /></PortfolioCTAQuiz>;
}

export function RjServicosDrywallPage() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <main className="portfolio-theme-rj min-h-dvh overflow-hidden bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5">
          <a href="#inicio" className="flex min-h-11 items-center gap-3 rounded-md font-display font-black tracking-tight focus-visible:ring-4 focus-visible:ring-ring/40" aria-label="RJ Serviços de Drywall — início"><span className="grid h-11 w-11 rotate-45 place-items-center rounded-md border-2 border-primary bg-secondary shadow-glow"><Hammer className="h-5 w-5 -rotate-45 text-primary" /></span><span className="leading-none">RJ <span className="text-primary">DRYWALL</span><small className="mt-1 block font-sans text-[10px] font-bold uppercase tracking-[.22em] text-muted-foreground">Soluções em drywall</small></span></a>
          <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-sm font-bold md:flex"><a href="#servicos" className="hover:text-primary">Serviços</a><a href="#acabamento" className="hover:text-primary">Acabamento</a><a href="#processo" className="hover:text-primary">Como funciona</a></nav>
          <BudgetButton location="cabeçalho" label="Orçamento" className="hidden sm:inline-flex" />
        </div>
      </header>

      <section id="inicio" className="relative min-h-[760px] bg-secondary pt-28 text-secondary-foreground">
        <PortfolioImage src="/images/rj-servicos-drywall/hero-drywall.webp" alt="Profissional aplicando acabamento fino em parede de drywall com nichos e painel de TV" priority width={1680} height={945} className="absolute inset-0 h-full w-full object-cover object-center"
            managedField="heroImageUrl"
          />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--secondary)_0%,color-mix(in_oklab,var(--secondary)_92%,transparent)_40%,color-mix(in_oklab,var(--secondary)_15%,transparent)_76%)]" /><div className="rj-grid-lines absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[632px] max-w-7xl items-center px-5 py-16"><div className="max-w-3xl"><p className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] text-primary"><MapPin className="h-4 w-4" /> Curitiba e Região Metropolitana</p><h1 className="max-w-3xl font-display text-5xl font-black uppercase leading-[.92] tracking-[-.045em] sm:text-7xl lg:text-[5.6rem]">Seu espaço muda.<br /><span className="text-primary">A obra não pesa.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">Instalação e manutenção de gesso acartonado com agilidade, obra organizada e acabamento fino do início ao fim.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><BudgetButton location="hero" /><a href="#servicos" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-secondary/70 px-6 py-3 font-bold hover:border-primary hover:text-primary">Explorar serviços</a></div><ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold" aria-label="Diferenciais">{["Orçamento gratuito", "Obra limpa", "Entrega no prazo"].map(item => <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {item}</li>)}</ul></div></div>
        <div className="absolute bottom-0 left-0 h-2 w-full bg-primary"><span className="rj-level-line block h-full w-1/3 bg-accent" /></div>
      </section>

      <section id="servicos" className="px-5 py-20 md:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.22em] text-primary">Do projeto ao reparo</p><h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">Drywall que resolve.</h2></div><p className="max-w-2xl text-lg leading-8 text-muted-foreground">Mais liberdade para criar ambientes, esconder imperfeições e renovar tetos e paredes com execução precisa.</p></div><div className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2">{services.map(({ icon: Icon, title, text }, index) => <article key={title} className="group relative min-h-64 border-b border-border p-7 transition hover:bg-muted md:border-r md:p-9"><span className="absolute right-6 top-5 font-display text-5xl font-black text-border">0{index + 1}</span><Icon className="h-8 w-8 text-primary transition group-hover:rotate-[-6deg] group-hover:scale-110" /><h3 className="mt-10 text-2xl font-black">{title}</h3><p className="mt-3 max-w-md leading-7 text-muted-foreground">{text}</p></article>)}</div></div></section>

      <section id="acabamento" className="bg-secondary px-5 py-20 text-secondary-foreground md:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center"><div className="relative"><PortfolioImage src="/images/rj-servicos-drywall/acabamento-sala.webp" alt="Sala finalizada com teto rebaixado, iluminação embutida, painel de TV, nichos e parede 3D em drywall" width={1488} height={1116} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft" /><div className="absolute -bottom-5 right-5 rounded-xl bg-primary p-5 text-primary-foreground shadow-glow"><Sparkles className="mb-2 h-5 w-5" /><strong className="block text-lg">Acabamento fino</strong><span className="text-sm">Detalhes que valorizam o ambiente</span></div></div><div><p className="text-xs font-black uppercase tracking-[.22em] text-primary">Projeto com personalidade</p><h2 className="mt-4 text-4xl font-black uppercase leading-[.95] sm:text-6xl">A parede deixa de ser limite.</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">Nichos, volumes, painéis e luz indireta transformam a arquitetura sem exigir uma reforma pesada. A solução nasce das medidas e do uso real de cada ambiente.</p><ul className="mt-8 grid gap-4 text-sm font-bold sm:grid-cols-2">{["Painel de TV", "Nichos iluminados", "Sancas e rasgos de luz", "Efeitos 3D decorativos"].map(item => <li key={item} className="flex min-h-12 items-center gap-3 border-l-2 border-primary pl-4"><CircleDot className="h-4 w-4 text-primary" />{item}</li>)}</ul></div></div></section>

      <section id="processo" className="px-5 py-20 md:py-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[.22em] text-primary">Obra sem complicação</p><h2 className="mt-3 max-w-2xl text-4xl font-black uppercase sm:text-6xl">Do primeiro contato à última conferência.</h2><ol className="mt-12 grid gap-5 md:grid-cols-3">{[[Clock3,"01","Conte o que precisa","Envie o tipo de serviço, localização, fotos e medidas que já tiver."],[Ruler,"02","Avaliação e orçamento","A necessidade é entendida antes da definição de materiais, prazo e execução."],[ShieldCheck,"03","Execução e acabamento","Montagem organizada, revisão dos detalhes e entrega do ambiente finalizado."]].map(([Icon,n,title,text]) => { const StepIcon = Icon as typeof Clock3; return <li key={String(n)} className="relative rounded-2xl border border-border bg-card p-7"><span className="font-display text-5xl font-black text-border">{String(n)}</span><StepIcon className="mt-8 h-7 w-7 text-primary" /><h3 className="mt-5 text-xl font-black">{String(title)}</h3><p className="mt-3 leading-7 text-muted-foreground">{String(text)}</p></li>})}</ol></div></section>

      <section className="bg-muted px-5 py-20 md:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-black uppercase tracking-[.22em] text-primary">Dúvidas frequentes</p><h2 className="mt-3 text-4xl font-black uppercase sm:text-5xl">Antes de começar.</h2><p className="mt-5 leading-7 text-muted-foreground">Informações objetivas para você pedir o orçamento com segurança.</p></div><div>{faqs.map(([question, answer], index) => { const open = openFaq === index; return <div key={question} className="border-b border-border"><button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? -1 : index)} className="flex min-h-16 w-full items-center justify-between gap-4 py-5 text-left text-lg font-black"><span>{question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-primary transition ${open ? "rotate-180" : ""}`} /></button><div className={`grid transition-[grid-template-rows,opacity] duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><p className="overflow-hidden pb-6 leading-7 text-muted-foreground">{answer}</p></div></div>})}</div></div></section>

      <section className="relative overflow-hidden bg-primary px-5 py-20 text-primary-foreground md:py-24"><div className="rj-grid-lines absolute inset-0 opacity-20" aria-hidden="true" /><div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.22em]">Curitiba e Região Metropolitana</p><h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[.95] sm:text-6xl">Seu próximo ambiente começa com uma boa conversa.</h2></div><BudgetButton location="cta-final" label="Solicitar meu orçamento" className="shrink-0 bg-secondary text-secondary-foreground" /></div></section>
      <footer className="bg-secondary px-5 py-10 text-secondary-foreground"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm sm:flex-row sm:items-end"><div><strong className="font-display text-xl">RJ <span className="text-primary">DRYWALL</span></strong><p className="mt-2 text-muted-foreground">Divisórias · Forros · Reformas</p><p className="mt-1 flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Curitiba e Região Metropolitana</p></div><PortfolioHostCredit className="text-muted-foreground" linkClassName="font-bold text-primary underline underline-offset-4 hover:text-accent" /></div></footer>
      <PortfolioSocialProofPopup clientKey="rj-servicos-drywall" eyebrow="Atendimento local" title="Precisa transformar ou reparar um ambiente?" description="Conte o serviço, envie as informações do local e receba uma avaliação da RJ Serviços de Drywall." ctaLabel="Pedir orçamento" ctaHref="#inicio" delayMs={7500} />
      <PortfolioUpsellPopup pageName="portfolio-rj-servicos-drywall" />
    </main>
  );
}
