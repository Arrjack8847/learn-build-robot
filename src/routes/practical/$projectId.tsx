import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  CircleHelp,
  Lightbulb,
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
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";
import { getProject } from "@/data/practical";
import type { PracticalProject } from "@/types/learning";

export const Route = createFileRoute("/practical/$projectId")({
  component: PracticalProjectPage,
});

type SessionStage = "steps" | "complete";

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
  const helpItem = project.troubleshooting[currentIndex % project.troubleshooting.length];

  function finishCurrentStep() {
    toggleStepCompleted(currentStepId, true);
    if (isLastStep) {
      setStage("complete");
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b bg-card px-4 sm:px-8">
        <Link
          aria-label="Exit project and choose a robot"
          className="grid size-11 shrink-0 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          to="/practical"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-bold">{project.title}</p>
          <p className="text-xs text-muted-foreground">
            Step {currentIndex + 1} of {project.steps.length}
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-success-soft text-success">
          <Check aria-hidden="true" className="size-5" />
        </span>
      </header>

      <Progress
        aria-label={`Step ${currentIndex + 1} of ${project.steps.length}`}
        className="h-1.5 rounded-none bg-secondary [&>div]:bg-success"
        value={displayedPercent}
      />

      <main className="flex min-h-0 flex-1 items-center px-4 py-3 sm:px-8 sm:py-5">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-4 md:grid-cols-[0.9fr_1.1fr] md:gap-8">
          <RobotIllustration
            className="min-h-24 sm:min-h-52 md:min-h-[22rem]"
            variant={project.number - 1}
          />

          <section className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Do this now
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
              {currentStep.title}
            </h1>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground sm:mt-3 sm:text-base sm:leading-7">
              {currentStep.description}
            </p>

            {currentStep.note ? (
              <div
                className={`mt-4 flex items-start gap-3 rounded-2xl p-3 text-sm leading-6 sm:p-4 ${
                  currentStep.note.type === "warning"
                    ? "bg-warning-soft text-foreground"
                    : "bg-primary-soft text-foreground"
                }`}
              >
                {currentStep.note.type === "warning" ? (
                  <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
                ) : (
                  <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                )}
                <p className="line-clamp-2 sm:line-clamp-none">{currentStep.note.text}</p>
              </div>
            ) : null}

            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 rounded-2xl" type="button" variant="outline">
                  <CircleHelp aria-hidden="true" />
                  I Need Help
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-3xl">
                <DialogHeader>
                  <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <CircleHelp aria-hidden="true" className="size-6" />
                  </span>
                  <DialogTitle>Let’s solve it together</DialogTitle>
                  <DialogDescription className="leading-6">
                    Check this common problem before changing your build.
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-sm font-bold">{helpItem?.question || "Check the current step"}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {helpItem?.answer || project.safetyNote}
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-warning-soft p-4 text-sm leading-6">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
                  <p>{project.safetyNote}</p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="rounded-2xl" type="button">
                      I’m Ready to Try
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        </div>
      </main>

      <footer className="border-t bg-card px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:py-4">
        <div className="mx-auto flex w-full max-w-5xl gap-3">
          <Button
            aria-label="Go to previous step"
            className="min-h-12 rounded-2xl px-4 sm:px-6"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            type="button"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            className="min-h-12 flex-1 rounded-2xl text-base font-bold"
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
    <div aria-live="polite" className="grid h-full place-items-center bg-background">
      <p className="text-sm font-semibold text-muted-foreground">Finding your next step…</p>
    </div>
  );
}
