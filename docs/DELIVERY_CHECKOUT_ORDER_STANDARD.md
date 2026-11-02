# 0WEB — DELIVERY CHECKOUT, QUOTES, ORDERS & PAYMENTS STANDARD

**Rodada:** 4 de 8 · **Data:** 2026-11-01 · **Status:** `SPEC_COMPLETE / NO_RUNTIME_IMPLEMENTATION`  
**Escopo:** carrinho persistente, cotação de entrega e preço, checkout, pedido durável e confirmação de pagamento.  
**Documento-mãe:** [DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md](./DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md).  
**Motor de preços:** [DELIVERY_MENU_PRICING_STANDARD.md](./DELIVERY_MENU_PRICING_STANDARD.md).  
**Experiência:** [DELIVERY_STOREFRONT_UX_STATE_MATRIX.md](./DELIVERY_STOREFRONT_UX_STATE_MATRIX.md).  
**Máquinas de estados:** [ORDER_PAYMENT_STATE_MACHINES.v1.json](./delivery/ORDER_PAYMENT_STATE_MACHINES.v1.json).

## 1. Regra arquitetural fundamental

O sistema somente pode afirmar **"pedido recebido"** após transação durável confirmada pelo servidor e geração de identificador de pedido. Abrir WhatsApp, registrar apenas um lead, gravar rascunho no navegador, redirecionar para um gateway ou exibir modal de sucesso **não** representam criação de pedido.

**Separar cinco recursos:**

1. `cartDraft`: intenção local do comprador; sem preço autoritativo, pode persistir temporariamente em cache local com dados não sensíveis;
2. `quote`: cotação imutável, com prazo de validade, validação de catálogo, estoque, horário, entrega, política e preços no servidor;
3. `order`: snapshot de compra imutável criado uma única vez no banco transacional, com estados operacionais;
4. `paymentAttempt`: tentativa de pagamento e eventos financeiros reconciliados independentemente;
5. `fulfillment`: aceitação/preparo/entrega/retirada, conduzidos por painel e regras de operação, sem depender de o cliente estar online.

O estado de pagamento **nunca** é sinônimo do estado operacional; pedidos de pagamento na entrega podem ser aceitos mesmo com pagamento pendente, se a política da loja permitir. Checkout online não avança para pedido em preparo apenas porque o navegador retornou da página do gateway.

## 2. Cart draft e persistência

### Estrutura sugerida

```json
{
  "schemaVersion": 1,
  "storeId": "opaque-store-id",
  "catalogVersionAtSelection": 17,
  "items": [
    {
      "productId": "example-pizza",
      "variantId": "large",
      "quantity": 2,
      "fractions": [
        {"flavorId":"A","numerator":1,"denominator":2},
        {"flavorId":"B","numerator":1,"denominator":2}
      ],
      "selectedOptions": [{"groupId":"edge","optionId":"catupiry","quantity":1}],
      "note": "sem cebola"
    }
  ],
  "updatedAt": "SERVER_OR_CLIENT_ISO_TIMESTAMP"
}
```

Este exemplo usa IDs ilustrativos, **não** é catálogo de uma empresa real. Valores monetários do browser são somente prévia, não elementos confiáveis do pedido. Carrinho pode existir em `localStorage` com TTL e versionamento, mas **não** armazenar endereço, telefone completo, dados de pagamento, tracking token nem segredos em armazenamento acessível por JavaScript. Quando autenticação for oferecida, sincronizar carrinho de conta e anônimo sem misturar lojas.

**Na recuperação:** validar schema, TTL, storeId e catálogo atual; informar exclusões, estoque ou mudanças de preço, exigir revisão; nunca remover itens silenciosamente. Guardar opções e quantidades, não apenas `productId`.

**Acessibilidade:** carrinho via barra acionável no mobile, recálculo não bloqueante e confirmação contextual. Se a rede falhar, manter draft, mas impedir confirmação do pedido sem servidor.

## 3. Checkout server-side — API de referência

Os caminhos seguintes são **design de contrato**, não endpoints publicados. Prefixo de exemplo `/api/v1/delivery`.

| Método | Recurso | Autorização | Responsabilidade |
|---|---|---|---|
| `GET` | `/stores/:storeId/catalog` | pública | catálogo publicado, versões, modalidades, horários e disponibilidade pública |
| `POST` | `/stores/:storeId/quotes` | sessão anônima/autenticada limitada | validar carrinho, modalidade, destino, descontos e calcular total servidor |
| `POST` | `/stores/:storeId/orders` | sessão de checkout + chave de idempotência | criar pedido durável com snapshot de quote e evento `order_created` |
| `GET` | `/orders/:orderId/status` | token opaco do comprador/autenticação | acompanhar pedido com mínimo de informações e sem dados de outros clientes |
| `POST` | `/orders/:orderId/payment-attempts` | acesso ao pedido + idempotência | criar tentativa por provedor, nunca receber números de cartão na 0WEB |
| `GET` | `/orders/:orderId/payment-status` | acesso ao pedido | obter status reconciliado, sem assumir sucesso por browser return |
| `POST` | `/payment-webhooks/:provider` | autenticação forte do provedor | registrar evento idempotente e atualizar estado financeiro validado |
| `POST` | `/operator/stores/:storeId/orders/:orderId/transitions` | usuário operador autorizado da loja | mudanças operacionais versionadas e auditadas |
| `POST` | `/operator/stores/:storeId/orders/:orderId/refunds` | gestor autorizado | criar pedido de estorno autorizado, reconciliar via provedor |

O identificador `storeId` enviado no caminho **não é prova de acesso**. O servidor deve resolver o tenant associado ao operador e negar qualquer ação cross-tenant. No acompanhamento do comprador, usar token aleatório de alta entropia, com prazo/escopo e armazenamento protegido, não IDs sequenciais sem autorização. Não registrar tokens ou informações pessoais em analytics.

### POST quote

Entrada: `storeId`, itens configurados com IDs/quantidades, modalidade (`DELIVERY`/`PICKUP`, conforme configuração), endereço necessário **apenas para delivery**, cupom opcional, modo de recebimento e horário solicitado.

Validação obrigatória no servidor:
- `catalogVersion`/preços reais e disponibilidade; todos os grupos/variantes por item;
- serviço ativado, horário/feriado/fuso correto, modalidade habilitada, capacidade/limite;
- cobertura geográfica por CEP, polígonos, bairros ou regras reais, sem inventar se endereço é atendido;
- frete, mínimo de pedido, cupom, desconto, subtotal e imposto/cobrança quando configurado;
- preço em **centavos inteiros**, transações em BRL; regras do contrato R3;
- destino de entrega de endereço real informado, sob política LGPD, nunca salvar no analytics;
- entrega local sem integrações externas de cotação permitida se a **regra real da loja** calcular frete; não afirmar rastreamento/ETA sem integração.

Resposta de cotação **conceitual**:

```json
{
  "quoteId": "opaque-quote-id",
  "storeId": "opaque-store-id",
  "catalogVersion": 17,
  "fulfillment": "DELIVERY",
  "currency": "BRL",
  "itemsSubtotalCents": 12600,
  "discountCents": 0,
  "deliveryFeeCents": 550,
  "otherChargesCents": 0,
  "totalCents": 13150,
  "expiresAt": "ISO8601_FROM_SERVER",
  "status": "QUOTED",
  "priceBreakdown": [{"kind":"PIZZA","amountCents":12600},{"kind":"DELIVERY","amountCents":550}]
}
```

**Quote TTL** é configurável e revisado por política. 5 minutos pode ser valor inicial **proposto**, não SLA ou prazo observado na Juma. Quote expirada: `409 QUOTE_EXPIRED` com necessidade de nova confirmação e preço atualizado; não transformar quote antiga em pedido silenciosamente. Quando preço/estoque mudou, devolver `409 REQUOTE_REQUIRED` com diff seguro de valores e itens.

### POST order

Exige `quoteId` válido, dados mínimos de cliente e entrega/retirada necessários, aceite de termos quando aplicável e cabeçalho `Idempotency-Key` único. Requisitos:

1. Validar novamente modalidade, loja, preço/estoque, capacidade e quote sob lock/controle transacional;
2. Aplicar unicidade por `(storeId, checkoutSessionId, idempotencyKey)`, incluindo `requestPayloadHash`;
3. Mesmo payload + mesma chave => devolver **mesmo pedido**, status e protocolo (sem reexecutar pagamento/estoque/outbox);
4. Mesma chave + payload diferente => `409 IDEMPOTENCY_CONFLICT`;
5. Dois pedidos simultâneos para estoque limitado => somente quantidades disponíveis são confirmáveis; usar transação/controle de concorrência adequado;
6. Persistir num único commit: cabeçalho do pedido, itens e opções em snapshot imutável, total reconciliado, método/modalidade, `paymentState`, `orderState`, histórico, idempotência e evento outbox para operação;
7. Retornar `201 Created` para nova gravação (ou `200 OK` replay), `orderId` opaco, `trackingToken` protegido, `orderState`, `paymentState`, número exibível ao cliente e forma de acompanhamento;
8. Requisição ambígua/timeout após commit: `GET` por sessão/chave de idempotência ou replay seguro para recuperar o pedido existente. **Não** solicitar novo clique que crie segundo pedido.

> Se banco, validação ou commit falhar antes de persistir, nunca exibir confirmação. Falha de notificação da cozinha não apaga pedido já persistido: outbox + retries/reconciliação.

**Reserva de estoque:** a loja escolhe estratégia real (reservar no quote apenas quando suportado, preferencialmente reservar/consumir atomicamente na criação do pedido). Liberação por expiração/cancelamento tem processamento idempotente e auditoria. Não anunciar reserva sem implementação.

### HTTP e erros obrigatórios

| Situação | HTTP sugerido | Código estável | UI |
|---|---:|---|---|
| Pedido criado | 201 | `ORDER_CREATED` | mostra protocolo e acompanhamento |
| Reenvio idêntico da mesma chave | 200 | `ORDER_ALREADY_CREATED` | recuperar protocolo, não duplicar |
| Quote expirada ou preços alterados | 409 | `QUOTE_EXPIRED`, `REQUOTE_REQUIRED` | refazer cotação, informar diferença |
| Mudança de payload com mesma idempotency key | 409 | `IDEMPOTENCY_CONFLICT` | impedir pedido duplicado e explicar ação |
| Estoque/loja/horário/zona inviáveis | 409/422 | `ITEM_UNAVAILABLE`, `STORE_CLOSED`, `DELIVERY_ZONE_UNSUPPORTED` | manter carrinho, sugerir retirada se habilitada |
| Cart inválido/grupo obrigatório ausente | 422 | `INVALID_CART` | exibir problema por item |
| Não autorizado/loja de outro tenant | 403/404 | `ACCESS_DENIED` | não expor dados do outro estabelecimento |
| Erro temporário de API | 503 | `ORDER_SERVICE_UNAVAILABLE` | manter draft e permitir tentar de novo com chave consistente |
| Resposta da criação não chega | status desconhecido | `ORDER_STATUS_UNKNOWN` | reconciliar antes de tentar criar outro |

Não retornar erro 500 contendo IDs internos, dados do cliente, SQL, webhooks, credenciais ou detalhes do provedor.

## 4. Entrega, retirada e cálculo

- `fulfillmentMode`: `PICKUP`, `DELIVERY` (e `DINE_IN` apenas se homologado); o cliente só visualiza opções habilitadas pela loja.
- `deliveryZoneRule`: CEP/faixa, bairro, polígono ou tabela própria; fonte real, prioridade e `effectiveAt`. Consulta de CEP externa é complemento, **não** substitui elegibilidade real.
- `deliveryFeeCents`: taxa real calculada por região, modalidade e política da loja (fixa, gratuita sob mínimo, progressiva quando habilitada). `0` só quando de fato grátis.
- `minimumOrderCents`: respeitar regra comercial escrita no R3; excluir entrega por padrão e aplicar após desconto de mercadoria, se a loja não configurar explicitamente outro critério.
- `deliveryEta`: exibir apenas quando loja possui regra/estimativa válida, sempre marcado como estimado; sem garantir SLA.
- Alteração de endereço/região após quote => nova quote. Endereço fora de zona => bloqueio, alternativa retirada se disponível.
- `PICKUP`: não exigir endereço de entrega, não cobrar entrega, mostrar local/horário verificados.
- Horário: timezone por loja + exceções de feriado/fechamento; pedidos agendados **somente quando módulo existir** e houver capacidade real.

## 5. Pagamentos e prevenção de falsa confirmação

**Modos permitidos por loja, não universais:** pagamento na entrega/retirada (`CASH_ON_DELIVERY`, `CARD_ON_DELIVERY`) e digital (`PIX`, `CARD_ONLINE`) apenas com suporte homologado. Não marcar Pix como pago pela mera exibição de QR Code.

### Ciclo online

1. Pedido durável é criado em `PENDING_PAYMENT` e `paymentState=PENDING`.
2. Tentativa de pagamento é criada com idempotência e vinculada ao `orderId` e valor em centavos; gateway é fonte financeira.
3. Redirecionamento ou QR code apenas informa instrução ao comprador. `return_url` nunca aprova pagamento.
4. Webhook autenticado (assinatura/verificação oficial, prevenção de replay, ID de evento único) é persistido, reconciliado contra pedido, moeda, valor, loja e tentativa.
5. Somente confirmação financeira correta move `paymentState` para `PAID` e `orderState` de `PENDING_PAYMENT` para `PLACED`, observadas as regras configuradas de pré-autorização/captura.
6. Webhook pode chegar fora de ordem ou repetido; usar deduplicação, monotonicidade, lookup no provedor e transação com `expectedVersion`.
7. Em caso de timeout, cobrar novamente apenas quando prova idempotente de ausência de tentativa. Nunca criar múltiplas cobranças por clique duplo.

### Ciclo pagamento na entrega

1. Checkout só permite modalidade se a loja a habilitou.
2. Pedido nasce diretamente em `PLACED` e `paymentState=PENDING`, com o método explicitado; não declarar `PAID`.
3. Valor de troco (`changeForCents`) é validado (>= total), apenas para dinheiro; não é desconto nem valor cobrado.
4. Operador autorizado registra pagamento efetivamente coletado com evidência de método/data; evento de liquidação é auditado. A autorização de liquidação **não** pode ser dada pelo comprador.
5. Cancelamento ou estorno exige políticas próprias, sem reescrever preço do pedido.

### Segurança financeira

- Não armazenar PAN, CVV ou credenciais de cartão; usar checkout hospedado/tokenizado do provedor e avaliar escopo PCI.
- Segredos e certificados somente no ambiente servidor, nunca bundle, log, print, Git ou env públicos.
- Controles de webhooks precisam seguir especificações reais do provedor (assinatura/timestamp/chave, verificação, dedupe); assinatura simples improvisada não basta.
- Estornos, chargebacks, pagamento parcialmente capturado ou duplicado exigem log e conciliação; inconsistência deve alertar gestor e bloquear finalização enganosa.
- Reembolso é evento financeiro separado e não apaga pedido histórico.

## 6. Máquina de estados independente

Arquivo machine-readable: [ORDER_PAYMENT_STATE_MACHINES.v1.json](./delivery/ORDER_PAYMENT_STATE_MACHINES.v1.json). Possui 10 estados de pedido, 11 de pagamento, 14 transições de pedido, 12 transições financeiras e 15 vetores de aceitação **documentais**.

**Regras complementares:**
- No checkout online `PENDING_PAYMENT` antecede `PLACED`; no pagamento na entrega, criação ocorre diretamente em `PLACED` (não precisa passar por `PENDING_PAYMENT`).
- Pedido de retirada: `PREPARING → READY → COMPLETED`; pedido de entrega: `PREPARING → READY → DISPATCHED → COMPLETED`.
- `CANCELLED`, `EXPIRED`, `REJECTED` e `COMPLETED` são terminais no fluxo operacional comum; ajuste/compensação posterior gera evento específico, não recria histórico.
- Pagamento pode transicionar para `DISPUTED` depois de entregue; isso não altera o fato histórico da entrega.
- Transição exige `expectedVersion`, autenticação/autorização de papel/loja, validação de estado e evento de auditoria no mesmo commit.
- Eventos de cozinha e notificações são despachados por **outbox**; falha de entrega exige retry idempotente com status visível, e não status falso "cozinha avisada".
- Admin não pode pular estados de entrega/retirada sem regra expressa auditada e UI de exceção.
- Conciliação de pagamento em dinheiro/maquininha física exige endpoint autenticado próprio, a ser detalhado com o painel da R5.

## 7. Modelo de persistência e integridade transacional

**Tabelas/coleções conceituais:** `checkout_sessions`, `cart_drafts` se armazenadas no servidor, `quote_headers`, `quote_items_snapshot`, `orders`, `order_items_snapshot`, `order_immutable_totals`, `order_addresses_secure`, `payment_attempts`, `payment_provider_events`, `order_status_history`, `payment_status_history`, `idempotency_records`, `outbox_events`, `store_delivery_zones`, `store_checkout_policies`.

### Chaves/restrições

- Todo registro pertence a `storeId` e `tenantId` corretamente autorizados; escopo composto em queries/foreign keys quando necessário.
- `UNIQUE(store_id, checkout_session_id, idempotency_key)` e `request_payload_hash` para impedir colisões/reuso indevido.
- `UNIQUE(provider, provider_event_id)` após verificar autenticidade; registrar `payment_attempt_id`, referência do provedor e status do processamento.
- `UNIQUE(store_id, order_display_number)` para protocolo da loja, sem ser ID público de autorização.
- Transição concorrente atualiza somente quando `version=expectedVersion`; se 0 linhas atualizadas, `409 VERSION_CONFLICT`.
- Quote de outra loja ou sessão não pode criar pedido mesmo quando ID válido.
- Pedido guarda cópia de nomes/valores/opções/preço/quantidade/endereço essencial e fonte de política, para auditoria sem depender do catálogo que mudou.
- Não duplicar evento outbox em replay idempotente. Consumidor do outbox também deduplica por `eventId`.
- Retenção/anonimização de dados pessoais conforme LGPD e obrigação fiscal/contábil aplicável; nunca apagar fatos financeiros exigidos por lei sob pretexto de "limpar histórico".

### Exemplo de atomicidade na criação de pedido

```text
BEGIN
  assert authenticated checkout session, store, quote and access
  lock idempotency row, or attempt insert unique key
  compare requestPayloadHash; replay prior response if identical
  validate quote TTL, inventory, hours, delivery policy, promotion and price
  reserve/consume configured stock under lock
  INSERT order + item snapshots + totals + protected delivery details
  INSERT status history and initial payment state
  INSERT outbox event (order_created)
  persist idempotency mapping to orderId
COMMIT
return orderId + protocol + authorized tracking token
```

Nenhum serviço de envio de WhatsApp, impressora, push, KDS ou gateway deve acontecer **dentro** da transação DB como se sucesso externo fosse atômico. Agendar jobs persistentes após commit e reconciliar resultados. Para gateway, criar `paymentAttempt` idempotente e preservar a relação com o pedido, com recuperação após falha.

## 8. Casos de teste obrigatórios da R7

| ID | Cenário | Resultado necessário |
|---|---|---|
| CK-01 | mesmo checkout enviado 2x simultaneamente | um pedido e um evento de criação |
| CK-02 | replay idêntico depois de timeout | mesmo pedido e protocolo |
| CK-03 | mesma idempotency key, payload diferente | 409 sem novo pedido |
| CK-04 | quote vencida | 409 + pedir recotação |
| CK-05 | item esgotado após adicionar ao carrinho | 409 sem preço inventado |
| CK-06 | preço alterado entre cart e order | rejeitar quote ou aceitar versão formalmente protegida da loja |
| CK-07 | cliente fora de área, entrega habilitada | bloquear entrega, propor retirada se existir |
| CK-08 | retirada sem endereço | finalizar sem exigir frete ou endereço residencial |
| CK-09 | loja fecha durante checkout | bloqueio honesto, sem pedido surpresa |
| CK-10 | Pix gerado, comprador sai sem pagar | sem `PAID`, eventual expiração conciliada |
| CK-11 | retorno do navegador diz sucesso mas webhook não chegou | nunca declarar pago |
| CK-12 | webhook legítimo repetido | um evento conciliado e um avanço de status |
| CK-13 | webhook assinado inválido ou evento de outra loja/valor | 401/403/409 + auditoria sem mudança financeira |
| CK-14 | dois callbacks conflitantes ou fora de ordem | reconciliação monotônica, sem downgrade de `PAID` para `PENDING` |
| CK-15 | pagamento recusado após pedido durável | manter histórico, alternativa permitida, sem duplicar cobrança |
| CK-16 | pagamento na entrega e troco insuficiente | validação bloqueia checkout |
| CK-17 | pedido da loja A acessado por operador da B | acesso negado e sem vazamento |
| CK-18 | falha de notificação da cozinha após commit | pedido persiste, outbox retry e alerta |
| CK-19 | operador tenta transição sem `expectedVersion` | 409/428; nenhuma mudança |
| CK-20 | cancelamento com pagamento aprovado | iniciar política/compensação, não apagar pedido |
| CK-21 | perda de rede ao confirmar | recuperar por idempotência e tracking sem segundo pedido |
| CK-22 | modalidade entrega com taxa real alterada | nova quote e aceite explícito de total |

**Gate:** estes 22 cenários são `NOT_EXECUTED` até existir código de domínio, ambiente de QA, testes E2E e prova. A documentação sozinha não certifica loja, checkout, pagamento nem backoffice.

## 9. LGPD, rastreabilidade, disponibilidade e SEO

- Capturar apenas dados necessários para executar pedido; endereço de entrega não deve aparecer em front público, sitemap, HTML SSR ou eventos de analytics.
- Pedidos privados recebem controle de acesso, headers apropriados e `noindex`, não dependem de robots.txt para proteger dados.
- Fluxos de erro e reconciliação precisam de logs com `requestId`, `orderId` interno/mascarado, `storeId` e classificação; **sem** dados pessoais, tokens ou credenciais.
- Monitorar taxa de pedidos criados vs. cotados, webhooks atrasados, pagamento pendente, outbox não processado, falhas de disponibilidade/estoque; métricas por loja anonimizadas/segregadas.
- Disponibilidade operacional inclui degradação honesta: sem backend de pedido, desabilitar confirmação, preservar carrinho e orientar retry; **nunca** rebaixar silenciosamente para "enviar mensagem" como se fosse compra concluída.
- Monitoração não representa promessa de operação 24h, SLA ou aprovação de pagamentos antes de existir infraestrutura contratada.

## 10. Não regressão, implementação e aprovação

R4 documenta integração alvo, **não** implementa nem publica API. Os novos endpoints e estado transacional exigem arquitetura e controle de segurança da R6, operação da R5 e testes da R7; nenhum projeto de delivery pode receber selo funcional com esses componentes faltando.

- Preservar `/portfolio/:slug` como landing com identidade/SEO e os funis atuais, sem inventar preços/catálogos.
- Implementação futura deve criar storefront/checkout **opt-in** por `clientKey`/`storeId`, `orderEnabled=false` até o gate por loja.
- Quando habilitado, CTA "Fazer pedido" deve levar ao fluxo transacional, não `PortfolioCTAQuiz`. WhatsApp pode ser suporte ou notificação, depois de gravar pedido.
- Nunca usar Lovable Max, alterar DNS, reescrever todos os funis nem instalar novo backend externo sem decisão técnica e controles correspondentes.
- Não envolver rede de pagamento real, pedidos de terceiros nem cartões reais em QA sem aprovação e sandbox.

## 11. Próximo passo

- **R5:** contrato de painel do restaurante: lista de pedidos em tempo real, KDS/fluxo de cozinha, aceite/rejeição, operação de retirada/entrega, usuários, caixa básico e auditoria (sem afirmar módulos não contratados).
- **R6:** schema físico e isolamento multi-tenant, limites de confiança, autorização e LGPD.
- **R7:** converter estados, fixtures e testes em gates executáveis contra código real, conferir mobile/checkout/pagamento sandbox.
- **R8:** ligar os gates ao onboarding, manifests, skill router, readiness, SEO e runbook da 0WEB, antes de chamar projeto de delivery completo.

Referência comercial PDV Slim: https://pdvslim.com.br/; referência específica https://pdvslim.com.br/loja/jumapizzaria. O acesso público via ferramenta de navegação retornou `DisabledError` para a loja e HTML vazio nas demais URLs em 2026-11-01. Portanto este contrato é **engenharia própria da 0WEB**, não descrição verificada das telas privadas do PDV Slim.
