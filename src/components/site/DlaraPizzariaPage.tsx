import { ManagedText } from "@/components/portfolio/ManagedText";
import { Pizza, Sandwich, CookingPot } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

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
            <PortfolioImage
              src="/images/dlara-pizzaria/capa.png"
              alt="D’Lara Pizzaria, Esfiharia e Hamburgueria"
              priority
              width={1200}
              height={800}
              className="relative aspect-square w-full rounded-full border-[6px] border-[var(--dl-ember)]/70 object-cover"
              managedField="heroImageUrl"
            />
          </div>

          <h1 className="mt-10 font-display text-[2.1rem] font-black leading-[1.02] tracking-tight md:text-[3.6rem]">
            <ManagedText
              field="heroHeadline"
              fallback={"Pizzas, esfihas e lanches para pedir sem complica\u00e7\u00e3o."}
            />
          </h1>
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
            {frentes.map(({ icon: Icon, nome, texto }) => (
              <div key={nome} className="px-0 py-9 text-center md:px-8">
                <Icon className="mx-auto h-7 w-7 text-[var(--dl-basil)]" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-[0.2em]">{nome}</h3>
                <p className="mx-auto mt-3 max-w-[30ch] text-sm leading-relaxed text-[var(--dl-light)]/65">{texto}</p>
              </div>
            ))}
          </div>
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
