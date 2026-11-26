-- Funil individual de Infinito Spa.
-- O destino do cliente é resolvido no registry server-side por clientKey.
-- whatsapp_config.enabled=false evita notificação institucional da 0WEB.
-- Migration idempotente: preserva perguntas existentes e não altera leads.

insert into public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
values (
  'funnel-infinito-spa',
  'Infinito Spa · Consulta de masajes',
  'published',
  'Consulta individual para conocer el interés y coordinar disponibilidad con Roze.',
  '{"locale": "es-CL"}'::jsonb,
  '{"enabled": false}'::jsonb
)
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description,
      config_json = coalesce(dynamic_forms.config_json, '{}'::jsonb) || excluded.config_json,
      whatsapp_config = coalesce(dynamic_forms.whatsapp_config, '{}'::jsonb) || excluded.whatsapp_config;

with form as (
  select id from public.dynamic_forms where slug = 'funnel-infinito-spa'
), questions(key, type, label, hint, placeholder, required, order_index, options_json) as (
  values
    ('tipo_masaje', 'short_text', '¿Qué tipo de masaje te interesa?', 'Si aún no lo tienes claro, cuéntale a Roze qué estás buscando.', 'Tu consulta o interés', false, 0, '[]'::jsonb),
    ('periodo', 'radio', '¿Qué momento te acomoda?', 'Es una preferencia para coordinar; Roze confirmará la disponibilidad.', null, true, 1, '[{"value":"manana","label":"Mañana"},{"v���q�^