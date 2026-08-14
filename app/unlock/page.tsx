import type { Metadata } from "next";

import { JasperSeal } from "../../components/site/brand";
import { UnlockForm } from "../../components/gate/unlock-form";
import {
  UNLOCK_EYEBROW,
  UNLOCK_HELP,
  UNLOCK_INTRO,
  UNLOCK_TITLE,
  resolveNextPath,
} from "../../lib/gate";
import { identity } from "../../lib/identity";

export const metadata: Metadata = {
  title: UNLOCK_TITLE,
  robots: { index: false, follow: false },
};

export default async function UnlockPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const next = resolveNextPath(params.next);

  return (
    <section className="unlock-page">
      <div className="unlock-card">
        <JasperSeal size={64} />
        <p className="eyebrow">{UNLOCK_EYEBROW}</p>
        <h1>{UNLOCK_TITLE}</h1>
        <p className="unlock-card__intro">{UNLOCK_INTRO}</p>
        <UnlockForm next={next} />
        <p className="form-note">
          {UNLOCK_HELP}{" "}
          <a href={`mailto:${identity.pressEmail}`}>{identity.pressEmail}</a>
        </p>
      </div>
    </section>
  );
}
