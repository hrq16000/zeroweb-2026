-- Funil individual de HBK Iluminação LED Atacadão (funnel-hbk-iluminacao-led).

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-hbk-iluminacao-led', 'HBK Iluminação LED Atacadão', 'published', 'Funil individual de HBK Iluminação LED Atacadão')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

delete from public.dynamic_form_questions
where form_id = (select id from public.dynamic_forms where slug = 'funnel-hbk-iluminacao-led');

insert into public.dynamic_form_questions (form_id, step_key, title, options, position)
select id, 'service', 'Qual solução LED você procura?', '["Iluminação LED residencial","Iluminação LED comercial","Lâmpadas e luminárias LED","Spots e perfis LED","Projetos de iluminação","Orientação técnica"]'::jsonb, 1
from public.dynamic_forms where slug = 'funnel-hbk-iluminacao-led'
union all
select id, 'experience', 'Onde será instalado?', '["Residência","Condomínio","Comércio","Obra em andamento","Outro projeto"]'::jsonb, 2
from public.dynamic_forms where slug = 'funnel-hbk-iluminacao-led'
union all
select id, 'period', 'Como podemos orientar?', '["Tenho projeto ou planta","Sei os ambientes","Preciso de orientação"]'::jsonb, 3
from public.dynamic_forms where slug = 'funnel-hbk-iluminacao-led'
union all
select id, 'timing', 'Quando pretende comprar ou instalar?', '["O quanto antes","Nos próximos dias","Ainda neste mês","Estou planejando"]'::jsonb, 4
from public.dynamic_forms where slug = 'funnel-hbk-iluminacao-led';
