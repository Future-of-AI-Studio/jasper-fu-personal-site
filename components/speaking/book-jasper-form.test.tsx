import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SEND_REQUEST_CTA } from "../../lib/copy";
import {
  compileSpeakingRequestJson,
  emptySpeakingBooking,
  engagementTypes,
} from "../../lib/speaking";
import { BookJasperForm } from "./book-jasper-form";

async function fillHappyPath() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Conference keynote" }));
  await user.type(screen.getByLabelText("Event name"), "AI Summit 2026");
  await user.type(screen.getByLabelText("Full name"), "Jane Doe");
  await user.type(screen.getByLabelText("Organization"), "NASDAQ");
  await user.type(screen.getByLabelText("Email"), "jane@example.com");
  await user.click(screen.getByRole("button", { name: SEND_REQUEST_CTA }));
  return user;
}

function verifyPreparedSpeakingMailto() {
  const link = screen.getByRole("link", { name: "Open email to send" });
  const href = link.getAttribute("href") ?? "";
  expect(href.startsWith("mailto:speaking@jasperfu.io")).toBe(true);
  expect(href).toContain(encodeURIComponent('"engagement_type"'));
  expect(href).toContain(encodeURIComponent("AI Summit 2026"));
  expect(screen.getByRole("heading", { name: "Request prepared" })).toBeTruthy();
  expect(screen.queryByText(/logged for review/)).toBeNull();
  expect(screen.queryByText("request.json")).toBeNull();
}

function verifyPlainSendButton() {
  const send = screen.getByRole("button", { name: SEND_REQUEST_CTA });
  expect(send.textContent?.trim()).toBe(SEND_REQUEST_CTA);
  expect(send.textContent).not.toContain("request.json");
  expect(send.textContent).not.toContain("engagement_type");
  expect(screen.queryByLabelText("Request preview")).toBeNull();
  expect(compileSpeakingRequestJson(emptySpeakingBooking)).toContain(
    '"engagement_type": null',
  );
}

describe("BookJasperForm", () => {
  it("prepares a speaking mailto on the happy path", async () => {
    render(<BookJasperForm />);
    verifyPlainSendButton();
    expect(engagementTypes).toHaveLength(7);
    expect(emptySpeakingBooking.engagementType).toBe("");
    await fillHappyPath();
    verifyPreparedSpeakingMailto();
  });

  it("keeps request.json out of the send button while still compiling it", async () => {
    render(<BookJasperForm />);
    verifyPlainSendButton();
    expect(screen.queryByText("request.json")).toBeNull();
  });

  it("surfaces engagement type on the pills, not under name", async () => {
    const user = userEvent.setup();
    render(<BookJasperForm />);
    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.click(screen.getByRole("button", { name: SEND_REQUEST_CTA }));
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Engagement type is required");
    expect(screen.getByLabelText("Full name").closest(".speaking-field")?.contains(alert)).toBe(
      false,
    );
  });

  it("surfaces a unique full-name error on the name field", async () => {
    const user = userEvent.setup();
    render(<BookJasperForm />);
    await user.click(screen.getByRole("button", { name: "Workshop" }));
    await user.type(screen.getByLabelText("Event name"), "AI Summit 2026");
    await user.type(screen.getByLabelText("Organization"), "NASDAQ");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: SEND_REQUEST_CTA }));
    expect(screen.getByRole("alert").textContent).toBe("Full name is required");
  });
});
