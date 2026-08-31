import { afterEach, describe, expect, it, vi } from "vitest";

import { GATE_PASSWORD_ENV } from "../lib/gate";
import { identity } from "../lib/identity";
import RootLayout, { metadata } from "./layout";
import robots from "./robots";
import sitemap from "./sitemap";

const GATE_PASSWORD = "press-preview-2026";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

function firstRule(rules: ReturnType<typeof robots>["rules"]) {
  return Array.isArray(rules) ? rules[0] : rules;
}

function verifySitemap() {
  const entries = sitemap();
  const home = entries.find((entry) => entry.url.endsWith("jasperfu.com"));
  const terms = entries.find((entry) => entry.url.endsWith("/terms"));
  const press = entries.find((entry) => entry.url.endsWith("/press"));

  expect(entries.length).toBe(11);
  expect(home?.priority).toBe(1);
  expect(press?.priority).toBe(0.8);
  expect(terms?.url).toBe("https://www.jasperfu.com/terms");
  expect(entries.some((entry) => entry.url.endsWith("/insights"))).toBe(false);
}

describe("public SEO metadata", () => {
  it("publishes deterministic public routes in the sitemap", () => {
    verifySitemap();
  });

  it("allows public indexing of the press site", () => {
    const publicRule = firstRule(robots().rules);
    expect(publicRule?.allow).toBe("/");
    expect(robots().sitemap).toBe(`${identity.siteUrl}/sitemap.xml`);
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("disallows every crawler while the password gate is on", () => {
    vi.stubEnv(GATE_PASSWORD_ENV, GATE_PASSWORD);
    const gatedRule = firstRule(robots().rules);
    expect(gatedRule?.disallow).toBe("/");
    expect(gatedRule?.allow).toBeUndefined();
    expect(robots().sitemap).toBeUndefined();
  });

  it("marks the gated site noindex in the document metadata", async () => {
    vi.stubEnv(GATE_PASSWORD_ENV, GATE_PASSWORD);
    vi.resetModules();
    const gated = await import("./layout");
    expect(gated.metadata.robots).toEqual({ index: false, follow: false });
  });

  it("defines canonical social metadata", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://www.jasperfu.com/");
    expect(metadata.openGraph).toBeTruthy();
    expect(metadata.openGraph?.title).toBe(`Jasper Fu: ${identity.thesis}`);
    expect(String(metadata.openGraph?.title)).not.toContain(
      "Trust shouldn't be a promise",
    );
    expect(metadata.twitter).toBeTruthy();
  });

  it("renders the English root document with the shared shell", () => {
    const layout = RootLayout({ children: "Page content" });
    expect(layout.type).toBe("html");
    expect(layout.props.lang).toBe("en");
  });
});
