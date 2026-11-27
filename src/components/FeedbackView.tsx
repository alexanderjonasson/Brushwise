import { feedbackSchema } from "@/lib/feedback";
import { mutedText } from "@/lib/ui";

type StoredFeedback = {
  overallScore: number;
  summary: string;
  areas: unknown;
  nextSteps: unknown;
  model: string;
};

// The JSON columns are checked against the same schema that shaped the AI's
// answer, so the page never renders something it doesn't understand.
const storedParts = feedbackSchema.pick({ areas: true, nextSteps: true });

function scoreColor(score: number) {
  if (score >= 8) return "text-green-700 dark:text-green-400";
  if (score >= 5) return "text-amber-700 dark:text-amber-400";
  return "text-red-700 dark:text-red-400";
}

export function FeedbackView({ feedback }: { feedback: StoredFeedback }) {
  const parts = storedParts.safeParse({ areas: feedback.areas, nextSteps: feedback.nextSteps });
  const areas = parts.success ? parts.data.areas : [];
  const nextSteps = parts.success ? parts.data.nextSteps : [];

  return (
    <section aria-label="AI feedback" className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">AI feedback</h3>
          {feedback.model === "mock" && (
            <p className={`text-xs ${mutedText}`}>Example answer – no AI was called</p>
          )}
        </div>
        <p className="text-right">
          <span className={`text-3xl font-bold ${scoreColor(feedback.overallScore)}`}>
            {feedback.overallScore}
          </span>
          <span className={`text-sm ${mutedText}`}>/10</span>
        </p>
      </div>

      <p className="text-sm leading-relaxed">{feedback.summary}</p>

      {areas.length > 0 && (
        <ul className="space-y-3">
          {areas.map((area) => (
            <li
              key={area.area}
              className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">{area.area}</h4>
                <span className={`text-sm font-semibold ${scoreColor(area.score)}`}>
                  {area.score}/10
                </span>
              </div>
              <p className={`mt-1 text-sm ${mutedText}`}>{area.comment}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Try: </span>
                {area.tip}
              </p>
            </li>
          ))}
        </ul>
      )}

      {nextSteps.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold">Practise next</h4>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
