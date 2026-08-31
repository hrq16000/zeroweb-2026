import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowRight, Bolt, Check, ChevronRight, CircleGauge, Droplets, Hammer, PaintRoller, PanelsTopLeft, Ruler, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: ["Montagem ou desmontagem de móveis", "Pintura interna", "Reparo elétrico", "Limpeza de caixa d'água", "Instalação de cortina ou persiana", "Outro reparo residencial"],
  experienceOptions: ["Alphaville", "Curitiba", "Colombo", "Outra região"],
  periodOptions: ["Manhã", "Tarde", "Tenho flexibilidade"],
  timingOptions: ["O quanto antes", "Nesta semana", "Estou planejando"],
  stepTitles: { service: "O que você precisa resolver?", experience: "Onde será o serviço?", period: "Qual período funciona melhor?", timing: "Quando você precisa?", note: "Conte os detalhes" },
  stepSubtitles: { service: "Escolha a opção mais próxima.", experience: "A disponibilidade é confirmada no atendimento.", note: "Fotos, quantidades e medidas ajudam no orçamento." },
  notePlaceholder: "Ex.: tipo de móvel, quantidade, medidas ou o reparo necessário",
  proposalKind: "service" as const,
};

const services = [
  { title: "Montagem de móveis", text: "Montagem e desmontagem cuidadosa para mudanças, móveis novos e reorganização de ambientes.", icon: Hammer },
  { title: "Pintura interna", text: "Renovação de paredes e ambientes internos com preparação e acabamento caprichado.", icon: PaintRoller },
  { title: "Reparos elétricos", text: "Troca e ajuste de tomadas, interruptores e pequenos pontos elétricos residenciais.", icon: Bolt },
  { title: "Caixa d'água", text: "Limpeza responsável para ajudar a preservar a qualidade da água da sua casa.", icon: Droplets },
  { title: "Cortinas e persianas", text: "Instalação alinhada de cortinas, persianas, suportes e varões.", icon: PanelsTopLeft },
  { title: "Reparos em geral", text: "Ajustes e pequenas manutenções para deixar cada detalhe da casa funcionando.", icon: Wrench },
];

function CTA({ children, location }: { children: ReactNode; location: string }) {
  return <PortfolioCTAQuiz clientKey="santos-montador-de-moveis" studioName="Santos Montador de Móveis" recipientName="Santos" theme="gold" mode="proposal" quizConfig={quiz} ariaLabel={`Abrir orçamento — ${location}`} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-primary-foreground shadow-glow-primary transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring">{children}</PortfolioCTAQuiz>;
}

const reveal = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.45 } };

export function SantosMontadorDeMoveisPage() {
  return <div className="portfolio-theme-santos min-h-dvh overflow-hidden bg-background text-foreground">
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
      <a href="#inicio" aria-label="Santos Montador de Móveis — início" className="flex min-h-11 items-center gap-3 font-display font-bold"><span className="grid size-10 -rotate-2 place-items-center rounded-lg bg-primary text-lg text-primary-foreground">S</span><span className="leading-none">SANTOS <small className="block pt-1 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Montador de móveis</small></span></a>
      <nav aria-label="Navegação principal" className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground lg:flex"><a className="transition hover:text-primary" href="#servicos">Serviços</a><a className="transition hover:text-primary" href="#processo">Como funciona</a><a className="transition hover:text-primary" href="#regiao">Atendimento</a></nav>
      <CTA location="santos_header"><span className="hidden sm:inline">Pedir orçamento</span><span className="sm:hidden">Orçamento</span><ArrowRight className="size-4 transition group-hover:translate-x-1" /></CTA>
    </div></header>
    <main>
      <section id="inicio" className="relative isolate min-h-[82vh] overflow-hidden bg-secondary px-4 py-14 text-secondary-foreground md:px-8 lg:py-20">
        <PortfolioImage src="/images/santos-montador-de-moveis/hero.webp" alt="Profissional montando cuidadosamente um armário de madeira em um apartamento" priority width={1600} height={1067} className="absolute inset-0 -z-20 size-full object-cover object-[64%_center] opacity-55 lg:opacity-70" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--secondary)_0%,color-mix(in_oklab,var(--secondary)_94%,transparent)_38%,color-mix(in_oklab,var(--secondary)_32%,transparent)_72%,color-mix(in_oklab,var(--secondary)_58%,transparent)_100%)]" />
        <div aria-hidden="true" className="absolute bottom-8 left-0 h-px w-[42%] bg-primary"><span className="absolute right-0 top-1/2 size-3 -translate-y-1/2 rotate-45 bg-primary" /></div>
        <div className="mx-auto flex min-h-[68vh] max-w-7xl items-center"><div className="max-w-2xl">
          <motion.p initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-secondary/70 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-primary backdrop-blur"><Ruler className="size-4" /> Curitiba · Colombo · Alphaville</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mt-6 max-w-[12ch] font-display text-5xl font-bold leading-[.92] tracking-[-.055em] sm:text-6xl lg:text-8xl">Conte com quem <span className="text-primary">entende do assunto.</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-6 max-w-xl text-base leading-7 text-secondary-foreground/80 sm:text-lg">Montagem de móveis, pintura e reparos residenciais com qualidade, compromisso e preço justo.</motion.p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><CTA location="santos_hero">Solicitar orçamento sem compromisso <ArrowRight className="size-4 transition group-hover:translate-x-1" /></CTA><a href="#servicos" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-secondary-foreground/25 px-5 py-3.5 font-semibold transition hover:bg-secondary-foreground/10">Ver serviços <ArrowDownRight className="size-4" /></a></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-secondary-foreground/75"><span><Check className="mr-2 inline size-4 text-primary" />Atendimento combinado</span><span><Check className="mr-2 inline size-4 text-primary" />Orçamento sem compromisso</span></div>
        </div></div>
      </section>
      <section id="servicos" className="bg-surface px-4 py-20 md:px-8 lg:py-28"><div className="mx-auto max-w-7xl">
        <motion.div {...reveal} className="grid gap-6 border-b border-border pb-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-primary">Serviços para sua casa</p><h2 className="mt-4 max-w-[13ch] font-display text-4xl font-bold leading-tight sm:text-5xl">Um profissional. Várias soluções bem resolvidas.</h2></div><p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">Do móvel que chegou desmontado ao reparo que ficou para depois: explique o que precisa e organize tudo em um só atendimento.</p></motion.div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">{services.map(({ title, text, icon: Icon }, index) => <motion.article key={title} {...reveal} whileHover={{ y: -4 }} className="group relative min-h-64 bg-card p-6 transition-colors hover:bg-accent"><div className="flex items-start justify-between"><span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span><Icon className="size-7 text-primary transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" /></div><h3 className="mt-16 max-w-[15ch] text-2xl font-bold">{title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p></motion.article>)}</div>
      </div></section>
      <section id="processo" className="bg-background px-4 py-20 md:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
        <motion.div {...reveal} className="lg:sticky lg:top-28"><p className="text-xs font-bold uppercase tracking-[.22em] text-primary">Atendimento direto</p><h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Sem complicação, do pedido ao serviço.</h2><p className="mt-5 max-w-lg leading-7 text-muted-foreground">O orçamento começa com as informações certas. Fotos, medidas e uma descrição rápida ajudam a entender o serviço antes de combinar o atendimento.</p><div className="mt-8"><CTA location="santos_processo">Descrever o que preciso <ChevronRight className="size-4" /></CTA></div></motion.div>
        <ol className="border-l border-primary/40">{[["01", "Conte o serviço", "Escolha o tipo de trabalho e informe os detalhes principais."], ["02", "Envie as referências", "Fotos e medidas ajudam a avaliar materiais, ferramentas e tempo."], ["03", "Combine o atendimento", "Alinhe disponibilidade e endereço antes da execução."], ["04", "Confira o resultado", "O acabamento é revisado antes de encerrar o serviço."]].map(([number, title, text]) => <motion.li key={number} {...reveal} className="relative border-b border-border py-8 pl-8 sm:pl-12"><span className="absolute -left-4 top-8 grid size-8 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">{number}</span><h3 className="text-2xl font-bold">{title}</h3><p className="mt-2 max-w-xl leading-7 text-muted-foreground">{text}</p></motion.li>)}</ol>
      </div></section>
      <section id="regiao" className="bg-secondary px-4 py-20 text-secondary-foreground md:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div {...reveal}><CircleGauge className="size-10 text-primary" /><p className="mt-8 text-xs font-bold uppercase tracking-[.22em] text-primary">Cobertura local</p><h2 className="mt-4 max-w-[12ch] font-display text-4xl font-bold sm:text-5xl">Atendimento em Curitiba e região.</h2><p className="mt-5 max-w-xl leading-7 text-secondary-foreground/70">Serviços sob agendamento em Curitiba, Colombo e Alphaville. Informe seu bairro no orçamento para confirmar disponibilidade.</p></motion.div>
        <motion.div {...reveal} className="relative overflow-hidden rounded-2xl border border-secondary-foreground/15 bg-secondary-foreground/5 p-7 sm:p-10"><Sparkles aria-hidden="true" className="absolute -right-5 -top-5 size-32 text-primary/10" /><ShieldCheck className="size-9 text-primary" /><h3 className="mt-6 text-2xl font-bold">Qualidade, compromisso e preço justo.</h3><p className="mt-3 max-w-lg leading-7 text-secondary-foreground/70">Cada solicitação é avaliada de acordo com o serviço, o local e os detalhes informados. Você recebe um próximo passo claro, sem compromisso.</p><div className="mt-8"><CTA location="santos_regiao">Pedir meu orçamento <ArrowRight className="size-4" /></CTA></div></motion.div>
      </div></section>
    </main>
    <footer className="bg-background px-4 py-8 md:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between"><div><p className="font-display text-lg font-bold text-foreground">SANTOS <span className="text-primary">MONTADOR</span></p><p className="mt-1">Montagem, pintura e reparos residenciais.</p></div><PortfolioHostCredit linkClassName="font-semibold text-foreground underline underline-offset-4 transition hover:text-primary" /></div></footer>
    <PortfolioSocialProofPopup clientKey="santos-montador-de-moveis" eyebrow="Santos · Serviços residenciais" title="Tem algo para montar, instalar ou reparar?" description="Organize o pedido em poucos passos e receba orientação para o orçamento." ctaLabel="Ver todos os serviços" ctaHref="#servicos" delayMs={9000} className="border-primary/35 bg-secondary/95 text-secondary-foreground" accentClassName="text-primary" />
    <PortfolioUpsellPopup pageName="portfolio-santos-montador-de-moveis" />
  </div>;
}
