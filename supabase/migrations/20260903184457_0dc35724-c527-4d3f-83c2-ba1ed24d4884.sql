DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-heloa-gas';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-heloa-gas', 'Pedido · Heloá Gás', 'Funil de pedido de gás e água mineral da Heloá Gás', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Pedido · Heloá Gás' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos organizar seu pedido', 'Escolha o produto e informe o endereço de entrega.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'produto', 'radio', 'O que você precisa hoje?', NULL, NULL, 2, true, jsonb_build_array(
      jsonb_build_object('value','gas','label','Botijão de gás 13kg'),
      jsonb_build_object('value','agua','label','Água mineral 20L'),
      jsonb_build_object('value','gas_agua','label','Gás e água'))),
    (v_form_id, 'vasilhame', 'radio', 'Você já tem o vasilhame para troca?', NULL, NULL, 3, true, jsonb_build_array(
      jsonb_build_object('value','sim','label','Sim, tenho'),
      jsonb_build_object('value','nao','label','Não tenho'),
      jsonb_build_object('value','nao_sei','label','Não sei informar'))),
    (v_form_id, 'endereco', 'long_text', 'Qual o endereço da entrega?', 'Informe rua, número, bairro e um ponto de referência.', 'Endereço completo', 4, true, '[]'::jsonb),
    (v_form_id, 'prazo', 'radio', 'Para quando é o pedido?', NULL, NULL, 5, true, jsonb_build_array(
      jsonb_build_object('value','agora','label','Agora'),
      jsonb_build_object('value','hoje','label','Ainda hoje'),
      jsonb_build_object('value','amanha','label','Amanhã'))),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para confirmar a entrega?', NULL, '(41) 99999-9999', 6, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido recebido!', 'A equipe da Heloá Gás vai confirmar o produto, o valor e o horário da entrega.', NULL, 7, false, '[]'::jsonb);
END $$;