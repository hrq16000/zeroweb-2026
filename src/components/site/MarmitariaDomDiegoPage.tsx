import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de Marmitaria Dom Diego (/portfolio/marmitaria-dom-diego).
 *
 * Direção autoral: caderno de cozinha da casa. Papel quente com pauta,
 * faixa de dias da semana no topo, texto em coluna estreita à esquerda e a
 * foto presa como se estivesse colada na página. Leitura calma e caseira.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"] as const;

const anotacoes = [
  {
    titulo: "Almoço do dia",
    texto: "O cardápio muda conforme a semana, sempre com arroz, feijão, mistura e acompanhamento.",
  },
  {
    titulo: "Porção que sustenta",
    texto: "Marmita montada pensando em quem trabalha e precisa de uma refeição de verdade.",
  },
  {
    titulo: "Pedido combinado",
    texto: "Você conta o que procura e a casa confirma o que está disponível no dia.",
  },
] as const;

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
      <main className="mx-auto max-w-5xl px-5 py-10 md:py-16">
        {/* faixa de dias — assinatura do projeto */}
        <nav aria-label="Dias de atendimento" className="flex flex-wrap gap-2">
          {semana.map((dia) => (
            <span
              key={dia}
              className="rounded-md bg-[var(--dd-leaf)]/12 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--dd-leaf)]"
            >
              {dia}
            </span>
          ))}
        </nav>

        <div className="mt-9 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-start md:gap-14">
          <div className="min-w-0">
            <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-[var(--dd-clay)]">
              Marmitaria Dom Diego
            </p>
            <h1 className="mt-4 max-w-[16ch] font-display text-[2.2rem] font-bold leading-[1.05] md:text-[3.4rem]">
              <ManagedText
                field="heroHeadline"
                fallback={"Comida de casa para o almo\u00e7o de todo dia."}
              />
            </h1>
            <p className="mt-5 max-w-[46ch] text-base leading-[1.75] text-[var(--dd-ink)]/75">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Presen\u00e7a digital da Marmitaria Dom Diego: card\u00e1pio pr\u00e1tico e pedido combinado direto com a casa."
                }
              />
            </p>

            <div className="mt-8">
              <FunnelCTAButton
                clientKey="marmitaria-dom-diego"
                companySlug="marmitaria-dom-diego"
                formSlug="funnel-marmitaria-dom-diego"
                location="marmitaria-dom-diego_hero"
                className="inline-flex items-center rounded-xl bg-[var(--dd-leaf)] px-7 py-3.5 text-sm font-semibold text-[var(--dd-paper)]"
              >
                <ManagedText field="ctaLabel" fallback={"Falar com a equipe"} />
              </FunnelCTAButton>
            </div>
          </div>

          <figure className="relative">
            <span
              className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] bg-[var(--dd-clay)]/30"
              aria-hidden
            />
            <PortfolioImage
              src="/images/marmitaria-dom-diego/capa.png"
              alt="Marmitaria Dom Diego"
              priority
              width={1200}
              height={800}
              className="w-full rotate-[1.2deg] rounded-lg border-[10px] border-white/70 object-cover shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
              managedField="heroImageUrl"
            />
          </figure>
        </div>

        <section aria-labelledby="dd-notas" className="mt-14 border-t border-[var(--dd-ink)]/15 pt-10">
          <h2
            id="dd-notas"
            className="font-display text-sm font-bold uppercase tracking-[0.3em] text-[var(--dd-ink)]/50"
          >
            Como funciona
          </h2>
          <ol className="mt-6 space-y-6">
            {anotacoes.map((item, i) => (
              <li key={item.titulo} className="flex gap-5">
                <span className="mt-1 font-display text-2xl font-bold text-[var(--dd-clay)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 border-b border-dashed border-[var(--dd-ink)]/20 pb-5">
                  <h3 className="font-display text-lg font-bold">{item.titulo}</h3>
                  <p className="mt-2 max-w-[62ch] text-sm leading-[1.8] text-[var(--dd-ink)]/70">{item.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 rounded-2xl bg-[var(--dd-leaf)]/10 p-7 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold leading-snug md:text-2xl">
              Almoço gostoso começa com uma escolha simples.
            </h2>
            <p className="mt-2 max-w-[50ch] text-sm leading-relaxed text-[var(--dd-ink)]/70">
              Conte o que procura no cardápio e como prefere fazer o pedido.
            </p>
          </div>
          <FunnelCTAButton
            clientKey="marmitaria-dom-diego"
            companySlug="marmitaria-dom-diego"
            formSlug="funnel-marmitaria-dom-diego"
            location="marmitaria-dom-diego_fechamento"
            className="mt-6 inline-flex shrink-0 items-center rounded-xl border border-[var(--dd-leaf)] px-7 py-3.5 text-sm font-semibold text-[var(--dd-leaf)] md:mt-0"
          >
            Conhecer cardápio
          </FunnelCTAButton>
        </section>
      </main>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="marmitaria-dom-diego" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-marmitaria-dom-diego" />
      <PortfolioHostCredit />
    </div>
  );
}
