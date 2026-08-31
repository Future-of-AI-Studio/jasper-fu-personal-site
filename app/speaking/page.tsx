import type { Metadata } from "next";

import { BookJasperForm } from "../../components/speaking/book-jasper-form";
import { PageHead } from "../../components/site/page-head";
import { SCROLL_REVEAL_SCOPE_ATTRIBUTE } from "../../lib/motion/reveal";
import { SectionIntro } from "../../components/site/legal-document";
import {
  PUBLISHED_SPEAKING_BOOKING_TITLE,
  assertSpeakingBookingTitle,
  assertSpeakingIntro,
  speakingIntro,
  speakingTopics,
} from "../../lib/copy";

export const metadata: Metadata = {
  title: "Speaking",
  description: "Speaking topics and booking for Jasper Fu.",
};

export default function SpeakingPage() {
  return (
    <article data-page-entrance {...{ [SCROLL_REVEAL_SCOPE_ATTRIBUTE]: "" }}>
      <PageHead
        title="Book Jasper"
        lede={assertSpeakingIntro(speakingIntro)}
      />
      <section className="band">
        <SectionIntro eyebrow="Topics" title="What Jasper speaks on" />
        {/* Bulleted, not numbered: these topics have no running order, and
            the counters implied one. */}
        <ul className="index-list topic-grid">
          {speakingTopics.map((topic) => (
            <li key={topic.title}>
              <span className="index-list__dot" aria-hidden="true" />
              <div>
                <h3>{topic.title}</h3>
                <p>{topic.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="band" data-reveal>
        <SectionIntro
          eyebrow="Booking"
          fullWidth
          title={assertSpeakingBookingTitle(PUBLISHED_SPEAKING_BOOKING_TITLE)}
        />
        <BookJasperForm />
      </section>
    </article>
  );
}
