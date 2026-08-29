import type { Metadata } from "next";

import { PressTabs } from "../../../components/press/press-tabs";
import { PageHead } from "../../../components/site/page-head";
import {
  assertWatchInterviewCta,
  mediaCoverage,
  WATCH_INTERVIEW_CTA,
} from "../../../lib/copy";
import { assertOutletMarkFor } from "../../../lib/identity";
import {
  assertPressThumbnail,
  PRESS_THUMB_HEIGHT,
  PRESS_THUMB_WIDTH,
} from "../../../lib/press-thumbnail";

export const metadata: Metadata = {
  title: "Media Coverage and Interviews",
  description: "Interviews and coverage featuring Jasper Fu.",
};

/** "Read More" fits a written release; these are videos and a podcast too. */
const COVERAGE_ACTIONS = {
  video: "Watch",
  audio: "Listen",
  article: "Read coverage",
} as const;

export default function MediaCoveragePage() {
  const [featured, ...rest] = mediaCoverage;
  // Only cleared outlets carry a wordmark, so the logo treatment is scoped to
  // the featured item; the rest keep their outlet as text.
  const featuredOutlet = featured ? assertOutletMarkFor(featured.outlet) : null;

  return (
    <PressTabs active="coverage">
      <PageHead
        eyebrow="Press"
        title="Media Coverage and Interviews"
        lede="Interviews and coverage featuring Jasper Fu, for desks that need the primary sources in one place."
      />
      {/* The same split header the home page gives this interview: headline
          and outlet mark on the left, standfirst and action on the right,
          over a full-width player. */}
      {featured ? (
        <section className="band featured-interview">
          <div className="featured-interview__head">
            <p className="eyebrow">Featured interview</p>
            <h2 className="featured-interview__title">{featured.title}</h2>
            {/* The wordmark carries the outlet name in its alt text, so a
                label beside it would only repeat itself. */}
            <p className="featured-interview__credit">
              {featuredOutlet ? (
                <img
                  alt={featuredOutlet.name}
                  className="featured-interview__outlet"
                  src={featuredOutlet.logo}
                />
              ) : null}
            </p>
          </div>

          <div className="featured-interview__aside">
            <p className="featured-interview__lede">{featured.caption}</p>
            <div className="featured-interview__actions">
              <a className="button-link" href={featured.watchUrl}>
                {featured.kind === "video"
                  ? assertWatchInterviewCta(WATCH_INTERVIEW_CTA)
                  : "Read coverage"}
              </a>
            </div>
          </div>

          {featured.embedUrl ? (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="embed featured-interview__media"
              src={featured.embedUrl}
              title={featured.title}
            />
          ) : null}
        </section>
      ) : null}
      {/* Same card as a press release: thumbnail, then the copy, footed by a
          full-width button. The action names the medium, since these are
          videos and a podcast as well as written coverage. */}
      <section className="band">
        <div className="card-grid">
          {rest.map((item) => (
            <article className="card card--thumb" key={item.title}>
              {item.image ? (
                <div className="card__media">
                  <img
                    alt={item.title}
                    className="card__thumb"
                    height={PRESS_THUMB_HEIGHT}
                    src={assertPressThumbnail(item.image)}
                    width={PRESS_THUMB_WIDTH}
                  />
                </div>
              ) : null}
              <p className="eyebrow">{item.outlet}</p>
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
              <a
                className="button-link button-link--block button-link--external"
                href={item.watchUrl}
              >
                {COVERAGE_ACTIONS[item.kind]}
              </a>
            </article>
          ))}
        </div>
      </section>
    </PressTabs>
  );
}
