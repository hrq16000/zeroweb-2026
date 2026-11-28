import { useState } from "react";
import { ArrowDownRight, ArrowRight, Check, Clock3, Heart, MapPin, Sparkles } from "lucide-react";
import "./leticia-reiche.css";

type Care = "Manicure" | "Pedicure";

const careOptions: { name: Care; eyebrow: string; description: string; number: string }[] = [
  {
    name: "Manicure",
    eyebrow: "Cuidado com as mãos",
    description: "Um momento reservado para cuidar das unhas das mãos. Consulte os procedimentos e acabamentos disponíveis.",
    number: "01",
  },
  {
    name: "Pedicure",
    eyebrow: "Cuidado com os pés",
    description: "Categoria ilustrativa do briefing; detalhes e disponibilidade aguardam confirmação da profissional.",
    number: "02",
  },
];

/** Preview-only editorial concept. No official identity, form, contact or booking is activated. */
export function LeticiaReichePreviewPage() {
  const [selectedCare, setSelectedCare] = useState<Care>("Manicure");

  return (
    <div className="lr" data-portfolio-client="leticia-reiche" data-page-mode="preview-only">
      <a className="lr-skip" href="#cuidados">Pular para os serviços</a>
      <div className="lr-preview-notice" role="status">
        <span className="lr-preview-dot" aria-hidden="true" />
        Demonstração visual 0WEB · não é site oficial. Identidade, serviços e localidade aguardam confirmação da profissional. Nenhum formulário ou contato está ativo.
      </div>

      <header className="lr-header" id="inicio">
        <a className="lr-wordmark" href="#inicio" aria-label="Letícia Reiche, início da página">
          <img src="/images/leticia-reiche/logo.svg" alt="" width="58" height="58" />
          <span>Letícia <em>Reiche</em><small>MANICURE &amp; PEDICURE</small></span>
        </a>
        <nav className="lr-nav" aria-label="Navegação da prévia">
          <a href="#cuidados">Cuidados</a>
          <a href="#processo">Como funciona</a>
          <a href="#solicitar">Como agendar</a>
        </nav>
        <a className="lr-header-action" href="#cuidados">Ver cuidados <ArrowRight size={17} aria-hidden="true" /></a>
      </header>

      <main>
        <section className="lr-stage" aria-labelledby="lr-stage-title">
          <div className="lr-vertical-note" aria-hidden="true">CONCEITO VISUAL 0WEB / REGIÃO A CONFIRMAR</div>
          <div className="lr-stage-copy">
            <p className="lr-kicker"><span className="lr-star" aria-hidden="true">✳</span> UMA PAUSA PARA VOCÊ</p>
            <h1 id="lr-stage-title">O cuidado <i>começa</i> nos pequenos detalhes<span className="lr-title-period">.</span></h1>
            <p className="lr-stage-intro">
              Conceito visual 0WEB para uma proposta de manicure e pedicure. Nome, serviços e região foram recebidos no briefing e aguardam confirmação da profissional.
            </p>
            <div className="lr-stage-actions">
              <a className="lr-button lr-button-primary" href="#cuidados">Conheça os cuidados <ArrowRight size={19} aria-hidden="true" /></a>
              <a className="lr-text-link" href="#solicitar">Limites desta demonstração <ArrowDownRight size={19} aria-hidden="true" /></a>
            </div>
            <div className="lr-stage-stamp"><Heart size={17} aria-hidden="true" /> O seu momento merece atenção.</div>
          </div>
          <div className="lr-stage-visual">
            <div className="lr-photo-frame">
              <img
                src="/images/leticia-reiche/editorial.svg"
                alt="Arte editorial de frasco de esmalte em tons de vinho e rosa. Ilustração conceitual, não foto de procedimento."
                width="800"
                height="950"
                fetchPriority="high"
              />
              <span className="lr-photo-corner" aria-hidden="true">L / R</span>
            </div>
            <div className="lr-visual-seal" aria-label="Identidade editorial de demonstração"><span>cuidado</span><b>com<br />carinho</b><Sparkles size={19} aria-hidden="true" /></div>
            <p className="lr-visual-caption">01 / O universo de cuidado da Letícia</p>
          </div>
        </section>

        <section className="lr-care-section" id="cuidados" aria-labelledby="lr-care-title">
          <div className="lr-care-heading">
            <p className="lr-eyebrow">O QUE VOCÊ PROCURA?</p>
            <h2 id="lr-care-title">Escolha o seu <em>momento.</em></h2>
            <p>Selecione uma categoria para visualizar o próximo passo. Detalhes de técnicas, preços e disponibilidade serão confirmados pela profissional.</p>
          </div>
          <div className="lr-care-ledger" role="group" aria-label="Escolha entre manicure e pedicure">
            {careOptions.map((care) => (
              <button
                type="button"
                key={care.name}
                className={"lr-care-row" + (selectedCare === care.name ? " lr-care-row-active" : "")}
                onClick={() => setSelectedCare(care.name)}
                aria-pressed={selectedCare === care.name}
              >
                <span className="lr-care-number">{care.number}</span>
                <span className="lr-care-description"><small>{care.eyebrow}</small><strong>{care.name}</strong><span>{care.description}</span></span>
                <span className="lr-care-select" aria-hidden="true">{selectedCare === care.name ? <Check size={22} /> : <ArrowRight size={22} />}</span>
              </button>
            ))}
          </div>
          <div className="lr-care-summary" aria-live="polite">
            <span><Check size={18} aria-hidden="true" /> Selecionado: <strong>{selectedCare}</strong></span>
            <a href="#solicitar">Entenda os limites da prévia <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="lr-steps" id="processo" aria-labelledby="lr-steps-title">
          <div className="lr-steps-head">
            <span className="lr-round-icon"><Clock3 size={26} aria-hidden="true" /></span>
            <p className="lr-eyebrow">COMO ESTA PRÉVIA FUNCIONA</p>
            <h2 id="lr-steps-title">Uma proposta visual, <em>sem atendimento ativo.</em></h2>
          </div>
          <ol className="lr-steps-list">
            <li><span>01</span><div><strong>Conheça o conceito</strong><p>As categorias exibidas são referências recebidas no briefing, ainda sujeitas à confirmação da profissional.</p></div></li>
            <li><span>02</span><div><strong>Confira os limites</strong><p>Preços, duração, endereço, horários, disponibilidade e agenda não são publicados nesta demonstração.</p></div></li>
            <li><span>03</span><div><strong>Aguarde a aprovação</strong><p>O atendimento só poderá ser ativado depois da autorização escrita da profissional e da validação do canal oficial.</p></div></li>
          </ol>
        </section>

        <section className="lr-request" id="solicitar" aria-labelledby="lr-request-title">
          <div className="lr-request-paper">
            <div className="lr-request-line"><MapPin size={17} aria-hidden="true" /><span>Localidade informada no briefing · a confirmar</span><span className="lr-request-line-end">PRÉVIA RESTRITA</span></div>
            <p className="lr-eyebrow">DEMONSTRAÇÃO SEM ATENDIMENTO ATIVO</p>
            <h2 id="lr-request-title">Esta prévia não recebe <em>solicitações.</em></h2>
            <p>Você selecionou <${selectedCare.toLowerCase()}>. Esta demonstração não coleta dados, não reserva horários e não encaminha mensagens à profissional.</p>
            <div className="lr-request-privacy">
              <strong>O que permanece desativado</strong>
              <p>Formulário, WhatsApp, agenda, preços e disponibilidade só poderão ser apresentados depois da confirmação escrita da profissional.</p>
            </div>
            <button type="button" className="lr-button lr-button-primary" disabled aria-disabled="true" title="Atendimento indisponível até a aprovação comercial.">
              Agendamento indisponível nesta demonstração <ArrowRight size={20} aria-hidden="true" />
            </button>
            <p id="lr-request-status" className="lr-request-helper" role="status">
              Nenhum dado é coletado. Nenhuma mensagem é enviada. Nenhum horário é reservado.
            </p>
          </div>
          <div className="lr-request-signature" aria-hidden="true">L<span>♡</span>R</div>
        </section>
      </main>

      <div className="lr-bottom-note">
        <span>DEMONSTRAÇÃO 0WEB · NÃO É SITE OFICIAL</span>
        <a href="https://0web.com.br" target="_blank" rel="noopener noreferrer">Demonstração criada pela 0WEB <ArrowRight size={14} aria-hidden="true" /></a>
      </div>
    </div>
  );
}
