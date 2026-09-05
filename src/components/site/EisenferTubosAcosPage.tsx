import { MotionReveal, MotionScope } from "@/components/motion";
import { ArrowRight } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Conceito: tabela de estoque siderúrgico. Leitura em linhas técnicas, sem cards.
const linha = [
  { cod: "TB", nome: "Tubos e perfis", spec: "Quadrado · Retangular · Redondo", uso: "Estruturas metálicas" },
  { cod: "CH", nome: "Chapas de aço", spec: "Lisa · Frisada", uso: "Indústria e comércio" },
  { cod: "TP", nome: "Telhas TP40", spec: "Simples · Semi-sanduíche · Sanduíche", uso: "Coberturas" },
  { cod: "PU", nome: "Perfis U", spec: "Simples · Enrijecido", uso: "Obra residencial" },
  { cod: "EN", nome: "Entrega especializada", spec: "SJP e Curitiba", uso: "Atendimento consultivo" },
];

const quiz = { stepTitles: { service: "O que você procura?", experience: "Conte sobre o projeto", period: "Onde será a entrega?", timing: "Quando precisa?", note: "Mais detalhes" }, services: ["Tubos quadrados ou retangulares", "Tubos redondos ou especiais", "Perfis U simples ou enrijecidos", "Chapas lisas ou frisadas", "Telha TP40 simples", "Telha TP40 sanduíche ou semi-sanduíche"], experienceOptions: ["Obra residencial", "Estrutura comercial", "Projeto industrial", "Comunicação visual"], periodOptions: ["São José dos Pinhais", "Curitiba e região", "Vou confirmar o endereço"], timingOptions: ["Preciso de cotação em breve", "Estou planejando", "Quero consultar disponibilidade"] };

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioCTAQuiz
      clientKey="eisenfer-tubos-acos"
      studioName="Eisenfer Tubos e Aços"
      recipientName="Francine"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#f5b51b] bg-[#f5b51b] px-7 py-3.5 text-sm font-black uppercase tracking-[.14em] text-[#07162e] transition hover:bg-transparent hover:text-[#f5b51b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b51b]"
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function EisenferTubosAcosPage() {
  return (
    <MotionScope intensity="BALANCED">
    <div className="min-h-dvh bg-[#07162e] text-[#f7f9ff]">
      <header className="sticky top-0 z-30 border-b-2 border-[#f5b51b] bg-[#07162e] px-5 py-3 lg:px-10">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4">
          <a href="#inicio" className="font-display text-base font-black uppercase tracking-[.18em]">
            Eisenfer<span className="text-[#2d8cff]"> · tubos & aços</span>
          </a>
          <nav className="hidden gap-8 text-[11px] font-bold uppercase tracking-[.18em] text-white/60 md:flex">
            <a href="#tabela">Tabela</a>
            <a href="#aplicacoes">Aplicações</a>
            <a href="#cotacao">Cotação</a>
          </nav>
          <CTA>Cotar</CTA>
        </div>
      </header>

      <main>
        {/* Hero: título técnico + faixa horizontal larga (letterbox), sem coluna de imagem lateral */}
        <section id="inicio" className="border-b border-white/10 px-5 pt-14 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <p className="text-[11px] font-black uppercase tracking-[.32em] text-[#f5b51b]">
              Av. das Américas, 116 · Três Marias · São José dos Pinhais — PR
            </p>
            <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-6 font-display text-[2.6rem] font-black uppercase leading-[.92] tracking-tight sm:text-[4.6rem]">
              Aço cortado na medida
              <br />
              <span className="text-[#2d8cff]">da sua obra.</span>
            </MotionReveal>
            <div className="mt-8 flex flex-col gap-6 border-t border-white/15 pt-6 md:flex-row md:items-end md:justify-between">
              <p className="max-w-lg text-base leading-7 text-white/65">
                Tubos, perfis, chapas e telhas metálicas para obras residenciais, comerciais e industriais — com atendimento
                consultivo do pedido à entrega.
              </p>
              <div className="flex flex-wrap gap-3">
                <CTA>
                  Solicitar cotação <ArrowRight className="h-4 w-4" />
                </CTA>
                <a
                  href="#tabela"
                  className="inline-flex min-h-12 items-center border border-white/25 px-6 py-3.5 text-sm font-bold uppercase tracking-[.14em] text-white/80 hover:border-[#2d8cff] hover:text-white"
                >
                  Ver tabela
                </a>
              </div>
            </div>
            <MotionReveal variant="mask" delay={120}>
            <PortfolioImage
              // capa-card.jpg: recorte aprovado, sem a faixa com telefone/site do material original.
              src="/images/eisenfer-tubos-acos/capa-card.jpg"
              alt="Telhas metálicas Eisenfer Tubos e Aços"
              priority
              width={1024}
              height={640}
              className="mt-10 h-[220px] w-full object-cover object-center grayscale-[.15] sm:h-[300px] lg:h-[360px]"
              managedField="heroImageUrl"
            />
            </MotionReveal>
          </div>
        </section>

        {/* Linha de produtos como tabela técnica: linhas, código e especificação */}
        <section id="tabela" className="bg-[#f2f4f8] px-5 py-16 text-[#0b1d39] lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-[#0b1d39] pb-4">
              <h2 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">Linha disponível</h2>
              <span className="text-[11px] font-bold uppercase tracking-[.2em] text-[#1265bc]">Medidas sob consulta</span>
            </div>
            <ul className="divide-y divide-[#c9d4e2]">
              {linha.map((item, i) => (
                <MotionReveal as="li" variant="left" delay={i * 60} key={item.cod} className="flex flex-col gap-1 py-5 transition-colors duration-200 hover:bg-[#e6ecf5] sm:flex-row sm:items-center sm:gap-6">
                  <span className="w-12 shrink-0 font-mono text-sm font-black text-[#1265bc]">{item.cod}</span>
                  <span className="w-full font-display text-lg font-bold sm:w-64">{item.nome}</span>
                  <span className="flex-1 text-sm text-[#586a7e]">{item.spec}</span>
                  <span className="text-[11px] font-bold uppercase tracking-[.16em] text-[#0b1d39]/70">{item.uso}</span>
                </MotionReveal>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t-2 border-[#0b1d39] pt-6">
              <CTA>
                Consultar disponibilidade <ArrowRight className="h-4 w-4" />
              </CTA>
              <p className="text-sm text-[#586a7e]">Envie medidas e quantidades para receber a cotação.</p>
            </div>
          </div>
        </section>

        {/* Aplicações em faixas horizontais numeradas */}
        <section id="aplicacoes" className="px-5 py-16 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5b51b] sm:text-3xl">
              Onde o aço da Eisenfer trabalha
            </h2>
            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {[
                ["01", "Resistência", "Materiais selecionados para estruturas que precisam durar."],
                ["02", "Agilidade", "Entrega no prazo combinado em São José dos Pinhais e Curitiba."],
                ["03", "Parceria", "Atendimento especializado para encontrar medida e espessura certas."],
              ].map(([n, t, d]) => (
                <MotionReveal key={n} variant="up" className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8">
                  <dt className="font-mono text-3xl font-black text-[#2d8cff] sm:w-24">{n}</dt>
                  <div className="sm:flex-1">
                    <p className="font-display text-xl font-bold">{t}</p>
                    <dd className="mt-1 max-w-2xl text-sm leading-6 text-white/60">{d}</dd>
                  </div>
                </MotionReveal>
              ))}
            </dl>
          </div>
        </section>

        <section id="cotacao" className="border-t-2 border-[#f5b51b] bg-[#0a1f3d] px-5 py-14 lg:px-10">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.28em] text-[#f5b51b]">Cotação sem compromisso</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-black uppercase leading-tight sm:text-4xl">
                Vamos estruturar seu projeto?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                Envie medidas, quantidades ou uma foto e receba um próximo passo claro.
              </p>
            </div>
            <CTA>
              Solicitar orçamento <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#040c1b] px-5 py-8 text-sm text-white/60 lg:px-10">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">
              Eisenfer <span className="text-[#2d8cff]">Tubos e Aços</span>
            </p>
            <p className="mt-1">Av. das Américas, 116 · Três Marias · São José dos Pinhais — PR.</p>
            <a
              href="https://eisenfer.com.br/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[#2d8cff] underline"
            >
              eisenfer.com.br
            </a>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#f5b51b]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="eisenfer-tubos-acos"
        eyebrow="Eisenfer · Tubos e Aços"
        title="Material confiável para cada etapa da sua obra."
        description="Conte o projeto e receba um próximo passo especializado."
        ctaLabel="Ver tabela"
        ctaHref="#tabela"
        delayMs={9000}
        className="border-[#f5b51b]/40 bg-[#07162e]/95 text-white"
        accentClassName="text-[#f5b51b]"
      />
      <PortfolioUpsellPopup pageName="portfolio-eisenfer-tubos-acos" />
    </div>
    </MotionScope>
  );
}
