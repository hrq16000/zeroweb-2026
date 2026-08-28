import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cases as caseStudies } from "@/lib/cases-data";

export function Cases() {
  return (
    <section className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Cases</p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Projetos <span className="text-gradient">no ar.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sites e plataformas que construímos e mantemos. Abra cada case para ver escopo,
            tecnologia e o que foi entregue.
          </p>
        </div>

        {/* Cases reais — link para mini landing page */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4" id="cases">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to="/cases/$slug"
                params={{ slug: cs.slug }}
                className="group block rounded-2xl border border-border overflow-hidden bg-background hover:shadow-elegant transition"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={cs.cover}
                    alt={`Mockup case ${cs.brand}`}
                    width={1280}
                    height={800}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {cs.domain}
                  </div>
                  <div className="mt-1 font-semibold flex items-center justify-between">
                    {cs.brand}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
