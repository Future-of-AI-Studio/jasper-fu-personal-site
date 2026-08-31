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
    ).toContain(encodeURIComponent("Request Media Kit: NASDAQ"));
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
    ).toContain(encodeURIComponent("Request Media Kit: NASDAQ"));
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
    // Reported on leaving the field now, rather than on a submit the reader
    // can no longer reach with the form incomplete.
    await user.click(screen.getByLabelText("Name"));
    await user.tab();
    verifyNameErrorNotUnderCalendly();
  });

  it("keeps send disabled until every required field is valid", async () => {
    const user = userEvent.setup();
    render(<InquiryForm />);
    const send = () => screen.getByRole("button", { name: SEND_REQUEST_CTA });

    expect(send().hasAttribute("disabled")).toBe(true);
    // The reason is spoken, not left to be guessed: a disabled button takes
    // no focus and announces nothing on its own.
    expect(send().getAttribute("aria-describedby")).toBe("inquiry-incomplete");
    expect(document.getElementById("inquiry-incomplete")).toBeTruthy();

    await user.type(screen.getByLabelText("Name"), "Jane King");
    await user.type(screen.getByLabelText("Organization / outlet"), "NASDAQ");
    await user.type(screen.getByLabelText("Notes"), "Need a comment on rails.");
    // Everything but a valid email.
    expect(send().hasAttribute("disabled")).toBe(true);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    expect(send().hasAttribute("disabled")).toBe(true);

    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    expect(send().hasAttribute("disabled")).toBe(false);
    expect(send().getAttribute("aria-describedby")).toBeNull();
    expect(document.getElementById("inquiry-incomplete")).toBeNull();
  });

  it("reports a bad email on the field once it has been left", async () => {
    const user = userEvent.setup();
    render(<InquiryForm />);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    // Nothing yet: the reader may still be typing.
    expect(screen.queryByText("Email must be valid")).toBeNull();

    await user.tab();
    expect(screen.getByText("Email must be valid")).toBeTruthy();
    const field = screen.getByLabelText("Email");
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(field.getAttribute("aria-describedby")).toBe("email-error");
  });

  it("shows Calendly only for the types that book a conversation", async () => {
    const user = userEvent.setup();
    render(<InquiryForm />);
    const calendly = () => screen.queryByRole("link", { name: "Open Calendly" });

    // Interview is the default, and it is a conversation.
    expect(calendly()).toBeTruthy();

    // Requesting a kit is a file to send, not a call to book.
    await user.selectOptions(
      screen.getByLabelText("Inquiry type"),
      MEDIA_KIT_INQUIRY_TYPE,
    );
    expect(calendly()).toBeNull();
    expect(document.querySelector("[data-calendly-block]")).toBeNull();

    // Other is too vague to put a call in front of.
    await user.selectOptions(screen.getByLabelText("Inquiry type"), "other");
    expect(calendly()).toBeNull();

    // Speaking is a conversation again, so it comes back.
    await user.selectOptions(screen.getByLabelText("Inquiry type"), "speaking");
    expect(calendly()).toBeTruthy();
  });

  it("tells the page which type is selected", async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    render(<InquiryForm onTypeChange={(type) => seen.push(type)} />);

    await user.selectOptions(screen.getByLabelText("Inquiry type"), "speaking");
    await user.selectOptions(screen.getByLabelText("Inquiry type"), "partnership");
    expect(seen).toEqual(["speaking", "partnership"]);
  });
});
