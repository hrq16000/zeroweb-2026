# PORTFOLIO FINALIZATION & CLEANUP STANDARD

Status: **normativo** para encerramento de frentes de `/portfolio/:slug` e manutenção correlata.

Objetivo: garantir que uma frente só seja considerada encerrada quando estiver realmente concluída e que a limpeza de Git/Vercel só aconteça depois, sem apagar evidência, rollback útil ou trabalho ainda ativo.

## 1. Regra de encerramento

Uma frente só pode ser marcada como `FINALIZED` quando todos os critérios aplicáveis estiverem satisfeitos:

- branch final integrada em `main`;
- PR final mergeada;
- `build-validate = success`;
- `E2E · Hidratação = success`;
- `Lighthouse CI = success` quando aplicável;
- `portfolio-gates = success`;
- Vercel com deployment `READY`, target `production`, para o SHA atual de `main`;
- Lovable sincronizado no mesmo SHA de `main`;
- rota publicada respondendo sem erro;
- zero erro runtime específico da rota na janela de validação;
- funil/WhatsApp do cliente preservados;
- nenhum blocker editorial ou técnico aberto no manifesto/ledger;
- quando houver Instagram público ativo, `PORTFOLIO_SOCIAL_LATEST_SIX_STANDARD.md` satisfeito;
- quando houver loja/catálogo, mídia/produtos e demais blockers de commerce resolvidos.

Se qualquer item acima estiver pendente, o estado correto é `NOT_FINALIZED`.

## 2. Regra de limpeza

**Nunca limpar antes de finalizar.**

A limpeza só começa depois de `FINALIZED`.

### 2.1 GitHub

Pode remover/encerrar somente o que for comprovadamente obsoleto:

- PR superseded/duplicada já substituída por PR mergeada;
- branch cuja PR foi mergeada/fechada e cujos commits úteis já existem em `main`;
- branch diagnóstica sem commits únicos necessários;
- branch temporária de CI, preview, reconciliação ou correção já consolidada;
- branch antiga da mesma frente explicitamente substituída.

Preservar:

- `main`;
- tags/releases;
- branch com PR aberta ainda relevante;
- branch com commits únicos não presentes em `main`;
- branch usada por rollout ativo, hotfix em andamento ou investigação não encerrada;
- evidência documental necessária para auditoria.

Antes de apagar branch, comparar com `main` e confirmar que não há commit útil exclusivo.

### 2.2 Vercel

Pode remover apenas deployments comprovadamente obsoletos:

- previews de branches já mergeadas/fechadas;
- previews cancelados/erro de branches superseded;
- previews antigos da mesma frente sem função de rollback;
- deployments de SHAs intermediários já substituídos.

Preservar:

- deployment production `READY` atual;
- alias de produção;
- ao menos um deployment production anterior conhecido como estável para rollback imediato;
- deployment ainda usado como evidência de regressão/QA;
- qualquer deployment ligado a investigação ativa.

Nunca apagar por quantidade ou idade apenas.

## 3. Ordem obrigatória

```text
VALIDATE
→ CONFIRM FINALIZED
→ INVENTORY GIT/Vercel
→ CLASSIFY KEEP / DELETE
→ CLOSE SUPERSEDED PRs
→ DELETE OBSOLETE BRANCHES
→ DELETE OBSOLETE PREVIEWS
→ REVALIDATE main + production
→ RECORD CLEANUP
```

## 4. Inventário antes da limpeza

Registrar no fechamento:

```text
main_sha
production_deployment_id
lovable_sha
open_prs
branches_reviewed
deployments_reviewed
keep[]
delete[]
blocked_deletion[]
cleanup_completed_at
```

Toda exclusão deve ser justificável pela comparação com `main`.

## 5. Limitações de ferramenta

Se o ambiente conectado não oferecer ação de exclusão para branch ou deployment:

- não fingir que foi apagado;
- executar o que for suportado, como fechar PR superseded;
- registrar exatamente o que continua aguardando remoção manual;
- não usar workaround inseguro nem ferramenta genérica sem binding explícito ao recurso correto.

## 6. Centro Mega — condição específica atual

A frente Centro Mega não deve ser considerada `FINALIZED` enquanto o gate social obrigatório estiver em `SOCIAL_LATEST_6_INCOMPLETE`.

Estado registrado em 22/09/2026:

- 5 permalinks oficiais do Instagram resolvidos;
- 5 mídias reais versionadas;
- ordem cronológica validada;
- todos os gates técnicos da última rodada aprovados;
- production `READY`;
- Lovable sincronizado;
- runtime da rota sem erro na janela de validação;
- falta localizar o 6º permalink oficial verificável.

Enquanto faltar esse item:

- não apagar branches/previews desta frente;
- não fechar como 100% concluído;
- manter a limpeza em espera.

## 7. Fechamento

Quando o último blocker for removido:

1. reexecutar validação completa;
2. confirmar `FINALIZED`;
3. executar a limpeza Git/Vercel segundo este documento;
4. revalidar produção;
5. registrar o inventário final e o que foi removido;
6. só então declarar a frente encerrada.
