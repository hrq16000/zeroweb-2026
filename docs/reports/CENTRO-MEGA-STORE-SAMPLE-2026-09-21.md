# Centro Mega Store — evolução autônoma da amostra

Data: 2026-09-21  
Slug: `/portfolio/centro-mega`  
Client key: `centro-mega`

## Objetivo

Transformar a presença anterior da Centro Mega em uma **amostra espetacular de loja virtual**, usando social commerce como matéria-prima e preservando factualidade, performance e isolamento do funil.

A arquitetura escolhida é:

`SOCIAL/FONTE → PRODUTO → FILTRO/BUSCA → SACOLA → FUNIL INDIVIDUAL → CONFIRMAÇÃO HUMANA`

## O que foi implementado

- hero imersivo neon-retail;
- ticker de departamentos;
- catálogo pesquisável e filtrável;
- cards com motion/depth/glow;
- produtos sociais evidence-first;
- catálogo complementar de produtos do seller público;
- sacola local;
- drawer da sacola;
- sticky cart;
- carryover dos produtos ao funil;
- social feed com links oficiais já versionados;
- seção de presença/unidades derivada do Linktree;
- schema específico de loja;
- SEO/localidade atualizados;
- motion profile `IMMERSIVE / NEON_RETAIL_DROP`.

## Produtos sociais

Produtos criados a partir de texto público atribuível à Centro Mega:

- POCO X5 Pro 8 GB / 256 GB — post de 25/01/2024;
- Tênis Dunk Low Pro — posts de 08/11/2023.

O preço do POCO aparece somente como **referência histórica do post**. Nenhum preço/estoque social é tratado como atual.

## Instagram

Seis URLs oficiais já existentes no projeto foram preservados na experiência. A camada pública disponível nesta rodada não permitiu ler captions com segurança. Logo:

- URL oficial = pode aparecer como publicação;
- caption ilegível = não gera SKU;
- nenhuma inferência visual foi promovida a produto.

## Catálogo complementar

O seller público Centro Mega em marketplace foi usado para demonstrar variedade com nomes de produtos verificáveis. Nenhuma foto externa foi copiada e nenhum preço temporário foi persistido como atual.

## Efeitos e recursos

A solicitação pedia leve exagero visual. A resposta usa o máximo pertinente da stack existente:

- `MotionScope IMMERSIVE`;
- `MotionTextReveal`;
- `MotionImageReveal`;
- `MotionParallax` desktop;
- `MotionCard`;
- `MotionSwap`;
- `MotionOverlay`;
- glow/gradientes/grid/blur;
- hover depth;
- drawer e sticky sacola.

Não foi adicionada dependência de GSAP/Three/WebGL. Reduced motion continua fail-open.

## Funil

- `clientKey=centro-mega`;
- `funnelIntent=pedido`;
- `contactMode=funnelOnly`;
- itens da sacola passam em `initialAnswers.service` e `orderContext.order_items`;
- o funil confirma preço, estoque, variante, unidade e entrega;
- nenhum número de outro cliente foi introduzido;
- nenhuma compra é simulada como concluída sem confirmação.

## Evidência e mídia

- assets oficiais/anteriores da Centro Mega foram preservados;
- cards de produto usam arte gráfica original por CSS/ícones;
- fotos de marketplace/social não foram republicadas;
- post social sem texto legível não virou produto;
- bonés entram como categoria informada pelo responsável, sem SKU falso.

## Estado de publicação

Este relatório não presume PASS. A publicação depende do head final passar os gates aplicáveis e do preview do runtime final ficar utilizável.
