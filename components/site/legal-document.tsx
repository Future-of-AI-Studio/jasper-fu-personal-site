import type { ReactNode } from "react";

import type { LegalCopySection } from "../../lib/legal/published";
import { LegalPage } from "./legal-page";

function renderLegalSection(section: LegalCopySection) {
  if (section.blocks) {
    return (
      <>
        {section.blocks.map((block, index) =>
          block.type === "paragraph" ? (
            <p key={`p-${index}`}>{block.text}</p>
          ) : (
            <ul key={`ul-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
        )}
      </>
    );
  }

  return (
    <>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.bullets ? (
        <ul>
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.closing?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}

export function LegalDocument({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: readonly LegalCopySection[];
}) {
  return (
    <LegalPage
      eyebrow={eyebrow}
      title={title}
      updated={updated}
      sections={sections.map((section) => ({
        title: section.title,
        content: renderLegalSection(section),
      }))}
    />
  );
}

export function SectionIntro({
  eyebrow,
  title,
  children,
  fullWidth = false,
}: {
  eyebrow: string;
  title?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}) {
  const heading = title?.trim();

  return (
    <header
      className={
        fullWidth ? "section-intro section-intro--full" : "section-intro"
      }
      data-reveal
    >
      <p className="eyebrow">{eyebrow}</p>
      {heading ? <h2>{heading}</h2> : null}
      {children}
    </header>
  );
}
