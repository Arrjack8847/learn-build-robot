import { useState, type FormEvent } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CircuitBoard, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/config/app";
import { useProgress } from "@/context/ProgressContext";

export const Route = createFileRoute("/join")({
  component: JoinJourneyPage,
});

function JoinJourneyPage() {
  const { progress, hydrated, setStudentName } = useProgress();

  if (!hydrated) {
    return <JourneyLoading />;
  }

  return <NameForm initialName={progress.studentName} onSave={setStudentName} />;
}

function NameForm({
  initialName,
  onSave,
}: {
  initialName: string;
  onSave: (name: string) => void;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState(initialName);
  const cleanName = name.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cleanName) return;
    onSave(cleanName);
    void navigate({ to: "/choose" });
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="flex min-h-16 items-center justify-between border-b bg-card px-4 sm:px-8">
        <Link
          aria-label="Back to competition information"
          className="grid size-11 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          to="/"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <CircuitBoard aria-hidden="true" className="size-4" />
          </span>
          <span className="font-bold">{APP_NAME}</span>
        </div>
        <span aria-hidden="true" className="size-11" />
      </header>

      <main className="grid min-h-0 flex-1 place-items-center px-5 py-6">
        <form className="w-full max-w-xl text-center" onSubmit={handleSubmit}>
          <span className="mx-auto grid size-20 place-items-center rounded-[1.75rem] bg-primary-soft text-primary">
            <UserRound aria-hidden="true" className="size-9" />
          </span>
          <p className="mt-5 text-sm font-semibold text-primary">Before we begin</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            What should we call you?
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Enter your name so RoboLearn can guide you through the competition journey.
          </p>

          <label className="sr-only" htmlFor="student-name">
            Your name
          </label>
          <Input
            autoComplete="name"
            autoFocus
            className="mx-auto mt-7 h-14 max-w-md rounded-2xl bg-card px-5 text-center text-lg font-semibold shadow-card"
            id="student-name"
            maxLength={32}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            value={name}
          />

          <Button
            className="mt-5 min-h-12 w-full max-w-md rounded-2xl text-base"
            disabled={!cleanName}
            type="submit"
          >
            Continue
            <ArrowRight aria-hidden="true" />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            No account, password or class code is needed.
          </p>
        </form>
      </main>
    </div>
  );
}

function JourneyLoading() {
  return (
    <div className="grid h-full place-items-center bg-background" aria-live="polite">
      <p className="text-sm font-semibold text-muted-foreground">Preparing your journey…</p>
    </div>
  );
}
