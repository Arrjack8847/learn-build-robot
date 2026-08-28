import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";
import { competitionTips } from "@/data/competition";
import { getProject } from "@/data/practical";

export const Route = createFileRoute("/practical/$projectId/competition")({
  component: CompetitionTipsPage,
});

function CompetitionTipsPage() {
  const { projectId = "" } = Route.useParams();
  const project = getProject(projectId);
  const { progress } = useProgress();
  const [tipIndex, setTipIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!project) {
    return <MissingProject />;
  }

  if (finished) {
    return (
      <CompetitionReady
        onReview={() => {
          setTipIndex(0);
          setFinished(false);
        }}
        studentName={progress.studentName || "Builder"}
      />
    );
  }

  const tip = competitionTips[tipIndex];
  if (!tip) return null;
  const Icon = tip.icon;
  const isLastTip = tipIndex === competitionTips.length - 1;
  const displayedPercent = Math.round(((tipIndex + 1) / competitionTips.length) * 100);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b bg-card px-4 sm:px-8">
        <Link
          aria-label="Back to the completed robot"
          className="grid size-11 shrink-0 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          params={{ projectId: project.id }}
          to="/practical/$projectId"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-bold">Competition Prep</p>
          <p className="text-xs text-muted-foreground">
            Tip {tipIndex + 1} of {competitionTips.length}
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-warning-soft text-warning">
          <Trophy aria-hidden="true" className="size-5" />
        </span>
      </header>

      <Progress
        aria-label={`Competition tip ${tipIndex + 1} of ${competitionTips.length}`}
        className="h-1.5 rounded-none bg-secondary [&>div]:bg-warning"
        value={displayedPercent}
      />

      <main className="grid min-h-0 flex-1 place-items-center px-5 py-2 sm:px-8 sm:py-6">
        <article className="w-full max-w-2xl text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-[1.5rem] bg-warning-soft text-warning shadow-card sm:size-28 sm:rounded-[2rem]">
            <Icon aria-hidden="true" className="size-10 sm:size-14" />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-warning">
            Winning tip {tipIndex + 1}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-5xl">{tip.title}</h1>
          <p className="mx-auto mt-2 line-clamp-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mt-3 sm:line-clamp-none sm:text-base sm:leading-7">
            {tip.description}
          </p>
          <div className="mx-auto mt-3 flex max-w-xl items-start gap-3 rounded-2xl bg-primary-soft p-3 text-left sm:mt-5 sm:p-5">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Try this</p>
              <p className="mt-1 text-sm font-semibold leading-6">{tip.action}</p>
            </div>
          </div>
        </article>
      </main>

      <footer className="border-t bg-card px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:py-4">
        <div className="mx-auto flex w-full max-w-2xl gap-3">
          <Button
            aria-label="Go to previous competition tip"
            className="min-h-12 rounded-2xl px-4 sm:px-6"
            disabled={tipIndex === 0}
            onClick={() => setTipIndex((index) => Math.max(0, index - 1))}
            type="button"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            className="min-h-12 flex-1 rounded-2xl text-base font-bold"
            onClick={() => {
              if (isLastTip) {
                setFinished(true);
              } else {
                setTipIndex((index) => index + 1);
              }
            }}
            type="button"
          >
            {isLastTip ? "I’m Ready to Compete" : "Next Tip"}
            {isLastTip ? (
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

function CompetitionReady({
  studentName,
  onReview,
}: {
  studentName: string;
  onReview: () => void;
}) {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-navy px-5 py-6 text-center text-navy-foreground">
      <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-50" />
      <main className="relative w-full max-w-2xl">
        <span className="mx-auto grid size-24 place-items-center rounded-[2rem] bg-success-soft text-success shadow-lift sm:size-28">
          <CheckCircle2 aria-hidden="true" className="size-12 sm:size-14" />
        </span>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-success">
          Preparation complete
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          You’re Ready to Compete, {studentName}!
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-navy-muted sm:text-base sm:leading-7">
          Build carefully, test more than once and follow the official competition rules. You’ve got this!
        </p>

        <div className="mx-auto mt-7 grid max-w-md gap-3">
          <Button asChild className="min-h-12 rounded-2xl text-base font-bold">
            <Link to="/practical">
              Choose Another Robot
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            className="min-h-12 rounded-2xl border-white/15 bg-navy-hover text-navy-foreground hover:bg-navy-hover/80"
            onClick={onReview}
            type="button"
            variant="outline"
          >
            <RotateCcw aria-hidden="true" />
            Review Competition Tips
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
