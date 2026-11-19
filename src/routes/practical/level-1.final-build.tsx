import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, RotateCcw, Timer, Trophy } from "lucide-react";
import { LEVEL_ONE_CATEGORIES } from "@/data/levelOneCategories";
import { getLevelOneProjects } from "@/data/levelOneProjects";
import { pdfActivityManuals } from "@/data/pdfActivityManuals";
import { levelOneToThreeWixPdfUrls } from "@/data/levelOneToThreeWixPdfUrls";
import { LevelOneBackdrop, LevelOneHeader } from "@/components/practical/LevelOneHeader";
import { FinalBuildWheel } from "@/components/practical/FinalBuildWheel";
import { FinalBuildPrototype, type PrototypeStatus } from "@/components/practical/FinalBuildPrototype";
import prototypeCrops from "@/data/levelOnePrototypeCrops.json";

export const Route = createFileRoute("/practical/level-1/final-build")({ component: FinalBuildPage });

const PROJECTS = LEVEL_ONE_CATEGORIES.flatMap(category =>
  getLevelOneProjects(category.id).map(project => ({ ...project, category: category.name }))
);
const PROTOTYPE_BY_FILENAME = new Map(
  prototypeCrops.references.map(candidate => [candidate.filename, candidate])
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
type Session = { stage: Stage; projectIndex: number | null; spinFinishAt: number | null; spinRotation: number | null; variantIndex: number; deadline: number | null; completedAt: number | null; checks: boolean[]; completed: boolean; attempts: number; result: "pass" | "retry" | null };
const initial: Session = { stage: "spin", projectIndex: null, spinFinishAt: null, spinRotation: null, variantIndex: 0, deadline: null, completedAt: null, checks: [false,false,false,false,false], completed: false, attempts: 0, result: null };
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
  const [modelStatus, setModelStatus] = useState<{ filename: string; status: PrototypeStatus } | null>(null);
  const reviewMode = typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("review") === "1";
  const onModelStatus = useCallback((filename: string, status: PrototypeStatus) => {
    setModelStatus(old => old?.filename === filename && old.status === status ? old : { filename, status });
  }, []);
  useEffect(() => {
    // Reviewer-only deep link: ?review=1&project=Clock. No reroll is changed
    // for normal students. Allows inspection of all 59 candidate slides.
    const query = new URLSearchParams(window.location.search);
    const requestedName = query.get("review") === "1" ? query.get("project") : null;
    const reviewIndex = requestedName
      ? PROJECTS.findIndex(item => item.name.toLowerCase() === requestedName.toLowerCase())
      : (query.get("review") === "1" ? 0 : -1);
    setSession(reviewIndex >= 0
      ? { ...initial, checks: [...initial.checks], stage: "ready", projectIndex: reviewIndex }
      : load());
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (storageReady && !reviewMode) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session, storageReady, reviewMode]);
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
  const manualProjectId = project?.availableProjectId ?? project?.availableProjectVariants?.[session.variantIndex]?.projectId ?? project?.availableProjectVariants?.[0]?.projectId;
  const manualUrl = manualProjectId ? pdfActivityManuals[manualProjectId]?.url : undefined;
  const manualFilename = project?.name === "Acceleration car"
    ? "Acceleration car_Building.pdf"
    : sourcePdfFilename(manualUrl);
  const candidate = manualFilename ? PROTOTYPE_BY_FILENAME.get(manualFilename) : undefined;
  const modelReady = Boolean(manualFilename && modelStatus?.filename === manualFilename && modelStatus.status === "ready");
  // No unapproved candidate may unlock the student challenge.
  const canStart = Boolean(candidate?.approved && modelReady);
  const canTest = Boolean(reviewMode && candidate && !candidate.approved && modelReady);
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
      stage: "spinning", projectIndex: index, variantIndex: 0,
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
    setSession({ ...initial, attempts: session.attempts + 1, stage: same && project ? "ready" : "spin", projectIndex: same ? session.projectIndex : null, variantIndex: same ? session.variantIndex : 0 });
  }
  const spinScreen = session.stage === "spin" || session.stage === "spinning";
  const resetLocalTest = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession({ ...initial, checks: [...initial.checks] });
  };
  const selectReviewProject = (index: number) => {
    if (!reviewMode) return;
    setModelStatus(null);
    setSession({ ...initial, checks: [...initial.checks], stage: "ready", projectIndex: index, variantIndex: 0 });
  };
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-br from-[#fffae9] via-[#fff3fb] to-[#eaf7ff] text-slate-800">
      <LevelOneBackdrop />
      <LevelOneHeader backTo="/practical/level-1" backLabel="Level 1 categories" />
      <main className="relative mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:py-3">
        {spinScreen ? (
          <div className="relative flex min-h-0 flex-1 flex-col">
            <header className="mb-2 shrink-0 text-center sm:mb-3">
              <p className="text-[10px] font-black tracking-[.16em] text-[#c84f79] sm:text-xs">🎪 LEVEL 1 · FINAL BUILD CHALLENGE</p>
              <h1 className="text-[clamp(1.45rem,3.5vw,2.5rem)] font-black leading-tight tracking-tight text-[#513073]">
                Spin Your Robot!
              </h1>
            </header>
            <section aria-label="Spin the wheel to choose a robot" className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-[26px] border-[3px] border-[#f8c95f] bg-white shadow-[0_12px_45px_rgba(143,80,144,.15)] sm:rounded-[34px] lg:grid-cols-[1.08fr_.92fr] lg:grid-rows-1 lg:border-[5px]">
              <div className="relative flex min-h-0 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#ffffff_10%,#fff7dd_70%,#ffecb8_100%)] px-2 py-1 sm:px-4 lg:py-5">
                <div aria-hidden="true" className="pointer-events-none absolute left-[9%] top-[9%] text-2xl text-[#e589eb] lg:text-4xl">✦</div>
                <div aria-hidden="true" className="pointer-events-none absolute bottom-[8%] right-[10%] text-2xl text-[#ff9d37] lg:text-4xl">★</div>
                <FinalBuildWheel
                  spinning={session.stage === "spinning"}
                  targetRotation={session.spinRotation}
                  finishAt={session.spinFinishAt}
                  onFinish={finishSpin}
                />
              </div>
              <div className="flex shrink-0 flex-col justify-center gap-2 bg-white px-3 pb-3 pt-2 sm:px-6 lg:min-h-0 lg:gap-5 lg:border-l-4 lg:border-[#ffe6a1] lg:px-8 lg:py-6 xl:px-12">
                <p className="hidden w-fit rounded-full bg-[#fff0b0] px-4 py-2 text-xs font-black tracking-wide text-[#a15322] lg:block">🎉 THE BIG ROBOT DRAW!</p>
                <h2 className="text-center text-lg font-black leading-tight text-[#513073] sm:text-xl lg:text-left lg:text-[clamp(1.7rem,2.6vw,2.7rem)]">
                  Which robot will you get?
                </h2>
                <p className="hidden max-w-md text-base font-medium leading-relaxed text-[#66547a] lg:block">
                  Give the wheel a spin! A surprise robot from your Level 1 STEM worlds is waiting for you.
                </p>
                <div className="flex items-center justify-center gap-2 lg:justify-start lg:gap-3">
                  <span className="rounded-full bg-[#efe6ff] px-3 py-1.5 text-[11px] font-black text-[#7045bd] sm:text-sm">🤖 59 robots</span>
                  <span className="rounded-full bg-[#d7f9e6] px-3 py-1.5 text-[11px] font-black text-[#267d56] sm:text-sm">⏱️ 15-minute build</span>
                </div>
                <button type="button" onClick={spin} disabled={session.stage === "spinning"}
                  className="group min-h-14 w-full shrink-0 rounded-[20px] border-2 border-[#d93973] border-b-[6px] bg-[#ff5590] px-5 py-2 text-lg font-black tracking-wide text-white shadow-[0_7px_0_#f6b7ce] transition hover:bg-[#f53f7f] active:translate-y-1 active:border-b-2 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#7045bd] disabled:cursor-wait disabled:opacity-85 disabled:active:translate-y-0 sm:min-h-16 sm:text-xl lg:min-h-20 lg:text-2xl">
                  {session.stage === "spinning" ? "🎡 SPINNING..." : "🎯 SPIN THE WHEEL!"}
                </button>
                <p className="text-center text-[10px] font-bold leading-tight text-[#826f8f] sm:text-xs lg:text-left" role="status" aria-live="polite">
                  {session.stage === "spinning"
                    ? "Watch the pointer! Your surprise robot is coming..."
                    : "Every robot has the same chance. Spin → Build → Check!"}
                </p>
                <div className="hidden grid-cols-3 gap-3 lg:grid" aria-hidden="true">
                  <div className="rounded-xl bg-[#fff1a9] p-3 text-center text-sm font-black text-[#965f17]">1 · SPIN</div>
                  <div className="rounded-xl bg-[#d3edff] p-3 text-center text-sm font-black text-[#326caa]">2 · BUILD</div>
                  <div className="rounded-xl bg-[#e9dfff] p-3 text-center text-sm font-black text-[#7050ad]">3 · CHECK</div>
                </div>
              </div>
            </section>
            {import.meta.env.DEV && (
              <button type="button" onClick={resetLocalTest} className="absolute right-0 top-0 z-10 rounded-lg border border-slate-200 bg-white/95 px-2 py-1 text-[10px] font-bold text-slate-500">
                Reset test
              </button>
            )}
          </div>
        ) : (
          <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col overflow-y-auto rounded-[26px] border-[3px] border-[#ffdfa2] bg-white/95 p-3 shadow-[0_12px_45px_rgba(143,80,144,.12)] sm:p-6">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-2 grid size-12 place-items-center rounded-2xl bg-[#fff0ad] text-[#c2691a]"><Trophy className="size-7" /></div>
              <p className="text-xs font-black tracking-wider text-[#a44fba]">🎉 YOUR ROBOT CHALLENGE!</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-[#513073]">Time to Build!</h1>
            </div>
            {reviewMode && project && (
              <div className="mb-4 rounded-2xl border-2 border-[#d9c8fa] bg-[#f7f1ff] p-3">
                <p className="mb-2 text-center text-xs font-black text-[#6946a5]">
                  🔎 Candidate Review · {Number(session.projectIndex) + 1} / {PROJECTS.length} projects · Not approved
                </p>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Previous project" onClick={() => selectReviewProject((Number(session.projectIndex) - 1 + PROJECTS.length) % PROJECTS.length)}
                    className="min-h-11 rounded-xl bg-white px-3 font-bold text-[#6946a5]">←</button>
                  <select aria-label="Choose project for prototype reference review"
                    value={Number(session.projectIndex)}
                    onChange={event => selectReviewProject(Number(event.target.value))}
                    className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#cbb3f3] bg-white px-2 text-sm font-bold text-[#4f357e]">
                    {PROJECTS.map((item, index) => (
                      <option key={item.id} value={index}>{item.name}</option>
                    ))}
                  </select>
                  <button type="button" aria-label="Next project" onClick={() => selectReviewProject((Number(session.projectIndex) + 1) % PROJECTS.length)}
                    className="min-h-11 rounded-xl bg-white px-3 font-bold text-[#6946a5]">→</button>
                </div>
              </div>
            )}
            <section className="flex-1" aria-live="polite">
          {project && session.stage !== "spin" && session.stage !== "spinning" && (
            <div>
              <div className="mb-4 rounded-[24px] border-2 border-[#ffd37c] bg-[#fff4d8] p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-600">{project.category}</p>
                <h2 className="mt-1 text-2xl font-black text-[#513073]">{project.name}</h2>
              </div>
              {project.availableProjectVariants && project.availableProjectVariants.length > 1 && (session.stage === "ready" || session.stage === "building") && (
                <div className="mb-3 flex items-center justify-center gap-2">
                  <label htmlFor="crawl-variant" className="text-xs font-bold text-[#65438a]">Official variant</label>
                  <select id="crawl-variant" value={session.variantIndex}
                    disabled={session.stage !== "ready"}
                    onChange={event => { setModelStatus(null); update({ variantIndex: Number(event.target.value) }); }}
                    className="min-h-11 rounded-xl border border-[#d4b7f2] bg-white px-3 text-sm font-bold text-[#65438a]">
                    {project.availableProjectVariants.map((option,index) => (
                      <option value={index} key={option.projectId}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {(session.stage === "ready" || session.stage === "building") && (
                <>
                  <div className="mb-4 rounded-2xl border border-sky-200 bg-slate-50 p-3 text-center">
                    {candidate && manualFilename && manualUrl ? (
                      <div>
                        <FinalBuildPrototype
                          filename={manualFilename}
                          url={manualUrl}
                          pageNumber={candidate.page}
                          crop={candidate.crop}
                          title={project.name}
                          onStatusChange={onModelStatus}
                        />
                        <p className="mt-2 text-xs font-semibold text-slate-600">
                          Original Building PDF · Page {candidate.page} · Model region only
                        </p>
                        {!candidate.approved && (
                          <p className="mt-1 text-xs font-bold text-amber-800" role="note">
                            Preview candidate — image crop awaits approval{candidate.confidence === "low" ? " (model identification uncertain)" : ""}.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="py-5">
                        <p className="font-bold text-[#745397]">Robot reference not identified</p>
                        <p className="mt-2 text-xs text-slate-500">
                          This project cannot start until its original prototype has been verified.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mb-4 flex items-center justify-center gap-2 text-3xl font-black tabular-nums text-sky-700"><Timer />{time}</div>
                </>
              )}
              {session.stage === "ready" && (
                <button type="button" disabled={!canStart} onClick={() => update({ stage: "building", deadline: Date.now() + LIMIT_MS, completedAt: null })} className="min-h-14 w-full rounded-2xl border-b-4 border-[#c34d83] bg-[#f85a96] font-extrabold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50">Start My 15-Minute Build</button>
              )}
              {session.stage === "ready" && canTest && (
                <button type="button" onClick={() => update({ stage: "building", deadline: Date.now() + LIMIT_MS, completedAt: null })}
                  className="mt-3 min-h-12 w-full rounded-2xl border-2 border-[#b6a0ed] bg-[#efe6ff] px-4 font-extrabold text-[#6740a2] hover:bg-[#e2d2ff]">
                  Test 15-Minute Timer (review only)
                </button>
              )}
              {session.stage === "ready" && !canStart && (
                <button type="button" onClick={() => retry(false)}
                  className="mt-3 min-h-12 w-full rounded-2xl border-2 border-[#f0c878] bg-[#fff5d8] px-4 font-extrabold text-[#8857aa] hover:bg-[#ffeab0]">
                  <RotateCcw className="mr-2 inline size-4" />Spin Again
                </button>
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
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#ffebc9] pt-3">
              <Link to="/practical/level-1" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7449ae] sm:text-sm"><ArrowLeft className="size-4" />Back to Categories</Link>
              {import.meta.env.DEV && (
                <button type="button" onClick={resetLocalTest} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500">
                  Reset local test
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
