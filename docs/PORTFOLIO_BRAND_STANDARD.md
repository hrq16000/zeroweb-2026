# Padrão de marca dos projetos `/portfolio/:slug`

Fonte de verdade da revisão de marca: `src/config/portfolio-brand-review.json`.

## Estados

- `brandOrigin`: `CLIENT_PROVIDED` (marca oficial enviada pelo cliente) ·
  `EXISTING_PROJECT_ASSET` (asset já existente no projeto) ·
  `DEMO_CREATED_BY_0WEB` (identidade demonstrativa autoral) · `UNKNOWN`.
- `brandReview`: `UNREVIEWED` · `APPROVED` · `NEEDS_REVIEW` · `REJECTED`.
- `classification`: leitura de inventário (`REAL_BRAND_VALID`,
  `REAL_BRAND_WEAK_ASSET`, `PLACEHOLDER`, `GENERIC_GENERATED`, `MISSING`,
  `WRONG_CLIENT`, `APPLICATION_PROBLEM`).
- `authored: true` protege o arquivo: `scripts/generate-portfolio-identity-assets.mjs`
  pula o slug e nunca regrava a logo nem o OG.

## Regras

1. Marca real do cliente nunca é substituída, redesenhada ou "melhorada".
   Se o asset for fraco, corrija a aplicação (tamanho, contraste, área livre),
   não o símbolo.
2. Identidade demonstrativa é permitida apenas em projeto de exemplo e precisa
   estar declarada como `DEMO_CREATED_BY_0WEB`, com conceito, personalidade,
   formas, tipografia e paleta registrados em `direction`.
3. Nenhuma marca pode repetir a fórmula genérica (retângulo + círculo +
   iniciais + fonte padrão) nem reaproveitar asset de outro cliente.
   `ASSET_CROSS_CLIENT` e `LOGO_PLACEHOLDER` são detectados pelo scorer em
   `scripts/portfolio-visual-quality.mjs`.
4. A imagem social precisa ser coerente com a marca. Para marcas autorais ela é
   gerada por `node scripts/build-portfolio-brand-social.mjs`, usando apenas a
   logo, a paleta declarada e dados já existentes no catálogo (nome, segmento,
   cidade/UF). Nenhum telefone, endereço ou alegação entra na arte.
5. Revisão humana acontece em `/app/portfolio/:slug`, bloco **Revisão de marca**
   (fundo claro, fundo escuro, mobile e prévia social).

## Comandos

```bash
node scripts/build-portfolio-brand-social.mjs   # OG coerente com a marca autoral
node scripts/validate-portfolio-logos.mjs       # toda página tem logo própria
node scripts/portfolio-visual-quality.mjs       # score, placeholders, cross-client
```
