import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <p className="footer-wordmark">{SITE.brand}</p>
          <p className="footer-program">{SITE.program}</p>
          <p className="footer-tagline">{SITE.tagline}</p>
        </div>

        <nav className="footer-col" aria-label="Programme">
          <p className="footer-heading">Le programme</p>
          <Link href="/#programme">Présentation</Link>
          <Link href="/#lots">Les lots</Link>
          <Link href="/#demarche">La démarche</Link>
        </nav>

        <nav className="footer-col" aria-label="Informations">
          <p className="footer-heading">Informations</p>
          <Link href="/demande">Faire une demande</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </nav>

        <div className="footer-col">
          <p className="footer-heading">Contact</p>
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          <p className="footer-small">Commercialisation directe</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {year} {SITE.brand} · {SITE.program}
        </p>
        <p>Prix indicatifs, sous réserve de disponibilité. · Site sans cookie ni traceur.</p>
      </div>
    </footer>
  );
}
