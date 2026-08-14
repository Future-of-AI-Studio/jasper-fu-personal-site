import { describe, expect, it } from "vitest";

import {
  assertFieldSize,
  assertLinkDistance,
  assertNetworkCount,
  assertNetworkOpacity,
  createNetworkNodes,
  NETWORK_LINK_DISTANCE,
  NETWORK_NODE_MAX,
  NETWORK_NODE_MIN,
  NETWORK_OPACITY,
  NETWORK_OPACITY_MAX,
  NETWORK_OPACITY_MIN,
  networkLinks,
  networkNodeCountForArea,
  shouldAnimateNetwork,
  stepNetworkNodes,
  type NetworkNode,
} from "./network-field";

function sequentialRandom() {
  let seed = 0.13;
  return () => {
    seed = (seed + 0.17) % 1;
    return seed;
  };
}

function happyNodes(count = NETWORK_NODE_MIN): NetworkNode[] {
  return createNetworkNodes(count, 800, 600, sequentialRandom());
}

function verifyNodesInBounds(
  nodes: readonly NetworkNode[],
  width: number,
  height: number,
) {
  expect(nodes.length).toBeGreaterThan(0);
  for (const node of nodes) {
    expect(node.x).toBeGreaterThanOrEqual(0);
    expect(node.x).toBeLessThanOrEqual(width);
    expect(node.y).toBeGreaterThanOrEqual(0);
    expect(node.y).toBeLessThanOrEqual(height);
  }
}

describe("assertNetworkCount", () => {
  it("accepts the minimum node count", () => {
    expect(assertNetworkCount(NETWORK_NODE_MIN)).toBe(NETWORK_NODE_MIN);
  });

  it("rejects a non-integer count", () => {
    expect(() => assertNetworkCount(28.4)).toThrow(
      "Network node count must be an integer",
    );
  });

  it("rejects a count below the minimum", () => {
    expect(() => assertNetworkCount(NETWORK_NODE_MIN - 1)).toThrow(
      `Network node count cannot be below ${NETWORK_NODE_MIN}`,
    );
  });

  it("rejects a count above the maximum", () => {
    expect(() => assertNetworkCount(NETWORK_NODE_MAX + 1)).toThrow(
      `Network node count cannot exceed ${NETWORK_NODE_MAX}`,
    );
  });
});

describe("assertNetworkOpacity", () => {
  it("accepts the published semitranslucent opacity", () => {
    expect(assertNetworkOpacity(NETWORK_OPACITY)).toBe(NETWORK_OPACITY);
  });

  it("rejects a non-finite opacity", () => {
    expect(() => assertNetworkOpacity(Number.NaN)).toThrow(
      "Network opacity must be a finite number",
    );
  });

  it("rejects an opacity too faint to stay semitranslucent", () => {
    expect(() => assertNetworkOpacity(NETWORK_OPACITY_MIN - 0.01)).toThrow(
      "Network opacity is too faint to stay semitranslucent",
    );
  });

  it("rejects an opacity too solid to stay semitranslucent", () => {
    expect(() => assertNetworkOpacity(NETWORK_OPACITY_MAX + 0.01)).toThrow(
      "Network opacity is too solid to stay semitranslucent",
    );
  });
});

describe("assertLinkDistance", () => {
  it("accepts the published link distance", () => {
    expect(assertLinkDistance(NETWORK_LINK_DISTANCE)).toBe(
      NETWORK_LINK_DISTANCE,
    );
  });

  it("rejects a non-finite distance", () => {
    expect(() => assertLinkDistance(Number.POSITIVE_INFINITY)).toThrow(
      "Network link distance must be a finite number",
    );
  });

  it("rejects a distance of 0", () => {
    expect(() => assertLinkDistance(0)).toThrow(
      "Network link distance must be greater than 0",
    );
  });
});

describe("assertFieldSize", () => {
  it("accepts a positive field", () => {
    expect(assertFieldSize(800, 600)).toEqual({ width: 800, height: 600 });
  });

  it("rejects a width of 0", () => {
    expect(() => assertFieldSize(0, 600)).toThrow(
      "Network field width must be greater than 0",
    );
  });

  it("rejects a height of 0", () => {
    expect(() => assertFieldSize(800, 0)).toThrow(
      "Network field height must be greater than 0",
    );
  });
});

describe("createNetworkNodes and stepping", () => {
  it("places the happy-path field inside the canvas", () => {
    const nodes = happyNodes();
    expect(nodes).toHaveLength(NETWORK_NODE_MIN);
    verifyNodesInBounds(nodes, 800, 600);
  });

  it("moves nodes and keeps them inside the field", () => {
    const before = happyNodes();
    const after = stepNetworkNodes(before, 800, 600);
    expect(after).toHaveLength(before.length);
    expect(
      after.some(
        (node, index) =>
          node.x !== before[index]!.x || node.y !== before[index]!.y,
      ),
    ).toBe(true);
    verifyNodesInBounds(after, 800, 600);
  });

  it("bounces a node that would leave the left edge", () => {
    const stepped = stepNetworkNodes(
      [{ x: 0, y: 40, vx: -1, vy: 0, r: 1 }],
      200,
      200,
    );
    expect(stepped[0]?.x).toBe(0);
    expect(stepped[0]?.vx).toBeGreaterThan(0);
  });

  it("rejects stepping an empty field", () => {
    expect(() => stepNetworkNodes([], 200, 200)).toThrow(
      "Network field needs at least one node to step",
    );
  });
});

describe("networkLinks", () => {
  it("connects two nearby nodes", () => {
    const links = networkLinks(
      [
        { x: 10, y: 10, vx: 0, vy: 0, r: 1 },
        { x: 20, y: 10, vx: 0, vy: 0, r: 1 },
      ],
      40,
    );
    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({ from: 0, to: 1 });
    expect(links[0]!.strength).toBeGreaterThan(0);
    expect(links[0]!.strength).toBeLessThan(1);
  });

  it("skips nodes farther than the link distance", () => {
    expect(
      networkLinks(
        [
          { x: 0, y: 0, vx: 0, vy: 0, r: 1 },
          { x: 200, y: 0, vx: 0, vy: 0, r: 1 },
        ],
        40,
      ),
    ).toHaveLength(0);
  });

  it("returns no links for a single node", () => {
    expect(
      networkLinks([{ x: 10, y: 10, vx: 0, vy: 0, r: 1 }], 40),
    ).toHaveLength(0);
  });
});

describe("networkNodeCountForArea", () => {
  it("clamps a tiny field to the minimum", () => {
    expect(networkNodeCountForArea(100, 100)).toBe(NETWORK_NODE_MIN);
  });

  it("clamps a huge field to the maximum", () => {
    expect(networkNodeCountForArea(8000, 8000)).toBe(NETWORK_NODE_MAX);
  });
});

describe("shouldAnimateNetwork", () => {
  it("animates when motion is allowed", () => {
    expect(shouldAnimateNetwork(false)).toBe(true);
  });

  it("freezes when reduced motion is preferred", () => {
    expect(shouldAnimateNetwork(true)).toBe(false);
  });
});
