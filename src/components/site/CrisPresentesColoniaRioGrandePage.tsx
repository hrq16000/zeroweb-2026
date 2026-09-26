import { ArrowRight, Check, Gift, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";

const quizConfig = {
  services: [
    "Brinquedos e artigos recreativos",
    "Papelaria",
    "Armarinho",
    "Doces, balas e bombons",
    "Joalheria e relojoaria",
    "Quero ajuda para encontrar um presente",
  ],
  experienceOptions: [
    "Presente para criança",
    "Presente para adulto",
    "Material de papelaria",
    "Item para uso do dia a dia",
    "Ainda estou escolhendo",
  ],
  periodOptions: [
    "Quero retirar na loja",
    "Quero confirmar se tem disponível",
    "Quero combinar antes de ir",
  ],
  timingOptions: ["Hoje", "Nesta semana", "Estou pesquisando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você está procurando?",
    experience: "Para quem ou para qual necessidade?",
    period: "Como prefere seguir?",
    timing: "Para quando você precisa?",
    note: "Quer dar mais algum detalhe?",
  },
  notePlaceholder: "Ex.: idade, ocasião, faixa de preço, tipo de brinquedo ou item de papelaria.",
};

const categories = [
  ["Brinquedos", "Brinquedos e artigos recreativos"],
  ["Papelaria", "Artigos de papelaria"],
  ["Armarinho", "Itens de armarinho"],
  ["Doces e lembranças", "Doces, balas e bombons"],
  ["Acessórios", "Joalheria e relojoaria"],
] as const;

function CTA({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="cris-presentes-colonia-rio-grande"
      studioName="Cris Presentes · Colônia Rio Grande"
      recipientName="Cris Presentes"
      theme="gold"
      mode="proposal"
      funnelIntent="pedido"
      quizConfig={quizConfig}
      ariaLabel="Consultar produtos na Cris Presentes"
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function CrisPresentesColoniaRioGrandePage() {
  return (
    <div className="min-h-dvh bg-[#fff7dd] text-[#20213a]">
      <header className="border-b-2 border-[#20213a] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#inicio" className="flex items-center gap-3">
            <PortfolioImage
              src="/images/cris-presentes-colonia-rio-grande/logo.svg"
              alt=""
              width={54}
              height={54}
              className="h-11 w-11"
            />
            <div>
              <p className="font-display text-lg font-black">Cris Presentes</p>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#bd3e72]">
                Colônia Rio Grande
              </p>
            </div>
          </a>

          <CTA className="inline-flex min-h-10 items-center gap-2 border-2 border-[#20213a] bg-[#20213a] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#bd3e72]">
            Consultar item
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="inicio" className="px-5 py-8 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#bd3e72]">
              São José dos Pinhais · comércio local
            </p>
            <h1 className="mt-4 max-w-[12ch] font-display text-5xl font-black leading-[.9] tracking-[-.045em] sm:text-7xl lg:text-[7.5rem]">
              Você não precisa saber o presente. Só precisa dar a primeira pista.
            </h1>

            <figure className="relative mt-8 overflow-hidden border-2 border-[#20213a] bg-white">
              <PortfolioImage
                src="/images/cris-presentes-colonia-rio-grande/hero.svg"
                alt="Arte editorial da Cris Presentes com referências a brinquedos, papelaria e presentes"
                width={1200}
                height={1400}
                priority
                className="h-[430px] w-full object-cover sm:h-[560px]"
              />
              <figcaption className="border-t-2 border-[#20213a] bg-[#ffca62] px-5 py-4 text-sm font-bold">
                Rua Pedro Trevisan, 58 · lojas 06 e 07 · Colônia Rio Grande
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="pistas" className="border-y-2 border-[#20213a] bg-[#f7bed4] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#7d3155]">
                  três pistas bastam
                </p>
                <h2 className="mt-3 max-w-[12ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                  Para quem, o que e para quando?
                </h2>
              </div>
              <p className="max-w-xl leading-7 text-[#5f5062]">
                O estoque muda. Por isso a página não inventa marca, preço ou disponibilidade.
                A consulta parte do que você procura e a própria loja confirma.
              </p>
            </div>

            <ol className="mt-10 border-2 border-[#20213a] bg-[#fff7dd]">
              {[
                ["01", "Para quem?", "Criança, adulto, uso próprio ou uma ocasião específica."],
                ["02", "O que procura?", "Brinquedo, papelaria, armarinho, doce, lembrança ou acessório."],
                ["03", "Para quando?", "Hoje, nesta semana ou apenas pesquisando opções."],
              ].map(([n, title, text]) => (
                <li key={n} className="border-b-2 border-[#20213a] p-6 last:border-b-0 sm:grid sm:grid-cols-[4rem_12rem_1fr] sm:gap-5">
                  <span className="font-mono text-sm font-black text-[#bd3e72]">{n}</span>
                  <h3 className="mt-2 font-display text-xl font-black sm:mt-0">{title}</h3>
                  <p className="mt-2 leading-7 text-[#655968] sm:mt-0">{text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6">
              <CTA className="inline-flex min-h-12 items-center gap-2 bg-[#20213a] px-6 py-3.5 text-sm font-black text-white">
                Dar as pistas
                <Gift className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </section>

        <section id="lista" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 border-b-2 border-[#20213a] pb-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#bd3e72]">
                  categorias registradas
                </p>
                <h2 className="mt-3 font-display text-4xl font-black sm:text-5xl">
                  O que faz sentido consultar na Cris.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#665b69]">
                As categorias abaixo vêm do cadastro comercial público da filial.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#20213a] text-left text-[10px] font-black uppercase tracking-[.16em]">
                    <th className="px-3 py-4">Setor</th>
                    <th className="px-3 py-4">Categoria</th>
                    <th className="px-3 py-4">Referência factual</th>
                    <th className="px-3 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(([title, detail], index) => (
                    <tr key={title} className="border-b border-[#20213a]/20">
                      <td className="px-3 py-5 font-mono text-xs font-black text-[#bd3e72]">
                        S{String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-3 py-5 font-display text-xl font-black">{title}</td>
                      <td className="px-3 py-5 text-sm text-[#665b69]">{detail}</td>
                      <td className="px-3 py-5 text-right">
                        <a href="#consulta" className="font-black underline underline-offset-4">
                          consultar
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="ficha" className="bg-[#20213a] px-5 py-16 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
              <figure className="m-0 flex-1 overflow-hidden border-2 border-white/25 bg-white">
                <PortfolioImage
                  src="/images/cris-presentes-colonia-rio-grande/capa-card.svg"
                  alt="Composição editorial de presentes, brinquedos e papelaria da Cris Presentes"
                  width={1200}
                  height={900}
                  className="h-full min-h-[360px] w-full object-cover"
                />
              </figure>

              <aside className="flex flex-1 flex-col justify-between border-2 border-[#ffca62] p-7 sm:p-9">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#ffca62]">
                    ficha da filial
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-black">Cris Presentes Filial 2</h2>
                  <p className="mt-5 leading-8 text-white/65">
                    O registro empresarial público identifica a unidade na Rua Pedro Trevisan, 58,
                    lojas 06 e 07. O mesmo endereço corresponde ao Jacomar Colônia Rio Grande.
                  </p>
                </div>

                <div className="mt-8 border-t border-white/20 pt-6 text-sm leading-7 text-white/75">
                  <p><strong className="text-white">Cidade:</strong> São José dos Pinhais — PR</p>
                  <p><strong className="text-white">Bairro:</strong> Colônia Rio Grande</p>
                  <p><strong className="text-white">CEP:</strong> 83025-580</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="consulta" className="bg-[#69c6da] px-5 py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] font-black uppercase tracking-[.18em]">antes de sair de casa</p>
            <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="max-w-[14ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                  Confirme a disponibilidade real com a loja.
                </h2>
                <p className="mt-5 max-w-2xl leading-7 text-[#2d4050]">
                  Informe item, ocasião e prazo. A consulta segue para o atendimento da própria unidade.
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
                  <span><Check className="mr-1 inline h-4 w-4" />Item desejado</span>
                  <span><Check className="mr-1 inline h-4 w-4" />Ocasião</span>
                  <span><Check className="mr-1 inline h-4 w-4" />Prazo</span>
                </div>
              </div>

              <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#20213a] px-6 py-3.5 text-sm font-black text-white">
                Verificar disponibilidade
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>

            <p className="mt-8 flex items-center gap-2 text-sm font-bold">
              <MapPin className="h-4 w-4" />
              Rua Pedro Trevisan, 58 · lojas 06 e 07 · Colônia Rio Grande
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-[#20213a] px-5 py-8 text-sm text-white/60 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="text-white">Cris Presentes · Colônia Rio Grande</strong>
            <br />
            Disponibilidade e condições confirmadas diretamente no atendimento.
          </p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="cris-presentes-colonia-rio-grande"
        eyebrow="Cris Presentes"
        title="Procurando um presente e ainda não decidiu?"
        description="Conte para quem é e o que você imaginou. O funil organiza a consulta para a loja."
        ctaLabel="Quero ajuda para escolher"
        ctaHref="#consulta"
        delayMs={9000}
        className="border-[#ffca62]/35 bg-[#20213a]/95 text-white"
        accentClassName="text-[#ffca62]"
      />
    </div>
  );
}
