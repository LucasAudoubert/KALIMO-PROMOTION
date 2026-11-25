import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { isAirtableConfigured } from "@/lib/airtable";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: `${SITE.program} — ${SITE.brand}`,
    template: `%s — ${SITE.program}`,
  },
  description: SITE.description,
  applicationName: SITE.program,
  authors: [{ name: SITE.brand }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.program,
    title: `${SITE.program} — ${SITE.brand}`,
    description: SITE.description,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: `${SITE.program} — ${SITE.brand}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f3ea",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const demoMode = !isAirtableConfigured();

  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        {demoMode ? (
          <p className="demo-banner" role="status">
            <span className="demo-dot" aria-hidden="true" />
            Mode démonstration — données fictives, les demandes ne sont pas
            enregistrées.
          </p>
        ) : null}
        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
