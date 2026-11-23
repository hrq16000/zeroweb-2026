import { ArrowRight, ClipboardList, MapPin, MessageCircleQuestion, PartyPopper, Sparkles } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  proposalKind: "service" as const,
  services: ["Quero conhecer os salgados disponíveis", "Quero fazer uma encomenda", "Quero consultar quantidade e valores"],
  experienceOptions: ["Para casa ou família", "Aniversário ou comemoração", "Reunião ou encontro", "Outra ocasião"],
  periodOptions: ["Gostaria de combinar retirada", "Gostaria de consultar entrega", "Preciso saber as opções"],
  timingOptions: ["Nesta semana", "Nas próximas semanas", "Ainda estou planejando"],
  stepTitles: { service: "Como podemos ajudar?", experience: "Qual é a ocasião?", period: "Como imagina receber?", timing: "Quando será?" },
  stepSubtitles: { service: "Selecione o motivo da consulta; o cardápio será confirmado pelo atendimento.", period: "Entrega e retirada dependem de confirmação." },
  notePlaceholder: "Informe data, quantidade aproximada, preferências e suas dúvidas sobre o cardápio."
};

function CTA({ children, variant = "gold" }: { children: React.ReactNode; variant?: "gold" | "outline" }) {
  return (
    <PortfolioCTAQuiz clientKey="salgados-da-fran" studioName="Salgados da Fran"
      recipientName="a Fran" theme="gold" mode="proposal" quizConfig={quiz}
      className={variant === "gold"
        ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f6e52b] px-6 py-3 font-black text-[#20252b] shadow-lg transition motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6e52b]"
        : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#20252b] px-6 py-3 font-black text-[#20252b] transition motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#20252b]"}>
      {children}<ArrowRight aria-hidden="true" className="h-4 w-4" />
    </PortfolioCTAQuiz>
  );
}

export function SalgadosDaFranPage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#fff9e9] text-[#20252b]" lang="pt-BR" data-portfolio-client="salgados-da-fran">
      <p className="bg-[#f6e52b] px-4 py-2 text-center text-xs font-bold leading-5 text-[#20252b]">
        PROPOSTA DE SITE DEMONSTRATIVO DA 0WEB · NÃO É O SITE OFICIAL DO ESTABELECIMENTO
      </p>
      <header className="bg-[#20252b] px-5 py-5 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
          <a href="#inicio" aria-label="Salgados da Fran, voltar ao início" className="flex min-h-12 items-center gap-3">
            <img src="/images/salgados-da-fran/marca.svg" alt="" width="50" height="50" className="h-12 w-12" />
            <span className="text-xl font-black tracking-tight">Salgados <span className="text-[#f6e52b]">da Fran</span></span>
          </a>
          <nav aria-label="Navegação Salgados da Fran" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold">
            <a href="#encomendas" className="rounded-md py-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">Como encomendar</a>
            <a href="#duvidas" className="rounded-md py-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">Dúvidas</a>
            <a href="#local" className="rounded-md py-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">Local</a>
          </nav>
        </div>
      </header>
      <main>
        <section id="inicio" className="relative isolate overflow-hidden bg-[#20252b] px-5 pb-24 pt-12 text-white sm:pb-28 sm:pt-20">
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#e58b45]/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#f6e52b]/10 blur-3xl" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f6e52b]/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#f6e52b]">
              <Sparkles aria-hidden="true" className="h-4 w-4" /> São José dos Pinhais · PR
            </span>
            <img src="/images/salgados-da-fran/marca.svg" alt="Três salgadinhos ilustrados da identidade Salgados da Fran" width="240" height="240"
              className="my-7 h-40 w-40 drop-shadow-[0_18px_28px_rgba(0,0,0,.18)] sm:h-52 sm:w-52" />
            <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-[#e9a46c]">Encomendas</p>
            <h1 className="mt-3 max-w-4xl text-balance text-5xl font-black leading-[1.03] tracking-[-0.055em] sm:text-7xl lg:text-[6.3rem]">
              O seu momento. <span className="block text-[#f6e52b]">Os salgados da Fran.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-white/80 sm:text-xl">
              Quer organizar uma encomenda? Conte a ocasião, a quantidade e a data desejada.
              Os sabores, valores e condições são confirmados no atendimento.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <CTA>Consultar uma encomenda</CTA>
              <a href="#encomendas" className="inline-flex min-h-12 items-center rounded-full border border-white/50 px-6 py-3 font-semibold text-white hover:bg-white/10">Entender como pedir</a>
            </div>
          </div>
        </section>
        <section id="encomendas" className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#a65c2e]">Seu pedido começa aqui</p>
          <h2 className="mt-3 max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl">
            Três informações para começar a conversa.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", icon: PartyPopper, title: "A ocasião", desc: "Conte se é para casa, um encontro ou uma comemoração." },
              { n: "02", icon: ClipboardList, title: "O que você procura", desc: "Informe a quantidade aproximada e pergunte pelas opções do cardápio." },
              { n: "03", icon: MessageCircleQuestion, title: "Os detalhes", desc: "Consulte valores, disponibilidade e possibilidade de retirada ou entrega." }
            ].map(({ n, icon: Icon, title, desc }) => (
              <article key={n} className="rounded-[1.75rem] border border-[#e4d0af] bg-white p-7 shadow-[0_20px_60px_rgba(36,28,19,.04)] transition motion-safe:hover:-translate-y-1">
                <div className="flex items-start justify-between gap-2"><span className="text-5xl font-black tracking-tight text-[#dc9b54]">{n}</span><Icon aria-hidden="true" className="h-7 w-7 text-[#8f4c22]" /></div>
                <h3 className="mt-8 text-2xl font-black">{title}</h3><p className="mt-3 leading-7 text-[#585755]">{desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-9"><CTA variant="outline">Consultar opções e valores</CTA></div>
        </section>
        <section id="duvidas" className="bg-[#262b30] px-5 py-20 text-white sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f6e52b]">Antes de pedir</p>
              <h2 className="mt-4 text-balance text-4xl font-black tracking-tight sm:text-5xl">Tudo combinado, sem adivinhar.</h2>
              <p className="mt-5 leading-8 text-white/70">Esta apresentação usa informações publicamente divulgadas. Para detalhes atualizados, consulte o estabelecimento.</p>
            </div>
            <div className="space-y-3">
              {[
                ["A Fran aceita encomendas?", "Sim. O cartão divulgado pela Salgados da Fran informa encomendas e um contato de atendimento."],
                ["Quais sabores e tamanhos estão disponíveis?", "A lista atualizada não consta do material recebido. Peça as opções e as quantidades ao atendimento."],
                ["Quanto custa e com que antecedência pedir?", "Preços, antecedência e disponibilidade precisam ser confirmados no momento da consulta."],
                ["Tem entrega ou retirada?", "Essas condições não foram confirmadas. Consulte a possibilidade e a área atendida antes de fechar o pedido."]
              ].map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border border-white/20 bg-white/5 p-5">
                  <summary className="cursor-pointer list-none pr-2 text-lg font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{question}<span aria-hidden="true" className="float-right text-[#f6e52b] group-open:rotate-45">+</span></summary>
                  <p className="pt-4 leading-7 text-white/75">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="local" className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 sm:py-20 md:grid-cols-[1.1fr_.9fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#a65c2e]">Onde encontrar</p>
            <h2 className="mt-4 text-balance text-4xl font-black tracking-tight">Da região de Águas Belas, em São José dos Pinhais.</h2>
            <p className="mt-5 max-w-lg leading-8 text-[#585755]">A localização aparece em uma ficha pública com o mesmo nome e telefone do cartão. Confirme o endereço de retirada com a Fran antes de se deslocar.</p>
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=Salgados%20da%20Fran%20%C3%81guas%20Belas%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais"
            target="_blank" rel="noopener noreferrer" className="flex min-h-52 flex-col justify-between rounded-[2rem] bg-[#fbe5bb] p-8 transition motion-safe:hover:-translate-y-1">
            <MapPin aria-hidden="true" className="h-10 w-10 text-[#9a511d]" /><span className="text-2xl font-black">Águas Belas<br />São José dos Pinhais · PR</span>
            <span className="inline-flex items-center gap-2 font-bold underline underline-offset-4">Consultar no mapa <ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
          </a>
        </section>
        <section className="bg-[#f6e52b] px-5 py-20 text-[#20252b] sm:py-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em]">Salgados da Fran</p>
            <h2 className="mt-4 max-w-4xl text-balance text-4xl font-black leading-tight tracking-tight sm:text-6xl">Vai ter um momento especial? Comece pela encomenda.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7">Diga o que procura e confira as condições atuais pelo formulário de consulta.</p>
            <div className="mt-8"><CTA variant="outline">Quero consultar a Fran</CTA></div>
          </div>
        </section>
      </main>
      <footer className="bg-[#20252b] px-5 py-9 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div><p className="text-lg font-black">Salgados da Fran</p><p className="mt-1 text-sm text-white/65">Demonstração digital da 0WEB · Não é o site oficial do negócio.</p></div>
          <PortfolioHostCredit linkClassName="font-semibold text-[#f6e52b] underline underline-offset-4" />
        </div>
      </footer>
      <PortfolioUpsellPopup pageName="portfolio-salgados-da-fran" />
    </div>
  );
}
