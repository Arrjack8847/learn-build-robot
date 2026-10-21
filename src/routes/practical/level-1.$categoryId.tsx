import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, FolderOpen, Puzzle, Sparkles } from "lucide-react";
import { findLevelOneCategory, LEVEL_ONE_CATEGORIES } from "@/data/levelOneCategories";
import { practicalProjects } from "@/data/practical";
import { LevelOneBackdrop, LevelOneHeader, categoryTones } from "@/components/practical/LevelOneHeader";

export const Route = createFileRoute("/practical/level-1/$categoryId")({
  component: LevelOneCategoryPage,
});

function LevelOneCategoryPage() {
  const { categoryId } = Route.useParams();
  const category = findLevelOneCategory(categoryId);

  if (!category) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-[#f3faff] px-4 text-center text-slate-800">
        <div>
          <Puzzle className="mx-auto size-12 text-[#168eea]" aria-hidden="true"/>
          <h1 className="mt-3 text-2xl font-extrabold">We couldn’t find that category.</h1>
          <Link to="/practical/level-1" className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-[#168eea] px-5 font-bold text-white">
            All Level 1 categories
          </Link>
        </div>
      </div>
    );
  }

  // No projects are assigned by name guessing. Each actual syllabus project
  // can opt in with its verified level + categoryId once its source is loaded.
  const projects = practicalProjects.filter(project => project.level === 1 && project.categoryId === category.id);
  const categoryNumber = LEVEL_ONE_CATEGORIES.indexOf(category) + 1;
  const tone = categoryTones[category.tone];

  return (
    <div className="relative h-[100dvh] overflow-y-auto bg-white text-slate-800">
      <LevelOneBackdrop/>
      <LevelOneHeader backTo="/practical/level-1" backLabel="All categories"/>
      <main className="relative mx-auto max-w-5xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-7 sm:px-8 sm:pt-10">
        <section className="rounded-[32px] border px-5 py-7 sm:px-9 sm:py-9"
          style={{ background: tone.panel, borderColor: tone.border }}>
          <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: tone.ink }}>
            Level 1 · Category {String(categoryNumber).padStart(2, "0")} of {LEVEL_ONE_CATEGORIES.length}
          </p>
          <h1 className="mt-2 text-[clamp(1.9rem,5vw,3rem)] font-black tracking-tight">{category.name}</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
            Explore robot projects from this category as their official lessons are added.
          </p>
        </section>

        <section className="mt-8" aria-label={`Robot builds in ${category.name}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold">Robot builds</h2>
            <span className="rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-bold text-[#168eea]">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {projects.length ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {projects.map(project => (
                <li key={project.id} className="rounded-[26px] border border-sky-100 bg-white p-5 shadow-sm">
                  <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#eaf5ff] text-[#168eea]">
                    <Bot className="size-8" aria-hidden="true"/>
                  </span>
                  <h3 className="text-lg font-extrabold">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                  <p className="mt-3 text-xs font-bold text-slate-500">{project.steps.length} building steps</p>
                  <Link to="/practical/$projectId" params={{ projectId: project.id }}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-4 text-sm font-extrabold text-white transition hover:bg-[#0d7fda]">
                    Start building <ArrowRight className="size-4" aria-hidden="true"/>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-[28px] border border-sky-100 bg-white px-6 py-10 text-center shadow-sm">
              <div className="relative grid size-20 place-items-center rounded-3xl bg-[#eaf5ff]">
                <FolderOpen className="size-10 text-[#168eea]" aria-hidden="true"/>
                <Sparkles className="absolute -right-2 -top-2 size-6 text-[#f5a400]" aria-hidden="true"/>
              </div>
              <h3 className="mt-5 text-xl font-extrabold">This category is ready!</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                The category has been created, but no robot lessons have been assigned to it yet.
                We’ll add projects using the original Level 1 syllabus files.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/practical/level-1"
                  className="inline-flex min-h-12 items-center rounded-2xl border border-sky-200 px-5 text-sm font-extrabold text-[#168eea] hover:bg-[#eaf5ff]">
                  Other categories
                </Link>
                <Link to="/practical"
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#168eea] px-5 text-sm font-extrabold text-white hover:bg-[#0d7fda]">
                  Available robots <ArrowRight className="size-4" aria-hidden="true"/>
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
