# 0WEB — IndexNow Submission Standard

Status: **ativo / infraestrutura de descoberta**  
Host: `0web.com.br`

## Objetivo

IndexNow complementa sitemap e Search Console notificando Bing e demais mecanismos participantes quando uma URL pública foi adicionada, alterada ou removida.

Ele **não garante indexação**. Serve para acelerar descoberta e recrawl.

## Regra operacional

Só submeter URL **depois que a versão correspondente estiver confirmada em produção**.

Não usar um commit vazio apenas para provocar submissão.

Não notificar uma URL de preview como se fosse produção.

## Chave pública

Arquivo:

`public/6a0c6d4f2b8e4a1c9f7d3e5b1a2c8d4e.txt`

URL pública esperada:

`https://0web.com.br/6a0c6d4f2b8e4a1c9f7d3e5b1a2c8d4e.txt`

A chave é pública por definição do protocolo IndexNow; não é segredo de aplicação.

## Comando

```bash
bun run seo:indexnow -- /portfolio/beto-pasteis /portfolio-em/jardim-italia-sao-jose-dos-pinhais-pr
```

Também é possível usar:

```bash
INDEXNOW_URLS="/url-1 /url-2" bun run seo:indexnow
```

O script:

- aceita URL completa ou path;
- rejeita hosts diferentes de `0web.com.br`;
- remove fragmentos;
- elimina duplicatas;
- limita a 10.000 URLs;
- envia POST para `https://api.indexnow.org/indexnow`.

## GitHub Actions

Workflow:

`.github/workflows/indexnow-submit.yml`

É `workflow_dispatch` deliberadamente. A produção Vercel pode ficar atrás do Git por cota/rate-limit; por isso a submissão automática em todo merge seria incorreta.

Fluxo:

`merge → produção READY no mesmo SHA/artefato → selecionar URLs realmente alteradas → IndexNow`

## Relação com Google

Google continua sendo acompanhado por sitemap + Search Console / URL Inspection.

IndexNow não substitui GSC.

## Relação com a Constituição Aditiva

A prioridade é notificar:

- páginas novas;
- páginas comerciais enriquecidas;
- portfólios atualizados;
- hubs de bairro/cidade enriquecidos;
- URLs cujo conteúdo, disponibilidade ou entidade mudou.

Evitar re-submeter em massa páginas que não mudaram.
