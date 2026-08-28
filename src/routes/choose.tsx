import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Bot, CircuitBoard, LineChart } from "lucide-react";

import { APP_NAME } from "@/config/app";
import { useProgress } from "@/context/ProgressContext";

export const Route = createFileRoute("/choose")({
  component: ChooseCategoryPage,
});

function ChooseCategoryPage() {
  const { progress } = useProgress();
  const studentName = progress.studentName || "Builder";

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="flex min-h-16 items-center justify-between border-b bg-card px-4 sm:px-8">
        <Link
          aria-label="Back to name entry"
          className="grid size-11 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          to="/join"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <CircuitBoard aria-hidden="true" className="size-4" />
          </span>
          <span className="font-bold">{APP_NAME}</span>
        </div>
        <Link
          aria-label="View progress"
          className="grid size-11 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          to="/progress"
        >
          <LineChart aria-hidden="true" className="size-5" />
        </Link>
      </header>

      <main className="flex min-h-0 flex-1 flex-col justify-center px-4 py-3 sm:px-8 sm:py-5">
        <div className="mx-auto w-full max-w-5xl">
          <header className="text-center">
            <p className="text-sm font-semibold text-primary">Welcome, {studentName}!</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:mt-2 sm:text-4xl">
              What would you like to do?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Choose one journey to begin.</p>
          </header>

          <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-6">
            <CategoryChoice
              description="Discover how robots sense, think and move."
              icon={BookOpen}
              label="Learn Theory"
              to="/theory"
            />
            <CategoryChoice
              description="Build your robot one easy step at a time."
              icon={Bot}
              label="Build a Robot"
              to="/practical"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function CategoryChoice({
  icon: Icon,
  label,
  description,
  to,
}: {
  icon: typeof BookOpen;
  label: string;
  description: string;
  to: "/theory" | "/practical";
}) {
  return (
    <Link
      className="group flex min-h-36 flex-col items-center justify-center rounded-[1.5rem] border bg-card p-4 text-center shadow-card transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift sm:min-h-72 sm:rounded-[2rem] sm:p-6"
      to={to}
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground sm:size-20 sm:rounded-[1.75rem]">
        <Icon aria-hidden="true" className="size-7 sm:size-9" />
      </span>
      <h2 className="mt-3 text-xl font-bold sm:mt-5 sm:text-2xl">{label}</h2>
      <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6">{description}</p>
      <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-primary sm:mt-5 sm:text-sm">
        Choose
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
