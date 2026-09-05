import { ManagedText } from "@/components/portfolio/ManagedText";
import { motion } from "motion/react";
import { ArrowRight, CircuitBoard, Network, ShieldCheck, Zap } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

const quiz = { services: ["Elétrica geral", "Infraestrutura para redes", "Cabeamento estruturado UTP", "Sistema CFTV", "Implantação de redes", "Montagem e organização de rack"], experienceOptions: ["Residencial", "Comercial", "Predial / condomínio", "Industrial"], periodOptions: ["Curitiba", "Região Metropolitana", "Vou confirmar o endereço"], timingOptions: ["Preciso avaliar com urgência", "Nos próximos dias", "Estou planejando"], proposalKind: "service" as const, stepTitles: { service: "Qual solução você precisa?", experience: "Em qual tipo de ambiente?", period: "Onde será o serviço?", timing: "Quando você precisa?", note: "Conte detalhes do projeto" }, notePlaceholder: "Ex.: quantidade de pontos, tamanho do rack, câmeras ou tipo de instalação." };

function CTA({ children }: { children: React.ReactNode }) {
  return <PortfolioCTAQuiz clientKey="ag-electrical-services" studioName="A&G Electrical Services" recipientName="A&G Electrical Services" theme="navy" mode="proposal" quizConfig={quiz} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-none border-b-2 border-[#f47b20] bg-[#f47b20] px-7 py-3.5 font-bold uppercase tracking-[.08em] text-[#061d38] transition hover:bg-[#ffa25c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{children}</PortfolioCTAQuiz>;
}

/** Circuito de disciplinas: cada bloco é um "ponto" do barramento horizontal. */
const circuit = [
  { code: "L1", title: "Elétrica geral", text: "Instalações residenciais, prediais e comerciais com planejamento de carga e segurança." },
  { code: "L2", title: "Infraestrutura e redes", text: "Eletrocalhas, canaletas e cabeamento estruturado para dados e voz." },
  { code: "L3", title: "CFTV", text: "Dimensionamento, instalação e organização de sistemas de monitoramento." },
  { code: "L4", title: "Racks e implantação", text: "Montagem, identificação e fechamento organizado para facilitar a operação." },
];

const gallery: Array<[string, string]> = [
  ["laserway-1.webp", "Distribuição e identificação"],
  ["laserway-2.webp", "Infraestrutura organizada"],
  ["rack-1.webp", "Fechamento de rack"],
];

export function AgElectricalServicesPage() {
  return (
    <div className="min-h-dvh bg-[#061d38] font-sans text-[#e6eef7]">
      {/* Barra técnica: sem logotipo-cartão, apenas marcação de painel */}
      <header className="border-b border-[#f47b20]/40 bg-[#061d38] px-5 py-3 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <a href="#inicio" className="flex items-baseline gap-2 font-display text-base font-bold uppercase tracking-[.22em]">
            <Zap className="h-4 w-4 text-[#f47b20]" aria-hidden />A&amp;G <span className="text-[#f47b20]">Electrical Services</span>
          </a>
          <nav className="flex gap-5 text-[11px] font-bold uppercase tracking-[.18em] text-[#9db6cf]">
            <a href="#circuito" className="hover:text-white">Circuito</a>
            <a href="#execucao" className="hover:text-white">Execução</a>
            <a href="#painel" className="hover:text-white">Painel</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO: bloco tipográfico cheio + faixa de imagem panorâmica sob a manchete */}
        <section id="inicio" className="px-5 pt-14 lg:px-10 lg:pt-20">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-[11px] uppercase tracking-[.3em] text-[#f47b20]">Elétrica / infraestrutura / redes / CFTV — Curitiba e RMC</p>
            <h1 className="mt-6 max-w-5xl font-display text-[2.65rem] font-bold uppercase leading-[.95] tracking-[-.02em] sm:text-6xl lg:text-[5.5rem]">
              <ManagedText field="heroHeadline" fallback={"Energia e conectividade para sua opera\u00e7\u00e3o."} />
            </h1>
            <div className="mt-8 grid gap-6 border-t border-[#1c3f66] pt-6 md:grid-cols-[1.2fr_.8fr] md:items-end">
              <p className="max-w-2xl text-base leading-8 text-[#a9c2da]">
                <ManagedText field="heroSubheadline" fallback={"A&G Electrical Services entrega solu\u00e7\u00f5es integradas em el\u00e9trica e infraestrutura para resid\u00eancias, com\u00e9rcios, condom\u00ednios e empresas em Curitiba e Regi\u00e3o Metropolitana."} />
              </p>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <CTA>Solicitar avaliação <ArrowRight className="h-4 w-4" /></CTA>
                <a href="#circuito" className="inline-flex min-h-12 items-center border border-[#33587f] px-6 py-3.5 text-sm font-bold uppercase tracking-[.08em] text-[#cfe0f0] hover:border-[#f47b20]">Ver circuito</a>
              </div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6 }} className="mx-auto mt-10 max-w-7xl">
            <PortfolioImage src="/images/ag-electrical-services/rack-2.webp" alt="A&G Electrical Services: soluções integradas em elétrica e infraestrutura" priority width={720} height={960} className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[420px]" managedField="heroImageUrl" />
            <dl className="grid grid-cols-2 divide-[#1c3f66] border-b border-[#1c3f66] text-xs sm:grid-cols-4 sm:divide-x">
              {[["Ambientes", "Residencial a industrial"], ["Escopo", "Projeto e execução"], ["Padrão", "Conformidade técnica"], ["Entrega", "Rack identificado"]].map(([k, v]) => (
                <div key={k} className="px-4 py-4">
                  <dt className="font-mono uppercase tracking-[.2em] text-[#f47b20]">{k}</dt>
                  <dd className="mt-1 font-semibold text-[#dbe8f5]">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </section>

        {/* CIRCUITO: barramento horizontal com pontos numerados L1..L4 (sem cards flutuantes) */}
        <section id="circuito" className="px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="max-w-3xl font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">Infraestrutura pronta para funcionar — e continuar funcionando.</h2>
            <div className="relative mt-12">
              <span aria-hidden className="absolute left-0 right-0 top-3 hidden h-px bg-[#1c3f66] lg:block" />
              <div className="grid gap-10 lg:grid-cols-4 lg:gap-6">
                {circuit.map((item) => (
                  <div key={item.code} className="relative pl-6 lg:pl-0 lg:pt-10">
                    <span aria-hidden className="absolute left-0 top-1 h-full w-px bg-[#1c3f66] lg:left-0 lg:top-3 lg:h-3 lg:w-px" />
                    <span aria-hidden className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[#f47b20] lg:left-0 lg:top-2" />
                    <p className="font-mono text-xs uppercase tracking-[.25em] text-[#f47b20]">{item.code}</p>
                    <h3 className="mt-3 font-display text-xl font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#9db6cf]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXECUÇÃO: tira horizontal de registros (scroll-snap), não grid de cards */}
        <section id="execucao" className="border-y border-[#1c3f66] bg-[#08243f] py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-3xl font-bold uppercase">Organização que você consegue enxergar</h2>
              <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#f47b20]">Registros de campo · mão de obra Laserway</p>
            </div>
          </div>
          <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:px-10">
            {gallery.map(([src, alt]) => (
              <li key={src} className="w-[76vw] shrink-0 snap-start sm:w-[46vw] lg:w-[24vw]">
                <PortfolioImage src={`/images/ag-electrical-services/${src}`} alt={alt} width={720} height={960} className="h-64 w-full object-cover lg:h-80" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[.18em] text-[#9db6cf]">{alt}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* PAINEL: fechamento em duas colunas de texto técnico + chamada */}
        <section id="painel" className="px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <h2 className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">Clareza no orçamento.<br />Rigor na execução.</h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="border-l-2 border-[#f47b20] pl-4">
                    <CircuitBoard className="h-6 w-6 text-[#f47b20]" aria-hidden />
                    <h3 className="mt-4 font-display text-lg font-bold uppercase">Conformidade técnica</h3>
                    <p className="mt-2 text-sm leading-7 text-[#9db6cf]">Planejamento e execução alinhados às normas e padrões de segurança.</p>
                  </div>
                  <div className="border-l-2 border-[#f47b20] pl-4">
                    <ShieldCheck className="h-6 w-6 text-[#f47b20]" aria-hidden />
                    <h3 className="mt-4 font-display text-lg font-bold uppercase">Eficiência em campo</h3>
                    <p className="mt-2 text-sm leading-7 text-[#9db6cf]">Equipe preparada, organizada e comprometida com prazos.</p>
                  </div>
                </div>
              </div>
              <div className="border border-[#f47b20] p-7">
                <Network className="h-8 w-8 text-[#f47b20]" aria-hidden />
                <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-tight">Vamos avaliar seu projeto?</h3>
                <p className="mt-3 text-sm leading-7 text-[#a9c2da]">Descreva a instalação, rede ou sistema de câmeras. A A&amp;G organiza a melhor abordagem para o seu cenário.</p>
                <div className="mt-6"><CTA>Iniciar avaliação <ArrowRight className="h-4 w-4" /></CTA></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1c3f66] px-5 py-8 text-sm text-[#8aa5c0] lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-bold uppercase tracking-[.2em] text-white">A&amp;G <span className="text-[#f47b20]">Electrical Services</span></p>
            <p className="mt-1">Elétrica, infraestrutura e redes em Curitiba e região.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#f47b20]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup clientKey="ag-electrical-services" eyebrow="A&G Electrical Services" title="Sua infraestrutura merece organização e segurança." description="Conte o que precisa instalar, modernizar ou organizar e receba um próximo passo claro." ctaLabel="Ver circuito" ctaHref="#circuito" delayMs={9000} className="border-[#f47b20]/35 bg-[#092c52]/95 text-white" accentClassName="text-[#f47b20]" />
      <PortfolioUpsellPopup pageName="portfolio-ag-electrical-services" />
    </div>
  );
}
