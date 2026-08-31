import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MotionRoot } from "./motion-root";

const pathname = { value: "/" };

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
}));

/** One page's worth of reveal targets, replacing whatever preceded them. */
function mountRoute(path: string, count = 1) {
  pathname.value = path;
  document.body.innerHTML = "";
  return Array.from({ length: count }, () => {
    const node = document.createElement("div");
    node.setAttribute("data-reveal", "");
    document.body.append(node);
    return node;
  });
}

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly callback: IntersectionObserverCallback;
  readonly observed: Element[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  unobserve() {}
  disconnect() {
    this.observed.length = 0;
  }
}

describe("MotionRoot", () => {
  beforeEach(() => {
    pathname.value = "/";
  });

  afterEach(() => {
    document.body.innerHTML = "";
    FakeIntersectionObserver.instances = [];
    vi.unstubAllGlobals();
  });

  it("observes reveal targets when motion is allowed", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const target = document.createElement("div");
    target.setAttribute("data-reveal", "");
    document.body.append(target);

    render(<MotionRoot />);

    expect(FakeIntersectionObserver.instances[0]?.observed).toContain(target);
  });

  it("immediately reveals targets when reduced motion is preferred", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const target = document.createElement("div");
    target.setAttribute("data-reveal", "");
    document.body.append(target);

    render(<MotionRoot />);

    expect(target.classList.contains("is-revealed")).toBe(true);
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("no-ops when no reveal targets exist", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));

    render(<MotionRoot />);

    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("observes the new targets after a client-side navigation", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));

    // Land on the home page.
    const [firstVisit] = mountRoute("/", 1);
    const { rerender } = render(<MotionRoot />);
    expect(FakeIntersectionObserver.instances[0]?.observed).toContain(
      firstVisit,
    );

    // Navigate away. This shell stays mounted; the page under it does not.
    const [away] = mountRoute("/about", 1);
    rerender(<MotionRoot />);
    expect(FakeIntersectionObserver.instances[1]?.observed).toContain(away);

    // Back to home, on brand new nodes. Before the pathname dep these were
    // observed by nobody and the stylesheet held them at opacity 0 forever.
    const secondVisit = mountRoute("/", 3);
    rerender(<MotionRoot />);
    const latest = FakeIntersectionObserver.instances.at(-1);
    secondVisit.forEach((node) => {
      expect(latest?.observed).toContain(node);
    });
    expect(FakeIntersectionObserver.instances).toHaveLength(3);
  });

  it("drops the observer on the page it is leaving", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));

    mountRoute("/", 2);
    const { rerender } = render(<MotionRoot />);
    const first = FakeIntersectionObserver.instances[0];
    expect(first?.observed).toHaveLength(2);

    mountRoute("/about", 1);
    rerender(<MotionRoot />);

    // Disconnected on the way out, so detached nodes are not held on to.
    expect(first?.observed).toHaveLength(0);
  });

  it("reveals the new targets after navigating under reduced motion", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));

    mountRoute("/", 1);
    const { rerender } = render(<MotionRoot />);

    const secondVisit = mountRoute("/", 2);
    pathname.value = "/about";
    rerender(<MotionRoot />);

    secondVisit.forEach((node) => {
      expect(node.classList.contains("is-revealed")).toBe(true);
    });
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });
});
