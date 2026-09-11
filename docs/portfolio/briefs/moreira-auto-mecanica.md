# Creative brief — Moreira Auto Mecânica

- Slug: `moreira-auto-mecanica`
- Contrato: `contractVersion 3` (Blueprint + adendo de experiência)
- Estágio: `ready` (não publicado nesta rodada)
- Última atualização: 2026-09-11

## 1. Entidade

Oficina de mecânica para carros no bairro Cidade Jardim, em São José dos
Pinhais — PR. Entidade resolvida por Place ID confirmado
(`ChIJgYYezAz63JQRk2SRKP5Usqk`, data ID `0x94dcfa0ccc1e8681:a9b254fe28916493`,
CID `12227929388843361427`). Sem site próprio e sem descrição publicada.

## 2. Leitura do negócio

O que a evidência pública mostra não é "oficina completa com N serviços": é
**confiança de bairro**. As avaliações falam de indicação entre amigos, de pai
para filho, sinceridade sobre o problema e preço justo. Há também uma avaliação
negativa antiga sobre retrabalho em suspensão — a página não pode prometer
resultado, prazo ou garantia.

Consequência editorial: a página vende **como levar o carro até lá**, não uma
lista inventada de especialidades.

## 3. Direção criativa (anti-template)

- Paleta local: grafite azulado de galpão (`oklch(0.16 0.017 249)`) com laranja
  de sinalização (`oklch(0.67 0.187 41)`). Nada do carvão/amarelo do Careca's.
- Tipografia: pesos altos e tracking negativo em títulos curtos; corpo em
  linhas longas e claras. Sem fonte global nova.
- Ritmo (`visualRhythm`): hero assimétrico → faixa de sinais → índice editorial
  numerado (sem grade de cards) → grade de mídia real → banda de capacidades
  com fundo fotográfico → **bloco claro** com linha do tempo → prova →
  painel de localização → CTA em painel → FAQ.
- A inversão para superfície clara no processo é a quebra de ritmo principal.

## 4. Hero

Arquétipo `asymmetric`: mídia dominante do galpão à direita, painel de texto
deslocado à esquerda. Não é banner centralizado. Headline fala de indicação
("a oficina do bairro que o cliente indica para o vizinho"), sustentada pelas
avaliações públicas citadas na própria página.

## 5. `signatureMoments`

1. Hero assimétrico com o galpão real sangrando na borda.
2. Índice editorial numerado de atendimento, sem cartões iguais.
3. Linha do tempo do agendamento em superfície clara, com coluna fixa.

## 6. `qualityProfile`

```text
visualDensity: média-alta · editorialDepth: alta · motionIntensity: BALANCED
mediaRichness: alta (4 fotos reais) · proofLevel: alto (105 avaliações públicas)
interactionLevel: médio · localContext: alto · conversionIntensity: média-alta
```

## 7. Mídia

Somente fotos públicas da ficha do Google, com atribuição visível
(`GOOGLE_PUBLIC_LISTING_PHOTO`, `rights: THIRD_PARTY_PUBLIC_SOURCE`,
`usageMode: ATTRIBUTED_EDITORIAL_USE_FROM_PUBLIC_SOURCE`). Essas fotos foram
publicadas por terceiros: autorização do proprietário do negócio **não**
transfere direito autoral nem cria licença. O uso é editorial, com fonte e
atribuição declaradas, e existe plano de substituição por foto enviada pelo
cliente ou mídia contextual própria. Street View descartado. Fotos com
placa/telefone rebaixadas a referência. Nenhuma imagem gerada representa a
oficina, a equipe ou serviços executados. Capa `PHOTO_DERIVED`: foto do galpão
com overlay e tipografia factual.

## 8. Motion narrative

Linguagem de oficina: entradas retas e sequenciais, sem flutuação, variando o
sentido de entrada por seção (up, fade, scale, left, right). A foto do hero
ganha profundidade leve só no desktop, o número verificado de avaliações é
revelado por contagem, os cartões respondem ao cursor e a linha do tempo avança
como esteira conforme o scroll. `prefers-reduced-motion` remove deslocamento,
parallax, contagem e progresso, mantendo todo o conteúdo (fallback
`opacityOnly`).

## 9. Conversão

`contactMode: funnelOnly`, `funnelType: agendamento`. Telefone aparece como
informação institucional, jamais `tel:`, WhatsApp ou botão de ligar. Única
exceção de link externo: Google Maps. CTAs contextuais: "Descrever o problema
do carro", "Começar o agendamento", "Falar sobre o meu carro".

## 10. Proibições assumidas

Sem preço, prazo, garantia, tempo de mercado institucional, marcas atendidas,
número de clientes, depoimento escrito por nós ou Instagram como canal oficial
(candidato `moreiraautomecanica` segue `UNVERIFIED`).
