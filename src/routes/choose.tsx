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

  return (
    <div className="relative h-[100svh] overflow-y-auto bg-white text-[#132654]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <Cog className="absolute -left-9 top-[24%] size-20 text-[#2587e8]/8 sm:size-28" strokeWidth={1.4} />
        <Rocket className="absolute -right-8 top-[31%] size-20 -rotate-12 text-[#ec168c]/8 sm:size-28" strokeWidth={1.4} />
        <Puzzle className="absolute -right-8 bottom-[6%] size-20 text-[#39b54a]/7 sm:size-28" strokeWidth={1.4} />
        <Cog className="absolute -left-8 bottom-[4%] size-16 text-[#f3a10a]/8 sm:size-24" strokeWidth={1.4} />
      </div>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-100 bg-white/95 px-3 backdrop-blur sm:h-16 sm:px-6 lg:px-8 [@media(max-height:700px)]:h-12">
        <Link
          aria-label="Back to name entry"
          className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-[0_4px_12px_rgba(20,44,84,0.07)] transition active:scale-95 sm:size-11 [@media(max-height:700px)]:size-9"
          to="/join"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>

        <img
          alt="BE STEM READY"
          className="h-10 w-auto object-contain sm:h-12 [@media(max-height:700px)]:h-9"
          src="/home/be-stem-ready-logo.svg"
        />

        <Link
          aria-label="View progress"
          className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-[#132654] shadow-[0_4px_12px_rgba(20,44,84,0.07)] transition active:scale-95 sm:size-11 [@media(max-height:700px)]:size-9"
          to="/progress"
        >
          <LineChart aria-hidden="true" className="size-5" />
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-3 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-6 sm:pt-5 lg:px-8 [@media(max-height:700px)]:pt-2">
        <header className="text-center">
          <p className="text-[12px] font-extrabold text-[#2587e8] sm:text-sm [@media(max-height:700px)]:text-[11px]">
            Welcome, {studentName}!
          </p>
          <h1 className="mx-auto mt-1 max-w-3xl text-[clamp(1.85rem,8vw,3.1rem)] font-black leading-[0.94] tracking-[-0.045em] text-[#132654] sm:mt-1.5 [@media(max-height:700px)]:text-[clamp(1.6rem,7vw,2.35rem)]">
            Choose your next activity
          </h1>
          <p className="mx-auto mt-1.5 max-w-xl text-[11.5px] font-medium leading-4 text-slate-500 sm:mt-2 sm:text-sm sm:leading-5 [@media(max-height:700px)]:mt-1 [@media(max-height:700px)]:text-[10.5px]">
            Finish Learning and Build to unlock Quiz.
          </p>
        </header>

        <JourneyProgress
          completedRequirements={requirements.completedRequirements}
          hydrated={hydrated}
          learningComplete={requirements.learningComplete}
          quizComplete={quizComplete}
          quizUnlocked={requirements.quizUnlocked}
          robotComplete={requirements.robotComplete}
        />

        <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3 lg:grid-cols-3 lg:gap-5 [@media(max-height:700px)]:mt-2 [@media(max-height:700px)]:gap-2">
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
            to="/practical/levels"
          />
          <QuizChoice hydrated={hydrated} quizComplete={quizComplete} {...requirements} />
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
  completedRequirements,
}: {
  hydrated: boolean;
  learningComplete: boolean;
  robotComplete: boolean;
  quizComplete: boolean;
  quizUnlocked: boolean;
  completedRequirements: number;
}) {
  const steps = [
    { label: "LEARN", icon: BookOpen, color: BRAND.blue, complete: learningComplete, locked: false },
    { label: "BUILD ROBOT", icon: Bot, color: BRAND.orange, complete: robotComplete, locked: false },
    { label: "QUIZ & READY", icon: Puzzle, color: BRAND.green, complete: quizComplete, locked: !quizUnlocked },
  ] as const;

  return (
    <section className="mx-auto mt-2.5 w-full max-w-3xl sm:mt-4 [@media(max-height:700px)]:mt-2">
      <div className="relative rounded-[20px] border border-slate-200/90 bg-white/95 px-2.5 py-2 shadow-[0_6px_20px_rgba(35,77,126,0.07)] sm:rounded-[24px] sm:px-5 sm:py-3 [@media(max-height:700px)]:py-1.5">
        <div className="pointer-events-none absolute left-[17%] right-[17%] top-[26px] border-t-2 border-dashed border-slate-300 sm:top-[34px] [@media(max-height:700px)]:top-[23px]" />
        <div className="relative grid grid-cols-3 gap-1">
          {steps.map(({ label, icon: Icon, color, complete, locked }, index) => (
            <div className="flex min-w-0 flex-col items-center text-center" key={label}>
              <div
                className="relative z-10 grid size-11 place-items-center rounded-full border-[3px] border-white bg-white sm:size-14 [@media(max-height:700px)]:size-10"
                style={{ boxShadow: `0 0 0 2px ${color}24, 0 5px 12px rgba(25,55,90,0.08)` }}
              >
                <Icon className="size-[18px] sm:size-6 [@media(max-height:700px)]:size-4" style={{ color: locked ? "#94a3b8" : color }} strokeWidth={2.3} />
                <span
                  className="absolute -left-1 -top-1 grid size-[18px] place-items-center rounded-full text-[8px] font-black text-white sm:size-5 sm:text-[9px]"
                  style={{ backgroundColor: complete ? color : locked ? "#a8b2c3" : color }}
                >
                  {complete ? <Check className="size-3" /> : index + 1}
                </span>
                {locked ? (
                  <span className="absolute -right-1 -top-1 grid size-[18px] place-items-center rounded-full bg-slate-700 text-white sm:size-5">
                    <LockKeyhole className="size-3" />
                  </span>
                ) : null}
              </div>
              <p
                className="mt-1 truncate text-[7.5px] font-black tracking-[0.015em] sm:mt-1.5 sm:text-[9px] [@media(max-height:700px)]:text-[7px]"
                style={{ color: locked ? "#7b8798" : color }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-1.5 flex w-fit items-center gap-1.5 rounded-full border border-[#2587e8]/20 bg-white px-2.5 py-1 text-[9px] font-bold text-[#132654] shadow-sm sm:mt-2 sm:px-3 sm:text-[10px] [@media(max-height:700px)]:mt-1 [@media(max-height:700px)]:py-0.5">
        <span className="grid size-4 place-items-center rounded-full bg-[#2587e8] text-white sm:size-[18px]">
          <Check className="size-2.5" />
        </span>
        {hydrated ? `${completedRequirements} / 2 requirements complete` : "Checking progress…"}
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
  to: "/theory" | "/practical/levels" | "/quiz";
  accent: string;
  softBackground: string;
}) {
  return (
    <Link
      className="group relative flex min-h-[106px] items-center gap-3 overflow-hidden rounded-[22px] border bg-white p-2.5 pr-3 text-left shadow-[0_6px_20px_rgba(29,65,108,0.07)] transition active:scale-[0.99] sm:min-h-[118px] sm:gap-4 sm:p-3.5 lg:min-h-[230px] lg:flex-col lg:justify-center lg:p-5 lg:text-center [@media(max-height:700px)]:min-h-[96px] [@media(max-height:700px)]:p-2"
      style={{ borderColor: `${accent}35` }}
      to={to}
    >
      <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-[22px]" style={{ backgroundColor: accent }} />

      <span
        className="relative grid size-16 shrink-0 place-items-center rounded-[18px] sm:size-[72px] lg:size-24 lg:rounded-[24px] [@media(max-height:700px)]:size-14"
        style={{ backgroundColor: softBackground }}
      >
        <Icon aria-hidden="true" className="size-8 sm:size-9 lg:size-11 [@media(max-height:700px)]:size-7" style={{ color: accent }} strokeWidth={2.1} />
        {completed ? (
          <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full border-[3px] border-white text-white shadow-sm [@media(max-height:700px)]:size-5" style={{ backgroundColor: accent }}>
            <Check aria-hidden="true" className="size-3.5 [@media(max-height:700px)]:size-3" />
          </span>
        ) : null}
      </span>

      <span className="min-w-0 flex-1 lg:flex-none">
        <span className="block text-[18px] font-black leading-tight tracking-[-0.02em] text-[#132654] sm:text-xl lg:text-2xl [@media(max-height:700px)]:text-[16px]">
          {label}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-[11px] font-medium leading-[14px] text-slate-500 sm:mt-1 sm:text-xs sm:leading-4 lg:mt-2 lg:text-sm lg:leading-5 [@media(max-height:700px)]:text-[10px] [@media(max-height:700px)]:leading-[13px]">
          {description}
        </span>
        <span
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-extrabold sm:mt-2 sm:text-xs lg:mt-4 [@media(max-height:700px)]:mt-1 [@media(max-height:700px)]:text-[10px]"
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
          className="group relative flex min-h-[106px] w-full items-center gap-3 overflow-hidden rounded-[22px] border border-[#39b54a]/25 bg-white p-2.5 pr-3 text-left shadow-[0_6px_20px_rgba(29,65,108,0.07)] transition active:scale-[0.99] sm:min-h-[118px] sm:gap-4 sm:p-3.5 lg:min-h-[230px] lg:flex-col lg:justify-center lg:p-5 lg:text-center [@media(max-height:700px)]:min-h-[96px] [@media(max-height:700px)]:p-2"
          type="button"
        >
          <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-[22px] bg-[#39b54a]" />

          <span className="relative grid size-16 shrink-0 place-items-center rounded-[18px] bg-[#eef7ec] sm:size-[72px] lg:size-24 lg:rounded-[24px] [@media(max-height:700px)]:size-14">
            <BrainCircuit aria-hidden="true" className="size-8 text-[#39b54a] sm:size-9 lg:size-11 [@media(max-height:700px)]:size-7" strokeWidth={2.1} />
            <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full border-[3px] border-white bg-slate-700 text-white shadow-sm [@media(max-height:700px)]:size-5">
              <LockKeyhole aria-hidden="true" className="size-3.5 [@media(max-height:700px)]:size-3" />
            </span>
          </span>

          <span className="min-w-0 flex-1 lg:flex-none">
            <span className="block text-[18px] font-black leading-tight tracking-[-0.02em] text-[#132654] sm:text-xl lg:text-2xl [@media(max-height:700px)]:text-[16px]">Quiz</span>
            <span className="mt-0.5 line-clamp-2 block text-[11px] font-medium leading-[14px] text-slate-500 sm:mt-1 sm:text-xs sm:leading-4 lg:mt-2 lg:text-sm lg:leading-5 [@media(max-height:700px)]:text-[10px] [@media(max-height:700px)]:leading-[13px]">
              Complete Learning and Robot first.
            </span>
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#eef7ec] px-2 py-0.5 text-[9.5px] font-extrabold text-slate-600 sm:mt-2 sm:text-[10.5px] lg:mt-4 [@media(max-height:700px)]:mt-1 [@media(max-height:700px)]:text-[9px]">
              <LockKeyhole aria-hidden="true" className="size-3" />
              {hydrated ? `${completedRequirements}/2 completed` : "Checking…"}
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
