DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-vila-da-capivara';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-vila-da-capivara', 'Pedido · Vila da Capivara', 'Funil de encomendas para kits festa, bolos, doces e salgados', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Pedido · Vila da Capivara', description = 'Funil de encomendas para kits festa, bolos, doces e salgados' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos montar uma festa inesquecível 🎉', 'Escolha um kit ou conte o que deseja encomendar.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'pedido', 'radio', 'O que você quer encomendar?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','kit10','label','Kit Festa para 10 pessoas · R$ 259,90'), jsonb_build_object('value','kit20','label','Kit Festa para 20 pessoas · R$ 499,90'), jsonb_build_object('value','kit50','label','Kit Festa para 50 pessoas · R$ 1.249,90'), jsonb_build_object('value','kit70','label','Kit Festa para 70 pessoas · R$ 1.749,90'), jsonb_build_object('value','kit100','label','Kit Festa para 100 pessoas · R$ 2.499,90'), jsonb_build_object('value','avulsos','label','Bolos, doces ou salgados avulsos'))),
    (v_form_id, 'ocasiao', 'radio', 'Qual é a ocasião?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','aniversario','label','Aniversário'), jsonb_build_object('value','confraternizacao','label','Confraternização'), jsonb_build_object('value','corporativo','label','Evento corporativo'), jsonb_build_object('value','casamento','label','Casamento ou celebração'))),
    (v_form_id, 'local', 'radio', 'Onde será a entrega?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','campo-comprido','label','Campo Comprido'), jsonb_build_object('value','curitiba','label','Curitiba e região'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
    (v_form_id, 'quando', 'radio', 'Quando será sua festa?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Preciso para breve'), jsonb_build_object('value','planejando','label','Estou planejando'), jsonb_build_object('value','consultar','label','Quero consultar disponibilidade'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes do pedido', 'Tema, sabores, quantidade e preferência de entrega.', 'Ex.: tema do bolo, sabores e convidados', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para confirmar o pedido?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido recebido! 💛', 'A Vila da Capivara vai confirmar disponibilidade, entrega e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
