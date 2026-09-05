import { ManagedText } from "@/components/portfolio/ManagedText";
import { MotionCounter, MotionReveal, MotionScope, MotionStagger } from "@/components/motion";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const CHIPS = [
  "Torneira pingando",
  "Tomada queimada",
  "Chuveiro elétrico",
  "Vazamento em caixa d'água",
  "Porta desalinhada",
  "Prateleira e suporte de TV",
  "Rejunte e silicone",
  "Fechadura e maçaneta",
  "Ralo entupido",
  "Pintura de parede pequena",
] as const;

const PASSOS = [
  ["01", "Você descreve", "Foto e descrição do problema já bastam para a primeira estimativa."],
  ["02", "Recebe a faixa de valor", "Serviço pequeno tem preço fechado; o maior fica combinado antes de começar."],
  ["03", "Serviço feito e testado", "Nada de deixar pela metade: o reparo é testado com você presente."],
] as const;

const BAIRROS = ["Brejatuba", "Centro", "Cohapar", "Piçarras", "Nereidas", "Caieiras", "Coroados"] as const;

const quiz = {
  stepTitles: {
    service: "Qual reparo você precisa?",
    experience: "É casa ou comércio?",
    period: "Em qual bairro?",
    timing: "Para quando?",
    note: "Descreva o problema",
  },
  services: ["Elétrica pequena", "Hidráulica pequena", "Montagem e fixação", "Acabamento e vedação", "Vários itens de uma vez"],
  experienceOptions: ["Casa", "Apartamento", "Comércio", "Casa de temporada"],
  periodOptions: ["Brejatuba", "Centro", "Outro bairro de Guaratuba", "Fora da cidade"],
  timingOptions: ["Hoje ou amanhã", "Nesta semana", "Posso agendar"],
};

function Chamar({ children, big = false }: { children: React.ReactNode; big?: boolean }) {
  return (
    <PortfolioCTAQuiz
      clientKey="guaratuba-reparos-residenciais"
      studioName="Reparos do Litoral"
      recipientName="a equipe"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={
        "inline-flex items-center justify-center rounded-lg bg-[#f4b400] font-extrabold text-[#16243a] transition hover:bg-[#ffc72c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16243a] focus-visible:ring-offset-2 " +
        (big ? "min-h-14 px-8 py-4 text-lg" : "min-h-12 px-6 py-3 text-base")
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function ReparosDoLitoralPage() {
  return (
    <MotionScope intensity="SUBTLE">
    <div className="min-h-dvh bg-[#eef1f5] text-[#16243a]">
      <header className="bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#inicio" className="text-base font-extrabold uppercase leading-tight">
            Reparos do Litoral
            <span className="block text-xs font-semibold text-[#5b6b82]">Guaratuba — PR</span>
          </a>
          <span className="rounded-lg bg-[#f4b400] px-3 py-1 text-xs font-extrabold uppercase">Serviço pequeno, resolvido</span>
        </div>
      </header>

      <main>
        <section id="inicio" className="px-5 py-10 lg:px-8">
          <MotionReveal variant="scale" className="mx-auto max-w-5xl rounded-3xl bg-white p-7 shadow-sm sm:p-10">
            <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.12] sm:text-5xl">
            <ManagedText field="heroHeadline" fallback={"Aquele conserto que voc\u00ea adia h\u00e1 semanas leva menos de uma tarde."} />
          </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#4c5b70]">
            <ManagedText field="heroSubheadline" fallback={"Reparos el\u00e9tricos e hidr\u00e1ulicos pequenos, montagem, veda\u00e7\u00e3o e acabamento em casas, apartamentos e casas de temporada em Guaratuba."} />
          </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <Chamar big>Descrever meu problema</Chamar>
              <p className="text-sm leading-6 text-[#5b6b82]">
                Você manda a foto, recebe a faixa de valor e só então agenda. Sem visita cobrada para orçar serviço
                simples.
              </p>
            </div>
          </MotionReveal>
        </section>

        <section id="servicos" className="px-5 py-8 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-extrabold uppercase tracking-wide">Toca sem drama</h2>
            <MotionStagger variant="scale" step={45} className="mt-5 flex flex-wrap gap-2.5">
              {CHIPS.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-[#16243a]/12 bg-white px-4 py-2 text-sm font-semibold shadow-[0_1px_0_rgba(22,36,58,.08)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {c}
                </li>
              ))}
            </MotionStagger>
            <p className="mt-4 text-sm text-[#5b6b82]">
              Não está na lista? Descreva mesmo assim — se não for serviço da equipe, você é avisado na hora.
            </p>
          </div>
        </section>

        <section id="funciona" className="px-5 py-12 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {PASSOS.map(([n, titulo, texto], index) => (
              <MotionReveal
                as="div"
                key={n}
                variant="up"
                delay={index * 80}
                className="rounded-2xl bg-[#16243a] p-6 text-white transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="text-4xl font-extrabold text-[#f4b400]">
                  <MotionCounter value={Number(n)} prefix={Number(n) < 10 ? "0" : ""} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{texto}</p>
              </MotionReveal>
            ))}
          </div>
        </section>

        <section id="bairros" className="px-5 pb-12 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border-l-8 border-[#f4b400] bg-white p-7">
            <h2 className="text-xl font-extrabold uppercase tracking-wide">Bairros atendidos</h2>
            <p className="mt-4 text-base leading-8 text-[#4c5b70]">{BAIRROS.join(" · ")}</p>
            <p className="mt-3 text-sm text-[#5b6b82]">
              Casa de temporada fechada? A equipe combina o acesso com quem guarda a chave.
            </p>
          </div>
        </section>

        <section id="contato" className="bg-[#16243a] px-5 py-14 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <h2 className="max-w-xl text-2xl font-extrabold leading-snug text-white sm:text-3xl">
              Junte dois ou três reparos e resolva tudo numa visita só.
            </h2>
            <Chamar big>Pedir orçamento</Chamar>
          </div>
        </section>
      </main>

      <footer className="bg-white px-5 py-8 text-sm text-[#5b6b82] lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-extrabold uppercase text-[#16243a]">Reparos do Litoral</p>
          <PortfolioHostCredit linkClassName="font-semibold text-[#16243a] underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="guaratuba-reparos-residenciais"
        eyebrow="Reparos do Litoral"
        title="Dois reparos na mesma visita saem mais em conta."
        description="Descreva o que precisa e receba a faixa de valor."
        ctaLabel="Ver serviços"
        ctaHref="#servicos"
        delayMs={8500}
        className="border-[#f4b400]/60 bg-white/95 text-[#16243a]"
        accentClassName="text-[#b98600]"
      />
      <PortfolioUpsellPopup pageName="portfolio-guaratuba-reparos-residenciais" />
    </div>
    </MotionScope>
  );
}
