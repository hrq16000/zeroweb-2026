import { ArrowRight, CalendarDays, Check, ExternalLink, Eye, MapPin, Sparkles, WandSparkles } from "lucide-react";
import { motion } from "motion/react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Alongamento",
    "Banho em gel",
    "Pé em gel",
    "Volume brasileiro",
    "Progressiva",
    "Quero orientação para escolher",
  ],
  experienceOptions: [
    "É minha primeira vez no Studio",
    "Já faço esse procedimento",
    "Quero manutenção",
    "Quero conhecer as opções",
  ],
  periodOptions: ["Manhã", "Tarde", "Noite", "Tenho flexibilidade"],
  timingOptions: ["O quanto antes", "Ainda nesta semana", "Na próxima semana", "Estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual cuidado você quer agendar?",
    experience: "Como é seu momento hoje?",
    period: "Qual período funciona melhor?",
    timing: "Quando gostaria de vir?",
    note: "Conte um pouco mais",
  },
  notePlaceholder: "Ex.: procedimento desejado, referência, data ou dúvida antes de agendar.",
};

function CTA({ children, location }: { children: React.ReactNode; location: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="catharine-lima-studio"
      studioName="Catharine Lima Studio"
      recipientName="Catharine Lima Studio"
      theme="pink"
      mode="booking"
      funnelIntent="agendamento"
      quizConfig={quiz}
      ariaLabel="Solicitar agendamento no Catharine Lima Studio"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e45c8d] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#e45c8d]/25 transition hover:-translate-y-0.5 hover:bg-[#f06f9e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7abc5]"
      onOpen={() => { void location; }}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const services = [
  ["Alongamento", "Unhas", "Comprimento e formato para uma produção mais marcante."],
  ["Banho em gel", "Unhas", "Acabamento em gel para realçar o visual das unhas."],
  ["Pé em gel", "Pés", "Cuidado com acabamento em gel para os pés."],
  ["Volume brasileiro", "Cílios", "Extensão para destacar o olhar com mais presença."],
  ["Progressiva", "Cabelo", "Procedimento capilar divulgado pelo Studio."],
];

const faqs = [
  ["Como faço para agendar?", "Use o botão de agendamento, informe o procedimento e o melhor período. A disponibilidade é confirmada no atendimento."],
  ["A promoção para novas clientes ainda está válida?", "A publicação do Studio anuncia condições especiais para a primeira visita. Consulte pelo agendamento porque disponibilidade e condições podem mudar."],
  ["Quais serviços aparecem na divulgação?", "Alongamento, banho em gel, pé em gel, volume brasileiro e progressiva."],
  ["Onde fica o Studio?", "Na Rua Victor Alves Ferreira, 211, em São José dos Pinhais — PR."],
];

export function CatharineLimaStudioPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#140d12] text-[#fff7fa]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#140d12]/88 px-5 py-4 backdrop-blur-xl lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#inicio" className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[.28em] text-[#f5a9c2]">Beauty studio</p>
            <p className="truncate font-display text-xl font-bold">Catharine Lima <span className="text-[#e45c8d]">Studio</span></p>
          </a>
          <nav className="hidden gap-6 text-sm font-semibold text-white/65 md:flex">
            <a href="#servicos" className="hover:text-white">Serviços</a>
            <a href="#primeira-visita" className="hover:text-white">Primeira visita</a>
            <a href="#localizacao" className="hover:text-white">Localização</a>
          </nav>
          <CTA location="catharine_header">Agendar <ArrowRight className="h-4 w-4" /></CTA>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative overflow-hidden px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#e45c8d]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#7d5cff]/12 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f5a9c2]/25 bg-[#f5a9c2]/8 px-4 py-2 text-xs font-bold text-[#ffc8da]">
                <Sparkles className="h-4 w-4" />
                Condições especiais divulgadas para novas clientes
              </div>
              <h1 className="mt-6 max-w-2xl font-display text-5xl font-black leading-[.95] sm:text-7xl">
                Seu momento de beleza pode começar <span className="text-[#f183a8]">agora.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/67">
                Catharine Lima Studio reúne cuidados para unhas, cílios e cabelo com atendimento por agendamento em São José dos Pinhais.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA location="catharine_hero">Quero agendar meu horário <ArrowRight className="h-4 w-4" /></CTA>
                <a href="#servicos" className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white/85 hover:bg-white/5">Ver serviços</a>
              </div>
              <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                  <Check className="h-5 w-5 text-[#f183a8]" />
                  <p className="mt-3 text-sm font-bold">Primeira visita</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">A divulgação informa valores especiais para clientes novas.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                  <CalendarDays className="h-5 w-5 text-[#f183a8]" />
                  <p className="mt-3 text-sm font-bold">Agenda pelo funil</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">Escolha o procedimento e informe quando deseja atendimento.</p>
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 22, rotate: 1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .7 }} className="relative">
              <div className="absolute -inset-4 rounded-[2.4rem] bg-gradient-to-br from-[#e45c8d]/30 via-transparent to-[#7d5cff]/15 blur-2xl" />
              <PortfolioImage src="/images/catharine-lima-studio/hero-editorial.svg" alt="Composição editorial de beleza para o Catharine Lima Studio" priority width={1200} height={1400} className="relative w-full rounded-[2.2rem] border border-white/10 object-cover shadow-2xl shadow-black/40" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-[#160d13]/88 p-4 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#f5a9c2]">Mídia editorial</p>
                <p className="mt-1 text-sm text-white/70">Visual contextual criado para a página; não representa foto real do estabelecimento.</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="servicos" className="bg-[#fff4f7] px-5 py-20 text-[#2f1720] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[.2em] text-[#b13d68]">Cuidados divulgados</p>
                <h2 className="mt-3 font-display text-4xl font-black sm:text-5xl">Escolha por onde começar.</h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-[#6d4b58] lg:justify-self-end">A página usa somente os procedimentos informados na divulgação do Studio. Valores e disponibilidade são confirmados no atendimento.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {services.map(([name, category, detail], index) => (
                <motion.article key={name} whileHover={{ y: -6 }} className="rounded-3xl border border-[#ead4dc] bg-white p-6 shadow-sm">
                  <span className="text-xs font-black uppercase tracking-[.18em] text-[#b13d68]">{category}</span>
                  <p className="mt-8 text-xs font-bold text-[#c990a4]">0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-black">{name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#765765]">{detail}</p>
                  <div className="mt-6"><CTA location={`catharine_service_${index + 1}`}>Consultar horário <ArrowRight className="h-4 w-4" /></CTA></div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="primeira-visita" className="px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[.2em] text-[#f5a9c2]">Para conhecer o Studio</p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-black sm:text-5xl">Uma primeira visita com caminho simples.</h2>
              <div className="mt-9 space-y-5">
                {[
                  ["01", "Escolha seu cuidado", "Selecione unhas, cílios ou cabelo no formulário."],
                  ["02", "Conte sua preferência", "Diga se é primeira vez, manutenção ou se quer orientação."],
                  ["03", "Peça seu horário", "Informe o melhor período e aguarde a confirmação do atendimento."],
                ].map(([n, title, text]) => (
                  <div key={n} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e45c8d] text-sm font-black">{n}</span>
                    <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-white/58">{text}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2.2rem] border border-[#f5a9c2]/20 bg-gradient-to-b from-[#2a1520] to-[#1b1117] p-8 shadow-2xl">
              <WandSparkles className="h-9 w-9 text-[#f183a8]" />
              <h3 className="mt-6 font-display text-3xl font-black">Clientes novas: consulte as condições da primeira visita.</h3>
              <p className="mt-4 leading-7 text-white/64">A divulgação compartilhada informa promoção para novas clientes e vagas limitadas. Como campanhas podem mudar, o funil confirma disponibilidade e condição atual.</p>
              <div className="mt-8"><CTA location="catharine_first_visit">Consultar e agendar <ArrowRight className="h-4 w-4" /></CTA></div>
            </div>
          </div>
        </section>

        <section className="bg-[#2a1520] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b1117]">
                <PortfolioImage src="/images/catharine-lima-studio/beauty-editorial.svg" alt="Composição editorial contextual de unhas e cílios" width={1200} height={900} className="w-full object-cover" />
              </div>
              <div className="grid content-center gap-5 rounded-[2rem] border border-white/10 bg-white/[.035] p-8">
                <Eye className="h-8 w-8 text-[#f183a8]" />
                <h2 className="font-display text-4xl font-black">Unhas, cílios e cabelo na mesma conversa.</h2>
                <p className="leading-7 text-white/64">O Studio divulga serviços em diferentes frentes de beleza. O formulário organiza a solicitação para você chegar ao atendimento já dizendo o que procura.</p>
                <div><CTA location="catharine_editorial">Iniciar agendamento <ArrowRight className="h-4 w-4" /></CTA></div>
              </div>
            </div>
          </div>
        </section>

        <section id="localizacao" className="bg-[#f2a6bf] px-5 py-16 text-[#321722] lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[.2em] text-[#7f2949]">Atendimento presencial</p>
              <h2 className="mt-3 font-display text-4xl font-black">Catharine Lima Studio em São José dos Pinhais.</h2>
              <p className="mt-4 flex items-start gap-2 text-lg font-bold"><MapPin className="mt-1 h-5 w-5 shrink-0" />Rua Victor Alves Ferreira, 211<br />São José dos Pinhais — PR</p>
            </div>
            <CTA location="catharine_location">Quero um horário <ArrowRight className="h-4 w-4" /></CTA>
          </div>
        </section>

        <section className="bg-[#fff4f7] px-5 py-20 text-[#2f1720] lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[.2em] text-[#b13d68]">Dúvidas rápidas</p>
            <h2 className="mt-3 font-display text-4xl font-black">Antes de agendar.</h2>
            <div className="mt-8 divide-y divide-[#ead4dc] rounded-3xl border border-[#ead4dc] bg-white px-6">
              {faqs.map(([q, a]) => <details key={q} className="group py-5"><summary className="cursor-pointer list-none font-bold">{q}</summary><p className="mt-3 max-w-3xl text-sm leading-7 text-[#765765]">{a}</p></details>)}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0d080b] px-5 py-9 text-sm text-white/55 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">Catharine Lima <span className="text-[#f183a8]">Studio</span></p>
            <p className="mt-1">Agendamento de serviços de beleza em São José dos Pinhais.</p>
            <a href="https://www.facebook.com/caah.lima.39" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#f5a9c2] hover:underline">Perfil público informado <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#f183a8]" />
        </div>
      </footer>
      <PortfolioUpsellPopup pageName="portfolio-catharine-lima-studio" />
    </div>
  );
}
