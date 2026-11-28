import { gzipSync } from "node:zlib";
import type { Plugin } from "vite";

/** Read-only evidence from the actual emitted JS; does not alter chunks. */
export function routeBundleEvidence(): Plugin {
  return {
    name: "0web-route-bundle-evidence",
    apply: "build",
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter((item) => item.type === "chunk");
      const entry = chunks.filter((chunk) => chunk.fileName.startsWith("assets/") && chunk.isEntry);
      if (!entry.length) return;
      const byName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
      for (const root of entry) {
        const seen = new Set<string>();
        const visit = (name: string) => {
          if (seen.has(name)) return;
          const chunk = byName.get(name);
          if (!chunk) return;
          seen.add(name);
          for (const dependency of chunk.imports) visit(dependency);
        };
        visit(root.fileName);
        const initial = [...seen].map((name) => byName.get(name)!);
        const modules = initial.flatMap((chunk) =>
          Object.entries(chunk.modules).map(([id, module]) => ({
            id: id.replaceAll("\\", "/").replace(/^.*\/(src|node_modules)\//, "$1/"),
            bytes: module.renderedLength,
          })),
        ).sort((a, b) => b.bytes - a.bytes);
        console.log("[route-bundle-evidence]", JSON.stringify({
          entry: root.fileName,
          rawBytes: initial.reduce((n, chunk) => n + Buffer.byteLength(chunk.code), 0),
          gzipBytes: initial.reduce((n, chunk) => n + gzipSync(chunk.code).byteLength, 0),
          entryRawBytes: Buffer.byteLength(root.code),
          entryGzipBytes: gzipSync(root.code).byteLength,
          staticChunks: [...seen],
          topModules: modules.slice(0, 30),
          heavyRouteModulesInStaticGraph: modules.filter(({ id }) => /src\/components\/(route-pages\/|site\/Home[23])/.test(id)),
          routeChunks: chunks.filter((chunk) => Object.keys(chunk.modules).some((id) => /(?:route-pages\/(?:CheckoutPage|PainelGated|CrmGatedPage)|site\/Home[23](?:PersonalityExperience|MixExperience))\.tsx/.test(id.replaceAll("\\", "/")))).map((chunk) => ({file: chunk.fileName, rawBytes: Buffer.byteLength(chunk.code), gzipBytes: gzipSync(chunk.code).byteLength})),
        }));
      }
    },
  };
}
