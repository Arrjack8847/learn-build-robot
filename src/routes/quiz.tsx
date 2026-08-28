import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProgress } from "@/context/ProgressContext";
import { getJourneyRequirements } from "@/lib/journey-progress";

export const Route = createFileRoute("/quiz")({
  component: QuizGatewayPage,
});

function QuizGatewayPage() {
  const { progress, hydrated } = useProgress();
  const requirements = getJourneyRequirements(progress);

  if (!hydrated) {
    return (
      <div aria-live="polite" className="grid h-full place-items-center bg-background">
        <p className="text-sm font-semibold text-muted-foreground">Checking your Quiz…</p>
      </div>
    );
  }

  if (!requirements.quizUnlocked) {
    const continueTo = requirements.learningComplete ? "/practical" : "/theory";

    return (
      <div className="relative grid h-full place-items-center overflow-hidden bg-background px-5 py-6 text-center">
        <Link
          aria-label="Back to category choice"
          className="absolute left-4 top-4 grid size-11 place-items-center rounded-2xl border bg-card text-foreground transition hover:bg-secondary sm:left-8 sm:top-6"
          to="/choose"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <main className="w-full max-w-xl">
          <span className="mx-auto grid size-20 place-items-center rounded-[1.5rem] bg-secondary text-muted-foreground sm:size-24 sm:rounded-[2rem]">
            <LockKeyhole aria-hidden="true" className="size-10 sm:size-12" />
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Your Quiz is locked
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            Complete Learning and Build a Robot first. Your Quiz will unlock automatically.
          </p>
          <div className="mx-auto mt-6 grid max-w-md gap-3 text-left">
            <Requirement
              complete={requirements.learningComplete}
              icon={BookOpen}
              label="Finish Learning"
            />
            <Requirement
              complete={requirements.robotComplete}
              icon={Bot}
              label="Finish Build a Robot"
            />
          </div>
          <Button asChild className="mt-6 min-h-12 rounded-2xl px-7 text-base font-bold">
            <Link to={continueTo}>
              Continue My Journey
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-navy px-5 py-6 text-center text-navy-foreground">
      <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-50" />
      <Link
        aria-label="Back to category choice"
        className="absolute left-4 top-4 z-10 grid size-11 place-items-center rounded-2xl border border-white/15 bg-navy-hover text-navy-foreground transition hover:bg-navy sm:left-8 sm:top-6"
        to="/choose"
      >
        <ArrowLeft aria-hidden="true" className="size-5" />
      </Link>
      <main className="relative w-full max-w-2xl">
        <span className="mx-auto grid size-24 place-items-center rounded-[2rem] bg-success-soft text-success shadow-lift sm:size-28">
          <BrainCircuit aria-hidden="true" className="size-12 sm:size-14" />
        </span>
        <div className="mt-5 flex justify-center gap-2 text-warning" aria-hidden="true">
          <Sparkles className="size-5" />
          <Sparkles className="size-7" />
          <Sparkles className="size-5" />
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-success">
          Learning + Robot complete
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          Quiz Unlocked, {progress.studentName || "Builder"}!
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-navy-muted sm:text-base sm:leading-7">
          Your Quiz category is ready. We will design the separate AI quiz experience in the next
          phase.
        </p>
        <Button asChild className="mt-7 min-h-12 rounded-2xl px-7 text-base font-bold">
          <Link to="/choose">
            Back to My Journey
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </main>
    </div>
  );
}

function Requirement({
  icon: Icon,
  label,
  complete,
}: {
  icon: typeof BookOpen;
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
      <span
        className={`grid size-10 place-items-center rounded-xl ${
          complete ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
        }`}
      >
        {complete ? (
          <CheckCircle2 aria-hidden="true" className="size-5" />
        ) : (
          <Icon aria-hidden="true" className="size-5" />
        )}
      </span>
      <span className="font-semibold">{label}</span>
      <span className="ml-auto text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {complete ? "Done" : "Not yet"}
      </span>
    </div>
  );
}
