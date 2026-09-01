# Padrão oficial — Kit de Presença para portfólios

Status: obrigatório para todos os novos clientes em `/portfolio/<slug>` e
aplicável, por migração em lote, aos clientes já publicados.

## Objetivo comercial

O portfólio não demonstra apenas um site. Ele apresenta uma solução de presença
digital e gráfica pronta para o negócio divulgar: site, texto promocional,
imagem social e amostras de papelaria. Isso permite abordar comércios que ainda
não têm site, Instagram, logo ou cartão de visita com uma proposta concreta de
"do zero ao sucesso web".

As peças são conceitos de demonstração. Elas não representam material impresso,
marca registrada ou aprovação do cliente até que exista contratação e validação
do conteúdo final.

## Contrato por cliente

Cada registro publicado precisa possuir, em sua fonte canônica de configuração:

1. `shareCopy`: mensagem de divulgação exclusiva, pronta para copiar e colar;
2. `socialImage`: imagem Open Graph própria, coerente com o negócio;
3. `printMockup`: conceito visual de cartão de visita e/ou panfleto digital;
4. `brandBrief`: nome, segmento, serviços, cidade e direção visual usados para
   gerar ou revisar essas peças;
5. `disclosure`: indicação clara de que a peça é uma amostra conceitual quando
   não tiver sido aprovada pelo cliente.

Não é permitido reutilizar copy, imagem, serviços, tags, cores, contatos,
localidade ou linguagem de outro cliente. Uma confeitaria não pode receber
texto, palavras-chave ou estética de reparos residenciais; a validação deve
bloquear esse tipo de cruzamento.

## Divulgação pronta

O botão **Copiar divulgação** deve estar disponível no site individual e no
card correspondente do catálogo. Ele copia somente `shareCopy` do cliente,
incluindo URL canônica `https://0web.com.br/portfolio/<slug>`.

A mensagem deve ter:

- abertura exclusiva ligada ao negócio;
- benefício e serviços reais daquele cliente;
- convite objetivo para acessar o site e pedir orçamento/agendar/pedir;
- crédito da 0WEB em tom discreto;
- hashtags específicas e pertinentes ao segmento.

Modelos genéricos podem orientar a produção, mas não podem ser o conteúdo final
de dois clientes publicados. Não usar afirmações, preços, prazos, resultados,
avaliações ou canais de atendimento que não tenham sido confirmados.

## Imagem social

`socialImage` deve ser própria por cliente, em formato adequado a previews
(preferência: JPEG ou PNG horizontal 1,91:1, referência 1200×630), com foco
visual reconhecível em tela pequena. Deve mostrar o setor, produto, ambiente ou
trabalho relacionado ao negócio; nunca uma captura de documento, imagem de outro
cliente ou arte genérica sem nexo.

Quando uma imagem for gerada por IA, ela deve:

- ser descrita como conceito quando exibida como amostra;
- não conter logotipos, nomes, preços, selos, telefone ou alegações inventadas;
- evitar rostos identificáveis sem autorização;
- passar por revisão humana antes de uso como marca final.

## Seção “Kit de presença”

Cada `/portfolio/<slug>` deve apresentar uma seção acessível de demonstração
com pelo menos um mockup de cartão de visita e uma prévia de panfleto digital.
Ela pertence ao case do cliente, usa seus dados e deve conter o aviso
"Conceito de presença e papelaria" quando não for uma peça aprovada.

A seção deve ser responsiva, legível, sem simular informação de contato não
confirmada e sem competir com o CTA principal do cliente. No catálogo
`/portfolio/`, o card pode indicar que o projeto inclui kit de presença, mas a
amostra detalhada fica no respectivo slug.

## Cadastro em massa de novos comércios

Para comércios sem presença digital, o lote mínimo de entrada é:

`nome · ramo · bairro/cidade · serviços reais · preferência visual (se houver)`.

Com esses dados, a plataforma gera um rascunho de `brandBrief`, `shareCopy`,
imagem social e `printMockup`. O estado inicial é `concept`; a publicação como
material final exige revisão do responsável e confirmação das informações.

## Validação obrigatória

O validador de portfólios deve falhar se um cliente publicado não tiver os cinco
campos do contrato, se `shareCopy` apontar para outro slug/nome/segmento ou se
`socialImage`/`printMockup` não existirem. As validações já existentes de
privacidade continuam obrigatórias: telefones, e-mails operacionais e links
diretos de atendimento nunca entram no bundle público.

## Oferta recomendada

O kit deve comunicar uma oferta progressiva, não uma promessa gratuita
enganosa:

1. demonstração sem custo: página de portfólio e conceito visual;
2. presença essencial: marca básica, cartão e panfleto digital;
3. presença profissional: site, SEO, funil e divulgação;
4. crescimento contínuo: conteúdo, campanhas e melhoria de conversão.

Assim, o link compartilhado entrega valor imediato e abre uma conversa para o
pacote adequado, sem depender de o comércio já ter Instagram ou materiais.
