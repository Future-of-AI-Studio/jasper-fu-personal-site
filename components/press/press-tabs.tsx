"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  computeTabMarker,
  isTabRectMeasurable,
  nextMarkerPhase,
  tabMarkerStyle,
  type PressTabMarkerPhase,
  type TabRect,
} from "../../lib/press-tabs";
import { SCROLL_REVEAL_SCOPE_ATTRIBUTE } from "../../lib/motion/reveal";

export const PRESS_TABS = [
  { href: "/press", label: "Press Releases" },
  { href: "/press/media-coverage", label: "Media Coverage and Interviews" },
] as const;

/**
 * Mounted by app/press/layout.tsx, not by the pages, so the nav survives a
 * tab change instead of being torn down with the page under it. That is what
 * lets the underline travel: there has to be an element that was already
 * somewhere for it to move from.
 */
export function PressTabs({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const [marker, setMarker] = useState<TabRect | null>(null);
  const [phase, setPhase] = useState<PressTabMarkerPhase>("idle");

  const active =
    PRESS_TABS.find((tab) => tab.href === pathname) ?? PRESS_TABS[0];

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const current = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!current) return;
      const link = current.getBoundingClientRect();
      // An element that has not been laid out reports zeros. Bail rather
      // than place a zero-width underline, and leave the per-link fallback
      // in the stylesheet marking the tab until a later measure succeeds.
      if (!isTabRectMeasurable(link)) return;

      setMarker(computeTabMarker(link, nav.getBoundingClientRect()));
      // Placed first with transitions off, armed on the next frame, so the
      // marker does not slide in from the left the first time it appears.
      setPhase((previous) => nextMarkerPhase(previous));
    };

    measure();

    if (typeof ResizeObserver !== "function") return;
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (phase !== "placed") return;
    // Deferred either way, never set straight from the effect body: arming
    // in the same pass that placed the marker is exactly what would let the
    // first placement animate, and a synchronous setState here also costs a
    // cascading render.
    if (typeof requestAnimationFrame === "function") {
      const frame = requestAnimationFrame(() => setPhase("armed"));
      return () => cancelAnimationFrame(frame);
    }
    const timer = setTimeout(() => setPhase("armed"), 0);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div
      className="press-tabs"
      data-page-entrance=""
      {...{ [SCROLL_REVEAL_SCOPE_ATTRIBUTE]: "" }}
    >
      <nav
        aria-label="Press sections"
        className="press-tabs__nav"
        data-marker={phase}
        ref={navRef}
      >
        {PRESS_TABS.map((tab) => (
          <Link
            aria-current={tab.href === active.href ? "page" : undefined}
            href={tab.href}
            key={tab.href}
          >
            {tab.label}
          </Link>
        ))}
        {/* Rendered only once measured. Before that the per-link underline in
            the stylesheet is what marks the active tab, so a reader without
            scripting is never left looking at an unmarked nav. */}
        {marker ? (
          <span
            aria-hidden="true"
            className="press-tabs__marker"
            style={tabMarkerStyle(marker) as React.CSSProperties}
          />
        ) : null}
      </nav>
      {/* Keyed on the active tab so switching tabs replaces this element
          rather than reconciling into it, which is what makes the entrance
          animation replay on every change instead of only on first load. */}
      <div className="press-tabs__panel" key={active.href}>
        {children}
      </div>
    </div>
  );
}
