// The rules for uploaded photos, kept free from Next.js and Blob so they can be unit tested.

// Vercel functions accept at most 4.5 MB per request. The browser shrinks
// photos before upload, so real files land far below this.
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export type PhotoType = (typeof allowedPhotoTypes)[number];

const extensions: Record<PhotoType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// The browser's file type comes from the file name and can't be trusted.
// The first bytes of an image file always look the same for each format,
// so they tell us what the file really is.
export function detectPhotoType(bytes: Uint8Array): PhotoType | null {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, index) => bytes[offset + index] === byte);

  if (startsWith([0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  // WebP: "RIFF" ....  "WEBP"
  if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) {
    return "image/webp";
  }
  return null;
}

type PhotoCheck = { success: true; type: PhotoType } | { success: false; error: string };

export function checkPhoto(file: { size: number; bytes: Uint8Array }): PhotoCheck {
  if (file.size === 0) {
    return { success: false, error: "Choose a photo to upload" };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { success: false, error: "The photo can be at most 4 MB" };
  }

  const type = detectPhotoType(file.bytes);
  if (!type) {
    return { success: false, error: "The photo must be a JPEG, PNG or WebP image" };
  }

  return { success: true, type };
}

// Where the file is stored in Blob. Grouped by miniature; Blob adds a random
// suffix so the address can't be guessed and two uploads never collide.
export function photoPathname(miniatureId: string, type: PhotoType): string {
  return `miniatures/${miniatureId}/photo.${extensions[type]}`;
}
