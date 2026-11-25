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
python3 - "$scratch/status.env" "$scratch/staged" "$RUNNER_TEMP/rls-replay-result.json" "$RUNNER_TEMP/rls-history-plan.json" <<'PY'
import hashlib,json,os,pathlib,re,subprocess,sys
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
plan=json.loads(pathlib.Path(sys.argv[4]).read_text())
by_staged={entry["staged"]:entry for entry in plan.get("migrationMap",[])}
done=[]
overrides=[]
def report(status,failed=None):
    out.write_text(json.dumps({"status":status,"applied":done,"overrides":overrides,"failed":failed},indent=2)+"\n")
def split_top_level_sql(value):
    parts=[]
    start=0
    depth=0
    quote=None
    dollar_tag=None
    i=0
    while i<len(value):
        char=value[i]
        if dollar_tag:
            if value.startswith(dollar_tag,i):
                i+=len(dollar_tag)
                dollar_tag=None
            else:
                i+=1
            continue
        if quote:
            if char==quote:
                if quote=="'" and i+1<len(value) and value[i+1]=="'":
                    i+=2
                    continue
                quote=None
            i+=1
            continue
        if char in ("'","\""):
            quote=char
            i+=1
            continue
        if char=="$":
            match=re.match(r"\$[A-Za-z_0-9]*\$",value[i:])
            if match:
                dollar_tag=match.group(0)
                i+=len(dollar_tag)
                continue
        if char=="(":
            depth+=1
        elif char==")":
            depth-=1
        elif char=="," and depth==0:
            parts.append(value[start:i].strip())
            start=i+1
        i+=1
    parts.append(value[start:].strip())
    return parts

def normalize_dynamic_form_question_seed(sql,expected_rows,expected_arities):
    pattern=re.compile(r"(?is)(INSERT\s+INTO\s+public\.dynamic_form_questions\s*)\(([^)]*)\)(\s*VALUES\s*)")
    matches=list(pattern.finditer(sql))
    expected_columns=["form_id","key","type","label","order_index","required","options_json"]
    new_columns="form_id,key,type,label,placeholder,hint,order_index,required,options_json"
    if len(matches)!=1:
        raise SystemExit("BLOCKED_LOCAL_OVERRIDE_INSERT_COUNT")
    match=matches[0]
    columns=[column.strip().lower() for column in split_top_level_sql(match.group(2))]
    if columns!=expected_columns:
        raise SystemExit("BLOCKED_LOCAL_OVERRIDE_COLUMN_CONTEXT")
    i=match.end()
    rows=[]
    counts={7:0,8:0,9:0}
    while i<len(sql):
        while i<len(sql) and sql[i].isspace():
            i+=1
        if i>=len(sql) or sql[i]!="(":
            break
        start=i+1
        i+=1
        depth=1
        quote=None
        dollar_tag=None
        while i<len(sql) and depth:
            char=sql[i]
            if dollar_tag:
                if sql.startswith(dollar_tag,i):
                    i+=len(dollar_tag)
                    dollar_tag=None
                else:
                    i+=1
                continue
            if quote:
                if char==quote:
                    if quote=="'" and i+1<len(sql) and sql[i+1]=="'":
                        i+=2
                        continue
                    quote=None
                i+=1
                continue
            if char in ("'","\""):
                quote=char
                i+=1
                continue
            if char=="$":
                tag_match=re.match(r"\$[A-Za-z_0-9]*\$",sql[i:])
                if tag_match:
                    dollar_tag=tag_match.group(0)
                    i+=len(dollar_tag)
                    continue
            if char=="(":
                depth+=1
            elif char==")":
                depth-=1
            i+=1
        if depth:
            raise SystemExit("BLOCKED_LOCAL_OVERRIDE_UNCLOSED_TUPLE")
        fields=split_top_level_sql(sql[start:i-1])
        arity=len(fields)
        if arity not in counts:
            raise SystemExit("BLOCKED_LOCAL_OVERRIDE_UNEXPECTED_ARITY")
        counts[arity]+=1
        if not fields or fields[0]!="v_form_id" or not re.fullmatch(r"'[a-z0-9_]+'",fields[1],re.I):
            raise SystemExit("BLOCKED_LOCAL_OVERRIDE_ROW_CONTEXT")
        if arity==7:
            fields[4:4]=["NULL","NULL"]
        elif arity==8:
            fields.insert(5,"NULL")
        rows.append("("+", ".join(fields)+")")
        while i<len(sql) and sql[i].isspace():
            i+=1
        if i<len(sql) and sql[i]==",":
            i+=1
            continue
        break
    if len(rows)!=expected_rows or counts!=expected_arities:
        raise SystemExit("BLOCKED_LOCAL_OVERRIDE_ROW_ARITY_PROFILE")
    replacement=match.group(1)+"("+new_columns+")"+match.group(3)+"\n  "+",\n  ".join(rows)
    return sql[:match.start()]+replacement+sql[i:],{"rows":len(rows),"original_arities":counts,"normalized_7":counts[7],"normalized_8":counts[8],"preserved_9":counts[9]}

DISPOSABLE_SEED_OVERRIDES={
    "supabase/migrations/20260828083427_seed_eletrovale_eletromecanica_funnel.sql":{"blob_sha":"74d3d57450d1847f647fac1890a0ab8f6a4845c1","rows":8,"arities":{7:6,8:1,9:1}},
    "supabase/migrations/20260828084333_seed_eletro_solucoes_eficazes_funnel.sql":{"blob_sha":"af7cf865a09ef6211666858ec2fc8f96239a7479","rows":8,"arities":{7:6,8:1,9:1}},
    "supabase/migrations/20260828085118_seed_eisenfer_tubos_acos_funnel.sql":{"blob_sha":"d0984eb849b3393239858b30b8d0f558f99c1698","rows":8,"arities":{7:6,8:1,9:1}},
    "supabase/migrations/20260828085941_seed_mary_diarista_funnel.sql":{"blob_sha":"b9abb73004e59d4e4dc5a5a8b738823888ebd48c","rows":8,"arities":{7:6,8:1,9:1}},
    "supabase/migrations/20260828090817_seed_acai_total_araucaria_funnel.sql":{"blob_sha":"ff6b8425b67cc09e8f1f4f8f5995d4cbff242ee6","rows":8,"arities":{7:6,8:1,9:1}},
    "supabase/migrations/20260828091600_seed_jkl_marcenaria_funnel.sql":{"blob_sha":"e8d13f96ded1a49d1ec801f9241fbcbc3b9819ee","rows":9,"arities":{7:7,8:1,9:1}},
    "supabase/migrations/20260901194230_seed_ton_e_cor_funnel.sql":{"blob_sha":"6385195058b66581494c9d2d04a83805a1f88375","kind":"legacy_step_order_seed","column_lists":4},
    "supabase/migrations/20260901200424_seed_raphael_construcoes_funnel.sql":{"blob_sha":"fe3f3efe5b7ad707bc2cf960983bdcdd0e5c7804","kind":"legacy_step_order_seed","column_lists":4},
    "supabase/migrations/20260902004904_seed_jc_revestimentos_funnel.sql":{"blob_sha":"901be15ede8c1c27d0ece0f1990dc759a850dd5a","kind":"legacy_step_order_seed","column_lists":4},
    "supabase/migrations/20260906190903_seed_mania_de_limpeza_funnel.sql":{"blob_sha":"6f582f719f6f4bbd54dcc690dab82389bd5e51fb","kind":"legacy_dynamic_form_id_seed"},
    "supabase/migrations/20260906194009_seed_dona_lucy_salgados_funnel.sql":{"blob_sha":"4123146537ada970b7259888da0953be4548043f","kind":"legacy_dynamic_form_id_seed"},
}
# Validate that the CLI actually exposed a clean local database, not a
# pre-populated schema. Never change a remote or pre-existing instance.
check=subprocess.run(["psql","-X","-At","-v","ON_ERROR_STOP=1","-c","SELECT count(*) FROM pg_catalog.pg_tables WHERE schemaname='public'"],env=pg,capture_output=True,text=True,timeout=20)
if check.returncode or check.stdout.strip()!="0":
    raise SystemExit("BLOCKED: local public schema is not empty")
for p in sorted(pathlib.Path(sys.argv[2]).glob("*.sql")):
    source=by_staged.get(p.name)
    if not source:
        report("BLOCKED_UNMAPPED_MIGRATION",{"file":p.name})
        raise SystemExit("BLOCKED_UNMAPPED_MIGRATION: "+p.name)
    original_bytes=p.read_bytes()
    digest=hashlib.sha256(original_bytes).hexdigest()
    if digest!=source.get("sha256"):
        report("BLOCKED_STAGED_HASH_MISMATCH",{"file":p.name,"source":source.get("source")})
        raise SystemExit("BLOCKED_STAGED_HASH_MISMATCH: "+p.name)
    replay_path=p
    if source.get("source") in DISPOSABLE_SEED_OVERRIDES:
        override_spec=DISPOSABLE_SEED_OVERRIDES[source["source"]]
        blob_sha=hashlib.sha1(b"blob "+str(len(original_bytes)).encode()+b"\0"+original_bytes).hexdigest()
        if blob_sha!=override_spec["blob_sha"]:
            report("BLOCKED_LOCAL_OVERRIDE_GIT_BLOB_MISMATCH",{"file":p.name,"source":source["source"],"blob_sha":blob_sha})
            raise SystemExit("BLOCKED_LOCAL_OVERRIDE_GIT_BLOB_MISMATCH: "+p.name)
        original=original_bytes.decode("utf-8")
        if override_spec.get("kind")=="legacy_step_order_seed":
            old_columns="form_id, step_order, question_key, question_text, question_type, options, is_required"
            new_columns="form_id, order_index, key, label, type, options_json, required"
            count=original.count(old_columns)
            if count!=override_spec.get("column_lists"):
                report("BLOCKED_LOCAL_LEGACY_STEP_COLUMN_COUNT",{"file":p.name,"expected":override_spec.get("column_lists"),"actual":count})
                raise SystemExit("BLOCKED_LOCAL_LEGACY_STEP_COLUMN_COUNT")
            patched=original.replace(old_columns,new_columns)
            stats={"legacy_column_lists":count,"mapping":"step_order/question_key/question_text/question_type/options/is_required -> order_index/key/label/type/options_json/required"}
        elif override_spec.get("kind")=="legacy_dynamic_form_id_seed":
            patched=original
            replacements=[
                (r"\bdynamic_form_id\b","form_id",3),
                (r"\bposition\b","order_index",1),
                (r"\bquestion_key\b","key",1),
                (r"\boptions\b","options_json",1),
            ]
            stats={}
            for pattern,replacement,expected_count in replacements:
                patched,count=re.subn(pattern,replacement,patched,flags=re.I)
                if count!=expected_count:
                    report("BLOCKED_LOCAL_LEGACY_FORM_COLUMN_COUNT",{"file":p.name,"pattern":pattern,"expected":expected_count,"actual":count})
                    raise SystemExit("BLOCKED_LOCAL_LEGACY_FORM_COLUMN_COUNT")
                stats[pattern]=count
            stats["mapping"]="dynamic_form_id/position/question_key/options -> form_id/order_index/key/options_json"
        else:
            patched,stats=normalize_dynamic_form_question_seed(
                original,
                expected_rows=override_spec["rows"],
                expected_arities=override_spec["arities"],
            )
        override_dir=pathlib.Path(sys.argv[2]).parent/"overrides"
        override_dir.mkdir(parents=True,exist_ok=True)
        replay_path=override_dir/p.name
        replay_path.write_text(patched,encoding="utf-8")
        overrides.append({"source":source["source"],"source_sha256":digest,"source_git_blob_sha":blob_sha,"staged":p.name,"replay_sha256":hashlib.sha256(replay_path.read_bytes()).hexdigest(),"reason":"disposable-only compatibility patch: add nullable placeholder/hint columns and normalize the verified 7/8/9-value tuple shapes","added_columns":["placeholder","hint"],"normalized_rows":stats})
    # Refuse client-side psql commands and file/program execution. Dollar
    # quoted SQL is passed unchanged; no naive statement splitting.
    if re.search(r"(?m)^\s*\\",replay_path.read_text()):
        report("BLOCKED_PSQL_META_COMMAND",{"file":p.name,"source":source["source"]})
        raise SystemExit("BLOCKED_PSQL_META_COMMAND: "+p.name)
    print("REPLAY_FILE: "+p.name,flush=True)
    try:
        result=subprocess.run(["psql","-X","-v","ON_ERROR_STOP=1","-v","VERBOSITY=verbose","-f",str(replay_path)],env=pg,capture_output=True,text=True,timeout=150)
    except subprocess.TimeoutExpired:
        report("BLOCKED_TIMEOUT",{"file":p.name,"source":source["source"]})
        raise SystemExit("BLOCKED_TIMEOUT: "+p.name)
    if result.returncode:
        # Never print SQL, failing row values or credentials. Capture only
        # PostgreSQL's structural error metadata from this disposable database.
        states=sorted(set(re.findall(r"(?:ERROR|FATAL):\s+([0-9A-Z]{5}):",result.stderr)))
        lines=re.findall(r"\.sql:(\d+):",result.stderr)
        def diagnostic(label):
            match=re.search(r"(?m)^"+re.escape(label)+r":\s*(.*)$",result.stderr)
            return match.group(1).strip()[:180] if match else None
        constraint=diagnostic("CONSTRAINT NAME")
        schema_name=diagnostic("SCHEMA NAME")
        table_name=diagnostic("TABLE NAME")
        column_name=diagnostic("COLUMN NAME")
        message=re.search(r"(?m)^.*ERROR:\s+[0-9A-Z]{5}:\s*(.*)$",result.stderr)
        definition=None
        if (
            constraint and schema_name and table_name
            and re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*",constraint)
            and re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*",schema_name)
            and re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*",table_name)
        ):
            lookup_sql=(
                "SELECT pg_get_constraintdef(oid) FROM pg_constraint "
                f"WHERE conname = '{constraint}' "
                f"AND conrelid = '{schema_name}.{table_name}'::regclass"
            )
            lookup=subprocess.run(
                ["psql","-X","-At","-v","ON_ERROR_STOP=1","-c",lookup_sql],
                env=pg,capture_output=True,text=True,timeout=15,
            )
            if lookup.returncode==0 and lookup.stdout.strip():
                definition=lookup.stdout.strip()[:500]
        failed={
            "file":p.name,
            "source":source["source"],
            "source_sha256":digest,
            "sqlstates":states,
            "lines":lines[-3:],
            "returncode":result.returncode,
            "schema":schema_name,
            "table":table_name,
            "column":column_name,
            "constraint":constraint,
            "message":message.group(1).strip()[:220] if message else None,
            "constraint_definition":definition,
        }
        report("BLOCKED_LOCAL_HISTORY_REPLAY",failed)
        print("BLOCKED_LOCAL_HISTORY_REPLAY "+json.dumps(failed))
        raise SystemExit(1)
    done.append(p.name)
status="PASS_LOCAL_SQL_REPLAY_WITH_HASH_LOCKED_OVERRIDE" if overrides else "PASS_LOCAL_SQL_REPLAY"
report(status)
print(status+":",len(done))
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
