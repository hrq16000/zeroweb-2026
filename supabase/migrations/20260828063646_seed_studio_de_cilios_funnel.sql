DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-studio-de-cilios';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES ('funnel-studio-de-cilios', 'Agendamento · Studio de Cílios', 'Funil de agendamento de extensão de cílios', 'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET status = 'published', name = 'Agendamento · Studio de Cílios', description = 'Funil de agendamento de extensão de cílios' WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos encontrar seu novo olhar ✨', 'Escolha a técnica que mais combina com você.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual efeito você deseja?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','mega-brasileiro','label','Mega Brasileiro · R$ 130'), jsonb_build_object('value','mega-egipcio','label','Mega Egípcio · R$ 130'), jsonb_build_object('value','fox-eyes','label','Mega Fox Eyes · R$ 130'), jsonb_build_object('value','fio-a-fio','label','Fio a Fio · R$ 100'), jsonb_build_object('value','orientacao','label','Quero ajuda para escolher'))),
    (v_form_id, 'experiencia', 'radio', 'Como estão seus cílios hoje?', NULL, NULL, 3, true, jsonb_build_array(jsonb_build_object('value','primeira','label','Primeira aplicação'), jsonb_build_object('value','uso','label','Já uso extensão'), jsonb_build_object('value','manutencao','label','Preciso de manutenção'), jsonb_build_object('value','mudar','label','Quero mudar o estilo'))),
    (v_form_id, 'horario', 'radio', 'Que tipo de horário você procura?', NULL, NULL, 4, true, jsonb_build_array(jsonb_build_object('value','flexibilidade','label','Tenho flexibilidade'), jsonb_build_object('value','especifico','label','Preciso de um horário específico'), jsonb_build_object('value','proximos','label','Quero saber os próximos horários'))),
    (v_form_id, 'quando', 'radio', 'Quando gostaria de agendar?', NULL, NULL, 5, true, jsonb_build_array(jsonb_build_object('value','breve','label','O quanto antes'), jsonb_build_object('value','quinze','label','Nos próximos 15 dias'), jsonb_build_object('value','planejando','label','Estou planejando'))),
    (v_form_id, 'detalhes', 'long_text', 'Conte o que você imaginou', 'Uma referência ou preferência ajuda a personalizar o atendimento.', 'Ex.: efeito delicado, volume marcante ou manutenção', 6, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para confirmar seu horário?', NULL, '(41) 99999-9999', 7, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação recebida! 💗', 'O Studio de Cílios vai confirmar disponibilidade e próximos passos pelo WhatsApp.', NULL, 8, false, '[]'::jsonb);
END $$;
