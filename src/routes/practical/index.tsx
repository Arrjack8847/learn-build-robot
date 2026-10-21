import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Cog,
  Hand,
  FileText,
  ListChecks,
  Puzzle,
  Rocket,
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

const BRAND = {
  blue: "#168eea",
  navy: "#132654",
  pink: "#ec168c",
  orange: "#ff7900",
  green: "#39b54a",
};

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
    <div className="relative min-h-[100svh] overflow-x-hidden bg-white text-[#132654]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <Cog className="absolute -left-8 top-[18%] size-24 text-[#168eea]/10 sm:size-32" strokeWidth={1.4} />
        <Puzzle className="absolute -right-7 top-[26%] size-24 rotate-12 text-[#39b54a]/10 sm:size-28" strokeWidth={1.4} />
        <Rocket className="absolute -right-5 bottom-[6%] size-24 -rotate-12 text-[#ec168c]/10 sm:size-28" strokeWidth={1.4} />
        <Cog className="absolute -left-6 bottom-[4%] size-20 text-[#ff7900]/10 sm:size-24" strokeWidth={1.4} />
      </div>

      <header className="relative z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:h-[76px] sm:px-8 [@media(max-height:720px)]:h-14">
        <Link
          aria-label="Back to levels"
          className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-[0_6px_18px_rgba(20,44,84,0.08)] transition active:scale-95 sm:size-12 [@media(max-height:720px)]:size-10"
          to="/practical/levels"
        >
          <ArrowLeft aria-hidden="true" className="size-5 sm:size-6" />
        </Link>

        <img
          alt="BE STEM READY"
          className="absolute left-1/2 top-1/2 h-12 w-auto -translate-x-1/2 -translate-y-1/2 object-contain sm:h-14 [@media(max-height:720px)]:h-10"
          src="/home/be-stem-ready-logo.svg"
        />

        <span className="grid min-w-[54px] place-items-center rounded-full border border-[#168eea]/40 bg-white px-3 py-2 text-sm font-black text-[#168eea] shadow-sm sm:min-w-[64px] sm:text-base [@media(max-height:720px)]:py-1.5 [@media(max-height:720px)]:text-xs">
          {selectedIndex + 1}/{practicalProjects.length}
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 pb-5 pt-3 sm:px-8 sm:pb-8 sm:pt-5 [@media(max-height:720px)]:pt-2">
        <section className="shrink-0 text-center">
          <h1 className="mx-auto max-w-3xl font-black leading-[0.95] tracking-[-0.045em]">
            <span className="block text-[clamp(1.9rem,7.2vw,3rem)] text-[#132654] [@media(max-height:720px)]:text-[clamp(1.55rem,6.5vw,2.15rem)]">
              Choose a
            </span>
            <span className="mt-1 block text-[clamp(2.25rem,9.2vw,4rem)] text-[#ff7900] [@media(max-height:720px)]:text-[clamp(1.9rem,8vw,2.7rem)]">
              Build Robot
            </span>
          </h1>

          <div className="mt-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-slate-500 sm:mt-4 sm:text-sm [@media(max-height:720px)]:mt-2 [@media(max-height:720px)]:text-xs">
            <Hand aria-hidden="true" className="size-5 text-[#168eea] [@media(max-height:720px)]:size-4" />
            Swipe to see the next robot
          </div>
          <Link to="/practical/levels"
            className="mx-auto mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-[#eaf5ff] px-4 text-xs font-extrabold text-[#168eea] transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea] sm:text-sm">
            Explore all six levels <ArrowRight className="size-4" aria-hidden="true"/>
          </Link>
        </section>

        <Carousel
          aria-label="Robot projects"
          className="mx-auto mt-3 w-full max-w-5xl sm:mt-5 [@media(max-height:720px)]:mt-2"
          opts={{ align: "start", loop: false, startIndex: initialIndex }}
          setApi={setApi}
        >
          <CarouselContent>
            {practicalProjects.map((project, index) => {
              const projectProgress = getProjectProgress(project.id);
              const actionLabel =
                projectProgress.status === "Not Started"
                  ? "Start Building"
                  : projectProgress.status === "Completed"
                    ? "Build It Again"
                    : "Continue Building";

              return (
                <CarouselItem
                  aria-label={`${project.title}, robot ${index + 1} of ${practicalProjects.length}`}
                  key={project.id}
                >
                  <article className="overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_18px_45px_rgba(21,75,125,0.12)] md:grid md:grid-cols-[0.95fr_1.05fr] md:rounded-[34px]">
                    {project.id === "acceleration-car" ? (
                      <div className="flex min-h-[185px] flex-col items-center justify-center gap-3 bg-[#eaf5ff] p-6 text-center sm:min-h-[230px] md:min-h-[430px]">
                        <FileText className="size-16 text-[#168eea]" aria-hidden="true" strokeWidth={1.4}/>
                        <span className="text-sm font-extrabold text-[#132654]">Official PDF Building Manual</span>
                        <span className="text-xs font-semibold text-[#40729d]">Original illustrations · 18 steps</span>
                      </div>
                    ) : (
                      <RobotIllustration
                        className="min-h-[185px] rounded-none sm:min-h-[230px] md:min-h-[430px] [@media(max-height:720px)]:min-h-[145px]"
                        variant={index}
                      />
                    )}

                    <div className="flex min-h-0 flex-col justify-center p-4 sm:p-6 md:p-8 [@media(max-height:720px)]:p-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#168eea] sm:text-xs">
                          Robot {project.number}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-extrabold sm:text-[11px] ${
                            projectProgress.status === "Completed"
                              ? "bg-[#eaf8ea] text-[#2f9d3e]"
                              : projectProgress.status === "In Progress"
                                ? "bg-[#fff1e5] text-[#d96200]"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {projectProgress.status}
                        </span>
                      </div>

                      <h2 className="mt-2 text-[clamp(1.7rem,7vw,2.45rem)] font-black leading-[1.02] tracking-[-0.035em] text-[#132654] md:text-4xl [@media(max-height:720px)]:mt-1.5 [@media(max-height:720px)]:text-[1.45rem]">
                        {project.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-[13px] font-medium leading-[19px] text-slate-500 sm:text-sm sm:leading-6 [@media(max-height:720px)]:mt-1.5 [@media(max-height:720px)]:line-clamp-2 [@media(max-height:720px)]:text-[11.5px] [@media(max-height:720px)]:leading-4">
                        {project.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold sm:mt-4 sm:text-xs [@media(max-height:720px)]:mt-2">
                        {project.buildMinutes ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf5ff] px-3 py-1.5 text-[#0f69bd] [@media(max-height:720px)]:px-2.5 [@media(max-height:720px)]:py-1">
                            <Clock3 aria-hidden="true" className="size-4" />
                            {project.buildMinutes} min
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1e5] px-3 py-1.5 text-[#d96200] [@media(max-height:720px)]:px-2.5 [@media(max-height:720px)]:py-1">
                          <ListChecks aria-hidden="true" className="size-4" />
                          {project.steps.length} easy steps
                        </span>
                        {project.difficulty ? (
                          <span className="hidden rounded-full bg-[#eaf8ea] px-3 py-1.5 font-bold text-[#287f34] sm:inline">
                            {project.difficulty}
                          </span>
                        ) : null}
                      </div>

                      {projectProgress.status !== "Not Started" ? (
                        <p className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold text-[#39a548] sm:text-xs [@media(max-height:720px)]:mt-2">
                          <CheckCircle2 aria-hidden="true" className="size-4" />
                          {projectProgress.completed} of {projectProgress.total} steps finished
                        </p>
                      ) : null}

                      <Link
                        className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#168eea] px-5 text-sm font-black text-white shadow-[0_10px_24px_rgba(22,142,234,0.24)] transition hover:bg-[#0e82dd] active:scale-[0.99] sm:min-h-[52px] sm:text-base [@media(max-height:720px)]:mt-3 [@media(max-height:720px)]:min-h-11 [@media(max-height:720px)]:text-[13px]"
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
            className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-md transition hover:bg-slate-50 disabled:opacity-30 md:grid"
            disabled={!api?.canScrollPrev()}
            onClick={() => api?.scrollPrev()}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            aria-label="Next robot"
            className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-md transition hover:bg-slate-50 disabled:opacity-30 md:grid"
            disabled={!api?.canScrollNext()}
            onClick={() => api?.scrollNext()}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </Carousel>

        <div
          aria-label={`Robot ${selectedIndex + 1} of ${practicalProjects.length}`}
          className="mt-4 flex justify-center gap-2 [@media(max-height:720px)]:mt-3"
        >
          {practicalProjects.map((project, index) => (
            <span
              aria-hidden="true"
              className={`h-2 rounded-full transition-all ${
                selectedIndex === index ? "w-8 bg-[#168eea]" : "w-2 bg-slate-200"
              }`}
              key={project.id}
            />
          ))}
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
    <div aria-live="polite" className="grid min-h-[100svh] place-items-center bg-white">
      <p className="text-sm font-semibold text-slate-500">Loading your robots…</p>
    </div>
  );
}
