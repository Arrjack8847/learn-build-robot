import { useState } from "react";
import { CheckCircle2, Lightbulb, PackageCheck, ShieldAlert, Wrench } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";
import type { PracticalProject } from "@/types/learning";

export function ProjectWorkspace({ project }: { project: PracticalProject }) {
  const { isStepCompleted, toggleStepCompleted } = useProgress();
  const [checkedComponents, setCheckedComponents] = useState<string[]>([]);

  const completedSteps = project.steps.filter((step) => isStepCompleted(step.id)).length;
  const progressPercent = Math.round((completedSteps / project.steps.length) * 100);
  const nextStep = project.steps.find((step) => !isStepCompleted(step.id));

  function toggleComponent(component: string, checked: boolean) {
    setCheckedComponents((current) => {
      if (checked) return current.includes(component) ? current : [...current, component];
      return current.filter((item) => item !== component);
    });
  }

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="components-heading"
        className="rounded-3xl border bg-card p-6 shadow-card sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
              <PackageCheck aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 id="components-heading" className="text-xl font-bold">
                Check your components
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Confirm every demonstration part before starting. This readiness checklist resets
                when you leave the project.
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            {checkedComponents.length}/{project.components.length} ready
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {project.components.map((component, index) => {
            const checked = checkedComponents.includes(component);
            const inputId = `${project.id}-component-${index}`;

            return (
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm leading-6 transition ${
                  checked ? "border-success/30 bg-success-soft/50" : "hover:border-primary/30"
                }`}
                htmlFor={inputId}
                key={component}
              >
                <Checkbox
                  checked={checked}
                  className="mt-0.5 size-5"
                  id={inputId}
                  onCheckedChange={(value) => toggleComponent(component, value === true)}
                />
                <span className={checked ? "text-muted-foreground line-through" : ""}>{component}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="build-steps-heading"
        className="rounded-3xl border bg-card p-6 shadow-card sm:p-8"
        id="build-steps"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
              <Wrench aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 id="build-steps-heading" className="text-xl font-bold">
                Guided build
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Work in order and check each step only after you have tested it.
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            {completedSteps}/{project.steps.length} steps
          </span>
        </div>

        <Progress
          aria-label={`${progressPercent}% of ${project.title} completed`}
          className="mt-6 bg-secondary [&>div]:bg-success"
          value={progressPercent}
        />

        <ol className="mt-7 space-y-4">
          {project.steps.map((step) => {
            const completed = isStepCompleted(step.id);
            const current = nextStep?.id === step.id;

            return (
              <li
                className={`rounded-2xl border p-5 transition sm:p-6 ${
                  completed
                    ? "border-success/25 bg-success-soft/35"
                    : current
                      ? "border-primary/30 shadow-card"
                      : "bg-background"
                }`}
                key={step.id}
              >
                <div className="flex items-start gap-4">
                  <button
                    aria-label={`${completed ? "Mark incomplete" : "Mark complete"}: step ${step.number}, ${step.title}`}
                    className={`grid size-10 shrink-0 place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      completed
                        ? "border-success bg-success text-white"
                        : "border-primary/30 text-primary hover:bg-primary-soft"
                    }`}
                    onClick={() => toggleStepCompleted(step.id)}
                    type="button"
                  >
                    {completed ? (
                      <CheckCircle2 aria-hidden="true" className="size-5" />
                    ) : (
                      <span className="text-sm font-bold">{step.number}</span>
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{step.title}</h3>
                      {current ? (
                        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                          Next step
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                    {step.note ? (
                      <div
                        className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm leading-6 ${
                          step.note.type === "warning" ? "bg-warning-soft" : "bg-primary-soft"
                        }`}
                      >
                        {step.note.type === "warning" ? (
                          <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
                        ) : (
                          <Lightbulb aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                        )}
                        {step.note.text}
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {completedSteps === project.steps.length ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-success" role="status">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-bold">Build steps complete</p>
              <p className="mt-1 text-sm leading-6 text-foreground/80">
                Your project progress is saved. Add evidence and an explanation below for the
                simulated AI assessment.
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
