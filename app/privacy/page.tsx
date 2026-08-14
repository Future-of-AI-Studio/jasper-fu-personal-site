import type { Metadata } from "next";

import { LegalDocument } from "../../components/site/legal-document";
import { privacySections } from "../../lib/legal/drafts";
import { LEGAL_UPDATED, assertLegalUpdated } from "../../lib/legal/published";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for jasperfu.com.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      sections={privacySections}
      title="Privacy Policy"
      updated={assertLegalUpdated(LEGAL_UPDATED)}
    />
  );
}
