# Disposable RLS evidence — #469

Remote gate unchanged: BLOCKED_MISSING_SECRET in 45418525760. The new workflow tests only a runner-owned disposable environment. Native fixture job uses PostgreSQL with network disabled; it exercises the existing isolation model and the actual migration 0008 plus the RPC portion of 0009, not the whole deployed schema. Replay job stages byte-identical numbered SQL using a candidate chronological ordering of Supabase timestamps and the Drizzle journal, excludes only the verified non-versioned product update, and assigns unique scratch filenames (including the two independent seed slugs sharing 20260901054015). It fails closed on unknown collisions or possible external calls, then runs the existing TypeScript tests against a fresh local Supabase stack if preflight and replay succeed. The mapping records checksums and excluded scripts; it does not certify historical applied ordering. Credentials are local generated values, never production secrets. No SQL or configuration changed on a remote database. Do not mark production RLS PASS from these results. The workflow has two separate jobs so a historical replay blocker does not hide native fixture evidence.

## Round 2.2
Native job 138594810885: portal, trigger and CRM PASS on PostgreSQL 16.11, image digest sha256:468e1f126ca5af849799cda06ac9b03d8090aae9fa5163408b3e8da44fad0702. Replay job 138594811240 staged 210 byte-identical migrations, blocked two cron migrations. Full SQL review: first schedules local visitor purge, second schedules local materialized view refresh and blocklist purge; neither invokes external HTTP. Exact Git blob allowlist only; any changed bytes or other matched SQL remain blocked. No historical SQL changed, no remote database access. Candidate ordering remains unproven.

## Round 2.3
Run 45437254362: native fixtures PASS again; 210 staged byte-identical, local CLI initialized, db reset failed SQLSTATE 42601 without identifying migration. Replace CLI statement replay with native psql against fresh loopback-only database, verified empty public schema and synthetic credentials; apply each file unchanged in planned order; fail on first SQLSTATE with exact filename and line, publish only sanitized metadata. Refuse psql meta commands. No historical rewrite or claim of parity. This revised runner is a candidate pending execution.


## Round 2.4 — precise disposable replay blocker

The first hash guard intentionally failed closed because the hand-reconstructed expected digest did not match the staged file. The artifact's SHA-256 is authoritative; the guard now uses the exact staged digest `87e1e3779ca9be580654cc994f3fbefd2757c7e16b8cbd562346c686ceed73ab`.

Run 45439022801 / job 138604639044 stopped at staged source `supabase/migrations/20260828083427_seed_eletrovale_eletromecanica_funnel.sql`, line 5, SQLSTATE 42601. The INSERT declared seven columns but supplied nine values. The two additional values are the intended `placeholder` and `hint`; the generated database types confirm both columns exist.

The historical migration remains byte-identical. The disposable runner now applies a single hash-locked, temporary compatibility patch to the staged copy only:
- source SHA-256: `87e1e3779ca9be580654cc994f3fbefd2757c7e16b8cbd562346c686ceed73ab`;
- add `placeholder,hint` to the INSERT column list;
- record source/replay hashes and the reason in `rls-replay-result.json`.

Any different source hash or SQL context fails closed. No migration file, remote database or production data is modified. The three native fixture tests remain preserved and are skipped when only the history replay runner changes. Remote RLS remains `BLOCKED_MISSING_SECRET`; local replay does not certify production RLS.
