import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Construction, Wrench } from "lucide-react";

import { LevelOneBackdrop } from "@/components/practical/LevelOneHeader";
import { getAdvancedLevel } from "@/data/advancedSyllabus";
import { findLevelOneCategory } from "@/data/levelOneCategories";
import { getProject } from "@/data/practical";
import { pdfActivityManuals } from "@/data/pdfActivityManuals";
import { getLevelOneLecture } from "@/data/levelOneLectures";
import { getLevelTwoLecture } from "@/data/levelTwoLectures";
import { getLevelThreeLecture } from "@/data/levelThreeLectures";
import { getLevelFourBuildingManual, hasLevelFourOptimizedManual, isLevelFourBuildingFallback } from "@/data/levelFourBuilding";
import { getLevelFiveSixBuildingManual, hasLevelFiveSixOptimizedManual, isLevelFiveSixBuildingReference, levelFiveSixLearningLectures } from "@/data/levelFiveSixContent";
import { getProjectSupplementaryPdfs } from "@/data/levelFiveSixExtraPdfs";
import { getQuizSyllabusEntry } from "@/data/quizSyllabus";
import { levelFourLearningManuals } from "@/data/levelFourLearning";
import { QuizProjectProgress } from "@/components/quiz/QuizAchievement";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectOverviewPage,
});

/**
 * The project is chosen before the activity. Keep existing direct studio URLs
 * working, but make syllabus project cards open this choice screen first.
 */
function ProjectOverviewPage() {
  const { projectId } = Route.useParams();
  const project = getProject(projectId);

  if (!project) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#f3faff] px-4 text-center text-[#132654]">
        <div>
          <h1 className="text-2xl font-black">Project not found</h1>
          <p className="mt-2 text-sm text-slate-600">Choose a project from the syllabus to continue.</p>
          <Link to="/practical/levels" className="mt-5 inline-flex min-h-12 items-center rounded-2xl bg-[#168eea] px-5 font-bold text-white">
            Explore levels
          </Link>
        </div>
      </main>
    );
  }

  const level = project.level;
  const category = project.categoryId && level
    ? level === 1
      ? findLevelOneCategory(project.categoryId)
      : getAdvancedLevel(level).find((entry) => entry.id === project.categoryId)
    : undefined;
  const isPresentation = pdfActivityManuals[project.id]?.sourceKind === "powerpoint";
  const lecture = level === 1 ? getLevelOneLecture(project.id) :
    level === 2 ? getLevelTwoLecture(project.id) :
    level === 3 ? getLevelThreeLecture(project.id) : undefined;
  // Lecture slides and assembly manuals are different activities.
  const isLevelFiveSix = level === 5 || level === 6;
  const hasLearning = Boolean(lecture) || isPresentation || Boolean(levelFourLearningManuals[project.id]) || Boolean(levelFiveSixLearningLectures[project.id]);
  const hasBuilding = level === 4
    ? Boolean(getLevelFourBuildingManual(project.id))
    : isLevelFiveSix ? Boolean(getLevelFiveSixBuildingManual(project.id)) : !isPresentation && !lecture?.learningOnly;
  const usingLearningForBuilding = (level === 4 && isLevelFourBuildingFallback(project.id))
    || (isLevelFiveSix && isLevelFiveSixBuildingReference(project.id));
  const hasOptimizedBuilding = (level === 4 && hasLevelFourOptimizedManual(project.id))
    || (isLevelFiveSix && hasLevelFiveSixOptimizedManual(project.id));
  const supplementaryPdfs = isLevelFiveSix ? getProjectSupplementaryPdfs(project.id) : [];
  const quizEntry = getQuizSyllabusEntry(project.id);
  const quizReady = quizEntry?.status === "ready";

  return (
    <div className="relative h-[100dvh] overflow-y-auto bg-white text-[#132654]">
      <LevelOneBackdrop />
      <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/95 px-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3">
          <Link to="/practical/levels" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-sky-100 px-3 text-sm font-bold text-[#168eea] hover:bg-[#eaf5ff]">
            <ArrowLeft className="size-4" aria-hidden="true" /> All levels
          </Link>
          <Link to="/" aria-label="BE STEM READY home">
            <img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-10 w-auto object-contain sm:h-12" />
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-7 sm:px-8 sm:pt-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#168eea]">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/practical/levels" className="hover:text-[#168eea]">Levels</Link>
          {level === 1 ? (
            <>
              <span aria-hidden="true">/</span>
              <Link to="/practical/level-1" className="hover:text-[#168eea]">Level 1</Link>
            </>
          ) : level ? (
            <>
              <span aria-hidden="true">/</span>
              <Link to="/practical/levels/$levelNumber" params={{ levelNumber: String(level) }} className="hover:text-[#168eea]">
                Level {level}
              </Link>
            </>
          ) : null}
          {category && level === 1 ? (
            <>
              <span aria-hidden="true">/</span>
              <Link to="/practical/level-1/$categoryId" params={{ categoryId: category.id }} className="hover:text-[#168eea]">
                {category.name}
              </Link>
            </>
          ) : category && level ? (
            <>
              <span aria-hidden="true">/</span>
              <Link to="/practical/levels/$levelNumber/$categoryId" params={{ levelNumber: String(level), categoryId: category.id }} className="hover:text-[#168eea]">
                {category.name}
              </Link>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-extrabold text-[#132654]">{project.title}</span>
        </nav>

        <section className="mt-7 rounded-[32px] border border-sky-100 bg-[#eaf5ff] px-5 py-8 sm:px-9 sm:py-10">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#168eea]">
            {level ? `LEVEL ${level} · PROJECT` : "STEM PROJECT"}
          </span>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.2rem)] font-black tracking-tight">{project.title}</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base">{project.description}</p>
          <p className="mt-5 text-sm font-extrabold text-[#132654]">What would you like to do?</p>
        </section>

        <section aria-label="Choose Learning, Building, or Quiz" className={`mt-6 grid gap-4 ${quizEntry ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          <article className="flex flex-col rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_8px_28px_rgba(22,142,234,.07)]">
            <BookOpen className="size-10 text-[#168eea]" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black">Learning</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              {hasLearning ? "View the project PDF one page at a time in Learning Studio." : "Project-specific learning materials have not been added yet."}
            </p>
            {hasLearning ? (
              <Link to="/practical/$projectId" params={{ projectId: project.id }} search={{ mode: "learning" }} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-4 font-extrabold text-white hover:bg-[#0d7fda]">
                Start Learning <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <span aria-disabled="true" className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 font-bold text-slate-500">
                <Construction className="size-4" aria-hidden="true" /> Coming soon
              </span>
            )}
          </article>

          <article className="flex flex-col rounded-[28px] border border-green-100 bg-white p-6 shadow-[0_8px_28px_rgba(37,154,65,.07)]">
            <Wrench className="size-10 text-[#259a41]" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black">Building</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              {usingLearningForBuilding
                ? "No separate Building manual was supplied. Use the original Learning slides as a building reference."
                : hasBuilding ? "Follow the project's existing interactive 3D or official PDF building instructions."
                : "A building activity has not been added for this slide-only project."}
            </p>
            {hasBuilding ? (
              hasOptimizedBuilding ? (
                <div className="mt-5 grid gap-2">
                  <Link to="/practical/$projectId" params={{ projectId: project.id }} search={{ mode: "building" }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#259a41] px-4 font-extrabold text-white hover:bg-[#1c8235]">
                    Basic Building <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link to="/practical/$projectId" params={{ projectId: project.id }} search={{ mode: "building", variant: "optimized" }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 font-extrabold text-[#1c8235] hover:bg-green-100">
                    Optimized Building <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <Link to="/practical/$projectId" params={{ projectId: project.id }} search={{ mode: "building" }} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#259a41] px-4 font-extrabold text-white hover:bg-[#1c8235]">
                  Start Building <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              )
            ) : (
              <span aria-disabled="true" className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 font-bold text-slate-500">
                <Construction className="size-4" aria-hidden="true" /> Coming soon
              </span>
            )}
          </article>
          {quizEntry ? (
            <article className="flex flex-col rounded-[28px] border border-amber-100 bg-white p-6 shadow-[0_8px_28px_rgba(202,146,26,.07)]">
              <ClipboardCheck className="size-10 text-[#168eea]" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black">Quiz</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {quizReady
                  ? quizEntry.usesBuildingManual
                    ? "Practice five concepts from this project's official Building manual, with hints and references to manual pages. No separate teaching-slide lecture was supplied."
                    : "Answer five project-specific questions with optional hints. Get four right to pass, or practice again."
                  : quizEntry.status === "missing-learning-source"
                    ? "Quiz questions need official Learning material before they can be published."
                    : quizEntry.status === "building-manual-only"
                      ? "Only a Building manual was supplied. Teaching concepts and slide references need educational review before a quiz can open."
                      : "This project's Learning source is registered. Its questions and slide references are being checked."}
              </p>
              {quizReady ? <QuizProjectProgress projectId={project.id} /> : null}
              {quizReady ? (
                <Link to="/quiz/$projectId" params={{ projectId: project.id }}
                  className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-4 font-extrabold text-white hover:bg-[#0d7fda]">
                  Open Quiz <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <span aria-disabled="true"
                  className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-extrabold text-slate-500">
                  <Construction className="size-4" aria-hidden="true" /> Quiz coming soon
                </span>
              )}
            </article>
          ) : null}
        </section>

        {supplementaryPdfs.length > 0 && (
          <section aria-label="Additional project source PDFs" className="mt-6 rounded-[28px] border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-black text-[#132654]">Additional source document</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This is a separate PDF supplied with the curriculum. Its role as a building manual has not been verified, so the existing Learning and Building choices stay unchanged.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {supplementaryPdfs.map(file => (
                <a key={file.path} href={file.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-extrabold text-[#168eea] hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
                  Open {file.title} source PDF <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        )}

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-500">
          <CheckCircle2 className="size-4 text-[#259a41]" aria-hidden="true" />
          Choose an available activity to open its existing viewer.
        </p>
      </main>
    </div>
  );
}
