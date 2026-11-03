# 0WEB — Operação em lotes de novos portfólios (300+ empresas)

**Estado:** ferramenta de pré-voo v1; leitura, diagnóstico e confirmação de prontidão antes de geração/publicação. Não faz deploy e não considera um portfólio "concluído" sem E2E real.

## Motivo da mudança

A frente Dona Garimpeira expôs uma falha de processo: validações independentes só eram descobertas após várias tentativas de build/publish (catálogo, SEO universal, share-copy, seed do painel, mídia, situação do formulário, destino WhatsApp). É um problema de *orquestração*, não de falta de um gerador: `scaffold:portfolio`, R1/R2, funil compartilhado e gates já existem.

**Regra permanente:** repetir infraestrutura e verificações, nunca copiar as identidades e composições visuais. Não descartar dados reais, não inventar fotos, depoimentos, horários, contatos ou preços.

## 1. Receber e classificar sem iniciar 300 builds

Entrada: JSON com até 1.000 slugs ou registros `{ "name": "...", "location": "..." }`. Para empresas sem slug, o pré-voo calcula um candidato a partir do nome; isso NÃO cria página nem confirma que a entidade pesquisada é correta.

Exemplo de arquivo `/tmp/empresas.json`:

```json
[
  { "name": "Loja Exemplo", "location": "São José dos Pinhais, PR" },
  "dona-garimpeira-brecho"
]
```

Comandos (na raiz do Git):

```bash
bun run preflight:portfolio -- --slug dona-garimpeira-brecho
bun run preflight:portfolio -- --input /tmp/empresas.json --json
bun run preflight:portfolio -- --all --strict
bun run test:preflight:portfolio
```

No primeiro comando, `bun run` encaminha as opções para o script Node. Pode-se executar diretamente com `node scripts/portfolio-batch-preflight.mjs`.

Estados: `NOT_STARTED` (a entidade ainda não entrou no catálogo), `DRAFT_PENDING` (incompleto ou deliberadamente fora da vitrine), `BLOCKED_PUBLISHED` (publicado no catálogo com falhas), `CANDIDATE_FOR_FULL_GATES` (pré-voo sem bloqueios; **não** significa aprovado para produção). A ferramenta não imprime os números operacionais dos clientes.

O relatório mostra, em **uma única execução**, pendências de cadastro, clientKey, rota, composição autoral, copy canônica, contexto do funil, destino versionado, admin seed e media plan. `--all` opera sobre todos os registros em lote, e `--strict` reprova bloqueios de publicação. Projetos legados congelados não recebem retroativamente bloqueios novos por falta de fotos.

### Preparar até 25 scaffolds em draft por rodada

Sem criar nem modificar arquivos:

```bash
bun run scaffold:portfolio:batch -- --input /tmp/empresas.json --offset 0 --limit 10
```

Depois de revisar a lista, para realmente criar os scaffolds (sempre `draft`, sem publicar nem usar créditos Lovable):

```bash
node scripts/scaffold-portfolio-batch.mjs --input /tmp/empresas.json --offset 0 --limit 10 --execute
node scripts/portfolio-batch-preflight.mjs --input /tmp/empresas.json --json
```

Repita por blocos de até 25, avançando `--offset`. O comando valida toda a fila antes de escrever: recusa nome/localidade vazios, slugs duplicados e tipos de funil inválidos. Empresas já registradas são preservadas sem reprocessamento. A localização fornecida é registrada no creative brief como **intake ainda não verificado**; o processo R1 continua obrigatório.

**Não confundir batch scaffold com publicação:** o gerador cria apenas workbench e documentos pendentes. Cada página ainda precisa composição visual original, mídia legítima, SEO e funil validados. O pré-voo mostra pendências em conjunto; não dispensa o pipeline editorial.

## 2. Ciclo com duas rodadas técnicas por lote

**R1 — preparação, sem publish:** pesquisar R1 (nome + localização + identidade correta), registrar fontes, briefs e media plan; criar scaffolds em draft em lotes pequenos. Os 300 prospectos podem ser classificados em conjunto, mas páginas autorais e fotos reais não podem ser inventadas. Autorizar apenas dados confirmados, contato por `clientKey` e perguntas de intenção do próprio cliente. Rodar pré-voo para localizar todos os campos pendentes, corrigir e agregar mudanças em uma PR do lote. O `src/config/portfolio-admin-seed.json` é derivado: nunca editá-lo manualmente.

**R2 — testes/publicação por lote:** executar gates reais do repositório, build e QA visual/móvel dos novos sites; testar cada funil individual em ambiente controlado com lead persistido antes de token/WhatsApp e sem desvio de destinatário. Publicar com GitHub primeiro e fazer UMA publicação Lovable do lote quando necessário (sem prompts de geração ou Max Mode). Verificar a URL no domínio `0web.com.br`, SSR, canonical, robots, sitemap, imagem, CTA, WhatsApp e ausência de regressão. Ficar com prova de produção e commit; nunca declarar pronto porque a home abriu.

**Comandos adicionais:**

```bash
# Agregar erros comuns de validação, sem interromper no primeiro
node scripts/portfolio-batch-preflight.mjs --all --check-global

# Quando o admin seed estiver desatualizado: gerar SOMENTE o derivado
node scripts/portfolio-batch-preflight.mjs --slug nova-empresa --fix-derived
git diff -- src/config/portfolio-admin-seed.json

# Gates existentes (executar quando a PR do lote estiver pronta)
bun run validate:portfolio-scaffold
bun run check:portfolio-project-readiness
bun run build
```

É responsabilidade do operador inspecionar o diff dos artefatos derivados antes de commitar. `--fix-derived` não marca projetos como publicados nem altera DNS.

## 3. Regras de escala

- Separar **pesquisa de 300 nomes** de **publicação de 300 sites completos**. O segundo depende de fatos confiáveis, design original, mídia licenciada e testes reais de 300 funis, portanto não há promessa automática de 1 hora para todo o lote.
- Separar `draft`/prévia, `published`/vitrine, `indexable`/rota e **versão efetivamente servida pela hospedagem**. Esses estados não são intercambiáveis. O pré-voo avisa quando um draft continua acessível por URL.
- Não reabrir auditorias do legado a cada novo negócio: preservar o baseline congelado e validar o diff + os novos sites. Rodar controles globais uma vez por lote.
- Reusar pesquisa/brief já verificados, nunca reconsultar os mesmos provedores sem necessidade. Manter conteúdo, fontes, fotos e perfis de cada entidade separados.
- Sem fotos oficiais? Relatar `REAL_MEDIA_PENDING`, não criar material que pareça foto da loja e não burlar gates. A aplicação não deve perder o trabalho já concluído.
- Mídia pública exige permissão/proveniência e, no caso do Instagram, links reais quando exigidos. Pesquisa bloqueada não equivale a ausência de empresa.
- A aprovação de build/Vercel não prova sozinha a publicação no domínio Lovable; validar diretamente o host canônico após o deploy.

## 4. Critérios de aceite — por projeto

Um novo site só conta como finalizado com: URL 200 no domínio correto; página autoral e mobile; identidade/mídia aprovadas; nome, endereço e horário verdadeiros; Instagram legítimo; title/canonical/indexação/sitemap coerentes; funil do cliente com persistência e destino isolado; QA visual/funcional sem regressão e commit publicado confirmado.

A solução evita **rodadas inúteis e falhas sequenciais**. Ela não substitui a pesquisa e a criação profissional de cada página, nem dispensa o teste do formulário.

**Referências existentes:** `AGENTS.md`, `docs/PORTFOLIO_PROJECT_LIFECYCLE.md`, `.agents/skills/0web-portfolio-autonomous-pipeline/SKILL.md`, `docs/PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md`, `scripts/scaffold-portfolio-client.mjs`.
