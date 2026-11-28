#!/usr/bin/env node
// Runs ONLY in-memory PostgreSQL. No URL, credential, psql or network input.
// Use an already-reviewed temporary PGlite installation outside the project:
// bun scripts/test-preparation-sql.mjs --pglite-module=/tmp/.../dist/index.js
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const modulePath = process.argv.find((arg) => arg.startsWith('--pglite-module='))?.slice('--pglite-module='.length);
if (!modulePath || !path.resolve(modulePath).startsWith('/tmp/')) {
  throw new Error('BLOCKED: supply a reviewed temporary PGlite module under /tmp; never a backend URL');
}
const { PGlite } = await import(pathToFileURL(path.resolve(modulePath)).href);
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const legacy = read('tests/rls/portal_isolation.sql');
const portalFixture = read('tests/rls/portal-isolation.fixture.sql');
const noteFixture = read('tests/crm/crm-history-atomic.fixture.sql');
const noteCandidate = read('docs/rls/crm-history-atomic-candidate.sql');
const embed = (fixture, marker, sql) => fixture.replace(marker, () => sql);

async function check(label, sql, expectedError = null) {
  const db = new PGlite();
  let caught = null;
  try { await db.exec(sql); } catch (error) { caught = error; }
  finally { await db.close(); }
  if (expectedError) {
    if (!caught || !expectedError.test(caught.message)) throw new Error(`${label}: negative mutation was not detected`, { cause: caught });
    console.log(`PASS: detected ${label}`);
  } else {
    if (caught) throw new Error(`${label}: failed`, { cause: caught });
    console.log(`PASS: ${label}`);
  }
}

await check('CRM atomic fixture', embed(noteFixture, '-- APPLY_CANDIDATE', noteCandidate));
await check('CRM terminal guard mutation', embed(noteFixture, '-- APPLY_CANDIDATE', noteCandidate.replace("IF target.status IN ('fechado', 'perdido', 'arquivado', 'won', 'lost') THEN", 'IF false THEN')), /terminal .* mutated/);
await check('CRM portal guard mutation', embed(noteFixture, '-- APPLY_CANDIDATE', noteCandidate.replace('id = p_lead_id AND portal_id IS NOT DISTINCT FROM p_portal_id', 'id = p_lead_id')), /cross-portal note/);
await check('legacy isolation fixture', embed(portalFixture, '-- RUN_LEGACY_TEST', legacy));
await check('legacy unexpectedly successful write', embed(portalFixture, '-- RUN_LEGACY_TEST', legacy.replace("'synthetic forbidden'',''forbidden@example.invalid'',''synthetic'')', other_portal)", "'synthetic forbidden'',''forbidden@example.invalid'',''synthetic'')', own_portal)")), /cross-portal write succeeded/);
await check('legacy unrelated SQL error', embed(portalFixture, '-- RUN_LEGACY_TEST', legacy.replace('EXECUTE statement;', 'PERFORM nonexistent_fixture_column FROM public.lead_submissions;')), /nonexistent_fixture_column/);
await check('legacy safety guard', legacy, /requires a local disposable fixture/);