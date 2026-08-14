import Link from "next/link";
import type { ReactNode } from "react";

import {
  parseNavigationItems,
  primaryNavigation,
} from "../lib/navigation";

import { MotionRoot } from "./motion-root";

const navigation = parseNavigationItems(primaryNavigation);

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="wordmark" href="/" aria-label="Graffiti Creative Group">
          Graffiti
        </Link>
        <p className="site-header__descriptor">Independent creative PR</p>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav className="mobile-menu__panel" aria-label="Mobile navigation">
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/auth">Client portal</Link>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__eyebrow">Have a story worth moving?</p>
        <p className="site-footer__headline">Make the market pay attention.</p>
        <div className="site-footer__meta">
          <nav aria-label="Footer navigation">
            <ul className="footer-nav">
              {navigation.slice(1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/auth">Client portal</Link>
              </li>
            </ul>
          </nav>
          <div className="site-footer__legal">
            <span>© 2026 Graffiti Creative Group</span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main className="site-main" id="main-content">
        {children}
      </main>
      <SiteFooter />
      <MotionRoot />
    </>
  );
}
