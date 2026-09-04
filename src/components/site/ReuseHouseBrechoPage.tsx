import { ManagedText } from "@/components/portfolio/ManagedText";
import { Recycle, Tag, Leaf, ArrowDownRight } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de REuse House Brechó (/portfolio/reuse-house-brecho).
 *
 * Direção autoral: bento sustentável — mosaico de blocos de tamanhos
 * diferentes sobre fundo escuro esverdeado, com selo circular e tipografia
 * em caixa alta condensada. Nenhuma seção empilhada convencional.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const blocos = [
  {
    icon: Recycle,
    title: "Moda circular",
    text: "Peças que continuam em uso em vez de virar descarte.",
  },
  {
    icon: Tag,
    title: "Garimpo curado",
    text: "Seleção feita peça a peça, com atenção a estado e caimento.",
  },
  {
    icon: Leaf,
    title: "Consumo consciente",
    text: "Escolher usado é uma decisão de estilo e de impacto.",
  },
] as const;

export function ReuseHouseBrechoPage() {
  return (
    <div
      className="min-h-dvh bg-[var(--rh-deep)] text-[var(--rh-light)]"
      style={
        {
          "--rh-deep": "oklch(0.24 0.03 165)",
          "--rh-light": "oklch(0.95 0.02 130)",
          "--rh-moss": "oklch(0.72 0.14 145)",
          "--rh-stone": "oklch(0.34 0.02 165)",
        } as React.CSSProperties
      }
    >
      <main className="mx-auto w-[min(94%,72rem)] py-10 md:py-16">
        {/* mosaico bento: hero e blocos compartilham a mesma malha */}
        <div className="grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto_auto]">
          <section className="rounded-3xl bg-[var(--rh-stone)] p-7 md:col-span-4 md:row-span-2 md:p-12">
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[var(--rh-moss)]">
              REuse House · Jardim das Américas
            </p>
            <h1 className="mt-5 font-display text-[2.2rem] font-extrabold uppercase leading-[0.95] tracking-tight md:text-[3.6rem]">
              <ManagedText
                field="heroHeadline"
                fallback={"Garimpo consciente no Jardim das Am\u00e9ricas."}
              />
            </h1>
            <p className="mt-5 max-w-[48ch] text-[var(--rh-light)]/75 md:text-lg">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Presen\u00e7a digital de REuse House Brech\u00f3: presen\u00e7a digital para brech\u00f3 de moda sustent\u00e1vel no Jardim das Am\u00e9ricas."
                }
              />
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <FunnelCTAButton
                clientKey="reuse-house-brecho"
                companySlug="reuse-house-brecho"
                formSlug="funnel-reuse-house-brecho"
                location="reuse-house-brecho_hero"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--rh-moss)] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[var(--rh-deep)]"
              >
                <ManagedText field="ctaLabel" fallback={"Consultar pe\u00e7as"} />
              </FunnelCTAButton>
              <ArrowDownRight className="h-6 w-6 text-[var(--rh-moss)]" aria-hidden />
            </div>
          </section>

          <div className="relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-2">
            <PortfolioImage
              src="/images/reuse-house-brecho/capa.png"
              alt="REuse House Brechó"
              priority
              width={900}
              height={1200}
              className="h-64 w-full object-cover md:h-full"
              managedField="heroImageUrl"
            />
            <span className="absolute bottom-4 left-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--rh-deep)]/90 text-center text-[0.6rem] font-bold uppercase leading-tight tracking-widest text-[var(--rh-moss)]">
              Peças
              <br />
              únicas
            </span>
          </div>

          {blocos.map((b) => (
            <section
              key={b.title}
              className="rounded-3xl border border-[var(--rh-light)]/12 p-6 md:col-span-2"
            >
              <b.icon className="h-6 w-6 text-[var(--rh-moss)]" aria-hidden />
              <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">
                {b.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--rh-light)]/70">{b.text}</p>
            </section>
          ))}

          <section className="rounded-3xl bg-[var(--rh-moss)] p-7 text-[var(--rh-deep)] md:col-span-6 md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="max-w-[22ch] font-display text-2xl font-extrabold uppercase leading-tight md:text-4xl">
                  Uma peça especial pode ganhar uma nova história.
                </h2>
                <p className="mt-3 max-w-[48ch] text-[var(--rh-deep)]/80">
                  Conte o estilo e a peça que procura para receber as opções
                  disponíveis.
                </p>
              </div>
              <FunnelCTAButton
                clientKey="reuse-house-brecho"
                companySlug="reuse-house-brecho"
                formSlug="funnel-reuse-house-brecho"
                location="reuse-house-brecho_fechamento"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--rh-deep)] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[var(--rh-light)]"
              >
                Consultar peças
              </FunnelCTAButton>
            </div>
          </section>
        </div>
      </main>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="reuse-house-brecho" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-reuse-house-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
