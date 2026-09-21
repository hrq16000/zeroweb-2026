# Catharine Lima Studio — fechamento canônico de publicação

Data: 2026-09-20  
Slug / client_key: `catharine-lima-studio`  
Fonte operacional de verdade: `origin/main`

## Estado confirmado

Auditoria de fechamento realizada contra `main` em `dbe0babd053b01e7499b27ada947d82aca09134a`.

O projeto já está incorporado à linha principal por uma implementação posterior e mais completa. A branch histórica `feat/catharine-lima-studio-publish-20260920` **não deve ser mesclada**: no momento desta auditoria ela estava divergida, **6 commits à frente e 19 atrás de `main`**, com merge-base `dd2c13c75bdf24993d0d76c5eb83d02e3f097e69`.

A implementação canônica é a existente em `main`, não a branch histórica.

## Identidade e fatos publicados

- Nome: Catharine Lima Studio.
- Local: Rua Victor Alves Ferreira, 211 · São José dos Pinhais — PR.
- Serviços documentados: Alongamento, Alongamento Molde F1, Banho em gel, Pé em gel, Volume brasileiro e Progressiva.
- Condição comercial descrita de forma segura: condições especiais para clientes novas, sem inventar preço, prazo ou disponibilidade.
- Facebook de referência: https://www.facebook.com/caah.lima.39.
- WhatsApp canônico do projeto: `5541998884095`.

A procedência dos fatos permanece em `docs/portfolio/enrichment/catharine-lima-studio.json` e no cadastro do cliente.

## Conversão e isolamento

O projeto usa `contactMode = funnelOnly`, `funnelType = agendamento` e `clientKey = catharine-lima-studio`.

O destino é resolvido pelo registro específico do cliente. Não existe permissão para fallback entre clientes nem para o WhatsApp institucional da 0WEB em fluxo identificado por `client_key`.

O lead é persistido antes da resolução terminal do canal. O redirecionamento final usa o contato do próprio projeto.

## Mídia e provenance

O Facebook foi identificado, porém não ficou acessível à ingestão técnica na rodada de pesquisa. Por isso:

- nenhuma foto ou vídeo do Facebook foi copiado;
- nenhum asset de terceiro foi apresentado como mídia real do Studio;
- `hero.svg` é `GENERATED_CONTEXTUAL_MEDIA`;
- `capa-card.svg` é mídia de capa editorial;
- `social.jpg` é mídia de preview/OG;
- `logo.svg` é identidade autoral para a presença digital e não é registrada como logotipo oficial anterior fornecido pelo negócio.

O media plan canônico está em `docs/portfolio/media-plans/catharine-lima-studio.json`.

## Skills, padrões e governança

A governança global de skills já é canônica em:

- `AGENTS.md`;
- `docs/AGENT_SKILLS_GOVERNANCE.md`;
- `docs/PORTFOLIO_PREMIUM_EXPERIENCE_ACCEPTANCE_STANDARD.md`;
- `docs/PORTFOLIO_PROJECT_LIFECYCLE.md`;
- `docs/0WEB_EXECUTION_CONTRACT.md`.

Esta rodada é de **fechamento documental**, sem redesign e sem instalação de skill externa. A revisão aplicada cobre lifecycle, provenance, isolamento do funil, política de mídia, qualidade editorial e publicação protegida.

## Decisão sobre o lifecycle manifest

A Catharine já está publicada pela cadeia compatível anterior ao enrollment obrigatório do manifesto gerenciado. **Não foi adicionada retroativamente a `src/config/portfolio-project-manifests.json` nesta rodada documental.**

Motivo: adicionar um projeto publicado ao manifesto ativa gates adicionais de Blueprint/Composition Registry, quality matrix e readiness. Fazer isso sem uma migração estrutural deliberada criaria um estado artificial de `published + NOT_READY` e poderia introduzir regressão de build.

Portanto:

1. a publicação atual permanece válida sob os gates existentes;
2. o estado documental está fechado por brief + enrichment + media plan + configurações canônicas + este relatório;
3. eventual migração para o lifecycle gerenciado deve ser uma tarefa técnica separada, com quality matrix, registry e QA próprios — nunca uma alteração documental disfarçada.

## Regra aprendida para o pipeline

Antes de qualquer merge/publicação de um novo `/portfolio/:slug`, o agente deve reler `origin/main` e comparar a branch candidata.

Se o mesmo slug/client_key já tiver sido incorporado por outra execução, ou se a branch estiver divergida/stale, a branch antiga deve ser reconciliada a partir do `main` atual ou abandonada. Nunca fazer merge cego de branch obsoleta.

A regra foi incorporada ao `docs/0WEB_EXECUTION_CONTRACT.md`.

## Encerramento

A Catharine Lima Studio deve ser tratada daqui em diante pela implementação canônica em `main`. A branch histórica é somente evidência de trabalho anterior e não é fonte operacional.
