import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DonaGarimpeiraLeadsAdmin } from "@/components/site/DonaGarimpeiraLeadsAdmin";
import { PainelGate } from "@/components/site/PainelGate";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/painel-dona-garimpeira-leads")({
  head: () => ({ meta: [
    { title: "Central de leads · Dona Garimpeira · 0WEB" },
    { name: "description", content: "Cadastro, acompanhamento e histórico dos contatos comerciais da Dona Garimpeira, restrito a administradores." },
    { property: "og:title", content: "Central de leads · Dona Garimpeira" },
    { property: "og:description", content: "Área administrativa restrita para acompanhar os contatos comerciais do brechó." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex,nofollow" },
  ] }),
  component: DonaGarimpeiraLeadsPage,
});

function DonaGarimpeiraLeadsPage() {
  return <PainelGate><Header /><main className="min-h-screen bg-background pt-32 pb-20 text-foreground"><div className="mx-auto max-w-6xl px-5 lg:px-8"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="font-display text-3xl font-bold">Central de leads · Dona Garimpeira</h1><Button variant="outline" className="min-h-11" asChild><Link to="/painel"><ArrowLeft />Painel</Link></Button></div><DonaGarimpeiraLeadsAdmin /></div></main><Footer /></PainelGate>;
}
