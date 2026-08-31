import type { Metadata } from "next";

import { MediaKitRequestDialog } from "../../components/media-kit/request-dialog";
import { PageHead } from "../../components/site/page-head";
import {
  assertMediaKitPromise,
  assertRequestFullMediaKitCta,
  assertResponseTimeNote,
  MEDIA_KIT_PROMISE,
  REQUEST_FULL_MEDIA_KIT_CTA,
  responseTimeNote,
} from "../../lib/copy";
import { identity } from "../../lib/identity";

export const metadata: Metadata = {
  title: "Media Kit",
  description: "Request the full media kit for Jasper Fu.",
};

export default function MediaKitPage() {
  return (
    <article className="media-kit-page" data-page-entrance>
      {/* One screen: the ask, the button, and what to expect. The form lives
          in a dialog so the page does not open on a long scroll. */}
      <section className="media-kit-hero">
        <PageHead
            title="Media Kit"
          lede={assertMediaKitPromise(MEDIA_KIT_PROMISE)}
        >
          <MediaKitRequestDialog
            label={assertRequestFullMediaKitCta(REQUEST_FULL_MEDIA_KIT_CTA)}
          />
          <p className="media-kit-hero__note">
            {assertResponseTimeNote(responseTimeNote)}
          </p>
          <p className="media-kit-hero__direct">
            <a href={`mailto:${identity.pressEmail}`}>{identity.pressEmail}</a>
          </p>
        </PageHead>
      </section>
    </article>
  );
}
