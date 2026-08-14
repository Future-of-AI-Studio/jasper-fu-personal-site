import type { Metadata } from "next";

import { LegalDocument } from "../../components/site/legal-document";
import { cookieSections } from "../../lib/legal/drafts";
import { LEGAL_UPDATED, assertLegalUpdated } from "../../lib/legal/published";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy for jasperfu.com.",
};

export default function CookiesPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      sections={cookieSections}
      title="Cookie Policy"
      updated={assertLegalUpdated(LEGAL_UPDATED)}
    />
  );
}
