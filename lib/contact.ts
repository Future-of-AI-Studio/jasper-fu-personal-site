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
    `${inquiryLabels[submission.inquiryType]} — ${submission.organization}`,
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
