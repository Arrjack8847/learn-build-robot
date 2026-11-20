import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw, Timer, Trophy } from "lucide-react";
import { LevelOneBackdrop } from "@/components/practical/LevelOneHeader";
import { FinalBuildScanner } from "@/components/practical/FinalBuildScanner";
import { FinalBuildPrototype, type PrototypeClip, type PrototypeStatus } from "@/components/practical/FinalBuildPrototype";
import { getFinalBuildInventory, getFinalBuildPool, secureRandomIndex } from "@/data/finalBuildRegistry";
import type { FinalBuildVariant } from "@/data/finalBuildRegistry";
import approvalData from "@/data/finalBuildApprovals.json";

type Stage = "discover" | "scanning" | "ready" | "building" | "assessment" | "result";
type Session = {
  level: number;
  stage: Stage;
  projectId: string | null;
  variantId: string | null;
  scanUntil: number | null;
  startedAt: number | null;
  deadline: number | null;
  completedAt: number | null;
  acknowledgedFinish: boolean;
  checks: boolean[];
  attempts: number;
  result: "pass" | "retry" | null;
};
type Approval = {
  level: number; projectId: string; variantId: string; url: string;
  sha256: string; page: number; crop: PrototypeClip; approved: boolean;
  reviewer: string;
};
const approvals: readonly Approval[] = approvalData.references as Approval[];
const LIMIT_MS = 15 * 60 * 1000;
const SCAN_MS = 4200;
const stages: Stage[] = ["discover", "scanning", "ready", "building", "assessment", "result"];
function emptySession(level: number): Session {
  return { level, stage: "discover", projectId: null, variantId: null, scanUntil: null,
    startedAt: null, deadline: null, completedAt: null, acknowledgedFinish: false,
    checks: [false, false, false, false, false], attempts: 0, result: null };
}
function storageKey(level: number): string {
  return "be-stem-ready-final-build-level-" + level + "-v1";
}
function restore(level: number, ids: Set<string>): Session {
  const fresh = emptySession(level);
  try {
    const raw = window.localStorage.getItem(storageKey(level));
    if (!raw) return fresh;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return fresh;
    const value = parsed as Partial<Session>;
    if (value.level !== level || !stages.includes(value.stage as Stage)) return fresh;
    if (value.projectId !== null && (typeof value.projectId !== "string" || !ids.has(value.projectId))) return fresh;
    if (value.stage !== "discover" && (!value.projectId || !ids.has(value.projectId))) return fresh;
    const checks = value.checks;
    if (!Array.isArray(checks) || checks.length !== 5 || !checks.every(check => typeof check === "boolean")) return fresh;
    for (const key of ["scanUntil", "startedAt", "deadline", "completedAt"] as const) {
      if (value[key] != null && (!Number.isFinite(value[key]) || (value[key] as number) < 0)) return fresh;
    }
    if (["building", "assessment", "result"].includes(value.stage as string) &&
      (value.startedAt == null || value.deadline == null || value.deadline !== value.startedAt + LIMIT_MS)) return fresh;
    if (value.stage === "scanning" && value.scanUntil == null) return fresh;
    return { ...fresh, ...value, checks, attempts: Number.isSafeInteger(value.attempts) && (value.attempts as number) >= 0 ? value.attempts as number : 0 };
  } catch { return fresh; }
}
function formatTime(ms: number): string {
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}
function checkDescriptions(name: string): string[] {
  const movement = /car|robot|fan|wheel|swing|crane|walking|vehicle|spinning|turntable|door|gate|motor|clock|bike|turtle|arm/i.test(name);
  return [
    "My finished model matches the official robot reference.",
    "I attached the important parts in the correct positions.",
    "All required connectors and supports are securely fitted.",
    movement ? "The intended moving mechanism operates correctly." : "The completed structure is stable and properly aligned.",
    "The model is complete and performs its intended task, where applicable.",
  ];
}
function referenceIsApproved(level: number, projectId: string, variant: FinalBuildVariant): Approval | undefined {
  return approvals.find(a =>
    a.level === level && a.projectId === projectId && a.variantId === variant.id &&
    a.url === variant.url && typeof a.sha256 === "string" && a.sha256.length >= 32 &&
    a.approved === true && Boolean(a.reviewer) &&
    Number.isInteger(a.page) && a.page > 0 &&
    a.crop && [a.crop.x, a.crop.y, a.crop.width, a.crop.height].every(Number.isFinite) &&
    a.crop.x >= 0 && a.crop.y >= 0 && a.crop.width > 0 && a.crop.height > 0 &&
    a.crop.x + a.crop.width <= 1 && a.crop.y + a.crop.height <= 1
  );
}
/** Shared Level 2–6 exam UI, with the exact Level 1 discovery chamber. */
export function FinalBuildExam({ level }: { level: 2 | 3 | 4 | 5 | 6 }) {
  const inventory = useMemo(() => getFinalBuildInventory(level), [level]);
  const pool = useMemo(() => getFinalBuildPool(level), [level]);
  const ids = useMemo(() => new Set(pool.map(p => p.id)), [pool]);
  const [session, setSession] = useState<Session>(() => emptySession(level));
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(0);
  const [model, setModel] = useState<{ filename: string; status: PrototypeStatus } | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewCrop, setReviewCrop] = useState<PrototypeClip>({ x: 0.2, y: 0.1, width: 0.6, height: 0.75 });
  const [reviewMode, setReviewMode] = useState(false);
  const onModelStatus = useCallback((filename: string, status: PrototypeStatus) =>
    setModel(prev => prev?.filename === filename && prev.status === status ? prev : { filename, status }), []);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const reviewing = query.get("review") === "1";
    setReviewMode(reviewing);
    if (reviewing) {
      const named = query.get("project");
      const idx = named ? pool.findIndex(p => p.id === named || p.name.toLowerCase() === named.toLowerCase()) : 0;
      setReviewIndex(Math.max(0, idx));
      const page = Number(query.get("page"));
      if (Number.isInteger(page) && page > 0) setReviewPage(page);
      setSession({ ...emptySession(level), stage: "ready", projectId: pool[Math.max(0, idx)]?.id ?? null,
        variantId: pool[Math.max(0, idx)]?.variants[0]?.id ?? null });
    } else setSession(restore(level, ids));
    setHydrated(true);
    setNow(Date.now());
  }, [level, ids, pool]);
  useEffect(() => {
    if (hydrated && !reviewMode) window.localStorage.setItem(storageKey(level), JSON.stringify(session));
  }, [level, hydrated, reviewMode, session]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (session.stage === "scanning" && session.scanUntil !== null && now >= session.scanUntil)
      setSession(prev => prev.stage === "scanning" ? { ...prev, stage: "ready" } : prev);
    if (session.stage === "building" && session.deadline !== null && now >= session.deadline)
      setSession(prev => prev.stage === "building" ? { ...prev, stage: "assessment", acknowledgedFinish: false } : prev);
  }, [now, session.stage, session.scanUntil, session.deadline]);
  const project = pool.find(p => p.id === session.projectId) ?? null;
  const variant = project?.variants.find(v => v.id === session.variantId) ?? project?.variants[0] ?? null;
  const approval = project && variant ? referenceIsApproved(level, project.id, variant) : undefined;
  const pictureReady = Boolean(variant && model?.filename === variant.id && model.status === "ready");
  const startAllowed = Boolean(approval && pictureReady && variant?.hostedOnWix);
  const testAllowed = Boolean(reviewMode && variant && pictureReady);
  const remaining = session.deadline === null ? LIMIT_MS : Math.max(0, session.deadline - now);
  const elapsed = session.startedAt != null && session.completedAt != null ? Math.max(0, session.completedAt - session.startedAt) : null;
  const isScanning = session.stage === "discover" || session.stage === "scanning";
  const back = "/practical/levels/" + level;
  function setVariant(id: string) {
    setModel(null);
    setSession(prev => ({ ...prev, variantId: id }));
  }
  function discover() {
    if (session.stage !== "discover" || !pool.length || !hydrated) return;
    const chosen = pool[secureRandomIndex(pool.length)];
    setModel(null);
    setSession(prev => ({
      ...emptySession(level), attempts: prev.attempts, projectId: chosen.id,
      variantId: chosen.variants[0]?.id ?? null, stage: "scanning",
      scanUntil: Date.now() + SCAN_MS,
    }));
  }
  function start() {
    if (!startAllowed && !testAllowed) return;
    const startedAt = Date.now();
    setSession(prev => ({ ...prev, stage: "building", startedAt,
      deadline: startedAt + LIMIT_MS, completedAt: null, acknowledgedFinish: false, checks: [false, false, false, false, false], result: null }));
  }
  function finish() {
    setSession(prev => prev.stage === "building"
      ? { ...prev, stage: "assessment", acknowledgedFinish: Date.now() <= (prev.deadline ?? 0), completedAt: Date.now() } : prev);
  }
  function result() {
    setSession(prev => {
      if (prev.stage !== "assessment") return prev;
      const pass = prev.acknowledgedFinish && prev.checks.filter(Boolean).length >= 4 &&
        prev.completedAt !== null && prev.deadline !== null && prev.completedAt <= prev.deadline;
      return { ...prev, stage: "result", result: pass ? "pass" : "retry" };
    });
  }
  function retry(same: boolean) {
    setModel(null);
    setSession(prev => ({ ...emptySession(level), attempts: prev.attempts + 1,
      projectId: same ? prev.projectId : null, variantId: same ? prev.variantId : null,
      stage: same ? "ready" : "discover" }));
  }
  function selectReviewer(index: number) {
    const next = pool[index];
    if (!next || !reviewMode) return;
    setModel(null);
    setReviewIndex(index);
    setSession({ ...emptySession(level), stage: "ready", projectId: next.id, variantId: next.variants[0]?.id ?? null });
  }
  const crop = approval?.crop ?? reviewCrop;
  const page = approval?.page ?? reviewPage;
  const renderCandidate = Boolean(variant && (approval || reviewMode));
  const readyChecks = project ? checkDescriptions(project.name) : [];
  if (!hydrated) return <div className="grid min-h-dvh place-items-center bg-sky-50 text-sky-800" role="status">Preparing Final Build Exam…</div>;
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-gradient-to-br from-[#effaff] via-[#fff9e9] to-[#f7efff] text-slate-800">
      <LevelOneBackdrop />
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-7">
        <a href={back} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/90 px-3 text-sm font-bold text-sky-800 focus-visible:outline-4 focus-visible:outline-sky-500"><ArrowLeft className="size-4"/> Level {level}</a>
        <div className="text-right"><p className="text-xs font-black uppercase tracking-wider text-sky-700">BE STEM READY</p><p className="text-sm font-bold text-slate-600">Final Build Exam</p></div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-6xl px-3 pb-[max(20px,env(safe-area-inset-bottom))] sm:px-7">
        <div className="mb-4 text-center">
          <p className="text-xs font-black tracking-[.17em] text-[#2379bd]">🔬 LEVEL {level} · FINAL BUILD CHALLENGE</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#18418a] sm:text-4xl">Robot Discovery Scanner</h1>
          <p className="mt-2 text-sm font-medium text-[#607c9f]">Discover → Build independently → Check your robot</p>
        </div>
        {isScanning ? (
          <section aria-label="Robot discovery scanner" className="grid overflow-hidden rounded-[28px] border-[3px] border-[#47c8fc] bg-white shadow-xl lg:min-h-[520px] lg:grid-cols-2">
            <div className="flex h-[min(54dvh,470px)] min-h-[265px] items-center justify-center overflow-hidden bg-[#0B1B4E] lg:h-auto">
              <FinalBuildScanner scanning={session.stage === "scanning"}
                projectCount={pool.length} onSkip={() => setSession(prev => prev.stage === "scanning" ? { ...prev, stage: "ready" } : prev)}/>
            </div>
            <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-white via-[#f0f9ff] to-[#f1edff] p-5 sm:p-9">
              <h2 className="text-center text-xl font-black text-[#19428f] sm:text-3xl">{session.stage === "scanning" ? "Scanning for your robot!" : "Which robot will you discover?"}</h2>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-800">🤖 {pool.length} registered robots</span>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800">⏱ 15-minute challenge</span>
              </div>
              <button type="button" disabled={session.stage === "scanning" || !pool.length} onClick={discover}
                className="min-h-16 w-full rounded-2xl border-b-4 border-amber-500 bg-[#ffcf52] px-4 text-lg font-black text-[#213f80] shadow-md hover:bg-[#ffe17f] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-60">
                {session.stage === "scanning" ? "🔬 SCANNING ROBOTS…" : "🔎 DISCOVER MY ROBOT!"}
              </button>
              {session.stage === "scanning" && <button type="button" onClick={() => setSession(prev => prev.stage === "scanning" ? { ...prev, stage: "ready" } : prev)}
                className="min-h-11 text-sm font-bold text-sky-700 underline">Skip animation</button>}
              {!pool.length && <p role="alert" className="text-center text-sm text-amber-800">No registered Wix Building PDF references were found for this level.</p>}
              <p role="status" aria-live="polite" className="text-center text-xs text-slate-600">Each project has one equal chance. Manual variants do not increase the odds.</p>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-2xl rounded-[28px] border-[3px] border-amber-200 bg-white/95 p-4 shadow-xl sm:p-7">
            <div className="mb-5 text-center"><Trophy className="mx-auto mb-2 size-10 text-amber-500"/>
              <p className="text-xs font-black uppercase tracking-wide text-violet-600">Level {level} · Robot Challenge</p>
              <h2 className="text-2xl font-black text-[#513073]">{project?.name ?? "Robot not available"}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">{project?.category}</p>
            </div>
            {reviewMode && <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-3">
              <p className="mb-2 text-xs font-bold text-violet-800">Reviewer-only draft · {reviewIndex + 1} / {pool.length} · Not approved for students</p>
              <select aria-label="Review project" value={reviewIndex}
                onChange={e => selectReviewer(Number(e.target.value))}
                className="min-h-11 w-full rounded-lg border border-violet-300 bg-white p-2 text-sm">
                {pool.map((item, index) => <option value={index} key={item.id}>{item.name}</option>)}
              </select>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="text-xs font-semibold">Source page <input type="number" min={1} value={reviewPage}
                  onChange={e => { setModel(null); setReviewPage(Math.max(1, Math.floor(Number(e.target.value) || 1))); }}
                  className="ml-2 w-16 rounded-lg border border-violet-300 p-2" /></label>
              </div>
              <p className="mt-2 text-xs text-violet-800">Use this private review view to inspect a provisional PDF crop. This does not approve an image.</p>
            </div>}
            {project && variant && (session.stage === "ready" || session.stage === "building") && <>
              {project.variants.length > 1 && <label className="mb-4 block text-sm font-bold text-[#65438a]">Official manual version
                <select value={variant.id} disabled={session.stage !== "ready"}
                  onChange={e => setVariant(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-violet-300 bg-white p-2">
                  {project.variants.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </label>}
              <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-3 text-center sm:p-5">
                <p className="mb-2 text-xs font-black uppercase tracking-widest text-sky-700">Your finished-model reference</p>
                {renderCandidate ? <FinalBuildPrototype key={variant.id + ":" + page}
                  filename={variant.id} url={variant.url} pageNumber={page} crop={crop}
                  title={project.name} onStatusChange={onModelStatus}/> :
                  <div className="rounded-xl bg-white p-8 text-sm font-semibold text-amber-900" role="status">
                    Verified robot image unavailable. This project remains locked until its actual completed-model crop and cleaned PDF are approved.
                  </div>}
                {reviewMode && <p className="mt-2 text-xs font-semibold text-amber-800">Draft source page only — may contain instructional text or other content. Never shown to students.</p>}
                {!reviewMode && !startAllowed && <p className="mt-2 text-xs text-amber-900">No unapproved image will be used as an official exam reference.</p>}
              </div>
              <p className="my-4 flex items-center justify-center gap-2 text-4xl font-black tabular-nums text-sky-800"><Timer className="size-7"/>{formatTime(remaining)}</p>
            </>}
            {session.stage === "ready" && <>
              <button type="button" disabled={!startAllowed} onClick={start} className="min-h-14 w-full rounded-2xl bg-rose-500 px-5 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40">
                Start My 15-Minute Build
              </button>
              {testAllowed && <button type="button" onClick={start} className="mt-3 min-h-12 w-full rounded-2xl bg-violet-100 font-bold text-violet-800">Test flow in review mode (not student-approved)</button>}
              <button type="button" onClick={() => retry(false)} className="mt-3 min-h-12 w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 font-bold text-sky-800"><RotateCcw className="mr-2 inline size-4"/> Discover Another Robot</button>
            </>}
            {session.stage === "building" && <button type="button" onClick={finish} className="min-h-14 w-full rounded-2xl bg-emerald-600 font-extrabold text-white">I Finished My Robot!</button>}
            {session.stage === "assessment" && <>
              <p className="mb-2 text-lg font-extrabold">Check your robot</p>
              <p className="mb-3 text-xs text-slate-600">Self-reported checklist; project-specific wording awaits the official manual audit.</p>
              {readyChecks.map((item, index) => <label key={index} className="mb-2 flex min-h-12 items-center gap-3 rounded-xl bg-sky-50 p-3 text-sm font-semibold">
                <input type="checkbox" className="size-6 shrink-0 accent-sky-600" checked={session.checks[index]}
                  onChange={e => setSession(prev => ({ ...prev, checks: prev.checks.map((v,i) => i === index ? e.target.checked : v) }))}/>
                {item}
              </label>)}
              <button type="button" onClick={result} className="mt-4 min-h-12 w-full rounded-2xl bg-sky-600 font-extrabold text-white">See My Result</button>
            </>}
            {session.stage === "result" && <div className="text-center">
              <CheckCircle2 className="mx-auto size-12 text-sky-600"/><h3 className="mt-2 text-2xl font-black">{session.result === "pass" ? "Great Building!" : "Keep Practising!"}</h3>
              <p className="my-3 text-sm text-slate-600">Level {level} · {project?.name} · {session.checks.filter(Boolean).length}/5 checks · {elapsed === null ? "Time unavailable" : formatTime(elapsed)} used</p>
              <p className="mb-4 text-xs text-slate-500">Self-reported practical completion. This is not a verified skills certification.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => retry(true)} className="min-h-12 rounded-xl bg-sky-100 font-bold text-sky-800">Retry Same Robot</button>
                <button type="button" onClick={() => retry(false)} className="min-h-12 rounded-xl bg-sky-600 font-bold text-white">Discover Another Robot</button>
              </div>
            </div>}
            <a href={back} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-violet-700"><ArrowLeft className="size-4"/> Back to Level {level}</a>
          </section>
        )}
        <p className="mt-4 text-center text-xs text-slate-500">{inventory.length - pool.length} syllabus activities have no registered Wix Building PDF and are excluded from the draw. Source availability does not imply finished-model approval.</p>
      </main>
    </div>
  );
}
