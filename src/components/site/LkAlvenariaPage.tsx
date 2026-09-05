import { MotionReveal, MotionScope } from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { motion } from "motion/react";
import { ArrowRight, ClipboardCheck, HardHat, Landmark, ShieldCheck } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { useManagedValue } from "@/components/portfolio/PortfolioRuntimeContext";

const quiz = { services: ["Alicerce e fundação", "Baldrame e concretagem", "Alvenaria, muros e paredes", "Colunas, vigas e lajes", "Reboco, chapisco e emboço", "Cerâmica e porcelanato", "Drywall e forro PVC", "Calçadas e paver", "Reformas e reparos"], experienceOptions: ["Construção nova", "Reforma residencial", "Obra comercial ou predial", "Reparo ou manutenção"], periodOptions: ["Curitiba e região", "Vou confirmar o endereço", "Ainda estou definindo o local"], timingOptions: ["Preciso iniciar em breve", "Estou planejando", "Quero uma avaliação primeiro"], proposalKind: "service" as const, stepTitles: { service: "Qual etapa da obra você precisa?", experience: "Que tipo de projeto é?", period: "Onde será a obra?", timing: "Quando pretende começar?", note: "Conte os detalhes da obra" }, notePlaceholder: "Ex.: metragem, etapa atual, material desejado e prazo estimado." };

function CTA({ children }: { children: React.ReactNode }) {
  return <PortfolioCTAQuiz clientKey="lk-alvenaria" studioName="LK Alvenaria" recipientName="LK Alvenaria" theme="gold" mode="proposal" quizConfig={quiz} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#17100b] px-7 py-3.5 font-bold text-[#ffd7ab] shadow-[6px_6px_0_0_#ff7900] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_#ff7900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7900]">{children}</PortfolioCTAQuiz>;
}

/** Cronograma de obra: etapas em sequência, do chão ao acabamento. */
const etapas = [
  { fase: "Etapa 01", title: "Alicerce e estrutura", text: "Baldrame, colunas, vigas, lajes e concretagem para uma base segura." },
  { fase: "Etapa 02", title: "Alvenaria e muros", text: "Tijolo, bloco, paredes e muro de arrimo com execução cuidadosa." },
  { fase: "Etapa 03", title: "Acabamentos", text: "Reboco, chapisco, emboço, contrapiso, cerâmica e porcelanato." },
  { fase: "Etapa 04", title: "Reformas e soluções", text: "Drywall, forro PVC, calçadas, paver, consertos e reparos." },
];

const ficha: Array<[string, string]> = [
  ["Formalização", "Contrato de obra e nota fiscal"],
  ["Garantia", "Garantia do serviço executado"],
  ["Orçamento", "Personalizado por etapa"],
  ["Atendimento", "Curitiba e região"],
];

export function LkAlvenariaPage() {
  // Material oficial disponível hoje é um panfleto com telefone visível e o
  // perfil (logo) — nenhum dos dois pode virar imagem de topo pública.
  // COVER_ASSET_PENDING: só exibimos foto quando o admin salvar uma segura.
  const managedHero = useManagedValue("heroImageUrl", "");
  const heroImage =
    typeof managedHero === "string" && managedHero && !/\/(portfolio|perfil)\.(webp|png|jpg)$/i.test(managedHero)
      ? managedHero
      : null;
  return (

    <MotionScope intensity="BALANCED">
    <div className="min-h-dvh bg-[#f4efe7] font-sans text-[#17100b]">
      <header className="bg-[#17100b] px-5 py-4 text-[#f4efe7] lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href="#inicio" className="flex items-center gap-2 font-display text-lg font-bold"><PortfolioImage src="/images/lk-alvenaria/perfil.png" alt="LK Alvenaria" width={40} height={40} className="h-7 w-7 rounded-full object-cover" managedField="logoUrl" />LK <span className="text-[#ff7900]">Alvenaria</span></a>
          <nav className="hidden gap-6 text-sm font-semibold sm:flex">
            <a href="#cronograma" className="hover:text-[#ff7900]">Cronograma</a>
            <a href="#ficha" className="hover:text-[#ff7900]">Ficha da obra</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO: painel tipográfico de canteiro (sem material com contato visível) */}
        <section id="inicio" className="relative overflow-hidden bg-[#17100b]">
          <div aria-hidden className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(90deg,#3a2c20_0_2px,transparent_2px_92px),repeating-linear-gradient(0deg,#3a2c20_0_2px,transparent_2px_44px)]" />
          <div aria-hidden className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ff7900]/25 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#ffb066]">Empreiteiro de obra civil · construção e acabamento</p>
            <MotionReveal as="h1" variant="up" intensity="EXPRESSIVE" className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.02] text-[#fdf7f0] sm:text-6xl">
              <ManagedText field="heroHeadline" fallback={"Sua obra com contrato e garantia."} />
            </MotionReveal>
            {heroImage ? (
              <img src={heroImage} alt="LK Alvenaria: registro de obra" width={1280} height={800} loading="eager" decoding="async" className="mt-8 h-56 w-full rounded-xl object-cover sm:h-72" />
            ) : null}
          </div>

          <div className="mx-auto -mt-12 max-w-5xl px-5 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="rounded-2xl border-2 border-[#17100b] bg-[#fdf7f0] p-6 sm:p-8">
              <p className="text-base leading-8 text-[#4a3a2c]">
                <ManagedText field="heroSubheadline" fallback={"Da funda\u00e7\u00e3o ao acabamento, a LK Alvenaria executa cada etapa com compromisso, transpar\u00eancia e padr\u00e3o de qualidade."} />
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <CTA>Solicitar orçamento <ArrowRight className="h-4 w-4" /></CTA>
                <a href="#cronograma" className="text-sm font-bold underline decoration-[#ff7900] decoration-2 underline-offset-4">Ver o cronograma da obra</a>
              </div>
            </motion.div>
          </div>
        </section>




        {/* CRONOGRAMA: linha do tempo vertical, medida em etapas de obra */}
        <section id="cronograma" className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Do chão batido ao acabamento, etapa por etapa</h2>
            <ol className="mt-10 border-l-4 border-dashed border-[#c9b6a0]">
              {etapas.map((e, i) => (
                <MotionReveal as="li" variant="left" delay={i * 120} key={e.fase} className="relative pb-10 pl-8 last:pb-0 sm:pl-12">
                  <span aria-hidden className="absolute -left-[14px] top-1 grid h-6 w-6 place-items-center rounded-full bg-[#ff7900] text-[10px] font-black text-[#17100b]">{e.fase.slice(-2)}</span>
                  <p className="text-xs font-bold uppercase tracking-[.24em] text-[#a2632a]">{e.fase}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{e.title}</h3>
                  <p className="mt-2 max-w-2xl leading-8 text-[#5a4839]">{e.text}</p>
                </MotionReveal>
              ))}
            </ol>
          </div>
        </section>

        {/* FICHA DA OBRA: tabela de compromissos, não cards */}
        <section id="ficha" className="bg-[#17100b] px-5 py-20 text-[#f4efe7] lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center gap-3">
              <ClipboardCheck className="h-7 w-7 text-[#ff7900]" aria-hidden />
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Ficha da obra</h2>
            </div>
            <p className="mt-4 max-w-2xl leading-8 text-[#d4c6b6]">Trabalhamos com contrato, emissão de nota fiscal, garantia do serviço e orçamento personalizado para você acompanhar a evolução com clareza.</p>
            <dl className="mt-8 divide-y divide-[#3a2c20] border-y border-[#3a2c20]">
              {ficha.map(([k, v]) => (
                <MotionReveal key={k} variant="fade" className="flex flex-col gap-1 py-4 transition-colors duration-200 hover:bg-[#241811] sm:flex-row sm:items-baseline sm:gap-8">
                  <dt className="w-48 shrink-0 text-xs font-bold uppercase tracking-[.22em] text-[#ff7900]">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </MotionReveal>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#d4c6b6]"><ShieldCheck className="h-5 w-5 text-[#ff7900]" aria-hidden />Garantia do serviço</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#d4c6b6]"><Landmark className="h-5 w-5 text-[#ff7900]" aria-hidden />Execução com cuidado técnico</div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Vamos conversar sobre a sua obra?</h2>
            <p className="mx-auto mt-3 max-w-xl leading-8 text-[#5a4839]">Envie os detalhes do projeto e solicite um orçamento personalizado.</p>
            <div className="mt-7 flex justify-center"><CTA>Solicitar orçamento <ArrowRight className="h-4 w-4" /></CTA></div>
          </div>
        </section>
      </main>

      <footer className="bg-[#17100b] px-5 py-8 text-sm text-[#c7b7a5] lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-bold text-[#f4efe7]">LK <span className="text-[#ff7900]">Alvenaria</span></p>
            <p className="mt-1">Construção, reformas e acabamento em geral.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-[#f4efe7] underline underline-offset-4 hover:text-[#ff7900]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup clientKey="lk-alvenaria" eyebrow="LK Alvenaria" title="Sua obra merece contrato, garantia e acabamento de qualidade." description="Conte a etapa do projeto e receba um próximo passo organizado." ctaLabel="Ver cronograma" ctaHref="#cronograma" delayMs={9000} className="border-[#ff7900]/40 bg-[#17100b]/95 text-white" accentClassName="text-[#ff7900]" />
      <PortfolioUpsellPopup pageName="portfolio-lk-alvenaria" />
    </div>
    </MotionScope>
  );
}
