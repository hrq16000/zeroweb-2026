import type { ReactNode } from "react";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { ArrowRight, BadgeCheck, MapPin, PackageCheck, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";

const IMAGES = "/images/bpl-locacoes-de-brinquedos/";

const questions = [
  ["Quais brinquedos aparecem no material da BPL?", "O panfleto apresenta cama elástica e piscina de bolinhas. Outros itens não foram confirmados."],
  ["A BPL atende São José dos Pinhais?", "Sim. O material divulgado informa São José dos Pinhais e região, sem detalhar municípios ou limites de deslocamento."],
  ["É possível consultar valores e datas?", "Preço, duração, montagem, requisitos do local e disponibilidade não constam do material. É necessário confirmá-los com a empresa."],
  ["Esta é a página oficial da BPL?", "Não. Esta página é uma demonstração editorial criada pela 0WEB a partir do material apresentado, sem representação ou reserva oficial pela empresa."],
] as const;

function InfoLink({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <a href="#duvidas" className={className}>{children}</a>;
}

export function BplLocacoesBrinquedosPage() {
  return (
    <div lang="pt-BR" className="min-h-screen overflow-x-clip bg-[#fffdf6] text-[#102d68] selection:bg-[#ffdd51]">
      <div className="bg-[#071a56] px-4 py-2 text-center text-xs font-semibold tracking-wide text-white">
        PORTFÓLIO DEMONSTRATIVO 0WEB · NÃO É O SITE OFICIAL DA BPL
      </div>
      <header className="relative z-20 border-b-4 border-[#ffce28] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-10">
          <a href="#inicio" className="inline-flex min-h-12 items-center gap-2" aria-label="BPL Locações de Brinquedos — início">
            <img src={IMAGES + "logo.svg"} alt="Marca editorial BPL Locações de Brinquedos" loading="lazy" decoding="async" width={176} height={78} className="h-16 w-auto" />
          </a>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold" aria-label="Navegação BPL">
            <a href="#brinquedos" className="rounded-lg py-2 hover:text-[#db237e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Brinquedos</a>
            <a href="#compromissos" className="rounded-lg py-2 hover:text-[#db237e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Diferenciais</a>
            <a href="#duvidas" className="rounded-lg py-2 hover:text-[#db237e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Dúvidas</a>
          </nav>
        </div>
      </header>

      <main id="inicio">
        <section data-hide-portfolio-floating="bpl-locacoes-de-brinquedos" className="relative isolate overflow-hidden bg-[#0757b3] text-white">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-[#22c8ee]/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/4 size-96 rounded-full bg-[#ec2084]/20 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.04fr_.96fr] lg:items-center lg:px-10 lg:py-24">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em]">
                <Sparkles className="size-4 text-[#ffdf54]" aria-hidden="true" /> São José dos Pinhais e região
              </span>
              <h1 className="mt-7 max-w-3xl text-[clamp(3.2rem,7vw,6.8rem)] font-black leading-[0.98] tracking-[-0.055em]">
                Sua festa pede <span className="text-[#ffe15d]">mais brincadeira!</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#e0f5ff] md:text-xl">
                A BPL anuncia locação de <strong className="text-white">cama elástica</strong> e <strong className="text-white">piscina de bolinhas</strong> para colocar a diversão no centro da comemoração.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <InfoLink className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#ffe15d] px-7 py-4 font-extrabold text-[#092663] shadow-xl shadow-black/10 transition-transform motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Ver informações <ArrowRight className="size-5" aria-hidden="true" />
                </InfoLink>
                <a href="#brinquedos" className="inline-flex min-h-12 items-center rounded-full border-2 border-white/50 px-7 py-4 font-bold text-white transition-colors hover:bg-white/10">Conhecer os brinquedos</a>
              </div>
              <p className="mt-7 max-w-lg text-xs text-[#d5eaff]">Conceito visual baseado no panfleto fornecido. Esta apresentação não recebe pedidos, reservas ou dados pessoais; preço e disponibilidade não foram confirmados.</p>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div aria-hidden="true" className="absolute -inset-4 rotate-6 rounded-[3rem] bg-[#f8c631]" />
              <div className="relative overflow-hidden rounded-[3rem] border-[10px] border-white bg-[#8de9f9] shadow-2xl shadow-[#021844]/50">
                <img src={IMAGES + "trampoline.svg"} alt="Ilustração editorial de uma cama elástica colorida; não é fotografia do equipamento da BPL" width={600} height={500} fetchPriority="high" loading="eager" decoding="async" className="aspect-[6/5] w-full object-cover" />
              </div>
              <span className="absolute -bottom-5 -left-3 -rotate-6 rounded-2xl bg-[#eb2580] px-5 py-3 text-sm font-black text-white shadow-xl">É hora de brincar!</span>
              <Star aria-hidden="true" className="absolute -right-4 -top-6 size-12 rotate-12 fill-[#ffdf5b] text-[#ffdf5b]" />
            </div>
          </div>
          <div className="border-t border-white/15 bg-[#053b94] px-5 py-5 text-center text-sm font-bold tracking-wide text-[#f9e9ff]">
            <span aria-hidden="true">✦</span> BRINCADEIRA <span className="mx-3 text-[#ffe15d]" aria-hidden="true">✦</span> DIVERSÃO <span className="mx-3 text-[#ff8ebf]" aria-hidden="true">✦</span> MEMÓRIAS ESPECIAIS
          </div>
        </section>

        <section id="brinquedos" className="scroll-mt-20 px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d21b75]">Brinquedos apresentados</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Duas formas de fazer a festa acontecer.</h2>
              <p className="mt-5 text-lg leading-relaxed text-[#385681]">Conheça os equipamentos mostrados no material da BPL. As ilustrações abaixo representam o tipo de brinquedo — não o estoque exato da empresa.</p>
            </div>
            <div className="grid gap-7 md:grid-cols-2">
              <article className="overflow-hidden rounded-[2.5rem] border-2 border-[#c3e6fd] bg-[#e8f6ff]">
                <div className="flex min-h-[260px] items-center justify-center bg-[#b7effe] p-6">
                  <img src={IMAGES + "trampoline.svg"} alt="Ilustração de cama elástica com rede de proteção e estrutura colorida" loading="lazy" decoding="async" width={600} height={500} className="max-h-[300px] w-full object-contain" />
                </div>
                <div className="p-8">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0873b8]">Movimento e diversão</span>
                  <h3 className="mt-2 text-3xl font-black">Cama elástica</h3>
                  <p className="mt-4 leading-relaxed text-[#385681]">Uma opção anunciada para deixar o momento da brincadeira ainda mais animado. Consulte medidas, faixa etária e instalação.</p>
                  <InfoLink className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0762b8] px-6 py-3 font-bold text-white">Ver informações <ArrowRight size={18} aria-hidden="true" /></InfoLink>
                </div>
              </article>
              <article className="overflow-hidden rounded-[2.5rem] border-2 border-[#f7c9dc] bg-[#fff0f7]">
                <div className="flex min-h-[260px] items-center justify-center bg-[#ffdef0] p-6">
                  <img src={IMAGES + "ballpit.svg"} alt="Ilustração de piscina de bolinhas multicoloridas com cobertura" loading="lazy" decoding="async" width={600} height={500} className="max-h-[300px] w-full object-contain" />
                </div>
                <div className="p-8">
                  <span className="text-xs font-black uppercase tracking-wider text-[#c32371]">Cores e descobertas</span>
                  <h3 className="mt-2 text-3xl font-black">Piscina de bolinhas</h3>
                  <p className="mt-4 leading-relaxed text-[#7b4566]">Outro destaque do panfleto para brincar e explorar. Confirme as condições de uso e a disponibilidade para a data desejada.</p>
                  <InfoLink className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#cf2077] px-6 py-3 font-bold text-white">Quero consultar <ArrowRight size={18} aria-hidden="true" /></InfoLink>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="compromissos" className="scroll-mt-20 bg-[#061e60] px-6 py-20 text-white lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffdb62]">O que a BPL divulga</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Brincar é bom. Organizar com cuidado é essencial.</h2>
              <p className="mt-6 max-w-2xl text-[#d1dff9]">Os compromissos abaixo são anunciados no panfleto, ainda sem verificação independente pela 0WEB.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Brinquedos higienizados", detail: "O material afirma cuidado com segurança e higienização." },
                { icon: Truck, title: "Entrega e retirada", detail: "O panfleto anuncia compromisso com os prazos de entrega e retirada." },
                { icon: BadgeCheck, title: "Qualidade e confiança", detail: "Valores comunicados pela marca em seu material promocional." },
              ].map(({ icon: Icon, title, detail }) => (
                <article key={title} className="rounded-[2rem] border border-white/20 bg-white/10 p-8">
                  <Icon className="size-11 text-[#ffdc68]" aria-hidden="true" strokeWidth={1.6} />
                  <h3 className="mt-7 text-2xl font-black">{title}</h3>
                  <p className="mt-4 leading-relaxed text-[#dce6fc]">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="regiao" className="px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <div className="rounded-[2.5rem] bg-[#fff1b9] p-8 md:p-12">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-[#e41f77]"><MapPin size={34} aria-hidden="true" /></div>
              <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#b45011]">Atendimento divulgado</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">São José dos Pinhais e região.</h2>
              <p className="mt-5 leading-relaxed text-[#5f5c45]">A região de atendimento consta no panfleto. Frete, municípios abrangidos e condições de deslocamento devem ser confirmados antes da contratação.</p>
            </div>
            <div className="rounded-[2.5rem] border-2 border-[#d4e6fc] bg-white p-8 md:p-12">
              <PackageCheck className="size-10 text-[#0873bd]" aria-hidden="true" />
              <h3 className="mt-4 text-3xl font-black">Antes de escolher, tenha em mãos:</h3>
              <ol className="mt-7 space-y-5">
                {[
                  ["01", "Data e horário da festa"],
                  ["02", "Local do evento e espaço disponível"],
                  ["03", "Brinquedo desejado e faixa etária das crianças"],
                ].map(([n, value]) => (
                  <li key={n} className="flex items-start gap-4 border-b border-[#e7eef9] pb-4">
                    <span className="font-black text-[#d4217d]">{n}</span><span className="font-semibold text-[#284674]">{value}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-sm text-[#687895]">Este é um roteiro de consulta sugerido pela 0WEB, não uma condição contratual definida pela BPL.</p>
            </div>
          </div>
        </section>

        <section id="duvidas" className="scroll-mt-20 bg-[#eaf6ff] px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c82175]">Informação antes da festa</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Dúvidas frequentes.</h2>
              <p className="mt-5 leading-relaxed text-[#456587]">Sem preços inventados, disponibilidade presumida ou avaliações fictícias.</p>
            </div>
            <div>
              {questions.map(([question, answer]) => (
                <details key={question} className="group border-b-2 border-[#cbdff6] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-extrabold marker:hidden">
                    {question}<span className="text-3xl text-[#d51d77]" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-[#42617d]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="consulta" className="bg-[#f8d22d] px-6 py-20 text-center lg:px-10 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#bd2076]">
              <Sparkles size={16} aria-hidden="true" /> Diversão em cada detalhe
            </span>
            <h2 className="mt-7 text-4xl font-black tracking-tight text-[#08245f] md:text-6xl">Que tal dar mais cor à próxima festa?</h2>
            <p className="mt-6 text-lg leading-relaxed text-[#40506d]">Esta apresentação é estática e não recebe solicitações. Brinquedos, valores, disponibilidade e condições devem ser confirmados diretamente com a empresa.</p>
            <InfoLink className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#e51d7e] px-8 py-4 font-black text-white shadow-xl shadow-[#af1770]/20">Ver dúvidas e informações <ArrowRight size={19} aria-hidden="true" /></InfoLink>
            <p className="mt-7 text-sm font-medium text-[#535a67]">Canais oficiais e vínculo comercial aguardam confirmação direta com a empresa.</p>
          </div>
        </section>
      </main>
      <PortfolioHostCredit className="px-6 py-4 text-center text-sm" linkClassName="underline" />
    </div>
  );
}
