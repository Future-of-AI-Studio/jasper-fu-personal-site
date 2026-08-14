export const PUBLISHED_MONOGRAM = "JF.";
export const PUBLISHED_SEAL_SRC = "/media-kit/jasper-fu-seal.png";

export function assertMonogram(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Monogram is required");
  }

  if (trimmed === "YN.") {
    throw new Error("Placeholder monogram YN. is not published");
  }

  if (trimmed !== PUBLISHED_MONOGRAM) {
    throw new Error(`${trimmed} is not the published monogram`);
  }

  return trimmed;
}

export function assertSealSrc(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Seal source is required");
  }

  if (trimmed.includes("YN")) {
    throw new Error("Placeholder seal YN is not published");
  }

  if (trimmed !== PUBLISHED_SEAL_SRC) {
    throw new Error(`${trimmed} is not the published seal`);
  }

  return trimmed;
}
