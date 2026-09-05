import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de REuse House Brechó (/portfolio/reuse-house-brecho).
 *
 * Direção autoral: ficha de etiqueta. A leitura começa por um cabeçalho
 * tipográfico sem foto, segue por um índice tabular de garimpo com linhas
 * pontilhadas e numeração, e só depois mostra a fotografia como faixa
 * horizontal larga. O fechamento é uma etiqueta destacável com borda
 * tracejada. Nenhum mosaico e nenhuma foto no topo.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const indice = [
  {
    codigo: "01",
    titulo: "Moda circular",
    detalhe: "Peças que continuam em uso em vez de virar descarte.",
  },
  {
    codigo: "02",
    titulo: "Garimpo curado",
    detalhe: "Seleção feita peça a peça, com atenção a estado e caimento.",
  },
  {
    codigo: "03",
    titulo: "Consumo consciente",
    detalhe: "Escolher usado é uma decisão de estilo e de impacto.",
  },
] as const;

export function ReuseHouseBrechoPage() {
  return (
    <div
      className="min-h-dvh bg-[var(--rh-paper)] text-[var(--rh-deep)]"
      style={
        {
          "--rh-paper": "oklch(0.96 0.015 130)",
          "--rh-deep": "oklch(0.24 0.03 165)",
          "--rh-moss": "oklch(0.55 0.13 150)",
          "--rh-line": "oklch(0.24 0.03 165 / 0.25)",
        } as React.CSSProperties
      }
    >
      <main className="mx-auto w-[min(92%,60rem)] pb-16 pt-10 md:pb-24 md:pt-16">
        {/* cabeçalho tipográfico: etiqueta antes de qualquer imagem */}
        <header className="border-y-2 border-[var(--rh-deep)] py-8 md:py-12">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.4em] text-[var(--rh-moss)]">
            REuse House · Jardim das Américas · Curitiba PR
          </p>
          <h1 className="mt-5 max-w-[20ch] font-display text-[2.1rem] font-extrabold uppercase leading-[0.98] tracking-tight md:text-[3.4rem]">
            <ManagedText
              field="heroHeadline"
              fallback={"Garimpo consciente no Jardim das Am\u00e9ricas."}
            />
          </h1>
          <p className="mt-5 max-w-[52ch] text-[var(--rh-deep)]/75 md:text-lg">
            <ManagedText
              field="heroSubheadline"
              fallback={
                "Presen\u00e7a digital de REuse House Brech\u00f3: presen\u00e7a digital para brech\u00f3 de moda sustent\u00e1vel no Jardim das Am\u00e9ricas."
              }
            />
          </p>
        </header>

        {/* índice tabular com linhas pontilhadas — leitura de ficha, não de cards */}
        <section className="pt-10 md:pt-14">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.4em] text-[var(--rh-deep)]/55">
            Índice do garimpo
          </p>
          <dl className="mt-5">
            {indice.map((item) => (
              <div
                key={item.codigo}
                className="grid grid-cols-[2.5rem_1fr] items-start gap-x-4 gap-y-1 border-b border-dotted border-[var(--rh-line)] py-5 md:grid-cols-[3rem_14rem_1fr]"
              >
                <span className="font-mono text-sm text-[var(--rh-moss)]">{item.codigo}</span>
                <dt className="font-display text-lg font-bold uppercase tracking-wide">
                  {item.titulo}
                </dt>
                <dd className="col-start-2 text-sm leading-relaxed text-[var(--rh-deep)]/70 md:col-start-3">
                  {item.detalhe}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* fotografia só depois do índice, como faixa larga de largura total */}
      <section>
        <PortfolioImage
          src="/images/reuse-house-brecho/capa.png"
          alt="REuse House Brechó"
          width={1536}
          height={1024}
          loading="lazy"
          className="h-56 w-full object-cover md:h-[22rem]"
          managedField="heroImageUrl"
        />
      </section>

      {/* etiqueta destacável de fechamento */}
      <section className="mx-auto w-[min(92%,60rem)] py-14 md:py-20">
        <div className="rounded-lg border-2 border-dashed border-[var(--rh-deep)] p-7 md:p-10">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.4em] text-[var(--rh-moss)]">
            Etiqueta
          </p>
          <h2 className="mt-4 max-w-[24ch] font-display text-2xl font-extrabold uppercase leading-tight md:text-3xl">
            Uma peça especial pode ganhar uma nova história.
          </h2>
          <p className="mt-3 max-w-[52ch] text-[var(--rh-deep)]/75">
            Conte o estilo e a peça que procura para receber as opções disponíveis.
          </p>
          <div className="mt-7">
            <FunnelCTAButton
              clientKey="reuse-house-brecho"
              companySlug="reuse-house-brecho"
              formSlug="funnel-reuse-house-brecho"
              location="reuse-house-brecho_fechamento"
              className="inline-flex items-center gap-2 rounded-none bg-[var(--rh-deep)] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[var(--rh-paper)]"
            >
              <ManagedText field="ctaLabel" fallback={"Consultar pe\u00e7as"} />
            </FunnelCTAButton>
          </div>
        </div>
      </section>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="reuse-house-brecho" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-reuse-house-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
