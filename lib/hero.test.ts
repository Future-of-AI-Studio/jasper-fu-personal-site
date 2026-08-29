import { describe, expect, it } from "vitest";

import {
  assertHeroDisplayName,
  assertHeroPortrait,
  assertHeroTopic,
  assertHeroWatermark,
  HERO_FEATURE_PORTRAIT,
  HERO_FEATURE_PORTRAIT_HEIGHT,
  HERO_FEATURE_PORTRAIT_WIDTH,
  HERO_FEATURED_TOPIC,
  HERO_TOPIC_MAX_COUNT,
  HERO_TOPIC_MAX_LENGTH,
  HERO_TOPIC_MIN_COUNT,
  heroTopics,
  parseHeroTopics,
  RETIRED_HERO_PORTRAIT,
  TEMPLATE_HERO_TOPICS,
} from "./hero";
import { identity } from "./identity";

function topicListOfLength(length: number) {
  const list = [HERO_FEATURED_TOPIC];
  for (let index = list.length; index < length; index += 1) {
    list.push(`Lane ${index}`);
  }
  return list.slice(0, Math.max(length, 0));
}

function verifyPublishedTopics(topics: ReturnType<typeof parseHeroTopics>) {
  expect(topics).toHaveLength(heroTopics.length);
  expect(topics.filter((topic) => topic.featured)).toHaveLength(1);
  expect(topics.find((topic) => topic.featured)?.label).toBe(
    HERO_FEATURED_TOPIC,
  );
  for (const topic of topics) {
    expect(topic.label.length).toBeLessThanOrEqual(HERO_TOPIC_MAX_LENGTH);
  }
}

describe("assertHeroTopic", () => {
  it("returns a published topic unchanged", () => {
    expect(assertHeroTopic("Programmable Money")).toBe("Programmable Money");
  });

  it("trims surrounding whitespace", () => {
    expect(assertHeroTopic("  Built-in Compliance  ")).toBe(
      "Built-in Compliance",
    );
  });

  it("rejects an empty topic", () => {
    expect(() => assertHeroTopic("   ")).toThrow("Hero topic is required");
  });

  it("rejects every label carried over from the layout template", () => {
    for (const filler of TEMPLATE_HERO_TOPICS) {
      expect(() => assertHeroTopic(filler)).toThrow(
        `${filler} is layout-template filler, not published copy`,
      );
    }
  });

  it("accepts a topic exactly at the length ceiling", () => {
    const atMax = "x".repeat(HERO_TOPIC_MAX_LENGTH);
    expect(assertHeroTopic(atMax)).toBe(atMax);
  });

  it("accepts a topic one character below the ceiling", () => {
    const belowMax = "x".repeat(HERO_TOPIC_MAX_LENGTH - 1);
    expect(assertHeroTopic(belowMax)).toBe(belowMax);
  });

  it("rejects a topic one character above the ceiling", () => {
    expect(() => assertHeroTopic("x".repeat(HERO_TOPIC_MAX_LENGTH + 1))).toThrow(
      `Hero topic cannot exceed ${HERO_TOPIC_MAX_LENGTH} characters`,
    );
  });
});

describe("parseHeroTopics", () => {
  it("publishes the shipped lanes with exactly one featured", () => {
    verifyPublishedTopics(parseHeroTopics(heroTopics));
  });

  it("marks only the featured lane", () => {
    const topics = parseHeroTopics(heroTopics);
    for (const topic of topics) {
      expect(topic.featured).toBe(topic.label === HERO_FEATURED_TOPIC);
    }
  });

  it("rejects a list below the minimum", () => {
    expect(() => parseHeroTopics(topicListOfLength(HERO_TOPIC_MIN_COUNT - 1))).toThrow(
      `Hero needs at least ${HERO_TOPIC_MIN_COUNT} topics`,
    );
  });

  it("accepts a list exactly at the minimum", () => {
    expect(parseHeroTopics(topicListOfLength(HERO_TOPIC_MIN_COUNT))).toHaveLength(
      HERO_TOPIC_MIN_COUNT,
    );
  });

  it("accepts a list exactly at the maximum", () => {
    expect(parseHeroTopics(topicListOfLength(HERO_TOPIC_MAX_COUNT))).toHaveLength(
      HERO_TOPIC_MAX_COUNT,
    );
  });

  it("rejects a list above the maximum", () => {
    expect(() => parseHeroTopics(topicListOfLength(HERO_TOPIC_MAX_COUNT + 1))).toThrow(
      `Hero cannot exceed ${HERO_TOPIC_MAX_COUNT} topics`,
    );
  });

  it("rejects a duplicated lane", () => {
    expect(() =>
      parseHeroTopics([HERO_FEATURED_TOPIC, "Lane 1", "Lane 1"]),
    ).toThrow("Hero topics must each be unique");
  });

  it("rejects a list that drops the featured lane", () => {
    expect(() => parseHeroTopics(["Lane 1", "Lane 2", "Lane 3"])).toThrow(
      "Hero topics must include the featured topic",
    );
  });

  it("rejects a list carrying template filler", () => {
    expect(() =>
      parseHeroTopics([HERO_FEATURED_TOPIC, "Lane 1", "Product Deisgn"]),
    ).toThrow("Product Deisgn is layout-template filler, not published copy");
  });
});

describe("assertHeroDisplayName", () => {
  it("returns the published name with its real casing intact", () => {
    expect(assertHeroDisplayName(identity.name)).toBe("Jasper Fu");
  });

  it("leaves the all-caps rendering to CSS rather than the DOM", () => {
    expect(assertHeroDisplayName(identity.name)).not.toBe("JASPER FU");
  });

  it("rejects an empty name", () => {
    expect(() => assertHeroDisplayName("  ")).toThrow(
      "Hero display name is required",
    );
  });

  it("rejects a name that disagrees with the identity module", () => {
    expect(() => assertHeroDisplayName("Jasper Fool")).toThrow(
      "Hero display name must match identity.name",
    );
  });
});

describe("assertHeroWatermark", () => {
  it("ghosts only the first name", () => {
    expect(assertHeroWatermark(identity.name)).toBe("Jasper");
  });

  it("rejects a name that disagrees with the identity module", () => {
    expect(() => assertHeroWatermark("Someone Else")).toThrow(
      "Hero display name must match identity.name",
    );
  });
});

describe("assertHeroPortrait", () => {
  it("returns the approved cutout", () => {
    expect(assertHeroPortrait(HERO_FEATURE_PORTRAIT)).toBe(
      HERO_FEATURE_PORTRAIT,
    );
  });

  it("names the retired studio-backdrop headshot in its own message", () => {
    expect(() => assertHeroPortrait(RETIRED_HERO_PORTRAIT)).toThrow(
      "The studio-backdrop headshot is retired here; the hero needs the cutout",
    );
  });

  it("rejects an empty source through the shared portrait guard", () => {
    expect(() => assertHeroPortrait("  ")).toThrow("Portrait source is required");
  });

  it("rejects a remote source through the shared portrait guard", () => {
    expect(() => assertHeroPortrait("https://example.com/jasper.jpg")).toThrow(
      "Portrait must be a local /portraits/ asset",
    );
  });

  it("rejects a different, otherwise-valid portrait", () => {
    expect(() => assertHeroPortrait("/portraits/jasper-fu-nyse.jpg")).toThrow(
      "Hero portrait must be the approved cutout",
    );
  });

  it("reserves the box with the cutout's intrinsic size", () => {
    expect(HERO_FEATURE_PORTRAIT_WIDTH).toBe(260);
    expect(HERO_FEATURE_PORTRAIT_HEIGHT).toBe(288);
  });
});
