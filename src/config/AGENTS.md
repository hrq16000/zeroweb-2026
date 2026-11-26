## Catálogo `/portfolio` — datas e projetos fora do registro canônico

- Ordenação por data lê `src/config/portfolio-project-dates.json`, gerado do histórico Git por `bun run build:portfolio-project-dates` (clone completo); rode após criar/alterar projeto. Por quê: posição no array não é data real.
- Projeto publicado com rota própria e fora de `portfolio-catalog.json` entra em `src/config/portfolio-catalog-standalone.json`. Por quê: a vitrine e a busca precisam achá-lo sem disparar os gates do registro canônico.
