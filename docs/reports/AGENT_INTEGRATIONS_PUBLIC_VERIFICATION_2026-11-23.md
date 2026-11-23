# Verificação pública — MCP e recomendações IA

## Publicação
- Publicação solicitada para `https://0web.com.br` a partir do commit `232270d8` em 23/11/2026. O push documental #538 chegou depois (`e41b0a2f`); não foi reproduzido nem revertido.
- Evidência runtime: a rota nova de consentimento e o endpoint `/mcp` passaram a servir a integração desta versão. O host não expõe SHA de deployment, portanto SHA exato servido não comprovado.

## MCP — PASS em produção
- Login restaurado somente na origem 0web.com.br para a conta do solicitante; cliente OAuth de verificação registrado por DCR, consentimento real aprovado e código trocado por token delegado (sem token em arquivo de evidência).
- `tools/list`: exclusivamente `list_products`, `get_product`.
- `list_products(limit=3)`: três produtos reais, preços positivos; apenas slug/name/category/description/price/price_period/path.
- `get_product`: consulta real aprovada para produto retornado.
- Sem ferramentas/retornos de leads, destino WhatsApp, compra, envio ou publicação.
- Sem autorização: 401. Token de sessão comum, sem delegação OAuth: 401.
- Cancelamento de conexão: `access_denied`. Já autorizado: retorno imediato. authorization_id ausente: erro legível. Visitante: login preservando consent URL.
- WebMCP nativo ausente neste Chromium; normal UI preservada, registro browser-native não verificado.

## Recomendações IA — PASS em produção
- `/servicos/seo`, `/servicos/loja-virtual`, `/servicos/automacao-com-ia`: HTTP 200; resposta real da função IA 200 com slugs de catálogo; títulos renderizados mudaram após resposta em todos os três casos.
- Capturas do carrossel visualmente verificadas. Algumas imagens permaneceram vazias na captura; não houve edição de mídia nesta rodada, fora do escopo de publicação.

## Jotform — BLOCKED
- Autorização do usuário: Agropet FILT e Cantinho da Tia Mari, ambos; preferência permanente pelo funil WhatsApp individual como padrão.
- Código corrente contém apenas provider inbox no registro de formulários; não contém `mirrorToSupabase`, endpoint `jotform-mirror` nem contrato `JOTFORM_MIRROR`.
- Não solicitados segredos, não criados formulários-espelho/leads, não modificados formulários independentes nem banco.
- Menor próximo passo: integrar pelo Git/Codex e publicar o contrato/endpoint autorizado anteriormente; então solicitar os dois segredos compartilhados e configurar webhook por cliente, seguido da validação sintética.

## Segurança e escopo
- Scan executado antes da publicação; nenhum achado ativo retornado (achados ignorados pelo usuário não alterados). Nenhuma auditoria profunda iniciada.
- Nenhuma mudança em DNS, banco, preços, WhatsApp ou portfolios nesta rodada. Somente evidência/roadmap e preferência persistente registrados depois da publicação.