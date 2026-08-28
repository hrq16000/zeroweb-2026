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
| Rodapé da hospedagem | `PortfolioStandardFooter` (opt-in) ou rodapé do cliente | uma única faixa de rodapé; clientes com footer próprio não recebem faixa duplicada |
| Voltar ao topo | `PortfolioBackToTop` | aparece após scroll, 44px+, respeita scroll suave e fica acima do CTA flutuante |
| Pop-up de captação 0WEB | `PortfolioUpsellPopup` | ativo, instância única, silenciado só com `?0web_preview=1` |
| SEO | contrato de `head()` da rota | canonical + imagem social obrigatórios |
| Tracking | `page_type: portfolio_client` | eventos sempre identificados por `clientKey` |

O contato flutuante **nunca** expõe telefone, e-mail ou link de mensageiro no
bundle. Ele abre o funil (`PortfolioCTAQuiz`) e o destinatário é resolvido no
servidor por `clientKey`.

Clientes com rodapé editorial próprio (o padrão atual dos portfolios) devem
manter `includePlatformFooter={false}` na casca. O rodapé de plataforma só é
ativado para uma rota que não possua footer próprio; isso evita duplicação de
crédito, ano e marca ao final da página.

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

## 2.1 Mensagem global do CTA/funil

Todo CTA de cliente deve usar `PortfolioCTAQuiz`/`FunnelCTAButton` com
`clientKey` explícito. A mensagem gerada pelo mecanismo compartilhado começa
com a identificação da página e preserva a URL completa:

```text
Olá, [cliente]! Vim pela página da *[nome do cliente]* e quero conversar sobre um atendimento.
🔗 URL completa: [URL inteira do /portfolio/<slug>]
✨ A página é linda e encontrei exatamente o que procurava!
```

Quando disponível, o servidor acrescenta cidade, região e bairro estimados por
IP. O bairro só é incluído se o provedor retornar `district`, `suburb` ou
`neighborhood`; nenhum valor é inventado. IP, user-agent e identificadores
internos nunca aparecem na mensagem. Se a consulta falhar, o atendimento segue
sem localização.

O destinatário é resolvido no servidor por `clientKey`; números de telefone,
e-mails operacionais e links diretos de mensageiro não podem entrar no bundle.

## 2.2 Contrato de conteúdo e descoberta

Cada cliente deve ter nome, categoria, cidade/estado, resumo, tags, imagem de
capa, ícone, imagem social, prova social e SEO próprios. A raiz `/portfolio`
funciona como catálogo escalável: filtros persistidos na URL, busca textual,
ordenação, carregamento incremental e priorização silenciosa por cidade estimada
quando houver correspondência confiável. A ausência de geo mantém a ordem
neutra.

O sitemap e o `ItemList` são derivados do catálogo canônico, portanto cada novo
slug publicado deve ser registrado em `portfolio-catalog.json` e
`portfolio-site-registry.ts` antes do deploy.

## 2.3 Performance e mídia

Imagens devem usar o diretório exclusivo do cliente e formatos compactados
(WebP/AVIF quando disponíveis), com `loading="lazy"`, `decoding="async"` e
`sizes` responsivo para conteúdo abaixo da dobra. O primeiro conteúdo visual
recebe prioridade limitada; não se deve bloquear a página inteira aguardando
geo, redes sociais ou popups. Animações devem respeitar `prefers-reduced-motion`.

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
