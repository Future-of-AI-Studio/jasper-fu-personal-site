import type { ReactNode } from "react";

export function assertPageHead(input: { eyebrow: string; title: string }) {
  const eyebrow = input.eyebrow.trim();
  const title = input.title.trim();

  if (!eyebrow) {
    throw new Error("Page head eyebrow is required");
  }

  if (!title) {
    throw new Error("Page head title is required");
  }

  return { eyebrow, title };
}

export function PageHead({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  const head = assertPageHead({ eyebrow, title });

  return (
    <header className="page-head">
      <p className="eyebrow">{head.eyebrow}</p>
      <h1>{head.title}</h1>
      {lede ? <p className="page-head__lede">{lede}</p> : null}
      {children}
    </header>
  );
}
