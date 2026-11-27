import { statusLabels, type PaintStatus } from "@/lib/miniatures";

const badgeColors: Record<PaintStatus, string> = {
  UNPAINTED: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  IN_PROGRESS: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  DONE: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
};

export function StatusBadge({ status }: { status: PaintStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColors[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
