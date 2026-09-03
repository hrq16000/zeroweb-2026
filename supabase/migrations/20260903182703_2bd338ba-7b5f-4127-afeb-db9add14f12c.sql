with caps(slug, city, uf, state, region, ddd) as (
  values
    ('rio-branco','Rio Branco','AC','Acre','Norte','68'),
    ('maceio','Maceió','AL','Alagoas','Nordeste','82'),
    ('macapa','Macapá','AP','Amapá','Norte','96'),
    ('manaus','Manaus','AM','Amazonas','Norte','92'),
    ('salvador','Salvador','BA','Bahia','Nordeste','71'),
    ('fortaleza','Fortaleza','CE','Ceará','Nordeste','85'),
    ('brasilia','Brasília','DF','Distrito Federal','Centro-Oeste','61'),
    ('vitoria','Vitória','ES','Espírito Santo','Sudeste','27'),
    ('goiania','Goiânia','GO','Goiás','Centro-Oeste','62'),
    ('sao-luis','São Luís','MA','Maranhão','Nordeste','98'),
    ('cuiaba','Cuiabá','MT','Mato Grosso','Centro-Oeste','65'),
    ('campo-grande','Campo Grande','MS','Mato Grosso do Sul','Centro-Oeste','67'),
    ('belo-horizonte','Belo Horizonte','MG','Minas Gerais','Sudeste','31'),
    ('belem','Belém','PA','Pará','Norte','91'),
    ('joao-pessoa','João Pessoa','PB','Paraíba','Nordeste','83'),
    ('curitiba','Curitiba','PR','Paraná','Sul','41'),
    ('recife','Recife','PE','Pernambuco','Nordeste','81'),
    ('teresina','Teresina','PI','Piauí','Nordeste','86'),
    ('rio-de-janeiro','Rio de Janeiro','RJ','Rio de Janeiro','Sudeste','21'),
    ('natal','Natal','RN','Rio Grande do Norte','Nordeste','84'),
    ('porto-alegre','Porto Alegre','RS','Rio Grande do Sul','Sul','51'),
    ('porto-velho','Porto Velho','RO','Rondônia','Norte','69'),
    ('boa-vista','Boa Vista','RR','Roraima','Norte','95'),
    ('florianopolis','Florianópolis','SC','Santa Catarina','Sul','48'),
    ('sao-paulo','São Paulo','SP','São Paulo','Sudeste','11'),
    ('aracaju','Aracaju','SE','Sergipe','Nordeste','79'),
    ('palmas','Palmas','TO','Tocantins','Norte','63')
)
insert into public.local_pages (slug, city, uf, state, region, ddd, meta_title, meta_description, intro, body, published)
select
  slug, city, uf, state, region, ddd,
  format('Criação de Site Institucional em %s - %s | 0WEB', city, uf),
  format('Criação de site institucional para empresas de %s (%s): site rápido, responsivo, otimizado para busca local e com funil de contato integrado. Atendimento remoto, DDD %s.', city, state, ddd),
  format('A 0WEB desenvolve sites institucionais para empresas de %s e região, no %s. O atendimento é remoto, do briefing à publicação, com foco em desempenho, SEO local e captação de contatos.', city, state),
  format('Um site institucional em %s precisa responder rápido no celular e deixar claro o que a empresa faz, para quem atende e como falar com ela. Cada projeto nasce com estrutura semântica, dados estruturados, imagens otimizadas e funil de contato próprio.

Na região %s, termos com o nome da cidade, bairros e serviços específicos convertem mais do que termos amplos. O conteúdo da página é organizado a partir desses termos e conectado às páginas de serviço do portal.

Empresas de %s (DDD %s) podem pedir uma proposta pelo diagnóstico rápido: em poucas perguntas descrevemos escopo, prioridades e próximos passos.', city, region, city, ddd),
  true
from caps
on conflict (slug) do update set
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  intro = excluded.intro,
  body = excluded.body,
  published = true,
  updated_at = now();