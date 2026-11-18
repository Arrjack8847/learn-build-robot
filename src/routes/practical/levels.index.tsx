import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getLevelTotals } from "@/data/advancedSyllabus";

export const Route = createFileRoute("/practical/levels/")({
  component: SyllabusLevelsPage,
});

const levels = [
  { number: 1, art: "level-1.webp", name: "Little Inventors", scale: 1.00, color: "#e7f5ff", ink: "#138ad4" },
  { number: 2, art: "level-2.webp", name: "Creative Builders", scale: 1.00, color: "#e7f7e8", ink: "#298c51" },
  { number: 3, art: "level-3.webp", name: "Problem Solvers", scale: 1.0, color: "#fff0f7", ink: "#d7478b" },
  { number: 4, art: "level-4.webp", name: "Tech Explorers", scale: 1.06, color: "#e9f1ff", ink: "#4d75ca" },
  { number: 5, art: "level-5.webp", name: "Innovators", scale: 1.00, color: "#fff4db", ink: "#b67c25" },
  { number: 6, art: "level-6.webp", name: "Future Makers", scale: 1.00, color: "#f0eaff", ink: "#8655c3" },
] as const;

const artRoot = "/assets/level-artwork/";


/** All artwork uses its real aspect ratio; SVG rocket has no transparent padding. */
function LevelArtwork({ art, level }: { art: string; level: number }) {
  return (
    <img
      alt=""
      src={artRoot + art}
      loading="eager"
      decoding="async"
      className={`h-full max-h-[min(16svh,140px)] w-full max-w-[145px] object-contain ${level === 3 ? "" : "mix-blend-multiply"}`}
    />
  );
}

function SyllabusLevelsPage() {
  return (
    <main className="relative isolate flex h-[100svh] min-h-0 flex-col overflow-hidden bg-[#f4fbff] text-[#20395c]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#e3f4ff_0%,#f6fbff_62%,#eaf7ef_100%)]" />
      <img
        aria-hidden="true"
        alt=""
        src={artRoot + "header-wave.webp"}
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(26svh,190px)] w-full object-cover object-top opacity-20 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)]"
      />
      <img
        aria-hidden="true"
        alt=""
        src={artRoot + "landscape.webp"}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[clamp(145px,31svh,340px)] w-full object-cover object-bottom opacity-85 [mask-image:linear-gradient(to_bottom,transparent_0%,black_58%)]"
      />
      <header className="relative mx-auto flex h-[clamp(48px,9svh,80px)] w-full max-w-[1120px] shrink-0 items-center justify-between px-4 sm:px-8">
        <Link to="/" aria-label="Back home" className="grid size-10 place-items-center rounded-full border border-sky-100 bg-white/90 text-sky-700 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
          <ArrowLeft className="size-5" />
        </Link>
        <img alt="BE STEM READY" src="/home/be-stem-ready-logo.svg" className="h-[clamp(32px,6svh,56px)] max-w-[58%] object-contain" />
        <span aria-hidden="true" className="size-10" />
      </header>
      <section className="mx-auto flex min-h-0 w-full max-w-[1040px] flex-1 flex-col px-3 pb-[max(8px,env(safe-area-inset-bottom))] sm:px-8">
        <div className="shrink-0 text-center">
          <p className="mx-auto w-fit rounded-full border border-[#c8e7f9] bg-[#e9f7ff]/90 px-5 py-1 text-[clamp(10px,1.65svh,14px)] font-bold text-[#388cbd]">Explore Categories</p>
          <h1 className="mt-[clamp(4px,1dvh,14px)] text-[clamp(22px,3.8svh,40px)] font-black leading-tight tracking-tight text-[#21476c]">Choose Your Level</h1>
        </div>
        <ul aria-label="Choose your syllabus level" className="mx-auto my-auto grid min-h-0 w-full max-w-[900px] flex-1 grid-cols-2 grid-rows-3 gap-[clamp(7px,1.2svh,16px)] py-[clamp(7px,1.2svh,14px)] md:landscape:grid-cols-3 md:landscape:grid-rows-2">
          {levels.map((level) => {
            const totals = level.number === 1 ? { categories: 14, entries: 59 } : getLevelTotals(level.number);
            const card = (
              <div className="group flex h-full min-h-0 flex-col items-center justify-center overflow-hidden rounded-[clamp(16px,2.6vw,28px)] border border-white/90 px-2 py-[clamp(5px,1svh,12px)] text-center shadow-[0_7px_22px_rgba(54,107,143,.12)] transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none" style={{ backgroundColor: level.color }}>
                <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                  <LevelArtwork art={level.art} level={level.number} />
                </div>
                <div className="flex shrink-0 flex-col items-center gap-[clamp(1px,.3svh,4px)] pb-1 text-center">
                  <span className="text-[clamp(14px,2.15svh,22px)] font-black leading-tight" style={{ color: level.ink }}>Level {level.number}</span>
                  <span className="text-[clamp(10px,1.5svh,14px)] font-semibold leading-tight text-[#48637b]">{level.name}</span>
                  <span className="text-[clamp(9px,1.25svh,12px)] leading-tight text-[#5e7488]">{totals.categories} categories · {totals.entries} projects</span>
                </div>
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
