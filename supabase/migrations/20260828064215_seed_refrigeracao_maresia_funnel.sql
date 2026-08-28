DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-refrigeracao-maresia';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-refrigeracao-maresia', 'Orçamento · Refrigeração Maresia', 'Funil de diagnóstico para geladeiras e freezers', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Orçamento · Refrigeração Maresia', description = 'Funil de diagnóstico para geladeiras e freezers' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos resolver o problema do seu equipamento ❄️', 'Conte o sintoma e a equipe orienta o próximo passo.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'O que você precisa?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','gas','label','Recarga de gás'), jsonb_build_object('value','motor','label','Troca de motor'), jsonb_build_object('value','sensor','label','Troca de sensor'), jsonb_build_object('value','preventiva','label','Manutenção preventiva'), jsonb_build_object('value','corretiva','label','Manutenção corretiva'), jsonb_build_object('value','diagnostico','label','Ainda não sei — preciso de diagnóstico'))),
    (v_form_id, 'sintoma', 'radio', 'Qual é o sintoma principal?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','nao-gela','label','Geladeira não está gelando'), jsonb_build_object('value','freezer','label','Freezer com problema'), jsonb_build_object('value','ruido','label','Ruído ou vazamento'), jsonb_build_object('value','prevenir','label','Quero prevenir uma falha'))),
    (v_form_id, 'local', 'radio', 'Onde será o atendimento?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','curitiba','label','Curitiba'), jsonb_build_object('value','regiao','label','Região Metropolitana'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
    (v_form_id, 'quando', 'radio', 'Quando você precisa?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','urgente','label','Atendimento o quanto antes'), jsonb_build_object('value','dias','label','Nos próximos dias'), jsonb_build_object('value','preventivo','label','Orçamento preventivo'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte mais detalhes', 'Marca, modelo e quando começou ajudam no diagnóstico.', 'Ex.: marca, modelo e sintoma', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para confirmar o atendimento?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'A Refrigeração Maresia vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
