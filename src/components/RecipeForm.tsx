"use client";

import { useActionState, useId } from "react";
import { createRecipe } from "@/app/recipes/actions";
import { catalog } from "@/lib/catalog";
import { brands } from "@/lib/paints";
import { buttonPrimary, card, errorText, input, label, mutedText } from "@/lib/ui";

// Unique names from the miniature list, as suggestions for the subject field
const suggestions = [...new Set(catalog.map((entry) => entry.name))].sort((a, b) => a.localeCompare(b));

type Props = {
  aiLeft: number;
  ownedCount: number;
  miniature?: { id: string; name: string };
};

export function RecipeForm({ aiLeft, ownedCount, miniature }: Props) {
  const [state, formAction, pending] = useActionState(createRecipe, null);
  const values = state?.status === "error" ? state.values : undefined;
  const listId = useId();

  return (
    <form action={formAction} className={`${card} space-y-4`}>
      <div>
        <h2 className="text-lg font-semibold">New painting recipe</h2>
        <p className={`mt-1 text-sm ${mutedText}`}>
          {ownedCount > 0 ?
            `The recipe uses your ${ownedCount} paints first, and tells you what's missing.`
          : "Tip: add your paints first, and the recipe will use them and tell you what's missing."}
        </p>
      </div>

      {miniature && <input type="hidden" name="miniatureId" value={miniature.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>What are you painting?</span>
          <input
            name="subject"
            required
            maxLength={100}
            list={listId}
            placeholder="e.g. Abaddon the Despoiler"
            defaultValue={values?.subject ?? miniature?.name}
            className={input}
          />
          <datalist id={listId}>
            {suggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>
        <label className="block">
          <span className={label}>Brand for paints you need</span>
          <select name="brand" defaultValue="any" className={input}>
            <option value="any">Any brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className={label}>
          Look you want <span className={`font-normal ${mutedText}`}>(optional)</span>
        </span>
        <input
          name="style"
          maxLength={200}
          placeholder="e.g. classic Black Legion, or a grimdark weathered look"
          defaultValue={values?.style}
          className={input}
        />
      </label>

      <div aria-live="polite">
        {state?.status === "error" && (
          <p role="alert" className={errorText}>
            {state.error}
          </p>
        )}
        {pending && (
          <p className={`text-sm ${mutedText}`}>Planning your scheme – this usually takes 20–40 seconds.</p>
        )}
      </div>

      {aiLeft > 0 ?
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Writing your recipe..." : "Create recipe"}
        </button>
      : <p className={`text-sm ${mutedText}`}>You&apos;ve used all your AI requests for today.</p>}
    </form>
  );
}
