import type { Metadata } from "next";

import { InquiryForm } from "../../components/contact/inquiry-form";
import { PageHead } from "../../components/site/page-head";
import { contactIntro } from "../../lib/copy";
import { identity } from "../../lib/identity";

export const metadata: Metadata = {
  title: "Contact",
  description: "Press, speaking, and partnership inquiries for Jasper Fu.",
};

export default function ContactPage() {
  return (
    <article className="contact-layout">
      <div className="contact-copy">
        <PageHead
          eyebrow="Contact"
          title="Press inquiries"
          lede={contactIntro}
        />
        <div className="contact-routing">
          <p className="eyebrow">Routing</p>
          <ul className="route-list">
            <li>Interview and comment requests: {identity.pressEmail}</li>
            <li>Speaking and panel requests: {identity.speakingEmail}</li>
            <li>Partnership and business: {identity.partnershipEmail}</li>
          </ul>
        </div>
      </div>
      <InquiryForm />
    </article>
  );
}
