import type { Metadata } from "next";
import Link from "next/link";
import { FacadeIllustration } from "@/components/FacadeIllustration";
import { FilterBar } from "@/components/FilterBar";
import { GardenIllustration } from "@/components/GardenIllustration";
import { LotCard } from "@/components/LotCard";
import { AirtableError, getLots } from "@/lib/airtable";
import {
  formatPrice,
  isLotType,
  LOT_TYPES,
  type Lot,
  type LotType,
} from "@/lib/lots";
import { SITE, mailtoContact } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

type HomeSearchParams = Promise<{ type?: string | string[] }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: HomeSearchParams;
}) {
  const params = await searchParams;
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
  const activeType: LotType | null = isLotType(rawType) ? rawType : null;

  let lots: Lot[] = [];
  let unavailable = false;
  try {
    lots = await getLots();
  } catch (error) {
    unavailable = true;
    const status = error instanceof AirtableError ? error.status : 500;
    console.error(`[lots] chargement impossible (statut ${status})`);
  }

  const visibleLots = activeType
    ? lots.filter((lot) => lot.type === activeType)
    : lots;
  const availableLots = lots.filter((lot) => lot.status === "Disponible");
  const minPrice =
    availableLots.length > 0
      ? Math.min(...availableLots.map((lot) => lot.price))
      : null;
  const availableTypes = LOT_TYPES.filter((type) =>
    availableLots.some((lot) => lot.type === type),
  );

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Kalimo · Commercialisation directe</p>
            <h1>
              Les Jardins
              <br />
              de Vauban
            </h1>
            <p className="hero-lead">
              Des appartements du T2 au T4 pensés pour le quotidien, dans une
              adresse à taille humaine. Un programme présenté et commercialisé
              directement par Kalimo.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/#lots">
                Découvrir les lots
              </Link>
              <Link className="btn btn-ghost" href="/demande">
                Parler de mon projet
              </Link>
            </div>
            <dl className="hero-facts">
              <div>
                <dt>Logements</dt>
                <dd>{unavailable ? "T2 – T4" : `${lots.length} lots`}</dd>
              </div>
              <div>
                <dt>Disponibles</dt>
                <dd>{unavailable ? "Nous consulter" : `${availableLots.length}`}</dd>
              </div>
              <div>
                <dt>À partir de</dt>
                <dd>{minPrice ? formatPrice(minPrice) : "Nous consulter"}</dd>
              </div>
            </dl>
          </div>

          <div className="hero-visual">
            <FacadeIllustration className="facade" />
            <p className="hero-caption">
              <span aria-hidden="true">—</span> Une adresse discrète, ouverte
              sur ses jardins.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-lots" id="lots">
        <div className="container">
          <div className="section-head lots-head">
            <div>
              <p className="eyebrow">Disponibilités</p>
              <h2>Choisir son lot</h2>
              <p className="section-intro">
                {unavailable
                  ? "Les disponibilités sont momentanément indisponibles."
                  : activeType
                    ? `${visibleLots.length} lot${visibleLots.length > 1 ? "s" : ""} en ${activeType}.`
                    : `${lots.length} lots, du T2 au T4. Les statuts sont mis à jour en direct par l'équipe commerciale.`}
              </p>
            </div>
            {!unavailable ? <FilterBar lots={lots} active={activeType ?? "Tous"} /> : null}
          </div>

          {unavailable ? (
            <div className="notice">
              <p>
                Le catalogue ne peut pas être chargé pour le moment. Vous pouvez
                nous écrire directement, nous vous répondrons avec les
                disponibilités à jour.
              </p>
              <a className="text-link" href={mailtoContact("Disponibilités — Les Jardins de Vauban")}>
                Écrire à l&apos;équipe →
              </a>
            </div>
          ) : visibleLots.length > 0 ? (
            <div className="lots-grid">
              {visibleLots.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          ) : (
            <div className="notice">
              <p>Aucun lot ne correspond à cette typologie pour le moment.</p>
              <Link className="text-link" href="/#lots">
                Voir tous les lots →
              </Link>
            </div>
          )}

          <div className="lots-notes">
            <p>
              Les lots vendus restent affichés pour donner une vision complète
              du programme.
            </p>
            <p>
              Les lots optionnés peuvent encore faire l&apos;objet d&apos;une
              demande : une option peut se libérer.
            </p>
            <p>Prix indicatifs, sous réserve de disponibilité.</p>
          </div>
        </div>
      </section>

      <section className="section section-programme" id="programme">
        <div className="container split">
          <div className="split-visual">
            <GardenIllustration className="garden" />
            <p className="visual-caption">Le jardin, au cœur du projet.</p>
          </div>
          <div className="split-copy">
            <p className="eyebrow">Le programme</p>
            <h2>Une maison de ville, à l&apos;écart du bruit.</h2>
            <p>
              Les Jardins de Vauban rassemble {unavailable ? "des" : lots.length} logements
              du T2 au T4. Le projet privilégie des adresses de vie simples :
              de la lumière, des plans lisibles et un rapport direct au jardin.
            </p>
            <p>
              La commercialisation est assurée par Kalimo, sans intermédiaire.
              Vous échangez avec la même équipe du premier contact à la remise
              des clés.
            </p>

            <ul className="feature-list">
              <li>
                <span className="feature-index">01</span>
                <div>
                  <h3>Du T2 au T4</h3>
                  <p>
                    {availableTypes.length > 0
                      ? `Aujourd'hui disponibles : ${availableTypes.join(", ")}.`
                      : "Toutes les typologies sont commercialisées."}
                  </p>
                </div>
              </li>
              <li>
                <span className="feature-index">02</span>
                <div>
                  <h3>Commercialisation directe</h3>
                  <p>Un interlocuteur Kalimo, pas d&apos;agence interposée.</p>
                </div>
              </li>
              <li>
                <span className="feature-index">03</span>
                <div>
                  <h3>Un suivi personnalisé</h3>
                  <p>
                    Vos questions sur un lot, les disponibilités ou le calendrier
                    de commercialisation.
                  </p>
                </div>
              </li>
            </ul>

            <Link className="text-link" href="/demande">
              Échanger avec l&apos;équipe →
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-steps" id="demarche">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">La démarche</p>
              <h2>Trois étapes, sans complication.</h2>
            </div>
            <p className="section-aside">
              Une demande vous engage uniquement à être recontacté. Aucun
              dossier, aucun versement, aucune création de compte.
            </p>
          </div>

          <ol className="steps">
            <li>
              <span className="step-number">01</span>
              <h3>Vous repérez un lot</h3>
              <p>
                Parcourez les disponibilités et filtrez par typologie. Chaque lot
                affiche sa surface, son étage et son prix.
              </p>
            </li>
            <li>
              <span className="step-number">02</span>
              <h3>Vous nous écrivez</h3>
              <p>
                Un formulaire court : nom, email, téléphone si vous le souhaitez.
                Vous choisissez le lot qui vous intéresse.
              </p>
            </li>
            <li>
              <span className="step-number">03</span>
              <h3>Nous vous recontactons</h3>
              <p>
                Un interlocuteur Kalimo revient vers vous pour répondre à vos
                questions et vous présenter la suite.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="cta-section" id="contact">
        <div className="container cta-inner">
          <p className="eyebrow">Un projet aux Jardins de Vauban ?</p>
          <h2>Parlons-en simplement.</h2>
          <p>
            Dites-nous ce que vous recherchez. Nous vous répondons avec les
            disponibilités à jour et les informations utiles.
          </p>
          <div className="cta-actions">
            <Link className="btn btn-primary" href="/demande">
              Faire une demande
            </Link>
            <a
              className="btn btn-outline"
              href={mailtoContact("Les Jardins de Vauban")}
            >
              Écrire à l&apos;équipe
            </a>
          </div>
          <p className="cta-contact">
            Ou par email : <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </p>
        </div>
      </section>
    </>
  );
}
