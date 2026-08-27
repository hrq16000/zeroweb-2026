# Padrões globais dos projetos `/portfolio/:slug`

Status: **obrigatório** · Escopo: todas as rotas `/portfolio/<slug>`
Complementa `docs/PORTFOLIO_CLIENT_STANDARD.md` (isolamento e identidade do cliente).

## 1. O que é padrão global

Todo projeto — atual ou futuro — recebe automaticamente, pela casca
`src/components/portfolio/PortfolioStandardShell.tsx`:

| Elemento | Componente | Padrão |
|---|---|---|
| Botão de compartilhar | `PortfolioShareButton` | ativo, `top-right`, variante `light` |
| Botão flutuante de contato | `PortfolioContactFloating` | ativo, `bottom-right`, abre o **modal do funil do próprio cliente** |
| Rodapé padrão | `PortfolioStandardFooter` | ativo, com nome do cliente, ano e `PortfolioHostCredit` |
| Pop-up de captação 0WEB | `PortfolioUpsellPopup` | ativo, instância única, silenciado só com `?0web_preview=1` |
| SEO | contrato de `head()` da rota | canonical + imagem social obrigatórios |
| Tracking | `page_type: portfolio_client` | eventos sempre identificados por `clientKey` |

O contato flutuante **nunca** expõe telefone, e-mail ou link de mensageiro no
bundle. Ele abre o funil (`PortfolioCTAQuiz`) e o destinatário é resolvido no
servidor por `clientKey`.

## 2. Configuração central

Arquivo: `src/config/portfolio-global-config.json`

```jsonc
{
  "defaults": { "shareButton": {...}, "contactFloating": {...}, "footer": {...},
                "hostCapturePopup": {...}, "seo": {...}, "tracking": {...} },
  "overrides": { "<clientKey>": { "contactFloating": { "label": "..." } } }
}
```

Resolução tipada: `resolvePortfolioStandards(slugOrKey)` em
`src/lib/portfolio-global-config.ts` (aceita `slug` ou `clientKey`).

## 3. Overrides controlados

- Overrides são **parciais**: qualquer campo não informado cai no padrão global.
- Permitido sobrescrever: rótulo, posição, tema, variante, nome do destinatário,
  modo do funil.
- **Proibido desativar**: `footer` e `hostCapturePopup`. A casca força
  `hostCapturePopup.enabled = true` e a auditoria falha se um override tentar
  desligar rodapé ou captação.
- Um projeto sem entrada em `overrides` continua 100% conforme.

## 4. Como adicionar um novo projeto

1. `bun run scaffold:portfolio` e registre o cliente em
   `src/config/portfolio-clients.json` (`clientKey` imutável).
2. Renderize a página do cliente dentro de `PortfolioStandardShell` — a rota
   compartilhada `/portfolio/$slug` já faz isso; rotas dedicadas devem envolver
   o componente do cliente.
3. Adicione overrides visuais em `portfolio-global-config.json` se necessário.
4. Rode as validações da seção 5.

## 5. Como testar e validar

```bash
bun test src/lib/portfolio-global-config.test.ts
bun run audit:portfolio-standards      # auditoria + relatório JSON
bun run validate:portfolio-scaffold
bun run validate:portfolio-boundaries
bun run test:e2e:portfolio-popup       # pop-up único por projeto
bun run audit:a11y                     # acessibilidade (axe-core)
bun run test:visual                    # regressão visual mobile/desktop
```

`audit:portfolio-standards` grava `seo-reports/portfolio-standards-report.json`
com o status por projeto — use esse relatório na descrição do PR de migração.

## 6. Migração de projetos fora do padrão

O script de auditoria aponta rotas sem `PortfolioStandardShell`. A correção é
sempre a mesma e não remove funcionalidade existente: envolver o componente do
cliente na casca e mover ajustes visuais para `overrides`. Rodapés e CTAs
próprios do cliente permanecem — o rodapé padrão é uma faixa fina de
hospedagem, complementar.
