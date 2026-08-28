# Auditoria de performance — ciclo 1

Data: 2026-08-28 · Escopo: `/portfolio/<slug>` em produção

## Evidências

- As 8 rotas de clientes responderam HTTP 200.
- HTML SSR medido entre 30 KB e 88 KB por rota; isso indica que a navegação inicial está funcional, mas o custo visual é dominado por assets e hidratação.
- Encontrados assets raster acima de 1,9 MB (ícones Beauty, capa Paraíso e hero RM Fretes), além de uma capa PNG duplicada do Paraíso.
- O gate `validate:portfolio-performance` exige `loading`/`decoding` explícitos e no máximo um candidato LCP por cliente; o gate passou no ciclo anterior.
- Componentes de overlays carregam apenas comportamento, com overlays suprimidos exclusivamente por `0web_preview=1`; não usar `preview=1`.

## Correções já aplicadas

- Casca compartilhada com CTA/funil em camada superior, rodapé sem duplicação e botão universal de retorno ao topo.
- CTAs e funis continuam com fallback navegável sem JavaScript e contatos resolvidos server-side.

## Ciclo 2 — parametrizado e em execução

1. Gerar variantes WebP/AVIF dos assets acima de 300 KB, preservando originais e substituindo apenas referências públicas. Budgets e formatos vivem em `src/config/portfolio-performance.json`.
2. Medir LCP/CLS/INP em 360/393/768/1440 px por slug e registrar budgets.
3. Auditar waterfall de hidratação e adiar telemetria/overlays não críticos após interação ou idle.
4. Exercitar CTA superior, CTA flutuante, social proof, popup 0WEB e voltar ao topo em cada cliente.
5. Rodar Lighthouse, E2E de funis, a11y e regressão visual antes da publicação.

## Meta

Reduzir o payload visual inicial sem degradar SEO, acessibilidade, identidade do cliente ou estabilidade do LCP.

### Execução desta rodada

Variantes WebP foram geradas com Sharp e servidas nas referências públicas de
D.Y.Z Promo, Paraíso do Hot Dog e RM Fretes. Exemplos: capa do Paraíso caiu de
2,02 MB para 153 KB; hero da RM Fretes de 1,99 MB para 102 KB; menu do Paraíso
de 440 KB para 61 KB. Os originais permanecem preservados para rollback.

## Parâmetros operacionais

Os limites de LCP, CLS, INP, bytes por imagem e política de adiamento de
telemetria/overlays são centralizados no JSON de performance. Novos clientes
herdam esses valores; exceções precisam ser justificadas por slug e validadas
no gate de performance.
