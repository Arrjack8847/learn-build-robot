import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Bot, ClipboardCheck, Trophy } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const { stats, hydrated } = useProgress();

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

      <section className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            <ClipboardCheck aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold">Results history</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Quiz attempts and simulated AI practical grades will appear here as those learning flows are added.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
