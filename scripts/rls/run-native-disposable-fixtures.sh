#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
scratch="$(mktemp -d)"
container=""
cleanup() { if [ -n "$container" ]; then docker rm -fv "$container" >/dev/null 2>&1 || true; fi; rm -rf "$scratch"; }
trap cleanup EXIT
python3 - "$root" "$scratch" <<'PY'
import pathlib,sys
root, out = map(pathlib.Path, sys.argv[1:])
def read(p): return (root/p).read_text()
def embed(f, marker, sql, name):
    lines=read(f).splitlines(keepends=True)
    assert sum(line.strip()==marker for line in lines)==1, f"missing or ambiguous standalone marker {marker}"
    (out/name).write_text("".join(sql.rstrip()+"\n" if line.strip()==marker else line for line in lines))
embed("tests/rls/portal-isolation.fixture.sql","-- RUN_LEGACY_TEST",read("tests/rls/portal_isolation.sql"),"portal.sql")
embed("tests/rls/lead-history-trigger.fixture.sql","-- APPLY_CANDIDATE",read("drizzle/migrations/0008_fix_lead_history_trigger_access.sql"),"trigger.sql")
migration=read("drizzle/migrations/0009_crm_atomic_history_and_lighthouse_receipts.sql")
anchor="ALTER TABLE public.lhci_runs ADD COLUMN measured_at"
assert migration.count(anchor)==1 and migration.startswith("CREATE FUNCTION public.crm_add_history_atomic")
rpc=migration.split(anchor)[0]
assert "GRANT EXECUTE ON FUNCTION public.crm_add_history_atomic" in rpc
embed("tests/crm/crm-history-atomic.fixture.sql","-- APPLY_CANDIDATE",rpc,"crm.sql")
PY
docker pull postgres:16.11
docker image inspect postgres:16.11 --format '{{json .RepoDigests}}'
for name in portal trigger crm; do
  container="$(docker run --rm -d --network none -e POSTGRES_PASSWORD="$(openssl rand -hex 24)" postgres:16.11)"
  for i in $(seq 1 60); do
    if docker exec "$container" pg_isready -U postgres >/dev/null 2>&1; then break; fi
    sleep 1
  done
  docker exec "$container" pg_isready -U postgres >/dev/null
  docker exec -i "$container" psql -X -v ON_ERROR_STOP=1 -U postgres -d postgres < "$scratch/$name.sql"
  docker rm -fv "$container" >/dev/null
  container=""
  echo "PASS_NATIVE_FIXTURE: $name (not production RLS)"
done
