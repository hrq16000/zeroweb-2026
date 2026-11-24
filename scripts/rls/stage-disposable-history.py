#!/usr/bin/env python3
"""Prepare a temporary, byte-identical migration stream; no database access."""
import datetime as dt
import hashlib
import json
import pathlib
import re
import sys
from collections import Counter

root = pathlib.Path(__file__).resolve().parents[2]
dest = pathlib.Path(sys.argv[1]).resolve()
report = pathlib.Path(sys.argv[2]).resolve()
tmp = pathlib.Path(sys.argv[3]).resolve()
if not dest.is_relative_to(tmp) or not report.is_relative_to(tmp) or dest.exists() and any(dest.iterdir()):
    raise SystemExit("BLOCKED: destination must be an empty runner-temporary directory")
dest.mkdir(parents=True, exist_ok=True)
utc = dt.timezone.utc
entries = []
skipped = []
versions = Counter()
for p in sorted((root / "supabase/migrations").glob("*.sql")):
    match = re.fullmatch(r"(\d{14})_(.+)\.sql", p.name)
    if not match:
        data = p.read_bytes()
        blob = hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
        if p.name != "apply_products.sql" or blob != "44ef412890f26fcd8c6cb7e07d7628ad678f2b98":
            raise SystemExit(f"BLOCKED: unclassified SQL file {p.name}")
        skipped.append({"file": str(p.relative_to(root)), "reason": "non-versioned product description UPDATE script, not a numbered schema migration", "sha256": hashlib.sha256(data).hexdigest()})
        continue
    version, name = match.groups()
    versions[version] += 1
    entries.append((dt.datetime.strptime(version, "%Y%m%d%H%M%S").replace(tzinfo=utc), p, "supabase"))
journal = json.loads((root / "drizzle/migrations/meta/_journal.json").read_text())["entries"]
tags = [x["tag"] for x in journal]
if len(tags) != len(set(tags)) or set(tags) != {p.stem for p in (root / "drizzle/migrations").glob("*.sql")}:
    raise SystemExit("BLOCKED: Drizzle journal does not match SQL files")
if [x["idx"] for x in journal] != list(range(len(journal))) or any(a["when"] >= b["when"] for a,b in zip(journal,journal[1:])):
    raise SystemExit("BLOCKED: Drizzle journal order invalid")
for x in journal:
    entries.append((dt.datetime.fromtimestamp(x["when"]/1000, utc), root / "drizzle/migrations" / (x["tag"] + ".sql"), "drizzle"))
# Resolve only the known same-timestamp pair, in scratch space, not Git history.
duplicates = {v for v,n in versions.items() if n > 1}
expected = {"20260901054015_seed_brecho_sao_francisco_funnel.sql", "20260901054015_seed_reuse_house_brecho_funnel.sql"}
if duplicates - {"20260901054015"} or ("20260901054015" in duplicates and {p.name for _,p,s in entries if s == "supabase" and p.name.startswith("20260901054015_")} != expected):
    raise SystemExit("BLOCKED: additional migration collision requires review")
for _,p,s in entries:
    if p.name in expected:
        key = "funnel-brecho-sao-francisco" if "sao_francisco" in p.name else "funnel-reuse-house-brecho"
        data = p.read_text()
        if key not in data or re.search(r"\b(DELETE|DROP|TRUNCATE)\b", data, re.I):
            raise SystemExit("BLOCKED: known collision seed changed, review required")
entries.sort(key=lambda x:(x[0], x[2], x[1].name))
mapping = []
risk = []
reviewed_local_cron = {
    "20260605011011_e6fde5e0-95dd-4396-a80b-c20c0c5b1415.sql": "2e878745668d38d5e90d1fd5b1d6707c6e28f470",
    "20260605030038_9d0fe9d9-ece4-4b23-9a58-a47438ffa7dc.sql": "930977c003cb9a73254c0e7c56f75ff64bb9c969",
}
reviewed = []
# These exact historical blobs schedule only local purge/refresh SQL.
# pg_net extension creation is not a network request. No HTTP call is allowed.
# Fail closed before replay if historical SQL may initiate external work.
external = re.compile(r"\b(?:net\s*\.\s*http_\w+|http_(?:post|get|put|delete|patch)|cron\s*\.\s*schedule(?:_in_database)?|dblink\w*|postgres_fdw|file_fdw|copy\b[^;]*\bprogram)\b", re.I | re.S)
for i,(when,p,source) in enumerate(entries, 1):
    data = p.read_bytes()
    name = (dt.datetime(2000,1,1,tzinfo=utc)+dt.timedelta(seconds=i)).strftime("%Y%m%d%H%M%S") + "_" + source + "_" + p.name
    out = dest / name
    out.write_bytes(data)
    digest = hashlib.sha256(data).hexdigest()
    if hashlib.sha256(out.read_bytes()).hexdigest() != digest:
        raise SystemExit("BLOCKED: byte mismatch")
    mapping.append({"source":str(p.relative_to(root)),"staged":name,"originalTime":when.isoformat(),"sha256":digest})
    if external.search(data.decode("utf-8")):
        blob = hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
        if reviewed_local_cron.get(p.name) == blob:
            reviewed.append({"file": str(p.relative_to(root)), "gitBlob": blob, "reason": "reviewed local-only cron purge/refresh; no external HTTP invocation"})
        else:
            risk.append(str(p.relative_to(root)))
report.write_text(json.dumps({"status":"PLAN_ONLY","ordering":"candidate chronology: Supabase filename UTC + Drizzle journal UTC; not a claim about historical applied order","numberedSupabase":sum(s=="supabase" for _,_,s in entries),"drizzle":len(journal),"excluded":skipped,"duplicateVersions":sorted(duplicates),"migrationMap":mapping,"externalReviewRequired":risk,"reviewedLocalCron":reviewed},indent=2)+"\n")
print(f"Prepared {len(mapping)} byte-identical staged migrations, excluded {len(skipped)} non-versioned scripts, collisions={sorted(duplicates)}")
if risk:
    print("BLOCKED_EXTERNAL_SQL_REVIEW: " + ", ".join(risk))
    raise SystemExit(2)
