import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  CarFront,
  CheckCircle2,
  Gift,
  Megaphone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Store,
  Users,
  X,
} from "lucide-react";
import { BeautyBookingQuiz } from "@/components/site/BeautyBookingQuiz";

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

function DyzCTA({ label, className }: { label: string; className?: string }) {
  return (
    <BeautyBookingQuiz
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
          <img src="/images/dyzpromo/logo-dyz-promo.png" alt="D.Y.Z Promo — divulgação em campo" className="h-12 w-auto object-contain" />
        </a>
        <nav className="hidden items-center gap-6 text-sm text-blue-100 md:flex" aria-label="Navegação D.Y.Z Promo">
          <a href="#servicos" className="hover:text-white">Serviços</a><a href="#galeria" className="hover:text-white">Ações reais</a><a href="#clientes" className="hover:text-white">Clientes</a>
        </nav>
        <DyzCTA label="Solicitar proposta" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f7c948] px-5 py-3 text-sm font-bold text-[#10295d] shadow-lg transition hover:bg-[#ffe08a]" />
      </div>
    </header>
  );
}

function DyzFooter() {
  return <footer className="border-t border-white/10 bg-[#061536] px-5 py-10 text-blue-100"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"><p><strong className="text-white">D.Y.Z Promo</strong> · Divulgação e panfletagem em Curitiba e região.</p><p className="text-xs text-blue-200/80">Página demonstrativa criada pela 0WEB.</p></div></footer>;
}

function DyzSocialProofPopup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);
  if (!open) return null;
  return (
    <motion.aside initial={{ opacity: 0, y: 24, x: -12 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 24 }} className="fixed bottom-5 left-5 z-30 w-[min(360px,calc(100vw-2.5rem))] rounded-2xl border border-white/15 bg-[#071b49]/95 p-4 text-white shadow-2xl backdrop-blur" aria-label="Prova social da D.Y.Z Promo">
      <button type="button" onClick={() => setOpen(false)} aria-label="Fechar prova social" className="absolute right-2 top-2 rounded-full p-1.5 text-blue-200 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7c948]">D.Y.Z em campo</p>
      <p className="mt-2 text-sm font-semibold leading-snug">Campanhas para restaurantes, varejo, imóveis, estética e tecnologia.</p>
      <p className="mt-2 text-xs text-blue-200">Experiência prática em Curitiba e região, com equipe orientada para cada ação.</p>
      <a href="#clientes" onClick={() => setOpen(false)} className="mt-3 inline-flex text-xs font-bold text-[#f7c948] hover:underline">Ver marcas atendidas →</a>
    </motion.aside>
  );
}

export function DyzPromoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DyzHeader />
      <main>
        <section id="inicio" className="relative overflow-hidden bg-[#061536] text-white pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--primary)/0.28),transparent_35%),radial-gradient(circle_at_90%_10%,hsl(var(--accent)/0.16),transparent_30%)]" aria-hidden="true" />
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
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.94, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative mx-auto w-full max-w-xl">
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

        <section id="servicos" className="px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Ações que movimentam</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Divulgação do jeito que sua campanha precisa</h2>
              <p className="mt-4 text-muted-foreground">Do impacto rápido no semáforo à experiência de entregar um brinde: combinamos canais, locais e equipe para cada objetivo.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {services.map(({ icon: Icon, title, text, image }, index) => (
                <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.07, duration: 0.45 }} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant">
                  <div className="relative h-32 overflow-hidden"><img src={image} alt={title + " — D.Y.Z Promo"} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" /><div className="absolute bottom-3 left-4 grid h-10 w-10 place-items-center rounded-xl bg-[#f7c948] text-[#10295d]"><Icon className="h-5 w-5" aria-hidden="true" /></div></div>
                  <div className="p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>
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

        <section id="galeria" className="bg-[#0d2a68] px-5 py-20 text-white sm:py-24" aria-labelledby="dyz-gallery-title">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">A D.Y.Z em campo</span>
              <h2 id="dyz-gallery-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Divulgação que acontece de verdade</h2>
              <p className="mt-4 leading-relaxed text-blue-100">Veja alguns registros de panfletagem, semáforo, cancela, faixas e ações promocionais realizadas pela equipe.</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {gallery.map((photo) => (
                <figure key={photo.src} className="group overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg">
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
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
      <DyzSocialProofPopup />
      <DyzFooter />
    </div>
  );
}

