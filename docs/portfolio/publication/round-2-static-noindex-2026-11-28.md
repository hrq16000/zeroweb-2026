# 0WEB — Rodada 2: páginas estáticas em revisão comercial
Data: 2026-11-28
Repositório: hrq16000/zeroweb-2026

## Regra aplicada
As seis páginas permanecem como apresentações estáticas, acessíveis tecnicamente, com `noindex` e sem submissão de formulário, pedido ou reserva. Os registros comerciais continuam em Draft. Nenhuma informação não confirmada foi promovida a contato, preço, cardápio ou disponibilidade.

| Projeto | Correção pública | Evidência / dependência remanescente |
|---|---|---|
| Infinito Spa | Formulário em espanhol removido; apresentação estática | Migration/código de `lead_submissions` existem; persistência Production não confirmada. Handoff WhatsApp respondeu HTTP 503. Revisão de Roze pendente. |
| Espaço Marli Nails | Jotform demonstrativo removido; manicure/pedicure em cartões informativos | Jotform `263257363729062`: 1 submissão sintética, sem entrega à profissional. Sem WhatsApp validado ou fotos reais autorizadas. |
| BPL Locações | Quiz removido; apresentação estática baseada no panfleto | Pesquisa pública não encontrou fonte independente verificável para a empresa. Canais, vínculo, fotos e condições aguardam confirmação. |
| Toop Assados | Simulador/formulário e preços/cardápio removidos | Jotform `263260727590056`: 1 submissão sintética. Repositório contém apenas ilustração editorial, sem fotografias reais do estabelecimento. |
| Panificadora Doce Coração | Jotform removido; CTA direciona à localização | Jotform `263264367955065`: 1 submissão sintética; recebe na 0WEB, não encaminha à padaria. |
| Salgados da Fran | Quiz removido; CTAs passam a navegação estática | Sem cardápio, preço ou canal oficial de pedidos confirmado; sem WhatsApp público. QA visual anterior preservado como referência, sujeito a reexecução após esta alteração. |

## Publicação e indexação
- Os seis slugs permanecem `status=draft` e `indexable=false` no catálogo.
- `live=true` representa apenas rota técnica acessível, não aprovação comercial.
- As seis páginas não devem aparecer no sitemap enquanto Draft/noindex.
- Os formulários externos e seus registros históricos foram preservados; apenas a apresentação pública foi removida.
- QA 390/768/1440 deve ser concluído nos workflows automáticos antes do merge e do deploy consolidado.
