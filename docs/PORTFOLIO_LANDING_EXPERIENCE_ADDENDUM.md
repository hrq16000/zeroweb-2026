# ADENDO — Enriquecimento visual, narrativo e de percepção premium

Status: **normativo para projetos novos de `/portfolio/:slug`** a partir de
2026-09-11. Este documento **adiciona** capacidades ao
`docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md`; não o substitui, reduz ou
revoga. Legado publicado não é redesenhado por causa deste adendo.

Objetivo: impedir que o Blueprint produza apenas uma sequência tecnicamente
correta de seções. A régua é a percepção — *"isso foi projetado para esta
empresa"* — e não *"esta empresa recebeu outra cor do mesmo template"*.

---

## 1. Preencher seções ≠ página rica

`hero + serviços + sobre + avaliações + FAQ` não caracteriza profundidade.
Ao longo da página precisa haver mudança perceptível de escala, densidade,
composição, mídia, ritmo vertical, fundo, alinhamento, tipografia,
profundidade, interação, prova e narrativa.

Meta: **cada seção revela uma nova dimensão do negócio.**

## 2. `experience.visualRhythm`

Todo Blueprint novo declara uma direção de ritmo. Proibido, na prática, dez
blocos consecutivos de *container central + título + grid de 3 cards*.

Alternâncias possíveis (ordem livre, mudança deliberada obrigatória):

```text
full-bleed → conteúdo compacto → mídia dominante → composição assimétrica →
prova → seção editorial → CTA imersivo
```

## 3. Hero é composição, não banner

Arquétipos disponíveis:

```text
cinematic · editorial · asymmetric · image-led · product-led ·
typography-led · layered · split · full-bleed
```

O Hero pode combinar, quando houver evidência: proposta de valor, categoria,
status contextual, localização, prova curta, rating, especialidade, imagem,
objeto visual, CTA e microinformação. A escolha **deriva da entidade**, nunca
de rotação aleatória ou default técnico.

## 4. Proof strip precoce

Camada curta de prova logo no início, somente com dado comprovado:
rating e nº de avaliações verificadas, área de atendimento, certificação, tempo
de atividade, entrega própria. Sem evidência auditável, a faixa não existe.

## 5. Seção opcional `capabilities`

Autoridade antes da explicação completa da oferta: tecnologias, marcas
atendidas, equipamentos, parceiros, certificações, meios de pagamento,
fabricantes, especialidades, categorias, ferramentas, plataformas.

Assistência técnica → marcas/equipamentos · Construção → materiais e
especialidades · Restaurante → categorias e modalidades · Profissional → áreas
de atuação e metodologias.

## 6. Oferta com profundidade

Cada oferta pode declarar:

```text
title · shortDescription · media · proof · benefit · metric · useCase ·
cta · detailLink · featured
```

`featured` permite destaque editorial. `metric` e `proof` exigem evidência.

## 7. Seção opcional `businessInfrastructure`

Alternativa ao "Sobre nós" quando confiança vem da operação: empresa
responsável, sede, estrutura, loja, fábrica, equipe, processo formal, contrato,
laboratório, equipamentos, unidade física.

## 8. Seção opcional `results`

Crescimento, economia, número de projetos, antes/depois, prazo, performance,
resultado técnico, indicadores comerciais.

> `result` exige evidência. Sem evidência, **não gerar número**.

## 9. Processo como storytelling

Variantes permitidas além de 1→2→3→4 em cards iguais: timeline vertical,
horizontal storytelling, sticky scroll, steps alternados, numbered editorial,
progress track, image-led process.

## 10. Prova social plural

Google Reviews, casos, resultados, fotos reais, clientes, certificados, logos,
números verificados, projetos, imprensa, redes sociais, avaliações agregadas.
Não criar bloco de depoimentos apenas porque o template tem espaço.

## 11. `mediaNarrative` no media plan

Cada asset declara o papel narrativo, além da seção:

```text
ESTABLISH_CONTEXT · SHOW_REALITY · EXPLAIN_SERVICE · PROVE_CAPABILITY ·
CREATE_EMOTION · BREAK_VISUAL_RHYTHM · SUPPORT_CONVERSION · BRAND_RECALL
```

Imagem sem papel narrativo é decoração e não entra.

## 12. Camadas e profundidade

Uso contextual (nunca tudo junto): conteúdo sobreposto, elementos atravessando
seções, cards fora do container, imagens mascaradas, backgrounds com
profundidade, sticky, tipografia gigante, grids quebrados, bento, full-bleed,
painéis editoriais, detalhes SVG, texturas, microinterações.

Regra: **alguns momentos da página precisam ser impossíveis de confundir com um
construtor genérico de cards.**

## 13. `experience.signatureMoments[]`

Mínimo de 2–3 momentos visuais de assinatura por projeto novo, registrados
conceitualmente (Hero próprio, galeria horizontal, processo com scroll,
comparativo interativo, catálogo visual, bloco institucional, resultados, mídia
sobreposta, CTA imersivo). Alimenta o gate de originalidade existente.

## 14. `motionNarrative`

Motion deixa de ser efeito e passa a ser linguagem: industrial → preciso e
mecânico; tecnologia → scan, camadas, profundidade; gastronomia → orgânico e
sensorial; construção → montagem e estrutura; estética → transições delicadas;
logística → trajetória horizontal. Budget e `prefers-reduced-motion` do padrão
global continuam valendo.

## 15. CTA pode não parecer botão

Botão, painel, formulário curto pré-funil, escolha de serviço, selector, card
interativo, sticky action, CTA imersivo, mini diagnóstico.

Invariante 0WEB: em `contactMode: "funnelOnly"` a conversão comercial passa
sempre pelo funil individual. Telefone é informação institucional, nunca
`tel:`, `wa.me` ou atalho clicável.

## 16. Texto de CTA também é identidade

Evitar "Fale conosco" / "Saiba mais" / "Solicitar orçamento" quando existe ação
contextual: *Conte o problema do equipamento* · *Escolher meu pedido* ·
*Descrever minha obra* · *Informar origem e destino* · *Agendar minha
avaliação*.

## 17. FAQ alimenta descoberta

Perguntas derivadas de reviews, buscas, Search Console, objeções comerciais,
enrichment e sintomas relacionados à oferta. Serve usuário + entidade + busca
interna + SEO, sem keyword stuffing. Não precisa viver só no rodapé da página.

## 18. Footer com identidade

Compartilhado: legal, privacidade, infraestrutura, tracking, semântica.
Livre: proporções, fundo, composição, mídia, tipografia, assinatura visual.

## 19. Novas dimensões do Quality Gate

Acrescentadas à matriz (`docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md`):

```text
CONTENT_DEPTH · VISUAL_RHYTHM · MEDIA_NARRATIVE · SECTION_VARIETY ·
SIGNATURE_MOMENTS · PROOF_DENSITY · CONVERSION_CONTINUITY
```

Mesmos estados (`PASS · WARNING · FAIL · NOT_APPLICABLE`). `FAIL` reprova.
Ausência de avaliação é warning para projetos com `contractVersion < 3` e
obrigatória a partir de `contractVersion >= 3`.

Quantidade de seções não é profundidade: 8 seções excelentes superam 15 fracas.

## 20. Avaliação por distância

1. **100%** — a página é bonita?
2. **Screenshot longa reduzida** — as seções parecem diferentes entre si? há
   ritmo? há grandes áreas repetidas?
3. **Comparação com outros `/portfolio`** — a assinatura é distinta?
4. **Card no catálogo** — continua reconhecível?

## 21. `qualityProfile`

Registro conceitual por projeto, para impedir que todos terminem com a mesma
intensidade:

```text
visualDensity · editorialDepth · motionIntensity · mediaRichness ·
proofLevel · interactionLevel · localContext · conversionIntensity
```

Não é pontuação artificial; é declaração de intenção.

## 22. Enrichment influencia o design

Fluxo correto:

```text
pesquisa → evidência → identidade → mídia → narrativa → composição
```

Nunca `template → procurar conteúdo para preencher`. Uma empresa com fachada
forte, 200 reviews e Instagram ativo precisa gerar uma página estruturalmente
diferente de uma com zero foto, zero review e serviço altamente técnico.

## 23. "Sobre" não precisa vir cedo

`Hero → Proof → Serviços → Resultados → Sobre` frequentemente converte melhor
que `Hero → Sobre → Serviços`. A ordem deriva do negócio.

## 24. Benchmark externo gera abstração, não cópia

Ao usar uma referência externa, registrar **o que foi aprendido**, nunca o que
foi copiado. Abstrações válidas: Hero com alta densidade de confiança, prova
precoce, capacidades como autoridade, serviços com indicadores, estrutura
operacional, resultados mensuráveis, processo explícito, prova social, FAQ,
fechamento forte e ritmo visual variável.
