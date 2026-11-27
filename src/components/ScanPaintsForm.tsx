"use client";

import { startTransition, useActionState, useRef, useState, useTransition, type FormEvent } from "react";
import { addPaints, scanPaintPhoto } from "@/app/paints/actions";
import { PaintSwatch } from "@/components/PaintSwatch";
import { getPaint } from "@/lib/paints";
import { resizeImage } from "@/lib/resize-image";
import { buttonPrimary, card, errorText, input, label, mutedText } from "@/lib/ui";

// Step 1: upload a photo of your paints and let AI read the labels.
// Step 2: tick the suggestions you want to keep, then add them.
export function ScanPaintsForm({ ownedIds, aiLeft }: { ownedIds: string[]; aiLeft: number }) {
  const [scan, scanAction, scanning] = useActionState(scanPaintPhoto, null);
  const [added, addAction, adding] = useActionState(addPaints, null);
  const [preparing, startPreparing] = useTransition();
  const [hasFile, setHasFile] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const owned = new Set(ownedIds);

  function handleScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (!file) return;

    startPreparing(async () => {
      const photo = await resizeImage(file);
      const formData = new FormData();
      formData.set("photo", photo);
      startTransition(() => scanAction(formData));
    });
  }

  const busy = preparing || scanning;
  const suggestions = scan?.status === "ok" ? scan.suggestions : [];
  const newSuggestions = suggestions.filter((match) => !owned.has(match.paintId));

  return (
    <div className={`${card} space-y-4`}>
      <div>
        <h2 className="text-lg font-semibold">Scan your paints</h2>
        <p className={`mt-1 text-sm ${mutedText}`}>
          Take a photo of your paint rack with the labels facing the camera, and AI will suggest
          which paints you have. You choose what gets added.
        </p>
      </div>

      <form onSubmit={handleScan} className="space-y-3">
        <label className="block">
          <span className={label}>Photo of your paints</span>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setHasFile(Boolean(event.currentTarget.files?.length))}
            className={`${input} file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1 file:text-sm file:font-medium dark:file:bg-neutral-800 dark:file:text-neutral-100`}
          />
        </label>
        {aiLeft > 0 ?
          <button type="submit" disabled={busy || !hasFile} className={buttonPrimary}>
            {preparing ? "Preparing photo..." : scanning ? "Reading the labels..." : "Scan paints"}
          </button>
        : <p className={`text-sm ${mutedText}`}>You&apos;ve used all your AI requests for today.</p>}
      </form>

      <div aria-live="polite" className="space-y-3">
        {scan?.status === "error" && (
          <p role="alert" className={errorText}>
            {scan.error}
          </p>
        )}

        {scan?.status === "ok" && (
          <>
            {scan.model === "mock" && (
              <p className={`text-xs ${mutedText}`}>Example answer – no AI was called</p>
            )}
            {newSuggestions.length === 0 ?
              <p className="text-sm">
                {suggestions.length > 0 ?
                  "You already own every paint the AI found."
                : "The AI couldn't recognise any paints. Try a closer photo with the labels in focus."}
              </p>
            : <form action={addAction} className="space-y-3">
                <fieldset>
                  <legend className="text-sm font-medium">Found {newSuggestions.length} new paints</legend>
                  <ul className="mt-2 space-y-1">
                    {newSuggestions.map((match) => {
                      const paint = getPaint(match.paintId)!;
                      return (
                        <li key={paint.id}>
                          <label className="flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                            <input
                              type="checkbox"
                              name="paintId"
                              value={paint.id}
                              defaultChecked={match.confidence === "high"}
                              className="size-4 accent-amber-500"
                            />
                            <PaintSwatch paint={paint} size="sm" />
                            <span className="flex-1 text-sm">
                              {paint.name} <span className={mutedText}>· {paint.brand}</span>
                            </span>
                            {match.confidence === "low" && (
                              <span className={`text-xs ${mutedText}`}>Not sure</span>
                            )}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
                <button type="submit" disabled={adding} className={buttonPrimary}>
                  {adding ? "Adding..." : "Add selected paints"}
                </button>
              </form>
            }
            {scan.unrecognised.length > 0 && (
              <p className={`text-xs ${mutedText}`}>
                Also seen, but not in our paint list: {scan.unrecognised.join(", ")}
              </p>
            )}
          </>
        )}

        {added && (
          <p className="text-sm text-green-700 dark:text-green-400">
            Added {added.added} {added.added === 1 ? "paint" : "paints"}.
          </p>
        )}
      </div>
    </div>
  );
}
