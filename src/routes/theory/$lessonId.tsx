import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  FlaskConical,
  Lightbulb,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { LearningIllustration } from "@/components/journey/LearningIllustration";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";
import { getModule, getModuleForLesson } from "@/data/theory";
import type { TheoryModule } from "@/types/learning";

export const Route = createFileRoute("/theory/$lessonId")({
  component: TheoryLessonPage,
});

type LearningStage = "pages" | "complete";
type LearningPageKind = "overview" | "explanation" | "concept" | "example";

interface LearningPage {
  id: string;
  lessonId: string;
  lessonTitle: string;
  kind: LearningPageKind;
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
}

const pageIcons: Record<LearningPageKind, LucideIcon> = {
  overview: Target,
  explanation: BookOpen,
  concept: Lightbulb,
  example: FlaskConical,
};

function TheoryLessonPage() {
  const { lessonId: moduleId = "" } = Route.useParams();
  const module = getModule(moduleId) ?? getModuleForLesson(moduleId);
  const { hydrated } = useProgress();

  if (!module) {
    return <MissingTopic />;
  }

  if (!hydrated) {
    return <LearningLoading />;
  }

  return <LearningSession key={module.id} module={module} />;
}

function LearningSession({ module }: { module: TheoryModule }) {
  const {
    progress,
    isLessonCompleted,
    setLastTheoryPage,
    toggleLessonCompleted,
  } = useProgress();
  const pages = createLearningPages(module);
  const firstIncompletePage = pages.findIndex((page) => !isLessonCompleted(page.lessonId));
  const moduleCompleted = module.lessons.every((lesson) => isLessonCompleted(lesson.id));
  const savedPage = progress.lastTheoryPageByModule[module.id] ?? 0;
  const safeSavedPage = Math.min(Math.max(savedPage, 0), Math.max(pages.length - 1, 0));
  const savedLearningPage = pages[safeSavedPage];
  const savedPageIsCurrent = savedLearningPage
    ? !isLessonCompleted(savedLearningPage.lessonId)
    : false;
  const [currentIndex, setCurrentIndex] = useState(() =>
    moduleCompleted
      ? 0
      : savedPageIsCurrent
        ? safeSavedPage
        : Math.max(firstIncompletePage, 0),
  );
  const [stage, setStage] = useState<LearningStage>("pages");
  const currentPage = pages[currentIndex];

  if (!currentPage) {
    return <MissingTopic />;
  }

  if (stage === "complete") {
    return (
      <LearningCelebration
        module={module}
        onReview={() => {
          setCurrentIndex(0);
          setStage("pages");
        }}
        studentName={progress.studentName || "Builder"}
      />
    );
  }

  const PageIcon = pageIcons[currentPage.kind];
  const currentLessonId = currentPage.lessonId;
  const isLastPage = currentIndex === pages.length - 1;
  const nextPage = pages[currentIndex + 1];
  const isLastPageInLesson = !nextPage || nextPage.lessonId !== currentPage.lessonId;
  const displayedPercent = Math.round(((currentIndex + 1) / pages.length) * 100);
  const lessonIndex = module.lessons.findIndex((lesson) => lesson.id === currentPage.lessonId);

  function finishCurrentPage() {
    if (isLastPageInLesson) {
      toggleLessonCompleted(currentLessonId, true);
    }

    if (isLastPage) {
      setLastTheoryPage(module.id, pages.length - 1);
      setStage("complete");
      return;
    }

    const newIndex = currentIndex + 1;
    setLastTheoryPage(module.id, newIndex);
    setCurrentIndex(newIndex);
  }

  function goToPreviousPage() {
    const newIndex = Math.max(0, currentIndex - 1);
    setLastTheoryPage(module.id, newIndex);
    setCurrentIndex(newIndex);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b bg-card px-4 sm:px-8">
        <Link
          aria-label="Exit topic and choose another learning topic"
          className="grid size-11 shrink-0 place-items-center rounded-2xl border text-foreground transition hover:bg-secondary"
          to="/theory"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-bold">{module.title}</p>
          <p className="text-xs text-muted-foreground">
            Page {currentIndex + 1} of {pages.length}
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Check aria-hidden="true" className="size-5" />
        </span>
      </header>

      <Progress
        aria-label={`Page ${currentIndex + 1} of ${pages.length}`}
        className="h-1.5 rounded-none bg-secondary [&>div]:bg-primary"
        value={displayedPercent}
      />

      <main className="flex min-h-0 flex-1 items-center px-4 py-3 sm:px-8 sm:py-5">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-4 md:grid-cols-[0.9fr_1.1fr] md:gap-8">
          <LearningIllustration
            className="min-h-24 sm:min-h-52 md:min-h-[22rem]"
            icon={module.icon}
            variant={module.number - 1}
          />

          <section className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <PageIcon aria-hidden="true" className="size-4" />
              {currentPage.eyebrow}
            </div>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              Lesson {lessonIndex + 1} of {module.lessons.length} · {currentPage.lessonTitle}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
              {currentPage.title}
            </h1>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground sm:mt-3 sm:line-clamp-none sm:text-base sm:leading-7">
              {currentPage.body}
            </p>

            {currentPage.bullets ? (
              <ul className="mt-3 grid gap-2 sm:mt-4">
                {currentPage.bullets.slice(0, 3).map((bullet) => (
                  <li
                    className="flex items-start gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-semibold leading-5 sm:text-sm"
                    key={bullet}
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-success"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-primary-soft p-3 text-sm leading-6 sm:p-4">
                <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                <p>Read it once, then explain the idea in your own words.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t bg-card px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:py-4">
        <div className="mx-auto flex w-full max-w-5xl gap-3">
          <Button
            aria-label="Go to previous learning page"
            className="min-h-12 rounded-2xl px-4 sm:px-6"
            disabled={currentIndex === 0}
            onClick={goToPreviousPage}
            type="button"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            className="min-h-12 flex-1 rounded-2xl text-base font-bold"
            onClick={finishCurrentPage}
            type="button"
          >
            {isLastPage ? "Finish Topic" : "Got It — Next Page"}
            {isLastPage ? (
              <Sparkles aria-hidden="true" />
            ) : (
              <ArrowRight aria-hidden="true" />
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function LearningCelebration({
  module,
  studentName,
  onReview,
}: {
  module: TheoryModule;
  studentName: string;
  onReview: () => void;
}) {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-navy px-5 py-6 text-center text-navy-foreground">
      <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-50" />
      <main className="relative w-full max-w-2xl">
        <span className="mx-auto grid size-24 place-items-center rounded-[2rem] bg-primary-soft text-primary shadow-lift sm:size-28">
          <Trophy aria-hidden="true" className="size-12 sm:size-14" />
        </span>
        <div className="mt-5 flex justify-center gap-2 text-warning" aria-hidden="true">
          <Sparkles className="size-5" />
          <Sparkles className="size-7" />
          <Sparkles className="size-5" />
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Topic complete
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          Great learning, {studentName}!
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-navy-muted sm:text-base sm:leading-7">
          You finished {module.title}. Your learning progress has been saved and your Quiz unlock
          progress is updated.
        </p>

        <div className="mx-auto mt-7 grid max-w-md gap-3">
          <Button asChild className="min-h-12 rounded-2xl text-base font-bold">
            <Link to="/choose">
              Continue My Journey
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            className="min-h-12 rounded-2xl border-white/15 bg-navy-hover text-navy-foreground hover:bg-navy-hover/80"
            onClick={onReview}
            type="button"
            variant="outline"
          >
            Review This Topic
          </Button>
        </div>
      </main>
    </div>
  );
}

function createLearningPages(module: TheoryModule): LearningPage[] {
  return module.lessons.flatMap((lesson) => [
    {
      id: `${lesson.id}-overview`,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      kind: "overview" as const,
      eyebrow: "What you will learn",
      title: lesson.title,
      body: lesson.content[0] ?? module.description,
      bullets: lesson.objectives,
    },
    {
      id: `${lesson.id}-explanation`,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      kind: "explanation" as const,
      eyebrow: "How it works",
      title: "Look at the whole system",
      body: lesson.content[1] ?? lesson.content[0] ?? module.description,
    },
    {
      id: `${lesson.id}-concept`,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      kind: "concept" as const,
      eyebrow: "Key idea",
      title: lesson.concept.title,
      body: lesson.concept.body,
    },
    {
      id: `${lesson.id}-example`,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      kind: "example" as const,
      eyebrow: "Real robot example",
      title: lesson.example.title,
      body: lesson.example.body,
    },
  ]);
}

function MissingTopic() {
  return (
    <div className="grid h-full place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="text-2xl font-bold">We couldn’t find that learning topic.</h1>
        <Link className="mt-5 inline-flex items-center gap-2 font-semibold text-primary" to="/theory">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Choose a topic
        </Link>
      </div>
    </div>
  );
}

function LearningLoading() {
  return (
    <div aria-live="polite" className="grid h-full place-items-center bg-background">
      <p className="text-sm font-semibold text-muted-foreground">Finding your learning page…</p>
    </div>
  );
}
