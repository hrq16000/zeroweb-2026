insert into public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
values (
  'funnel-autoescola-aptos',
  'Autoescola APTOS · Sua CNH, do seu jeito',
  'published',
  'Funil individual da Autoescola APTOS (São José dos Pinhais)',
  '{"auto_advance_ms": 250}'::jsonb,
  '{"enabled": true}'::jsonb
)
on conflict (slug) do update
  set name = excluded.name,
      status = excluded.status,
      description = excluded.description,
      config_json = excluded.config_json,
      whatsapp_config = excluded.whatsapp_config;

delete from public.dynamic_form_questions
where form_id = (select id from public.dynamic_forms where slug = 'funnel-autoescola-aptos');

insert into public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
select f.id, v.key, v.type, v.label, v.hint, v.placeholder, v.order_index, v.required, v.options_json
from public.dynamic_forms f,
(values
  ('objetivo','radio','O que você quer resolver agora?',null,null,0,true,'[{"label":"Primeira habilitação","value":"primeira_habilitacao"},{"label":"Adicionar categoria (A ou B)","value":"adicionar_categoria"},{"label":"Renovação da CNH","value":"renovacao"},{"label":"Reteste ou reciclagem","value":"reteste_reciclagem"}]'::jsonb),
  ('estagio','radio','Em que ponto você está?',null,null,1,true,'[{"label":"Ainda não comecei nada","value":"nao_comecei"},{"label":"Já fiz exames ou provas","value":"em_andamento"},{"label":"Parei no meio do processo","value":"parado"},{"label":"Só quero tirar dúvidas","value":"duvidas"}]'::jsonb),
  ('periodo','radio','Qual período fica melhor para as aulas?',null,null,2,true,'[{"label":"Manhã","value":"manha"},{"label":"Tarde","value":"tarde"},{"label":"Noite","value":"noite"},{"label":"Fins de semana","value":"fins_de_semana"}]'::jsonb),
  ('inicio','radio','Quando quer começar?',null,null,3,true,'[{"label":"Esta semana","value":"esta_semana"},{"label":"Este mês","value":"este_mes"},{"label":"Nos próximos meses","value":"proximos_meses"},{"label":"Ainda pesquisando","value":"pesquisando"}]'::jsonb),
  ('observacoes','long_text','Quer contar mais alguma coisa?','Ex.: interesse em carro automático ou moto automática.','Opcional',4,false,'[]'::jsonb),
  ('nome','short_text','Como podemos chamar você?',null,'Seu nome',5,true,'[]'::jsonb),
  ('telefone','phone','Qual WhatsApp para retornarmos?','Usamos apenas para responder sobre sua CNH.','(41) 9 0000-0000',6,true,'[]'::jsonb)
) as v(key,type,label,hint,placeholder,order_index,required,options_json)
where f.slug = 'funnel-autoescola-aptos';