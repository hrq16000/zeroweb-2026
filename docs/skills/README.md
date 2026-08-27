# Sistema de skills do 0WEB

Skills são conhecimento especializado reutilizável, versionado no repositório e
descoberto por qualquer agente compatível com `SKILL.md`.

## Fonte de verdade

- **Skills canônicas:** `.agents/skills/<nome>/SKILL.md`
- **Referências Apple HIG:** `.design-rules/` (SKILL.md + `references/hig/`)
- **Governança de adoção:** `docs/AGENT_SKILLS_GOVERNANCE.md`
- **Design docs:** `docs/design/`
- **Roteamento:** [`ORCHESTRATION.md`](./ORCHESTRATION.md)
- **Catálogo:** [`REGISTRY.md`](./REGISTRY.md)
- **Segurança:** [`SECURITY.md`](./SECURITY.md)
- **Histórico:** [`CHANGELOG.md`](./CHANGELOG.md)

Não duplicar o mesmo conteúdo em vários diretórios de agente. Se um agente
exigir outro caminho, gerar espelho a partir de `.agents/skills/`.

## Como usar

1. Classifique a tarefa.
2. Abra `.agents/skills/0web-skill-router/SKILL.md` e monte o skill stack.
3. Implemente preservando arquitetura e identidade existentes.
4. Rode os quality gates de `0web-ui-quality-gates`.
5. Registre o uso (tarefa, skills, achados, validação) no PR ou no CHANGELOG.

## Como adicionar uma skill

Ler `SECURITY.md`, criar `.agents/skills/<nome>/SKILL.md`, registrar em
`REGISTRY.md` com origem, commit, licença e revisão de segurança.
