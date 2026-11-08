import { useState } from "react";
import { ArrowDownRight, ArrowRight, CalendarDays, Check, Clock3, Heart, MapPin, Sparkles } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { LETICIA_REICHE_BOOKING_CONFIG, LETICIA_REICHE_CLIENT_KEY } from "@/lib/leticia-reiche-booking";
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
    description: "Atenção e cuidado para os pés. Confirme as opções de atendimento diretamente no agendamento.",
    number: "02",
  },
];

/**
 * R2: prévia visual independente da profissional, sem coleta nem redirect.
 * R3 permite CTA somente em piloto server-side opt-in e com funil exclusivo; R4 promove a rota pública,
 * após testes de persistência, identidade e readiness.
 */
export function LeticiaReichePreviewPage({ pilotEnabled = false }: { pilotEnabled?: boolean }) {
  const [selectedCare, setSelectedCare] = useState<Care>("Manicure");

  return (
    <div className="lr" data-portfolio-client="leticia-reiche" data-page-mode={pilotEnabled ? "pilot-preview" : "preview"}>
      <a className="lr-skip" href="#cuidados">Pular para os serviços</a>
      <div className="lr-preview-notice" role="status">
        <span className="lr-preview-dot" aria-hidden="true" />
        Prévia de portfólio 0WEB · identidade e condições sujeitas a confirmação
      </div>

      <header className="lr-header" id="inicio">
        <a className="lr-wordmark" href="#inicio" aria-label="Letícia Reiche, início da página">
          <img src="/images/leticia-reiche/logo.svg" alt="" width="58" height="58" />
          <span>Letícia <em>Reiche</em><small>MANICURE &amp; PEDICURE</small></span>
        </a>
        <nav className="lr-nav" aria-label="Navegação da prévia">
          <a href="#cuidados">Cuidados</a>
          <a href="#natal">Natal 2026</a>
          <a href="#solicitar">Como agendar</a>
        </nav>
        <a className="lr-header-action" href="#cuidados">Ver cuidados <ArrowRight size={17} aria-hidden="true" /></a>
      </header>

      <main>
        <section className="lr-stage" aria-labelledby="lr-stage-title">
          <div className="lr-vertical-note" aria-hidden="true">BELEZA EM CADA DETALHE / BELFORD ROXO — RJ</div>
          <div className="lr-stage-copy">
            <p className="lr-kicker"><span className="lr-star" aria-hidden="true">✳</span> UMA PAUSA PARA VOCÊ</p>
            <h1 id="lr-stage-title">O cuidado <i>começa</i> nos pequenos detalhes<span className="lr-title-period">.</span></h1>
            <p className="lr-stage-intro">
              Manicure e pedicure em Belford Roxo. Descubra uma proposta de cuidado delicado
              e solicite informações sobre o atendimento da Letícia Reiche.
            </p>
            <div className="lr-stage-actions">
              <a className="lr-button lr-button-primary" href="#cuidados">Conheça os cuidados <ArrowRight size={19} aria-hidden="true" /></a>
              <a className="lr-text-link" href="#solicitar">Como funciona o pedido <ArrowDownRight size={19} aria-hidden="true" /></a>
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
            <a href="#solicitar">Saiba como solicitar um horário <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="lr-season" id="natal" aria-labelledby="lr-season-title">
          <div className="lr-season-ornament" aria-hidden="true">✦</div>
          <div className="lr-season-head">
            <p className="lr-eyebrow">ESPECIAL DE FIM DE ANO · 2026</p>
            <h2 id="lr-season-title">Dezembro merece <em>seu brilho.</em></h2>
            <p>De acordo com o anúncio recebido, a agenda de Natal tem abertura anunciada para 9 de novembro de 2026.</p>
          </div>
          <div className="lr-season-cards">
            <div className="lr-date-badge"><CalendarDays size={27} aria-hidden="true" /><small>INÍCIO ANUNCIADO</small><strong>09<span>/</span>11<span>/</span>2026</strong><span>segunda-feira</span></div>
            <div className="lr-deposit-card"><small>SINAL INFORMADO NO ANÚNCIO</small><strong>40<sup>%</sup></strong><p>O material recebido informa sinal de 40% do valor do procedimento para agendamentos da campanha. Condições e disponibilidade devem ser confirmadas antes de qualquer pagamento.</p></div>
          </div>
          <p className="lr-campaign-caveat">Campanha sazonal apresentada como referência do anúncio de 2026. A página não processa pagamentos nem garante vagas.</p>
        </section>

        <section className="lr-steps" aria-labelledby="lr-steps-title">
          <div className="lr-steps-head">
            <span className="lr-round-icon"><Clock3 size={26} aria-hidden="true" /></span>
            <p className="lr-eyebrow">SEM CONFUSÃO NA HORA DE AGENDAR</p>
            <h2 id="lr-steps-title">O caminho até <em>seu horário.</em></h2>
          </div>
          <ol className="lr-steps-list">
            <li><span>01</span><div><strong>Escolha seu cuidado</strong><p>Manicure ou pedicure — detalhes adicionais podem ser informados na solicitação.</p></div></li>
            <li><span>02</span><div><strong>Informe sua preferência</strong><p>Na versão funcional, você indicará período e data desejados em um formulário individual.</p></div></li>
            <li><span>03</span><div><strong>Aguarde a confirmação</strong><p>A escolha não reserva um horário automaticamente. A profissional precisará confirmar a disponibilidade.</p></div></li>
          </ol>
        </section>

        <section className="lr-request" id="solicitar" aria-labelledby="lr-request-title">
          <div className="lr-request-paper">
            <div className="lr-request-line"><MapPin size={17} aria-hidden="true" /><span>Belford Roxo · Rio de Janeiro</span><span className="lr-request-line-end">ATENDIMENTO A CONFIRMAR</span></div>
            <p className="lr-eyebrow">UM HORÁRIO PARA CHAMAR DE SEU</p>
            <h2 id="lr-request-title">Seu próximo cuidado <em>começa aqui.</em></h2>
            <p>Você selecionou <strong>{selectedCare.toLowerCase()}</strong>. A solicitação real de agendamento será habilitada quando o canal de retorno e a persistência de leads estiverem validados.</p>
            {pilotEnabled ? (
              <PortfolioCTAQuiz
                key={selectedCare}
                clientKey={LETICIA_REICHE_CLIENT_KEY}
                studioName="Letícia Reiche"
                recipientName="Letícia"
                theme="pink"
                mode="booking"
                funnelIntent="agendamento"
                quizConfig={LETICIA_REICHE_BOOKING_CONFIG}
                initialAnswers={{ service: selectedCare }}
                skipPrefilledSteps
                ariaLabel={`Solicitar atendimento de ${selectedCare.toLowerCase()} à Letícia Reiche`}
                className="lr-button lr-button-primary"
              >
                Solicitar horário de {selectedCare.toLowerCase()} <ArrowRight size={20} aria-hidden="true" />
              </PortfolioCTAQuiz>
            ) : (
              <button type="button" className="lr-button lr-button-disabled" disabled aria-describedby="lr-request-status">
                Solicitação em preparação <ArrowRight size={20} aria-hidden="true" />
              </button>
            )}
            <p id="lr-request-status" className="lr-request-helper">
              {pilotEnabled
                ? "Ambiente piloto: o formulário registra uma solicitação, não confirma um horário. Sem cobrança ou pagamento. Disponibilidade e valores dependem de confirmação."
                : "Esta é uma prévia visual. Nenhum pedido foi enviado, nenhum horário foi reservado e nenhum pagamento foi cobrado."}
            </p>
          </div>
          <div className="lr-request-signature" aria-hidden="true">L<span>♡</span>R</div>
        </section>
      </main>

      <div className="lr-bottom-note">
        <span>CONCEITO EDITORIAL · NÃO É UMA GALERIA DE TRABALHOS</span>
        <a href="https://0web.com.br" target="_blank" rel="noopener noreferrer">Demonstração criada pela 0WEB <ArrowRight size={14} aria-hidden="true" /></a>
      </div>
    </div>
  );
}
