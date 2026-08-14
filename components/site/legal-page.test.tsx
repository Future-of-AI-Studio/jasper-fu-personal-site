import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RETIRED_LEGAL_DRAFT_NOTICE } from "../../lib/legal/published";
import { LegalPage } from "./legal-page";

function verifyLegalPage() {
  expect(
    screen.getByRole("heading", { level: 1, name: "Example policy" }),
  ).toBeTruthy();
  expect(screen.getByText("Last updated: August 2, 2026")).toBeTruthy();
  expect(screen.queryByText(RETIRED_LEGAL_DRAFT_NOTICE)).toBeNull();
  expect(document.querySelector(".legal-page__notice")).toBeNull();
  expect(
    screen.getByRole("heading", { level: 2, name: "Information" }),
  ).toBeTruthy();
}

describe("LegalPage", () => {
  it("renders dated legal sections without a draft-review notice", () => {
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
