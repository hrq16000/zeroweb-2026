import { createServerFn } from "@tanstack/react-start";
import { getCapital } from "@/lib/capitais";
import {
  institutionalCapitalHasEvidence,
  institutionalProjectsForCapital,
} from "@/lib/institutional-capital-evidence";

export const getInstitutionalCapitalEvidence = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data?.slug ?? "") }))
  .handler(async ({ data }) => {
    const capital = getCapital(data.slug);
    if (!capital) return { hasEvidence: false, projects: [] as { slug: string; title: string }[] };
    return {
      hasEvidence: institutionalCapitalHasEvidence(capital),
      projects: institutionalProjectsForCapital(capital),
    };
  });
