DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-denise-gomes-psicologa';
  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES (
      'funnel-denise-gomes-psicologa',
      'Agendamento · Denise Gomes Psicóloga',
      'Funil individual para iniciar uma avaliação psicológica com Denise Gomes',
      'published',
      '{"auto_advance_ms":250}'::jsonb,
      '{"enabled":true}'::jsonb
    )
    RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms
      SET status = 'published',
          name = 'Agendamento · Denise Gomes Psicóloga',
          description = 'Funil individual para iniciar uma avaliação psicológica com Denise Gomes'
      WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;

  INSERT INTO public.dynamic_form_questions
    (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
  VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos iniciar esta conversa com calma', 'Responda apenas o que se sentir confortável em compartilhar.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Como você gostaria de ser chamado(a)?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'motivo', 'radio', 'O que motivou sua busca neste momento?', 'Escolha a opção que mais se aproxima da sua necessidade.', NULL, 2, true, jsonb_build_array(
      jsonb_build_object('value','avaliacao','label','Avaliação psicológica'),
      jsonb_build_object('value','ansiedade','label','Ansiedade'),
      jsonb_build_object('value','burnout','label','Burnout e esgotamento'),
      jsonb_build_object('value','relacionamentos','label','Relacionamentos'),
      jsonb_build_object('value','outro','label','Outra questão')
    )),
    (v_form_id, 'experiencia', 'radio', 'Você já realizou acompanhamento psicológico?', NULL, NULL, 3, true, jsonb_build_array(
      jsonb_build_object('value','primeiro-contato','label','Será meu primeiro contato'),
      jsonb_build_object('value','ja-fiz','label','Já fiz acompanhamento antes'),
      jsonb_build_object('value','em-acompanhamento','label','Estou em acompanhamento'),
      jsonb_build_object('value','prefiro-conversar','label','Prefiro conversar sobre isso depois')
    )),
    (v_form_id, 'periodo', 'radio', 'Qual período facilita seu atendimento?', 'A disponibilidade será confirmada diretamente com Denise.', NULL, 4, true, jsonb_build_array(
      jsonb_build_object('value','manha','label','Manhã'),
      jsonb_build_object('value','tarde','label','Tarde'),
      jsonb_build_object('value','noite','label','Noite'),
      jsonb_build_object('value','flexivel','label','Tenho flexibilidade')
    )),
    (v_form_id, 'observacao', 'long_text', 'Deseja contar algo importante para o primeiro contato?', 'Não inclua informações que não queira registrar neste momento.', 'Escreva somente o que se sentir confortável em compartilhar.', 5, false, '[]'::jsonb),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp pode receber a confirmação?', NULL, '(41) 99999-9999', 6, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação registrada', 'Denise confirmará disponibilidade e orientará os próximos passos do atendimento.', NULL, 7, false, '[]'::jsonb);
END $$;
