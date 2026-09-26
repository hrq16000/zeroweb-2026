import {
  ArrowRight,
  Car,
  Check,
  Droplets,
  Home,
  ShieldCheck,
  Sofa,
  Wind,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Sofá ou estofado",
    "Colchão",
    "Poltrona, cadeira ou puff",
    "Banco ou teto de carro",
    "Impermeabilização",
  ],
  experienceOptions: ["Minha casa", "Empresa ou escritório", "Veículo", "Condomínio"],
  periodOptions: ["Curitiba", "Região Metropolitana", "Vou confirmar o endereço"],
  timingOptions: ["Preciso agendar em breve", "Nos próximos dias", "Ainda estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que precisa higienizar?",
    experience: "Onde será o atendimento?",
    period: "Qual região?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte a quantidade de peças, tecido e se deseja impermeabilização.",
};

const surfaces = [
  ["S01", "Sofás e estofados", "Uso diário, contato frequente e acúmulo de sujeira exigem leitura cuidadosa da peça.", Sofa],
  ["S02", "Colchões", "Higienização voltada ao uso contínuo e ao conforto no ambiente de descanso.", Wind],
  ["S03", "Poltronas e cadeiras", "Peças menores entram no mesmo diagnóstico, considerando tecido e quantidade.", Home],
  ["S04", "Interior automotivo", "Bancos e teto de carro podem ser avaliados dentro do atendimento móvel.", Car],
] as const;

const protocol = [
  ["01", "Identificar a peça", "Tipo de estofado, quantidade e contexto de uso."],
  ["02", "Avaliar o cuidado", "Higienização e, quando fizer sentido, impermeabilização."],
  ["03", "Definir o local", "Casa, empresa, condomínio ou veículo em Curitiba e região."],
  ["04", "Agendar", "Organizar o atendimento conforme disponibilidade."],
] as const;

function CTA({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="easy-clean"
      studioName="Easy Clean Higienização a Seco"
      recipientName="a equipe Easy Clean"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function EasyCleanPage() {
  return (
    <div className="min-h-dvh overflow-hidden bg-[#eef8f3] text-[#0f2d36]">
      <header className="border-b-2 border-[#0f2d36] bg-[#eef8f3] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#diagnostico" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#69c942] font-black text-white shadow-[0_4px_0_#117a70]">
              EC
            </span>
            <div>
              <p className="font-display text-lg font-black">Easy Clean</p>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#117a70]">
                higienização a seco
              </p>
            </div>
          </a>

          <CTA className="inline-flex min-h-10 items-center gap-2 bg-[#0f2d36] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#174454]">
            Diagnosticar peça
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="diagnostico" className="px-5 py-8 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-[.38fr_.62fr]">
              <aside className="flex flex-col justify-between border-2 border-[#0f2d36] bg-[#dff6e8] p-7 sm:p-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#117a70]">
                    ficha de higienização
                  </p>
                  <h1 className="mt-5 font-display text-5xl font-black leading-[.88] tracking-[-.045em] sm:text-6xl">
                    Primeiro a peça. Depois o protocolo.
                  </h1>
                  <p className="mt-6 leading-8 text-[#49646d]">
                    Sofás, colchões, poltronas, cadeiras e interiores de carro pedem cuidados
                    diferentes. A Easy Clean organiza o atendimento a partir da peça real.
                  </p>
                </div>

                <dl className="mt-10 border-y border-[#0f2d36]/20">
                  {[
                    ["Peça", "o que será higienizado"],
                    ["Tecido", "informação útil para avaliação"],
                    ["Local", "casa, empresa ou veículo"],
                    ["Proteção", "impermeabilização quando desejada"],
                  ].map(([term, value]) => (
                    <div key={term} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-[#0f2d36]/15 py-4 last:border-b-0">
                      <dt className="text-[10px] font-black uppercase tracking-[.12em] text-[#117a70]">
                        {term}
                      </dt>
                      <dd className="text-sm font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>

                <CTA className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-[#69c942] px-6 py-3.5 text-sm font-black text-[#0f2d36] transition hover:-translate-y-0.5 hover:bg-[#8de366]">
                  Informar minha peça
                  <ArrowRight className="h-4 w-4" />
                </CTA>
              </aside>

              <figure className="relative m-0 min-h-[620px] overflow-hidden border-2 border-[#0f2d36] bg-[#0f2d36]">
                <PortfolioImage
                  managedField="heroImageUrl"
                  src="/images/easy-clean/hero.png"
                  alt="Sofá claro higienizado em ambiente residencial confortável"
                  priority
                  width={1536}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2d36]/88 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-10">
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#8de366]">
                    Curitiba e Região Metropolitana
                  </p>
                  <p className="mt-3 max-w-xl text-lg leading-8 text-white/75">
                    Atendimento em domicílio para peças estofadas e interior automotivo.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="superficies" className="bg-[#0f2d36] px-5 py-20 text-white lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.3fr_.7fr]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#8de366]">
                  matriz de superfícies
                </p>
                <h2 className="mt-4 max-w-[9ch] font-display text-4xl font-black leading-[.92] sm:text-5xl">
                  O mesmo produto não serve para toda peça.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                  O escopo começa pela peça e pelo contexto de uso, evitando um orçamento genérico.
                </p>
              </div>

              <div className="border-t border-white/20">
                {surfaces.map(([code, title, text, Icon]) => (
                  <article
                    key={code}
                    className="grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[4rem_3rem_1fr_auto] sm:items-start"
                  >
                    <span className="font-mono text-xs font-black text-[#8de366]">{code}</span>
                    <Icon className="h-5 w-5 text-[#8de366]" />
                    <div>
                      <h3 className="font-display text-2xl font-black">{title}</h3>
                      <p className="mt-3 max-w-2xl leading-7 text-white/60">{text}</p>
                    </div>
                    <a href="#protocolo" className="text-sm font-black text-[#8de366] underline underline-offset-4">
                      avaliar
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="protocolo" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 border-b-2 border-[#0f2d36] pb-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#117a70]">
                  protocolo do atendimento
                </p>
                <h2 className="mt-4 max-w-[12ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                  Da identificação ao agendamento.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#49646d]">
                A página não promete um tratamento universal. O atendimento parte das informações
                da peça e do local.
              </p>
            </div>

            <ol className="mt-8">
              {protocol.map(([n, title, text]) => (
                <li
                  key={n}
                  className="grid gap-4 border-b border-[#0f2d36]/15 py-6 sm:grid-cols-[4rem_12rem_1fr]"
                >
                  <span className="font-mono text-xs font-black text-[#117a70]">{n}</span>
                  <h3 className="font-display text-xl font-black">{title}</h3>
                  <p className="leading-7 text-[#49646d]">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="protecao" className="bg-[#cbeed9] px-5 py-18 lg:px-8 lg:py-22">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[.58fr_.42fr]">
            <div className="border-2 border-[#0f2d36] bg-[#eef8f3] p-7 sm:p-10">
              <Droplets className="h-7 w-7 text-[#117a70]" />
              <p className="mt-8 text-[10px] font-black uppercase tracking-[.18em] text-[#117a70]">
                proteção opcional
              </p>
              <h2 className="mt-4 max-w-[12ch] font-display text-4xl font-black leading-[.94]">
                Higienização e impermeabilização não são a mesma etapa.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-[#49646d]">
                Se você deseja proteção adicional para o tecido, informe isso no pedido para a
                equipe considerar a impermeabilização no atendimento.
              </p>
            </div>

            <aside className="flex flex-col justify-between bg-[#69c942] p-7 text-[#0f2d36] sm:p-9">
              <div>
                <ShieldCheck className="h-7 w-7" />
                <h3 className="mt-6 font-display text-3xl font-black">
                  Casa, empresa, condomínio ou veículo.
                </h3>
                <p className="mt-4 leading-7 text-[#355046]">
                  O local de atendimento entra no diagnóstico junto com peça, quantidade e prazo.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
                <span><Check className="mr-1 inline h-4 w-4" />Curitiba</span>
                <span><Check className="mr-1 inline h-4 w-4" />RMC</span>
              </div>
            </aside>
          </div>
        </section>

        <section id="pedido" className="bg-[#0f2d36] px-5 py-14 text-white lg:px-8 lg:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#8de366]">
                próximo passo
              </p>
              <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                Diga qual é a peça, onde ela está e quando quer cuidar dela.
              </h2>
            </div>

            <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#69c942] px-6 py-3.5 text-sm font-black text-[#0f2d36] transition hover:-translate-y-0.5 hover:bg-[#8de366]">
              Solicitar avaliação
              <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#091d24] px-5 py-8 text-sm text-white/60 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-black text-white">
              Easy <span className="text-[#8de366]">Clean</span>
            </p>
            <p className="mt-1">Higienização a seco em Curitiba e região.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#8de366]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="easy-clean"
        eyebrow="Easy Clean"
        title="Conforto limpo começa com uma boa higienização."
        description="Conte qual peça precisa de cuidado e organize seu orçamento."
        ctaLabel="Diagnosticar peça"
        ctaHref="#diagnostico"
        delayMs={10000}
        className="border-[#69c942]/40 bg-[#0f2d36]/95 text-white"
        accentClassName="text-[#8de366]"
      />
      <PortfolioUpsellPopup pageName="portfolio-easy-clean" />
    </div>
  );
}
