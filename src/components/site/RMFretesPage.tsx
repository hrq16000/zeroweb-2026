import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  ChevronDown,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { FunnelModalWrapper } from "@/components/funnel/FunnelModalWrapper";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const services = [
  ["Fretes rápidos", "Coletas e entregas ágeis para itens que precisam chegar com segurança."],
  ["Carretos", "Transporte local para móveis, eletrodomésticos, caixas e cargas compactas."],
  [
    "Pequenas mudanças",
    "Mudanças residenciais e comerciais de pequeno porte em Curitiba e região.",
  ],
  ["Carga especial", "Avaliação prévia de volume, acesso, amarração e proteção da carga."],
];

const faq = [
  [
    "Quais regiões a RM Fretes atende?",
    "Curitiba e municípios da Região Metropolitana, conforme origem, destino e disponibilidade.",
  ],
  [
    "Como o orçamento é calculado?",
    "Consideramos origem, destino, volume, peso aproximado, acessos, necessidade de ajuda e urgência.",
  ],
  [
    "Posso enviar fotos dos itens?",
    "Sim. Fotos e medidas ajudam a identificar o espaço necessário e deixam o orçamento mais preciso.",
  ],
  [
    "Quais pagamentos são aceitos?",
    "Pix, dinheiro e cartões de crédito ou débito, com confirmação no atendimento.",
  ],
];

export function RMFretesPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [funnelOpen, setFunnelOpen] = useState(false);
  const ctaClass =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffd000] px-6 py-3.5 font-black text-[#080b12] shadow-[0_14px_40px_rgba(255,208,0,.22)] transition hover:-translate-y-0.5 hover:bg-[#ffe05b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd000]/40";
  return (
    <main className="portfolio-theme-rm-fretes min-h-screen overflow-hidden bg-[#080b12] text-white">
      <header className="border-b border-white/10 bg-[#080b12]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" className="text-xl font-black italic tracking-tight">
            <span className="text-[#ffd000]">RM</span> FRETES
          </a>
          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#servicos">Serviços</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <button
            type="button"
            onClick={() => setFunnelOpen(true)}
            className="rounded-full border border-[#ffd000]/60 px-4 py-2.5 text-sm font-bold text-[#ffd000] hover:bg-[#ffd000] hover:text-black"
          >
            Pedir frete
          </button>
        </div>
      </header>

      <section id="inicio" className="relative px-5 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(20,92,255,.2),transparent_34%),radial-gradient(circle_at_85%_65%,rgba(255,208,0,.14),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.24em] text-[#ffd000]">
              Curitiba e Região Metropolitana
            </p>
            <h1 className="mt-5 text-5xl font-black italic leading-[.92] tracking-[-.05em] sm:text-7xl">
              Seu frete em movimento. <span className="text-[#ffd000]">Rápido.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Fretes, carretos e pequenas mudanças com cuidado na carga, rota organizada e pagamento
              facilitado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setFunnelOpen(true)}
                className={ctaClass}
                aria-label="Pedir orçamento de frete à RM Fretes"
              >
                Calcular meu frete <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href="#servicos"
                className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 py-3.5 font-bold text-white hover:bg-white/10"
              >
                Ver serviços
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-300">
              <span>
                <ShieldCheck className="mr-2 inline h-4 w-4 text-[#ffd000]" />
                Carga protegida
              </span>
              <span>
                <MapPin className="mr-2 inline h-4 w-4 text-[#ffd000]" />
                Atendimento regional
              </span>
              <span>
                <CreditCard className="mr-2 inline h-4 w-4 text-[#ffd000]" />
                Pagamento facilitado
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#ffd000]/15 blur-3xl" />
            <img
              src="/images/rm-fretes/anuncio-oficial.png"
              alt="Anúncio oficial da RM Fretes com veículo de frete"
              className="relative mx-auto max-h-[640px] rounded-[2rem] border border-[#ffd000]/40 object-contain shadow-2xl"
              loading="eager"
 decoding="async" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section id="servicos" className="bg-[#f4f5f7] px-5 py-20 text-[#10131b]">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[.2em] text-[#1e59d9]">
            O que transportamos
          </p>
          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              O tamanho certo para resolver sem complicação.
            </h2>
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Cada pedido é conferido por rota, volume e condições de acesso.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {services.map(([title, text], index) => (
              <article
                key={title}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-sm font-black text-[#1e59d9]">0{index + 1}</span>
                <h3 className="mt-8 text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <img
            src="/images/rm-fretes/carroceria-carga.png"
            alt="Veículo da RM Fretes transportando carga especial"
            className="w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
            loading="lazy"
 decoding="async" />
          <div>
            <p className="text-sm font-black uppercase tracking-[.2em] text-[#ffd000]">
              Como funciona
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Da primeira mensagem à entrega.
            </h2>
            <div className="mt-8 space-y-6">
              {[
                ["1", "Conte o trajeto", "Informe origem, destino e a data desejada."],
                ["2", "Mostre a carga", "Envie fotos, medidas e detalhes de acesso."],
                ["3", "Confirme o orçamento", "A RM valida rota, disponibilidade e condições."],
                ["4", "Frete em andamento", "A carga segue organizada até o destino combinado."],
              ].map(([n, t, d]) => (
                <div key={n} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ffd000] font-black text-black">
                    {n}
                  </span>
                  <div>
                    <h3 className="font-black">{t}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ffd000] px-5 py-16 text-[#080b12]">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            [Banknote, "Pix ou dinheiro", "Pagamento simples e direto."],
            [CreditCard, "Crédito e débito", "Condições confirmadas no atendimento."],
            [PackageCheck, "Carga conferida", "Detalhes alinhados antes da saída."],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Banknote;
            return (
              <div
                key={String(title)}
                className="rounded-3xl border border-black/15 bg-white/35 p-6"
              >
                <I className="h-7 w-7" />
                <h3 className="mt-8 text-xl font-black">{String(title)}</h3>
                <p className="mt-2 text-sm">{String(text)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="duvidas" className="bg-[#f4f5f7] px-5 py-20 text-[#10131b]">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.2em] text-[#1e59d9]">
            Perguntas frequentes
          </p>
          <h2 className="mt-4 text-4xl font-black">Antes de pedir o frete.</h2>
          <div className="mt-8 space-y-3">
            {faq.map(([q, a], index) => (
              <div key={q} className="rounded-2xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold"
                >
                  {q}
                  <ChevronDown
                    className={`h-5 w-5 transition ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && (
                  <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{a}</p>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFunnelOpen(true)}
            className={`${ctaClass} mt-8 w-full sm:w-auto`}
          >
            Solicitar orçamento agora <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 text-center text-sm text-slate-400">
        <p>
          <strong className="text-white">RM Fretes</strong> · Fretes rápidos em Curitiba e Região
          Metropolitana
        </p>
        <PortfolioHostCredit
          className="mt-3 text-xs text-slate-500"
          linkClassName="font-semibold text-slate-300 underline decoration-slate-600 underline-offset-4 transition hover:text-[#ffd000] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd000]"
        />
      </footer>
      <PortfolioSocialProofPopup
        clientKey="rm-fretes"
        eyebrow="Frete local"
        title="Seu pedido chega organizado para a RM Fretes."
        description="Informe rota, carga e prazo para receber um atendimento mais rápido."
        ctaLabel="Pedir orçamento"
        ctaHref="#inicio"
        delayMs={8000}
      />
      <PortfolioUpsellPopup pageName="portfolio-rm-fretes" />
      <FunnelModalWrapper
        open={funnelOpen}
        onClose={() => setFunnelOpen(false)}
        funnelSlug="funnel-rm-fretes"
        intent={{
          purpose: "proposal",
          source: "portfolio-rm-fretes",
          pagePath: "/portfolio/rm-fretes",
          placement: "hero",
          companySlug: "rm-fretes",
        }}
        prefill={{ service: "Fretes, carretos e pequenas mudanças" }}
        context={{
          service: "fretes, carretos e pequenas mudanças",
          region: "Curitiba e Região Metropolitana",
        }}
      />
    </main>
  );
}
