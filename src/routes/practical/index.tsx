import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, Clock3, ListChecks } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useProjectProgress } from "@/context/ProgressContext";
import { practicalProjects } from "@/data/practical";

export const Route = createFileRoute("/practical/")({
  component: PracticalCataloguePage,
});

function PracticalCataloguePage() {
  const getProjectProgress = useProjectProgress();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      <header>
        <p className="text-sm font-semibold text-primary">Learning category</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Robot Practical</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Follow guided steps to assemble, test and understand robot projects using demonstration content.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {practicalProjects.map((project) => {
          const projectProgress = getProjectProgress(project.id);

          return (
            <article className="flex flex-col rounded-3xl border bg-card p-6 shadow-card sm:p-7" key={project.id}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Bot aria-hidden="true" className="size-6" />
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {projectProgress.status}
                </span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Project {project.number}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight">{project.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 aria-hidden="true" className="size-3.5" /> {project.buildMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ListChecks aria-hidden="true" className="size-3.5" /> {project.steps.length} steps
                </span>
                <span>{project.difficulty}</span>
              </div>
              <Progress
                aria-label={`${projectProgress.percent}% complete for ${project.title}`}
                className="mt-4 bg-secondary [&>div]:bg-success"
                value={projectProgress.percent}
              />
              <Link
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                params={{ projectId: project.id }}
                to="/practical/$projectId"
              >
                {projectProgress.status === "Not Started" ? "Start project" : "Continue project"}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
