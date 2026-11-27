// Shared Tailwind classes, so buttons, inputs and cards look the same everywhere.
// Every interactive element has a visible focus ring for keyboard users.

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950";

const buttonBase = `inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const buttonPrimary = `${buttonBase} bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:text-neutral-950 dark:hover:bg-amber-400`;

export const buttonSecondary = `${buttonBase} border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800`;

export const link = `rounded font-medium text-amber-700 underline-offset-4 hover:underline dark:text-amber-400 ${focusRing}`;

export const input = `w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:[color-scheme:dark] ${focusRing}`;

export const label = "mb-1 block text-sm font-medium";

export const card =
  "rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900";

export const mutedText = "text-neutral-600 dark:text-neutral-400";

export const errorText = "text-sm text-red-700 dark:text-red-400";
