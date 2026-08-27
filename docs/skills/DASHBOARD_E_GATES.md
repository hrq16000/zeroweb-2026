# Dashboard de skills, evidência e gates do pop-up

## 1. Dashboard de governança — `/painel-skills`

Mostra cada skill avaliada com status, categoria, fonte, repositório original
revisado, justificativa, restrições e resultado da revisão de segurança.
Fonte de dados tipada: `src/data/skill-registry.ts` (espelha
`docs/skills/REGISTRY.md`). Statuses possíveis:

`APPROVED_GLOBAL` · `APPROVED_CONDITIONAL` · `REFERENCE_ONLY` ·
`SECURITY_REVIEW_REQUIRED` · `REDUNDANT` · `QUARANTINED` · `REJECTED` ·
`UNAVAILABLE_UPSTREAM`

A mesma tela simula o pipeline por classe de tarefa e imprime o relatório
evidence-first (aceitos, rejeitados e motivos de cada etapa).

## 2. Pipeline evidence-first

`src/lib/skill-pipeline.ts` implementa, como funções puras:

```text
FIND → RANK → SECURITY REVIEW → SELECT STACK → CROSS-REVIEW → TEST → VISUAL QA → SHIP
```

Regras codificadas e cobertas por teste (`src/lib/skill-pipeline.test.ts`):

- skill sem repositório original revisado nunca entra no stack;
- `SECURITY_REVIEW_REQUIRED`, `QUARANTINED`, `REJECTED`, `REDUNDANT` e
  `UNAVAILABLE_UPSTREAM` são bloqueados;
- anti-redundância limita skills por categoria;
- cross-review exige perspectiva de design e de QA;
- gate sem evidência textual bloqueia o SHIP;
- evidência sem fonte auditável é rejeitada.

Relatório por tarefa:

```bash
bun run skills:evidence -- --id minha-tarefa --title "Minha tarefa" \
  --classes landing-page --gate "bun test=pass:183 pass / 0 fail"
```

Saída em `docs/skills/evidence/<id>.md`.

## 3. Guardrails de landing

`src/lib/landing-guardrails.ts` bloqueia automaticamente Reviews, Ratings,
Logos, Urgência e Escassez sem evidência com fonte auditável, consentimento
(quando aplicável) e período documentado. Nenhuma seção é imposta: o plano
vazio permanece vazio.

## 4. Privacidade — dois gates

| Momento | Script | Alcance |
|---|---|---|
| pré-build | `bun run scan:source-privacy` | fonte `src/**`, com arquivo e linha |
| pós-build | `bun run validate:client-privacy` | chunks públicos, com source map |

O scanner de fonte roda no `prebuild` e bloqueia `wa.me`, `api.whatsapp.com`,
`tel:` e `mailto:` em código que chega ao cliente. Relatórios em
`seo-reports/source-privacy-report.json|.md`.

## 5. Métricas do pop-up — `/painel-popup-metricas`

- séries de 1 minuto, 5 minutos e 1 hora por slug (`getPopupTimeSeries`);
- impressões, cliques, CTR e conversão dos últimos 7 dias;
- status dos alertas por slug, com limites configuráveis.

## 6. Administração — `/painel-popup`

Além de textos, funil, bullets e agenda, o painel controla sem deploy:

- **taxa de amostragem (0–1)**: reduz temporariamente a geração de eventos em
  staging;
- **modo simulação**: marca os eventos como simulados;
- **canais de aviso**: webhook do Slack, e-mail e webhook genérico.

Tudo com RBAC (`is_admin_or_super`) e auditoria em `popup_config_audit`.

## 7. E2E e CI

- `bun run test:e2e:portfolio-popup` — pop-up exatamente uma vez por site,
  em visita normal e com `?preview=1`, silenciado em `?0web_preview=1`,
  com screenshot para verificação visual. Aceita `E2E_BASE_URL` para rodar
  contra preview ou produção.
- Workflow `.github/workflows/portfolio-gates.yml` executa testes, scanner de
  fonte, validadores e build.

## 8. Regras permanentes

Nenhuma métrica, avaliação, logo, prêmio ou prova social pode ser publicada
sem fonte auditável. Portfólios permanecem isolados e sem contato operacional
no bundle.
