import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  RefreshCcw,
  RotateCcw,
  Trophy,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgress } from "@/context/ProgressContext";
import type { PracticalGrade, QuizAttempt } from "@/types/learning";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const { progress, stats, hydrated, resetProgress } = useProgress();

  const items = [
    {
      label: "Overall learning",
      value: stats.overallPercent,
      display: `${stats.overallPercent}%`,
      detail: "Theory lessons and practical steps",
      icon: Trophy,
    },
    {
      label: "Theory",
      value: stats.theoryPercent,
      display: `${stats.completedLessons}/${stats.totalLessons}`,
      detail: "Lessons completed",
      icon: BookOpen,
    },
    {
      label: "Robot Practical",
      value: stats.practicalPercent,
      display: `${stats.completedProjects}/${stats.totalProjects}`,
      detail: "Projects completed",
      icon: Bot,
    },
    {
      label: "Average quiz",
      value: stats.averageQuizScore ?? 0,
      display: stats.averageQuizScore === null ? "No attempts" : `${stats.averageQuizScore}%`,
      detail: `${progress.quizAttempts.length} saved attempt${progress.quizAttempts.length === 1 ? "" : "s"}`,
      icon: ClipboardCheck,
    },
  ];

  const defaultResultsTab =
    progress.quizAttempts.length === 0 && progress.practicalGrades.length > 0 ? "practical" : "quizzes";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Student record</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Progress</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Review completed learning, quiz feedback and practical assessment history saved on this
            device.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="min-h-11 rounded-xl" disabled={!hydrated} variant="outline">
              <RotateCcw aria-hidden="true" />
              Reset progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all student progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes completed lessons, build steps, quiz attempts and practical grades from
                this device. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep progress</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={resetProgress}
              >
                Reset everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <section aria-label="Progress summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ label, value, display, detail, icon: Icon }) => (
          <article className="rounded-3xl border bg-card p-6 shadow-card" key={label}>
            <div className="flex items-center justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="text-2xl font-bold">{hydrated ? display : "—"}</span>
            </div>
            <h2 className="mt-5 font-bold">{label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
            <Progress
              aria-label={`${value}% ${label.toLowerCase()} progress`}
              className="mt-5 bg-secondary [&>div]:bg-success"
              value={value}
            />
          </article>
        ))}
      </section>

      <section aria-labelledby="results-history-heading" className="rounded-3xl border bg-card shadow-card">
        <div className="flex items-start gap-4 border-b p-6 sm:p-8">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            <BrainCircuit aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 id="results-history-heading" className="text-lg font-bold">
              AI results history
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Compare theory quizzes and practical build assessments across your learning journey.
            </p>
          </div>
        </div>

        {!hydrated ? (
          <p className="p-8 text-sm text-muted-foreground" aria-live="polite">
            Loading saved results…
          </p>
        ) : (
          <Tabs className="p-4 sm:p-6" defaultValue={defaultResultsTab}>
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl">
              <TabsTrigger className="min-h-10 rounded-lg" value="quizzes">
                Theory quizzes ({progress.quizAttempts.length})
              </TabsTrigger>
              <TabsTrigger className="min-h-10 rounded-lg" value="practical">
                Practical grades ({progress.practicalGrades.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent className="mt-5" value="quizzes">
              <QuizHistory attempts={progress.quizAttempts} />
            </TabsContent>
            <TabsContent className="mt-5" value="practical">
              <PracticalHistory grades={progress.practicalGrades} />
            </TabsContent>
          </Tabs>
        )}
      </section>
    </div>
  );
}

function QuizHistory({ attempts }: { attempts: QuizAttempt[] }) {
  if (attempts.length === 0) {
    return (
      <EmptyResults
        description="Open a theory lesson and generate its knowledge check. Your score and feedback will appear here."
        label="Browse theory lessons"
        to="/theory"
      />
    );
  }

  return (
    <div className="divide-y rounded-2xl border">
      {attempts.map((attempt) => (
        <article className="p-5 sm:p-6" key={attempt.id}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">{attempt.lessonTitle}</h3>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  {attempt.score}/{attempt.total} correct
                </span>
              </div>
              <time className="mt-1 block text-xs text-muted-foreground" dateTime={attempt.takenAt}>
                {formatAttemptDate(attempt.takenAt)}
              </time>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <ResultNote
                  icon={CheckCircle2}
                  label="Strength"
                  text={attempt.strengths[0] ?? "Quiz completed"}
                  tone="success"
                />
                <ResultNote
                  icon={RefreshCcw}
                  label="Review"
                  text={attempt.review[0] ?? "No review needed"}
                  tone="warning"
                />
              </div>
            </div>
            <ResultScoreLink
              label={`Revisit ${attempt.lessonTitle}`}
              params={{ lessonId: attempt.lessonId }}
              score={attempt.percentage}
              to="/theory/$lessonId"
            />
          </div>
        </article>
      ))}
    </div>
  );
}

function PracticalHistory({ grades }: { grades: PracticalGrade[] }) {
  if (grades.length === 0) {
    return (
      <EmptyResults
        description="Complete robot build steps and submit an explanation for simulated AI feedback."
        label="Browse robot projects"
        to="/practical"
      />
    );
  }

  return (
    <div className="divide-y rounded-2xl border">
      {grades.map((grade) => (
        <article className="p-5 sm:p-6" key={grade.id}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">{grade.projectTitle}</h3>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Assembly {grade.breakdown.assembly}/30 · Function {grade.breakdown.functionality}/25
                </span>
              </div>
              <time className="mt-1 block text-xs text-muted-foreground" dateTime={grade.gradedAt}>
                {formatAttemptDate(grade.gradedAt)}
              </time>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <ResultNote
                  icon={CheckCircle2}
                  label="Strength"
                  text={grade.strengths[0] ?? "Project submitted"}
                  tone="success"
                />
                <ResultNote
                  icon={RefreshCcw}
                  label="Improve"
                  text={grade.improvements[0] ?? "Continue testing"}
                  tone="warning"
                />
              </div>
            </div>
            <ResultScoreLink
              label={`Revisit ${grade.projectTitle}`}
              params={{ projectId: grade.projectId }}
              score={grade.total}
              to="/practical/$projectId"
            />
          </div>
        </article>
      ))}
    </div>
  );
}

type ResultScoreLinkProps =
  | {
      score: number;
      label: string;
      to: "/theory/$lessonId";
      params: { lessonId: string };
    }
  | {
      score: number;
      label: string;
      to: "/practical/$projectId";
      params: { projectId: string };
    };

function ResultScoreLink(props: ResultScoreLinkProps) {
  return (
    <div className="flex shrink-0 items-center gap-4 sm:pl-6">
      <span
        className={`grid size-20 place-items-center rounded-full text-xl font-bold ${
          props.score >= 80 ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
        }`}
      >
        {props.score}%
      </span>
      {props.to === "/theory/$lessonId" ? (
        <Link
          aria-label={props.label}
          className="grid size-11 place-items-center rounded-xl border text-primary transition hover:bg-secondary"
          params={props.params}
          to="/theory/$lessonId"
        >
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      ) : (
        <Link
          aria-label={props.label}
          className="grid size-11 place-items-center rounded-xl border text-primary transition hover:bg-secondary"
          params={props.params}
          to="/practical/$projectId"
        >
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      )}
    </div>
  );
}

function EmptyResults({
  description,
  label,
  to,
}: {
  description: string;
  label: string;
  to: "/theory" | "/practical";
}) {
  return (
    <div className="p-6 text-center sm:p-10">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
        <ClipboardCheck aria-hidden="true" className="size-6" />
      </span>
      <h3 className="mt-4 font-bold">No saved results yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        to={to}
      >
        {label}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

function ResultNote({
  icon: Icon,
  label,
  text,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  text: string;
  tone: "success" | "warning";
}) {
  return (
    <div
      className={`flex items-start gap-2 rounded-xl p-3 text-sm ${
        tone === "success" ? "bg-success-soft" : "bg-warning-soft"
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`mt-0.5 size-4 shrink-0 ${tone === "success" ? "text-success" : "text-warning"}`}
      />
      <p className="leading-5">
        <span className="font-semibold">{label}:</span> {text}
      </p>
    </div>
  );
}

function formatAttemptDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
