import { MotionReveal, MotionScope } from "@/components/motion";
import { ArrowRight, Home, Lightbulb, Settings, Zap } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Conceito: quadro de disjuntores. Serviços como circuitos ligados, fundo claro técnico.
const circuitos = [
  { id: "C1", nome: "Instalações elétricas", texto: "Execução segura para casas, empresas, condomínios e indústrias.", Icon: Zap },
  { id: "C2", nome: "Iluminação e padrão", texto: "Projetos de iluminação e instalações padrão com acabamento organizado.", Icon: Lightbulb },
  { id: "C3", nome: "Manutenção elétrica", texto: "Diagnóstico rápido, correções e prevenção de falhas.", Icon: Settings },
  { id: "C4", nome: "Automação inteligente", texto: "Soluções residenciais, prediais e industriais para mais conforto e economia.", Icon: Home },
];

const quiz = { stepTitles: { service: "Qual solução você precisa?", experience: "Conte sobre o projeto", period: "Onde será o atendimento?", timing: "Quando deseja realizar?", note: "Mais detalhes" }, services: ["Instalação elétrica", "Instalação de iluminação", "Instalação padrão", "Manutenção elétrica", "Automação predial ou residencial", "Automação industrial", "Consultoria e projetos"], experienceOptions: ["Residência", "Comércio ou condomínio", "Empresa ou indústria", "Quero modernizar meu espaço"], periodOptions: ["Pinhais", "Curitiba e região", "Vou confirmar o endereço"], timingOptions: ["Preciso de suporte em breve", "Estou planejando", "Quero uma visita técnica"] };

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioCTAQuiz
      clientKey="eletro-solucoes-eficazes"
      studioName="Eletro Soluções Eficazes"
      recipientName="Eletro Soluções"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#08283e] px-6 py-3.5 text-sm font-bold text-[#ffd447] shadow-[4px_4px_0_0_#ffd447] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#ffd447] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08283e]"
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function EletroSolucoesEficazesPage() {
  return (
    <MotionScope intensity="BALANCED">
    <div className="min-h-dvh bg-[#eef2f5] text-[#08283e]">
      <header className="sticky top-0 z-30 bg-[#ffd447] px-5 py-3 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href="#inicio" className="flex items-center gap-2 font-display text-base font-black uppercase">
            <Zap className="h-5 w-5" aria-hidden />
            Eletro Soluções Eficazes
          </a>
          <nav className="hidden gap-6 text-xs font-bold uppercase tracking-wide md:flex">
            <a href="#quadro">Quadro</a>
            <a href="#etapas">Etapas</a>
            <a href="#contato">Contato</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero claro, texto centrado e imagem contida em moldura fina — sem split escuro */}
        <section id="inicio" className="px-5 pt-14 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-block rounded-full bg-[#08283e] px-4 py-1 text-[11px] font-bold uppercase tracking-[.22em] text-[#ffd447]">
              Pinhais · Curitiba e região
            </p>
            <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-6 font-display text-4xl font-black leading-tight sm:text-6xl">
              Energia para viver melhor.
              <br />
              <span className="text-[#1276a8]">Tecnologia para evoluir.</span>
            </MotionReveal>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#4a6070]">
              Soluções elétricas completas para trazer mais segurança, conforto e economia ao seu dia a dia, empresa ou
              condomínio.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <CTA>
                Falar com especialista <ArrowRight className="h-4 w-4" />
              </CTA>
              <a
                href="#quadro"
                className="inline-flex min-h-12 items-center rounded-md border-2 border-[#08283e] px-6 py-3.5 text-sm font-bold hover:bg-[#08283e] hover:text-white"
              >
                Ver o quadro de serviços
              </a>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-5xl border-8 border-[#08283e] bg-white p-2">
            <PortfolioImage
              src="/images/eletro-solucoes-eficazes/servicos.webp"
              alt="Serviços elétricos da Eletro Soluções Eficazes"
              priority
              width={1080}
              height={1080}
              className="h-[240px] w-full object-cover sm:h-[340px]"
              managedField="heroImageUrl"
            />
          </div>
        </section>

        {/* Quadro de disjuntores: linhas com trilho, sem grid de cards */}
        <section id="quadro" className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-3xl font-black">Do reparo essencial à automação completa.</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[.2em] text-[#1276a8]">Circuitos atendidos</p>
            <div className="mt-8 border-y-4 border-[#08283e] bg-white">
              {circuitos.map(({ id, nome, texto, Icon }, i) => (
                <MotionReveal
                  variant="left"
                  delay={i * 70}
                  key={id}
                  className="flex items-start gap-4 border-b border-dashed border-[#cfd9e0] px-4 py-6 transition-colors duration-200 last:border-b-0 hover:bg-[#f4f8fb] sm:px-8"
                >
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#ffd447] font-mono text-xs font-black">
                    {id}
                  </span>
                  <div className="flex-1">
                    <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                      <Icon className="h-5 w-5 text-[#1276a8]" aria-hidden />
                      {nome}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[#4a6070]">{texto}</p>
                  </div>
                  <span className="hidden self-center text-[10px] font-bold uppercase tracking-[.2em] text-[#1276a8] sm:block">
                    Ligado
                  </span>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Etapas em faixa horizontal contínua */}
        <section id="etapas" className="bg-[#08283e] px-5 py-14 text-white lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl font-black sm:text-3xl">Mais segurança, conforto e economia.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
              Projetos e serviços realizados com responsabilidade, clareza e foco no resultado que sua rotina precisa.
            </p>
            <ol className="mt-8 flex flex-col gap-0 sm:flex-row">
              {[
                ["Diagnóstico", "Entendemos sua necessidade."],
                ["Projeto", "Indicamos a solução ideal."],
                ["Execução", "Entrega segura e organizada."],
              ].map(([t, d], i) => (
                <MotionReveal
                  as="li"
                  variant="up"
                  delay={i * 120}
                  key={t}
                  className="flex-1 border-l-4 border-[#ffd447] px-5 py-4 sm:border-l-0 sm:border-t-4"
                >
                  <span className="font-mono text-xs text-[#ffd447]">Etapa {i + 1}</span>
                  <p className="mt-2 font-display text-lg font-bold">{t}</p>
                  <p className="mt-1 text-sm text-white/60">{d}</p>
                </MotionReveal>
              ))}
            </ol>
            <div className="mt-8">
              <CTA>
                Descrever meu projeto <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </section>

        <section id="contato" className="px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-md border-2 border-[#08283e] bg-[#ffd447] p-8">
            <p className="text-[11px] font-black uppercase tracking-[.24em]">Atendimento em Pinhais</p>
            <h2 className="mt-3 font-display text-3xl font-black">Precisa de suporte profissional?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#08283e]/80">
              Conte o que deseja instalar, corrigir ou automatizar.
            </p>
            <div className="mt-6">
              <CTA>
                Solicitar orçamento <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#061d2d] px-5 py-8 text-sm text-white/60 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">
              Eletro <span className="text-[#5dc0ee]">Soluções Eficazes</span>
            </p>
            <p className="mt-1">Serviços elétricos residenciais, comerciais, prediais e industriais.</p>
            <a
              href="https://www.instagram.com/eletrosolucoeseficazes"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[#5dc0ee] underline"
            >
              Instagram · @eletrosolucoeseficazes
            </a>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#ffd447]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="eletro-solucoes-eficazes"
        eyebrow="Eletro Soluções · Pinhais"
        title="Energia, segurança e tecnologia para sua rotina."
        description="Conte o desafio e receba um próximo passo profissional."
        ctaLabel="Conhecer soluções"
        ctaHref="#quadro"
        delayMs={9000}
        className="border-[#08283e]/30 bg-white/95 text-[#08283e]"
        accentClassName="text-[#1276a8]"
      />
      <PortfolioUpsellPopup pageName="portfolio-eletro-solucoes-eficazes" />
    </div>
    </MotionScope>
  );
}
