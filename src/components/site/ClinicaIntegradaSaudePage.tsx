import { Activity, CalendarCheck, HeartPulse, Microscope, Smile, Stethoscope } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const ESPECIALIDADES = [
  [Smile, "Odontologia", "Clínica geral, prevenção e reabilitação oral."],
  [Stethoscope, "Clínica médica", "Avaliação geral, acompanhamento e encaminhamentos."],
  [HeartPulse, "Cardiologia", "Consulta, eletrocardiograma e acompanhamento de risco."],
  [Activity, "Fisioterapia", "Reabilitação motora, pós-cirúrgico e dor crônica."],
  [Microscope, "Exames de rotina", "Coleta e laudos com retorno agendado."],
  [CalendarCheck, "Check-up integrado", "Roteiro combinado entre as especialidades da casa."],
] as const;

const JORNADA = [
  ["Triagem", "Você descreve o motivo do contato e a recepção indica a especialidade adequada."],
  ["Agendamento", "Data confirmada com orientação sobre jejum, documentos e convênio."],
  ["Atendimento", "Consulta com registro no prontuário integrado da clínica."],
  ["Retorno", "Resultado revisado e, quando necessário, encaminhamento interno sem nova fila."],
] as const;

const quiz = {
  stepTitles: {
    service: "Qual especialidade você procura?",
    experience: "É primeira consulta?",
    period: "Melhor turno para você?",
    timing: "Qual a urgência?",
    note: "Observações sobre o atendimento",
  },
  services: ["Odontologia", "Clínica médica", "Cardiologia", "Fisioterapia", "Exames de rotina", "Check-up integrado"],
  experienceOptions: ["Primeira consulta", "Retorno", "Acompanhamento contínuo", "Segunda opinião"],
  periodOptions: ["Manhã", "Tarde", "Sábado"],
  timingOptions: ["Esta semana", "Próximas duas semanas", "Sem pressa"],
};

function Agendar({ children, variant = "solid" }: { children: React.ReactNode; variant?: "solid" | "outline" }) {
  return (
    <PortfolioCTAQuiz
      clientKey="clinica-integrada"
      studioName="Clínica Integrada de Saúde"
      recipientName="a recepção"
      theme="navy"
      mode="booking"
      quizConfig={quiz}
      className={
        variant === "solid"
          ? "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#0f5d70] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12758c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5d70] focus-visible:ring-offset-2 sm:w-auto"
          : "inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#0f5d70]/35 bg-white px-6 py-3 text-sm font-semibold text-[#0f5d70] transition hover:bg-[#e6f4f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5d70] sm:w-auto"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function ClinicaIntegradaSaudePage() {
  return (
    <div className="min-h-dvh bg-white text-[#132a30]">
      <header className="border-b border-[#dbe8ea] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0f5d70] text-lg font-bold text-white" aria-hidden="true">
              +
            </span>
            <span className="text-base font-semibold leading-tight">
              Clínica Integrada
              <span className="block text-xs font-medium text-[#5c7a80]">de Saúde · Curitiba — PR</span>
            </span>
          </a>
          <nav className="hidden gap-6 text-sm font-medium text-[#41626a] md:flex">
            <a href="#especialidades">Especialidades</a>
            <a href="#jornada">Como funciona</a>
            <a href="#orientacoes">Orientações</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="inicio" className="border-b border-[#dbe8ea] bg-[#f3f9fa]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#d6efe4] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#186b4c]">
                Agenda aberta para esta semana
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl">
                Várias especialidades, um único prontuário.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#43626a]">
                A clínica reúne odontologia, clínica médica, cardiologia, fisioterapia e exames de rotina no mesmo
                endereço — com encaminhamento interno quando o caso exige mais de um profissional.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Agendar>Solicitar agendamento</Agendar>
                <Agendar variant="outline">Tirar dúvida sobre convênio</Agendar>
              </div>
            </div>
            <aside className="rounded-2xl border border-[#dbe8ea] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#5c7a80]">Painel de atendimento</h2>
              <dl className="mt-5 divide-y divide-[#eef4f5] text-sm">
                {[
                  ["Segunda a sexta", "08h — 19h"],
                  ["Sábado", "08h — 13h"],
                  ["Exames", "Coleta até 10h30"],
                  ["Retornos", "Sem custo em até 30 dias"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-3">
                    <dt className="text-[#43626a]">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <section id="especialidades" className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Especialidades da casa</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ESPECIALIDADES.map(([Icon, nome, texto]) => (
              <article key={nome} className="rounded-2xl border border-[#dbe8ea] p-6 transition hover:border-[#0f5d70]/40 hover:shadow-sm">
                <Icon className="h-6 w-6 text-[#0f5d70]" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold">{nome}</h3>
                <p className="mt-2 text-sm leading-6 text-[#43626a]">{texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="jornada" className="border-y border-[#dbe8ea] bg-[#0f5d70] text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">A jornada do paciente, do contato ao retorno</h2>
            <ol className="mt-10 border-l border-white/25 pl-8">
              {JORNADA.map(([titulo, texto], i) => (
                <li key={titulo} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[2.55rem] grid h-7 w-7 place-items-center rounded-full bg-white text-sm font-bold text-[#0f5d70]">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{titulo}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-white/80">{texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="orientacoes" className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Antes de vir à clínica</h2>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-[#43626a]">
                <li>Traga documento com foto e a carteirinha do convênio, quando houver.</li>
                <li>Exames anteriores ajudam na avaliação — mesmo os antigos.</li>
                <li>Se estiver em uso de medicação contínua, leve a lista atualizada.</li>
                <li>Reagendamentos podem ser feitos até 24 horas antes sem custo.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-[#f3f9fa] p-8">
              <h3 className="text-lg font-semibold">Não sabe qual especialidade procurar?</h3>
              <p className="mt-3 text-sm leading-7 text-[#43626a]">
                Descreva o sintoma ou o motivo do contato. A recepção faz a triagem e indica o profissional certo antes
                de marcar.
              </p>
              <div className="mt-6">
                <Agendar>Fazer triagem agora</Agendar>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#132a30] px-5 py-8 text-sm text-[#a7c0c5] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-white">Clínica Integrada de Saúde · Curitiba — PR</p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="clinica-integrada"
        eyebrow="Clínica Integrada de Saúde"
        title="A triagem evita consulta na especialidade errada."
        description="Conte o motivo do contato e receba a orientação de agendamento."
        ctaLabel="Ver especialidades"
        ctaHref="#especialidades"
        delayMs={9500}
        className="border-[#0f5d70]/30 bg-white/95 text-[#132a30]"
        accentClassName="text-[#0f5d70]"
      />
      <PortfolioUpsellPopup pageName="portfolio-clinica-integrada" />
    </div>
  );
}
