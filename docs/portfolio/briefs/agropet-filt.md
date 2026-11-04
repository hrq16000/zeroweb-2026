# Agropet Filt — Creative Composition Brief V2

Data: 04/11/2026. Portfólio autorizado pelo operador nesta conversa, sem domínio próprio e sem validação de marca gráfica oficial. O logotipo é uma **proposta editorial 0WEB**, não a reprodução de marca da loja.

## Identidade / conteúdo
- Nome: AVIÁRIO AGROPET FILT / Agropet Filt.
- Rua Monteiro Lobato, 160, Vargem Grande, Pinhais, PR, CEP 83321-260.
- Horário divulgado em dois diretórios: seg–sáb 08h30–19h30, domingo fechado. Confirmar feriados/alterações.
- Segmentos mencionados: rações, aviário e artigos para aves, petiscos, acessórios, artigos de pesca, jardinagem, banho e tosa.
- Telefone público (41) 99823-6598: **não validado como WhatsApp** e **não usado como destino**.
- Google reviews: 5,0 em 4 avaliações do perfil localizado. Não incorporar AggregateRating sem provenance detalhada e revisão.
- Instagram: não encontrado um perfil oficial verificado; seis posts = não aplicável até identificação confirmada.
- Mídia real local: não encontrada com licença confirmada. Ilustração 0WEB não simula loja, equipe, cliente, produtos reais nem instalações.

Fontes: https://ondepet.com/pet-shops/pinhais/aviario-agropet-filt/ ; https://www.locaisdobrasil.com.br/encontre/pet-shop-perto-de-mim-em-pinhais-pr?pagina=6

## Posição / referência
Realeza Pets possui plataforma de perfis de pets, webcam, loja, aulas e avaliações. Não igualar comparações não medidas. A Agropet Filt pode ser mais direta para a intenção **comprar ração, artigos para aves, acessórios e consultar disponibilidade**. Não copiar marca ou composição.

## Três direções pesquisadas
1. Luxo/banho (REJECTED): se aproxima da marca Realeza e reduz o negócio.
2. Supermercado ecommerce (REJECTED): requer inventário e preços não fornecidos.
3. Editorial local + mosaico de categorias e guia do pet (SELECTED): fiel às descrições e usável sem estoque inventado.

## Composition Fingerprint
- Hero 53/47 pôster vetorial com cão/ave + nome local.
- Marquee de seis categorias, mosaico 3×2 com decisões explícitas e painel-guia.
- Percurso de origem factual e diagrama declarado como **ilustrativo**, seguido de endereço externo Google Maps.
- CTAs por interesse abrem fluxo próprio; assinatura reduzida nas telas móveis.
- Paleta: verde floresta #153A2F, lima #D9F48A, terracota #EF9162 e papel #F5F4E8.
- Tipografia sans arredondada com ênfase serif editorial.
- Motion leve, reduced motion obrigatório, contraste funcional e min 44px para ações.
- Assets: logo.svg, capa-card.svg, social-og.svg = BRAND_ART / EDITORIAL, sem alegação factual.

## Funil e canal
- Página publica formulário integrado ao `submitPortfolioQuiz` server-side da 0WEB, captura consentimento e grava lead com protocolo.
- `clientKey = agropet-filt`; registro exclusivo da empresa no catálogo e chave de roteamento.
- `whatsapp = null` até confirmação do destino WhatsApp pela empresa. A conclusão é lead-only, sem fallback de outro cliente.
- Registrar um lead real somente após teste operacional explícito; build/CI não comprovam armazenamento em Supabase.

## QA e riscos
- Checar SSR 200 + head canonico + sitemap, prebuild, CI, imagem, funil e rate-limit.
- Dados mutáveis (horário, serviços, preço, estoque) ficam sujeitos a confirmação.
- OG vetorial único ainda exige compatibilidade real em redes sociais. Substituir por JPG/PNG 1200×630 na finalização do kit social, se necessário.
- Tempo de produção deve ser medido em PRs futuros; meta de 1 hora não equivale a prova.
