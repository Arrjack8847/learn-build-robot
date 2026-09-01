import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  CircleHelp,
  Cog,
  Lightbulb,
  ListChecks,
  Puzzle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  TriangleAlert,
} from "lucide-react";

import { RobotIllustration } from "@/components/journey/RobotIllustration";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProgress } from "@/context/ProgressContext";
import { getProject } from "@/data/practical";
import type { PracticalProject } from "@/types/learning";

export const Route = createFileRoute("/practical/$projectId")({
  component: PracticalProjectPage,
});

type SessionStage = "steps" | "complete";

const BRAND = {
  blue: "#168eea",
  navy: "#132654",
  pink: "#ec168c",
  orange: "#f5a400",
  green: "#39b54a",
};

function PracticalProjectPage() {
  const { projectId = "" } = Route.useParams();
  const project = getProject(projectId);
  const { hydrated } = useProgress();

  if (!project) {
    return <MissingProject />;
  }

  if (!hydrated) {
    return <BuildLoading />;
  }

  return <BuildSession key={project.id} project={project} />;
}

function BuildSession({ project }: { project: PracticalProject }) {
  const { progress, isStepCompleted, toggleStepCompleted } = useProgress();
  const firstIncompleteIndex = project.steps.findIndex((step) => !isStepCompleted(step.id));
  const [currentIndex, setCurrentIndex] = useState(
    firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0,
  );
  const [stage, setStage] = useState<SessionStage>("steps");
  const currentStep = project.steps[currentIndex];

  if (!currentStep) {
    return <MissingProject />;
  }

  if (stage === "complete") {
    return (
      <BuildCelebration
        onReview={() => {
          setCurrentIndex(0);
          setStage("steps");
        }}
        project={project}
        studentName={progress.studentName || "Builder"}
      />
    );
  }

  const isLastStep = currentIndex === project.steps.length - 1;
  const currentStepId = currentStep.id;
  const displayedPercent = Math.round(((currentIndex + 1) / project.steps.length) * 100);
  const helpItem =
    project.troubleshooting.length > 0
      ? project.troubleshooting[currentIndex % project.troubleshooting.length]
      : undefined;
  const hasHelp = Boolean(helpItem || project.safetyNote);

  function finishCurrentStep() {
    toggleStepCompleted(currentStepId, true);
    if (isLastStep) {
      setStage("complete");
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden bg-white text-[#132654]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <Cog className="absolute -left-10 top-[24%] size-28 text-[#168eea]/8" strokeWidth={1.35} />
        <Puzzle className="absolute -right-8 top-[17%] size-24 rotate-12 text-[#39b54a]/8" strokeWidth={1.35} />
        <Rocket className="absolute -right-6 bottom-[18%] size-20 -rotate-12 text-[#ec168c]/8" strokeWidth={1.35} />
        <Cog className="absolute -left-6 bottom-[6%] size-20 text-[#f5a400]/8" strokeWidth={1.35} />
      </div>

      <header className="relative z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:h-[76px] sm:px-8 [@media(max-height:720px)]:h-14">
        <Link
          aria-label="Exit project and choose a robot"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-[0_6px_18px_rgba(20,44,84,0.08)] transition active:scale-95 sm:size-12 [@media(max-height:720px)]:size-10"
          to="/practical"
        >
          <ArrowLeft aria-hidden="true" className="size-5 sm:size-6" />
        </Link>

        <img
          alt="BE STEM READY"
          className="absolute left-1/2 top-1/2 h-12 w-auto -translate-x-1/2 -translate-y-1/2 object-contain sm:h-14 [@media(max-height:720px)]:h-10"
          src="/home/be-stem-ready-logo.svg"
        />

        <span className="inline-flex min-w-[66px] items-center justify-center gap-1.5 rounded-full border border-[#168eea]/30 bg-[#eaf5ff] px-3 py-2 text-xs font-black text-[#0f69bd] shadow-sm sm:min-w-[76px] sm:text-sm [@media(max-height:720px)]:py-1.5">
          <CheckCircle2 aria-hidden="true" className="size-4" />
          {currentIndex + 1}/{project.steps.length}
        </span>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-3 sm:px-8 sm:pb-32 sm:pt-5 [@media(max-height:720px)]:pt-2">
        <section className="text-center">
          <h1 className="mx-auto max-w-3xl text-[clamp(1.6rem,6.4vw,2.5rem)] font-black leading-tight tracking-[-0.035em] text-[#132654] [@media(max-height:720px)]:text-[clamp(1.35rem,5.8vw,2rem)]">
            {project.title}
          </h1>
          <p className="mt-1 text-sm font-bold text-[#168eea] sm:text-base">
            Step {currentIndex + 1} <span className="font-semibold text-slate-400">of {project.steps.length}</span>
          </p>

          <div className="mx-auto mt-3 flex max-w-4xl items-center gap-3 [@media(max-height:720px)]:mt-2">
            <Rocket aria-hidden="true" className="size-5 shrink-0 -rotate-12 text-[#ec168c]" />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#168eea] transition-all duration-300"
                style={{ width: `${displayedPercent}%` }}
              />
            </div>
            <span className="min-w-[40px] rounded-full bg-[#eaf8ea] px-2 py-1 text-[11px] font-black text-[#2f9d3e]">
              {displayedPercent}%
            </span>
          </div>
        </section>

        <div className="mx-auto mt-4 grid w-full max-w-5xl gap-4 md:mt-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-7 [@media(max-height:720px)]:mt-3">
          <div className="relative overflow-hidden rounded-[28px] border-2 border-[#168eea]/25 bg-[#eef7ff] p-2 shadow-[0_16px_40px_rgba(21,75,125,0.10)] sm:p-3 md:rounded-[34px]">
            <div aria-hidden="true" className="circuit-grid absolute inset-0 opacity-35" />
            {currentStep.image ? (
              <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[22px] bg-white/70 p-2 sm:p-3 md:min-h-[430px] md:rounded-[28px] [@media(max-height:720px)]:min-h-0">
                <img
                  alt={`${project.title} step ${currentStep.number}: ${currentStep.title}`}
                  className="h-full w-full object-contain"
                  loading="eager"
                  src={currentStep.image}
                />
              </div>
            ) : (
              <RobotIllustration
                className="relative min-h-[220px] rounded-[22px] sm:min-h-[300px] md:min-h-[430px] md:rounded-[28px]"
                variant={project.number - 1}
              />
            )}
          </div>

          <section className="min-w-0 md:rounded-[30px] md:border md:border-slate-200/90 md:bg-white md:p-7 md:shadow-[0_14px_36px_rgba(20,55,90,0.08)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff4d9] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#b97900] sm:text-xs">
              <ListChecks aria-hidden="true" className="size-4" />
              Step {currentStep.number}
            </div>

            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#168eea] sm:text-xs [@media(max-height:720px)]:mt-3">
              Do this now
            </p>
            <h2 className="mt-1.5 text-[clamp(1.9rem,8vw,3rem)] font-black leading-[1.02] tracking-[-0.04em] text-[#132654] md:text-4xl [@media(max-height:720px)]:text-[1.65rem]">
              {currentStep.title}
            </h2>
            <div className="mt-2 h-1 w-10 rounded-full bg-[#f5a400]" />
            <p className="mt-3 text-[14px] font-medium leading-6 text-slate-500 sm:text-base sm:leading-7 [@media(max-height:720px)]:mt-2 [@media(max-height:720px)]:text-[12px] [@media(max-height:720px)]:leading-5">
              {currentStep.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5 [@media(max-height:720px)]:mt-3">
              <div className="rounded-2xl border border-[#168eea]/20 bg-[#f2f8ff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Current step</p>
                <p className="mt-1 text-sm font-black text-[#0f69bd]">{currentIndex + 1} of {project.steps.length}</p>
              </div>
              <div className="rounded-2xl border border-[#f5a400]/25 bg-[#fffaf0] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Build progress</p>
                <p className="mt-1 text-sm font-black text-[#b97900]">{displayedPercent}% complete</p>
              </div>
            </div>

            {currentStep.note ? (
              <div
                className={`mt-4 flex items-start gap-3 rounded-2xl p-3 text-sm leading-6 sm:p-4 ${
                  currentStep.note.type === "warning"
                    ? "bg-[#fff4d9] text-[#132654]"
                    : "bg-[#eaf5ff] text-[#132654]"
                }`}
              >
                {currentStep.note.type === "warning" ? (
                  <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#d68b00]" />
                ) : (
                  <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#168eea]" />
                )}
                <p>{currentStep.note.text}</p>
              </div>
            ) : null}

            {hasHelp ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4 rounded-full border-[#168eea]/25 text-[#0f69bd]" type="button" variant="outline">
                    <CircleHelp aria-hidden="true" />
                    I Need Help
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-3xl">
                  <DialogHeader>
                    <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-[#eaf5ff] text-[#168eea]">
                      <CircleHelp aria-hidden="true" className="size-6" />
                    </span>
                    <DialogTitle>Let’s solve it together</DialogTitle>
                    <DialogDescription className="leading-6">
                      Check this guidance before changing your build.
                    </DialogDescription>
                  </DialogHeader>
                  {helpItem ? (
                    <div className="rounded-2xl bg-secondary p-4">
                      <p className="text-sm font-bold">{helpItem.question}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {helpItem.answer}
                      </p>
                    </div>
                  ) : null}
                  {project.safetyNote ? (
                    <div className="flex items-start gap-3 rounded-2xl bg-warning-soft p-4 text-sm leading-6">
                      <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
                      <p>{project.safetyNote}</p>
                    </div>
                  ) : null}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="rounded-2xl" type="button">
                        I’m Ready to Try
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
          </section>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-100 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(20,55,90,0.06)] backdrop-blur sm:px-8 sm:py-4">
        <div className="mx-auto flex w-full max-w-5xl gap-3">
          <Button
            aria-label="Go to previous step"
            className="min-h-12 w-14 shrink-0 rounded-full border-slate-200 bg-white px-0 text-[#132654] shadow-sm sm:w-auto sm:px-6"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            type="button"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            className="min-h-12 flex-1 rounded-full bg-[#168eea] text-base font-black text-white shadow-[0_10px_26px_rgba(22,142,234,0.24)] hover:bg-[#0e82dd] sm:min-h-[52px]"
            onClick={finishCurrentStep}
            type="button"
          >
            {isLastStep ? "Finish My Robot" : "Done — Next Step"}
            {isLastStep ? (
              <Sparkles aria-hidden="true" />
            ) : (
              <ArrowRight aria-hidden="true" />
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function BuildCelebration({
  project,
  studentName,
  onReview,
}: {
  project: PracticalProject;
  studentName: string;
  onReview: () => void;
}) {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-navy px-5 py-6 text-center text-navy-foreground">
      <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-50" />
      <main className="relative w-full max-w-2xl">
        <span className="mx-auto grid size-24 place-items-center rounded-[2rem] bg-warning-soft text-warning shadow-lift sm:size-28">
          <Trophy aria-hidden="true" className="size-12 sm:size-14" />
        </span>
        <div className="mt-5 flex justify-center gap-2 text-warning" aria-hidden="true">
          <Sparkles className="size-5" />
          <Sparkles className="size-7" />
          <Sparkles className="size-5" />
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Robot complete
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          Amazing work, {studentName}!
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-navy-muted sm:text-base sm:leading-7">
          You built {project.title} one step at a time. Now let’s prepare it for competition day.
        </p>

        <div className="mx-auto mt-7 grid max-w-md gap-3">
          <Button asChild className="min-h-12 rounded-2xl text-base font-bold">
            <Link params={{ projectId: project.id }} to="/practical/$projectId/competition">
              Learn How to Win
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            className="min-h-12 rounded-2xl border-white/15 bg-navy-hover text-navy-foreground hover:bg-navy-hover/80"
            onClick={onReview}
            type="button"
            variant="outline"
          >
            Review Build Steps
          </Button>
        </div>
      </main>
    </div>
  );
}

function MissingProject() {
  return (
    <div className="grid h-full place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="text-2xl font-bold">We couldn’t find that robot.</h1>
        <Link className="mt-5 inline-flex items-center gap-2 font-semibold text-primary" to="/practical">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Choose a robot
        </Link>
      </div>
    </div>
  );
}

function BuildLoading() {
  return (
    <div aria-live="polite" className="grid min-h-[100svh] place-items-center bg-white">
      <p className="text-sm font-semibold text-slate-500">Finding your next step…</p>
    </div>
  );
}
