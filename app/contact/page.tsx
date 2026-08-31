import type { Metadata } from "next";

import { ContactPanel } from "../../components/contact/contact-panel";
import { PageHead } from "../../components/site/page-head";
import { contactIntro } from "../../lib/copy";

export const metadata: Metadata = {
  title: "Contact",
  description: "Press, speaking, and partnership inquiries for Jasper Fu.",
};

export default function ContactPage() {
  return (
    <article className="contact-layout" data-page-entrance>
      {/* The routing list and the form share the selected inquiry type, so a
          client component owns it. The head stays server-rendered and is
          handed through as children. */}
      <ContactPanel>
        <PageHead title="Press inquiries" lede={contactIntro} />
      </ContactPanel>
    </article>
  );
}
