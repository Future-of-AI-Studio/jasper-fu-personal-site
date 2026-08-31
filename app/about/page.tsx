import type { Metadata } from "next";
import Link from "next/link";

import { CoinsubMark } from "../../components/site/brand";
import { SectionIntro } from "../../components/site/legal-document";
import {
  aboutBioParagraphs,
  ABOUT_PULL_QUOTE,
  assertAboutBioParagraphs,
  assertAboutPullQuote,
  aboutFaqs,
  assertBookToSpeakCta,
  assertViewAllCoverageCta,
  BOOK_TO_SPEAK_CTA,
  companyBoilerplate,
  companyStanding,
  parseAboutFaqs,
  parseCompanyStanding,
  parsePullQuotes,
  parseQuickFacts,
  pullQuotes,
  quickFacts,
  resolveCareerTimeline,
  resolveCredentials,
  VIEW_ALL_COVERAGE_CTA,
} from "../../lib/copy";
import { assertLockedOneLiner, identity } from "../../lib/identity";
import {
  assertMediaKitPhoto,
  MEDIA_KIT_SPEAKING_PHOTO,
} from "../../lib/media-kit";
import {
  ABOUT_STAGE_DECK,
  ABOUT_STAGE_FRAME,
  ABOUT_STAGE_HEADLINE,
  ABOUT_STAGE_IDENTITY,
  ABOUT_STAGE_STATS,
  parseAboutEntranceStage,
} from "../../lib/motion/about-entrance";
import { SCROLL_REVEAL_SCOPE_ATTRIBUTE } from "../../lib/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Biography, timeline, and credentials for Jasper Fu.",
};

export default function AboutPage() {
  const paragraphs = assertAboutBioParagraphs(aboutBioParagraphs);
  const quote = assertAboutPullQuote(ABOUT_PULL_QUOTE);
  // The LinkedIn draft renders on the dev server so it can be read in place;
  // a build resolves to the published timeline until Jasper confirms it. The
  // resolver also refuses a draft line that reached the published constant.
  const timeline = resolveCareerTimeline(
    process.env.NODE_ENV === "development",
  );
  // Same dev-preview rule as the timeline: the LinkedIn-sourced education
  // shows on the dev server, a build resolves to the confirmed copy.
  const creds = resolveCredentials(process.env.NODE_ENV === "development");
  const standing = parseCompanyStanding(companyStanding);
  const facts = parseQuickFacts(quickFacts);
  const quotes = parsePullQuotes(pullQuotes);
  const faqs = parseAboutFaqs(aboutFaqs);

  return (
    <article {...{ [SCROLL_REVEAL_SCOPE_ATTRIBUTE]: "" }}>
      {/* The header, its deck, and the showcase share the first screen, so
          they arrive on first paint. Everything below reveals on scroll. */}
      <header className="page-head page-head--label">
        <h1 className="visually-hidden">About</h1>
        <p
          className="about-headline"
          data-about-stage={parseAboutEntranceStage(ABOUT_STAGE_HEADLINE)}
        >
          {assertLockedOneLiner(identity.lockedOneLiner)}
        </p>
        <blockquote
          className="about-bio__quote"
          data-about-stage={parseAboutEntranceStage(ABOUT_STAGE_DECK)}
        >
          <p>“{quote}”</p>
        </blockquote>
      </header>

      {/* The source still carries a broadcast lower-third across its bottom
          left, so the frame is cropped to a cinematic ratio anchored to the
          top — that lifts the chyron out of shot and leaves the foot of the
          image clear for the name and the stat chips. */}
      <section className="showcase">
        <figure
          className="showcase__frame"
          data-about-stage={parseAboutEntranceStage(ABOUT_STAGE_FRAME)}
        >
          <img
            className="showcase__image"
            src={assertMediaKitPhoto(MEDIA_KIT_SPEAKING_PHOTO)}
            alt={`${identity.name} interviewed at the New York Stock Exchange`}
            width={1280}
            height={720}
          />
          <figcaption className="showcase__overlay">
            <div
              className="showcase__identity"
              data-about-stage={parseAboutEntranceStage(ABOUT_STAGE_IDENTITY)}
            >
              <p className="showcase__name">{identity.name}</p>
              <p className="showcase__role">{identity.title}</p>
            </div>
            <ul
              className="showcase__stats"
              data-about-stage={parseAboutEntranceStage(ABOUT_STAGE_STATS)}
            >
              {facts.map((fact) => (
                <li className="showcase__stat" key={fact.label}>
                  <span className="showcase__stat-value">{fact.value}</span>
                  <span className="showcase__stat-label">{fact.label}</span>
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>
      </section>

      {/* The bio runs beside the company panel rather than alone in a narrow
          column, which is how the home page sets its own biography. */}
      <section className="band about-bio" data-reveal>
        <div className="about-bio__main">
          <SectionIntro eyebrow="Biography" />
          <div className="about-bio__prose bio-full">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside className="about-company">
          <header className="section-intro">
            <p className="eyebrow">Current Endeavour</p>
            <h2 className="endeavour__title">
              <CoinsubMark className="endeavour__logo" />
            </h2>
          </header>
          <p className="about-company__copy">{companyBoilerplate}</p>
        </aside>
      </section>

      {/* Two lists of the same shape, so they share a row instead of each
          leaving half the page empty. */}
      <section className="band two-col" data-reveal>
        <div>
          <SectionIntro eyebrow="Journey" title="Career timeline" />
          <ul className="career-timeline">
            {timeline.map((item) => (
              <li key={item.detail} className="career-timeline__item">
                <span className="career-timeline__dot" aria-hidden="true" />
                {/* The period is a label in its own column so the dates line
                    up down the list. Entries without one take the full row. */}
                {item.period ? (
                  <span className="career-timeline__period eyebrow">
                    {item.period}
                  </span>
                ) : null}
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Two lists, not one: the old single list put Jasper's degree and
            Coinsub's registration under the same heading, and only one of
            them is about him. */}
        <div>
          <SectionIntro
            eyebrow="Credentials"
            title="Education and certification"
          />
          <ul className="career-timeline credentials-list">
            {creds.map((item) => (
              <li key={item} className="career-timeline__item">
                <span className="career-timeline__dot" aria-hidden="true" />
                <p>{item}</p>
              </li>
            ))}
          </ul>

          <SectionIntro eyebrow="Company" title="Coinsub standing" />
          <ul className="career-timeline credentials-list">
            {standing.map((item) => (
              <li key={item} className="career-timeline__item">
                <span className="career-timeline__dot" aria-hidden="true" />
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" data-reveal>
        <SectionIntro eyebrow="In His Words" title="More from Jasper" />
        {quotes.map((line) => (
          <blockquote key={line} className="quote-card">
            <p>“{line}”</p>
          </blockquote>
        ))}
      </section>

      <section className="band" data-reveal>
        <SectionIntro eyebrow="FAQ" title="Common questions" />
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="band about-closing-cta" data-reveal>
        <SectionIntro eyebrow="Next" title="Work with Jasper" />
        <div className="about-closing-cta__actions">
          <Link className="button-link" href="/speaking">
            {assertBookToSpeakCta(BOOK_TO_SPEAK_CTA)}
          </Link>
          <Link className="button-link button-link--ghost" href="/press/media-coverage">
            {assertViewAllCoverageCta(VIEW_ALL_COVERAGE_CTA)}
          </Link>
        </div>
      </section>
    </article>
  );
}
