import { useEffect, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type DonaGarimpeiraInterest = "comprar" | "vender" | "doar";

const WHATSAPP_DONA_GARIMPEIRA = "5541998379642";
const SESSION_KEY = "0web:dona-garimpeira:atendimento";
const INTEREST_LABEL: Record<DonaGarimpeiraInterest, string> = {
  comprar: "Comprar ou consultar uma peça",
  vender: "Vender roupas",
  doar: "Doar roupas",
};

/**
 * Atendimento autônomo, sem dependência do banco 0WEB/Lovable Cloud.
 * Os dados são armazenados somente nesta aba (sessionStorage) ANTES da
 * abertura do WhatsApp. O visitante precisa enviar a mensagem no WhatsApp.
 * Não há lead centralizado nem promessa de envio automático.
 */
export function DonaGarimpeiraOfflineFunnel({
  interest,
  onClose,
}: {
  interest: DonaGarimpeiraInterest | null;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<DonaGarimpeiraInterest>("comprar");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [readyUrl, setReadyUrl] = useState("");

  useEffect(() => {
    if (!interest) return;
    setSelected(interest);
    setName("");
    setPhone("");
    setDetails("");
    setConsent(false);
    setError("");
    setReadyUrl("");
  }, [interest]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const sanitizedName = name.trim().replace(/\\s+/g, " ");
    const digits = phone.replace(/\\D/g, "");
    if (sanitizedName.length < 2 || sanitizedName.length > 90) {
      setError("Informe seu nome (2 a 90 caracteres).");
      return;
    }
    if (!/^(?:55)?[1-9][0-9]9?[0-9]{8}$/.test(digits)) {
      setError("Informe um WhatsApp brasileiro com DDD válido.");
      return;
    }
    if (!consent) {
      setError("Confirme a ciência do atendimento pelo WhatsApp.");
      return;
    }

    const note = details.trim().slice(0, 800);
    const message = [
      "Olá, Dona Garimpeira! Vim pelo portfólio da 0WEB.",
      `*Assunto:* ${INTEREST_LABEL[selected]}`,
      `*Nome:* ${sanitizedName}`,
      `*Meu WhatsApp:* ${digits}`,
      note ? `*Detalhes:* ${note}` : "",
      "Gostaria de conversar sobre esse atendimento.",
    ].filter(Boolean).join("\\n");
    const url = `https://wa.me/${WHATSAPP_DONA_GARIMPEIRA}?text=${encodeURIComponent(message)}`;

    // Persistência local de curtíssima duração: apenas a aba do visitante.
    // Não enviar conteúdo a analytics, DB ou à 0WEB por este fluxo.
    try {
      window.sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          interest: selected,
          name: sanitizedName,
          phone: digits,
          details: note,
          recordedAt: new Date().toISOString(),
          destination: "Dona Garimpeira",
        }),
      );
    } catch {
      // Navegadores que proíbem storage ainda permitem completar o atendimento.
      setError("Seu navegador bloqueou o registro local. Você ainda pode continuar pelo WhatsApp.");
    }
    setReadyUrl(url);
    window.location.assign(url);
  };

  return (
    <Dialog open={interest !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[92dvh] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto rounded-2xl border-0 bg-[#faf4e9] p-5 text-[#17392f] shadow-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="pr-8 font-serif text-2xl">Vamos conversar sobre o seu garimpo?</DialogTitle>
          <DialogDescription className="text-[#52655a]">
            Responda rapidinho e abra uma mensagem pronta no WhatsApp da Dona Garimpeira.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="mt-3 space-y-4">
          <label className="block space-y-1.5 text-sm font-semibold" htmlFor="dg-interest">
            O que você gostaria de fazer?
            <select
              id="dg-interest"
              value={selected}
              onChange={(event) => setSelected(event.target.value as DonaGarimpeiraInterest)}
              className="block w-full rounded-lg border border-[#adbdb3] bg-white p-3 text-base"
            >
              {Object.entries(INTEREST_LABEL).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
            </select>
          </label>
          <label className="block space-y-1.5 text-sm font-semibold" htmlFor="dg-name">
            Seu nome
            <input id="dg-name" required minLength={2} maxLength={90} autoComplete="name"
              value={name} onChange={(event) => setName(event.target.value)}
              placeholder="Como podemos chamar você?"
              className="block w-full rounded-lg border border-[#adbdb3] bg-white p-3 text-base" />
          </label>
          <label className="block space-y-1.5 text-sm font-semibold" htmlFor="dg-phone">
            Seu WhatsApp com DDD
            <input id="dg-phone" required inputMode="tel" autoComplete="tel"
              value={phone} onChange={(event) => setPhone(event.target.value)}
              placeholder="(41) 99999-9999"
              className="block w-full rounded-lg border border-[#adbdb3] bg-white p-3 text-base" />
          </label>
          <label className="block space-y-1.5 text-sm font-semibold" htmlFor="dg-details">
            Conte um pouco mais (opcional)
            <textarea id="dg-details" maxLength={800} rows={3}
              value={details} onChange={(event) => setDetails(event.target.value)}
              placeholder={selected === "comprar" ? "Qual peça, tamanho ou estilo procura?" : selected === "vender" ? "Quais peças gostaria de levar para avaliação?" : "Quais peças gostaria de doar?"}
              className="block w-full resize-y rounded-lg border border-[#adbdb3] bg-white p-3 text-base" />
          </label>
          <label className="flex items-start gap-2.5 text-sm leading-relaxed">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 size-4 shrink-0 accent-[#17392f]" required />
            <span>Estou ciente de que meus dados serão incluídos na mensagem que abrirei no WhatsApp da loja. Este atendimento não cria cadastro no banco da 0WEB; o preenchimento fica salvo apenas nesta aba do navegador.</span>
          </label>
          {error && <p role="alert" className="text-sm text-[#963b2c]">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-[#17392f] px-5 py-3.5 text-base font-semibold text-white hover:bg-[#285745] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17392f]">
            Continuar no WhatsApp da loja
          </button>
          {readyUrl && <a href={readyUrl} rel="noopener noreferrer" className="block text-center text-sm font-semibold underline">O WhatsApp não abriu? Toque aqui para continuar.</a>}
          <p className="text-xs leading-relaxed text-[#52655a]">O WhatsApp abre com a mensagem preenchida. O envio só acontece quando você confirmar no aplicativo. Não fazemos disparos automáticos.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
