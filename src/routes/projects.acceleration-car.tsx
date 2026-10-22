import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Presentation, Wrench } from "lucide-react";
import { AccelerationLearningStudio } from "@/components/learning/AccelerationLearningStudio";

export const Route = createFileRoute("/projects/acceleration-car")({
  component: AccelerationCarProjectPage,
});

type ProjectView = "overview" | "lecture" | "quiz";

/**
 * The project hub is the entry point after selecting Acceleration Car from Level 1.
 * Learning and Building remain independently accessible. The quiz is part of
 * Learning; the original PDF building instructions are unchanged.
 */
function AccelerationCarProjectPage() {
  const [view, setView] = useState<ProjectView>("overview");

  if (view === "lecture" || view === "quiz") {
    return (
      <AccelerationLearningStudio
        key={view}
        initialView={view === "quiz" ? "quiz" : "slides"}
        onBackToProject={() => setView("overview")}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#f3faff] text-[#132654]">
      <header className="border-b border-sky-100 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          <Link
            to="/practical/level-1/autonomous-navigation-ranging"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-sky-100 px-3 text-sm font-bold text-[#168eea] hover:bg-sky-50"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back to Category</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <span className="text-right text-xs font-extrabold uppercase tracking-wider text-[#168eea]">
            BE STEM READY · Level 1
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-8 sm:pt-10">
        <section className="rounded-[30px] border border-sky-100 bg-white p-6 shadow-[0_12px_35px_rgba(22,142,234,.08)] sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-[#168eea]">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Autonomous Navigation &amp; Ranging
          </span>
          <h1 className="mt-4 text-[clamp(2rem,6vw,3.4rem)] font-black leading-tight tracking-tight">
            Acceleration Car
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
            Discover how driving and driven gears change speed, check your
            understanding, and build the car with its original manual.
          </p>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Choose Learning or Building. You can start either one at any time.
          </p>
        </section>

        <h2 className="mt-8 text-xl font-black sm:text-2xl">Choose your studio</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="flex flex-col rounded-[28px] border border-sky-100 bg-white p-5 shadow-[0_8px_25px_rgba(22,142,234,.07)] sm:p-7">
            <div className="flex items-center justify-between">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#eaf5ff] text-[#168eea]">
                <BookOpen className="size-7" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-[#168eea]">17 lecture slides</span>
            </div>
            <h3 className="mt-4 text-xl font-black">Learning Studio</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              View the original PowerPoint PDF one slide at a time, then take
              a five-question quiz with links back to the teaching slides.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-lg bg-slate-50 px-2.5 py-1.5">Slides &amp; explanations</span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1.5">80% to pass</span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1.5">Unlimited retries</span>
            </div>
            <button type="button" onClick={() => setView("lecture")}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-4 text-sm font-extrabold text-white transition hover:bg-[#0d7fda] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
              <Presentation className="size-5" aria-hidden="true" />
              Open Lecture Slides <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setView("quiz")}
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-extrabold text-[#168eea] transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
              <ClipboardCheck className="size-5" aria-hidden="true" />
              Start Quick Quiz (5 Questions)
            </button>
          </section>

          <section className="flex flex-col rounded-[28px] border border-sky-100 bg-white p-5 shadow-[0_8px_25px_rgba(22,142,234,.07)] sm:p-7">
            <div className="flex items-center justify-between">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#fff5dc] text-[#da9300]">
                <Wrench className="size-7" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">18 build steps</span>
            </div>
            <h3 className="mt-4 text-xl font-black">Building Studio</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              Assemble the Acceleration Car using the original building-manual
              PDF, with step navigation and the existing floating instruction dock.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-lg bg-slate-50 px-2.5 py-1.5">Original manual</span>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1.5">One step at a time</span>
            </div>
            <Link to="/practical/$projectId" params={{ projectId: "acceleration-car" }}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#132654] px-4 text-sm font-extrabold text-white transition hover:bg-[#1b366f]">
              <Wrench className="size-5" aria-hidden="true" />
              Open Building Studio <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-slate-500">
          Learning and Building track progress separately. You do not need to pass the quiz before building.
        </p>
      </main>
    </div>
  );
}
