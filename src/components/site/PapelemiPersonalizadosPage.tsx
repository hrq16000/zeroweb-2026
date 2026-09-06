import { ArrowUpRight, ExternalLink, Heart, Instagram, NotebookPen, Sparkles } from "lucide-react";
import { MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const storeUrl = "https://papelemi.lojavirtualnuvem.com.br";
const artesanouUrl = "https://artesanou.com.br/loja/papelemi";
const instagramUrl = "https://www.instagram.com/papelemi.personalizados/";
const pinterestUrl = "https://br.pinterest.com/papelemipersonalizados/";

const products = [
  { image: "/images/papelemi-personalizados/product-01.webp", title: "Mimos e lembranças", text: "Pequenos detalhes de papelaria para celebrar com afeto." },
  { image: "/images/papelemi-personalizados/product-02.webp", title: "Blocos personalizados", text: "Anotações que ganham capa, cor e intenção." },
  { image: "/images/papelemi-personalizados/product-03.webp", title: "Cadernos afetivos", text: "Presentes artesanais para guardar ideias e memórias." },
  { image: "/images/papelemi-personalizados/product-04.webp", title: "Planners e listas", text: "Organização bonita para a rotina ficar mais leve." },
  { image: "/images/papelemi-personalizados/product-05.webp", title: "Encadernação sob medida", text: "Cadernetas, agendas e peças feitas para cada história." },
];

export function PapelemiPersonalizadosPage() {
  return (
    <MotionScope intensity="BALANCED">
      <div className="min-h-dvh overflow-hidden bg-[#f7f3ef] text-[#34465d]">
        <header className="sticky top-0 z-30 border-b border-[#dce1e7] bg-[#f7f3ef]/95 px-5 py-4 backdrop-blur lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
            <a href="#inicio" aria-label="PapeLemi Papelaria Personalizada" className="shrink-0">
              <PortfolioImage src="/images/papelemi-personalizados/logo.png" alt="PapeLemi Papelaria Personalizada" width={720} height={288} priority managedField="logoUrl" className="h-11 w-auto object-contain" />
            </a>
            <nav className="hidden gap-7 text-sm font-semibold text-[#627287] md:flex" aria-label="Navegação principal">
              <a href="#colecao" className="transition hover:text-[#cf557d]">Coleção</a>
              <a href="#feito-com-afeto" className="transition hover:text-[#cf557d]">Feito com afeto</a>
              <a href="#instagram" className="transition hover:text-[#cf557d]">Instagram</a>
            </nav>
            <a href={storeUrl} target="_blank" rel="noreferrer" data-portfolio-external-cta="papelemi-personalizados" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#34465d] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#26364a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cf557d]">Visitar loja <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative overflow-hidden px-5 py-14 lg:px-10 lg:py-24">
            <div className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#eec5d2]/35 blur-3xl" />
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.78fr_1.22fr]">
              <div className="relative z-10">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#cf557d]">Papelaria criativa · PapeLemi</p>
                <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-6 max-w-2xl font-display text-5xl font-bold leading-[.97] tracking-[-.04em] text-[#34465d] sm:text-7xl">Papelaria com afeto para guardar o que importa.</MotionReveal>
                <p className="mt-6 max-w-xl text-base leading-8 text-[#647286]">Encadernação pessoal, mimos e brindes corporativos feitos para transformar papel em memórias afetivas.</p>
                <div className="mt-8 flex flex-wrap gap-3"><a href={storeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#cf557d] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#cf557d]/20 transition hover:-translate-y-1 hover:bg-[#b94369]">Conhecer a loja <ArrowUpRight className="h-4 w-4" /></a><a href="#colecao" className="inline-flex min-h-12 items-center rounded-full border border-[#b8c4d1] px-6 py-3.5 font-bold text-[#34465d] transition hover:border-[#cf557d] hover:text-[#cf557d]">Ver inspirações</a></div>
                <div className="mt-9 flex flex-wrap gap-5 border-t border-[#dce1e7] pt-5 text-xs font-bold text-[#728095]"><span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-[#cf557d]" /> Feito à mão</span><span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#cf557d]" /> Personalizado</span><span className="inline-flex items-center gap-2"><NotebookPen className="h-4 w-4 text-[#cf557d]" /> Sob encomenda</span></div>
              </div>
              <MotionReveal variant="right" className="relative"><PortfolioImage src="/images/papelemi-personalizados/hero.png" alt="Mesa editorial com cadernos, bloco personalizado e detalhes de papelaria artesanal" priority width={1680} height={945} className="aspect-video w-full rounded-[2rem] object-cover shadow-2xl ring-1 ring-[#d8cfd0]" managedField="heroImageUrl" /><p className="mt-3 text-right text-[10px] uppercase tracking-[.16em] text-[#8b98a7]">Imagem editorial · composição inspirada no catálogo PapeLemi</p></MotionReveal>
            </div>
          </section>

          <section id="colecao" className="bg-white px-5 py-20 lg:px-10 lg:py-24"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#cf557d]">Coleção PapeLemi</p><h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-[#34465d] sm:text-5xl">Peças que começam no papel e terminam em uma lembrança.</h2></div><a href={artesanouUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-[#cf557d] hover:underline">Ver catálogo completo <ExternalLink className="h-4 w-4" /></a></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{products.map(({ image, title, text }, i) => <MotionReveal as="article" variant="up" delay={i * 70} key={title} className="group overflow-hidden rounded-[1.5rem] border border-[#e0e4e8] bg-[#fbfaf9] transition hover:-translate-y-1 hover:shadow-xl"><PortfolioImage src={image} alt={title} width={480} height={480} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" /><div className="p-5"><p className="font-display text-xl font-bold text-[#34465d]">{title}</p><p className="mt-2 text-sm leading-6 text-[#718096]">{text}</p><a href={storeUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[.14em] text-[#cf557d]">Ver na loja <ArrowUpRight className="h-3.5 w-3.5" /></a></div></MotionReveal>)}</div></div></section>

          <section id="feito-com-afeto" className="bg-[#34465d] px-5 py-20 text-white lg:px-10 lg:py-24"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#f0a6be]">Como nasce</p><h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Personalizar é deixar espaço para a história de cada pessoa.</h2><p className="mt-6 max-w-xl leading-8 text-[#d4dce5]">A PapeLemi trabalha com encadernação pessoal e brindes corporativos para datas especiais, presentes, eventos e marcas que querem sair do comum.</p><div className="mt-8 grid gap-4 sm:grid-cols-3">{[["01", "Escolha a ideia", "Caderneta, agenda, bloco ou mimo."], ["02", "Ajuste os detalhes", "Cores, tema e acabamento."], ["03", "Receba algo seu", "Uma peça feita para permanecer."]].map(([n, t, d]) => <div key={n} className="border-l-2 border-[#f0a6be] pl-4"><span className="font-mono text-sm text-[#f0a6be]">{n}</span><p className="mt-3 font-bold">{t}</p><p className="mt-2 text-xs leading-5 text-[#b8c6d4]">{d}</p></div>)}</div></div><div className="grid grid-cols-2 gap-4"><PortfolioImage src="/images/papelemi-personalizados/product-04.webp" alt="Planner e bloco personalizado em cenário floral" width={480} height={480} loading="lazy" className="aspect-square w-full rounded-[1.5rem] object-cover" /><PortfolioImage src="/images/papelemi-personalizados/product-01.webp" alt="Mimos de papelaria personalizados" width={480} height={480} loading="lazy" className="mt-10 aspect-square w-full rounded-[1.5rem] object-cover" /></div></div></section>

          <section id="instagram" className="bg-[#f0e6e9] px-5 py-20 lg:px-10 lg:py-24"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><Instagram className="mx-auto h-8 w-8 text-[#cf557d]" /><p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#cf557d]">Direto do Instagram</p><h2 className="mt-4 font-display text-4xl font-bold text-[#34465d] sm:text-5xl">As últimas 6 publicações, sempre no ritmo da PapeLemi.</h2><p className="mt-4 leading-7 text-[#68768a]">O perfil oficial é incorporado pelo próprio Instagram para manter novidades, bastidores e lançamentos atualizados.</p></div><div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-[2rem] border border-[#d6b9c3] bg-white shadow-xl"><iframe src={`${instagramUrl}embed/`} title="Seis publicações recentes do Instagram da PapeLemi" className="block h-[680px] w-full" loading="lazy" scrolling="no" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms" /></div><div className="mt-7 flex flex-wrap justify-center gap-3"><a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#cf557d] px-5 py-3 text-sm font-bold text-white hover:bg-[#b94369]"><Instagram className="h-4 w-4" /> @papelemi.personalizados</a><a href={pinterestUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#b7a1a9] px-5 py-3 text-sm font-bold text-[#34465d] hover:border-[#cf557d]">Ideias no Pinterest <ExternalLink className="h-4 w-4" /></a></div></div></section>

          <section id="contato" className="bg-[#cf557d] px-5 py-16 text-white lg:px-10 lg:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#34465d] p-8 shadow-2xl sm:p-12 lg:flex-row lg:items-center"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#f0a6be]">Encomendas e dúvidas</p><h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">Sua próxima peça começa com uma ideia.</h2><p className="mt-4 max-w-xl leading-7 text-[#d4dce5]">Consulte produtos, prazos e opções de personalização diretamente na loja PapeLemi.</p></div><a href={storeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f0a6be] px-7 py-3.5 font-bold text-[#34465d] transition hover:-translate-y-1 hover:bg-white">Abrir loja <ArrowUpRight className="h-4 w-4" /></a></div></section>
        </main>

        <footer className="border-t border-[#dce1e7] bg-[#f7f3ef] px-5 py-8 text-sm text-[#718096] lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-display font-bold text-[#34465d]">PapeLemi <span className="text-[#cf557d]">Papelaria Personalizada</span></p><p className="mt-1 text-xs">Papelaria criativa, encadernação pessoal e brindes corporativos.</p></div><div className="text-left sm:text-right"><p className="text-xs">Atendimento pela loja online</p><PortfolioHostCredit linkClassName="mt-2 inline-block font-semibold text-[#34465d] underline underline-offset-4 hover:text-[#cf557d]" /></div></div></footer>
        <PortfolioSocialProofPopup clientKey="papelemi-personalizados" eyebrow="PapeLemi" title="Uma ideia bonita merece virar papel." description="Conheça a coleção de papelaria criativa e presentes personalizados." ctaLabel="Ver coleção" ctaHref="#colecao" delayMs={10000} className="border-[#cf557d]/40 bg-[#34465d]/95 text-white" accentClassName="text-[#f0a6be]" />
        <PortfolioUpsellPopup pageName="portfolio-papelemi-personalizados" />
      </div>
    </MotionScope>
  );
}
