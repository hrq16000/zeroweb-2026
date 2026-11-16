import {
  ArrowRight,
  Check,
  Hammer,
  Home,
  MapPin,
  Ruler,
  Tv,
  Wrench,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  stepTitles: {
    service: "Qual serviço você precisa?",
    experience: "Conte um pouco do projeto",
    period: "Onde será o atendimento?",
    timing: "Quando deseja realizar?",
    note: "Mais detalhes",
  },
  services: [
    "Montagem de móveis",
    "Desmontagem e montagem",
    "Conserto ou adaptação",
    "Troca de corrediças e regulagem",
    "Instalação de TV, persianas ou varões",
    "Tomadas, chuveiro ou torneira",
  ],
  experienceOptions: [
    "Guarda-roupa, cama ou mesa",
    "Cozinha ou escritório",
    "Móvel novo ou seminovo",
    "Pequenos reparos",
  ],
  periodOptions: ["Sítio Cercado", "Curitiba e região", "Vou confirmar o endereço"],
  timingOptions: [
    "Preciso de atendimento em breve",
    "Estou planejando",
    "Quero uma avaliação primeiro",
  ],
};

const serviceRows = [
  ["01", "Montagem e desmontagem", "Guarda-roupas, cozinhas, camas, mesas e móveis de escritório, novos ou seminovos.", Hammer],
  ["02", "Consertos e adaptações", "Troca de corrediças, regulagem de portas, ajustes e recuperação de móveis.", Wrench],
  ["03", "Instalações residenciais", "TV na parede, persianas, varões, tomadas, chuveiros e torneiras.", Tv],
  ["04", "Marido de aluguel", "Pequenos reparos com organização, acabamento cuidadoso e preço justo.", Home],
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
      clientKey="diego-montador-moveis"
      studioName="Diego Montador de Móveis"
      recipientName="Diego"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function DiegoMontadorMoveisPage() {
  return (
    <div className="min-h-dvh bg-[#f0eee7] text-[#101a2f]">
      <header className="border-b-2 border-[#101a2f] bg-[#f0eee7] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#ordem" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center bg-[#101a2f] text-[#f5b51b]">
              <Hammer className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-black uppercase tracking-[.04em]">
                Diego Montador
              </p>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#946b00]">
                Sítio Cercado · Curitiba
              </p>
            </div>
          </a>

          <CTA className="inline-flex min-h-10 items-center gap-2 bg-[#101a2f] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#283959]">
            Abrir ordem
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="ordem" className="px-5 py-8 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid overflow-hidden border-2 border-[#101a2f] bg-white lg:grid-cols-[.58fr_.42fr]">
              <figure className="relative m-0 min-h-[560px] border-b-2 border-[#101a2f] bg-[#182744] lg:min-h-[720px] lg:border-b-0 lg:border-r-2">
                <PortfolioImage
                  src="/images/diego-montador-moveis/capa.webp"
                  alt="Profissional montando guarda-roupa em apartamento"
                  priority
                  width={1200}
                  height={960}
                  managedField="heroImageUrl"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101a2f]/90 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-10">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#f5b51b]">
                    montagem · reparos · instalações
                  </p>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">
                    Atendimento sob agendamento em Curitiba e região.
                  </p>
                </figcaption>
              </figure>

              <aside className="flex flex-col justify-between bg-[#f5b51b] p-7 sm:p-10 lg:p-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#5c4610]">
                    ordem de serviço
                  </p>
                  <h1 className="mt-5 font-display text-5xl font-black leading-[.88] tracking-[-.045em] sm:text-6xl">
                    O móvel entra na lista. A execução sai organizada.
                  </h1>
                  <p className="mt-6 leading-8 text-[#4a3b15]">
                    Montagem, desmontagem, consertos e pequenas instalações residenciais com escopo
                    claro antes do agendamento.
                  </p>
                </div>

                <div className="mt-10 border-y border-[#101a2f]/25">
                  {[
                    ["A", "O que é", "móvel, reparo ou instalação"],
                    ["B", "Onde é", "Sítio Cercado, Curitiba ou região"],
                    ["C", "Quando", "em breve, planejado ou avaliação"],
                  ].map(([code, label, value]) => (
                    <div key={code} className="grid grid-cols-[2.5rem_5rem_1fr] gap-3 border-b border-[#101a2f]/20 py-4 text-sm last:border-b-0">
                      <span className="font-mono text-xs font-black">{code}</span>
                      <span className="font-black">{label}</span>
                      <span className="text-[#5c4610]">{value}</span>
                    </div>
                  ))}
                </div>

                <CTA className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-[#101a2f] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#283959]">
                  Descrever serviço
                  <ArrowRight className="h-4 w-4" />
                </CTA>
              </aside>
            </div>
          </div>
        </section>

        <section id="escopo" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.3fr_.7fr]">
              <aside>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#946b00]">
                  escopo de atendimento
                </p>
                <h2 className="mt-4 max-w-[8ch] font-display text-4xl font-black leading-[.92] sm:text-5xl">
                  Quatro frentes, uma ordem por vez.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-[#5c6575]">
                  O objetivo é identificar o serviço antes do deslocamento e evitar orçamento
                  genérico.
                </p>
              </aside>

              <div className="border-t-2 border-[#101a2f]">
                {serviceRows.map(([code, title, text, Icon]) => (
                  <article
                    key={code}
                    className="grid gap-4 border-b border-[#101a2f]/15 py-7 sm:grid-cols-[4rem_3rem_1fr_auto] sm:items-start"
                  >
                    <span className="font-mono text-xs font-black text-[#946b00]">{code}</span>
                    <Icon className="h-5 w-5 text-[#946b00]" />
                    <div>
                      <h3 className="font-display text-2xl font-black">{title}</h3>
                      <p className="mt-3 max-w-2xl leading-7 text-[#5c6575]">{text}</p>
                    </div>
                    <a href="#agendamento" className="text-sm font-black underline underline-offset-4">
                      incluir
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="preparo" className="bg-[#101a2f] px-5 py-18 text-white lg:px-8 lg:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[.44fr_.56fr]">
              <div>
                <Ruler className="h-7 w-7 text-[#f5b51b]" />
                <p className="mt-8 text-[10px] font-black uppercase tracking-[.18em] text-[#f5b51b]">
                  antes do agendamento
                </p>
                <h2 className="mt-4 max-w-[10ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                  Traga informação suficiente para dimensionar o serviço.
                </h2>
              </div>

              <ol className="border-y border-white/20">
                {[
                  ["01", "Identifique a peça", "Guarda-roupa, cama, cozinha, mesa, TV, persiana ou outro item."],
                  ["02", "Explique a condição", "Novo, seminovo, desmontado, com defeito ou precisando de adaptação."],
                  ["03", "Informe o local", "Endereço e contexto de acesso para organizar o atendimento."],
                ].map(([n, title, text]) => (
                  <li key={n} className="grid gap-3 border-b border-white/15 py-5 last:border-b-0 sm:grid-cols-[3rem_11rem_1fr]">
                    <span className="font-mono text-xs font-black text-[#f5b51b]">{n}</span>
                    <h3 className="font-black">{title}</h3>
                    <p className="text-sm leading-6 text-white/65">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="base" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[.62fr_.38fr]">
            <div className="border-2 border-[#101a2f] bg-white p-7 sm:p-10">
              <MapPin className="h-7 w-7 text-[#946b00]" />
              <p className="mt-8 text-[10px] font-black uppercase tracking-[.18em] text-[#946b00]">
                base local
              </p>
              <h2 className="mt-4 max-w-[12ch] font-display text-4xl font-black leading-[.94]">
                Sítio Cercado, com atendimento em Curitiba e região.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-[#5c6575]">
                Rua Baitaca, 16 · Sítio Cercado · Curitiba — PR · 81935-294. Atendimento sob
                agendamento.
              </p>
            </div>

            <aside className="flex flex-col justify-between bg-[#f5b51b] p-7 sm:p-9">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#5c4610]">
                  referência visual
                </p>
                <h3 className="mt-4 font-display text-3xl font-black">
                  Veja trabalhos publicados pelo próprio profissional.
                </h3>
                <p className="mt-4 leading-7 text-[#5c4610]">
                  A rede social é usada como referência de trabalhos, não como substituta do funil.
                </p>
              </div>
              <a
                href="https://www.instagram.com/diegobuenomontadordemoveis"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-black underline underline-offset-4"
              >
                Abrir Instagram
                <ArrowRight className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </section>

        <section id="agendamento" className="bg-[#f5b51b] px-5 py-14 lg:px-8 lg:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#5c4610]">
                fechar a ordem
              </p>
              <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                Diga o que precisa, onde e quando.
              </h2>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-[#5c4610]">
                <span><Check className="mr-1 inline h-4 w-4" />Serviço</span>
                <span><Check className="mr-1 inline h-4 w-4" />Local</span>
                <span><Check className="mr-1 inline h-4 w-4" />Prazo</span>
              </div>
            </div>

            <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#101a2f] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#283959]">
              Solicitar orçamento
              <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a1222] px-5 py-8 text-sm text-white/60 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-white">
              Diego <span className="text-[#f5b51b]">Montador de Móveis</span>
            </p>
            <p className="mt-1">Montagem, reparos e instalações em Curitiba.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#f5b51b]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="diego-montador-moveis"
        eyebrow="Diego · Sítio Cercado"
        title="Móveis bem montados e pequenos reparos com capricho."
        description="Conte o que precisa e receba um próximo passo organizado."
        ctaLabel="Abrir ordem"
        ctaHref="#agendamento"
        delayMs={9000}
        className="border-[#f5b51b]/40 bg-[#101a2f]/95 text-white"
        accentClassName="text-[#f5b51b]"
      />
      <PortfolioUpsellPopup pageName="portfolio-diego-montador-moveis" />
    </div>
  );
}
