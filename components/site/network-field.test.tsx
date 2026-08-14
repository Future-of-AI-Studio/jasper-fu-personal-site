import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NETWORK_OPACITY } from "../../lib/network-field";
import { NetworkField } from "./network-field";

function stubMotion(reduced: boolean) {
  vi.stubGlobal("matchMedia", () => ({ matches: reduced }));
}

function verifyNetworkCanvas() {
  const canvas = document.querySelector("canvas.network-field");
  expect(canvas).toBeTruthy();
  expect(canvas?.getAttribute("aria-hidden")).toBe("true");
  expect(canvas?.getAttribute("data-network-field")).toBe("true");
  return canvas as HTMLCanvasElement;
}

describe("NetworkField", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: () => ({
        clearRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        setTransform: vi.fn(),
        globalAlpha: 1,
        strokeStyle: "",
        fillStyle: "",
        lineWidth: 1,
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("paints a persistent semitranslucent canvas", () => {
    stubMotion(false);
    const raf = vi.fn(() => 7);
    vi.stubGlobal("requestAnimationFrame", raf);
    render(<NetworkField />);

    const canvas = verifyNetworkCanvas();
    expect(canvas.style.opacity).toBe(String(NETWORK_OPACITY));
    expect(raf).toHaveBeenCalled();
  });

  it("skips the animation loop when reduced motion is preferred", () => {
    stubMotion(true);
    const raf = vi.fn(() => 7);
    vi.stubGlobal("requestAnimationFrame", raf);
    render(<NetworkField />);

    verifyNetworkCanvas();
    expect(raf).not.toHaveBeenCalled();
  });
});
