# Contrato universal de qualidade — projetos /portfolio/:slug

Contrato **de capacidades**, não de layout. Cada cliente mantém identidade,
narrativa e estrutura próprias; o que é obrigatório é a existência de cada
capacidade abaixo, resolvida no contexto daquele cliente.

Vale para projetos novos (validado no wizard `/app/portfolio/novo` antes de
`READY`) e como referência de revisão para projetos existentes. **Não** autoriza
redesenho sistemático de projetos já concluídos: só há reabertura diante de
regressão real, risco de privacidade ou falha de gate.

| # | Capacidade | Exigência mínima | Verificação |
|---|---|---|---|
| 1 | Brand | Nome, logo, paleta e tipografia do próprio cliente | revisão de marca em `/app/portfolio/:slug` |
| 2 | Cover | Capa própria e segura, com focal point; sem material de terceiros | `scripts/report-portfolio-cover-inventory.mjs` |
| 3 | Hero | Mensagem e imagem do cliente, sem PII visível | QA visual 390/1440 |
| 4 | Content | Serviços/provas reais e verificáveis; nada inventado | revisão editorial |
| 5 | Funnel | Funil próprio resolvido por `clientKey`, sem contato no bundle | `bun run validate:portfolio-boundaries` |
| 6 | SEO | Title, description, canonical, OG/Twitter e JSON-LD próprios | `check:portfolio-projects` |
| 7 | Conversion | CTA visível do cliente + pop-up comercial da 0WEB como camada externa | QA + eventos |
| 8 | Motion | Animação com `prefers-reduced-motion` respeitado | revisão de acessibilidade |
| 9 | Performance | Imagens otimizadas, lazy em seções abaixo da dobra, budgets Lighthouse | budgets existentes |
| 10 | Accessibility | Um H1, contraste WCAG AA, alvos ≥ 44px, foco visível | QA de acessibilidade |
| 11 | Originality | Sem clone/cluster com outro projeto | `scripts/portfolio-originality.mjs` |
| 12 | Privacy | Nenhum telefone/endereço/PII em bundle, analytics, capa ou galeria | scanner de privacidade |

## Regras invioláveis

- Proibido inventar fachada, funcionário, produto, serviço executado, ambiente ou
  cliente como se fosse material real. Havendo só a marca, a capa fica pendente.
- Proibido “limpar” arte promocional com telefone/endereço/preço para fabricar
  aprovação de capa; o projeto permanece em fila editorial com motivo registrado
  (`BLOCKED_CONTACT`, `BLOCKED_ADDRESS`, `BLOCKED_PROMOTIONAL_PRICE`,
  `BLOCKED_QUALITY`, `BLOCKED_OTHER`).
- Proibido reaproveitar identidade, navegação, contato ou SEO da 0WEB ou de outro
  cliente dentro de um projeto.
- Proibido criar segundo tracker, segunda base de leads ou dashboard paralelo.
