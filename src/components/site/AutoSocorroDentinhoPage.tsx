import { ArrowRight, CarFront, Check, CircleGauge, MapPin, MessageCircle, PhoneCall, ShieldCheck, Wrench, Package, Search, Timer } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const services = [
  { icon: Wrench, code: "01", title: "Manutenção mecânica", text: "Reparos e revisão para manter o carro pronto para a próxima saída.", items: ["Motor e transmissão", "Suspensão e freios", "Óleo e filtros"] },
  { icon: CircleGauge, code: "02", title: "Elétrica automotiva", text: "Diagnóstico e reparos para os sinais que o carro está tentando mostrar.", items: ["Sistema de ignição", "Bateria e alternador", "Central elétrica"] },
  { icon: CarFront, code: "03", title: "Reboque e socorro", text: "Quando parar não estava nos planos, a equipe ajuda a organizar o próximo passo.", items: ["Atendimento emergencial", "Cobertura regional", "Orientação direta"] },
  { icon: Package, code: "04", title: "Peças e acessórios", text: "Peças e itens para manter o veículo em ordem, conforme a necessidade identificada.", items: ["Peças para manutenção", "Itens de reposição", "Orientação na escolha"] },
  { icon: Search, code: "05", title: "Diagnóstico técnico", text: "Uma leitura objetiva do problema para evitar tentativas e decisões no escuro.", items: ["Avaliação inicial", "Identificação do sintoma", "Próximo passo claro"] },
  { icon: Timer, code: "06", title: "Atendimento rápido", text: "Conte o que aconteceu e receba uma orientação para encaminhar o atendimento.", items: ["Triagem pelo canal oficial", "Informações organizadas", "Orçamento sob consulta"] },
];

const faqs = [
  ["Quais serviços a Auto Socorro Dentinho oferece?", "A oficina trabalha com manutenção mecânica, elétrica automotiva, peças, diagnóstico e reboque, conforme a necessidade do veículo."],
  ["A oficina atende Quatro Barras e região?", "Sim. O atendimento é pensado para Quatro Barras e cidades próximas da Região Metropolitana de Curitiba. A disponibilidade é confirmada no contato."],
  ["Como solicito um orçamento?", "Use o botão de atendimento e conte o que aconteceu com o veículo. O funil organiza as primeiras informações antes de encaminhar a conversa."],
];

export function AutoSocorroDentinhoPage() {
  return (
    <div data-client-slug="auto-socorro-dentinho" className="min-h-dvh overflow-hidden bg-[#f3f0ea] text-[#162333] [--dentinho-ink:#162333] [--dentinho-orange:#f56617] [--dentinho-paper:#f3f0ea] [--dentinho-line:#c9c5bd]">
      <MotionScope intensity="EXPRESSIVE">
        <header className="relative z-20 border-b border-[#162333]/10 bg-[#f3f0ea]/95 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
            <a href="#inicio" className="flex items-center gap-3" aria-label="Auto Socorro Dentinho, início">
              <PortfolioImage priority managedField="logoUrl" src="/images/auto-socorro-dentinho/logo.svg" alt="Auto Socorro Dentinho" width={280} height={70} className="h-12 w-auto" />
            </a>
            <nav className="hidden items-center gap-7 text-sm font-bold md:flex" aria-label="Navegação principal">
              <a href="#servicos" className="transition-colors hover:text-[--dentinho-orange]">Serviços</a>
              <a href="#como-funciona" className="transition-colors hover:text-[--dentinho-orange]">Como funciona</a>
              <a href="#faq" className="transition-colors hover:text-[--dentinho-orange]">Dúvidas</a>
            </nav>
            <FunnelCTAButton clientKey="auto-socorro-dentinho" companySlug="auto-socorro-dentinho" formSlug="funnel-auto-socorro-dentinho" location="dentinho_header" showArrow={false} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[--dentinho-orange] px-4 text-sm font-black text-white shadow-lg shadow-orange-900/10 transition-transform hover:-translate-y-0.5">
              <MessageCircle className="h-4 w-4" /> Pedir atendimento
            </FunnelCTAButton>
          </div>
        </header>

        <main id="inicio">
          <section className="relative isolate overflow-hidden bg-[--dentinho-ink] px-5 py-14 text-white sm:py-20 lg:py-24">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(90deg,black,transparent_78%)]" />
            <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[--dentinho-orange] opacity-20 blur-3xl" />
            <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 border-l-2 border-[--dentinho-orange] pl-3 text-xs font-black uppercase tracking-[.22em] text-[#ffb28b]">Quatro Barras · Paraná</p>
                <MotionReveal variant="up"><h1 className="mt-6 max-w-2xl text-5xl font-black leading-[.9] tracking-[-.05em] sm:text-7xl lg:text-[clamp(4rem,7vw,7.2rem)]">Seu carro parou.<br /><span className="text-[--dentinho-orange]">A solução continua.</span></h1></MotionReveal>
                <p className="mt-7 max-w-xl text-lg leading-8 text-[#d5d9dc]">Oficina mecânica completa, diagnóstico e socorro automotivo para você voltar à estrada com clareza e segurança.</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <FunnelCTAButton clientKey="auto-socorro-dentinho" companySlug="auto-socorro-dentinho" formSlug="funnel-auto-socorro-dentinho" location="dentinho_hero" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[--dentinho-orange] px-6 py-3 font-black text-white shadow-xl shadow-orange-950/25">Solicitar atendimento <ArrowRight className="h-4 w-4" /></FunnelCTAButton>
                  <a href="#servicos" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-bold text-white transition-colors hover:border-white/60">Ver o que resolvemos</a>
                </div>
                <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-white/15 pt-5">
                  <div><strong className="block text-3xl font-black text-[--dentinho-orange]">14+</strong><span className="text-xs text-[#aeb8bf]">anos de história</span></div>
                  <div><strong className="block text-3xl font-black text-[--dentinho-orange]">24h</strong><span className="text-xs text-[#aeb8bf]">socorro disponível</span></div>
                  <div><strong className="block text-3xl font-black text-[--dentinho-orange]">01</strong><span className="text-xs text-[#aeb8bf]">canal direto</span></div>
                </div>
              </div>

              <MotionReveal variant="scale" className="relative lg:pl-8">
                <div className="relative mx-auto max-w-xl rotate-1 overflow-hidden rounded-[2rem] border border-white/15 bg-[#243344] p-3 shadow-2xl shadow-black/35">
                  <PortfolioImage priority managedField="heroImageUrl" src="/images/auto-socorro-dentinho/hero.svg" alt="Composição conceitual de um painel de diagnóstico automotivo" width={900} height={760} className="w-full rounded-[1.5rem]" />
                  <span className="absolute bottom-7 left-7 rounded-full bg-[#162333]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#ffb28b]">Arte de marca · não é foto documental</span>
                </div>
                <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl bg-[#f3f0ea] px-4 py-3 text-[#162333] shadow-xl sm:left-0"><ShieldCheck className="h-6 w-6 text-[--dentinho-orange]" /><span className="text-xs font-black uppercase tracking-wider">Diagnóstico<br />sem enrolação</span></div>
              </MotionReveal>
            </div>
          </section>

          <section id="servicos" className="px-5 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.22em] text-[--dentinho-orange]">Painel de serviços / 01</p><h2 className="mt-4 max-w-lg text-4xl font-black leading-[.95] tracking-[-.04em] sm:text-6xl">O problema tem um caminho.</h2></div><p className="max-w-md justify-self-end leading-7 text-[#5f6870]">Você não precisa chegar sabendo o nome da peça. A gente começa pelo sintoma, organiza o diagnóstico e indica a próxima etapa.</p></div>
              <div className="mt-12 grid gap-4 lg:grid-cols-3">{services.map(({ icon: Icon, code, title, text, items }) => <article key={code} className="group relative overflow-hidden border-t-2 border-[--dentinho-ink] bg-white p-7 shadow-[0_12px_0_#dedbd4] transition-transform hover:-translate-y-1"><span className="absolute right-6 top-5 font-mono text-sm font-bold text-[#b2afa8]">{code}</span><Icon className="h-8 w-8 text-[--dentinho-orange]" /><h3 className="mt-14 text-2xl font-black tracking-tight">{title}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-[#69717a]">{text}</p><ul className="mt-6 space-y-2 border-t border-[#162333]/10 pt-5 text-sm font-semibold">{items.map((item) => <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[--dentinho-orange]" />{item}</li>)}</ul></article>)}</div>
            </div>
          </section>

          <section id="como-funciona" className="bg-[#dfe5e3] px-5 py-20 sm:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[.22em] text-[--dentinho-orange]">A lógica Dentinho / 02</p><h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-.04em] sm:text-6xl">Menos adivinhação.<br />Mais direção.</h2><p className="mt-6 max-w-md leading-7 text-[#566168]">A experiência começa simples para quem está na rua e precisa de uma resposta objetiva.</p></div><ol className="divide-y divide-[#162333]/15 border-y border-[#162333]/15">{[["01", "Conte o que aconteceu", "Pode ser barulho, luz no painel ou simplesmente um carro que não liga."], ["02", "A equipe organiza o diagnóstico", "As primeiras informações ajudam a entender o tipo de atendimento necessário."], ["03", "Você combina o próximo passo", "Orçamento, oficina ou socorro: o atendimento segue o caminho mais claro."]].map(([number, title, text]) => <li key={number} className="grid gap-4 py-7 sm:grid-cols-[70px_1fr] sm:items-start"><span className="font-mono text-sm font-black text-[--dentinho-orange]">{number}</span><div><h3 className="text-xl font-black">{title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-[#5d686d]">{text}</p></div></li>)}</ol></div></section>

          <section className="bg-[--dentinho-orange] px-5 py-12 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.22em] text-white/70">Quando é agora</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pare de procurar no escuro.</h2></div><FunnelCTAButton clientKey="auto-socorro-dentinho" companySlug="auto-socorro-dentinho" formSlug="funnel-auto-socorro-dentinho" location="dentinho_mid_cta" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-black text-[--dentinho-ink]">Falar com o Dentinho <PhoneCall className="h-4 w-4" /></FunnelCTAButton></div></section>

          <section id="faq" className="px-5 py-20 sm:py-24"><div className="mx-auto max-w-4xl"><div className="text-center"><p className="text-xs font-black uppercase tracking-[.22em] text-[--dentinho-orange]">Perguntas frequentes / 03</p><h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">Antes de chamar, pode perguntar.</h2></div><div className="mt-12 space-y-3">{faqs.map(([question, answer]) => <details key={question} className="group border-b border-[#162333]/15 py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black"><span>{question}</span><span className="text-2xl font-normal text-[--dentinho-orange] transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-2 pt-4 text-sm leading-7 text-[#657078]">{answer}</p></details>)}</div></div></section>

          <section className="bg-[--dentinho-ink] px-5 py-16 text-white"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.22em] text-[#ffb28b]">Quatro Barras e região</p><h2 className="mt-4 max-w-2xl text-4xl font-black leading-[.95] tracking-[-.04em] sm:text-6xl">Seu próximo quilômetro começa com uma conversa.</h2></div><div className="border-l border-white/20 pl-6 text-[#c3cbd0]"><p className="flex items-start gap-3 text-sm leading-6"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[--dentinho-orange]" />Rua Vicente Vidolin, 800<br />Palmitazinho · Quatro Barras — PR</p><FunnelCTAButton clientKey="auto-socorro-dentinho" companySlug="auto-socorro-dentinho" formSlug="funnel-auto-socorro-dentinho" location="dentinho_footer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[--dentinho-orange] px-6 py-3 font-black text-white">Solicitar orçamento <ArrowRight className="h-4 w-4" /></FunnelCTAButton></div></div></section>
        </main>
      </MotionScope>
      <footer className="bg-[--dentinho-ink] px-5 pb-10 text-[#aeb8bf]"><div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-white/10 pt-7 text-sm sm:flex-row sm:items-end sm:justify-between"><div><PortfolioImage src="/images/auto-socorro-dentinho/logo-inverse.svg" alt="Auto Socorro Dentinho" width={280} height={70} className="h-10 w-auto" loading="lazy" /><p className="mt-3">Auto mecânica e socorro automotivo · Quatro Barras — PR</p></div><PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" /></div></footer>
      <PortfolioUpsellPopup pageName="portfolio-auto-socorro-dentinho" />
    </div>
  );
}
