# Playbook oficial — novo site em `/portfolio/<slug>`

Status: **obrigatório**. Complementa `docs/PORTFOLIO_CLIENT_STANDARD.md`.
Objetivo: nenhum projeto novo deve exigir correção manual de itens que já são
padrão da plataforma.

## 1. Camadas — quem garante o quê

| Camada | Quem garante | Onde |
|---|---|---|
| Pop-up de captação da 0WEB (`PortfolioUpsellPopup`) | **Plataforma (rota)** | `src/routes/portfolio.$slug.tsx` renderiza automaticamente |
| Botão de compartilhamento (`PortfolioShareButton`) | **Plataforma (rota)** | idem |
| SEO base, canonical, JSON-LD, breadcrumbs | Plataforma + dados do cliente | `head()` da rota |
| Roteamento privado de WhatsApp | Plataforma | `/r/whatsapp/$token` + secret por cliente |
| Identidade, textos, imagens, oferta | **Cliente** | componente exclusivo |
| Funil próprio (`funnel-<cliente>`) | **Cliente** | `dynamic_forms` publicado |
| Prova social (`PortfolioSocialProofPopup`) | Cliente (conteúdo) | componente do cliente |
| Crédito de hospedagem (`PortfolioHostCredit`) | Cliente (estilo), obrigatório | rodapé do componente |

O pop-up de captação **não depende mais** do componente do cliente: a rota já o
renderiza. O componente tem guard de instância única, então renderizá-lo também
no site do cliente não duplica nada.

## 2. Regra de overlays (causa da falha histórica)

Overlays da hospedagem só são silenciados com `?0web_preview=1` (ou
`?0web_overlays_off=1`). **Nunca** usar `?preview=1`: ambientes de preview e
ferramentas externas injetam esse parâmetro e o pop-up sumia em visitas reais.
`scripts/validate-portfolio-boundaries.mjs` falha se o parâmetro genérico voltar.

## 3. Checklist de lançamento (executar na ordem)

1. Registrar o cliente em `src/config/portfolio-clients.json`
   (`clientKey`, `slug`, `siteName`, `routeFile`, `componentFile`, `assetsDir`,
   `ctaMode`, `socialProofRequired`, `hostCaptureRequired`).
2. Adicionar a chave em `src/lib/portfolio-client-keys.ts`.
3. Registrar em `src/lib/portfolio-site-registry.ts` (sitemap + SEO + card).
4. Criar diretório exclusivo de imagens `public/images/<slug>/` (sem herdar de outro cliente).
5. Criar o componente exclusivo em `src/components/site/<Cliente>Page.tsx`:
   sem `Header`/`Footer` da 0WEB, com `PortfolioHostCredit` no rodapé e
   `PortfolioSocialProofPopup` com conteúdo do próprio cliente.
6. Ligar o branch do slug em `src/routes/portfolio.$slug.tsx` e completar
   `head()` (title, description, canonical, `og:site_name`, `og:image`, icon, JSON-LD).
7. Criar migration do funil próprio `funnel-<slug>` publicado em
   `dynamic_forms` + `dynamic_form_questions` (modelo:
   `supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql`).
8. Usar `FunnelCTAButton` com `clientKey="<clientKey>"`, `companySlug` e
   `formSlug="funnel-<slug>"`. Proibido cair em funil universal da 0WEB.
9. Cadastrar o secret privado `"<CLIENTE>_WHATSAPP_NUMBER"` no servidor.
   Nenhum telefone, `wa.me` ou e-mail pode existir no bundle público.
10. Adicionar o card do cliente na grade `/portfolio`.

## 4. Portões automáticos (tudo precisa passar)

```bash
bun run validate:portfolio-boundaries   # isolamento, popup, crédito, contatos
bun run validate:portfolio-meta         # SEO/metadados por cliente
bun test
bun run build                           # inclui validate-client-privacy no postbuild
node scripts/playwright-portfolio-funnels.mjs   # CTA → lead → token → WhatsApp
```

Critério de pronto: os cinco comandos passam, o funil do cliente conclui sem
“funil indisponível”, o redirect responde 302 e nenhum contato aparece no HTML
ou no JS público.

## 5. Revisão visual obrigatória

Seguir `docs/AGENT_SKILLS_GOVERNANCE.md`: direção de `frontend-design`, revisão
Apple (acessibilidade + mobile) e passada de `ui-craft`. Validar imagens reais,
estados de carregamento/erro, `prefers-reduced-motion` e viewport 393×852.

## 6. Automação, testes e observabilidade

Gerador de projeto (cria componente, pasta de imagens, migration do funil e
registros obrigatórios):

```bash
bun run scaffold:portfolio -- --slug <slug> --name "Nome do Cliente"
bun run scaffold:portfolio -- --slug <slug> --name "Nome" --dry-run
```

Portões automáticos adicionais:

```bash
bun run validate:portfolio-scaffold   # conformidade estrutural de todo /portfolio (roda no prebuild)
bun run test:e2e:portfolio-popup      # pop-up único, 1x por sessão, ?preview=1 não silencia
bun run test:visual                   # regressão visual (mobile + desktop); --update regrava baselines
bun run audit:a11y                    # axe-core em todas as rotas de portfólio
```

Budgets de performance/SEO/acessibilidade rodam no Lighthouse CI
(`.lighthouserc.cjs`), incluindo `/portfolio` e um site de cliente; scores
abaixo do budget quebram o PR.

Observabilidade: `/painel-portfolio` (restrito) mostra impressões, cliques,
CTR, descartes e conversões do pop-up por projeto, com alertas de queda.
Documentação viva do design system: `/design-system`.
