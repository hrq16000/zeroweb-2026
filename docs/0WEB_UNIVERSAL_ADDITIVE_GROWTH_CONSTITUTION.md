# 0WEB — Constituição Universal de Crescimento Aditivo

Status: **normativo, global e obrigatório**  
Escopo: **todo o portal 0WEB, todos os projetos atuais e futuros, todas as rotas `/portfolio/:slug`, hubs, diretórios, páginas locais, serviços, landing pages, automações, agentes, pipelines e integrações de publicação.**

Esta norma existe para transformar uma intenção que antes aparecia espalhada em vários padrões numa regra única de execução:

> **Evoluir a 0WEB significa somar valor. Preservar o que já funciona, enriquecer o que existe, aumentar autenticidade, ampliar descoberta local, elevar apresentação, criar diversidade e deixar o próximo projeto melhor e mais autônomo que o anterior.**

Ela deve ser lida antes de qualquer alteração material em portfólio, SEO, diretório local, conteúdo, mídia, pesquisa pública, geração autônoma ou experiência visual.

---

## 1. Modelo de produto

A 0WEB não é apenas uma vitrine de sites.

Ela deve funcionar simultaneamente como:

1. **mega diretório / guia comercial local**, orientado a prestadores e pequenos comércios;
2. **motor de descoberta por proximidade**, bairro → cidade → região → alternativas relacionadas;
3. **portfólio vivo**, onde cada negócio recebe uma presença digital rica e convincente;
4. **amostra comercial da capacidade 0WEB**, capaz de fazer o proprietário perceber valor antes da contratação;
5. **rede de SEO e entidades**, conectando negócios, serviços, localidades, categorias e intenções reais;
6. **fábrica autônoma de novos projetos**, na qual cada novo cliente herda infraestrutura, pesquisa, mídia, SEO, funil e gates — mas nunca um layout visual engessado.

A experiência desejada para um prospect é:

> **“Se a amostra já está neste nível, o projeto contratado pode ir ainda mais longe.”**

Esse efeito deve vir de qualidade real de composição, conteúdo, mídia, contexto local, utilidade, identidade, interação e acabamento — nunca de alegações enganosas.

---

## 2. Princípio universal: evolução aditiva

A regra padrão é:

**ADICIONAR > ENRIQUECER > CONECTAR > ORGANIZAR > MELHORAR > PRESERVAR.**

Em qualquer página existente:

- preservar conteúdo útil já publicado;
- preservar referências, mídia, identidade, sabores, serviços, bairros, cardápios, catálogos, horários, preços e demais detalhes já aprovados ou fornecidos;
- adicionar nova informação ao redor do conteúdo existente;
- aumentar profundidade sem apagar personalidade;
- complementar lacunas com contexto, navegação, ilustração, mídia, dados estruturados, FAQ, decisões, filtros, mapas, categorias e links internos;
- melhorar apresentação e organização sem reduzir riqueza;
- usar versionamento/changelog para correções necessárias.

### 2.1 Remoção é exceção

Não remover conteúdo, referência ou detalhe existente apenas para “simplificar SEO”, “reduzir risco” ou uniformizar páginas.

Remoção só é aceitável quando houver pelo menos um destes gatilhos:

1. pedido explícito do responsável;
2. dado comprovadamente incorreto, desatualizado ou pertencente a outra entidade;
3. violação de segurança, privacidade, direito autoral/licença ou política aplicável;
4. regressão técnica real;
5. duplicação que prejudique a operação e cuja consolidação preserve o conteúdo útil;
6. conteúdo marcado para expiração por uma política de freshness já existente.

Mesmo nesses casos, preferir **corrigir, atualizar, versionar, rotular ou substituir com rastreabilidade** em vez de simplesmente apagar.

### 2.2 Conflito entre fonte nova e conteúdo existente

Quando uma fonte nova divergir do conteúdo já existente:

- não assumir automaticamente que o conteúdo antigo está errado;
- registrar o conflito;
- procurar fonte adicional;
- usar dados fornecidos pelo proprietário como fonte prioritária quando aplicável;
- manter a informação existente até haver base suficiente para corrigi-la;
- registrar a decisão no PR/brief/enrichment file.

---

## 3. Diretório local e descoberta por proximidade

A navegação e o SEO devem tratar localidade como parte central do produto.

Exemplo de intenção:

> Uma pessoa no **Jardim Itália, São José dos Pinhais/PR** deve encontrar primeiro prestadores, comércios e serviços realmente relacionados a esse bairro/cidade; depois alternativas próximas e semanticamente relevantes.

### 3.1 Ordem recomendada de relevância local

Quando houver dados suficientes:

1. mesmo bairro;
2. bairros adjacentes / mesma região local;
3. mesma cidade;
4. Região Metropolitana / cidades próximas;
5. mesmo estado;
6. mesma categoria/segmento fora da região, como descoberta complementar.

Nunca falsificar distância física ou “perto de você”. A ordenação deve usar localização conhecida da entidade e contexto real da rota/usuário quando disponível.

### 3.2 Grafo comercial

Cada negócio publicado deve poder participar de um grafo composto por:

- entidade/marca;
- categoria;
- serviços/produtos;
- bairro;
- cidade;
- região/estado;
- posts sociais;
- imagens;
- cardápio/catálogo;
- portfólio/trabalhos;
- perguntas frequentes;
- links para negócios relacionados;
- hubs locais e temáticos.

O objetivo é aumentar descoberta e utilidade sem transformar o portal em um conjunto de doorway pages.

### 3.3 Hubs locais

Hubs de bairro/cidade/região devem:

- priorizar negócios reais já existentes no catálogo;
- mostrar diversidade de categorias;
- permitir expansão progressiva;
- ganhar conteúdo próprio, navegação e contexto local;
- conectar-se bidirecionalmente aos negócios;
- crescer à medida que novas entidades entram no portal.

---

## 4. Novo projeto: nasce rico por padrão

Todo novo portfolio deve iniciar com o máximo de informação legítima que possa ser resolvida autonomamente, sem depender do responsável para orquestrar detalhes repetitivos.

O pipeline deve pesquisar e, quando aplicável, integrar:

- site oficial;
- Google Business/Maps e outras fontes públicas permitidas;
- Instagram;
- Facebook;
- TikTok/YouTube/Linktree e redes oficiais;
- últimas 6 publicações oficiais do Instagram quando o perfil público existir;
- logo e identidade;
- fotos reais de produtos, ambiente, fachada, trabalhos e equipe quando publicadas oficialmente;
- endereço/localidade;
- serviços/produtos;
- cardápio/catálogo;
- horários;
- formas de atendimento;
- diferenciais;
- perguntas frequentes;
- conteúdo textual;
- referências de estilo;
- mapas;
- mídia de campanhas e materiais fornecidos pelo proprietário.

Bloqueio de uma fonte não encerra a pesquisa: seguir a escada definida em `PORTFOLIO_PUBLIC_MEDIA_INGESTION_STANDARD.md`.

---

## 5. Autenticidade visual e efeito “amostra premium”

Cada `/portfolio/:slug` deve parecer um projeto próprio.

O sistema compartilha engenharia, não composição.

### 5.1 A amostra deve vender capacidade

Uma página de amostra deve demonstrar:

- direção de arte;
- identidade;
- hero forte;
- storytelling;
- imagens reais sempre que possível;
- motion e microinterações coerentes;
- conteúdo profundo;
- catálogo/menu/galeria quando cabível;
- contexto local;
- funil funcional;
- SEO;
- mobile;
- performance;
- acabamento visual;
- caminhos claros de conversão.

A amostra não deve parecer “versão capada”. Ela deve mostrar o potencial do negócio e da 0WEB.

### 5.2 Diversidade obrigatória

Dois projetos não podem ser percebidos como o mesmo site recolorido.

Variar conscientemente:

- geometria do hero;
- ritmo de página;
- tipografia;
- composição;
- grid;
- cards;
- densidade;
- mídia;
- motion;
- navegação;
- CTA;
- fechamento;
- storytelling;
- recursos interativos.

---

## 6. Conteúdo: máximo de utilidade, mínimo de perda

Conteúdo existente é ativo.

Ao evoluir uma página:

- expandir em vez de resumir;
- criar blocos novos em vez de substituir blocos bons;
- preservar referências específicas fornecidas pelo cliente;
- adicionar contexto, exemplos, perguntas, passos, filtros e decisões;
- incorporar materiais adicionais enviados depois;
- enriquecer progressivamente.

Cardápios, preços, sabores, serviços, fotos, endereços, bairros e outras referências podem ser mantidos e ampliados quando vierem do cliente ou de fonte legítima já adotada no projeto.

### 6.1 Dados ilustrativos / demonstração

Dados fictícios podem existir apenas como **conteúdo ilustrativo claramente rotulado** em protótipos/amostras, quando não puderem ser confundidos com fatos reais.

Permitido:
- “Exemplo de avaliação”;
- “Demonstração de como apareceriam depoimentos”;
- produtos/cenários ilustrativos marcados como exemplo;
- imagens geradas/contextuais que não finjam registrar um fato real.

Não permitido:
- fabricar avaliação e apresentá-la como se viesse do Google;
- inventar rating, review count, prêmio, certificação ou depoimento atribuído a uma pessoa real;
- usar logo/identidade do Google para transformar uma simulação em prova social falsa;
- inventar endereço, obra, cliente, equipe ou resultado e apresentá-lo como ocorrido.

Se houver reviews reais, usar os reais com provenance.

---

## 7. Mídia social e imagens oficiais

Para negócio com redes sociais públicas:

- mídia oficial é recurso prioritário;
- Instagram/Facebook devem ser tratados como fontes vivas;
- posts devem manter vínculo/permalink de origem;
- usar as últimas 6 publicações oficiais do Instagram quando aplicável;
- fotos reais de produtos/trabalhos têm precedência sobre placeholders;
- registrar provenance;
- versionar mídia quando permitido e tecnicamente apropriado;
- nunca depender apenas de iframe frágil quando o projeto já possui estratégia de ingestão/versionamento.

Esta regra é retroativa para projetos atuais em qualquer rodada material.

---

## 8. SEO e indexação: objetivo universal

A meta operacional é:

> **100% das páginas que fazem parte da superfície pública de descoberta e possuem conteúdo suficiente devem estar tecnicamente aptas à indexação e integradas à rede de descoberta.**

Isso inclui:

- Google;
- Bing;
- outros mecanismos compatíveis com sitemap, robots, dados estruturados e protocolos de submissão suportados.

A implementação deve usar:

- canonical;
- `index,follow` nas páginas públicas elegíveis;
- sitemap atualizado;
- SSR/indexabilidade real;
- JSON-LD coerente;
- links internos;
- hubs de categoria/localidade;
- GSC e ferramentas equivalentes;
- IndexNow quando aplicável;
- monitoramento de descoberta/indexação;
- conteúdo original;
- media-rich pages;
- titles/descriptions únicos;
- imagens com alt;
- hierarquia semântica;
- rede comercial/local.

### 8.1 Indexação não é sinônimo de conteúdo mínimo

Não reduzir uma página para satisfazer um gate.

Quando uma URL pública importante estiver fora do índice:

1. verificar rastreabilidade;
2. verificar links internos;
3. verificar sitemap/canonical/robots;
4. verificar profundidade e originalidade;
5. verificar mídia e entidade;
6. verificar relação com hubs;
7. enriquecer;
8. reenviar/monitorar.

A estratégia preferencial é **melhorar a página**, não empobrecê-la.

### 8.2 Páginas utilitárias

Formulários, estados internos, rotas técnicas e páginas sem intenção de descoberta podem ter política própria. Isso não deve ser confundido com retirar do índice páginas comerciais, locais, editoriais ou de portfólio que podem ser enriquecidas.

---

## 9. Autonomia e efeito cumulativo

Toda melhoria deve aumentar a autonomia do sistema.

Se uma correção for útil para vários projetos, preferir:

1. contrato universal;
2. configuração central;
3. gerador/scaffold;
4. gate;
5. teste;
6. automação;
7. documentação;
8. somente por último, correção manual repetida slug a slug.

Um projeto novo deve nascer melhor porque os projetos anteriores ensinaram o sistema.

---

## 10. Regra para agentes, Codex, ChatGPT, Lovable e automações

Qualquer agente que atuar na 0WEB deve assumir, por padrão:

- **preservar + enriquecer**;
- não redesenhar ou remover material bom sem gatilho real;
- pesquisar antes de declarar ausência de informação;
- aproveitar mídia oficial pública;
- usar contexto local;
- maximizar recursos relevantes;
- manter identidade do cliente;
- tratar amostra como demonstração premium;
- manter funil e isolamento multi-tenant;
- documentar decisões;
- evitar retrabalho;
- transformar repetição em sistema.

Se houver dúvida entre “simplificar” e “enriquecer”, a direção padrão é **enriquecer com qualidade**.

---

## 11. Gates universais

Uma alteração material só está alinhada quando responde “sim” ao conjunto aplicável:

- preservou conteúdo útil existente?
- acrescentou valor perceptível?
- aumentou autenticidade?
- aumentou utilidade?
- melhorou descoberta local/temática?
- manteve identidade e composição próprias?
- usou mídia real disponível?
- manteve/fortaleceu funil?
- manteve SEO técnico?
- melhorou mobile/acessibilidade/performance ou ao menos não regrediu?
- deixou a próxima execução mais autônoma?
- registrou provenance quando necessário?
- evitou prova social ou fatos falsamente apresentados como reais?

Falha em remover valor existente sem justificativa reprova a rodada:  
`ADDITIVE_EVOLUTION_REGRESSION`.

---

## 12. Relação com os demais padrões

Esta constituição não substitui os padrões especializados; ela define a **direção de evolução** que todos eles devem obedecer.

Especialmente:

- `PORTFOLIO_GLOBAL_STANDARDS.md`;
- `PORTFOLIO_AUTONOMOUS_FACTORY_STANDARD.md`;
- `PORTFOLIO_UNIVERSAL_QUALITY_CONTRACT.md`;
- `PORTFOLIO_UNIVERSAL_SEO_STANDARD.md`;
- `PORTFOLIO_PUBLIC_MEDIA_INGESTION_STANDARD.md`;
- `PORTFOLIO_SOCIAL_LATEST_SIX_STANDARD.md`;
- `PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`;
- `PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD.md`;
- `PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`;
- `PORTFOLIO_SAMPLE_MODE.md`;
- `PORTFOLIO_EVOLUTION_NO_REGRESSION.md`;
- `PORTFOLIO_PROJECT_LIFECYCLE.md`.

Em conflito de interpretação sobre evolução de conteúdo/experiência, aplicar esta ordem:

1. segurança/privacidade/legal;
2. instrução explícita atual do responsável;
3. esta Constituição de Crescimento Aditivo;
4. padrões especializados;
5. defaults técnicos.

---

## 13. Definição curta

**0WEB cresce por acumulação de qualidade.**

Mais negócios.  
Mais contexto local.  
Mais conteúdo.  
Mais mídia real.  
Mais diversidade.  
Mais utilidade.  
Mais descoberta.  
Mais interligações.  
Mais autonomia.  
Mais qualidade.

Sem transformar evolução em apagamento.
