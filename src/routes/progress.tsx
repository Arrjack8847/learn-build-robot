import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  RefreshCcw,
  Trophy,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const { progress, stats, hydrated } = useProgress();

  const items = [
    {
      label: "Overall learning",
      value: stats.overallPercent,
      detail: "Theory lessons and practical steps",
      icon: Trophy,
    },
    {
      label: "Theory",
      value: stats.theoryPercent,
      detail: `${stats.completedLessons} of ${stats.totalLessons} lessons completed`,
      icon: BookOpen,
    },
    {
      label: "Robot Practical",
      value: stats.practicalPercent,
      detail: `${stats.completedProjects} of ${stats.totalProjects} projects completed`,
      icon: Bot,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7">
      <header>
        <p className="text-sm font-semibold text-primary">Student record</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Progress</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          A simple overview of the learning progress currently saved on this device.
        </p>
      </header>

      <section aria-label="Progress summary" className="grid gap-4 md:grid-cols-3">
        {items.map(({ label, value, detail, icon: Icon }) => (
          <article className="rounded-3xl border bg-card p-6 shadow-card" key={label}>
            <div className="flex items-center justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="text-2xl font-bold">{hydrated ? `${value}%` : "—"}</span>
            </div>
            <h2 className="mt-5 font-bold">{label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
            <Progress
              aria-label={`${value}% ${label.toLowerCase()} progress`}
              className="mt-5 bg-secondary [&>div]:bg-success"
              value={value}
            />
          </article>
        ))}
      </section>

      <section aria-labelledby="results-history-heading" className="rounded-3xl border bg-card shadow-card">
        <div className="flex items-start gap-4 border-b p-6 sm:p-8">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            <ClipboardCheck aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 id="results-history-heading" className="text-lg font-bold">
              Quiz results history
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Every simulated AI quiz attempt is kept here so you can revisit feedback and track
              improvement.
            </p>
          </div>
        </div>

        {!hydrated ? (
          <p className="p-8 text-sm text-muted-foreground" aria-live="polite">
            Loading saved results…
          </p>
        ) : progress.quizAttempts.length === 0 ? (
          <div className="p-8 text-center sm:p-12">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <ClipboardCheck aria-hidden="true" className="size-6" />
            </span>
            <h3 className="mt-4 font-bold">No quiz attempts yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Open a theory lesson and generate its knowledge check. Your score and feedback will
              appear here.
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              to="/theory"
            >
              Browse theory lessons
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {progress.quizAttempts.map((attempt) => (
              <article className="p-6 sm:p-8" key={attempt.id}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{attempt.lessonTitle}</h3>
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {attempt.score}/{attempt.total} correct
                      </span>
                    </div>
                    <time className="mt-1 block text-xs text-muted-foreground" dateTime={attempt.takenAt}>
                      {formatAttemptDate(attempt.takenAt)}
                    </time>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <ResultNote
                        icon={CheckCircle2}
                        label="Strength"
                        text={attempt.strengths[0] ?? "Quiz completed"}
                        tone="success"
                      />
                      <ResultNote
                        icon={RefreshCcw}
                        label="Review"
                        text={attempt.review[0] ?? "No review needed"}
                        tone="warning"
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 sm:pl-6">
                    <span
                      className={`grid size-20 place-items-center rounded-full text-xl font-bold ${
                        attempt.percentage >= 80
                          ? "bg-success-soft text-success"
                          : "bg-warning-soft text-warning"
                      }`}
                    >
                      {attempt.percentage}%
                    </span>
                    <Link
                      aria-label={`Revisit ${attempt.lessonTitle}`}
                      className="grid size-11 place-items-center rounded-xl border text-primary transition hover:bg-secondary"
                      params={{ lessonId: attempt.lessonId }}
                      to="/theory/$lessonId"
                    >
                      <ArrowRight aria-hidden="true" className="size-5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ResultNote({
  icon: Icon,
  label,
  text,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  text: string;
  tone: "success" | "warning";
}) {
  return (
    <div
      className={`flex items-start gap-2 rounded-xl p-3 text-sm ${
        tone === "success" ? "bg-success-soft" : "bg-warning-soft"
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`mt-0.5 size-4 shrink-0 ${tone === "success" ? "text-success" : "text-warning"}`}
      />
      <p className="leading-5">
        <span className="font-semibold">{label}:</span> {text}
      </p>
    </div>
  );
}

function formatAttemptDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
