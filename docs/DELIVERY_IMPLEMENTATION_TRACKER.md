# 0WEB — DELIVERY IMPLEMENTATION TRACKER

**Base:** os 8 documentos de concepção/governança foram integrados por meio da PR #482 (2026-11-02). Isso **não** significa um delivery pronto. A fase abaixo é código real implementado em PRs pequenas, sem interferir nos funis existentes.

**Estimativa inicial:** 6 marcos funcionais. Cada marco pode exigir mais de uma PR ou ser subdividido conforme segurança/CI, sem inventar percentual de produção.

| Marco | Escopo | Evidência / status |
|---|---|---|
| **P1/6** | motor de preços com centavos, pizza, addon e desconto | PR #483, cálculo real e fixtures no CI, merge pendente na elaboração desta R2 |
| **P2/6** | resolver catálogo publicado por tenant/store, variantes e opções, pronto para uso pelo motor P1 | esta PR, código isolado e testes; **não** consulta banco real nem autentica usuários |
| **P3/6** | carrinho persistido, cotação autoritativa de servidor, entrega/cobertura, integração P1+P2 | `NOT_IMPLEMENTED` |
| **P4/6** | tabelas e operações de pedido durável, autorização por loja, idempotência e outbox | `NOT_IMPLEMENTED` |
| **P5/6** | pagamento sandbox + callbacks verificados, pagamento offline e tracking de pedido | `NOT_IMPLEMENTED` |
| **P6/6** | operação real da loja/cozinha/KDS, segurança cross-tenant, testes E2E, homologação e piloto | `NOT_IMPLEMENTED` |

**Atenção:** os marcos P3–P6 são complexos, e a quantidade final de micro-PRs pode superar seis. A aprovação só é possível com evidência real de backend/QA, e não com status documental. Não habilitar `orderEnabled`, não prometer `DELIVERY_READY=PASS`, não instalar novo gateway ou mexer no DNS por causa de um teste isolado.

## Limites da P2

`src/lib/delivery/catalog-resolver.mjs` resolve **somente seleções de catálogo previamente carregado e autorizado pelo servidor**, sem consultar banco. Rejeita versões desatualizadas, variantes indisponíveis, opções fora do grupo, frações inválidas e referência de outro tenant/store. Não utiliza preços fornecidos pelo navegador. A saída `pricingInput` poderá alimentar o motor P1 **somente após a futura camada de contexto autenticado e catálogo confiável**.

Composição de combo com slots é explicitamente rejeitada como `COMBO_SLOT_VALIDATION_NOT_IMPLEMENTED` até uma PR específica validar os componentes. Nenhum valor de combo é cobrado erroneamente. A P2 não prova RLS, autenticação, checkout, pagamento, estoques ou pedidos.

## Gates do programa

- Cada PR testa a própria funcionalidade no CI e preserva build, hidratação, SEO/funis e regressão visual.
- O gate `scripts/delivery/check-operational-readiness.mjs` permanece **fail-closed**, independentemente de validações unitárias dos módulos.
- Não reaproveitar `/servicos`, `PortfolioCTAQuiz` ou WhatsApp como fonte da verdade dos pedidos.
- Manter tudo modular e operável pelo GitHub/Codex, sem gastar créditos Lovable e sem alterar DNS.
