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
cp -a "$scratch/staged/." "$scratch/supabase/migrations/"
# No linked project, --db-url or remote credentials.
if ! localcli db reset --local --no-seed >"$scratch/replay.log" 2>&1; then
  python3 - "$scratch/replay.log" <<'PY'
import re,sys
s=open(sys.argv[1],errors="replace").read()
# Output only SQLSTATE and staged filenames, never raw SQL or local keys.
print("BLOCKED_LOCAL_HISTORY_REPLAY")
print("SQLSTATE:", sorted(set(re.findall(r"SQLSTATE[ :]+([0-9A-Z]{5})",s))))
print("Staged files:", re.findall(r"\b2000\d{10}_[\w.-]+\.sql\b",s)[-3:])
PY
  exit 1
fi
localcli status -o env > "$scratch/status.env"
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
