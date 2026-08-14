import { z } from "zod";

export function parsePressAlertEmail(input: unknown) {
  const result = z
    .string({ error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Email must be valid")
    .safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0]!.message);
  }

  return result.data;
}
