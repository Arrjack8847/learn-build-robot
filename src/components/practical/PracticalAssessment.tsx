import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  BrainCircuit,
  Camera,
  CheckCircle2,
  CircleAlert,
  ImagePlus,
  LoaderCircle,
  RefreshCcw,
  Sparkles,
  Trash2,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useProgress } from "@/context/ProgressContext";
import { getModule } from "@/data/theory";
import { gradePractical } from "@/lib/mock-ai";
import type { PracticalGrade, PracticalProject } from "@/types/learning";

const MAX_EVIDENCE_BYTES = 50 * 1024 * 1024;

interface EvidencePreview {
  file: File;
  url: string;
}

export function PracticalAssessment({ project }: { project: PracticalProject }) {
  const { progress, addPracticalGrade, isStepCompleted } = useProgress();
  const [explanation, setExplanation] = useState("");
  const [evidence, setEvidence] = useState<EvidencePreview | null>(null);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  const completedSteps = project.steps.filter((step) => isStepCompleted(step.id)).length;
  const wordCount = explanation.trim().split(/\s+/).filter(Boolean).length;
  const lastGrade = progress.practicalGrades.find((grade) => grade.projectId === project.id);

  const assessment = useMutation({
    mutationFn: () =>
      gradePractical({
        project,
        completedSteps,
        totalSteps: project.steps.length,
        explanation,
        hasEvidence: Boolean(evidence),
      }),
    onSuccess: (grade) => addPracticalGrade(grade),
  });

  useEffect(() => {
    return () => {
      if (evidence) URL.revokeObjectURL(evidence.url);
    };
  }, [evidence]);

  function handleEvidenceChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setEvidenceError("Choose an image or video file.");
      return;
    }
    if (file.size > MAX_EVIDENCE_BYTES) {
      setEvidenceError("Choose a file smaller than 50 MB for this frontend demonstration.");
      return;
    }

    setEvidenceError(null);
    assessment.reset();
    setEvidence({ file, url: URL.createObjectURL(file) });
  }

  function removeEvidence() {
    assessment.reset();
    setEvidence(null);
    setEvidenceError(null);
  }

  function updateExplanation(value: string) {
    if (assessment.data) assessment.reset();
    setExplanation(value);
  }

  if (assessment.isPending) {
    return (
      <section
        aria-labelledby="assessment-loading-heading"
        aria-live="polite"
        className="rounded-3xl border bg-card p-8 text-center shadow-card sm:p-12"
        id="ai-assessment"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <LoaderCircle aria-hidden="true" className="size-7 animate-spin" />
        </span>
        <h2 id="assessment-loading-heading" className="mt-5 text-xl font-bold">
          Reviewing your robot project
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The simulated AI is checking completion, evidence, functionality and your explanation.
        </p>
      </section>
    );
  }

  if (assessment.data) {
    return (
      <PracticalResults
        grade={assessment.data}
        onEdit={() => assessment.reset()}
        onRetry={() => assessment.mutate()}
      />
    );
  }

  return (
    <section
      aria-labelledby="assessment-heading"
      className="rounded-3xl border border-primary/20 bg-primary-soft/35 p-6 shadow-card sm:p-8"
      id="ai-assessment"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <BrainCircuit aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Simulated AI assessment
            </p>
            <h2 id="assessment-heading" className="mt-1 text-xl font-bold">
              Submit your robot build
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Add a photo or video and explain how the robot works. Files stay in this browser and
              are not uploaded in the frontend prototype.
            </p>
          </div>
        </div>
        {lastGrade ? (
          <span className="w-fit rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
            Last score: {lastGrade.total}/100
          </span>
        ) : null}
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold" htmlFor={`${project.id}-evidence`}>
              Build evidence <span className="font-normal text-muted-foreground">(recommended)</span>
            </label>
            <span className="text-xs text-muted-foreground">Image or video · max 50 MB</span>
          </div>

          {evidence ? (
            <div className="mt-3 overflow-hidden rounded-2xl border bg-card">
              <div className="aspect-video bg-navy">
                {evidence.file.type.startsWith("video/") ? (
                  <video
                    aria-label="Selected robot build video preview"
                    className="h-full w-full object-contain"
                    controls
                    src={evidence.url}
                  />
                ) : (
                  <img
                    alt="Selected robot build evidence preview"
                    className="h-full w-full object-contain"
                    src={evidence.url}
                  />
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-2">
                  {evidence.file.type.startsWith("video/") ? (
                    <Video aria-hidden="true" className="size-4 shrink-0 text-primary" />
                  ) : (
                    <Camera aria-hidden="true" className="size-4 shrink-0 text-primary" />
                  )}
                  <span className="truncate text-sm font-medium">{evidence.file.name}</span>
                </div>
                <Button
                  aria-label="Remove selected evidence"
                  className="shrink-0"
                  onClick={removeEvidence}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : (
            <label
              className="mt-3 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-card p-6 text-center transition hover:border-primary hover:bg-primary-soft/30"
              htmlFor={`${project.id}-evidence`}
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                <ImagePlus aria-hidden="true" className="size-6" />
              </span>
              <span className="mt-4 text-sm font-bold">Choose build evidence</span>
              <span className="mt-1 text-xs leading-5 text-muted-foreground">
                A clear view of the assembly and wiring gives a stronger demonstration score.
              </span>
            </label>
          )}
          <Input
            accept="image/*,video/*"
            className="sr-only"
            id={`${project.id}-evidence`}
            onChange={handleEvidenceChange}
            type="file"
          />
          {evidenceError ? (
            <p className="mt-2 text-sm font-medium text-destructive" role="alert">
              {evidenceError}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold" htmlFor={`${project.id}-explanation`}>
              How does your robot work?
            </label>
            <span className="text-xs text-muted-foreground">{wordCount} words</span>
          </div>
          <Textarea
            className="mt-3 min-h-56 rounded-2xl bg-card p-4 leading-6"
            id={`${project.id}-explanation`}
            onChange={(event) => updateExplanation(event.target.value)}
            placeholder="Explain what the robot senses, how the controller decides, what the robot does, and what you tested…"
            value={explanation}
          />
          <div className="mt-3 rounded-xl bg-card p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground">For useful feedback, include:</p>
            <ul className="mt-2 space-y-1">
              <li>• What the robot senses</li>
              <li>• What decision the controller makes</li>
              <li>• What action happens and how you tested it</li>
            </ul>
          </div>
        </div>
      </div>

      {assessment.isError ? (
        <div className="mt-5 flex items-start gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive" role="alert">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          The assessment could not be completed. Please try again.
        </div>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 border-t border-primary/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Current build record: {completedSteps}/{project.steps.length} steps complete.
        </p>
        <Button
          className="min-h-11 rounded-xl px-6"
          disabled={wordCount < 10}
          onClick={() => assessment.mutate()}
        >
          <Sparkles aria-hidden="true" />
          Submit for AI review
        </Button>
      </div>
      {wordCount < 10 ? (
        <p className="mt-2 text-right text-xs text-muted-foreground">
          Write at least 10 words before submitting.
        </p>
      ) : null}
    </section>
  );
}

function PracticalResults({
  grade,
  onEdit,
  onRetry,
}: {
  grade: PracticalGrade;
  onEdit: () => void;
  onRetry: () => void;
}) {
  const strongScore = grade.total >= 80;
  const breakdown = [
    { label: "Assembly", value: grade.breakdown.assembly, maximum: 30 },
    { label: "Components", value: grade.breakdown.components, maximum: 25 },
    { label: "Functionality", value: grade.breakdown.functionality, maximum: 25 },
    { label: "Explanation", value: grade.breakdown.explanation, maximum: 20 },
  ];
  const recommendedModules = grade.recommendedModuleIds
    .map((moduleId) => getModule(moduleId))
    .filter((module) => module !== undefined);

  return (
    <section
      aria-labelledby="practical-results-heading"
      aria-live="polite"
      className="space-y-6 rounded-3xl border bg-card p-6 shadow-card sm:p-8"
      id="ai-assessment"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          className={`grid size-24 shrink-0 place-items-center rounded-full text-2xl font-bold ${
            strongScore ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
          }`}
        >
          {grade.total}/100
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Simulated AI result
          </p>
          <h2 id="practical-results-heading" className="mt-1 text-2xl font-bold">
            {strongScore ? "Build ready for the next challenge" : "Useful progress — refine and test again"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your assessment is saved on this device. Use the breakdown and recommendations to plan
            your next test.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {breakdown.map((item) => {
          const percent = Math.round((item.value / item.maximum) * 100);
          return (
            <article className="rounded-2xl bg-secondary/70 p-4" key={item.label}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{item.label}</h3>
                <span className="text-sm font-bold">
                  {item.value}/{item.maximum}
                </span>
              </div>
              <Progress className="mt-3 bg-background" value={percent} />
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <FeedbackPanel icon={CheckCircle2} items={grade.strengths} title="Strengths" tone="success" />
        <FeedbackPanel icon={CircleAlert} items={grade.issues} title="Issues found" tone="danger" />
        <FeedbackPanel icon={RefreshCcw} items={grade.improvements} title="Next improvements" tone="warning" />
      </div>

      {recommendedModules.length ? (
        <section aria-labelledby="recommended-theory-heading" className="rounded-2xl border p-5">
          <h3 id="recommended-theory-heading" className="font-bold">
            Recommended theory
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Revisit these modules before your next build attempt.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {recommendedModules.map((module) => {
              const firstLesson = module.lessons[0];
              return firstLesson ? (
                <Link
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary-soft px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft/70"
                  key={module.id}
                  params={{ lessonId: firstLesson.id }}
                  to="/theory/$lessonId"
                >
                  Module {module.number}: {module.title}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              ) : null;
            })}
          </div>
        </section>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button className="min-h-11 rounded-xl" onClick={onEdit} variant="outline">
          Edit submission
        </Button>
        <Button className="min-h-11 rounded-xl" onClick={onRetry}>
          <Sparkles aria-hidden="true" />
          Assess again
        </Button>
      </div>
    </section>
  );
}

function FeedbackPanel({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: typeof CheckCircle2;
  tone: "success" | "warning" | "danger";
}) {
  const toneClasses = {
    success: "bg-success-soft [&_svg]:text-success",
    warning: "bg-warning-soft [&_svg]:text-warning",
    danger: "bg-destructive/10 [&_svg]:text-destructive",
  };

  return (
    <article className={`rounded-2xl p-5 ${toneClasses[tone]}`}>
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="size-5" />
        <h3 className="font-bold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span aria-hidden="true">•</span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
