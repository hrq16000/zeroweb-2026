import type { ReactNode } from "react";
import { ArrowRight, ChevronRight, MapPin, Navigation, Sparkles } from "lucide-react";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { MotionReveal } from "@/components/motion";

function CTA({ children }: { children: ReactNode }) {
  return <a href="#localizacao" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#542638] px-6 py-3 font-semibold text-white shadow-lg shadow-[#542638]/15 transition-colors motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 hover:bg-[#7d3b56] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb7690]">
    {children}<ArrowRight className="h-4 w-4" />
  </a>;
}

const options = [
  { label: "Manicure", detail: "Serviço identificado na ficha pública. Detalhes e disponibilidade precisam ser confirmados." },
  { label: "Pedicure", detail: "Serviço identificado na ficha pública. Detalhes e disponibilidade precisam ser confirmados." },
];

const faq = [
  { q: "Esta página permite agendar?", a: "Não. Esta apresentação é estática; não recebe solicitações nem confirma agendamentos." },
  { q: "Como confirmar serviços e valores?", a: "A ficha pública identifica manicure e pedicure. Técnicas, valores, duração e disponibilidade precisam ser confirmados com o estabelecimento por um canal oficial." },
  { q: "Qual é o endereço informado?", a: "Av. Alvorada do Sul, 786, Coroados, Guaratuba, PR. Confirme a referência antes de se deslocar." },
];

export function EspacoMarliNailsGuaratubaPage() {
  return <div className="min-h-dvh overflow-x-clip bg-[#fffaf4] text-[#542638]">
    <div className="bg-[#542638] px-4 py-2 text-center text-xs leading-5 text-white">Proposta demonstrativa independente da 0WEB · Não é o site oficial do estabelecimento.</div>
    <header className="sticky top-0 z-30 border-b border-[#542638]/10 bg-[#fffaf4]/95 px-5 py-3 backdrop-blur-md md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Ir ao início do Espaço Marli Nails">
          <PortfolioImage src="/images/espaco-marli-nails-guaratuba/logo.svg" width={56} height={56} alt="" className="h-11 w-11 rounded-full"/>
          <span className="text-sm font-bold leading-tight sm:text-base">Espaço Marli <span className="block text-xs font-medium tracking-[0.19em] text-[#b4758c]">NAILS DESIGNER</span></span>
        </a>
        <nav aria-label="Navegação local" className="hidden gap-7 text-sm font-semibold lg:flex">
          <a href="#atendimento" className="hover:text-[#b4758c]">Cuidados</a>
          <a href="#localizacao" className="hover:text-[#b4758c]">Localização</a>
          <a href="#duvidas" className="hover:text-[#b4758c]">Dúvidas</a>
        </nav>
        <div className="hidden sm:block"><CTA>Ver localização <ArrowRight size={16} aria-hidden="true"/></CTA></div>
        <a href="#localizacao" className="inline-flex min-h-11 items-center rounded-full border border-[#542638]/30 px-4 text-sm font-semibold sm:hidden">Consultar <ChevronRight size={16} aria-hidden="true"/></a>
      </div>
    </header>
    <main id="inicio">
      <section className="relative isolate overflow-hidden px-5 py-14 md:px-10 md:py-24" aria-labelledby="marli-heading">
        <div className="absolute -right-24 top-10 -z-10 h-96 w-96 rounded-full bg-[#e8c5d0]/50 blur-3xl" aria-hidden="true"/>
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[.24em] text-[#b4758c]"><Sparkles size={16} aria-hidden="true"/> Coroados · Guaratuba, PR</p>
            <MotionReveal as="h1" variant="up" className="max-w-3xl font-serif text-[clamp(3.5rem,9vw,8.5rem)] leading-[.88] tracking-[-.055em]">
              Um cuidado <em className="font-normal text-[#b4758c]">só seu.</em>
            </MotionReveal>
            <p id="marli-heading" className="mt-8 max-w-xl text-lg leading-8 text-[#77586a]">Uma apresentação do Espaço Marli Nails Designer em Guaratuba, com localização e consulta de informações sobre manicure e pedicure.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA>Ver localização <ArrowRight size={17} aria-hidden="true"/></CTA>
              <a className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#542638]/25 px-6 py-3 font-semibold hover:bg-[#f6e8ec]" href="#localizacao">Onde fica <MapPin size={17} aria-hidden="true"/></a>
            </div>
            <p className="mt-10 border-t border-[#542638]/15 pt-5 text-xs uppercase tracking-[.15em] text-[#986b80]">Identidade visual conceitual · Agenda e valores a confirmar</p>
          </div>
          <figure className="group relative [perspective:1200px]">
            <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-[#dfb7c5]/65" aria-hidden="true"/>
            <div className="relative [transform-style:preserve-3d] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out md:motion-safe:group-hover:[transform:rotateY(-5deg)_rotateX(3deg)]">
              <PortfolioImage src="/images/espaco-marli-nails-guaratuba/hero.svg" alt="Arte abstrata original inspirada na estética de unhas, sem retratar trabalhos ou ambiente real do estabelecimento" width={1000} height={1100} priority className="relative w-full rounded-[2rem] object-cover shadow-2xl shadow-[#542638]/15"/>
              <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-white/30" aria-hidden="true"/>
              <figcaption className="absolute bottom-5 left-5 right-5 max-w-xs rounded-2xl bg-[#fffaf4]/95 px-4 py-3 text-xs leading-5 text-[#6f4b5c] shadow-md">Ilustração da 0WEB. Fotos dos trabalhos reais dependem de autorização.</figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section id="atendimento" className="scroll-mt-24 bg-[#542638] px-5 py-20 text-[#fff7ef] md:px-10" aria-labelledby="marli-atendimento">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#efc4d1]">01 / Como podemos orientar</p>
            <h2 id="marli-atendimento" className="font-serif text-4xl leading-tight sm:text-6xl">Escolha o assunto da <em className="font-normal text-[#eac3d2]">sua consulta.</em></h2>
          </div>
          <p className="mb-7 max-w-2xl text-sm leading-7 text-[#f2d7e0]">As opções organizam sua solicitação. Elas não constituem tabela oficial de técnicas, preços ou disponibilidade.</p>
          <div className="grid gap-3 md:grid-cols-3">
            {options.map((option, i) => (
              <article key={option.label} className="min-h-44 rounded-[1.75rem] border border-[#d7c9b7] bg-white p-5 shadow-sm">
                <span className="text-xs font-bold tracking-[.2em] text-[#9b8066]">0{i + 1}</span>
                <h3 className="mt-5 text-lg font-semibold text-[#34271f]">{option.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6e5a4b]">{option.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-white/20 bg-[#3f1d2c] p-6">
            <p className="max-w-lg text-sm leading-6">Informação importante: <strong>Manicure e pedicure aparecem na ficha pública; detalhes e disponibilidade precisam ser confirmados.</strong>. No formulário da 0WEB, confirme essa preferência. Nenhum horário é reservado automaticamente.</p>
            <CTA>Consultar esta opção <ArrowRight size={17} aria-hidden="true"/></CTA>
          </div>
        </div>
      </section>

      <section id="localizacao" className="scroll-mt-24 px-5 py-20 md:px-10" aria-labelledby="marli-local">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[.24em] text-[#b4758c]">02 / Encontre o estúdio</p>
            <h2 id="marli-local" className="font-serif text-4xl leading-tight sm:text-6xl">Bem perto de <em className="font-normal text-[#b4758c]">Guaratuba.</em></h2>
            <p className="mt-6 max-w-lg leading-8 text-[#77586a]">A ficha comercial pública identifica o Espaço Marli Nails Designer em Coroados. Confirme a referência de chegada e o horário antes de visitar.</p>
            <a className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#542638]/25 px-6 py-3 font-semibold hover:bg-[#f6e8ec]" href="https://www.google.com/maps/search/?api=1&query=Av.%20Alvorada%20do%20Sul%20786%20Coroados%20Guaratuba%20PR" target="_blank" rel="noopener noreferrer">Abrir no Google Maps <Navigation size={17} aria-hidden="true"/></a>
          </div>
          <div className="relative flex min-h-80 items-center overflow-hidden rounded-[2rem] bg-[#eed7df] p-7 sm:p-12">
            <span className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full border-[35px] border-white/35" aria-hidden="true"/>
            <span className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full border-[22px] border-[#a46180]/20" aria-hidden="true"/>
            <div className="relative rounded-[1.4rem] bg-[#fffaf4] p-7 shadow-xl">
              <MapPin className="mb-3 text-[#a66682]" size={26} aria-hidden="true"/>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a66682]">Coroados · Guaratuba</p>
              <p className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Av. Alvorada do Sul, 786</p>
              <p className="mt-3 text-sm text-[#77586a]">Guaratuba · Paraná · Brasil</p>
              <p className="mt-5 text-xs text-[#a06b82]">Mapa ilustrativo, sem representação de rota ou distância.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4e4e8] px-5 py-20 md:px-10" aria-labelledby="marli-galeria">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[.24em] text-[#a66682]">03 / Transparência visual</p>
            <h2 id="marli-galeria" className="font-serif text-4xl leading-tight sm:text-6xl">Trabalho real merece <em className="font-normal text-[#b4758c]">foto real.</em></h2>
            <p className="mt-6 max-w-lg leading-8 text-[#77586a]">Ainda não foram autorizadas fotografias do ambiente ou dos trabalhos. Por isso esta demonstração usa somente arte editorial original, sem imagens de outros salões.</p>
          </div>
          <div className="grid min-h-64 grid-cols-2 gap-3" aria-label="Composições gráficas editoriais originais, não fotografias de serviços">
            <div className="group relative min-h-64 overflow-hidden rounded-[2rem] bg-[#d6abb9] [perspective:850px]">
              <div aria-hidden="true" className="absolute inset-6 rounded-t-full rounded-b-[2rem] border-2 border-white/70 shadow-[inset_0_0_0_14px_#ffffff16] motion-safe:transition-transform motion-safe:duration-700 md:motion-safe:group-hover:[transform:rotateY(9deg)_translateZ(24px)]"/>
              <div aria-hidden="true" className="absolute right-7 top-9 h-20 w-20 rounded-full bg-[#fff4f0]/40 blur-lg"/>
              <span className="absolute bottom-6 left-6 text-[10px] font-bold uppercase tracking-[.24em] text-[#542638]">Composição 01</span>
            </div>
            <div className="group relative min-h-64 overflow-hidden rounded-[2rem] bg-[#78445a] [perspective:850px]">
              <div aria-hidden="true" className="absolute inset-6 rounded-b-full rounded-t-[2rem] border-2 border-[#f6dbe4]/80 shadow-[inset_0_0_0_14px_#ffffff10] motion-safe:transition-transform motion-safe:duration-700 md:motion-safe:group-hover:[transform:rotateY(-9deg)_translateZ(24px)]"/>
              <div aria-hidden="true" className="absolute bottom-9 left-9 h-16 w-16 rounded-full bg-[#efbccf]/30 blur-xl"/>
              <span className="absolute bottom-6 left-6 text-[10px] font-bold uppercase tracking-[.24em] text-[#fff4ee]">Composição 02</span>
            </div>
          </div>
        </div>
      </section>

      <section id="duvidas" className="scroll-mt-24 px-5 py-20 md:px-10" aria-labelledby="marli-faq">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <h2 id="marli-faq" className="font-serif text-4xl leading-tight sm:text-6xl">Tudo com <em className="font-normal text-[#b4758c]">clareza.</em></h2>
          <div className="divide-y divide-[#542638]/15 border-t border-[#542638]/15">
            {faq.map((item) => <details className="group py-6" key={item.q}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b4758c]">{item.q}<ChevronRight size={18} className="shrink-0 transition-transform group-open:rotate-90 motion-reduce:transition-none" aria-hidden="true"/></summary>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#77586a]">{item.a}</p>
            </details>)}
          </div>
        </div>
      </section>

      <section id="consulta" className="scroll-mt-24 bg-[#542638] px-5 py-20 text-white md:px-10" aria-labelledby="marli-consulta">
        <div className="mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#f0c6d6]"><CalendarDays size={15} aria-hidden="true"/> Solicitação sem reserva automática</p>
            <h2 id="marli-consulta" className="font-serif text-4xl leading-tight sm:text-6xl">Seu próximo cuidado começa com uma <em className="font-normal text-[#edc4d3]">conversa.</em></h2>
            <p className="mt-6 max-w-xl leading-7 text-[#efd6e1]">Envie sua consulta demonstrativa à 0WEB. Ela fica registrada no nosso formulário, sem envio ao estabelecimento e sem confirmação de horário.</p>
          </div>
          <div className="lg:justify-self-end"><CTA>Fazer solicitação <ArrowRight size={17} aria-hidden="true"/></CTA></div>
        </div>
        <p className="mx-auto mt-12 max-w-7xl border-t border-white/20 pt-6 text-xs leading-6 text-[#e3c0cf]">Portfólio demonstrativo independente da 0WEB. Não substitui a confirmação de serviços, valores e agenda com a profissional.</p>
      </section>
    </main>
    <footer className="sr-only"><PortfolioHostCredit/></footer>


  </div>;
}
