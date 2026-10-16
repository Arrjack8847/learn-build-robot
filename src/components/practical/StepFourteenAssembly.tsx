import { useEffect, useMemo, useState } from "react";
import { RotateCcw, ScanSearch, TriangleAlert } from "lucide-react";
import {
  AssemblyActionCard, AssemblyLessonHeader, AssemblyPlaybackControls, AssemblyStage,
} from "./AssemblyLessonUI";
import { StepFourteenScene } from "./StepFourteenScene";
import { STEP5_SNAPSHOT_KEY } from "./StepFiveScene";
import { STEP_SIX_RESULT, type StepSixMountConfig, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import {
  STEP_SEVEN_RESULT_KEY, STEP_EIGHT_RESULT_KEY, type StepSevenRailConfig,
} from "./stepSevenRailGeometry";
import { STEP_EIGHT_DEMO_CONFIG, type StepEightConfig } from "./stepEightGeometry";
import { STEP_ELEVEN_RESULT_KEY, STEP_ELEVEN_ASSEMBLY_ID } from "./stepElevenGeometry";
import { STEP_TWELVE_RESULT_KEY, STEP_TWELVE_ASSEMBLY_ID } from "./stepTwelveGeometry";
import {
  STEP_THIRTEEN_RESULT_KEY, STEP_THIRTEEN_ASSEMBLY_ID,
} from "./stepThirteenGeometry";
import {
  STEP_FOURTEEN_ACTIONS, STEP_FOURTEEN_ASSEMBLY_ID,
  STEP_FOURTEEN_FINAL_PHASE, STEP_FOURTEEN_GREY_HOLES,
  STEP_FOURTEEN_MOUNT_PIN_IDS, STEP_FOURTEEN_RESULT_KEY,
  stepFourteenPinWarnings,
} from "./stepFourteenGeometry";
import type { StepThirteenView } from "./StepThirteenScene";

type Ready = {
  railConfig: StepSevenRailConfig;
  frameConfig: StepEightConfig;
  stepSixConfig: StepSixMountConfig;
  prepared: StepSixStepFiveTransforms;
};

/** Step 14 never reconstructs or reorders Step 13 parts: it must be able
 * to reuse the actual saved Step 5, 6, 7, 8, 11 and 13 configurations.
 */
function loadReady(): Ready | null {
  if (typeof window === "undefined") return null;
  try {
    const read = (key: string) => JSON.parse(window.localStorage.getItem(key) ?? "null");
    const eleven = read(STEP_ELEVEN_RESULT_KEY);
    const twelve = read(STEP_TWELVE_RESULT_KEY);
    const thirteen = read(STEP_THIRTEEN_RESULT_KEY);
    const seven = read(STEP_SEVEN_RESULT_KEY);
    const eight = read(STEP_EIGHT_RESULT_KEY);
    const six = read(STEP_SIX_RESULT);
    const five = read(STEP5_SNAPSHOT_KEY);
    if (thirteen?.assemblyId !== STEP_THIRTEEN_ASSEMBLY_ID ||
        thirteen.physicallySelfConfirmed !== true ||
        eleven?.assemblyId !== STEP_ELEVEN_ASSEMBLY_ID ||
        eleven.physicallySelfConfirmed !== true ||
        twelve?.assemblyId !== STEP_TWELVE_ASSEMBLY_ID ||
        seven?.assemblyId !== "marksman-assembly-a-side-rails-v1" ||
        eight?.assemblyId !== "marksman-assembly-b-rectangular-frame-v1" ||
        !seven?.mountingChoices || !six?.mountingChoices ||
        !five?.transforms?.["STEP5_BEAM_11"]) return null;
    return {
      railConfig: seven.mountingChoices,
      frameConfig: STEP_EIGHT_DEMO_CONFIG,
      stepSixConfig: six.mountingChoices,
      prepared: five.transforms,
    };
  } catch { return null; }
}

export function StepFourteenAssembly({ onCompleteStep }: { onCompleteStep: () => void }) {
  const [ready] = useState(loadReady);
  const [phase, setPhase] = useState(0);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [cameraKey, setCameraKey] = useState(0);
  const [view, setView] = useState<StepThirteenView>("iso");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [physicallyChecked, setPhysicallyChecked] = useState(false);
  const warnings = useMemo(stepFourteenPinWarnings, []);
  const final = phase === STEP_FOURTEEN_FINAL_PHASE;
  const action = STEP_FOURTEEN_ACTIONS[phase]!;

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!preference) return;
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener?.("change", update);
    return () => preference.removeEventListener?.("change", update);
  }, []);

  function navigate(next: number) {
    if (!ready || busy || next === phase || next < 0 ||
        next > STEP_FOURTEEN_FINAL_PHASE) return;
    setBusy(true);
    setPaused(false);
    setPhysicallyChecked(false);
    setPhase(next);
  }
  function replay() {
    if (!ready || busy) return;
    setBusy(true);
    setPaused(false);
    setReplayKey(k => k + 1);
  }
  function restart() {
    setBusy(false);
    setPaused(false);
    setPhysicallyChecked(false);
    setPhase(0);
    setView("iso");
    setReplayKey(k => k + 1);
    setCameraKey(k => k + 1);
  }
  function complete() {
    if (!ready || !final || busy || !physicallyChecked) return;
    try {
      window.localStorage.setItem(STEP_FOURTEEN_RESULT_KEY, JSON.stringify({
        version: 1, assemblyId: STEP_FOURTEEN_ASSEMBLY_ID,
        fromStep13: STEP_THIRTEEN_ASSEMBLY_ID, fromStep2: "marksmanship-s2",
        originalStep10BluePinIds: STEP_FOURTEEN_MOUNT_PIN_IDS,
        grayBeamReceivingHoles: STEP_FOURTEEN_GREY_HOLES,
        motorReceiverCount: 4, motorAssemblyKeptRigid: true,
        axleAndDiscFaceBlackThreeHoleCrossbeam: true,
        existingBluePinsUnchanged: true, earlierStepMeshesRetained: true,
        physicalFitConfirmedByLearner: true, mechanicallyVerified: false,
        mountingHoleCentersModelDerived: false,
        geometryWarnings: warnings,
        completedAt: new Date().toISOString(),
      }));
    } catch { /* Lesson completion still works if storage is restricted. */ }
    onCompleteStep();
  }

  return <div className="relative z-10 w-full space-y-3">
    <AssemblyLessonHeader step={14} title="Mount the Step 2 motor on the Step 13 chassis"
      actionIndex={phase} actionCount={STEP_FOURTEEN_ACTIONS.length}
      trailing={<span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1.5 text-[10px] font-bold text-amber-950">
        <TriangleAlert className="size-3.5" /> Verify 4 motor mounting holes
      </span>} />
    <AssemblyStage
      scene={ready ? <StepFourteenScene phase={phase}
        railConfig={ready.railConfig} frameConfig={ready.frameConfig}
        stepSixConfig={ready.stepSixConfig} prepared={ready.prepared}
        paused={paused} replayKey={replayKey} resetCameraKey={cameraKey}
        reducedMotion={reducedMotion} view={view}
        onMotionComplete={() => setBusy(false)} /> :
        <div role="alert" className="grid h-full place-items-center p-5 text-center text-sm text-amber-900">
          Complete and physically confirm Step 13 in this browser first.
          Step 14 reuses the actual saved chassis; it does not make a replacement frame.
        </div>}
      status={<span className="rounded-xl border border-white/90 bg-white/95 px-3 py-2 text-xs font-bold text-[#132654] shadow-sm">
        {phase <= 1 ? "4 original blue pins · two grey 9-hole beams"
          : phase === 2 ? "Axle + disc → black 3-hole crossbeam"
            : phase === 3 ? "Motor mounting holes ↔ 4 original pins"
              : "One rigid motor assembly · all 4 pins retained"}
      </span>}
      tools={<div className="flex flex-wrap items-center gap-1.5">
        <button type="button" aria-label="Reset Step 14 camera" title="Reset camera"
          onClick={() => { setView("iso"); setCameraKey(k => k + 1); }}
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
        <AssemblyActionCard actionIndex={phase}
          actionCount={STEP_FOURTEEN_ACTIONS.length}
          title={action.title} instruction={action.instruction}
          note="Grey A/B Hole 3 receives original BLUE_A/B_6; Grey A/B Hole 9 receives original BLUE_A/B_12. The motor points toward the black 3-hole crossbeam. Four motor receiving holes require real-kit verification." />
        {final && <label className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5">
          <input type="checkbox" className="mt-1 size-4 shrink-0"
            checked={physicallyChecked} onChange={e => setPhysicallyChecked(e.target.checked)} />
          I checked the real motor's four mounting holes against the two blue
          pins at grey holes 3 and 9 on EACH rail, confirmed the motor sits
          without forcing or bending parts, and ensured the axle and disc face
          the black 3-hole crossbeam. All four original blue pins remain installed.
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
      Step 13, both L brackets and every Step 10 blue pin are retained.
      The motor and other Step 2 parts use their original GLB and STL geometry
      with the existing Step 2 assembled placements. This is a photo-guided
      preview: the real motor mounting holes and insertion depth have not been
      calibrated from the GLB, so physical verification is required.
      {warnings.length > 0 ? " " + warnings.join(" ") : ""}
    </p>
  </div>;
}
