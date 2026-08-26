import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  CarFront,
  CheckCircle2,
  ClipboardList,
  Gift,
  Megaphone,
  MessageCircle,
  MapPin,
  Radio,
  Route,
  ShieldCheck,
  Store,
  Target,
  Timer,
  Users,
} from "lucide-react";
import { BeautyBookingQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";

const services = [
  { icon: CarFront, title: "Semáforo", image: "/images/dyzpromo/acao-semaforo.jpeg", text: "Abordagem organizada em cruzamentos estratégicos para gerar alcance e lembrança de marca." },
  { icon: Users, title: "Mão a mão", image: "/images/dyzpromo/panfletagem-praca.jpeg", text: "Distribuição direcionada em ruas, comércios, condomínios e pontos de grande circulação." },
  { icon: Store, title: "Cancela", image: "/images/dyzpromo/cancela-shopping.jpeg", text: "Ações em entradas e saídas de shopping centers, mercados e estacionamentos." },
  { icon: Megaphone, title: "Bandeiras e faixa", image: "/images/dyzpromo/faixa-equipe.jpeg", text: "Presença visual de alto impacto para inaugurações, ofertas e campanhas locais." },
  { icon: Gift, title: "Entrega de brindes", image: "/images/dyzpromo/entrega-residencial.jpeg", text: "Sampling e distribuição de brindes que transformam uma abordagem em experiência." },
];

const clients = [
  "Dom Meneguetto", "Interage", "Nutri Linda", "Brotherss", "Pistache", "MP Elétricos",
  "Claro", "Ortobom", "Personale", "Era Uma Vez", "Apolar", "Abaré Pizzaria",
  "Curitibana", "Dinamac", "Não + Pelo", "Frango Americano", "5àSec", "Famigla Merlini",
  "Paraná Banco", "Pé Sapeca", "Celeiro", "Kumon", "Eskimo", "Natura",
  "Casas Bahia", "Ligga Internet", "Ateky Internet", "O Boticário",
];

const areas = [
  "Santa Felicidade", "Ecoville", "Champagnat", "Água Verde", "Centro",
  "Xaxim", "Novo Mundo", "Capão Raso", "Uberaba", "Pinhais",
  "São José dos Pinhais", "Piraquara", "Bairro Alto", "Jardim das Américas",
];

const gallery = [
  { src: "/images/dyzpromo/panfletagem-praca.jpeg", alt: "Promotora D.Y.Z Promo realizando panfletagem em espaço público" },
  { src: "/images/dyzpromo/panfletagem-semaforo.jpeg", alt: "Panfletagem da D.Y.Z Promo em abordagem no trânsito" },
  { src: "/images/dyzpromo/entrega-residencial.jpeg", alt: "Equipe D.Y.Z Promo entregando material em residência" },
  { src: "/images/dyzpromo/acao-semaforo.jpeg", alt: "Ação promocional da D.Y.Z Promo no semáforo" },
  { src: "/images/dyzpromo/faixa-equipe.jpeg", alt: "Equipe D.Y.Z Promo com faixa de divulgação em Curitiba" },
  { src: "/images/dyzpromo/cancela-shopping.jpeg", alt: "Promotora D.Y.Z Promo em ação de cancela" },
  { src: "/images/dyzpromo/cancela-mall.jpeg", alt: "Panfletagem D.Y.Z Promo em centro comercial" },
  { src: "/images/dyzpromo/bandeira-centro.jpeg", alt: "Bandeira D.Y.Z Promo em ação de rua no centro" },
];

const eventFormats = [
  { icon: Users, title: "Promotores para eventos", text: "Equipe para recepção, orientação de público, credenciamento e ativação da sua marca." },
  { icon: Gift, title: "Sampling e brindes", text: "Distribuição de produtos e brindes com abordagem simpática e foco na experiência." },
  { icon: Megaphone, title: "Inaugurações e lançamentos", text: "Ações de impacto para abrir portas, apresentar novidades e gerar movimento desde o primeiro dia." },
  { icon: ClipboardList, title: "Feiras e ações no PDV", text: "Apoio no ponto de venda para destacar ofertas, explicar produtos e aproximar pessoas." },
  { icon: Radio, title: "Blitz e ativações locais", text: "Campanhas rápidas e coordenadas em rotas, bairros e pontos de grande circulação." },
  { icon: ShieldCheck, title: "Supervisão e registro", text: "Orientação da equipe e registros da execução para você acompanhar a campanha com segurança." },
];

const campaignSteps = [
  { icon: ClipboardList, number: "01", title: "Entendemos a meta", text: "Oferta, público e bairro entram no briefing antes da equipe ir para a rua." },
  { icon: Route, number: "02", title: "Desenhamos a rota", text: "Escolhemos pontos, horários e formato de abordagem para cada campanha." },
  { icon: ClipboardList, number: "03", title: "Preparamos a equipe", text: "Alinhamos uniforme, material, roteiro e a mensagem que precisa chegar ao público." },
  { icon: Radio, number: "04", title: "Colocamos em campo", text: "Promotores orientados executam a ação com presença, cuidado e consistência." },
  { icon: BarChart3, number: "05", title: "Acompanhamos a entrega", text: "Você recebe registros da operação e uma visão clara do que foi realizado." },
];

const regionalCoverage = [
  { title: "Curitiba", text: "Bairros, eixos comerciais, semáforos, shoppings e mercados.", image: "/images/dyzpromo/bandeira-centro.jpeg", badge: "Capital" },
  { title: "Região metropolitana", text: "Pinhais, São José dos Pinhais, Piraquara, Colombo e cidades próximas.", image: "/images/dyzpromo/cancela-mall.jpeg", badge: "Sob consulta" },
  { title: "Rotas sob medida", text: "Definimos os pontos conforme o público, o objetivo e o raio da campanha.", image: "/images/dyzpromo/faixa-equipe.jpeg", badge: "Planejamento" },
];

const impactPoints = [
  { icon: Target, value: "Público certo", text: "Ação desenhada para o bairro e o perfil da sua oferta." },
  { icon: Timer, value: "Resposta rápida", text: "Briefing objetivo, equipe alinhada e campanha pronta para sair." },
  { icon: ShieldCheck, value: "Presença confiável", text: "Promotores identificados, orientados e cuidadosos com a sua marca." },
];

function DyzCTA({ label, className }: { label: string; className?: string }) {
  return (
    <BeautyBookingQuiz
      clientKey="dyzpromo"
      studioName="D.Y.Z Promo"
      recipientName="Denis"
      theme="gold"
      mode="proposal"
      service="Divulgação e panfletagem"
      className={className}
      ariaLabel={label}
    >
      {label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </BeautyBookingQuiz>
  );
}

function DyzHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#071b49]/95 text-white backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <a href="#inicio" className="flex items-center gap-3" aria-label="D.Y.Z Promo — início">
          <span className="inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 shadow-[0_4px_18px_rgba(0,0,0,0.2)] ring-1 ring-white/40 sm:px-3">
            <img src="/images/dyzpromo/logo-dyz-promo.png" alt="D.Y.Z Promo — divulgação em campo" className="h-10 w-auto object-contain sm:h-11" />
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-blue-100 md:flex" aria-label="Navegação D.Y.Z Promo">
          <a href="#servicos" className="hover:text-white">Serviços</a><a href="#cobertura" className="hover:text-white">Cobertura</a><a href="#galeria" className="hover:text-white">Ações reais</a><a href="#clientes" className="hover:text-white">Clientes</a>
        </nav>
        <DyzCTA label="Solicitar proposta" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f7c948] px-5 py-3 text-sm font-bold text-[#10295d] shadow-lg transition hover:bg-[#ffe08a]" />
      </div>
    </header>
  );
}

function DyzFooter() {
  return <footer className="border-t border-white/10 bg-[#061536] px-5 py-10 text-blue-100"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"><p><strong className="text-white">D.Y.Z Promo</strong> · Divulgação e panfletagem em Curitiba e região.</p><p className="text-xs text-blue-200/80">Página demonstrativa criada pela 0WEB.</p></div></footer>;
}

function DyzFloatingCTA() {
  return (
    <BeautyBookingQuiz
      clientKey="dyzpromo"
      studioName="D.Y.Z Promo"
      recipientName="Denis"
      theme="gold"
      mode="proposal"
      service="Divulgação e panfletagem"
      className="group fixed bottom-5 right-5 z-40 inline-flex min-h-14 items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_35px_rgba(37,211,102,0.35)] transition hover:scale-105 hover:bg-[#20ba5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#061536] sm:pr-5"
      ariaLabel="Falar com Denis pelo WhatsApp"
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/20">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/20" aria-hidden="true" />
        <MessageCircle className="relative h-5 w-5" aria-hidden="true" />
      </span>
      <span className="hidden sm:inline">Falar com o Denis</span>
      <span className="sr-only sm:hidden">Falar com o Denis</span>
    </BeautyBookingQuiz>
  );
}

export function DyzPromoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DyzHeader />
      <main>
        <section id="inicio" className="relative overflow-hidden bg-[#061536] text-white pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--primary)/0.28),transparent_35%),radial-gradient(circle_at_90%_10%,hsl(var(--accent)/0.16),transparent_30%)]" aria-hidden="true" />
          <motion.div animate={{ x: [0, 24, 0], y: [0, -16, 0], scale: [1, 1.08, 1] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
          <motion.div animate={{ x: [0, -20, 0], y: [0, 18, 0], scale: [1, 0.92, 1] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#f7c948]/10 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <Megaphone className="h-4 w-4" aria-hidden="true" /> Marketing promocional
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Sua marca na rua, na memória e no próximo cliente.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
                A D.Y.Z Promo leva campanhas para onde as pessoas estão: com equipes preparadas, distribuição direcionada e presença que faz sua oferta ser percebida.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <DyzCTA label="Solicitar proposta" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f7c948] px-6 py-3.5 font-bold text-[#10295d] shadow-[0_0_35px_rgba(247,201,72,0.3)] transition hover:bg-[#ffe08a]" />
                <a href="#servicos" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  Conhecer ações
                </a>
              </div>
              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-3">
                {["Equipe em campo", "Ações sob medida", "Curitiba e região"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" aria-hidden="true" /> {item}
                  </div>
                ))}
              </div>
              <motion.a href="#servicos" animate={{ y: [0, 6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200 hover:text-white">Veja como a D.Y.Z atua <ArrowRight className="h-4 w-4 rotate-90" aria-hidden="true" /></motion.a>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.94, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} whileHover={{ y: -6 }} className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-[#1e5edb]/20 blur-2xl" aria-hidden="true" />
              <div className="relative grid grid-cols-5 grid-rows-5 gap-3 rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
                <img src="/images/dyzpromo/faixa-equipe.jpeg" alt="Equipe D.Y.Z Promo em ação de rua" className="col-span-3 row-span-3 h-full min-h-48 w-full rounded-2xl object-cover" />
                <img src="/images/dyzpromo/panfletagem-semaforo.jpeg" alt="Panfletagem D.Y.Z Promo no trânsito" className="col-span-2 row-span-2 h-full min-h-32 w-full rounded-2xl object-cover" />
                <img src="/images/dyzpromo/cancela-mall.jpeg" alt="Ação D.Y.Z Promo em centro comercial" className="col-span-2 row-span-3 h-full min-h-48 w-full rounded-2xl object-cover" />
                <div className="col-span-3 row-span-2 flex flex-col justify-center rounded-2xl bg-[#f7c948] p-5 text-[#10295d] shadow-lg"><p className="text-3xl font-black leading-none">+ alcance</p><p className="mt-2 text-sm font-semibold">presença que sua oferta merece.</p></div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0a204f] px-5 py-6 text-white" aria-label="Diferenciais da D.Y.Z Promo">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3 sm:gap-6">
            {impactPoints.map(({ icon: Icon, value, text }) => (
              <motion.div key={value} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f7c948] text-[#10295d]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div><p className="font-bold">{value}</p><p className="mt-1 text-xs leading-relaxed text-blue-100">{text}</p></div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="servicos" className="bg-[#f5f7fb] px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Ações que movimentam</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Divulgação do jeito que sua campanha precisa</h2>
              <p className="mt-4 text-muted-foreground">Do impacto rápido no semáforo à experiência de entregar um brinde: combinamos canais, locais e equipe para cada objetivo.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {services.map(({ icon: Icon, title, text, image }, index) => (
                <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -7, scale: 1.015 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.07, duration: 0.45 }} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-primary/50 hover:shadow-elegant">
                  <div className="relative h-32 overflow-hidden"><img src={image} alt={title + " — D.Y.Z Promo"} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" /><div className="absolute bottom-3 left-4 grid h-10 w-10 place-items-center rounded-xl bg-[#f7c948] text-[#10295d]"><Icon className="h-5 w-5" aria-hidden="true" /></div></div>
                  <div className="p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:py-24" aria-labelledby="dyz-eventos-title">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Além da panfletagem</span>
                <h2 id="dyz-eventos-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Sua campanha também pode virar experiência.</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">Para eventos, inaugurações e ativações, a D.Y.Z combina pessoas, roteiro e presença para a marca ser lembrada depois que a ação termina.</p>
              </div>
              <DyzCTA label="Conversar sobre meu evento" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#10295d] px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#1e5edb]" />
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eventFormats.map(({ icon: Icon, title, text }, index) => (
                <motion.article key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-primary/40 hover:bg-white hover:shadow-lg">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e7efff] text-[#1e5edb]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="cobertura" className="relative overflow-hidden bg-[#f4f8f7] px-5 py-20 sm:py-24" aria-labelledby="dyz-cobertura-title">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,118,110,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Presença regional</span>
              <h2 id="dyz-cobertura-title" className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Atendimentos em Curitiba e região metropolitana.</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">Conhecemos a dinâmica de cada rota e montamos uma operação proporcional ao seu público, ao seu bairro e à sua campanha.</p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {regionalCoverage.map(({ title, text, image, badge }, index) => (
                <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: index * 0.08 }} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden sm:h-56"><img src={image} alt={title + " — cobertura D.Y.Z Promo"} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" /><div className="absolute bottom-4 left-5 flex items-center gap-2 text-lg font-bold text-white"><MapPin className="h-5 w-5 text-emerald-300" aria-hidden="true" />{title}</div></div>
                  <div className="p-5"><p className="text-sm leading-relaxed text-slate-600">{text}</p><span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{badge}</span></div>
                </motion.article>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-white/80 p-5 text-center sm:flex-row sm:text-left"><p className="text-sm text-slate-600">Não encontrou sua cidade? Verificamos a disponibilidade da equipe para novas rotas.</p><DyzCTA label="Consultar minha região" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700" /></div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#071b49] px-5 py-20 text-white sm:py-24" aria-labelledby="dyz-process-title">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#1e5edb]/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#f7c948]">Uma operação que se move</span>
              <h2 id="dyz-process-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Da ideia à rua, cada detalhe tem um próximo passo.</h2>
              <p className="mt-5 max-w-xl leading-relaxed text-blue-100">A D.Y.Z transforma uma campanha em presença real — com planejamento, equipe e execução que respeitam o momento da sua marca.</p>
              <DyzCTA label="Planejar minha campanha" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f7c948] px-6 py-3.5 font-bold text-[#10295d] transition hover:bg-[#ffe08a]" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {campaignSteps.map(({ icon: Icon, number, title, text }, index) => (
                <motion.article key={number} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between"><Icon className="h-6 w-6 text-[#f7c948]" aria-hidden="true" /><span className="text-xs font-black tracking-[0.2em] text-blue-200">{number}</span></div>
                  <h3 className="mt-8 font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-blue-100">{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/40 px-5 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Operação com cuidado</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Cada ação começa com um bom planejamento</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">A equipe entende o objetivo, escolhe os pontos e executa a campanha com orientação clara para representar bem a sua marca.</p>
              <DyzCTA label="Montar minha ação" className="mt-7 inline-flex items-center gap-2 font-semibold text-primary hover:underline" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: MapPin, title: "Pontos estratégicos", text: "Bairros e locais alinhados ao público que você quer alcançar." },
                { icon: ShieldCheck, title: "Equipe orientada", text: "Abordagem respeitosa, apresentação padronizada e foco na campanha." },
                { icon: BarChart3, title: "Acompanhamento", text: "Organização para acompanhar a execução e aprender com cada ação." },
                { icon: MessageCircle, title: "Contato direto", text: "Você fala com o Denis pelo WhatsApp, sem burocracia." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-border bg-background p-5">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:py-24" aria-labelledby="dyz-plano-title">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Campanha sem improviso</span>
              <h2 id="dyz-plano-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">O que entra no planejamento da sua ação</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">Cada campanha recebe uma recomendação prática para transformar circulação em atenção — e atenção em visita, conversa ou venda.</p>
              <DyzCTA label="Quero planejar minha divulgação" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#10295d] px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#1e5edb]" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Objetivo da campanha", "Inauguração, oferta, lançamento, captação ou reforço de marca."],
                ["Pontos de contato", "Semáforos, ruas, condomínios, cancelas, shoppings e mercados."],
                ["Escala da equipe", "Quantidade de promotores e tempo de ação alinhados ao seu orçamento."],
                ["Material e abordagem", "Orientação para panfletos, brindes, faixas e uma comunicação respeitosa."],
              ].map(([title, text], index) => (
                <motion.div key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <span className="text-xs font-black tracking-[0.2em] text-[#1e5edb]">0{index + 1}</span>
                  <h3 className="mt-3 font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="galeria" className="bg-[#0d2a68] px-5 py-20 text-white sm:py-24" aria-labelledby="dyz-gallery-title">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">A D.Y.Z em campo</span>
              <h2 id="dyz-gallery-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Divulgação que acontece de verdade</h2>
              <p className="mt-4 leading-relaxed text-blue-100">Veja alguns registros de panfletagem, semáforo, cancela, faixas e ações promocionais realizadas pela equipe.</p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {gallery.map((photo) => (
                <figure key={photo.src} className="group overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg">
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105 sm:aspect-[4/3]" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="clientes" className="px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Marcas atendidas</span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Experiência em vários segmentos</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">Restaurantes, varejo, imóveis, estética, tecnologia, serviços e muito mais.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {clients.map((client) => <span key={client} className="rounded-full border border-border bg-card px-3.5 py-2 text-sm text-foreground/80">{client}</span>)}
            </div>
            <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-muted/40 py-4" aria-label="Segmentos atendidos">
              <motion.div animate={{ x: [0, -420] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }} className="flex w-max gap-3 px-4">
                {[...clients, ...clients].map((client, index) => <span key={`${client}-${index}`} className="whitespace-nowrap rounded-full bg-background px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm">{client}</span>)}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-5 py-20 text-white sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Cobertura local</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Curitiba e região com presença de verdade</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">Planeje a ação por bairro, cidade ou rota. A D.Y.Z Promo já circula por dezenas de pontos da Grande Curitiba.</p>
              <div className="mt-7 flex flex-wrap gap-2">{areas.map((area) => <span key={area} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-slate-300">{area}</span>)}</div>
            </div>
            <DyzCTA label="Falar com o Denis" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f7c948] px-6 py-3.5 font-bold text-[#10295d] transition hover:bg-[#ffe08a]" />
          </div>
        </section>

        <section className="px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Vamos colocar sua campanha em movimento?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Envie as informações básicas e receba uma conversa objetiva sobre locais, equipe e formato da ação.</p>
            <DyzCTA label="Solicitar orçamento" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f7c948] px-7 py-3.5 font-bold text-[#10295d] shadow-lg transition hover:bg-[#ffe08a]" />
            <p className="mt-5 text-xs text-muted-foreground">D.Y.Z Promo · CNPJ 68.500.745/0001-53 · Curitiba/PR</p>
          </div>
        </section>
      </main>
      <PortfolioSocialProofPopup clientKey="dyzpromo" eyebrow="D.Y.Z em campo" title="Campanhas para restaurantes, varejo, imóveis, estética e tecnologia." description="Experiência prática em Curitiba e região, com equipe orientada para cada ação." ctaLabel="Ver marcas atendidas" ctaHref="#clientes" delayMs={5000} className="border-white/15 bg-[#071b49]/95 text-white" accentClassName="text-[#f7c948]" />
      <PortfolioUpsellPopup pageName="dyzpromo" />
      <DyzFloatingCTA />
      <DyzFooter />
    </div>
  );
}

