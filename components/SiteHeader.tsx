import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${SITE.brand} — ${SITE.program}, accueil`}>
          <span className="brand-mark" aria-hidden="true">
            K
          </span>
          <span className="brand-copy">
            <span className="brand-name">{SITE.brand}</span>
            <span className="brand-program">{SITE.program}</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Navigation principale">
          <Link href="/#programme">Le programme</Link>
          <Link href="/#lots">Les lots</Link>
          <Link href="/#demarche">La démarche</Link>
          <Link href="/demande">Contact</Link>
        </nav>

        <Link className="btn btn-primary btn-small header-cta" href="/demande">
          Nous écrire
        </Link>
      </div>
    </header>
  );
}
