export const mediaKitCopyBlocks = [
  { id: "bio-50", label: "50-word bio", valueKey: "words50" as const },
  { id: "bio-150", label: "150-word bio", valueKey: "words150" as const },
  { id: "bio-250", label: "250-word bio", valueKey: "words250" as const },
  {
    id: "boilerplate",
    label: "Company boilerplate",
    valueKey: "boilerplate" as const,
  },
  { id: "thesis", label: "One-line thesis", valueKey: "thesis" as const },
  {
    id: "one-liner",
    label: "Identity one-liner",
    valueKey: "lockedOneLiner" as const,
  },
] as const;

export const pendingAssets = [
  { id: "headshot-color", label: "Formal headshot, color", kind: "photo" },
  { id: "headshot-bw", label: "Editorial headshot, black and white", kind: "photo" },
  { id: "panel", label: "On-stage panel shot", kind: "photo" },
  { id: "nyse", label: "NYSE / Jane King still", kind: "photo" },
  { id: "coinsub-logo", label: "Coinsub logo, SVG and PNG", kind: "logo" },
] as const;

export const MEDIA_KIT_SPEAKING_PHOTO = "/media-kit/jasper-fu-speaking.jpg";

export function assertMediaKitPhoto(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Media kit photo source is required");
  }

  if (trimmed.includes("placeholder")) {
    throw new Error("Placeholder media kit photo is not published");
  }

  if (trimmed !== MEDIA_KIT_SPEAKING_PHOTO) {
    throw new Error(`${trimmed} is not the published media kit photo`);
  }

  return trimmed;
}

export function copyTextToClipboard(
  writeText: (value: string) => Promise<void>,
  value: string,
) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("There is no approved copy to clipboard");
  }

  return writeText(trimmed);
}
