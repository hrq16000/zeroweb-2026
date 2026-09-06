import { ArrowRight, CakeSlice, Clock3, Heart, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal, MotionScope, MotionStagger } from "@/components/motion";

const BRAND = {
  red: "#8f0d1a",
  deep: "#3b0710",
  cream: "#fff4df",
  gold: "#f4b544",
  blush: "#ffd7bd",
};

const quiz = {
  proposalKind: "service" as const,
  services: ["Salgados", "Doces", "Copo da Felicidade · R$ 22,00", "Encomenda para festa", "Quero conhecer o cardápio"],
  experienceOptions: ["Para mim", "Festa ou evento", "Presente", "Encomenda para a família"],
  periodOptions: ["Retirar na Costeira", "Combinar entrega", "Ainda preciso confirmar"],
  timingOptions: ["Para hoje", "Para esta semana", "Estou planejando"],
  stepTitles: { service: "O que você quer pedir?", experience: "Para qual ocasião?", period: "Como prefere receber?", timing: "Para quando precisa?" },
  notePlaceholder: "Conte a quantidade, sabores e data do pedido.",
};

const products = [
  { name: "Salgados artesanais", desc: "Coxinhas e outras opções douradas, feitas para comer quentinhas.", icon: Sparkles },
  { name: "Doces que abraçam", desc: "Brigadeiros, bolos e doces para adoçar a mesa e o presente.", icon: CakeSlice },
  { name: "Copo da Felicidade", desc: "Camadas cremosas e generosas por R$ 22,00.", icon: Heart },
];

function CTA({ children }: { children: React.ReactNode; location?: string }) {
  return <PortfolioCTAQuiz clientKey="mimo-salgados-doces" studioName="Mimo Salgados e Doces" recipientName="a equipe Mimo" theme="pink" mode="proposal" quizConfig={quiz}>{children}<ArrowRight className="h-4 w-4" /></PortfolioCTAQuiz>;
}

export function MimoSalgadosDocesPage() {
  return (
    <MotionScope>
      <div style={{ "--mimo-red": BRAND.red, "--mimo-deep": BRAND.deep, "--mimo-cream": BRAND.cream, "--mimo-gold": BRAND.gold, "--mimo-blush": BRAND.blush } as React.CSSProperties} className="min-h-dvh overflow-hidden bg-[var(--mimo-cream)] text-[var(--mimo-deep)]">
        <header className="sticky top-0 z-30 border-b border-[var(--mimo-gold)]/30 bg-[var(--mimo-cream)]/95 px-5 py-4 backdrop-blur lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><a href="#inicio" className="flex items-center gap-3 font-display text-xl font-black"><PortfolioImage managedField="logoUrl" priority src="/images/mimo-salgados-doces/logo.png" alt="Mimo Salgados e Doces" width={1132} height={1536} decoding="async" className="h-11 w-11 rounded-full object-cover" /><span>Mimo <span className="text-[var(--mimo-red)]">Salgados e Doces</span></span></a><nav className="hidden gap-6 text-sm font-bold md:flex"><a href="#sabores">Sabores</a><a href="#cardapio">Cardápio</a><a href="#encomendas">Encomendas</a></nav><CTA location="header">Pedir agora</CTA></div>
        </header>
        <main>
          <section id="inicio" className="relative overflow-hidden bg-[var(--mimo-red)] px-5 py-14 text-white lg:px-8 lg:py-24"><div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--mimo-gold)]/25 blur-3xl" /><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.88fr_1.12fr]"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--mimo-gold)]">Salgados · doces · Costeira</p><MotionReveal variant="up"><h1 className="mt-5 max-w-xl font-display text-5xl font-black leading-[.95] sm:text-7xl">Um carinho em forma de <span className="text-[var(--mimo-gold)]">sabor.</span></h1></MotionReveal><p className="mt-6 max-w-xl text-lg leading-8 text-white/80">Salgados artesanais, doces e copos da felicidade para deixar os pequenos e grandes momentos mais gostosos.</p><div className="mt-8 flex flex-wrap gap-3"><CTA location="hero">Fazer meu pedido</CTA><a href="#cardapio" className="inline-flex min-h-12 items-center rounded-full border border-white/35 px-6 py-3.5 font-semibold hover:bg-white/10">Ver cardápio</a></div><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-white/80"><span><MapPin className="mr-1 inline h-4 w-4 text-[var(--mimo-gold)]" />Costeira · São José dos Pinhais</span><span><Clock3 className="mr-1 inline h-4 w-4 text-[var(--mimo-gold)]" />Feito todos os dias</span></div></div><MotionImageReveal direction="left"><PortfolioImage managedField="heroImageUrl" src="/images/mimo-salgados-doces/hero-food.png" alt="Salgados artesanais, brigadeiros e copo da felicidade" priority width={1536} height={2048} className="mx-auto max-h-[680px] w-full max-w-xl rounded-[2rem] object-cover shadow-2xl ring-1 ring-white/20" /></MotionImageReveal></div></section>
          <section id="sabores" className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--mimo-red)]">Feito com amor</p><h2 className="mt-3 max-w-2xl font-display text-4xl font-black sm:text-5xl">Tem sabor para cada vontade.</h2><MotionStagger className="mt-10 grid gap-5 md:grid-cols-3">{products.map(({ name, desc, icon: Icon }) => <article key={name} className="rounded-[2rem] border border-[var(--mimo-gold)]/45 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Icon className="h-8 w-8 text-[var(--mimo-red)]" /><h3 className="mt-7 text-2xl font-black">{name}</h3><p className="mt-3 leading-7 text-[#6f3940]">{desc}</p></article>)}</MotionStagger></div></section>
          <section id="cardapio" className="bg-white px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><MotionReveal variant="left"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--mimo-red)]">Cardápio da casa</p><h2 className="mt-3 font-display text-4xl font-black">O copo da felicidade é R$ 22,00.</h2><p className="mt-5 text-lg leading-8 text-[#6f3940]">A informação atualizada fica clara no primeiro olhar. Para quantidades, sabores e disponibilidade do dia, fale com a equipe.</p><CTA location="cardapio">Consultar disponibilidade</CTA></div></MotionReveal><MotionImageReveal direction="left"><figure className="overflow-hidden rounded-[2rem] bg-[var(--mimo-red)] shadow-xl"><PortfolioImage src="/images/mimo-salgados-doces/menu-corrected.png" alt="Cardápio Mimo Salgados e Doces" width={1080} height={1920} className="max-h-[760px] w-full object-contain" /><figcaption className="px-6 py-4 text-center text-sm font-semibold text-white">Cardápio sujeito à disponibilidade do dia.</figcaption></figure></MotionImageReveal></div></section>
          <section id="encomendas" className="bg-[var(--mimo-deep)] px-5 py-20 text-white lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--mimo-gold)]">Encomendas e momentos especiais</p><h2 className="mt-3 font-display text-4xl font-black sm:text-5xl">Da vontade do dia à mesa da festa.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">Conte o que você imaginou, para quando precisa e como prefere receber. A Mimo combina os próximos passos com você.</p><div className="mt-8 flex flex-wrap gap-3"><CTA location="encomendas">Montar meu pedido</CTA><a href="https://maps.app.goo.gl/jBt67rLbru5KceSw9?g_st=awb" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold hover:bg-white/10"><MapPin className="h-4 w-4" />Como chegar</a></div></div><div className="rounded-[2rem] border border-[var(--mimo-gold)]/40 bg-white/5 p-8"><MessageCircle className="h-8 w-8 text-[var(--mimo-gold)]" /><h3 className="mt-6 font-display text-3xl font-black">Fale com a Mimo</h3><p className="mt-3 leading-7 text-white/75">R. Giocondo Dall Stella · Costeira<br />São José dos Pinhais — PR · 83085-050</p><p className="mt-4 text-sm font-semibold text-[var(--mimo-gold)]">Atendimento pelo canal oficial da loja</p></div></div></section>
        </main>
        <footer className="bg-[#26040a] px-5 py-8 text-sm text-[var(--mimo-blush)] lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-white">Mimo Salgados e Doces</p><p className="mt-1">Sabor que acolhe, feito com amor.</p></div><PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" /></div></footer>
        <PortfolioSocialProofPopup clientKey="mimo-salgados-doces" eyebrow="Mimo Salgados e Doces" title="Um carinho em forma de sabor." description="Conte o que você quer encomendar e combine os próximos passos com a equipe." ctaLabel="Ver cardápio" ctaHref="#cardapio" delayMs={10000} className="border-[var(--mimo-gold)]/40 bg-[var(--mimo-deep)]/95 text-white" accentClassName="text-[var(--mimo-gold)]" />
        <PortfolioUpsellPopup pageName="portfolio-mimo-salgados-doces" />
      </div>
    </MotionScope>
  );
}
