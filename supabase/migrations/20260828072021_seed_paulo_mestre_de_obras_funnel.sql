DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-paulo-mestre-de-obras';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-paulo-mestre-de-obras', 'Orçamento · Paulo Mestre de Obras', 'Funil individual para construção civil, reformas e acabamentos', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Orçamento · Paulo Mestre de Obras', description = 'Funil individual para construção civil, reformas e acabamentos' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos planejar sua obra 📐', 'Conte a etapa e receba um orçamento personalizado.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual serviço você precisa?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','fundacao','label','Fundação e baldrame'), jsonb_build_object('value','alvenaria','label','Alvenaria, muros e paredes'), jsonb_build_object('value','estrutura','label','Colunas, vigas e lajes'), jsonb_build_object('value','revestimentos','label','Reboco e revestimentos'), jsonb_build_object('value','pisos','label','Pisos, cerâmica e azulejos'), jsonb_build_object('value','reforma','label','Reformas e pequenos reparos'))),
    (v_form_id, 'projeto', 'radio', 'Que tipo de obra é?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','nova','label','Construção nova'), jsonb_build_object('value','reforma','label','Reforma residencial'), jsonb_build_object('value','manutencao','label','Manutenção ou reparo'), jsonb_build_object('value','comercial','label','Obra comercial'))),
    (v_form_id, 'local', 'radio', 'Onde será a obra?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','curitiba-regiao','label','Curitiba e região'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'), jsonb_build_object('value','definindo','label','Ainda estou definindo o local'))),
    (v_form_id, 'quando', 'radio', 'Quando pretende começar?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Preciso começar em breve'), jsonb_build_object('value','planejando','label','Estou planejando'), jsonb_build_object('value','avaliacao','label','Quero uma avaliação primeiro'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes da obra', 'Metragem, etapa atual, acabamento e prazo ajudam no orçamento.', 'Descreva seu projeto', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'Paulo vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
