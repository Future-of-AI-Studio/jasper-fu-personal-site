import type { ReactNode } from "react";

/**
 * The eyebrow is optional. Every public page used to carry one naming the
 * page it was already on, above a heading that said much the same thing, so
 * they were retired. Omitting it is the normal case; an empty string is not,
 * and still fails, because that is a mistake rather than a decision.
 */
export function assertPageHead(input: { eyebrow?: string; title: string }) {
  const title = input.title.trim();

  if (!title) {
    throw new Error("Page head title is required");
  }

  if (input.eyebrow === undefined) {
    return { title };
  }

  const eyebrow = input.eyebrow.trim();
  if (!eyebrow) {
    throw new Error("Page head eyebrow cannot be empty");
  }

  return { eyebrow, title };
}

export function PageHead({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  const head = assertPageHead({ eyebrow, title });

  return (
    <header className="page-head">
      {head.eyebrow ? <p className="eyebrow">{head.eyebrow}</p> : null}
      <h1>{head.title}</h1>
      {lede ? <p className="page-head__lede">{lede}</p> : null}
      {children}
    </header>
  );
}
