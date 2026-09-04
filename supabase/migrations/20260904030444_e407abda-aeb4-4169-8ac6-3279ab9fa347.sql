UPDATE public.portfolio_client_settings
   SET hero_subheadline = '', content_version = content_version + 1, updated_at = now()
 WHERE slug = 'heloa-gas' AND hero_subheadline = 'Entrega rápida em Piraquara e região';

INSERT INTO public.portfolio_client_settings_history (client_key, field, old_value, new_value)
SELECT 'heloa-gas', 'hero_subheadline', 'Entrega rápida em Piraquara e região', ''
WHERE EXISTS (SELECT 1 FROM public.portfolio_client_settings WHERE slug = 'heloa-gas');
