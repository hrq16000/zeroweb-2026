import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { MotionReveal, MotionStagger } from "@/components/motion";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import type { CtaPlacement, CtaRenderOptions } from "@/lib/portfolio-blueprint";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
import adhonepHeroEditorial from "@/assets/adhonep-curitiba-hero-editorial-v2.jpg";

/**
 * ADHONEP Curitiba (/portfolio/adhonep-curitiba) — composição autoral.
 *
 * Os fatos do encontro vêm do convite recebido pelo projeto. A cena executiva
 * usada no hero é uma COMPOSIÇÃO EDITORIAL CONCEITUAL derivada da matriz visual
 * enviada pelo cliente; não é foto documental de participante, sede,
 * palestrante ou reunião real.
 * Todo contato passa pelo funil `funnel-adhonep-curitiba` (contactMode=funnelOnly).
 */

const FICHA = [
  { rotulo: "Capítulo", valor: "714" },
  { rotulo: "Encontro", valor: "Reunião semanal aberta" },
  { rotulo: "Palestrante", valor: "Hélio Sato" },
  { rotulo: "Tema", valor: "Vencendo o Medo" },
  { rotulo: "Data", valor: "16 de setembro de 2026 · quarta-feira" },
  { rotulo: "Horário", valor: "20:00" },
  { rotulo: "Participação", valor: "Sem custo financeiro" },
] as const;

const PAUTA = [
  {
    hora: "20:00",
    titulo: "Abertura da reunião",
    texto: "Chegada e acolhida de quem participa pela primeira vez.",
  },
  {
    hora: "Palestra",
    titulo: "Vencendo o Medo",
    texto:
      "Hélio Sato fala sobre o medo de arriscar, de falhar e de tomar decisões difíceis — o obstáculo citado no convite.",
  },
  {
    hora: "Após",
    titulo: "Café e networking individual",
    texto:
      "Momento para conversar diretamente com o palestrante, trocar contatos e apresentar as próprias ideias.",
  },
] as const;

export const composition: PortfolioComposition = {
  slug: "adhonep-curitiba",
  motionIntensity: "SUBTLE",
  theme: {
    ["--adhonep-base" as string]: "#07111f",
    ["--adhonep-surface" as string]: "#0d1d33",
    ["--adhonep-surface-2" as string]: "#122946",
    ["--adhonep-accent" as string]: "#e0a24f",
    ["--adhonep-accent-soft" as string]: "#f3cf91",
    ["--adhonep-ink" as string]: "#f5eee3",
  },
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton
      clientKey="adhonep-curitiba"
      companySlug="adhonep-curitiba"
      formSlug="funnel-adhonep-curitiba"
      location={`adhonep-curitiba_${placement}`}
      className={className}
    >
      {children}
    </FunnelCTAButton>
  ),
  afterContent: <PortfolioHostCredit />,
  brief: {
    businessPersonality:
      "encontro noturno de empresários e profissionais; executivo, acolhedor, sóbrio e orientado a conexão humana",
    creativeConcept:
      "convite editorial noturno: a landing combina a precisão de uma pauta executiva com a atmosfera de uma sala de reunião acima da cidade",
    visualMetaphor:
      "vidro, cidade, mesa de reunião e luz dourada transformam o encontro semanal em uma experiência de presença e decisão",
    spatialLanguage:
      "hero assimétrico com manifesto à esquerda e cena editorial à direita; ficha sobreposta, trilho temporal e grandes pausas de leitura",
    heroConcept:
      "cartaz digital vivo: tema e capítulo dominam a tipografia enquanto uma ilustração executiva conceitual cria contexto sem fingir fotografia documental",
    navigationConcept: "leitura linear sem menu; confirmação sempre acessível no mobile",
    contentRhythm: "convite → contexto → pauta → dinâmica do encontro → local → confirmação",
    mediaNarrative:
      "uma ilustração editorial exclusiva inspirada no convite fornecido pelo cliente, complementada por arte abstrata própria; nenhum rosto é apresentado como pessoa real do evento",
    proofNarrative: "sem depoimentos ou métricas inventadas; somente fatos do convite e informações operacionais do encontro",
    conversionNarrative: "um único pedido — confirmar presença pelo formulário, sem telefone comercial exposto na landing",
    motionNarrative: "revelação editorial da cena e entrada sequencial dos horários, mantendo movimento discreto e corporativo",
    signatureMoments: [
      "hero de dupla leitura: manifesto tipográfico + cena executiva conceitual com ficha flutuante",
      "trilho de pauta com marcação dourada e progressão vertical",
      "cartão final de local em contraste claro, quebrando o ritmo escuro da página",
    ],
    compositionFingerprint: {
      heroGeometry: "executive-poster-split: manifesto 5/12 + cena 7/12 com card operacional sobreposto",
      headerTreatment: "sem header tradicional; microassinatura ADHONEP Curitiba + Capítulo 714 no próprio hero",
      sectionGraph: "poster-split→manifesto-band→agenda-spine→meeting-cards→place-contrast→editorial-close",
      contentOrder: [
        "identidade e convite",
        "cena conceitual e ficha",
        "por que o tema importa",
        "pauta da noite",
        "dinâmica do encontro",
        "local e acesso",
        "confirmação",
      ],
      gridTopology: "hero 5/7 assimétrico, narrativa 4/8, agenda 3/9 e fechamento em composição editorial",
      mediaDistribution: "hero visual dominante, nenhuma galeria decorativa repetitiva e uma única arte complementar no fechamento",
      backgroundRhythm: "navy profundo → painel azul → navy → cartão marfim → navy",
      proofPlacement: "ausente por falta de prova verificável",
      ctaDistribution: "hero, local, fechamento e barra fixa mobile",
      navigationPattern: "leitura contínua e sem menu",
      motionSignature: "máscara no hero + stagger de pauta, sem animação ornamental contínua",
      closingStructure: "chamada editorial curta apoiada por arte de marca e CTA único",
    },
  },
};

function Cta({ className, placement, label }: { className?: string; placement: CtaPlacement; label: string }) {
  return composition.renderCta({ children: label, className, placement });
}

function FactCard() {
  return (
    <dl
      className="grid gap-px overflow-hidden rounded-2xl border font-mono text-[11px] shadow-2xl sm:text-xs"
      style={{
        borderColor: "rgba(224,162,79,.28)",
        background: "rgba(5,13,24,.88)",
        boxShadow: "0 24px 80px rgba(0,0,0,.36)",
      }}
    >
      {FICHA.map((linha) => (
        <div
          key={linha.rotulo}
          className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-white/5 px-4 py-3 last:border-0 sm:grid-cols-[7.5rem_1fr] sm:px-5"
        >
          <dt className="uppercase tracking-[0.16em] opacity-50">{linha.rotulo}</dt>
          <dd className="text-right font-semibold leading-snug">{linha.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AdhonepCuritibaPage() {
  return (
    <PortfolioCompositionRoot composition={composition}>
      <div
        className="min-h-dvh overflow-hidden pb-24 lg:pb-0"
        style={{ background: "var(--adhonep-base)", color: "var(--adhonep-ink)" }}
      >
        <header className="relative mx-auto w-full max-w-[1500px] px-5 pt-7 sm:px-8 lg:px-12 lg:pt-10">
          <div className="mb-7 flex items-center justify-between gap-6 border-b border-white/10 pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.42em]" style={{ color: "var(--adhonep-accent)" }}>
                ADHONEP · Curitiba
              </p>
              <p className="mt-2 text-xs opacity-45">Reunião Semanal · Capítulo 714</p>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] opacity-45 sm:block">
              quarta · 20h · Curitiba
            </span>
          </div>

          <div className="grid items-stretch gap-9 lg:grid-cols-12 lg:gap-7">
            <div className="flex flex-col justify-between py-3 lg:col-span-5 lg:py-10">
              <div>
                <span
                  className="inline-flex rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ borderColor: "rgba(224,162,79,.4)", color: "var(--adhonep-accent-soft)" }}
                >
                  encontro aberto · sem custo financeiro
                </span>
                <h1 className="mt-8 max-w-[9ch] text-5xl font-semibold leading-[.93] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[5.7rem]">
                  Vencendo o <span style={{ color: "var(--adhonep-accent-soft)" }}>Medo</span>
                </h1>
                <p className="mt-7 max-w-[44ch] text-base leading-relaxed opacity-76 sm:text-lg">
                  Uma noite para conversar sobre decisões difíceis, liderança, coragem para agir e conexões com quem
                  também está construindo caminhos profissionais e empresariais.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4 lg:mt-12">
                <Cta
                  placement="hero"
                  label="Confirmar presença"
                  className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-45">
                  16 set 2026 · 20:00
                </span>
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <MotionReveal variant="mask" className="relative overflow-hidden rounded-[2rem] border border-white/10">
                <PortfolioImage
                  src={adhonepHeroEditorial}
                  alt="Composição editorial conceitual de uma sala executiva vazia à noite, inspirada na matriz visual do convite e sem retratar local ou participantes reais"
                  width={1600}
                  height={1000}
                  priority
                  managedField="heroImageUrl"
                  className="aspect-[16/10] min-h-[390px] w-full object-cover object-center sm:min-h-[500px] lg:min-h-[610px]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 45%, rgba(4,10,18,.68) 100%)" }}
                />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-auto sm:w-[24rem]">
                  <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/55">
                    ilustração editorial conceitual
                  </p>
                  <FactCard />
                </div>
              </MotionReveal>
            </div>
          </div>
        </header>

        <section className="mx-auto mt-24 w-full max-w-6xl px-6 lg:mt-32">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--adhonep-accent)" }}>
                O tema da noite
              </p>
              <p className="mt-4 max-w-[22ch] text-sm leading-relaxed opacity-52">
                Medo não desaparece antes da decisão. A conversa começa justamente nesse intervalo.
              </p>
            </div>
            <div className="lg:col-span-8">
              <p className="max-w-[54ch] text-2xl leading-[1.45] tracking-[-0.02em] sm:text-3xl">
                Quem está construindo uma carreira, liderando projetos ou tirando ideias do papel conhece o peso de
                arriscar, falhar e escolher sem garantia de resultado.
              </p>
              <p className="mt-7 max-w-[62ch] text-base leading-relaxed opacity-68">
                A proposta da reunião é abrir espaço para essa conversa e para conexões entre pessoas que compartilham
                desafios profissionais e empresariais. Sem promessas de resultado e sem prova social inventada.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-6xl px-6 lg:mt-32">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h2 className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "var(--adhonep-accent)" }}>
                A pauta da noite
              </h2>
              <p className="mt-4 max-w-[25ch] text-sm leading-relaxed opacity-52">
                Um roteiro curto para chegar, ouvir, conversar e criar novas conexões.
              </p>
            </div>
            <MotionStagger variant="up" className="relative lg:col-span-9">
              <div className="absolute bottom-0 left-[3.65rem] top-0 hidden w-px bg-white/10 sm:block" aria-hidden="true" />
              {PAUTA.map((item, index) => (
                <article key={item.titulo} className="relative grid gap-4 border-b border-white/10 py-8 sm:grid-cols-[7rem_1fr] sm:gap-8">
                  <div className="relative font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--adhonep-accent)" }}>
                    <span className="relative z-10">{item.hora}</span>
                    <span
                      aria-hidden="true"
                      className="absolute right-[3.3rem] top-1 hidden h-2 w-2 rounded-full sm:block"
                      style={{ background: index === 0 ? "var(--adhonep-accent)" : "var(--adhonep-surface-2)" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em]">{item.titulo}</h3>
                    <p className="mt-2 max-w-[58ch] leading-relaxed opacity-68">{item.texto}</p>
                  </div>
                </article>
              ))}
            </MotionStagger>
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-6xl px-6 lg:mt-32">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Chegar", "Acolhida para quem participa pela primeira vez."],
              ["Ouvir", "Palestra sobre o tema central da noite: Vencendo o Medo."],
              ["Conectar", "Café e networking individual depois da palestra."],
            ].map(([title, text], index) => (
              <MotionReveal key={title} variant={index === 1 ? "up" : "mask"}>
                <article
                  className="min-h-[15rem] rounded-[1.5rem] border border-white/8 p-7"
                  style={{ background: index === 1 ? "var(--adhonep-surface-2)" : "var(--adhonep-surface)" }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-38">0{index + 1}</span>
                  <h3 className="mt-12 text-2xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-relaxed opacity-66">{text}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-6xl px-6 lg:mt-32">
          <div
            className="grid gap-8 rounded-[2rem] p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end"
            style={{ background: "var(--adhonep-ink)", color: "var(--adhonep-base)" }}
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-48">Local · Curitiba</p>
              <h2 className="mt-5 max-w-[18ch] text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                Av. Cândido Hartmann, 570
              </h2>
              <p className="mt-3 text-lg">32º andar · sala 324</p>
              <p className="mt-5 max-w-[46ch] text-sm leading-relaxed opacity-64">
                Quarta-feira, 16 de setembro de 2026, às 20:00. Confirme a presença pelo formulário para receber as
                orientações do encontro.
              </p>
            </div>
            <Cta
              placement="location"
              label="Quero participar"
              className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
            />
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-6xl px-6 pb-20 lg:mt-32">
          <div className="grid items-end gap-9 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--adhonep-accent)" }}>
                Próxima reunião
              </p>
              <h2 className="mt-5 max-w-[13ch] text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                Uma decisão simples pode abrir uma conversa importante.
              </h2>
              <p className="mt-5 max-w-[56ch] leading-relaxed opacity-65">
                Confirme sua presença e venha conhecer o encontro. O formulário registra seu interesse sem expor telefone
                comercial na página.
              </p>
              <div className="mt-8">
                <Cta
                  placement="cta"
                  label="Confirmar presença"
                  className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <MotionReveal variant="mask" className="overflow-hidden rounded-[1.5rem] border border-white/8">
                <PortfolioImage
                  src="/images/adhonep-curitiba/capa.jpg"
                  alt="Arte abstrata própria da ADHONEP Curitiba em azul-noite e âmbar"
                  width={1200}
                  height={630}
                  className="aspect-[4/3] w-full object-cover"
                />
              </MotionReveal>
            </div>
          </div>
        </section>

        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 lg:hidden"
          style={{ borderColor: "rgba(224,162,79,.28)", background: "rgba(7,17,31,.96)" }}
        >
          <Cta
            placement="floating"
            label="Confirmar presença"
            className="flex min-h-12 w-full items-center justify-center rounded-full text-sm font-semibold"
          />
        </div>
      </div>
    </PortfolioCompositionRoot>
  );
}
