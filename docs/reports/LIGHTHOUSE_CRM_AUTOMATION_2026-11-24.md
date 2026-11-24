# Lighthouse e CRM — automação autorizada, validação e pendências

Data: 24/11/2026, após 14:47 UTC. Escopo: pedido explícito de publicação, agentes, chave de recebimento automático, CRM atômico e painel de medições. A autorização atual substitui a decisão anterior de manter o candidato CRM preparado. Nenhum evento passado foi reconstruído; deduplicação/ledger, identidades e portfolios permanecem intactos.

## Resultado funcional verificado

- Chave `LHCI_HMAC_SECRET` configurada pelo formulário seguro; usuário confirmou a mesma chave no GitHub. Seu valor não foi lido, registrado ou exposto.
- Receptor `/api/public/hooks/lhci-ingest` exige HMAC do corpo exato, sem fallback por token; leitura limitada a 64 KiB, validação de formato/limites, data original e identidade única para retry. A mesma medição nunca sobrescreve decisão anterior.
- Script `send-lhci-receipts.mjs` assina todos os LHR coletados, incluindo falhas. Ausência de chave ou entrega recusada falha explicitamente; tentativas 429/5xx limitadas a três. Workflow existente inclui envio após diagnóstico, mesmo quando Lighthouse reprova.
- `/painel-lighthouse` reutiliza o painel de medições sob autenticação existente; RBAC é validado pelas funções servidor. Datas originais e recebidas, nota, status calculado, decisão administrativa separada, origem, cobertura, filtros, paginação, detalhes e JSON. Atualização a cada minuto enquanto a tela está visível. Se cobertura for truncada, o painel informa incompletude.
- Migração `0009_crm_atomic_history_and_lighthouse_receipts.sql` já aplicada ao banco real. Função atômica CRM `SECURITY INVOKER`: lock do lead, igualdade exata de portal inclusive null, validação da nota, recusa dos estados terminais, história e última interação juntas; execução somente service_role. O caminho autenticado lê portal com RLS do usuário antes de chamar a operação privilegiada. Nenhum backfill/registro existente alterado.

## Prova real Lighthouse

Uma nova execução real de Lighthouse contra `https://0web.com.br/portfolio/dlara-pizzaria`:

| Campo | Resultado |
|---|---|
| Data original UTC | 2026-11-24T14:36:54.335Z |
| Performance | 92 |
| SEO / acessibilidade | 100 / 100 |
| LCP | 1028.7005 ms |
| CLS | 0.0000279193 |
| TBT | 2 ms |
| Gate recebido | passed; assert oficial dessa execução PASS |
| Proveniência | lighthouse-cli / signed-webhook |
| SHA público servido | Não comprovado; commit_sha null |

Envio sem assinatura: HTTP 401. Envio assinado no servidor local conectado ao banco real: aceito. Retry da mesma medição: mesmo ID/duplicate true; UI autenticado leu data, 92 pontos e proveniência. Nada rotulado como execução GitHub Actions.

O banco contém **25 medições: 18 failed e 7 passed**, sem decisões administrativas novas. Todas as 12 rotas acompanhadas têm medições recebidas; isso não significa aprovação de release. Existem **0 recebimentos automáticos com origem GitHub Actions**: a configuração e os testes não substituem uma execução oficial pós-publicação. CSV consolidado foi atualizado somente com o terceiro resultado Dlara; demais resultados/reprovações intactos.

## Prova CRM e limpeza

Um lead claramente sintético `qa-crm-atomic-20261124-1419` foi criado para exercício do caminho real autenticado. Uma nota foi enviada pelo CRM, mostrada no histórico e relida após recarregar. Operação terminal testada diretamente na função do banco real: recusada com SQLSTATE 55000; histórico e última interação permaneceram iguais. Fixtures PostgreSQL descartáveis também verificam rollback de falhas de INSERT/UPDATE, isolamento e privilégios.

Limpeza guardada por ID + origem + e-mail fictício, incluindo histórico e auditoria específicos do teste. Conferência após limpeza: lead 0, histórico 0, auditoria 0. Nenhum lead real ou encerrado existente recebeu edição/nota.

## Validação

- `bun test`: **1239 PASS, 0 FAIL**, 8520 asserções, 223 arquivos.
- Runner SQL descartável: 7 verificações PASS, incluindo detecção de mutações que removem proteção terminal/portal e erros indevidos no teste legado.
- Brand integrity, portfolio boundaries, portfolio metadata, YAML de workflow e `git diff --check`: PASS.
- Harness: última compilação observada `build OK`. Build/typecheck manual não executado, conforme plataforma; Bun local **1.4.4**, não 1.4.0. CI oficial da implementação ainda pendente.
- Browser com conta indicada: identidade confirmada; gravação/reload CRM, 25 medições, filtros/detalhes, desktop e 390px/reduced-motion sem overflow. Visitante chega ao login e não recebe medições privadas. Sem pageerror na conferência concluída.
- Páginas públicas atuais Home, `/servicos`, `/servicos/site-express`, `/checkout`, `/portfolio/centro-mega`: HTTP 200, conteúdo visível, zero pageerror. Centro Mega mantém identidade/layout/produtos reais. Isso verifica o estado atualmente servido, não um deploy novo.
- Scan rápido: nenhum finding ativo novo; findings já ignorados pelo usuário preservados. Scan profundo não solicitado/executado; não afirmar auditoria profunda limpa.

## Agentes e publicação — ainda pendentes

- Conta indicada por Henrique já tem acesso administrativo; validada em perfil/painel/agentes sem novo convite, pessoa duplicada ou concessão de papel. `support_agents` é cadastro distinto; não inferir ativação de pessoas inexistentes.
- Integração GitHub existente permite leitura HTTP 200. #548 continua Draft, head `a3d44a79`, `maintainer_can_modify=false`; bloqueio OAuth anterior para reconciliação/escrita não foi contornado com outro token/ator/conexão.
- Main consultada: `b394e9205124a9c4d7fdaac7e72544410682e7b9`, apenas planejamento desta tarefa. Seus checks: 7 success, 2 skipped. Não usar esses resultados para certificar código novo.
- Último workflow RLS remoto `45352326130`, SHA `4bdf5a7f`: failure. Credencial indisponível no Cloud mantém homologação externa bloqueada; não solicitar nem fabricar service role e não enfraquecer gate.
- **Sem novo deploy/merge/publicação nesta rodada.** Publicação final precisa da implementação no Git oficial por processo autorizado, reconciliação dos agentes/PRs e gates aplicáveis. Não há release rastreável deste código ainda.
- Para concluir automação: publicar receptor validado, integrar workflow e executar medição oficial; confirmar origem `github-actions`, `workflow_run_id`, data original e read-back no painel. O recebimento CLI já provou o mecanismo, mas não a execução do CI.

Artefatos temporários de browser e LHR ficaram sob `/tmp`, sem copiar segredos, sessões ou fixtures para documentos públicos. Nova regra estrutural não foi adicionada a AGENTS.md pois seu orçamento já está excedido por regras do usuário; essas regras permaneceram byte-exact.