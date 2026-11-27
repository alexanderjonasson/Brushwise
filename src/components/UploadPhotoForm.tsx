"use client";

import {
  startTransition,
  useActionState,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { uploadPhoto } from "@/app/collection/[id]/actions";
import { resizeImage } from "@/lib/resize-image";
import { buttonPrimary, card, errorText, input, label, mutedText } from "@/lib/ui";

export function UploadPhotoForm({ miniatureId }: { miniatureId: string }) {
  const [state, formAction, uploading] = useActionState(uploadPhoto, null);
  const [preparing, startPreparing] = useTransition();
  const [hasFile, setHasFile] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const pending = preparing || uploading;

  // The photo is shrunk in the browser before it is sent, so the default form
  // submit is replaced: build the form data ourselves and call the action.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (!file) return;

    startPreparing(async () => {
      const photo = await resizeImage(file);
      const formData = new FormData();
      formData.set("miniatureId", miniatureId);
      formData.set("photo", photo);
      // Code after an await is no longer part of the transition, so the
      // action call gets its own one (React requires actions to run in one).
      startTransition(() => formAction(formData));

      if (fileInput.current) fileInput.current.value = "";
      setHasFile(false);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={`${card} space-y-4`}>
      <h2 className="text-lg font-semibold">Add a photo</h2>

      <label className="block">
        <span className={label}>Photo</span>
        <input
          ref={fileInput}
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          required
          onChange={(event) => setHasFile(Boolean(event.currentTarget.files?.length))}
          aria-describedby="photo-hint"
          className={`${input} file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1 file:text-sm file:font-medium dark:file:bg-neutral-800 dark:file:text-neutral-100`}
        />
        <span id="photo-hint" className={`mt-1 block text-xs ${mutedText}`}>
          JPEG, PNG or WebP. Large photos are shrunk before upload.
        </span>
      </label>

      <div aria-live="polite">
        {state?.status === "error" && (
          <p role="alert" className={errorText}>
            {state.error}
          </p>
        )}
        {state?.status === "success" && !pending && (
          <p className="text-sm text-green-700 dark:text-green-400">Photo added.</p>
        )}
      </div>

      <button type="submit" disabled={pending || !hasFile} className={buttonPrimary}>
        {preparing ? "Preparing photo..." : uploading ? "Uploading..." : "Upload photo"}
      </button>
    </form>
  );
}
