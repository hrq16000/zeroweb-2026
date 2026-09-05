# Rodada 11 — micro-onda das 4 capas NEEDS_CROP

Escopo fechado: apenas enquadramento das 4 capas classificadas como `NEEDS_CROP`
pelo contrato canônico. Nenhum redesign estrutural, nenhuma rota nova, nenhum
asset inventado.

## 1. Escopo congelado (CROP_TARGETS)

| Projeto | Slug | Asset avaliado | Uso anterior | Problema | Observação |
|---|---|---|---|---|---|
| Artesanatos Darléia Oliveira | `artesanatos-darleia-oliveira` | `hero-og.png` | imagem social aprovada como capa | papel social ≠ capa de card | crop editorial 16:10 já existia (`capa-card.jpg`), não estava registrado |
| Eisenfer Tubos e Aços | `eisenfer-tubos-acos` | `telhas.webp` | imagem do catálogo | flyer inteiro; rodapé com telefone e site visíveis no card | exigiu novo enquadramento |
| Refrigeração Maresia | `refrigeracao-maresia` | `hero-og.png` | imagem social aprovada como capa | papel social ≠ capa de card | crop editorial já existia |
| Thays Camilla | `thays-camilla` | `hero-og.png` | imagem social aprovada como capa | papel social ≠ capa de card | crop editorial já existia |

## 2. Revalidação de segurança do material

Inspeção visual em tamanho real (não só OCR):

- Darléia, Maresia e Thays: material próprio, sem telefone, e-mail, endereço,
  preço ou QR. Aprovados.
- Eisenfer: o flyer completo **contém telefone e site no rodapé**. O material é
  real e do cliente, mas o enquadramento anterior expunha contato no card.
  Novo recorte 16:10 (`focal 0.5 / 0.45`) preserva apenas a faixa de produtos
  (telhas metálicas reais) e exclui o rodapé de contato.

Nenhum dos 4 precisou ser reclassificado para pendência.

## 3. Ajustes aplicados

Nenhuma imagem foi substituída por asset de outro cliente ou por stock. Todos os
recortes vêm do próprio material do projeto.

| Slug | Fonte | Saída | Focal | object-position no card |
|---|---|---|---|---|
| `artesanatos-darleia-oliveira` | `hero-og.png` | `capa-card.jpg` 1600×1000 | 0.50 / 0.50 | 50% 50% |
| `eisenfer-tubos-acos` | `telhas.webp` | `capa-card.jpg` 1024×640 (novo) | 0.50 / 0.45 | 50% 45% |
| `refrigeracao-maresia` | `hero-og.png` | `capa-card.jpg` 1454×909 | 0.50 / 0.50 | 50% 50% |
| `thays-camilla` | `hero-og.png` | `capa-card.jpg` 1600×1000 | 0.50 / 0.50 | 50% 50% |

Separação de contextos formalizada: `cardCover` (`capa-card.jpg`) passou a ser
distinto de `socialImage` (`*-og.*`) e do `icon`/marca. O catálogo agora aponta
`image` para a capa dedicada dos 4 projetos; a imagem social de cada um
permanece intocada. Nenhum overlay novo foi adicionado — o card já aplica
gradiente próprio e o contraste do título ficou adequado nos 4 casos.

## 4. Before × After

- Darléia / Thays: a capa deixou de ser “imagem de compartilhamento reaproveitada”
  e passou a ser recorte editorial com o produto (coadores/caneca + azulejo)
  dentro da área útil do card.
- Maresia: banner próprio com marca e geladeira real, sem o flyer que contém
  telefone.
- Eisenfer: maior ganho da rodada — o card exibia o flyer inteiro com telefone e
  site; agora mostra somente as telhas metálicas reais, sem contato e sem preço.

## 5. QA

Playwright local, galeria `/portfolio` e cards individuais.

| Viewport | Overflow | Erros de console | Cards | Resultado |
|---|---|---|---|---|
| 390 px | não | 0 | 4/4 com capa dedicada | PASS |
| 768 px | não | 0 | 4/4 | PASS |
| 1440 px | não | 0 | 4/4 | PASS |

Assunto principal visível, sem corte de produto, sem crop cego central, sem
capa parecida demais com outro projeto, títulos e badges legíveis.

## 6. Inventário canônico

| Métrica | Antes | Depois |
|---|---|---|
| TOTAL_PROJECTS | 68 | 68 |
| VALID | 30 | **34** |
| PENDING | 38 | **34** |
| NEEDS_CROP | 4 | **0** |
| CONTACT_OR_PII | 8 | 8 |
| PROMOTIONAL_MATERIAL | 2 | 2 |
| LOGO_ONLY | 10 | 10 |
| NO_REAL_ASSET | 14 | 14 |

`STATUS_TOTAL_MATCHES_68 = YES`.

## 7. Gates

TYPECHECK PASS · TESTS 338/0 PASS · BUILD PASS · PRIVACY PASS (bundle público
limpo) · ORIGINALITY_REGRESSION PASS (0 clone, 0 HIGH_SIMILARITY, 0 cluster) ·
COVER_STATUS PASS · PORTFOLIO_PROJECTS 68 COMPLETE · PII_EXPOSED 0 ·
ROUTES_CHANGED 0 · PUBLIC_URLS_CHANGED 0 · SEO/FUNNEL/TRACKING REGRESSION 0.

## 8. Pendências mantidas fora do escopo

34 capas seguem pendentes: `CONTACT_OR_PII` 8, `PROMOTIONAL_MATERIAL` 2,
`LOGO_ONLY` 10, `NO_REAL_ASSET` 14. Nenhuma delas pode ser resolvida sem
material real e seguro do próprio cliente.

## 9. Próxima decisão recomendada

**OPÇÃO B** — não há novos assets reais disponíveis. A próxima rodada deveria
ser técnica: melhorar a precisão do fingerprint de assets/originalidade, sem
tocar nas 34 pendências até que material próprio chegue.
