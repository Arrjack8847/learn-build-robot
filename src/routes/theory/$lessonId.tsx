import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  Target,
} from "lucide-react";

import { LessonOutline } from "@/components/learning/LessonOutline";
import { QuizExperience } from "@/components/quiz/QuizExperience";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";
import { allLessons, getLesson, getModuleForLesson } from "@/data/theory";

export const Route = createFileRoute("/theory/$lessonId")({
  component: TheoryLessonPage,
});

function TheoryLessonPage() {
  const { lessonId = "" } = Route.useParams();
  const lesson = getLesson(lessonId);
  const module = getModuleForLesson(lessonId);
  const { isLessonCompleted, toggleLessonCompleted } = useProgress();

  if (!lesson || !module) {
    return <MissingLesson />;
  }

  const completed = isLessonCompleted(lesson.id);
  const completedInModule = module.lessons.filter((item) => isLessonCompleted(item.id)).length;
  const modulePercent = Math.round((completedInModule / module.lessons.length) * 100);
  const lessonNumber = module.lessons.findIndex((item) => item.id === lesson.id) + 1;
  const globalIndex = allLessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = globalIndex > 0 ? allLessons[globalIndex - 1] : undefined;
  const nextLesson = globalIndex < allLessons.length - 1 ? allLessons[globalIndex + 1] : undefined;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"
        to="/theory"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to theory
      </Link>

      <header className="overflow-hidden rounded-3xl border bg-card shadow-card">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-primary">
                Module {module.number} · Lesson {lessonNumber} of {module.lessons.length}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                {module.description}
              </p>
            </div>
            <Button
              className={`min-h-11 shrink-0 rounded-xl px-5 ${
                completed ? "bg-success-soft text-success shadow-none hover:bg-success-soft/80" : ""
              }`}
              onClick={() => toggleLessonCompleted(lesson.id)}
            >
              <CheckCircle2 aria-hidden="true" />
              {completed ? "Lesson completed" : "Mark lesson complete"}
            </Button>
          </div>
        </div>
        <div className="border-t bg-secondary/60 px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
            <span>{module.title}</span>
            <span>{modulePercent}% complete</span>
          </div>
          <Progress
            aria-label={`${modulePercent}% of ${module.title} completed`}
            className="mt-2 bg-background [&>div]:bg-success"
            value={modulePercent}
          />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <LessonOutline lessonId={lesson.id} module={module} />

        <main className="space-y-6 lg:col-start-1 lg:row-start-1">
          <section
            aria-labelledby="objectives-heading"
            className="scroll-mt-6 rounded-3xl border bg-card p-6 shadow-card sm:p-8"
            id="objectives"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Target aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Start here
                </p>
                <h2 id="objectives-heading" className="text-xl font-bold">
                  Learning objectives
                </h2>
              </div>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {lesson.objectives.map((objective) => (
                <li
                  className="flex gap-3 rounded-2xl bg-secondary/70 p-4 text-sm leading-6"
                  key={objective}
                >
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <article
            aria-labelledby="lesson-heading"
            className="scroll-mt-6 rounded-3xl border bg-card p-6 shadow-card sm:p-8"
            id="lesson"
          >
            <div className="flex items-center gap-3 border-b pb-5">
              <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                <BookOpen aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Lesson notes
                </p>
                <h2 id="lesson-heading" className="text-xl font-bold">
                  {lesson.title}
                </h2>
              </div>
            </div>
            <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
              {lesson.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <section
            aria-labelledby="key-concept-heading"
            className="scroll-mt-6 overflow-hidden rounded-3xl border border-warning/20 bg-warning-soft/60 shadow-card"
            id="key-concept"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 text-warning">
                <Lightbulb aria-hidden="true" className="size-6" />
                <p className="text-xs font-bold uppercase tracking-[0.16em]">Key concept</p>
              </div>
              <h2 id="key-concept-heading" className="mt-4 text-2xl font-bold text-foreground">
                {lesson.concept.title}
              </h2>
              <p className="mt-3 text-base leading-8 text-foreground/80">{lesson.concept.body}</p>
            </div>
          </section>

          <section
            aria-labelledby="worked-example-heading"
            className="scroll-mt-6 rounded-3xl bg-navy p-6 text-navy-foreground shadow-lift sm:p-8"
            id="worked-example"
          >
            <div className="flex items-center gap-3 text-primary">
              <FlaskConical aria-hidden="true" className="size-6" />
              <p className="text-xs font-bold uppercase tracking-[0.16em]">Worked example</p>
            </div>
            <h2 id="worked-example-heading" className="mt-4 text-2xl font-bold">
              {lesson.example.title}
            </h2>
            <p className="mt-3 text-base leading-8 text-navy-muted">{lesson.example.body}</p>
          </section>

          <QuizExperience key={lesson.id} lesson={lesson} />

          <section className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Finished reading?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mark the lesson complete when you are comfortable with the key idea.
                </p>
              </div>
              <Button
                className={`min-h-11 rounded-xl px-5 ${
                  completed ? "bg-success-soft text-success shadow-none hover:bg-success-soft/80" : ""
                }`}
                onClick={() => toggleLessonCompleted(lesson.id)}
              >
                <CheckCircle2 aria-hidden="true" />
                {completed ? "Completed" : "Mark complete"}
              </Button>
            </div>
          </section>

          <nav aria-label="Lesson navigation" className="grid gap-3 sm:grid-cols-2">
            {previousLesson ? (
              <Link
                className="group rounded-2xl border bg-card p-5 shadow-card transition hover:border-primary/30"
                params={{ lessonId: previousLesson.id }}
                to="/theory/$lessonId"
              >
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-1" />
                  Previous lesson
                </span>
                <span className="mt-2 block font-bold">{previousLesson.title}</span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {nextLesson ? (
              <Link
                className="group rounded-2xl border bg-card p-5 text-right shadow-card transition hover:border-primary/30"
                params={{ lessonId: nextLesson.id }}
                to="/theory/$lessonId"
              >
                <span className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Next lesson
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-2 block font-bold">{nextLesson.title}</span>
              </Link>
            ) : null}
          </nav>
        </main>
      </div>
    </div>
  );
}

function MissingLesson() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center shadow-card">
      <h1 className="text-2xl font-bold">Lesson not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This demonstration lesson is not available.</p>
      <Link
        className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
        to="/theory"
      >
        Return to theory
      </Link>
    </div>
  );
}
