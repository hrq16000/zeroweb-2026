import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  Recycle,
  Shirt,
  ShoppingBag,
  X,
} from "lucide-react";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
import "./dona-garimpeira-brecho.css";

/**
 * Implementação autoral isolada. NÃO registrar esta página para publicação
 * antes de completar a origem da mídia, o funil com lead persistido, a
 * configuração privada do destino, o manifesto v4 e os gates do projeto.
 */
const SLUG = "dona-garimpeira-brecho";
export type GarimpeiraInterest = "comprar" | "vender" | "doar";

type Category = "todos" | "feminino" | "masculino" | "infantil";
type GalleryItem = {
  src: string;
  alt: string;
  category: Exclude<Category, "todos">;
  /** Endereço do post do Instagram que prova a procedência. */
  permalink: string;
};

/**
 * Preencher somente com imagens reais da Dona Garimpeira, licenciadas ou
 * autorizadas e previamente validadas. Nunca usar imagens de outro brechó.
 * Não publicar imagens só para completar a quantidade de cards.
 */
const GALLERY_ITEMS: GalleryItem[] = [];
const CATEGORIES: { value: Category; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "infantil", label: "Infantil" },
];

export const composition: PortfolioComposition = {
  slug: SLUG,
  motionIntensity: "SUBTLE",
  renderCta: ({ children, className, placement }) => (
    <InterestCta interest="comprar" placement={placement} className={className}>
      {children}
    </InterestCta>
  ),
  afterContent: <PortfolioHostCredit />,
  brief: {
    businessPersonality:
      "Acolhedora, garimpeira, consciente e próxima; um brechó de bairro com vida real.",
    creativeConcept:
      "Peças com história, novas possibilidades: uma página editorial de descobertas, não um e-commerce.",
    visualMetaphor:
      "Etiquetas de acervo, papel recortado e costuras tipográficas entre novos ciclos.",
    spatialLanguage:
      "Capítulos com recortes assimétricos, tipografia editorial e pausas amplas, sem grid de cards genérico.",
    heroConcept:
      "Título editorial ocupa a composição; selo circular de garimpo e etiqueta vertical funcionam como assinatura.",
    navigationConcept:
      "Menu compacto, três intenções visíveis de imediato e localização acessível pelo celular.",
    contentRhythm:
      "Marca e localidade, bifurcação em três jornadas, galeria com procedência, regras do garimpo, visita e dúvidas.",
    mediaNarrative:
      "Apenas fotos oficiais e autorizadas, com proporções editoriais e procedência por permalink.",
    proofNarrative:
      "Nenhum endereço, horário, política comercial ou prova operacional é divulgado sem confirmação da responsável.",
    conversionNarrative:
      "As três intenções aparecem apenas como estudo de jornada; formulários e encaminhamentos permanecem desativados.",
    motionNarrative:
      "Movimento leve de etiquetas e transições fotográficas; redução de movimento desliga os efeitos.",
    signatureMoments: [
      "Título que funciona como um pôster de brechó, com selo editorial.",
      "Três caminhos comerciais em uma fita de etiquetas numeradas.",
      "Vitrine de acervo real com zoom contextual, filtros e procedência preservada.",
      "Aviso claro de que a visita e o atendimento ainda não estão ativos.",
    ],
    compositionFingerprint: {
      heroGeometry: "full-bleed editorial poster with type-led monumental center and offset collectible stamp",
      headerTreatment: "minimal thin-wordmark bookmark header with inline jump links",
      sectionGraph: "poster-stage→triple-tag-choice→archive-contact-sheet→two-sided-policy→address-poster→faq-note",
      contentOrder: ["marca local", "três caminhos", "acervo visual", "comprar e vender", "visitar", "dúvidas"],
      gridTopology: "offset tag triptych, deliberately asymmetric scrapbook, restrained duplex policy and large closing map-like type",
      mediaDistribution: "documentary Instagram photos dominate archive only after provenance validation; type-led hero before that",
      backgroundRhythm: "ink-green paper→warm ivory→rose paper→ink-green→cream closing label",
      proofPlacement: "real address, opening hours and acceptance policies paired with corresponding decisions",
      ctaDistribution: "distinct funnel CTAs for each of three intents, plus one visit CTA at physical-address chapter",
      navigationPattern: "three simple anchors with always-visible business name",
      motionSignature: "gentle tag drift and photo swap with reduced-motion fallback",
      closingStructure: "large typographic street address and compact faq strip",
      roleGraph: ["orientação local", "auto-segmentação", "inspiração sem estoque", "expectativas práticas", "visita", "dúvidas"],
      mediaCadence: ["hero tipográfico", "etiquetas textuais", "fotografia documental", "pausa tipográfica", "convite local"],
      interactionLoci: ["três intenções", "filtro da galeria", "visualizador", "funil de consulta"],
      decisionAidPlacement: ["compra/venda/doação antes do acervo", "política de reserva junto à jornada", "horário informado perto do endereço"],
      densityRhythm: ["capa ampla", "três escolhas compactas", "mosaico", "duas colunas", "encerramento amplo"],
      mobileCompositionStrategy: "poster readable at 360px, horizontal tags become vertical stack, gallery controls keyboard/touch-friendly",
    },
  },
};

const FAQS: [string, string][] = [
  ["Este é o site oficial?", "Não. Esta é uma demonstração conceitual criada pela 0WEB e aguarda aprovação da responsável."],
  ["Posso comprar, vender ou doar por aqui?", "Não. Os três caminhos são apenas exemplos visuais; nenhum pedido, avaliação ou doação é recebido nesta versão."],
  ["Há peças disponíveis no estoque?", "Nenhum estoque ou fotografia de peças foi publicado. A galeria permanece vazia até autorização de uso das imagens."],
  ["Onde fica a loja e qual é o horário?", "Endereço, localidade, CEP e horários foram retirados desta demonstração até confirmação escrita da responsável."],
  ["Como entro em contato?", "WhatsApp, Instagram, formulário e demais encaminhamentos estão desativados nesta versão."],
];

function InterestCta({
  interest,
  placement,
  children,
  className = "dg-cta",
}: {
  interest: GarimpeiraInterest;
  placement: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button type="button" data-testid="dona-garimpeira-funnel-cta" data-intent={interest} data-placement={placement} className={className} disabled aria-disabled="true" title="Fluxo indisponível até a aprovação comercial.">
      {children}
    </button>
  );
}

function RealGallery() {
  const [category, setCategory] = useState<Category>("todos");
  const [selected, setSelected] = useState<number | null>(null);
  const visible = GALLERY_ITEMS.filter((item) => category === "todos" || item.category === category);
  const current = selected === null ? null : visible[selected];
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const originalFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selected === null) return;
    if (!originalFocusRef.current && document.activeElement instanceof HTMLElement) {
      originalFocusRef.current = document.activeElement;
    }
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelected(null);
      } else if (event.key === "ArrowLeft" && visible.length > 0) {
        event.preventDefault();
        setSelected((index) => index === null ? null : (index - 1 + visible.length) % visible.length);
      } else if (event.key === "ArrowRight" && visible.length > 0) {
        event.preventDefault();
        setSelected((index) => index === null ? null : (index + 1) % visible.length);
      } else if (event.key === "Tab") {
        const controls = Array.from(
          lightboxRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? [],
        );
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected, visible.length]);

  useEffect(() => {
    if (selected !== null) return;
    const original = originalFocusRef.current;
    if (original?.isConnected) original.focus();
    originalFocusRef.current = null;
  }, [selected]);

  useEffect(() => setSelected(null), [category]);

  return (
    <section className="dg-archive" id="garimpos" aria-labelledby="dg-archive-title">
      <div className="dg-wrap">
        <div className="dg-archive-heading">
          <div>
            <p className="dg-eyebrow">Acervo vivo · imagens reais</p>
            <h2 id="dg-archive-title" className="dg-section-title">Um bom garimpo<br /><em>sempre surpreende.</em></h2>
          </div>
          <p className="dg-caption">
            Cada peça é única. As fotos são referências do nosso estilo e não garantem
            disponibilidade no momento da visita.
          </p>
        </div>
        {GALLERY_ITEMS.length > 0 ? (
          <>
            <div className="dg-filters" aria-label="Filtrar fotografias por categoria">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  type="button"
                  key={value}
                  className={category === value ? "dg-filter is-active" : "dg-filter"}
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="dg-gallery">
              {visible.map((item, index) => (
                <button
                  type="button"
                  className="dg-gallery-photo"
                  key={item.permalink}
                  onClick={() => setSelected(index)}
                  aria-label={`Ampliar: ${item.alt}`}
                >
                  <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                  <span>Ver fotografia <ArrowUpRight size={16} aria-hidden="true" /></span>
                </button>
              ))}
            </div>
            {visible.length === 0 && <p className="dg-caption">Ainda não há fotos nesta categoria.</p>}
          </>
        ) : (
          <div className="dg-gallery-empty">
            <span aria-hidden="true">✳</span>
            <div>
              <strong>Novas histórias estão chegando.</strong>
              <p>A galeria foi omitida porque ainda não há fotografias autorizadas para uso nesta demonstração. Nenhuma imagem de terceiros foi utilizada.</p>
              <span className="dg-footer-contact">Sem canal de atendimento ativo</span>
            </div>
          </div>
        )}
        <p className="dg-gallery-note">
          {GALLERY_ITEMS.length > 0
            ? "As fotos reais do acervo não indicam disponibilidade ou preço em tempo real. Consulte pelo atendimento."
            : "Galeria e estoque não estão ativos nesta demonstração; nenhuma consulta de peças é recebida."}
        </p>
        <InterestCta interest="comprar" placement="galeria">Consultar uma peça <ArrowUpRight size={17} aria-hidden="true" /></InterestCta>
      </div>
      {current && selected !== null && (
        <div className="dg-lightbox" role="dialog" aria-modal="true" aria-label="Visualizador de fotografias" onClick={() => setSelected(null)}>
          <div className="dg-lightbox-inner" ref={lightboxRef} onClick={(event) => event.stopPropagation()}>
            <button type="button" ref={closeButtonRef} className="dg-lightbox-close" onClick={() => setSelected(null)} aria-label="Fechar fotografia"><X /></button>
            <img src={current.src} alt={current.alt} />
            <div className="dg-lightbox-controls">
              <button type="button" aria-label="Foto anterior" onClick={() => setSelected((selected - 1 + visible.length) % visible.length)}><ChevronLeft /></button>
              <p>{selected + 1} / {visible.length}</p>
              <button type="button" aria-label="Próxima foto" onClick={() => setSelected((selected + 1) % visible.length)}><ChevronRight /></button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function DonaGarimpeiraBrechoPage() {
  return (
    <PortfolioCompositionRoot composition={composition}>
      <main className="dg-site" id="inicio">
        <div className="dg-demo-disclosure" role="status">Demonstração conceitual 0WEB · não é site oficial. Identidade, endereço, horários, estoque e regras aguardam aprovação da responsável. Nenhum formulário ou contato está ativo.</div>
        <header className="dg-header">
          <a className="dg-wordmark" href="#inicio" aria-label="Dona Garimpeira — início">dona<span>garimpeira</span><span className="dg-wordmark-star" aria-hidden="true">✳</span></a>
          <nav aria-label="Navegação Dona Garimpeira">
            <a href="#caminhos">Como funciona</a>
            <a href="#garimpos">Garimpos</a>
            <a href="#visite">Informações</a>
          </nav>
          <span className="dg-footer-contact">Sem canal de atendimento ativo</span>
        </header>

        <section className="dg-hero" aria-labelledby="dg-hero-title">
          <div className="dg-hero-topline"><span>CONCEITO DE BRECHÓ · LOCALIDADE A CONFIRMAR</span><span>MODA QUE GANHA NOVA VIDA</span></div>
          <div className="dg-hero-content">
            <p className="dg-hero-kicker"><span aria-hidden="true">✳</span> Bem-vinda ao seu próximo achado.</p>
            <h1 id="dg-hero-title">Todo estilo<br />merece uma<br /><em>segunda história.</em></h1>
            <div className="dg-hero-bottom">
              <p>Proposta visual de uma experiência de brechó. Identidade, serviços, localidade e operação aguardam aprovação da responsável.</p>
              <a className="dg-scroll-link" href="#caminhos">Descubra como funciona <ArrowDownRight size={21} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="dg-stamp" aria-hidden="true"><span>GARIMPE</span><Heart size={26}/><span>REPASSE</span><span>RECOMECE</span></div>
          <div className="dg-hero-index" aria-hidden="true">DG / 01</div>
        </section>

        <section className="dg-journeys" id="caminhos" aria-labelledby="dg-journeys-title">
          <div className="dg-wrap">
            <div className="dg-journeys-intro">
              <p className="dg-eyebrow">O que te trouxe até aqui?</p>
              <h2 id="dg-journeys-title">Três jeitos de<br /><em>fazer a moda circular.</em></h2>
            </div>
            <div className="dg-journeys-list">
              <article className="dg-journey dg-journey-buy">
                <span className="dg-journey-no">01 / GARIMPAR</span>
                <ShoppingBag size={32} aria-hidden="true" />
                <h3>Vem<br />garimpar.</h3>
                <p>Fluxo ilustrativo de compra. Estoque, preços, formas de pagamento e disponibilidade não estão confirmados.</p>
                <InterestCta interest="comprar" placement="comprar" className="dg-tag-action">Quero conhecer <ArrowUpRight size={18}/></InterestCta>
              </article>
              <article className="dg-journey dg-journey-sell">
                <span className="dg-journey-no">02 / DESAPEGAR</span>
                <Shirt size={32} aria-hidden="true" />
                <h3>Desapegue<br />com carinho.</h3>
                <p>Fluxo ilustrativo de venda. Critérios de avaliação, recebimento e pagamento aguardam confirmação escrita.</p>
                <InterestCta interest="vender" placement="vender" className="dg-tag-action">Quero vender <ArrowUpRight size={18}/></InterestCta>
              </article>
              <article className="dg-journey dg-journey-donate">
                <span className="dg-journey-no">03 / COMPARTILHAR</span>
                <Gift size={32} aria-hidden="true" />
                <h3>Doe uma<br />nova chance.</h3>
                <p>Fluxo ilustrativo de doação. Condições de recebimento e destinação não foram aprovadas nem anunciadas.</p>
                <InterestCta interest="doar" placement="doar" className="dg-tag-action">Quero doar <ArrowUpRight size={18}/></InterestCta>
              </article>
            </div>
          </div>
        </section>

        <RealGallery />

        <section className="dg-how" id="combinados" aria-labelledby="dg-how-title">
          <div className="dg-wrap dg-how-layout">
            <div className="dg-how-lead">
              <p className="dg-eyebrow dg-eyebrow-light">Pequenos combinados</p>
              <h2 id="dg-how-title">Garimpo bom<br /><em>é com clareza.</em></h2>
              <p>As informações operacionais permanecem ocultas até a confirmação escrita da responsável pelo negócio.</p>
              <Recycle size={68} strokeWidth={1.2} aria-hidden="true" />
            </div>
            <div className="dg-how-notes">
              <div><span>01</span><div><h3>Escolha pessoalmente</h3><p>Preços, estoque e formas de pagamento não são divulgados nesta demonstração.</p></div></div>
              <div><span>02</span><div><h3>Quer reservar?</h3><p>Não há formulário, WhatsApp, reserva ou encaminhamento de pedidos ativo nesta versão.</p></div></div>
              <div><span>03</span><div><h3>Vai vender ou doar?</h3><p>Critérios de avaliação, recebimento e horários dependem de confirmação da responsável.</p></div></div>
            </div>
          </div>
        </section>

        <section className="dg-visit" id="visite" aria-labelledby="dg-visit-title">
          <div className="dg-wrap dg-visit-layout">
            <div>
              <p className="dg-eyebrow">Informações ainda não confirmadas</p>
              <h2 id="dg-visit-title">Endereço e horários<br /><em>aguardam aprovação.</em></h2>
              <p className="dg-visit-address">Localidade, endereço, CEP, horários, acessibilidade e visita presencial não são divulgados nesta demonstração.</p>
            </div>
            <div className="dg-visit-side">
              <span className="dg-visit-star" aria-hidden="true">✳</span>
              <p>Atendimento, agenda, contato e visita permanecem desativados até confirmação escrita da responsável.</p>
              <InterestCta interest="comprar" placement="visita">Visita indisponível nesta demonstração <ArrowUpRight size={17} aria-hidden="true" /></InterestCta>
            </div>
          </div>
        </section>

        <section className="dg-faq" aria-labelledby="dg-faq-title">
          <div className="dg-wrap dg-faq-layout">
            <div>
              <p className="dg-eyebrow">Antes de vir</p>
              <h2 id="dg-faq-title">Dúvidas<br /><em>sem mistério.</em></h2>
            </div>
            <div className="dg-faq-questions">
              {FAQS.map(([question, answer]) => (
                <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>
              ))}
            </div>
          </div>
        </section>
        <footer className="dg-footer">
          <div className="dg-wrap">
            <span className="dg-footer-name">dona garimpeira <span aria-hidden="true">✳</span></span>
            <p>Conceito visual 0WEB · não é site oficial · localidade a confirmar</p>
            <span className="dg-footer-contact">Sem canal de atendimento ativo</span>
          </div>
        </footer>
      </main>
    </PortfolioCompositionRoot>
  );
}
