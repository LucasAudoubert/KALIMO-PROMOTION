"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatPrice, type Lot } from "@/lib/lots";
import { CONSENT_TEXT } from "@/lib/site";

type ErrorKey =
  | "nom"
  | "email"
  | "telephone"
  | "message"
  | "lot"
  | "consentement"
  | "form";

type Errors = Partial<Record<ErrorKey, string>>;

const FIELD_IDS: Partial<Record<ErrorKey, string>> = {
  nom: "nom",
  email: "email",
  telephone: "telephone",
  message: "message",
  lot: "lotReference",
  consentement: "consentement",
};

export function DemandeForm({
  lots,
  initialLot,
  demoMode,
}: {
  lots: Lot[];
  initialLot: string;
  demoMode: boolean;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function focusFirstError(nextErrors: Errors) {
    const key = (Object.keys(nextErrors) as ErrorKey[]).find(
      (candidate) => candidate !== "form",
    );
    if (!key) return;
    const id = FIELD_IDS[key];
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      nom: formData.get("nom"),
      email: formData.get("email"),
      telephone: formData.get("telephone"),
      message: formData.get("message"),
      lotReference: formData.get("lotReference"),
      consentement: formData.get("consentement") === "on",
      // Champ piège : un humain le laisse toujours vide.
      site: formData.get("site"),
    };

    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        demo?: boolean;
        errors?: Errors;
      };

      if (!response.ok || !data.ok) {
        const nextErrors = data.errors ?? {
          form: "Votre demande n'a pas pu être envoyée. Merci de réessayer.",
        };
        setErrors(nextErrors);
        focusFirstError(nextErrors);
        setSubmitting(false);
        return;
      }

      const params = new URLSearchParams();
      const lotReference = String(formData.get("lotReference") ?? "");
      if (lotReference) params.set("lot", lotReference);
      if (data.demo) params.set("demo", "1");
      const query = params.toString();
      router.push(`/confirmation${query ? `?${query}` : ""}`);
    } catch {
      setErrors({
        form: "Connexion impossible. Vérifiez votre réseau puis réessayez.",
      });
      setSubmitting(false);
    }
  }

  return (
    <form className="demande-form" onSubmit={handleSubmit}>
      {demoMode ? (
        <p className="form-demo-note">
          Mode démonstration : cette demande ne sera pas enregistrée.
        </p>
      ) : null}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="nom">
            Nom et prénom <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            aria-invalid={errors.nom ? true : undefined}
            aria-describedby={errors.nom ? "nom-error" : undefined}
          />
          {errors.nom ? (
            <p className="field-error" id="nom-error">{errors.nom}</p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="email">
            Email <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <p className="field-error" id="email-error">{errors.email}</p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="telephone">
            Téléphone <span className="optional">(facultatif)</span>
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={25}
            aria-invalid={errors.telephone ? true : undefined}
            aria-describedby={
              errors.telephone ? "telephone-error" : "telephone-help"
            }
          />
          <p className="field-help" id="telephone-help">
            Pour être rappelé plus facilement, si vous le souhaitez.
          </p>
          {errors.telephone ? (
            <p className="field-error" id="telephone-error">{errors.telephone}</p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="lotReference">
            Lot concerné <span className="optional">(facultatif)</span>
          </label>
          <select
            id="lotReference"
            name="lotReference"
            defaultValue={initialLot}
            aria-invalid={errors.lot ? true : undefined}
            aria-describedby={errors.lot ? "lot-error" : undefined}
          >
            <option value="">Aucun lot en particulier</option>
            {lots.map((lot) => (
              <option
                key={lot.id}
                value={lot.reference}
                disabled={lot.status === "Vendu"}
              >
                {lot.reference} · {lot.type} · {formatPrice(lot.price)}
                {lot.status === "Vendu" ? " — vendu" : ""}
                {lot.status === "Optionné" ? " — optionné" : ""}
              </option>
            ))}
          </select>
          {errors.lot ? (
            <p className="field-error" id="lot-error">{errors.lot}</p>
          ) : null}
        </div>

        <div className="field field-full">
          <label htmlFor="message">
            Votre message <span className="optional">(facultatif)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={2000}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder="Vos questions, vos préférences, vos disponibilités…"
          />
          {errors.message ? (
            <p className="field-error" id="message-error">{errors.message}</p>
          ) : null}
        </div>
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="site">Ne pas remplir ce champ</label>
        <input
          id="site"
          name="site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="consent-block">
        <label className="consent-label" htmlFor="consentement">
          <input
            id="consentement"
            name="consentement"
            type="checkbox"
            required
            aria-invalid={errors.consentement ? true : undefined}
            aria-describedby={
              errors.consentement ? "consentement-error" : undefined
            }
          />
          <span>
            {CONSENT_TEXT}{" "}
            <Link href="/confidentialite" target="_blank" rel="noreferrer">
              Politique de confidentialité
            </Link>
            .
          </span>
        </label>
        {errors.consentement ? (
          <p className="field-error" id="consentement-error">
            {errors.consentement}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="form-error" role="alert">{errors.form}</p>
      ) : null}

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-submit"
          disabled={submitting}
        >
          {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
        <p className="form-footnote">
          Les champs marqués d&apos;un astérisque sont obligatoires. Aucun
          engagement.
        </p>
      </div>
    </form>
  );
}
