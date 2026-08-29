"use client";

import { useEffect, useRef } from "react";

import {
  assertMediaOutletMark,
  mediaBarLoopCopyIndexes,
  mediaOutlets,
} from "../../lib/identity";
import {
  computeLogoCarouselTransform,
  LOGO_CAROUSEL_MEDIA_QUERY,
  logoCarouselTransformStyle,
  resolveLogoOffsetRatio,
} from "../../lib/logo-carousel";

/**
 * Horizontal motion stays the CSS `media-bar-marquee` keyframe (see
 * .media-bar__track in app/globals.css) — this effect only reads each
 * logo's live position every frame and applies the coverflow curve from
 * lib/logo-carousel.
 *
 * It runs only while that marquee does: below the 900px breakpoint, and not
 * under prefers-reduced-motion. Above it the strip is a static row, so the
 * curve is stopped and every style it wrote is cleared — otherwise a resize
 * from phone to desktop width would strand rotated, blurred logos.
 */
function useLogoCarouselCurve(barRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    if (typeof window.matchMedia !== "function") return;
    if (typeof window.requestAnimationFrame !== "function") return;

    const query = window.matchMedia(LOGO_CAROUSEL_MEDIA_QUERY);
    const links = () =>
      bar.querySelectorAll<HTMLAnchorElement>(".media-bar__link");
    let frameId: number | undefined;

    const tick = () => {
      const barRect = bar.getBoundingClientRect();
      const containerCenterPx = barRect.left + barRect.width / 2;
      const containerHalfWidthPx = barRect.width / 2;

      links().forEach((link) => {
        const itemRect = link.getBoundingClientRect();
        const itemCenterPx = itemRect.left + itemRect.width / 2;
        const ratio = resolveLogoOffsetRatio(
          itemCenterPx,
          containerCenterPx,
          containerHalfWidthPx,
        );
        const style = logoCarouselTransformStyle(
          computeLogoCarouselTransform(ratio),
        );
        link.style.transform = style.transform;
        link.style.filter = style.filter;
        link.style.opacity = String(style.opacity);
      });

      frameId = window.requestAnimationFrame(tick);
    };

    const clearCurve = () => {
      links().forEach((link) => {
        link.style.transform = "";
        link.style.filter = "";
        link.style.opacity = "";
      });
    };

    const sync = () => {
      if (query.matches) {
        if (frameId === undefined) {
          frameId = window.requestAnimationFrame(tick);
        }
        return;
      }

      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
        frameId = undefined;
      }
      clearCurve();
    };

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [barRef]);
}

export function LogoCarousel() {
  const barRef = useRef<HTMLDivElement | null>(null);
  useLogoCarouselCurve(barRef);

  return (
    <div aria-label="Media recognition" className="media-bar" ref={barRef}>
      <div aria-hidden="true" className="media-bar__edge media-bar__edge--left" />
      <div className="media-bar__track">
        {mediaBarLoopCopyIndexes().map((copy) => (
          <div
            aria-hidden={copy > 0 ? true : undefined}
            className="media-bar__group"
            key={copy}
          >
            {mediaOutlets.map((outlet) => {
              const mark = assertMediaOutletMark(outlet);
              return (
                <a
                  className="media-bar__link"
                  href={outlet.href}
                  key={`${copy}-${mark.name}`}
                  tabIndex={copy > 0 ? -1 : undefined}
                >
                  <img
                    alt={copy === 0 ? mark.name : ""}
                    className={
                      mark.name === "CEO Magazine"
                        ? "media-bar__logo media-bar__logo--ceo"
                        : "media-bar__logo"
                    }
                    src={mark.logo}
                  />
                </a>
              );
            })}
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="media-bar__edge media-bar__edge--right" />
    </div>
  );
}
