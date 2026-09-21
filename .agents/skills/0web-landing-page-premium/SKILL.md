---
name: 0web-landing-page-premium
description: Camada aditiva para transformar cada nova landing/portfolio da 0WEB em um mini-site completo, original, modular, evidence-first, mobile-first e orientado à conversão, sem substituir as skills de direção criativa, decisão, recursos, funil ou QA já existentes.
---

# 0WEB Landing Page Premium

Esta skill **soma entendimento** ao sistema existente. Ela não substitui:

- `0web-experience-design-max`;
- `0web-portfolio-art-direction`;
- `0web-landing-experience`;
- `PORTFOLIO_ZERO_GENERIC_STANDARD`;
- Landing Decision Intelligence;
- Resource Utilization;
- regras de funil/isolamento;
- quality gates.

Seu papel é garantir **completude de presença digital + arquitetura adaptativa + coerência de experiência**.

## 1. Princípio central

Cada landing deve parecer o site profissional completo daquela marca, empresa, profissional, evento ou projeto.

A sensação correta é:

> “entrei no ambiente digital desta empresa”

e não:

> “entrei em um template da 0WEB preenchido com outro nome”.

A landing pode estar tecnicamente hospedada dentro da 0WEB, mas visualmente, editorialmente e narrativamente deve pertencer ao cliente.

## 2. Regra anti-template

Teste obrigatório:

> Se for possível trocar apenas nome e cor e a página continuar servindo para outro cliente, ela ainda está genérica demais.

Quando isso acontecer, revisar:

- composição;
- arquitetura;
- conteúdo;
- mídia;
- narrativa;
- densidade;
- ritmo;
- tipografia;
- interação;
- motion;
- encerramento.

Padronizar mecanismo, não aparência.

## 3. Arquitetura modular adaptativa

A estrutura é uma biblioteca de possibilidades, nunca um template fixo.

Módulos possíveis:

- header;
- hero;
- apresentação/contexto;
- serviços ou produtos;
- diferenciais;
- processo;
- mídia/galeria;
- prova/confiança;
- localização/área atendida;
- FAQ;
- navegação interna;
- CTA intermediário;
- CTA final;
- footer.

O gerador deve decidir:

1. quais módulos ajudam aquele negócio;
2. quais não fazem sentido;
3. em que ordem aparecem;
4. qual densidade precisam;
5. qual composição visual combina com a marca;
6. onde a conversão deve acontecer.

Nunca renderizar todos os módulos por obrigação.

## 4. A landing como mini-site completo

Sem obrigar o visitante a sair da página, a experiência deve procurar responder:

1. quem é;
2. o que oferece;
3. para quem;
4. onde atende;
5. por que confiar;
6. quais diferenciais existem;
7. como funciona;
8. preço/condição quando houver evidência;
9. quais provas/mídias existem;
10. como tirar dúvidas;
11. como solicitar atendimento;
12. qual é o próximo passo.

## 5. Identidade parametrizada por cliente

Antes da composição, considerar:

```text
brand_name
logo
primary_color
secondary_color
accent_color
background_style
typography_style
visual_mood
image_style
border_radius
shadow_style
icon_style
motion_style
```

Esses parâmetros são matéria-prima, não presets.

A identidade deve nascer do cliente e do setor. Não impor tipografia, cor, glassmorphism, bento, cards, gradientes ou linguagem visual só porque funcionaram em outro projeto.

## 6. Conteúdo específico

A copy deve dizer claramente o que o negócio realmente faz.

Preferir conteúdo factual e específico a slogans genéricos.

Exemplo melhor:

> Instalação e manutenção elétrica residencial em Curitiba e Região Metropolitana.

em vez de:

> Soluções completas para você.

Pode haver emoção, mas clareza vem primeiro.

Nunca inventar:

- biografia;
- experiência;
- preço;
- prazo;
- certificação;
- prêmio;
- número de clientes;
- rating;
- depoimento;
- quantidade de projetos;
- endereço;
- horários;
- resultados.

## 7. Serviços e produtos

Não reduzir oferta a uma lista seca.

Quando aplicável, um serviço/produto pode trazer:

- nome;
- descrição;
- benefício;
- aplicação;
- público;
- imagem;
- condição;
- detalhe operacional;
- CTA relacionado.

A forma visual pode variar: grid editorial, lista visual, tabs, comparação, mosaico, carrossel, categorias, blocos assimétricos etc.

Escolher o formato pelo negócio, nunca por hábito.

## 8. Prova e confiança

Usar apenas evidência verificável.

Possíveis fontes:

- avaliações reais;
- depoimentos reais;
- fotos de serviços;
- cases;
- antes/depois real;
- certificações;
- documentos;
- parceiros confirmados;
- equipe/instalação reais;
- Google Business Profile;
- redes verificadas;
- publicações reais.

Se a evidência não existe, não fabricar substituto.

## 9. Mídia e enriquecimento

Prioridade de mídia:

1. material oficial do cliente;
2. fotos reais;
3. vídeos reais;
4. redes sociais confirmadas;
5. materiais fornecidos;
6. imagens contextuais legalmente utilizáveis;
7. recurso visual gerado seguro.

Mídia deve provar, explicar ou valorizar o trabalho.

Arte gerada ou contextual nunca pode parecer prova documental de equipe, sede, cliente, resultado, obra ou produto real.

Separar sempre:

- fato confirmado;
- conteúdo editorial;
- inferência;
- sugestão.

Nunca publicar inferência como fato.

## 10. Conversão e isolamento

Em `/portfolio/:slug`:

- usar o funil individual do projeto;
- preservar o `client_key`;
- nunca compartilhar destino entre clientes;
- nunca criar fallback para outro cliente;
- nunca interromper o funil com CTA paralelo;
- preservar contexto já coletado;
- finalizar no destino correto conforme a política operacional vigente.

Distribuir CTAs em pontos naturais, sem transformar a página em uma parede de botões.

## 11. Navegação interna

Uma landing premium não é um corredor sem saída.

Pode usar:

- navegação por âncoras;
- atalhos;
- links entre seções;
- breadcrumb quando fizer sentido;
- categorias;
- conteúdo relacionado;
- footer completo.

Dentro de portfolio, qualquer navegação relacionada deve evitar mistura de identidade com outro cliente.

## 12. Mobile-first real

A página deve ser pensada primeiro como experiência móvel.

Revisar:

- headline;
- largura de leitura;
- menu;
- botões;
- mídia;
- formulários;
- modais;
- sticky CTA;
- safe-area;
- espaçamento;
- CLS;
- legibilidade;
- velocidade em 4G.

Não aceitar “desktop empilhado” como definição de mobile.

## 13. SEO e entidade

Conforme aplicável, garantir:

- title único;
- description única;
- canonical;
- Open Graph;
- H1 único;
- headings coerentes;
- conteúdo original;
- links internos;
- alt útil;
- sitemap;
- SEO local;
- structured data compatível com a entidade real.

Schema nunca pode inventar entidade ou atributo.

## 14. Performance

Preferir:

- WebP/AVIF quando houver mídia raster;
- variantes responsivas reais;
- lazy loading abaixo da dobra;
- hero otimizado;
- dimensões reservadas;
- pouco JS desnecessário;
- nenhuma biblioteca pesada só para um efeito;
- autoplay pesado somente quando justificado.

Performance faz parte da experiência, não é gate posterior.

## 15. Acessibilidade

Obrigatório considerar:

- contraste;
- foco visível;
- teclado;
- alt;
- labels;
- ARIA quando necessário;
- semântica de links/botões;
- headings;
- touch targets;
- `prefers-reduced-motion`.

## 16. Arquitetura por tipo de negócio

A estrutura deve mudar conforme a natureza do projeto.

### Restaurante
Cardápio, destaques, fotos, pedido, horários, localização, avaliações, FAQ.

### Prestador técnico
Problemas atendidos, serviços, processo, diferenciais, área atendida, trabalhos/provas, FAQ, orçamento.

### Profissional liberal
Apresentação, especialidades, para quem é, metodologia, credenciais, provas, FAQ, agendamento.

### Loja
Categorias, produtos, benefícios, galeria, entrega/retirada, FAQ, pedido.

Esses exemplos são repertório, não templates.

## 17. Processo de criação

Fluxo esperado:

```text
INTAKE
→ PESQUISA
→ CREATIVE BRIEF
→ ARQUITETURA
→ CONTEÚDO
→ VISUAL
→ CONVERSÃO
→ SEO
→ QA
→ PUBLICAÇÃO
```

Antes de publicar, confirmar identidade, conteúdo, visual, navegação, conversão, SEO, técnica, performance e acessibilidade.

## 18. Uso de referências

Quando o usuário fornecer um site como referência:

1. estudar estrutura;
2. identificar princípios;
3. identificar hierarquia;
4. identificar densidade;
5. identificar ritmo;
6. identificar mecanismos de conversão;
7. identificar navegação;
8. reinterpretar para o novo cliente.

Nunca copiar literalmente:

- nome;
- identidade;
- textos;
- imagens;
- marca;
- conteúdo proprietário;
- composição única.

**Referência serve para elevar qualidade, não para clonar.**

## 19. Critério final simultâneo

Uma landing premium só é aceitável quando entrega, ao mesmo tempo:

**clareza + personalidade + prova + navegação + conversão + performance**

Uma página bonita e vazia não passa.

Uma página completa e genérica não passa.

Uma página cheia de conteúdo sem hierarquia não passa.

Uma página com CTA funcional sem confiança não passa.

## 20. Relação com as demais skills

Aplicar esta skill como camada de **completude e arquitetura adaptativa**.

Depois:

- Decision Intelligence define o que o visitante precisa decidir;
- Art Direction define como isso vira experiência única;
- Resource Utilization força avaliação dos recursos relevantes;
- Landing Experience define riqueza de experiência/motion/mídia;
- Design System transforma a direção em engenharia consistente;
- Funnel preserva conversão e isolamento;
- Quality Gates provam que a implementação realmente funciona.

A regra é somar competências sem criar uma UI Frankenstein.
