import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Clock3, PackageCheck, ShieldCheck } from "lucide-react";

import { getProject } from "@/data/practical";

export const Route = createFileRoute("/practical/$projectId")({
  component: PracticalProjectPage,
});

function PracticalProjectPage() {
  const { projectId = "" } = Route.useParams();
  const project = getProject(projectId);

  if (!project) {
    return <MissingProject />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        to="/practical"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to practical
      </Link>

      <header className="relative overflow-hidden rounded-3xl bg-navy p-6 text-navy-foreground shadow-lift sm:p-8">
        <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-60" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy-muted">
            Project {project.number} · {project.difficulty}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-navy-muted">{project.objective}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-2 rounded-full bg-navy-hover px-3 py-1.5">
              <Clock3 aria-hidden="true" className="size-3.5" /> {project.buildMinutes} minutes
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-navy-hover px-3 py-1.5">
              <PackageCheck aria-hidden="true" className="size-3.5" /> {project.components.length} components
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <article className="rounded-3xl border bg-card p-6 shadow-card sm:p-7">
          <h2 className="text-xl font-bold">Required components</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {project.components.map((component) => (
              <li className="flex gap-3 rounded-xl bg-secondary px-4 py-3 text-sm" key={component}>
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {component}
              </li>
            ))}
          </ul>
        </article>

        <aside className="rounded-3xl border border-warning/20 bg-warning-soft p-6 sm:p-7">
          <div className="flex items-center gap-3 text-warning">
            <ShieldCheck aria-hidden="true" className="size-5" />
            <h2 className="font-bold">Safety first</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-foreground/80">{project.safetyNote}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full build workspace coming in the next frontend stage
          </p>
        </aside>
      </section>
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
