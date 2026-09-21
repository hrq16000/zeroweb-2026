import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  Car,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { MotionImageReveal, MotionReveal, MotionScope, MotionStagger } from "@/components/motion";

const BRAND_LOGO =
  "https://0fcad913-21df-47dc-baf9-7055af432c7f.lovableproject.com/src/assets/logo.webp";
const HERO_IMAGE =
  "https://0fcad913-21df-47dc-baf9-7055af432c7f.lovableproject.com/src/assets/carro-aptos.webp";
const CLASSROOM_IMAGE =
  "https://0fcad913-21df-47dc-baf9-7055af432c7f.lovableproject.com/src/assets/instructor-teaching.webp";

const services = [
  "Primeira habilitação",
  "Categoria B · carro",
  "Categoria B · carro automático",
  "Categoria A · moto",
  "Categoria A · moto automática",
  "Categoria AB",
  "Reteste prático",
  "Renovação de CNH",
  "Reciclagem de CNH",
];

const quiz = {
  services,
  experienceOptions: [
    "Vou começar do zero",
    "Já tenho processo aberto",
    "Já sou habilitado(a)",
    "Preciso de reteste ou regularização",
  ],
  periodOptions: [
    "Manhã",
    "Tarde",
    "Noite",
    "Quero confirmar horários",
  ],
  timingOptions: [
    "Quero começar agora",
    "Nas próximas semanas",
    "Estou pesquisando valores",
  ],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você procura na APTOS?",
    experience: "Em que momento da sua CNH você está?",
    period: "Qual período funciona melhor?",
    timing: "Quando você pretende começar?",
  },
  stepSubtitles: {
    service: "Escolha a opção principal. A equipe confirma regras e disponibilidade do veículo para o seu processo.",
    experience: "Isso ajuda a organizar o atendimento sem fazer você repetir tudo depois.",
    period: "A disponibilidade final é confirmada pela equipe.",
    timing: "Essa resposta serve para priorizar o próximo passo.",
  },
  notePlaceholder: "Conte se prefere carro automático, moto automática, se já possui processo aberto ou qualquer detalhe importante.",
};

const CTA = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <PortfolioCTAQuiz
    clientKey="autoescola-aptos"
    studioName="Autoescola APTOS"
    recipientName="a equipe da Autoescola APTOS"
    theme="navy"
    mode="proposal"
    quizConfig={quiz}
    className={className}
    ariaLabel={typeof children === "string" ? children : "Iniciar atendimento com a Autoescola APTOS"}
  >
    {children}
  </PortfolioCTAQuiz>
);

const primary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffd400] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#081a38] shadow-[0_14px_34px_rgba(255,212,0,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(255,212,0,.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

const serviceCards = [
  {
    Icon: Car,
    eyebrow: "Categoria B",
    title: "Carro manual e automático",
    text: "Escolha uma formação alinhada ao seu processo, com opção de carro automático para uma experiência mais confortável nas aulas.",
  },
  {
    Icon: Bike,
    eyebrow: "Categoria A",
    title: "Moto e moto automática",
    text: "A APTOS agora também destaca a opção de moto automática, ampliando as possibilidades para quem busca praticidade no aprendizado.",
  },
  {
    Icon: GraduationCap,
    eyebrow: "Primeira habilitação",
    title: "Do início ao próximo passo",
    text: "Orientação para matrícula, etapas do processo, aulas e preparação prática em São José dos Pinhais.",
  },
  {
    Icon: ShieldCheck,
    eyebrow: "Reteste e regularização",
    title: "Volte preparado",
    text: "Reteste prático, renovação e reciclagem com orientação objetiva para entender o que se aplica ao seu caso.",
  },
];

const facts = [
  { value: "+15", label: "anos de experiência divulgados pela APTOS" },
  { value: "+5 mil", label: "alunos formados divulgados pela APTOS" },
  { value: "4,9", label: "avaliação divulgada no Google" },
  { value: "DETRAN-PR", label: "credenciamento informado pela empresa" },
];

const faq = [
  {
    q: "A APTOS tem carro automático?",
    a: "Sim. A Autoescola APTOS divulga aulas práticas com opção de carro automático. A equipe confirma como a modalidade se aplica ao seu processo e a disponibilidade da agenda.",
  },
  {
    q: "A APTOS agora também tem moto automática?",
    a: "Sim. A nova comunicação da APTOS passa a destacar também a opção de moto automática. A confirmação de agenda, veículo e regras aplicáveis acontece no atendimento.",
  },
  {
    q: "Posso começar minha primeira habilitação pela página?",
    a: "Sim. O funil organiza seu interesse, estágio atual e preferência de veículo para a equipe orientar o próximo passo.",
  },
  {
    q: "Onde fica a Autoescola APTOS?",
    a: "A empresa atende no Centro de São José dos Pinhais, na Rua Passos de Oliveira, 810, em localização próxima ao DETRAN.",
  },
  {
    q: "A APTOS também atende reteste e reciclagem?",
    a: "Sim. A empresa divulga reteste prático, renovação e curso de reciclagem de CNH entre os serviços oferecidos.",
  },
];

export function AutoescolaAptosPage() {
  return (
    <MotionScope>
      <div className="min-h-dvh overflow-hidden bg-[#f6f8fb] text-[#0a1d3b] selection:bg-[#ffd400] selection:text-[#07172f]">
        <header className="absolute inset-x-0 top-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/20 bg-[#07172f]/72 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <a href="#inicio" className="flex items-center gap-3" aria-label="Autoescola APTOS — início">
              <span className="grid h-11 w-24 place-items-center overflow-hidden rounded-lg bg-white px-2">
                <img src={BRAND_LOGO} alt="Autoescola APTOS" className="max-h-9 w-auto object-contain" />
              </span>
              <span className="hidden text-xs font-black uppercase tracking-[0.16em] text-white/80 sm:block">
                São José dos Pinhais
              </span>
            </a>
            <CTA className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ffd400] px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-[#081a38] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Simular minha CNH
            </CTA>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative isolate min-h-[92svh] overflow-hidden bg-[#07172f] text-white">
            <div className="absolute inset-0 -z-30">
              <img
                src={HERO_IMAGE}
                alt="Veículo da Autoescola APTOS em São José dos Pinhais"
                className="h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
                {...({ fetchpriority: "high" } as Record<string, string>)}
              />
            </div>
            <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(5,20,44,.98)_0%,rgba(5,20,44,.93)_42%,rgba(5,20,44,.45)_72%,rgba(5,20,44,.7)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-[#07172f] via-[#07172f]/85 to-transparent" />
            <div aria-hidden className="absolute -right-24 top-24 h-72 w-72 rounded-full border-[42px] border-[#ffd400]/15" />

            <div className="mx-auto flex min-h-[92svh] max-w-7xl items-end px-5 pb-14 pt-36 sm:px-6 lg:px-8">
              <div className="grid w-full gap-10 lg:grid-cols-[1.08fr_.72fr] lg:items-end">
                <div>
                  <MotionReveal variant="up">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd400]/50 bg-[#ffd400]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-[#ffe665]">
                      <Sparkles className="h-4 w-4" aria-hidden />
                      Novidade APTOS
                    </div>
                  </MotionReveal>
                  <MotionReveal variant="up">
                    <h1 className="mt-5 max-w-5xl text-[clamp(3.2rem,8vw,7.5rem)] font-black leading-[0.86] tracking-[-0.055em]">
                      Sua CNH,
                      <span className="block text-[#ffd400]">do seu jeito.</span>
                    </h1>
                  </MotionReveal>
                  <p className="mt-7 max-w-2xl text-base leading-7 text-white/80 sm:text-xl sm:leading-8">
                    Autoescola APTOS em São José dos Pinhais — agora com destaque para
                    <strong className="text-white"> carro automático e moto automática</strong>,
                    além de primeira habilitação, categorias A, B e AB, reteste, renovação e reciclagem.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <CTA className={primary}>
                      Quero começar agora
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </CTA>
                    <a
                      href="#automaticos"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-white/8 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-white/15"
                    >
                      Ver automáticos
                    </a>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold text-white/80">
                    {["Próximo ao DETRAN", "Curso online", "Atendimento rápido", "Frota moderna"].map((item) => (
                      <span key={item} className="rounded-full border border-white/16 bg-white/7 px-3 py-2 backdrop-blur">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <MotionImageReveal direction="left">
                  <aside className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffd400]">Escolha que reduz atrito</p>
                    <p className="mt-3 text-3xl font-black leading-tight">
                      Menos preocupação com comandos. Mais atenção no aprendizado.
                    </p>
                    <div className="mt-6 grid gap-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-[#07172f]/65 p-4">
                        <Car className="h-6 w-6 text-[#ffd400]" aria-hidden />
                        <div><strong className="block">Carro automático</strong><span className="text-sm text-white/65">Opção para aulas práticas</span></div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-[#07172f]/65 p-4">
                        <Bike className="h-6 w-6 text-[#ffd400]" aria-hidden />
                        <div><strong className="block">Moto automática</strong><span className="text-sm text-white/65">Novo destaque APTOS</span></div>
                      </div>
                    </div>
                  </aside>
                </MotionImageReveal>
              </div>
            </div>
          </section>

          <section className="relative z-10 -mt-5 px-5 sm:px-6 lg:px-8" aria-label="Indicadores da Autoescola APTOS">
            <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-[1.75rem] bg-[#d8dfeb] shadow-xl sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.value} className="bg-white p-6">
                  <div className="text-3xl font-black text-[#0a2f68]">{fact.value}</div>
                  <p className="mt-1 text-sm leading-5 text-[#4c5b70]">{fact.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="automaticos" className="px-5 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0a58b5]">Agora na APTOS</p>
                  <MotionReveal variant="up">
                    <h2 className="mt-3 text-[clamp(2.6rem,5vw,5rem)] font-black leading-[0.92] tracking-[-0.045em]">
                      Automático não é detalhe.
                      <span className="block text-[#0a58b5]">É uma nova porta de entrada.</span>
                    </h2>
                  </MotionReveal>
                </div>
                <p className="max-w-2xl text-lg leading-8 text-[#56657a]">
                  Para quem está começando, quer retomar a confiança ou prefere uma experiência mais direta,
                  carro e moto automáticos podem tornar a adaptação mais confortável. A equipe confirma o que
                  se aplica ao seu processo antes do agendamento.
                </p>
              </div>

              <MotionStagger className="mt-12 grid gap-5 md:grid-cols-2">
                {serviceCards.map(({ Icon, eyebrow, title, text }) => (
                  <article key={title} className="group rounded-[2rem] border border-[#dce3ee] bg-white p-7 shadow-[0_20px_60px_rgba(18,42,76,.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(18,42,76,.13)]">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0a58b5]">{eyebrow}</p>
                        <h3 className="mt-2 text-2xl font-black leading-tight">{title}</h3>
                      </div>
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#ffd400] text-[#081a38]">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                    </div>
                    <p className="mt-5 leading-7 text-[#617085]">{text}</p>
                  </article>
                ))}
              </MotionStagger>
            </div>
          </section>

          <section className="bg-[#081a38] px-5 py-24 text-white sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
              <MotionImageReveal direction="right">
                <div className="relative overflow-hidden rounded-[2.25rem]">
                  <img src={CLASSROOM_IMAGE} alt="Instrutor orientando aluno na Autoescola APTOS" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-[#07172f]/82 p-5 backdrop-blur">
                    <p className="text-sm font-black uppercase tracking-[0.15em] text-[#ffd400]">Decisão mais clara</p>
                    <p className="mt-2 text-xl font-bold">Entenda seu processo antes de escolher o veículo e a agenda.</p>
                  </div>
                </div>
              </MotionImageReveal>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd400]">Como começa</p>
                <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Um atendimento que já chega organizado.</h2>
                <ol className="mt-8 grid gap-5">
                  {[
                    ["01", "Escolha seu objetivo", "Primeira habilitação, carro, moto, automático, reteste ou regularização."],
                    ["02", "Conte em que etapa está", "O funil reduz perguntas repetidas e leva contexto para a equipe."],
                    ["03", "Confirme modalidade e agenda", "A APTOS orienta regras, disponibilidade e o próximo passo aplicável."],
                    ["04", "Comece com mais confiança", "A partir daí, você segue a jornada da CNH com acompanhamento."],
                  ].map(([n, title, text]) => (
                    <li key={n} className="grid grid-cols-[3.2rem_1fr] gap-4 border-t border-white/12 pt-5">
                      <span className="text-sm font-black text-[#ffd400]">{n}</span>
                      <div><strong className="block text-lg">{title}</strong><span className="mt-1 block text-sm leading-6 text-white/65">{text}</span></div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="px-5 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0a58b5]">Confiança local</p>
                  <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">APTOS, no Centro de São José dos Pinhais.</h2>
                  <div className="mt-6 flex items-start gap-3 text-[#58687d]">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#0a58b5]" aria-hidden />
                    <p>Rua Passos de Oliveira, 810 · Centro · São José dos Pinhais — PR</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    [BadgeCheck, "Credenciada", "A empresa informa credenciamento junto ao DETRAN-PR."],
                    [Star, "Reputação", "A APTOS divulga avaliação 4,9 no Google em sua presença digital."],
                    [Clock3, "Flexibilidade", "Aulas e atendimento com opções de período conforme disponibilidade."],
                    [CheckCircle2, "Jornada completa", "Primeira habilitação, A/B/AB, reteste, renovação e reciclagem."],
                  ].map(([Icon, title, text]) => {
                    const C = Icon as typeof BadgeCheck;
                    return (
                      <div key={title as string} className="rounded-[1.75rem] bg-[#edf3fb] p-6">
                        <C className="h-6 w-6 text-[#0a58b5]" aria-hidden />
                        <h3 className="mt-4 text-xl font-black">{title as string}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#617085]">{text as string}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pb-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl rounded-[2.25rem] border border-[#dce3ee] bg-white p-7 shadow-[0_20px_60px_rgba(18,42,76,.08)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0a58b5]">Perguntas frequentes</p>
              <h2 className="mt-3 text-4xl font-black">Antes de começar</h2>
              <div className="mt-8 divide-y divide-[#e5eaf1]">
                {faq.map((item) => (
                  <details key={item.q} className="group py-5">
                    <summary className="cursor-pointer list-none pr-8 text-lg font-black marker:hidden">{item.q}</summary>
                    <p className="mt-3 max-w-3xl leading-7 text-[#617085]">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 pb-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#0a58b5] p-8 text-white sm:p-12 lg:p-16">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffe665]">Pronto para o próximo passo?</p>
                  <h2 className="mt-3 max-w-4xl text-[clamp(2.7rem,6vw,5.7rem)] font-black leading-[0.9] tracking-[-0.045em]">
                    Comece sua CNH com a opção que faz sentido para você.
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
                    Informe seu objetivo, preferência por carro ou moto automática e o momento atual do processo.
                    A equipe da APTOS recebe o contexto organizado.
                  </p>
                </div>
                <CTA className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ffd400] px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#081a38] shadow-xl transition hover:-translate-y-1">
                  Quero começar
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </CTA>
              </div>
            </div>
          </section>
        </main>

        <PortfolioHostCredit />
      </div>
    </MotionScope>
  );
}
