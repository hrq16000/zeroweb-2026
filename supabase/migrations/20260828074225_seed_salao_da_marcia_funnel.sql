DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-salao-da-marcia';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-salao-da-marcia', 'Agendamento · Salão da Marcia', 'Funil individual para beleza e autocuidado', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Agendamento · Salão da Marcia', description = 'Funil individual para beleza e autocuidado' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Seu momento de se cuidar começa aqui 💗', 'Escolha o serviço e consulte a disponibilidade.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual cuidado você procura?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','depilacao','label','Depilação com cera'), jsonb_build_object('value','progressiva','label','Progressiva'), jsonb_build_object('value','corte-hidratacao','label','Corte e hidratação'), jsonb_build_object('value','pe-mao','label','Pé e mão'), jsonb_build_object('value','mechas','label','Mechas e tratamento'), jsonb_build_object('value','combo','label','Combo de serviços'))),
    (v_form_id, 'experiencia', 'radio', 'Como podemos ajudar?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','conhecer','label','Quero conhecer o salão'), jsonb_build_object('value','horario','label','Tenho um horário em mente'), jsonb_build_object('value','indicacao','label','Preciso de uma indicação'), jsonb_build_object('value','combinar','label','Quero combinar serviços'))),
    (v_form_id, 'local', 'radio', 'Onde será o atendimento?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','cidade-jardim','label','Cidade Jardim · São José dos Pinhais'), jsonb_build_object('value','sao-jose','label','São José dos Pinhais'), jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),
    (v_form_id, 'quando', 'radio', 'Quando prefere?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','Quero agendar em breve'), jsonb_build_object('value','planejando','label','Estou planejando'), jsonb_build_object('value','consultar','label','Quero consultar horários'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte o que você deseja', 'Comprimento do cabelo, região da depilação e preferência de horário ajudam.', 'Descreva sua preferência', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para retorno?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! ✅', 'O Salão da Marcia vai confirmar os próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
