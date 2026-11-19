import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, RotateCcw, Timer, Trophy } from "lucide-react";
import { LEVEL_ONE_CATEGORIES } from "@/data/levelOneCategories";
import { getLevelOneProjects } from "@/data/levelOneProjects";
import { pdfActivityManuals } from "@/data/pdfActivityManuals";
import { levelOneToThreeWixPdfUrls } from "@/data/levelOneToThreeWixPdfUrls";
import { LevelOneBackdrop, LevelOneHeader } from "@/components/practical/LevelOneHeader";
import { FinalBuildWheel } from "@/components/practical/FinalBuildWheel";

export const Route = createFileRoute("/practical/level-1/final-build")({ component: FinalBuildPage });

const PROJECTS = LEVEL_ONE_CATEGORIES.flatMap(category =>
  getLevelOneProjects(category.id).map(project => ({ ...project, category: category.name }))
);
const STORAGE_KEY = "be-stem-ready-level1-final-build-v1";
const LIMIT_MS = 15 * 60 * 1000;
const SPIN_DURATION_MS = 5200;
const ORIGINAL_PDF_BY_URL = new Map(
  Object.entries(levelOneToThreeWixPdfUrls)
    .filter(([filename]) => !filename.includes("/"))
    .map(([filename, url]) => [url.split("?")[0], filename])
);
function sourcePdfFilename(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const withoutQuery = url.split("?")[0];
  return ORIGINAL_PDF_BY_URL.get(withoutQuery) || decodeURIComponent(withoutQuery.split("/").pop() || "");
}
type Stage = "spin" | "spinning" | "ready" | "building" | "assessment" | "result";
type Session = { stage: Stage; projectIndex: number | null; spinFinishAt: number | null; spinRotation: number | null; deadline: number | null; completedAt: number | null; checks: boolean[]; completed: boolean; attempts: number; result: "pass" | "retry" | null };
const initial: Session = { stage: "spin", projectIndex: null, spinFinishAt: null, spinRotation: null, deadline: null, completedAt: null, checks: [false,false,false,false,false], completed: false, attempts: 0, result: null };
function load(): Session {
  if (typeof window === "undefined") return initial;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Session | null;
    if (data && ["spin","spinning","ready","building","assessment","result"].includes(data.stage) && (data.projectIndex === null || (Number.isInteger(data.projectIndex) && data.projectIndex >= 0 && data.projectIndex < PROJECTS.length))) {
      return { ...initial, ...data, checks: Array.isArray(data.checks) && data.checks.length === 5 ? data.checks : initial.checks };
    }
  } catch { /* ignore corrupt saved session */ }
  return initial;
}
function checksFor(name: string, category: string): string[] {
  // Provisional child-friendly wording. Replace after verifying the original Building PDF slides.
  const lower = name.toLowerCase();
  const checks = [
    "My model looks like the picture.",
    "I added all the important parts.",
    "My model stays together when I pick it up.",
    "The moving parts can move without getting stuck.",
    "My model works the way it should.",
  ];
  if (/car|motorcycle|bicycle|sled|vehicle/.test(lower)) {
    checks[1] = "The wheels or moving parts are in the right places.";
    checks[3] = "The wheels or moving parts can move freely.";
  } else if (/light|lamp|star|traffic/.test(lower)) {
    checks[1] = "The light parts are in the right places.";
    checks[4] = "The lights work the way they should.";
  } else if (/arm|robot/.test(lower)) {
    checks[1] = "The head, body, or arm parts are attached.";
  } else if (/clock|fan|windmill|pendulum|chair/.test(lower)) {
    checks[3] = "The parts that should turn or swing can move.";
  } else if (/bird|cat|snake|penguin|dog|crab|owl/.test(lower) || category === "Biomimicry") {
    checks[1] = "The model has the right body parts.";
  }
  return checks;
}
function FinalBuildPage() {
  // Hydrate persisted progress after mount to keep server and browser markup in sync.
  const [session, setSession] = useState<Session>(initial);
  const [storageReady, setStorageReady] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [references, setReferences] = useState<Record<string, { image: string; page: number; source: string }>>({});
  useEffect(() => {
    let active = true;
    fetch("/final-build/level-1/references.json").then(response => response.ok ? response.json() : {}).then(data => { if (active) setReferences(data); }).catch(() => {});
    return () => { active = false; };
  }, []);
  useEffect(() => {
    setSession(load());
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (storageReady) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session, storageReady]);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (session.stage === "building" && session.deadline !== null && now >= session.deadline) {
      setSession(old => old.stage === "building" ? { ...old, stage: "assessment", completed: false } : old);
    }
    // A saved spin always completes, even if the page reloads or the tab is hidden.
    if (session.stage === "spinning" && session.spinFinishAt !== null && now >= session.spinFinishAt) {
      setSession(old => old.stage === "spinning" ? { ...old, stage: "ready" } : old);
    }
  }, [now, session.stage, session.deadline, session.spinFinishAt]);
  const project = session.projectIndex === null ? null : PROJECTS[session.projectIndex];
  const manualProjectId = project?.availableProjectId ?? project?.availableProjectVariants?.[0]?.projectId;
  const manualUrl = manualProjectId ? pdfActivityManuals[manualProjectId]?.url : undefined;
  const manualFilename = project?.name === "Acceleration car"
    ? "Acceleration car_Building.pdf"
    : sourcePdfFilename(manualUrl);
  const reference = manualFilename ? references[manualFilename] : undefined;
  const checks = useMemo(() => project ? checksFor(project.name, project.category) : [], [project]);
  const remaining = session.deadline ? Math.max(0, session.deadline - now) : LIMIT_MS;
  const time = `${String(Math.floor(remaining / 60000)).padStart(2, "0")}:${String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0")}`;
  const update = (change: Partial<Session>) => setSession(old => ({ ...old, ...change }));
  const finishSpin = useCallback(() => {
    setSession(old => old.stage === "spinning" ? { ...old, stage: "ready" } : old);
  }, []);
  function spin() {
    if (session.stage !== "spin") return;
    // Local development only: ?project=Clock allows verifying one model without rerolling.
    const testProject = import.meta.env.DEV && typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("project") : null;
    const fixedIndex = testProject
      ? PROJECTS.findIndex(item => item.name.toLowerCase() === testProject.toLowerCase()) : -1;
    const index = fixedIndex >= 0 ? fixedIndex : Math.floor(Math.random() * PROJECTS.length);
    // There are 59 equal-width positions, grouped into category-colored slices.
    // The selected project position must stop directly under the fixed top pointer.
    const center = (index + 0.5) * 360 / PROJECTS.length;
    const turns = 6 + Math.floor(Math.random() * 2);
    const rotation = turns * 360 + 360 - center;
    update({
      stage: "spinning", projectIndex: index,
      spinFinishAt: Date.now() + SPIN_DURATION_MS, spinRotation: rotation,
      checks: [false,false,false,false,false], completed: false,
      deadline: null, completedAt: null, result: null,
    });
  }
  function assess() {
    const score = session.checks.filter(Boolean).length;
    const pass = session.completed && score >= 4 && (session.deadline !== null && session.completedAt !== null && session.completedAt <= session.deadline);
    update({ stage: "result", result: pass ? "pass" : "retry" });
  }
  function retry(same: boolean) {
    setSession({ ...initial, attempts: session.attempts + 1, stage: same && project ? "ready" : "spin", projectIndex: same ? session.projectIndex : null });
  }
  return (
    <div className="relative min-h-[100dvh] bg-white text-slate-800">
      <LevelOneBackdrop />
      <LevelOneHeader backTo="/practical/level-1" backLabel="Level 1 categories" />
      <main className="relative mx-auto max-w-2xl px-4 pb-12 pt-5 sm:px-6">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-2 grid size-14 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Trophy className="size-8" /></div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Level 1 · Final Challenge</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Build a Robot!</h1>
          <p className="mt-2 text-sm text-slate-600">Spin, build your robot in 15 minutes, then check your work.</p>
        </div>
        <section className="rounded-[28px] border border-sky-100 bg-white p-5 shadow-lg shadow-sky-100/60 sm:p-7" aria-live="polite">
          {(session.stage === "spin" || session.stage === "spinning") && (
            <div className="text-center">
              <FinalBuildWheel
                spinning={session.stage === "spinning"}
                targetRotation={session.spinRotation}
                finishAt={session.spinFinishAt}
                onFinish={finishSpin}
              />
              <p className="mb-4 mt-4 text-sm font-medium text-slate-600">
                Each of the 59 robots has an equal chance to be chosen.
              </p>
              {session.stage === "spin" ? (
                <button type="button" onClick={spin} className="min-h-12 w-full rounded-2xl bg-[#168eea] px-6 font-extrabold text-white shadow-lg shadow-sky-100 transition hover:bg-[#0879c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                  Spin for My Robot!
                </button>
              ) : (
                <p className="min-h-12 rounded-2xl bg-amber-50 px-4 py-3 font-extrabold text-amber-800" role="status">
                  🎉 Spinning… watch the pointer!
                </p>
              )}
            </div>
          )}
          {project && session.stage !== "spin" && session.stage !== "spinning" && (
            <div>
              <div className="mb-4 rounded-2xl bg-sky-50 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-600">{project.category}</p>
                <h2 className="mt-1 text-xl font-black">{project.name}</h2>
              </div>
              {(session.stage === "ready" || session.stage === "building") && (
                <>
                  <div className="mb-4 rounded-2xl border border-sky-200 bg-slate-50 p-3 text-center">
                    {reference ? (
                      <div>
                        <img src={reference.image} alt={`Finished ${project.name} model from the original Building PDF`} className="mx-auto max-h-[45dvh] w-full object-contain" />
                        <p className="mt-2 text-xs font-semibold text-slate-600">Your robot picture · Original Building PDF, page {reference.page}</p>
                      </div>
                    ) : (
                      <div className="py-6">
                        <p className="font-bold text-slate-600">Reference image not approved yet</p>
                        <p className="mt-2 text-xs text-slate-500">A completed-model picture must be checked before this challenge is ready for students.</p>
                      </div>
                    )}
                  </div>
                  <div className="mb-4 flex items-center justify-center gap-2 text-3xl font-black tabular-nums text-sky-700"><Timer />{time}</div>
                </>
              )}
              {session.stage === "ready" && (
                <button type="button" disabled={!reference} onClick={() => update({ stage: "building", deadline: Date.now() + LIMIT_MS, completedAt: null })} className="min-h-12 w-full rounded-2xl bg-[#168eea] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50">Start My 15-Minute Build</button>
              )}
              {session.stage === "building" && (
                <button type="button" onClick={() => update({ stage: "assessment", completed: true, completedAt: Date.now() })} className="min-h-12 w-full rounded-2xl bg-emerald-600 font-extrabold text-white">I Finished My Robot!</button>
              )}
              {session.stage === "assessment" && (
                <div>
                  <p className="mb-2 font-extrabold">Check your robot!</p>
                  <p className="mb-4 text-xs text-amber-700">Draft checklist — parts and actions must be checked against the original Building slides.</p>
                  <div className="space-y-3">
                    {checks.map((item, i) => (
                      <label key={i} className="flex min-h-12 items-center gap-3 rounded-xl bg-sky-50 p-3 text-sm font-semibold">
                        <input type="checkbox" className="size-6 shrink-0 accent-sky-600" checked={session.checks[i]} onChange={e => update({ checks: session.checks.map((v, j) => i === j ? e.target.checked : v) })} />{item}
                      </label>
                    ))}
                  </div>
                  <button type="button" onClick={assess} className="mt-5 min-h-12 w-full rounded-2xl bg-[#168eea] font-extrabold text-white">See My Result</button>
                </div>
              )}
              {session.stage === "result" && (
                <div className="text-center">
                  <CheckCircle2 className="mx-auto size-12 text-sky-600" />
                  <h3 className="mt-2 text-2xl font-black">{session.result === "pass" ? "Great Building!" : "Keep Trying!"}</h3>
                  <p className="my-3 text-sm text-slate-600">{session.checks.filter(Boolean).length} of 5 checks completed. {session.result === "pass" ? "You finished on time!" : "Try building again and check your robot."}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => retry(true)} className="min-h-12 rounded-2xl bg-sky-100 font-extrabold text-sky-800"><RotateCcw className="mr-2 inline size-4" />Try Same Robot</button>
                    <button type="button" onClick={() => retry(false)} className="min-h-12 rounded-2xl bg-[#168eea] font-extrabold text-white">Spin Again</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        <div className="mt-5 flex items-center justify-between gap-4">
          <Link to="/practical/level-1" className="inline-flex items-center gap-2 text-sm font-bold text-sky-700"><ArrowLeft className="size-4" />Back to Categories</Link>
          {import.meta.env.DEV && (
            <button type="button" onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setSession({ ...initial, checks: [...initial.checks] });
            }} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500">
              Reset local test
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
