---
name: 0web-skill-discovery
description: >
  Descoberta dinâmica, ranking, revisão de segurança e composição de skills para o 0WEB.
  Use antes de qualquer tarefa substancial (nova página, redesign, landing page, design system,
  refactor relevante, QA estratégico) para decidir quais skills usar — inclusive skills externas
  ainda não instaladas. Também use quando o usuário pedir para "procurar skills", avaliar uma
  skill de marketplace (Skills.sh, SkillsMP, MCPMarket, ClaudeMarketplaces, skills.ws) ou quando
  o catálogo local não cobrir bem a tarefa.
---

# 0WEB — Skill Discovery & Dynamic Orchestration

O catálogo instalado é ponto de partida, não limite. O ecossistema de skills evolui;
pesquise novas skills sempre que o catálogo local não cobrir adequadamente a tarefa.

## Pipeline obrigatório

```text
TASK → CLASSIFY → FIND SKILLS → RANK CANDIDATES → SECURITY REVIEW →
SELECT SKILL STACK → EXECUTE → CROSS-REVIEW → TEST → VISUAL QA → SHIP
```

## 1. Fontes de descoberta

Ordem de prioridade:

1. `vercel-labs/skills/find-skills` (mecanismo de busca)
2. Skills.sh
3. repositório oficial do fornecedor (Anthropic, Vercel, framework)
4. GitHub original da skill

Skills.sh, SkillsMP, MCPMarket, ClaudeMarketplaces e skills.ws são **triagem**.
Nunca aprovam sozinhos: localize e revise o repositório/fonte original antes de
qualquer aprovação definitiva. Sem fonte original localizável → no máximo
`REFERENCE_ONLY` ou `QUARANTINED`.

## 2. Ranking de candidatas

Pontue cada candidata por:

- relevância específica para a tarefa
- fonte oficial
- qualidade do SKILL.md (instruções acionáveis, não marketing)
- segurança (scripts, rede, segredos, dependências)
- manutenção recente
- compatibilidade com a stack (React 19 · TanStack Start · Tailwind v4 · Bun)
- capacidade de preservar a arquitetura existente
- evidência de uso real
- sobreposição com skills já instaladas
- custo de contexto e complexidade

Downloads, estrelas e popularidade são **sinais**, nunca prova de segurança ou qualidade.

## 3. Revisão de segurança

Aplicar `docs/skills/SECURITY.md`. Bloqueiam adoção: scripts executáveis não lidos
linha a linha, acesso a segredos/env, chamadas de rede, instalação de dependências,
instruções para contornar gates do projeto, ZIPs não auditados.

## 4. Modelo de autoridade

Nenhuma skill isolada controla o trabalho. Para UI/UX, componha especialistas:

| Camada | Candidatas |
|---|---|
| Direção criativa | `frontend-design` (Anthropic), Taste Skill, Tasteful UI, UI Craft |
| Redesign de projeto existente | `redesign-existing-projects`, `design-taste-frontend` |
| Landing page / CRO | `landing-page-builder`, `landing-page-guide-v2` (referência), `landing-page-design`, skills de copy/CRO |
| Design system | `design-system-builder`, UI Craft, Open Design, Figma context |
| Qualidade de interação | Apple HIG (`.design-rules/`), UX/UI Principles, Web Design Guidelines |
| Engenharia | React Best Practices, Composition Patterns, skills do framework |
| QA | acessibilidade, Playwright/browser, performance, verificação visual |

## 5. Política de landing page

Landing-page skills são especialistas, **não templates obrigatórios**.
Nenhuma skill pode impor automaticamente número fixo de seções (ex.: "11 seções"),
pricing, testimonials, reviews, ratings, FAQ, social proof, countdown, urgência,
estatísticas ou componentes específicos.

Primeiro analise intenção, produto, tráfego, usuário e conversão; depois escolha as
seções que realmente ajudam aquela página.

Nunca fabricar reviews, ratings, clientes, estatísticas, logos, depoimentos,
certificações, escassez, urgência ou resultados comerciais.
**Evidence-first sempre vence conversion template.**

## 6. Anti-redundância

```text
COMPARE → EXTRACT DIFFERENCES → SELECT PRIMARY → SELECT COMPLEMENTARY → REJECT REDUNDANT
```

Três skills que repetem "Hero + Features + Testimonials + FAQ + CTA" são redundantes.
Conversion architecture, direção visual, acessibilidade e implementação React são
complementares — essas podem coexistir.

## 7. Cross-review

Em interfaces estratégicas, quem constrói não é a única perspectiva de validação:

- direção criativa cria a direção
- especialista landing/CRO verifica conversão
- Apple HIG / UX verifica experiência
- acessibilidade verifica inclusão
- React/performance verifica implementação
- Taste / UI Craft executa crítica visual
- QA no navegador verifica o produto **realmente renderizado**

## 8. Status de skill

Toda skill avaliada recebe um status registrado em `docs/skills/REGISTRY.md`:

`APPROVED_GLOBAL` · `APPROVED_CONDITIONAL` · `REFERENCE_ONLY` ·
`SECURITY_REVIEW_REQUIRED` · `REDUNDANT` · `QUARANTINED` · `REJECTED`

## 9. Registro

Registre em `docs/skills/CHANGELOG.md` (ou no PR): tarefa, candidatas encontradas,
fonte original revisada, ranking, status atribuído, stack selecionado,
skills rejeitadas e motivo, validação executada com saída real.

## Precedência em conflito

requisitos do projeto → segurança → acessibilidade → integridade de dados →
regras de negócio → design system → arquitetura existente → limites do framework →
performance → UX → skills especializadas → referências estéticas.
