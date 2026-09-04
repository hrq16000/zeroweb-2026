import { useManagedValue } from "@/components/portfolio/PortfolioRuntimeContext";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  HardHat,
  Layers,
  MapPin,
  PaintRoller,
  Ruler,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PAULO_MESTRE_FAQ } from "@/components/site/paulo-mestre-de-obras-faq";

export { PAULO_MESTRE_FAQ };

const quiz = {
  services: [
    "Fundação e baldrame",
    "Alvenaria, muros e paredes",
    "Colunas, vigas e lajes",
    "Reboco e revestimentos",
    "Pisos e azulejos",
    "Reformas e pequenos reparos",
  ],
  experienceOptions: [
    "Construção nova",
    "Reforma residencial",
    "Manutenção ou reparo",
    "Obra comercial",
  ],
  periodOptions: [
    "Curitiba e região",
    "Vou confirmar o endereço",
    "Ainda estou definindo o local",
  ],
  timingOptions: [
    "Preciso começar em breve",
    "Estou planejando",
    "Quero uma avaliação primeiro",
  ],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual serviço você precisa?",
    experience: "Que tipo de obra é?",
    period: "Onde será a obra?",
    timing: "Quando pretende começar?",
    note: "Conte os detalhes da obra",
  },
  notePlaceholder: "Ex.: metragem, etapa atual, acabamento desejado e prazo.",
};

function CTA({ children, tone = "solid" }: { children: ReactNode; tone?: "solid" | "outline" }) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b51b] focus-visible:ring-offset-2";
  const styles =
    tone === "solid"
      ? "bg-[#f5b51b] text-[#111b31] shadow-lg shadow-[#f5b51b]/25 hover:-translate-y-1 hover:bg-[#ffd35c]"
      : "border-2 border-[#101d35] text-[#101d35] hover:bg-[#101d35] hover:text-white";
  return (
    <PortfolioCTAQuiz
      clientKey="paulo-mestre-de-obras"
      studioName="Paulo Mestre de Obras"
      recipientName="Paulo"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={`${base} ${styles}`}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const LOGO = "/images/paulo-mestre-de-obras/logo.webp";

const services: Array<{ title: string; text: string; icon: typeof Wrench }> = [
  {
    title: "Fundação e estrutura",
    text: "Alicerce, baldrame, colunas, vigas, lajes e concretagem para começar a obra com segurança.",
    icon: Layers,
  },
  {
    title: "Alvenaria e reboco",
    text: "Tijolo, bloco, muros, paredes, chapisco, emboço e reboco com alinhamento e prumo conferidos.",
    icon: Wrench,
  },
  {
    title: "Pisos e revestimentos",
    text: "Contrapiso, cerâmica, porcelanato e azulejos assentados com nivelamento e rejunte cuidadoso.",
    icon: Ruler,
  },
  {
    title: "Reformas e reparos",
    text: "Pequenas reformas, hidráulica, elétrica, portas, janelas, calçadas e manutenção do dia a dia.",
    icon: PaintRoller,
  },
];

const steps = [
  {
    title: "Você conta a etapa",
    text: "Em poucos minutos, pelo formulário, você descreve o serviço, o local e o prazo desejado.",
  },
  {
    title: "Visita e orçamento",
    text: "A obra é avaliada no local sempre que necessário e o orçamento sai detalhado por etapa.",
  },
  {
    title: "Execução organizada",
    text: "Material dimensionado, sequência definida e obra mantida limpa a cada dia de trabalho.",
  },
  {
    title: "Entrega conferida",
    text: "Acabamento revisado junto com você antes de considerar a etapa concluída.",
  },
];

const gallery = [
  {
    src: "/images/paulo-mestre-de-obras/alvenaria.webp",
    alt: "Assentamento de blocos com linha e prumo em obra residencial",
    label: "Alvenaria e estrutura",
  },
  {
    src: "/images/paulo-mestre-de-obras/revestimento.webp",
    alt: "Assentamento de porcelanato com desempenadeira dentada e espaçadores",
    label: "Pisos e revestimentos",
  },
  {
    src: "/images/paulo-mestre-de-obras/acabamento.webp",
    alt: "Acabamento de parede rebocada e rodapé em ambiente reformado",
    label: "Acabamento e reformas",
  },
];

export function PauloMestreDeObrasPage() {
  const logo = useManagedValue("logoUrl", LOGO);
  const capa = useManagedValue("heroImageUrl", "/images/paulo-mestre-de-obras/capa.webp");
  return (
    <div className="min-h-dvh overflow-hidden bg-[#f7f5ef] text-[#14243e]">
      <header className="sticky top-0 z-30 border-b border-white/15 bg-[#101d35]/95 px-5 py-3 text-white backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" className="flex items-center gap-3">
            <PortfolioImage
              src={logo}
              alt="Logo Paulo Mestre de Obras"
              priority
              width={640}
              height={640}
              className="h-11 w-11 rounded-xl object-cover ring-1 ring-[#f5b51b]/50"
            />
            <span className="font-display text-lg font-bold leading-tight">
              Paulo <span className="text-[#f5b51b]">Mestre de Obras</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[.18em] text-[#8fa1ba]">
                Curitiba e região
              </span>
            </span>
          </a>
          <nav className="hidden gap-6 text-sm font-semibold md:flex">
            <a href="#servicos" className="hover:text-[#f5b51b]">
              Serviços
            </a>
            <a href="#obras" className="hover:text-[#f5b51b]">
              Obras
            </a>
            <a href="#processo" className="hover:text-[#f5b51b]">
              Como funciona
            </a>
            <a href="#duvidas" className="hover:text-[#f5b51b]">
              Dúvidas
            </a>
          </nav>
          <CTA>
            Solicitar orçamento <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className="relative overflow-hidden bg-[#101d35] px-5 py-14 text-white lg:px-8 lg:py-24"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#f5b51b]/20 blur-3xl" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_.9fr]">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold uppercase tracking-[.2em] text-[#f5b51b]"
              >
                Pedreiro · azulejista · construção civil
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-5 font-display text-5xl font-bold leading-[.98] sm:text-7xl"
              >
                Sua obra bem feita, do{" "}
                <span className="text-[#f5b51b]">alicerce ao acabamento.</span>
              </motion.h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#dbe4ef]">
                Serviços gerais de construção civil, reformas e reparos em Curitiba e região, com
                combinado claro, obra organizada e atenção aos detalhes que aparecem no fim.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA>
                  Pedir orçamento <ArrowRight className="h-4 w-4" />
                </CTA>
                <a
                  href="#servicos"
                  className="inline-flex min-h-12 items-center rounded-full border border-[#8fa1ba]/70 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  Ver serviços
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[#dbe4ef]">
                <span>
                  <Check className="mr-1 inline h-4 w-4 text-[#f5b51b]" />
                  Orçamento personalizado
                </span>
                <span>
                  <ShieldCheck className="mr-1 inline h-4 w-4 text-[#f5b51b]" />
                  Compromisso e transparência
                </span>
                <span>
                  <MapPin className="mr-1 inline h-4 w-4 text-[#f5b51b]" />
                  Curitiba e região metropolitana
                </span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <PortfolioImage
                src={capa}
                alt="Serviços de pedreiro e azulejista de Paulo Mestre de Obras"
                priority
                width={1084}
                height={1600}
                className="mx-auto max-h-[650px] w-full rounded-[2rem] object-cover object-center shadow-2xl ring-1 ring-white/15"
              />
            </motion.div>
          </div>
        </section>

        <section id="servicos" className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-[#b87900]">
              O que fazemos
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold">
              Uma solução completa para construir, reformar e reparar.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(({ title, text, icon: Icon }, i) => (
                <motion.article
                  key={title}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-[#e1d8c4] bg-white p-6 shadow-sm"
                >
                  <span className="text-sm font-bold text-[#b87900]">0{i + 1}</span>
                  <Icon className="mt-8 h-7 w-7 text-[#d39200]" />
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5c6879]">{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="obras" className="bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-[#b87900]">
              Etapas na prática
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold">
              Do bloco assentado ao rodapé alinhado.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {gallery.map((item) => (
                <figure
                  key={item.src}
                  className="overflow-hidden rounded-3xl border border-[#e1d8c4] bg-[#f7f5ef] shadow-sm"
                >
                  <PortfolioImage
                    src={item.src}
                    alt={item.alt}
                    width={1280}
                    height={960}
                    className="h-60 w-full object-cover"
                  />
                  <figcaption className="px-5 py-4 text-sm font-bold text-[#101d35]">
                    {item.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="qualidade" className="bg-[#eee8dc] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] text-[#b87900]">
                Segurança em cada etapa
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold">
                Clareza no combinado. Cuidado na execução.
              </h2>
              <p className="mt-5 leading-8 text-[#5c6879]">
                O serviço é planejado conforme a necessidade da obra, com orçamento personalizado,
                comunicação transparente e foco no acabamento.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <ClipboardCheck className="h-6 w-6 text-[#b87900]" />
                  <p className="mt-4 font-bold">Orçamento sob medida</p>
                  <p className="mt-1 text-sm text-[#5c6879]">
                    Cada etapa é entendida antes de começar.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <HardHat className="h-6 w-6 text-[#b87900]" />
                  <p className="mt-4 font-bold">Obra organizada</p>
                  <p className="mt-1 text-sm text-[#5c6879]">
                    Material dimensionado e canteiro limpo.
                  </p>
                </div>
              </div>
            </div>
            <PortfolioImage
              src="/images/paulo-mestre-de-obras/revestimento.webp"
              alt="Detalhe de assentamento de revestimento com nivelamento"
              width={1280}
              height={960}
              className="mx-auto max-h-[520px] w-full rounded-[2rem] object-cover object-center shadow-xl"
            />
          </div>
        </section>

        <section id="processo" className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-[#b87900]">
              Como funciona
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold">
              Quatro passos até a obra andar.
            </h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-4">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-3xl border border-[#e1d8c4] bg-white p-6 shadow-sm"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#101d35] font-bold text-[#f5b51b]">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5c6879]">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="duvidas" className="bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-[#b87900]">Dúvidas</p>
            <h2 className="mt-3 font-display text-4xl font-bold">Antes de pedir o orçamento.</h2>
            <div className="mt-8 divide-y divide-[#e1d8c4] rounded-3xl border border-[#e1d8c4]">
              {PAULO_MESTRE_FAQ.map((faq) => (
                <details key={faq.q} className="group px-6 py-5">
                  <summary className="cursor-pointer list-none text-lg font-bold text-[#101d35] marker:hidden">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-[#5c6879]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5b51b] px-5 py-20 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#101d35] p-8 text-white shadow-2xl md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] text-[#f5b51b]">
                Próximo passo
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold">Vamos tirar sua obra do papel?</h2>
              <p className="mt-3 max-w-xl leading-7 text-[#dbe4ef]">
                Conte o que precisa e receba um orçamento personalizado para a sua etapa.
              </p>
            </div>
            <CTA>
              Falar com Paulo <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#0b1629] px-5 py-8 text-sm text-[#bdc9d8] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <PortfolioImage
              src={LOGO}
              alt="Logo Paulo Mestre de Obras"
              width={640}
              height={640}
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div>
              <p className="font-bold text-white">
                Paulo <span className="text-[#f5b51b]">Mestre de Obras</span>
              </p>
              <p className="mt-1">
                Pedreiro, azulejista e serviços gerais de construção civil em Curitiba e região.
              </p>
            </div>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#f5b51b]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="paulo-mestre-de-obras"
        eyebrow="Paulo · Mestre de Obras"
        title="Sua obra merece compromisso, transparência e acabamento cuidadoso."
        description="Conte a etapa do projeto e receba um próximo passo organizado."
        ctaLabel="Ver serviços"
        ctaHref="#servicos"
        delayMs={9000}
        className="border-[#f5b51b]/40 bg-[#101d35]/95 text-white"
        accentClassName="text-[#f5b51b]"
      />
      <PortfolioUpsellPopup pageName="portfolio-paulo-mestre-de-obras" />
    </div>
  );
}
