import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getLevelTotals } from "@/data/advancedSyllabus";

export const Route = createFileRoute("/practical/levels/")({
  component: SyllabusLevelsPage,
});

const levels = [
  { number: 1, art: "friendly-eco-tech-robot.png", name: "Little Inventors", color: "#e7f5ff", ink: "#138ad4" },
  { number: 2, art: "magenta-rocket-clouds.jpeg", name: "Creative Builders", color: "#e7f7e8", ink: "#298c51" },
  { number: 3, art: "cheerful-light-bulb-books-gear.jpeg", name: "Problem Solvers", color: "#fff0f7", ink: "#d7478b" },
  { number: 4, art: "colorful-gears-wrench-leaves.jpeg", name: "Tech Explorers", color: "#e9f1ff", ink: "#4d75ca" },
  { number: 5, art: "glossy-blue-coding-laptop.jpeg", name: "Innovators", color: "#fff4db", ink: "#b67c25" },
  { number: 6, art: "glossy-earth-sprouting-plant.jpeg", name: "Future Makers", color: "#f0eaff", ink: "#8655c3" },
] as const;

const artRoot = "/assets/level-artwork/";

function SyllabusLevelsPage() {
  return (
    <main className="relative isolate flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f4fbff] text-[#20395c]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#e5f5ff_0%,#f8fcff_55%,#eff9ee_100%)]" />
      <img aria-hidden="true" alt="" src={artRoot + "level-landscape-background.png"} className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[36%] w-full object-contain object-bottom opacity-75 md:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(24vh,170px)] bg-[#dff2ff]/75" />
      <img aria-hidden="true" alt="" src={artRoot + "blue-wave-header.jpeg"} className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(24vh,170px)] w-full object-cover object-top opacity-40" />
      <header className="relative mx-auto flex h-[clamp(60px,11dvh,94px)] w-full max-w-[1120px] shrink-0 items-center justify-between px-4 sm:px-8">
        <Link to="/" aria-label="Back home" className="grid size-10 place-items-center rounded-full border border-sky-100 bg-white/90 text-sky-700 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
          <ArrowLeft className="size-5" />
        </Link>
        <img alt="BE STEM READY" src="/home/be-stem-ready-logo.svg" className="h-[clamp(36px,7dvh,65px)] max-w-[58%] object-contain" />
        <span aria-hidden="true" className="size-10" />
      </header>
      <section className="mx-auto flex min-h-0 w-full max-w-[1100px] flex-1 flex-col px-4 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-8">
        <div className="shrink-0 text-center">
          <p className="mx-auto w-fit rounded-full border border-[#c8e7f9] bg-[#e9f7ff]/90 px-5 py-1 text-[clamp(11px,1.8dvh,15px)] font-bold text-[#388cbd]">Explore Categories</p>
          <h1 className="mt-[clamp(4px,1dvh,14px)] text-[clamp(23px,4.1dvh,43px)] font-black leading-tight tracking-tight text-[#21476c]">Choose Your Level</h1>
        </div>
        <ul aria-label="Choose your syllabus level" className="mx-auto my-auto grid min-h-0 w-full max-w-[960px] flex-1 grid-cols-2 grid-rows-3 gap-[clamp(8px,1.6dvh,20px)] py-[clamp(8px,1.4dvh,16px)] md:grid-cols-3 md:grid-rows-2">
          {levels.map((level) => {
            const totals = level.number === 1 ? { categories: 14, entries: 59 } : getLevelTotals(level.number);
            const card = (
              <div className="group flex h-full min-h-0 flex-col items-center justify-center overflow-hidden rounded-[clamp(16px,2.6vw,28px)] border border-white/90 px-2 py-2 text-center shadow-[0_7px_22px_rgba(54,107,143,.12)] transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none" style={{ backgroundColor: level.color }}>
                <img alt="" src={artRoot + level.art} className="min-h-0 w-full max-w-[150px] flex-1 object-contain mix-blend-multiply" />
                <span className="shrink-0 text-[clamp(14px,2.3dvh,23px)] font-black leading-tight" style={{ color: level.ink }}>Level {level.number}</span>
                <span className="shrink-0 text-[clamp(10px,1.6dvh,15px)] font-semibold leading-tight text-[#48637b]">{level.name}</span>
                <span className="mt-0.5 shrink-0 text-[clamp(9px,1.35dvh,12px)] text-[#5e7488]">{totals.categories} categories · {totals.entries} projects</span>
              </div>
            );
            return <li key={level.number} className="min-h-0 min-w-0">
              {level.number === 1
                ? <Link to="/practical/level-1" aria-label="Explore Level 1 categories" className="block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">{card}</Link>
                : <Link to="/practical/levels/$levelNumber" params={{ levelNumber: String(level.number) }} aria-label={`Explore Level ${level.number} categories`} className="block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">{card}</Link>}
            </li>;
          })}
        </ul>
      </section>
    </main>
  );
}
