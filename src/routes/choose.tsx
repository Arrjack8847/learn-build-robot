import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  Cog,
  LineChart,
  LockKeyhole,
  Puzzle,
  Rocket,
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
import { useProgress } from "@/context/ProgressContext";
import { getJourneyRequirements } from "@/lib/journey-progress";

export const Route = createFileRoute("/choose")({
  component: ChooseCategoryPage,
});

const BRAND = {
  blue: "#2587e8",
  orange: "#f3a10a",
  green: "#39b54a",
  pink: "#ec168c",
  navy: "#132654",
};

function ChooseCategoryPage() {
  const { progress, hydrated } = useProgress();
  const studentName = progress.studentName || "Builder";
  const requirements = getJourneyRequirements(progress);
  const quizComplete = progress.quizAttempts.length > 0;
  const completedJourneySteps =
    Number(requirements.learningComplete) +
    Number(requirements.robotComplete) +
    Number(quizComplete);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white text-[#132654]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Cog className="absolute -left-8 top-28 size-24 text-[#2587e8]/10" strokeWidth={1.5} />
        <Rocket className="absolute -right-7 top-[24%] size-24 -rotate-12 text-[#ec168c]/10" strokeWidth={1.5} />
        <Puzzle className="absolute -right-7 bottom-4 size-24 text-[#39b54a]/8" strokeWidth={1.5} />
        <Cog className="absolute -left-8 bottom-3 size-20 text-[#f3a10a]/10" strokeWidth={1.5} />
      </div>

      <header className="relative z-10 flex h-[70px] shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:h-[78px] sm:px-8">
        <Link
          aria-label="Back to name entry"
          className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-[0_5px_16px_rgba(20,44,84,0.08)] transition active:scale-95 sm:size-12"
          to="/join"
        >
          <ArrowLeft aria-hidden="true" className="size-5 sm:size-6" />
        </Link>

        <img
          alt="BE STEM READY"
          className="h-[52px] w-auto object-contain sm:h-[60px]"
          src="/home/be-stem-ready-logo.svg"
        />

        <Link
          aria-label="View progress"
          className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-[0_5px_16px_rgba(20,44,84,0.08)] transition active:scale-95 sm:size-12"
          to="/progress"
        >
          <LineChart aria-hidden="true" className="size-5 sm:size-6" />
        </Link>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-3 pt-3 sm:px-8 sm:pb-5 sm:pt-5">
        <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
          <header className="shrink-0 text-center">
            <p className="text-[13px] font-extrabold text-[#2587e8] sm:text-base">
              Welcome, {studentName}!
            </p>
            <h1 className="mx-auto mt-1 max-w-3xl text-[clamp(2rem,9vw,3.25rem)] font-black leading-[0.95] tracking-[-0.045em] text-[#132654]">
              Choose your next activity
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-[12px] font-medium leading-4 text-slate-500 sm:text-sm sm:leading-5">
              Finish Learning and Build to unlock Quiz.
            </p>
          </header>

          <JourneyProgress
            completed={completedJourneySteps}
            hydrated={hydrated}
            learningComplete={requirements.learningComplete}
            quizComplete={quizComplete}
            quizUnlocked={requirements.quizUnlocked}
            robotComplete={requirements.robotComplete}
          />

          <div className="mt-3 grid min-h-0 flex-1 grid-rows-3 gap-2.5 lg:grid-cols-3 lg:grid-rows-1 lg:gap-5">
            <ActivityChoice
              accent={BRAND.blue}
              completed={requirements.learningComplete}
              description="Understand how your robot works."
              icon={BookOpen}
              label="Learning"
              softBackground="#eaf5ff"
              to="/theory"
            />
            <ActivityChoice
              accent={BRAND.orange}
              completed={requirements.robotComplete}
              description="Build it one easy step at a time."
              icon={Bot}
              label="Build a Robot"
              softBackground="#fff4d9"
              to="/practical"
            />
            <QuizChoice hydrated={hydrated} quizComplete={quizComplete} {...requirements} />
          </div>
        </div>
      </main>
    </div>
  );
}

function JourneyProgress({
  hydrated,
  learningComplete,
  robotComplete,
  quizComplete,
  quizUnlocked,
  completed,
}: {
  hydrated: boolean;
  learningComplete: boolean;
  robotComplete: boolean;
  quizComplete: boolean;
  quizUnlocked: boolean;
  completed: number;
}) {
  const steps = [
    { label: "LEARN", icon: BookOpen, color: BRAND.blue, complete: learningComplete, locked: false },
    { label: "BUILD ROBOT", icon: Bot, color: BRAND.orange, complete: robotComplete, locked: false },
    { label: "QUIZ & READY", icon: Puzzle, color: BRAND.green, complete: quizComplete, locked: !quizUnlocked },
  ] as const;

  return (
    <section className="mx-auto mt-3 w-full max-w-3xl shrink-0 sm:mt-5">
      <div className="relative rounded-[24px] border border-slate-200/90 bg-white/95 px-3 py-2.5 shadow-[0_8px_24px_rgba(35,77,126,0.08)] sm:px-5 sm:py-4">
        <div className="pointer-events-none absolute left-[17%] right-[17%] top-[32px] border-t-2 border-dashed border-slate-300 sm:top-[41px]" />
        <div className="relative grid grid-cols-3 gap-2">
          {steps.map(({ label, icon: Icon, color, complete, locked }, index) => (
            <div className="flex min-w-0 flex-col items-center text-center" key={label}>
              <div
                className="relative z-10 grid size-[52px] place-items-center rounded-full border-[3px] border-white bg-white shadow-[0_6px_14px_rgba(25,55,90,0.10)] sm:size-[68px]"
                style={{ boxShadow: `0 0 0 2px ${color}24, 0 6px 14px rgba(25,55,90,0.10)` }}
              >
                <Icon className="size-5 sm:size-7" style={{ color: locked ? "#94a3b8" : color }} strokeWidth={2.3} />
                <span
                  className="absolute -left-1 -top-1 grid size-5 place-items-center rounded-full text-[9px] font-black text-white sm:size-6 sm:text-[10px]"
                  style={{ backgroundColor: complete ? color : locked ? "#a8b2c3" : color }}
                >
                  {complete ? <Check className="size-3" /> : index + 1}
                </span>
                {locked ? (
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-slate-700 text-white sm:size-6">
                    <LockKeyhole className="size-3" />
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 truncate text-[8.5px] font-black tracking-[0.02em] sm:mt-2 sm:text-[10px]" style={{ color: locked ? "#7b8798" : color }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto -mt-1.5 flex w-fit items-center gap-2 rounded-full border border-[#2587e8]/20 bg-white px-3 py-1 text-[10px] font-bold text-[#132654] shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
        <span className="grid size-5 place-items-center rounded-full bg-[#2587e8] text-white">
          <Check className="size-3" />
        </span>
        {hydrated ? `${completed} of 3 completed` : "Checking progress…"}
      </div>
    </section>
  );
}

function ActivityChoice({
  icon: Icon,
  label,
  description,
  completed,
  to,
  accent,
  softBackground,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  completed: boolean;
  to: "/theory" | "/practical" | "/quiz";
  accent: string;
  softBackground: string;
}) {
  return (
    <Link
      className="group relative flex min-h-0 items-center gap-3 overflow-hidden rounded-[24px] border bg-white p-3 text-left shadow-[0_8px_24px_rgba(29,65,108,0.08)] transition active:scale-[0.99] sm:gap-4 sm:p-4 lg:flex-col lg:justify-center lg:p-6 lg:text-center"
      style={{ borderColor: `${accent}35` }}
      to={to}
    >
      <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-[24px]" style={{ backgroundColor: accent }} />

      <span
        className="relative grid size-[74px] shrink-0 place-items-center rounded-[22px] sm:size-[86px] lg:size-28 lg:rounded-[28px]"
        style={{ backgroundColor: softBackground }}
      >
        <Icon aria-hidden="true" className="size-9 sm:size-10 lg:size-12" style={{ color: accent }} strokeWidth={2.1} />
        {completed ? (
          <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full border-[3px] border-white text-white shadow-sm" style={{ backgroundColor: accent }}>
            <Check aria-hidden="true" className="size-4" />
          </span>
        ) : null}
      </span>

      <span className="min-w-0 flex-1 lg:flex-none">
        <span className="block text-[19px] font-black leading-tight tracking-[-0.02em] text-[#132654] sm:text-[22px] lg:text-2xl">
          {label}
        </span>
        <span className="mt-1 line-clamp-2 block text-[11px] font-medium leading-[15px] text-slate-500 sm:text-xs sm:leading-4 lg:mt-2 lg:text-sm lg:leading-5">
          {description}
        </span>
        <span
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-0 py-0.5 text-[11px] font-extrabold sm:text-xs lg:mt-4"
          style={{ color: accent }}
        >
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
  quizComplete,
}: {
  hydrated: boolean;
  learningComplete: boolean;
  robotComplete: boolean;
  quizUnlocked: boolean;
  completedRequirements: number;
  quizComplete: boolean;
}) {
  if (hydrated && quizUnlocked) {
    return (
      <ActivityChoice
        accent={BRAND.green}
        completed={quizComplete}
        description="Test what you learned and built."
        icon={BrainCircuit}
        label="Quiz"
        softBackground="#eaf8ea"
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
          className="group relative flex min-h-0 w-full items-center gap-3 overflow-hidden rounded-[24px] border border-[#39b54a]/25 bg-white p-3 text-left shadow-[0_8px_24px_rgba(29,65,108,0.08)] transition active:scale-[0.99] sm:gap-4 sm:p-4 lg:flex-col lg:justify-center lg:p-6 lg:text-center"
          type="button"
        >
          <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-[24px] bg-[#39b54a]" />

          <span className="relative grid size-[74px] shrink-0 place-items-center rounded-[22px] bg-[#eef7ec] sm:size-[86px] lg:size-28 lg:rounded-[28px]">
            <BrainCircuit aria-hidden="true" className="size-9 text-[#39b54a] sm:size-10 lg:size-12" strokeWidth={2.1} />
            <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full border-[3px] border-white bg-slate-700 text-white shadow-sm">
              <LockKeyhole aria-hidden="true" className="size-3.5" />
            </span>
          </span>

          <span className="min-w-0 flex-1 lg:flex-none">
            <span className="block text-[19px] font-black leading-tight tracking-[-0.02em] text-[#132654] sm:text-[22px] lg:text-2xl">Quiz</span>
            <span className="mt-1 line-clamp-2 block text-[11px] font-medium leading-[15px] text-slate-500 sm:text-xs sm:leading-4 lg:mt-2 lg:text-sm lg:leading-5">
              Complete Learning and Robot first.
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#eef7ec] px-2.5 py-1 text-[10px] font-extrabold text-slate-600 sm:text-[11px]">
              <LockKeyhole aria-hidden="true" className="size-3.5" />
              {hydrated ? `${completedRequirements}/2 completed` : "Checking progress…"}
            </span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-[#eef7ec] text-[#39b54a]">
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
      <span className={`grid size-10 place-items-center rounded-xl ${complete ? "bg-success-soft text-success" : "bg-card text-muted-foreground"}`}>
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
