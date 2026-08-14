import { describe, expect, it } from "vitest";

import { identity } from "../lib/identity";
import RootLayout, { metadata } from "./layout";
import robots from "./robots";
import sitemap from "./sitemap";

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
    const rules = robots().rules;
    const publicRule = Array.isArray(rules) ? rules[0] : rules;
    expect(publicRule?.allow).toBe("/");
  });

  it("defines canonical social metadata", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://www.jasperfu.com/");
    expect(metadata.openGraph).toBeTruthy();
    expect(metadata.openGraph?.title).toBe(`Jasper Fu — ${identity.thesis}`);
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
