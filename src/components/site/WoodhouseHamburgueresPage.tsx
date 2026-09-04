import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de Woodhouse Hambúrgueres (/portfolio/woodhouse-hamburgueres).
 *
 * Direção autoral: casa noturna urbana. Hero de imagem sangrada com camada
 * escura e título sobreposto no rodapé da imagem, faixa de repetição em
 * marquise estática e blocos desalinhados em escada. Leitura de baixo relevo.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const blocos = [
  {
    tag: "Na chapa",
    titulo: "Hambúrgueres grelhados",
    texto: "Carne selada no ponto da casa, montada na hora do pedido.",
    offset: "md:mt-0",
  },
  {
    tag: "Para dividir",
    titulo: "Petiscos da noite",
    texto: "Porções pensadas para acompanhar a mesa e alongar a conversa.",
    offset: "md:mt-14",
  },
  {
    tag: "Combinado",
    titulo: "Combos e retirada",
    texto: "Pedido no local ou entrega combinada diretamente com a casa.",
    offset: "md:mt-7",
  },
] as const;

export function WoodhouseHamburgueresPage() {
  return (
    <div
      className="min-h-dvh bg-[var(--wh-dark)] text-[var(--wh-bone)]"
      style={
        {
          "--wh-dark": "oklch(0.17 0.015 60)",
          "--wh-bone": "oklch(0.93 0.02 85)",
          "--wh-amber": "oklch(0.74 0.16 68)",
          "--wh-wood": "oklch(0.38 0.06 55)",
        } as React.CSSProperties
      }
    >
      <main>
        <section className="relative">
          <PortfolioImage
            src="/images/woodhouse-hamburgueres/capa.png"
            alt="Woodhouse Hambúrgueres"
            priority
            width={1600}
            height={900}
            className="h-[58vh] min-h-[340px] w-full object-cover md:h-[72vh]"
            managedField="heroImageUrl"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--wh-dark)] via-[var(--wh-dark)]/70 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-8 md:pb-12">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.42em] text-[var(--wh-amber)]">
              Woodhouse · São José dos Pinhais
            </p>
            <h1 className="mt-3 max-w-[18ch] font-display text-[2.3rem] font-black uppercase leading-[0.95] tracking-tight md:text-[4.4rem]">
              <ManagedText
                field="heroHeadline"
                fallback={"Hamb\u00fargueres grelhados e petiscos para a noite."}
              />
            </h1>
          </div>
        </section>

        <div className="overflow-hidden border-y border-[var(--wh-amber)]/25 bg-[var(--wh-wood)]/25 py-3">
          <p className="mx-auto max-w-6xl truncate px-5 text-[0.68rem] uppercase tracking-[0.4em] text-[var(--wh-bone)]/60">
            Grelhados · Petiscos · Combos · Retirada · Entrega combinada · Grelhados · Petiscos
          </p>
        </div>

        <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <p className="max-w-[54ch] text-lg leading-relaxed text-[var(--wh-bone)]/75">
            <ManagedText
              field="heroSubheadline"
              fallback={
                "Presen\u00e7a digital da Woodhouse: card\u00e1pio, petiscos e o caminho direto para combinar o pedido."
              }
            />
          </p>
          <FunnelCTAButton
            clientKey="woodhouse-hamburgueres"
            companySlug="woodhouse-hamburgueres"
            formSlug="funnel-woodhouse-hamburgueres"
            location="woodhouse-hamburgueres_hero"
            className="mt-8 inline-flex items-center rounded-md bg-[var(--wh-amber)] px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-[var(--wh-dark)]"
          >
            <ManagedText field="ctaLabel" fallback={"Falar com a equipe"} />
          </FunnelCTAButton>

          <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-start">
            {blocos.map((b) => (
              <article
                key={b.titulo}
                className={`border-l-2 border-[var(--wh-amber)]/60 pl-5 ${b.offset}`}
              >
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.32em] text-[var(--wh-amber)]">{b.tag}</p>
                <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">{b.titulo}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--wh-bone)]/65">{b.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--wh-amber)]/20 bg-[var(--wh-wood)]/20">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h2 className="max-w-[20ch] font-display text-2xl font-black uppercase leading-tight md:text-4xl">
                Uma noite especial começa no primeiro pedido.
              </h2>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-[var(--wh-bone)]/70">
                Conte se procura hambúrguer, petisco ou uma experiência para compartilhar.
              </p>
            </div>
            <FunnelCTAButton
              clientKey="woodhouse-hamburgueres"
              companySlug="woodhouse-hamburgueres"
              formSlug="funnel-woodhouse-hamburgueres"
              location="woodhouse-hamburgueres_fechamento"
              className="inline-flex shrink-0 items-center rounded-md border border-[var(--wh-amber)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-[var(--wh-amber)]"
            >
              Fazer meu pedido
            </FunnelCTAButton>
          </div>
        </section>
      </main>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="woodhouse-hamburgueres" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-woodhouse-hamburgueres" />
      <PortfolioHostCredit />
    </div>
  );
}
