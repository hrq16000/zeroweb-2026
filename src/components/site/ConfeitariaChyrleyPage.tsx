import { ManagedText } from "@/components/portfolio/ManagedText";
import {
  ArrowRight,
  CakeSlice,
  Check,
  CreditCard,
  MapPin,
  PackageCheck,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

const offers = [
  ["01", "Bolos personalizados", "Temas infantis, aniversários e celebrações com acabamento artesanal."],
  ["02", "Kit festa", "Combinações para 6 a 100 pessoas, com bolo, doces e salgados na medida."],
  ["03", "Salgados em bandeja", "Pequenas quantidades para reunir a família ou completar seu evento."],
  ["04", "Copo da Felicidade", "Uma opção doce para presentear ou completar a comemoração."],
] as const;

const quiz = {
  services: [
    "Bolo personalizado",
    "Kit festa",
    "Salgados",
    "Copo da Felicidade",
    "Quero montar uma festa",
  ],
  experienceOptions: ["Aniversário", "Festa em casa", "Presente", "Evento ou confraternização"],
  periodOptions: ["Retirar no Rio Bonito", "Enviar por Uber", "Ainda preciso combinar"],
  timingOptions: ["Para esta semana", "Para a próxima semana", "Estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você quer encomendar?",
    experience: "Qual é a ocasião?",
    period: "Como prefere receber?",
    timing: "Para quando precisa?",
    note: "Conte os detalhes da sua festa",
  },
  notePlaceholder:
    "Ex.: bolo para 20 pessoas, tema Jurassic Park, salgados assados e endereço para Uber.",
};

function CTA({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="confeitaria-chyrley"
      studioName="Chyrley Doces & Festas"
      recipientName="Chyrley"
      theme="pink"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function ConfeitariaChyrleyPage() {
  return (
    <div className="min-h-dvh overflow-hidden bg-[#fff7ef] text-[#361d1c]">
      <header className="border-b-2 border-[#361d1c] bg-[#fff7ef] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#balcao" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#7d2f35] text-[#ffd9e1]">
              <CakeSlice className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-black">Chyrley Doces & Festas</p>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b95768]">
                Rio Bonito
              </p>
            </div>
          </a>

          <CTA className="inline-flex min-h-10 items-center gap-2 bg-[#7d2f35] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#a94355]">
            Montar encomenda
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="balcao" className="px-5 py-7 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">
            <figure className="relative m-0 min-h-[680px] overflow-hidden bg-[#5d2328]">
              <PortfolioImage
                src="/images/confeitaria-chyrley/capa.webp"
                alt="Bolos e salgados artesanais da Chyrley Doces & Festas"
                priority
                width={1200}
                height={1600}
                managedField="heroImageUrl"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d1415]/95 via-[#2d1415]/30 to-transparent" />

              <div className="relative flex min-h-[680px] flex-col justify-between p-7 text-white sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="bg-[#ffd3df] px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-[#5d2328]">
                    bolos · doces · salgados
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[.16em] text-white/70">
                    encomendas em Rio Bonito
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#ffd3df]">
                    balcão de encomendas
                  </p>
                  <h1 className="mt-4 max-w-[10ch] font-display text-6xl font-black leading-[.86] tracking-[-.045em] sm:text-7xl lg:text-[7rem]">
                    <ManagedText
                      field="heroHeadline"
                      fallback="Sua comemoração merece ser inesquecível."
                    />
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                    <ManagedText
                      field="heroSubheadline"
                      fallback="A Chyrley cuida de cada detalhe com bolos molhadinhos, salgados caprichados e doces que fazem a festa acontecer."
                    />
                  </p>
                </div>
              </div>
            </figure>

            <div className="grid border-x-2 border-b-2 border-[#361d1c] bg-[#ffd3df] sm:grid-cols-3">
              <div className="border-b-2 border-[#361d1c] p-5 sm:border-b-0 sm:border-r-2">
                <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#9b4152]">
                  pagamento
                </p>
                <p className="mt-2 font-black">Crédito e débito</p>
              </div>
              <div className="border-b-2 border-[#361d1c] p-5 sm:border-b-0 sm:border-r-2">
                <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#9b4152]">
                  retirada
                </p>
                <p className="mt-2 font-black">Rio Bonito</p>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#9b4152]">
                  entrega
                </p>
                <p className="mt-2 font-black">Envio por Uber a combinar</p>
              </div>
            </div>
          </div>
        </section>

        <section id="cardapio" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.34fr_.66fr]">
              <aside>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b95768]">
                  cardápio de ocasião
                </p>
                <h2 className="mt-4 max-w-[8ch] font-display text-4xl font-black leading-[.92] sm:text-5xl">
                  Escolha o formato da comemoração.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-[#765955]">
                  A quantidade, o tema e a data entram no orçamento. A página organiza o pedido sem
                  inventar preço ou disponibilidade.
                </p>
              </aside>

              <div className="border-t-2 border-[#361d1c]">
                {offers.map(([code, title, text]) => (
                  <article
                    key={code}
                    className="grid gap-4 border-b border-[#361d1c]/20 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-start"
                  >
                    <span className="font-mono text-xs font-black text-[#b95768]">{code}</span>
                    <div>
                      <h3 className="font-display text-2xl font-black">{title}</h3>
                      <p className="mt-3 max-w-xl leading-7 text-[#765955]">{text}</p>
                    </div>
                    <a href="#pedido" className="text-sm font-black underline underline-offset-4">
                      encomendar
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="porcoes" className="bg-[#7d2f35] px-5 py-18 text-white lg:px-8 lg:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.45fr_.55fr] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#ffd3df]">
                  tamanho da festa
                </p>
                <p className="mt-4 font-display text-[6rem] font-black leading-none text-[#ffd3df] sm:text-[9rem]">
                  6–100
                </p>
                <p className="mt-3 max-w-md text-lg leading-8 text-white/75">
                  Pessoas é a faixa divulgada para os kits festa. O conteúdo final depende da
                  quantidade, da ocasião e do que você escolher.
                </p>
              </div>

              <ol className="border-y border-white/20">
                {[
                  ["01", "Defina a ocasião", "Aniversário, festa em casa, presente ou confraternização."],
                  ["02", "Passe os detalhes", "Quantidade, tema, data e preferências."],
                  ["03", "Combine a retirada", "Rio Bonito ou envio por Uber a combinar."],
                ].map(([n, title, text]) => (
                  <li key={n} className="grid gap-3 border-b border-white/20 py-5 last:border-b-0 sm:grid-cols-[3rem_10rem_1fr]">
                    <span className="font-mono text-xs font-black text-[#ffd3df]">{n}</span>
                    <h3 className="font-black">{title}</h3>
                    <p className="text-sm leading-6 text-white/65">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="galeria" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-[.68fr_.32fr]">
              <figure className="m-0 overflow-hidden border-2 border-[#361d1c] bg-white">
                <PortfolioImage
                  src="/images/confeitaria-chyrley/bolos.webp"
                  alt="Bolos personalizados para festas"
                  width={899}
                  height={1599}
                  className="h-[560px] w-full object-cover lg:h-[720px]"
                />
                <figcaption className="border-t-2 border-[#361d1c] bg-[#fff0ec] p-5 font-bold">
                  Temas personalizados para crianças e adultos.
                </figcaption>
              </figure>

              <aside className="flex flex-col justify-between border-2 border-[#361d1c] bg-[#f5c2a8] p-7 sm:p-9">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#9b4152]">
                    da cozinha para a festa
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-black leading-[.94]">
                    O pedido é montado pela ocasião, não por um pacote genérico.
                  </h2>
                  <p className="mt-5 leading-8 text-[#6d4f4a]">
                    Bolo, kit, salgados e doce podem entrar na mesma conversa. A Chyrley confirma o
                    que faz sentido para a data e quantidade informadas.
                  </p>
                </div>

                <div className="mt-10 space-y-4 border-t border-[#361d1c]/20 pt-6 text-sm font-bold">
                  <p><CreditCard className="mr-2 inline h-4 w-4" />Crédito e débito</p>
                  <p><MapPin className="mr-2 inline h-4 w-4" />Retirada no Rio Bonito</p>
                  <p><PackageCheck className="mr-2 inline h-4 w-4" />Uber a combinar</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="pedido" className="bg-[#ffd3df] px-5 py-14 lg:px-8 lg:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#9b4152]">
                próximo pedido
              </p>
              <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                Conte a ocasião, a quantidade e a data.
              </h2>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-[#6d4f4a]">
                <span><Check className="mr-1 inline h-4 w-4" />Tema</span>
                <span><Check className="mr-1 inline h-4 w-4" />Quantidade</span>
                <span><Check className="mr-1 inline h-4 w-4" />Data</span>
              </div>
            </div>

            <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#7d2f35] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#a94355]">
              Pedir orçamento
              <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#361d1c] px-5 py-8 text-sm text-[#f4cfd2] lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="text-white">Chyrley Doces & Festas</strong>
            <br />
            Bolos, doces e salgados em Rio Bonito.
          </p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#ffd3df]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="confeitaria-chyrley"
        eyebrow="Encomendas artesanais"
        title="Sua festa pode ter o sabor e o cuidado que você imaginou."
        description="Conte a ocasião, a quantidade e o que deseja celebrar para receber uma orientação personalizada."
        ctaLabel="Montar minha encomenda"
        ctaHref="#pedido"
        delayMs={9000}
      />
      <PortfolioUpsellPopup pageName="portfolio-confeitaria-chyrley" />
    </div>
  );
}
