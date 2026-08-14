import Link from "next/link";
import type { ReactNode } from "react";

import { identity } from "../../lib/identity";
import {
  HEADER_CTA,
  assertHeaderCta,
  footerLegalNavigation,
  parseNavigationItems,
  primaryNavigation,
} from "../../lib/navigation";
import { CoinsubTextLink, JasperSeal, LinkedInTextLink, TitleWithCoinsub, Wordmark } from "./brand";
import { MotionRoot } from "./motion-root";
import { NetworkField } from "./network-field";

const navigation = parseNavigationItems(primaryNavigation);
const headerCta = assertHeaderCta(HEADER_CTA);

export function SiteHeader() {
  return (
    <header className="masthead">
      <div className="masthead__inner">
        <Wordmark />
        <p className="masthead__descriptor">
          <TitleWithCoinsub />
        </p>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="button-link header-cta" href={headerCta.href}>
          {headerCta.label}
        </Link>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav className="mobile-menu__panel" aria-label="Mobile navigation">
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
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
      <div className="site-footer__rule" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <JasperSeal size={44} />
          <p className="site-footer__mark">Jasper Fu</p>
        </div>
        <nav aria-label="Legal">
          <ul className="footer-nav">
            {footerLegalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-footer__utility">
          <CoinsubTextLink />
          <LinkedInTextLink />
          <a href={`mailto:${identity.pressEmail}`}>{identity.pressEmail}</a>
          <span>© 2026 Jasper Fu</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <NetworkField />
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
