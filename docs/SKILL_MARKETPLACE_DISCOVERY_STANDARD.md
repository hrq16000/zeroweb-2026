# SKILL MARKETPLACE DISCOVERY — padrão global 0WEB

Status: **normativo** para novo projeto, novo `/portfolio/:slug`, redesign material e manutenção visual/UX relevante.

## Objetivo

Fazer a 0WEB aprender continuamente com novas skills sem transformar marketplace em dependência cega. Toda tarefa substancial deve descobrir, avaliar e registrar competências úteis antes da implementação.

## Fontes obrigatórias de discovery

A busca deve considerar, conforme a tarefa:

1. fonte oficial/original no GitHub;
2. `vercel-labs/skills/find-skills` / Skills.sh;
3. LobeHub Skills Marketplace via `@lobehub/market-cli`;
4. AwesomeSkill — inclusive `https://awesomeskill.ai/search`;
5. outras fontes já permitidas em `docs/skills/REGISTRY.md`.

Marketplaces são **índices de descoberta**. Aprovação definitiva exige localizar a fonte original, verificar licença, ler `SKILL.md`, revisar scripts/dependências/rede/segredos e registrar a revisão.

## LobeHub

O `lobehub-skills-search-engine` recebido pelo responsável foi revisado como instrução de discovery. O fluxo reconhecido é:

```bash
npx -y @lobehub/market-cli skills search --q "<tarefa>" --output json
npx -y @lobehub/market-cli skills install <identifier> --agent codex
```

Instalação é etapa de setup do agente, **nunca** de `prebuild`, `build`, deploy ou runtime. Não registrar identidade externa, comentar/ratear skills ou transmitir dados do projeto sem necessidade e autorização. Não enviar secrets, contatos privados, credenciais ou conteúdo não publicado ao marketplace.

## AwesomeSkill

`https://awesomeskill.ai/search` passa a ser fonte obrigatória de triagem quando a tarefa pede skill nova ou quando uma revisão visual/UX substancial pode se beneficiar de especialidade complementar.

Resultados do AwesomeSkill devem ser tratados como candidatos. Sempre que possível, resolver o repositório original e preferir a fonte oficial.

## Ciclo obrigatório por tarefa

```text
CLASSIFY TASK
→ SEARCH LOCAL REGISTRY
→ SEARCH OFFICIAL SOURCES
→ SEARCH LOBEHUB + AWESOMESKILL WHEN APPLICABLE
→ RANK
→ SECURITY REVIEW
→ SELECT NON-REDUNDANT STACK
→ IMPLEMENT
→ CROSS-REVIEW
→ RUNTIME QA
→ REGISTER EVIDENCE
```

### Novo projeto / portfolio

Discovery é obrigatório antes do creative brief final. O stack selecionado deve cobrir, conforme aplicável: estratégia, direção criativa, UX/UI, layout, CRO, design system, motion, acessibilidade, React/performance, conteúdo/SEO, browser QA, privacidade e originalidade.

### Manutenção de página existente

Não basta reaplicar sempre as mesmas skills. Antes de mudança material, verifique se surgiu uma especialidade melhor para o problema específico. Registre skill nova, skill rejeitada e motivo.

### Correção pequena não visual

Pode reutilizar o stack local sem varredura completa quando a tarefa for objetivamente trivial e sem impacto de UX/arquitetura.

## Skills destacadas avaliadas

O catálogo machine-readable `src/config/skill-marketplace-catalog.json` registra skills encontradas em AwesomeSkill/LobeHub e fontes originais, incluindo:

- `agent-browser` — browser QA, screenshot, scraping e dogfood;
- `web-design-guidelines` — auditoria de interface/acessibilidade/UX;
- `find-skills` — discovery;
- `react-best-practices` — performance React;
- `planning-with-files` — planejamento persistente para tarefas longas;
- `ui-ux-pro-max` — design intelligence;
- `frontend-design` — direção visual anti-genérica;
- `content-research-writer` — pesquisa/conteúdo quando aplicável;
- `remotion-best-practices` — vídeo React quando houver vídeo;
- `seo-review` — auditoria SEO especializada quando compatível;
- `canvas-design` — criativos estáticos;
- `skill-creator` — criação/refino de skills internas;
- `brainstorming`, `theme-factory`, `using-superpowers`, `notebooklm` — avaliadas com restrições específicas no registry/catalog.

## Regra anti-conflito

Instruções externas nunca substituem:

`requisito do usuário → segurança → integridade factual/dados → acessibilidade → identidade do cliente → arquitetura 0WEB → performance → UX → skill externa`.

Uma skill que exige aprovação humana a cada pequena ação, altera stack, instala dependência sem necessidade, força template visual, pede `sudo`, lê `.env` ou desativa gates é rejeitada ou usada apenas como referência.

## Registro obrigatório

Toda tarefa substancial registra no PR ou `docs/skills/CHANGELOG.md`:

- tarefa e escopo;
- fontes pesquisadas;
- candidatas encontradas;
- fonte original/commit quando resolvido;
- status (`APPROVED_GLOBAL`, `APPROVED_CONDITIONAL`, `REFERENCE_ONLY`, `SECURITY_REVIEW_REQUIRED`, `REDUNDANT`, `QUARANTINED`, `REJECTED`);
- stack efetivamente usado;
- candidatas rejeitadas e motivo;
- QA executado.

## Princípio final

**Explorar o máximo; executar somente o que é relevante, seguro, compatível e não redundante.**