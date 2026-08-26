import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";

import { PracticalAssessment } from "@/components/practical/PracticalAssessment";
import { ProjectWorkspace } from "@/components/practical/ProjectWorkspace";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useProjectProgress } from "@/context/ProgressContext";
import { getProject, practicalProjects } from "@/data/practical";
import { getModule } from "@/data/theory";

export const Route = createFileRoute("/practical/$projectId")({
  component: PracticalProjectPage,
});

function PracticalProjectPage() {
  const { projectId = "" } = Route.useParams();
  const project = getProject(projectId);
  const getProjectProgress = useProjectProgress();

  if (!project) {
    return <MissingProject />;
  }

  const projectProgress = getProjectProgress(project.id);
  const projectIndex = practicalProjects.findIndex((item) => item.id === project.id);
  const previousProject = projectIndex > 0 ? practicalProjects[projectIndex - 1] : undefined;
  const nextProject =
    projectIndex < practicalProjects.length - 1 ? practicalProjects[projectIndex + 1] : undefined;
  const relatedModules = project.relatedModuleIds
    .map((moduleId) => getModule(moduleId))
    .filter((module) => module !== undefined);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"
        to="/practical"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to practical
      </Link>

      <header className="relative overflow-hidden rounded-3xl bg-navy text-navy-foreground shadow-lift">
        <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-60" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy-muted">
                Project {project.number} · {project.difficulty}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-navy-muted sm:text-base">
                {project.objective}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-navy-hover px-3 py-1.5">
                  <Clock3 aria-hidden="true" className="size-3.5" /> {project.buildMinutes} minutes
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-navy-hover px-3 py-1.5">
                  <PackageCheck aria-hidden="true" className="size-3.5" /> {project.components.length}{" "}
                  components
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-navy-hover px-3 py-1.5">
                  <Wrench aria-hidden="true" className="size-3.5" /> {project.steps.length} steps
                </span>
              </div>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                projectProgress.status === "Completed"
                  ? "bg-success-soft text-success"
                  : "bg-navy-hover text-navy-foreground"
              }`}
            >
              {projectProgress.status === "Completed" ? (
                <CheckCircle2 aria-hidden="true" className="size-4" />
              ) : null}
              {projectProgress.status}
            </span>
          </div>
        </div>
        <div className="relative border-t border-white/10 bg-navy-hover/70 px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-navy-muted">
            <span>
              {projectProgress.completed} of {projectProgress.total} build steps complete
            </span>
            <span>{projectProgress.percent}%</span>
          </div>
          <Progress
            aria-label={`${projectProgress.percent}% of ${project.title} completed`}
            className="mt-2 bg-navy [&>div]:bg-success"
            value={projectProgress.percent}
          />
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <article className="rounded-3xl border bg-card p-6 shadow-card sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <Target aria-hidden="true" className="size-5" />
            </span>
            <h2 className="text-lg font-bold">Project objective</h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.description}</p>
          <p className="mt-3 text-sm leading-7 text-foreground">{project.objective}</p>
        </article>

        <aside className="rounded-3xl border border-warning/20 bg-warning-soft p-6 sm:p-7">
          <div className="flex items-center gap-3 text-warning">
            <ShieldCheck aria-hidden="true" className="size-5" />
            <h2 className="font-bold">Safety first</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-foreground/80">{project.safetyNote}</p>
        </aside>
      </section>

      <ProjectWorkspace key={project.id} project={project} />

      <PracticalAssessment key={project.id} project={project} />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold">Troubleshooting</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start with the symptom that best matches your build.
          </p>
          <Accordion className="mt-4" collapsible type="single">
            {project.troubleshooting.map((item, index) => (
              <AccordionItem key={item.question} value={`issue-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </article>

        <article className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <BookOpen aria-hidden="true" className="size-5" />
            </span>
            <h2 className="text-xl font-bold">Related theory</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            These modules explain the ideas used in this practical project.
          </p>
          <div className="mt-5 space-y-3">
            {relatedModules.map((module) => {
              const firstLesson = module.lessons[0];
              return firstLesson ? (
                <Link
                  className="group flex items-center justify-between gap-4 rounded-xl bg-secondary p-4 transition hover:bg-primary-soft"
                  key={module.id}
                  params={{ lessonId: firstLesson.id }}
                  to="/theory/$lessonId"
                >
                  <span>
                    <span className="block text-xs font-semibold text-muted-foreground">
                      Module {module.number}
                    </span>
                    <span className="mt-1 block text-sm font-bold">{module.title}</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ) : null;
            })}
          </div>
        </article>
      </section>

      <nav aria-label="Project navigation" className="grid gap-3 sm:grid-cols-2">
        {previousProject ? (
          <Link
            className="group rounded-2xl border bg-card p-5 shadow-card transition hover:border-primary/30"
            params={{ projectId: previousProject.id }}
            to="/practical/$projectId"
          >
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-1" />
              Previous project
            </span>
            <span className="mt-2 block font-bold">{previousProject.title}</span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {nextProject ? (
          <Link
            className="group rounded-2xl border bg-card p-5 text-right shadow-card transition hover:border-primary/30"
            params={{ projectId: nextProject.id }}
            to="/practical/$projectId"
          >
            <span className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Next project
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="mt-2 block font-bold">{nextProject.title}</span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}

function MissingProject() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center shadow-card">
      <h1 className="text-2xl font-bold">Project not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This demonstration project is not available.</p>
      <Link
        className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
        to="/practical"
      >
        Return to practical
      </Link>
    </div>
  );
}
