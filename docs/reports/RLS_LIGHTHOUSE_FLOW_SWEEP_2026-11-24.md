# Conferência dos caminhos relacionados — RLS e Lighthouse

Complemento à preparação em `a4d7176c`. Escopo mantido: **analisar e preparar,
sem publicar, aplicar migrações, alterar permissões/settings ou desativar agentes**.
Novos comportamentos encontrados foram registrados e submetidos à autorização;
não foram corrigidos silenciosamente fora da preparação anterior.

## Regra conferida

Uma atualização autorizada deve preservar seu histórico; um teste ou relatório
não pode chamar ausência de evidência, erro de infraestrutura ou reprovação de
aprovação. Importações e novas tentativas não devem alterar silenciosamente um
registro já encerrado/enviado, nem misturar clientes.

**LIDO** significa código pertinente inspecionado nesta conferência, não teste
ponta a ponta nem auditoria geral. **REPRODUZIDO** indica execução isolada ou os
testes reais explicitamente identificados. Nenhuma escrita no backend nesta
conferência; nenhuma mensagem, sincronização externa ou decisão manual disparada.

## 1. Leads, histórico e caminhos alternativos

| Local / código lido | Resultado para a regra |
| --- | --- |
| `/painel-crm`, `crm.functions.ts`: listar/detalhar/atualizar | LIDO: autenticação/admin, gravação privilegiada; UPDATE chama os mesmos triggers e lança erro antes de sucesso. UI relê o detalhe. Não reproduz diretamente a negativa RLS do usuário comum porque usa cliente privilegiado. Falta validar quantidade de linhas atualizadas; não declarar que id inexistente foi atualizado |
| `/painel-crm`: nota/contato/ação, `addLeadHistory` | LIDO: histórico e last_interaction são duas operações em Promise.all, sem transação; uma pode persistir e a outra falhar. Correção adicional pendente de autorização, sem mexer em notas existentes |
| Dashboard executivo, `ExecutiveDashboard.tsx`, `dashboard.functions.ts:updateLeadStatus` | LIDO: autenticação/admin, UPDATE privilegiado e erro propagado; UI recarrega após sucesso. Compartilha trigger, mas não é evidência de RLS como usuário. Nenhum status foi alterado |
| `/app/crm-planilha`, `crm-sheets.functions.ts:syncCrmSheet` | LIDO: checa admin; erro de atualização de uma linha vira continue e ao final retorna ok:true. UI anuncia sucesso; não há proteção de status terminal nem controle de concorrência. Preparar resultado parcial explícito, atualização condicionada e preservação de encerrados; não sincronizado |
| `submitPublicLead`, `lead-intake.functions.ts` | LIDO: só anuncia sucesso após INSERT retornar id; erro retorna db_error. Trigger de histórico participa do mesmo INSERT. Deduplicação pode suprimir INSERT; não criar lead artificial para forçar sucesso |
| `/api/public/lead-webhook` | LIDO: INSERT privilegiado, erro retorna 500 antes de id; usa trigger. Configuração de segredo não alterada, nenhuma integração chamada; autenticação externa completa fora desta homologação |
| `crm-intake.functions.ts` → planilha/notificação | LIDO: busca lead recém-persistido, não altera status nem histórico. Limite de idade/source/contato; não executado para evitar envio externo |
| `submitFunnel` e `submitPortfolioQuiz`, `dynamic-funnel.functions.ts` | LIDO: INSERT de dynamic_form_leads vem antes de token; falha interrompe. Usam histórico de etapas separado. UPDATE posterior do protocolo não verifica erro: preparação adicional precisa preservar protocolo mesmo com falha dessa atualização; funis/destinos não alterados |
| `/app/funis/leads`, `dynamic-funnel-admin.functions.ts` | LIDO: etapa individual/em lote lança erro da alteração principal; tags em lote não verificam cada erro e retorno count usa tamanho solicitado. Não declarar todas as linhas alteradas; complemento aguarda autorização |
| `dfl_log_stage_change()` | LIDO no banco: SECURITY DEFINER, grava lead_stage_history no INSERT e mudança de etapa. Não compartilha lead_history; não precisa da elevação preparada para leads_after_change |
| `apply_pipeline_rules_on_insert()` | LIDO no banco: modifica somente NEW conforme primeira regra/form_id; nenhuma regra/configuração existente foi alterada |
| `leads_after_change()` | LIDO no banco: ainda SECURITY INVOKER; histórico em INSERT/status/atribuição. Negativa real permanece. Candidato já preparado fora de migrations; não aplicado |
| `leads_before_insert()` e `compute_lead_score()` | LIDO no banco: score/distribuição no INSERT; settings e ponteiro de distribuição preservados. Escopo anterior não autoriza trocar regras ou permissões destas funções |
| `enforce_license_limit_leads()` | LIDO no banco: verifica limite no INSERT com portal_id; não altera lead encerrado |
| `leads_dedup_same_day()` | LIDO no banco: procura telefone no dia sem filtro portal/status, altera last_interaction/payload do registro encontrado e anexa nota. Pode afetar encerrado ou outro portal. Preparação adicional foi perguntada; nenhuma migração ou alteração de dado executada |
| `lead-delivery-ledger.server.ts`: delivered/failed/retry | LIDO: UPSERT posterior pode substituir estado entregue e delivered_at por null. Proteger estado terminal exige alteração adicional autorizada; não reclassificar entregas existentes |
| `/app/leads/`, `unified-leads.functions.ts`, `vw_unified_leads` | LIDO no código e definição da view: consulta carrinho + dynamic_form_leads; não usa lead_history/lead_submissions e não altera registros. Digest não foi enviado |
| Leads por marca/funil, `portfolio-funnel-leads.functions.ts` | LIDO: consultas de funil e captação, telefones mascarados; não altera lead ou histórico |
| Atendimento/cidade, `city-leads.functions.ts`; telefone/clientes e dossiê, `phone-leads.functions.ts`, `lead-dossier.functions.ts` | LIDO: consultas autorizadas e ações de contato separadas; não alteram status/histórico do lead. Nenhuma abertura/envio realizado |
| Campanhas, `campaigns.functions.ts` | LIDO: consulta agregada de leads, sem UPDATE de lead; não valida isolamento por si só |
| Área do cliente/relatórios, `clientarea.functions.ts:getMyReports` | LIDO: consulta agregada; não altera leads. Escopo de acesso e agregações não foi declarado homologado por esta conferência |
| Administração de usuários, `users-admin.functions.ts` | LIDO: associa consultas de leads ao detalhe do usuário; não atualiza estes leads. Nenhum usuário/papel foi alterado |
| Master/portais, `portal.functions.ts`; BI/ecossistema, `ecosystem.functions.ts` | LIDO: consultas agregadas; backfill escreve identidades/links, não status/histórico do lead. Backfill/snapshot não executados |
| Licenças, `licenses.functions.ts`; cron `license-usage-snapshot.ts` | LIDO: contagens de leads por portal e métricas de licença; não alteram leads. Job exige segredo de manutenção, não executado |
| Disparos, `wa-dispatch.functions.ts` | LIDO: consulta leads e grava estado próprio de lotes/mensagens, não lead_history. Nenhum lote enviado ou mensagem já enviada alterada |
| Prova social, `social-proof.functions.ts` | LIDO: consulta/anônimiza dados; não modifica status/histórico. Privacidade/prova editorial não declaradas auditadas nesta rodada |
| `access-audit.server.ts`, auditorias de acesso | LIDO: grava audit_logs observacional, não lead_history; best-effort não substitui histórico obrigatório. Logs/dados antigos preservados |
| `/api/public/health-db` | LIDO: presença de tabelas, não isolamento/RLS; não usar resposta health como prova de segurança. Recarregamento/configuração não executados |

A busca de chamadas diretas de lead_submissions/lead_history identificou **19
arquivos de produtores/consumidores**; seus trechos pertinentes foram lidos,
incluindo consultas, não somente os dois testes inicialmente corrigidos.
Isso não é autorização para refatorar esses módulos ou alegar segurança geral.

## 2. Lighthouse, relatórios e páginas

| Local / código lido | Resultado |
| --- | --- |
| `.lighthouserc.cjs`, workflow `lighthouse.yml` | LIDO: mede artefato local de PR/push e URL externa apenas em dispatch; budgets continuam 90/95 e CWV. SKIP por escopo não é PASS; não disparado |
| Workflow `new-portfolio-publication.yml`, `new-portfolio-publish-gate.mjs` | LIDO: candidatos individuais usam mesma configuração e exigem baselines/readiness. Não confundidos com shards globais; sem atualização automática de baseline |
| `portfolio-gates.yml`, build/prebuild | LIDO nas chamadas pertinentes: suíte, funis, visual e consolidação são verificações distintas; nenhuma delas substitui gate RLS/Lighthouse real |
| `report-lhci-diagnostics.mjs`, módulo de diagnóstico | Correção anterior testada: encontra LCP aninhado e mantém métricas ausentes como null. Não reinterpreta relatório incompleto como PASS |
| `/api/public/hooks/lhci-ingest` | **REPRODUZIDO somente em lógica isolada extraída do código**: payload só com URL passa; payload completo com TBT=400 também passa. TBT/A11y não entram na lista failed e métricas são opcionais. Endpoint não chamado; corrigir contrato/evaluador apenas após autorização |
| `ci-audit-report.mjs` → `/audit/latest.json` | **REPRODUZIDO em /tmp**, usando LHR real de Angel Mix: performance=0,82 e routesWithProblems=0. Falhas Lighthouse não entram em problems e a consolidação mantém só a última execução por rota |
| `/painel-auditorias` | LIDO: mostra ok quando problems.length=0, mesmo com performance reprovada; pode ocultar do filtro a reprovação. Correção adicional submetida à autorização |
| `/painel`, `LhciAdmin`, `lhci.functions.ts` | LIDO: status passed/failed e decisão approved/rejected são distintos; decisão manual muda status persistido. Aprovação humana não pode ser citada como medição PASS. Não aprovados/rejeitados relatórios, não enviadas notificações |
| `SeoThresholdsAdmin` | LIDO: permite configurar TBT=200, mas ingestão não consulta esse limite. Valores, segredos e destinatários preservados |

### Cada uma das doze páginas foi lida em seu caminho de abertura

- **JSX + primitives:** Angel Mix (H1 mascarado), Dentinho (H1 reveal), Centro
  Mega (parágrafo reveal), D'Lara (imagem mascarada), Embalar (imagem reveal),
  Mania (imagem reveal), Dom Diego (H1 reveal), Maresia (imagem mascarada) e
  Your Brutus (imagem scale reveal). Preservar composição e mover somente espera
  crítica exige QA próprio; não foi implementado nesta preparação.
- **Blueprint, caminho diferente:** Carecas Infotec e JKL Decor declaram
  fullBleed; `blueprint/sections.tsx:Hero` envolve H1 em MotionReveal mask.
  O renderer legado está congelado: não consertar os dois modificando todos os
  pilotos indiscriminadamente.
- **motion/react, caminho diferente:** Paulo Mestre de Obras usa initial
  opacity:0 no H1 e na imagem, em vez das primitives fail-open; não presumir que
  uma correção de MotionReveal o resolva. Estado sem JS/reduced-motion exige QA.
- **Compartilhados:** rota `/portfolio/$slug`, PortfolioImage, runtime/overrides,
  MotionReveal/MotionImageReveal e RouteLoader foram lidos nos trechos pertinentes.
  Nenhum sistema global, asset institucional ou página foi alterado.

Os 24 LHR reais anteriores continuam sendo a evidência de desempenho, **não
novas medições desta conferência**. Nenhuma página foi chamada de corrigida ou
visualmente aprovada apenas por leitura de código.

## 3. Preservação, pendências e próxima autorização

MCP/OAuth e suas duas ferramentas foram lidos: caller-scoped, somente catálogo
ativo/com preço, sem leads ou mutações. Código, papéis e acesso dos agentes
intocados; não repetido login/OAuth ponta a ponta nesta conferência.

Persistem os limites anteriores: aplicação autorizada do candidato lead_history,
gate remoto com método autorizado no runner, implementação/medição Lighthouse e
reconciliação #548. Suíte anterior: **1187 PASS / 1 FAIL** real de histórico;
não reexecutada por esta rodada documental. Nenhum scanner novo, deploy ou dado
encerrado foi alterado.

Perguntas abertas: (1) preparar ingestão/resumo Lighthouse, planilha/notas CRM e
substituição do teste SQL legado; (2) preparar proteção de deduplicação/ledger
contra alterar registros terminais ou outro cliente. Até a resposta, apenas
achados e critérios de correção: métricas completas/limites reais; falha parcial
explícita; transação de nota+interação; escopo por portal; estados terminais
preservados; teste de escrita que falhe se a escrita for permitida, sem DROP de FK.