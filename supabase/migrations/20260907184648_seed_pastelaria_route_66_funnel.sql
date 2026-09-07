-- Funil individual de Pastelaria e Lanchonete Route 66 (funnel-pastelaria-route-66).
insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-pastelaria-route-66', 'Pastelaria e Lanchonete Route 66', 'published', 'Funil individual para escolher local, retirada ou entrega')
on conflict (slug) do update
  set name = excluded.name,
      status = excluded.status,
      description = excluded.description;

delete from public.dynamic_form_questions
where form_id = (select id from public.dynamic_forms where slug = 'funnel-pastelaria-route-66');

insert into public.dynamic_form_questions (form_id, step_key, title, options, position)
select id, 'service', 'O que você quer pedir?', '["Café da manhã","Salgados","Almoço","Entrega","Retirada"]'::jsonb, 1
from public.dynamic_forms where slug = 'funnel-pastelaria-route-66';
insert into public.dynamic_form_questions (form_id, step_key, title, options, position)
select id, 'experience', 'Como prefere receber?', '["Vou consumir no local","Quero retirar","Preciso de entrega","Quero conhecer o cardápio"]'::jsonb, 2
from public.dynamic_forms where slug = 'funnel-pastelaria-route-66';
insert into public.dynamic_form_questions (form_id, step_key, title, options, position)
select id, 'period', 'Quando você precisa?', '["Agora","Hoje","Durante a semana","Estou planejando"]'::jsonb, 3
from public.dynamic_forms where slug = 'funnel-pastelaria-route-66';
insert into public.dynamic_form_questions (form_id, step_key, title, options, position)
select id, 'timing', 'Qual o próximo passo?', '["O quanto antes","Pela manhã","No horário do almoço","Ainda vou confirmar"]'::jsonb, 4
from public.dynamic_forms where slug = 'funnel-pastelaria-route-66';
