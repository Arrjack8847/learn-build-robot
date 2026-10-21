import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Grid2X2, Sparkles } from "lucide-react";
import { LevelOneBackdrop } from "@/components/practical/LevelOneHeader";
import { SyllabusHeader } from "@/components/practical/SyllabusHeader";
import { getLevelTotals } from "@/data/advancedSyllabus";

export const Route = createFileRoute("/practical/levels/")({
  component: SyllabusLevelsPage,
});

const levels = [1, 2, 3, 4, 5, 6] as const;
const tones = [
  {panel:"#eaf5ff", ink:"#168eea"}, {panel:"#eaf8ed", ink:"#259a41"},
  {panel:"#fff5dc", ink:"#bd7800"}, {panel:"#fff0f8", ink:"#d4217f"},
  {panel:"#eaf5ff", ink:"#168eea"}, {panel:"#eaf8ed", ink:"#259a41"},
] as const;

function SyllabusLevelsPage() {
  return (
    <div className="relative h-[100dvh] overflow-y-auto bg-white text-slate-800">
      <LevelOneBackdrop />
      <SyllabusHeader label="Activities" />
      <main className="relative mx-auto max-w-7xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-7 sm:px-7 sm:pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1 rounded-full bg-[#eaf5ff] px-4 py-1.5 text-xs font-extrabold tracking-wide text-[#168eea]">
            <Sparkles className="size-4" aria-hidden="true" /> BE STEM READY
          </p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.3rem)] font-black tracking-tight">
            Pick your <span className="text-[#168eea]">level!</span>
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-600 sm:text-base">
            Explore the real project categories from your six-level robotics syllabus.
            Open a level to see what you can build.
          </p>
        </div>

        <ul aria-label="Syllabus levels" className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 sm:mt-10">
          {levels.map((level, index) => {
            const tone = tones[index];
            const totals = level === 1 ? {categories:14, entries:59} : getLevelTotals(level);
            const body = (
              <div className="group flex h-full min-h-[200px] flex-col rounded-[30px] border border-sky-100 bg-white p-5 shadow-[0_8px_25px_rgba(22,142,234,.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(22,142,234,.13)] motion-reduce:transform-none motion-reduce:transition-none sm:p-6">
                <div className="flex items-center justify-between">
                  <span style={{background:tone.panel,color:tone.ink}} className="grid size-14 place-items-center rounded-2xl text-2xl font-black">
                    {level}
                  </span>
                  <BookOpen className="size-6 text-slate-300" aria-hidden="true"/>
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-slate-800">Level {level}</h2>
                <p className="mt-1 text-sm font-medium text-slate-600">{totals.categories} categories · {totals.entries} projects</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold" style={{color:tone.ink}}>
                  Explore projects <ArrowRight className="size-4" aria-hidden="true"/>
                </span>
              </div>
            );
            return (
              <li key={level} className="min-w-0">
                {level === 1 ? (
                  <Link to="/practical/level-1" aria-label="Explore Level 1 categories"
                    className="block h-full rounded-[30px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">{body}</Link>
                ) : (
                  <Link to="/practical/levels/$levelNumber" params={{levelNumber:String(level)}}
                    aria-label={`Explore Level ${level} categories`}
                    className="block h-full rounded-[30px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">{body}</Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-sm font-medium text-slate-600">
          <Grid2X2 className="size-5 text-[#168eea]" aria-hidden="true"/>
          Every level keeps its own syllabus categories.
        </div>
      </main>
    </div>
  );
}
