# Projetos Managed do portfólio (novo projeto sem código)

Este documento descreve o caminho oficial para criar um projeto de
`/portfolio/:slug` **sem** editar JSON, criar componente React, adicionar
import, mexer no roteador ou no sitemap.

```
/app/portfolio → "Novo projeto" → /app/portfolio/novo
   ↓ dados + identidade + assets + SEO + serviços + galeria
PortfolioManagedView (renderer premium orientado a dados)
   ↓ conformidade obrigatória
READY → PUBLISHED → /portfolio/:slug público
   ↓
ARCHIVED (sai do catálogo e do sitemap, histórico preservado)
```

## Fontes de verdade

| Camada | Responsável |
|---|---|
| Projetos legados (68 existentes) | registries versionados + overrides em `portfolio_client_settings` |
| Projetos Managed (novos) | apenas `portfolio_client_settings` com `project_kind = 'managed'` |
| Renderização Managed | `PortfolioManagedView` + preset (`editorial`, `impact`, `minimal`, `immersive`, `service_focused`) |
| Casca comercial da 0WEB | `PortfolioStandardShell` (compartilhamento, funil, pop-up de captação) |

Não existe segunda fonte de verdade: o registry continua canônico para o que é
estrutural nos projetos legados; o Managed nasce inteiro no banco.

## Ciclo de vida

`draft → ready → published → archived` (e `archived → draft` para retomar).

- `ready` e `published` são **bloqueados** enquanto houver blocker de
  conformidade: nome, logo, hero, capa de catálogo, imagem social, SEO,
  no mínimo 3 serviços, CTA e copy de divulgação.
- Só `published` é indexável (`index,follow`); rascunho, pronto e arquivado
  respondem `noindex,nofollow` e não expõem conteúdo público.
- Publicar/arquivar sincroniza sitemap e fila de indexação.
- Toda transição e todo campo alterado ficam no histórico auditável.

## Segurança e privacidade

- Contato operacional (telefone, e-mail, `wa.me`, `tel:`) é descartado na
  sanitização: o destinatário continua resolvido no servidor pelo funil.
- HTML, `javascript:` e assets externos são rejeitados; caminhos aceitos:
  `/images/...` e `/api/public/portfolio-asset/...`.
- Escrita apenas autenticada, com concorrência otimista por `content_version`.

## Prova automatizada

```bash
bun run e2e:managed-lifecycle            # contra http://localhost:8080
bun run e2e:managed-lifecycle https://0web.com.br
```

A fixture cria um projeto pelo mesmo caminho do painel e valida, em cada
estágio: rota pública, catálogo, `sitemap-portfolio.xml`, título/descrição,
canonical, imagem social versionada, JSON-LD, serviços, galeria, ausência de
contato, casca/pop-up da 0WEB, atribuição de origem do lead e, no fim,
arquivamento com histórico preservado. Ao terminar, remove a fixture.
