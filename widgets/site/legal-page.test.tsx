import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LegalPage } from "./legal-page";

function verifyLegalPage() {
  expect(
    screen.getByRole("heading", { level: 1, name: "Example policy" }),
  ).toBeTruthy();
  expect(
    screen.getByText(
      "Draft for professional legal review before production launch.",
    ),
  ).toBeTruthy();
  expect(
    screen.getByRole("heading", { level: 2, name: "Information" }),
  ).toBeTruthy();
}

describe("LegalPage", () => {
  it("renders dated, review-gated legal sections", () => {
    render(
      <LegalPage
        eyebrow="Legal"
        sections={[
          {
            title: "Information",
            content: <p>Example legal copy.</p>,
          },
        ]}
        title="Example policy"
        updated="August 2, 2026"
      />,
    );

    verifyLegalPage();
  });
});
