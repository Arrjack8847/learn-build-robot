import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronDown, Circle } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";
import type { TheoryModule } from "@/types/learning";

const lessonSections = [
  { id: "objectives", label: "Learning objectives" },
  { id: "lesson", label: "Lesson notes" },
  { id: "key-concept", label: "Key concept" },
  { id: "worked-example", label: "Worked example" },
  { id: "lesson-quiz", label: "Knowledge check" },
] as const;

interface LessonOutlineProps {
  lessonId: string;
  module: TheoryModule;
}

export function LessonOutline({ lessonId, module }: LessonOutlineProps) {
  return (
    <div className="lg:col-start-2 lg:row-start-1">
      <Collapsible className="group lg:hidden">
        <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm font-semibold shadow-card">
          Lesson contents
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform group-data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 rounded-2xl border bg-card p-5 shadow-card">
            <LessonOutlineContent lessonId={lessonId} module={module} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-3xl border bg-card p-5 shadow-card">
          <LessonOutlineContent lessonId={lessonId} module={module} />
        </div>
      </aside>
    </div>
  );
}

function LessonOutlineContent({ lessonId, module }: LessonOutlineProps) {
  const { isLessonCompleted } = useProgress();
  const completedCount = module.lessons.filter((lesson) => isLessonCompleted(lesson.id)).length;
  const percent = Math.round((completedCount / module.lessons.length) * 100);

  return (
    <div className="space-y-6">
      <section aria-labelledby="contents-heading">
        <h2 id="contents-heading" className="text-sm font-bold">
          In this lesson
        </h2>
        <nav aria-label="Lesson contents" className="mt-3">
          <ul className="space-y-1">
            {lessonSections.map((section) => (
              <li key={section.id}>
                <a
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  href={`#${section.id}`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section aria-labelledby="module-lessons-heading" className="border-t pt-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="module-lessons-heading" className="text-sm font-bold">
            Module {module.number}
          </h2>
          <span className="text-xs font-semibold text-muted-foreground">
            {completedCount}/{module.lessons.length}
          </span>
        </div>
        <Progress
          aria-label={`${percent}% of this module completed`}
          className="mt-3 bg-secondary [&>div]:bg-success"
          value={percent}
        />
        <nav aria-label={`${module.title} lessons`} className="mt-4">
          <ul className="space-y-1.5">
            {module.lessons.map((lesson, index) => {
              const active = lesson.id === lessonId;
              const completed = isLessonCompleted(lesson.id);

              return (
                <li key={lesson.id}>
                  <Link
                    className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-primary-soft font-semibold text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    params={{ lessonId: lesson.id }}
                    to="/theory/$lessonId"
                  >
                    {completed ? (
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                    ) : (
                      <Circle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    )}
                    <span>
                      <span className="sr-only">Lesson {index + 1}: </span>
                      {lesson.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </section>
    </div>
  );
}
