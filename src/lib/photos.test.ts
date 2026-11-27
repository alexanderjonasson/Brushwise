import { describe, expect, it } from "vitest";
import { MAX_PHOTO_BYTES, checkPhoto, detectPhotoType, photoPathname } from "./photos";

// The first bytes of each format, padded with zeros to look like a real file
const pad = (bytes: number[]) => new Uint8Array([...bytes, ...new Array(16).fill(0)]);
const jpeg = pad([0xff, 0xd8, 0xff, 0xe0]);
const png = pad([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const webp = pad([0x52, 0x49, 0x46, 0x46, 0x10, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);
const gif = pad([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
const text = new TextEncoder().encode("<script>alert(1)</script>");

describe("detectPhotoType", () => {
  it("recognises JPEG, PNG and WebP from their first bytes", () => {
    expect(detectPhotoType(jpeg)).toBe("image/jpeg");
    expect(detectPhotoType(png)).toBe("image/png");
    expect(detectPhotoType(webp)).toBe("image/webp");
  });

  it("rejects other formats and files that only pretend to be images", () => {
    expect(detectPhotoType(gif)).toBeNull();
    expect(detectPhotoType(text)).toBeNull();
    expect(detectPhotoType(new Uint8Array())).toBeNull();
  });

  it("does not take a RIFF file that isn't WebP", () => {
    const wav = pad([0x52, 0x49, 0x46, 0x46, 0x10, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45]);
    expect(detectPhotoType(wav)).toBeNull();
  });
});

describe("checkPhoto", () => {
  it("accepts a JPEG within the size limit", () => {
    expect(checkPhoto({ size: 500_000, bytes: jpeg })).toEqual({ success: true, type: "image/jpeg" });
  });

  it("asks for a photo when the file is empty", () => {
    expect(checkPhoto({ size: 0, bytes: new Uint8Array() })).toEqual({
      success: false,
      error: "Choose a photo to upload",
    });
  });

  it("rejects a photo over the size limit", () => {
    expect(checkPhoto({ size: MAX_PHOTO_BYTES + 1, bytes: jpeg })).toEqual({
      success: false,
      error: "The photo can be at most 4 MB",
    });
  });

  it("rejects a file that isn't an allowed image", () => {
    expect(checkPhoto({ size: text.length, bytes: text })).toEqual({
      success: false,
      error: "The photo must be a JPEG, PNG or WebP image",
    });
  });
});

describe("photoPathname", () => {
  it("groups photos by miniature with the right extension", () => {
    expect(photoPathname("abc123", "image/webp")).toBe("miniatures/abc123/photo.webp");
    expect(photoPathname("abc123", "image/jpeg")).toBe("miniatures/abc123/photo.jpg");
  });
});
