import type { Metadata } from "next";
import Link from "next/link";
import { getLots } from "@/lib/airtable";
import { formatPrice, type Lot } from "@/lib/lots";
import { SITE, mailtoContact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Demande reçue",
  robots: { index: false, follow: false },
};

type ConfirmationSearchParams = Promise<{
  lot?: string | string[];
  demo?: string | string[];
}>;

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: ConfirmationSearchParams;
}) {
  const params = await searchParams;
  const lotParam = Array.isArray(params.lot) ? params.lot[0] : params.lot;
  const demoParam = Array.isArray(params.demo) ? params.demo[0] : params.demo;

  let lot: Lot | undefined;
  if (lotParam) {
    try {
      const lots = await getLots();
      lot = lots.find((candidate) => candidate.reference === lotParam);
    } catch {
      lot = undefined;
    }
  }

  return (
    <section className="section confirmation-page">
      <div className="container narrow">
        <div className="confirmation-card">
          <span className="confirmation-icon" aria-hidden="true">
            ✓
          </span>
          <p className="eyebrow">Demande envoyée</p>
          <h1>Merci, nous avons bien reçu votre message.</h1>
          <p className="confirmation-lead">
            Un interlocuteur Kalimo revient vers vous pour répondre à vos
            questions et vous présenter les disponibilités.
          </p>

          {lot ? (
            <p className="confirmation-lot">
              Lot {lot.reference} · {lot.type} · {formatPrice(lot.price)}
            </p>
          ) : null}

          {demoParam === "1" ? (
            <p className="notice notice-warm">
              Mode démonstration : aucune donnée n&apos;a été enregistrée dans
              Airtable. Le parcours complet est toutefois fonctionnel.
            </p>
          ) : null}

          <div className="confirmation-actions">
            <Link className="btn btn-primary" href="/">
              Retour au programme
            </Link>
            <a
              className="btn btn-outline"
              href={mailtoContact(
                lot
                  ? `Demande — Lot ${lot.reference}`
                  : "Demande — Les Jardins de Vauban",
              )}
            >
              Nous écrire
            </a>
          </div>

          <p className="confirmation-small">
            Vous pouvez retirer votre consentement à tout moment en écrivant à{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. Vos
            données sont conservées {SITE.retentionYears} ans puis supprimées.
            Voir la <Link href="/confidentialite">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
