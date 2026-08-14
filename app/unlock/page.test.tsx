import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PUBLISHED_SEAL_SRC } from "../../lib/brand-mark";
import {
  GATE_HOME_PATH,
  UNLOCK_CTA,
  UNLOCK_EYEBROW,
  UNLOCK_HELP,
  UNLOCK_INTRO,
  UNLOCK_LABEL,
  UNLOCK_TITLE,
} from "../../lib/gate";
import { identity } from "../../lib/identity";
import UnlockPage, { metadata } from "./page";

const PASSWORD = "press-preview-2026";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function renderUnlockPage(
  params?: Record<string, string | string[] | undefined>,
) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ next: GATE_HOME_PATH }),
  });
  vi.stubGlobal("fetch", fetchMock);

  const element = await UnlockPage(
    params ? { searchParams: Promise.resolve(params) } : {},
  );
  const view = render(element);

  return { ...view, fetchMock, user: userEvent.setup() };
}

async function submittedNext(
  fetchMock: ReturnType<typeof vi.fn>,
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.type(screen.getByLabelText(UNLOCK_LABEL), PASSWORD);
  await user.click(screen.getByRole("button", { name: UNLOCK_CTA }));

  return JSON.parse(fetchMock.mock.calls[0]![1].body).next;
}

function verifyGateScreen(container: HTMLElement) {
  expect(container.querySelector(".unlock-page")).toBeTruthy();
  expect(container.querySelector(".unlock-card")).toBeTruthy();
  expect(
    screen.getByRole("heading", { level: 1, name: UNLOCK_TITLE }),
  ).toBeTruthy();
  expect(screen.getByText(UNLOCK_EYEBROW)).toBeTruthy();
  expect(screen.getByText(UNLOCK_INTRO)).toBeTruthy();
  expect(screen.getByRole("button", { name: UNLOCK_CTA })).toBeTruthy();
  expect(screen.getByLabelText(UNLOCK_LABEL)).toBeTruthy();
  expect(
    screen.getByRole("img", { name: identity.name }).getAttribute("src"),
  ).toBe(PUBLISHED_SEAL_SRC);
}

describe("unlock page", () => {
  it("renders the branded gate screen", async () => {
    const { container } = await renderUnlockPage();
    verifyGateScreen(container);
  });

  it("offers the press inbox as the way back in", async () => {
    await renderUnlockPage();
    expect(screen.getByText(new RegExp(UNLOCK_HELP))).toBeTruthy();
    expect(
      screen.getByRole("link", { name: identity.pressEmail }).getAttribute("href"),
    ).toBe(`mailto:${identity.pressEmail}`);
  });

  it("keeps the site out of search results", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.title).toBe(UNLOCK_TITLE);
  });

  it("carries the requested page into the unlock request", async () => {
    const { fetchMock, user } = await renderUnlockPage({ next: "/press" });
    expect(await submittedNext(fetchMock, user)).toBe("/press");
  });

  it("drops an off-site redirect supplied in the query string", async () => {
    const { fetchMock, user } = await renderUnlockPage({
      next: "https://evil.example.com",
    });
    expect(await submittedNext(fetchMock, user)).toBe(GATE_HOME_PATH);
  });

  it.each([
    ["a repeated parameter", { next: ["/press", "/about"] }],
    ["no parameter", {}],
  ])("falls back home for %s", async (_label, params) => {
    const { fetchMock, user } = await renderUnlockPage(params);
    expect(await submittedNext(fetchMock, user)).toBe(GATE_HOME_PATH);
  });
});
