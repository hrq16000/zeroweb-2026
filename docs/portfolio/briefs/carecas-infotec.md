# Creative brief — Careca's Infotec

Contrato: v2 · Slug: `carecas-infotec` · Client key: `carecas-infotec`

- businessTruth: assistência técnica de bairro em São José dos Pinhais — PR, que
  conserta celular, computador, notebook, impressora, monitor, tablet, videogame
  e faz recarga de cartucho e toner, com diagnóstico antes do reparo.
- audience: moradores e pequenos comércios da região com aparelho parado e
  necessidade de orçamento claro antes de autorizar o serviço.
- singleGoal: receber a descrição do aparelho e do defeito pelo funil próprio.
- brandPersonality: direta, técnica, popular e confiável.
- visualMetaphor: painel de oficina — placa preta com sinalização amarela.
- layoutTopology: hero em duas colunas, grade de oito aparelhos, trilha de três
  etapas com imagem lateral, faixa de compromissos e bloco final de loja + CTA.
- heroArchetype: manchete em caixa alta com selo amarelo e arte oficial ao lado.
- navigationArchetype: barra fixa mínima com três âncoras e CTA sólido.
- sectionRhythm: alternância entre fundo carvão e cartão mais claro, sem
  sobreposições dramáticas.
- typePairing: tipografia sans do sistema em pesos black/semibold, caixa alta
  nos títulos, corrido em leitura normal.
- colorRoles: carvão arroxeado como base, amarelo da marca como ação e destaque,
  cinza claro para leitura.
- imageStrategy: material oficial do cliente (comunicação impressa da loja),
  recortado para excluir contato pessoal. Nenhuma foto de equipe ou de serviço
  executado é simulada.
- iconStrategy: lucide-react em traço uniforme, um ícone por aparelho.
- motionGrammar: revelações curtas em transform/opacity, stagger de grade,
  fallback só de opacidade em `prefers-reduced-motion`.
- interactionSignature: borda amarela nos cartões e CTA presente em cada bloco
  de decisão.
- conversionNarrative: problema do aparelho → o que é atendido → como funciona →
  compromissos → onde fica e agendamento.
- proofStrategy: somente evidência verificável da comunicação oficial (escopo de
  serviços, compromissos declarados e endereço). Sem notas, depoimentos,
  números ou prêmios.
- nearestPortfolioRisks: `conserta-mirassol`, `assistencia-microondas-santos` e
  `eletro-solucoes-eficazes` — mesmo ramo técnico.
- antiTemplateDecisions: paleta carvão+amarelo exclusiva, títulos em caixa alta,
  cantos retos (rounded-md) em vez do arredondamento suave usado nos vizinhos,
  grade de oito aparelhos em vez de trio de serviços, e hero com arte oficial da
  loja em vez de fotografia genérica.

## Assets oficiais recebidos

Duas fotografias da comunicação oficial da loja enviadas pelo responsável em
2026-09-08. Recorte usado em `public/images/carecas-infotec/` (banner, serviços,
logo e social). Área com telefone e QR code foi excluída do recorte.

## Skills selecionadas

`0web-skill-router`, `0web-portfolio-art-direction`, `0web-design-system`,
`0web-ui-quality-gates`.

## Skills rejeitadas e motivo

Especialidades de e-commerce e de prova social — não há catálogo transacional
nem evidência auditável de avaliações.

## Validação final

- [x] identidade escopada ao cliente
- [x] override de motion próprio
- [x] hero/composição distintos dos portfolios mais próximos
- [x] imagens classificadas corretamente
- [x] funil individual funcional
- [x] secret server-side configurado quando houver contato oficial
- [x] mobile/desktop/teclado/reduced-motion
- [x] originality + a11y + performance + privacy + build
