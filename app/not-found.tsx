import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow center-block">
        <p className="eyebrow">Page introuvable</p>
        <h1 className="page-title">Cette adresse n&apos;existe pas.</h1>
        <p className="section-intro">
          Le lien est peut-être incomplet, ou la page a été déplacée. Les lots et
          les disponibilités restent accessibles depuis l&apos;accueil.
        </p>
        <div className="hero-actions center-actions">
          <Link className="btn btn-primary" href="/">
            Retour à l&apos;accueil
          </Link>
          <Link className="btn btn-ghost" href="/demande">
            Faire une demande
          </Link>
        </div>
      </div>
    </section>
  );
}
