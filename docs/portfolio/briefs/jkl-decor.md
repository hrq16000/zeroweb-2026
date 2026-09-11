# Creative brief — JKL Decor

- Slug: `jkl-decor`
- Contrato: `contractVersion 3` (Blueprint + adendos de experiência, motion e autonomia)
- Estágio: `published`
- Última atualização: 2026-09-11

## 1. Entidade

Marcenaria de móveis planejados sob medida em MDF. Entidade resolvida por Place
ID confirmado (`ChIJX_1YSWLIYqoRuK5h3vDp5OY`, data ID
`0xaa62c8624958fd5f:0xe6e4e9f0de61aeb8`, CID `16637680144145821368`), categoria
pública "Marceneiro", endereço R. Durval Moletta — Agaraú, São José dos Pinhais
— PR, telefone (41) 99142-5088, horários seg–sex 08:00–18:00, sábado e domingo
fechados, nota 5,0 com 3 avaliações. Sem site próprio. Redes sociais não
resolvidas na pesquisa.

## 2. Leitura do negócio

A evidência pública é pequena em quantidade e forte em qualidade: três
avaliações, todas cinco estrelas, e uma delas descreve o ciclo inteiro —
orçamento à distância preciso e rápido, cozinha 100% MDF, prazo de 20 dias
cumprido antes do combinado e intenção de voltar para os outros cômodos. O
acervo de fotos, ao contrário, é grande: vinte ambientes entregues.

Consequência editorial: **a página é mostrada, não argumentada**. O acervo de
ambientes é o principal ativo; o texto organiza o pedido de orçamento.

## 3. Fronteira entre fato e informação do cliente

- FATO VERIFICADO: nome, categoria, endereço, telefone, horários, nota,
  avaliações e fotos — ficha pública do Google.
- DECLARADO PELO CLIENTE: 12x sem juros, desconto à vista, entrega em até 20
  dias, garantia, 100% MDF, ambientes atendidos e área de cobertura. O cliente
  autorizou a publicação dessas condições; a página as exibe **sempre
  identificadas como informação da própria JKL Decor**, com a ressalva de que
  prazo e cobertura são confirmados no orçamento.

## 4. Direção criativa (anti-template)

- Paleta local: base clara de parede pintada (`oklch(0.975 0.006 95)`), verde
  profundo de MDF fosco (`oklch(0.36 0.056 158)`) e dourado de puxador como
  acento. Nada do carvão/amarelo do Careca's nem do grafite/laranja da Moreira.
- Ritmo (`visualRhythm`): hero full-bleed vertical → grade de ambientes reais →
  **banda escura** de capacidades → oferta alternada → faixa de condições →
  prova → roteiro do projeto → CTA imersivo → painel de atendimento → FAQ.
- A banda escura única no meio da página é a quebra de ritmo principal.

## 5. Hero

Arquétipo `fullBleed`: a estante iluminada de nichos ocupa a primeira dobra
inteira, com wordmark, praça, nota pública e CTA do funil sobre ela. Não é
banner centralizado nem hero assimétrico (evita repetir Moreira).

## 6. `signatureMoments`

1. Estante iluminada em full-bleed abrindo a página.
2. Grade de seis ambientes reais com hover de gaveta.
3. Roteiro do projeto se preenchendo com o scroll.

## 7. `qualityProfile`

```text
visualDensity: alta · editorialDepth: média-alta · motionIntensity: BALANCED
mediaRichness: alta (6 fotos reais) · proofLevel: médio (3 avaliações públicas)
interactionLevel: médio · localContext: alto · conversionIntensity: alta
```

## 8. Mídia

Somente fotos públicas da ficha do Google (`GOOGLE_PUBLIC_LISTING_PHOTO`,
`rights: THIRD_PARTY_PUBLIC_SOURCE`, `usageMode:
ATTRIBUTED_EDITORIAL_USE_FROM_PUBLIC_SOURCE`). Publicadas por terceiros:
autorização do proprietário não transfere direito autoral nem cria licença. Uso
editorial com fonte declarada e plano de substituição por fotos enviadas pelo
cliente. Nenhuma imagem gerada representa móvel, equipe ou obra executada.
Wordmark `WORDMARK_CREATED`/`GENERATED_BRAND_ASSET`. Capa `PHOTO_DERIVED`.

## 9. Motion narrative

Movimento de marcenaria: peças que assentam no lugar. Revelação em escala curta
nas fotos, hover de gaveta nos ambientes, parallax leve só no hero desktop e
progresso no roteiro do projeto. `prefers-reduced-motion` remove deslocamento,
parallax e progresso mantendo todo o conteúdo (`opacityOnly`).

## 10. Conversão

`contactMode: funnelOnly`, `funnelType: orcamento`. O telefone aparece como
informação institucional, jamais `tel:`, WhatsApp ou botão de ligar. Única
exceção de link externo: Google Maps e os links de origem das avaliações. CTAs
contextuais: "Pedir orçamento sem compromisso", "Contar o meu ambiente",
"Planejar meu ambiente" (flutuante).

## 11. Proibições assumidas

Sem preço, sem número de projetos entregues, sem tempo de mercado, sem
depoimento escrito por nós, sem foto gerada de móvel e sem rede social como
canal oficial (nenhum perfil foi resolvido).

## 12. Relação com o projeto legado

O endereço anterior `/portfolio/jkl-marcenaria` foi mantido como redirecionamento
permanente para `/portfolio/jkl-decor`, por decisão explícita do responsável.
