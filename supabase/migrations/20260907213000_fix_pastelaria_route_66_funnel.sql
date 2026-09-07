-- A Route 66 possui um fluxo de pedido próprio. Esta migração substitui o
-- seed genérico de alimentação sem tocar em dados de outros clientes.
do $$
declare
  v_form_id uuid;
begin
  select id into v_form_id
  from public.dynamic_forms
  where slug = 'funnel-pastelaria-route-66'
  limit 1;

  if v_form_id is null then
    insert into public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
    values (
      'funnel-pastelaria-route-66',
      'Contato · Pastelaria e Lanchonete Route 66',
      'published',
      'Pedido da Pastelaria e Lanchonete Route 66 · Prado Velho, Curitiba',
      '{"auto_advance_ms":300}'::jsonb,
      '{"enabled":true}'::jsonb
    )
    returning id into v_form_id;
  else
    update public.dynamic_forms
       set name = 'Contato · Pastelaria e Lanchonete Route 66',
           status = 'published',
           description = 'Pedido da Pastelaria e Lanchonete Route 66 · Prado Velho, Curitiba',
           config_json = coalesce(config_json, '{}'::jsonb) || '{"auto_advance_ms":300}'::jsonb,
           whatsapp_config = coalesce(whatsapp_config, '{}'::jsonb) || '{"enabled":true}'::jsonb
     where id = v_form_id;
  end if;

  delete from public.dynamic_form_conditions where form_id = v_form_id;
  delete from public.dynamic_form_questions where form_id = v_form_id;

  insert into public.dynamic_form_questions
    (form_id, key, type, label, hint, placeholder, required, order_index, options_json)
  values
    (v_form_id, 'pedido', 'radio', 'O que você quer agora?', 'Escolha a opção que mais combina com o seu momento.', null, true, 0,
      '[{"value":"cafe-da-manha","label":"Café da manhã"},{"value":"salgados","label":"Salgados"},{"value":"almoco","label":"Almoço"},{"value":"cardapio","label":"Quero conhecer o cardápio"}]'::jsonb),
    (v_form_id, 'atendimento', 'radio', 'Como prefere receber?', null, null, true, 1,
      '[{"value":"local","label":"Vou consumir no local"},{"value":"retirada","label":"Quero retirar"},{"value":"entrega","label":"Preciso de entrega"}]'::jsonb),
    (v_form_id, 'quando', 'radio', 'Para quando você precisa?', null, null, true, 2,
      '[{"value":"agora","label":"Agora"},{"value":"hoje","label":"Hoje"},{"value":"outro-dia","label":"Outro dia"}]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', null, 'Seu nome', true, 3, '[]'::jsonb),
    (v_form_id, 'whatsapp', 'phone', 'Qual WhatsApp devemos chamar?', 'Usamos este número somente para responder seu pedido.', '(00) 00000-0000', true, 4, '[]'::jsonb);
end $$;
