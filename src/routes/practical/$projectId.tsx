import { useLayoutEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
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

import { Marksman3DPreview } from "@/components/practical/Marksman3DPreview";
import { AccelerationCarPdfViewer } from "@/components/practical/AccelerationCarPdfViewer";
import { PdfActivityViewer } from "@/components/practical/PdfActivityViewer";
import { pdfActivityManuals } from "@/data/pdfActivityManuals";
import { getLevelOneLecture } from "@/data/levelOneLectures";
import { getLevelTwoLecture } from "@/data/levelTwoLectures";
import { getLevelThreeLecture, getLevelThreeBuildingReferenceManual } from "@/data/levelThreeLectures";
import { getLevelFourBuildingManual } from "@/data/levelFourBuilding";
import { levelFourLearningManuals } from "@/data/levelFourLearning";
import { getLevelFiveSixBuildingManual, levelFiveSixLearningLectures } from "@/data/levelFiveSixContent";
import { LevelOneLearningStudio } from "@/components/practical/LevelOneLearningStudio";
import { BuildingStudioHeader, BuildingStepDrawer, BuildingFloatingDock, BuildingStudioCompletion } from "@/components/practical/BuildingStudio";
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
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search["mode"] === "learning" ? ("learning" as const) : ("building" as const),
    ...(search["variant"] === "optimized" ? { variant: "optimized" as const } : {}),
  }),
  component: PracticalProjectPage,
});

type SessionStage = "steps" | "complete";

function PracticalProjectPage() {
  const { projectId = "" } = Route.useParams();
  const { mode, variant } = Route.useSearch();
  const project = getProject(projectId);
  const { hydrated } = useProgress();

  if (!project) {
    return <MissingProject />;
  }

  const levelFourLecture = project.level === 4 ? levelFourLearningManuals[project.id] : undefined;
  const lecture = project.level === 1 ? getLevelOneLecture(project.id) :
    project.level === 2 ? getLevelTwoLecture(project.id) :
    project.level === 3 ? getLevelThreeLecture(project.id) :
    project.level === 4 && levelFourLecture
      ? { projectId: project.id, url: levelFourLecture.url, learningOnly: false } :
    project.level === 5 || project.level === 6 ? levelFiveSixLearningLectures[project.id] : undefined;
  // Respect the selected mode even when a project has only Learning slides.
  if (lecture && mode === "learning") {
    return <LevelOneLearningStudio key={project.id} projectId={project.id} title={project.title} level={project.level === 5 || project.level === 6 ? project.level : project.level === 4 ? 4 : project.level === 3 ? 3 : project.level === 2 ? 2 : 1} categoryId={project.categoryId} lecture={lecture} />;
  }

  if (!hydrated) {
    return <BuildLoading />;
  }

  if (project.level === 3 && mode === "building") {
    const reference = getLevelThreeBuildingReferenceManual(project.id);
    if (reference) return <PdfActivityViewer key={project.id + "-building-reference"} manual={reference} />;
  }

  if (project.level === 4 && mode === "building") {
    const buildingManual = getLevelFourBuildingManual(project.id, variant);
    if (buildingManual) {
      return <PdfActivityViewer key={project.id + "-" + (variant ?? "basic")} manual={buildingManual} />;
    }
  }

  if ((project.level === 5 || project.level === 6) && mode === "building") {
    const buildingManual = getLevelFiveSixBuildingManual(project.id, variant);
    if (buildingManual) {
      return <PdfActivityViewer key={project.id + "-" + (variant ?? "basic")} manual={buildingManual} />;
    }
  }

  if (project.id === "acceleration-car") {
    return <AccelerationCarPdfViewer />;
  }

  const pdfManual = pdfActivityManuals[project.id];
  if (pdfManual) {
    return <PdfActivityViewer key={project.id} manual={pdfManual} />;
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
  const [stepsOpen, setStepsOpen] = useState(false);
  const [dockExpanded, setDockExpanded] = useState(false);
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
    <div className="relative flex h-[100svh] flex-col overflow-hidden bg-[#f3faff] text-slate-800">


      <BuildingStudioHeader title={project.title} projectId={project.id} step={currentIndex + 1} total={project.steps.length}
        onOpenSteps={() => setStepsOpen(true)}
        onPreviousStep={() => setCurrentIndex(index => Math.max(0, index - 1))}
        previousDisabled={currentIndex === 0} />
      <BuildingStepDrawer open={stepsOpen} onOpenChange={setStepsOpen}
        title={project.title} activeIndex={currentIndex}
        items={project.steps.map(item => ({id: item.id, label: `Step ${item.number} · ${item.title}`, completed: isStepCompleted(item.id)}))}
        onSelect={index => setCurrentIndex(index)} />


      <main ref={lessonScrollArea} className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain">

        <div className={isInteractiveMarksman ? "mx-auto w-full max-w-[1540px] px-2 pb-4 pt-2 sm:px-4" : "mx-auto w-full max-w-[1540px] px-2 pb-48 pt-2 sm:px-4"}>


          <div className="mx-auto w-full max-w-[1540px]">
            <div className="min-w-0">
              <div className={isInteractiveMarksman ? "relative w-full min-w-0" : "relative flex min-h-[min(68dvh,650px)] w-full items-center justify-center overflow-hidden rounded-[26px] border border-sky-100 bg-[#f3faff] p-3 shadow-sm"}>
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
                  className="relative block max-h-[min(68dvh,720px)] w-full object-contain"
                  loading="eager"
                  src={currentStep.image}
                />
              ) : (
                <div
                  className="relative grid min-h-[220px] w-full place-items-center rounded-[22px] bg-sky-50 sm:min-h-[300px] md:min-h-[420px] md:rounded-[28px]"
                  role="img"
                  aria-label={project.title}
                >
                  <Bot className="size-28 text-sky-400" aria-hidden="true" />
                </div>
              )}
            </div>
            </div>


          </div>
        </div>
      </main>

      {!isInteractiveMarksman && (
        <BuildingFloatingDock label={`Step ${currentStep.number} · ${currentStep.title}`}
          instruction={currentStep.description} expanded={dockExpanded} onExpandedChange={setDockExpanded}
          onPrevious={() => setCurrentIndex(index => Math.max(0, index - 1))}
          previousDisabled={currentIndex === 0}
          onNext={finishCurrentStep} nextLabel={isLastStep ? "Finish Robot" : "Done & Next"}
          details={currentStep.note ? <p className={`mt-2 rounded-xl p-2 text-xs ${currentStep.note.type === "warning" ? "bg-amber-50" : "bg-sky-50"}`}>{currentStep.note.text}</p> : undefined}
        />
      )}

    </div>
  );
}

function BuildCelebration({ project, onReview }: {
  project: PracticalProject; studentName: string; onReview: () => void;
}) {
  return (
    <BuildingStudioCompletion title={project.title} onReview={onReview}>
      <Button asChild className="min-h-12 rounded-2xl bg-[#168eea] font-bold text-white hover:bg-[#0d7fda]">
        <Link params={{ projectId: project.id }} to="/projects/$projectId">
          Back to Project <ArrowRight aria-hidden="true" className="size-4"/>
        </Link>
      </Button>
    </BuildingStudioCompletion>
  );
}

function MissingProject() {
  return (
    <div className="grid h-full place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="text-2xl font-bold">We couldn’t find that robot.</h1>
        <Link className="mt-5 inline-flex items-center gap-2 font-semibold text-primary" to="/practical/levels">
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
