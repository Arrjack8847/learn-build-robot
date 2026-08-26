import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Lightbulb, Target } from "lucide-react";

import { useProgress } from "@/context/ProgressContext";
import { getLesson, getModuleForLesson } from "@/data/theory";

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

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        to="/theory"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to theory
      </Link>

      <header className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
        <p className="text-sm font-semibold text-primary">{module.title}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This lesson workspace is ready for the full reading and AI quiz experience in the next frontend stage.
        </p>
        <button
          className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            completed
              ? "bg-success-soft text-success"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
          onClick={() => toggleLessonCompleted(lesson.id)}
          type="button"
        >
          <CheckCircle2 aria-hidden="true" className="size-4" />
          {completed ? "Lesson completed" : "Mark lesson complete"}
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <Target aria-hidden="true" className="size-5" />
            </span>
            <h2 className="text-lg font-bold">Learning objectives</h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
            {lesson.objectives.map((objective) => (
              <li className="flex gap-3" key={objective}>
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {objective}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-warning-soft text-warning">
              <Lightbulb aria-hidden="true" className="size-5" />
            </span>
            <h2 className="text-lg font-bold">Key concept</h2>
          </div>
          <h3 className="mt-5 font-bold">{lesson.concept.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{lesson.concept.body}</p>
        </article>
      </section>
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
