import { ManagedText } from "@/components/portfolio/ManagedText";
import { MotionImageReveal, MotionReveal, MotionScope } from "@/components/motion";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de Woodhouse Hambúrgueres (/portfolio/woodhouse-hamburgueres).
 *
 * Direção autoral (Rodada 4 · CLUSTER_02): comanda da casa. Cabeçalho escuro
 * com o pedido aberto, coluna esquerda em formato de comanda (linhas com
 * traço e ponto) e a foto fixa numa faixa vertical à direita. O convite fica
 * no rodapé da comanda, sem hero sangrado e sem faixa final separada.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const comanda = [
  {
    linha: "Na chapa",
    titulo: "Hambúrgueres grelhados",
    texto: "Carne selada no ponto da casa, montada na hora do pedido.",
  },
  {
    linha: "Para dividir",
    titulo: "Petiscos da noite",
    texto: "Porções pensadas para acompanhar a mesa e alongar a conversa.",
  },
  {
    linha: "Combinado",
    titulo: "Combos e retirada",
    texto: "Pedido no local ou entrega combinada diretamente com a casa.",
  },
] as const;

export function WoodhouseHamburgueresPage() {
  return (
    <MotionScope intensity="EXPRESSIVE">
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
      <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-12">
          {/* comanda: assinatura do projeto */}
          <section className="min-w-0 rounded-lg border border-[var(--wh-amber)]/35 bg-[var(--wh-wood)]/20 p-6 md:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-dashed border-[var(--wh-amber)]/40 pb-4">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.4em] text-[var(--wh-amber)]">
                Comanda aberta
              </p>
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-[var(--wh-bone)]/55">
                Woodhouse · São José dos Pinhais
              </p>
            </div>

            <MotionReveal as="h1" variant="right" className="mt-6 max-w-[16ch] font-display text-[2.1rem] font-black uppercase leading-[0.98] tracking-tight md:text-[3.6rem]">
              <ManagedText
                field="heroHeadline"
                fallback={"Hamb\u00fargueres grelhados e petiscos para a noite."}
              />
            </MotionReveal>

            <ul className="mt-9 space-y-0 divide-y divide-dashed divide-[var(--wh-amber)]/25">
              {comanda.map((item, index) => (
                <MotionReveal
                  as="li"
                  key={item.titulo}
                  variant="right"
                  delay={index * 90}
                  className="group flex gap-4 py-5"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--wh-amber)] transition-transform duration-300 group-hover:scale-150"
                  />
                  <div className="min-w-0">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.32em] text-[var(--wh-amber)]">
                      {item.linha}
                    </p>
                    <h2 className="mt-2 font-display text-lg font-bold uppercase leading-tight md:text-xl">
                      {item.titulo}
                    </h2>
                    <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-[var(--wh-bone)]/65">
                      {item.texto}
                    </p>
                  </div>
                </MotionReveal>
              ))}
            </ul>

            <div className="mt-8 border-t border-dashed border-[var(--wh-amber)]/40 pt-7">
              <p className="max-w-[54ch] text-base leading-relaxed text-[var(--wh-bone)]/75">
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
                className="mt-6 inline-flex items-center rounded-md bg-[var(--wh-amber)] px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-[var(--wh-dark)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97]"
              >
                <ManagedText field="ctaLabel" fallback={"Falar com a equipe"} />
              </FunnelCTAButton>
              <p className="mt-4 max-w-[50ch] text-xs leading-relaxed text-[var(--wh-bone)]/55">
                Conte se procura hambúrguer, petisco ou uma experiência para
                compartilhar.
              </p>
            </div>
          </section>

          {/* faixa vertical fotográfica */}
          <aside className="min-w-0 md:sticky md:top-10 md:self-start">
            <MotionImageReveal direction="up" className="rounded-lg">
            <PortfolioImage
              src="/images/woodhouse-hamburgueres/capa.png"
              alt="Woodhouse Hambúrgueres"
              priority
              width={1000}
              height={1400}
              className="h-[48vh] w-full rounded-lg object-cover md:h-[70vh]"
              managedField="heroImageUrl"
            />
            </MotionImageReveal>
            <p className="mt-4 text-[0.62rem] uppercase tracking-[0.36em] text-[var(--wh-bone)]/50">
              Grelhados · Petiscos · Combos · Retirada
            </p>
          </aside>
        </div>

        <section className="mt-12 rounded-lg border border-[var(--wh-amber)]/30 bg-[var(--wh-wood)]/15 p-6 md:p-9" aria-labelledby="woodhouse-pedido-title">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.4em] text-[var(--wh-amber)]">Antes de fechar a comanda</p>
          <h2 id="woodhouse-pedido-title" className="mt-4 max-w-3xl font-display text-2xl font-black uppercase leading-tight md:text-3xl">
            O pedido fica mais claro quando você já sabe o que quer compartilhar.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--wh-bone)]/70">
            A página apresenta três caminhos já descritos pela casa: hambúrgueres grelhados, petiscos e combos. O contato serve para confirmar o pedido,
            combinar retirada ou entrega e alinhar os detalhes antes de finalizar.
          </p>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <article className="border-t border-[var(--wh-amber)]/35 pt-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.32em] text-[var(--wh-amber)]">01 · principal</p>
              <h3 className="mt-3 font-display text-lg font-bold uppercase">Hambúrguer</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--wh-bone)]/65">
                Informe que procura um hambúrguer da casa para o atendimento direcionar a conversa ao pedido principal.
              </p>
            </article>
            <article className="border-t border-[var(--wh-amber)]/35 pt-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.32em] text-[var(--wh-amber)]">02 · mesa</p>
              <h3 className="mt-3 font-display text-lg font-bold uppercase">Petiscos</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--wh-bone)]/65">
                Se a ideia é compartilhar, indique que procura petiscos ou porções para a equipe confirmar o que está disponível.
              </p>
            </article>
            <article className="border-t border-[var(--wh-amber)]/35 pt-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.32em] text-[var(--wh-amber)]">03 · retirada</p>
              <h3 className="mt-3 font-display text-lg font-bold uppercase">Combinar o pedido</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--wh-bone)]/65">
                Retirada ou entrega são combinadas diretamente com a casa. A página não presume disponibilidade, prazo ou condição fixa.
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="woodhouse-hamburgueres" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-woodhouse-hamburgueres" />
      <PortfolioHostCredit />
    </div>
    </MotionScope>
  );
}
