import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import {
  MotionReveal,
  MotionScope,
  MotionStagger,
  useInViewOnce,
  usePrefersReducedMotion,
} from "@/components/motion";

const SERVICOS = [
  ["Troca de quadro de distribuição", 95, "Disjuntores dimensionados por circuito e identificação de cada chave."],
  ["Instalação de chuveiro e ducha", 80, "Fiação e disjuntor compatíveis com a potência do aparelho."],
  ["Aterramento e DR", 90, "Proteção contra choque exigida pela NBR 5410."],
  ["Novos pontos e tomadas", 70, "Circuito próprio para ar-condicionado e cozinha."],
  ["Diagnóstico de curto e queda", 85, "Localização do ponto de falha antes de quebrar parede."],
] as const;

const NORMAS = [
  ["NBR 5410", "Instalações elétricas de baixa tensão — base de todo o serviço residencial."],
  ["Dimensionamento", "Bitola do cabo e disjuntor calculados pela carga real do circuito."],
  ["Registro fotográfico", "Antes e depois de cada intervenção, entregue ao cliente."],
  ["Teste final", "Medição de continuidade e teste do dispositivo DR na entrega."],
] as const;

const quiz = {
  stepTitles: {
    service: "Qual serviço elétrico você precisa?",
    experience: "Onde será o serviço?",
    period: "Qual a situação atual?",
    timing: "Quando pode ser feito?",
    note: "Descreva o problema elétrico",
  },
  services: ["Quadro de distribuição", "Chuveiro ou ducha", "Aterramento e DR", "Novos pontos", "Curto ou queda de energia"],
  experienceOptions: ["Casa", "Apartamento", "Comércio", "Obra em andamento"],
  periodOptions: ["Está sem energia agora", "Funciona, mas com falhas", "Instalação nova", "Quero laudo preventivo"],
  timingOptions: ["Emergência hoje", "Nesta semana", "Posso agendar"],
};

function Chamado({ children, block = false }: { children: React.ReactNode; block?: boolean }) {
  return (
    <PortfolioCTAQuiz
      clientKey="uberlandia-eletrica-residencial"
      studioName="Elétrica Residencial Uberlândia"
      recipientName="o eletricista"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={
        "inline-flex min-h-12 items-center justify-center bg-[#ffd400] px-7 py-3 text-sm font-black uppercase tracking-[.12em] text-[#12100c] transition hover:bg-[#ffe14d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12100c] " +
        (block ? "w-full sm:w-auto" : "")
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

/** Assinatura do projeto: a barra de carga "energiza" da esquerda para a direita. */
function BarraDeCarga({ carga, rotulo }: { carga: number; rotulo: string }) {
  const reduced = usePrefersReducedMotion();
  const { ref, seen } = useInViewOnce<HTMLDivElement>();
  const cheia = seen || reduced;
  return (
    <div ref={ref} className="mt-3 h-2 w-full bg-[#2a251d]" role="img" aria-label={`Demanda t\u00edpica do servi\u00e7o ${rotulo}`}>
      <div
        className="h-2 origin-left bg-[#ffd400]"
        style={{
          width: `${carga}%`,
          transform: cheia ? "scaleX(1)" : "scaleX(0)",
          transition: reduced ? "none" : "transform 720ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}

export function UberlandiaEletricaResidencialPage() {
  return (
    <MotionScope intensity="BALANCED">
    <div className="min-h-dvh bg-[#12100c] text-[#f1efe9]">
      <div
        aria-hidden="true"
        className="h-3 w-full bg-[repeating-linear-gradient(45deg,#ffd400_0_14px,#12100c_14px_28px)]"
      />

      <main>
        <section id="inicio" className="px-5 py-12 lg:px-10">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <a href="#inicio" className="text-sm font-black uppercase tracking-[.3em] text-[#ffd400]">
                Elétrica Residencial · Uberlândia — MG
              </a>
              <h1 className="mt-7 text-4xl font-black uppercase leading-[1.02] sm:text-6xl">
            <ManagedText field="heroHeadline" fallback={"Instala\u00e7\u00e3o el\u00e9trica que passa em teste, n\u00e3o em improviso."} />
          </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#b9b4a7]">
            <ManagedText field="heroSubheadline" fallback={"Quadros, aterramento, dispositivos DR e novos circuitos executados conforme a NBR 5410 \u2014 com medi\u00e7\u00e3o na entrega e registro fotogr\u00e1fico do servi\u00e7o."} />
          </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Chamado>Abrir chamado</Chamado>
                <a href="#seguranca" className="inline-flex min-h-12 items-center text-sm font-bold uppercase tracking-[.14em] text-[#ffd400] underline underline-offset-8">
                  Ver critérios de segurança
                </a>
              </div>
            </div>
            <MotionReveal as="aside" variant="scale" className="border-2 border-[#ffd400] bg-[#1b1813] p-6">
              <p className="text-xs font-black uppercase tracking-[.24em] text-[#ffd400]">Sinal de alerta</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#d8d3c6]">
                <li>Disjuntor desarmando sem motivo aparente</li>
                <li>Tomada esquentando ou com cheiro de queimado</li>
                <li>Choque leve ao encostar em torneira ou chuveiro</li>
                <li>Luz piscando quando o chuveiro liga</li>
              </ul>
              <p className="mt-5 border-t border-[#ffd400]/30 pt-4 text-xs font-bold uppercase tracking-wide text-[#ffd400]">
                Qualquer um desses pede desligamento do circuito e avaliação.
              </p>
            </MotionReveal>
          </div>
        </section>

        <section id="servicos" className="border-y border-[#2a251d] bg-[#171410] px-5 py-16 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-black uppercase sm:text-3xl">Serviços mais solicitados</h2>
            <ol className="mt-10 space-y-7">
              {SERVICOS.map(([nome, carga, texto], i) => (
                <MotionReveal as="li" variant="right" delay={i * 70} key={nome}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-[#ffd400]">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-lg font-bold uppercase">{nome}</h3>
                  </div>
                  <BarraDeCarga carga={carga} rotulo={nome} />
                  <p className="mt-3 pl-9 text-sm leading-7 text-[#b9b4a7]">{texto}</p>
                </MotionReveal>
              ))}
            </ol>
          </div>
        </section>

        <section id="seguranca" className="px-5 py-16 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-black uppercase sm:text-3xl">O que garante o serviço</h2>
            <MotionStagger className="mt-8 grid gap-px bg-[#2a251d] sm:grid-cols-2" variant="up" step={80}>
              {NORMAS.map(([titulo, texto]) => (
                <div key={titulo} className="bg-[#12100c] p-6">
                  <h3 className="text-sm font-black uppercase tracking-[.16em] text-[#ffd400]">{titulo}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#b9b4a7]">{texto}</p>
                </div>
              ))}
            </MotionStagger>
          </div>
        </section>

        <section id="plantao" className="bg-[#ffd400] px-5 py-14 text-[#12100c] lg:px-10">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase leading-tight sm:text-3xl">Ficou sem energia em parte da casa?</h2>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-7">
                Descreva o que aconteceu antes da queda. Isso encurta o diagnóstico e evita cobrança de hora perdida.
              </p>
            </div>
            <PortfolioCTAQuiz
              clientKey="uberlandia-eletrica-residencial"
              studioName="Elétrica Residencial Uberlândia"
              recipientName="o eletricista"
              theme="navy"
              mode="proposal"
              quizConfig={quiz}
              className="inline-flex min-h-12 items-center justify-center bg-[#12100c] px-7 py-3 text-sm font-black uppercase tracking-[.12em] text-[#ffd400] transition hover:bg-[#2a251d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12100c] focus-visible:ring-offset-2"
            >
              Chamar agora
            </PortfolioCTAQuiz>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 text-xs uppercase tracking-[.18em] text-[#8b8578] lg:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[#f1efe9]">Elétrica Residencial Uberlândia</p>
          <PortfolioHostCredit linkClassName="text-[#f1efe9] underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="uberlandia-eletrica-residencial"
        eyebrow="Elétrica Residencial Uberlândia"
        title="Tomada esquentando não espera o fim de semana."
        description="Descreva o sintoma e receba a orientação de segurança antes da visita."
        ctaLabel="Ver serviços"
        ctaHref="#servicos"
        delayMs={9000}
        className="border-[#ffd400]/50 bg-[#171410]/95 text-[#f1efe9]"
        accentClassName="text-[#ffd400]"
      />
      <PortfolioUpsellPopup pageName="portfolio-uberlandia-eletrica-residencial" />
    </div>
    </MotionScope>
  );
}
