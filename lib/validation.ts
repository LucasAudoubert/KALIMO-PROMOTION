import type { DemandeInput } from "@/lib/airtable";

export type DemandeField =
  | "nom"
  | "email"
  | "telephone"
  | "message"
  | "lot"
  | "consentement";

export type FieldErrors = Partial<Record<DemandeField | "form", string>>;

export type ValidationResult =
  | { ok: true; data: DemandeInput }
  | { ok: false; errors: FieldErrors };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+0-9 ().-]+$/;
const REFERENCE_RE = /^[\p{L}\p{N}][\p{L}\p{N} .-]*$/u;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clean(value: string): string {
  // Retire les caractères de contrôle, sans toucher aux accents.
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export function validateDemande(payload: unknown): ValidationResult {
  const errors: FieldErrors = {};
  const body =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  const nom = clean(text(body.nom)).replace(/\s+/g, " ");
  const email = clean(text(body.email));
  const telephone = clean(text(body.telephone));
  const message = clean(text(body.message));
  const lotReference = clean(text(body.lotReference));
  const consentement = body.consentement === true;

  if (nom.length < 2) {
    errors.nom = "Merci d'indiquer votre nom.";
  } else if (nom.length > 80) {
    errors.nom = "Le nom ne peut pas dépasser 80 caractères.";
  } else if (/[<>]/.test(nom)) {
    errors.nom = "Le nom contient des caractères non autorisés.";
  }

  if (!email) {
    errors.email = "Merci d'indiquer votre adresse email.";
  } else if (email.length > 254 || !EMAIL_RE.test(email)) {
    errors.email = "Cette adresse email ne semble pas valide.";
  }

  if (telephone) {
    const digits = telephone.replace(/\D/g, "");
    if (
      telephone.length > 25 ||
      !PHONE_RE.test(telephone) ||
      digits.length < 6 ||
      digits.length > 15
    ) {
      errors.telephone = "Ce numéro de téléphone ne semble pas valide.";
    }
  }

  if (message.length > 2000) {
    errors.message = "Le message ne peut pas dépasser 2 000 caractères.";
  }

  if (lotReference) {
    if (
      lotReference.length > 40 ||
      !REFERENCE_RE.test(lotReference)
    ) {
      errors.lot = "La référence du lot n'est pas valide.";
    }
  }

  if (!consentement) {
    errors.consentement =
      "Merci de cocher la case pour que nous puissions vous recontacter.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      nom,
      email,
      telephone: telephone || undefined,
      message: message || undefined,
      lotReference: lotReference || undefined,
    },
  };
}
