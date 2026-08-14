import type { Metadata } from "next";

import { LegalPage } from "../../components/site/legal-page";
import {
  assertForwardLookingDisclaimer,
  forwardLookingDisclaimer,
  msbStatement,
} from "../../lib/copy";
import { LEGAL_UPDATED, assertLegalUpdated } from "../../lib/legal/published";

export const metadata: Metadata = {
  title: "Legal and Compliance",
  description: "MSB statement and forward-looking disclaimer.",
};

export default function LegalPageRoute() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Legal and Compliance"
      updated={assertLegalUpdated(LEGAL_UPDATED)}
      sections={[
        {
          title: "MSB registration statement",
          content: <p>{msbStatement}</p>,
        },
        {
          title: "Forward-looking disclaimer",
          content: <p>{assertForwardLookingDisclaimer(forwardLookingDisclaimer)}</p>,
        },
        {
          title: "Relationship to Coinsub",
          content: (
            <p>
              This website is a personal press resource for Jasper Fu. It does
              not offer Coinsub products, open an account, or constitute an
              offer of securities.
            </p>
          ),
        },
      ]}
    />
  );
}
