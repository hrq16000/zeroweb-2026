import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { FunnelPreview } from "@/components/funnel/FunnelPreview";
import { DonaGarimpeiraBrechoPage, type GarimpeiraInterest } from "@/components/site/DonaGarimpeiraBrechoPage";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const getPreviewQuestions = createServerFn({ method: "GET" }).handler(async () => {
  if (!import.meta.env.DEV && process.env.VERCEL_ENV !== "preview") return null;

  const { default: contract } = await import("../../docs/portfolio/drafts/dona-garimpeira-brecho-funnel-contract.json");
  return contract.questions.map(({ options, ...question }) => ({
    ...question,
    id: question.key,
    options_json: options,
  }));
});

export const Route = createFileRoute("/portfolio-preview/dona-garimpeira-brecho")({
  loader: async () => {
    const questions = await getPreviewQuestions();
    if (!questions) throw notFound();
    return questions;
  },
  head: () => ({
    meta: [
      { title: "Prévia para avaliação | Dona Garimpeira" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: CustomerPreview,
});

function CustomerPreview() {
  const questions = Route.useLoaderData();
  const [interest, setInterest] = useState<GarimpeiraInterest | null>(null);

  return (
    <>
      <aside className="bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-950">
        Prévia para avaliação. O atendimento é simulado.
      </aside>
      <DonaGarimpeiraBrechoPage onPreviewInterest={setInterest} />
      <Dialog open={interest !== null} onOpenChange={(open) => { if (!open) setInterest(null); }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Atendimento da Dona Garimpeira</DialogTitle>
            <DialogDescription>Use dados de exemplo. A demonstração não guarda respostas nem abre o WhatsApp.</DialogDescription>
          </DialogHeader>
          {interest && <FunnelPreview
            key={interest}
            name="Dona Garimpeira"
            questions={questions}
            conditions={[]}
            prefill={{ interesse: interest }}
            showDiagnostics={false}
          />}
        </DialogContent>
      </Dialog>
    </>
  );
}
