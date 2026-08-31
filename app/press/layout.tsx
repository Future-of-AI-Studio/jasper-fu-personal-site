import type { ReactNode } from "react";

import { PressTabs } from "../../components/press/press-tabs";

/**
 * The tabs live in the layout rather than in each page so the nav is the one
 * thing a tab change does NOT replace. Only the panel beneath it swaps, which
 * is what lets the active underline travel between tabs instead of blinking
 * out on one and in on the other.
 */
export default function PressLayout({ children }: { children: ReactNode }) {
  return <PressTabs>{children}</PressTabs>;
}
