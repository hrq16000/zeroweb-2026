-- Funil individual de Ton & Cor · Pintura e Pequenas Reformas (funnel-ton-e-cor).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-ton-e-cor', 'Ton & Cor · Pintura e Pequenas Reformas', 'published', 'Funil individual de Ton & Cor · Pintura e Pequenas Reformas')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

delete from public.dynamic_form_questions
where form_id = (select id from public.dynamic_forms where slug = 'funnel-ton-e-cor');

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 1, 'service', 'Qual serviço você precisa?', 'single_choice',
  '["Pintura em geral","Pequenos serviços de alvenaria","Pequenos serviços hidráulicos","Limpeza de telhado","Reparos em geral"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-ton-e-cor';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 2, 'experience', 'Onde será o trabalho?', 'single_choice',
  '["Casa","Apartamento","Comércio","Outro espaço"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-ton-e-cor';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 3, 'period', 'Como podemos avaliar?', 'single_choice',
  '["Tenho fotos do local","Posso explicar o reparo","Preciso de uma avaliação"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-ton-e-cor';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 4, 'timing', 'Quando pretende começar?', 'single_choice',
  '["O quanto antes","Nos próximos dias","Ainda neste mês","Estou planejando"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-ton-e-cor';
