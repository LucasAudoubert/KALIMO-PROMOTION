/**
 * Configuration centrale du programme.
 * Les informations légales sont volontairement centralisées ici : elles sont
 * à confirmer par le client avant la mise en ligne (voir DECISIONS.md).
 */
export const SITE = {
  brand: "Kalimo",
  program: "Les Jardins de Vauban",
  tagline: "Une adresse intimiste, entre pierre et jardins.",
  description:
    "Découvrez Les Jardins de Vauban : des appartements du T2 au T4, pensés pour vivre au calme, à deux pas du centre. Commercialisation directe par Kalimo.",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "contact@kalimo.fr",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  /** Version du texte de consentement enregistrée avec chaque demande. */
  consentVersion: "2026-11-25",
  retentionYears: 3,
} as const;

export const CONSENT_TEXT =
  "J'accepte que Kalimo utilise mes coordonnées pour me recontacter au sujet des Jardins de Vauban. Je peux retirer mon consentement à tout moment.";

/**
 * Informations à compléter par le client avant la mise en production.
 * Elles sont affichées telles quelles sur les pages légales.
 */
export const LEGAL = {
  publisher: "Kalimo",
  legalForm: "[forme juridique à compléter]",
  address: "[adresse du siège à compléter]",
  registration: "[SIREN à compléter]",
  publicationDirector: "[directeur de la publication à compléter]",
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    site: "https://vercel.com",
  },
  processor: {
    name: "Airtable, Inc.",
    address: "1 Letterman Drive, San Francisco, CA 94129, États-Unis",
    site: "https://www.airtable.com",
  },
} as const;

export function mailtoContact(subject?: string): string {
  const base = `mailto:${SITE.contactEmail}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
