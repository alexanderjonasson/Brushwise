"use client";

import { useActionState } from "react";
import { requestFeedback } from "@/app/collection/[id]/actions";
import { buttonPrimary, errorText, mutedText } from "@/lib/ui";

export function RequestFeedbackButton({ photoId }: { photoId: string }) {
  const [state, formAction, pending] = useActionState(requestFeedback, null);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="photoId" value={photoId} />
      <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
        {pending ? "Looking at your paint job..." : "Get AI feedback"}
      </button>
      <div aria-live="polite">
        {pending && (
          <p className={`text-center text-xs ${mutedText}`}>This usually takes 10–30 seconds.</p>
        )}
        {state?.status === "error" && (
          <p role="alert" className={errorText}>
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
