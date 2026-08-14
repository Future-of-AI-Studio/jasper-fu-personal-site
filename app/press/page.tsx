import type { Metadata } from "next";

import { PressAlertForm } from "../../components/press/press-alert-form";
import { PressTabs } from "../../components/press/press-tabs";
import { PageHead } from "../../components/site/page-head";
import { SectionIntro } from "../../components/site/legal-document";
import { interimBlogPosts } from "../../lib/copy";
import {
  assertPressThumbnail,
  PRESS_THUMB_HEIGHT,
  PRESS_THUMB_WIDTH,
} from "../../lib/press-thumbnail";

export const metadata: Metadata = {
  title: "Press Releases",
  description: "Interim public writing from Coinsub until official releases post.",
};

export default function PressReleasesPage() {
  return (
    <PressTabs active="releases">
      <PageHead
        eyebrow="Press"
        title="Press Releases"
        lede="Official press releases are in preparation and will be posted here as they're announced. In the meantime, here's what Coinsub has been writing and saying publicly."
      />
      <section className="band">
        <div className="card-grid">
          {interimBlogPosts.map((post) => (
            <article className="card card--thumb" key={post.href}>
              <div className="card__media">
                <img
                  alt={post.title}
                  className="card__thumb"
                  height={PRESS_THUMB_HEIGHT}
                  src={assertPressThumbnail(post.image)}
                  width={PRESS_THUMB_WIDTH}
                />
              </div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <a className="text-link" href={post.href}>
                Read More
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="band">
        <SectionIntro
          eyebrow="Alerts"
          title="Want to be notified the moment new announcements post?"
        />
        <PressAlertForm />
      </section>
    </PressTabs>
  );
}
