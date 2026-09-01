# Automação Search Console e Painel SEO

## Visão geral

```text
Search Console → scripts/gsc-daily-export.mjs → seo-reports/gsc-latest.json → /app/seo
```

O painel nunca chama o Search Console durante a requisição da página: ele lê o
snapshot gerado pela rotina diária. Sem snapshot, o painel mostra estado vazio —
nenhum número é estimado ou inventado.

## Credenciais

A integração usa o **conector Google Search Console da Lovable** (gateway), não uma
service account própria. Duas variáveis são necessárias no ambiente de execução
(CI ou runtime do worker):

| Variável | Origem |
|---|---|
| `LOVABLE_API_KEY` | chave do projeto na Lovable (autentica no gateway) |
| `GOOGLE_SEARCH_CONSOLE_API_KEY` | criada automaticamente ao vincular a conexão do conector ao projeto |

Guarde ambas como *secrets* do repositório/CI. Nunca commite valores nem imprima
essas variáveis em log.

> Se a política interna exigir uma service account do Google em vez do conector,
> ela precisa receber permissão de leitura na propriedade `https://0web.com.br/`
> pelo próprio Search Console (Configurações → Usuários e permissões). Essa
> concessão é feita pelo proprietário da conta Google e não pode ser executada
> pelo agente.

## Execução

```bash
bun run gsc:export                       # últimos 28 dias completos
node scripts/gsc-daily-export.mjs --site https://0web.com.br/ --days 28
```

Saídas:

- `seo-reports/gsc-latest.json` — snapshot consumido pelo painel `/app/seo`
- `seo-reports/gsc-latest.md` — relatório legível (totais, top 50 consultas, top 50 páginas)

O script resolve a propriedade em tempo de execução (`GET /webmasters/v3/sites`),
descarta propriedades não verificadas e falha com mensagem clara quando há mais de
uma correspondência — nunca adivinha o identificador.

## Agendamento diário (GitHub Actions)

```yaml
name: gsc-daily
on:
  schedule:
    - cron: "0 9 * * *"   # 06h BRT
  workflow_dispatch:
jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.4.0
      - run: bun install --frozen-lockfile
      - run: bun run gsc:export
        env:
          LOVABLE_API_KEY: ${{ secrets.LOVABLE_API_KEY }}
          GOOGLE_SEARCH_CONSOLE_API_KEY: ${{ secrets.GOOGLE_SEARCH_CONSOLE_API_KEY }}
      - name: Commit snapshot
        run: |
          git config user.name "0web-bot"
          git config user.email "bot@users.noreply.github.com"
          git add seo-reports/gsc-latest.json seo-reports/gsc-latest.md
          git commit -m "chore(seo): snapshot diário do Search Console" || echo "sem mudanças"
          git push
```

O commit do snapshot é o que faz o painel `/app/seo` refletir os dados no próximo
deploy, já que o worker não tem sistema de arquivos gravável.

## Painel `/app/seo`

Rota protegida (`_authenticated`) e restrita a `admin` / `super_admin` na server
function `getSeoDashboard`.

- **Totais** do período do snapshot.
- **Priorização automática**: consultas com volume relevante e CTR abaixo da
  referência da faixa de posição, ordenadas por impacto potencial.
- **Alertas**: comparação dos últimos 7 dias com os 7 anteriores. Limite de queda
  configurável na tela (padrão 20%); queda acima do dobro do limite vira alerta
  crítico. Piora de 3+ posições na média também gera alerta.
- **Conteúdo do cluster**: title, description e schemas de cada post, com
  apontamentos automáticos (title > 60, description fora de 70–160, ausência de
  FAQ ou de link interno de conversão).

## Manutenção

- Rotacionar `LOVABLE_API_KEY` invalida a automação: atualize o secret no CI.
- Se o script retornar 403, a conta conectada perdeu acesso à propriedade.
- Se retornar "múltiplas propriedades", passe `--site` com o valor exato.
- A edição de title/description dos posts é feita hoje em `src/lib/blog-data.ts`
  (fonte versionada). Edição inline pelo painel exige migrar o conteúdo para o
  banco — pendência registrada, não implementada.
