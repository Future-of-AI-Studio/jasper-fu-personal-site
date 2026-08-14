export const LEGAL_UPDATED = "August 14, 2026";
export const INSERT_DATE_PLACEHOLDER = "[Insert date]";
export const LEGAL_CONTACT_EMAIL = "info@jasperfu.io";
export const LEGAL_SITE_HOST = "jasperfu.com";
export const RETIRED_LEGAL_DRAFT_NOTICE =
  "Draft for professional legal review before production launch.";

export function assertLegalDraftNoticeOmitted(value: string) {
  const trimmed = value.trim();
  if (trimmed === RETIRED_LEGAL_DRAFT_NOTICE) {
    throw new Error("Draft legal review notice is not published");
  }
  if (trimmed) {
    throw new Error("Legal draft notice must be omitted");
  }
  return trimmed;
}

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: readonly string[] };

export type LegalCopySection = {
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  closing?: readonly string[];
  blocks?: readonly LegalBlock[];
};

export function assertLegalUpdated(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Legal updated date is required");
  }
  if (trimmed.includes("Insert date")) {
    throw new Error("Insert date placeholder is not published");
  }
  if (trimmed !== LEGAL_UPDATED) {
    throw new Error("Legal updated date must be August 14, 2026");
  }
  return trimmed;
}

function sectionBody(section: LegalCopySection) {
  const fromBlocks =
    section.blocks?.flatMap((block) =>
      block.type === "paragraph" ? [block.text] : [...block.items],
    ) ?? [];
  return [
    ...(section.paragraphs ?? []),
    ...(section.bullets ?? []),
    ...(section.closing ?? []),
    ...fromBlocks,
  ].join(" ");
}

export function assertLegalSections(sections: readonly LegalCopySection[]) {
  if (sections.length === 0) {
    throw new Error("Legal sections are required");
  }

  return sections.map((section, index) => {
    const title = section.title.trim();
    if (!title) {
      throw new Error(`Legal section ${index + 1} requires a title`);
    }

    const body = sectionBody(section);
    if (!body.trim()) {
      throw new Error(`Legal section ${index + 1} requires copy`);
    }
    if (body.includes(INSERT_DATE_PLACEHOLDER) || body.includes("[Insert date]")) {
      throw new Error("Insert date placeholder is not published");
    }
    if (body.includes("[Counsel")) {
      throw new Error("Counsel placeholder is not published");
    }

    return section;
  });
}
