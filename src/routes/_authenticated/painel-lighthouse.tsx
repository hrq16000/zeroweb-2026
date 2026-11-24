import { createFileRoute, Link } from '@tanstack/react-router';
import { LhciAdmin } from '@/components/site/LhciAdmin';
import { PainelGate } from '@/components/site/PainelGate';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/painel-lighthouse')({
  head: () => ({ meta: [
    { title: 'Medições Lighthouse · Recebimentos · 0WEB' },
    { name: 'description', content: 'Acompanhamento administrativo de medições Lighthouse recebidas, com data original, nota, status e pendências por projeto.' },
    { property: 'og:title', content: 'Medições Lighthouse · 0WEB' },
    { property: 'og:description', content: 'Histórico restrito de recebimentos Lighthouse e cobertura dos projetos acompanhados.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex,nofollow' },
  ] }),
  component: LighthousePage,
});

function LighthousePage() {
  return <PainelGate><Header /><main className="min-h-screen bg-background pt-32 pb-20 text-foreground"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="font-display text-3xl font-bold">Recebimentos Lighthouse</h1><Button variant="outline" className="min-h-11" asChild><Link to="/painel-auditorias"><ArrowLeft />Auditorias por rota</Link></Button></div><LhciAdmin /></div></main><Footer /></PainelGate>;
}