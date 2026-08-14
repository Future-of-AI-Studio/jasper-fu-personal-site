export const PRESS_THUMBNAIL_PREFIX = "/press/";
export const PRESS_THUMB_WIDTH = 720;
export const PRESS_THUMB_HEIGHT = 405;

export function assertPressThumbnail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Press thumbnail source is required");
  }

  if (trimmed.includes("placeholder")) {
    throw new Error("Placeholder press thumbnail is not published");
  }

  if (!trimmed.startsWith(PRESS_THUMBNAIL_PREFIX)) {
    throw new Error("Press thumbnail must be a local /press/ asset");
  }

  return trimmed;
}
