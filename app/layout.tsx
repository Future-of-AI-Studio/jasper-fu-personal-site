import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteShell } from "../components/site/site-shell";
import { identity } from "../lib/identity";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(identity.siteUrl),
  title: {
    default: "Jasper Fu",
    template: "%s | Jasper Fu",
  },
  description:
    "Press and media resource for Jasper Fu, co-founder and CEO of Coinsub.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Jasper Fu",
    title: `Jasper Fu — ${identity.thesis}`,
    description:
      "Press, speaking, and media resources for Jasper Fu, co-founder and CEO of Coinsub.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasper Fu",
    description:
      "Press, speaking, and media resources for Jasper Fu, co-founder and CEO of Coinsub.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: identity.name,
    jobTitle: identity.title,
    url: identity.siteUrl,
    email: identity.pressEmail,
    worksFor: {
      "@type": "Organization",
      name: "Coinsub",
      url: identity.coinsubUrl,
    },
  };

  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
          type="application/ld+json"
        />
      </body>
    </html>
  );
}
