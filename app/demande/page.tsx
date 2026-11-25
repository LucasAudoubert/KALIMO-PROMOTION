import type { Metadata } from "next";
import Link from "next/link";
import { DemandeForm } from "@/components/DemandeForm";
import { StatusBadge } from "@/components/StatusBadge";
import {
  AirtableError,
  getLots,
  isAirtableConfigured,
} from "@/lib/airtable";
import {
  floorLabel,
  formatPrice,
  formatSurface,
  lotTypeLabel,
  type Lot,
} from "@/lib/lots";
import { SITE, mailtoContact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Faire une demande",
  description:
    "Écrivez à l'équipe Kalimo au sujet des Jardins de Vauban : disponibilités, plans, prix. Réponse personnalisée, sans engagement.",
  alternates: { canonical: "/demande" },
};

type DemandeSearchParams = Promise<{ lot?: string | string[] }>;

export default async function DemandePage({
  searchParams,
}: {
  searchParams: DemandeSearchParams;
}) {
  const params = await searchParams;
  const lotParam = Array.isArray(params.lot) ? params.lot[0] : params.lot;

  let lots: Lot[] = [];
  let unavailable = false;
  try {
    lots = await getLots();
  } catch (error) {
    unavailable = true;
    const status = error instanceof AirtableError ? error.status : 500;
    console.error(`[lots] chargement impossible (statut ${status})`);
  }

  const selectedLot = lotParam
    ? lots.find((lot) => lot.reference === lotParam)
    : undefined;
  const soldLot = selectedLot?.status === "Vendu" ? selectedLot : undefined;
  const selectableLot =
    selectedLot && selectedLot.status !== "Vendu" ? selectedLot : undefined;
  const demoMode = !isAirtableConfigured();

  return (
    <section className="section form-page">
      <div className="container">
        <div className="form-header">
          <Link className="back-link" href="/#lots">
            <span aria-hidden="true">←</span> Retour aux lots
          </Link>
          <p className="eyebrow">Votre demande</p>
          <h1>Parlons de votre projet.</h1>
          <p className="form-intro">
            Laissez-nous vos coordonnées : nous revenons vers vous avec les
            disponibilités et les réponses à vos questions. Aucun engagement.
          </p>
        </div>

        <div className="form-layout">
          <div className="form-main">
            {unavailable ? (
              <div className="notice">
                <p>
                  Le formulaire est momentanément indisponible. Vous pouvez nous
                  écrire directement par email, nous vous répondrons avec les
                  disponibilités à jour.
                </p>
                <a
                  className="text-link"
                  href={mailtoContact("Demande — Les Jardins de Vauban")}
                >
                  {SITE.contactEmail} →
                </a>
              </div>
            ) : (
              <>
                {soldLot ? (
                  <div className="notice notice-warm">
                    <p>
                      Le lot {soldLot.reference} est déjà commercialisé. Vous
                      pouvez tout de même nous écrire : nous vous informerons des
                      prochaines disponibilités.
                    </p>
                  </div>
                ) : null}
                <DemandeForm
                  lots={lots}
                  initialLot={selectableLot?.reference ?? ""}
                  demoMode={demoMode}
                />
              </>
            )}
          </div>

          <aside className="form-aside" aria-label="Informations complémentaires">
            {selectableLot ? (
              <div className="lot-summary">
                <div className="lot-summary-head">
                  <p className="eyebrow">Votre sélection</p>
                  <StatusBadge status={selectableLot.status} />
                </div>
                <p className="lot-summary-ref">Lot {selectableLot.reference}</p>
                <p className="lot-summary-type">
                  {selectableLot.type} · {lotTypeLabel(selectableLot.type)}
                </p>
                <dl>
                  <div>
                    <dt>Surface</dt>
                    <dd>{formatSurface(selectableLot.surface)}</dd>
                  </div>
                  <div>
                    <dt>Étage</dt>
                    <dd>{floorLabel(selectableLot.floor)}</dd>
                  </div>
                  <div>
                    <dt>Prix</dt>
                    <dd>{formatPrice(selectableLot.price)}</dd>
                  </div>
                </dl>
                {selectableLot.status === "Optionné" ? (
                  <p className="lot-summary-note">
                    Une option est en cours sur ce lot. Votre demande reste
                    possible et sera traitée dans l&apos;ordre d&apos;arrivée.
                  </p>
                ) : null}
                <Link className="text-link" href="/#lots">
                  Voir les autres lots →
                </Link>
              </div>
            ) : (
              <div className="aside-card aside-program">
                <p className="eyebrow">Le programme</p>
                <p className="aside-title">Les Jardins de Vauban</p>
                <p>
                  Des appartements du T2 au T4, commercialisés directement par
                  Kalimo. Précisez vos envies dans le message si vous ne visez
                  pas encore un lot en particulier.
                </p>
                <a
                  className="text-link"
                  href={mailtoContact("Les Jardins de Vauban")}
                >
                  {SITE.contactEmail} →
                </a>
              </div>
            )}

            <div className="aside-card">
              <h2 className="aside-heading">Ce qui se passe ensuite</h2>
              <ol className="aside-steps">
                <li>Nous lisons votre demande.</li>
                <li>Un interlocuteur Kalimo vous recontacte.</li>
                <li>
                  Vous décidez de la suite, à votre rythme. Aucun engagement.
                </li>
              </ol>
            </div>

            <p className="aside-privacy">
              Vos données servent uniquement à vous recontacter au sujet du
              programme. Elles sont conservées {SITE.retentionYears} ans puis
              supprimées. Aucun cookie, aucun traceur.{" "}
              <Link href="/confidentialite">En savoir plus</Link>.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
