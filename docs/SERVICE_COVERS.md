# Capas canônicas da loja /servicos

Estado: **ativo e protegido**  
Definido em: 18/09/2026

## Regra

As capas abaixo são ativos institucionais da própria 0WEB. Elas não dependem do
bucket do CMS para continuar aparecendo. Os bytes estão versionados na rota:

`src/routes/api/public/catalog-image.$file.ts`

A fonte única do vínculo slug → arquivo está em:

`src/config/service-cover-bindings.json`

As camadas públicas de catálogo e navegação consomem esse manifesto por:

`src/lib/service-cover-bindings.ts`

E o gate que impede a perda silenciosa do vínculo está em:

`scripts/validate-catalog-images.mjs`

Não remover, renomear ou trocar um arquivo abaixo sem atualizar os três pontos
na mesma mudança.

## Catálogo

| Serviço | Slug canônico | Arquivo |
|---|---|---|
| Cartão Digital | `cartao-digital` | `cartao-digital.jpg` |
| Catálogo Digital | `catalogo-digital` | `catalogo-digital.jpg` |
| Comunicação Visual | `comunicacao-visual` | `comunicacao-visual.jpg` |
| Consultoria Estratégica | `consultoria-estrategica` | `consultoria-estrategica.jpg` |
| E-Book Profissional | `ebook-profissional` | `ebook-profissional.jpg` |
| Identidade Visual | `identidade-visual` | `identidade-visual.jpg` |
| Marketplace de Serviços | `marketplace-de-servicos` | `marketplace-de-servicos.jpg` |
| Outdoor Digital | `outdoor-digital` | `outdoor-digital.jpg` |
| Programa de Parceiros | `programa-de-parceiros` | `programa-de-parceiros.jpg` |
| Portfólio Empresarial | `portfolio-empresarial` | `portfolio-empresarial.jpg` |
| Presença Digital | `presenca-digital` | `presenca-digital.jpg` |
| Vídeos Empresariais | `videos-empresariais` | `videos-empresariais.jpg` |

Aliases históricos/DB aceitos para evitar quebra de vínculo:
`consultoria`, `marketplace-servicos`, `marketplace`,
`programa-parceiros` e `parceiros`.

## Origem e entrega

As 12 artes foram criadas especificamente para a identidade da 0WEB, em padrão
visual azul/ciano sobre fundo grafite/navy. A versão de entrega do portal foi
otimizada para 640×360 JPEG e é servida por URL do próprio domínio:

`/api/public/catalog-image/<arquivo>`

A rota envia cache público imutável por 1 ano e ETag. Se futuramente houver uma
foto/capa cadastrada diretamente no CMS para o serviço, o CMS continua tendo
prioridade; a capa canônica permanece como fallback seguro.

## Gate obrigatório

`node scripts/validate-catalog-images.mjs` deve falhar quando:

- um novo serviço ativo não possui imagem nem fallback autorizado;
- o arquivo canônico deixa de existir na rota;
- o slug deixa de apontar para um arquivo do manifesto canônico;
- uma imagem cadastrada no CMS retorna quebrada.

Assim, uma refatoração não pode fazer estas capas desaparecerem silenciosamente.
