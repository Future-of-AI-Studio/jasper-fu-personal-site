import Link from "next/link";

import { CoinsubMark, TitleWithCoinsub } from "../components/site/brand";
import { HeroPortraitCarousel } from "../components/site/hero-portrait-carousel";
import { SectionIntro } from "../components/site/legal-document";
import {
  BOOK_TO_SPEAK_CTA,
  CONTACT_CTA,
  REQUEST_FULL_MEDIA_KIT_CTA,
  assertBookToSpeakCta,
  assertContactCta,
  assertRequestFullMediaKitCta,
  bios,
  companyBoilerplate,
  FLAGSHIP_ESSAY_READY,
  interimBlogPosts,
  mediaCoverage,
} from "../lib/copy";
import {
  assertMediaOutletMark,
  assertThesis,
  identity,
  mediaBarLoopCopyIndexes,
  mediaOutlets,
} from "../lib/identity";
import {
  assertPressThumbnail,
  PRESS_THUMB_HEIGHT,
  PRESS_THUMB_WIDTH,
} from "../lib/press-thumbnail";

export default function HomePage() {
  const featured = mediaCoverage[0]!;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow" data-reveal>
            <TitleWithCoinsub />
          </p>
          <h1 data-reveal>{identity.name}</h1>
          <p className="hero__deck" data-reveal>
            {assertThesis(identity.thesis)}
          </p>
          <div className="hero__rule" aria-hidden="true" />
          <div className="hero__actions">
            <Link className="button-link" href="/speaking">
              {assertBookToSpeakCta(BOOK_TO_SPEAK_CTA)}
            </Link>
            <Link className="button-link button-link--ghost" href="/contact">
              {assertContactCta(CONTACT_CTA)}
            </Link>
          </div>
        </div>
        <HeroPortraitCarousel />
      </section>

      <div className="media-bar" aria-label="Media recognition">
        <div className="media-bar__track">
          {mediaBarLoopCopyIndexes().map((copy) => (
            <div
              aria-hidden={copy === 1 ? true : undefined}
              className="media-bar__group"
              key={copy}
            >
              {mediaOutlets.map((outlet) => {
                const mark = assertMediaOutletMark(outlet);
                return (
                  <a
                    className="media-bar__link"
                    href={outlet.href}
                    key={`${copy}-${mark.name}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    <img
                      alt={copy === 0 ? mark.name : ""}
                      className={
                        mark.name === "CEO Magazine"
                          ? "media-bar__logo media-bar__logo--ceo"
                          : "media-bar__logo"
                      }
                      src={mark.logo}
                    />
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <section className="band two-col">
        <div>
          <SectionIntro eyebrow="Biography">
            <p>{bios.words75}</p>
            <Link className="text-link" href="/about">
              Read Full Bio
            </Link>
          </SectionIntro>
        </div>
        <div className="home-company">
          <p className="eyebrow">Company</p>
          <CoinsubMark className="home-company__logo" />
          <p>{companyBoilerplate}</p>
        </div>
      </section>

      <section className="band">
        <SectionIntro
          eyebrow="Featured interview"
          fullWidth
          title={featured.title}
        >
          <p>{featured.caption}</p>
        </SectionIntro>
        {featured.embedUrl ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="embed"
            src={featured.embedUrl}
            title={featured.title}
          />
        ) : null}
        <p>
          <Link className="text-link" href="/press/media-coverage">
            View All Media Coverage
          </Link>
        </p>
      </section>

      <section className="band">
        <SectionIntro
          eyebrow="Latest from Coinsub"
          title="What Coinsub has been writing publicly"
        />
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
        <Link className="text-link" href="/press">
          Read the Blog
        </Link>
      </section>

      {FLAGSHIP_ESSAY_READY ? (
        <section className="band">
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

      <section className="band closer">
        <div>
          <SectionIntro eyebrow="Media kit" title="Everything a reporter needs">
            <p>Headshots, logos, and approved copy, no request email required.</p>
            <Link className="button-link" href="/media-kit">
              {assertRequestFullMediaKitCta(REQUEST_FULL_MEDIA_KIT_CTA)}
            </Link>
          </SectionIntro>
        </div>
        <div>
          <SectionIntro eyebrow="Press" title="Get in touch">
            <p>
              Working on a story about stablecoin infrastructure, programmable
              money, or payments orchestration?
            </p>
            <Link className="button-link button-link--ghost" href="/contact">
              {assertContactCta(CONTACT_CTA)}
            </Link>
          </SectionIntro>
        </div>
      </section>
    </div>
  );
}
