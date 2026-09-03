# Parametrização por skill dos projetos `/portfolio/<slug>`

Status: **normativo** · Gate automático: `bun run audit:portfolio-skills`
Complementa `docs/AGENT_SKILLS_GOVERNANCE.md`, `docs/PORTFOLIO_CLIENT_STANDARD.md`
e `docs/PORTFOLIO_GLOBAL_STANDARDS.md`.

## Princípio

A parametrização de um projeto **não vive no componente**. Ela vive nos
arquivos canônicos de configuração. Assim, projetos atuais e futuros herdam o
mesmo padrão sem correção manual individual, e a auditoria consegue provar
conformidade por dado, não por leitura de código.

## Matriz obrigatória — skill → parâmetro → fonte de verdade

| Categoria de skill | O que garante na página | Fonte de verdade (parâmetro) | Verificação automática |
|---|---|---|---|
| **Business / Marketing** | Enquadramento comercial: quem é o cliente, o que vende, para quem | `portfolio-catalog.json`: `segment`, `projectType`, `subtitle`, `summary` | campos obrigatórios |
| **Lead Capture / CRM** | CTA e botão flutuante abrem o **mesmo** funil individual do cliente | `portfolio-global-config.json → overrides.<key>.contactFloating.quizConfig` › `portfolio-quiz-configs.generated.ts` › **padrão por segmento** (`src/lib/portfolio-funnel-defaults.ts`) | funil resolvível + projeto registrado em `portfolio-clients.json` ou `portfolio-site-registry.ts` |
| **Design / UI Automation** | Casca padrão (compartilhar, contato flutuante, rodapé, voltar ao topo) e capa sempre visível | `PortfolioStandardShell` + `PortfolioCover` (`image` › `fallbackImage` › `socialImage` › `icon` › gradiente) | capa resolvível; override não pode desligar rodapé/captação |
| **AI Copywriting** | Texto próprio, específico e sem placeholder | `summary`/`subtitle` do catálogo e copy do componente do cliente | `summary` ≥ 60 caracteres e sem `lorem/placeholder/em breve` |
| **Local SEO** | Busca regional: cidade, termos, canonical e imagem social | catálogo (`city`, `state`, `tags`) + `portfolio-assets.json` (`socialImage`) + `head()` da rota | cidade/estado, ≥ 2 tags e imagem social própria |
| **Engagement / Extras** | Prova social do cliente e captação da hospedagem | `portfolio-assets.json → clients.<key>.proof` + `hostCaptureRequired` | prova configurada e captação ativa |

## Resolução automática do funil (fim das correções manuais)

`src/lib/portfolio-funnel-config.ts` resolve nesta ordem:

```text
override do cliente  >  registro gerado da página  >  padrão por segmento do catálogo
```

O padrão por segmento (`buildDefaultFunnelConfig`) monta perguntas coerentes com
o segmento do projeto e usa a cidade do catálogo na etapa de localização.
Consequência prática: **um projeto novo, apenas registrado no catálogo, já nasce
com funil coerente** — nunca cai em perguntas de outro segmento.

Regras que continuam valendo: nenhum telefone, `wa.me` ou e-mail no bundle; o
destinatário é resolvido no servidor por `clientKey`; o funil universal da 0WEB
é apenas o pop-up de captação da hospedagem.

## O que a parametrização nunca autoriza

- Depoimento, avaliação, selo, número de clientes ou resultado sem evidência.
- Copiar identidade, navegação ou conteúdo de outro cliente.
- Desligar rodapé de hospedagem ou pop-up de captação por override.

## Como validar

```bash
bun run audit:portfolio-skills          # matriz de skills por projeto (gate de build)
bun run validate:portfolio-boundaries
bun run validate:portfolio-catalog
bun run validate:portfolio-meta
bun test && bun run build
```

O relatório por projeto fica em
`seo-reports/portfolio-skill-parametrization.json` (categoria a categoria, com
os motivos de eventual não conformidade) e deve ser anexado ao PR.

## Novo projeto — o que basta fazer

1. `bun run scaffold:portfolio -- --slug <slug> --name "Nome"`.
2. Preencher no catálogo: `segment`, `projectType`, `subtitle`, `summary`,
   `city`, `state`, `tags`, imagem.
3. Registrar assets (`icon`, `socialImage`, `proof`) em `portfolio-assets.json`.
4. Rodar `bun run audit:portfolio-skills`.

Funil, casca, compartilhamento, rodapé, captação, tracking e fallback de capa
são herdados automaticamente. Override só quando o cliente exigir perguntas
específicas.
