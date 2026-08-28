DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-lucas-arruma-maquina-lavar';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-lucas-arruma-maquina-lavar', 'Diagnóstico · Lucas Arruma Máquina de Lavar', 'Funil individual para conserto e manutenção de lavadoras', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Diagnóstico · Lucas Arruma Máquina de Lavar', description = 'Funil individual para conserto e manutenção de lavadoras' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos entender o problema da sua máquina 🔧', 'Conte o sintoma e receba orientação para o próximo passo.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'O que aconteceu com sua máquina?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','nao-liga','label','Não liga'), jsonb_build_object('value','nao-lava','label','Não lava ou não centrifuga'), jsonb_build_object('value','nao-drena','label','Não drena a água'), jsonb_build_object('value','vazamento-ruido','label','Vazamento ou ruído'), jsonb_build_object('value','preventiva','label','Manutenção preventiva'), jsonb_build_object('value','diagnostico','label','Ainda preciso de diagnóstico'))),
    (v_form_id, 'equipamento', 'radio', 'Qual equipamento precisa de ajuda?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','lavadora','label','Máquina de lavar'), jsonb_build_object('value','lava-seca','label','Lava e seca'), jsonb_build_object('value','tanquinho','label','Tanquinho'), jsonb_build_object('value','confirmar','label','Vou confirmar o equipamento'))),
    (v_form_id, 'local', 'radio', 'Onde será o atendimento?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','curitiba-regiao','label','Curitiba e região'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'), jsonb_build_object('value','definindo','label','Ainda estou definindo o local'))),
    (v_form_id, 'quando', 'radio', 'Quando você precisa?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Preciso de atendimento em breve'), jsonb_build_object('value','planejando','label','Estou planejando'), jsonb_build_object('value','avaliacao','label','Quero uma avaliação primeiro'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte mais sobre o problema', 'Marca, modelo, código de erro e quando começou ajudam no diagnóstico.', 'Descreva o que aconteceu', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'Lucas vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
