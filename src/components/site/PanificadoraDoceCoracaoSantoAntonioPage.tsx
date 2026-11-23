import { ArrowRight, ArrowUpRight, Clock3, ExternalLink, Heart, Instagram, MapPin, MessageCircle, Navigation, Search, Sparkles, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { PortfolioComposition } from "@/lib/portfolio-composition";
import type { CtaRenderOptions } from "@/lib/portfolio-blueprint";
import "./panificadora-doce-coracao.css";

const slug = "panificadora-doce-coracao-santo-antonio";
const asset = "/images/" + slug;
const mapUrl = "https://www.google.com/maps/search/?api=1&query=Panificadora%20Doce%20Cora%C3%A7%C3%A3o%20Santo%20Ant%C3%B4nio%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais&query_place_id=ChIJK4CTr0b33JQRF5lemSGL8yA";
const instagramUrl = "https://www.instagram.com/docecoracao.mina/";
const guide = [
  {
    id: "cafe-da-manha", time: "01 / Começo do dia", title: "Um pão para começar",
    text: "Para quem procura o pão de cada dia e uma parada rápida no bairro.",
    cue: "Pães e café da manhã", icon: "☀",
  },
  {
    id: "pausa", time: "02 / Uma pausa", title: "O intervalo pede sabor",
    text: "Salgados e opções de balcão aparecem nas referências públicas da padaria.",
    cue: "Salgados e lanches", icon: "✳",
  },
  {
    id: "doce", time: "03 / Um agrado", title: "Deixe espaço para o doce",
    text: "Bolos e doces fazem parte das categorias mencionadas por clientes online.",
    cue: "Bolos e doces", icon: "♡",
  },
] as const;
const categories = [
  { number: "01", name: "Pães", line: "O essencial da padaria de bairro.", note: "Pão francês e pães do cotidiano são citados nas avaliações.", icon: "◒" },
  { number: "02", name: "Salgados", line: "Para a correria ter uma pausa.", note: "Clientes mencionam opções salgadas de balcão.", icon: "✦" },
  { number: "03", name: "Bolos", line: "Para um pedaço no meio do dia.", note: "Bolos aparecem entre os itens comentados publicamente.", icon: "◗" },
  { number: "04", name: "Doces", line: "Uma escolha para adoçar o caminho.", note: "Doces e produtos de confeitaria são associados à unidade.", icon: "♡" },
] as const;
const questions = [
  {
    question: "Onde fica a Panificadora Doce Coração?",
    answer: "A unidade apresentada aqui fica na Rua Desembargador James Portugal Macedo, 290, no bairro Santo Antônio, em São José dos Pinhais, Paraná, CEP 83020-620.",
  },
  {
    question: "Tem pão francês, bolos e salgados?",
    answer: "Essas categorias são mencionadas nas avaliações e fontes públicas consultadas. A vitrine e o estoque variam: confirme os itens disponíveis com o estabelecimento.",
  },
  {
    question: "Qual é o horário de funcionamento?",
    answer: "O horário informado em plataformas pode mudar em feriados ou por decisão do estabelecimento. Consulte a ficha atualizada no Google Maps antes de sair de casa.",
  },
  {
    question: "É possível fazer encomendas ou pedir entrega?",
    answer: "A disponibilidade de encomendas, retirada e entrega não foi confirmada diretamente com a unidade. Verifique as condições atuais com o estabelecimento.",
  },
  {
    question: "Como consultar a padaria pelo WhatsApp?",
    answer: "O formulário demonstrativo registra o interesse na 0WEB pelo Jotform, sem envio automático à padaria. Não confirma compras, encomendas ou disponibilidade. Para falar diretamente com o estabelecimento, consulte seus canais públicos.",
  },
  {
    question: "Onde encontro as publicações do Instagram e Facebook?",
    answer: "A referência recebida indica @docecoracao.mina e o número do perfil corresponde ao contato da ficha comercial. O Instagram pode ser acessado diretamente; as últimas seis postagens e uma página oficial no Facebook ainda não puderam ser verificadas para incorporação.",
  },
  {
    question: "Este é o site oficial da padaria?",
    answer: "Esta página é uma apresentação demonstrativa e editorial desenvolvida na vitrine da 0WEB com base em informações públicas. Não representa um canal oficial da Panificadora Doce Coração.",
  },
] as const;


const consultationFormUrl = "https://form.jotform.com/263264367955065";

/** Formulário 0WEB hospedado; nenhum dado é enviado automaticamente à padaria. */
function HostedConsultaButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button type="button" className={className}>{children}</button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[110] bg-[#341624]/80 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="fixed inset-x-3 top-1/2 z-[111] mx-auto flex h-[min(92dvh,820px)] max-w-2xl -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-[#fff9f0] text-[#3c1c27] shadow-2xl sm:inset-x-6"
          aria-describedby="dc-consulta-description"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#e7d9cf] px-5 py-4">
            <div>
              <DialogPrimitive.Title className="text-lg font-bold">Consulta demonstrativa · Doce Coração</DialogPrimitive.Title>
              <DialogPrimitive.Description id="dc-consulta-description" className="mt-1 text-sm">
                Formulário da 0WEB. Não é canal oficial da padaria nem confirma encomendas.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="shrink-0 rounded-full border border-[#d6bdb1] p-2" aria-label="Fechar formulário">
              <X size={20} aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <iframe data-funnel-provider="jotform" data-client-key="panificadora-doce-coracao-santo-antonio"
            src={consultationFormUrl} title="Formulário demonstrativo — Panificadora Doce Coração"
            className="min-h-0 w-full flex-1 border-0" loading="eager"
            referrerPolicy="strict-origin-when-cross-origin" />
          <div className="border-t border-[#e7d9cf] px-5 py-3 text-center text-xs">
            <p>As respostas ficam na 0WEB (Jotform); não são enviadas à padaria.</p>
            <p className="mt-2">Não carregou? <a href={consultationFormUrl} target="_blank"
              rel="noopener noreferrer" className="underline">Abrir formulário em outra aba</a>.</p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export const composition: PortfolioComposition = {
  slug,
  motionIntensity: "BALANCED",
  renderCta: ({ children, className }: CtaRenderOptions) => (
    <HostedConsultaButton>{children}</HostedConsultaButton>
  ),
  afterContent: <PortfolioHostCredit />,
  brief: {
    businessPersonality: "Calorosa, direta, de bairro, afetiva e objetiva.",
    creativeConcept: "Do forno para o caminho de casa: caderno editorial de padaria de bairro.",
    visualMetaphor: "Papel de embrulho e carimbo circular, com coração contínuo e ilustrações editoriais de panificação.",
    spatialLanguage: "Colunas editoriais assimétricas, círculos de marca e etiquetas de prateleira.",
    heroConcept: "Capa de jornal creme com grande título vinho e ilustração original à direita.",
    navigationConcept: "Masthead compacta, navegação por âncoras e mapa externo.",
    contentRhythm: "Capa → fita cinética → momentos do dia → categorias → endereço → redes e prova de origem → perguntas → fechamento editorial.",
    mediaNarrative: "Logo, capa e OG autorais com ilustrações vetoriais conceituais; sem fotografias falsamente documentais.",
    proofNarrative: "Localização e categorias informadas com fonte e data, sem depoimentos ou avaliações inventadas.",
    conversionNarrative: "Rota como ação local principal; formulário demonstrativo isolado registra consultas na 0WEB via Jotform, sem envio automático à padaria.",
    motionNarrative: "Carimbo com micro movimento e links expressivos, sempre respeitando movimento reduzido.",
    signatureMoments: ["Carimbo editorial de bairro", "Navegação por três ocasiões", "Etiqueta de endereço em alto contraste"],
    compositionFingerprint: {
      heroGeometry: "oversized editorial masthead illustration seal offset right",
      headerTreatment: "tiny neighborhood newspaper masthead",
      sectionGraph: "paper cover→bread ticker→moment selector→food typology→burgundy address ticket→social source card→FAQ→editorial close",
      contentOrder: ["orientação", "ritmo", "ocasião", "categorias", "localização", "redes", "dúvidas", "contato"],
      gridTopology: "asymmetric cover, horizontal moments, typographic categories, full-width locator",
      mediaDistribution: "custom SVG cover, graphic category icons, map directions, own social poster",
      backgroundRhythm: "cream→burgundy ticker→mustard→paper→burgundy→cream social→rose→cream",
      proofPlacement: "address adjacent to map with research date",
      ctaDistribution: "hero route plus inquiry, locator directions, Instagram reference, closing business inquiry",
      navigationPattern: "local sticky anchors and maps, no institutional header",
      motionSignature: "short stamp + icon micro-lift / reduced motion static",
      closingStructure: "typographic note with demonstrative disclosure",
      roleGraph: ["entity orientation", "occasion guidance", "category discovery", "wayfinding", "FAQ", "consultation"],
      mediaCadence: ["editorial illustration", "kinetic ticker", "graphic menu", "map direction", "social art", "text FAQ"],
      interactionLoci: ["moment anchors", "map", "Instagram", "FAQ", "funnel"],
      decisionAidPlacement: ["occasion strip", "hours caveat near address"],
      densityRhythm: ["airy", "compact", "medium", "high contrast", "quiet"],
      mobileCompositionStrategy: "text precedes art, moment controls wrap, map ticket full width",
    },
  },
};

export function PanificadoraDoceCoracaoSantoAntonioPage() {
  return (
    <PortfolioCompositionRoot composition={composition}>
      <div className="dc-site" id="inicio">
        <a className="dc-skip" href="#conteudo">Pular para o conteúdo</a>
        <header className="dc-header">
          <a className="dc-mark" href="#inicio" aria-label="Doce Coração, voltar ao início">
            <img src={asset + "/logo.svg"} width="50" height="50" loading="lazy" decoding="async" alt="" />
            <span><strong>Doce Coração</strong><small>Panificadora · Santo Antônio</small></span>
          </a>
          <nav className="dc-nav" aria-label="Seções da apresentação">
            <a href="#momentos">Momentos</a><a href="#sabores">Sabores</a><a href="#localizacao">Localização</a><a href="#redes">Redes</a><a href="#perguntas">Dúvidas</a>
          </nav>
          <a className="dc-header-route" href={mapUrl} target="_blank" rel="noopener noreferrer">Ver rota <ArrowUpRight size={17} aria-hidden="true" /></a>
        </header>

        <main id="conteudo">
          <section className="dc-hero" aria-labelledby="dc-title">
            <div className="dc-hero-text">
              <p className="dc-eyebrow"><span className="dc-dot" /> Um endereço gostoso de encontrar · Santo Antônio / PR</p>
              <h1 id="dc-title">Pão, pausa <em>e</em> um doce <span>coração.</span></h1>
              <p className="dc-hero-lead">
                Conheça a <strong>Panificadora Doce Coração</strong>, uma padaria de bairro em
                São José dos Pinhais. Um guia para explorar os sabores citados pelo público
                e chegar à unidade certa.
              </p>
              <div className="dc-actions">
                <a className="dc-button-primary" href={mapUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation size={18} aria-hidden="true" /> Encontrar a padaria <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <HostedConsultaButton className="dc-button-outline dc-button-warm">
                  <MessageCircle size={18} aria-hidden="true" /> Abrir consulta demonstrativa
                </HostedConsultaButton>
                <a className="dc-button-quiet" href="#sabores">Conhecer os sabores <ArrowRight size={17} aria-hidden="true" /></a>
              </div>
              <p className="dc-proof-note">Apresentação editorial demonstrativa 0WEB · Informações públicas, não site oficial da padaria.</p>
            </div>
            <div className="dc-hero-art">
              <div className="dc-stamp transition-transform" aria-label="São José dos Pinhais, Paraná">
                <Heart size={22} aria-hidden="true" /><span>Feito para<br />a vizinhança</span>
              </div>
              <img src={asset + "/hero-ilustracao.svg"} width="740" height="800" loading="eager" decoding="async" fetchPriority="high"
                alt="Ilustração editorial criada para esta demonstração, com pães e formas de panificação; não representa produtos fotografados da loja." />
              <span className="dc-art-caption">Ilustração de conceito · não é foto do estabelecimento</span>
            </div>
          </section>
          <div className="dc-ticker" aria-hidden="true">
            <div className="dc-ticker-track"><span>PÃES <b>✳</b> BOLOS <b>♡</b> PAUSAS <b>✳</b> DOCES <b>♡</b> SANTO ANTÔNIO <b>✳</b></span><span>PÃES <b>✳</b> BOLOS <b>♡</b> PAUSAS <b>✳</b> DOCES <b>♡</b> SANTO ANTÔNIO <b>✳</b></span></div>
          </div>

          <section id="momentos" className="dc-moments" aria-labelledby="dc-moments-title">
            <div className="dc-section-label">01 — Um motivo para passar</div>
            <div className="dc-moments-head"><h2 id="dc-moments-title">Tem sempre uma hora <i>para uma pausa.</i></h2><p>Encontre por ocasião. Os itens são referências de categoria, e não um cardápio ou estoque ao vivo.</p></div>
            <div className="dc-moment-grid">
              {guide.map((item) => (
                <a key={item.id} className="dc-moment" href="#sabores">
                  <span className="dc-moment-top"><small>{item.time}</small><span aria-hidden="true">{item.icon}</span></span>
                  <strong>{item.title}</strong><span>{item.text}</span><small className="dc-occasion">{item.cue} <ArrowUpRight size={15} aria-hidden="true" /></small>
                </a>
              ))}
            </div>
          </section>

          <section id="sabores" className="dc-flavors" aria-labelledby="dc-flavors-title">
            <div className="dc-flavors-heading"><div><p className="dc-section-label">02 — Sabores do balcão</p><h2 id="dc-flavors-title">O que aparece<br /><em>na conversa.</em></h2></div><p>Nas referências públicas da unidade, visitantes citam pães, salgados, bolos e doces. Aqui você conhece as categorias sem preços ou disponibilidade inventados.</p></div>
            <div className="dc-flavors-grid">
              {categories.map((item) => (
                <article key={item.number} className="dc-flavor">
                  <div className="dc-flavor-visual"><span className="dc-flavor-glyph" aria-hidden="true">{item.icon}</span><span className="dc-flavor-number">{item.number}</span></div>
                  <h3>{item.name}</h3><p className="dc-flavor-line">{item.line}</p><p>{item.note}</p>
                </article>
              ))}
            </div>
            <p className="dc-availability"><Clock3 size={18} aria-hidden="true" /> Os produtos podem variar diariamente. Para cardápio, encomendas, preços e estoque, confirme diretamente com a padaria.</p>
          </section>

          <section id="localizacao" className="dc-location" aria-labelledby="dc-location-title">
            <div className="dc-location-intro"><p className="dc-section-label">03 — Aqui pertinho, no Santo Antônio</p><h2 id="dc-location-title">Uma parada no seu <em>caminho.</em></h2><p>É esta a unidade apresentada nesta página — use o endereço completo para não confundir com padarias de nome semelhante em outros bairros da cidade.</p></div>
            <div className="dc-address">
              <span className="dc-address-label"><MapPin size={19} aria-hidden="true" /> Endereço identificado na ficha pública</span>
              <address>Rua Desembargador<br />James Portugal Macedo, <strong>290</strong><span>Santo Antônio · São José dos Pinhais — PR<br />CEP 83020-620</span></address>
              <a href={mapUrl} className="dc-directions" target="_blank" rel="noopener noreferrer">Abrir localização no Google Maps <ArrowUpRight size={18} aria-hidden="true" /></a>
              <HostedConsultaButton className="dc-location-whatsapp">
                <MessageCircle size={18} aria-hidden="true" /> Consultar produtos na 0WEB
              </HostedConsultaButton>
              <p className="dc-location-caveat">Consulte o horário de abertura atualizado antes de sair, especialmente aos domingos e feriados.</p>
            </div>
          </section>

          <section id="redes" className="dc-social" aria-labelledby="dc-social-title">
            <div className="dc-social-intro">
              <p className="dc-section-label">04 — Acompanhe os sabores</p>
              <h2 id="dc-social-title">O bairro também <em>tem seu feed.</em></h2>
              <p>O perfil <strong>@docecoracao.mina</strong> foi mencionado na captura recebida e apresenta o mesmo número de contato encontrado na ficha pública desta unidade. Para ver fotos e novidades, consulte o perfil diretamente.</p>
              <div className="dc-social-pills"><span><Instagram size={16} aria-hidden="true" /> Instagram referenciado</span><span><Sparkles size={16} aria-hidden="true" /> Arte autoral 0WEB</span></div>
              <a className="dc-social-cta" href={instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={21} aria-hidden="true" /> Abrir @docecoracao.mina <ArrowUpRight size={19} aria-hidden="true" /></a>
              <p className="dc-social-caveat">As seis postagens mais recentes ainda não foram importadas: faltam links individuais e imagens verificáveis. Nenhuma página oficial no Facebook foi confirmada. Os cartões desta seção são gráficos editoriais, não postagens reais.</p>
            </div>
            <div className="dc-social-art">
              <div className="dc-social-card" aria-label="Arte editorial original ilustrativa, não publicação oficial da padaria">
                <div className="dc-social-card-top"><img src={asset + "/logo.svg"} width="34" height="34" loading="lazy" decoding="async" alt="" /><span>Doce Coração</span><small>editorial / 0WEB</small></div>
                <div className="dc-social-card-center"><span>✳</span><strong>um intervalo<br /><em>com carinho.</em></strong><span>♡</span></div>
                <div className="dc-social-card-bottom"><span>São José dos Pinhais · PR</span><Heart size={20} aria-hidden="true" /></div>
              </div>
              <div className="dc-social-note"><Instagram size={19} aria-hidden="true" /><span>Conteúdo conceitual, sem cópia de posts ou fotos de terceiros.</span></div>
            </div>
          </section>

          <section id="perguntas" className="dc-faq" aria-labelledby="dc-faq-title">
            <div className="dc-faq-intro"><p className="dc-section-label">05 — Antes de visitar</p><h2 id="dc-faq-title">A dúvida também tem <em>seu lugar.</em></h2><p>Informação simples, sem preços presumidos, avaliações fabricadas ou promessas de entrega.</p><a href={mapUrl} target="_blank" rel="noopener noreferrer">Ver informações atuais <ExternalLink size={16} aria-hidden="true" /></a></div>
            <div className="dc-faq-list">
              {questions.map(({ question, answer }, index) => (
                <details key={question} className="dc-faq-item" open={index === 0}>
                  <summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="dc-final" aria-labelledby="dc-final-title">
            <div className="dc-final-heading"><span className="dc-section-label">Um pedacinho do bairro na internet</span><h2 id="dc-final-title">O que é local merece ser <em>encontrado.</em></h2></div>
            <div className="dc-final-actions">
              <p>Esta presença é uma demonstração editorial de <a href="/portfolio">criação de sites da 0WEB / WebRealce</a>, não o site oficial da empresa. O formulário demonstrativo registra a consulta na 0WEB via Jotform; as respostas não são enviadas à padaria. Preços, estoque, horários e encomendas devem ser confirmados diretamente com o estabelecimento.</p>
              <div className="dc-final-buttons">
                <a className="dc-button-primary" href={mapUrl} target="_blank" rel="noopener noreferrer"><Search size={18} aria-hidden="true" /> Consultar no Google <ArrowUpRight size={17} aria-hidden="true" /></a>
                <HostedConsultaButton className="dc-button-outline">Abrir formulário demonstrativo <MessageCircle size={18} aria-hidden="true" /></HostedConsultaButton>
              </div>
              <p className="dc-final-small">As informações foram verificadas em 19/11/2026 em <a href={mapUrl} target="_blank" rel="noopener noreferrer">Google Maps</a> e <a href="https://restaurantguru.com/Doce-Coracao-Sao-Jose-dos-Pinhais" target="_blank" rel="noopener noreferrer">Restaurant Guru</a>. Dados variáveis devem ser confirmados na origem.</p>
            </div>
          </section>
        </main>
        <footer className="dc-footer">
          <a href="#inicio" className="dc-footer-wordmark"><img src={asset + "/logo.svg"} width="32" height="32" loading="lazy" decoding="async" alt="" /> Doce Coração <span>· conceito editorial</span></a>
          <a href="#inicio">Voltar ao início ↑</a>
        </footer>
      </div>
    </PortfolioCompositionRoot>
  );
}
