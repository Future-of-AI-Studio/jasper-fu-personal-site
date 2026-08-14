import Link from "next/link";
import type { ReactNode } from "react";

export function PressTabs({
  active,
  children,
}: {
  active: "releases" | "coverage";
  children: ReactNode;
}) {
  return (
    <div className="press-tabs">
      <nav aria-label="Press sections" className="press-tabs__nav">
        <Link
          aria-current={active === "releases" ? "page" : undefined}
          href="/press"
        >
          Press Releases
        </Link>
        <Link
          aria-current={active === "coverage" ? "page" : undefined}
          href="/press/media-coverage"
        >
          Media Coverage and Interviews
        </Link>
      </nav>
      {children}
    </div>
  );
}
