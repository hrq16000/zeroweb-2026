# 0WEB — publicação solicitada e homologação factual

Data: 24/11/2026 UTC. Base local inspecionada: `42011df6`; o commit acrescenta apenas roadmap ao candidato `4949e96b`. Não equivale ao SHA confirmado em produção.

## Resultado e limites

- Publicação no domínio oficial foi **agendada**, não confirmada por deployment/SHA. Não repetir publicação nem declarar release homologada com gates pendentes.
- Centro Mega, Carecas Infotec e JKL Decor responderam HTTP 200 com conteúdo real visível. Última conferência direta Centro Mega sem pageerror; houve observação anterior de hydration, que não deve ser apagada do histórico. Carecas/JKL/Blueprint não foram redesenhados.
- Painel Lighthouse autenticado lê as medições reais importadas. Isso comprova **importação manual autorizada e leitura**, não envio assinado do webhook nem execução do GitHub.
- CRM autenticado e consulta da fonte atual mostram **zero leads e zero eventos em lead_history**. Não há conteúdo histórico real disponível nessa fonte para reconstruir; não criar leads/notas artificiais para preencher o CRM.

## Matriz atual

Fonte: Lighthouse desktop no domínio `https://0web.com.br`, configuração oficial `.lighthouserc.cjs`, duas execuções por URL. Dez candidaturas medidas entre 07:29 e 07:41 UTC; Carecas/JKL entre 07:46 e 07:48 UTC.

Limites mantidos: performance ≥90%, SEO/a11y ≥95%, LCP ≤2500 ms, CLS ≤0,1 e TBT ≤200 ms. BP/FCP/bytes/imagens continuam com os níveis existentes; avisos não viram erros novos.

- 24 execuções: **18 failed / 6 passed** no avaliador individual do painel; decisões administrativas permanecem vazias.
- Matriz conservadora por rota: **11 rotas com alguma reprovação / 1 sem reprovação** (Dlara).
- Asserts oficiais: lote A falha Angel Mix, Centro Mega e Embalar; lote B falha Mania, Dom Diego, Paulo e Maresia. Lote C (Carecas/JKL) retorna exit 0. O LHCI usa sua agregação oficial de score, por isso Carecas 81/90 e JKL 93/88 podem passar o assert agregado; **isso não apaga suas execuções individuais reprovadas**.
- CSV: `LIGHTHOUSE_PUBLIC_MATRIX_2026-11-24.csv`. Scores máximos e mínimos explicitados; nenhuma promessa de score ≥90 universal.
- `lhci_runs`: importação idempotente pela origem/URL/horário de medição, sem `commit_sha` atribuído quando o SHA servido não foi comprovado. Logs registram `measured_at`, origem e transporte manual. Não criar notas/interações CRM a partir de score Lighthouse.
- `public/audit/latest.json`: 12 rotas recém-medidas e 33 rotas históricas identificadas por data. `lighthouse.json`: 24 medições atuais + 59 anteriores. Snapshots antigos e raw anterior em `public/audit/archive/`; o histórico original permanece intacto.
- Achados antigos nas rotas não reavaliadas não representam reprovação nova. Contagens combinadas não equivalem a auditoria global atual ou PASS de SEO técnico completo.

## Histórico real, fixtures e testes

O trigger `leads_after_change()` já foi corrigido no banco real sob autorização mínima anterior. Mantidos SECURITY DEFINER, search_path restrito, execução restrita e políticas de leitura/escrita direta. Não reaplicar migração nem inventar eventos passados.

O candidato `crm_add_history_atomic` permanece fora da aplicação: requer migração específica e homologação, distinta da autorização do trigger. Notas e `last_interaction` continuam no caminho existente, não declarar atomização concluída.

Preload do DOM substituía transporte nativo e causava interferência nos testes de rede. `tests/setup-dom.ts` mantém DOM para testes de UI, mas restaura transporte/abort nativos. Validação:

- RLS isolamento, tabelas sensíveis e user_ref: **6 PASS / 0 FAIL**; atualização autorizada produz histórico único e escrita/leitura direta permanecem negadas.
- Suíte inteira final, incluindo dois novos testes sintéticos de transporte: **1225 PASS / 0 FAIL** em 220 arquivos. Não equiparar a runner remoto ou execução com Bun 1.4.0 (sandbox: 1.4.4).
- Testes de política/relatório/transporte focados: **21 PASS / 0 FAIL**.
- Validação final no navegador: painel autenticado com 45 rotas e 24 notas (18 failed/6 passed), gráfico de performance visível, zero pageerror. Sete rotas públicas (Home, Serviços, Site Express, Checkout, Centro Mega, Carecas e JKL) em 1440 e 390px: HTTP 200, sem overflow ou pageerror; Centro Mega fotografada nos dois tamanhos. Brand/boundaries/meta/diff e harness build OK.
- Fixtures antigas previamente limpas continuam ausentes. Nenhum lead encerrado, cliente, agente, ledger ou dado de deduplicação alterado nesta frente.

## CI, agentes e impedimentos

Consulta GitHub pela conexão Henrique's GitHub API (1):

- `42011df6`: build, hydration, testes/tipos/validadores e JSON-LD PASS; gate visual em andamento na consulta; Lighthouse skipped por escopo. Não inferir homologação completa.
- `4949e96b`: build/hydration/estáticos PASS, gates visual/Lighthouse cancelados por execução posterior. Cancelado não é PASS.
- Último RLS remoto `58e5f5ee`: FAIL de preflight `BLOCKED_MISSING_SECRET`, sem testes. A credencial de serviço é inacessível ao proprietário no Lovable Cloud; não pedir chave impossível, fabricar segredo ou desligar preflight. Método seguro alternativo requer provisionamento/revisão próprios.
- #548 continua aberta/Draft e não integrada; update-branch de #548/#530 teve 403 por política OAuth App da organização. Nenhuma troca de token/ator ou outra conexão usada para contornar a negativa; nenhuma conta ou integração presumida como liberada.
- Pessoas: `support_agents` vazio; aguardar nomes/contas na pergunta aberta antes de convite/ativação/papel. IA/Codex: identificar e resolver autorização da organização para a integração já existente; 401 anônimo em MCP não justifica abrir endpoint.
- Webhook LHCI: chave/configuração de ingestão ausentes, solicitação anterior não concluída; workflow atual não possui envio ao webhook. Importar medições manualmente não homologa ingestão automática. Não ativar endpoint sem assinatura ou inventar configuração.
- Segurança: achados previamente ignorados pelo usuário preservados; não declarar scanner atualizado/limpo com base apenas em resultado antigo.

## Sem alterações nesta entrega

Nenhuma nova migração, concessão de papel/permissão, configuração, secret, DNS, integração de PR ou segunda publicação. Zona institucional, conteúdo/mídia/identidade dos clientes e agentes preservados. A solicitação de publicar/liberar está **parcialmente atendida**, com impedimentos acima; este relatório não autoriza bypass dos gates.