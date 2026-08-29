import Link from "next/link";

import {
  assertSealSrc,
  PUBLISHED_SEAL_SRC,
} from "../../lib/brand-mark";
import {
  assertCoinsubUrl,
  assertLinkedInUrl,
  assertLogoPublishable,
  identity,
  splitTitleForCoinsub,
} from "../../lib/identity";

export function JasperSeal({
  className = "jasper-seal",
  size = 56,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      alt={identity.name}
      className={className}
      height={size}
      src={assertSealSrc(PUBLISHED_SEAL_SRC)}
      width={size}
    />
  );
}

export function CoinsubTextLink({
  children = "Coinsub",
}: {
  children?: string;
}) {
  return (
    <a
      href={assertCoinsubUrl(identity.coinsubUrl)}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export function LinkedInTextLink() {
  return (
    <a
      href={assertLinkedInUrl(identity.linkedInUrl)}
      rel="noreferrer"
      target="_blank"
    >
      LinkedIn
    </a>
  );
}

export function TitleWithCoinsub() {
  const parts = splitTitleForCoinsub(identity.title);
  return (
    <>
      {parts.prefix}
      <CoinsubTextLink>{parts.name}</CoinsubTextLink>
    </>
  );
}

export function CoinsubMark({
  className = "coinsub-mark",
  linked = true,
}: {
  className?: string;
  linked?: boolean;
}) {
  const name = assertLogoPublishable("Coinsub");
  const image = (
    <img
      alt={name}
      className={className}
      height={40}
      src="/logos/coinsub-logo.svg"
      width={226}
    />
  );

  if (!linked) {
    return image;
  }

  return (
    <a className="coinsub-mark-link" href={assertCoinsubUrl(identity.coinsubUrl)}>
      {image}
    </a>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <Link className="wordmark__home" href="/" aria-label={identity.name}>
        <JasperSeal />
      </Link>
    </span>
  );
}
