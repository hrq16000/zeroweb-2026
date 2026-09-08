-- Funil individual de orçamento da Pinturas Nunes.
-- O destinatário é resolvido exclusivamente no servidor por clientKey; nenhum
-- telefone, e-mail ou link operacional é publicado nesta migration.

insert into public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
values (
  'funnel-pinturas-nunes',
  'Orçamento · Pinturas Nunes',
  'published',
  'Funil individual para pintura e acabamentos da Pinturas Nunes',
  '{"auto_advance_ms":250}'::jsonb,
  '{"enabled":true}'::jsonb
)
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description,
      config_json = excluded.config_json,
      whatsapp_config = excluded.whatsapp_config;

do $$
declare
  v_form_id uuid;
begin
  select id into v_form_id
  from public.dynamic_forms
  where slug = 'funnel-pinturas-nunes';

  delete from public.dynamic_form_conditions where form_id = v_form_id;
  delete from public.dynamic_form_questions where form_id = v_form_id;

  insert into public.dynamic_form_questions
    (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
  values
    (v_form_id, 'welcome', 'statement', 'Vamos entender seu acabamento', 'Conte o serviço e o tipo de ambiente para organizar o orçamento.', null, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Como podemos chamar você?', null, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual serviço você procura?', null, null, 2, true, jsonb_build_array(
      jsonb_build_object('value', 'pintura', 'label', 'Pintura residencial ou predial'),
      jsonb_build_object('value', 'textura', 'label', 'Grafiato, textura ou textura projetada'),
      jsonb_build_object('value', 'telhado', 'label', 'Telhado, calha, grade ou portão'),
      jsonb_build_object('value', 'decorativa', 'label', 'Pintura decorativa'),
      jsonb_build_object('value', 'cadeirinha', 'label', 'Cadeirinha ou balancinho')
    )),
    (v_form_id, 'tipo_imovel', 'radio', 'Em qual ambiente será o serviço?', null, null, 3, true, jsonb_build_array(
      jsonb_build_object('value', 'residencial', 'label', 'Residencial'),
      jsonb_build_object('value', 'predial', 'label', 'Predial'),
      jsonb_build_object('value', 'externo', 'label', 'Área externa'),
      jsonb_build_object('value', 'outro', 'label', 'Outro / preciso de orientação')
    )),
    (v_form_id, 'detalhes', 'long_text', 'Quer acrescentar detalhes?', 'Informe medidas aproximadas, etapa da obra ou o que deseja transformar.', 'Descreva brevemente o serviço', 4, false, '[]'::jsonb),
    (v_form_id, 'contato', 'short_text', 'Como prefere receber o retorno?', 'Informe WhatsApp ou outro contato para resposta.', 'Seu contato', 5, true, '[]'::jsonb);
end $$;
