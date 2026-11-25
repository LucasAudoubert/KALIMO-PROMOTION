import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site des Jardins de Vauban, programme immobilier commercialisé par Kalimo.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <section className="section legal-page">
      <div className="container narrow">
        <article className="prose">
          <p className="eyebrow">Informations légales</p>
          <h1>Mentions légales</h1>
          <p className="prose-meta">Dernière mise à jour : 25 novembre 2026</p>

          <h2>Éditeur du site</h2>
          <p>
            Le site est édité par <strong>{LEGAL.publisher}</strong>,{" "}
            {LEGAL.legalForm}, dont le siège social est situé{" "}
            {LEGAL.address}.
          </p>
          <p>
            Immatriculation : {LEGAL.registration}. Directeur de la publication :{" "}
            {LEGAL.publicationDirector}.
          </p>
          <p>
            Contact :{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par <strong>{LEGAL.host.name}</strong>,{" "}
            {LEGAL.host.address}. Site web :{" "}
            <a href={LEGAL.host.site} target="_blank" rel="noreferrer">
              {LEGAL.host.site}
            </a>
            .
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus de ce site (textes, éléments
            graphiques, illustrations, mise en page) est protégé par le droit de
            la propriété intellectuelle. Les illustrations de façade et de
            jardin ont été créées spécifiquement pour ce site. Toute
            reproduction ou représentation, totale ou partielle, sans
            autorisation écrite préalable est interdite.
          </p>

          <h2>Informations sur le programme</h2>
          <p>
            Les prix, surfaces, typologies et disponibilités présentés sur ce
            site sont indicatifs et mis à jour depuis l&apos;outil de suivi
            commercial. Ils ne constituent pas une offre contractuelle et
            peuvent évoluer, notamment lorsqu&apos;un lot est réservé ou vendu.
            Les illustrations sont des représentations d&apos;intention et
            n&apos;ont pas de valeur contractuelle.
          </p>
          <p>
            Toute demande envoyée via le formulaire est une prise de contact
            sans engagement. Elle ne vaut ni réservation, ni acceptation
            d&apos;offre, ni versement.
          </p>

          <h2>Données personnelles et cookies</h2>
          <p>
            Le traitement des données du formulaire est décrit dans la{" "}
            <Link href="/confidentialite">politique de confidentialité</Link>.
            Ce site n&apos;utilise aucun cookie, aucun traceur publicitaire et
            aucun outil de mesure d&apos;audience.
          </p>

          <h2>Liens et responsabilité</h2>
          <p>
            Les liens externes sont fournis à titre informatif. Kalimo ne
            contrôle pas leur contenu et décline toute responsabilité quant aux
            informations qui y sont publiées. L&apos;accès au site peut être
            interrompu pour maintenance ou pour toute raison technique.
          </p>

          <h2>Droit applicable</h2>
          <p>
            Le présent site et ses mentions légales sont soumis au droit
            français. En cas de litige, et à défaut de résolution amiable, les
            tribunaux compétents seront ceux du ressort du siège de Kalimo, sans
            préjudice des règles protectrices applicables aux consommateurs.
          </p>

          <p className="prose-back">
            <Link href="/">← Retour au programme</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
