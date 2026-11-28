# Lovable → Codex — adendo de 27/11/2026

Complementa `docs/handoff/LOVABLE-TO-CODEX.md` (inspeção de 24/11). Não substitui aquele documento; registra só o que mudou depois dele. Repositório: `hrq16000/zeroweb-2026`.

## 1. Estado do Git nesta data

- `main` no GitHub: `33923879` (#560), conferido em 27/11 às 07:13 UTC.
- A branch `docs/lovable-to-codex-handoff-20261124` foi criada em 26/11 a partir de `14ceb8b5`. Todo o conteúdo dela (documento de transferência, busca global do catálogo, ordenação por datas reais, ordem aleatória) **já está na `main`**: a comparação mostrava 0 commits à frente e 214 atrás.
- Por isso a branch foi avançada até a `main` (avanço simples, sem force push) e recebeu apenas este adendo. A PR de transferência carrega este arquivo; o restante já está integrado.
- PRs abertas nesta data: #561 (home editorial, R3/10) e #559 (inteligência de marketing). A #548, que travava a frente de agentes, foi fechada em 24/11 sem merge.

## 2. O que entrou depois de 24/11 (já na `main`, salvo indicação)

| Frente | Estado | Onde |
|---|---|---|
| Busca global do catálogo, datas reais, ordem aleatória | Na `main` (`14ceb8b5`) | `src/lib/portfolio-search.ts`, `src/lib/portfolio-catalog-sort.ts`, `src/config/portfolio-project-dates.json` |
| Bloqueio de rotinas internas e relatórios para visitantes | Aplicado no banco (migração 0010) | `docs/reports/SECURITY_PUBLISHED_CHECK_2026-11-26.md` |
| Recebimento automático Lighthouse | **Ativo**: 11.509 medições recebidas de GitHub Actions entre 24/11 e 27/11 (10.030 `staging`, 1.479 `dev`) | `src/routes/api/public/hooks/lhci-ingest.ts` |
| Painel Lighthouse com cinco status | Rodada de 27/11 (sincroniza pelo Git da plataforma) | `src/components/site/LhciAdmin.tsx`, `src/lib/lhci-receipt-tracking.ts`, `src/lib/lhci.functions.ts` |
| Central de leads da Dona Garimpeira | Rodada de 27/11 (sincroniza pelo Git da plataforma) | `src/lib/dona-garimpeira-leads*.ts`, `src/components/site/DonaGarimpeiraLeadsAdmin.tsx`, rota `/painel-dona-garimpeira-leads` |

## 3. Painel Lighthouse — como funciona

- Fonte única: tabela `lhci_runs`. Entram por envio assinado (`LHCI_HMAC_SECRET`) do workflow do GitHub; reenvio da mesma medição não duplica; nada é apagado.
- Status exibido (`measurementState`): Aprovado, Reprovado, Em execução, Pendente, Falha na coleta. Medição sem nenhuma nota é sempre falha na coleta, nunca aprovada.
- "Em execução" e "Pendente" só aparecem se o envio trouxer esses estados; hoje o workflow envia somente medições concluídas, então essas duas listas ficam vazias. Não há valor simulado.
- Lacuna conhecida: nenhuma medição automática com ambiente `prod`. As 12 candidaturas de produção continuam com as medições de 24/11 (importação manual autorizada + um envio local assinado).

## 4. Central de leads da Dona Garimpeira — como funciona

- Guarda em `lead_submissions` com `source = 'portfolio:dona-garimpeira-brecho'`; histórico em `lead_history`. Sem tabela nova e sem migração.
- Toda função exige sessão + papel de administrador conferido no servidor; cada leitura e escrita confere que o lead pertence ao brechó.
- Interações usam a gravação conjunta já existente (`crm_add_history_atomic`): lead concluído recusa novas interações até ser reaberto.
- WhatsApp: a mensagem é registrada como preparada e a conversa abre com o telefone do próprio lead. Nada é enviado pelo sistema.
- Duplicidade: o mesmo telefone já cadastrado no brechó abre a ficha existente; a regra geral do banco também ignora o mesmo telefone no mesmo dia.
- **Pendente de decisão do proprietário:** o formulário público da página segue sem gravar no banco (`dona-garimpeira-offline.functions.ts`). Ligar o formulário à central muda o que é guardado dos visitantes e só deve ser feito com autorização.

## 5. Verificações do GitHub na `main` (`33923879`)

- Aprovadas: build, hidratação, JSON-LD de `/servicos`, gate de novos portfólios, Lighthouse CI.
- Reprovada: "Testes, tipos e validadores estáticos". Localmente reproduzi 6 testes reprovados, todos anteriores a esta rodada (capas/inventário, data do Garagem & Girassol, Angel Mix, Infinito Spa, seed do admin). A PR #561 declara corrigir esses seis — não foram corrigidos aqui para não colidir com ela.
- A árvore de rotas gerada estava desatualizada na `main`; a versão regenerada segue nesta rodada.
- Verificação remota de segurança do banco (RLS): não reconsultada nesta rodada.

## 6. Pendências para a próxima rodada

1. Cobrar do proprietário as peças reais da Dona Garimpeira (foto, nome, preço) e a logo — ver `docs/portfolio/PENDENCIA_DONA_GARIMPEIRA_PECAS.md`.
2. Decidir se o formulário do brechó passa a gravar na central.
3. Integrar a #561 e conferir que os seis testes voltam a passar.
4. Medição automática Lighthouse do site em produção (hoje só `staging` e `dev`).
5. Resíduos de segurança registrados no relatório de 26/11 (funções do funil chamadas pelo navegador; relatórios internos legíveis por qualquer usuário logado).

## 7. Regras que continuam valendo

Fluxo PR → `main`; sem force push; sem contato operacional no bundle; sem dados inventados; cada `/portfolio/<slug>` isolado por `clientKey`; zona institucional congelada; Bun 1.4.0 com `bun.lock`.
