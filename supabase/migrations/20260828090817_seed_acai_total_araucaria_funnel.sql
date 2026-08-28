-- Funil individual de Açaí Total Araucária (funnel-acai-total-araucaria).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-acai-total-araucaria', 'Açaí Total Araucária', 'published', 'Funil individual de Açaí Total Araucária')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

DO $$ DECLARE v_form_id uuid; BEGIN SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug='funnel-acai-total-araucaria'; DELETE FROM public.dynamic_form_questions WHERE form_id=v_form_id; INSERT INTO public.dynamic_form_questions (form_id,key,type,label,order_index,required,options_json) VALUES (v_form_id,'welcome','statement','Seu açaí começa aqui 💜',0,false,'[]'::jsonb),(v_form_id,'nome','short_text','Qual é o seu nome?',1,true,'[]'::jsonb),(v_form_id,'pedido','radio','Qual pedido deseja?',2,true,jsonb_build_array(jsonb_build_object('value','copa','label','Copão de açaí'),jsonb_build_object('value','litro','label','Litrão'),jsonb_build_object('value','familia','label','Pedido para compartilhar'))),(v_form_id,'preferencia','radio','Como prefere?',3,true,jsonb_build_array(jsonb_build_object('value','frutas','label','Com frutas'),jsonb_build_object('value','cremes','label','Com cremes e complementos'),jsonb_build_object('value','escolher','label','Ainda estou escolhendo'))),(v_form_id,'local','radio','Onde será a entrega?',4,true,jsonb_build_array(jsonb_build_object('value','araucaria','label','Araucária'),jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),(v_form_id,'detalhes','long_text','Observações do pedido','Tamanho, complementos e endereço ajudam no atendimento.','Escreva sua preferência',5,false,'[]'::jsonb),(v_form_id,'telefone','phone','Qual WhatsApp para retorno?',6,true,'[]'::jsonb),(v_form_id,'confirmacao','statement','Pedido encaminhado! ✅','O Açaí Total confirmará os próximos passos.',7,false,'[]'::jsonb); END $$;
