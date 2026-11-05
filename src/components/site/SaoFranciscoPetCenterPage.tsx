import { useCallback, useEffect, useRef, useState, type MouseEventHandler, type ReactNode } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, X,
  Heart, Instagram, MapPin, PawPrint, ShieldCheck, Sparkles, Star, Sun, Waves,
} from "lucide-react";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import "./sao-francisco-pet-center.css";

const FORM_URL = "https://form.jotform.com/263077982107059";
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Rua%20Jo%C3%A3o%20%C3%82ngelo%20Cordeiro%201616%20Bom%20Jesus%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%20PR";
const MAP_EMBED_URL = "https://www.google.com/maps?q=Rua%20Jo%C3%A3o%20%C3%82ngelo%20Cordeiro%2C%201616%2C%20Bom%20Jesus%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%2C%20PR&output=embed";
const INSTAGRAM = "https://www.instagram.com/saofrancisco_petcenterhotel/";
const SOURCE_REVIEWS = "https://www.tutorcanino.com.br/creches/pr/sao-jose-dos-pinhais/sao-francisco-pet-center-hotel-sao-jose-dos-pinhais";
const HERO = "https://images.unsplash.com/photo-1657318216069-399acfda68d1?auto=format&fit=crop&w=1300&q=85";
const SMALL_DOG = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=850&q=82";
const DOG_RUN = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=82";

function Cta({ children, secondary = false, onClick }: { children: ReactNode; secondary?: boolean; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return <a href="#solicitar" onClick={onClick} className={secondary ? "sfp-button sfp-button-ghost" : "sfp-button"}>
    {children} <ArrowUpRight aria-hidden="true" size={18}/>
  </a>;
}

export function SaoFranciscoPetCenterPage() {
  const [funnelOpen, setFunnelOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const openFunnel = useCallback(() => {
    if (typeof window === "undefined") return;
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    window.dispatchEvent(new CustomEvent("0web:portfolio-funnel-open"));
    setFunnelOpen(true);
  }, []);

  const closeFunnel = useCallback(() => {
    setFunnelOpen(false);
    window.dispatchEvent(new CustomEvent("0web:portfolio-funnel-close"));
    lastFocusRef.current?.focus();
  }, []);

  const onFunnelClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openFunnel();
  };

  // A captação do cliente tem prioridade sobre o pop-up da 0WEB.
  useEffect(() => {
    if (!funnelOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(
      modalRef.current?.querySelectorAll<HTMLElement>('button, a[href], iframe, [tabindex]:not([tabindex="-1"])') ?? [],
    ).filter((el) => !el.hasAttribute("disabled"));
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFunnel();
      }
      if (event.key !== "Tab") return;
      const elements = focusables();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !modalRef.current?.contains(active))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault(); first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey, true);
    };
  }, [funnelOpen, closeFunnel]);

  return (
    <div className="sfp-site" lang="pt-BR">
      <div className="sfp-demo"><Sparkles size={14} aria-hidden="true" /> Projeto demonstrativo da 0WEB · Não é o site oficial do estabelecimento</div>
      <header className="sfp-header">
        <a href="#inicio" className="sfp-brand" aria-label="São Francisco Pet Center, voltar ao início">
          <span className="sfp-brandmark"><PawPrint size={27} strokeWidth={1.9}/></span>
          <span className="sfp-brandname">SÃO FRANCISCO <small>PET CENTER</small></span>
        </a>
        <nav className="sfp-nav" aria-label="Navegação principal">
          <a href="#experiencias">Experiências</a><a href="#cuidado">Nosso propósito</a><a href="#localizacao">Visite</a>
        </nav>
        <Cta onClick={onFunnelClick}>Solicitar informações</Cta>
      </header>

      <main id="inicio">
        <section className="sfp-hero" aria-labelledby="sfp-title">
          <div className="sfp-hero-copy">
            <div className="sfp-eyebrow"><span className="sfp-eyebrow-line"/> PET CENTER · BOM JESUS · SÃO JOSÉ DOS PINHAIS</div>
            <h1 id="sfp-title">O mundo fica melhor <em>com patas por perto.</em></h1>
            <p className="sfp-hero-lede">Um lugar para conhecer opções de creche, hospedagem e cuidados com seu melhor amigo — com toda a alegria que faz parte da vida com pets.</p>
            <div className="sfp-hero-actions"><Cta onClick={onFunnelClick}>Consultar disponibilidade</Cta><a className="sfp-text-link" href="#experiencias">Explore o Pet Center <ArrowDownRight size={19}/></a></div>
            <div className="sfp-hero-proof">
              <span className="sfp-proof-stars" aria-label="4,8 de 5 estrelas">★★★★★</span>
              <a href={SOURCE_REVIEWS} target="_blank" rel="noopener noreferrer"><b>4,8/5</b> · 137 avaliações públicas <ArrowUpRight size={14}/></a>
            </div>
          </div>
          <div className="sfp-hero-art">
            <div className="sfp-hero-photo">
              <img src={HERO} alt="Imagem ilustrativa de um golden retriever feliz deitado em um gramado. Não representa o espaço do Pet Center." fetchPriority="high" decoding="async"/>
            </div>
            <span className="sfp-hero-stamp"><PawPrint size={28}/><b>PARA QUEM<br/>AMA PETS</b></span>
            <span className="sfp-hero-photo-caption">FOTO EDITORIAL ILUSTRATIVA · UNSPLASH</span>
            <span className="sfp-big-number">01<span>/ 04</span></span>
          </div>
          <div className="sfp-vertical-note">MAIS VIDA EM CADA ENCONTRO — SÃO JOSÉ DOS PINHAIS</div>
        </section>

        <section className="sfp-ribbon" aria-label="Destaques">
          <div><Sun size={22}/><span>Tempo de brincar</span></div><span className="sfp-dot">✳</span>
          <div><Heart size={22}/><span>Cuidado e carinho</span></div><span className="sfp-dot">✳</span>
          <div><PawPrint size={22}/><span>Momentos com pets</span></div>
        </section>

        <section id="experiencias" className="sfp-section sfp-services" aria-labelledby="sfp-experiences">
          <div className="sfp-section-head">
            <div><p className="sfp-kicker">O QUE VOCÊ ENCONTRA POR AQUI</p><h2 id="sfp-experiences">Um espaço para <em>cada momento.</em></h2></div>
            <p>Do dia a dia às ocasiões em que você precisa viajar, conheça os serviços divulgados pelo São Francisco Pet Center.</p>
          </div>
          <div className="sfp-service-grid">
            <article className="sfp-service sfp-service-one">
              <span className="sfp-index">01 / CONVIVÊNCIA</span><Sun size={45} strokeWidth={1.3} aria-hidden="true"/>
              <div><h3>Creche pet</h3><p>Para tutores que buscam uma rotina de atividades e convivência para seus cães. Consulte condições e disponibilidade.</p><a href="#solicitar" onClick={onFunnelClick}>Consultar creche <ArrowUpRight size={19}/></a></div>
            </article>
            <article className="sfp-service sfp-service-two">
              <span className="sfp-index">02 / ESTADIA</span><span className="sfp-service-large">GOOD<br/>STAY.</span>
              <div><h3>Hotel pet</h3><p>Vai viajar ou passar alguns dias fora? Solicite informações sobre hospedagem, avaliação e regras de estadia.</p><a href="#solicitar" onClick={onFunnelClick}>Consultar hotel <ArrowUpRight size={19}/></a></div>
            </article>
            <article className="sfp-service sfp-service-three">
              <span className="sfp-index">03 / BEM-ESTAR</span><Waves size={47} strokeWidth={1.3} aria-hidden="true"/>
              <div><h3>Banho e tosa</h3><p>Cuidados de higiene e embelezamento para deixar o pet confortável. Valores e horários sob consulta.</p><a href="#solicitar" onClick={onFunnelClick}>Solicitar informações <ArrowUpRight size={19}/></a></div>
            </article>
          </div>
        </section>

        <section id="cuidado" className="sfp-story" aria-labelledby="sfp-care">
          <div className="sfp-story-visual">
            <img src={SMALL_DOG} loading="lazy" decoding="async" alt="Fotografia editorial ilustrativa de cachorro. A imagem não foi feita no São Francisco Pet Center."/>
            <div className="sfp-story-bubble"><Heart size={23}/><span>Pequenos gestos.<br/><b>Grandes amizades.</b></span></div>
          </div>
          <div className="sfp-story-content">
            <p className="sfp-kicker">QUANDO O ASSUNTO É SEU PET</p>
            <h2>Um cuidado que começa na <em>conversa.</em></h2>
            <p>Escolher creche ou hotel para um animal é uma decisão importante. Por isso, antes de agendar, vale entender a rotina, os critérios de adaptação e as necessidades específicas do seu companheiro.</p>
            <ul>
              <li><Check size={18}/> Pergunte sobre a adaptação do pet</li>
              <li><Check size={18}/> Confirme requisitos de saúde e documentação</li>
              <li><Check size={18}/> Consulte disponibilidade para as datas desejadas</li>
            </ul>
            <Cta secondary onClick={onFunnelClick}>Quero tirar minhas dúvidas</Cta>
          </div>
        </section>

        <section className="sfp-how" aria-labelledby="sfp-how-title">
          <p className="sfp-kicker">SIMPLES DE COMEÇAR</p>
          <h2 id="sfp-how-title">Seu próximo passo,<br/><em>sem complicação.</em></h2>
          <div className="sfp-how-grid">
            <div><span>01</span><CalendarDays size={32}/><h3>Escolha um serviço</h3><p>Hotel, creche ou banho e tosa. Informe o que você precisa.</p></div>
            <div><span>02</span><PawPrint size={32}/><h3>Conte sobre seu pet</h3><p>Nome, porte, datas de interesse e observações relevantes.</p></div>
            <div><span>03</span><ShieldCheck size={32}/><h3>Registre o interesse</h3><p>O formulário guarda sua solicitação para avaliação. Não confirma reserva.</p></div>
          </div>
        </section>

        <section className="sfp-photostrip" aria-label="Inspiração visual">
          <div className="sfp-photostrip-media"><img loading="lazy" decoding="async" src={DOG_RUN} alt="Fotografia ilustrativa de cão ao ar livre, não registrada no estabelecimento"/></div>
          <div className="sfp-photostrip-copy"><PawPrint size={41}/><h2>Para os dias que merecem <em>mais alegria.</em></h2><p>O primeiro passo para saber mais está logo abaixo.</p><a href="#solicitar" onClick={onFunnelClick}>Conversar sobre meu pet <ArrowRight size={19}/></a></div>
        </section>

        <section id="localizacao" className="sfp-location">
          <div><p className="sfp-kicker">ENCONTRE O PET CENTER</p><h2>Pertinho de quem <em>ama pets.</em></h2><p className="sfp-address"><MapPin size={25}/><span>Rua João Ângelo Cordeiro, 1616<br/>Bom Jesus · São José dos Pinhais, PR<br/>CEP 83025-120</span></p>
            <p className="sfp-hours"><Clock3 size={19}/> Horários variam entre os diretórios consultados. Confirme antes de visitar.</p>
            <a className="sfp-map-button" href={MAP_URL} target="_blank" rel="noopener noreferrer">Traçar rota no Google Maps <ArrowUpRight size={20}/></a>
          </div>
          <div className="sfp-map-panel">
            <iframe
              title="Mapa do endereço informado para o São Francisco Pet Center em São José dos Pinhais"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a className="sfp-map-open" href={MAP_URL} target="_blank" rel="noopener noreferrer">
              Abrir no Google Maps <ArrowUpRight size={16} aria-hidden="true"/>
            </a>
          </div>
        </section>

        <section id="solicitar" className="sfp-contact" aria-labelledby="sfp-contact-title">
          <div className="sfp-contact-info">
            <p className="sfp-kicker">CONTE PRA GENTE</p><h2 id="sfp-contact-title">Vamos falar <em>sobre seu pet?</em></h2>
            <p>Conte qual serviço despertou seu interesse. Esta experiência demonstrativa da 0WEB registra suas informações em um formulário seguro; não efetua agendamento e ainda não representa um canal oficial da empresa.</p>
            <div className="sfp-contact-points"><span><Check size={17}/> Formulário com registro de solicitação</span><span><Check size={17}/> Sem cobrança ou reserva automática</span><span><Check size={17}/> Consentimento antes do envio</span></div>
            <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className="sfp-form-fallback">Abrir formulário em outra aba <ArrowUpRight size={18}/></a>
          </div>
          <div className="sfp-form-frame">
            <div className="sfp-form-top"><PawPrint size={21}/> Solicitar informações <span>0WEB</span></div>
            <iframe title="Formulário demonstrativo São Francisco Pet Center — 0WEB" src={FORM_URL} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="clipboard-write" />
          </div>
        </section>

        <section className="sfp-faq" aria-labelledby="sfp-faq-title">
          <div><p className="sfp-kicker">PERGUNTAS FREQUENTES</p><h2 id="sfp-faq-title">Dúvidas de quem cuida.</h2></div>
          <div className="sfp-faq-list">
            <details><summary>Posso reservar uma hospedagem pelo site? <ArrowDownRight size={20}/></summary><p>Você pode registrar interesse no formulário demonstrativo. A disponibilidade e a reserva só poderão ser confirmadas diretamente pela empresa.</p></details>
            <details><summary>Quais são os valores de hotel e creche? <ArrowDownRight size={20}/></summary><p>Valores, planos e condições não foram confirmados. Solicite uma cotação ao estabelecimento antes de contratar.</p></details>
            <details><summary>O pet precisa passar por avaliação? <ArrowDownRight size={20}/></summary><p>Consulte as regras atuais de avaliação, adaptação, vacinação e convivência com a equipe responsável.</p></details>
            <details><summary>As fotografias são do São Francisco Pet Center? <ArrowDownRight size={20}/></summary><p>Não. As fotografias de cães nesta demonstração são imagens editoriais licenciadas do Unsplash. Fotografias oficiais podem substituí-las após validação de procedência.</p></details>
          </div>
        </section>
      </main>
      <footer className="sfp-footer">
        <div><a className="sfp-footer-brand" href="#inicio"><PawPrint size={25}/><span>SÃO FRANCISCO<br/><b>PET CENTER</b></span></a><p>Bom Jesus · São José dos Pinhais, PR</p></div>
        <div className="sfp-footer-links"><a href="#experiencias">Serviços</a><a href="#localizacao">Localização</a><a href="#solicitar">Solicitação</a><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><Instagram size={18}/> Instagram</a></div>
        <div className="sfp-footer-bottom"><p>Portfólio demonstrativo, não vinculado oficialmente ao estabelecimento. Avaliações: <a href={SOURCE_REVIEWS} target="_blank" rel="noopener noreferrer">TutorCanino</a>. Fotos ilustrativas: <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>. <a href="https://0web.com.br/lgpd">Privacidade</a>.</p><PortfolioHostCredit /></div>
      </footer>

      {funnelOpen ? (
        <div
          className="sfp-funnel-overlay"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeFunnel(); }}
        >
          <div
            ref={modalRef}
            className="sfp-funnel-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sfp-funnel-title"
            data-testid="pet-center-funnel-dialog"
          >
            <div className="sfp-funnel-heading">
              <div>
                <span className="sfp-funnel-kicker"><PawPrint size={16} aria-hidden="true"/> SÃO FRANCISCO PET CENTER · DEMONSTRAÇÃO 0WEB</span>
                <h2 id="sfp-funnel-title">Conte sobre seu pet</h2>
                <p>Registre seu interesse. O envio não confirma reservas e não representa um canal oficial do estabelecimento.</p>
              </div>
              <button type="button" aria-label="Fechar funil" onClick={closeFunnel} className="sfp-funnel-close">
                <X size={22} aria-hidden="true"/>
              </button>
            </div>
            <iframe
              src={FORM_URL}
              title="Funil de solicitação de informações São Francisco Pet Center"
              className="sfp-funnel-iframe"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="clipboard-write"
            />
            <div className="sfp-funnel-footer">
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer">Abrir formulário em outra aba <ArrowUpRight size={15}/></a>
              <span>Dados registrados no formulário seguro da 0WEB</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Captação institucional da 0WEB — uma única instância, temporizada e
          suprimida enquanto o funil do cliente estiver aberto. */}
      <PortfolioUpsellPopup pageName="portfolio-sao-francisco-pet-center" />
    </div>
  );
}
