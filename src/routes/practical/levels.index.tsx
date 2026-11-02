import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bot,
  Compass,
  Cpu,
  Cog,
  Grid2X2,
  Lightbulb,
  Shapes,
  Sparkles,
  Trophy,
} from "lucide-react";
import { LevelOneBackdrop } from "@/components/practical/LevelOneHeader";
import { SyllabusHeader } from "@/components/practical/SyllabusHeader";
import { getLevelTotals } from "@/data/advancedSyllabus";
import { LEVEL_ONE_CATEGORIES } from "@/data/levelOneCategories";
import { LEVEL_ONE_PROJECT_COUNT } from "@/data/levelOneProjects";

export const Route = createFileRoute("/practical/levels/")({
  component: SyllabusLevelsPage,
});

const levels = [1, 2, 3, 4, 5, 6] as const;

const tones = [
  { panel: "#eaf5ff", ink: "#168eea" },
  { panel: "#eaf8ed", ink: "#259a41" },
  { panel: "#fff5dc", ink: "#bd7800" },
  { panel: "#fff0f8", ink: "#d4217f" },
  { panel: "#eaf5ff", ink: "#168eea" },
  { panel: "#eaf8ed", ink: "#259a41" },
] as const;

// Designed for phones first: two columns, six recognizable worlds, one clear action.
const mobileTones = [
  { panel: "#eaf5ff", border: "#d0e8fd", ink: "#146cae", icon: Bot },
  { panel: "#ecf9ed", border: "#ccebd4", ink: "#287943", icon: Cog },
  { panel: "#fff5dd", border: "#f9e5b8", ink: "#94600b", icon: Lightbulb },
  { panel: "#fff0f7", border: "#f6d5e5", ink: "#ae3d76", icon: Shapes },
  { panel: "#f2efff", border: "#ded5fd", ink: "#6947b6", icon: Cpu },
  { panel: "#eaf9fa", border: "#c7edf1", ink: "#217986", icon: Trophy },
] as const;

function levelTotals(level: number) {
  return level === 1
    ? { categories: LEVEL_ONE_CATEGORIES.length, entries: LEVEL_ONE_PROJECT_COUNT }
    : getLevelTotals(level);
}

function SyllabusLevelsPage() {
  return (
    <div className="relative h-[100dvh] overflow-y-auto overscroll-y-contain bg-[#f7faff] text-[#17294c]">
      <LevelOneBackdrop />
      <SyllabusHeader label="Home" />

      <main className="relative mx-auto max-w-7xl px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pt-10">
        {/* The phone experience is intentionally different from the desktop catalogue. */}
        <div className="mx-auto max-w-[470px] md:hidden">
          <section aria-labelledby="mobile-levels-title" className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-8 size-40 rounded-full bg-[#dcefff]/65 blur-3xl" />
            <div className="relative flex items-center justify-between gap-2">
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#cae5fc] bg-white px-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#167dcc] shadow-sm">
                <Sparkles className="size-3.5" aria-hidden="true" /> Robotics journey
              </span>
              <span className="rounded-full bg-[#e9f2fb] px-3 py-1.5 text-[10px] font-extrabold text-[#436280]">
                6 LEVELS
              </span>
            </div>
            <h1 id="mobile-levels-title" className="relative mt-4 text-[clamp(2.15rem,9vw,2.85rem)] font-black leading-[1.07] tracking-[-0.048em]">
              Choose your <span className="text-[#168eea]">next level.</span>
            </h1>
            <p className="relative mt-2 max-w-[350px] text-[13px] font-medium leading-[1.55] text-[#526580]">
              Pick a level, discover its categories, and start creating robots.
            </p>
          </section>

          <section aria-label="Choose one of six robotics levels" className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-black tracking-tight">Explore all levels</h2>
              <span className="text-[11px] font-extrabold tracking-[0.12em] text-[#8192ab]">01 — 06</span>
            </div>
            <ul aria-label="Syllabus levels" className="grid grid-cols-2 gap-3 max-[350px]:gap-2.5">
              {levels.map((level, index) => {
                const tone = mobileTones[index] ?? mobileTones[0];
                const totals = levelTotals(level);
                const Icon = tone.icon;
                const card = (
                  <div
                    className="group relative flex min-h-[190px] h-full flex-col overflow-hidden rounded-[24px] border px-3.5 pb-3.5 pt-3.5 shadow-[0_9px_22px_rgba(39,80,135,0.06)] transition duration-200 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                    style={{ backgroundColor: tone.panel, borderColor: tone.border }}
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute -right-1 top-14 text-[104px] font-black leading-none tracking-[-0.08em] opacity-[0.045]">
                      {level}
                    </span>
                    <div className="relative z-10 flex items-start justify-between gap-1">
                      <span
                        className="inline-flex h-7 items-center rounded-full bg-white/85 px-2.5 text-[10px] font-black tracking-[0.07em]"
                        style={{ color: tone.ink }}
                      >
                        LEVEL {String(level).padStart(2, "0")}
                      </span>
                      <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-white/80 shadow-[0_3px_10px_rgba(39,80,135,0.05)]" style={{ color: tone.ink }}>
                        <Icon aria-hidden="true" className="size-[23px]" strokeWidth={2.1} />
                      </span>
                    </div>
                    <h3 className="relative z-10 mt-3 text-[21px] font-black leading-tight tracking-[-0.035em]">
                      Level {level}
                    </h3>
                    <p className="relative z-10 mt-1 text-[11px] font-semibold leading-[1.35] text-[#53657c]">
                      {totals.categories} categories <span aria-hidden="true">·</span> {totals.entries} projects
                    </p>
                    <div className="relative z-10 mt-auto flex items-center justify-between gap-1 pt-4" style={{ color: tone.ink }}>
                      <span className="text-[11px] font-black">Explore level</span>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/90 shadow-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none">
                        <ArrowUpRight className="size-[17px]" strokeWidth={2.5} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                );
                return (
                  <li key={level} className="min-w-0">
                    {level === 1 ? (
                      <Link
                        to="/practical/level-1"
                        aria-label={"Explore Level " + level + ": " + totals.categories + " categories and " + totals.entries + " projects"}
                        className="block h-full rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]"
                      >
                        {card}
                      </Link>
                    ) : (
                      <Link
                        to="/practical/levels/$levelNumber"
                        params={{ levelNumber: String(level) }}
                        aria-label={"Explore Level " + level + ": " + totals.categories + " categories and " + totals.entries + " projects"}
                        className="block h-full rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]"
                      >
                        {card}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <aside className="mt-5 flex items-center gap-3 rounded-[20px] border border-[#dcebf8] bg-white px-4 py-3.5 shadow-[0_5px_16px_rgba(39,80,135,0.04)]">
            <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#eaf5ff] text-[#168eea]">
              <Compass className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[12px] font-extrabold text-[#17294c]">Your next build starts here</p>
              <p className="mt-0.5 text-[11px] font-medium leading-4 text-[#65758c]">
                Open a level, pick a category, then select your robot.
              </p>
            </div>
          </aside>
        </div>

        {/* Preserve the existing spacious tablet/desktop experience. */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-1 rounded-full bg-[#eaf5ff] px-4 py-1.5 text-xs font-extrabold tracking-wide text-[#168eea]">
              <Sparkles className="size-4" aria-hidden="true" /> BE STEM READY
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.3rem)] font-black tracking-tight">
              Pick your <span className="text-[#168eea]">level!</span>
            </h1>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600 sm:text-base">
              Explore the real project categories from your six-level robotics syllabus.
              Open a level, find a project, and choose Learning or Building.
            </p>
          </div>
          <ul aria-label="Syllabus levels" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 sm:mt-10">
            {levels.map((level, index) => {
              const tone = tones[index] ?? tones[0];
              const totals = levelTotals(level);
              const card = (
                <div className="group flex h-full min-h-[200px] flex-col rounded-[30px] border border-sky-100 bg-white p-5 shadow-[0_8px_25px_rgba(22,142,234,.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(22,142,234,.13)] motion-reduce:transform-none motion-reduce:transition-none sm:p-6">
                  <div className="flex items-center justify-between">
                    <span style={{ background: tone.panel, color: tone.ink }} className="grid size-14 place-items-center rounded-2xl text-2xl font-black">
                      {level}
                    </span>
                    <BookOpen className="size-6 text-slate-300" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-xl font-extrabold text-slate-800">Level {level}</h2>
                  <p className="mt-1 text-sm font-medium text-slate-600">{totals.categories} categories · {totals.entries} projects</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold" style={{ color: tone.ink }}>
                    Explore projects <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              );
              return (
                <li key={level} className="min-w-0">
                  {level === 1 ? (
                    <Link to="/practical/level-1" aria-label="Explore Level 1 categories"
                      className="block h-full rounded-[30px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">{card}</Link>
                  ) : (
                    <Link to="/practical/levels/$levelNumber" params={{ levelNumber: String(level) }}
                      aria-label={"Explore Level " + level + " categories"}
                      className="block h-full rounded-[30px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">{card}</Link>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex items-center justify-center gap-2 text-center text-sm font-medium text-slate-600">
            <Grid2X2 className="size-5 text-[#168eea]" aria-hidden="true" />
            Every level keeps its own syllabus categories.
          </div>
        </div>
      </main>
    </div>
  );
}
