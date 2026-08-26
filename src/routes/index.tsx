import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";
import { allLessons } from "@/data/theory";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const statsConfig = [
  { key: "overall", label: "Overall progress", icon: Trophy },
  { key: "theory", label: "Theory lessons", icon: BookOpen },
  { key: "practical", label: "Robot projects", icon: Bot },
  { key: "quiz", label: "Average quiz", icon: ClipboardCheck },
] as const;

function DashboardPage() {
  const { progress, stats, hydrated } = useProgress();
  const latestQuiz = progress.quizAttempts[0];
  const latestPractical = progress.practicalGrades[0];
  const nextLesson =
    allLessons.find((lesson) => !progress.completedLessonIds.includes(lesson.id)) ?? allLessons[0];

  if (!nextLesson) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center shadow-card">
        <h1 className="text-2xl font-bold">Learning content is being prepared</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Theory lessons will appear here when demonstration content is available.
        </p>
      </div>
    );
  }

  const statValues = {
    overall: hydrated ? `${stats.overallPercent}%` : "—",
    theory: hydrated ? `${stats.completedLessons}/${stats.totalLessons}` : "—",
    practical: hydrated ? `${stats.completedProjects}/${stats.totalProjects}` : "—",
    quiz: hydrated && stats.averageQuizScore !== null ? `${stats.averageQuizScore}%` : "No attempts",
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Student workspace</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Good morning, {progress.studentName}
          </h1>
          <p className="mt-2 text-muted-foreground">Ready to continue building?</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-accent-foreground">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Demonstration content
        </div>
      </header>

      <section aria-label="Learning summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statsConfig.map(({ key, label, icon: Icon }) => (
          <article key={key} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-card-foreground">
              {statValues[key]}
            </p>
            {key === "overall" ? (
              <Progress
                aria-label={`${stats.overallPercent}% overall progress`}
                className="mt-3 bg-secondary [&>div]:bg-success"
                value={stats.overallPercent}
              />
            ) : null}
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="relative overflow-hidden rounded-3xl bg-navy p-6 text-navy-foreground shadow-lift sm:p-8">
          <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-70" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">
              Continue learning
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {nextLesson.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-navy-muted">
              Continue the next theory lesson and build the knowledge you will use in the robot lab.
            </p>
            <Link
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
              params={{ lessonId: nextLesson.id }}
              to="/theory/$lessonId"
            >
              Continue lesson
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </article>

        <article className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-success-soft text-success">
              <CheckCircle2 aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Your learning progress</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Completed lessons and projects are saved on this device for the current prototype.
              </p>
            </div>
          </div>
          <Link
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
            to="/progress"
          >
            View progress
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </article>
      </section>

      {hydrated && latestQuiz ? (
        <section
          aria-labelledby="latest-quiz-heading"
          className="rounded-3xl border bg-card p-6 shadow-card sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <BrainCircuit aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Latest quiz feedback
                </p>
                <h2 id="latest-quiz-heading" className="mt-1 text-xl font-bold">
                  {latestQuiz.lessonTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold text-success">Strength:</span>{" "}
                  {latestQuiz.strengths[0] ?? "Quiz completed"}
                  <span aria-hidden="true"> · </span>
                  <span className="font-semibold text-warning">Review:</span>{" "}
                  {latestQuiz.review[0] ?? "No review needed"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 lg:pl-6">
              <span
                className={`grid size-20 shrink-0 place-items-center rounded-full text-xl font-bold ${
                  latestQuiz.percentage >= 80
                    ? "bg-success-soft text-success"
                    : "bg-warning-soft text-warning"
                }`}
              >
                {latestQuiz.percentage}%
              </span>
              <div className="space-y-2">
                <Link
                  className="flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  params={{ lessonId: latestQuiz.lessonId }}
                  to="/theory/$lessonId"
                >
                  Revisit lesson
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  className="flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                  to="/progress"
                >
                  All results
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {hydrated && latestPractical ? (
        <section
          aria-labelledby="latest-practical-heading"
          className="rounded-3xl border bg-card p-6 shadow-card sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-success-soft text-success">
                <Bot aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Latest practical feedback
                </p>
                <h2 id="latest-practical-heading" className="mt-1 text-xl font-bold">
                  {latestPractical.projectTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold text-success">Strength:</span>{" "}
                  {latestPractical.strengths[0] ?? "Project submitted"}
                  <span aria-hidden="true"> · </span>
                  <span className="font-semibold text-warning">Improve:</span>{" "}
                  {latestPractical.improvements[0] ?? "Continue testing"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 lg:pl-6">
              <span
                className={`grid size-20 shrink-0 place-items-center rounded-full text-xl font-bold ${
                  latestPractical.total >= 80
                    ? "bg-success-soft text-success"
                    : "bg-warning-soft text-warning"
                }`}
              >
                {latestPractical.total}%
              </span>
              <div className="space-y-2">
                <Link
                  className="flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  params={{ projectId: latestPractical.projectId }}
                  to="/practical/$projectId"
                >
                  Revisit project
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  className="flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                  to="/progress"
                >
                  All results
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="learning-paths-heading">
        <div className="mb-4">
          <h2 id="learning-paths-heading" className="text-xl font-bold tracking-tight">
            Choose your learning path
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Learn the idea, then apply it by building.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CategoryCard
            description="Understand the ideas behind robotics, electronics, sensors and programming."
            icon={BookOpen}
            label="Theory"
            meta={`${stats.totalLessons} lessons`}
            to="/theory"
          />
          <CategoryCard
            description="Follow guided steps to assemble, test and understand robot projects."
            icon={Bot}
            label="Robot Practical"
            meta={`${stats.totalProjects} projects`}
            to="/practical"
          />
        </div>
      </section>
    </div>
  );
}

function CategoryCard({
  label,
  description,
  meta,
  to,
  icon: Icon,
}: {
  label: string;
  description: string;
  meta: string;
  to: "/theory" | "/practical";
  icon: LucideIcon;
}) {
  return (
    <Link
      className="group rounded-3xl border bg-card p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift sm:p-7"
      to={to}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
          {meta}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-bold text-card-foreground">{label}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Explore {label.toLowerCase()}
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
