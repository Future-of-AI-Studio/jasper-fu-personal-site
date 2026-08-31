import Link from "next/link";

import { CoinsubMark, TitleWithCoinsub } from "../components/site/brand";
import { SectionIntro } from "../components/site/legal-document";
import { LogoCarousel } from "../components/site/logo-carousel";
import {
  BOOK_TO_SPEAK_CTA,
  MEDIA_KIT_PROMISE,
  REQUEST_FULL_MEDIA_KIT_CTA,
  assertBookToSpeakCta,
  assertMediaKitPromise,
  assertRequestFullMediaKitCta,
  assertViewAllCoverageCta,
  assertWatchInterviewCta,
  bios,
  factSheet,
  FLAGSHIP_ESSAY_READY,
  interimBlogPosts,
  mediaCoverage,
  parseFactSheet,
  splitBioLede,
  VIEW_ALL_COVERAGE_CTA,
  WATCH_INTERVIEW_CTA,
} from "../lib/copy";
import {
  assertHeroDisplayName,
  assertHeroPortrait,
  assertHeroWatermark,
  HERO_FEATURE_PORTRAIT,
  HERO_FEATURE_PORTRAIT_HEIGHT,
  HERO_FEATURE_PORTRAIT_WIDTH,
  heroTopics,
  parseHeroTopics,
} from "../lib/hero";
import { assertOutletMarkFor, assertThesis, identity } from "../lib/identity";
import {
  HERO_STAGE_COPY,
  HERO_STAGE_NAME,
  HERO_STAGE_PORTRAIT,
  parseHeroEntranceStage,
} from "../lib/motion/hero-entrance";
import { SCROLL_REVEAL_SCOPE_ATTRIBUTE } from "../lib/motion/reveal";
import {
  assertPressThumbnail,
  PRESS_THUMB_HEIGHT,
  PRESS_THUMB_WIDTH,
} from "../lib/press-thumbnail";

export default function HomePage() {
  const featured = mediaCoverage[0]!;
  // The short bio, split so the opening statement can lead and the rest
  // reads as supporting detail rather than one dense block.
  const homeBio = splitBioLede(bios.words50);
  // The outlet that ran the featured interview, resolved to its published
  // logo so the credit line carries the mark rather than plain text.
  const featuredOutlet = assertOutletMarkFor(featured.outlet);

  return (
    <div className="home" {...{ [SCROLL_REVEAL_SCOPE_ATTRIBUTE]: "" }}>
      <section className="hero">
        <p aria-hidden="true" className="hero__watermark">
          {assertHeroWatermark(identity.name)}
        </p>

        {/* The name is nested so the wipe's mask resolves against the width
            of the text rather than the full grid row. The heading still reads
            as one string to assistive tech. */}
        <h1
          className="hero__name"
          data-hero-stage={parseHeroEntranceStage(HERO_STAGE_NAME)}
        >
          <span className="hero__name-type">
            {assertHeroDisplayName(identity.name)}
          </span>
        </h1>

        <div
          className="hero__portrait"
          data-hero-stage={parseHeroEntranceStage(HERO_STAGE_PORTRAIT)}
        >
          <div aria-hidden="true" className="hero__portrait-halftone" />
          <img
            alt={identity.name}
            className="hero__portrait-image"
            height={HERO_FEATURE_PORTRAIT_HEIGHT}
            src={assertHeroPortrait(HERO_FEATURE_PORTRAIT)}
            width={HERO_FEATURE_PORTRAIT_WIDTH}
          />
        </div>

        {/* Intro and topics share one stage rather than taking two, so they
            arrive together on either side of the portrait. */}
        <div
          className="hero__intro"
          data-hero-stage={parseHeroEntranceStage(HERO_STAGE_COPY)}
        >
          <p className="eyebrow">
            <TitleWithCoinsub />
          </p>
          <p className="hero__deck">{assertThesis(identity.thesis)}</p>
          <Link className="marker-link" href="/speaking">
            {assertBookToSpeakCta(BOOK_TO_SPEAK_CTA)}
          </Link>
        </div>

        <ul
          className="hero__topics"
          data-hero-stage={parseHeroEntranceStage(HERO_STAGE_COPY)}
        >
          {parseHeroTopics(heroTopics).map((topic) => (
            <li
              className={
                topic.featured
                  ? "hero__topic hero__topic--featured"
                  : "hero__topic"
              }
              key={topic.label}
            >
              {topic.label}
            </li>
          ))}
        </ul>
      </section>

      <LogoCarousel />

      {/* Below the hero every band fades up as it comes into view. The
          entrance owns the first screen; the observer owns the rest. */}
      <section className="band home-brief" data-reveal>
        <div className="home-brief__bio">
          <SectionIntro eyebrow="Biography">
            <p className="home-brief__lede">{homeBio.lede}</p>
            <p className="home-brief__detail">{homeBio.rest}</p>
            <Link className="marker-link" href="/about">
              Read Full Bio
            </Link>
          </SectionIntro>
        </div>
        <aside className="home-company">
          <p className="eyebrow">Company</p>
          <CoinsubMark className="home-company__logo" />
          <dl className="fact-list">
            {parseFactSheet(factSheet).map((fact) => (
              <div className="fact-list__row" key={fact.label}>
                <dt className="fact-list__label">{fact.label}</dt>
                <dd className="fact-list__value">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="band featured-interview" data-reveal>
        <div className="featured-interview__head">
          <p className="eyebrow">Featured interview</p>
          <h2 className="featured-interview__title">{featured.title}</h2>
          {/* The logo is the outlet's wordmark, so a name beside it would
              only repeat itself; the alt text carries the name instead. */}
          <p className="featured-interview__credit">
            <img
              alt={featuredOutlet.name}
              className="featured-interview__outlet"
              src={featuredOutlet.logo}
            />
          </p>
        </div>

        <div className="featured-interview__aside">
          <p className="featured-interview__lede">{featured.caption}</p>
          <div className="featured-interview__actions">
            <a className="button-link" href={featured.watchUrl}>
              {assertWatchInterviewCta(WATCH_INTERVIEW_CTA)}
            </a>
            <Link
              className="button-link button-link--ghost"
              href="/press/media-coverage"
            >
              {assertViewAllCoverageCta(VIEW_ALL_COVERAGE_CTA)}
            </Link>
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

      <section className="band" data-reveal>
        <div className="post-head">
          <p className="eyebrow">Latest from Coinsub</p>
          <h2 className="post-head__title">
            What Coinsub has been writing publicly
          </h2>
          <Link className="marker-link" href="/press">
            Read the Blog
          </Link>
        </div>
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
              <a
                className="button-link button-link--block button-link--external"
                href={post.href}
              >
                Read More
              </a>
            </article>
          ))}
        </div>
      </section>

      {FLAGSHIP_ESSAY_READY ? (
        <section className="band" data-reveal>
          <SectionIntro
            eyebrow="Insight"
            title="Trust Shouldn't Be a Promise. It Should Be Architecture."
          >
            <p>
              Why the orchestration layer, not another wallet or checkout tool,
              is the piece still missing from stablecoin infrastructure.
            </p>
            <Link className="text-link" href="/insights/trust-shouldnt-be-a-promise">
              Read the Essay
            </Link>
          </SectionIntro>
        </section>
      ) : null}

      <section className="band" data-reveal>
        <SectionIntro eyebrow="Media kit" title="Everything a reporter needs">
          <p>{assertMediaKitPromise(MEDIA_KIT_PROMISE)}</p>
          <Link className="button-link" href="/media-kit">
            {assertRequestFullMediaKitCta(REQUEST_FULL_MEDIA_KIT_CTA)}
          </Link>
        </SectionIntro>
      </section>
    </div>
  );
}
