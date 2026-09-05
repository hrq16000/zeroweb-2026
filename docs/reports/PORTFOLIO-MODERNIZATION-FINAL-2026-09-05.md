# Fechamento do portfólio — 2026-09-05

## 1. Galileu e L&J em produção

- `https://0web.com.br/portfolio/galileu-locacao-brinquedos` → HTTP 200 (User-Agent de navegador; 403 para clientes sem UA, comportamento esperado do edge).
- `https://0web.com.br/portfolio/lj-cleaning` → HTTP 200.
- Title/canonical/OG corretos em ambos; nenhum telefone/WhatsApp no HTML público.
- BLOCKER encontrado: os assets novos (`capa-og.jpg`, `capa-card.jpg`, `vitrine.png`, `cena.png`) respondiam 404 em produção — o domínio ainda servia um deploy anterior. Publicação disparada nesta rodada; revalidar as URLs de imagem após o deploy concluir.

## 2. Capas — revisão individual (fila de 31)

Revisão feita com inspeção visual real (contact sheet), não apenas OCR.

Aprovadas nesta rodada (5):

| Slug | Decisão | Fonte |
|---|---|---|
| artesanatos-darleia-oliveira | REAL_CLIENT_MATERIAL | hero-og.png (enquadramento 16:10, sem corte destrutivo) |
| refrigeracao-maresia | REAL_CLIENT_MATERIAL | hero-og.png (marca + produto, sem telefone) |
| thays-camilla | REAL_CLIENT_MATERIAL | hero-og.png (caneca + azulejo) |
| lucas-arruma-maquina-lavar | AUTHORED_GRAPHIC | vitrine.png (Q4A — registro estava desatualizado) |
| no-brilho-higienizacao | AUTHORED_GRAPHIC | vitrine.png (Q4A — registro estava desatualizado) |

Bloqueadas com motivo explícito (permanecem NEEDS_REVIEW):

- studio-de-cilios — telefone + tabela de preços
- eletro-solucoes-eficazes — telefone
- mp-festas-eventos — telefone/WhatsApp e print de perfil
- confeitaria-sabor-da-realeza — endereço físico + preço promocional
- ecommerce-on — print de perfil pessoal + tabela de preços
- mary-diarista — telefone + tabela de preços
- fernanda-amaral-drywall — chamada de WhatsApp na arte
- renata-beauty — arte promocional com preço/telefone
- eisenfer-tubos-acos — arte promocional; resolução insuficiente para 1600x1000
- espaco-cih-luh — promoção "10% OFF" inseparável da foto no recorte 16:10

Nenhuma capa inventada foi gerada. Estado do registro: 30 APPROVED / 25 NEEDS_REVIEW.

## 3. Medição

Auditoria da infraestrutura existente (`trackEvent` → `analytics_events`, com sessão, visitante, path, referrer e UTMs):

Já cobertos e com volume real: `popup_view`, `popup_dismiss`, `wa_funnel_open`, `wa_funnel_step`, `wa_funnel_complete`, `funnel_open/question_view/answer/complete`, `whatsapp_click`, `whatsapp_redirect_requested`, `portfolio_contact_floating_click`, `portfolio_share_click`, `portfolio_social_proof_view`, `cta_click`.

Única lacuna real: não havia evento de visualização por projeto (denominador do funil). Implementado `portfolio_view` no `PortfolioStandardShell` via `PortfolioView`, deduplicado por sessão + slug.

`NEW_TRACKER_REQUIRED = NO` — nenhum sistema paralelo criado.

## 4. Indicadores

- `check:portfolio-projects`: 68 projetos · 68 COMPLETE · 0 bloqueantes
- `bun test`: 324 pass / 0 fail
- `bun run build`: verde (gates de assets, ícones, quiz, skills, admin seed e privacidade OK)
- `client-privacy`: bundle público limpo (445 chunks, avisos apenas em chunks administrativos)

## 5. Estado

`SYSTEMATIC_PORTFOLIO_MODERNIZATION = CLOSED_PENDING_DEPLOY_VERIFICATION`

Único item aberto: reconferir, após o deploy, que as imagens de Galileu e L&J respondem 200 em produção.
