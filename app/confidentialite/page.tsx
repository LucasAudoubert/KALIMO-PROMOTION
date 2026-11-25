import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Kalimo traite les données personnelles transmises via le site des Jardins de Vauban : finalité, durée, destinataires et droits.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <section className="section legal-page">
      <div className="container narrow">
        <article className="prose">
          <p className="eyebrow">Vos données</p>
          <h1>Politique de confidentialité</h1>
          <p className="prose-meta">
            Version du 25 novembre 2026 · Texte de consentement{" "}
            {SITE.consentVersion}
          </p>

          <p>
            Cette politique explique quelles données personnelles sont
            collectées lorsque vous utilisez le formulaire des Jardins de
            Vauban, pourquoi elles le sont, combien de temps elles sont
            conservées et comment exercer vos droits. Elle est rédigée de façon
            volontairement courte et lisible.
          </p>

          <h2>1. Responsable de traitement</h2>
          <p>
            Le responsable de traitement est <strong>{LEGAL.publisher}</strong>,{" "}
            {LEGAL.legalForm}, {LEGAL.address}. Pour toute question relative à
            vos données :{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>

          <h2>2. Données collectées</h2>
          <ul>
            <li>Votre nom et prénom (obligatoire).</li>
            <li>Votre adresse email (obligatoire).</li>
            <li>
              Votre numéro de téléphone, uniquement si vous choisissez de le
              renseigner.
            </li>
            <li>
              Le message libre que vous rédigez, uniquement si vous en écrivez
              un.
            </li>
            <li>
              Le lot concerné, uniquement si vous le sélectionnez.
            </li>
            <li>
              Votre consentement, la date de la demande et la version du texte
              de consentement accepté.
            </li>
            <li>
              Le statut de suivi de votre demande (nouveau, contacté, clos),
              renseigné par l&apos;équipe commerciale.
            </li>
          </ul>
          <p>
            Aucune donnée sensible (santé, origine, opinion politique, etc.) et
            aucune donnée bancaire ne sont demandées. Aucun profilage n&apos;est
            réalisé.
          </p>

          <h2>3. Pourquoi ces données sont-elles traitées ?</h2>
          <p>
            Les données servent uniquement à répondre à votre demande
            d&apos;information sur le programme Les Jardins de Vauban et à vous
            recontacter à ce sujet, par email ou par téléphone si vous avez
            laissé un numéro. La base légale est votre <strong>consentement</strong>{" "}
            (article 6.1.a du RGPD), recueilli par une case à cocher qui
            n&apos;est jamais pré-cochée.
          </p>
          <p>
            Vos données ne sont utilisées ni pour de la prospection pour
            d&apos;autres programmes, ni pour de la publicité ciblée, ni pour
            aucune décision automatisée.
          </p>

          <h2>4. Champs obligatoires et facultatifs</h2>
          <p>
            Le nom, l&apos;email et le consentement sont nécessaires pour traiter
            votre demande : sans eux, le formulaire ne peut pas être envoyé. Le
            téléphone, le message et le choix d&apos;un lot sont facultatifs.
          </p>

          <h2>5. Qui accède à vos données ?</h2>
          <p>
            Vos données sont accessibles à l&apos;équipe commerciale de Kalimo,
            dans la limite de ce qui est nécessaire au suivi de votre demande.
            Elles ne sont ni vendues, ni louées, ni cédées à des tiers.
          </p>
          <p>
            Elles sont hébergées et traitées par deux sous-traitants techniques :
          </p>
          <ul>
            <li>
              <strong>{LEGAL.processor.name}</strong> ({LEGAL.processor.address}),
              pour la base de suivi des lots et des demandes, via l&apos;outil
              Airtable.
            </li>
            <li>
              <strong>{LEGAL.host.name}</strong> ({LEGAL.host.address}), pour
              l&apos;hébergement du site.
            </li>
          </ul>
          <p>
            Ces prestataires sont établis hors de l&apos;Union européenne. Les
            transferts sont encadrés par les clauses contractuelles types de la
            Commission européenne et, lorsque l&apos;entité concernée est
            certifiée, par le Data Privacy Framework. Une copie des garanties
            applicables peut être obtenue sur demande.
          </p>

          <h2>6. Combien de temps les données sont-elles conservées ?</h2>
          <p>
            Les données liées à une demande sont conservées{" "}
            <strong>{SITE.retentionYears} ans à compter du dernier contact</strong>,
            puis supprimées, conformément à la durée recommandée par la CNIL
            pour la gestion des prospects. Si votre projet aboutit, les
            informations utiles à la relation contractuelle peuvent être
            conservées selon les obligations légales applicables.
          </p>

          <h2>7. Vos droits</h2>
          <p>
            Vous disposez des droits suivants sur vos données : accès,
            rectification, effacement, limitation du traitement, opposition,
            portabilité, ainsi que le droit de retirer votre consentement à tout
            moment. Le retrait du consentement ne remet pas en cause la
            licéité du traitement effectué avant ce retrait.
          </p>
          <p>
            Pour exercer ces droits, écrivez à{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. Une
            réponse vous sera apportée dans un délai maximal d&apos;un mois. Vous
            pouvez également introduire une réclamation auprès de la CNIL
            (www.cnil.fr).
          </p>

          <h2>8. Sécurité</h2>
          <p>
            Le site est servi en HTTPS. L&apos;accès à la base Airtable se fait
            via un jeton stocké exclusivement côté serveur, dans une variable
            d&apos;environnement, avec des droits limités à cette base. Le code
            n&apos;écrit que dans la table des demandes. Aucune donnée de
            formulaire n&apos;est journalisée par l&apos;application.
          </p>

          <h2>9. Cookies et traceurs</h2>
          <p>
            Ce site n&apos;utilise aucun cookie, aucun traceur publicitaire,
            aucun outil de mesure d&apos;audience et aucune ressource chargée
            depuis un domaine tiers (les polices d&apos;écriture sont celles de
            votre système). Aucun bandeau de consentement n&apos;est donc
            nécessaire.
          </p>

          <h2>10. Modification de cette politique</h2>
          <p>
            Cette politique peut être mise à jour si le traitement évolue. La
            version applicable est celle affichée sur cette page. Chaque demande
            enregistre la version du texte de consentement acceptée, ce qui
            permet de retrouver les engagements applicables au moment du
            consentement.
          </p>

          <p className="prose-back">
            <Link href="/">← Retour au programme</Link>
          </p>
        </article>
      </div>
    </section>
  );
}
