"use client";

import { updateMiniatureStatus } from "@/app/collection/actions";
import { paintStatuses, statusLabels, type PaintStatus } from "@/lib/miniatures";
import { input } from "@/lib/ui";

type Props = { id: string; name: string; status: PaintStatus };

// Saves as soon as a new status is picked, so there is no extra button to press
export function StatusSelect({ id, name, status }: Props) {
  return (
    <form action={updateMiniatureStatus}>
      <input type="hidden" name="id" value={id} />
      {/* React resets a form after its action has run, which would put the
          select back on the status it started with. A new key per status
          makes React create a fresh select that starts on the saved one. */}
      <select
        key={status}
        name="status"
        defaultValue={status}
        aria-label={`Status for ${name}`}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className={`${input} w-auto py-1.5`}>
        {paintStatuses.map((value) => (
          <option key={value} value={value}>
            {statusLabels[value]}
          </option>
        ))}
      </select>
    </form>
  );
}
