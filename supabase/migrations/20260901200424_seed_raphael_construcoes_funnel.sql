-- Funil individual de Raphael Construções (funnel-raphael-construcoes).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-raphael-construcoes', 'Raphael Construções', 'published', 'Funil individual de Raphael Construções')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

delete from public.dynamic_form_questions
where form_id = (select id from public.dynamic_forms where slug = 'funnel-raphael-construcoes');

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 1, 'service', 'Qual etapa da obra você precisa?', 'single_choice',
  '["Construção","Reforma","Impermeabilização","Hidráulica","Elétrica","Demolição","Pintura e acabamentos","Engenharia e acompanhamento"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-raphael-construcoes';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 2, 'experience', 'Onde será o serviço?', 'single_choice',
  '["Casa","Apartamento","Comércio","Condomínio","Outro imóvel"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-raphael-construcoes';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 3, 'period', 'O que já está disponível?', 'single_choice',
  '["Tenho projeto ou medidas","Tenho fotos do local","Preciso de uma avaliação"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-raphael-construcoes';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 4, 'timing', 'Quando pretende começar?', 'single_choice',
  '["O quanto antes","Nos próximos meses","Ainda neste ano","Estou planejando"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-raphael-construcoes';
