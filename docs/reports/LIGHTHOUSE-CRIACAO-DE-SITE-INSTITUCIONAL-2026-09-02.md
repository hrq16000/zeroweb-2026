# Auditoria Lighthouse — /criacao-de-site-institucional

- URL: https://0web.com.br/criacao-de-site-institucional
- Data: 2026-09-02 (UTC)
- Ferramenta: Lighthouse CLI (Chromium headless), preset móvel padrão

## Resultado da execução

| Categoria | Score |
|---|---|
| Performance | 45 |
| Acessibilidade | 98 |
| Boas práticas | 96 |
| SEO | 100 |

Métricas: FCP 4,7 s · LCP 5,1 s · Speed Index 4,7 s · TBT 1.210 ms · CLS 0.

Observação: o preset móvel do Lighthouse aplica throttling agressivo (4x CPU,
Slow 4G). Auditorias anteriores em desktop indicavam Performance 94; o gargalo
móvel é JavaScript de inicialização, não layout.

## Correções aplicadas nesta rodada

1. **Acessibilidade — `heading-order`**: o card do quiz de diagnóstico usava
   `h3` logo após o `h1` e o rodapé usava `h4` sem `h3` anterior. Ambos foram
   promovidos para `h2` (`InstitutionalDiagnosticQuiz.tsx`, `Footer.tsx`).
2. **Boas práticas — `errors-in-console`**: o serviço externo de geolocalização
   por IP (`ipwho.is`) era chamado no carregamento de todas as páginas e
   respondia 429, gerando erro de console e uma requisição de terceiros no
   caminho crítico. A chamada deixou de ser feita no root; a estimativa passa a
   ser resolvida sob demanda, no início do funil.

## Pontos abaixo de 90 que permanecem (com causa e encaminhamento)

| Item | Estimativa | Causa | Encaminhamento |
|---|---|---|---|
| `unused-javascript` | ~300 KiB | bundle da aplicação carregado inteiro na landing | code-splitting por rota já existe; falta isolar dependências pesadas (recharts/motion) fora das rotas públicas |
| `render-blocking-insight` | ~1.400 ms | CSS/JS crítico | avaliar inline de CSS crítico e `defer` adicional |
| `bootup-time` / `mainthread-work` | 2,3 s / 4,7 s | hidratação de componentes interativos | reduzir componentes client-side na dobra |
| `server-response-time` | 1.030 ms | TTFB do documento SSR | avaliar cache de borda para rota estática |
| `image-delivery-insight` | ~138 KiB | logo PNG servido acima do necessário | converter para AVIF/WebP redimensionado |
| `valid-source-maps` | — | source maps públicos ausentes/parciais no bundle de produção | comportamento intencional da política de privacidade de bundle |

Essas frentes exigem refatoração de bundle e cache e estão registradas como
trabalho subsequente — não foram aplicadas nesta rodada para não alterar o
comportamento de rotas fora do escopo pedido.
