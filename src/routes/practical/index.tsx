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
  ListChecks,
} from "lucide-react";

import { RobotIllustration } from "@/components/journey/RobotIllustration";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useProgress, useProjectProgress } from "@/context/ProgressContext";
import { practicalProjects } from "@/data/practical";

export const Route = createFileRoute("/practical/")({
  component: PracticalCataloguePage,
});

function PracticalCataloguePage() {
  const { hydrated } = useProgress();

  if (!hydrated) {
    return <RobotJourneyLoading />;
  }

  return <RobotPicker />;
}

function RobotPicker() {
  const { progress } = useProgress();
  const getProjectProgress = useProjectProgress();
  const initialIndex = getInitialProjectIndex(progress.completedStepIds);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    if (!api) return;

    const updateSelectedProject = () => setSelectedIndex(api.selectedScrollSnap());
    updateSelectedProject();
    api.on("select", updateSelectedProject);

    return () => {
      api.off("select", updateSelectedProject);
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
          <p className="text-sm font-bold">Choose a Robot</p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Hi, {progress.studentName || "Builder"}!
          </p>
        </div>
        <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-sm font-bold text-primary">
          {selectedIndex + 1}/{practicalProjects.length}
        </span>
      </header>

      <main className="flex min-h-0 flex-1 flex-col justify-center px-4 py-3 sm:px-8 sm:py-5">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground sm:mb-4">
            <Hand aria-hidden="true" className="size-4 text-primary" />
            Swipe to see the next robot
          </div>

          <Carousel
            aria-label="Robot projects"
            className="mx-auto w-full"
            opts={{ align: "start", loop: false, startIndex: initialIndex }}
            setApi={setApi}
          >
            <CarouselContent>
              {practicalProjects.map((project, index) => {
                const projectProgress = getProjectProgress(project.id);
                const actionLabel =
                  projectProgress.status === "Not Started"
                    ? "Start Project"
                    : projectProgress.status === "Completed"
                      ? "Build It Again"
                      : "Continue Project";

                return (
                  <CarouselItem aria-label={`${project.title}, robot ${index + 1} of ${practicalProjects.length}`} key={project.id}>
                    <article className="grid overflow-hidden rounded-[2rem] border bg-card shadow-card md:grid-cols-[0.9fr_1.1fr]">
                      <RobotIllustration
                        className="min-h-28 rounded-none sm:min-h-48 md:min-h-[23rem]"
                        variant={index}
                      />

                      <div className="flex min-h-0 flex-col justify-center p-4 sm:p-7 md:p-9">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                            Robot {project.number}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                              projectProgress.status === "Completed"
                                ? "bg-success-soft text-success"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {projectProgress.status}
                          </span>
                        </div>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                          {project.title}
                        </h1>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {project.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground sm:mt-4">
                          {project.buildMinutes ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                              <Clock3 aria-hidden="true" className="size-3.5" />
                              {project.buildMinutes} min
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                            <ListChecks aria-hidden="true" className="size-3.5" />
                            {project.steps.length} easy steps
                          </span>
                          {project.difficulty ? (
                            <span className="hidden rounded-full bg-secondary px-3 py-1.5 sm:inline">
                              {project.difficulty}
                            </span>
                          ) : null}
                        </div>

                        {projectProgress.status !== "Not Started" ? (
                          <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-success">
                            <CheckCircle2 aria-hidden="true" className="size-4" />
                            {projectProgress.completed} of {projectProgress.total} steps finished
                          </p>
                        ) : null}

                        <Link
                          className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 sm:mt-5 sm:min-h-12 sm:text-base"
                          params={{ projectId: project.id }}
                          to="/practical/$projectId"
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
              aria-label="Previous robot"
              className="absolute left-2 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border bg-card text-foreground shadow-card transition hover:bg-secondary disabled:opacity-30 md:grid"
              disabled={!api?.canScrollPrev()}
              onClick={() => api?.scrollPrev()}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              aria-label="Next robot"
              className="absolute right-2 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border bg-card text-foreground shadow-card transition hover:bg-secondary disabled:opacity-30 md:grid"
              disabled={!api?.canScrollNext()}
              onClick={() => api?.scrollNext()}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </Carousel>

          <div aria-label={`Robot ${selectedIndex + 1} of ${practicalProjects.length}`} className="mt-3 flex justify-center gap-2">
            {practicalProjects.map((project, index) => (
              <span
                aria-hidden="true"
                className={`h-2 rounded-full transition-all ${
                  selectedIndex === index ? "w-7 bg-primary" : "w-2 bg-border"
                }`}
                key={project.id}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function getInitialProjectIndex(completedStepIds: string[]) {
  const inProgressIndex = practicalProjects.findIndex((project) => {
    const completed = project.steps.filter((step) => completedStepIds.includes(step.id)).length;
    return completed > 0 && completed < project.steps.length;
  });
  if (inProgressIndex >= 0) return inProgressIndex;

  const firstNotCompletedIndex = practicalProjects.findIndex((project) =>
    project.steps.some((step) => !completedStepIds.includes(step.id)),
  );
  return firstNotCompletedIndex >= 0 ? firstNotCompletedIndex : 0;
}

function RobotJourneyLoading() {
  return (
    <div aria-live="polite" className="grid h-full place-items-center bg-background">
      <p className="text-sm font-semibold text-muted-foreground">Loading your robots…</p>
    </div>
  );
}
