REVOKE EXECUTE ON FUNCTION public.user_portal_ids(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.user_portal_ids(uuid) TO service_role;