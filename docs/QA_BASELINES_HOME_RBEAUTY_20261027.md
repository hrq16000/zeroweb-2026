# 0WEB · correção seletiva das referências visuais (27/10/2026)

Objetivo: manter o gate de **2% de diferença máxima** relevante para a interface atual, sem aprovar automaticamente 34 diferenças históricas.

## Evidência inspecionada (apenas desktop)

Amostra publicada pelo gate da PR #459: GitHub Actions run [40469885227](https://github.com/hrq16000/zeroweb-2026/actions/runs/40469885227), artifact **portfolio-gates-evidence** id **12718921665**, `seo-reports/visual/`.

| Captura (1280×900) | SHA-256 baseline antigo | SHA-256 captura inspecionada | Inspeção |
| --- | --- | --- | --- |
| `home-desktop.png` | `ee1ea1eac04b9615bf96a2944c078fcaf7912c3b603a524508552b4fb61077c2` | `e38dc00648e17bfe20e381417530df4e36c80c2f854a002180631f1cd15ead06` | **Base antiga** tinha hero `Sua empresa merece mais que apenas um site`, notebook e números `+500`, `+20`, `95%`. **Atual** apresenta hero `Sua presença digital precisa levar o cliente ao próximo passo` e jornada em três passos. Não restaurar indicadores sem prova |
| `r_beauty-desktop.png` | `7f3cd92a044058e1c4e5e23f98ff60a96829738e0f2105fc4525fcc0130e98c5` | `18b82bac0fc0f7d0d3d3a792ff6f1f8105267f636901222fa94b1668c996491b` | **Base antiga** só registrou aviso de inauguração e fundo vazio. **Atual** inclui hero, capa de cílios e CTA de agendamento; base antiga estava incompleta |

Os dois pares de imagens foram inspecionados lado a lado. O diff que motivou a triagem foi maior que o limite porque **as referências eram de estados anteriores ao layout atual**, sem relação com a mudança do Instagram em PR #460.

A PR #459 da qual vêm as capturas altera favicon e carregamento sob clique do Instagram do Empório, não altera a home nem o layout do R Beauty. Isso não substitui confirmação posterior em produção e não autoriza atualizar outras capturas.

## Restrições desta micro-rodada

- Atualizar apenas estas **duas imagens desktop** após verificar bytes SHA-256 antigos e novos. Arquivos para tablet/mobile continuam **inalterados** até inspeção.
- **Não** alterar `scripts/playwright-visual-regression.mjs`, limites de 2%, Lighthouse >=0,90, testes de funis, redirects, WhatsApp, CTA ou SEO.
- **Não** afirmar 34 regressões resolvidas por estas duas capturas. Outras 32 diferenças devem ser avaliadas individualmente.
- Não realizar merge automático. A PR específica deve passar revisão e os gates aplicáveis.
- O workflow de importação é temporário e deve ser removido do commit resultante pela própria execução.
