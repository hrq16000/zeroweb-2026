# Creative Composition Brief — Cantinho da Tia Mari (prospecção 0WEB)

- **Data:** 2026-11-06 · **Slug desejado:** `cantinho-da-tia-mari` · **clientKey proposto:** `cantinho-da-tia-mari`
- **Localidade:** Rua Pedro Alves da Rocha, 200, Jardim Itália, São José dos Pinhais/PR, CEP 83020-360.
- **Escopo:** proposta demonstrativa não oficial, ainda não publicada, sem representar contrato, autorização da proprietária ou confirmação de matrícula.
- **Evidência prioritária:** cinco fotos do panfleto recebidas pelo operador, com o logotipo/wordmark e uma colagem de ambientes. O usuário autorizou a utilização desse material para a amostra.
- **Dados anunciados:** berçário, leva e busca em escola/CMEI, seg-sex 06h30–20h, sábado 07h30–17h, vagas abertas e alegação de alvará de funcionamento. **Horários, vagas e alvará não foram verificados de forma independente.**
- **Dados encontrados online:** cadastro de endereço de empresário individual com atividade de recreação, mas sem prova de vínculo com a marca. **Não vincular CNPJ/razão social ao negócio na página** sem evidência adicional.
- **Redes sociais:** buscas realizadas em Google/Maps, Instagram, Facebook, nome, endereço e número do panfleto; nenhum perfil oficial inequívoco encontrado. Últimas seis publicações: `NOT_APPLICABLE` até identificação verificável de perfil.
- **Avaliações, preços, idade mínima/máxima, alimentação, transporte, segurança e número de vagas:** não encontrados/verificados. Não inventar.

## Narrativa e direção visual autoral

**Personalidade:** infantil, delicada, otimista e acolhedora; linguagem dirigida a responsáveis, sem promessas pedagógicas ou regulatórias não comprovadas.

**Conceito criativo:** \"O lugar dos pequenos grandes dias\". Inspirado na composição multicolorida do material impresso, porém com arquitetura editorial independente, não cópia do panfleto ou de outras páginas.

**Visual metaphor:** adesivos de sol/borboleta/arco-íris, fotos reais da fachada como hero editorial com recorte inclinado; mosaico de ambientes no meio do percurso.

**Paleta:** violeta #673c85, lilás #ede2f8, rosa #ee9bbf, amarelo #f5d977 e creme #fff9ee. Tipografia display amigável Fredoka (ou fallback local); legibilidade DM Sans.

**Macro-layout:** hero assimétrico fotografia tipografia, faixa de contexto, 3 módulos por intenção (berçário, horário, leva e busca), mosaico real de ambientes, horário contrastante, mapa, FAQs, fechamento. Mobile: coluna única, CTA persistente não intrusivo.

**Fingerprint:** `butterfly-label→split-photo-hero→three-care-paths→real-flyer-photo-mosaic→purple-hours-stage→address-map→family-questions→bright-close`. Não replicar composição pet/oficina/beleza.

**Media cadence:** foto real da fachada no hero, 3 fotos distintas dos ambientes internos no mosaico, elementos gráficos abstratos apenas para decoração. Não gerar imagens fingindo representar instalações, crianças, colaboradores ou procedimentos.

**Motion:** float sutil de ícone, reveal progressivo, card lift mínimo; `prefers-reduced-motion` obrigatório. Sem parallax intenso ou animação que prejudique leitura.

**Conversão:** interesse em vagas, com etapas tipo de atendimento → período desejado → momento pretendido → identificação/contato apenas com consentimento explícito. Não pedir dados de crianças em fase de prospecção. Persistir lead server-side e exibir confirmação; redirect WhatsApp somente após gravação e destino autenticado. Até configurar destino, funil deve permanecer **demonstração** sem coletar dados ou exibir link direto.

**SEO:** título individual focado em Cantinho da Tia Mari + Jardim Itália, canonical `https://0web.com.br/portfolio/cantinho-da-tia-mari`, OG própria com imagem real, JSON-LD LocalBusiness genérico (não inferir credenciamento escolar), mapa no endereço do panfleto, sitemap/hubs após aprovação de readiness e publicação efetiva.

## Três propostas avaliadas

1. *Afeto editorial* — grande fotografia real com moldura inclinada, adesivos artesanais, ritmo lilás/creme; **selecionada** por correspondência ao panfleto.
2. *Mini caderno de rotina* — linhas de caderno, cards organizados por horário e interesse; rejeitada por excesso de UI de agenda não disponível.
3. *Parque cromático* — mosaico lúdico com ícones grandes; rejeitada por reduzir o protagonismo das fotos reais do estabelecimento.

## Resource effort ledger e skills

- Usados: skill-router do 0WEB, norma de SEO individual, lifecycle, playbook, evidência do panfleto, Google/Maps, busca de redes e CNPJ para contraste, composição autoral, UX de funil e acessibilidade.
- Rejeitados: imagens genéricas de outras escolas, depoimentos sem origem, perfis homônimos e supostos CNPJs não comprovados.
- Pendente: publicação integrada apenas após cópia das fotos reais para assets versionados, implementação do componente autoral, funil seguro, manifesto v4, readiness, CI e deploy real Vercel/0web. Sem mexer no DNS ou nos arquivos institucionais congelados.

## Status verificável

- [x] Pesquisa pública inicial e avaliação de evidências
- [x] Creative composition brief e desenho da jornada
- [x] Amostra independente entregue ao operador (ZIP com HTML + fotografias recortadas)
- [ ] Upload das fotos para `public/images/cantinho-da-tia-mari/`
- [ ] Componente e rota autorais integrados ao app com backend de leads validado
- [ ] Manifesto, catálogo, rede de descoberta, sitemap e SEO/OG publicados
- [ ] Rodar gates e inspeção em domínio de produção; GSC após URL real

A amostra standalone **não** deve ser apresentada como URL oficial, indexação concluída ou lead persistido.
