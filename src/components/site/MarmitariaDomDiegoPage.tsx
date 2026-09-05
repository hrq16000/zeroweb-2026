import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import {
  MotionImageReveal,
  MotionReveal,
  MotionScope,
  useInViewOnce,
  usePrefersReducedMotion,
} from "@/components/motion";

/**
 * Site exclusivo de Marmitaria Dom Diego (/portfolio/marmitaria-dom-diego).
 *
 * Direção autoral (Rodada 4 · CLUSTER_02): quadro de cardápio da casa.
 * Faixa fotográfica larga no topo com o nome aplicado sobre ela, e abaixo um
 * cardápio em linhas com pontilhado de menu (item · descrição), no lugar de
 * lista numerada. O convite fecha o cardápio, em linha única.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const cardapio = [
  {
    item: "Almoço do dia",
    detalhe: "Arroz, feijão, mistura e acompanhamento, conforme o cardápio da semana.",
  },
  {
    item: "Porção que sustenta",
    detalhe: "Marmita montada pensando em quem trabalha e precisa de refeição de verdade.",
  },
  {
    item: "Pedido combinado",
    detalhe: "Você conta o que procura e a casa confirma o que está disponível no dia.",
  },
  {
    item: "Retirada e entrega",
    detalhe: "O jeito de receber é combinado direto com a casa, sem intermediário.",
  },
] as const;

/**
 * Assinatura de seção: a linha pontilhada do cardápio é "escrita" da esquerda
 * para a direita quando entra na viewport (scaleX, sem alterar layout).
 * Com reduced motion, a linha já nasce completa.
 */
function LinhaCardapio({
  item,
  detalhe,
  index,
}: {
  item: string;
  detalhe: string;
  index: number;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, seen } = useInViewOnce<HTMLDivElement>();
  const drawn = reduced || seen;
  return (
    <div
      ref={ref}
      className="group py-5 transition-[opacity] duration-300 hover:opacity-100"
      style={{ opacity: drawn ? 1 : 0.35, transition: "opacity 420ms ease" }}
    >
      <div className="flex items-baseline gap-3">
        <dt className="font-display text-lg font-bold transition-transform duration-200 group-hover:translate-x-1 md:text-xl">
          {item}
        </dt>
        <span
          aria-hidden
          className="h-px flex-1 border-b border-dotted border-[var(--dd-ink)]/35 group-hover:border-[var(--dd-leaf)]"
          style={{
            transform: drawn ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: reduced
              ? "none"
              : `transform 520ms cubic-bezier(0.22,1,0.36,1) ${index * 90}ms`,
          }}
        />
      </div>
      <dd className="mt-2 max-w-[64ch] text-sm leading-[1.85] text-[var(--dd-ink)]/70">
        {detalhe}
      </dd>
    </div>
  );
}

export function MarmitariaDomDiegoPage() {
  return (
    <div
      className="min-h-dvh bg-[var(--dd-paper)] text-[var(--dd-ink)]"
      style={
        {
          "--dd-paper": "oklch(0.95 0.025 95)",
          "--dd-ink": "oklch(0.28 0.03 70)",
          "--dd-leaf": "oklch(0.48 0.11 145)",
          "--dd-clay": "oklch(0.66 0.13 55)",
        } as React.CSSProperties
      }
    >
      <main>
        {/* faixa fotográfica larga com o nome aplicado */}
        <section className="relative">
          <PortfolioImage
            src="/images/marmitaria-dom-diego/capa.png"
            alt="Marmitaria Dom Diego"
            priority
            width={1600}
            height={700}
            className="h-[38vh] min-h-[240px] w-full object-cover md:h-[46vh]"
            managedField="heroImageUrl"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[var(--dd-ink)]/85 via-[var(--dd-ink)]/45 to-transparent"
          />
          <div className="absolute inset-y-0 left-0 flex w-full items-center px-5">
            <div className="mx-auto w-full max-w-5xl">
              <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.34em] text-[var(--dd-paper)]/85">
                Marmitaria Dom Diego
              </p>
              <h1 className="mt-3 max-w-[15ch] font-display text-[2rem] font-bold leading-[1.05] text-[var(--dd-paper)] md:text-[3.2rem]">
                <ManagedText
                  field="heroHeadline"
                  fallback={"Comida de casa para o almo\u00e7o de todo dia."}
                />
              </h1>
            </div>
          </div>
        </section>

        {/* cardápio em linhas com pontilhado */}
        <section aria-labelledby="dd-cardapio" className="mx-auto max-w-5xl px-5 py-12 md:py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-[var(--dd-ink)]/20 pb-4">
            <h2
              id="dd-cardapio"
              className="font-display text-sm font-bold uppercase tracking-[0.32em] text-[var(--dd-leaf)]"
            >
              Cardápio da casa
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--dd-ink)]/50">
              Segunda a sexta
            </p>
          </div>

          <dl className="mt-2">
            {cardapio.map((linha, i) => (
              <LinhaCardapio key={linha.item} index={i} item={linha.item} detalhe={linha.detalhe} />
            ))}
          </dl>


          <p className="mt-6 max-w-[60ch] text-base leading-[1.8] text-[var(--dd-ink)]/75">
            <ManagedText
              field="heroSubheadline"
              fallback={
                "Presen\u00e7a digital da Marmitaria Dom Diego: card\u00e1pio pr\u00e1tico e pedido combinado direto com a casa."
              }
            />
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t-2 border-[var(--dd-ink)]/20 pt-8">
            <FunnelCTAButton
              clientKey="marmitaria-dom-diego"
              companySlug="marmitaria-dom-diego"
              formSlug="funnel-marmitaria-dom-diego"
              location="marmitaria-dom-diego_hero"
              className="inline-flex items-center rounded-xl bg-[var(--dd-leaf)] px-7 py-3.5 text-sm font-semibold text-[var(--dd-paper)]"
            >
              <ManagedText field="ctaLabel" fallback={"Falar com a equipe"} />
            </FunnelCTAButton>
            <p className="max-w-[42ch] text-sm leading-relaxed text-[var(--dd-ink)]/65">
              Conte o que procura no cardápio e como prefere fazer o pedido.
            </p>
          </div>
        </section>
      </main>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="marmitaria-dom-diego" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-marmitaria-dom-diego" />
      <PortfolioHostCredit />
    </div>
  );
}
