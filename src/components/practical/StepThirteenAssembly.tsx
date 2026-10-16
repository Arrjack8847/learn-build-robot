import { useEffect, useMemo, useState } from "react";
import { RotateCcw, ScanSearch, TriangleAlert } from "lucide-react";
import { AssemblyActionCard, AssemblyLessonHeader,
  AssemblyPlaybackControls, AssemblyStage } from "./AssemblyLessonUI";
import { StepThirteenScene, type StepThirteenView } from "./StepThirteenScene";
import { STEP5_SNAPSHOT_KEY } from "./StepFiveScene";
import { STEP_SIX_RESULT, type StepSixMountConfig, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import { STEP_SEVEN_RESULT_KEY, STEP_EIGHT_RESULT_KEY, type StepSevenRailConfig } from "./stepSevenRailGeometry";
import { STEP_EIGHT_DEMO_CONFIG, type StepEightConfig } from "./stepEightGeometry";
import { STEP_ELEVEN_RESULT_KEY, STEP_ELEVEN_ASSEMBLY_ID } from "./stepElevenGeometry";
import { STEP_TWELVE_RESULT_KEY, STEP_TWELVE_ASSEMBLY_ID } from "./stepTwelveGeometry";
import {
  STEP_THIRTEEN_ACTIONS, STEP_THIRTEEN_ASSEMBLY_ID, STEP_THIRTEEN_FINAL_PHASE,
  STEP_THIRTEEN_MOUNTS, STEP_THIRTEEN_RECEIVER, STEP_THIRTEEN_RESULT_KEY,
  stepThirteenAnchors, stepThirteenWarnings,
} from "./stepThirteenGeometry";

type Ready = {
  railConfig: StepSevenRailConfig;
  frameConfig: StepEightConfig;
  stepSixConfig: StepSixMountConfig;
  prepared: StepSixStepFiveTransforms;
};
function loadReady(): Ready | null {
  if (typeof window === "undefined") return null;
  try {
    const read = (key: string) => JSON.parse(window.localStorage.getItem(key) ?? "null");
    const eleven = read(STEP_ELEVEN_RESULT_KEY);
    const twelve = read(STEP_TWELVE_RESULT_KEY);
    const seven = read(STEP_SEVEN_RESULT_KEY);
    const eight = read(STEP_EIGHT_RESULT_KEY);
    const six = read(STEP_SIX_RESULT);
    const five = read(STEP5_SNAPSHOT_KEY);
    if (eleven?.assemblyId !== STEP_ELEVEN_ASSEMBLY_ID ||
        twelve?.assemblyId !== STEP_TWELVE_ASSEMBLY_ID ||
        eleven.physicallySelfConfirmed !== true || twelve.physicallySelfConfirmed !== true ||
        seven?.assemblyId !== "marksman-assembly-a-side-rails-v1" ||
        eight?.assemblyId !== "marksman-assembly-b-rectangular-frame-v1" ||
        !seven.mountingChoices || !six?.mountingChoices ||
        !five?.transforms?.["STEP5_BEAM_11"]) return null;
    return {
      railConfig: seven.mountingChoices,
      frameConfig: STEP_EIGHT_DEMO_CONFIG,
      stepSixConfig: six.mountingChoices,
      prepared: five.transforms,
    };
  } catch { return null; }
}

export function StepThirteenAssembly({ onCompleteStep }: { onCompleteStep: () => void }) {
  const [ready] = useState(loadReady);
  const [phase, setPhase] = useState(0);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [cameraKey, setCameraKey] = useState(0);
  const [view, setView] = useState<StepThirteenView>("iso");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [physicallyChecked, setPhysicallyChecked] = useState(false);
  const final = phase === STEP_THIRTEEN_FINAL_PHASE;
  const action = STEP_THIRTEEN_ACTIONS[phase]!;
  const warnings = useMemo(() => {
    if (!ready) return [];
    const beamY = ready.prepared["STEP5_BEAM_11"]?.position[1] ?? 4.1;
    return stepThirteenWarnings(stepThirteenAnchors(ready.stepSixConfig, ready.prepared, beamY));
  }, [ready]);

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!preference) return;
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener?.("change", update);
    return () => preference.removeEventListener?.("change", update);
  }, []);
  function navigate(next: number) {
    if (!ready || busy || next === phase || next < 0 || next > STEP_THIRTEEN_FINAL_PHASE) return;
    setBusy(true);
    setPaused(false);
    setPhysicallyChecked(false);
    setPhase(next);
  }
  function replay() {
    if (!ready || busy) return;
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
    if (!ready || busy || !final || !physicallyChecked) return;
    try {
      window.localStorage.setItem(STEP_THIRTEEN_RESULT_KEY, JSON.stringify({
        version: 1, assemblyId: STEP_THIRTEEN_ASSEMBLY_ID,
        fromStep11: STEP_ELEVEN_ASSEMBLY_ID, fromStep12: STEP_TWELVE_ASSEMBLY_ID,
        mountingPinPairs: STEP_THIRTEEN_MOUNTS,
        receivingHolesOnEachL: [STEP_THIRTEEN_RECEIVER.first, STEP_THIRTEEN_RECEIVER.third],
        unoccupiedShortArmHole: STEP_THIRTEEN_RECEIVER.empty,
        preparedBlackPinLongArmHole: STEP_THIRTEEN_RECEIVER.preparedBlackPin,
        unitsAttached: 2, totalOriginalBluePinsEngaged: 4,
        eachCompleteWithBlackPinAndBushing: true,
        originalStep11MeshesPreserved: true, bluePinsNeverFadedOrRemoved: true,
        noIndependentLPartMovement: true, seatingDepthPhotoApproximation: true,
        geometryWarnings: warnings,
        mechanicallyVerified: false, physicallySelfConfirmed: true,
        completedAt: new Date().toISOString(),
      }));
    } catch { /* storage unavailable */ }
    onCompleteStep();
  }

  return <div className="relative z-10 w-full space-y-3">
    <AssemblyLessonHeader step={13} title="Attach two prepared L-shaped brackets"
      actionIndex={phase} actionCount={STEP_THIRTEEN_ACTIONS.length}
      trailing={<span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1.5 text-[10px] font-bold text-amber-950">
        <TriangleAlert className="size-3.5" /> Photo-guided · verify receiving holes
      </span>} />
    <AssemblyStage
      scene={ready ? <StepThirteenScene phase={phase} paused={paused}
        replayKey={replayKey} resetCameraKey={cameraKey} reducedMotion={reducedMotion}
        view={view} railConfig={ready.railConfig} frameConfig={ready.frameConfig}
        stepSixConfig={ready.stepSixConfig} prepared={ready.prepared}
        onMotionComplete={() => setBusy(false)} /> :
        <div role="alert" className="grid h-full place-items-center p-5 text-center text-sm text-amber-900">
          Complete and physically confirm Steps 11 and 12 in this browser first.
          Step 13 reuses their completed assemblies rather than recreating their parts.
        </div>}
      status={<span className="rounded-xl border border-white/90 bg-white/95 px-3 py-2 text-xs font-bold text-[#132654] shadow-sm">
        {phase <= 1 ? "Two gray bridges · four blue pins · two prepared L-brackets"
          : phase <= 3 ? "First bridge: TWO pins → L holes 1 and 3"
            : phase <= 5 ? "Second bridge: TWO pins → mirrored L holes 1 and 3"
              : "Both L-brackets attached · four original pins retained"}
      </span>}
      tools={<div className="flex flex-wrap items-center gap-1.5">
        <button type="button" title="Reset Step 13 camera" aria-label="Reset Step 13 camera"
          onClick={() => { setView("iso"); setCameraKey(n => n + 1); }}
          className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white/95 shadow-sm">
          <ScanSearch className="size-4" />
        </button>
        {(["iso", "top", "front", "side", "bottom"] as const).map(option =>
          <button type="button" key={option} disabled={!ready}
            aria-pressed={view === option} onClick={() => setView(option)}
            className={"min-h-11 rounded-xl border px-2.5 text-xs font-bold capitalize " +
              (view === option ? "border-[#168eea] bg-[#168eea] text-white" :
                "border-slate-200 bg-white/95 text-slate-700")}>
            {option === "iso" ? "3D" : option}
          </button>)}
        <button type="button" onClick={restart} disabled={!ready}
          className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-slate-200 bg-white/95 px-2.5 text-xs font-bold">
          <RotateCcw className="size-3.5" /> Restart
        </button>
      </div>}
      dock={<div className="space-y-2.5 text-[#132654]">
        <AssemblyActionCard actionIndex={phase} actionCount={STEP_THIRTEEN_ACTIONS.length}
          title={action.title} instruction={action.instruction}
          note="Each gray bridge already carries two blue pins (Step 5): short-arm L holes 1 and 3 receive them simultaneously; hole 2 stays free. Long-arm hole 4 retains the black pin and bushing." />
        {final && <label className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5">
          <input type="checkbox" className="mt-1 size-4 shrink-0"
            checked={physicallyChecked} onChange={e => setPhysicallyChecked(e.target.checked)} />
          I verified that EACH of the two prepared Step 12 L-brackets receives
          BOTH blue pins from its own gray bridge through short-arm holes 1 and 3.
          Both short-arm hole 2 positions stay empty, and the long-arm hole 4
          black pins and bushings remain installed, with no unwanted protrusion.
        </label>}
        <AssemblyPlaybackControls paused={paused}
          onPrevious={() => navigate(phase - 1)}
          onNext={() => navigate(phase + 1)}
          onReplay={replay} onTogglePause={() => setPaused(p => !p)}
          previousDisabled={!ready || busy || phase === 0}
          nextDisabled={!ready || busy}
          replayDisabled={!ready || busy} pauseDisabled={!ready}
          isFinalAction={final} onComplete={complete}
          completeDisabled={!ready || busy || !physicallyChecked} />
      </div>}
    />
    <p className="px-1 text-[11px] leading-4 text-slate-500">
      Steps 11 and 12 are retained without altered pin geometry. Step 13 uses
      the original L beam and pin STLs plus Step 12's hollow bushing approximation.
      Two pre-existing blue pins on each of the two original gray bridges
      connect through L short-arm holes 1 and 3. Physical seating depth
      remains provisional until checked against the kit.
      {warnings.length > 0 ? " " + warnings.join(" ") : ""}
    </p>
  </div>;
}
