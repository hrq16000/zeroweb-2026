# Letícia Reiche — Creative Composition Brief V2 (R1)
Data: 07/11/2026 · Identificador proposto: `leticia-reiche` · Belford Roxo/RJ

## Escopo e origem da informação
Amostra comercial para a 0WEB, aprovada pelo operador para desenvolvimento em branch. O material disponível é **um único flyer** com a assinatura "LETÍCIA REICHE — Manicure & Pedicure", campanha "Agenda de Natal aberta", início em **09/11/2026** e **sinal de 40%**; o operador acrescentou cidade e número +55 21 99937-2351. O flyer **não comprova** conta de Instagram, estabelecimento físico, trabalhos realizados, disponibilidade de horários, preço do atendimento ou titularidade de fotos. O telefone **não foi confirmado como WhatsApp**. Não há endereço confirmado para exibir mapa.

Pesquisa pública (07/11/2026): consultas por nome exato, cidade, segmento, telefone e variações; consulta nominal de estabelecimento na região, mais busca por perfis sociais e site. **Não foi possível resolver conta oficial, ficha Google ou galeria com proveniência verificável.** É diferente de afirmar que não existem. Referência factual: `docs/portfolio/enrichment/leticia-reiche.json`.

## Objetivo e audiência
- **Público:** pessoas que procuram manicure e pedicure na região de Belford Roxo; alcance exato depende do bairro a confirmar.
- **Tarefa prioritária:** compreender quais serviços podem ser solicitados e **pedir um agendamento**, sem simular horário real.
- **Conversão R2:** funil individual com qualificação mínima e registro server-side; contato externo só após persistência e confirmação explícita do canal. A agenda real com slots e painel Google é uma etapa funcional separada.
- **Pós-conversão:** protocolo de solicitação; linguagem inequívoca "pedido enviado, sujeito a confirmação", nunca "horário reservado" antes do agendamento efetivo.
- **Risco de decisão:** preço e duração não fornecidos; informar "consulte condições" e não criar valores.

## Três direções substancialmente divergentes
1. **Caderno de agendamentos / ateliê tipográfico (SELECTED)**: hero em formato de página dupla vertical, recortes de papel + linha desenhada de esmalte, navegação em marcadores laterais. Módulo principal orientado a escolher manicure/pedicure e perguntar disponibilidade; campanha Natal como fita efêmera. Conteúdo localizado e termos de confirmação no fluxo. Mobile usa sequência de cartões de agenda roláveis, **não** um hero split comprimido.
2. **Galeria de acabamento / macro editorial (REJECTED agora)**: prova visual ocupa quase toda a primeira dobra e funil é lateral; falta acervo real com autorização e a foto do flyer não comprova autoria. Poderia virar variante após mídia oficial.
3. **Convite festivo de Natal / calendário efêmero (REJECTED como site permanente)**: composição full-bleed de campanhas e slots; ótima peça sazonal, mas expira e transforma promoção em marca permanente, além de insinuar horários disponíveis.

## DNA e composição selecionados
- **Personalidade provisória:** delicada, precisa e acolhedora; tratar como hipótese editorial, não como declaração da profissional.
- **Conceito:** "Cuidado marcado com carinho" — a metáfora é a página de agenda, com espaços de respiro e linhas manuais.
- **Assinatura:** faixa vertical de esmalte que conduz da apresentação à escolha do serviço; selos de calendário sem hora inventada.
- **Tipografia:** serif editorial para assinatura + sans legível para instruções. Rosa suave, vermelho esmalte e vinho; dourado somente em pequenos detalhes.
- **Hero:** página-pôster com assinatura e marcador de calendário; **não** usar foto de concorrente, nem reencenar o flyer.
- **Seções não genéricas:** convite/identidade → decisão entre categorias verificadas → explicação honesta do pedido de horário → campanha com validade editorial → FAQ sobre processo (sem inventar políticas) → conversão.
- **Mídia:** ilustração SVG autoral de pincel/linha cromática, cartão e OG específicos; fotos reais ficam ausentes e assim são rotuladas no plano, sem inventar "galeria de clientes".
- **Motion:** progresso suave da linha quando o usuário avança, hover/focus no seletor, revelações discretas e `prefers-reduced-motion`.
- **Acessibilidade:** contraste funcional de vinho em creme, labels de formulário, alvo de toque >=44px, foco visível, 390/768/1440, sem conteúdo exclusivo de hover.

### Fingerprint proposto
```text
heroGeometry: double-page vertical diary with overset editorial type, no split-hero
headerTreatment: slim tab markers and hand-line emblem, no generic nav bar
sectionGraph: notebook-opening → service-choice-index → explanation-slip → optional-seasonal-insert → process-fold → conversion-close
contentOrder: identidade / escolher finalidade / condições conhecidas / campanha contextual / solicitar
gridTopology: offset editorial columns + timeline ledger + single mobile paper-scroll
mediaDistribution: brand-art only; user-photo held until rights/source confirmation
backgroundRhythm: powder-paper → off-white ink → wine annotation → cream closing
proofPlacement: factual source notes close to campaign and location claims
ctaDistribution: primary request after choice + fixed funnel on mobile + closing CTA
navigationPattern: three tab anchors rather than inherited navbar
motionSignature: ink-stroke progress, reduced-motion static line
closingStructure: full-width burgundy appointment invitation with confirmation disclaimer
roleGraph: orientation → choose service → clarify booking status → submit request
mediaCadence: graphic ink → typographic pause → small editorial seals
interactionLoci: service selector, individual funnel, campaign freshness indicator
decisionAidPlacement: before personal-data capture
densityRhythm: expressive → airy → compact → direct
mobileCompositionStrategy: notebook turns into vertical scroll with sticky request action
```

## Matriz de decisão e anti-cópia
| Papel | Pergunta da cliente | Evidência | Tratamento |
|---|---|---|---|
| Orientação | Quem atende? | Nome/categoria do flyer | Abertura editorial |
| Serviço | Para quê quero marcar? | Manicure/pedicure no flyer | Duas escolhas sem preço |
| Disponibilidade | Qual dia consigo? | **Não há agenda validada** | Preferência/solicitação, não reserva |
| Política | Como funciona o sinal? | Flyer refere 40% para Natal | Aviso contextual, não botão de pagamento |
| Proximidade | Onde atende? | Município do operador | Belford Roxo, sem mapa/pin/endereço fabricado |
| Contato | Para quem vai a solicitação? | Número informado sem validação WhatsApp | Lead-only até confirmar canal |

Referência `R_Beauty` / `Renata Beauty` interna: **apenas infraestrutura de SEO e shell**, sem transplantar layout. Ativos do flyer: aproveitar linguagem cromática em novo projeto autoral, nunca copiar elementos ornamentais/recortes de fotos sem confirmar direitos. Nenhuma alegação de 5 estrelas, anos de experiência ou especialidades não documentadas.

## Requisitos para R2–R4
- `R2`: JSX exclusivo + identidade gráfica/capa/OG + SEO + campanha tratada com expiração, sem ativar rota pública.
- `R3`: funil `leticia-reiche` com persistência antes de contato, isolamento e testes; agenda efetiva somente se houver integração real e horários gerenciados.
- `R4`: gates (creative/uniqueness, SEO, media, funnel, a11y, mobile) + decisão de publicação, verificação no domínio, sitemap e GSC quando acesso autorizado.
- Contatos/dados pendentes: redes oficiais, confirmação WhatsApp, local exato de atendimento, tabela de serviços/preços e duração, fotos oficiais, autorização das imagens, regras do sinal.
- Não alterar DNS, não usar Lovable, não exigir `SUPABASE_SERVICE_ROLE_KEY` para publicar páginas; não publicar com gates incompletos.

## Skill/resource effort ledger — 07/11/2026
- **APPLIED (read-only):** `0web-skill-router`, `0web-portfolio-autonomous-pipeline`, políticas de entity enrichment, lifecycle, zero-generic, unique composition, originalidade/SEO individual, contrato Git e isolamento do funil.
- **APPLIED (princípios já revisados):** `frontend-design` (direção autoral), `ui-ux-pro-max` (intenção de uso), design system 0WEB (identidade por cliente), `web-design-guidelines`/React performance (revisão planejada de acessibilidade e peso visual); fonte original Anthropic da primeira verificada via AwesomeSkill.
- **DISCOVERY:** catálogo de skills local revisado; AwesomeSkill consultado. Não houve instalação nem execução de código de terceiros; fontes marketplace não sobrepõem `docs/skills/SECURITY.md`.
- **PENDING R2–R4:** `0web-experience-design-max`, `0web-portfolio-art-direction`, especialistas CRO, motion, UI gates, browser QA e auditoria real dos 390/768/1440.
- **NOT_APPLICABLE agora:** instalação de bibliotecas de agendamento, gateway de sinal, scraper privado de Instagram/Google, integração de pagamentos e scripts externos de terceiros sem caso de uso comprovado.
