-- Funil individual de JC Revestimentos (funnel-jc-revestimentos).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-jc-revestimentos', 'JC Revestimentos', 'published', 'Funil individual de JC Revestimentos')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

delete from public.dynamic_form_questions where form_id = (select id from public.dynamic_forms where slug = 'funnel-jc-revestimentos');

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 1, 'service', 'Qual revestimento procura?', 'single_choice',
  '["Textura projetada","Grafiato","Textura lisa","Massa corrida","Massa acrílica","Massa niveladora"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-jc-revestimentos';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 2, 'experience', 'Onde será aplicado?', 'single_choice',
  '["Residência","Condomínio","Comércio","Obra em andamento","Outro projeto"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-jc-revestimentos';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 3, 'period', 'Como podemos orientar?', 'single_choice',
  '["Sei a metragem","Tenho fotos do ambiente","Preciso de orientação"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-jc-revestimentos';

insert into public.dynamic_form_questions (form_id, step_order, question_key, question_text, question_type, options, is_required)
select id, 4, 'timing', 'Quando pretende começar?', 'single_choice',
  '["O quanto antes","Nos próximos dias","Ainda neste mês","Estou planejando"]'::jsonb, true
from public.dynamic_forms where slug = 'funnel-jc-revestimentos';
