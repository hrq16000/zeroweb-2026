# Skill registry — 0WEB

Status: `ACTIVE` · `CONDITIONAL` · `REFERENCE` · `QUARANTINED` · `DEPRECATED` ·
`UNAVAILABLE_UPSTREAM`

Última revisão: 2026-08-27.

## Locais (fonte de verdade)

| Name | Path | Status | Category | Triggers | Source | License | Security review |
|---|---|---|---|---|---|---|---|
| `0web-skill-router` | `.agents/skills/0web-skill-router` | ACTIVE | orquestração | qualquer tarefa não trivial | autoral 0WEB | interna | N/A (autoral, sem scripts) |
| `0web-design-system` | `.agents/skills/0web-design-system` | ACTIVE | design/UI | nova página, redesign, componente | autoral 0WEB (destila `frontend-design`, `ui-craft`) | interna | N/A |
| `0web-ui-quality-gates` | `.agents/skills/0web-ui-quality-gates` | ACTIVE | QA/a11y/perf | antes de concluir UI | autoral 0WEB | interna | N/A |
| Apple HIG design review | `.design-rules/` | REFERENCE | acessibilidade/interação | revisão de UI, mobile, modais, motion | Apple HIG (adaptado) | uso como referência textual | sem scripts executáveis |

Nenhuma skill local executa scripts, rede ou lê segredos.

## Externas avaliadas

| Skill / repo | Status | Decisão |
|---|---|---|
| `anthropics/skills → frontend-design` | REFERENCE | Princípios destilados em `0web-design-system`; sem cópia de arquivos. |
| `educlopez/ui-craft` | REFERENCE | Passes de tokens/craft/a11y/motion refletidos em `0web-design-system` e `0web-ui-quality-gates`. |
| `vercel-labs/agent-skills` (web-design-guidelines, react-best-practices, composition-patterns) | CONDITIONAL | Regras aplicadas nas seções de componente/performance; instalação integral não necessária hoje. |
| `dickwu/apple-design-skill` | REFERENCE | Já coberto por `.design-rules/` local. |
| `DonkeyKing01/tasteful-ui-skill`, `sugarforever/open-design-skill` | CONDITIONAL | ~90% de sobreposição com `0web-design-system`; adotar só se surgir necessidade de exploração estética formal. |
| `uxuiprinciples/agent-skills` | CONDITIONAL | Critérios de auditoria (CRITICAL/HIGH/MEDIUM/LOW) incorporados aos quality gates. |
| `JacobLinCool/ux-discovery-interviewer-skill` | CONDITIONAL | Usar apenas quando o problema de produto não estiver definido. |
| `sergekostenchuk/ui-ux-agent-skill-system` | CONDITIONAL | Amplo e orientado a MCP/adaptadores; não adicionar dependências agora. |
| Figma (`Figma_AI_Bridge`, `agent-ready`, `Figma-Context-MCP-Skill`) | CONDITIONAL | Depende do MCP local do Figma Desktop, ausente neste ambiente. |
| `K-Dense-AI/scientific-agent-skills → skills/ui-ux-design` | UNAVAILABLE_UPSTREAM | Caminho não localizado; não instalar referência inexistente. |
| ZIPs recebidos (`seo-content-writer`, `landing-page-scaffold`, `whatsapp-integration`, `ad-creative`, `design-system-builder`, `kimi-find-skills`) | QUARANTINED | Não auditados linha a linha; não executar. |

## Regra de instalação

Nenhuma skill externa foi baixada ou executada nesta rodada. Qualquer
instalação futura exige o checklist de `SECURITY.md` e registro de commit SHA.
