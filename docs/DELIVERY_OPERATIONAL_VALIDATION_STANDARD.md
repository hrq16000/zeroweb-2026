# 0WEB — Delivery Operational Gate & Evidence Standard (R7/8)

**Data:** 2026-11-02  
**Estado:** `GATE_PREFLIGHT_IMPLEMENTED / RUNTIME_NOT_IMPLEMENTED / DELIVERY_READY=BLOCKED`  
**Escopo:** estabelecer uma barreira testável entre documentação, implementação, testes reais e publicação de delivery.

## 1. Regra de liberação e status

Landing, catálogo hardcoded, carrinho decorativo, lead e WhatsApp **não** equivalem a loja de delivery transacional. O requisito é a sequência de compra → persistência durável → fila da operação → cozinha → entrega/retirada, com preços/pagamento/segurança corretos.

- `SPECIFIED`: requisitos e cenários descritos.
- `IMPLEMENTED`: código, banco, migrations, políticas e interfaces disponíveis.
- `TESTED`: suítes de backend, autorização, pagamentos sandbox e E2E contra o ambiente real de QA executadas e aprovadas.
- `PUBLISHED`: versão homologada implantada e smoke validado no destino correto.
- `BLOCKED`: qualquer requisito ausente, `SKIP`, `NOT_EXECUTED`, build pendente, evidência autodeclarada ou teste sem backend real.

A R7 cria **um preflight executável, intencionalmente fail-closed**. Não cria checkout, banco, gateway, KDS ou testes E2E reais. Mesmo que alguém escreva `PASS` em todos os itens, o script ainda retorna `BLOCKED` até existir um verificador de evidência CI confiável. Não remover essa proteção para tornar um relatório verde.

## 2. Arquivos e comandos de execução

- [scripts/delivery/check-operational-readiness.mjs](../scripts/delivery/check-operational-readiness.mjs): preflight com bloqueios enumerados e saída legível ou JSON.
- [tests/delivery/readiness-gate.test.mjs](../tests/delivery/readiness-gate.test.mjs): sete testes de falha segura do próprio verificador.
- [docs/delivery/DELIVERY_READINESS_MANIFEST.example.json](./delivery/DELIVERY_READINESS_MANIFEST.example.json): 17 itens como `NOT_EXECUTED`, sem alegar loja real.

```bash
node --test tests/delivery/readiness-gate.test.mjs
node scripts/delivery/check-operational-readiness.mjs --manifest docs/delivery/DELIVERY_READINESS_MANIFEST.example.json --json
```

**Semântica:** os testes do preflight aprovados retornam `0`. O comando de readiness retorna **exit 2** e `status=BLOCKED` corretamente até a implementação; é perigoso aceitar `0` em manifesto de demonstração. A R7 não liga o script ao `prebuild` universal, para não bloquear `/servicos` e `/portfolio` sem delivery.

## 3. Gate por loja — 17 condições

| Requisito | Evidência de execução real necessária |
|---|---|
| `REAL_STORE_CATALOG` | catálogo verdadeiro, preços reais e controle do restaurante |
| `MOBILE_CATALOG_UX` | jornada móvel 320/390/430px sem bloqueio |
| `OPTIONS_PIZZA_COMBO_PRICING` | variante/pizza/combos quando contratados, preços revalidados no servidor |
| `PERSISTENT_REVALIDATED_CART` | carrinho mantém escolhas e revisa catálogo |
| `SERVER_QUOTE_DELIVERY_COVERAGE` | frete, endereço, mínimo e total autoritativos |
| `DURABLE_IDEMPOTENT_ORDER` | banco, protocolo, chave idempotente, replay/timeout |
| `PAYMENT_SANDBOX_WEBHOOK_RECONCILIATION` | pagamento configurado validado em sandbox ou liquidação offline auditada |
| `CUSTOMER_ORDER_TRACKING` | status privado do próprio pedido |
| `OPERATOR_QUEUE_REALTIME` | pedido aparece na fila e resiste a desconexão |
| `KITCHEN_KDS_OPERATION` | cozinha recebe e executa preparo/pronto real |
| `DELIVERY_PICKUP_FULFILLMENT` | modalidades habilitadas concluídas corretamente |
| `SERVER_SIDE_ROLE_AUTHORIZATION` | papéis autorizados no backend, revogação e campos protegidos |
| `CROSS_TENANT_RLS_ISOLATION` | testes reais negativos de acesso entre lojas/bancos |
| `LGPD_PII_PAYMENT_SECURITY` | proteção do endereço, telefone, financeiro, logs, KDS, SEO |
| `OUTBOX_NETWORK_FAILURE_RECOVERY` | falhas de rede/worker/alerta não perdem pedido |
| `MOBILE_A11Y_PERFORMANCE_E2E` | teste executado em mobile e acessibilidade, desempenho medido |
| `PRODUCTION_SMOKE_WITH_REAL_STORE` | commit/destino verificados e smoke com pedido autorizado |

O gate trabalha por loja/ambiente; não basta que **outra** loja do mesmo portal tenha passado. Funcionalidade não aplicável exige contrato explícito e prova de alternativa suficiente — nunca SKIP silencioso.

## 4. Cobertura documental R2–R6 e diferença entre testes

| Fonte | Casos documentados | Execução contra motor real |
|---|---:|---|
| R2 UX storefront | 16 E2E | `NOT_EXECUTED` |
| R3 preço | 12 fixtures (7 valores aritmeticamente conferidos) | `NOT_EXECUTED` |
| R4 checkout | 22 cenários | `NOT_EXECUTED` |
| R4 estados pedido/pagamento | 17 vetores | `NOT_EXECUTED` |
| R5 operação | 16 E2E | `NOT_EXECUTED` |
| R5 autorização | 25 vetores | `NOT_EXECUTED` |
| R6 segurança | 30 vetores | `NOT_EXECUTED` |
| R7 preflight | 7 testes do bloqueio | **Não são E2E de delivery** |

Há sobreposições intencionais. Não usar a soma desses números como "testes de produção aprovados".

Referências normativas: [DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md](./DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md), [DELIVERY_STOREFRONT_UX_STATE_MATRIX.md](./DELIVERY_STOREFRONT_UX_STATE_MATRIX.md), [DELIVERY_MENU_PRICING_STANDARD.md](./DELIVERY_MENU_PRICING_STANDARD.md), [DELIVERY_CHECKOUT_ORDER_STANDARD.md](./DELIVERY_CHECKOUT_ORDER_STANDARD.md), [DELIVERY_RESTAURANT_OPERATIONS_STANDARD.md](./DELIVERY_RESTAURANT_OPERATIONS_STANDARD.md) e [DELIVERY_DATA_SECURITY_STANDARD.md](./DELIVERY_DATA_SECURITY_STANDARD.md). A R6 tem PR independente e deverá estar na main antes da homologação final.

## 5. Evidência mínima exigida para liberar

Uma evidência de resultado deve conter `gateId`, `storeId`, `environment`, `commitSha` real, `suiteName`, `runId`, `runUrl`, timestamps, `testResult`, versão do banco de QA, ambiente isolado, hash de artefato e **proveniência comprovada do processo que rodou o teste**. A simples presença desses metadados em JSON não autentica resultado.

Implementação futura do verificador deverá:
1. Executar E2E contra backend/banco reais isolados, com tenants A/B.
2. Ligar resultados a commit/versão homologados e build publicado.
3. Verificar por fonte confiável a execução/proveniência da CI — não confiar em URL/ID escrito pelo usuário.
4. Exigir RLS/políticas de delivery exercitadas: `SKIP ≠ PASS`, conforme [RLS_CI_SECURITY_GATE.md](./RLS_CI_SECURITY_GATE.md).
5. Testar gateway em sandbox e autorização de liquidação offline, sem dinheiro real não autorizado.
6. Verificar fila, cozinha, retirada/entrega, privacidade e idempotência de forma integrada.
7. Fazer smoke autorizado no destino real e registrar evidência da versão.
8. Só permitir `DELIVERY_READY=PASS` depois que todos esses itens estiverem comprovados.

**Sentinela atual:** `TRUSTED_RUNTIME_ATTESTOR_NOT_INSTALLED`. Removê-la sem validação verdadeira é regressão P0.

## 6. Integração não regressiva

- Opt-in por `clientKey`/`storeId`, inicialmente `orderEnabled=false`.
- `/portfolio/:slug` mantém marca e SEO; a loja transacional só é ativada quando os gates passam.
- `/servicos` é a loja de serviços da própria 0WEB: não compartilhar a máquina de pedidos de restaurantes.
- Não alterar DNS, meios de pagamento, credenciais, dados do restaurante ou lojas existentes nesta rodada.
- Nenhum uso obrigatório de Lovable ou Max mode. Repositório GitHub permanece fonte de versionamento e CI.
- R8 ligará os contratos ao roteador, scaffold/manifests e documentação de onboarding; o gate de produção para delivery exigirá implementação real depois de R8.

## 7. Estado de entrega

**R7 entrega especificação e verificador de ausência de prontidão, não um sistema de pedidos pronto.** A R8 conclui integração documental e governança. Desenvolvimento operacional e homologação real permanecem etapas posteriores, com suas próprias rodadas/PRs. Não declarar conclusão funcional antes delas.
