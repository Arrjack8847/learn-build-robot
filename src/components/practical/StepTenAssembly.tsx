import { useEffect, useState } from "react";
import { RotateCcw, ScanSearch, TriangleAlert } from "lucide-react";
import {
  AssemblyLessonHeader, AssemblyPlaybackControls, AssemblyStage,
} from "./AssemblyLessonUI";
import { StepTenScene } from "./StepTenScene";
import {
  STEP_TEN_ACTIONS, STEP_TEN_ASSEMBLY_ID, STEP_TEN_COMPONENT_COUNTS,
  STEP_TEN_FINAL_PHASE, STEP_TEN_RESULT_KEY, stepTenHolePairs, stepTenValidate,
} from "./stepTenGeometry";

type View = "iso" | "top" | "front" | "back";
export function StepTenAssembly({ onCompleteStep }: { onCompleteStep: () => void }) {
  const [phase, setPhase] = useState(0);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [resetCameraKey, setResetCameraKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [view, setView] = useState<View>("iso");
  const [physicallyChecked, setPhysicallyChecked] = useState(false);
  const valid = stepTenValidate().length === 0;
  const completedAnimation = phase === STEP_TEN_FINAL_PHASE && !busy;
  const ready = completedAnimation && physicallyChecked && valid;
  const action = STEP_TEN_ACTIONS[phase]!;
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  function navigate(next: number) {
    if (busy || !valid || next < 0 || next > STEP_TEN_FINAL_PHASE || next === phase) return;
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
    setReplayKey(value => value + 1);
  }
  function restart() {
    setBusy(false);
    setPaused(false);
    setPhysicallyChecked(false);
    setPhase(0);
    setView("iso");
    setReplayKey(v => v + 1);
    setResetCameraKey(v => v + 1);
  }
  function complete() {
    if (!ready) return;
    try {
      window.localStorage.setItem(STEP_TEN_RESULT_KEY, JSON.stringify({
        version: 1,
        assemblyId: STEP_TEN_ASSEMBLY_ID,
        whiteBeamHoles: { endBlue: 1, blackFree: 3, blueMounts: [6, 12], blackBridge: 15 },
        blackHole3Face: "opposite-gray",
        blackHole15Face: "same-as-gray",
        threeHoleBridgeFace: "same-as-gray",
        blueHole1InsertionDirection: "bottom-to-top-through-both-faces",
        blueHoles6And12InsertionDirection: "top-to-bottom",
        blueHoles6And12WhiteUnderside: "flush-no-protrusion",
        bluePinsVisibleOnBothOuterFaces: false, // only Hole 1 is visible on BOTH white-beam faces
        blueHole1VisibleOnBothWhiteFaces: true,
        blueHoles6And12VisibleAboveGray: true,
        grayBeamMating: stepTenHolePairs(),
        bridgeConnections: [{ whiteUnit: "A", whiteHole: 15, bridgeHole: 1 },
          { whiteUnit: "B", whiteHole: 15, bridgeHole: 3 }],
        brownSpacer: { bridgeHole: 2, usesBlackConnector: true,
          side: "inward-below-three-hole-bridge", insertion: "bottom-to-top",
          noConnectorProtrusionAboveBridge: true },
        quantities: STEP_TEN_COMPONENT_COUNTS,
        twoMirroredSideUnits: true,
        stepTenPhotoSequence: "IMG_1779 through IMG_1814",
        originalStlModelsUsed: true,
        spacerMeshIsApproximation: true,
        mechanicallyVerified: false,
        physicallySelfConfirmed: true,
        completedAt: new Date().toISOString(),
      }));
    } catch { /* private browsing may not permit storage */ }
    onCompleteStep();
  }
  return <div className="relative z-10 w-full space-y-3">
    <AssemblyLessonHeader step={10} title="Build twin side rails and connect the center spacer"
      trailing={<span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-900">
        <TriangleAlert className="size-3.5" /> Physical fit self-check required
      </span>} />
    <AssemblyStage
      scene={<StepTenScene phase={phase} paused={paused} replayKey={replayKey}
        reducedMotion={reducedMotion} resetCameraKey={resetCameraKey}
        view={view} onMotionComplete={() => setBusy(false)} />}
      status={<span className="rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-[#132654] shadow-sm">
        Grey rails + black 3-hole beam on SAME SIDE · Stopper INWARD underneath
      </span>}
      tools={<div className="flex flex-wrap items-center gap-2">
        <button type="button" aria-label="Reset Step 10 3D camera"
          onClick={() => { setView("iso"); setResetCameraKey(v => v + 1); }}
          className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white/95 text-[#132654] shadow-sm">
          <ScanSearch className="size-4.5" />
        </button>
        <button type="button" onClick={restart}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-3 text-xs font-bold text-[#132654] shadow-sm">
          <RotateCcw className="size-4" /> Restart
        </button>
      </div>}
      dock={<div className="space-y-2 text-[#132654]">
        <div aria-live="polite" aria-atomic="true">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#116eaf]">
            Action {action.number} of {STEP_TEN_FINAL_PHASE}
          </span>
          <h3 className="mt-1 text-sm font-extrabold leading-5 sm:text-base">{action.title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-700 sm:text-sm">{action.instruction}</p>
        </div>
        <div role="progressbar" aria-label="Step 10 assembly progress"
          aria-valuemin={0} aria-valuemax={STEP_TEN_FINAL_PHASE} aria-valuenow={phase}
          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-[#168eea] transition-[width] duration-300"
            style={{ width: String(100 * phase / STEP_TEN_FINAL_PHASE) + "%" }} />
        </div>
        {completedAnimation && <div role="group" aria-label="Inspect completed Step 10 from different sides"
          className="flex flex-wrap gap-1.5">
          {(["top", "front", "back", "iso"] as const).map(item =>
            <button type="button" key={item} aria-pressed={view === item}
              onClick={() => setView(item)}
              className={"min-h-9 rounded-lg border px-3 text-[11px] font-bold capitalize " +
                (view === item ? "border-[#168eea] bg-[#168eea] text-white" :
                  "border-slate-200 bg-white text-slate-700")}>
              {item === "iso" ? "3D view" : item}
            </button>)}
        </div>}
        <AssemblyPlaybackControls paused={paused}
          onPrevious={() => navigate(phase - 1)}
          onNext={() => navigate(phase + 1)}
          onReplay={replay}
          onTogglePause={() => setPaused(value => !value)}
          previousDisabled={phase === 0 || busy}
          replayDisabled={busy} pauseDisabled={!valid}
          nextDisabled={busy || !valid}
          isFinalAction={completedAnimation}
          completeDisabled={!ready}
          onComplete={complete} />
      </div>}
    />
    {completedAnimation && <label className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-[#132654] sm:text-sm">
      <input className="mt-1 size-4 shrink-0" type="checkbox" checked={physicallyChecked}
        onChange={e => setPhysicallyChecked(e.target.checked)} />
      I checked my real Step 10 assembly: both white 15-hole beams have blue pins at holes 1, 6 and 12;
      Hole 1 blue pins enter UPWARD from below and remain visible from both white-beam faces;
      blue pins at Holes 6 and 12 enter DOWNWARD from above and stop FLUSH with the white
      underside, without sticking out beneath the white beams. Both gray 9-hole beams
      attach at gray holes 3 and 9, with blue tips visible above gray. Black pins at
      White Hole 3 black pins point AWAY from grey, while White Hole 15 black pins and
      the black 3-hole joining beam are on the SAME SIDE as both grey 9-hole beams.
      The brown stopper and its black connector enter center Bridge Hole 2 FROM BELOW,
      staying UNDER the crossbeam and pointing INWARD, NOT outward above it.
       I understand the spacer 3D mesh and connector seating depths are approximations.
    </label>}
    <p className="px-1 text-[11px] leading-4 text-slate-500">
      The beam and pin meshes are loaded from the repository's original STLs.
      The brown stopper uses an illustrative cylinder because its exact STL has not
      been identified. Its inward placement under the same-side grey/black crossbeam is reused
      automatically in Steps 11 through 14.
      The original manual numbering remains unchanged; this is a photograph-based interactive Step 10.
    </p>
  </div>;
}
