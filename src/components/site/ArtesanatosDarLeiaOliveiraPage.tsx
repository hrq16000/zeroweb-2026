import { ManagedText } from "@/components/portfolio/ManagedText";
import { ArrowRight, Check, Coffee, Heart, Instagram, Leaf, MapPin, ShoppingBag, Sparkles, type LucideIcon } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Coador de café 100% algodão",
    "Escolher uma estampa",
    "Presente artesanal",
    "Quero conhecer outros artesanatos",
  ],
  experienceOptions: ["Para minha casa", "Para presentear", "Quero encomendar", "Ainda estou conhecendo"],
  periodOptions: ["Quero combinar a entrega", "Vou retirar", "Preciso consultar", "Ainda não sei"],
  timingOptions: ["O quanto antes", "Nesta semana", "Estou pesquisando", "Quero combinar"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você gostaria de conhecer?",
    experience: "Como pretende usar?",
    period: "Como prefere receber?",
    timing: "Quando você precisa?",
    note: "Conte os detalhes",
  },
  notePlaceholder: "Ex.: cor, estampa, quantidade ou ocasião do presente.",
};

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioCTAQuiz
      clientKey="artesanatos-darleia-oliveira"
      studioName="Artesanatos Darléia Oliveira"
      recipientName="Darléia"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      ariaLabel="Falar com Artesanatos Darléia Oliveira"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#bd355d] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#bd355d]/25 transition hover:-translate-y-0.5 hover:bg-[#a5284e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd355d]"
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const highlights: Array<[string, string, LucideIcon]> = [
  ["100% algodão", "Tecido pensado para um café mais puro e saboroso.", Leaf],
  ["Reutilizável", "Uma escolha econômica para a rotina e para o planeta.", Heart],
  ["Feito à mão", "Cada acabamento recebe cuidado e atenção aos detalhes.", Sparkles],
];

export function ArtesanatosDarLeiaOliveiraPage() {
  return (
    <div className="min-h-dvh overflow-hidden bg-[#fff8ef] text-[#3e241d]">
      <header className="sticky top-0 z-20 border-b border-[#ead6c5] bg-[#fff8ef]/95 px-5 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Artesanatos Darléia Oliveira" className="shrink-0">
            <PortfolioImage managedField="logoUrl" priority src="/images/artesanatos-darleia-oliveira/logo.png" alt="Artesanatos Darléia Oliveira" width={1280} height={1280} decoding="async" className="h-12 w-auto max-w-[190px] object-contain" />
          </a>
          <nav className="hidden gap-6 text-sm font-semibold text-[#6d4a3e] md:flex"><a href="#produto" className="hover:text-[#bd355d]">O coador</a><a href="#detalhes" className="hover:text-[#bd355d]">Detalhes</a><a href="#instagram" className="hover:text-[#bd355d]">Instagram</a></nav>
          <CTA>Conhecer os produtos <ArrowRight className="h-4 w-4" /></CTA>
        </div>
      </header>
      <main>
        <section id="inicio" className="relative overflow-hidden px-5 py-14 lg:px-8 lg:py-24"><div className="pointer-events-none absolute -left-48 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#e9a1a5]/25 blur-3xl" /><div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.92fr_1.08fr]"><div className="relative"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#bd355d]">Artesanato para o café de todos os dias</p><h1 className="mt-5 max-w-xl font-serif text-5xl font-semibold leading-[.98] tracking-tight sm:text-7xl">
            <ManagedText field="heroHeadline" fallback={"Seu caf\u00e9 merece o melhor filtro."} />
          </h1><p className="mt-6 max-w-xl text-lg leading-8 text-[#6d4a3e]">
            <ManagedText field="heroSubheadline" fallback={"Coador de caf\u00e9 100% algod\u00e3o, reutiliz\u00e1vel e feito \u00e0 m\u00e3o para transformar cada x\u00edcara em um momento de aconchego."} />
          </p><div className="mt-8 flex flex-wrap gap-3"><CTA>Quero conhecer <ArrowRight className="h-4 w-4" /></CTA><a href="#produto" className="inline-flex min-h-12 items-center rounded-full border border-[#c98c77]/50 px-6 py-3.5 font-semibold text-[#6d4a3e] transition hover:border-[#bd355d] hover:text-[#bd355d]">Ver detalhes</a></div><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[#6d4a3e]"><span><Check className="mr-1 inline h-4 w-4 text-[#bd355d]" />Lavável e durável</span><span><Check className="mr-1 inline h-4 w-4 text-[#bd355d]" />Acabamento artesanal</span></div></div><div className="relative"><div className="absolute -inset-4 rounded-[2rem] bg-[#e5b58b]/25 blur-2xl" /><PortfolioImage src="/images/artesanatos-darleia-oliveira/hero.png" alt="Coador de café de algodão Artesanatos Darléia Oliveira" priority width={853} height={1280} className="relative mx-auto w-full max-w-lg rounded-[2rem] border border-[#ead6c5] object-cover shadow-2xl shadow-[#8e543c]/20"
            managedField="heroImageUrl"
          /></div></div></section>
        <section id="produto" className="bg-[#f3dfca] px-5 py-20 lg:px-8"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#bd355d]">O produto</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Sabor que aconchega.</h2><p className="mt-5 text-lg leading-8 text-[#6d4a3e]">O coador de algodão combina praticidade e carinho em um pequeno ritual: café mais puro, sem resíduos e com todo o aroma.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{highlights.map(([title, text, Icon]) => <article key={title} className="rounded-3xl border border-[#e1c2aa] bg-[#fff8ef] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Icon className="h-8 w-8 text-[#bd355d]" /><h3 className="mt-8 font-serif text-2xl">{title}</h3><p className="mt-3 leading-7 text-[#6d4a3e]">{text}</p></article>)}</div></div></section>
        <section id="detalhes" className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#bd355d]">Feito para presentear</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Pequenos detalhes que fazem diferença.</h2><ul className="mt-8 grid gap-4 sm:grid-cols-2">{["Estampas e acabamentos delicados", "Uso prático no dia a dia", "Opção artesanal para presentear", "Produção feita com cuidado"].map((item) => <li key={item} className="flex items-start gap-3 rounded-2xl border border-[#ead6c5] bg-white/70 p-5"><Coffee className="mt-0.5 h-5 w-5 shrink-0 text-[#bd355d]" /><span className="font-semibold text-[#6d4a3e]">{item}</span></li>)}</ul></div><div id="atendimento" className="rounded-[2rem] bg-[#4a2921] p-8 text-[#fff8ef] shadow-2xl"><ShoppingBag className="h-8 w-8 text-[#f2bd9d]" /><h3 className="mt-6 font-serif text-3xl">Quer escolher o seu?</h3><p className="mt-3 leading-7 text-[#f3dfca]">Conte a ocasião, a estampa ou a quantidade e combine os detalhes diretamente com a artesã.</p><CTA>Falar com Darléia <ArrowRight className="h-4 w-4" /></CTA><p className="mt-5 text-xs text-[#eac9b3]/75">Disponibilidade, valores e entrega são confirmados no atendimento.</p></div></div></section>
        <section id="instagram" className="bg-[#bd355d] px-5 py-16 text-white lg:px-8"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><Instagram className="h-8 w-8" /><p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-white/75">Acompanhe o artesanato</p><h2 className="mt-2 font-serif text-3xl">Veja novidades e encomendas.</h2><p className="mt-3 max-w-xl leading-7 text-white/80">Conheça o trabalho da Artesanatos Darléia Oliveira no Instagram.</p></div><a href="https://www.instagram.com/darleia__artesanatos" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#8d2345]">Abrir Instagram <ArrowRight className="h-4 w-4" /></a></div></section>
      </main>
      <footer className="bg-[#2e1b17] px-5 py-8 text-sm text-[#e8c9b5] lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-[#fff8ef]">Artesanatos Darléia Oliveira</p><p className="mt-1">Coador de café 100% algodão, feito à mão.</p><p className="mt-1 flex items-center gap-1"><MapPin className="h-4 w-4 text-[#f2bd9d]" />Atendimento e entrega a combinar.</p></div><PortfolioHostCredit linkClassName="font-semibold text-[#fff8ef] underline underline-offset-4 hover:text-white" /></div></footer>
      <PortfolioSocialProofPopup clientKey="artesanatos-darleia-oliveira" eyebrow="Artesanato feito à mão" title="Seu café merece um momento de aconchego." description="Coador de café 100% algodão, reutilizável e artesanal." ctaLabel="Ver detalhes" ctaHref="#produto" delayMs={9000} className="border-[#bd355d]/45 bg-[#4a2921]/95 text-white" accentClassName="text-[#f2bd9d]" />
      <PortfolioUpsellPopup pageName="portfolio-artesanatos-darleia-oliveira" />
    </div>
  );
}
