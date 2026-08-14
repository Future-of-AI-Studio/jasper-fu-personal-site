import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionRoot } from "./motion-root";

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
});
