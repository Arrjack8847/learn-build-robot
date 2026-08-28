import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Hand,
  Layers3,
} from "lucide-react";

import { LearningIllustration } from "@/components/journey/LearningIllustration";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useModuleProgress, useProgress } from "@/context/ProgressContext";
import { theoryModules } from "@/data/theory";

export const Route = createFileRoute("/theory/")({
  component: TheoryCataloguePage,
});

function TheoryCataloguePage() {
  const { hydrated } = useProgress();

  if (!hydrated) {
    return <TheoryJourneyLoading />;
  }

  return <TheoryPicker />;
}

function TheoryPicker() {
  const { progress } = useProgress();
  const getModuleProgress = useModuleProgress();
  const initialIndex = getInitialModuleIndex(progress.completedLessonIds);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    if (!api) return;

    const updateSelectedTopic = () => setSelectedIndex(api.selectedScrollSnap());
    updateSelectedTopic();
    api.on("select", updateSelectedTopic);

    return () => {
      api.off("select", updateSelectedTopic);
    };
  }, [api]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="flex min-h-16 items-center justify-between border-b bg-card px-4 sm:px-8">
        <Link
          aria-label="Back to category choice"
          className="grid size-11 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          to="/choose"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="text-center">
          <p className="text-sm font-bold">Choose a Learning Topic</p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Hi, {progress.studentName || "Builder"}!
          </p>
        </div>
        <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-sm font-bold text-primary">
          {selectedIndex + 1}/{theoryModules.length}
        </span>
      </header>

      <main className="flex min-h-0 flex-1 flex-col justify-center px-4 py-3 sm:px-8 sm:py-5">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground sm:mb-4">
            <Hand aria-hidden="true" className="size-4 text-primary" />
            Swipe to see the next topic
          </div>

          <Carousel
            aria-label="Robotics learning topics"
            className="mx-auto w-full"
            opts={{ align: "start", loop: false, startIndex: initialIndex }}
            setApi={setApi}
          >
            <CarouselContent>
              {theoryModules.map((module, index) => {
                const moduleProgress = getModuleProgress(module.id);
                const actionLabel =
                  moduleProgress.status === "Not Started"
                    ? "Start Learning"
                    : moduleProgress.status === "Completed"
                      ? "Review Topic"
                      : "Continue Learning";

                return (
                  <CarouselItem
                    aria-label={`${module.title}, topic ${index + 1} of ${theoryModules.length}`}
                    key={module.id}
                  >
                    <article className="grid overflow-hidden rounded-[2rem] border bg-card shadow-card md:grid-cols-[0.9fr_1.1fr]">
                      <LearningIllustration
                        className="min-h-28 rounded-none sm:min-h-48 md:min-h-[23rem]"
                        icon={module.icon}
                        variant={index}
                      />

                      <div className="flex min-h-0 flex-col justify-center p-4 sm:p-7 md:p-9">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                            Topic {module.number}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                              moduleProgress.status === "Completed"
                                ? "bg-success-soft text-success"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {moduleProgress.status}
                          </span>
                        </div>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                          {module.title}
                        </h1>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {module.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground sm:mt-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                            <Clock3 aria-hidden="true" className="size-3.5" />
                            {module.durationMinutes} min
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                            <Layers3 aria-hidden="true" className="size-3.5" />
                            {module.lessons.length * 4} short pages
                          </span>
                          <span className="hidden rounded-full bg-secondary px-3 py-1.5 sm:inline">
                            {module.difficulty}
                          </span>
                        </div>

                        {moduleProgress.status !== "Not Started" ? (
                          <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-success">
                            <CheckCircle2 aria-hidden="true" className="size-4" />
                            {moduleProgress.completed} of {moduleProgress.total} lessons finished
                          </p>
                        ) : null}

                        <Link
                          className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 sm:mt-5 sm:min-h-12 sm:text-base"
                          params={{ lessonId: module.id }}
                          to="/theory/$lessonId"
                        >
                          {actionLabel}
                          <ArrowRight aria-hidden="true" className="size-5" />
                        </Link>
                      </div>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <button
              aria-label="Previous learning topic"
              className="absolute left-2 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border bg-card text-foreground shadow-card transition hover:bg-secondary disabled:opacity-30 md:grid"
              disabled={!api?.canScrollPrev()}
              onClick={() => api?.scrollPrev()}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              aria-label="Next learning topic"
              className="absolute right-2 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border bg-card text-foreground shadow-card transition hover:bg-secondary disabled:opacity-30 md:grid"
              disabled={!api?.canScrollNext()}
              onClick={() => api?.scrollNext()}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </Carousel>

          <div
            aria-label={`Topic ${selectedIndex + 1} of ${theoryModules.length}`}
            className="mt-3 flex justify-center gap-2"
          >
            {theoryModules.map((module, index) => (
              <span
                aria-hidden="true"
                className={`h-2 rounded-full transition-all ${
                  selectedIndex === index ? "w-7 bg-primary" : "w-2 bg-border"
                }`}
                key={module.id}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function getInitialModuleIndex(completedLessonIds: string[]) {
  const inProgressIndex = theoryModules.findIndex((module) => {
    const completed = module.lessons.filter((lesson) =>
      completedLessonIds.includes(lesson.id),
    ).length;
    return completed > 0 && completed < module.lessons.length;
  });
  if (inProgressIndex >= 0) return inProgressIndex;

  const firstNotCompletedIndex = theoryModules.findIndex((module) =>
    module.lessons.some((lesson) => !completedLessonIds.includes(lesson.id)),
  );
  return firstNotCompletedIndex >= 0 ? firstNotCompletedIndex : 0;
}

function TheoryJourneyLoading() {
  return (
    <div aria-live="polite" className="grid h-full place-items-center bg-background">
      <p className="text-sm font-semibold text-muted-foreground">Loading your topics…</p>
    </div>
  );
}
