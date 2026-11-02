# 0WEB — Playbook de novos projetos Delivery transacionais

**Status:** CANÔNICO PARA CLASSIFICAÇÃO E ONBOARDING; software operacional ainda `IMPLEMENTATION_PENDING`  
**Data:** 2026-11-02 · **Rodada:** 8/8 da documentação e governança.  
**Contrato funcional:** [DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md](./DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md)  
**Gate de homologação:** [DELIVERY_OPERATIONAL_VALIDATION_STANDARD.md](./DELIVERY_OPERATIONAL_VALIDATION_STANDARD.md).

## 1. Classificar o trabalho ANTES de gerar a página

Não inferir um sistema de pedidos apenas porque o nome do cliente contém "pizzaria", "delivery", "lanchonete" ou "cardápio". Registrar uma intenção contratual com evidência de escopo:

| Intenção pedida | Classificação | Resultado permitido |
|---|---|---|
| Página de apresentação, serviços, localização ou fotos do restaurante | `RESTAURANT_LANDING` | Landing autoral e funil do cliente, sem chamar de loja funcional |
| Catálogo para consultar e entrar em contato / pedir orçamento por WhatsApp | `MENU_LEAD_ONLY` | Catálogo de consulta, CTA de lead e contato, sem confirmação de pedido |
| Cliente quer escolher produtos, calcular entrega e receber confirmação de compra | `TRANSACTIONAL_DELIVERY` | **Sistema de pedidos real**, exigindo motor/checkout/banco/operação e gate de readiness |
| Restaurante pede mesas, comandas, caixa/PDV, estoque, fiscal etc. | `FULL_POS_EXTRA_SCOPE` | Módulos específicos contratados, não presumidos pelo delivery |

Uma loja de delivery pode ter landing de aquisição e storefront operacionais no mesmo domínio, mas são superfícies diferentes. A landing não pode mascarar ausência do sistema transacional.

**Decisão de contrato:** se o pedido do cliente é ambíguo, registrar a intenção como `NOT_CONFIRMED` e não prometer checkout. Não cobrar nem apresentar capacidade de PDV avançado antes de escopo específico.

## 2. Roteamento técnico e isolamento

Fluxo obrigatório para `TRANSACTIONAL_DELIVERY`:

1. Ler `AGENTS.md`, `.agents/skills/0web-skill-router/SKILL.md`, `docs/skills/ORCHESTRATION.md` e `docs/0WEB_EXECUTION_CONTRACT.md`.
2. Ler as normas de arquitetura, UX, catálogo, checkout, operação, dados e gate referidas pelo documento-mãe.
3. Preservar a composição autoral de `/portfolio/:slug`: identidade, mídia, SEO, acessibilidade, funis existentes e rotas aprovadas.
4. Separar `clientKey` (projeto/identidade) de `storeId` e `tenantId` (autorização/catálogo/operação). Slug e nome não substituem onboarding de loja.
5. Backend do pedido, banco, contas de loja, papéis, preços, entregas, estoque e gateway entram como módulos **opt-in**, nunca herdados automaticamente de um botão de funil.
6. Admin institucional da 0WEB (`/app`) e gestão financeira/operacional do restaurante devem ter fronteiras, papéis e dados separados. Um proprietário de loja não é `super_admin` da 0WEB.
7. Loja nasce desabilitada para pedidos (`orderEnabled=false`); só habilitar após implementação, homologação real e evidência de publicação.
8. Nunca reutilizar sistema de cobrança da loja `/servicos` como backend de pedido de comida sem arquitetura e segregação específica.

**Design:** reutilizar engenharia/schemas seguros, não visual de terceiro. Montador de produtos, checkout e painel precisam ser compreensíveis e úteis no mobile, sem impor template estético entre clientes.

## 3. Scaffold — comportamento já preparado

O scaffold geral pode criar a **landing em rascunho** normalmente. A opção de entrega transacional adiciona apenas um manifesto explícito de `BLOCKED`:

```bash
node scripts/scaffold-portfolio-client.mjs --slug cliente-exemplo \
  --name "Restaurante Exemplo" --funnel-type pedido \
  --delivery-transactional --dry-run
```

Removendo `--dry-run` no desenvolvimento de um novo projeto autorizado, ele cria também:

`docs/portfolio/delivery-readiness/<slug>.json`

Esse arquivo é um **artefato local e versionável de planejamento**, derivado de `docs/delivery/DELIVERY_READINESS_MANIFEST.example.json`. Não cria `storeId`, não ativa pedido, não cria conta, não registra cobrança, não configura gateway, não altera DNS e não declara loja funcional.

Sem `--delivery-transactional`, o scaffold conserva o comportamento anterior. Usar somente `--funnel-type pedido` cria **intenção de contato/pedido comercial**, não um checkout transacional.

O manifesto inicial deve permanecer com:
- `storeId: null` até associação legítima a uma loja provisionada;
- `productionEnabled: false`;
- `implementationStatus: NOT_IMPLEMENTED`;
- 17 gates `NOT_EXECUTED`;
- nenhum link fictício de CI, pedido, gateway ou screenshot.

Se o cliente já tiver landing, **não executar scaffold novamente por cima do projeto**. Adicionar um manifesto específico sob revisão, preservar ativos e criar o motor de delivery em módulos separados.

## 4. Etapas do onboarding real — não confundir com as 8 rodadas documentais

| Etapa futura | Evidência antes de avançar |
|---|---|
| Escopo e dados reais | cardápio, preços, fotos, tamanhos, combos, políticas, modalidades e contato do dono verificados |
| Contas e autorização | tenant/store criados, identidades de operador, cozinha e proprietário, isolamento por papel |
| Catálogo e política | variantes, pizzas, adicionais, cupons, horários e frete reais publicados no backend |
| Checkout e pagamentos | carrinho persistente, quote autoritativa, order transacional, idempotência, método de pagamento validado em sandbox quando online |
| Operação | pedido recebido pela fila e cozinha; aceite/preparo/pronto/retirada/entrega, notificações e histórico |
| Segurança e privacidade | tenants A/B, políticas DB/RLS, LGPD, logs, segredos, backups, operador e entregador restritos |
| QA técnico | E2E real, testes mobile, acessibilidade, regressão, falha de rede, conciliação e recuperação |
| Publicação autorizada | versão/commit, rota/domínio, smoke com transação de teste autorizada e estado de prontidão comprovado |

A homologação é **por loja**, não por marca 0WEB nem pelo fato de outra loja ter passado. Testes RLS com `SKIP` não contam.

## 5. Evidências exigidas e comando atual de pré-validação

```bash
node --test tests/delivery/readiness-gate.test.mjs tests/delivery/scaffold-intent.test.mjs
node scripts/delivery/check-operational-readiness.mjs \
  --manifest docs/portfolio/delivery-readiness/cliente-exemplo.json --json
```

A execução do segundo comando deve produzir `BLOCKED`/exit `2` enquanto não houver um **verificador de resultados E2E confiável**, inclusive se alguém editar o JSON para escrever `PASS`. Os testes unitários deste preflight confirmam só a proteção contra aprovação falsa; **não validam checkout real**.

O código real posterior precisará conectar esse gate a pipelines com provenance de CI, backend de teste, banco/migrations, sandbox de pagamento, fila/KDS e smoke de produção. Só depois o gate poderá autorizar `DELIVERY_READY=PASS`.

## 6. Aceitação e indicadores de produto

**Antes de chamar a entrega de sistema:** um pedido de teste autorizado precisa atravessar catálogo real, variações, cotação, entrega/retirada, pedido durável, pagamento de acordo com a modalidade, protocolo, recepção no painel, cozinha, entrega/retirada, histórico, privacidade e recuperação de falhas.

Os 17 gates obrigatórios estão detalhados em [DELIVERY_OPERATIONAL_VALIDATION_STANDARD.md](./DELIVERY_OPERATIONAL_VALIDATION_STANDARD.md). O plano de implementação deve converter os cenários R2–R6 em testes executáveis com resultados do runner confiável, nunca assertions de texto ou screenshot de marketing.

**Estados de relato válidos**:
- `DOCUMENTED`: especificação/artefatos;
- `IMPLEMENTED`: código real e migration presente;
- `TESTED`: suíte real executada;
- `PUBLISHED`: produção homologada;
- `BLOCKED`: qualquer evidência obrigatória faltante.

Nunca escrever "100% delivery", "checkout completo" ou "PDV pronto" porque o manifesto foi criado, o CI geral passou ou a landing foi publicada.

## 7. Limites permanentes

Não modificar DNS, gateways, dados de clientes, contratos de preços, `clientKey` de outra loja ou infraestrutura existente ao classificar um novo delivery. Não depender de créditos do Lovable para implementar, versionar ou publicar. Sem clonagem do PDV Slim ou de outro sistema comercial: a referência serve apenas como matriz de capacidades, com estados explicitamente não verificados quando não houve teste interativo.

**Resultado da Rodada 8:** governança, instruções de criação e manifesto de prontidão conectados no repositório; não é a conclusão da implementação transacional. O próximo programa é construir e homologar o motor real em PRs separadas e pequenas, com evidência, sem regressão.
