-- Registro base do funil individual. As perguntas são mantidas na migração
-- corretiva posterior, em formato compatível com dynamic_form_questions.
insert into public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
values (
  'funnel-pastelaria-route-66',
  'Contato · Pastelaria e Lanchonete Route 66',
  'published',
  'Pedido da Pastelaria e Lanchonete Route 66 · Prado Velho, Curitiba',
  '{"auto_advance_ms":300}'::jsonb,
  '{"enabled":true}'::jsonb
)
on conflict (slug) do update
  set name = excluded.name,
      status = excluded.status,
      description = excluded.description,
      config_json = coalesce(public.dynamic_forms.config_json, '{}'::jsonb) || excluded.config_json,
      whatsapp_config = coalesce(public.dynamic_forms.whatsapp_config, '{}'::jsonb) || excluded.whatsapp_config;
