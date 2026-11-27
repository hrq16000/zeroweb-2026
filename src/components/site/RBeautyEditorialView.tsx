import { type ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Sparkles, 
  Clock, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Check, 
  Instagram, 
  MessageCircle, 
  Star, 
  Eye, 
  Crown, 
  Gem, 
  ChevronDown, 
  Compass, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BeautyBookingQuiz as PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { InstagramFeedSection } from "@/components/site/InstagramFeedSection";

const INSTAGRAM_URL = "https://www.instagram.com/renatabeautystudiio/";
const ADDRESS = "Rua Rondônia, 300 - Boneca do Iguaçu";
const MAPS_URL = "https://maps.google.com/?q=Rua+Rond%C3%B4nia,+300+-+Boneca+do+Igua%C3%A7u";

function BeautyBookingQuiz(props: Omit<ComponentProps<typeof PortfolioCTAQuiz>, "clientKey" | "recipientName">) {
  return <PortfolioCTAQuiz clientKey="r-beauty" recipientName="Renata" {...props} />;
}

export function RBeautyEditorialView() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="portfolio-theme-rbeauty min-h-screen bg-[#0C0A0B] text-[#F5F2F0] font-sans selection:bg-[#D4AF37] selection:text-black relative overflow-hidden">

      {/* Background Ambient Lights */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-b from-[#D4AF37]/10 via-[#C07D7B]/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-10 w-[600px] h-[600px] bg-gradient-to-t from-[#C07D7B]/15 via-transparent to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Editorial Ribbon */}
      <div className="bg-[#171415] border-b border-white/5 py-2.5 px-4 text-center text-xs tracking-[0.2em] uppercase text-[#D4AF37] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" /> Edição Especial · Inauguração no Boneca do Iguaçu · Vagas Limitadas
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0C0A0B]/85 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 min-h-20 py-2 flex flex-wrap items-center justify-between gap-3">

          <Link to="/portfolio" search={{}} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-white/[0.03]">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <div className="font-serif text-xl tracking-wider text-white">
                R_BEAUTY <span className="text-[#D4AF37] font-light text-sm italic">Haute Studio</span>
              </div>
              <p className="text-[9px] tracking-[0.3em] text-gray-400 uppercase">Boneca do Iguaçu</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold tracking-widest uppercase text-gray-300">
            <a href="#experiencia" className="hover:text-[#D4AF37] transition-colors">A Experiência</a>
            <a href="#comparador" className="hover:text-[#D4AF37] transition-colors">Resultados</a>
            <a href="#menu" className="hover:text-[#D4AF37] transition-colors">Menu VIP</a>
            <a href="#localizacao" className="hover:text-[#D4AF37] transition-colors">Localização</a>
          </nav>

          <BeautyBookingQuiz studioName="R_Beauty Haute Studio" theme="gold" service="Sobrancelhas e Spa" className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C378] text-black px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform motion-safe:duration-200">
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Agendamento VIP</span>
          </BeautyBookingQuiz>

        </div>
      </header>

      {/* Hero editorial: conteúdo visível antes da hidratação */}
      <section id="inicio" style={{ animation: "none" }} className="scroll-mt-28 pt-10 pb-16 px-4 relative md:pt-16 md:pb-24">
        <div id="experiencia" className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center scroll-mt-28">

          {/* H1 da primeira dobra: permanecer visível no SSR/LCP. */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Exclusividade em Cílios & Nails
            </div>

            {/* Título editorial */}
            <h1 className="text-4xl sm:text-6xl font-serif font-light text-white leading-[1.1] tracking-tight">
              A alta costura do olhar <br />
              <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C07D7B]">
                em cada detalhe milimétrico.
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed font-light">
              Uma atmosfera acolhedora onde a técnica precisa do visagismo e produtos de padrão internacional transformam sua rotina em puro encanto.
            </p>

            {/* Offer Callout Card */}
            <div className="p-5 sm:p-6 border-y border-[#D4AF37]/45 bg-[#171315] space-y-4 max-w-xl">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Condição de Abertura</span>
                  <h2 className="text-lg font-serif font-semibold text-white">Cílios Volume Egípcio ou Brasileiro</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 line-through">R$ 180,00</span>
                  <div className="text-2xl font-serif font-bold text-[#D4AF37]">R$ 100,00</div>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-300">Confirme a validade da condição de abertura e a disponibilidade no atendimento.</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <BeautyBookingQuiz studioName="R_Beauty Haute Studio" theme="gold" className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0E7A3C] hover:bg-[#0B6431] text-white px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform motion-safe:duration-200">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Reservar Meu Horário
                </BeautyBookingQuiz>
                <a 
                  href="#comparador"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/10 transition-all"
                >
                  Ver Resultados
                </a>
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-gray-400 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Retenção até 30 dias
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Biossegurança 100%
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Visagismo sob medida
              </div>
            </div>

          </div>

          {/* Hero Visual Card */}
          <motion.figure id="localizacao" initial={reduceMotion ? false : { scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.35 }} className="lg:col-span-5 relative scroll-mt-32">
            <div className="mb-3 flex justify-between border-b border-[#D4AF37]/35 pb-3 text-[10px] uppercase tracking-[.22em] text-[#D4AF37]"><span>Convite do studio</span><span>01 / Boneca do Iguaçu</span></div>
            <div className="overflow-hidden border border-[#D4AF37]/30 p-3 bg-[#171315]">
              <div className="overflow-hidden relative bg-black">
                <img 
                  src="/images/renata-beauty-flyer.jpg" 
                  alt="Convite de inauguração do R_Beauty Studio, com oferta de cílios e endereço"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="block mx-auto h-auto max-h-[660px] w-full object-contain"
                  width={682} height={1024}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/r-beauty-cilios.jpg";
                  }}
                />
              </div>
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 p-3">
                  <div>
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-bold">Localização</span>
                    <strong className="text-xs text-white">Rua Rondônia, 300 · Boneca do Iguaçu</strong>
                  </div>
                  <a 
                    href={MAPS_URL}
                    aria-label="Abrir a localização do estúdio no Google Maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid min-h-11 min-w-11 place-items-center bg-[#D4AF37] text-black motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform motion-safe:duration-200"
                  >
                    <Compass className="w-4 h-4" />
                  </a>
            </figcaption>
          </motion.figure>

        </div>
      </section>

      {/* Resultado documentado: uma imagem, sem simular antes/depois */}
      <section id="comparador" className="scroll-mt-28 py-20 px-4 bg-[#120F10] border-y border-white/10">
        <div className="max-w-5xl mx-auto space-y-12">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold tracking-[0.3em] text-[#D4AF37] uppercase">Transformação Real</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white">
              Conheça o resultado do Volume Egípcio
            </h2>
            <p className="text-gray-400 text-sm">
              Cada aplicação é personalizada com curvatura, volume e mapeamento pensados para valorizar o seu olhar.
            </p>
          </div>

          {/* Resultado em destaque */}
          <div className="mx-auto max-w-4xl overflow-hidden border-y border-[#D4AF37]/30">
            <img
              src="/images/volume-egipcio-fios-w.jpg"
              alt="Resultado de extensão de cílios Volume Egípcio"
              className="block aspect-[3/2] w-full object-cover"
 loading="lazy" decoding="async" width={1200} height={800} />
            <div className="grid gap-3 py-6 sm:grid-cols-[.65fr_1.35fr] sm:items-start">
              <span className="w-fit border-b border-[#D4AF37]/60 pb-2 text-xs font-bold tracking-widest text-[#D4AF37]">RESULTADO EM DESTAQUE</span>
              <div><h3 className="text-2xl font-serif text-white">Volume Egípcio com leveza e definição</h3>
              <p className="mt-2 max-w-xl text-sm text-gray-200">O efeito final é personalizado após uma avaliação do olhar e da preferência de cada cliente.</p></div>
            </div>
          </div>

        </div>
      </section>

      {/* Menu of Services */}
      <section id="menu" className="scroll-mt-28 py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold tracking-[0.3em] text-[#D4AF37] uppercase">Menu de Procedimentos</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white">
              Cuidados pensados para cada momento
            </h2>
          </div>

          <div className="divide-y divide-[#D4AF37]/25 border-y border-[#D4AF37]/25">

            <div className="grid items-center gap-5 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12">
              <div className="space-y-4">
                <div className="font-mono text-xs tracking-[.25em] text-[#D4AF37]">
                  01 / OLHAR
                </div>
                <h3 className="text-xl font-serif font-semibold text-white">Extensão de Cílios</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Volume Egípcio, Brasileiro e Híbrido com retenção prolongada e mapeamento sob medida para seu olhar.
                </p>
                <div className="text-sm font-bold text-[#D4AF37]">
                  A partir de R$ 100,00 na inauguração
                </div>
              </div>
              <BeautyBookingQuiz studioName="R_Beauty Haute Studio" theme="gold" service="Cílios — Volume Egípcio ou Brasileiro" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#D4AF37]/60 bg-transparent text-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:bg-[#D4AF37] hover:text-black focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Agendar Horário <ArrowRight className="w-3.5 h-3.5" />
              </BeautyBookingQuiz>
            </div>

            <div className="grid items-center gap-5 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12">
              <div className="space-y-4">
                <div className="font-mono text-xs tracking-[.25em] text-[#D4AF37]">
                  02 / MÃOS
                </div>
                <h3 className="text-xl font-serif font-semibold text-white">Unhas & Fibra de Vidro</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Alongamento com curvatura C impecável, acabamento fino e esmaltação de alta resistência.
                </p>
                <div className="text-sm font-bold text-[#D4AF37]">
                  Alongamento, Manutenção & Blindagem
                </div>
              </div>
              <BeautyBookingQuiz studioName="R_Beauty Haute Studio" theme="gold" service="Alongamento de unhas" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#D4AF37]/60 bg-transparent text-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:bg-[#D4AF37] hover:text-black focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Agendar Horário <ArrowRight className="w-3.5 h-3.5" />
              </BeautyBookingQuiz>
            </div>

            <div className="grid items-center gap-5 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12">
              <div className="space-y-4">
                <div className="font-mono text-xs tracking-[.25em] text-[#D4AF37]">
                  03 / AUTOCUIDADO
                </div>
                <h3 className="text-xl font-serif font-semibold text-white">Sobrancelhas & Spa</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Design com visagismo, henna de alta fixação e spa dos pés revitalizante para seu momento de descanso.
                </p>
                <div className="text-sm font-bold text-[#D4AF37]">
                  Design, Henna & Spa dos Pés
                </div>
              </div>
              <BeautyBookingQuiz studioName="R_Beauty Haute Studio" theme="gold" service="Sobrancelhas e Spa" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#D4AF37]/60 bg-transparent text-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:bg-[#D4AF37] hover:text-black focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Agendar Horário <ArrowRight className="w-3.5 h-3.5" />
              </BeautyBookingQuiz>
            </div>

          </div>

        </div>
      </section>

      <InstagramFeedSection variant="editorial" />

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#080707] border-t border-white/10 text-xs text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="font-serif text-base font-bold text-white">R_BEAUTY Haute Studio</div>
            <p className="text-[11px] text-gray-400">Rua Rondônia, 300 · Boneca do Iguaçu</p>
          </div>

          <div className="flex items-center gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">
              Instagram @renatabeautystudiio
            </a>
            <span>•</span>
            <BeautyBookingQuiz studioName="R_Beauty Haute Studio" theme="gold" className="hover:text-[#D4AF37]">
              WhatsApp Direct
            </BeautyBookingQuiz>
          </div>

          <PortfolioHostCredit
            className="text-[11px]"
            linkClassName="font-semibold text-[#D4AF37] underline underline-offset-4 hover:text-[#ecd080] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          />
        </div>
      </footer>

      <PortfolioSocialProofPopup clientKey="r-beauty" eyebrow="Agenda R_Beauty" title="Atendimento dedicado a cílios, unhas, sobrancelhas e autocuidado." description="Conheça os procedimentos e escolha o melhor momento antes de conversar com a profissional." ctaLabel="Ver procedimentos" ctaHref="#menu" delayMs={6500} className="border-[#D4AF37]/30 bg-[#0C0A0B]/95 text-white" accentClassName="text-[#D4AF37]" />
      <PortfolioUpsellPopup pageName="r_beauty" />
    </div>
  );
}
