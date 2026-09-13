-- Funil individual de ADHONEP Curitiba (funnel-adhonep-curitiba).
-- Confirmação de presença na reunião semanal do Capítulo Curitiba - Nikkey (0714).
-- Conteúdo 100% derivado do convite oficial enviado pelo responsável.

insert into public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
values (
  'funnel-adhonep-curitiba',
  'Confirmação de presença · ADHONEP Curitiba',
  'published',
  'Confirmação de presença na reunião semanal do Capítulo Curitiba - Nikkey (0714)',
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
where form_id = (select id from public.dynamic_forms where slug = 'funnel-adhonep-curitiba');

insert into public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
select f.id, v.key, v.type, v.label, v.hint, v.placeholder, v.order_index, v.required, v.options_json
from public.dynamic_forms f,
(values
  ('welcome','statement','Confirme sua presença na reunião semanal','Quarta-feira, 16 de setembro, às 20:00. Participação sem custo financeiro.',null,0,false,'[]'::jsonb),
  ('nome','short_text','Como podemos chamar você?',null,'Seu nome',1,true,'[]'::jsonb),
  ('participacao','radio','Como pretende participar?',null,null,2,true,'[{"label":"Vou sozinho","value":"sozinho"},{"label":"Vou levar um convidado","value":"um_convidado"},{"label":"Vou levar mais de um convidado","value":"varios_convidados"},{"label":"Ainda estou avaliando","value":"avaliando"}]'::jsonb),
  ('momento','radio','O que mais te interessa neste encontro?',null,null,3,true,'[{"label":"A palestra Vencendo o Medo","value":"palestra"},{"label":"O café de networking","value":"networking"},{"label":"Conhecer a ADHONEP","value":"conhecer"},{"label":"Falar com o palestrante","value":"palestrante"}]'::jsonb),
  ('detalhes','long_text','Quer deixar alguma mensagem?','Dúvidas sobre acesso ao prédio, estacionamento ou horário.','Opcional',4,false,'[]'::jsonb),
  ('contato','short_text','Qual WhatsApp para confirmarmos com você?','Usamos apenas para responder sobre este encontro.','(41) 9 0000-0000',5,true,'[]'::jsonb)
) as v(key,type,label,hint,placeholder,order_index,required,options_json)
where f.slug = 'funnel-adhonep-curitiba';
