import { ManagedText } from "@/components/portfolio/ManagedText";
import { Clock3, MapPin, Flame } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal, MotionScope, MotionStagger } from "@/components/motion";

/**
 * Site exclusivo de Beto Pastéis (/portfolio/beto-pasteis).
 *
 * Direção autoral: quadro de balcão de bairro. Tipografia enorme em faixa
 * horizontal, imagem pequena em cartão recortado e vitrine em linhas com fio
 * pontilhado, como um quadro de parede escrito à mão. Nada de grid de cards.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const vitrine = [
  ["Pastel de carne", "recheio temperado na casa, massa fina e crocante"],
  ["Pastel de queijo", "queijo puxando, frito na hora do pedido"],
  ["Pastel de frango com catupiry", "clássico do balcão, sempre pedido"],
  ["Pastel doce", "para fechar a parada com açúcar e canela"],
] as const;

export function BetoPasteisPage() {
  return (
    <MotionScope intensity="EXPRESSIVE">
    <div
      className="min-h-dvh bg-[var(--bp-paper)] text-[var(--bp-ink)]"
      style={
        {
          "--bp-paper": "oklch(0.96 0.03 88)",
          "--bp-ink": "oklch(0.24 0.04 60)",
          "--bp-tomato": "oklch(0.55 0.19 30)",
          "--bp-gold": "oklch(0.78 0.15 78)",
        } as React.CSSProperties
      }
    >
      {/* faixa de balcão — assinatura do projeto */}
      <div className="w-full bg-[var(--bp-tomato)] py-2">
        <p className="mx-auto max-w-6xl px-5 text-[0.7rem] font-bold uppercase tracking-[0.4em] text-[var(--bp-paper)]">
          Beto Pastéis · Jardim Itália · São José dos Pinhais
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-5 pb-16">
        <header className="border-b-4 border-dashed border-[var(--bp-ink)]/25 py-10 md:py-14">
          <MotionReveal as="h1" variant="mask" className="font-display text-[2.6rem] font-black uppercase leading-[0.88] tracking-tight md:text-[5.5rem]">
            <ManagedText
              field="heroHeadline"
              fallback={"O pastel que combina com a pausa, o almo\u00e7o e a vontade do bairro."}
            />
          </MotionReveal>
        </header>

        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:gap-14">
          <figure className="md:w-[38%] md:shrink-0">
            <MotionImageReveal direction="left" className="rounded-sm">
            <PortfolioImage
              src="/images/beto-pasteis/capa.png"
              alt="Beto Pastéis"
              priority
              width={1200}
              height={800}
              className="w-full rotate-[-1.5deg] rounded-sm border-8 border-[var(--bp-paper)] object-cover shadow-[0_10px_0_rgba(0,0,0,0.08)]"
              managedField="heroImageUrl"
            />
            </MotionImageReveal>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--bp-ink)]/55">
              Massa fina, fritura na hora
            </figcaption>
          </figure>

          <div className="min-w-0 flex-1">
            <p className="max-w-[52ch] text-lg leading-relaxed text-[var(--bp-ink)]/80">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Presen\u00e7a digital para reunir sabores, hor\u00e1rios e pedido em uma experi\u00eancia simples."
                }
              />
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y-2 border-[var(--bp-ink)]/15 py-6">
              <div>
                <dt className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--bp-tomato)]">
                  <Flame className="h-3.5 w-3.5" aria-hidden /> Feito na hora
                </dt>
                <dd className="mt-1 text-sm text-[var(--bp-ink)]/75">Cada pastel vai à fritura depois do pedido.</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--bp-tomato)]">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden /> Ritmo de balcão
                </dt>
                <dd className="mt-1 text-sm text-[var(--bp-ink)]/75">Pensado para a pausa curta do dia.</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--bp-tomato)]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden /> Do bairro
                </dt>
                <dd className="mt-1 text-sm text-[var(--bp-ink)]/75">Freguesia que volta pelo mesmo sabor.</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--bp-tomato)]">
                  Encomenda
                </dt>
                <dd className="mt-1 text-sm text-[var(--bp-ink)]/75">Combine quantidade e horário com a casa.</dd>
              </div>
            </dl>

            <div className="mt-8">
              <FunnelCTAButton
                clientKey="beto-pasteis"
                companySlug="beto-pasteis"
                formSlug="funnel-beto-pasteis"
                location="beto-pasteis_hero"
                className="inline-flex items-center rounded-none bg-[var(--bp-tomato)] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[var(--bp-paper)]"
              >
                <ManagedText field="ctaLabel" fallback={"Falar com a equipe"} />
              </FunnelCTAButton>
            </div>
          </div>
        </div>

        <section aria-labelledby="bp-vitrine" className="pb-12 pt-4">
          <h2
            id="bp-vitrine"
            className="font-display text-xs font-black uppercase tracking-[0.45em] text-[var(--bp-ink)]/50"
          >
            No balcão
          </h2>
          <MotionStagger as="ul" variant="left" className="mt-6">
            {vitrine.map(([nome, nota]) => (
              <li
                key={nome}
                className="flex flex-col gap-1 border-b border-dotted border-[var(--bp-ink)]/30 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="font-display text-xl font-bold md:text-2xl">{nome}</span>
                <span className="text-sm text-[var(--bp-ink)]/65 sm:max-w-[34ch] sm:text-right">{nota}</span>
              </li>
            ))}
          </MotionStagger>
        </section>

        <MotionReveal as="section" variant="scale" className="rounded-none border-4 border-[var(--bp-ink)] bg-[var(--bp-gold)]/25 p-7 md:p-10">
          <h2 className="font-display text-2xl font-black uppercase leading-tight md:text-3xl">
            Um pastel bem escolhido muda o ritmo do dia.
          </h2>
          <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-[var(--bp-ink)]/80">
            Escolha a ocasião e conte o que gostaria de encontrar no menu.
          </p>
          <div className="mt-6">
            <FunnelCTAButton
              clientKey="beto-pasteis"
              companySlug="beto-pasteis"
              formSlug="funnel-beto-pasteis"
              location="beto-pasteis_fechamento"
              className="inline-flex items-center rounded-none border-2 border-[var(--bp-ink)] bg-[var(--bp-paper)] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-[var(--bp-ink)]"
            >
              Conhecer sabores
            </FunnelCTAButton>
          </div>
        </MotionReveal>
      </main>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="beto-pasteis" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-beto-pasteis" />
      <PortfolioHostCredit />
    </div>
    </MotionScope>
  );
}
