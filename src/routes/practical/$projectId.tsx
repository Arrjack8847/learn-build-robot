import { useLayoutEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  CircleHelp,
  Cog,
  Lightbulb,
  Puzzle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  TriangleAlert,
} from "lucide-react";

import { RobotIllustration } from "@/components/journey/RobotIllustration";
import { Marksman3DPreview } from "@/components/practical/Marksman3DPreview";
import { AccelerationCarPdfViewer } from "@/components/practical/AccelerationCarPdfViewer";
import { StepThreeAssembly } from "@/components/practical/StepThreeAssembly";
import { StepFourAssembly } from "@/components/practical/StepFourAssembly";
import { StepSevenRailsAssembly } from "@/components/practical/StepSevenRailsAssembly";
import { StepEightAssembly } from "@/components/practical/StepEightAssembly";
import { StepNineAssemblyReview } from "@/components/practical/StepNineAssemblyReview";
import { StepTenAssembly } from "@/components/practical/StepTenAssembly";
import { StepElevenAssembly } from "@/components/practical/StepElevenAssembly";
import { StepTwelveAssembly } from "@/components/practical/StepTwelveAssembly";
import { StepThirteenAssembly } from "@/components/practical/StepThirteenAssembly";
import { StepFourteenAssembly } from "@/components/practical/StepFourteenAssembly";
import { StepFiveAssembly } from "@/components/practical/StepFiveAssembly";
import { StepSixAssembly } from "@/components/practical/StepSixAssembly";
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

  if (project.id === "acceleration-car") {
    return <AccelerationCarPdfViewer />;
  }

  return <BuildSession key={project.id} project={project} />;
}

function BuildSession({ project }: { project: PracticalProject }) {
  const { progress, isStepCompleted, toggleStepCompleted } = useProgress();
  const firstIncompleteIndex = project.steps.findIndex((step) => !isStepCompleted(step.id));
  const [currentIndex, setCurrentIndex] = useState(
    firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0,
  );
  const lessonScrollArea = useRef<HTMLElement>(null);
  const previousStepIndex = useRef(currentIndex);
  useLayoutEffect(() => {
    // Every new lesson starts at its heading, regardless of the preceding 3D workspace height.
    if (currentIndex !== previousStepIndex.current && lessonScrollArea.current) {
      lessonScrollArea.current.scrollTop = 0;
    }
    previousStepIndex.current = currentIndex;
  }, [currentIndex]);
  const [stage, setStage] = useState<SessionStage>("steps");
  const [stepThreeReady, setStepThreeReady] = useState(false);
  const [stepFourReady, setStepFourReady] = useState(false);
  const [stepFiveReady, setStepFiveReady] = useState(false);
  const [stepSixReady, setStepSixReady] = useState(false);
  const [preview3D, setPreview3D] = useState(true);
  const [previewStep2Ready, setPreviewStep2Ready] = useState(false);
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
  const isStepThree = project.id === "marksmanship" && currentStep.number === 3;
  const isStepFour = project.id === "marksmanship" && currentStep.number === 4;
  const isStepFive = project.id === "marksmanship" && currentStep.number === 5;
  const isStepSix = project.id === "marksmanship" && currentStep.number === 6;
  const isStepSeven = project.id === "marksmanship" && currentStep.number === 7;
  const isStepEight = project.id === "marksmanship" && currentStep.number === 8;
  const isStepNine = project.id === "marksmanship" && currentStep.number === 9;
  const isStepTen = project.id === "marksmanship" && currentStep.number === 10;
  const isStepEleven = project.id === "marksmanship" && currentStep.number === 11;
  const isStepTwelve = project.id === "marksmanship" && currentStep.number === 12;
  const isStepThirteen = project.id === "marksmanship" && currentStep.number === 13;
  const isStepFourteen = project.id === "marksmanship" && currentStep.number === 14;
  const isInteractiveMarksman = project.id === "marksmanship" && currentStep.number >= 1 && currentStep.number <= 14;
  const completedCount = project.steps.filter(step => isStepCompleted(step.id)).length;
  const displayedPercent = Math.round((completedCount / project.steps.length) * 100);
  const helpItem =
    project.troubleshooting.length > 0
      ? project.troubleshooting[currentIndex % project.troubleshooting.length]
      : undefined;
  const hasHelp = Boolean(helpItem || project.safetyNote);

  function finishCurrentStep() {
    if ((isStepThree && !stepThreeReady) || (isStepFour && !stepFourReady) || (isStepFive && !stepFiveReady) || (isStepSix && !stepSixReady)) return;
    toggleStepCompleted(currentStepId, true);
    if (isLastStep) {
      setStage("complete");
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  return (
    <div className="relative flex h-[100svh] flex-col overflow-hidden bg-white text-[#132654]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Cog className="absolute -left-12 top-[34%] size-24 text-[#168eea]/6 sm:size-28" strokeWidth={1.25} />
        <Puzzle className="absolute -right-9 top-[24%] size-20 rotate-12 text-[#39b54a]/6 sm:size-24" strokeWidth={1.25} />
        <Rocket className="absolute -right-7 bottom-[19%] size-16 -rotate-12 text-[#ec168c]/6 sm:size-20" strokeWidth={1.25} />
      </div>

      <header className="relative z-20 flex h-[66px] shrink-0 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:h-[76px] sm:px-8 [@media(max-height:700px)]:h-[58px]">
        <Link
          aria-label="Exit project and choose a robot"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-[0_6px_18px_rgba(20,44,84,0.08)] transition active:scale-95 sm:size-12 [@media(max-height:700px)]:size-10"
          to="/practical"
        >
          <ArrowLeft aria-hidden="true" className="size-5 sm:size-6" />
        </Link>

        <img
          alt="BE STEM READY"
          className="absolute left-1/2 top-1/2 h-[54px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain sm:h-[62px] [@media(max-height:700px)]:h-11"
          src="/home/be-stem-ready-logo.svg"
        />

        <span className="inline-flex min-w-[66px] items-center justify-center gap-1.5 rounded-full border border-[#168eea]/30 bg-[#eaf5ff] px-3 py-2 text-xs font-black text-[#0f69bd] shadow-sm sm:min-w-[76px] sm:text-sm [@media(max-height:700px)]:py-1.5">
          <CheckCircle2 aria-hidden="true" className="size-4" />
          {currentIndex + 1}/{project.steps.length}
        </span>
      </header>

      <main ref={lessonScrollArea} className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isInteractiveMarksman && (
          <nav aria-label="Robot step navigation" className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-4 py-2 backdrop-blur sm:px-8">
            <Button
              type="button"
              variant="outline"
              aria-label="Previous Step"
              className="min-h-11 rounded-xl border-[#cddceb] bg-white px-4 text-sm font-bold text-[#132654] shadow-sm hover:bg-[#eaf5ff]"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Previous Step
            </Button>
            <span className="text-xs font-semibold tabular-nums text-slate-500">
              Step {currentIndex + 1} of {project.steps.length}
            </span>
          </nav>
        )}
        <div className={`mx-auto w-full px-4 pb-4 pt-2.5 sm:px-8 sm:pb-6 sm:pt-4 [@media(max-height:700px)]:pt-2 ${isInteractiveMarksman ? "max-w-[1580px]" : "max-w-6xl"}`}>
          <section className={isInteractiveMarksman ? "text-left sm:text-center" : "text-center"}>
            <h1 className="mx-auto max-w-3xl text-[clamp(1.3rem,4vw,2.1rem)] font-black leading-tight tracking-[-0.035em] text-[#132654] [@media(max-height:700px)]:text-[clamp(1.25rem,5.5vw,1.8rem)]">
              {project.title}
            </h1>
            <p className="mt-0.5 text-[13px] font-bold text-[#168eea] sm:mt-1 sm:text-base">
              Step {currentIndex + 1} <span className="font-semibold text-slate-400">of {project.steps.length}</span>
            </p>

            <div className="mx-auto mt-2.5 max-w-4xl [@media(max-height:700px)]:mt-2">
              <div role="progressbar" aria-label="Completed robot building steps" aria-valuemin={0} aria-valuemax={100} aria-valuenow={displayedPercent} className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#168eea] transition-all duration-300"
                  style={{ width: `${displayedPercent}%` }}
                />
              </div>
            </div>
          </section>

          <div className={isInteractiveMarksman ? "mx-auto mt-2 w-full max-w-[1540px]" : "mx-auto mt-3 grid w-full max-w-5xl gap-3.5 md:mt-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-7 [@media(max-height:700px)]:mt-2.5"}>
            <div className="min-w-0">
              <div className={isInteractiveMarksman ? "relative w-full min-w-0" : "relative flex w-full items-center justify-center overflow-hidden rounded-[26px] border border-[#168eea]/20 bg-[#f7fbff] p-2 shadow-[0_12px_30px_rgba(21,75,125,0.09)] sm:p-3 md:min-h-[420px] md:rounded-[32px]"}>
              {!isInteractiveMarksman && <div aria-hidden="true" className="circuit-grid absolute inset-0 opacity-20" />}
              {project.id === "marksmanship" && currentStep.number <= 2 && preview3D && currentStep.image ? (
                <Marksman3DPreview
                  step={currentStep.number}
                  referenceImage={currentStep.image}
                  onReadyChange={setPreviewStep2Ready}
                   onCompleteStep={finishCurrentStep}
                  onBeginStep2={() => {
                    // This is an explicit learner action confirming parts prepared.
                    // Playing the animation alone never marks Step 2 completed.
                    toggleStepCompleted(currentStepId, true);
                    setPreviewStep2Ready(false);
                    setCurrentIndex(1);
                  }}
                />
              ) : project.id === "marksmanship" && currentStep.number === 3 ? (
                <StepThreeAssembly onReadyChange={setStepThreeReady} onCompleteStep={finishCurrentStep} />
              ) : project.id === "marksmanship" && currentStep.number === 4 ? (
                <StepFourAssembly onReadyChange={setStepFourReady} onBackToStep3={() => setCurrentIndex(2)} onCompleteStep={finishCurrentStep} />
              ) : isStepFive ? (
                <StepFiveAssembly onReadyChange={setStepFiveReady}
                  onBackToStep4={() => setCurrentIndex(3)}
                  onContinueToStep6={finishCurrentStep} />
              ) : isStepSix ? (
                <StepSixAssembly onReadyChange={setStepSixReady}
                  onBackToStep5={() => setCurrentIndex(4)}
                  onContinueToStep7={finishCurrentStep} />
              ) : isStepSeven ? (
                <StepSevenRailsAssembly onCompleteStep={finishCurrentStep} />
              ) : isStepEight ? (
                <StepEightAssembly onReadyChange={() => {}}
                  onBackToStep7={() => setCurrentIndex(6)}
                  onContinueToStep9={finishCurrentStep} />
              ) : isStepNine ? (
                <StepNineAssemblyReview onCompleteStep={finishCurrentStep} />
              ) : isStepTen ? (
                <StepTenAssembly onCompleteStep={finishCurrentStep} />
              ) : isStepEleven ? (
                <StepElevenAssembly onCompleteStep={finishCurrentStep} />
              ) : isStepTwelve ? (
                <StepTwelveAssembly onCompleteStep={finishCurrentStep} />
              ) : isStepThirteen ? (
                <StepThirteenAssembly onCompleteStep={finishCurrentStep} />
              ) : isStepFourteen ? (
                <StepFourteenAssembly onCompleteStep={finishCurrentStep} />
              ) : currentStep.image ? (
                <img
                  alt={`${project.title} step ${currentStep.number}: ${currentStep.title}`}
                  className="relative block max-h-[285px] w-full object-contain sm:max-h-[360px] md:max-h-[430px]"
                  loading="eager"
                  src={currentStep.image}
                />
              ) : (
                <RobotIllustration
                  className="relative min-h-[220px] w-full rounded-[22px] sm:min-h-[300px] md:min-h-[420px] md:rounded-[28px]"
                  variant={project.number - 1}
                />
              )}
            </div>
            </div>

            {!isInteractiveMarksman && <section className="min-w-0 md:rounded-[30px] md:border md:border-slate-200/90 md:bg-white md:p-7 md:shadow-[0_14px_36px_rgba(20,55,90,0.08)]">
              <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#168eea] sm:text-xs">
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Do this now
              </p>
              <h2 className="mt-1.5 text-[clamp(1.8rem,7.5vw,2.8rem)] font-black leading-[1.02] tracking-[-0.04em] text-[#132654] md:text-4xl [@media(max-height:700px)]:text-[1.55rem]">
                {currentStep.title}
              </h2>
              <div className="mt-2 h-1 w-10 rounded-full bg-[#f5a400]" />
              <p className="mt-3 text-[14px] font-medium leading-6 text-slate-500 sm:text-base sm:leading-7 [@media(max-height:700px)]:mt-2 [@media(max-height:700px)]:text-[12px] [@media(max-height:700px)]:leading-5">
                {project.id === "marksmanship" && preview3D && currentStep.number === 1
                    ? "Inspect the five separate 3D models. This preview uses the 24 mm short axle named in Step 2; the original Step 1 manual calls it a 3-hole long axle. Check your kit before building."
                    : project.id === "marksmanship" && preview3D && currentStep.number === 2
                      ? "Follow five guided 3D actions: line up the X-shaped short axle on the RIGHT with the motor’s front orange output socket, slide it LEFT into the motor, then attach the disc, connector and 5-hole beam on that same axle assembly. Exact seating depths and connector identity still require physical verification."
                      : currentStep.description}
              </p>

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
            </section>}
          </div>
        </div>
      </main>

      {!isInteractiveMarksman && <footer className="relative z-30 shrink-0 border-t border-slate-100 bg-white/97 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(20,55,90,0.05)] sm:px-8 sm:py-4">
        {project.id === "marksmanship" && currentStep.number === 2 && preview3D && !previewStep2Ready && (
          <p className="mx-auto mb-2 max-w-5xl text-center text-xs font-semibold text-[#132654]">
            Complete all five guided 3D actions to continue, or switch to the original manual.
          </p>
        )}
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
          {project.id === "marksmanship" && currentStep.number === 1 && preview3D ? (
            <div className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#eaf5ff] px-4 text-center text-sm font-bold text-[#0f69bd]">
              Use “Start Assembly — Step 2” in the 3D viewer
            </div>
          ) : (
            <Button
              className="min-h-12 flex-1 rounded-full bg-[#168eea] text-base font-black text-white shadow-[0_10px_26px_rgba(22,142,234,0.24)] hover:bg-[#0e82dd] sm:min-h-[52px]"
              disabled={(project.id === "marksmanship" && currentStep.number === 2 && preview3D && !previewStep2Ready) || (isStepThree && !stepThreeReady) || (isStepFour && !stepFourReady) || (isStepFive && !stepFiveReady) || (isStepSix && !stepSixReady)}
              title={isStepThree && !stepThreeReady ? "Complete all eight Step 3 actions first" : isStepFour && !stepFourReady ? "Complete all six Step 4 actions first" : isStepFive && !stepFiveReady ? "Confirm physical Step 5 preparation to proceed" : isStepSix && !stepSixReady ? "Finish and physically confirm all Step 6 attachments first" : undefined}
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
          )}
        </div>
      </footer>}
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
