// Runs in the browser. Phone photos are often 5–10 MB, more than a request may
// carry and far more than needed to judge a paint job. Shrinking them first
// makes uploads fast and keeps them under the server's 4 MB limit.

const MAX_SIDE = 2000; // pixels on the longest side
const QUALITY = 0.85;

export async function resizeImage(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // The browser can't read it (for example HEIC on some systems).
    // Send it as it is and let the server explain what's wrong.
    return file;
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );

  // Keep the original if converting failed or didn't make it smaller
  if (!blob || blob.size >= file.size) {
    return file;
  }

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}
