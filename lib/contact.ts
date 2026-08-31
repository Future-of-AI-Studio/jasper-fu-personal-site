import { z } from "zod";

import { identity } from "./identity";

export const MAX_CONTACT_NAME_LENGTH = 80;
export const MAX_CONTACT_ORGANIZATION_LENGTH = 120;
export const MAX_CONTACT_NOTES_LENGTH = 2_000;

export const inquiryTypes = [
  "interview",
  "comment",
  "mediaKit",
  "speaking",
  "partnership",
  "other",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

export const MEDIA_KIT_INQUIRY_TYPE = "mediaKit" satisfies InquiryType;
export const MEDIA_KIT_INQUIRY_LABEL = "Request Media Kit";

export function assertMediaKitInquiryLabel(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Request Media Kit inquiry type is required");
  }
  if (trimmed === "Download Media Kit") {
    throw new Error("Download Media Kit inquiry type is not published");
  }
  if (trimmed !== MEDIA_KIT_INQUIRY_LABEL) {
    throw new Error("Media kit inquiry type must be Request Media Kit");
  }
  return trimmed;
}

export const inquiryLabels: Record<InquiryType, string> = {
  interview: "Interview request",
  comment: "Comment request",
  mediaKit: assertMediaKitInquiryLabel(MEDIA_KIT_INQUIRY_LABEL),
  speaking: "Speaking or panel request",
  partnership: "Partnership",
  other: "Other",
};

/**
 * Which inquiry types a given form offers. A page dedicated to one kind of
 * request narrows this to that type alone, so the guard refuses a form with
 * nothing to pick and one whose default is not among its own options.
 */
export function parseInquiryTypeOptions(
  types: readonly InquiryType[],
  defaultType: InquiryType,
) {
  if (types.length === 0) {
    throw new Error("Inquiry form needs at least one inquiry type");
  }
  if (new Set(types).size !== types.length) {
    throw new Error("Inquiry types must each be unique");
  }
  if (!types.includes(defaultType)) {
    throw new Error(`${defaultType} is not among the offered inquiry types`);
  }
  return [...types];
}

export const inquiryRoutes: Record<InquiryType, string> = {
  interview: identity.pressEmail,
  comment: identity.pressEmail,
  mediaKit: identity.pressEmail,
  speaking: identity.speakingEmail,
  partnership: identity.partnershipEmail,
  other: identity.pressEmail,
};

const inquirySchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .max(MAX_CONTACT_NAME_LENGTH, "Name is too long"),
  organization: z
    .string({ error: "Organization is required" })
    .trim()
    .min(1, "Organization is required")
    .max(MAX_CONTACT_ORGANIZATION_LENGTH, "Organization is too long"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Email must be valid"),
  inquiryType: z.enum(inquiryTypes, {
    error: "Please select a valid inquiry type",
  }),
  notes: z
    .string({ error: "Notes are required" })
    .trim()
    .min(1, "Notes are required")
    .max(MAX_CONTACT_NOTES_LENGTH, "Notes are too long"),
  deadline: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});

export type InquirySubmission = z.infer<typeof inquirySchema> & {
  routeTo: string;
};

export function routeInquiry(inquiryType: InquiryType) {
  return inquiryRoutes[inquiryType];
}

export function parseInquirySubmission(
  input: unknown,
): InquirySubmission {
  const result = inquirySchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0]!.message);
  }

  const data = result.data;

  return {
    ...data,
    routeTo: routeInquiry(data.inquiryType),
  };
}

export function createMailto(submission: InquirySubmission) {
  const subject = encodeURIComponent(
    `${inquiryLabels[submission.inquiryType]}: ${submission.organization}`,
  );
  const body = encodeURIComponent(
    [
      `Name: ${submission.name}`,
      `Organization: ${submission.organization}`,
      `Email: ${submission.email}`,
      `Type: ${inquiryLabels[submission.inquiryType]}`,
      submission.deadline ? `Deadline: ${submission.deadline}` : null,
      "",
      submission.notes,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return `mailto:${submission.routeTo}?subject=${subject}&body=${body}`;
}

/**
 * The routing lines on /contact, and which inquiry types each one serves.
 *
 * The page shows only the line the reader's selected type actually routes
 * to, so the address on screen is the address their request will go to.
 */
export const inquiryRouteGroups = [
  {
    label: "Interview and comment requests",
    email: identity.pressEmail,
    types: ["interview", "comment", "mediaKit", "other"],
  },
  {
    label: "Speaking and panel requests",
    email: identity.speakingEmail,
    types: ["speaking"],
  },
  {
    label: "Partnership and business",
    email: identity.partnershipEmail,
    types: ["partnership"],
  },
] as const satisfies readonly {
  label: string;
  email: string;
  types: readonly InquiryType[];
}[];

export type InquiryRouteGroup = {
  label: string;
  email: string;
  types: readonly InquiryType[];
};

/**
 * Every type lands in exactly one group, and each group's address matches
 * what routeInquiry would actually use. Without this the page could show a
 * reader one inbox while the mailto went to another.
 */
export function assertInquiryRouteGroups(
  groups: readonly InquiryRouteGroup[] = inquiryRouteGroups,
) {
  if (groups.length === 0) {
    throw new Error("Inquiry route groups are required");
  }

  const seen = new Set<InquiryType>();
  for (const group of groups) {
    if (!group.label.trim()) {
      throw new Error("Inquiry route group label is required");
    }
    if (group.types.length === 0) {
      throw new Error(`${group.label} routes no inquiry types`);
    }
    for (const type of group.types) {
      if (seen.has(type)) {
        throw new Error(`${type} is routed by more than one group`);
      }
      seen.add(type);
      if (group.email !== inquiryRoutes[type]) {
        throw new Error(`${type} is shown routing to the wrong inbox`);
      }
    }
  }

  const missing = inquiryTypes.filter((type) => !seen.has(type));
  if (missing.length > 0) {
    throw new Error(`${missing[0]} is routed by no group`);
  }

  return groups;
}

/** The one routing line to show for a selected type. */
export function routeGroupFor(inquiryType: InquiryType): InquiryRouteGroup {
  const match = inquiryRouteGroups.find((group) =>
    (group.types as readonly InquiryType[]).includes(inquiryType),
  );
  if (!match) {
    throw new Error(`${inquiryType} is routed by no group`);
  }
  return match;
}

/**
 * Which inquiry types offer a Calendly link.
 *
 * Calendly books a conversation. A media kit request is a file to send, and
 * "Other" is too vague to put a call in front of, so neither gets one.
 */
export const SCHEDULING_INQUIRY_TYPES = [
  "interview",
  "comment",
  "speaking",
  "partnership",
] as const satisfies readonly InquiryType[];

export function inquiryNeedsScheduling(inquiryType: InquiryType): boolean {
  return (SCHEDULING_INQUIRY_TYPES as readonly InquiryType[]).includes(
    inquiryType,
  );
}

export type InquiryDraft = {
  name: string;
  organization: string;
  email: string;
  inquiryType: string;
  notes: string;
  deadline: string;
};

export const EMPTY_INQUIRY_DRAFT: InquiryDraft = {
  name: "",
  organization: "",
  email: "",
  inquiryType: "interview",
  notes: "",
  deadline: "",
};

export type InquiryField = keyof InquiryDraft;

/**
 * Per-field messages from the same schema the submit path uses, so what the
 * form says while you type cannot drift from what it says when you send.
 * First issue per field only, matching parseInquirySubmission.
 */
export function inquiryFieldErrors(
  draft: InquiryDraft,
): Partial<Record<InquiryField, string>> {
  const result = inquirySchema.safeParse(draft);
  if (result.success) {
    return {};
  }

  const errors: Partial<Record<InquiryField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field as InquiryField] = issue.message;
    }
  }
  return errors;
}

/** Whether the draft would survive parseInquirySubmission. */
export function isInquiryReady(draft: InquiryDraft): boolean {
  return inquirySchema.safeParse(draft).success;
}

/** Required fields, in the order they appear in the form. */
export const REQUIRED_INQUIRY_FIELDS = [
  "name",
  "organization",
  "email",
  "notes",
] as const satisfies readonly InquiryField[];
