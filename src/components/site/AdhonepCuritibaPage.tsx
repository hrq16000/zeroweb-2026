import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { MotionReveal, MotionStagger } from "@/components/motion";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import type { CtaPlacement, CtaRenderOptions } from "@/lib/portfolio-blueprint";
import type { PortfolioComposition } from "@/lib/portfolio-composition";

/**
 * ADHONEP Curitiba (/portfolio/adhonep-curitiba) — composição autoral.
 *
 * Conteúdo 100% derivado do convite oficial recebido em 13/09/2026. Nenhuma
 * prova social, métrica, foto de pessoas, sede ou palestrante: não há material
 * fotográfico próprio. As imagens são ABSTRACT_BRAND_ART deste projeto.
 * Todo contato passa pelo funil `funnel-adhonep-curitiba` (contactMode=funnelOnly).
 */

const FICHA = [
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
    hora: "—",
    titulo: "Palestra · Vencendo o Medo",
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
    // Identidade escopada a este cliente: navy de noite + âmbar de luz quente.
    ["--adhonep-base" as string]: "#0a1426",
    ["--adhonep-surface" as string]: "#10203c",
    ["--adhonep-accent" as string]: "#e8a33d",
    ["--adhonep-ink" as string]: "#f3ece0",
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
      "grupo de empresários e profissionais que se encontra toda semana à noite; sóbrio, acolhedor e sem promessa comercial",
    creativeConcept: "a pauta da noite: a página é o próprio programa da reunião, lido de cima para baixo",
    visualMetaphor: "pauta impressa sobre vidro escuro de andar alto, com luz âmbar de fim de expediente",
    spatialLanguage: "coluna editorial à esquerda e trilho de horários à direita, com respiro grande entre blocos",
    heroConcept: "bloco tipográfico do tema ancorado por ficha monoespaçada de data, hora e local, sem foto de pessoas",
    navigationConcept: "sem menu; âncora única de confirmação fixa no rodapé da tela em mobile",
    contentRhythm: "convite → obstáculo → pauta da noite → formato do encontro → local → confirmação",
    mediaNarrative: "apenas arte de marca abstrata; nenhuma foto de pessoas, sede, plateia ou palestrante",
    proofNarrative: "sem prova social: somente os fatos declarados no convite oficial",
    conversionNarrative: "um único pedido — confirmar presença pelo formulário, sem telefone na página",
    motionNarrative: "revelação linha a linha do trilho de horários, como uma pauta sendo lida",
    signatureMoments: [
      "trilho de horários revelado sequencialmente no scroll",
      "ficha monoespaçada de data sticky no desktop enquanto o conteúdo passa",
    ],
    compositionFingerprint: {
      heroGeometry: "stage-ledger: título editorial à esquerda e ficha monoespaçada à direita, sem imagem sob o texto",
      headerTreatment: "sem header; identificação apenas no bloco inicial",
      sectionGraph: "stage-ledger→obstacle-lines→agenda-rail→format-list→place-band→confirm-close",
      contentOrder: [
        "convite e ficha do encontro",
        "obstáculo declarado no convite",
        "pauta da noite",
        "como funciona a reunião",
        "local e acesso",
        "confirmação de presença",
      ],
      gridTopology: "duas colunas assimétricas 7/5 no desktop, coluna única no mobile",
      mediaDistribution: "uma arte de marca no topo e uma faixa abstrata antes do fechamento; nenhuma imagem no meio do texto",
      backgroundRhythm: "navy contínuo com uma única faixa clara na seção de local",
      proofPlacement: "ausente por decisão editorial",
      ctaDistribution: "ficha inicial e fechamento, mais barra fixa em mobile",
      navigationPattern: "leitura linear sem menu",
      motionSignature: "revelação sequencial de linhas de pauta com ficha sticky",
      closingStructure: "bloco de confirmação em negativo com o convite repetido em uma frase",
    },
  },
};

function Cta({ className, placement, label }: { className?: string; placement: CtaPlacement; label: string }) {
  return composition.renderCta({ children: label, className, placement });
}

export function AdhonepCuritibaPage() {
  return (
    <PortfolioCompositionRoot composition={composition}>
      <div
        className="min-h-dvh pb-24 lg:pb-0"
        style={{ background: "var(--adhonep-base)", color: "var(--adhonep-ink)" }}
      >
        {/* stage-ledger */}
        <header className="mx-auto w-full max-w-6xl px-6 pt-14 lg:pt-20">
          <p
            className="font-mono text-xs uppercase tracking-[0.35em]"
            style={{ color: "var(--adhonep-accent)" }}
          >
            ADHONEP · Curitiba
          </p>
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Vencendo o Medo
              </h1>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed opacity-80 sm:text-lg">
                Um convite aberto a jovens e adultos empreendedores, moças e rapazes com visão de futuro: participe da
                nossa reunião semanal, sem custo financeiro.
              </p>
              <div className="mt-8">
                <Cta
                  placement="hero"
                  label="Confirmar presença"
                  className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
                />
              </div>
            </div>

            <aside className="lg:col-span-5">
              <dl
                className="rounded-2xl border p-6 font-mono text-sm lg:sticky lg:top-10"
                style={{ borderColor: "rgba(232,163,61,0.35)", background: "var(--adhonep-surface)" }}
              >
                {FICHA.map((linha) => (
                  <div key={linha.rotulo} className="flex flex-wrap justify-between gap-2 border-b border-white/5 py-3 last:border-0">
                    <dt className="uppercase tracking-[0.18em] opacity-60">{linha.rotulo}</dt>
                    <dd className="text-right font-semibold">{linha.valor}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <MotionReveal variant="mask" className="mt-12 overflow-hidden rounded-3xl">
            <PortfolioImage
              src="/images/adhonep-curitiba/hero-abstrato.jpg"
              alt="Arte de marca abstrata em tons de azul-noite e âmbar, com linhas horizontais que sugerem uma pauta de horários"
              width={1600}
              height={1000}
              className="h-[220px] w-full object-cover sm:h-[320px]"
            />
          </MotionReveal>
        </header>

        {/* obstacle-lines */}
        <section className="mx-auto mt-20 w-full max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 className="text-sm font-mono uppercase tracking-[0.28em] opacity-60 lg:col-span-4">
              O que costuma travar
            </h2>
            <div className="lg:col-span-8">
              <p className="max-w-[60ch] text-xl leading-relaxed sm:text-2xl">
                Quem está construindo uma carreira, liderando projetos ou tirando ideias do papel sabe bem: o medo de
                arriscar, de falhar ou de tomar decisões difíceis pode ser o maior obstáculo do crescimento.
              </p>
              <p className="mt-6 max-w-[60ch] leading-relaxed opacity-75">
                Participar de redes de conexão e mentoria é o diferencial entre quem estaciona e quem avança. Na
                ADHONEP você encontra um ambiente para conversar com empresários e líderes experientes.
              </p>
            </div>
          </div>
        </section>

        {/* agenda-rail */}
        <section className="mx-auto mt-20 w-full max-w-6xl px-6">
          <h2 className="font-mono text-sm uppercase tracking-[0.28em]" style={{ color: "var(--adhonep-accent)" }}>
            A pauta da noite
          </h2>
          <MotionStagger variant="up" className="mt-8 border-t border-white/10">
            {PAUTA.map((item) => (
              <article
                key={item.titulo}
                className="grid gap-3 border-b border-white/10 py-7 sm:grid-cols-[7rem_1fr] sm:gap-8"
              >
                <span className="font-mono text-sm tracking-[0.18em]" style={{ color: "var(--adhonep-accent)" }}>
                  {item.hora}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{item.titulo}</h3>
                  <p className="mt-2 max-w-[62ch] leading-relaxed opacity-75">{item.texto}</p>
                </div>
              </article>
            ))}
          </MotionStagger>
        </section>

        {/* format-list */}
        <section className="mx-auto mt-20 w-full max-w-6xl px-6">
          <h2 className="font-mono text-sm uppercase tracking-[0.28em] opacity-60">Como funciona o encontro</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            <li className="rounded-xl p-5 leading-relaxed" style={{ background: "var(--adhonep-surface)" }}>
              A participação é aberta e não tem custo financeiro.
            </li>
            <li className="rounded-xl p-5 leading-relaxed" style={{ background: "var(--adhonep-surface)" }}>
              A reunião acontece toda semana, sempre à noite.
            </li>
            <li className="rounded-xl p-5 leading-relaxed" style={{ background: "var(--adhonep-surface)" }}>
              Depois da palestra há um café para conversas individuais.
            </li>
            <li className="rounded-xl p-5 leading-relaxed" style={{ background: "var(--adhonep-surface)" }}>
              Basta confirmar presença por este formulário — respondemos com as orientações de chegada.
            </li>
          </ul>
        </section>

        {/* place-band */}
        <section className="mt-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div
              className="grid gap-6 rounded-3xl p-8 sm:grid-cols-[1fr_auto] sm:items-center"
              style={{ background: "var(--adhonep-ink)", color: "var(--adhonep-base)" }}
            >
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.28em] opacity-60">Local</h2>
                <p className="mt-3 text-xl font-semibold leading-snug">
                  Av. Cândido Hartmann, 570 — 32º andar, sala 324
                </p>
                <p className="mt-2 text-sm opacity-70">Curitiba — PR · quarta-feira, 16 de setembro de 2026, às 20:00</p>
              </div>
              <Cta
                placement="location"
                label="Quero participar"
                className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
              />
            </div>
          </div>
        </section>

        {/* confirm-close */}
        <section className="mx-auto mt-20 w-full max-w-6xl px-6 pb-20">
          <MotionReveal variant="mask" className="overflow-hidden rounded-3xl">
            <PortfolioImage
              src="/images/adhonep-curitiba/capa.jpg"
              alt="Arte de marca abstrata com retângulos translúcidos sobrepostos em azul-noite e âmbar"
              width={1200}
              height={630}
              className="h-[160px] w-full object-cover sm:h-[240px]"
            />
          </MotionReveal>
          <h2 className="mt-10 max-w-[22ch] text-3xl font-semibold leading-tight sm:text-4xl">
            Esperamos você na próxima reunião.
          </h2>
          <p className="mt-4 max-w-[58ch] leading-relaxed opacity-75">
            Não deixe o receio do desconhecido travar o seu potencial de liderança. Confirme a presença e receba as
            informações do encontro.
          </p>
          <div className="mt-8">
            <Cta
              placement="cta"
              label="Confirmar presença"
              className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
            />
          </div>
        </section>

        {/* barra fixa apenas em telas pequenas */}
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 lg:hidden"
          style={{ borderColor: "rgba(232,163,61,0.3)", background: "var(--adhonep-base)" }}
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
