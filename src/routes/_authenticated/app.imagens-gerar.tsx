import { createFileRoute } from "@tanstack/react-router";
import { Download, Image, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/imagens-gerar")({
  component: ImageStudioPage,
});

const purposes = [
  ["hero", "Hero da landing"],
  ["social", "Capa social"],
  ["section", "Seção interna"],
  ["editorial", "Variação editorial"],
  ["page", "Conjunto visual da página"],
] as const;

const styles = [
  ["editorial", "Editorial"],
  ["photographic", "Fotográfico"],
  ["minimal", "Minimalista"],
  ["bold", "Impactante"],
  ["documentary", "Documental"],
] as const;

type Purpose = (typeof purposes)[number][0];
type Style = (typeof styles)[number][0];

function ImageStudioPage() {
  const [projectName, setProjectName] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("hero");
  const [style, setStyle] = useState<Style>("editorial");
  const [brief, setBrief] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    setError(null);
    setImage(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Entre novamente para gerar imagens.");
      const response = await fetch("/api/generate-portfolio-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, purpose, style, brief }),
      });
      const payload = await response.json().catch(() => null) as { image?: string; message?: string } | null;
      if (!response.ok || !payload?.image) throw new Error(payload?.message || "Não foi possível gerar a imagem.");
      setImage(payload.image);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível gerar a imagem.");
    } finally {
      setGenerating(false);
    }
  };

  const download = async () => {
    if (!image) return;
    const blob = await fetch(image).then((response) => response.blob());
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${projectName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "imagem"}-${purpose}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const valid = projectName.trim().length >= 2 && brief.trim().length >= 20;

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase text-primary">Rascunhos protegidos</p>
        <h1 className="text-3xl font-bold font-display">Gerador de imagens</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Gere mídia editorial para revisão e download. Nada é publicado ou aplicado ao projeto automaticamente.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="space-y-5" aria-labelledby="generator-fields">
          <h2 id="generator-fields" className="sr-only">Dados da imagem</h2>
          <div className="space-y-2">
            <Label htmlFor="project-name">Marca ou projeto</Label>
            <Input id="project-name" value={projectName} onChange={(event) => setProjectName(event.target.value)} maxLength={120} placeholder="Nome exato da marca" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Finalidade</Label>
              <Select value={purpose} onValueChange={(value) => setPurpose(value as Purpose)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{purposes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estilo</Label>
              <Select value={style} onValueChange={(value) => setStyle(value as Style)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{styles.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-brief">Briefing visual</Label>
            <Textarea id="image-brief" value={brief} onChange={(event) => setBrief(event.target.value)} maxLength={1800} rows={8} placeholder="Descreva assunto, enquadramento, luz, ambiente e cores. Não inclua provas ou resultados não documentados." />
            <p className="text-xs text-muted-foreground">Mínimo de 20 caracteres. O gerador remove texto, marcas e alegações da composição.</p>
          </div>
          <Button onClick={generate} disabled={!valid || generating} className="w-full sm:w-auto">
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {generating ? "Gerando…" : "Gerar rascunho"}
          </Button>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <div className="flex gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <p>A imagem gerada é material ilustrativo. Revise direitos, fidelidade e finalidade antes de qualquer uso.</p>
          </div>
        </section>

        <section className="min-h-[420px] border border-border bg-muted/30 p-4" aria-label="Prévia da imagem">
          {image ? (
            <div className="space-y-4">
              <img src={image} alt={`Rascunho gerado para ${projectName}`} className="max-h-[680px] w-full object-contain" />
              <Button type="button" variant="outline" onClick={download}>
                <Download className="mr-2 h-4 w-4" /> Baixar PNG
              </Button>
            </div>
          ) : (
            <div className="grid min-h-[390px] place-items-center text-center text-muted-foreground">
              <div>
                <Image className="mx-auto mb-3 h-8 w-8" />
                <p className="text-sm">A prévia aparecerá aqui.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}