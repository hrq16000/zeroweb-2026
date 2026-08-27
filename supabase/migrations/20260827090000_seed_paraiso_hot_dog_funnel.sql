DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-paraiso-hot-dog';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-paraiso-hot-dog', 'Pedido · Paraíso do Hot Dog', 'Funil de pedido do cardápio online do Paraíso do Hot Dog', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Pedido · Paraíso do Hot Dog' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos confirmar seu pedido 🌭', 'Confira os itens e escolha como quer receber.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'entrega', 'radio', 'Você prefere entrega ou retirada?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','entrega','label','Entrega'), jsonb_build_object('value','retirada','label','Vou retirar'))),
    (v_form_id, 'endereco', 'long_text', 'Qual endereço para entrega?', 'Informe rua, número, bairro e referência. Se for retirar, escreva “retirada”.', 'Endereço completo ou retirada', 3, true, '[]'::jsonb),
    (v_form_id, 'pagamento', 'radio', 'Como prefere pagar?', 'O pagamento é confirmado no atendimento.', NULL, 4, true, jsonb_build_array(jsonb_build_object('value','pix','label','Pix'), jsonb_build_object('value','cartao','label','Cartão'), jsonb_build_object('value','dinheiro','label','Dinheiro'))),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para confirmar o pedido?', NULL, '(41) 99999-9999', 5, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido recebido!', 'A equipe do Paraíso vai confirmar os itens, prazo e pagamento pelo WhatsApp.', NULL, 6, false, '[]'::jsonb);
END $$;
