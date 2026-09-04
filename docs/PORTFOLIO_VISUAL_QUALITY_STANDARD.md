# Padrão de Qualidade Visual do /portfolio

Documento normativo. Existe para encerrar discussões subjetivas sobre "a página
está boa?" e para separar, de forma definitiva, duas camadas que antes eram
confundidas.

## 1. Duas camadas independentes

| Camada | Estados | Fonte de verdade | Pode bloquear build? |
| --- | --- | --- | --- |
| Conformidade técnica | `COMPLETE` · `PARTIAL` · `LEGACY` | `scripts/portfolio-conformance.mjs` | Sim (regras objetivas já existentes) |
| Qualidade visual | `PREMIUM` · `STANDARD` · `NEEDS_UPGRADE` | `scripts/portfolio-visual-quality.mjs` | Não por padrão (report-only); `--enforce` bloqueia apenas P0 |

`COMPLETE + NEEDS_UPGRADE` é um estado válido e esperado: a página está
tecnicamente correta e visualmente abaixo do padrão atual da 0WEB.

Opinião estética **não** vira erro de build. O que vira erro é fato objetivo:
imagem quebrada, asset de outro cliente, página que não renderiza.

## 2. Evidência usada

O auditor nunca inventa informação. Ele combina:

1. Registries (`portfolio-catalog`, `portfolio-clients`, `portfolio-assets`, `portfolio-share-copy`).
2. Arquivos reais em `public/images/<slug>` — dimensões (sharp) e hash SHA-1.
3. `reports/portfolio-originality.json` — similaridade estrutural já existente.
4. `reports/portfolio-visual-runtime.json` — render real em **390px** (mobile) e **1440px** (desktop),
   produzido por `scripts/audit-portfolio-visual-runtime.mjs`.
5. `src/config/portfolio-visual-review.json` — julgamento humano, quando existir.

Projeto sem coleta de runtime é marcado `visuallyReviewed: false` e **não pode**
ser PREMIUM. Cobertura automatizada e revisão visual são reportadas separadamente
(`AUTOMATED_AUDITED` vs `VISUALLY_REVIEWED`).

## 3. Scoring

| Grupo | Peso |
| --- | --- |
| Identidade | 15 |
| Capa do catálogo | 15 |
| Hero | 15 |
| Logo | 10 |
| Imagens | 10 |
| Conteúdo | 10 |
| Originalidade | 10 |
| Mobile | 10 |
| Imagem social | 5 |
| **Total** | **100** |

Cada issue tem penalidade fixa dentro do seu grupo; o grupo nunca fica negativo.
O número é transparente, não "científico": ele ordena a fila, não substitui o olho.

Faixas: `PREMIUM >= 85` · `STANDARD 70–84` · `NEEDS_UPGRADE < 70`.

### Regras de teto (impedem PREMIUM mesmo com score alto)

- qualquer issue **P0** ou **P1**;
- `originalityStatus = FAIL`;
- `coverReview = REJECTED`;
- ausência de inspeção visual real.

## 4. Severidade

| Nível | Significado | Exemplos |
| --- | --- | --- |
| P0 | Crítico — quebra ou vaza identidade | asset de outro cliente, imagem quebrada, página que não renderiza |
| P1 | Alto — compromete percepção profissional | capa sem nexo/corte severo, logo placeholder, hero sem headline, mobile com overflow, copy quase duplicada |
| P2 | Médio — página genérica | poucas imagens, capa reaproveitando a social, hero sem imagem, identidade fraca |
| P3 | Baixo — refinamento | focal point ausente, alvos de toque pequenos, alt faltando |

Só P0 é candidato a bloqueio (`--enforce`). P1–P3 alimentam a fila.

## 5. Checklist qualitativo (o que o auditor mede)

1. **Identidade** — STRONG / ACCEPTABLE / WEAK, derivado de marca própria + originalidade + copy.
2. **Logo** — existência, dedicação (arquivo de marca e não foto), resolução, placeholder sintético, reuso.
3. **Capa do catálogo** — capa dedicada, proporção contra o card, resolução, focal point, reuso da social/logo, cruzamento entre clientes. **Peso máximo junto com hero.**
4. **Hero** — headline própria, CTA, imagem, hierarquia tipográfica no mobile.
5. **Imagens** — quantidade, diversidade interna, vazamento entre clientes.
6. **Imagem social** — 1200×630, exclusividade.
7. **Conteúdo** — volume editorial após remoção do boilerplate compartilhado, linguagem de placeholder, explicação de serviços.
8. **Originalidade** — score estrutural + similaridade editorial por trigramas.
9. **Mobile** — overflow em 390px, imagens quebradas, tap targets, headings.
10. **Coerência com segmento** — o segmento/tags aparecem na primeira tela.
11. **Fator encanto** — HIGH / MEDIUM / LOW, derivado da classificação e sobrescritível manualmente. Não bloqueia build.

## 6. Design system não é penalizado

Compartilhar botão, grid, tipografia, motion, shell, popup, analytics e
acessibilidade é **correto**. A similaridade editorial ignora sentenças que
aparecem em metade ou mais dos projetos (footer, popup 0WEB, CTA padrão, textos
legais). O que penaliza é a **percepção final de projeto duplicado**: mesma
estrutura + mesma copy + mesma composição visual.

## 7. Revisão humana

`src/config/portfolio-visual-review.json` aceita, por slug:

```json
{
  "slug-do-projeto": {
    "coverReview": "APPROVED | NEEDS_REVIEW | REJECTED",
    "originalityReview": "UNREVIEWED | PASS | WARNING | FAIL",
    "charm": "HIGH | MEDIUM | LOW",
    "visualOverride": "PREMIUM | STANDARD | NEEDS_UPGRADE",
    "notes": "justificativa obrigatória para overrides"
  }
}
```

Override sem `notes` é considerado dívida de governança.

## 8. Gate para projetos novos

- Publicação **não** é bloqueada por score visual nesta versão.
- Um projeto novo só recebe o badge interno `PREMIUM` após
  `TECHNICAL CONFORMANCE` + `VISUAL REVIEW` (capa `APPROVED` e originalidade `PASS`).
- É legítimo publicar como `STANDARD` quando o projeto é tecnicamente completo e
  visualmente aceitável.
- `originalityStatus = FAIL` não tira a página do ar: significa que ela não pode
  ser usada como referência da galeria antes de intervenção.

## 9. Comandos

```bash
node scripts/audit-portfolio-visual-runtime.mjs           # render real (390px + 1440px)
node scripts/audit-portfolio-visual-runtime.mjs --shots   # + screenshots
bun run check:portfolio-visual-quality                    # relatórios md + json + config do admin
bun run check:portfolio-visual-quality -- --enforce       # exit 1 se houver P0
```

Saídas: `reports/portfolio-visual-quality.md`, `reports/portfolio-visual-quality.json`
e `src/config/portfolio-visual-quality.json` (consumido por `/app/portfolio`).
