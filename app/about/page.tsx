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
  careerTimeline,
  companyBoilerplate,
  credentials,
  parseAboutFaqs,
  parseCareerTimeline,
  parseCredentials,
  parsePullQuotes,
  parseQuickFacts,
  pullQuotes,
  quickFacts,
  VIEW_ALL_COVERAGE_CTA,
} from "../../lib/copy";
import { assertLockedOneLiner, identity } from "../../lib/identity";
import {
  assertMediaKitPhoto,
  MEDIA_KIT_SPEAKING_PHOTO,
} from "../../lib/media-kit";

export const metadata: Metadata = {
  title: "About",
  description: "Biography, timeline, and credentials for Jasper Fu.",
};

export default function AboutPage() {
  const paragraphs = assertAboutBioParagraphs(aboutBioParagraphs);
  const quote = assertAboutPullQuote(ABOUT_PULL_QUOTE);
  const timeline = parseCareerTimeline(careerTimeline);
  const creds = parseCredentials(credentials);
  const facts = parseQuickFacts(quickFacts);
  const quotes = parsePullQuotes(pullQuotes);
  const faqs = parseAboutFaqs(aboutFaqs);

  return (
    <article>
      <header className="page-head page-head--label">
        <p className="eyebrow">About</p>
        <h1 className="visually-hidden">About</h1>
        <p className="about-headline">
          {assertLockedOneLiner(identity.lockedOneLiner)}
        </p>
        <blockquote className="about-bio__quote">
          <p>“{quote}”</p>
        </blockquote>
      </header>

      {/* The source still carries a broadcast lower-third across its bottom
          left, so the frame is cropped to a cinematic ratio anchored to the
          top — that lifts the chyron out of shot and leaves the foot of the
          image clear for the name and the stat chips. */}
      <section className="showcase">
        <figure className="showcase__frame">
          <img
            className="showcase__image"
            src={assertMediaKitPhoto(MEDIA_KIT_SPEAKING_PHOTO)}
            alt={`${identity.name} interviewed at the New York Stock Exchange`}
            width={1280}
            height={720}
          />
          <figcaption className="showcase__overlay">
            <div className="showcase__identity">
              <p className="showcase__name">{identity.name}</p>
              <p className="showcase__role">{identity.title}</p>
            </div>
            <ul className="showcase__stats">
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
      <section className="band about-bio">
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
      <section className="band two-col">
        <div>
          <SectionIntro eyebrow="Journey" title="Career timeline" />
          <ul className="career-timeline">
            {timeline.map((item) => (
              <li key={item} className="career-timeline__item">
                <span className="career-timeline__dot" aria-hidden="true" />
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionIntro eyebrow="Credentials" title="Education and status" />
          <ul className="career-timeline credentials-list">
            {creds.map((item) => (
              <li key={item} className="career-timeline__item">
                <span className="career-timeline__dot" aria-hidden="true" />
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band">
        <SectionIntro eyebrow="In His Words" title="More from Jasper" />
        {quotes.map((line) => (
          <blockquote key={line} className="quote-card">
            <p>“{line}”</p>
          </blockquote>
        ))}
      </section>

      <section className="band">
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

      <section className="band about-closing-cta">
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
