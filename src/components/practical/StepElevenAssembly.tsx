import { useEffect, useState } from "react";
import { ScanSearch, TriangleAlert } from "lucide-react";
import { AssemblyActionCard, AssemblyLessonHeader, AssemblyPlaybackControls, AssemblyStage } from "./AssemblyLessonUI";
import { StepElevenScene } from "./StepElevenScene";
import { STEP5_SNAPSHOT_KEY } from "./StepFiveScene";
import { STEP_SIX_RESULT, type StepSixMountConfig, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import { STEP_SEVEN_RESULT_KEY, STEP_EIGHT_RESULT_KEY, type StepSevenRailConfig } from "./stepSevenRailGeometry";
import { STEP_EIGHT_DEMO_CONFIG, type StepEightConfig } from "./stepEightGeometry";
import { STEP_NINE_ASSEMBLY_ID } from "./stepNineGeometry";
import { STEP_TEN_RESULT_KEY, STEP_TEN_ASSEMBLY_ID } from "./stepTenGeometry";
import { STEP_ELEVEN_ACTIONS, STEP_ELEVEN_ASSEMBLY_ID, STEP_ELEVEN_FINAL_PHASE,
  STEP_ELEVEN_RESULT_KEY, STEP_ELEVEN_STEP_NINE_MESH_HOLES, stepElevenPlacement } from "./stepElevenGeometry";

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
    const seven = read(STEP_SEVEN_RESULT_KEY);
    const eight = read(STEP_EIGHT_RESULT_KEY);
    const nine = read("robot:marksmanship:step9:joined:v1");
    const ten = read(STEP_TEN_RESULT_KEY);
    const six = read(STEP_SIX_RESULT);
    const five = read(STEP5_SNAPSHOT_KEY);
    if (nine?.assemblyId !== STEP_NINE_ASSEMBLY_ID ||
        ten?.assemblyId !== STEP_TEN_ASSEMBLY_ID ||
        nine.physicallySelfConfirmed !== true ||
        ten.physicallySelfConfirmed !== true ||
        seven?.assemblyId !== "marksman-assembly-a-side-rails-v1" ||
        eight?.assemblyId !== "marksman-assembly-b-rectangular-frame-v1" ||
        !seven.mountingChoices || !six?.mountingChoices ||
        !five?.transforms?.STEP5_BEAM_11) return null;
    return { railConfig: seven.mountingChoices,
      // Preserve the finished Step 9 frame's corrected approved hole layout.
      frameConfig: STEP_EIGHT_DEMO_CONFIG,
      stepSixConfig: six.mountingChoices, prepared: five.transforms };
  } catch { return null; }
}
type View = "iso" | "top" | "front" | "side" | "bottom";
export function StepElevenAssembly({ onCompleteStep }: { onCompleteStep: () => void }) {
  const [ready] = useState(loadReady);
  const [phase, setPhase] = useState(0);
  const [busy, setBusy] = useState(Boolean(ready));
  const [paused, setPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [cameraKey, setCameraKey] = useState(0);
  const [view, setView] = useState<View>("iso");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [physicallyChecked, setPhysicallyChecked] = useState(false);
  const final = phase === STEP_ELEVEN_FINAL_PHASE;
  const action = STEP_ELEVEN_ACTIONS[phase]!;
  const beamY = ready?.prepared.STEP5_BEAM_11?.position[1] ?? 4.1;
  const placement = ready
    ? stepElevenPlacement(ready.railConfig, ready.stepSixConfig, beamY) : null;
  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!preference) return;
    const update = () => setReducedMotion(preference.matches);
    update(); preference.addEventListener?.("change", update);
    return () => preference.removeEventListener?.("change", update);
  }, []);
  function navigate(next: number) {
    if (!ready || busy || next < 0 || next > STEP_ELEVEN_FINAL_PHASE || next === phase) return;
    setBusy(true);
    setPaused(false);
    setView("iso");
    setPhysicallyChecked(false);
    setPhase(next);
  }
  function replay() {
    if (!ready || busy) return;
    setBusy(true);
    setPaused(false);
    setReplayKey(n => n + 1);
  }
  function complete() {
    if (!ready || !final || busy || !physicallyChecked) return;
    try {
      window.localStorage.setItem(STEP_ELEVEN_RESULT_KEY, JSON.stringify({
        assemblyId: STEP_ELEVEN_ASSEMBLY_ID, version: 1,
        fromStep9: STEP_NINE_ASSEMBLY_ID, fromStep10: STEP_TEN_ASSEMBLY_ID,
        sourcePinHoles: { blue: 1, black: 3 },
        receivingHolesFromBottom: [3, 1],
        stepNineMeshHoles: STEP_ELEVEN_STEP_NINE_MESH_HOLES,
        emptyMiddleHole: true, twoBlueAndTwoBlackConnectors: true,
        exactStepNineAndTenMeshesPreserved: true,
        noPinsFadedOrRemoved: true,
        geometryWarnings: placement?.warnings ?? [],
        mechanicallyVerified: false, physicallySelfConfirmed: true,
        completedAt: new Date().toISOString(),
      }));
    } catch { /* storage not always available */ }
    onCompleteStep();
  }
  return <div className="w-full space-y-3">
    <AssemblyLessonHeader step={11} title="Join completed Step 9 and Step 10 assemblies"
      actionIndex={phase} actionCount={STEP_ELEVEN_ACTIONS.length}
      trailing={<span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-900">
        <TriangleAlert className="size-3" /> Photo-guided · fit unverified
      </span>} />
    <AssemblyStage
      scene={ready
        ? <StepElevenScene phase={phase} railConfig={ready.railConfig}
          frameConfig={ready.frameConfig} stepSixConfig={ready.stepSixConfig}
          prepared={ready.prepared} paused={paused} replayKey={replayKey}
          resetCameraKey={cameraKey} reducedMotion={reducedMotion}
          view={view} onMotionComplete={() => setBusy(false)} />
        : <div role="alert" className="grid h-full place-items-center p-6 text-center text-sm text-amber-900">
            Finish and physically confirm Steps 9 and 10 in this browser first.
            Step 11 loads their real saved assemblies instead of inventing new parts.
          </div>}
      status={<span className="rounded-xl border border-sky-200 bg-sky-50/95 px-3 py-2 text-xs font-semibold text-sky-950">
        {phase <= 1 ? "Two completed assemblies · Step 9 left / Step 10 right"
          : phase === 2 ? "Align both blue Hole 1 and black Hole 3 pins"
            : "Four real connectors · top/bottom receivers, middle open"}
      </span>}
      tools={<div className="flex flex-wrap items-center gap-1.5">
        <button type="button" title="Reset Step 11 camera" aria-label="Reset Step 11 camera"
          onClick={() => { setView("iso"); setCameraKey(n => n + 1); }}
          className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white/95 shadow-sm">
          <ScanSearch className="size-4" />
        </button>
        {(["iso", "top", "front", "side", "bottom"] as const).map(choice =>
          <button type="button" key={choice} disabled={!ready}
            aria-pressed={view === choice} onClick={() => setView(choice)}
            className={"min-h-10 rounded-xl border px-2.5 text-xs font-bold capitalize " +
              (view === choice ? "border-[#168eea] bg-[#168eea] text-white" :
                "border-slate-200 bg-white/95 text-slate-700")}>
            {choice === "iso" ? "3D" : choice}
          </button>)}
      </div>}
      dock={<div className="space-y-3 text-[#132654]">
        <AssemblyActionCard actionIndex={phase} actionCount={STEP_ELEVEN_ACTIONS.length}
          title={action.title} instruction={action.instruction}
          note="In Step 9's original 15-hole mesh numbering, the bottom three are holes 13, 14, and 15; only 13 (blue) and 15 (black) receive connectors." />
        {placement?.warnings.length ? <div role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-950">
          <strong>Check physical fit:</strong>
          {placement.warnings.map(warning => <p key={warning} className="mt-1">{warning}</p>)}
        </div> : null}
        {final && <label className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5">
          <input className="mt-1 size-4 shrink-0" type="checkbox"
            checked={physicallyChecked} onChange={e => setPhysicallyChecked(e.target.checked)} />
          I checked the real Step 11 connection: each outer Step 9 white rail receives
          Step 10's original blue Hole 1 pin and black Hole 3 pin in the first and
          third holes of the bottom three-hole group, leaving the middle hole empty.
          None of the four pins was removed, faded, shortened or replaced, and no
          unwanted connector ends protrude. The 3D seating depth is a photo-based
          approximation rather than a certified physical tolerance.
        </label>}
        <AssemblyPlaybackControls paused={paused}
          onPrevious={() => navigate(phase - 1)}
          onNext={() => navigate(phase + 1)}
          onReplay={replay}
          onTogglePause={() => setPaused(p => !p)}
          previousDisabled={!ready || busy || phase === 0}
          replayDisabled={!ready || busy} pauseDisabled={!ready}
          nextDisabled={!ready || busy}
          isFinalAction={final}
          onComplete={complete}
          completeDisabled={!ready || busy || !physicallyChecked} />
      </div>}
    />
  </div>;
}
