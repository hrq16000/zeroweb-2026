import { ManagedText } from "@/components/portfolio/ManagedText";
import {
  ArrowRight,
  ExternalLink,
  Facebook,
  Gift,
  Instagram,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const INSTAGRAM_URL = "https://www.instagram.com/emporiolelecute/";
const FACEBOOK_URL = "https://www.facebook.com/emporiolelecute/";
const SITE_URL = "https://emporiolelecute.com.br/";

const categories = [
  ["Casamento & noivado", "Lembranças delicadas para celebrar cada sim."],
  ["Maternidade", "Mimos perfumados para chá de bebê e nascimento."],
  ["Datas especiais", "Presentes artesanais para surpreender com carinho."],
];

export function EmporioLelecutePage() {
  return (
    <main className="portfolio-theme-emporio min-h-screen overflow-hidden bg-[#fffaf4] text-[#35261f]">
      <section
        id="inicio"
        className="relative isolate bg-[#3d2921] px-5 pb-20 pt-16 text-[#fffaf4] sm:px-8 sm:pt-24"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,#bd866f55,transparent_38%),radial-gradient(circle_at_90%_30%,#e7c29c33,transparent_35%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8bd91]/40 bg-[#e8bd91]/10 px-4 py-2 text-xs font-bold uppercase tracking-[.22em] text-[#f4c99f]">
              <Sparkles className="h-4 w-4" /> Feito à mão em São José dos Pinhais
            </span>
            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[.98] tracking-tight sm:text-7xl">
            <ManagedText field="heroHeadline" fallback={"Lembran\u00e7as que perfumam a mem\u00f3ria."} />
          </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#f6dfca]">
            <ManagedText field="heroSubheadline" fallback={"No Emp\u00f3rio LeleCute, sabonetes, velas e presentes personalizados ganham forma para tornar sua celebra\u00e7\u00e3o inesquec\u00edvel."} />
          </p>
            <div className="flex flex-wrap gap-3">
              <PortfolioCTAQuiz
                clientKey="emporio-lelecute"
                studioName="Empório LeleCute"
                recipientName="Letícia"
                theme="gold"
                mode="proposal"
                quizConfig={{
                  services: [
                    "Lembrancinhas personalizadas",
                    "Mini-velas e sabonetes",
                    "Kit presente",
                    "Convites perfumados",
                    "Quero uma orientação",
                  ],
                  notePlaceholder: "Conte a ocasião, quantidade e data do evento.",
                }}
                ariaLabel="Pedir orçamento ao Empório LeleCute"
              >
                Pedir orçamento <ArrowRight className="h-4 w-4" />
              </PortfolioCTAQuiz>
              <a
                href={SITE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#f4c99f]/40 px-5 py-3 text-sm font-semibold text-[#f4c99f] transition hover:bg-[#f4c99f] hover:text-[#3d2921]"
              >
                Conhecer a loja <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="aspect-[4/5] rounded-[2rem] border border-[#f4c99f]/30 bg-[linear-gradient(145deg,#c88e70,#f0cda9_48%,#8b5b4d)] p-3 shadow-2xl shadow-black/30 transition duration-700 hover:-translate-y-2">
              <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/40 bg-[#fdf5e9]/90 p-7 text-[#55382c]">
                <Gift className="h-10 w-10 text-[#a55d4f]" />
                <div>
                  <p className="font-serif text-5xl leading-none">LeleCute</p>
                  <p className="mt-3 text-sm uppercase tracking-[.25em] text-[#a55d4f]">
                    carinho em cada detalhe
                  </p>
                </div>
                <p className="text-sm leading-relaxed">
                  Sabonetes artesanais · mini-velas · kits especiais
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map(([title, text]) => (
            <article
              key={title}
              className="rounded-3xl border border-[#ead8c7] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="mb-6 text-3xl">✦</p>
              <h2 className="font-serif text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#745b4d]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f1dfcf] px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#a55d4f]">
              Como funciona
            </p>
            <h2 className="mt-3 font-serif text-4xl">Do primeiro rabisco à entrega.</h2>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {["Conte sua ideia", "Aprovamos os detalhes", "Receba seu carinho"].map((step, i) => (
              <li key={step} className="rounded-2xl bg-[#fffaf4] p-5">
                <span className="text-sm font-bold text-[#a55d4f]">0{i + 1}</span>
                <p className="mt-8 font-semibold">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#3d2921] px-5 py-20 text-[#fffaf4] sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#f4c99f]">
            Acompanhe o processo real
          </p>
          <h2 className="mt-3 font-serif text-4xl">Bastidores, novidades e pedidos no Instagram</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#f6dfca]">
            Veja as criações publicadas pela própria Empório LeleCute e fale diretamente com a
            marca.
          </p>
          <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-3xl border border-[#f4c99f]/30 bg-white shadow-2xl">
            <iframe
              src={`${INSTAGRAM_URL}embed/`}
              title="Instagram oficial do Empório LeleCute"
              className="h-[620px] w-full"
              loading="lazy"
              scrolling="no"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#f4c99f]/40 px-5 py-3 text-sm font-bold text-[#f4c99f] transition hover:bg-[#f4c99f] hover:text-[#3d2921]"
            >
              <Instagram className="h-4 w-4" /> @emporiolelecute
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          </div>
        </div>
      </section>
      <footer className="bg-[#2b1d18] px-5 py-8 text-center text-sm text-[#d7b9a5]">
        <p className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4" /> São José dos Pinhais · Paraná
        </p>
        <PortfolioHostCredit className="mt-2" linkClassName="font-semibold text-[#f4dfd0] underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4dfd0]" />
      </footer>
      <PortfolioSocialProofPopup
        clientKey="emporio-lelecute"
        eyebrow="Ateliê artesanal"
        title="Transforme sua ocasião em uma lembrança única."
        description="Conte a data, a quantidade e a ideia. O Empório LeleCute prepara uma proposta personalizada para você."
        ctaLabel="Pedir orçamento"
        ctaHref="#inicio"
        delayMs={9000}
      />
      <PortfolioUpsellPopup pageName="portfolio-emporio-lelecute" />
    </main>
  );
}
