# Auditoria geral 0WEB — 22/09/2026

Status: **auditoria incremental baseada no estado atual de `main` e produção**.

Objetivo: separar dívida histórica já resolvida de gaps atuais reproduzíveis e implementar melhorias por micro-rodadas, sem reabrir auditorias encerradas.

## Baseline auditado

- repositório: `hrq16000/zeroweb-2026`;
- runtime Vercel: sem erros/warnings nas últimas 24h no início desta auditoria;
- arquitetura: Home, `/servicos` e `/portfolio` permanecem separadas;
- `/home2` e `/home3`: laboratórios `noindex,nofollow`, não tratados como problema público;
- Measurement Truth V2: encerrado e validado em produção; não reabrir;
- imagens públicas: ~99 MB no estado atual, contra ~176 MB na auditoria antiga;
- arquivos >1 MB: 1 único outlier atual (`maximos-cabeleireiros/logo.png`, 1,55 MB);
- `/servicos`: storefront já possui preço, carrinho e seleção de plano em produtos multivariantes;
- páginas individuais de serviço: `ServicePurchasePanel` + `ProductActionGate` já generalizados;
- portfolio: gates indicam 95 projetos isolados e parametrizados no baseline atual.

## Melhorias executadas nesta auditoria

### 1. Home → preço no serviço destacado

Problema atual:
- a home dizia “Serviços para contratar”, mas os cards de destaque ocultavam o preço;
- a query já lia `price`, porém descartava o valor antes do componente.

Correção:
- `NavService` passa a preservar `price` e `price_period`;
- home mostra “A partir de R$ …” somente quando existe preço numérico válido;
- mesma fonte de verdade da loja; zero hardcode comercial;
- teste dedicado adicionado.

PR: #143.

### 2. /servicos → remover placeholders SVG gerados

Problema reproduzido em produção:
- 3 `data:image/svg+xml` apareciam na vitrine;
- produtos identificados: Criação de Sites, Landing Pages e Loja Virtual;
- isso contrariava `SERVICOS_SHOP_STANDARD.md`.

Correção:
- Criação de Sites → asset editorial próprio 0WEB;
- Landing Pages → asset editorial próprio 0WEB;
- Loja Virtual → asset editorial próprio 0WEB;
- `listServicesStorefront` não usa mais `generatedServiceCover()`;
- produto futuro sem capa real/canônica/recovered não entra na vitrine;
- teste de contrato adicionado.

PR: #144.

### 3. Maximos Cabeleireiros → logo pesado

Problema atual:
- único asset público >1 MB: logo PNG de 1,55 MB;
- landing carregava a mesma imagem duas vezes.

Correção em validação:
- mesma arte ingerida em CDN;
- derivado WebP 1024×1024 = ~264 KB (~84% menor);
- landing passa a usar o derivado;
- registry canônico continua local porque `portfolio-logos` exige `/images/`;
- PNG original não é apagado antes do cleanup final.

PR: #145.

## Achados técnicos atuais

### Depreciação TanStack server functions

Build atual medido:
- 487 warnings `createServerFn().inputValidator() is deprecated`;
- 79 arquivos distintos;
- não corrigir em um único replace global;
- executar por domínios, iniciando em `/servicos`.

Top emissores:
- dynamic-funnel-admin.functions.ts: 24;
- marketplace.functions.ts: 22;
- clientarea.functions.ts: 22;
- partners.functions.ts: 16;
- users-admin.functions.ts: 16;
- gsc.functions.ts: 16;
- ecosystem.functions.ts: 16;
- visitors.functions.ts: 14.

### GitHub Actions / Node

Logs atuais registram warning de Node 20 em actions:
- `actions/checkout@v4`;
- `actions/upload-artifact@v4`;
- `actions/setup-node@v4` também aparece em workflows.

Requer micro-rodada separada com versões atuais verificadas antes da troca.

### Vercel

Durante a auditoria, novos commits voltaram a receber:
`Vercel: failure → build-rate-limit`.

Interpretação:
- não é regressão do portal;
- Git/CI/Lovable podem avançar antes do deployment;
- produção só é declarada convergente quando o SHA de `main` estiver `READY production`.

## Não reabrir sem nova evidência

- Measurement Truth V2;
- antiga Onda A de imagens (queda de ~176 MB para ~99 MB e só 1 asset >1 MB);
- aplicação geral do `ProductActionGate` nas páginas de produto;
- excesso histórico de CTAs da home anterior;
- placeholders antigos já substituídos pela governança de capas, exceto os 3 casos reproduzidos nesta auditoria e corrigidos na PR #144.

## Próximas micro-rodadas recomendadas

1. fechar/publicar PR #145;
2. corrigir `inputValidator → validator` no domínio `services`;
3. atualizar actions Node 20 após validar versões estáveis atuais;
4. auditar dados comerciais visíveis de `/servicos` por produção (preço, imagem, CTA, carrinho, recorrência);
5. classificar PRs/branches antigas apenas no cleanup `FINALIZED`, nunca durante frente ativa;
6. continuar Centro Mega até `SOCIAL_LATEST_6_COMPLETE`.

## Regra operacional

Cada melhoria segue:

```text
ACHADO REPRODUZIDO
→ MICRO-CHANGE
→ TESTE
→ PR
→ GATES
→ MERGE
→ PRODUÇÃO QUANDO VERCEL LIBERAR
→ REVALIDAÇÃO
```

Não acumular redesign amplo sem métrica, não reiniciar auditoria encerrada e não limpar branch/deployment antes de `PORTFOLIO_FINALIZATION_CLEANUP_STANDARD.md`.
