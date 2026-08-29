"use client";

import { useEffect, useState, type ReactNode } from "react";

import { isMastheadScrolled } from "../../lib/masthead";

/**
 * The header is transparent over the top of the page and glassifies once the
 * page moves under it. Only this wrapper is a client component; everything
 * inside it is still rendered on the server and passed through as children.
 */
export function Masthead({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => {
      setScrolled(isMastheadScrolled(window.scrollY));
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });

    return () => window.removeEventListener("scroll", sync);
  }, []);

  return (
    <header className="masthead" data-scrolled={scrolled ? "true" : "false"}>
      {children}
    </header>
  );
}
