import type { Metadata } from "next";

import { CoinsubMark } from "../../components/site/brand";
import { SectionIntro } from "../../components/site/legal-document";
import {
  aboutBioParagraphs,
  ABOUT_PULL_QUOTE,
  assertAboutBioParagraphs,
  assertAboutPullQuote,
  careerTimeline,
  companyBoilerplate,
  credentials,
} from "../../lib/copy";
import { assertThesis, identity } from "../../lib/identity";

export const metadata: Metadata = {
  title: "About",
  description: "Biography, timeline, and credentials for Jasper Fu.",
};

export default function AboutPage() {
  const paragraphs = assertAboutBioParagraphs(aboutBioParagraphs);
  const quote = assertAboutPullQuote(ABOUT_PULL_QUOTE);

  return (
    <article>
      <header className="page-head page-head--label">
        <p className="eyebrow">About</p>
        <h1 className="visually-hidden">About</h1>
        <blockquote className="about-bio__quote">
          <p>“{quote}”</p>
        </blockquote>
      </header>

      <section className="about-bio">
        <figure className="about-portrait" aria-label={identity.name}>
          {/* Source: Coinsub About CEO portrait — https://cdn.prod.website-files.com/684c2cde6c3337369cad16e4/697b7fb0b77a883a35ceb13a_jasper.png */}
          <img
            className="about-portrait__image"
            src="/portraits/jasper-fu-placeholder.jpg"
            alt={identity.name}
            data-source="https://cdn.prod.website-files.com/684c2cde6c3337369cad16e4/697b7fb0b77a883a35ceb13a_jasper.png"
            width={780}
            height={864}
          />
          <figcaption className="about-portrait__overlay">
            <div className="about-portrait__copy">
              <p className="about-portrait__name">{identity.name}</p>
              <span className="about-portrait__rule" aria-hidden="true" />
              <p className="about-portrait__thesis">{assertThesis(identity.thesis)}</p>
            </div>
          </figcaption>
        </figure>
        <div className="about-bio__prose bio-full">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="band two-col">
        <div>
          <SectionIntro eyebrow="Journey" title="Career timeline" />
          <ol className="index-list timeline">
            {careerTimeline.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <header className="section-intro">
            <p className="eyebrow">Current Endeavour</p>
            <h2 className="endeavour__title">
              <CoinsubMark className="endeavour__logo" />
            </h2>
          </header>
          <p>{companyBoilerplate}</p>
        </div>
      </section>

      <section className="band">
        <SectionIntro eyebrow="Credentials" title="Education and status" />
        <ul className="index-list">
          {credentials.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
