import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitPortfolioQuiz } from "@/lib/dynamic-funnel.functions";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bird,
  Check,
  Clock3,
  Dog,
  Fish,
  Heart,
  Leaf,
  MapPin,
  Menu,
  Package,
  PawPrint,
  Scissors,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import "./agropet-filt-preview.css";

/**
 * Pesquisa pública convertida em conceito editorial independente.
 * Prévia independente por padrão; modo live habilitado somente em rota autorizada. Fotos locais não disponíveis.
 * Modo preview: não coleta. Modo live: persiste no funil 0WEB com consentimento.
 */

type Interest = "racoes" | "aves" | "petiscos" | "banho" | "pesca" | "jardim";
type Item = { key: Interest; name: string; kicker: string; text: string; icon: typeof PawPrint; tone: string };
const categories: Item[] = [
  { key: "racoes", name: "Rações", kicker: "Rotina do pet", text: "Consulte as opções de alimentação adequadas ao seu companheiro.", icon: Dog, tone: "lime" },
  { key: "aves", name: "Mundo das aves", kicker: "Nosso lado aviário", text: "Artigos e acessórios para quem também cuida de bicos e penas.", icon: Bird, tone: "orange" },
  { key: "petiscos", name: "Petiscos & acessórios", kicker: "Carinho em detalhes", text: "Pergunte sobre petiscos e itens de uso diário para pets.", icon: Heart, tone: "pink" },
  { key: "banho", name: "Banho & tosa", kicker: "Cuidado e beleza", text: "Serviço citado em diretórios. Consulte disponibilidade e condições.", icon: Scissors, tone: "blue" },
  { key: "pesca", name: "Artigos de pesca", kicker: "Além do universo pet", text: "Mais uma categoria mencionada em anúncios públicos da loja.", icon: Fish, tone: "cream" },
  { key: "jardim", name: "Jardinagem", kicker: "Para o lado de fora", text: "Itens de jardinagem também aparecem na descrição comercial pública.", icon: Leaf, tone: "green" },
];

const guides = {
  cao: {
    title: "O dia a dia do seu cão",
    detail: "Comece por ração e petiscos. Se a intenção for banho ou tosa, descreva o porte e consulte a disponibilidade.",
    interest: "racoes" as Interest,
  },
  ave: {
    title: "Seu cantinho de aves",
    detail: "Liste a espécie e o tipo de artigo procurado. A disponibilidade de cada item deve ser confirmada na loja.",
    interest: "aves" as Interest,
  },
  outro: {
    title: "Tudo o que você precisa consultar",
    detail: "Use as categorias e explique o item ou cuidado procurado, sem supor que existe estoque em tempo real.",
    interest: "petiscos" as Interest,
  },
};

type GuideKey = keyof typeof guides;
const street = "Rua Monteiro Lobato, 160 — Vargem Grande, Pinhais/PR";
const mapHref = "https://www.google.com/maps/search/?api=1&query=Rua%20Monteiro%20Lobato%20160%20Vargem%20Grande%20Pinhais%20PR";

const agropetMotion = { motionIntensity: "BALANCED" } as const;

export function AgropetFiltPreviewPage({ mode = "preview" }: { mode?: "preview" | "live" }) {
  const isLive = mode === "live";
  const submitLead = useServerFn(submitPortfolioQuiz);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [protocol, setProtocol] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [interest, setInterest] = useState<Interest | null>(null);
  const [guide, setGuide] = useState<GuideKey>("cao");
  const [brief, setBrief] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const selected = categories.find((item) => item.key === interest);
  const open = (value: Interest) => {
    setInterest(value); setBrief(""); setStep(1); setNavOpen(false);
    setName(""); setPhone(""); setConsent(false); setProtocol(""); setError("");
  };
  const close = () => {
    if (sending) return;
    setInterest(null); setBrief(""); setStep(1); setError(""); setProtocol("");
  };
  const finish = async () => {
    if (!isLive || !selected) return;
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || digits.length < 10 || digits.length > 11 || !consent) {
      setError("Preencha seu nome, telefone com DDD e aceite o aviso de privacidade.");
      return;
    }
    setSending(true); setError("");
    try {
      const response = await submitLead({ data: {
        clientKey: "agropet-filt",
        studioName: "Agropet Filt",
        recipientName: "equipe Agropet Filt",
        mode: "proposal",
        proposalKind: "service",
        funnelIntent: "orcamento",
        recoveryContact: digits,
        pageUrl: typeof window === "undefined" ? undefined : window.location.href,
        answers: {
          service: selected.name,
          experience: "Consulta de produtos e serviços",
          period: "Vargem Grande · Pinhais",
          timing: "A combinar",
          note: `Nome: ${name.trim().slice(0,90)}. Interesse: ${selected.name}. ${brief.trim().slice(0,600)}. Consentimento de contato: sim.`,
        },
      }});
      if (response?.protocol) setProtocol(response.protocol);
      else setError("Não foi possível confirmar o registro. Tente novamente.");
    } catch {
      setError("Não foi possível registrar a consulta. Tente novamente.");
    } finally { setSending(false); }
  };

  useEffect(() => {
    if (!interest) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interest]);

  return (
    <main className="af-site" id="inicio" data-motion-intensity={agropetMotion.motionIntensity}>
      <div className="af-research-note">
        <span className="af-note-dot" />
        {isLive ? "Portfólio autorizado da Agropet Filt. Estoque, serviços e valores sujeitos à confirmação." : "Conceito criado pela 0WEB com dados públicos. Não é o site oficial da loja. Atendimento demonstrativo, sem envio de mensagens."}
      </div>

      <header className="af-header">
        <a href="#inicio" className="af-brand" aria-label="Agropet Filt, início da página">
          <span className="af-symbol"><img src="/images/agropet-filt/logo.svg" alt="" aria-hidden="true" width="46" height="46" /></span>
          <span><strong>AGROPET</strong><small>FILT <i>·</i> PINHAIS</small></span>
        </a>
        <nav className={navOpen ? "af-nav is-open" : "af-nav"} aria-label="Navegação Agropet Filt">
          <a href="#encontre" onClick={() => setNavOpen(false)}>O que encontrar</a>
          <a href="#guia" onClick={() => setNavOpen(false)}>Seu pet</a>
          <a href="#localizacao" onClick={() => setNavOpen(false)}>Como chegar</a>
        </nav>
        <button className="af-header-cta transition-transform" onClick={() => open("racoes")}>{isLive ? "Consultar produtos" : "Simular consulta"} <ArrowUpRight size={18} /></button>
        <button className="af-menu-toggle" aria-label={navOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}>
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <section className="af-hero" aria-labelledby="af-title">
        <div className="af-hero-copy">
          <span className="af-eyebrow"><span /> PINHAIS, VARGEM GRANDE</span>
          <h1 id="af-title">Do bico ao <em>focinho.</em><br /><span>Tudo por perto.</span></h1>
          <p>Rações, universo das aves, acessórios e categorias do dia a dia em uma experiência fácil de explorar. Conheça a Agropet Filt em Pinhais.</p>
          <div className="af-hero-actions">
            <a className="af-button af-button-dark" href="#encontre">Explorar categorias <ArrowDownRight size={19} /></a>
            <button className="af-button af-button-outline" onClick={() => open("banho")}>Consultar banho e tosa <ArrowUpRight size={19} /></button>
          </div>
          <p className="af-hero-disclaimer">Categorias mencionadas em fontes públicas; consulte a loja sobre serviços, produtos e disponibilidade.</p>
        </div>
        <div className="af-hero-art" aria-label="Ilustração conceitual original de um cachorro e um pássaro, sem representar animais da loja" role="img">
          <span className="af-art-orbit af-art-orbit-one" />
          <span className="af-art-orbit af-art-orbit-two" />
          <svg className="af-pet-illustration" viewBox="0 0 540 510" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <ellipse cx="269" cy="456" rx="192" ry="24" fill="#193D32" opacity=".15"/>
            <path d="M180 330c-23-54-18-135 7-166 25-30 54-38 98-30 61 11 98 61 98 129 0 38-13 66-24 87l37 100H157l23-120Z" fill="#F9E7BC"/>
            <path d="M176 179c-39-19-83 3-91 41-6 28 10 63 41 64 29 1 48-25 50-53l17-34-17-18Z" fill="#4E3427"/>
            <path d="M340 172c34-24 76-7 90 27 14 35-2 79-34 84-25 4-45-14-51-41l-21-48 16-22Z" fill="#4E3427"/>
            <path d="M197 197c28-25 54-34 82-31 41 4 67 19 82 47 16 31 9 100-10 126-24 31-64 43-102 35-62-13-86-69-70-131 5-18 12-34 18-46Z" fill="#F7DDA8"/>
            <ellipse cx="232" cy="267" rx="9" ry="12" fill="#18392C"/>
            <ellipse cx="320" cy="267" rx="9" ry="12" fill="#18392C"/>
            <path d="M257 307c11-9 33-10 44 0 4 5-6 23-22 23-17 0-27-17-22-23Z" fill="#533B2E"/>
            <path d="M278 329c-2 11-14 17-25 14m25-14c4 12 13 15 25 13" stroke="#533B2E" strokeWidth="6" strokeLinecap="round"/>
            <path d="M280 345c-4 23-2 39 9 45 13 6 24-12 17-29" fill="#FF8D7E"/>
            <path d="M279 343v15" stroke="#533B2E" strokeWidth="4" strokeLinecap="round"/>
            <path d="M167 409c39-18 76-11 105 13 30-28 68-34 106-13l18 41H148l19-41Z" fill="#F1C47C"/>
            <path d="M112 92c-17-25 13-67 53-64 38 3 58 29 54 57-4 31-25 61-58 59-29-2-43-24-49-52Z" fill="#89C5CD"/>
            <path d="M141 82c12-24 45-21 57 5-1 30-20 49-46 49-18-10-23-29-11-54Z" fill="#1D697A"/>
            <path d="m115 72-30 6 32 15" fill="#E89943"/>
            <circle cx="174" cy="65" r="5.8" fill="#163A38"/>
            <path d="M179 127c-8 22-7 39 4 50" stroke="#163A38" strokeWidth="5" strokeLinecap="round"/>
            <path d="M160 129c-11 28-10 46-2 55" stroke="#163A38" strokeWidth="5" strokeLinecap="round"/>
            <path d="M215 39c8-12 15-17 22-17m-8 38c20-7 31-6 40 0" stroke="#D7F8A8" strokeWidth="5" strokeLinecap="round"/>
            <circle cx="410" cy="102" r="10" fill="#EC8F59"/>
            <path d="M416 143c18-4 29-17 33-35m-52 28c-1-16-9-25-24-30" stroke="#DEF4A7" strokeWidth="5" strokeLinecap="round"/>
            <path d="M94 348c-15-5-22-18-19-35m28 51c-20 1-34-7-43-26" stroke="#DEF4A7" strokeWidth="6" strokeLinecap="round"/>
          </svg>
          <div className="af-art-sticker"><span>♡</span><strong>Feito para<br/>quem cuida.</strong></div>
          <div className="af-art-label"><PawPrint size={17}/> AVES & PETS</div>
        </div>
        <div className="af-hero-index" aria-hidden="true">01 / 04 — APRESENTAÇÃO</div>
      </section>

      <div className="af-ticker" aria-label="Categorias de produtos mencionadas em diretórios">
        <span><PawPrint size={15}/> RAÇÕES</span><span><Bird size={15}/> AVES</span><span><Heart size={15}/> PETISCOS</span>
        <span><Scissors size={15}/> BANHO E TOSA</span><span><Fish size={15}/> PESCA</span><span><Leaf size={15}/> JARDIM</span>
      </div>

      <section className="af-catalog" id="encontre" aria-labelledby="af-catalog-title">
        <div className="af-section-top">
          <div><p className="af-kicker">UM LUGAR, MUITAS DESCOBERTAS</p><h2 id="af-catalog-title">O que você<br/><em>procura hoje?</em></h2></div>
          <p>Mais direto que percorrer uma lista interminável: escolha o que procura e siga para uma consulta específica. <strong>Sem promessas de estoque não confirmado.</strong></p>
        </div>
        <div className="af-category-grid">
          {categories.map((item, index) => {
            const Icon = item.icon;
            return (
              <button key={item.key} className={`af-category af-tone-${item.tone}`} onClick={() => open(item.key)} aria-label={`${isLive ? "Consultar" : "Simular consulta sobre"} ${item.name}`}>
                <div className="af-category-top"><span>{String(index + 1).padStart(2, "0")}</span><ArrowUpRight size={23}/></div>
                <div className="af-category-icon"><Icon strokeWidth={1.45} size={63}/></div>
                <div><p>{item.kicker}</p><h3>{item.name}</h3><small>{item.text}</small></div>
              </button>
            );
          })}
        </div>
        <p className="af-source-caption">* Categorias divulgadas em diretórios públicos. Valores, estoque, agenda e disponibilidade dependem de confirmação.</p>
      </section>

      <section className="af-guide" id="guia" aria-labelledby="af-guide-title">
        <div className="af-guide-lead">
          <span className="af-kicker af-kicker-light"><Sparkles size={16}/> NÃO É SÓ UMA VITRINE</span>
          <h2 id="af-guide-title">Uma pergunta.<br/><em>Um caminho.</em></h2>
          <p>Um guia de interesse para organizar sua consulta de produtos e cuidados, antes de solicitar orçamento.</p>
          <div className="af-guide-doodle" aria-hidden="true"><PawPrint size={124} strokeWidth={.85}/></div>
        </div>
        <div className="af-guide-widget">
          <span className="af-widget-label">GUIA DE INTERESSE {isLive ? "· AGROPET FILT" : "· DEMONSTRAÇÃO"}</span>
          <h3>Para quem é a sua busca?</h3>
          <div className="af-choice-row" role="group" aria-label="Escolha o tipo de pet">
            <button aria-pressed={guide === "cao"} className={guide === "cao" ? "is-active" : ""} onClick={() => setGuide("cao")}><Dog size={20}/> Cão</button>
            <button aria-pressed={guide === "ave"} className={guide === "ave" ? "is-active" : ""} onClick={() => setGuide("ave")}><Bird size={20}/> Ave</button>
            <button aria-pressed={guide === "outro"} className={guide === "outro" ? "is-active" : ""} onClick={() => setGuide("outro")}><PawPrint size={20}/> Outro</button>
          </div>
          <div className="af-guide-result" aria-live="polite">
            <span>CAMINHO SUGERIDO</span>
            <h4>{guides[guide].title}</h4>
            <p>{guides[guide].detail}</p>
          </div>
          <button className="af-button af-guide-action" onClick={() => open(guides[guide].interest)}>{isLive ? "Solicitar consulta" : "Simular consulta"} <ArrowRight size={18}/></button>
          <small>Conteúdo orientativo geral, sem recomendação veterinária ou confirmação de itens disponíveis.</small>
        </div>
      </section>

      <section className="af-story" aria-labelledby="af-story-title">
        <div className="af-story-symbol" aria-hidden="true">
          <span className="af-story-star">✳</span><span>UM BAIRRO.<br/>MUITOS<br/>CUIDADOS.</span><span className="af-story-curve">↗</span>
        </div>
        <div className="af-story-copy">
          <p className="af-kicker">PERTINHO DE VOCÊ, EM PINHAIS</p>
          <h2 id="af-story-title">Seu próximo cuidado pode começar <em>no caminho de casa.</em></h2>
          <p>A Agropet Filt é um comércio de bairro em Vargem Grande, Pinhais, com rações, artigos para aves e outras categorias descritas em referências públicas. Consulte a equipe sobre preços e disponibilidade.</p>
          <div className="af-story-bullets">
            <span><Check size={16}/> Localização pública identificada</span>
            <span><Check size={16}/> Categorias com fonte rastreável</span>
            <span><Check size={16}/> Consulta por interesse</span>
          </div>
        </div>
      </section>

      <section className="af-location" id="localizacao" aria-labelledby="af-location-title">
        <div className="af-location-info">
          <p className="af-kicker">VENHA ENCONTRAR A LOJA</p>
          <h2 id="af-location-title">Tem lugar<br/>que é <em>pertinho.</em></h2>
          <div className="af-address"><MapPin size={25}/><div><strong>Vargem Grande · Pinhais, Paraná</strong><span>{street}</span></div></div>
          <div className="af-hours"><Clock3 size={23}/><div><strong>Horário informado por diretórios</strong><span>Segunda a sábado, das 8h30 às 19h30; domingo fechado. Confirme antes de sair.</span></div></div>
          <a href={mapHref} target="_blank" rel="noopener noreferrer" className="af-button af-button-dark">Ver endereço no Google Maps <ArrowUpRight size={19}/></a>
        </div>
        <div className="af-map-art" aria-label="Representação gráfica ilustrativa do bairro. Não é mapa cartográfico." role="img">
          <div className="af-map-street af-map-street-one" /><div className="af-map-street af-map-street-two" /><div className="af-map-street af-map-street-three" />
          <div className="af-map-grid" />
          <div className="af-map-pin"><MapPin size={30} fill="currentColor"/><strong>AGROPET FILT</strong><small>VARGEM GRANDE</small></div>
          <p>PINHAIS — PR <span>ESQUEMA ILUSTRATIVO</span></p>
        </div>
      </section>

      <section className="af-faq" aria-labelledby="af-faq-title">
        <div><p className="af-kicker">SEM LETRAS MIÚDAS</p><h2 id="af-faq-title">Antes de ir, <em>vale saber.</em></h2></div>
        <div className="af-faq-list">
          <details><summary>Quais tipos de produtos aparecem na loja? <span>+</span></summary><p>Os diretórios consultados mencionam rações, acessórios, petiscos, artigos para pássaros, pesca e jardinagem. Marcas e estoque precisam ser confirmados.</p></details>
          <details><summary>A loja faz banho e tosa? <span>+</span></summary><p>Esse serviço aparece nas descrições públicas, mas agenda, porte atendido e disponibilidade ainda não foram confirmados diretamente pelo responsável.</p></details>
          <details><summary>Posso consultar produtos por esta página? <span>+</span></summary><p>{isLive ? "Sim. Registre sua consulta e um telefone para retorno. Isso não é compra nem reserva: preços, estoque, entrega e agenda são confirmados separadamente." : "Esta prévia simula uma consulta, sem enviar pedidos à loja."}</p></details>
          <details><summary>Esta página pertence à loja? <span>+</span></summary><p>{isLive ? "Esta é a página de portfólio autorizada na infraestrutura da 0WEB. Os dados do estabelecimento estão sujeitos a atualização pela equipe." : "Não. É uma proposta independente de presença digital construída a partir de fontes públicas, sem afiliação ou endosso confirmado."}</p></details>
        </div>
      </section>

      <footer className="af-footer">
        <div className="af-footer-main"><PawPrint size={35}/><h2>O cuidado começa<br/><em>perto de casa.</em></h2><button onClick={() => open("racoes")}>{isLive ? "Solicitar consulta" : "Conhecer o fluxo demonstrativo"} <ArrowUpRight size={20}/></button></div>
        <div className="af-footer-bottom"><span>AGROPET FILT · {isLive ? "PINHAIS" : "CONCEITO NÃO OFICIAL"}</span><span>{isLive ? "Portfólio publicado na" : "Projeto demonstrativo da"} <a href="https://0web.com.br" target="_blank" rel="noopener noreferrer">0WEB</a> · 2026</span></div>
        <div className="af-host-credit"><PortfolioHostCredit /></div>
      </footer>

      {interest && selected && (
        <div className="af-dialog-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div className="af-dialog" role="dialog" aria-modal="true" aria-labelledby="af-dialog-heading">
            <div className="af-dialog-head">
              <div><span>AGROPET FILT · {isLive ? "ATENDIMENTO" : "EXPERIÊNCIA DEMONSTRATIVA"}</span><h2 id="af-dialog-heading">Consulta guiada</h2></div>
              <button aria-label="Fechar consulta" onClick={close}><X size={23}/></button>
            </div>
            <div className="af-progress" aria-label={`Passo ${step} de 3`}><span style={{ width: `${(step / 3) * 100}%` }}/></div>
            {step === 1 && <div className="af-dialog-body">
              <span className="af-step">ETAPA 01 · ESCOLHA SUA NECESSIDADE</span>
              <h3>Sobre o que você quer consultar?</h3>
              <div className="af-dialog-grid">{categories.map((item) => { const Icon = item.icon; return <button aria-pressed={item.key === interest} className={item.key === interest ? "is-selected" : ""} key={item.key} onClick={() => setInterest(item.key)}><Icon size={20}/>{item.name}</button>; })}</div>
              <button className="af-dialog-next" onClick={() => setStep(2)}>Continuar <ArrowRight size={18}/></button>
            </div>}
            {step === 2 && <div className="af-dialog-body">
              <span className="af-step">ETAPA 02 · DETALHE SUA BUSCA</span>
              <h3>O que você precisa saber?</h3>
              <p>{isLive ? "Descreva o item ou serviço procurado. A disponibilidade será confirmada pela equipe." : "Descreva um item, espécie ou tipo de serviço. Não informe nome, telefone nem dados pessoais: esta prévia não envia mensagens."}</p>
              <label htmlFor="af-brief">Detalhes da consulta (opcional)</label>
              <textarea id="af-brief" value={brief} maxLength={280} onChange={(event) => setBrief(event.target.value)} placeholder={interest === "banho" ? "Exemplo: banho para cão pequeno, consultar agenda." : "Exemplo: ração para cão adulto, consultar marcas."} />
              <div className="af-dialog-actions"><button onClick={() => setStep(1)}><ArrowLeft size={17}/> Voltar</button><button className="af-dialog-next" onClick={() => setStep(3)}>Ver resumo <ArrowRight size={17}/></button></div>
            </div>}
            {step === 3 && <div className="af-dialog-body">
              <span className="af-step">ETAPA 03 · {isLive ? "FINALIZAR CONSULTA" : "SIMULAÇÃO CONCLUÍDA"}</span>
              {protocol ? (
                <>
                  <div className="af-dialog-done"><Check size={33}/></div>
                  <h3>Consulta registrada!</h3>
                  <div className="af-dialog-summary"><strong>Protocolo: {protocol}</strong><p>Guarde este número. Produtos e agenda dependem de confirmação.</p></div>
                  <button className="af-dialog-next" onClick={close}>Concluir <Check size={18}/></button>
                </>
              ) : isLive ? (
                <>
                  <h3>Como podemos retornar?</h3>
                  <div className="af-dialog-summary"><strong>{selected.name}</strong><p>{brief.trim() || "Consulta de disponibilidade e condições."}</p></div>
                  <label htmlFor="af-contact-name">Seu nome</label>
                  <input id="af-contact-name" className="af-dialog-input" autoComplete="name" maxLength={90} value={name} onChange={e=>setName(e.target.value)} placeholder="Nome"/>
                  <label htmlFor="af-contact-phone">Telefone com DDD para retorno</label>
                  <input id="af-contact-phone" className="af-dialog-input" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="DDD + número para retorno"/>
                  <label className="af-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> Autorizo o registro destes dados e contato sobre a consulta conforme a <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> da 0WEB.</label>
                  {error && <p role="alert" className="af-form-error">{error}</p>}
                  <div className="af-dialog-actions"><button disabled={sending} onClick={()=>setStep(2)}><ArrowLeft size={17}/> Voltar</button><button disabled={sending || !consent} className="af-dialog-next" onClick={finish}>{sending ? "Registrando..." : "Registrar consulta"} <ArrowRight size={17}/></button></div>
                </>
              ) : (
                <>
                  <div className="af-dialog-done"><Check size={33}/></div>
                  <h3>Assim seria o início da sua consulta.</h3>
                  <div className="af-dialog-summary"><strong>{selected.name}</strong><p>{brief.trim() || "Sem detalhes adicionais."}</p></div>
                  <p><strong>Nenhum pedido foi enviado ou armazenado.</strong> Demonstração sem coleta de dados.</p>
                  <button className="af-dialog-next" onClick={close}>Concluir demonstração <Check size={18}/></button>
                </>
              )}
            </div>}
            <div className="af-dialog-foot"><span><Package size={16}/> Sem estoque ou agendamento fictício</span><span>{isLive ? "Registro seguro · 0WEB" : "Prévia segura · 0WEB"}</span></div>
          </div>
        </div>
      )}
    </main>
  );
}

/** Render público do portfólio autorizado — mantém a prévia isolada no mesmo sistema visual. */
export function AgropetFiltPage() { return <AgropetFiltPreviewPage mode="live" />; }
