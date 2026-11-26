-- Maintenance / privileged routines: server (service_role) only
REVOKE EXECUTE ON FUNCTION public.anonymize_visitantes_rastreio_old() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.purge_ip_blocklist() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.purge_rate_limit_buckets() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.purge_visitantes_rastreio_old() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.purge_visitor_events_old() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.purge_visitor_funnel_sessions() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_visitor_mvs() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.pgrst_reload_schema() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.db_required_tables_check(text[]) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.resolve_or_create_identity(text, text, text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.stitch_visitor_identity(text, uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.anonymize_visitantes_rastreio_old() TO service_role;
GRANT EXECUTE ON FUNCTION public.purge_ip_blocklist() TO service_role;
GRANT EXECUTE ON FUNCTION public.purge_rate_limit_buckets() TO service_role;
GRANT EXECUTE ON FUNCTION public.purge_visitantes_rastreio_old() TO service_role;
GRANT EXECUTE ON FUNCTION public.purge_visitor_events_old() TO service_role;
GRANT EXECUTE ON FUNCTION public.purge_visitor_funnel_sessions() TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_visitor_mvs() TO service_role;
GRANT EXECUTE ON FUNCTION public.pgrst_reload_schema() TO service_role;
GRANT EXECUTE ON FUNCTION public.db_required_tables_check(text[]) TO service_role;
GRANT EXECUTE ON FUNCTION public.resolve_or_create_identity(text, text, text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.stitch_visitor_identity(text, uuid) TO service_role;

-- Rate limiter: no anonymous callers; signed-in users (support chat) and server keep access
REVOKE EXECUTE ON FUNCTION public.check_and_record_rate_limit(text, text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_and_record_rate_limit(text, text, integer, integer) TO authenticated, service_role;

-- Internal reports: no anonymous reads
REVOKE ALL ON public.mv_visitors_daily FROM PUBLIC, anon;
REVOKE ALL ON public.mv_visitors_hourly FROM PUBLIC, anon;
REVOKE ALL ON public.mv_block_reasons_daily FROM PUBLIC, anon;
REVOKE ALL ON public.partner_ranking_30d FROM PUBLIC, anon;
REVOKE ALL ON public.license_overview FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.mv_visitors_daily, public.mv_visitors_hourly, public.mv_block_reasons_daily, public.partner_ranking_30d TO authenticated;
GRANT SELECT ON public.mv_visitors_daily, public.mv_visitors_hourly, public.mv_block_reasons_daily, public.partner_ranking_30d, public.license_overview TO service_role;