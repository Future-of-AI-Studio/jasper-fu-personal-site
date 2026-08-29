import Link from "next/link";
import type { ReactNode } from "react";

import { CONTACT_CTA, assertContactCta } from "../../lib/copy";
import { identity } from "../../lib/identity";
import {
  HEADER_CTA,
  assertHeaderCta,
  footerLegalNavigation,
  parseNavigationItems,
  primaryNavigation,
} from "../../lib/navigation";
import { CoinsubTextLink, JasperSeal, LinkedInTextLink, Wordmark } from "./brand";
import { Masthead } from "./masthead";
import { MotionRoot } from "./motion-root";
import { NavigationList } from "./primary-nav";

const navigation = parseNavigationItems(primaryNavigation);
const headerCta = assertHeaderCta(HEADER_CTA);

export function SiteHeader() {
  return (
    <Masthead>
      <div className="masthead__inner">
        <Wordmark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavigationList items={navigation} />
        </nav>
        <Link className="button-link header-cta" href={headerCta.href}>
          {headerCta.label}
        </Link>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav className="mobile-menu__panel" aria-label="Mobile navigation">
            <NavigationList items={navigation} />
          </nav>
        </details>
      </div>
    </Masthead>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__rule" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__grid">
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
          <div className="site-footer__contact">
            <p className="eyebrow">Press</p>
            <h2>Get in touch</h2>
            <p>
              Working on a story about stablecoin infrastructure, programmable
              money, or payments orchestration?
            </p>
            <Link className="button-link button-link--ghost" href="/contact">
              {assertContactCta(CONTACT_CTA)}
            </Link>
          </div>
        </div>
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
