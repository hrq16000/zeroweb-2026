#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
scratch="$(mktemp -d "$RUNNER_TEMP/0web-rls.XXXXXX")"
mkdir -p "$scratch/home"
python3 "$root/scripts/rls/stage-disposable-history.py" "$scratch/staged" "$RUNNER_TEMP/rls-history-plan.json" "$RUNNER_TEMP"
cli="$scratch/supabase"
# Download a pinned official release, verify the GitHub asset digest before executing.
curl --fail --silent --show-error --location https://github.com/supabase/cli/releases/download/v2.79.0/supabase_linux_amd64.tar.gz -o "$scratch/cli.tar.gz"
printf '%s  %s\n' 624dc29c696345dcc4fbe5293925c10c163f99f2952adeaeae892200740a3a27 "$scratch/cli.tar.gz" | sha256sum -c -
mkdir "$scratch/bin"
tar -xzf "$scratch/cli.tar.gz" -C "$scratch/bin" supabase
cli="$scratch/bin/supabase"
localcli() { (cd "$scratch" && env -i PATH="$PATH" HOME="$scratch/home" CI=true "$cli" "$@"); }
cleanup() { localcli stop --no-backup >/dev/null 2>&1 || true; rm -rf "$scratch"; }
trap cleanup EXIT
localcli --version
localcli init --help >/dev/null
localcli init >/dev/null
test -f "$scratch/supabase/config.toml" || { echo "BLOCKED_LOCAL_CONFIG_NOT_CREATED"; exit 1; }
mkdir -p "$scratch/supabase/migrations"
# The fresh config cannot contain the versioned project_ref or an external URL.
test ! -e "$scratch/supabase/.temp/project-ref"
if grep -q 'lxajhxocyqzwwbcfahya' "$scratch/supabase/config.toml"; then echo "BLOCKED: production project ref"; exit 1; fi
localcli start --help >/dev/null
localcli db reset --help | grep -q -- '--local'
localcli db reset --help | grep -q -- '--no-seed'
# Start an empty local stack, then replay the reviewed candidate chronology.
# CLI output may contain generated credentials; do not echo it.
if ! localcli start >"$scratch/start.log" 2>&1; then
  echo "BLOCKED_LOCAL_STACK_START"; exit 1
fi
# The CLI reset returned SQLSTATE 42601 without identifying a migration.
# Use the actual PostgreSQL parser, one byte-identical file at a time, in
# this fresh disposable stack. No reset, schema inference or SQL rewrite.
localcli status -o env > "$scratch/status.env"
python3 - "$scratch/status.env" "$scratch/staged" "$RUNNER_TEMP/rls-replay-result.json" <<'PY'
import json,os,pathlib,re,subprocess,sys
from urllib.parse import urlparse,unquote
env={}
for line in pathlib.Path(sys.argv[1]).read_text().splitlines():
    m=re.fullmatch(r'([A-Z_]+)="?([^"\n]+)"?',line.strip())
    if m: env[m[1]]=m[2]
url=urlparse(env.get("DB_URL",""))
if url.scheme not in ("postgresql","postgres") or url.hostname not in ("127.0.0.1","localhost") or url.port!=54322 or url.path!="/postgres" or url.username!="postgres" or not url.password or url.query or url.fragment:
    raise SystemExit("BLOCKED: not the newly generated local database URL")
pg={"PATH":os.environ["PATH"],"HOME":os.environ["HOME"],"PGHOST":url.hostname,"PGPORT":str(url.port),"PGDATABASE":"postgres","PGUSER":"postgres","PGPASSWORD":unquote(url.password),"PGCONNECT_TIMEOUT":"10","PGOPTIONS":"-c statement_timeout=120000 -c lock_timeout=10000"}
out=pathlib.Path(sys.argv[3])
done=[]
def report(status,failed=None):
    out.write_text(json.dumps({"status":status,"applied":done,"failed":failed},indent=2)+"\n")
# Validate that the CLI actually exposed a clean local database, not a
# pre-populated schema. Never change a remote or pre-existing instance.
check=subprocess.run(["psql","-X","-At","-v","ON_ERROR_STOP=1","-c","SELECT count(*) FROM pg_catalog.pg_tables WHERE schemaname='public'"],env=pg,capture_output=True,text=True,timeout=20)
if check.returncode or check.stdout.strip()!="0":
    raise SystemExit("BLOCKED: local public schema is not empty")
for p in sorted(pathlib.Path(sys.argv[2]).glob("*.sql")):
    # Refuse client-side psql commands and file/program execution. Dollar
    # quoted SQL is passed unchanged; no naive statement splitting.
    if re.search(r"(?m)^\s*\\",p.read_text()):
        report("BLOCKED_PSQL_META_COMMAND",{"file":p.name})
        raise SystemExit("BLOCKED_PSQL_META_COMMAND: "+p.name)
    print("REPLAY_FILE: "+p.name,flush=True)
    try:
        result=subprocess.run(["psql","-X","-v","ON_ERROR_STOP=1","-v","VERBOSITY=verbose","-f",str(p)],env=pg,capture_output=True,text=True,timeout=150)
    except subprocess.TimeoutExpired:
        report("BLOCKED_TIMEOUT",{"file":p.name})
        raise SystemExit("BLOCKED_TIMEOUT: "+p.name)
    if result.returncode:
        # Never print SQL, result rows or credentials. Only file/line/state.
        states=sorted(set(re.findall(r"(?:ERROR|FATAL):\s+([0-9A-Z]{5}):",result.stderr)))
        lines=re.findall(r"\.sql:(\d+):",result.stderr)
        failed={"file":p.name,"sqlstates":states,"lines":lines[-3:],"returncode":result.returncode}
        report("BLOCKED_LOCAL_HISTORY_REPLAY",failed)
        print("BLOCKED_LOCAL_HISTORY_REPLAY "+json.dumps(failed))
        raise SystemExit(1)
    done.append(p.name)
report("PASS_LOCAL_SQL_REPLAY")
print("PASS_LOCAL_SQL_REPLAY:",len(done))
PY
python3 - "$scratch/status.env" "$root" <<'PY'
import os,pathlib,re,subprocess,sys
from urllib.parse import urlparse
env={}
for line in pathlib.Path(sys.argv[1]).read_text().splitlines():
    m=re.fullmatch(r'([A-Z_]+)="?([^"\n]+)"?',line.strip())
    if m: env[m[1]]=m[2]
url=env.get("API_URL","")
parsed=urlparse(url)
if parsed.scheme!="http" or parsed.hostname not in ("127.0.0.1","localhost") or parsed.port!=54321 or parsed.username or parsed.password:
    raise SystemExit("BLOCKED: non-local API URL")
anon=env.get("ANON_KEY") or env.get("PUBLISHABLE_KEY")
service=env.get("SERVICE_ROLE_KEY") or env.get("SECRET_KEY")
if not anon or not service or anon==service: raise SystemExit("BLOCKED: no generated local credentials")
runenv={"PATH":os.environ["PATH"],"HOME":os.environ["HOME"],"CI":"true","SUPABASE_URL":url,"VITE_SUPABASE_URL":url,"SUPABASE_PUBLISHABLE_KEY":anon,"VITE_SUPABASE_PUBLISHABLE_KEY":anon,"SUPABASE_SERVICE_ROLE_KEY":service}
# Only local generated values, never use checked-in .env fallback.
subprocess.run(["bun","--no-env-file","test","tests/rls/sensitive_tables.test.ts","tests/rls/portal_isolation.test.ts"],cwd=sys.argv[2],env=runenv,check=True)
PY
echo "PASS_LOCAL_HISTORY_REPLAY_AND_RLS (not production gate)"
