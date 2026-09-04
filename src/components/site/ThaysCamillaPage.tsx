import { ManagedText } from "@/components/portfolio/ManagedText";
import { ArrowRight, Check, Gift, Heart, MapPin, Sparkles, Star, type LucideIcon } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: ["Kit promocional: caneca + azulejo", "Caneca de cerâmica personalizada", "Azulejo personalizado 15x15 cm", "Quero conhecer outras opções"],
  experienceOptions: ["Para presentear", "Para minha casa", "Para uma data especial", "Ainda estou escolhendo"],
  periodOptions: ["Quero combinar a entrega", "Vou retirar", "Preciso consultar", "Ainda não sei"],
  timingOptions: ["O quanto antes", "Nesta semana", "Estou pesquisando", "Quero combinar"],
  proposalKind: "service" as const,
  stepTitles: { service: "O que você gostaria de personalizar?", experience: "Qual é a ocasião?", period: "Como prefere receber?", timing: "Quando você precisa?", note: "Conte os detalhes" },
  notePlaceholder: "Ex.: frase, imagem, cores, quantidade ou data do presente.",
};

function CTA({ children }: { children: React.ReactNode }) {
  return <PortfolioCTAQuiz clientKey="thays-camilla" studioName="Thays Camilla" recipientName="Thays Camilla" theme="pink" mode="proposal" quizConfig={quiz} ariaLabel="Falar com Thays Camilla" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e87859] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#e87859]/25 transition hover:-translate-y-0.5 hover:bg-[#d6654a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87859]">{children}</PortfolioCTAQuiz>;
}

const highlights: Array<[string, string, LucideIcon]> = [
  ["Personalizado", "Caneca e azulejo com a imagem ou mensagem que você escolher.", Gift],
  ["Presente com significado", "Uma combinação pensada para celebrar quem você ama.", Heart],
  ["Acabamento cuidadoso", "Peças de cerâmica com estampa nítida e apresentação para presente.", Sparkles],
];

export function ThaysCamillaPage() {
  return <div className="min-h-dvh overflow-hidden bg-[#fff9f4] text-[#3f2117]">
    <header className="sticky top-0 z-20 border-b border-[#f1d8ca] bg-[#fff9f4]/95 px-5 py-4 backdrop-blur lg:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><a href="#inicio" aria-label="Thays Camilla Personalizados" className="shrink-0"><img src="/images/thays-camilla/logo.png" alt="Thays Camilla Personalizados" width={1536} height={1024} loading="eager" fetchPriority="high" decoding="async" className="h-12 w-auto max-w-[200px] object-contain" /></a><nav className="hidden gap-6 text-sm font-semibold text-[#704738] md:flex"><a href="#kit" className="hover:text-[#e87859]">Kit promocional</a><a href="#detalhes" className="hover:text-[#e87859]">Detalhes</a><a href="#pedido" className="hover:text-[#e87859]">Pedido</a></nav><CTA>Montar meu presente <ArrowRight className="h-4 w-4" /></CTA></div></header>
    <main>
      <section id="inicio" className="relative overflow-hidden px-5 py-14 lg:px-8 lg:py-24"><div className="pointer-events-none absolute -right-56 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#f8c6b2]/35 blur-3xl" /><div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]"><div className="relative"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#d6654a]">Presentes que guardam histórias</p><h1 className="mt-5 max-w-xl font-serif text-5xl font-semibold leading-[.98] tracking-tight sm:text-7xl">
            <ManagedText field="heroHeadline" fallback={"Personalize carinho em cada detalhe."} />
          </h1><p className="mt-6 max-w-xl text-lg leading-8 text-[#704738]">
            <ManagedText field="heroSubheadline" fallback={"Canecas e azulejos personalizados para transformar uma mensagem, uma imagem ou uma lembran\u00e7a em presente."} />
          </p><div className="mt-8 flex flex-wrap gap-3"><CTA>Quero personalizar <ArrowRight className="h-4 w-4" /></CTA><a href="#kit" className="inline-flex min-h-12 items-center rounded-full border border-[#d8987e]/50 px-6 py-3.5 font-semibold text-[#704738] transition hover:border-[#e87859] hover:text-[#d6654a]">Ver o kit</a></div><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[#704738]"><span><Check className="mr-1 inline h-4 w-4 text-[#d6654a]" />Feito para presentear</span><span><Check className="mr-1 inline h-4 w-4 text-[#d6654a]" />Do seu jeito</span></div></div><div className="relative"><div className="absolute -inset-4 rounded-[2rem] bg-[#edb49c]/25 blur-2xl" /><PortfolioImage src="/images/thays-camilla/hero.png" alt="Kit de caneca e azulejo personalizados Thays Camilla" priority width={1280} height={1280} className="relative mx-auto w-full max-w-xl rounded-[2rem] border border-[#f1d8ca] object-cover shadow-2xl shadow-[#8e4c37]/20"
            managedField="heroImageUrl"
          /></div></div></section>
      <section id="kit" className="bg-[#f8e4d8] px-5 py-20 lg:px-8"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#d6654a]">Kit promocional</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Caneca + azulejo personalizados.</h2><p className="mt-5 text-lg leading-8 text-[#704738]">Um presente completo para você escolher a mensagem e criar uma lembrança com significado.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{highlights.map(([title, text, Icon]) => <article key={title} className="rounded-3xl border border-[#edc6b4] bg-[#fff9f4] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Icon className="h-8 w-8 text-[#d6654a]" /><h3 className="mt-8 font-serif text-2xl">{title}</h3><p className="mt-3 leading-7 text-[#704738]">{text}</p></article>)}</div><div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#edb49c] bg-[#fff9f4] p-5 text-[#704738]"><Star className="h-5 w-5 fill-[#e87859] text-[#e87859]" /><span className="font-semibold">Kit promocional informado: R$ 59,90</span><span className="text-sm">Caneca + azulejo 15x15 cm.</span></div></div></section>
      <section id="detalhes" className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#d6654a]">Do seu jeito</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Uma ideia sua, transformada em presente.</h2><ul className="mt-8 grid gap-4 sm:grid-cols-2">{["Caneca de cerâmica personalizada", "Azulejo personalizado 15x15 cm", "Imagem, frase e cores escolhidas por você", "Embalagem segura para presente"].map((item) => <li key={item} className="flex items-start gap-3 rounded-2xl border border-[#f1d8ca] bg-white/70 p-5"><Heart className="mt-0.5 h-5 w-5 shrink-0 text-[#d6654a]" /><span className="font-semibold text-[#704738]">{item}</span></li>)}</ul></div><div id="pedido" className="rounded-[2rem] bg-[#4b271d] p-8 text-[#fff9f4] shadow-2xl"><Gift className="h-8 w-8 text-[#f5b39a]" /><h3 className="mt-6 font-serif text-3xl">Vamos criar o seu?</h3><p className="mt-3 leading-7 text-[#f8e4d8]">Conte a mensagem, a imagem ou a ocasião. A Thays combina os detalhes do seu personalizado no atendimento.</p><CTA>Falar com Thays Camilla <ArrowRight className="h-4 w-4" /></CTA><p className="mt-5 text-xs text-[#edc6b4]/75">Disponibilidade, arte final e entrega são confirmadas no atendimento.</p></div></div></section>
      <section className="bg-[#d6654a] px-5 py-16 text-white lg:px-8"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><Sparkles className="h-8 w-8" /><p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-white/75">Personalizados com carinho</p><h2 className="mt-2 font-serif text-3xl">Presenteie com uma história sua.</h2><p className="mt-3 max-w-xl leading-7 text-white/80">Conheça o kit e transforme uma lembrança em uma peça para guardar.</p></div><CTA>Conhecer o kit <ArrowRight className="h-4 w-4" /></CTA></div></section>
    </main>
    <footer className="bg-[#2e1914] px-5 py-8 text-sm text-[#f0cbbb] lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-[#fff9f4]">Thays Camilla</p><p className="mt-1">Caneca e azulejo personalizados.</p><p className="mt-1 flex items-center gap-1"><MapPin className="h-4 w-4 text-[#f5b39a]" />Atendimento e entrega a combinar.</p></div><PortfolioHostCredit linkClassName="font-semibold text-[#fff9f4] underline underline-offset-4 hover:text-white" /></div></footer>
    <PortfolioSocialProofPopup clientKey="thays-camilla" eyebrow="Thays Camilla Personalizados" title="Personalize carinho em cada detalhe." description="Caneca e azulejo para presentear com uma história sua." ctaLabel="Ver o kit" ctaHref="#kit" delayMs={9000} className="border-[#e87859]/45 bg-[#4b271d]/95 text-white" accentClassName="text-[#f5b39a]" /><PortfolioUpsellPopup pageName="portfolio-thays-camilla" />
  </div>;
}
