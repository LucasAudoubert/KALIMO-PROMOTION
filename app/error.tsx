"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section">
      <div className="container narrow center-block">
        <p className="eyebrow">Service momentanément indisponible</p>
        <h1 className="page-title">Quelque chose n&apos;a pas fonctionné.</h1>
        <p className="section-intro">
          Le programme ne peut pas être affiché pour le moment. Vous pouvez
          réessayer, ou nous écrire directement : nous vous répondrons avec les
          informations à jour.
        </p>
        <div className="hero-actions center-actions">
          <button className="btn btn-primary" type="button" onClick={() => reset()}>
            Réessayer
          </button>
          <Link className="btn btn-ghost" href="/demande">
            Faire une demande
          </Link>
        </div>
      </div>
    </section>
  );
}