import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  CircuitBoard,
  LineChart,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react";

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
import { APP_NAME } from "@/config/app";
import { useProgress } from "@/context/ProgressContext";
import { getJourneyRequirements } from "@/lib/journey-progress";

export const Route = createFileRoute("/choose")({
  component: ChooseCategoryPage,
});

function ChooseCategoryPage() {
  const { progress, hydrated } = useProgress();
  const studentName = progress.studentName || "Builder";
  const requirements = getJourneyRequirements(progress);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="flex min-h-16 items-center justify-between border-b bg-card px-4 sm:px-8">
        <Link
          aria-label="Back to name entry"
          className="grid size-11 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          to="/join"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <CircuitBoard aria-hidden="true" className="size-4" />
          </span>
          <span className="font-bold">{APP_NAME}</span>
        </div>
        <Link
          aria-label="View progress"
          className="grid size-11 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          to="/progress"
        >
          <LineChart aria-hidden="true" className="size-5" />
        </Link>
      </header>

      <main className="flex min-h-0 flex-1 flex-col justify-center px-4 py-3 sm:px-8 sm:py-5">
        <div className="mx-auto w-full max-w-6xl">
          <header className="text-center">
            <p className="text-xs font-semibold text-primary sm:text-sm">Welcome, {studentName}!</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:mt-2 sm:text-4xl">
              Choose your next activity
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              Learn and build to unlock your Quiz.
            </p>
          </header>

          <div className="mt-3 grid gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-5">
            <CategoryChoice
              completed={requirements.learningComplete}
              description="Understand how your robot works."
              icon={BookOpen}
              label="Learning"
              to="/theory"
            />
            <CategoryChoice
              completed={requirements.robotComplete}
              description="Build it one easy step at a time."
              icon={Bot}
              label="Build a Robot"
              to="/practical"
            />
            <QuizChoice hydrated={hydrated} {...requirements} />
          </div>
        </div>
      </main>
    </div>
  );
}

function CategoryChoice({
  icon: Icon,
  label,
  description,
  completed,
  to,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  completed: boolean;
  to: "/theory" | "/practical" | "/quiz";
}) {
  return (
    <Link
      className="group flex min-h-24 items-center gap-3 rounded-[1.5rem] border bg-card p-3 text-left shadow-card transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift sm:min-h-64 sm:flex-col sm:justify-center sm:rounded-[2rem] sm:p-5 sm:text-center"
      to={to}
    >
      <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground sm:size-18 sm:rounded-[1.75rem]">
        <Icon aria-hidden="true" className="size-6 sm:size-8" />
        {completed ? (
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-success text-success-foreground">
            <Check aria-hidden="true" className="size-3" />
          </span>
        ) : null}
      </span>
      <span className="min-w-0 flex-1 sm:flex-none">
        <span className="block text-lg font-bold sm:text-2xl">{label}</span>
        <span className="mt-0.5 line-clamp-1 block text-xs leading-5 text-muted-foreground sm:mt-2 sm:line-clamp-2 sm:text-sm sm:leading-6">
          {description}
        </span>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary sm:mt-4 sm:text-sm">
          {completed ? "Review" : "Choose"}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}

function QuizChoice({
  hydrated,
  learningComplete,
  robotComplete,
  quizUnlocked,
  completedRequirements,
}: {
  hydrated: boolean;
  learningComplete: boolean;
  robotComplete: boolean;
  quizUnlocked: boolean;
  completedRequirements: number;
}) {
  if (hydrated && quizUnlocked) {
    return (
      <CategoryChoice
        completed
        description="Test what you learned and built."
        icon={BrainCircuit}
        label="Quiz"
        to="/quiz"
      />
    );
  }

  const continueTo = learningComplete ? "/practical" : "/theory";
  const continueLabel = learningComplete ? "Continue Robot" : "Continue Learning";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="group flex min-h-24 items-center gap-3 rounded-[1.5rem] border bg-secondary/60 p-3 text-left text-muted-foreground shadow-card transition hover:border-primary/30 sm:min-h-64 sm:flex-col sm:justify-center sm:rounded-[2rem] sm:p-5 sm:text-center"
          type="button"
        >
          <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-card text-muted-foreground sm:size-18 sm:rounded-[1.75rem]">
            <BrainCircuit aria-hidden="true" className="size-6 sm:size-8" />
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-foreground text-background">
              <LockKeyhole aria-hidden="true" className="size-3" />
            </span>
          </span>
          <span className="min-w-0 flex-1 sm:flex-none">
            <span className="block text-lg font-bold text-foreground sm:text-2xl">Quiz</span>
            <span className="mt-0.5 block text-xs leading-5 sm:mt-2 sm:text-sm sm:leading-6">
              Complete Learning and Robot first.
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold sm:mt-4 sm:text-sm">
              <LockKeyhole aria-hidden="true" className="size-3.5" />
              {hydrated ? `${completedRequirements}/2 completed` : "Checking progress…"}
            </span>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
            <LockKeyhole aria-hidden="true" className="size-6" />
          </span>
          <DialogTitle>Your Quiz is still locked</DialogTitle>
          <DialogDescription className="leading-6">
            Finish both activities and the Quiz will unlock automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <RequirementRow complete={learningComplete} icon={BookOpen} label="Finish Learning" />
          <RequirementRow complete={robotComplete} icon={Bot} label="Finish Build a Robot" />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Not Now
            </Button>
          </DialogClose>
          <Button asChild>
            <Link to={continueTo}>
              {continueLabel}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RequirementRow({
  icon: Icon,
  label,
  complete,
}: {
  icon: LucideIcon;
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-secondary p-4">
      <span
        className={`grid size-10 place-items-center rounded-xl ${
          complete ? "bg-success-soft text-success" : "bg-card text-muted-foreground"
        }`}
      >
        {complete ? (
          <CheckCircle2 aria-hidden="true" className="size-5" />
        ) : (
          <Icon aria-hidden="true" className="size-5" />
        )}
      </span>
      <span className="font-semibold">{label}</span>
      <span className="ml-auto text-xs font-bold uppercase tracking-wider">
        {complete ? "Done" : "Not yet"}
      </span>
    </div>
  );
}
