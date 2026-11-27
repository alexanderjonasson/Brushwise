"use client";

import { useActionState } from "react";
import { createMiniature } from "@/app/collection/actions";
import { NameAndFactionFields } from "@/components/NameAndFactionFields";
import { buttonPrimary, card, errorText, input, label, mutedText } from "@/lib/ui";

export function AddMiniatureForm() {
  const [state, formAction, pending] = useActionState(createMiniature, null);
  const values = state?.status === "error" ? state.values : undefined;

  return (
    <form action={formAction} className={`${card} space-y-4`}>
      <h2 className="text-lg font-semibold">Add a miniature</h2>

      {/* A new key after each result gives fresh fields: empty after a
          successful add, or the typed values again after an error */}
      <NameAndFactionFields
        key={state?.status === "success" ? state.submittedAt : "form"}
        defaultName={values?.name}
        defaultFaction={values?.faction}
      />

      <label className="block">
        <span className={label}>
          Notes <span className={`font-normal ${mutedText}`}>(optional)</span>
        </span>
        <textarea
          name="notes"
          rows={2}
          maxLength={500}
          placeholder="Colour scheme, kit, anything you want to remember"
          defaultValue={values?.notes}
          className={input}
        />
      </label>

      {/* aria-live so screen readers hear the result without moving focus */}
      <div aria-live="polite">
        {state?.status === "error" && (
          <p role="alert" className={errorText}>
            {state.error}
          </p>
        )}
        {state?.status === "success" && (
          <p className="text-sm text-green-700 dark:text-green-400">
            Added {state.addedName} to your collection.
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Adding..." : "Add miniature"}
      </button>
    </form>
  );
}
