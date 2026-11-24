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


## Round 2.4 — second disposable replay correction

The next run reached the Eletrovale seed but still returned SQLSTATE 42601 at line 5. The staged SQL confirms the reason: the original INSERT has seven declared columns while its rows use three different arities:
- six rows have 7 values;
- the confirmation row has 8 values;
- the details row has 9 values.

The hash-locked disposable override now:
1. expands the INSERT column list to include nullable `placeholder` and `hint`;
2. adds `NULL,NULL` to the six legacy 7-value rows;
3. adds `NULL` to the 8-value confirmation row;
4. preserves the 9-value details row unchanged;
5. refuses the override if any expected row occurs zero or multiple times.

The source migration remains unchanged. This is a local disposable replay compatibility shim only; it does not repair or certify the production migration history. The native PostgreSQL fixture job passed on the previous attempt and remains unchanged.


## Runner integrity correction

A source review of the updated workflow runner found two editing defects before treating the new run as valid: a duplicate compatibility-write block and a missing newline between consecutive Python here-documents. Both are corrected. The runner now records the single staged override exactly once and keeps the two Python programs syntactically separated. No migration or database was touched.


## Full seed-chain diagnosis — six confirmed historical INSERT defects

A static SQL-structure scan covered all 55 funnel seed migrations in the 201-file migration history. Exactly six seed files in the 2026-08-28 batch have the same invalid shape: the declared \`dynamic_form_questions\` INSERT has seven columns, but its tuples contain 7, 8 and 9 values. The schema's generated types confirm nullable \`placeholder\` and \`hint\` columns.

Affected source migrations (all remain byte-identical and hash-locked by Git blob SHA in the disposable runner):
- Eletrovale Eletromecânica — 8 rows (6×7, 1×8, 1×9)
- Eletro Soluções Eficazes — 8 rows (6×7, 1×8, 1×9)
- Eisenfer Tubos e Aços — 8 rows (6×7, 1×8, 1×9)
- Mary Diarista — 8 rows (6×7, 1×8, 1×9)
- Açaí Total Araucária — 8 rows (6×7, 1×8, 1×9)
- JKL Marcenaria — 9 rows (7×7, 1×8, 1×9)

The temporary replay adapter expands the insert to the nine-column schema, adds \`NULL,NULL\` after the label for every 7-value row, adds \`NULL\` for the missing hint in every 8-value confirmation row, and preserves the already-correct 9-value details row. Across all six seeds, 43 rows are normalized and 6 are preserved as-is. It validates the exact Git blob hash, expected column list, tuple count, key format and arity profile before writing only to the disposable staging directory. Any unexpected SQL shape fails closed.

No historical migration, migration timestamp, database schema, remote secret, production data or production RLS policy is changed. The replay remains local-only and does not certify remote production RLS.
