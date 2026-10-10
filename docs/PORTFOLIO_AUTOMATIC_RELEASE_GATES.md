# Admissão automática de novos portfólios — 0WEB

Status: **obrigatório** para todo novo `/portfolio/:slug`, inclusive promoção de `draft` para `published`.

## Objetivo

Todo novo portfólio nasce como site individual, com conteúdo original e funil próprio, e
**não pode passar ao `main` sem gates reais no seu URL**. Automatizamos a engenharia,
sem impor composição ou identidade visual uniforme a negócios diferentes.

## Fluxo de publicação no GitHub

1. Scaffold gerenciado → identidade e comprovação factual → composição autoral e mídia → SEO próprio → funil individual.
2. Catálogo `src/config/portfolio-catalog.json` registra o novo slug como `published`
   (ou promove um slug existente de `draft` para `published`).
3. No PR, `scripts/resolve-new-public-portfolios.mjs` compara **base e head do Git**:
   detecta apenas novos publicados e promoções, sem rerodar Lighthouse por edição de texto/card já publicado.
4. Gate de admissão `--check`: para cada slug público novo exige registro correspondente em
   `portfolio-clients.json` **e** manifesto de ciclo de vida gerenciado.
   Os validadores pré-existentes continuam verificando contratos de qualidade, evidência,
   descoberta/indexabilidade, originalidade, CTA e funil.
5. Lighthouse avalia **o próprio novo `/portfolio/:slug`** automaticamente,
   mesmo num PR que só altera o catálogo. Critérios atuais, sem reduzir limites:
   Performance ≥ 0,90; SEO ≥ 0,95; acessibilidade ≥ 0,95;
   LCP ≤ 2,5 s; CLS ≤ 0,1; TBT ≤ 200 ms.
6. E2E de popup e funis, checagens head/preview, diff rígido de indexabilidade
   e regressão visual são executados. O visual inclui o slug recém-publicado,
   comparando desktop/tablet/mobile sob o mesmo limite de 2%.
7. **Falhou qualquer gate bloqueante: não mergear, não publicar.**
   Sem baseline visual válida, fazer revisão perceptual e registrar apenas
   evidência/hashes inspecionados; nunca aprovar hashes em massa ou aumentar 2%.
8. Após merge, verificar deployment, sitemap, canonical, index/follow e GSC real.
   Indexável tecnicamente **não significa** indexado pelo Google.

## Comandos

```sh
# Relatório CSV dos novos slugs realmente publicados (exige SHAs acessíveis)
node scripts/resolve-new-public-portfolios.mjs --base "$BASE_SHA" --head "$HEAD_SHA"

# Com bloqueio de publicação sem registro e manifesto gerenciado
node scripts/resolve-new-public-portfolios.mjs --base "$BASE_SHA" --head "$HEAD_SHA" --check

# Testes de regressão da detecção
bun test tests/portfolio/new-public-portfolio-scope.test.ts
```

## Limites e governança

- Somente projetos registrados no Git/catálogo entram nesse mecanismo de diff.
  Projetos criados **exclusivamente em banco/admin, sem PR Git**, precisam do gate
  equivalente na ação server-side de `READY/PUBLISH`; não alegar cobertura de
  publicação dinâmica enquanto essa etapa não tiver teste de integração comprovado.
- Nenhum endereço, preço, prazo, review, oferta ou disponibilidade deve ser inventado.
- Novo projeto não herda layout de um portfólio anterior.
- `noindex` de uma página sem evidência não pode ser ligado em massa só para fazer score.
- Lighthouse mede laboratório/CI, não substitui dados do Search Console.
- Alterações de componente compartilhado continuam com cobertura global; esta regra
  não reduz essa abrangência para fugir de falhas históricas.
- Bases históricas podem ter slugs legados com formatos anteriores; o detector
  valida formato estrito **somente dos novos slugs públicos**.
