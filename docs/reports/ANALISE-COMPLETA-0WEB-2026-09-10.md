# Análise completa — 0web.com.br (10/09/2026)

Tudo aqui foi medido ao vivo hoje. Nada é estimativa.

---

## 0. ACHADO CRÍTICO — o DNS do domínio está falhando

Este é o problema mais grave do site e explica quase tudo o resto.

Os servidores de DNS do domínio (`ns1.hosteg.com.br` e `ns2.hosteg.com.br`,
IPs `74.1.21.5` e `74.1.20.5`) **não respondem**.

Medições:

| Teste | Resultado |
|---|---|
| Consulta pelo DNS do Google (8.8.8.8) | **SERVFAIL** — "No Reachable Authority" |
| Consulta direta aos servidores do domínio | **timeout** nos dois |
| Tempo para resolver o nome | **4,0 segundos** (concorrente 0web.site: 0,03 s) |
| Consulta pela Cloudflare (1.1.1.1) | responde `185.158.133.1`, mas **só de cache**, TTL restante ~3 h |

O que isso significa na prática:

1. Quem usa o DNS do Google (parcela enorme dos brasileiros e o próprio
   Googlebot) **pode simplesmente não conseguir abrir o site**.
2. Cada visita que funciona perde 4 segundos só para descobrir o endereço,
   antes de qualquer carregamento.
3. Quando o cache da Cloudflare expirar, o site fica inacessível também
   por lá.
4. **É a explicação mais provável das 462 páginas "detectadas, não
   indexadas"**: o Google descobriu as URLs, tentou rastrear, não resolveu
   o domínio e desistiu.

**Ação imediata (fora do código, no painel do domínio):** trocar os
servidores de DNS no Registro.br por um provedor estável (Cloudflare DNS é
gratuito) ou exigir da Hosteg a normalização imediata. Enquanto isso não for
feito, nenhuma melhoria de SEO, conteúdo ou capa produz resultado.

---

## 1. Experiência do usuário e design

Medido em 393×852 (celular) e 1440×1400 (computador), site publicado.

**Bom**
- Sem rolagem lateral em nenhum dos dois tamanhos.
- Zero erros de console.
- 26 imagens, apenas 1 sem texto alternativo.
- Um único H1 por página, hierarquia de títulos coerente.

**Ruim**
- Carregamento total de **7,9 s no celular** e 6,7 s no computador — sendo
  4 s só de DNS. Resolvido o DNS, cai para faixa aceitável.
- Página inicial com **26 links/botões clicáveis** e pelo menos 6 CTAs
  diferentes ("Solicitar Diagnóstico", "Falar com especialista", "Quero Mais
  Clientes Agora", "Obter Orçamento Gratuito", "Ver Serviços", "Solicitar
  diagnóstico gratuito"). Excesso de opções dispersa a decisão.
- O título principal muda entre celular e computador ("Mais clientes. Menos
  esforço." vs "Sua empresa merece mais que apenas um site."). Duas promessas
  diferentes para o mesmo produto enfraquecem a mensagem.
- 60 páginas do portfólio ainda têm contraste de texto abaixo do mínimo
  legível (467 trechos, auditoria axe-core de 92 rotas).

## 2. Conteúdo e comunicação

**Bom**
- Linguagem brasileira, direta, orientada a dor ("Sua empresa está perdendo
  clientes sem perceber?").
- Blocos de serviço com benefício claro em cada card.
- Seção "Projetos no ar" com sites reais visitáveis — prova social honesta e
  rara no setor.

**Ruim**
- **Não há preço em lugar nenhum da página inicial.** Para pequeno negócio
  brasileiro, preço ausente é o principal motivo de abandono.
- Sem prazo de entrega declarado.
- Sem depoimentos nomeados nem logos de clientes na home.
- "Resultados que somam" sem números verificáveis ao lado.
- 42 projetos do portfólio ainda sem foto real do cliente.

## 3. SEO técnico e on-page

**Bom** (verificado)
- Renderização no servidor: o Google recebe o conteúdo pronto.
- `robots.txt` correto, sem bloqueios indevidos.
- Mapa do site único e bem formado; 189 URLs de portfólio.
- 3 blocos de schema.org na home (Organization, Service, FAQ).
- Título e descrição próprios, URLs limpas, viewport e idioma corretos.
- Home indexada e canônica correta no Search Console.

**Ruim**
- **0 cliques e 19 impressões** em 28 dias. Posição média 9,5.
- As buscas que trazem impressão são "0web" — ou seja, só marca.
- ~462 páginas descobertas e não rastreadas (ver item 0).
- Semrush: 3 palavras-chave orgânicas no Brasil. O concorrente 0web.site tem
  2 palavras, mas **414 backlinks de 199 domínios**; a 0WEB não tem perfil de
  links comparável registrado.
- Muitas páginas regionais programáticas parecidas entre si competindo pelo
  mesmo rastreamento.

## 4. Ofertas e diferenciação

Diferenciais reais que a 0WEB tem e **não está comunicando com força**:
- portfólio de sites reais no ar, cada um com identidade própria;
- funil de contato individual por cliente, não WhatsApp genérico;
- infraestrutura própria com medição, painel de leads e SEO por região.

O que falta para vencer o concorrente na decisão de compra:
- preço de entrada visível;
- prazo de entrega;
- o que exatamente está incluso em cada plano;
- comparativo honesto "site comum × site 0WEB".

## 5. Confiança e credibilidade

Páginas verificadas ao vivo:

| Página | Situação |
|---|---|
| `/sobre` | 200 OK |
| `/contato` | 200 OK |
| `/faq` | 200 OK |
| `/privacidade` | 200 OK |
| `/termos` | 200 OK |
| `/lgpd` | 200 OK |
| `/planos` | 200 OK |
| `/politica-de-privacidade`, `/termos-de-uso`, `/precos` | 301 (redirecionam) |

SSL válido e ativo. CNPJ publicado no schema. Estrutura institucional
completa — este é um ponto forte consolidado.

Falta: endereço físico visível, foto da equipe e depoimentos com nome.

## 6. Conversão e geração de leads

**Bom**
- Funil em modal, sem tirar o visitante da página.
- Nenhum telefone ou e-mail exposto no código (495 arquivos verificados) —
  protege contra robôs de spam.
- Oferta de diagnóstico gratuito bem posicionada.
- Painel interno de leads por projeto já existe.

**Ruim**
- Excesso de CTAs concorrentes dilui a taxa de conversão.
- Não há captura leve alternativa (ex.: "receba a proposta por WhatsApp em
  1 minuto") para quem não quer preencher formulário.
- Sem prova de tempo de resposta ("respondemos em até X horas").

## 7. Plano de ação por prioridade

**Agora (hoje, fora do código)**
1. Corrigir os servidores de DNS. Sem isso, nada mais importa.

**Semana 1**
2. Definir um CTA primário único na home e rebaixar os demais.
3. Unificar o título principal entre celular e computador.
4. Publicar faixa de preço e prazo de entrega.

**Semana 2–3**
5. Reduzir o mapa do site às páginas com conteúdo próprio; marcar as
   combinações região×segmento vazias como não indexáveis.
6. Corrigir os 467 trechos de contraste.

**Contínuo (depende de material do cliente)**
7. Fotos reais e depoimentos autorizados dos 42 projetos pendentes.
8. Construção de links: perfil no Google, parcerias, presença nos sites dos
   próprios clientes.

## 8. Como superar o 0web.site

O concorrente ganha hoje em uma coisa só: **links e disponibilidade**. Em
conteúdo, portfólio e infraestrutura a 0WEB é superior. A ordem para virar o
jogo é: corrigir o DNS → mostrar preço e prazo → concentrar o SEO em poucas
páginas fortes → construir links reais.
