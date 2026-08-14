import Link from "next/link";
import type { Metadata } from "next";

import { PageHead } from "../../components/site/page-head";
import { REQUEST_FULL_MEDIA_KIT_CTA, assertRequestFullMediaKitCta } from "../../lib/copy";
import {
  assertMediaKitPhoto,
  MEDIA_KIT_SPEAKING_PHOTO,
} from "../../lib/media-kit";

export const metadata: Metadata = {
  title: "Media Kit",
  description: "Request the full media kit for Jasper Fu.",
};

export default function MediaKitPage() {
  return (
    <article>
      <PageHead eyebrow="Media kit" title="Media Kit" />

      <section className="band media-kit-request">
        <figure className="media-kit-request__figure">
          {/* Source: NASDAQ / NYSE interview still — https://www.youtube.com/watch?v=n2AyhRBeho0 */}
          <img
            alt="Jasper Fu speaking during a NASDAQ interview at the New York Stock Exchange"
            className="media-kit-request__photo"
            data-source="https://img.youtube.com/vi/n2AyhRBeho0/maxresdefault.jpg"
            height={720}
            src={assertMediaKitPhoto(MEDIA_KIT_SPEAKING_PHOTO)}
            width={1280}
          />
        </figure>
        <div className="media-kit-request__copy">
          <h2>Media Kit available on request</h2>
          <Link className="button-link" href="/contact#inquiry-form">
            {assertRequestFullMediaKitCta(REQUEST_FULL_MEDIA_KIT_CTA)}
          </Link>
        </div>
      </section>
    </article>
  );
}
