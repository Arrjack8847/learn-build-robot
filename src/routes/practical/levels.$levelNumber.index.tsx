import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, Bot, Cog, Hand, Lightbulb, MonitorPlay, PawPrint,
  Puzzle, Radar, Search, ShieldCheck, Truck, type LucideIcon,
} from "lucide-react";
import { LevelOneBackdrop, categoryTones } from "@/components/practical/LevelOneHeader";
import { SyllabusHeader } from "@/components/practical/SyllabusHeader";
import { getAdvancedLevel } from "@/data/advancedSyllabus";

export const Route = createFileRoute("/practical/levels/$levelNumber/")({
  component: AdvancedLevelCategoriesPage,
});

function categoryIcon(name: string): LucideIcon {
  if (/biomimicry/i.test(name)) return PawPrint;
  if (/vehicle|navigation/i.test(name)) return Truck;
  if (/sensor|automation|security/i.test(name)) return Radar;
  if (/illumination|signal|display/i.test(name)) return Lightbulb;
  if (/interactive|manipulator/i.test(name)) return Hand;
  if (/programming|control/i.test(name)) return MonitorPlay;
  if (/mechanism|machine|construction/i.test(name)) return Cog;
  return Bot;
}

function AdvancedLevelCategoriesPage() {
  const { levelNumber } = Route.useParams();
  const level = Number(levelNumber);
  const categories = getAdvancedLevel(level);
  const [search, setSearch] = useState("");
  if (!categories.length) {
    return <div className="grid min-h-[100dvh] place-items-center bg-[#f3faff] p-6 text-center">
      <div><Puzzle className="mx-auto size-12 text-[#168eea]"/>
        <h1 className="mt-3 text-2xl font-extrabold">This level isn't available.</h1>
        <Link to="/practical/levels" className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-[#168eea] px-5 font-bold text-white">Choose a level</Link>
      </div>
    </div>;
  }
  const filtered = categories.filter(category => category.name.toLowerCase().includes(search.trim().toLowerCase()));
  const total = categories.reduce((count, category) => count + category.entries.length, 0);
  const tones = ["blue", "green", "yellow", "pink"] as const;

  return (
    <div className="relative h-[100dvh] overflow-y-auto bg-white text-slate-800">
      <LevelOneBackdrop/>
      <SyllabusHeader level={level}/>
      <main className="relative mx-auto max-w-7xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-7 sm:px-7 sm:pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-[#eaf5ff] px-4 py-1.5 text-xs font-extrabold text-[#168eea]">LEVEL {level} · LITTLE INVENTORS</p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.3rem)] font-black tracking-tight">
            Choose a <span className="text-[#168eea]">STEM world!</span>
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-600 sm:text-base">
            {categories.length} syllabus categories · {total} projects and lessons.
            Pick a category to explore what's inside.
          </p>
        </div>

        <section className="mt-8 sm:mt-10" aria-label={`Level ${level} categories`}>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-lg font-extrabold">All categories <span className="ml-1 rounded-full bg-[#eaf5ff] px-2.5 py-1 text-xs text-[#168eea]">{categories.length}</span></h2>
            <label className="relative block w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true"/>
              <span className="sr-only">Search Level {level} categories</span>
              <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories"
                className="min-h-12 w-full rounded-2xl border border-sky-100 bg-white py-2 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none focus:border-[#168eea] focus:ring-2 focus:ring-sky-200"/>
            </label>
          </div>
          {filtered.length ? (
            <ul className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {filtered.map(category => {
                const ordinal = categories.indexOf(category) + 1;
                const tone = categoryTones[tones[(ordinal - 1) % tones.length]];
                const Icon = categoryIcon(category.name);
                return <li key={category.id} className="min-w-0">
                  <Link to="/practical/levels/$levelNumber/$categoryId"
                    params={{ levelNumber: levelNumber, categoryId: category.id }}
                    aria-label={`Explore ${category.name}`}
                    className="group flex h-full min-h-[172px] flex-col rounded-[26px] border bg-white p-4 shadow-[0_6px_22px_rgba(22,142,234,.07)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(22,142,234,.13)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea] motion-reduce:transform-none motion-reduce:transition-none sm:p-5"
                    style={{borderColor:tone.border}}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid size-14 place-items-center rounded-[18px]" style={{background:tone.panel,color:tone.ink}}>
                        <Icon className="size-7" aria-hidden="true" strokeWidth={2.1}/>
                      </span>
                      <span className="text-xs font-bold text-slate-400">{String(ordinal).padStart(2,"0")}</span>
                    </div>
                    <h3 className="mt-4 flex-1 text-base font-extrabold leading-snug text-slate-800">{category.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{category.entries.length} projects &amp; lessons</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold" style={{color:tone.ink}}>
                      Explore category <ArrowRight className="size-4" aria-hidden="true"/>
                    </span>
                  </Link>
                </li>;
              })}
            </ul>
          ) : <div className="rounded-3xl border border-sky-100 bg-white p-10 text-center text-sm font-semibold text-slate-600">No matching categories. Try another search.</div>}
          <Link to="/practical" className="mx-auto mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#168eea] px-5 text-sm font-bold text-white hover:bg-[#0d7fda]">
            <Bot className="size-4" aria-hidden="true"/> Open available robot builds
          </Link>
        </section>
      </main>
    </div>
  );
}
