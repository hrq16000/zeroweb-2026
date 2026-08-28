DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-no-brilho-higienizacao';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-no-brilho-higienizacao', 'Agendamento · No Brilho Higienização', 'Funil individual para higienização profissional de estofados', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Agendamento · No Brilho Higienização', description = 'Funil individual para higienização profissional de estofados' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos renovar seu estofado ✨', 'Conte a peça e receba um orçamento para atendimento a domicílio.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'O que você quer higienizar?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','sofa','label','Sofá'), jsonb_build_object('value','colchao','label','Colchão'), jsonb_build_object('value','cadeiras','label','Cadeiras e poltronas'), jsonb_build_object('value','automotivo','label','Banco automotivo'), jsonb_build_object('value','tapete','label','Tapete ou carpete'), jsonb_build_object('value','completa','label','Higienização completa'))),
    (v_form_id, 'ambiente', 'radio', 'Onde será o atendimento?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','residencia','label','Residência'), jsonb_build_object('value','comercio','label','Escritório ou comércio'), jsonb_build_object('value','veiculo','label','Veículo'), jsonb_build_object('value','outro','label','Outro ambiente'))),
    (v_form_id, 'local', 'radio', 'Qual região?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','sao-jose','label','São José dos Pinhais'), jsonb_build_object('value','curitiba','label','Curitiba e região'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
    (v_form_id, 'quando', 'radio', 'Quando prefere agendar?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Quero agendar em breve'), jsonb_build_object('value','planejando','label','Estou planejando'), jsonb_build_object('value','avaliacao','label','Quero uma avaliação primeiro'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes', 'Tamanho, manchas, odores e ácaros ajudam a preparar o atendimento.', 'Descreva sua necessidade', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'O No Brilho vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
