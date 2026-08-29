import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { InquiryForm } from "./inquiry-form";
import { MEDIA_KIT_INQUIRY_LABEL, MEDIA_KIT_INQUIRY_TYPE } from "../../lib/contact";
import {
  PUBLISHED_CALENDLY_PROMPT,
  PUBLISHED_RESPONSE_TIME_NOTE,
  SEND_REQUEST_CTA,
  TEAM_CONFIRMATION_COPY,
} from "../../lib/copy";
import { identity } from "../../lib/identity";

async function fillHappyPath() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), "Jane King");
  await user.type(screen.getByLabelText("Organization / outlet"), "NASDAQ");
  await user.type(screen.getByLabelText("Email"), "jane@example.com");
  await user.type(screen.getByLabelText("Notes"), "Need a comment on rails.");
  await user.click(screen.getByRole("button", { name: SEND_REQUEST_CTA }));
}

function verifyInquiryTypes() {
  expect(
    screen.getByRole("option", { name: MEDIA_KIT_INQUIRY_LABEL }),
  ).toBeTruthy();
  expect(screen.queryByRole("option", { name: "Download Media Kit" })).toBeNull();
}

function verifyPreparedMailto() {
  const link = screen.getByRole("link", { name: "Open email to send" });
  expect(link.getAttribute("href")?.startsWith("mailto:press@coinsub.io")).toBe(
    true,
  );
}

function verifyResponseTimeNote() {
  expect(screen.getAllByText(PUBLISHED_RESPONSE_TIME_NOTE)).toHaveLength(1);
  expect(
    screen.queryByText(/Confirm the actual commitment before publishing/),
  ).toBeNull();
}

function verifyCalendlyBooking() {
  const link = screen.getByRole("link", { name: "Open Calendly" });
  expect(link.getAttribute("href")).toBe(identity.calendlyUrl);
  expect(screen.getByText(PUBLISHED_CALENDLY_PROMPT)).toBeTruthy();
  expect(screen.queryByText(TEAM_CONFIRMATION_COPY)).toBeNull();
  expect(screen.queryByLabelText("Availability")).toBeNull();
}

function verifySendRequestCta() {
  expect(screen.getByRole("button", { name: SEND_REQUEST_CTA })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Prepare request" })).toBeNull();
}

function verifyNameErrorNotUnderCalendly() {
  const alert = screen.getByRole("alert");
  expect(alert.textContent).toBe("Name is required");
  const calendlyBlock = document.querySelector("[data-calendly-block]");
  expect(calendlyBlock).toBeTruthy();
  expect(calendlyBlock?.contains(alert)).toBe(false);
  expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBe("true");
}

describe("InquiryForm", () => {
  it("prepares a routed mailto on the happy path", async () => {
    render(<InquiryForm />);
    verifyInquiryTypes();
    verifyCalendlyBooking();
    verifySendRequestCta();
    verifyResponseTimeNote();
    await fillHappyPath();
    verifyPreparedMailto();
  });

  it("prepares a Request Media Kit mailto when that inquiry type is selected", async () => {
    const user = userEvent.setup();
    render(<InquiryForm />);
    verifyInquiryTypes();
    await user.selectOptions(
      screen.getByLabelText("Inquiry type"),
      MEDIA_KIT_INQUIRY_TYPE,
    );
    await fillHappyPath();
    expect(
      screen.getByRole("link", { name: "Open email to send" }).getAttribute("href"),
    ).toContain(encodeURIComponent("Request Media Kit — NASDAQ"));
  });

  it("hides the type picker and Calendly on a dedicated request", () => {
    const { container } = render(
      <InquiryForm
        defaultType={MEDIA_KIT_INQUIRY_TYPE}
        showScheduling={false}
        types={[MEDIA_KIT_INQUIRY_TYPE]}
      />,
    );

    // A single offered type is not a choice: no select, but the value still
    // travels with the submission.
    expect(container.querySelector("select")).toBeNull();
    expect(screen.queryByLabelText("Inquiry type")).toBeNull();
    expect(screen.queryByRole("option", { name: "Interview request" })).toBeNull();
    const hidden = container.querySelector<HTMLInputElement>(
      'input[type="hidden"][name="inquiryType"]',
    );
    expect(hidden?.value).toBe(MEDIA_KIT_INQUIRY_TYPE);

    // Calendly books a conversation, which requesting a kit does not need.
    expect(document.querySelector("[data-calendly-block]")).toBeNull();
    expect(screen.queryByRole("link", { name: "Open Calendly" })).toBeNull();
    expect(screen.queryByText(PUBLISHED_CALENDLY_PROMPT)).toBeNull();
    // The rest of the form is untouched.
    expect(screen.getByRole("button", { name: SEND_REQUEST_CTA })).toBeTruthy();
    expect(screen.getByText(PUBLISHED_RESPONSE_TIME_NOTE)).toBeTruthy();
  });

  it("still routes the hidden type when the picker is not shown", async () => {
    render(
      <InquiryForm
        defaultType={MEDIA_KIT_INQUIRY_TYPE}
        showScheduling={false}
        types={[MEDIA_KIT_INQUIRY_TYPE]}
      />,
    );
    await fillHappyPath();
    expect(
      screen.getByRole("link", { name: "Open email to send" }).getAttribute("href"),
    ).toContain(encodeURIComponent("Request Media Kit — NASDAQ"));
  });

  it("offers Cancel beside submit only when a cancel action is given", () => {
    const cancelled: string[] = [];
    const { rerender } = render(<InquiryForm />);
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();

    rerender(<InquiryForm onCancel={() => cancelled.push("closed")} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  });

  it("surfaces a unique name error on the name field, not under Calendly", async () => {
    const user = userEvent.setup();
    render(<InquiryForm />);
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: SEND_REQUEST_CTA }));
    verifyNameErrorNotUnderCalendly();
  });
});
