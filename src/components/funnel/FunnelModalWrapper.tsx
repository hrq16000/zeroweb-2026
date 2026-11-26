import { lazy, Suspense, useEffect, useState } from "react";
import type { ContactIntent } from "@/lib/contact-intent";

export type FunnelModalWrapperProps = {
  open: boolean;
  onClose: () => void;
  funnelSlug: string;
  serviceSlug?: string;
  intent?: ContactIntent;
  /** Respostas já conhecidas (ex.: plano clicado na home). */
  prefill?: Record<string, string | string[]>;
  /** Contexto da página de origem enviado junto ao lead. */
  context?: Record<string, string>;
};

const FunnelModalContent = lazy(() =>
  import("./FunnelModalContent").then(({ FunnelModalContent }) => ({ default: FunnelModalContent })),
);

/**
 * Lightweight interaction gate. The dialog implementation is fetched on the
 * first open and remains mounted afterward, preserving its loaded definition
 * and form state across close/reopen.
 */
export function FunnelModalWrapper(props: FunnelModalWrapperProps) {
  const [hasOpened, setHasOpened] = useState(props.open);

  useEffect(() => {
    if (props.open) setHasOpened(true);
  }, [props.open]);

  if (!hasOpened && !props.open) return null;

  return (
    <Suspense fallback={null}>
      <FunnelModalContent {...props} />
    </Suspense>
  );
}
