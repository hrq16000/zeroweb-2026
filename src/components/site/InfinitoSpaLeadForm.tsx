import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { getInfinitoSpaWhatsAppAvailability, submitPublicLead } from "@/lib/lead-intake.functions";
import { getAttributionPayload } from "@/lib/site-config";
import { sanitizeInfinitoSpaMessage } from "@/lib/infinito-spa-whatsapp";

type SubmitState = "idle" | "submitting" | "success" | "error";

type InfinitoSpaLeadFormProps = { clientKey: "infinito-spa" };

export function InfinitoSpaLeadForm({ clientKey }: InfinitoSpaLeadFormProps) {
  const submitLead = useServerFn(submitPublicLead);
  const checkWhatsApp = useServerFn(getInfinitoSpaWhatsAppAvailability);
  const funnelActive = useRef(false);
  const submitting = useRef(false);
  function setFunnelActive(active: boolean) {
    if (funnelActive.current === active) return;
    funnelActive.current = active;
    window.dispatchEvent(
      new CustomEvent(active ? "0web:portfolio-funnel-open" : "0web:portfolio-funnel-close", {
        detail: { clientKey },
      }),
    );
  }
  useEffect(
    () => () => {
      if (funnelActive.current) {
        window.dispatchEvent(
          new CustomEvent("0web:portfolio-funnel-close", { detail: { clientKey } }),
        );
      }
    },
    [clientKey],
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("Consulta sobre masajes y masoterapia");
  const [period, setPeriod] = useState("A convenir");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [whatsappHref, setWhatsappHref] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !consent || !name.trim() || !phone.trim()) return;
    submitting.current = true;
    setFunnelActive(true);

    setStatus("submitting");
    setError("");
    setWhatsappHref("");
    // Channel availability is server-resolved; the destination never enters the bundle.
    const availability = Promise.resolve()
      .then(() => checkWhatsApp())
      .catch(() => ({ available: false }));
    let finalStatus: SubmitState = "error";
    try {
      const attr = getAttributionPayload();
      const bounded = (key: string, limit: number) => attr[key]?.slice(0, limit) || null;
      const result = await submitLead({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          company: "Infinito Spa",
          source: `portfolio:${clientKey}`,
          landing_page: "/portfolio/infinito-spa",
          utm_source: bounded("utm_source", 255),
          utm_medium: bounded("utm_medium", 255),
          utm_campaign: bounded("utm_campaign", 255),
          utm_term: bounded("utm_term", 255),
          utm_content: bounded("utm_content", 255),
          gclid: bounded("gclid", 255),
          fbclid: bounded("fbclid", 255),
          referrer: bounded("referrer", 500),
          hero_variant: "infinito-spa-editorial",
          cta_variant: "infinito-spa-consulta",
          offer_slug: "infinito-spa",
          audience_tag: "infinito-spa",
          payload_json: {
            clientKey,
            clientName: "Infinito Spa",
            locale: "es-CL",
            serviceInterest: interest,
            preferredPeriod: period,
            notes: notes.trim() || null,
            consentAccepted: true,
            entryLandingPage: bounded("landing_page", 500),
          },
        },
      });

      if (!result.ok) {
        setError(
          result.reason === "rate_limited"
            ? "Has enviado varias consultas. Espera unos minutos y vuelve a intentarlo."
            : "No pudimos guardar tu consulta en este momento. Vuelve a intentarlo.",
        );
      } else {
        finalStatus = "success";
      }
    } catch {
      setError("No pudimos guardar tu consulta en este momento. Vuelve a intentarlo.");
    } finally {
      try {
        if ((await availability).available) {
          const message = sanitizeInfinitoSpaMessage(
            [
              `Hola, Roze. Soy ${name.trim()}.`,
              `Quisiera consultar: ${interest}.`,
              `Horario preferido: ${period}.`,
              notes.trim() ? `Detalle: ${notes.trim()}` : "",
            ]
              .filter(Boolean)
              .join(" "),
          );
          setWhatsappHref(
            `/r/whatsapp/portfolio-${clientKey}?message=${encodeURIComponent(message)}`,
          );
        }
      } catch {
        // An unavailable or malformed message must never lose the persisted lead.
      } finally {
        submitting.current = false;
        setStatus(finalStatus);
        if (
          finalStatus === "success" ||
          !document.activeElement?.closest('form[data-client-key="infinito-spa"]')
        )
          setFunnelActive(false);
      }
    }
  }

  return (
    <div
      id="consulta"
      className="mx-auto mt-12 w-full max-w-3xl scroll-mt-24 rounded-[2rem] border border-[#D9BD8D]/45 bg-[#F4F0E7] p-6 text-left text-[#18372F] shadow-2xl sm:p-9"
    >
      {status === "success" ? (
        <div role="status" aria-live="polite" className="py-5 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[#557A61]" aria-hidden="true" />
          <h3 className="mt-5 font-serif text-3xl">¡Gracias, {name.trim()}!</h3>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#52665C]">
            Tu consulta quedó registrada.{" "}
            {whatsappHref
              ? "Continúa por WhatsApp para conversar directamente con Roze y confirmar las opciones disponibles."
              : "El contacto directo por WhatsApp no está disponible en este momento."}
          </p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#18372F] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#285343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#947443] motion-reduce:transition-none"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Continuar en WhatsApp{" "}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      ) : (
        <>
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#76572C]">
            Consulta directa
          </p>
          <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
            Cuéntale a Roze qué estás buscando.
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#52665C]">
            Deja tus datos y preferencias. Tu consulta se enviará de forma privada para que puedan
            continuar la conversación.
          </p>

          <form
            data-client-key={clientKey}
            className="mt-7"
            onSubmit={handleSubmit}
            onFocusCapture={() => setFunnelActive(true)}
            onBlurCapture={(event) => {
              if (
                !submitting.current &&
                !event.currentTarget.contains(event.relatedTarget as Node | null)
              )
                setFunnelActive(false);
            }}
          >
            <fieldset disabled={status === "submitting"} className="grid min-w-0 gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold" htmlFor="infinito-name">
                  Nombre
                  <input
                    id="infinito-name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={120}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="min-h-12 rounded-xl border border-[#C8BEAC] bg-white px-4 text-sm font-normal outline-none transition focus:border-[#947443] focus:ring-2 focus:ring-[#D9BD8D]/35"
                    placeholder="Tu nombre"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold" htmlFor="infinito-phone">
                  WhatsApp de contacto
                  <input
                    id="infinito-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    minLength={8}
                    maxLength={40}
                    pattern="[+0-9() .-]{8,40}"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="min-h-12 rounded-xl border border-[#C8BEAC] bg-white px-4 text-sm font-normal outline-none transition focus:border-[#947443] focus:ring-2 focus:ring-[#D9BD8D]/35"
                    placeholder="+56 9 1234 5678"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold" htmlFor="infinito-email">
                Correo electrónico <span className="font-normal text-[#53665C]">(opcional)</span>
                <input
                  id="infinito-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={200}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="min-h-12 rounded-xl border border-[#C8BEAC] bg-white px-4 text-sm font-normal outline-none transition focus:border-[#947443] focus:ring-2 focus:ring-[#D9BD8D]/35"
                  placeholder="Tu correo electrónico"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold" htmlFor="infinito-interest">
                  ¿Qué te gustaría consultar?
                  <select
                    id="infinito-interest"
                    name="interest"
                    value={interest}
                    onChange={(event) => setInterest(event.target.value)}
                    className="min-h-12 rounded-xl border border-[#C8BEAC] bg-white px-4 text-sm font-normal outline-none transition focus:border-[#947443] focus:ring-2 focus:ring-[#D9BD8D]/35"
                  >
                    <option>Consulta sobre masajes y masoterapia</option>
                    <option>Quiero orientación antes de elegir</option>
                    <option>Consultar disponibilidad</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold" htmlFor="infinito-period">
                  ¿Qué horario te acomoda?
                  <select
                    id="infinito-period"
                    name="period"
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    className="min-h-12 rounded-xl border border-[#C8BEAC] bg-white px-4 text-sm font-normal outline-none transition focus:border-[#947443] focus:ring-2 focus:ring-[#D9BD8D]/35"
                  >
                    <option>Mañana</option>
                    <option>Tarde</option>
                    <option>Horario flexible</option>
                    <option>A convenir</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold" htmlFor="infinito-notes">
                ¿Hay algo más que quieras contarle a Roze?{" "}
                <span className="font-normal text-[#53665C]">(opcional)</span>
                <textarea
                  id="infinito-notes"
                  name="notes"
                  rows={4}
                  maxLength={1000}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="rounded-xl border border-[#C8BEAC] bg-white px-4 py-3 text-sm font-normal leading-6 outline-none transition focus:border-[#947443] focus:ring-2 focus:ring-[#D9BD8D]/35"
                  placeholder="Escribe aquí cualquier duda o preferencia."
                />
              </label>

              <label className="flex items-start gap-3 text-xs leading-6 text-[#52665C]">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#A99D89] accent-[#18372F]"
                />
                <span>
                  Acepto que estos datos se utilicen únicamente para responder mi consulta y
                  coordinar el contacto con Infinito Spa.
                </span>
              </label>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-[#B86B5D]/35 bg-[#B86B5D]/10 px-4 py-3 text-sm leading-6 text-[#87473D]"
                >
                  {error}
                </p>
              ) : null}

              {status === "error" && whatsappHref ? (
                <a
                  href={whatsappHref}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#18372F] px-7 py-3 text-sm font-bold text-[#18372F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#947443]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> Continuar en WhatsApp
                </a>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-[11px] leading-5 text-[#53665C]">
                  Los valores, modalidades y disponibilidad se confirman directamente con Roze.
                </p>
                <button
                  type="submit"
                  disabled={status === "submitting" || !consent}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#18372F] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#285343] disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#947443] motion-reduce:transition-none"
                >
                  {status === "submitting" ? "Enviando consulta…" : "Enviar consulta"}{" "}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </fieldset>
          </form>
        </>
      )}
    </div>
  );
}
