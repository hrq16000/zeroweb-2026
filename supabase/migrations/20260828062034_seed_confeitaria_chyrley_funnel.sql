-- Funil individual de Chyrley Doces & Festas (funnel-confeitaria-chyrley).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-confeitaria-chyrley', 'Chyrley Doces & Festas', 'published', 'Funil individual de Chyrley Doces & Festas')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

DO $$
DECLARE v_form_id uuid;
BEGIN
  SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug = 'funnel-confeitaria-chyrley';
  DELETE FROM public.dynamic_form_conditions WHERE form_id = v_form_id;
  DELETE FROM public.dynamic_form_questions WHERE form_id = v_form_id;
  INSERT INTO public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) VALUES
    (v_form_id, 'welcome', 'statement', 'Vamos montar uma comemoração linda 🎂', 'Conte a ocasião e a quantidade de pessoas.', NULL, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', NULL, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'produto', 'radio', 'O que você gostaria de encomendar?', NULL, NULL, 2, true, jsonb_build_array(jsonb_build_object('value','bolo','label','Bolo personalizado'), jsonb_build_object('value','kit-festa','label','Kit festa'), jsonb_build_object('value','salgados','label','Salgados'), jsonb_build_object('value','doces','label','Copo da Felicidade e docinhos'))),
    (v_form_id, 'ocasiao', 'short_text', 'Para qual ocasião?', NULL, 'Aniversário, festa em casa, presente...', 3, true, '[]'::jsonb),
    (v_form_id, 'quantidade', 'short_text', 'Para quantas pessoas?', NULL, 'Ex.: 20 pessoas', 4, true, '[]'::jsonb),
    (v_form_id, 'data', 'short_text', 'Para quando você precisa?', NULL, 'Data ou período desejado', 5, true, '[]'::jsonb),
    (v_form_id, 'detalhes', 'long_text', 'Conte mais detalhes', 'Tema, sabores, endereço e preferências ajudam no orçamento.', 'Ex.: tema, sabores, quantidade de salgados e retirada/envio por Uber.', 6, false, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Pedido de orçamento recebido!', 'A Chyrley vai confirmar as opções e condições pelo WhatsApp.', NULL, 7, false, '[]'::jsonb);
END $$;
