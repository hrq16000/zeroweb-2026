# 0WEB — DELIVERY RESTAURANT OPERATIONS STANDARD (Rodada 5/8)

**Status:** `SPEC_COMPLETE / IMPLEMENTATION_PENDING / NO_RUNTIME_VALIDATION`  
**Data:** 2026-11-01  
**Escopo:** operação autenticada do restaurante, recepção de pedidos, cozinha/KDS, retirada/entrega, gestão de operadores, notificações e observabilidade.  
**Norte:** o pedido só vira operação real quando é **persistido**, reconhecido pela operação e seu estado é rastreável até a conclusão.

## 1. Hierarquia de contratos e referência

- [DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md](./DELIVERY_FUNCTIONAL_SYSTEM_STANDARD.md): visão de sistema transacional, composição e gates.
- [DELIVERY_MENU_PRICING_STANDARD.md](./DELIVERY_MENU_PRICING_STANDARD.md): preços e opções autoritativos.
- [DELIVERY_CHECKOUT_ORDER_STANDARD.md](./DELIVERY_CHECKOUT_ORDER_STANDARD.md): pedido durável, checkout, pagamentos, transições e idempotência.
- [ORDER_PAYMENT_STATE_MACHINES.v1.json](./delivery/ORDER_PAYMENT_STATE_MACHINES.v1.json): 10 estados operacionais e 11 de pagamento.
- [OPERATOR_ACCESS_POLICY.v1.json](./delivery/OPERATOR_ACCESS_POLICY.v1.json): 7 papéis, 27 ações nomeadas e 25 vetores de autorização **documentais**.
- `docs/PORTAL_ARCHITECTURE.md` e `docs/PORTAL_ADMIN_SCREENS.md`: administrativo institucional da 0WEB não é o painel multi-tenant de uma loja. Separar segurança, rotas, permissões e banco de pedidos.

**Referência pública, não implementação observada:** https://pdvslim.com.br/ apresenta gestão de pedidos, tela de cozinha (KDS), caixa, estoque, relatórios, multiusuários, auditoria e multiloja como *capacidades comerciais anunciadas*. Não tivemos acesso autenticado aos módulos de terceiros nem inspeção interativa completa da loja https://pdvslim.com.br/loja/jumapizzaria. Não copiar interface, identidade, código nem alegar equivalência já comprovada. A 0WEB transforma esses princípios em contratos próprios e testáveis.

## 2. Mapa de superfícies: o que existe vs. o que não se deve confundir

| Superfície | Objetivo | Autorização | Situação exigida no MVP |
|---|---|---|---|
| Storefront pública | Descobrir, configurar e comprar | visitante/sessão de checkout | real, com pedido durável |
| Painel de pedidos da loja | visualizar fila, aceitar/rejeitar, acompanhar e tratar exceções | operador da loja autenticado | **obrigatório** |
| Vista de cozinha / KDS mínimo | visualizar itens detalhados e marcar preparo/pronto | cozinha/gestor autorizado | **obrigatório como fluxo**, podendo ser vista do painel, não necessariamente hardware dedicado |
| Operação retirada/delivery | entregar em mãos, despachar e concluir | balcão/gestor/entregador designado | **obrigatório para modalidades oferecidas** |
| Gestão de loja | catálogo, opções, preços, horários, taxas e disponibilidade | gerente/proprietário autorizado | **obrigatório** |
| Conciliação de pagamentos | conferir recebimentos, registrar dinheiro/maquininha, iniciar estornos autorizados | caixa/gestor, restrições por ação | **obrigatório conforme modalidade ativa** |
| Auditoria e falhas de fila | descobrir quem mudou algo e quais notificações falharam | gestor/proprietário | **obrigatório** |
| Mesas/comandas, impressora, fiscal, estoque de ingredientes, relatórios financeiros amplos e multi-loja consolidado | módulos de PDV completo | escopo específico homologado | **separados, não fingir entregues** |

A 0WEB não pode dizer que um delivery atende automaticamente mesas, NF-e, comanda ou estoque por ingrediente sem contratos técnicos, homologação e módulos operacionais próprios.

## 3. Jornada operacional com responsabilidade por estado

| Etapa | Entrada | Ação autorizada | Resultado auditável |
|---|---|---|---|
| Recepção | `PLACED` após pedido durável e pagamento elegível | sinalizar novo pedido e disponibilidade real | fila com protocolo, snapshot e timestamp do servidor |
| Aceite | `PLACED` | `order.accept` pelo balcão/gestor | `ACCEPTED`; gravar ator, versão e evento |
| Recusa | `PLACED` | `order.reject` pelo gestor com motivo | `REJECTED` + restituição/compensação se cobrado |
| Preparo | `ACCEPTED` | `order.start_preparation` pela cozinha/gestor | `PREPARING` com histórico |
| Pronto | `PREPARING` | `order.mark_ready` pela cozinha/gestor | `READY`; aviso de retirada/despacho somente se confirmado |
| Entrega | `READY` + modalidade `DELIVERY` | `order.dispatch` por balcão/gestor | `DISPATCHED`, handoff confirmado |
| Entrega concluída | `DISPATCHED` | `order.complete_delivery` por entregador designado/gestor | `COMPLETED` + evidência conforme configuração |
| Retirada concluída | `READY` + modalidade `PICKUP` | `order.complete_pickup` pelo balcão/gestor | `COMPLETED` + entrega em mãos |
| Cancelamento excepcional | estado em que o contrato R4 permite | `order.cancel` com motivo e autorização gerencial | evento de cancelamento + compensação financeira quando aplicável |
| Recebimento offline | método `CASH_ON_DELIVERY` ou `CARD_ON_DELIVERY` | `payment.record_offline` por caixa/gestor | liquidação auditada no estado financeiro, sem confiar na fala do comprador |

**Fonte única:** estado do pedido é transicionado pelo backend com `expectedVersion`. O painel só emite comandos; não altera estados otimisticamente como fato confirmado. O cliente só acompanha eventos reais. Mesmo depois de concluir preparo, pagamento pode permanecer `PENDING` em pedidos autorizados de cobrança na entrega.

### Exceções sem mentiras operacionais

- Cancelamentos após início do preparo exigem gestor e motivo, preservando histórico; autorização depende de política e viabilidade real.
- Pedido pago mas recusado requer fluxo de devolução, não descartar evento financeiro.
- Itens podem estar indisponíveis no momento do aceite; não substituir ingredientes ou valores do pedido sem consentimento e ajuste auditado.
- Pedido já concluído não volta a `PREPARING` por clicar duas vezes, reabrir tela ou restaurar cache.
- Mudanças operacionais em lote são proibidas no MVP, salvo endpoints específicos com autorização, auditoria e revisão antes de executar.

## 4. UX mínima do painel — dia de movimento

### 4.1 Fila do operador

Colunas/filtros conceituais: **Novos**, **Aceitos**, **Preparando**, **Prontos**, **Saiu para entrega**, **Concluídos** e **Exceções**. O sistema pode adaptar cards, tabela ou kanban conforme dispositivos e identidade do estabelecimento; o estado nunca depende da cor.

Cada cartão precisa de:
- protocolo não sensível, horário de criação pelo servidor, idade do pedido;
- modalidade, indicador de pagamento independente, número de itens e total confirmado;
- resumo de itens com variantes, adicionais, frações de pizza e observações especiais;
- status operacional, eventual aviso de atraso **sem inventar SLA**;
- ação permitida conforme estado/role, com confirmação para ações irreversíveis;
- indicativo de falha de sincronização, notificação, KDS ou impressão, em vez de “tudo recebido”.

É essencial haver distinção visual/semântica entre:
`0 pedidos confirmados`, `carregando`, `desconectado`, `acesso negado`, `atualização atrasada`, `erro de sincronização`, `filtro sem resultados`.

**Não usar** um painel vazio quando a API está offline. Status de conectividade faz parte da operação.

### 4.2 KDS (tela de cozinha)

- Pedidos só chegam como **acionáveis** após atingir estado autorizado pelo contrato (no mínimo `PLACED` ou `ACCEPTED`, conforme configuração de aceite da loja); nunca liberar cozinha de `PENDING_PAYMENT` online.
- Cada ticket exibe somente dados de preparo: protocolo, ordem e hora, itens, quantidades, tamanho, frações, adicionais, exclusões/observações úteis e alerta de alergênicos **quando dados fornecidos e verificados**.
- Nenhum campo de gateway, chave de pagamento, endereço residencial completo ou telefone deve ser exposto para cozinha.
- Botão de **visualizado**/`kds.acknowledge` registra entrega/leitura **distinta** de **iniciar preparo**/`order.start_preparation`; visualização não aceita pedido automaticamente.
- Atualizações devem preservar ordem, impedir ticket duplicado ao reconectar e exibir `lastSyncedAt`.
- Se a cozinha estiver sem rede, a tela pode exibir último estado como **desatualizado**, mas não deve enviar comandos que pareçam confirmados enquanto offline. Um comando local pendente, se futuramente implementado, exige fila segura/idempotente e reconciliada; default = **não confirmar offline**.
- Controle de sons/alertas: feedback acessível visual, som opcional configurável, modo silencioso e sem autoplay invasivo; não prometer alerta garantido quando navegador em segundo plano.
- Impressão é *adaptador opcional*, não causa primária da existência do pedido. Erro de impressora gera retry seguro e aviso, jamais criação de segundo pedido ou segunda cobrança.

### 4.3 Retirada/entrega

- `PICKUP`: mostrar código/protocolo, dados mínimos de identificação e confirmação de retirada; nada de exigir endereço residencial.
- `DELIVERY`: confirmar despacho com entregador/unidade e eventuais dados de cobertura; permitir conclusão apenas quando houver evidência e papel válido.
- Entregador só vê pedidos **expressamente designados**, no período necessário, com dados mínimos de entrega. Não pode navegar na fila inteira.
- Se não houver módulo de entregador, gestor pode confirmar entrega com justificativa e evidência operacional conforme política; não afirmar rastreamento em tempo real.
- ETA do pedido é estimativa rotulada e configurada pelo estabelecimento; nenhum SLA universal.

## 5. Tempo real, confiabilidade e reconciliação

### 5.1 Arquitetura de eventos

```text
Servidor: transação order + status history + outbox event
    → worker de outbox (retry/dedupe)
        → canal de atualização (WebSocket ou SSE com auth por loja) / fallback polling
            → fila do operador + KDS + visão do cliente + notificações auxiliares
```

- **Source of truth**: consulta do banco de pedidos e histórico por loja; socket/push/print é entrega eventual de sinais, não persistência.
- Cliente recebe `eventId`, `orderId`, `orderVersion`, `storeId` resolvido do token, `occurredAt`; ao reconectar consulta snapshot desde `lastSeenVersion`/cursor.
- Ordenar por versão da entidade e descartar eventos antigos; não contar com entrega exatamente-uma-vez do socket.
- Outbox persistida no mesmo commit da mudança de pedido; worker tem tentativas, backoff, dead-letter/alerta, dedupe e operador vê atraso.
- **Alarme ≠ aceite**: o aviso de novo pedido pode falhar e a operação ainda precisa poder consultar tudo na fila. Ausência de confirmação de notificação não apaga pedido.
- Horários/prazos de alerta são definidos por loja; sem números inventados. Informar desatualização se conexão de KDS/painel não conseguir sincronizar.
- Restringir canais por tenant/store e papel. Evento global não pode conter PII de outros clientes.

### 5.2 Queda de rede ou equipamento

| Falha | Comportamento obrigatório |
|---|---|
| Loja perdeu WebSocket/SSE | fallback polling autorizado; mostrar estado de reconexão |
| Operador recarregou tela | recarregar fila do servidor, sem perder pedidos nem criar duplicidade |
| Worker outbox parado | alertar, backlog observável e replay idempotente |
| KDS desligado | não marcar “cozinha recebeu”; fila mantém pedido e sinaliza dispositivo não sincronizado |
| Impressora falhou | manter pedido, logar erro, reimprimir por comando auditable |
| Dois operadores aceitaram simultaneamente | apenas um `expectedVersion` vence, outro recebe `409 VERSION_CONFLICT` e estado atualizado |
| Operador offline tentou transição | comando não é declarado concluído; solicitar reconexão/revisão |
| Pagamento confirmando durante tela aberta | atualizar estado financeiro do servidor, sem editar snapshot de preço |
| Dado de delivery de outra loja apareceu | incidente P0: bloquear acesso, auditar e investigar isolamento |

## 6. Operação do estabelecimento e papéis

A política inicial de **7 perfis** é especificada em [OPERATOR_ACCESS_POLICY.v1.json](./delivery/OPERATOR_ACCESS_POLICY.v1.json):
`OWNER`, `MANAGER`, `COUNTER`, `KITCHEN`, `COURIER`, `CASHIER`, `VIEWER`.

- O usuário deve ter vínculo ativo com a loja e papel escopado. Um mesmo usuário com duas lojas precisa selecionar o estabelecimento ativo, que o servidor deve validar em **cada requisição**.
- `OWNER` pode gerir operadores de **sua** loja; não é administrador global da plataforma 0WEB.
- `MANAGER` gerencia pedidos e autorizações operacionais, mas não concede a si mesmo privilégios de owner/global.
- `COUNTER` aceita, despacha e conclui retirada; rejeição, estorno e cancelamento excepcional requerem gestor.
- `KITCHEN` recebe projeção do pedido com itens de preparo, sem dados pessoais desnecessários.
- `COURIER` só vê/atua nos pedidos atribuídos. Mesmo que `order.view` seja uma permissão do papel, sua query precisa exigir `assigned_courier_id = actorId`.
- `CASHIER` pode registrar recebimento offline verificado, nunca “pago” com base em confirmação do comprador.
- `VIEWER` é leitura limitada, sem ações mutáveis e sem dados de cliente não necessários.

**Autorização é server-side e por registro/coluna**, não ocultação de botão. Modo suporte institucional 0WEB não recebe acesso universal a pedidos de clientes automaticamente. Acesso excepcional requer consentimento/justificativa e trilha de auditoria.

### Políticas adicionais

- Toda transição requer `storeId` validado pelo servidor + `actorId`, `role`, `expectedVersion`, `reason` quando aplicável, `eventId` e horário.
- Não armazenar identidade pessoal em atributos de token de sessão públicos além do necessário.
- Segredos e chaves do provedor permanecem no servidor.
- Ações financeiras têm **autorização adicional** e log de solicitação/efetivação; reembolso autorizado não deve ser confundido com reembolso concluído pelo provedor.
- Impedir que técnico/operador altere o preço histórico de pedido já confirmado por edição do catálogo.

## 7. Administrar loja sem editar código

Mínimo da primeira entrega operacional:

| Área | Campos/ações | Validações |
|---|---|---|
| Identidade e atendimento | nome comercial, logo, descrição, modalidades, horário e fechamento temporário | confirmação de titularidade, timezone, status real |
| Cardápio | categorias, produtos, opções, preços, imagens, estoques/disponibilidade | schema e política do motor R3; preview + publicar |
| Entrega | zonas, taxas e regra de pedido mínimo | elegibilidade e cálculo no servidor |
| Operação | aceitar, preparar, pronto, entregar/retirar, cancelar com motivo, pausar recebimento | estados R4, papéis, audit log |
| Pagamentos | meios ativos, reconciliação de recebimentos offline, status gateway | não permitir “pago” por cliente/retorno |
| Usuários | convidar/revogar operadores da loja, papéis por unidade | autorização e bloqueio de escalada |
| Histórico | buscas por protocolo/período/status, reimpressões, cancelamentos, mudanças | dados acessíveis conforme papel e retenção |

**Pausar loja:** deve impedir novos pedidos imediatamente após confirmação no servidor, não apagar pedidos aceitos ou pendentes. `COUNTER` pode solicitar pausa emergencial conforme política; retorno à operação exige `OWNER/MANAGER` e checagem de capacidade. Toda pausa registra motivo e autor; fora do horário a loja não assume automaticamente “aberta”.

**Relatórios:** painel básico de número de pedidos, status e conciliação real; métricas sofisticadas por produto, turno, estoque, fiscal ou franquia só podem ser anunciadas quando homologadas.

## 8. Modelo de eventos e observabilidade

Campos conceituais mínimos por evento:

```text
eventId (opaque) · tenantId · storeId · orderId · orderVersion ·
eventType · actorId (or SYSTEM with provenance) · actorRole ·
occurredAt (server) · priorState · nextState · reasonCode? ·
requestId · deliveryStatus? · retryCount?
```

`paymentEvents` e `orderEvents` mantêm trilhas **distintas**. Dados sensíveis podem ficar em armazenamento protegido referenciado, não em payload de broadcast ou log comum. Capturar identificadores de sessão/checkout sem expor telefone/endereço nos eventos do KDS.

Observabilidade mínima:
- pedidos novos criados por loja/período (separando `PENDING_PAYMENT` de `PLACED`);
- idade dos pedidos `PLACED` sem aceite, sem inventar prazo de atendimento;
- número de pedidos cujo status da fila difere da leitura do banco;
- outbox/eventos pendentes e mais antigos, tentativas de retry, dispositivos KDS não sincronizados;
- divergência entre pagamento e pedido, tentativa de estorno, cobrança duplicada;
- erros de autorização, cruzamento de tenants, version conflict;
- erro de impressora/KDS e reenvio de notificação, sem repetição de ordem/cobrança.

Alertas P0: pedidos persistidos não visíveis para operação, pagamentos discrepantes, acesso cross-tenant, compra confirmada sem protocolo, perda não recuperável de eventos, cancelamento/estorno indevido. Não depender de dispositivo conectado ou popup aberto para alertas críticos; usar monitor independente de backend.

## 9. Mock de interação/estados de tela a testar, sem copiar PDV Slim

| Cenário | Antes | Ação | Depois válido |
|---|---|---|---|
| Primeiro pedido | fila vazia / conexão ativa | cliente conclui pedido de teste durável | protocolo aparece em “Novos”, sem refresh |
| Aceite | `PLACED` | balcão aceita | passa a `ACCEPTED`, timestamp e ator |
| Cozinha | `ACCEPTED` | cozinheiro inicia preparo | `PREPARING` e feedback |
| Finalização pickup | `READY` e `PICKUP` | balcão conclui retirada | `COMPLETED` sem `DISPATCHED` |
| Finalização delivery | `READY` e `DELIVERY` | balcão despacha, entregador confirma | `DISPATCHED → COMPLETED` |
| Sem rede | pedidos já vistos | sinal cai | aviso “Dados desatualizados”; proibir falso sucesso |
| Em duas telas | dois operadores tentam aceitar mesmo pedido | transições concorrentes | 1 sucesso, 1 conflito, sem estados duplicados |
| Pagamento offline | pedido a cobrar em entrega | caixa registra recebimento verificado | `paymentState=PAID`, operação preservada |
| Cancelamento | pedido pago e `PLACED` | gerente rejeita/cancela | estado terminal e restituição pendente, sem apagar order |
| Alerta cozinha falha | outbox com notificação sem ack | worker tenta retry | pedido continua consultável, falha rastreável |
| Entregador alheio | pedido designado para outro | courier tenta abrir | acesso negado, sem PII |
| Loja pausada | `orderEnabled=true` | gerente pausa | checkout de novos pedidos bloqueado, pedidos existentes preservados |

## 10. Critérios de aceite para esta fase (a executar em R7)

- `OPS-E2E-01`: pedido `PLACED` persiste e aparece na fila de operador da mesma loja; outro tenant não visualiza;
- `OPS-E2E-02`: evento repetido ou reconexão não gera segundo ticket, pedido ou cobrança;
- `OPS-E2E-03`: cozinha com acesso restrito visualiza configurações sem endereço/telefone ou dados financeiros não necessários;
- `OPS-E2E-04`: aceite/preparo/pronto/despacho/entrega avançam apenas conforme método de fulfillment;
- `OPS-E2E-05`: pedidos com pagamento online pendente não são enviados como executáveis à cozinha;
- `OPS-E2E-06`: retomada após queda de rede busca snapshot real e não perde atualizações;
- `OPS-E2E-07`: concorrência de operadores gera conflito de versão com recuperação;
- `OPS-E2E-08`: falha KDS/impressora gera alerta/retry sem perder pedido;
- `OPS-E2E-09`: pagador/cliente não pode marcar `PAID`, nem operador não autorizado estornar;
- `OPS-E2E-10`: cancelamento pago exige compensação e histórico, sem alterar snapshot;
- `OPS-E2E-11`: courier só atua em pedido designado; entrega requer evidência configurada;
- `OPS-E2E-12`: funcionário de loja A não edita, enumera nem recebe dados de B;
- `OPS-E2E-13`: catálogo alterado após pedido não modifica snapshot histórico;
- `OPS-E2E-14`: pausa imediata bloqueia novas compras, não interrompe finalização dos pedidos em andamento;
- `OPS-E2E-15`: eventos do painel e cliente concordam em `orderVersion` e pagamentos;
- `OPS-E2E-16`: teclado, mobile e tablet completam operações sem dependência de cor ou som.

**Status dos 16 cenários:** `NOT_EXECUTED`. A matriz de 25 testes de acesso é apenas um **contrato estático**, não prova de segurança de banco/RLS.

## 11. Fronteiras técnicas e requisitos de implementação

- A 0WEB usa o repositório oficial `hrq16000/zeroweb-2026`, com `AGENTS.md`, `PORTFOLIO_PROJECT_LIFECYCLE`, `0WEB_EXECUTION_CONTRACT` e regras de isolamento próprias; uma implementação deve ler o stack atual e criar módulos isolados, sem duplicar admin institucional ou forçar migração de framework.
- Delivery é um **módulo opt-in ligado a `clientKey`/`storeId`**, `orderEnabled=false` antes da homologação por loja. Identidade da landing continua independente.
- **Nenhuma mudança de DNS, de gateways, de credenciais ou de dados de produção** é autorizada por este contrato.
- Não incorporar diretamente a arquitetura de terceiros, endpoints privados, scripts ou ativos do PDV Slim.
- Evitar usar `PortfolioCTAQuiz` como fila de pedidos, porque lead não é pedido durável.
- `R6`: modelo físico e segurança, isolamento multi-tenant e LGPD. `R7`: testes automatizados, matriz de permissão e `DELIVERY_OPERATIONAL_GATE` executável. `R8`: integração nos manifests, playbooks, rotas e publicação documental.

## 12. Situação de entrega

**A documentação operacional descreve comportamento desejado, mas não afirma existência de backoffice, KDS, caixa, impressora, canal em tempo real ou E2E funcional na 0WEB.** Esses artefatos continuam por implementar, integrar, homologar e publicar depois das próximas fases. Nunca sinalizar `DELIVERY_READY=PASS` sem evidência de pedido de teste durável atravessando a operação real.
