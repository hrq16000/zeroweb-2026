# Telas administrativas do portal (`/app`)

Estas telas substituem a edição manual de metadados e de números de funil.
Todas exigem sessão autenticada e papel `admin`/`super_admin` (checagem no
servidor, via `has_role` / `is_super_admin`).

## Fonte de dados

- `public.portfolio_client_settings` — uma linha por `client_key`
  (slug, nome, SEO, canonical, imagem social, destinatário do funil, funil
  ativo, publicado).
- `public.portfolio_client_settings_history` — histórico auditável campo a
  campo (valor anterior, novo valor, autor, data).

RLS: leitura apenas para administradores autenticados; escrita apenas via
`service_role` (server functions). `anon` não tem acesso.

Privacidade: o destinatário do funil **nunca** sai do servidor em texto puro.
As telas e o histórico mostram apenas `••••1234`. Nenhum `wa.me`, telefone,
e-mail operacional ou PII entra no bundle público.

## Telas

| Rota | Função |
|---|---|
| `/app/clientes` | Cadastro de cliente, slug, nome e número do funil; publicar/despublicar sem editar o catálogo |
| `/app/metadados` | Título, descrição, palavras-chave e canonical por cliente + histórico |
| `/app/funis/numeros` | Destinatário real por funil, ativação, alertas de funil indisponível e histórico |
| `/app/auditoria/vitais` | LCP, CLS e INP por slug em p75/p90/p95, com alertas de budget |

## Web Vitals

`getPortfolioWebVitals` agrega `public.portfolio_web_vitals` (ingestão
somente por `service_role`) e retorna p75, p90 e p95 por métrica e slug, mais
alertas quando o p75 excede LCP 2500 ms, CLS 0,1 ou INP 200 ms (crítico acima
de 1,6× o budget). Nenhum identificador pessoal é coletado.

## Manutenção

- Alterações de schema vão por migration, nunca por edição direta.
- Ao adicionar campo editável, incluir no array `EDITABLE` de
  `src/lib/portfolio-client-settings.functions.ts` para que o histórico
  continue completo.
- Gates aplicáveis: `bun run scan:source-privacy`, `bun test`, `bun run build`.
