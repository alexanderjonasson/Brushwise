"use client";

import { useState } from "react";
import { PaintSwatch } from "@/components/PaintSwatch";
import { brands, type Brand } from "@/lib/paints";
import type { RecipeStepView } from "@/lib/recipes";
import { card, mutedText } from "@/lib/ui";

type View = "suggested" | Brand;

// The recipe's steps, with a switch to see the closest paint from each brand
export function RecipeSteps({ steps }: { steps: RecipeStepView[] }) {
  const [view, setView] = useState<View>("suggested");

  return (
    <section aria-labelledby="steps-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="steps-heading" className="text-xl font-semibold">
          Steps
        </h2>
        <div role="radiogroup" aria-label="Show paints from" className="flex flex-wrap gap-1">
          {(["suggested", ...brands] as View[]).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={view === option}
              onClick={() => setView(option)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                view === option ?
                  "bg-amber-500 text-neutral-950"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}>
              {option === "suggested" ? "As suggested" : option}
            </button>
          ))}
        </div>
      </div>
      {view !== "suggested" && (
        <p className={`mt-2 text-xs ${mutedText}`}>
          The closest {view} paint by colour and type. Matches are approximate.
        </p>
      )}

      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const paint = view === "suggested" ? step.paint : step.alternatives[view];
          return (
            <li key={index} className={`${card} flex gap-4 p-4`}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold dark:bg-neutral-800">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold tracking-wide uppercase ${mutedText}`}>
                  {step.area} · {step.stage}
                </p>
                {paint ?
                  <p className="mt-1 flex items-center gap-2 font-medium">
                    <PaintSwatch paint={paint} size="sm" />
                    {paint.name}
                    <span className={`text-sm font-normal ${mutedText}`}>{paint.brand}</span>
                  </p>
                : <p className={`mt-1 text-sm ${mutedText}`}>No close match from {view}</p>}
                <p className="mt-1 text-sm">{step.instruction}</p>
                {view === "suggested" && (
                  <p className="mt-2 text-xs">
                    {step.owned ?
                      <span className="text-green-700 dark:text-green-400">✓ You own this</span>
                    : <span className="text-amber-700 dark:text-amber-400">
                        You don&apos;t own this
                        {step.ownedAlternative && ` – closest you have: ${step.ownedAlternative.name}`}
                      </span>
                    }
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
