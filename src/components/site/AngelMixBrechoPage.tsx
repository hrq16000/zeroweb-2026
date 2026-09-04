import { ManagedText } from "@/components/portfolio/ManagedText";
import { Sparkles, Heart, Shirt } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de Angel Mix Brechó (/portfolio/angel-mix-brecho).
 *
 * Direção autoral: editorial de moda — coluna lateral fixa com a marca,
 * hero assimétrico com imagem sangrando à direita e trilha de garimpo
 * numerada. Nada de grid genérico: a leitura é vertical, tipográfica e rosa.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const garimpo = [
  {
    step: "01",
    title: "Diga o seu estilo",
    text: "Romântico, básico, colorido ou clássico: o ponto de partida é o seu gosto.",
  },
  {
    step: "02",
    title: "Combine tamanho e caimento",
    text: "Peça a peça, a numeração e o caimento são conferidos antes de mostrar.",
  },
  {
    step: "03",
    title: "Veja o que chegou",
    text: "As novidades do garimpo chegam em pequenas levas e são únicas.",
  },
] as const;

export function AngelMixBrechoPage() {
  return (
    <div
      className="min-h-dvh bg-[var(--am-cream)] text-[var(--am-ink)]"
      style={
        {
          "--am-cream": "oklch(0.97 0.02 350)",
          "--am-ink": "oklch(0.24 0.05 340)",
          "--am-rose": "oklch(0.68 0.18 350)",
          "--am-blush": "oklch(0.89 0.07 350)",
        } as React.CSSProperties
      }
    >
      <main className="mx-auto flex max-w-6xl flex-col gap-0 md:flex-row">
        {/* trilho lateral tipográfico — assinatura visual do projeto */}
        <aside className="shrink-0 px-6 pt-10 md:sticky md:top-0 md:h-dvh md:w-56 md:px-8 md:py-16">
          <p className="font-display text-2xl font-black leading-none tracking-tight text-[var(--am-rose)] md:text-3xl">
            Angel
            <br className="hidden md:block" /> Mix
          </p>
          <p className="mt-3 text-[0.7rem] uppercase tracking-[0.35em] text-[var(--am-ink)]/60">
            Brechó · Novo Mundo
          </p>
          <div className="mt-6 hidden h-px w-16 bg-[var(--am-rose)] md:block" />
          <p className="mt-6 hidden max-w-[18ch] text-sm leading-relaxed text-[var(--am-ink)]/70 md:block">
            Moda de segunda mão escolhida peça a peça.
          </p>
        </aside>

        <div className="min-w-0 flex-1">
          <section className="px-6 pb-10 pt-8 md:py-16 md:pl-10 md:pr-0">
            <h1 className="font-display text-[2.4rem] font-black leading-[0.95] tracking-tight md:text-[4.2rem]">
              <ManagedText field="heroHeadline" fallback={"Garimpo de moda no Novo Mundo."} />
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--am-ink)]/75">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Presen\u00e7a digital de Angel Mix Brech\u00f3: vitrine para moda circular no Novo Mundo."
                }
              />
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <FunnelCTAButton
                clientKey="angel-mix-brecho"
                companySlug="angel-mix-brecho"
                formSlug="funnel-angel-mix-brecho"
                location="angel-mix-brecho_hero"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--am-rose)] px-7 py-3 text-sm font-semibold text-[var(--am-cream)]"
              >
                <ManagedText field="ctaLabel" fallback={"Falar sobre uma pe\u00e7a"} />
              </FunnelCTAButton>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--am-rose)]/40 px-4 py-2 text-xs uppercase tracking-widest text-[var(--am-ink)]/70">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Peças únicas
              </span>
            </div>
          </section>

          {/* imagem sangrando à direita: quebra a simetria da página */}
          <section className="md:pl-10">
            <PortfolioImage
              src="/images/angel-mix-brecho/capa.png"
              alt="Angel Mix Brechó"
              priority
              width={1200}
              height={800}
              className="h-[46vh] w-full object-cover md:h-[60vh] md:rounded-l-[3rem]"
              managedField="heroImageUrl"
            />
          </section>

          <section className="px-6 py-14 md:py-20 md:pl-10 md:pr-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--am-rose)]">
              Como funciona o garimpo
            </p>
            <ol className="mt-8 space-y-8">
              {garimpo.map((item) => (
                <li key={item.step} className="flex gap-5 border-t border-[var(--am-blush)] pt-6">
                  <span className="font-display text-3xl font-black text-[var(--am-blush)]">
                    {item.step}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold">{item.title}</h2>
                    <p className="mt-2 max-w-[52ch] text-[var(--am-ink)]/75">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="px-6 pb-20 md:pl-10 md:pr-6">
            <div className="inline-flex items-center gap-2 rounded-[2rem] bg-[var(--am-blush)]/60 p-8 md:p-12">
              <div className="flex items-center gap-3 text-[var(--am-rose)]">
                <Heart className="h-5 w-5" aria-hidden />
                <Shirt className="h-5 w-5" aria-hidden />
              </div>
              <p className="mt-5 max-w-[40ch] font-display text-2xl font-bold leading-snug md:text-3xl">
                Moda acessível começa com um garimpo que combina com você.
              </p>
              <p className="mt-3 max-w-[52ch] text-[var(--am-ink)]/75">
                Indique seu estilo, seu tamanho e o tipo de peça que procura.
              </p>
              <div className="mt-7">
                <FunnelCTAButton
                  clientKey="angel-mix-brecho"
                  companySlug="angel-mix-brecho"
                  formSlug="funnel-angel-mix-brecho"
                  location="angel-mix-brecho_fechamento"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--am-ink)] px-7 py-3 text-sm font-semibold text-[var(--am-cream)]"
                >
                  Falar sobre uma peça
                </FunnelCTAButton>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PortfolioUpsellPopup pageName="portfolio-angel-mix-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
