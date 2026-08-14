import type { Metadata } from "next";

import { LegalDocument } from "../../components/site/legal-document";
import { termsSections, termsUpdated } from "../../lib/legal/terms";
import { assertLegalUpdated } from "../../lib/legal/published";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the jasperfu.com website and press materials.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      sections={termsSections}
      title="Terms of Service"
      updated={assertLegalUpdated(termsUpdated)}
    />
  );
}
