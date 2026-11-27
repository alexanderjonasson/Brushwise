"use client";

import { useState } from "react";
import { addPaint } from "@/app/paints/actions";
import { PaintSwatch } from "@/components/PaintSwatch";
import { brands, searchPaints, type Brand } from "@/lib/paints";
import { buttonSecondary, card, input, label, mutedText } from "@/lib/ui";

// Search the paint list and add paints one at a time
export function PaintSearch({ ownedIds }: { ownedIds: string[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<Brand | "">("");
  const owned = new Set(ownedIds);
  const results = searchPaints(query, brand || undefined, 10);

  return (
    <div className={`${card} space-y-4`}>
      <h2 className="text-lg font-semibold">Add paints</h2>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className={label}>Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Nuln Oil, gold, vallejo red"
            className={input}
          />
        </label>
        <label className="block">
          <span className={label}>Brand</span>
          <select
            value={brand}
            onChange={(event) => setBrand(event.target.value as Brand | "")}
            className={`${input} sm:w-48`}>
            <option value="">All brands</option>
            {brands.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {query.trim() !== "" && (
        <div aria-live="polite">
          {results.length === 0 ?
            <p className={`text-sm ${mutedText}`}>No paints match &quot;{query}&quot;.</p>
          : <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {results.map((paint) => (
                <li key={paint.id} className="flex items-center gap-3 py-2">
                  <PaintSwatch paint={paint} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{paint.name}</p>
                    <p className={`text-xs ${mutedText}`}>
                      {paint.brand} · {paint.type}
                    </p>
                  </div>
                  {owned.has(paint.id) ?
                    <span className={`text-sm ${mutedText}`}>Owned</span>
                  : <form action={addPaint}>
                      <input type="hidden" name="paintId" value={paint.id} />
                      <button
                        type="submit"
                        aria-label={`Add ${paint.brand} ${paint.name}`}
                        className={`${buttonSecondary} py-1.5`}>
                        Add
                      </button>
                    </form>
                  }
                </li>
              ))}
            </ul>
          }
        </div>
      )}
    </div>
  );
}
