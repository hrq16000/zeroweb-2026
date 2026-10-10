# Gate automático de publicação de novos portfólios

Complementa PORTFOLIO_NEW_CLIENT_PLAYBOOK.md, PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md e 0WEB_EXECUTION_CONTRACT.md.

## Acionamento sem intervenção manual

O workflow **New Portfolio Publication Gate** avalia toda PR para main e usa o commit base real para identificar:
- slug novo cujo catálogo já declara status **published**;
- transição de status draft/outro para **published**;
- registro de cliente novo para um slug já declarado published.

Nenhuma publicação nova = detector verde sem executar a suíte pesada extra.
Portfólios já publicados seguem submetidos aos gates de regressão existentes.

## Bloqueios obrigatórios de uma nova publicação

Para cada novo published, exigir:
- cadastro e clientKey coerentes; componente exclusivo e contato por funil (funnelOnly);
- título individual e resumo factual útil (80+ caracteres);
- manifesto de ciclo de vida stage=published, contrato individual v4;
- etapa qa e publish completas, visualQa=PASS, evidência real dos gates estruturais;
- resultado READY, sem blockers, no check-portfolio-project-readiness;
- screenshots baseline versionados e revisados para desktop, tablet e mobile.

O detector scripts/new-portfolio-publish-gate.mjs **não cria** capturas, não aprova hashes e não injeta informações não comprovadas.

Se a detecção passar, o CI dispara automaticamente na mesma PR:
- build SSR do candidato;
- Lighthouse **individual**, com limites existentes: performance >=0,90, SEO >=0,95, a11y >=0,95, LCP <=2,5s, CLS <=0,1, TBT <=200ms e demais asserts;
- popup único, funil E2E em dry-run e regressão visual nas três viewports com **limite inalterado de 2%**;
- artefatos para inspeção e revisão.

## Fluxo de criação seguro

1. Criar como **rascunho** com identidade, fonte real, direção autoral e funil individual.
2. Preparar manifesto, pesquisa/evidências, metadata e imagens. Executar validações locais.
3. Gerar e revisar **manualmente** as três baselines da nova página; versioná-las. Nunca usar --update na pipeline de PR.
4. Promover o projeto a published apenas após a evidência e QA estarem completos.
5. Abrir PR: detector e testes específicos rodam automaticamente. Se reprovar, manter PR aberta e corrigir, sem reduzir thresholds.
6. Depois do merge, conferir rota e funil em produção. Indexabilidade técnica não significa indexação efetiva: GSC permanece a fonte para essa confirmação.

**Limite:** E2E_DRY_RUN=1 valida UI e transições sem registrar lead externo; não prova entrega WhatsApp em produção. Isso continua sob contratos/gates próprios.

## Proteção do GitHub

O workflow sinaliza falhas automaticamente. Para **impedir por política de servidor** um merge manual que ignore os resultados, o administrador do GitHub deve exigir o check "Detectar e validar novos portfólios publicados", o QA condicional de novos portfólios quando ativo e os gates atuais na proteção de main.

Sem proteção do branch não há como prometer bloqueio de merge no servidor; a equipe deve obedecer à governança até a regra ser ativada.
