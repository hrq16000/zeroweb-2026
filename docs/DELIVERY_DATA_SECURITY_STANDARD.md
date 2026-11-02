# 0WEB — DELIVERY DATA, SECURITY, TENANCY & LGPD STANDARD

**Rodada:** 6/8 · **Data:** 2026-11-01 · **Status:** `SPEC_COMPLETE / DATABASE_NOT_IMPLEMENTED / RLS_NOT_TESTED`  
**Escopo:** persistência de pedidos de restaurantes, segurança server-side e isolamento entre estabelecimentos.  
**Compatibilidade observada:** `package.json` usa TanStack Start/Bun; `drizzle.config.ts` declara PostgreSQL; `drizzle/schema.ts` contém apenas comentário de arquivo gerado vazio; o repositório também contém `supabase/migrations/` e autenticação de admin institucional. **A nova especificação NÃO significa que existem tabelas delivery, migrations ou testes RLS executados.**

## 1. Segurança e integridade são requisitos de negócio

Um sistema de delivery multiempresa deve provar simultaneamente:

- pedido gravado de forma durável, uma única vez por confirmação;
- separação de cada `tenantId` e `storeId` em todas as operações;
- catálogo e preço válidos para a loja, não para o mesmo `productId` de outra loja;
- acesso do funcionário limitado às lojas onde possui vínculo vigente e ao papel autorizado;
- pagamento reconciliado e atrelado ao pedido, lojista, moeda e valor correto;
- endereço, telefone e eventuais observações sensíveis não expostos a públicos ou outros lojistas;
- eventos de preparo, impressão, mensageria e painel podendo falhar sem perder o pedido;
- rastreabilidade, retenção e proteção de dados conforme finalidade e obrigações legais.

**Não é suficiente** possuir RLS genérica em tabelas atuais da 0WEB ou esconder botões no React. Os dados de delivery precisam de policies próprias e testes cross-tenant. A R6 **não cria banco nem credenciais**.

### Dependências normativas

- [DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md](./DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md) — regras globais.
- [DELIVERY_MENU_PRICING_STANDARD.md](./DELIVERY_MENU_PRICING_STANDARD.md) — preços/opções.
- [DELIVERY_CHECKOUT_ORDER_STANDARD.md](./DELIVERY_CHECKOUT_ORDER_STANDARD.md) — quote, order, payment e idempotência.
- [DELIVERY_RESTAURANT_OPERATIONS_STANDARD.md](./DELIVERY_RESTAURANT_OPERATIONS_STANDARD.md) — KDS, permissões, auditoria e filas.
- [ORDER_PAYMENT_STATE_MACHINES.v1.json](./delivery/ORDER_PAYMENT_STATE_MACHINES.v1.json) — máquina de estados.
- [OPERATOR_ACCESS_POLICY.v1.json](./delivery/OPERATOR_ACCESS_POLICY.v1.json) — matriz de perfis.
- [DATA_SECURITY_ACCEPTANCE.v1.json](./delivery/DATA_SECURITY_ACCEPTANCE.v1.json) — catálogo de 30 verificações futuras, não executadas.
- [RLS_CI_SECURITY_GATE.md](./RLS_CI_SECURITY_GATE.md) — `SKIP ≠ PASS`.

## 2. Modelo lógico relacional e limites do escopo

Entidades mínimas, referenciadas por UUID opacos e chaves compostas quando aplicável:

| Domínio | Tabela proposta | Chaves/campos essenciais | Requisitos de integridade |
|---|---|---|---|
| Proprietário | `delivery_tenants` | `tenant_id`, status, created_at | tenant nunca inferido por slug |
| Loja | `delivery_stores` | `store_id`, `tenant_id`, `client_key`, timezone, status, order_enabled | unicidade `(tenant_id,store_id)`, vínculo clientKey validado |
| Equipe | `delivery_store_memberships` | `tenant_id`, `store_id`, `user_id`, role, active/revoked_at | papéis servidor, sem self-grant |
| Loja/config | `delivery_store_policies` | version, horários, modos, pedido mínimo, pausas | histórico/versionamento, defaults fechados |
| Zona | `delivery_service_zones` | `tenant_id`, `store_id`, modalidade, regra, faixa/tabela, fee_cents | regras versionadas, valores >=0 |
| Catálogo | `delivery_categories`, `delivery_products`, `delivery_variants` | store/tenant, versão, nome, preço em centavos, disponibilidade | item+variante+loja válidos juntos |
| Opções | `delivery_option_groups`, `delivery_options` | product/variant, min/max, preço, disponibilidades | seleção e política de pizza R3 |
| Promoções | `delivery_promotions` | loja, versão, validade, limites, elegibilidade | sem desconto aplicado em outra loja |
| Cotação | `delivery_quotes` e `delivery_quote_items` | quote_id, store/tenant, checkout_session_id, catalog_version, TTL, total, snapshot | preço/entrega servidor e imutáveis por versão |
| Pedido | `delivery_orders` e `delivery_order_items` | order_id, store/tenant, quote_id, estado/versão, total, order_no | snapshot imutável + integridade total |
| Cliente PII | `delivery_order_contacts` | order_id/store/tenant, contato/endereço cifrado ou protegido | acesso segregado e retenção por finalidade |
| Idempotência | `delivery_idempotency_keys` | store/tenant, checkout_session_id, key_hash, request_hash, order_id | índice UNIQUE + replay seguro |
| Pagamentos | `delivery_payment_attempts`, `delivery_payment_events` | store/tenant/order, provider, provider_reference, amount, currency, state | eventos autenticados/deduplicados |
| Operação | `delivery_order_events` e `delivery_payment_status_history` | event_id, order_id, version, actor, before/after | trilha append-only |
| Entregador | `delivery_courier_assignments` | store/tenant, order_id, courier_user_id, assigned/revoked | courier só acessa vínculo vigente |
| Outbox | `delivery_outbox_events` | store/tenant, event_id, aggregate, version, payload_ref, status/attempts | evento no mesmo commit; worker idempotente |
| Auditoria | `delivery_audit_events` | store/tenant, actor, action, target, request_id, timestamp, delta saneado | append-only e minimização de PII |

**Escopo de tecnologia:** PostgreSQL é a referência técnica plausível no repositório, mas a implementação deverá escolher um fluxo oficial de migração (Drizzle **ou** Supabase SQL, com governança única) e uma camada de acesso que não dependa da interface do Lovable para criar/alterar/publicar. **Não** executar migrations de delivery sem revisão de esquema e backup.

### Integridade com FK composta

Um `product_id` sozinho pode ser globalmente único, mas **não prova que o produto pertence à loja do pedido**. Em relações entre catálogo/cotação/pedido, exigir integridade composta `(tenant_id,store_id,product_id)` e `(tenant_id,store_id,order_id)`, com referências de mesma loja, além da validação server-side.

Recomendação ao implementar:
- `PRIMARY KEY (tenant_id,store_id,order_id)` ou `UNIQUE (tenant_id,store_id,order_id)` mais `order_id` opaco;
- `FOREIGN KEY (tenant_id,store_id,quote_id) REFERENCES delivery_quotes (...)`;
- `FOREIGN KEY (tenant_id,store_id,order_id) REFERENCES delivery_orders (...)` em itens, pagamentos, eventos e contatos;
- `UNIQUE (tenant_id,store_id,checkout_session_id,key_hash)` em idempotência, com `request_hash` separado;
- `UNIQUE (provider,provider_event_id)` se provedor garantir IDs globalmente únicos; se não, incluir conta do comerciante/provider_account_id no índice e validação.

**Nunca** usar um `storeId` vindo do browser como autoridade de autorização. O servidor resolve `storeId + tenantId` pela rota e sessão, depois verifica o relacionamento ativo. No checkout anônimo, cotação e pedido são ligados a sessão opaca e restrita à loja.

## 3. Transaction boundaries, concorrência e deduplicação

### A. Cotação

`quote` mantém preço, opções, desconto, taxa e total do servidor, versão do cardápio e regras, modalidade, validade, sessão e endereço tratado por referência protegida. Se catálogo/loja/taxa mudarem, o servidor decide entre recotação obrigatória e retenção de preço explicitamente aprovada por política; nunca muda total silenciosamente.

### B. Pedido atômico

```text
transaction BEGIN
  resolve server-side tenant/store/session context
  acquire idempotency uniqueness and compare request hash
  lock/validate quote, validity, stock, fulfillment and prices
  lock/decrement reserved inventory if inventory enabled
  insert order header + item snapshots + protected contact references
  insert immutable totals + initial order/payment statuses + history
  insert outbox(order.created) and idempotency record
transaction COMMIT
return stable receipt + scoped tracking credential
```

Replays de mesma chave e payload retornam **o mesmo pedido**. Payload diferente com mesma chave retorna conflito. Conflito de estoque/quote e erro de banco não podem produzir tela de sucesso. Não fazer chamada ao gateway, WhatsApp, impressora, cozinha ou SSE dentro da transação de banco.

### C. Outbox e entrega eventual

Worker pós-commit processa eventos com lock de concorrência ou `FOR UPDATE SKIP LOCKED`, retries exponenciais e limite de tentativas. Consumidores deduplicam `event_id` e descartam versões antigas. Ao reconectar, KDS/painel carrega snapshot da API servidor e cursor; **evento perdido não significa pedido perdido**. Dead-letter/alarmes e reconciliação precisam de responsável e registro, sem inventar um SLA universal.

### D. Pagamentos

Uma tentativa está vinculada a pedido, loja, merchant_account, valor/moeda e provider. Callback só avança estado após verificar autenticação oficial, identificador do evento, conta comerciante, correlação de pedido, valor e elegibilidade de transição. Eventos repetidos/finais/reordenados são reconciliados. Pedido com cobrança aprovada mas falha de entrega ao cliente continua no banco. Estornos mantêm histórico e trilha financeira.

## 4. Identidades, sessão e papéis

O uso de `OWNER`, `MANAGER`, `COUNTER`, `KITCHEN`, `COURIER`, `CASHIER` e `VIEWER` é contrato funcional da Rodada 5. Na R6:

1. A autenticação confirma apenas **quem é** o ator. Autorização confirma **qual ação pode executar sobre qual loja/pedido**, para cada comando.
2. `memberships` ativas têm `store_id`, `tenant_id`, role e data de revogação; tokens antigos não reativam permissões revogadas.
3. Operador com duas lojas alterna a loja ativa; dados da outra loja não entram na resposta, consulta, cache, canal de evento ou log público.
4. `OWNER` do cliente **não** é `super_admin` da 0WEB. Acesso institucional a dados de lojas é excepcional, escopado e auditado.
5. `COURIER` só vê pedidos que lhe foram atribuídos; `KITCHEN` recebe projeção sanitizada de itens, nunca endereço completo ou pagamento; `VIEWER` não recebe PII por padrão.
6. Revogação de operador invalida acesso a novas consultas/mutações e conexões WebSocket/SSE; reconexão deve revalidar vínculo.
7. Claims vindas do JWT podem apontar identidade; **não** bastam como vínculo permanente de loja quando a associação pode ser revogada.
8. Proteção de sessões: cookies `HttpOnly`, `Secure`, `SameSite` apropriado quando aplicável; CSRF para mutações por cookie e checagem de origem; rotacionar sessão no login/elevação de privilégio.
9. Login de operador com limite de tentativas, MFA para dono/gestor e ações financeiras quando viável; evitar endpoints com segredo de service role acessíveis a browser.

## 5. PostgreSQL/RLS — política-alvo, não política aplicada

Quando RLS for o mecanismo de isolamento usado, a regra de cada tabela sensível é:

- `ENABLE ROW LEVEL SECURITY` e, para papéis sensíveis, `FORCE ROW LEVEL SECURITY` conforme arquitetura e owner;
- `anon` não lê pedido, endereço, eventos financeiros, auditoria nem membership;
- `authenticated` acessa apenas projeções/linhas permitidas ao papel/loja; ainda é preciso restringir colunas e funções que exponham PII;
- `USING` para leitura/atualização/delete e `WITH CHECK` para insert/update, com vínculo ativo e escopo exato;
- preferir `SECURITY INVOKER` onde possível; `SECURITY DEFINER` somente com owner não superprivilegiado, `search_path` fixo, argumentos validados e auditoria;
- privilégios de `service_role` só no servidor com credenciais protegidas; todo comando feito com privilégios elevados impõe filtro explícito de tenant/store e autorização da aplicação; RLS não protege contra uso indevido de role com `BYPASSRLS`;
- acesso por `tenantId` isolado no SQL e nos caches/resolvers; `storeId` nem `orderId` isolados são garantia suficiente;
- canais Realtime e subscriptions devem verificar same-store membership/role; eventos para cozinha/entregador usam payload de mínimo privilégio.

**Não confiar somente em "está com RLS ativo".** Configuração executada + testes reais com contas A/B + prova de execução no CI são obrigatórios. Seguir [RLS_CI_SECURITY_GATE.md](./RLS_CI_SECURITY_GATE.md): `SKIP` e ausência de `SUPABASE_SERVICE_ROLE_KEY` não são `PASS`. Para gateway não-Supabase, gate equivalente deve exercitar políticas reais usando credenciais seguras de QA.

## 6. Controle de campos e exposição por superfície

| Superfície | Dados públicos/visíveis | Dados proibidos |
|---|---|---|
| Catálogo público | nome, descrição, foto, preço vigente, disponibilidade publicável | telefone de cliente, pedidos, pagamento, roles, segredos |
| Cotação do comprador | itens do próprio carrinho, preço, modalidade, frete e validade | dados de pedidos de outra sessão, chaves de gateway |
| Acompanhamento do comprador | somente próprio pedido via tracking token com escopo/expiração | endpoint enumerável, endereços completos de outros pedidos |
| Balcão | campos necessários a aceite/retirada/despacho | tokens de gateway, CVV, segredo, outras lojas |
| KDS | itens, frações, adicionais, observações de preparo pertinentes | endereço/telefone, dados financeiros, PII não necessária |
| Caixa | pedido, método/valor/estado financeiro e recibo necessário | dados do cartão, full address sem justificativa |
| Entregador | apenas pedidos atribuídos e dados necessários à entrega | fila completa, outros clientes/lojas, dados financeiros |
| Gestor | operações e dados necessários à administração da própria loja | outros tenants, credenciais de plataforma |
| Relatórios/analytics | agregados por loja sem PII desnecessária | endereço, telefone, tracking tokens, notas sensíveis |

Os dados do pedido/contato devem ter armazenamento segregado e controles de leitura por finalidade, idealmente criptografia em repouso gerenciada e proteção de campos especialmente sensíveis; backups igualmente protegidos. Dados de contato não devem entrar em mensagens de outbox genéricas, analytics, web vitals, JSON-LD, prévias OpenGraph, sitemap ou logs de front-end.

## 7. Threat model mínimo e respostas

| Ameaça | Controle mínimo | Evidência exigida |
|---|---|---|
| IDOR cross-tenant | checagem de membership + FK composta + policies | teste A → B para leitura e mutação |
| Escalada de papel | gestão de roles owner-only, deny-by-default | operador não concede privilégio a si |
| Checkout com total adulterado | recálculo servidor/quote | payload com preço modificado não altera total |
| Pedido duplo | unique idempotency + transação | 2 requests simultâneos, 1 ordem |
| Webhook forjado/replay | validação provedor e dedupe | assinatura inválida rejeitada, repetido idempotente |
| Fraude de pagamento offline | controle por papel + evidência de recebimento | cliente não marca PAID |
| Exposição de endereço via KDS | DTO por papel e field minimization | snapshot de payload sem PII |
| Fila KDS atrasada | outbox + snapshot/replay + alerta | pedido existe apesar da queda |
| Cache com troca de loja | cache key por tenant/store/user/role; limpeza na troca/revogação | nenhum item de outra loja |
| SSR/SEO vazando dados | noindex privado + auth, sem PII em HTML | request anônimo não devolve pedido |
| Chave de serviço exposta | segredo servidor + scanning + rotação | bundle/CI sem secrets |
| SQL injection / input malicioso | parâmetros tipados, schema validation e limites | fuzz de payload e revisão |
| CSRF/session fixation | cookie seguro, origem/CSRF e rotação | testes com origem não confiável |
| Log com PII | scrubbing, policy de retenção e acesso | amostra de logs sem dados pessoais |
| Backup não recuperável | restore testado e segregação por tenant | simulação de restauração sem perda |
| Exclusão ilegal de histórico | retenção por base legal + anonimização seletiva | procedimento DSR auditado |

## 8. LGPD e ciclo de vida de dados

Definir e registrar para cada classe: finalidade, base legal apropriada após análise, controlador/operador, duração de retenção, necessidade operacional, acesso, descarte/anonimização, subprocessadores, canal de direitos do titular e resposta a incidentes. Não inventar prazos de retenção legais fixos.

Exemplos:
- nome, telefone e endereço: execução do pedido e suporte; acesso estritamente necessário; retenção limitada às finalidades e obrigações legais;
- pedido, pagamento, cancelamento e nota fiscal: obrigação contratual/fiscal/contábil quando aplicável; retenção definida com assessoria;
- telemetria: identificadores pseudonimizados, sem conteúdo livre nem endereço;
- observações de comida que acidentalmente contenham dados sensíveis: sanitização/redação e proteção adicional;
- backups: retenção própria, criptografia, restauração e cronograma de descarte.

**Direitos do titular:** prever consulta/exportação, correção de dados cadastrais, exclusão/anonimização quando cabível, bloqueio sob suspeita de fraude e registro de atendimento, respeitando obrigações legais. O restaurante e a 0WEB devem definir contratualmente seus papéis de controlador/operador segundo a realidade do tratamento, não somente o rótulo do produto.

**Segurança de incidente:** políticas de detecção/triagem/contensão, inventário de dados afetados, responsáveis, avaliação de notificação conforme LGPD/ANPD e requisitos específicos; sem afirmação de prazo ou SLA não verificados.

## 9. Recuperação, backups e continuidade

- Alterações de schema por migrations revisadas, versionadas, reversíveis quando possível; `down` destrutivo exige plano explícito de restauração.
- Testar restauração de dados de loja e eventos, incluindo consistência entre pedido, pagamento, outbox e auditoria; registrar RPO/RTO **contratados e medidos**, nunca valores inventados.
- Backups cifrados e com credenciais isoladas; sem ambiente de teste com cópia aberta de dados reais.
- Exigir automação de backup/restauração e monitor de falha do worker de eventos antes de lançar loja com pedidos reais.
- Separar falha de painel, serviço, gateway e banco; sistema deve sinalizar indisponibilidade e **não** confirmar pedido sem fonte de verdade.
- Migração de hospedagem no futuro deve preservar dados e reexecução idempotente, sem dependência operacional de Lovable.

## 10. Gates da R6 e sequência de entrega

| Gate | Hoje | Para declarar PASS |
|---|---|---|
| Modelo lógico e fronteiras | `DOCUMENTED` | schema SQL/migrations revisadas, constraints e índices reais |
| Segurança cross-tenant | `NOT_EXECUTED` | contas A/B reais de QA, consultas e ações proibidas bloqueadas |
| RLS das novas tabelas | `NOT_IMPLEMENTED` | policies aplicadas e CI com provas; SKIP não conta |
| Operador e courier por papel | `DOCUMENTED` | endpoints executados com roles e proteção de campos |
| Pedido/pagamento | `DOCUMENTED` | transação, gateway sandbox e callbacks testados |
| Proteção de PII | `DOCUMENTED` | coleta mínima, DTO, scans, logs, cookies, DSR |
| Restore/backups | `NOT_EXECUTED` | restore ensaiado e documentado |

**R7:** transformar contratos em testes e `DELIVERY_OPERATIONAL_GATE` executável, identificando implementação ausente como `BLOCKED` (nunca `PASS`).  
**R8:** integrar roteamento de skills, manifests, scaffold e readiness com opt-in por loja, sem regressão de `/portfolio` ou `/servicos`.  
**Após documentação:** implementar motor e operação reais, homologar sandbox, publicar por cliente após `DELIVERY_READY=PASS`.

**Nenhum banco, DNS, segredo, endpoint público ou loja existente foi alterado nesta micro-rodada.**
