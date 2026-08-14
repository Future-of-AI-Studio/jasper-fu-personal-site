import type { Metadata } from "next";

import { BookJasperForm } from "../../components/speaking/book-jasper-form";
import { PageHead } from "../../components/site/page-head";
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
    <article>
      <PageHead
        eyebrow="Speaking"
        title="Book Jasper"
        lede={assertSpeakingIntro(speakingIntro)}
      />
      <section className="band">
        <SectionIntro eyebrow="Topics" title="What Jasper speaks on" />
        <ol className="index-list topic-grid">
          {speakingTopics.map((topic, index) => (
            <li key={topic.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{topic.title}</h3>
                <p>{topic.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="band">
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
