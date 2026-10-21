import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, Bot, Car, Cog, Hand, HandMetal, Lightbulb, MonitorPlay,
  Orbit, PawPrint, Puzzle, Radar, ScanEye, Search, Shapes, Truck,
  type LucideIcon,
} from "lucide-react";
import { LEVEL_ONE_CATEGORIES, type LevelOneCategory } from "@/data/levelOneCategories";
import { getLevelOneProjects, LEVEL_ONE_PROJECT_COUNT } from "@/data/levelOneProjects";
import { LevelOneBackdrop, LevelOneHeader, categoryTones } from "@/components/practical/LevelOneHeader";

export const Route = createFileRoute("/practical/level-1/")({
  component: LevelOneCategoriesPage,
});

const CATEGORY_ICONS: Record<LevelOneCategory["icon"], LucideIcon> = {
  radar: Radar,
  paw: PawPrint,
  shapes: Shapes,
  "monitor-play": MonitorPlay,
  bot: Bot,
  lightbulb: Lightbulb,
  hand: Hand,
  cog: Cog,
  "hand-metal": HandMetal,
  orbit: Orbit,
  puzzle: Puzzle,
  "scan-eye": ScanEye,
  truck: Truck,
  car: Car,
};

function LevelOneCategoriesPage() {
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase();
  const filteredCategories = LEVEL_ONE_CATEGORIES.filter(category =>
    category.name.toLocaleLowerCase().includes(query)
  );

  return (
    <div className="relative h-[100dvh] overflow-y-auto bg-white text-slate-800">
      <LevelOneBackdrop/>
      <LevelOneHeader backTo="/practical/levels" backLabel="All levels"/>
      <main className="relative mx-auto max-w-7xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-7 sm:px-7 sm:pt-10">
        <section className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center rounded-full bg-[#eaf5ff] px-4 py-1.5 text-xs font-extrabold tracking-wider text-[#168eea]">
            LEVEL 1 · LITTLE INVENTORS
          </p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.4rem)] font-black tracking-tight">
            Pick your <span className="text-[#168eea]">STEM world!</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
            Explore {LEVEL_ONE_PROJECT_COUNT} real projects across the 14 categories of your Level 1 robotics syllabus.
          </p>
        </section>

        <section className="mt-7 sm:mt-9" aria-label="Level 1 category selection">
          <div className="mb-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-lg font-extrabold text-slate-800">
              All categories <span className="ml-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs text-[#168eea]">{LEVEL_ONE_CATEGORIES.length}</span>
            </h2>
            <label className="relative block w-full sm:max-w-xs">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400"/>
              <span className="sr-only">Find a category</span>
              <input type="search" value={search} onChange={event => setSearch(event.target.value)}
                placeholder="Search categories"
                className="min-h-12 w-full rounded-2xl border border-sky-100 bg-white py-2 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#168eea] focus:ring-2 focus:ring-sky-200"/>
            </label>
          </div>

          {filteredCategories.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {filteredCategories.map(category => {
                const Icon = CATEGORY_ICONS[category.icon];
                const tone = categoryTones[category.tone];
                const number = LEVEL_ONE_CATEGORIES.indexOf(category) + 1;
                return (
                  <li key={category.id} className="min-w-0">
                    <Link to="/practical/level-1/$categoryId" params={{ categoryId: category.id }}
                      aria-label={`Explore ${category.name}`}
                      className="group flex h-full min-h-[160px] flex-col items-start rounded-[26px] border bg-white p-4 shadow-[0_6px_22px_rgba(22,142,234,.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(22,142,234,.13)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea] motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[184px] sm:p-5"
                      style={{ borderColor: tone.border }}>
                      <div className="flex w-full items-start justify-between gap-3">
                        <span className="grid size-13 shrink-0 place-items-center rounded-[18px] sm:size-14"
                          style={{ background: tone.panel, color: tone.ink }}>
                          <Icon className="size-7" strokeWidth={2.1} aria-hidden="true"/>
                        </span>
                        <span className="text-xs font-bold text-slate-400">{String(number).padStart(2, "0")}</span>
                      </div>
                      <h3 className="mt-4 flex-1 text-base font-extrabold leading-snug text-slate-800 sm:text-[17px]">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-500">{getLevelOneProjects(category.id).length} projects &amp; lessons</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold group-hover:gap-2"
                        style={{ color: tone.ink }}>
                        Explore category <ArrowRight className="size-4" aria-hidden="true"/>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-[26px] border border-sky-100 bg-white p-10 text-center text-slate-600">
              <Search className="mx-auto mb-3 size-8 text-[#168eea]" aria-hidden="true"/>
              No categories match that search. Try a different word.
            </div>
          )}
        </section>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 rounded-[24px] border border-sky-100 bg-[#f3faff] px-5 py-5 text-center">
          <p className="text-sm font-semibold text-slate-600">
            Want to continue a robot project that's already available?
          </p>
          <Link to="/practical"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-5 text-sm font-extrabold text-white transition hover:bg-[#0d7fda] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
            View available robots <ArrowRight className="size-4" aria-hidden="true"/>
          </Link>
        </div>
      </main>
    </div>
  );
}
