"use client";

import { startTransition, useActionState, useRef, useState, useTransition, type FormEvent } from "react";
import { addBacklogItem, scanBoxPhoto } from "@/app/backlog/actions";
import { resizeImage } from "@/lib/resize-image";
import { buttonPrimary, buttonSecondary, card, errorText, input, label, mutedText } from "@/lib/ui";

// Add a box to the pile of shame: scan a photo and let AI fill in the form,
// or type it in by hand. Either way the user checks the details and saves.
export function BacklogForm({ aiLeft }: { aiLeft: number }) {
  const [scan, scanAction, scanning] = useActionState(scanBoxPhoto, null);
  const [saved, saveAction, saving] = useActionState(addBacklogItem, null);
  const [preparing, startPreparing] = useTransition();
  const [hasFile, setHasFile] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

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

  const scanned = scan?.status === "ok" ? scan : null;
  // After saving, the scan's details no longer apply
  const usedScan = scanned && !(saved?.status === "success" && saved.savedAt > scanned.scannedAt);
  const values =
    saved?.status === "error" ? saved.values
    : usedScan ? scanned.values
    : undefined;
  // A new key gives fresh fields after a scan, a save or an error
  const formKey =
    saved?.status === "success" && (!scanned || saved.savedAt > scanned.scannedAt) ?
      `saved-${saved.savedAt}`
    : usedScan ? `scan-${scanned.scannedAt}`
    : "empty";

  return (
    <div className={`${card} space-y-6`}>
      <h2 className="text-lg font-semibold">Add a box</h2>

      <form onSubmit={handleScan} className="space-y-3 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
        <p className="text-sm">
          <span className="font-medium">Scan the box</span>{" "}
          <span className={mutedText}>– AI reads the name and how many models it holds.</span>
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Photo of the box"
          onChange={(event) => setHasFile(Boolean(event.currentTarget.files?.length))}
          className={`${input} file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1 file:text-sm file:font-medium dark:file:bg-neutral-800 dark:file:text-neutral-100`}
        />
        {aiLeft > 0 ?
          <button type="submit" disabled={preparing || scanning || !hasFile} className={buttonSecondary}>
            {preparing ? "Preparing photo..." : scanning ? "Reading the box..." : "Scan box"}
          </button>
        : <p className={`text-sm ${mutedText}`}>You&apos;ve used all your AI requests for today.</p>}

        <div aria-live="polite">
          {scan?.status === "error" && (
            <p role="alert" className={errorText}>
              {scan.error}
            </p>
          )}
          {usedScan && (
            <p className="text-sm">
              {scanned.isBox ?
                <>
                  Filled in from the photo. Check the details below.
                  {!scanned.quantityPrinted && " The number of models is a guess – please check it."}
                </>
              : "That doesn't look like a box. Fill in the details by hand, or try another photo."}
              {scanned.model === "mock" && (
                <span className={`block text-xs ${mutedText}`}>Example answer – no AI was called</span>
              )}
            </p>
          )}
        </div>
      </form>

      <form action={saveAction} key={formKey} className="space-y-4">
        {usedScan && (
          <>
            <input type="hidden" name="photoUrl" value={scanned.photoUrl} />
            <input type="hidden" name="photoPath" value={scanned.photoPath} />
          </>
        )}
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_8rem]">
          <label className="block">
            <span className={label}>Box or kit</span>
            <input
              name="name"
              required
              maxLength={100}
              placeholder="e.g. Combat Patrol: Tyranids"
              defaultValue={values?.name}
              className={input}
            />
          </label>
          <label className="block">
            <span className={label}>
              Faction <span className={`font-normal ${mutedText}`}>(optional)</span>
            </span>
            <input name="faction" maxLength={60} defaultValue={values?.faction} className={input} />
          </label>
          <label className="block">
            <span className={label}>Models</span>
            <input
              name="quantity"
              type="number"
              required
              min={1}
              max={200}
              defaultValue={values?.quantity ?? "1"}
              className={input}
            />
          </label>
        </div>

        <div aria-live="polite">
          {saved?.status === "error" && (
            <p role="alert" className={errorText}>
              {saved.error}
            </p>
          )}
          {saved?.status === "success" && formKey.startsWith("saved") && (
            <p className="text-sm text-green-700 dark:text-green-400">Added to your pile of shame.</p>
          )}
        </div>

        <button type="submit" disabled={saving} className={buttonPrimary}>
          {saving ? "Adding..." : "Add to pile of shame"}
        </button>
      </form>
    </div>
  );
}
