import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, FileText, FolderOpen, Presentation, Puzzle } from "lucide-react";
import { findLevelOneCategory, LEVEL_ONE_CATEGORIES } from "@/data/levelOneCategories";
import { getLevelOneProjects } from "@/data/levelOneProjects";
import { getProject } from "@/data/practical";
import { isPdfActivityProject } from "@/data/pdfActivityManuals";
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

  const entries = getLevelOneProjects(category.id);
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
            Choose a project from your Level 1 syllabus. Completed digital lessons can be opened now;
            the others are listed so you can see what is coming.
          </p>
        </section>

        <section className="mt-8" aria-label={`Projects in ${category.name}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold">Projects & lessons</h2>
            <span className="rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-bold text-[#168eea]">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {entries.map(entry => {
              const liveProject = entry.availableProjectId ? getProject(entry.availableProjectId) : undefined;
              const variantChoices = (entry.availableProjectVariants ?? []).filter(variant => Boolean(getProject(variant.projectId)));
              const SourceIcon = entry.sourceKind === "pptx" ? Presentation :
                entry.sourceKind === "pdf" ? FileText : FolderOpen;
              const sourceLabel = (liveProject && isPdfActivityProject(liveProject.id)) || variantChoices.length > 0 ? "Original PDF building manual" :
                entry.sourceKind === "pptx" ? "PowerPoint lesson" :
                entry.sourceKind === "pdf" ? "PDF lesson" : "Syllabus project folder";
              return (
                <li key={entry.id}
                  className="flex flex-col rounded-[26px] border border-sky-100 bg-white p-5 shadow-[0_7px_24px_rgba(22,142,234,.07)]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid size-14 place-items-center rounded-2xl bg-[#eaf5ff] text-[#168eea]">
                      {liveProject || variantChoices.length > 0 ? <Bot className="size-8" aria-hidden="true"/> :
                        <SourceIcon className="size-7" aria-hidden="true"/>}
                    </span>
                    {liveProject ? (
                      <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                        Ready to build
                      </span>
                    ) : variantChoices.length > 0 ? (
                      <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                        Ready to build
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                        Lesson not added yet
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold leading-snug">{entry.name}</h3>
                  <p className="mt-2 text-xs font-medium text-slate-500">{sourceLabel} in the syllabus</p>
                  {entry.availableProjectId === "acceleration-car" && (
                    <Link to="/acceleration-learning"
                      className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-extrabold text-[#168eea] transition hover:bg-sky-100">
                      <Presentation className="size-4" aria-hidden="true" />
                      Open Learning Studio <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                  <div className="mt-auto pt-5">
                    {liveProject ? (
                      <Link to="/practical/$projectId" params={{ projectId: liveProject.id }}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-4 text-sm font-extrabold text-white transition hover:bg-[#0d7fda] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
                        Open Building Studio <ArrowRight className="size-4" aria-hidden="true"/>
                      </Link>
                    ) : variantChoices.length > 0 ? (
                      <div className="grid gap-2" role="group" aria-label={`${entry.name} building versions`}>
                        <p className="text-xs font-semibold text-slate-600">Choose a building version</p>
                        {variantChoices.map(variant => (
                          <Link key={variant.projectId} to="/practical/$projectId"
                            params={{ projectId: variant.projectId }}
                            className="inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-extrabold text-[#168eea] transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
                            {variant.label} Version <ArrowRight className="size-4" aria-hidden="true"/>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-2xl bg-[#f3faff] p-3 text-xs leading-5 text-slate-600">
                        This project is in your syllabus tree. Upload its lesson materials to make it interactive.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/practical/level-1"
              className="inline-flex min-h-12 items-center rounded-2xl border border-sky-200 px-5 text-sm font-extrabold text-[#168eea] hover:bg-[#eaf5ff]">
              All categories
            </Link>
            <Link to="/practical"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#168eea] px-5 text-sm font-extrabold text-white hover:bg-[#0d7fda]">
              Available robots <ArrowRight className="size-4" aria-hidden="true"/>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
