# 0WEB — preparação adicional RLS/Lighthouse/CRM

Pedido: 24/11/2026 às 06:40 UTC. **Somente preparação; não autoriza aplicação, publicação, dados reais, permissões, configuração ou encerramento de agentes.**

## Resultado e delimitação

| Frente | Preparado | Aplicação/homologação |
| --- | --- | --- |
| Ingestão Lighthouse | Métricas ausentes/nulas/invalidas não aprovam; Performance, SEO, A11y, LCP, CLS e TBT verificados | Nenhum POST real ou registro inserido; requer homologação assinada em ambiente autorizado |
| Relatório/painel | Todas as medições preservadas; reprovação entra em problems; resumo conservador; snapshots antigos reavaliados apenas em memória | Nenhum artifact histórico regravado, decisão manual modificada ou LHCI executado |
| Planilha CRM | Falhas e concorrência explícitas; encerrados preservados; nenhuma exportação após importação incompleta/leitura falha | Sem sincronização real ou chamada ao Google; requer E2E com planilha/contas de teste autorizadas |
| Notas CRM | Função SQL transacional, adaptação da chamada e fixture local | **INATIVO** fora de migrations/src; handler atual `addLeadHistory` intocado; depende de migração autorizada |
| SQL legado | Sem remover FK; negativas somente 42501; leituras positivas/negativas A↔B; rollback | Somente modelo descartável em memória; não prova RLS da produção |
| Deduplicação/ledger | **Somente achados registrados**, conforme resposta posterior de 06:40 UTC | Código, funções SQL, entregas e registros intactos; proteção NÃO preparada |

## Lighthouse

- Política pura em `src/lib/lhci-evaluation.mjs`, com declaração TS: permite uso pelo handler, painel e script Node sem duplicar critérios nem adicionar dependências.
- Baseline preservado: Performance ≥0,90; SEO/A11y ≥0,95; LCP ≤2500 ms; CLS ≤0,1; TBT ≤200 ms. Configuração existente pode ser mais rigorosa, nunca afrouxar o baseline; não foi alterada nenhuma configuração. BP/FCP continuam warnings no contrato de CI.
- Payload incompleto pode ser armazenado como `failed` com motivo `missing:<metric>`; não inventar métricas nem `passed`. Números negativos/não finitos são rejeitados pela validação do handler.
- `scripts/ci-audit-report.mjs` conserva `lighthouse.runs`, problems únicos e o pior valor medido por métrica (não uma suposta execução única). Teste funcional executa o script real em diretório temporário: duas medições 0,82/0,95 dão uma rota com problema, não zero.
- `/painel-auditorias` reavalia os resultados disponíveis de snapshots legados em memória. Não consegue reconstruir uma medição já descartada por um relatório antigo: essa limitação não é ocultada. Filtro/CSV/totais utilizam a mesma lista corrigida; JSON publicado fica intacto.
- Assinatura e fallback de autenticação existentes não foram relaxados; importação do cliente privilegiado de gravação ocorre após verificação do caller e do payload. Nenhuma credencial foi consultada, exibida, adicionada ou alterada.

## CRM na Planilha Google

- Classificador puro em `src/lib/crm-sheet-sync.ts`, persistência compare-and-set fornecida pelo handler; UI distingue retorno incompleto de sucesso.
- `fechado`, `perdido`, `arquivado` e aliases históricos `won`/`lost` não recebem alterações de status, responsável, observação ou interação pela planilha.
- A gravação compara ID + portal + status + assignee + notes + updated_at lidos, na mesma operação. Fechamento/movimento/edição concorrente produz zero registros retornados e é relatado como conflito, nunca contado como sucesso.
- Status inválido/desconhecido, ID duplicado, ID fora do conjunto lido, erro de gravação e concorrência entram no resultado por número de linha, sem dados pessoais. O número de atualizações conta somente IDs efetivamente retornados.
- Importação pode ser parcialmente persistida por linha: **não é uma transação de toda a planilha**. Isso é informado e impede a exportação de apagar edições pendentes. Nada é revertido automaticamente sobre leads reais.
- Erros de leitura impedem limpar/reescrever a planilha. O teto já existente de 5.000 leads deixa de truncar silenciosamente: busca 5.001 para detectar excesso e abortar antes da importação. Não aumenta o teto.
- Após sucesso integral, o handler relê valores persistidos/triggers. Escreve texto RAW antes de limpar apenas eventual cauda excedente, nunca limpa a única cópia antes de a substituição ser aceita. Exportação/limpeza ainda são operações Google separadas; falha do provider impede comunicar sucesso integral. Concorrência de edição no Google durante a operação não foi homologada nem declarada resolvida.
- Auth e papel administrativo existentes preservados. Não houve chamada ao provider, alteração de vínculo, criação de planilha, alteração de app_settings ou secret.

## Notas e interação — candidato inativo

- `docs/rls/crm-history-atomic-candidate.sql`: RPC SECURITY INVOKER, lock no lead do portal esperado, validação, rejeição de terminal e INSERT de histórico + UPDATE de interação na mesma transação. Erro em qualquer escrita reverte ambas.
- Proposta de EXECUTE somente para `service_role`; não abre policies de histórico, não altera grants de tabelas ou helpers de papel. **Nenhuma permissão foi aplicada.** SQL não entrou em `supabase/migrations`.
- `docs/rls/crm-history-atomic-callsite.ts`: adaptação testável, não importada por src. Relê portal do lead e faz uma única RPC; sem fallback de duas escritas. Preservar middleware, schema, autorização administrativa e auditoria no momento da futura promoção.
- Handler atual permanece com risco de persistência parcial até promoção autorizada. Não chamar RPC inexistente, não apresentar o risco atual como corrigido em produção.
- Fixture SQL valida sucesso único, falha de UPDATE depois do INSERT, falha de INSERT, cinco estados terminais, portal incorreto e ausência de EXECUTE público. Duas mutações negativas removendo terminal/portal foram detectadas.

## SQL legado

- `tests/rls/portal_isolation.sql` agora exige `zeroweb.disposable_fixture=on`; runner aceita apenas instalação temporária da engine em `/tmp`, cria banco **em memória** e não recebe URL/credenciais de backend. O flag é uma barreira contra uso acidental, não uma fronteira de segurança de produção.
- Modelo `tests/rls/portal-isolation.fixture.sql`: usuários sintéticos em tabela de fixture pública com FK intacta; nenhuma escrita em auth.users ou alteração de constraint necessária. Índice de visitantes inclui path normalizado.
- Cada sujeito lê exatamente uma fixture própria e zero registros do outro em leads/eventos/visitantes; escritas cruzadas verificadas nos três caminhos, ambas as direções. Só `insufficient_privilege`/42501 comprova negativa.
- Sentinel de sucesso fora do bloco capturável. Mutações de escrita indevida bem-sucedida e erro SQL não relacionado foram detectadas; execução sem fixture bloqueada. Rollback e FK intacta verificados.
- Corrigidas duas falhas de implementação local antes do PASS: namespace GUC não pode começar com número; setup descartável precisa commit próprio antes do rollback do teste.

## Evidência executada

- `bun test tests/performance/ci-audit-report.test.mjs tests/performance/lhci-evaluation.test.mjs tests/performance/lhci-diagnostics.test.mjs tests/crm tests/rls/helpers.test.ts`: **44 PASS / 0 FAIL**, 87 asserts.
- `bun scripts/test-preparation-sql.mjs --pglite-module=<instalação-temporária-revisada-em-/tmp>`: **7 PASS**, incluindo duas fixtures, quatro mutações negativas e bloqueio sem fixture. Engine PostgreSQL WASM descartável; nenhuma dependência adicionada ao projeto.
- `bun run validate:brand-integrity`: PASS (6 assets protegidos). `bun run validate:portfolio-boundaries`: PASS (98 sites isolados). `git diff --check`: PASS. Compilação automática do preview: build OK; não executar build/typecheck manual fora do harness.
- Runtime disponível reportou Bun **1.4.4**, não 1.4.0; `bun.lock` e dependências permanecem intocados. Gates com Bun 1.4.0 devem ser revalidados no runner canônico antes de promover.
- Suíte completa/retestes RLS reais não executados: poderiam escrever no backend existente, fora da autorização desta rodada. Resultado anterior 1187 PASS / 1 FAIL permanece histórico; a falha de trigger não foi migrada. Não transformar focused PASS em suite/RLS global PASS.
- QA de navegador autenticado, webhook assinado, planilha real, Lighthouse de páginas e endpoints CRM não executados por exigir efeitos/dados externos. Testes são exclusivamente sintéticos e não constituem E2E de produção.

## Achados somente documentados e promoção

- `leads_dedup_same_day()` pode atualizar payload/interação sem escopo adequado de portal/status; ledger pode regredir entrega confirmada e limpar delivered_at. Mantidos conforme [conferência anterior](RLS_LIGHTHOUSE_FLOW_SWEEP_2026-11-24.md), sem patch, execução ou novos dados nesta rodada.
- Agentes/MCP/OAuth, checkout/serviços, funis, clientes, layout/motion, marca, mídia, DNS, secrets, policies existentes, triggers existentes, CI/LHCI thresholds e configurações de deploy intocados.
- PR/merge/publicação, migração dos candidatos e homologação com efeitos são fases posteriores sujeitas à autorização/gates. Nenhum deploy, merge, scanner remoto, LHCI rerun ou alteração de dados reais solicitado/executado.
- Decisões estruturais documentadas acima; root AGENTS.md está acima do orçamento e regras do usuário/skills não foram condensadas para inserir novas notas.