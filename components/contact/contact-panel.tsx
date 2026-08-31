"use client";

import { type ReactNode, useState } from "react";

import {
  assertInquiryRouteGroups,
  inquiryRouteGroups,
  routeGroupFor,
  type InquiryType,
} from "../../lib/contact";
import { InquiryForm } from "./inquiry-form";

/**
 * Holds the reader's selected inquiry type so the routing list and the form
 * agree. The head is passed through as children so it stays a server
 * component rather than being pulled into this client boundary.
 *
 * Renders the copy column and the form as siblings, because .contact-layout
 * is the grid and those two are its columns.
 */
export function ContactPanel({
  children,
  defaultType = "interview",
}: {
  children: ReactNode;
  defaultType?: InquiryType;
}) {
  const [inquiryType, setInquiryType] = useState<InquiryType>(defaultType);
  // Runs before anything is shown: a routing line that names a different
  // inbox from the one the mailto uses would be worse than none at all.
  assertInquiryRouteGroups(inquiryRouteGroups);
  const active = routeGroupFor(inquiryType);

  return (
    <>
      <div className="contact-copy">
        {children}
        <div className="contact-routing">
          <p className="eyebrow">Routing</p>
          {/* Only the line this request will actually take. The others are
              answers to a question the reader has already settled. */}
          <ul className="route-list">
            <li key={active.label}>
              {active.label}: {active.email}
            </li>
          </ul>
        </div>
      </div>
      <InquiryForm defaultType={defaultType} onTypeChange={setInquiryType} />
    </>
  );
}
