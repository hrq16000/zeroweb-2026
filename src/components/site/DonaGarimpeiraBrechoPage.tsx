import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gift,
  Heart,
  Instagram,
  MapPin,
  Recycle,
  Shirt,
  ShoppingBag,
  X,
} from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
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
const FORM = "funnel-dona-garimpeira-brecho";
const INSTAGRAM = "https://www.instagram.com/donagarimpeirasjp/";

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
    <FunnelCTAButton
      clientKey={SLUG}
      companySlug={SLUG}
      formSlug={FORM}
      location={`${SLUG}_${placement}`}
      className={className}
      showArrow={false}
    >
      {children}
    </FunnelCTAButton>
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
      "Endereço, horário, processos reais de compra e doação; sem avaliações ou métricas fabricadas.",
    conversionNarrative:
      "Comprar, vender e doar chegam ao mesmo funil identificado por intenção, sem contato direto de WhatsApp.",
    motionNarrative:
      "Movimento leve de etiquetas e transições fotográficas; redução de movimento desliga os efeitos.",
    signatureMoments: [
      "Título que funciona como um pôster de brechó, com selo editorial.",
      "Três caminhos comerciais em uma fita de etiquetas numeradas.",
      "Vitrine de acervo real com zoom contextual, filtros e procedência preservada.",
      "Endereço transformado em convite editorial à visita.",
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
      decisionAidPlacement: ["compra/venda/doação antes do acervo", "política de reserva junto à jornada", "horário perto do endereço"],
      densityRhythm: ["capa ampla", "três escolhas compactas", "mosaico", "duas colunas", "encerramento amplo"],
      mobileCompositionStrategy: "poster readable at 360px, horizontal tags become vertical stack, gallery controls keyboard/touch-friendly",
    },
  },
};

const FAQS: [string, string][] = [
  ["Posso vender minhas roupas à Dona Garimpeira?", "Sim. A loja avalia presencialmente roupas usadas em excelente estado e, quando aprovadas, pode pagar na hora em Pix ou dinheiro."],
  ["Posso levar roupas para doação?", "Sim. A loja recebe presencialmente doações de peças em excelente estado. Parte pode ser revendida e parte destinada a iniciativas solidárias."],
  ["É possível reservar uma peça?", "Sim, pelo WhatsApp, após confirmação da disponibilidade. O prazo é combinado individualmente e a retirada e o pagamento acontecem na loja."],
  ["A vitrine mostra tudo que está à venda agora?", "Não. As fotografias são referências do estilo do brechó e não representam estoque em tempo real."],
  ["Como posso pagar na loja?", "A Dona Garimpeira aceita Pix, dinheiro, cartão de débito e cartão de crédito."],
  ["A loja abre aos domingos?", "Sim. O atendimento habitual é de segunda a domingo, das 9h às 18h. Feriados podem ter horários especiais."],
];

function InterestCta({
  interest,
  placement,
  children,
  className = "dg-cta",
}: {
  interest: "comprar" | "vender" | "doar";
  placement: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <FunnelCTAButton
      clientKey={SLUG}
      companySlug={SLUG}
      formSlug={FORM}
      location={`dona_garimpeira_${placement}_${interest}`}
      prefill={{ interesse: interest }}
      context={{ business: "Dona Garimpeira", interest, source: "portfolio-dona-garimpeira-brecho" }}
      className={className}
      showArrow={false}
    >
      {children}
    </FunnelCTAButton>
  );
}

function RealGallery() {
  const [category, setCategory] = useState<Category>("todos");
  const [selected, setSelected] = useState<number | null>(null);
  const visible = GALLERY_ITEMS.filter((item) => category === "todos" || item.category === category);
  const current = selected === null ? null : visible[selected];

  useEffect(() => {
    if (selected === null) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
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
              <p>Estamos organizando as fotografias reais do acervo da Dona Garimpeira. Enquanto isso, acompanhe as novidades no perfil oficial.</p>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                Conhecer o Instagram oficial <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
        <p className="dg-gallery-note">
          Fotos ilustrativas do acervo, sem preço e sem estoque em tempo real.
          Para saber sobre uma peça, faça uma consulta pelo atendimento.
        </p>
        <InterestCta interest="comprar" placement="galeria">Consultar uma peça <ArrowUpRight size={17} aria-hidden="true" /></InterestCta>
      </div>
      {current && selected !== null && (
        <div className="dg-lightbox" role="dialog" aria-modal="true" aria-label="Visualizador de fotografias" onClick={() => setSelected(null)}>
          <div className="dg-lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="dg-lightbox-close" onClick={() => setSelected(null)} aria-label="Fechar fotografia"><X /></button>
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
        <header className="dg-header">
          <a className="dg-wordmark" href="#inicio" aria-label="Dona Garimpeira — início">dona<span>garimpeira</span><span className="dg-wordmark-star" aria-hidden="true">✳</span></a>
          <nav aria-label="Navegação Dona Garimpeira">
            <a href="#caminhos">Como funciona</a>
            <a href="#garimpos">Garimpos</a>
            <a href="#visite">Visite a loja</a>
          </nav>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram oficial da Dona Garimpeira">
            <Instagram size={20} aria-hidden="true" />
          </a>
        </header>

        <section className="dg-hero" aria-labelledby="dg-hero-title">
          <div className="dg-hero-topline"><span>BRECHÓ · SÃO JOSÉ DOS PINHAIS</span><span>MODA QUE GANHA NOVA VIDA</span></div>
          <div className="dg-hero-content">
            <p className="dg-hero-kicker"><span aria-hidden="true">✳</span> Bem-vinda ao seu próximo achado.</p>
            <h1 id="dg-hero-title">Todo estilo<br />merece uma<br /><em>segunda história.</em></h1>
            <div className="dg-hero-bottom">
              <p>Roupas e acessórios de segunda mão, encontros inesperados e boas histórias. Um brechó de verdade, pertinho de você.</p>
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
                <p>Encontre roupas e acessórios femininos, masculinos e infantis. A compra acontece na loja física.</p>
                <InterestCta interest="comprar" placement="comprar" className="dg-tag-action">Quero conhecer <ArrowUpRight size={18}/></InterestCta>
              </article>
              <article className="dg-journey dg-journey-sell">
                <span className="dg-journey-no">02 / DESAPEGAR</span>
                <Shirt size={32} aria-hidden="true" />
                <h3>Desapegue<br />com carinho.</h3>
                <p>Compramos roupas usadas em excelente estado após avaliação presencial. Peças aprovadas podem ser pagas na hora.</p>
                <InterestCta interest="vender" placement="vender" className="dg-tag-action">Quero vender <ArrowUpRight size={18}/></InterestCta>
              </article>
              <article className="dg-journey dg-journey-donate">
                <span className="dg-journey-no">03 / COMPARTILHAR</span>
                <Gift size={32} aria-hidden="true" />
                <h3>Doe uma<br />nova chance.</h3>
                <p>Recebemos doações de peças em excelente estado. Algumas são revendidas e outras ajudam iniciativas solidárias.</p>
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
              <p>Uma loja de bairro feita de encontros, oportunidades e peças que continuam contando histórias.</p>
              <Recycle size={68} strokeWidth={1.2} aria-hidden="true" />
            </div>
            <div className="dg-how-notes">
              <div><span>01</span><div><h3>Escolha pessoalmente</h3><p>A venda e o pagamento acontecem na loja física. Aceitamos Pix, dinheiro, débito e crédito.</p></div></div>
              <div><span>02</span><div><h3>Quer reservar?</h3><p>Envie foto, print ou descrição pelo atendimento. Confirmamos a disponibilidade e combinamos o prazo individualmente.</p></div></div>
              <div><span>03</span><div><h3>Vai vender ou doar?</h3><p>Traga suas roupas em excelente estado para avaliação ou recebimento presencial, no horário da loja.</p></div></div>
            </div>
          </div>
        </section>

        <section className="dg-visit" id="visite" aria-labelledby="dg-visit-title">
          <div className="dg-wrap dg-visit-layout">
            <div>
              <p className="dg-eyebrow">A gente te espera</p>
              <h2 id="dg-visit-title">Seu próximo achado<br /><em>tem endereço.</em></h2>
              <p className="dg-visit-street">Rua Loanda,<br /><strong>60.</strong></p>
              <p className="dg-visit-address"><MapPin size={19} aria-hidden="true" /> Boneca do Iguaçu · São José dos Pinhais · PR<br />CEP 83040-170</p>
            </div>
            <div className="dg-visit-side">
              <span className="dg-visit-star" aria-hidden="true">✳</span>
              <p><Clock3 size={19} aria-hidden="true" /> Segunda a domingo, das 9h às 18h.<br /><small>Feriados podem ter horários diferentes.</small></p>
              <p><Check size={19} aria-hidden="true" /> Entrada acessível para cadeira de rodas.</p>
              <p>Venda presencial · Reserva consultada pelo atendimento</p>
              <InterestCta interest="comprar" placement="visita">Falar sobre minha visita <ArrowUpRight size={17} aria-hidden="true" /></InterestCta>
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
            <p>Brechó de roupas e acessórios · São José dos Pinhais — PR</p>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><Instagram size={17} aria-hidden="true" /> @donagarimpeirasjp <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </footer>
      </main>
    </PortfolioCompositionRoot>
  );
}
