import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, CheckCircle2, Globe2, Megaphone, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { trackEvent } from "@/lib/analytics";
import { shouldEmitSocialProof } from "@/lib/telemetry-v2";
import { useNearFooter } from "@/hooks/useNearFooter";
import { FLOATING_SLOT, FLOATING_Z, hideNearFooter } from "@/lib/floating-stack";
import { getSocialProofFeed, type SocialProofItem as Notif } from "@/lib/social-proof.functions";

export function SocialProof() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const nearFooter = useNearFooter();

  const fetchFeed = useServerFn(getSocialProofFeed);
  const { data } = useQuery({
    queryKey: ["social-proof-feed"],
    queryFn: () => fetchFeed(),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  // A ordem vem do servidor por created_at DESC. Não embaralhamos nem
  // fabricamos fallback: sem evento real, não existe prova social para exibir.
  const pool: Notif[] = useMemo(() => data?.items ?? [], [data?.items]);

  useEffect(() => {
    if (dismissed || pool.length === 0) {
      setVisible(false);
      return;
    }
    const start = setTimeout(() => setVisible(true), 4500);
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((prev) => (pool.length <= 1 ? 0 : (prev + 1) % pool.length));
        setVisible(true);
      }, 500);
    }, 8500);
    return () => {
      clearTimeout(start);
      clearInterval(cycle);
    };
  }, [dismissed, pool.length]);

  const item = pool.length > 0 ? pool[idx % pool.length] : null;

  useEffect(() => {
    if (!visible || dismissed || !item) return;
    if (!shouldEmitSocialProof("site")) return;
    trackEvent("social_proof_view", { location: "site_floating" });
  }, [visible, dismissed, item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          key={item.id}
          initial={{ y: 24, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className={`fixed ${FLOATING_SLOT.three} left-4 sm:left-5 ${FLOATING_Z.fab} max-w-[19rem] ${hideNearFooter(nearFooter)}`}
        >
          <div className="relative rounded-2xl glass shadow-elegant border border-border p-3 pr-8">
            <button
              aria-label="Fechar"
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted text-muted-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-primary text-primary-foreground shrink-0 font-bold">
                {item.name.charAt(0)}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-foreground flex items-center gap-1">
                  {item.name}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-muted-foreground text-xs">{item.action}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{item.time}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Barra de capacidades factuais. Não usa avaliações, quantidade de clientes ou
 * tempo de mercado sem uma fonte de evidência vinculada.
 */
export function TrustBar() {
  return (
    <section aria-label="Áreas de atuação" className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <Trust icon={<Globe2 className="w-4 h-4 text-primary" />} label="Sites e landing pages" />
        <Trust icon={<Search className="w-4 h-4 text-primary" />} label="SEO e presença digital" />
        <Trust icon={<Megaphone className="w-4 h-4 text-primary" />} label="Tráfego e mídia paga" />
        <Trust icon={<Bot className="w-4 h-4 text-primary" />} label="Automação e IA" />
      </div>
    </section>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 font-medium text-foreground/80">
      {icon}
      {label}
    </div>
  );
}
