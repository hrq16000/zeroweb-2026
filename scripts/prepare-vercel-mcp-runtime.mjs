// Vercel/Node runtime adapter for the pinned SDK. Do not modify MCP transport,
// authentication, tools, metadata, or the Cloudflare deployment.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.VERCEL === "1") {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const sdk = resolve(root, "node_modules/@lovable.dev/mcp-js");
  const pkg = JSON.parse(readFileSync(resolve(sdk, "package.json"), "utf8"));
  if (pkg.version !== "3.6.0") throw new Error("Review MCP runtime adapter for SDK " + pkg.version);
  const files = [
    ["validation-xzkdIA-x.js", "3f4151dafda27cb6f4a1c9f207ed6bb0064f1e3f3bdd883b49e19aef9dad6f51", "e3bf6e29f0fd919c62d283bd90166806c4b158a957623149d3a7593c938665af"],
    ["validation-D6hthH5Q.cjs", "0e77b1db844b483f70cdc7baa5e280c911dd08661cb522e6bed03e944006856c", "1e2ed90fa0269df9f112ef987296f1986751470070beee96a59314b27044dbfd"],
  ];
  const sha = (s) => createHash("sha256").update(s).digest("hex");
  const pending = [];
  for (const [name, before, after] of files) {
    const path = resolve(sdk, "dist", name);
    const original = readFileSync(path, "utf8");
    if (sha(original) === after) continue;
    if (sha(original) !== before) throw new Error("Unexpected MCP SDK bytes: " + name);
    // Node/Vercel has process.env, not a Workers env binding. Adapt only the
    // optional environment reader; all actual OAuth/JSON-RPC code stays intact.
    const updated = original.replace(
      /async function readCloudflareEnv\(name\) \{[\s\S]*?\n\}\n(?=\/\/#endregion)/,
      "async function readCloudflareEnv(name) {\n\treturn readProcessEnv(name);\n}\n",
    );
    if (sha(updated) !== after || updated.includes('"cloudflare:workers"')) {
      throw new Error("MCP Node runtime adapter did not match audited source: " + name);
    }
    pending.push([path, updated]);
  }
  for (const [path, updated] of pending) writeFileSync(path, updated);
  console.log("[vercel-mcp] Node environment adapter verified; SDK transport and OAuth preserved.");
}
