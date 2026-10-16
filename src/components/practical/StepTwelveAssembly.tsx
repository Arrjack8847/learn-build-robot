import { useEffect, useState } from "react";
import { RotateCcw, ScanSearch, TriangleAlert } from "lucide-react";
import { AssemblyActionCard, AssemblyLessonHeader,
  AssemblyPlaybackControls, AssemblyStage } from "./AssemblyLessonUI";
import { StepTwelveScene, type StepTwelveView } from "./StepTwelveScene";
import {
  STEP_TWELVE_ACTIONS, STEP_TWELVE_ASSEMBLY_ID, STEP_TWELVE_COMPONENTS,
  STEP_TWELVE_FINAL_PHASE, STEP_TWELVE_RESULT_KEY,
  stepTwelveValidate,
} from "./stepTwelveGeometry";

export function StepTwelveAssembly({ onCompleteStep }: { onCompleteStep: () => void }) {
  const [phase, setPhase] = useState(0);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [cameraKey, setCameraKey] = useState(0);
  const [view, setView] = useState<StepTwelveView>("iso");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [physicallyChecked, setPhysicallyChecked] = useState(false);
  const valid = stepTwelveValidate().length === 0;
  const final = phase === STEP_TWELVE_FINAL_PHASE;
  const action = STEP_TWELVE_ACTIONS[phase]!;
  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!preference) return;
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener?.("change", update);
    return () => preference.removeEventListener?.("change", update);
  }, []);
  function navigate(next: number) {
    if (busy || !valid || next === phase || next < 0 || next > STEP_TWELVE_FINAL_PHASE) return;
    setBusy(true);
    setPaused(false);
    setPhysicallyChecked(false);
    setView("iso");
    setPhase(next);
  }
  function replay() {
    if (busy) return;
    setBusy(true);
    setPaused(false);
    setReplayKey(n => n + 1);
  }
  function restart() {
    setBusy(false);
    setPaused(false);
    setPhysicallyChecked(false);
    setPhase(0);
    setView("iso");
    setReplayKey(n => n + 1);
    setCameraKey(n => n + 1);
  }
  function complete() {
    if (!valid || busy || !final || !physicallyChecked) return;
    try {
      window.localStorage.setItem(STEP_TWELVE_RESULT_KEY, JSON.stringify({
        version: 1, assemblyId: STEP_TWELVE_ASSEMBLY_ID,
        separateLBeams: true, holeLongArmFromCorner: 4,
        first: { connectorInsertion: "top-to-bottom", bushingInsertion: "top-to-bottom" },
        second: { beamFace: "opposite", connectorInsertion: "bottom-to-top",
          bushingInsertion: "bottom-to-top" },
        quantities: STEP_TWELVE_COMPONENTS,
        noVanishingOrShortenedPins: true, secondPhysicalOrientation: "y-axis-half-turn",
        bushingMeshApproximation: true, mechanicallyVerified: false,
        physicallySelfConfirmed: true, completedAt: new Date().toISOString(),
      }));
    } catch { /* storage may be unavailable in private browsing */ }
    onCompleteStep();
  }
  return <div className="relative z-10 w-full space-y-3">
    <AssemblyLessonHeader step={12} title="Prepare two opposite-face L-shaped connectors"
      actionIndex={phase} actionCount={STEP_TWELVE_ACTIONS.length}
      trailing={<span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1.5 text-[10px] font-bold text-amber-900">
        <TriangleAlert className="size-3.5" /> Check physical fit
      </span>} />
    <AssemblyStage
      scene={<StepTwelveScene phase={phase} paused={paused} replayKey={replayKey}
        resetCameraKey={cameraKey} reducedMotion={reducedMotion}
        view={view} onMotionComplete={() => setBusy(false)} />}
      status={<span className="rounded-xl border border-white/90 bg-white/95 px-3 py-2 text-xs font-semibold text-[#132654] shadow-sm">
        TWO L-beams · Hole 4 both · First ↓ top · Second ↑ bottom · Pins retained
      </span>}
      tools={<div className="flex flex-wrap items-center gap-1.5">
        <button type="button" title="Reset Step 12 camera" aria-label="Reset Step 12 camera"
          onClick={() => { setView("iso"); setCameraKey(v => v + 1); }}
          className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white/95 shadow-sm">
          <ScanSearch className="size-4" />
        </button>
        {(["iso", "top", "bottom", "front"] as const).map(option =>
          <button type="button" key={option} aria-pressed={view === option}
            onClick={() => setView(option)}
            className={"min-h-11 rounded-xl border px-3 text-xs font-bold capitalize " +
              (view === option ? "border-[#168eea] bg-[#168eea] text-white" :
                "border-slate-200 bg-white/95 text-slate-700")}>
            {option === "iso" ? "3D" : option}
          </button>)}
        <button type="button" onClick={restart}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-3 text-xs font-bold text-slate-700">
          <RotateCcw className="size-3.5" /> Restart
        </button>
      </div>}
      dock={<div className="space-y-2.5 text-[#132654]">
        <AssemblyActionCard actionIndex={phase} actionCount={STEP_TWELVE_ACTIONS.length}
          title={action.title} instruction={action.instruction}
          note="The photo shows a 5-hole long arm and 3-hole short arm. Hole 4 is counted from the shared corner along the long arm, on each separate L." />
        {final && <label className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0"
            checked={physicallyChecked} onChange={e => setPhysicallyChecked(e.target.checked)} />
          I checked two different L-beams. Both black connectors are in Hole 4:
          the first went from TOP downward and carries its bushing above;
          the mirrored second went from BELOW upward and carries its bushing below.
          Neither connector vanished or sticks out unexpectedly.
        </label>}
        <AssemblyPlaybackControls paused={paused}
          onPrevious={() => navigate(phase - 1)}
          onNext={() => navigate(phase + 1)}
          onReplay={replay}
          onTogglePause={() => setPaused(p => !p)}
          previousDisabled={busy || phase === 0}
          replayDisabled={busy}
          pauseDisabled={false}
          nextDisabled={busy || !valid}
          isFinalAction={final}
          onComplete={complete}
          completeDisabled={busy || !valid || !physicallyChecked} />
      </div>}
    />
    <p className="px-1 text-[11px] leading-4 text-slate-500">
      Large L-beam and black pin use the original GitHub STL files. The hollow tan
      bushing is an illustrative model because no verified matching bushing STL is
      identified yet. This photo-guided Step 12 is not a certified mechanical fit.
    </p>
  </div>;
}
