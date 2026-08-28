DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-lk-alvenaria';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-lk-alvenaria', 'Orçamento · LK Alvenaria', 'Funil de orçamento para construção, reformas e acabamento', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Orçamento · LK Alvenaria', description = 'Funil de orçamento para construção, reformas e acabamento' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos planejar sua obra 📐', 'Conte a etapa e receba um orçamento personalizado.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual etapa você precisa?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','fundacao','label','Alicerce, fundação ou baldrame'), jsonb_build_object('value','alvenaria','label','Alvenaria, muros ou paredes'), jsonb_build_object('value','estrutura','label','Colunas, vigas, lajes ou concretagem'), jsonb_build_object('value','acabamento','label','Reboco, contrapiso, cerâmica ou revestimentos'), jsonb_build_object('value','drywall','label','Drywall ou forro PVC'), jsonb_build_object('value','calcada','label','Calçada ou paver'), jsonb_build_object('value','reforma','label','Reforma, conserto ou reparo'))),
    (v_form_id, 'projeto', 'radio', 'Que tipo de projeto é?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','novo','label','Construção nova'), jsonb_build_object('value','reforma','label','Reforma residencial'), jsonb_build_object('value','comercial','label','Obra comercial ou predial'), jsonb_build_object('value','reparo','label','Reparo ou manutenção'))),
    (v_form_id, 'local', 'radio', 'Onde será a obra?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','curitiba','label','Curitiba e região'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'), jsonb_build_object('value','definindo','label','Ainda estou definindo o local'))),
    (v_form_id, 'quando', 'radio', 'Quando pretende começar?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Preciso iniciar em breve'), jsonb_build_object('value','planejando','label','Estou planejando'), jsonb_build_object('value','avaliacao','label','Quero uma avaliação primeiro'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte os detalhes da obra', 'Metragem, etapa atual, materiais e prazo estimado ajudam no orçamento.', 'Descreva seu projeto', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'A LK Alvenaria vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
