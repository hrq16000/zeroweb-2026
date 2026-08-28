DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-espaco-cih-luh';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-espaco-cih-luh', 'Agendamento · Espaço CIH & LUH', 'Funil individual para alongamento, unhas e pedicure', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Agendamento · Espaço CIH & LUH', description = 'Funil individual para alongamento, unhas e pedicure' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Seu cuidado começa aqui ✨', 'Escolha o serviço e consulte as vagas promocionais.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual cuidado você procura?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','alongamento-gel','label','Alongamento em gel'), jsonb_build_object('value','reconstrucao','label','Reconstrução de unhas'), jsonb_build_object('value','pedicure','label','Pedicure tradicional'), jsonb_build_object('value','pedicure-gel','label','Pedicure em gel'), jsonb_build_object('value','podologia','label','Cuidados podológicos'), jsonb_build_object('value','combo','label','Combo mãos e pés'))),
    (v_form_id, 'experiencia', 'radio', 'Como podemos ajudar?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','primeiro','label','Primeiro alongamento'), jsonb_build_object('value','manutencao','label','Quero fazer manutenção'), jsonb_build_object('value','reconstrucao','label','Estou buscando reconstrução'), jsonb_build_object('value','combinar','label','Quero combinar cuidados'))),
    (v_form_id, 'local', 'radio', 'Onde será o atendimento?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','manaus','label','Manaus e região'), jsonb_build_object('value','outra','label','Vou confirmar a cidade'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
    (v_form_id, 'quando', 'radio', 'Quando prefere?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Quero agendar em breve'), jsonb_build_object('value','planejando','label','Estou planejando'), jsonb_build_object('value','consultar','label','Quero consultar horários'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte sua preferência', 'Formato, comprimento, cor, sensibilidade e horário ideal ajudam no atendimento.', 'Descreva sua preferência', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(92) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'Cih e Luh vão confirmar os próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
