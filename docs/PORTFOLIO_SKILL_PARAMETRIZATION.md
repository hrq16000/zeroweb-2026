# Parametrização por skill dos projetos `/portfolio/<slug>`

Status: **normativo** · Gate automático: `bun run audit:portfolio-skills`
Complementa `docs/AGENT_SKILLS_GOVERNANCE.md`, `docs/PORTFOLIO_CLIENT_STANDARD.md`,
`docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md` e `docs/PORTFOLIO_GLOBAL_STANDARDS.md`.

## Princípio

A plataforma parametriza capacidades e contratos; a identidade criativa não é
um template compartilhado. O que deve ser herdado entre clientes é segurança,
funil, observabilidade, SEO técnico, acessibilidade e primitives — não o mesmo
hero, section order, tipografia ou motion.

## Matriz obrigatória — skill → parâmetro → fonte de verdade

| Categoria de skill | O que garante na página | Fonte de verdade | Verificação |
|---|---|---|---|
| **Business / Marketing** | quem é o cliente, o que vende, para quem e objetivo principal | catálogo: `segment`, `projectType`, `subtitle`, `summary` + creative brief | campos + revisão |
| **Creative Direction / Anti-template** | metáfora, topologia, hero, tipografia, imagem, motion, interação e decisões de diferenciação | `docs/portfolio/briefs/<slug>.md` + `creativeContractVersion` | scaffold v2 + originality review |
| **Lead Capture / CRM** | CTA e contato flutuante resolvem o funil individual | config de funil + `clientKey` | funil resolvível |
| **Design Engineering** | primitives, responsividade, semântica, tokens e estados sem impor skin | componente + tokens locais + design-system | QA visual/a11y |
| **Motion** | gramática de motion coerente com o cliente | `portfolio-motion-profiles.json → overrides.<slug>` em projetos v2 | scaffold/experience gate |
| **Copy / Narrative** | texto específico, intenção e objeções reais | catálogo + componente + brief | sem placeholder/generic copy |
| **Local SEO** | cidade, termos, canonical, social image e JSON-LD | catálogo + assets + `head()` | meta/SEO gates |
| **Performance** | imagens, lazy, LCP, code split e budgets | `PortfolioImage`, rota lazy, build/Lighthouse | perf gates |
| **Accessibility / UX** | teclado, foco, contraste, touch, reduced motion, modal semantics | componente/primitives | a11y/browser QA |
| **Proof / Trust** | evidência real ou ausência honesta de prova | assets/proof + conteúdo | sem fabricated proof |

## Direção criativa não é configuração de segmento

Defaults por segmento podem ajudar funil e fornecer fallback legado de motion.
Eles **não** podem ser a direção final de um novo portfolio creative v2.

Todo novo projeto v2 precisa:

- creative brief preenchido;
- composição autoral;
- tokens/tipografia de cliente quando apropriado;
- motion override próprio;
- comparação contra portfolios mais próximos.

## Resolução automática do funil

`src/lib/portfolio-funnel-config.ts` resolve nesta ordem:

```text
override do cliente > registro gerado da página > padrão por segmento do catálogo
```

Isso evita perguntas de outro segmento. O destino WhatsApp continua server-side
por `clientKey`. Para novos clientes, o secret canônico é:

```text
PORTFOLIO_WHATSAPP_<CLIENT_KEY_NORMALIZADO>
```

Nenhum telefone, `wa.me` ou e-mail entra no bundle público.

## Prova social

Prova social não é requisito visual obrigatório quando não existe evidência.
`socialProofRequired` deve ser `true` somente quando houver material verificável.

Em protótipo, texto fictício pode existir apenas claramente rotulado como
`Exemplo`/`Demonstração`. Em produção, não apresentar avaliação, depoimento,
rating, prêmio, cliente, número ou resultado inventado como real.

## O que a parametrização nunca autoriza

- copiar identidade, composição, navegação ou conteúdo de outro cliente;
- transformar a casca compartilhada em template visual;
- desligar rodapé/captação obrigatórios por override;
- trocar a stack por exigência de uma skill externa sem necessidade real;
- publicar scaffold v2 ainda marcado como `CREATIVE_BRIEF_REQUIRED`.

## Como validar

```bash
bun run audit:portfolio-skills
bun run validate:portfolio-scaffold
bun run validate:portfolio-boundaries
bun run validate:portfolio-catalog
bun run validate:portfolio-meta
bun run check:portfolio-originality
bun run check:experience-standard
bun test
bun run build
```

## Novo projeto — sequência mínima

1. `bun run scaffold:portfolio -- --slug <slug> --name "Nome"`.
2. Preencher `docs/portfolio/briefs/<slug>.md` antes do layout.
3. Preencher catálogo e registry.
4. Criar identidade/assets próprios e componente autoral.
5. Criar override de motion próprio.
6. Preencher e publicar funil somente depois de validar perguntas.
7. Cadastrar `PORTFOLIO_WHATSAPP_<CLIENT_KEY>` quando houver número oficial.
8. Rodar gates + browser/funnel QA.

Funil seguro, share, captação, tracking e infraestrutura são herdados. **A
composição visual nunca é herdada.**
