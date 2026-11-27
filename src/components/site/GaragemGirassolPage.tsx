import { ArrowUpRight, MapPin, Flame, MessageCircle, Flower2, IceCreamBowl } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";

const base = "/images/garagem-girassol";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=Rua%20Quirino%20Zagonel%20988%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%2C%20PR";
export const garagemQuiz: PortfolioQuizConfig = {
  proposalKind: "service",
  services: ["Espetinhos", "Crepe suíço", "Morango com nata", "Uva com nata", "Consultar o cardápio"],
  experienceOptions: ["Consultar sabores e valores", "Quero visitar o estabelecimento", "Consultar disponibilidade"],
  periodOptions: ["Hoje", "Outro dia", "Ainda não sei"],
  timingOptions: ["Tenho uma dúvida", "Quero combinar diretamente"],
  stepTitles: { service: "O que deu vontade de comer?", experience: "Como podemos ajudar?", period: "Quando você pretende ir?", timing: "Algo mais?" },
  notePlaceholder: "Escreva sua dúvida, sabores desejados ou quantidade. O atendimento confirma as opções.",
};
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d98c18]";
function CTA({ children = "Consultar cardápio" }: { children?: React.ReactNode }) {
  return <PortfolioCTAQuiz clientKey="garagem-girassol" studioName="Garagem & Girassol"
    recipientName="Garagem & Girassol" theme="gold" mode="proposal" quizConfig={garagemQuiz}
    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffc83d] px-6 py-3.5 text-sm font-extrabold text-[#291913] shadow-[0_5px_0_#a85c19] transition motion-safe:hover:-translate-y-1 ${focus}`}>
    <MessageCircle aria-hidden="true" size={19} /> {children} <ArrowUpRight aria-hidden="true" size={17}/>
  </PortfolioCTAQuiz>;
}
const items = [
  { name: "Espetinhos", description: "Uma escolha para quem está com vontade de um lanche salgado. Consulte os tipos disponíveis.", Icon: Flame, image: null },
  { name: "Crepe suíço", description: "Crocante por fora e macio por dentro, como anuncia o banner do estabelecimento. Consulte os recheios.", Icon: Flower2, image: "crepe-suico.webp" },
  { name: "Morango e uva com nata", description: "Duas opções doces anunciadas na fachada: morango com nata e uva com nata.", Icon: IceCreamBowl, image: "sobremesas.webp" },
] as const;

export function GaragemGirassolPage() {
  return <div lang="pt-BR" data-portfolio-client="garagem-girassol" className="overflow-x-clip bg-[#fff6e5] text-[#291913]">
    <header className="border-b border-[#f7cb50]/20 bg-[#291913] text-[#fff6e5]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4">
        <a href="#inicio" className={`flex min-h-12 items-center gap-3 rounded-lg ${focus}`} aria-label="Garagem e Girassol, início">
          <img src={base+"/logo.svg"} width="44" height="44" loading="lazy" decoding="async" alt="" className="h-11 w-11"/>
          <span className="font-serif text-xl font-bold leading-tight">Garagem <span className="text-[#ffc83d]">& Girassol</span><span className="block font-sans text-[10px] tracking-[0.19em] text-[#e9ca9b] uppercase">Espetinhos e crepe suíço</span></span>
        </a>
        <nav aria-label="Navegação" className="flex flex-wrap items-center gap-5 text-sm font-semibold">
          <a className={`py-2 hover:text-[#ffc83d] ${focus}`} href="#sabores">Sabores</a>
          <a className={`py-2 hover:text-[#ffc83d] ${focus}`} href="#local">Localização</a>
        </nav>
      </div>
    </header>
    <main id="inicio">
      <section className="relative isolate bg-[#291913] px-5 pb-10 pt-8 text-[#fff6e5] sm:py-12 lg:py-16">
        <div className="mx-auto grid max-w-6xl items-end gap-7 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffc83d]"><MapPin size={16} aria-hidden="true"/> São José dos Pinhais · PR</p>
            <h1 className="font-serif text-[clamp(3rem,7vw,6.8rem)] leading-[0.9] font-black tracking-[-0.065em]">Garagem<br/><span className="text-[#ffc83d]">& Girassol</span></h1>
            <p className="mt-6 max-w-md text-xl leading-relaxed sm:text-2xl">Espetinhos, crepe suíço e uma pausa doce com morango ou uva com nata.</p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-4 items-center"><CTA/><a href="#local" className={`font-bold underline underline-offset-4 ${focus}`}>Como chegar</a></div>
            <p className="mt-6 text-sm text-[#e9ca9b]">Rua Quirino Zagonel, 988</p>
          </div>
          <figure className="relative rounded-[1.8rem] border-[6px] border-[#a66e2a] bg-[#39231b] p-2 shadow-2xl">
            <img src={base+"/fachada.webp"} width="685" height="461" alt="Fotografia da placa da Garagem & Girassol com girassóis, espetinhos e crepe suíço" loading="eager" fetchPriority="high" decoding="async" className="block aspect-[1.49] w-full rounded-[1.15rem] object-cover"/>
            <figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-[#e9ca9b]"><span>Identidade real do estabelecimento</span><span className="font-bold text-[#ffc83d]">✺</span></figcaption>
          </figure>
        </div>
      </section>
      <div className="bg-[#ffc83d] px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#291913] sm:text-sm">Espetinhos <span aria-hidden="true">✺</span> Crepe suíço <span aria-hidden="true">✺</span> Morango e uva com nata</div>
      <section id="sabores" className="mx-auto max-w-6xl px-5 py-12 sm:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#945123]">Conheça as opções anunciadas</p>
        <h2 className="mt-2 font-serif text-4xl font-black tracking-tight sm:text-6xl">Qual é a sua vontade?</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-[0.85fr_1.15fr_1fr]">
          {items.map(({name,description,Icon,image})=><article key={name} className="group flex min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-[#d9c4a1] bg-[#fffdf5]">
            {image ? <div className="h-56 overflow-hidden bg-[#291913]"><img src={base+"/"+image} alt={`Banner real anunciando ${name}`} width="650" height="1016" loading="lazy" decoding="async" className="h-full w-full object-contain transition duration-500 motion-safe:group-hover:scale-[1.025]"/></div> :
              <div className="flex h-56 items-center justify-center bg-[#712a18] text-[#ffc83d]"><Flame size={90} strokeWidth={1.1} aria-hidden="true"/></div>}
            <div className="flex flex-1 flex-col p-5"><div className="flex gap-2 items-start"><Icon size={24} className="mt-1 shrink-0 text-[#a65d22]" aria-hidden="true"/><h3 className="font-serif text-2xl font-bold">{name}</h3></div><p className="mt-3 flex-1 leading-7 text-[#644e3c]">{description}</p></div>
          </article>)}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#ebd6b5] p-5"><p className="max-w-lg text-sm leading-relaxed">O cardápio completo, os preços e a disponibilidade podem ser consultados no atendimento.</p><CTA>Consultar opções</CTA></div>
      </section>
      <section id="local" className="bg-[#3a271b] px-5 py-12 text-[#fff6e5] sm:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1fr_.9fr]">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#ffc83d]">Onde encontrar</p><h2 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl">Seu próximo lanche está aqui.</h2><p className="mt-5 text-lg"><MapPin aria-hidden="true" className="mr-2 inline text-[#ffc83d]"/>Rua Quirino Zagonel, 988<br/><span className="ml-8">São José dos Pinhais — PR</span></p>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={`mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#ffc83d] px-5 py-3 font-bold text-[#ffc83d] hover:bg-[#ffc83d] hover:text-[#291913] ${focus}`}>Abrir no Google Maps <ArrowUpRight size={18} aria-hidden="true"/></a>
          </div>
          <img src={base+"/placa.webp"} width="683" height="459" alt="Outro ângulo da placa do estabelecimento Garagem & Girassol" loading="lazy" decoding="async" className="w-full rounded-2xl border-4 border-[#b17b35] object-cover"/>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-14">
        <h2 className="font-serif text-4xl font-bold">Antes de ir</h2>
        {[
          ["Quais produtos encontro na Garagem & Girassol?", "A placa anuncia espetinhos e crepe suíço, além de morango com nata e uva com nata."],
          ["Quais são os preços, sabores e horários?", "Essas informações ainda não foram divulgadas nesta página. Consulte o atendimento para confirmar."],
          ["Onde fica?", "Na Rua Quirino Zagonel, 988, em São José dos Pinhais, Paraná."],
          ["Tem entrega?", "A modalidade de entrega não foi confirmada. Consulte diretamente o estabelecimento."],
        ].map(([q,a])=><details key={q} className="border-b border-[#d9c4a1] py-4"><summary className={`cursor-pointer rounded text-lg font-bold ${focus}`}>{q}</summary><p className="pt-3 leading-7 text-[#644e3c]">{a}</p></details>)}
        <p className="mt-7 text-sm text-[#644e3c]">Apresentação demonstrativa da 0WEB com base nas imagens e no endereço fornecidos. Confirme as informações comerciais diretamente.</p>
        <div className="mt-5"><CTA>Falar com a Garagem & Girassol</CTA></div>
      </section>
    </main>
    <footer className="bg-[#291913] p-6 text-center text-sm text-[#e9ca9b]"><PortfolioHostCredit linkClassName="font-bold underline"/></footer>
  </div>;
}
