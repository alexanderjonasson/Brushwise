import Link from "next/link";
import { Suspense } from "react";
import { FeedbackView } from "@/components/FeedbackView";
import { getSession } from "@/lib/dal";
import { mockFeedback } from "@/lib/feedback";
import { buttonPrimary, buttonSecondary, card, link, mutedText } from "@/lib/ui";

// The first areas of the example answer are enough to show what feedback looks like
const exampleFeedback = {
  ...mockFeedback,
  areas: mockFeedback.areas.slice(0, 2),
  nextSteps: mockFeedback.nextSteps.slice(0, 2),
  model: "example",
};

const steps = [
  {
    title: "Add your miniatures",
    text: "Search Warhammer, Middle-earth, Star Wars and D&D miniatures, and Brushwise fills in the faction. Track each one from unpainted to done.",
  },
  {
    title: "Photograph your work",
    text: "Upload a photo from your phone. It's shrunk in the browser first, so even large photos upload fast.",
  },
  {
    title: "Get AI feedback",
    text: "Claude scores your basecoat, shading, highlights and more, with a concrete tip for each.",
  },
];

const features = [
  {
    title: "Your pile of shame, tamed",
    text: "Photograph a box and AI reads what's in it and how many models. Start one, and it moves to your collection.",
  },
  {
    title: "Recipes from your own paints",
    text: "Scan your paint rack, then get step-by-step schemes that use what you own – with what's missing and what you can mix.",
  },
  {
    title: "Citadel, Vallejo or Army Painter",
    text: "Switch any recipe to the brand you prefer and see the closest match for every step.",
  },
  {
    title: "Feedback that teaches",
    text: "Not just a score: every area comes with what works, what to improve, and a technique to try.",
  },
  {
    title: "Progress over time",
    text: "Keep every photo of a miniature, so you can see how your painting improves.",
  },
  {
    title: "Track every miniature",
    text: "See at a glance how many miniatures are unpainted, in progress and done.",
  },
];

// Signed-in visitors go straight to their collection; everyone else gets sign-up.
// Reads the session cookie, so it renders per request inside <Suspense>.
async function HeroActions() {
  const session = await getSession();

  if (session) {
    return (
      <Link href="/collection" className={buttonPrimary}>
        Go to your collection
      </Link>
    );
  }

  return (
    <>
      <Link href="/sign-up" className={buttonPrimary}>
        Create a free account
      </Link>
      <Link href="/sign-in" className={buttonSecondary}>
        Sign in
      </Link>
    </>
  );
}

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium tracking-widest text-amber-600 uppercase dark:text-amber-400">
            AI painting coach
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Paint better miniatures, one photo at a time
          </h1>
          <p className={`mt-5 text-lg leading-relaxed ${mutedText}`}>
            Brushwise keeps track of your collection and gives you honest, practical feedback on
            every paint job – so you always know what to practise next.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Suspense
              fallback={
                <Link href="/sign-up" className={buttonPrimary}>
                  Create a free account
                </Link>
              }>
              <HeroActions />
            </Suspense>
          </div>
        </div>

        {/* A real example of what the feedback looks like */}
        <div className={`${card} relative`}>
          <span className="absolute -top-3 left-6 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-neutral-950">
            Example feedback
          </span>
          <FeedbackView feedback={exampleFeedback} />
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto w-full max-w-5xl px-4 py-16">
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="flex size-9 items-center justify-center rounded-full bg-amber-500 font-bold text-neutral-950">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className={`mt-1 text-sm leading-relaxed ${mutedText}`}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className={card}>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedText}`}>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div
          className={`mx-auto flex w-full max-w-5xl flex-wrap justify-between gap-2 px-4 py-6 text-sm ${mutedText}`}>
          <p>Built with Next.js, PostgreSQL and the Claude API.</p>
          <a href="https://github.com/alexanderjonasson/Brushwise" className={link}>
            Source on GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
