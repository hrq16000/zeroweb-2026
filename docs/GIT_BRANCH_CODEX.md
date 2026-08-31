# Guia — branch `codex/` no GitHub

Processo replicável para criar, publicar e comparar a branch de trabalho
`codex/*` do repositório `hrq16000/zeroweb-2026`.

> Este passo é executado **fora do Lovable** (terminal local ou GitHub UI):
> o ambiente do agente não tem credenciais de push para o remoto.

## 1. Criar a branch a partir da main atualizada

```bash
git checkout main
git pull --ff-only origin main
git checkout -b codex/<assunto-curto>   # ex.: codex/portal-admin-screens
```

Regra de nome: `codex/` + escopo em kebab-case. Uma branch por issue.

## 2. Validar antes de publicar

```bash
bun install --frozen-lockfile
bun test
bun run build
bun run validate:portfolio-boundaries
```

Não reduzir gates para passar: corrigir a causa ou registrar a limitação
com evidência na issue.

## 3. Publicar no remoto

```bash
git push -u origin codex/<assunto-curto>
```

A branch fica disponível para deploy de preview e para comparação com o
portal publicado:

- Comparação: `https://github.com/hrq16000/zeroweb-2026/compare/main...codex/<assunto-curto>`
- Pull request mencionando a issue correspondente (nunca commitar direto na `main`).

## 4. Comparar com o portal publicado

| Ambiente | URL |
|---|---|
| Produção | https://0web.com.br |
| Preview do projeto | https://project--18313c7b-223e-4a34-8548-d2c238b6caf1-dev.lovable.app |

Rodar o Lighthouse nas duas URLs e anexar o JSON ao PR:

```bash
bunx @lhci/cli autorun --config=.lighthouserc.cjs
```

## 5. Depois do merge

```bash
git checkout main && git pull --ff-only origin main
git branch -d codex/<assunto-curto>
git push origin --delete codex/<assunto-curto>
```

Registrar o uso de skills e a validação em `docs/skills/CHANGELOG.md` ou no PR.
