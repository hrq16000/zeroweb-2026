-- Funil próprio, informativo e LEAD_ONLY; não redireciona para contato não confirmado.
-- A página é demonstrativa: contatos enviados são registrados na plataforma 0WEB
-- e NÃO constituem pedido, encomenda nem comunicação oficial com a padaria.
DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id
  FROM public.dynamic_forms WHERE slug = 'funnel-panificadora-doce-coracao-santo-antonio';

  IF v_form_id IS NULL THEN
    INSERT INTO public.dynamic_forms (slug, name, description, status, config_json, whatsapp_config)
    VALUES (
      'funnel-panificadora-doce-coracao-santo-antonio',
      'Informações da página · Panificadora Doce Coração',
      'Registro de observações sobre esta apresentação demonstrativa criada pela 0WEB; sem contato oficial da padaria.',
      'published', '{"auto_advance_ms":250}'::jsonb, '{"enabled":false}'::jsonb
    ) RETURNING id INTO v_form_id;
  ELSE
    UPDATE public.dynamic_forms SET
      name = 'Informações da página · Panificadora Doce Coração',
      description = 'Registro de observações sobre esta apresentação demonstrativa criada pela 0WEB; sem contato oficial da padaria.',
      status = 'published',
      whatsapp_config = '{"enabled":false}'::jsonb
    WHERE id = v_form_id;
    DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
    DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  END IF;

  INSERT INTO public.dynamic_form_questions
    (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
  VALUES
    (v_form_id, 'aviso', 'statement',
      'Esta é uma demonstração editorial da 0WEB',
      'Este formulário registra sua observação sobre a página na 0WEB. Não envia mensagens, encomendas ou pedidos à padaria.', null, 0, false, '[]'::jsonb),
    (v_form_id, 'assunto', 'radio', 'Sobre qual assunto você quer falar?', null, null, 1, true,
      '[{"value":"correcao","label":"Corrigir endereço ou informações"},{"value":"conteudo","label":"Sugerir melhoria do conteúdo"},{"value":"responsavel","label":"Sou responsável pela empresa"},{"value":"outro","label":"Outra observação sobre esta página"}]'::jsonb),
    (v_form_id, 'mensagem', 'long_text', 'Descreva sua observação', 'Evite compartilhar dados pessoais sensíveis.', 'O que você gostaria de nos informar?', 2, true, '[]'::jsonb),
    (v_form_id, 'consentimento', 'radio',
      'Você entende que a 0WEB, e não a padaria, recebe esta observação?',
      'Não há encaminhamento automático à empresa.', null, 3, true,
      '[{"value":"entendo","label":"Sim, entendo"},{"value":"nao","label":"Não — prefiro consultar o Google Maps"}]'::jsonb),
    (v_form_id, 'conclusao', 'statement',
      'Observação registrada',
      'A 0WEB poderá revisar a informação. Para falar com a padaria ou consultar produtos, procure a ficha pública no Google Maps.', null, 4, false, '[]'::jsonb);
END $$;
