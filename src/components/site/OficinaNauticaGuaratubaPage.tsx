import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionReveal } from "@/components/motion";

const FICHA = [
  ["Motor de popa", "Revisão, carburação, impelidor e sistema de arrefecimento."],
  ["Casco e fibra", "Laminação, reparo de trincas, gelcoat e pintura náutica."],
  ["Elétrica de bordo", "Baterias, chaves, iluminação de navegação e bombas de porão."],
  ["Preparação de temporada", "Checklist completo antes de descer a rampa em dezembro."],
] as const;

const CHECKLIST = [
  "Óleo e filtros do motor",
  "Impelidor e bomba d'água",
  "Velas e sistema de ignição",
  "Anodos de sacrifício",
  "Carreta: pneus, luzes e roletes",
  "Equipamentos de segurança em validade",
] as const;

const JANELAS = [
  ["Outubro a novembro", "Melhor janela para revisão sem fila."],
  ["Dezembro a fevereiro", "Atendimento de urgência com prioridade para embarcação parada."],
  ["Março a setembro", "Serviços de casco, pintura e reformas maiores."],
] as const;

const quiz = {
  stepTitles: {
    service: "Qual serviço a embarcação precisa?",
    experience: "Tipo de embarcação",
    period: "Onde ela está agora?",
    timing: "Prazo desejado",
    note: "Descreva o sintoma ou o serviço",
  },
  services: ["Revisão de motor", "Reparo de casco", "Elétrica de bordo", "Preparação de temporada", "Carreta"],
  experienceOptions: ["Lancha", "Barco de pesca", "Jet ski", "Bote inflável"],
  periodOptions: ["Na garagem", "Na marina", "Na água, parada", "Em outra cidade"],
  timingOptions: ["Urgente", "Antes da temporada", "Sem pressa"],
};

function Orcar({ children, ghost = false }: { children: React.ReactNode; ghost?: boolean }) {
  return (
    <PortfolioCTAQuiz
      clientKey="guaratuba-oficina-nautica"
      studioName="Oficina Náutica Guaratuba"
      recipientName="a oficina"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      className={
        ghost
          ? "inline-flex min-h-12 items-center justify-center rounded-sm border border-[#7fd0e6] px-6 py-3 text-sm font-bold uppercase tracking-[.14em] text-[#7fd0e6] transition hover:bg-[#7fd0e6] hover:text-[#062231] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fd0e6]"
          : "inline-flex min-h-12 items-center justify-center rounded-sm bg-[#ff8b2c] px-7 py-3 text-sm font-bold uppercase tracking-[.14em] text-[#062231] transition hover:bg-[#ffa557] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8b2c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#062231]"
      }
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function OficinaNauticaGuaratubaPage() {
  return (
    <div className="min-h-dvh bg-[#062231] text-[#dff1f7]">
      <main>
        <section id="inicio" className="px-5 py-12 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <a href="#inicio" className="text-xs font-bold uppercase tracking-[.34em] text-[#7fd0e6]">
              Oficina Náutica · Guaratuba — PR
            </a>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-end">
              <div>
                <MotionReveal as="h1" variant="mask" intensity="SUBTLE" className="block text-4xl font-bold leading-[1.05] sm:text-6xl">
            <ManagedText field="heroHeadline" fallback={"A embarca\u00e7\u00e3o sai da oficina pronta para a temporada inteira."} />
          </MotionReveal>
                <p className="mt-6 max-w-xl text-base leading-8 text-[#9cbccb]">
            <ManagedText field="heroSubheadline" fallback={"Motor de popa, casco, el\u00e9trica e carreta em uma \u00fanica ficha de servi\u00e7o, com checklist assinado antes da devolu\u00e7\u00e3o."} />
          </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Orcar>Solicitar orçamento</Orcar>
                  <Orcar ghost>Agendar revisão de temporada</Orcar>
                </div>
              </div>
              <MotionReveal variant="right" intensity="SUBTLE" delay={180}>
              <svg viewBox="0 0 400 180" className="w-full text-[#0d3a51]" role="img" aria-label="Ilustração de casco de lancha em vista lateral">
                <path d="M20 120 H360 L330 155 Q200 175 60 155 Z" fill="currentColor" />
                <path d="M70 120 V78 Q190 62 300 78 V120 Z" fill="#0a2f42" />
                <rect x="330" y="86" width="34" height="34" rx="6" fill="#ff8b2c" />
                <line x1="20" y1="132" x2="360" y2="132" stroke="#7fd0e6" strokeWidth="2" strokeDasharray="8 8" />
              </svg>
              </MotionReveal>
            </div>
          </div>
        </section>

        <section id="ficha" className="border-y border-[#0e3d54] bg-[#082b3d] px-5 py-16 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Ficha de serviços</h2>
            <dl className="mt-8 divide-y divide-[#0e3d54]">
              {FICHA.map(([titulo, texto], i) => (
                <MotionReveal key={titulo} variant="up" intensity="SUBTLE" delay={i * 70} className="grid gap-2 py-5 transition-colors duration-300 hover:bg-[#0a2f42] sm:grid-cols-[14rem_1fr] sm:gap-8">
                  <dt className="text-sm font-bold uppercase tracking-[.14em] text-[#7fd0e6]">{titulo}</dt>
                  <dd className="text-base leading-7 text-[#bcd7e3]">{texto}</dd>
                </MotionReveal>
              ))}
            </dl>
          </div>
        </section>

        <section id="checklist" className="px-5 py-16 lg:px-10">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Checklist de pré-temporada</h2>
              <p className="mt-4 text-sm leading-7 text-[#9cbccb]">
                Itens conferidos em toda revisão. O que estiver fora do padrão entra no orçamento antes de ser
                substituído.
              </p>
            </div>
            <ul className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <MotionReveal key={item} as="li" variant="left" intensity="SUBTLE" delay={i * 60} className="flex items-start gap-3 border-l-2 border-[#ff8b2c] bg-[#082b3d] px-4 py-3 text-sm">
                  <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#7fd0e6]" />
                  {item}
                </MotionReveal>
              ))}
            </ul>
          </div>
        </section>

        <section id="janelas" className="bg-[#0a2f42] px-5 py-16 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Janelas de atendimento no ano</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {JANELAS.map(([periodo, texto]) => (
                <article key={periodo} className="rounded-sm border-t-4 border-[#ff8b2c] bg-[#062231] p-5">
                  <h3 className="text-sm font-bold uppercase tracking-[.12em] text-[#7fd0e6]">{periodo}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#bcd7e3]">{texto}</p>
                </article>
              ))}
            </div>
            <div className="mt-10">
              <Orcar>Reservar vaga na oficina</Orcar>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 text-xs uppercase tracking-[.18em] text-[#6e93a5] lg:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[#dff1f7]">Oficina Náutica Guaratuba</p>
          <PortfolioHostCredit linkClassName="text-[#dff1f7] underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="guaratuba-oficina-nautica"
        eyebrow="Oficina Náutica Guaratuba"
        title="A fila de revisão fecha antes de dezembro."
        description="Garanta a vaga de pré-temporada com checklist completo."
        ctaLabel="Ver checklist"
        ctaHref="#checklist"
        delayMs={9500}
        className="border-[#ff8b2c]/45 bg-[#082b3d]/95 text-[#dff1f7]"
        accentClassName="text-[#7fd0e6]"
      />
      <PortfolioUpsellPopup pageName="portfolio-guaratuba-oficina-nautica" />
    </div>
  );
}
