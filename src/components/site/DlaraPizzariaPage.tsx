import { ManagedText } from "@/components/portfolio/ManagedText";
import { Pizza, Sandwich, CookingPot } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionFirstPaint, MotionReveal } from "@/components/motion";

/**
 * Site exclusivo de D’Lara Pizzaria, Esfiharia e Hamburgueria (/portfolio/dlara-pizzaria).
 *
 * Direção autoral: forno à noite. Fundo carvão, hero centralizado com a
 * imagem em disco (referência à pizza) e três colunas verticais separadas por
 * fios de brasa — uma para cada frente da casa. Leitura editorial e noturna.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const frentes = [
  {
    icon: Pizza,
    nome: "Pizzaria",
    escolha: "Pizza",
    texto: "Massa aberta na casa e assada no forno, do clássico ao mais pedido da noite.",
  },
  {
    icon: CookingPot,
    nome: "Esfiharia",
    escolha: "Esfiha",
    texto: "Esfihas abertas e fechadas, para acompanhar a mesa ou dividir a rodada.",
  },
  {
    icon: Sandwich,
    nome: "Hamburgueria",
    escolha: "Lanche",
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
        <MotionFirstPaint>
          <section className="mx-auto grid max-w-6xl items-center gap-9 px-5 pb-14 pt-10 md:grid-cols-[1.08fr_.92fr] md:gap-12 md:py-20">
            <div className="min-w-0">
              <span className="inline-block border-l-2 border-[var(--dl-ember)] pl-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--dl-ember)]">
                Jardim Itália · São José dos Pinhais
              </span>
              <h1 className="mt-7 max-w-[15ch] font-display text-[clamp(2.5rem,5.6vw,5.4rem)] font-black leading-[.98] tracking-[-.05em]">
                <ManagedText field="heroHeadline" fallback={"Pizzas, esfihas e lanches para pedir sem complicação."} />
              </h1>
              <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[var(--dl-light)]/80 md:text-lg">
                <ManagedText field="heroSubheadline" fallback={"Presença digital de D’Lara: três cozinhas na mesma casa, reunidas em um caminho simples de pedido."} />
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <FunnelCTAButton clientKey="dlara-pizzaria" companySlug="dlara-pizzaria" formSlug="funnel-dlara-pizzaria" location="dlara-pizzaria_hero"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--dl-ember)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[var(--dl-night)] motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dl-light)]">
                  <ManagedText field="ctaLabel" fallback={"Falar com a equipe"} />
                </FunnelCTAButton>
                <a href="#dl-frentes" className="inline-flex min-h-12 items-center text-sm font-bold text-[var(--dl-light)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Escolher cozinha</a>
              </div>
            </div>
            <figure className="relative mx-auto w-full max-w-[420px] md:max-w-none">
              <div className="pointer-events-none absolute inset-4 rounded-full bg-[var(--dl-ember)]/15 blur-3xl" aria-hidden="true" />
              <div className="relative rounded-full border border-[var(--dl-ember)]/30 p-3 sm:p-5">
                <PortfolioImage src="/images/dlara-pizzaria/capa-og.jpg" alt="D’Lara Pizzaria, Esfiharia e Hamburgueria" priority width={1200} height={630}
                  sizes="(min-width: 768px) 48vw, 90vw" className="relative aspect-square w-full rounded-full border-2 border-[var(--dl-ember)]/70 object-cover" managedField="heroImageUrl" />
              </div>
              <figcaption className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--dl-light)]/75"><span className="h-px w-9 bg-[var(--dl-ember)]" aria-hidden="true" /> Três cozinhas · uma casa <span className="h-px w-9 bg-[var(--dl-ember)]" aria-hidden="true" /></figcaption>
            </figure>
          </section>
        </MotionFirstPaint>

        <section
          aria-labelledby="dl-frentes"
          className="border-y border-[var(--dl-ember)]/25 bg-[var(--dl-light)]/[0.03]"
        >
          <h2 id="dl-frentes" className="sr-only">
            As três cozinhas da casa
          </h2>
          <div className="mx-auto grid max-w-5xl divide-y divide-[var(--dl-ember)]/20 px-5 md:grid-cols-3 md:divide-x md:divide-y-0">
            {frentes.map(({ icon: Icon, nome, texto, escolha }, i) => (
              <MotionReveal key={nome} variant="up" intensity="BALANCED" delay={i * 120} className="group/frente px-0 py-8 text-left md:px-7">
                <div className="flex items-center justify-between"><span className="font-mono text-xs tracking-widest text-[var(--dl-ember)]">0{i + 1}</span><Icon className="h-7 w-7 text-[var(--dl-ember)]" aria-hidden /></div>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-[0.2em]">{nome}</h3>
                <p className="mt-3 max-w-[35ch] text-sm leading-relaxed text-[var(--dl-light)]/75">{texto}</p>
                <FunnelCTAButton clientKey="dlara-pizzaria" companySlug="dlara-pizzaria" formSlug="funnel-dlara-pizzaria" location={`dlara-pizzaria_cozinha-${i+1}`}
                  context={{ categoria: escolha }} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--dl-ember)] hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Consultar {escolha.toLowerCase()}</FunnelCTAButton>
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
