#!/usr/bin/env node
/**
 * Read-only emitter for baseline candidate PNG bytes.
 * Only logs images generated during the real Chromium test.
 * Must not change approved-hashes.json or make PASS claims.
 */
import { readFileSync, existsSync } from "node:fs";
for(const name of ["mobile","tablet","desktop"]){
  const path="tests/visual/baseline/toop-assados-"+name+".png";
  if(!existsSync(path)) {console.error("[toop-baseline] absent "+name);process.exitCode=1;continue;}
  const base64=readFileSync(path).toString("base64");
  const parts=base64.match(/.{1,20000}/g)||[];
  console.log("TOOP_IMAGE_BEGIN:baseline-"+name+":"+parts.length);
  parts.forEach((v,i)=>console.log("TOOP_IMAGE_PART:baseline-"+name+":"+i+":"+v));
  console.log("TOOP_IMAGE_END:baseline-"+name);
  console.log("[toop-baseline] captured (not approved): "+name);
}
