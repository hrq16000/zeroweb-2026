
with cfg(slug, nome, descricao, seg) as (values
 ('funnel-angel-mix-brecho','Contato · Angel Mix Brechó','Funil individual de Angel Mix Brechó · Curitiba','comercio'),
 ('funnel-beto-pasteis','Contato · Beto Pastéis','Funil individual de Beto Pastéis · São José dos Pinhais','food'),
 ('funnel-brecho-sao-francisco','Contato · Brechó São Francisco','Funil individual de Brechó São Francisco · Curitiba','comercio'),
 ('funnel-confeitaria-sabor-da-realeza','Contato · Confeitaria Sabor da Realeza','Funil individual de Confeitaria Sabor da Realeza · Uberaba','food'),
 ('funnel-dlara-pizzaria','Contato · D''Lara Pizzaria','Funil individual de D''Lara Pizzaria, Esfiharia e Hamburgueria · São José dos Pinhais','food'),
 ('funnel-galileu-locacao-brinquedos','Contato · Galileu Locação de Brinquedos','Funil individual de Galileu Locação de Brinquedos · São José dos Pinhais','comercio'),
 ('funnel-lj-cleaning','Contato · L&J Cleaning','Funil individual de L&J Cleaning · São José dos Pinhais','servico'),
 ('funnel-lolipa-arte-em-festas','Contato · Lolipa Arte em Festas','Funil individual de Lolipa Arte em Festas Decor · Curitiba','comercio'),
 ('funnel-marmitaria-dom-diego','Contato · Marmitaria Dom Diego','Funil individual de Marmitaria Dom Diego · São José dos Pinhais','food'),
 ('funnel-miro-tech','Contato · MIRO TECH','Funil individual de MIRO TECH · São José dos Pinhais','servico'),
 ('funnel-pastelaria-route-66','Contato · Pastelaria e Lanchonete Route 66','Funil individual da Pastelaria e Lanchonete Route 66 · Curitiba','food'),
 ('funnel-premium-envelopamentos','Contato · Premium Envelopamentos','Funil individual de Premium Envelopamentos · Curitiba','servico'),
 ('funnel-reuse-house-brecho','Contato · REuse House Brechó','Funil individual de REuse House Brechó · Curitiba','comercio'),
 ('funnel-toquinho-de-gente-brecho','Contato · Toquinho de Gente Brechó','Funil individual de Toquinho de Gente Brechó Adulto e Infantil · Curitiba','comercio'),
 ('funnel-woodhouse-hamburgueres','Contato · Woodhouse Hambúrgueres','Funil individual de Woodhouse Hambúrgueres · São José dos Pinhais','food')
), inserted as (
  insert into public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
  select slug, nome, descricao, 'published', '{"auto_advance_ms":300}'::jsonb, '{"enabled":true}'::jsonb from cfg
  on conflict (slug) do update set status = 'published', name = excluded.name, description = excluded.description
  returning id, slug
), perguntas as (
  select
    i.id as form_id,
    c.seg,
    case c.seg
      when 'food' then '[{"value":"pedido-agora","label":"Pedido para agora"},{"value":"encomenda","label":"Encomenda para uma data"},{"value":"grupo","label":"Pedido para grupo ou evento"},{"value":"cardapio","label":"Quero conhecer o cardápio"}]'::jsonb
      when 'comercio' then '[{"value":"produto","label":"Quero um produto"},{"value":"personalizado","label":"Quero algo personalizado"},{"value":"ajuda","label":"Preciso de ajuda para escolher"},{"value":"presente","label":"Compra para presente"}]'::jsonb
      else '[{"value":"orcamento","label":"Orçamento de serviço"},{"value":"visita","label":"Visita técnica"},{"value":"manutencao","label":"Manutenção"},{"value":"orientacao","label":"Quero uma orientação"}]'::jsonb
    end as op1,
    case c.seg
      when 'servico' then 'O atendimento é para qual tipo de local?'
      else 'Como prefere receber?'
    end as lbl2,
    case c.seg
      when 'food' then '[{"value":"retirada","label":"Retirada no local"},{"value":"entrega","label":"Entrega"},{"value":"local","label":"Consumo no local"},{"value":"decidir","label":"Ainda vou decidir"}]'::jsonb
      when 'comercio' then '[{"value":"retirada","label":"Retirada"},{"value":"entrega","label":"Entrega"},{"value":"decidir","label":"Ainda vou decidir"}]'::jsonb
      else '[{"value":"residencial","label":"Residencial"},{"value":"comercial","label":"Comercial"},{"value":"definir","label":"Ainda vou definir"}]'::jsonb
    end as op2
  from inserted i join cfg c on c.slug = i.slug
)
insert into public.dynamic_form_questions (form_id, key, type, label, placeholder, required, order_index, options_json)
select p.form_id, v.k, v.t, v.l, v.ph, true, v.ord, v.op
from perguntas p
cross join lateral (values
  ('assunto','radio','Como podemos ajudar?', null, 0, p.op1),
  ('formato','radio', p.lbl2, null, 1, p.op2),
  ('prazo','radio','Para quando?', null, 2, '[{"value":"agora","label":"O quanto antes"},{"value":"dias","label":"Nos próximos dias"},{"value":"planejando","label":"Ainda estou planejando"}]'::jsonb),
  ('nome','short_text','Qual é o seu nome?','Seu nome', 3, '[]'::jsonb),
  ('whatsapp','phone','E o seu WhatsApp com DDD?','(00) 00000-0000', 4, '[]'::jsonb)
) as v(k,t,l,ph,ord,op)
where not exists (select 1 from public.dynamic_form_questions x where x.form_id = p.form_id);
