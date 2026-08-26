import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3, Layers3 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useModuleProgress, useProgress } from "@/context/ProgressContext";
import { theoryModules } from "@/data/theory";

export const Route = createFileRoute("/theory/")({
  component: TheoryCataloguePage,
});

function TheoryCataloguePage() {
  const getModuleProgress = useModuleProgress();
  const { progress } = useProgress();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      <header>
        <p className="text-sm font-semibold text-primary">Learning category</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Theory</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Understand the ideas behind robotics, electronics, sensors and programming before applying them in the lab.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {theoryModules.map((module) => {
          const moduleProgress = getModuleProgress(module.id);
          const nextLesson =
            module.lessons.find((lesson) => !progress.completedLessonIds.includes(lesson.id)) ??
            module.lessons[0];

          return (
            <article className="flex flex-col rounded-3xl border bg-card p-6 shadow-card" key={module.id}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <BookOpen aria-hidden="true" className="size-5" />
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {moduleProgress.status}
                </span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Module {module.number}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight">{module.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{module.description}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 aria-hidden="true" className="size-3.5" /> {module.durationMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers3 aria-hidden="true" className="size-3.5" /> {module.lessons.length} lessons
                </span>
              </div>
              <Progress
                aria-label={`${moduleProgress.percent}% complete for ${module.title}`}
                className="mt-4 bg-secondary [&>div]:bg-success"
                value={moduleProgress.percent}
              />
              {nextLesson ? (
                <Link
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  params={{ lessonId: nextLesson.id }}
                  to="/theory/$lessonId"
                >
                  {moduleProgress.status === "Not Started"
                    ? "Start module"
                    : moduleProgress.status === "Completed"
                      ? "Review module"
                      : "Continue module"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              ) : (
                <p className="mt-5 rounded-xl bg-secondary px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
                  Lessons are being prepared
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
