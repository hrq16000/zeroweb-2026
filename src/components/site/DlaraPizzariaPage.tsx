import { ManagedText } from "@/components/portfolio/ManagedText";
import { Pizza, Sandwich, CookingPot } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal } from "@/components/motion";

/**
 * Site exclusivo de D’Lara Pizzaria, Esfiharia e Hamburgueria (/portfolio/dlara-pizzaria).
 *
 * Direção autoral: forno à noite. Fundo carvão, hero centralizado com a
 * imagem em disco (referência à pizza) e três colunas verticais separadas por
 * fios de brasa — uma para cada frente da casa. Leitura simétrica e noturna.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const frentes = [
  {
    icon: Pizza,
    nome: "Pizzaria",
    texto: "Massa aberta na casa e assada no forno, do clássico ao mais pedido da noite.",
  },
  {
    icon: CookingPot,
    nome: "Esfiharia",
    texto: "Esfihas abertas e fechadas, para acompanhar a mesa ou dividir a rodada.",
  },
  {
    icon: Sandwich,
    nome: "Hamburgueria",
    texto: "Lanches montados na chapa quando a vontade é de algo rápido e reforçado.",
  },
] as const;

export function DlaraPizzariaPage() {
  return (
    <div
      className="min-h-dvh bg-[var(--dl-night)] text-[var(--dl-light)]"
      style={
        {
          "--dl-night": "oklch(0.19 0.02 40)",
          "--dl-light": "oklch(0.95 0.02 80)",
          "--dl-ember": "oklch(0.68 0.19 48)",
          "--dl-basil": "oklch(0.6 0.12 150)",
        } as React.CSSProperties
      }
    >
      <main>
        <section className="mx-auto flex max-w-4xl flex-col items-center px-5 pb-14 pt-14 text-center md:pt-20">
          <span className="rounded-full border border-[var(--dl-ember)]/50 px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--dl-ember)]">
            Jardim Itália · São José dos Pinhais
          </span>

          <div className="relative mt-9 w-full max-w-md">
            <div className="absolute inset-0 -z-0 rounded-full bg-[var(--dl-ember)]/20 blur-2xl" aria-hidden />
            <MotionImageReveal intensity="BALANCED" direction="up" className="rounded-full">
            <PortfolioImage
              src="/images/dlara-pizzaria/capa-og.jpg"
              alt="D’Lara Pizzaria, Esfiharia e Hamburgueria"
              priority
              width={1200}
              height={630}
              className="relative aspect-square w-full rounded-full border-[6px] border-[var(--dl-ember)]/70 object-cover"
              managedField="heroImageUrl"
            />
            </MotionImageReveal>
          </div>

          <MotionReveal as="h1" variant="scale" intensity="BALANCED" className="mt-10 font-display text-[2.1rem] font-black leading-[1.02] tracking-tight md:text-[3.6rem]">
            <ManagedText
              field="heroHeadline"
              fallback={"Pizzas, esfihas e lanches para pedir sem complica\u00e7\u00e3o."}
            />
          </MotionReveal>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-[var(--dl-light)]/70 md:text-lg">
            <ManagedText
              field="heroSubheadline"
              fallback={
                "Presen\u00e7a digital de D\u2019Lara: tr\u00eas cozinhas na mesma casa, reunidas em um caminho simples de pedido."
              }
            />
          </p>

          <FunnelCTAButton
            clientKey="dlara-pizzaria"
            companySlug="dlara-pizzaria"
            formSlug="funnel-dlara-pizzaria"
            location="dlara-pizzaria_hero"
            className="mt-9 inline-flex items-center rounded-full bg-[var(--dl-ember)] px-9 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[var(--dl-night)]"
          >
            <ManagedText field="ctaLabel" fallback={"Falar com a equipe"} />
          </FunnelCTAButton>
        </section>

        <section
          aria-labelledby="dl-frentes"
          className="border-y border-[var(--dl-ember)]/25 bg-[var(--dl-light)]/[0.03]"
        >
          <h2 id="dl-frentes" className="sr-only">
            As três cozinhas da casa
          </h2>
          <div className="mx-auto grid max-w-5xl divide-y divide-[var(--dl-ember)]/20 px-5 md:grid-cols-3 md:divide-x md:divide-y-0">
            {frentes.map(({ icon: Icon, nome, texto }, i) => (
              <MotionReveal key={nome} variant="up" intensity="BALANCED" delay={i * 120} className="group/frente px-0 py-9 text-center md:px-8">
                <Icon className="mx-auto h-7 w-7 text-[var(--dl-basil)] transition-transform duration-500 group-hover/frente:rotate-12" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-[0.2em]">{nome}</h3>
                <p className="mx-auto mt-3 max-w-[30ch] text-sm leading-relaxed text-[var(--dl-light)]/65">{texto}</p>
              </MotionReveal>
            ))}
          </div>
        </section>

        <aside id="escolha-rapida" className="mx-auto max-w-5xl px-5 pt-14">
          <div className="border-y border-[var(--dl-ember)]/25 py-7">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.32em] text-[var(--dl-ember)]">
              Escolha rápida
            </p>
            <p className="mt-4 max-w-4xl font-display text-2xl font-black leading-snug md:text-3xl">
              Pizza para compartilhar, esfiha para variar ou lanche para um pedido direto: comece pela frente principal e deixe sabores, tamanhos e valores para confirmação com a equipe.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--dl-light)]/65">
              Se o pedido envolver mais pessoas, informe uma quantidade aproximada e o bairro ou endereço em São José dos Pinhais para a casa confirmar a forma de atendimento.
            </p>
          </div>
        </aside>

        <section id="como-pedir" className="mx-auto max-w-5xl px-5 py-16">
          <div className="grid gap-10 md:grid-cols-[.42fr_.58fr]">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.32em] text-[var(--dl-ember)]">
                Pedido no Jardim Itália
              </p>
              <h2 className="mt-4 font-display text-3xl font-black leading-tight md:text-4xl">
                Comece pela cozinha que combina com a sua fome.
              </h2>
              <p className="mt-4 max-w-[46ch] text-sm leading-7 text-[var(--dl-light)]/70">
                A D’Lara reúne pizzaria, esfiharia e hamburgueria em São José dos Pinhais. Em vez de
                tentar decidir tudo antes de chamar, escolha a categoria principal e informe se o
                pedido é para você, para dividir ou para uma ocasião com mais pessoas.
              </p>
            </div>
            <ol className="divide-y divide-[var(--dl-ember)]/25 border-y border-[var(--dl-ember)]/25">
              {[
                ["01", "Pizza", "Boa referência para começar quando a ideia é compartilhar ou montar uma refeição em torno da mesa."],
                ["02", "Esfiha", "A página apresenta opções abertas e fechadas; a disponibilidade e os sabores são confirmados no atendimento."],
                ["03", "Lanche", "Para quem procura a frente de hamburgueria e quer organizar um pedido mais direto."],
                ["04", "Entrega", "Informe o bairro ou endereço em São José dos Pinhais para confirmar como o pedido pode ser atendido."],
              ].map(([n, title, text]) => (
                <li key={n} className="grid gap-3 py-5 sm:grid-cols-[3rem_8rem_1fr]">
                  <span className="font-mono text-xs font-bold text-[var(--dl-ember)]">{n}</span>
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-7 text-[var(--dl-light)]/65">{text}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside className="mt-10 border-l-2 border-[var(--dl-basil)] bg-[var(--dl-light)]/[0.03] p-6">
            <h3 className="font-display text-xl font-bold">O que ajuda na primeira mensagem</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--dl-light)]/65">
              Categoria desejada, quantidade aproximada de pessoas e forma de atendimento. Sabores,
              tamanhos, valores e disponibilidade ficam para confirmação direta com a equipe, sem a
              página transformar uma intenção em promessa de cardápio.
            </p>
          </aside>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h2 className="font-display text-2xl font-black leading-tight md:text-4xl">
            Seu próximo pedido merece um cardápio fácil de explorar.
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-sm leading-relaxed text-[var(--dl-light)]/70">
            Escolha pizza, esfiha ou lanche e indique a ocasião do pedido.
          </p>
          <FunnelCTAButton
            clientKey="dlara-pizzaria"
            companySlug="dlara-pizzaria"
            formSlug="funnel-dlara-pizzaria"
            location="dlara-pizzaria_fechamento"
            className="mt-8 inline-flex items-center rounded-full border border-[var(--dl-ember)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[var(--dl-ember)]"
          >
            Explorar opções
          </FunnelCTAButton>
        </section>
      </main>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="dlara-pizzaria" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-dlara-pizzaria" />
      <PortfolioHostCredit />
    </div>
  );
}
