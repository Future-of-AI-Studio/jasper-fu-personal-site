export const NETWORK_NODE_MIN = 28;
export const NETWORK_NODE_MAX = 80;
export const NETWORK_LINK_DISTANCE = 140;
export const NETWORK_OPACITY = 0.42;
export const NETWORK_OPACITY_MIN = 0.2;
export const NETWORK_OPACITY_MAX = 0.55;
export const NETWORK_AREA_PER_NODE = 18_000;
export const NETWORK_SPEED_MIN = 0.12;
export const NETWORK_SPEED_MAX = 0.42;

export type NetworkNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export type NetworkLink = {
  from: number;
  to: number;
  strength: number;
};

export function assertNetworkCount(value: number) {
  if (!Number.isInteger(value)) {
    throw new Error("Network node count must be an integer");
  }
  if (value < NETWORK_NODE_MIN) {
    throw new Error(
      `Network node count cannot be below ${NETWORK_NODE_MIN}`,
    );
  }
  if (value > NETWORK_NODE_MAX) {
    throw new Error(
      `Network node count cannot exceed ${NETWORK_NODE_MAX}`,
    );
  }
  return value;
}

export function assertNetworkOpacity(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Network opacity must be a finite number");
  }
  if (value < NETWORK_OPACITY_MIN) {
    throw new Error("Network opacity is too faint to stay semitranslucent");
  }
  if (value > NETWORK_OPACITY_MAX) {
    throw new Error("Network opacity is too solid to stay semitranslucent");
  }
  return value;
}

export function assertLinkDistance(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Network link distance must be a finite number");
  }
  if (value <= 0) {
    throw new Error("Network link distance must be greater than 0");
  }
  return value;
}

export function assertFieldSize(width: number, height: number) {
  if (!Number.isFinite(width) || width <= 0) {
    throw new Error("Network field width must be greater than 0");
  }
  if (!Number.isFinite(height) || height <= 0) {
    throw new Error("Network field height must be greater than 0");
  }
  return { width, height };
}

export function networkNodeCountForArea(width: number, height: number) {
  const size = assertFieldSize(width, height);
  const raw = Math.round((size.width * size.height) / NETWORK_AREA_PER_NODE);
  return Math.min(NETWORK_NODE_MAX, Math.max(NETWORK_NODE_MIN, raw));
}

export function createNetworkNodes(
  count: number,
  width: number,
  height: number,
  random: () => number = Math.random,
): NetworkNode[] {
  const safeCount = assertNetworkCount(count);
  const size = assertFieldSize(width, height);
  return Array.from({ length: safeCount }, () => {
    const angle = random() * Math.PI * 2;
    const speed =
      NETWORK_SPEED_MIN + random() * (NETWORK_SPEED_MAX - NETWORK_SPEED_MIN);
    return {
      x: random() * size.width,
      y: random() * size.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1.1 + random() * 1.6,
    };
  });
}

export function stepNetworkNodes(
  nodes: readonly NetworkNode[],
  width: number,
  height: number,
): NetworkNode[] {
  const size = assertFieldSize(width, height);
  if (nodes.length === 0) {
    throw new Error("Network field needs at least one node to step");
  }

  return nodes.map((node) => {
    let { x, y, vx, vy, r } = node;
    x += vx;
    y += vy;
    if (x < 0) {
      x = 0;
      vx = Math.abs(vx);
    } else if (x > size.width) {
      x = size.width;
      vx = -Math.abs(vx);
    }
    if (y < 0) {
      y = 0;
      vy = Math.abs(vy);
    } else if (y > size.height) {
      y = size.height;
      vy = -Math.abs(vy);
    }
    return { x, y, vx, vy, r };
  });
}

export function networkLinks(
  nodes: readonly NetworkNode[],
  distance: number,
): NetworkLink[] {
  const reach = assertLinkDistance(distance);
  const links: NetworkLink[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i]!;
      const b = nodes[j]!;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const gap = Math.hypot(dx, dy);
      if (gap >= reach) continue;
      links.push({
        from: i,
        to: j,
        strength: 1 - gap / reach,
      });
    }
  }
  return links;
}

export function shouldAnimateNetwork(reducedMotion: boolean) {
  return !reducedMotion;
}
