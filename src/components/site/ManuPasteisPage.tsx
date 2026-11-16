import { ManagedText } from "@/components/portfolio/ManagedText";
import { ArrowRight, CalendarClock, Check, CreditCard, ExternalLink, Flame, Sparkles } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionReveal, MotionScope } from "@/components/motion";

const hours = ["Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function ManuPasteisPage() {
  return <div className="min-h-dvh bg-[#fff8ed] text-[#3c1d14]"><header className="sticky top-0 z-20 border-b border-[#f1d5b5] bg-[#fff8ed]/95 px-5 py-4 backdrop-blur lg:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><a href="#inicio" aria-label="Manu Pastéis" className="shrink-0"><PortfolioImage managedField="logoUrl" priority src="/images/manu-pasteis/logo.png" alt="Manu Pastéis" width={768} height={256} decoding="async" className="h-10 w-auto" /></a><nav className="hidden gap-6 text-sm font-semibold md:flex"><a href="#cardapio">Cardápio</a><a href="#horarios">Horários</a><a href="#pagamento">Pagamento</a></nav><a href="/f/funnel-manu-pasteis" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d94118] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#d94118]/20">Ver cardápio <ExternalLink className="h-4 w-4" /></a></div></header><MotionScope intensity="EXPRESSIVE"><main>
    <section id="inicio" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-24"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#d94118]">Pastéis quentinhos · Manu Pastéis</p><MotionReveal variant="scale"><h1 className="mt-5 max-w-xl text-5xl font-black leading-[.98] tracking-tight sm:text-7xl">
            <ManagedText field="heroHeadline" fallback={"Ter\u00e7ooou, minha gente. Bora comer pastel?"} />
          </h1></MotionReveal><MotionReveal variant="up" delay={130}><p className="mt-6 max-w-xl text-lg leading-8 text-[#79574a]">
            <ManagedText field="heroSubheadline" fallback={"Pastelzinho bem recheado e quentinho para deixar sua noite mais gostosa. Escolha seus sabores e fa\u00e7a o pedido pelo card\u00e1pio online."} />
          </p></MotionReveal><div className="mt-8 flex flex-wrap gap-3"><a href="/f/funnel-manu-pasteis" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#d94118] px-6 py-3 font-bold text-white">Pedir pelo cardápio <ExternalLink className="h-4 w-4" /></a><FunnelCTAButton intent={{ purpose: "proposal", source: "portfolio-manu-pasteis", pagePath: "/portfolio/manu-pasteis", placement: "section", companySlug: "manu-pasteis" }} location="manu_hero" label="Falar com a loja" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#d99c71] px-6 py-3 font-semibold text-[#a33a1c]" /></div><div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold text-[#79574a]"><span><Check className="mr-1 inline h-4 w-4 text-[#e88916]" />Recheio caprichado</span><span><Flame className="mr-1 inline h-4 w-4 text-[#e88916]" />Sempre quentinho</span></div></div><div><PortfolioImage src="/images/manu-pasteis/hero.png" alt="Pastel recheado da Manu Pastéis" priority width={720} height={1280} className="mx-auto w-full max-w-xl rounded-[2rem] object-cover shadow-2xl shadow-[#d94118]/20"
            managedField="heroImageUrl"
          /></div></section>
    <section id="cardapio" className="bg-[#d94118] px-5 py-20 text-white lg:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#ffe2a7]">Cardápio online</p><h2 className="mt-3 max-w-2xl text-4xl font-black">Escolha seu pastel e faça o pedido.</h2><MotionReveal variant="left" className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-white/10 p-6"><div><Sparkles className="h-8 w-8 text-[#ffe2a7]" /><p className="mt-4 max-w-xl text-lg leading-8 text-white/85">O cardápio da Manu Pastéis está disponível online para você consultar as opções e pedir no seu ritmo.</p></div><a href="/f/funnel-manu-pasteis" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#ffe2a7] px-6 py-3 font-black text-[#3c1d14]">Abrir cardápio <ExternalLink className="h-4 w-4" /></a></MotionReveal></div></section>
    <aside id="como-pedir" className="px-5 py-14 lg:px-8" aria-labelledby="como-pedir-title">
      <div className="mx-auto max-w-6xl border-y border-[#f1d5b5] py-9">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[#d94118]">Antes de fechar</p>
        <h2 id="como-pedir-title" className="mt-3 max-w-3xl text-3xl font-black">
          Cardápio, horário e forma de pagamento deixam o pedido mais direto.
        </h2>
        <dl className="mt-8 grid gap-5 md:grid-cols-3">
          <div>
            <dt className="font-black text-[#3c1d14]">Escolha no cardápio</dt>
            <dd className="mt-2 text-sm leading-7 text-[#79574a]">Consulte os sabores e opções disponíveis no cardápio online antes de enviar o pedido.</dd>
          </div>
          <div>
            <dt className="font-black text-[#3c1d14]">Confira o horário</dt>
            <dd className="mt-2 text-sm leading-7 text-[#79574a]">A Manu informa atendimento de terça a sábado, das 18h30 às 23h.</dd>
          </div>
          <div>
            <dt className="font-black text-[#3c1d14]">Defina o pagamento</dt>
            <dd className="mt-2 text-sm leading-7 text-[#79574a]">PIX e cartão de crédito aparecem como opções online; dinheiro, crédito e débito podem ser escolhidos para pagamento na entrega.</dd>
          </div>
        </dl>
      </div>
    </aside>

    <section id="horarios" className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2"><MotionReveal variant="up" className="rounded-2xl border border-[#f1d5b5] bg-white p-7"><CalendarClock className="h-8 w-8 text-[#d94118]" /><h2 className="mt-6 text-3xl font-black">Horário de funcionamento</h2><ul className="mt-6 divide-y divide-[#f1d5b5]">{hours.map((day) => <li key={day} className="flex justify-between py-3 font-semibold transition-colors duration-200 hover:text-[#d94118]"><span>{day}</span><span className="text-[#a33a1c]">18h30 – 23h</span></li>)}</ul></MotionReveal><MotionReveal variant="up" delay={140}><div id="pagamento" className="rounded-2xl bg-[#3c1d14] p-7 text-white"><CreditCard className="h-8 w-8 text-[#ffe2a7]" /><h2 className="mt-6 text-3xl font-black">Formas de pagamento</h2><div className="mt-6 grid gap-3 text-white/80"><p><strong className="text-white">Pagar online:</strong> PIX e cartão de crédito.</p><p><strong className="text-white">Pagar na entrega:</strong> dinheiro, cartão de crédito e cartão de débito.</p></div><p className="mt-7 text-sm text-white/60">Consulte disponibilidade e condições no cardápio.</p></div></MotionReveal></div></section>
    <section className="bg-[#ffe2a7] px-5 py-16 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><h2 className="text-3xl font-black">Bora pedir um pastel?</h2><p className="mt-3 max-w-xl leading-7 text-[#79574a]">Acesse o cardápio online da Manu Pastéis e escolha seu pedido.</p></div><a href="/f/funnel-manu-pasteis" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#3c1d14] px-7 py-3 font-bold text-white transition-transform duration-200 hover:-translate-y-0.5">Ver cardápio completo <ExternalLink className="h-4 w-4" /></a></div></section>
  </main></MotionScope><footer className="bg-[#3c1d14] px-5 py-8 text-sm text-[#f8ddbf] lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p><strong className="text-white">Manu Pastéis</strong><br />Pastéis recheados e quentinhos.</p><PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" /></div></footer><PortfolioSocialProofPopup clientKey="manu-pasteis" eyebrow="Manu Pastéis" title="Pastelzinho bem recheado e quentinho." description="Consulte o cardápio online e escolha seus sabores." ctaLabel="Abrir cardápio" ctaHref="/f/funnel-manu-pasteis" delayMs={9000} className="border-[#d94118]/35 bg-[#3c1d14]/95 text-white" accentClassName="text-[#ffe2a7]" /><PortfolioUpsellPopup pageName="portfolio-manu-pasteis" /></div>;
}
