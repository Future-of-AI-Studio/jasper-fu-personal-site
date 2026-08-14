import type { ReactNode } from "react";

type LegalSection = {
  title: string;
  content: ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <article className="legal-page">
      <header className="legal-page__header editorial-grid">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>Last updated: {updated}</p>
      </header>
      <div className="legal-page__body">
        {sections.map((section, index) => (
          <section key={section.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{section.title}</h2>
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
