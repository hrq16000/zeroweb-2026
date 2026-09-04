# Padrão do botão "Copiar divulgação" — `/portfolio/:slug`

Status: **normativo** · Complementa `docs/PORTFOLIO_SKILL_PARAMETRIZATION.md` e
`docs/PORTFOLIO_CLIENT_STANDARD.md`.

## Onde mora a parametrização

Nenhum projeto `/portfolio/xxx` parametriza o botão no próprio componente. A
fonte de verdade é única e compartilhada por todos os projetos, atuais e
futuros:

| Camada | Arquivo | Papel |
|---|---|---|
| Componente do botão | `src/components/site/PortfolioShareButton.tsx` | Copia para clipboard, estado "Divulgação copiada" (2,2s), evento `portfolio_share_click` |
| Montagem automática | `src/components/portfolio/PortfolioStandardShell.tsx` | Renderiza o botão em **todos** os projetos via casca padrão (posição, variante e label vêm de `portfolio-global-config.json`) |
| Defaults visuais | `src/config/portfolio-global-config.json → defaults.shareButton` | `enabled: true`, `position: top-right`, `variant: light`, `label: "Copiar divulgação"` |
| Mensagem copiada | `src/config/portfolio-share-copy.json` (chave = slug) › fallback gerado em `src/lib/portfolio-share.ts` (`buildPortfolioShareMessage`) | Texto de divulgação por projeto |

Um projeto novo herda tudo automaticamente: basta existir no catálogo e ter a
entrada em `portfolio-share-copy.json`. Overrides visuais por cliente são raros
e ficam em `portfolio-global-config.json → overrides.<key>.shareButton`.

## Formato padrão da mensagem

Todas as copys seguem o mesmo template (ver `ag-electrical-services`,
`renata-beauty`, `refrigeracao-maresia`):

```text
<emoji> A/O <Nome> está de site novo!

<Agora ficou ainda mais fácil... — 1 a 2 frases específicas do negócio e da cidade.>

🌐 Confira:
https://0web.com.br/portfolio/<slug>

📲 <CTA de contato/pedido do cliente.>

#<Nome> #<Tag1> #<Tag2> #<Cidade/Serviço> #0WEB
```

Regras obrigatórias:

- URL canônica `https://0web.com.br/portfolio/<slug>` presente na mensagem.
- Mínimo de 120 caracteres (validado).
- A assinatura `#0WEB` é sempre a última hashtag.
- Hashtags sem acentos, em PascalCase (`src/lib/portfolio-share.ts#hashtag`).
- Nunca incluir telefone, `wa.me` ou e-mail na copy.
- Não inventar métricas, avaliações ou resultados sem evidência.

## Comportamento do botão (idêntico em todos os projetos)

1. Clique → copia a mensagem para o clipboard (com fallback para contextos não
   seguros) e registra `portfolio_share_click` com `portfolio_slug`,
   `page_type: portfolio_client`, `method: clipboard`.
2. Estado visual muda para "Divulgação copiada" (ícone de check) por 2,2s e
   retorna ao label original.
3. Botão flutuante `top-right`, variante `light`, `aria-label` com o nome do
   projeto.

Não criar variações desse comportamento em páginas de clientes.

## Como validar

```bash
bun run validate:portfolio-catalog    # copy presente, ≥120 chars, URL canônica
bun test src/lib/portfolio-share.test.ts
bun run validate:portfolio-boundaries
```

## Como adicionar um projeto novo

1. `bun run scaffold:portfolio -- --slug <slug> --name "Nome"`.
2. Adicionar a entrada `<slug>` em `src/config/portfolio-share-copy.json`
   seguindo o template acima.
3. Rodar os validadores. Nenhuma alteração de componente é necessária.

## Correção aplicada — heloa-gas

A copy de `heloa-gas` estava fora do padrão (texto corrido de uma linha, sem
abertura, sem hashtags). Foi substituída pelo template padrão
(`fix: alinhar parametrização do botão copiar divulgação em /portfolio/heloa-gas
ao padrão existente`). O botão em si já era o componente compartilhado via
`PortfolioStandardShell` — nenhum código de página foi alterado.
