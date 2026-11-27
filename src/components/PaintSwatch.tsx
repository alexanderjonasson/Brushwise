import type { Paint } from "@/lib/paints";

// A round colour sample. The colour is approximate, so it is decorative:
// the paint's name is always shown next to it.
export function PaintSwatch({ paint, size = "md" }: { paint: Paint; size?: "sm" | "md" }) {
  const dimensions = size === "sm" ? "size-4" : "size-7";
  return (
    <span
      aria-hidden="true"
      className={`${dimensions} inline-block shrink-0 rounded-full border border-black/20 dark:border-white/20 ${
        paint.type === "metallic" ? "bg-gradient-to-br from-white/60 to-transparent" : ""
      }`}
      style={{ backgroundColor: paint.hex }}
    />
  );
}
