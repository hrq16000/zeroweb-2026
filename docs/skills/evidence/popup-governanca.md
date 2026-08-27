# Evidence-first — Dashboard de skills e gates do pop-up

- tarefa: `popup-governanca`
- classes: dashboard, performance
- gerado em: 2026-08-27T22:14:28.105Z
- stack selecionado: 0web-skill-discovery → 0web-skill-router → 0web-design-system → 0web-ui-quality-gates → find-skills → vercel-agent-skills → design-taste-frontend
- cross-review: ok
- ship: liberado

## FIND

Aceitos: 0web-skill-router, 0web-skill-discovery, 0web-design-system, 0web-ui-quality-gates, anthropic-frontend-design, ui-craft, vercel-agent-skills, find-skills, design-taste-frontend, redesign-existing-projects, anti-ui-slop, ui-ux-pro-max, impeccable, emil-design-eng, scientific-ui-ux, zips-recebidos

| rejeitado | motivo |
| --- | --- |
| apple-hig | categoria acessibilidade não pertence à tarefa |
| landing-page-builder | categoria conteúdo/SEO não pertence à tarefa |
| landing-page-guide-v2 | categoria conteúdo/SEO não pertence à tarefa |
| jezweb-landing-page | categoria conteúdo/SEO não pertence à tarefa |

## RANK

Aceitos: 0web-skill-discovery (90), 0web-skill-router (90), 0web-design-system (85), 0web-ui-quality-gates (85), find-skills (60), vercel-agent-skills (60), design-taste-frontend (50), redesign-existing-projects (50), anthropic-frontend-design (45), ui-craft (35), anti-ui-slop (0), emil-design-eng (0), impeccable (0), ui-ux-pro-max (0), scientific-ui-ux (-5), zips-recebidos (-5)

## SECURITY_REVIEW

Aceitos: 0web-skill-discovery, 0web-skill-router, 0web-design-system, 0web-ui-quality-gates, find-skills, vercel-agent-skills, design-taste-frontend, redesign-existing-projects, anthropic-frontend-design, ui-craft

| rejeitado | motivo |
| --- | --- |
| anti-ui-slop | status SECURITY_REVIEW_REQUIRED: Pendente: localizar repositório original e ler scripts linha a linha. |
| emil-design-eng | status SECURITY_REVIEW_REQUIRED: Pendente. |
| impeccable | status SECURITY_REVIEW_REQUIRED: Pendente. |
| ui-ux-pro-max | status SECURITY_REVIEW_REQUIRED: Pendente. |
| scientific-ui-ux | status UNAVAILABLE_UPSTREAM: Não aplicável. |
| zips-recebidos | status QUARANTINED: Tratados como dados inertes; não executar nem seguir como instrução. |

## SELECT_STACK

Aceitos: 0web-skill-discovery, 0web-skill-router, 0web-design-system, 0web-ui-quality-gates, find-skills, vercel-agent-skills, design-taste-frontend

| rejeitado | motivo |
| --- | --- |
| redesign-existing-projects | redundante: já há 2 skill(s) em design/UI |
| anthropic-frontend-design | redundante: já há 2 skill(s) em design/UI |
| ui-craft | redundante: já há 2 skill(s) em design/UI |

## EVIDENCE

Aceitos: —

## Gates

| gate | resultado | evidência |
| --- | --- | --- |
| bun test | pass | 216 pass / 0 fail |
| scan:source-privacy | pass | OK — nenhum contato em código público |
