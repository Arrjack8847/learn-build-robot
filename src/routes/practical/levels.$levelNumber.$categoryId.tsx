import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, FileText, FolderOpen, Presentation, Puzzle, Sparkles } from "lucide-react";
import { LevelOneBackdrop, categoryTones } from "@/components/practical/LevelOneHeader";
import { SyllabusHeader } from "@/components/practical/SyllabusHeader";
import { getAdvancedLevel, syllabusSlug } from "@/data/advancedSyllabus";
import { practicalProjects } from "@/data/practical";
import { isPdfActivityProject, pdfActivityManuals } from "@/data/pdfActivityManuals";
import { levelTwoPowerPointSources } from "@/data/levelTwoPowerPointSources";

/** Multiple original building manuals appear as version buttons on one syllabus activity card. */
const manualVersionChoices: Record<string, readonly {label: string; projectId: string}[]> = {
  "2:interactive-systems:see-saw": [
    { label: "Version 1 · Balance", projectId: "level-2-see-saw-v1" },
    { label: "Version 2 · Balance_v2", projectId: "level-2-see-saw-v2" },
  ],
  "3:action-oriented:cycle-sport": [
    { label: "Basic", projectId: "level-3-cycle-sport-basic" },
    { label: "Optimized", projectId: "level-3-cycle-sport-optimized" },
  ],
  "3:display-movement:race-walking": [
    { label: "Basic", projectId: "level-3-race-walking-basic" },
    { label: "Optimized", projectId: "level-3-race-walking-optimized" },
    { label: "Optimized + Ratchet", projectId: "level-3-race-walking-optimized-ratchet" },
  ],
};

export const Route = createFileRoute("/practical/levels/$levelNumber/$categoryId")({
  component: AdvancedLevelProjectsPage,
});

function AdvancedLevelProjectsPage() {
  const { levelNumber, categoryId } = Route.useParams();
  const level = Number(levelNumber);
  const categories = getAdvancedLevel(level);
  const category = categories.find(item => item.id === categoryId);
  if (!category) {
    return <div className="grid min-h-[100dvh] place-items-center bg-[#f3faff] px-4 text-center text-slate-800">
      <div><Puzzle className="mx-auto size-12 text-[#168eea]" aria-hidden="true"/>
        <h1 className="mt-3 text-2xl font-extrabold">Category not found</h1>
        <Link to="/practical/levels" className="mt-5 inline-flex min-h-12 items-center rounded-2xl bg-[#168eea] px-5 text-sm font-bold text-white">Choose a level</Link>
      </div>
    </div>;
  }

  const index = categories.indexOf(category);
  const tones = ["blue","green","yellow","pink"] as const;
  const tone = categoryTones[tones[index % tones.length] ?? "blue"];

  return (
    <div className="relative h-[100dvh] overflow-y-auto bg-white text-slate-800">
      <LevelOneBackdrop/>
      <SyllabusHeader level={level}/>
      <main className="relative mx-auto max-w-5xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-7 sm:px-8 sm:pt-10">
        <section className="rounded-[30px] border px-5 py-7 sm:px-9 sm:py-9" style={{background:tone.panel,borderColor:tone.border}}>
          <p className="text-xs font-extrabold uppercase tracking-wider" style={{color:tone.ink}}>
            Level {level} · Category {String(index+1).padStart(2,"0")} of {categories.length}
          </p>
          <h1 className="mt-2 text-[clamp(1.9rem,5vw,3rem)] font-black tracking-tight">{category.name}</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            These are the projects in your syllabus. Select one, then choose Learning or Building when that activity is available.
          </p>
        </section>

        <section className="mt-8" aria-label={`Level ${level}: ${category.name} projects`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold">Projects &amp; lessons</h2>
            <span className="rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-bold text-[#168eea]">
              {category.entries.length} {category.entries.length===1?"entry":"entries"}
            </span>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {category.entries.map(entry => {
              // Only link a fully registered, correctly categorized implementation.
              const liveProject = practicalProjects.find(project =>
                project.level === level && project.categoryId === category.id &&
                syllabusSlug(project.title) === syllabusSlug(entry.name)
              );
              // Keep multi-version manuals within their one official syllabus activity card.
              const versions = (manualVersionChoices[`${level}:${category.id}:${syllabusSlug(entry.name)}`] ?? [])
                .filter(choice => practicalProjects.some(project =>
                  project.id === choice.projectId && project.level === level &&
                  project.categoryId === category.id));
              const isPresentation = Boolean(liveProject && pdfActivityManuals[liveProject.id]?.sourceKind === "powerpoint");
              const isReady = Boolean(liveProject || versions.length);
              // PowerPoints are offered as exact originals, not passed to the PDF renderer.
              const pptxUrl = level === 2 ? levelTwoPowerPointSources[entry.sourceEntry] : undefined;
              const Icon = entry.sourceKind === "pptx" ? Presentation : entry.sourceKind === "pdf" ? FileText : FolderOpen;
              const label = versions.length ? `${versions.length} original PDF building versions · choose below` :
                isPresentation ? "Original PowerPoint slides · view page by page" :
                liveProject && pptxUrl ? "Original PDF building manual · PowerPoint also available" :
                liveProject && isPdfActivityProject(liveProject.id) ? "Original PDF building manual" :
                pptxUrl ? "Original PowerPoint presentation" :
                entry.sourceKind === "pptx" ? "PowerPoint lesson" : entry.sourceKind === "pdf" ? "PDF lesson" : "Syllabus project folder";
              return (
                <li key={entry.id} className="flex flex-col rounded-[26px] border border-sky-100 bg-white p-5 shadow-[0_7px_24px_rgba(22,142,234,.07)]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid size-14 place-items-center rounded-2xl bg-[#eaf5ff] text-[#168eea]">
                      {isReady ? <Bot className="size-8" aria-hidden="true"/> : <Icon className="size-7" aria-hidden="true"/>}
                    </span>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${isReady ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {isPresentation ? "View PowerPoint slides" : isReady ? "Ready to build" : pptxUrl ? "PowerPoint available" : "Lesson not added yet"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold leading-snug">{entry.name}</h3>
                  <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
                  <div className="mt-auto pt-5">
                    {versions.length ? (
                      <div className="flex flex-col gap-2" role="group" aria-label={`Choose ${entry.name} building manual version`}>
                        {versions.map(version => (
                          <Link key={version.projectId} to="/projects/$projectId"
                            params={{projectId: version.projectId}}
                            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-4 text-sm font-extrabold text-white hover:bg-[#0d7fda]">
                            Open {version.label} <ArrowRight className="size-4" aria-hidden="true"/>
                          </Link>
                        ))}
                      </div>
                    ) : liveProject ? (
                      <div className="flex flex-col gap-2">
                        <Link to="/projects/$projectId" params={{projectId:liveProject.id}}
                          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-4 text-sm font-extrabold text-white hover:bg-[#0d7fda]">
                          Choose activity <ArrowRight className="size-4" aria-hidden="true"/>
                        </Link>
                        {pptxUrl ? (
                          <a href={pptxUrl} download={entry.sourceEntry}
                            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-extrabold text-[#168eea] hover:bg-sky-100"
                            aria-label={`Download original PowerPoint for ${entry.name}`}>
                            Download original PowerPoint <Presentation className="size-4" aria-hidden="true"/>
                          </a>
                        ) : null}
                      </div>
                    ) : pptxUrl ? (
                      <a href={pptxUrl} download={entry.sourceEntry}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-extrabold text-[#168eea] hover:bg-sky-100"
                        aria-label={`Download original PowerPoint for ${entry.name}`}>
                        Download original PowerPoint <Presentation className="size-4" aria-hidden="true"/>
                      </a>
                    ) : (
                      <p className="rounded-2xl bg-[#f3faff] p-3 text-xs leading-5 text-slate-600">
                        Listed in the syllabus. Add its official lesson files to activate the build.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/practical/levels/$levelNumber" params={{levelNumber}}
              className="inline-flex min-h-12 items-center rounded-2xl border border-sky-200 px-5 text-sm font-extrabold text-[#168eea] hover:bg-[#eaf5ff]">
              Other categories
            </Link>
            <Link to="/practical/levels"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#168eea] px-5 text-sm font-extrabold text-white hover:bg-[#0d7fda]">
              Available robots <ArrowRight className="size-4" aria-hidden="true"/>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
