import serviceCoverBindings from "@/config/service-cover-bindings.json";

type BindingManifest = {
  version: number;
  basePath: string;
  bindings: Record<string, string>;
};

const manifest = serviceCoverBindings as BindingManifest;

export function canonicalServiceCoverFile(slug: string): string | null {
  return manifest.bindings[slug] ?? null;
}

export function canonicalServiceCoverUrl(slug: string): string | null {
  const file = canonicalServiceCoverFile(slug);
  if (!file) return null;
  return `${manifest.basePath.replace(/\/$/, "")}/${file}`;
}

export const canonicalServiceCoverBindings = manifest.bindings;
