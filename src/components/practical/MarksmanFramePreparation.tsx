import { useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, EyeOff, Maximize2, Minus, Plus, Rotate3D, SlidersHorizontal, TriangleAlert, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssemblyLessonHeader, AssemblyActionCard, AssemblyPlaybackControls, AssemblyUtilityControls, AssemblyStage } from "./AssemblyLessonUI";
import { MarksmanFrameScene } from "./MarksmanFrameScene";
import { DEFAULT_FRAME_CONFIG, VERIFICATION } from "./marksmanFrameGeometry";
import type { FrameConfig } from "./marksmanFrameGeometry";

/**
 * Step 7-only photo-based animation. The photographed frame sequence differs
 * from the official Step 7 diagram, and does not alter manual Steps 9 or 11.
 * No progress is written into the official progress-tracking system.
 */
const STEP_SEVEN_PHASE_KEY = "robot:marksmanship:step7:photo-phase:v1";
function readSavedStepSevenPhase(): number {
  if (typeof window === "undefined") return 0;
  try {
    const n = Number(window.localStorage.getItem(STEP_SEVEN_PHASE_KEY) ?? "0");
    return Number.isInteger(n) && n >= 0 && n < 11 ? n : 0;
  } catch { return 0; }
}

const ACTIONS = [
  {
    title: "Prepare all eleven loose parts",
    text: "Prepare two 7-hole beams, two 5-hole beams, four long connectors, one 15-hole beam and two black connectors. Keep every part separate and inspect the hole shapes.",
  },
  {
    title: "First rail — insert near-end long connector",
    text: "Place the first 7-hole beam in view. Count holes from the chosen end and align the long connector to the highlighted near-end hole. Push straight along the opening axis until seated.",
  },
  {
    title: "First rail — insert farther long connector",
    text: "Insert the second long connector at Hole 5 of the same rail. Both long connectors must point in the same direction and remain exposed above the beam.",
  },
  {
    title: "Second rail — insert near-end long connector",
    text: "Bring the second 7-hole beam alongside the first. Insert its near-end connector at the matching hole. Keep both rails parallel so the later crossbeam holes will line up.",
  },
  {
    title: "Second rail — insert farther long connector",
    text: "Insert the fourth long connector at Hole 5 on the second rail. Both rails should now have two corresponding connectors each.",
  },
  {
    title: "Connect the first 5-hole beam — U shape",
    text: "Align the end holes (1 and 5) of the first 5-hole crossbeam over the two near-end pins. Lower the whole crossbeam along the common insertion axes. Each corner overlaps its 7-hole rail; do not connect end-to-end.",
  },
  {
    title: "Inspect the open U-shaped assembly",
    text: "The first crossbeam is now seated at both ends. Verify that the 7-hole rails remain parallel and that the two other long connectors are still exposed. Do not attach the next crossbeam yet.",
  },
  {
    title: "Attach the second 5-hole beam",
    text: "Align the second 5-hole crossbeam's two end holes with the remaining pins. Keep it parallel to the first crossbeam and lower both ends together. The 7-hole rails extend beyond the new crossbeam.",
  },
  {
    title: "Prepare the separate 15-hole beam — pin one",
    text: "Keep the rectangular frame untouched. Select the mounting hole for the first black connector on the separate 15-hole beam. The illustrated hole is a provisional candidate, not a verified photo measurement.",
  },
  {
    title: "Prepare the separate 15-hole beam — pin two",
    text: "Insert the second black connector into its independently selected hole, from the same side. Keep this long beam separate from the rectangular frame.",
  },
  {
    title: "Inspect both completed preparation units",
    text: "RECTANGULAR FRAME PREPARED. Examine the open rectangular center, the four overlapping junctions and the free rail ends. The prepared 15-hole beam stays on its own for later operations.",
  },
] as const;

type PhotoStage = "inventory" | "pins" | "firstCrossbeam" | "uShape" | "rectangle";

function readReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MarksmanFramePreparation({
  photoUrls, onCompleteStep,
}: {
  onCompleteStep: () => void;
  /** Real user photos can be wired here when their actual repository URLs are available. */
  photoUrls?: Partial<Record<PhotoStage, string>>;
}) {
  const [phase, setPhase] = useState(readSavedStepSevenPhase);
  const [localPhotos, setLocalPhotos] = useState<Partial<Record<PhotoStage, string>>>({});
  const transientPhotoUrls = useRef<string[]>([]);
  const [config, setConfig] = useState<FrameConfig>(DEFAULT_FRAME_CONFIG);
  const [paused, setPaused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [resetCameraKey, setResetCameraKey] = useState(0);
  const [zoomKey, setZoomKey] = useState(0);
  const [zoomDirection, setZoomDirection] = useState<1 | -1>(1);
  const [spin, setSpin] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [labels, setLabels] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(readReducedMotion);
  const finished = phase === ACTIONS.length - 1 && !busy;
  useEffect(() => {
    try { window.localStorage.setItem(STEP_SEVEN_PHASE_KEY, String(phase)); }
    catch { /* The tutorial remains usable without storage. */ }
  }, [phase]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    return () => { for (const url of transientPhotoUrls.current) URL.revokeObjectURL(url); };
  }, []);

  function attachOriginalPhoto(stage: PhotoStage, file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    transientPhotoUrls.current.push(url);
    setLocalPhotos((old) => ({ ...old, [stage]: url }));
  }

  function go(next: number) {
    setBusy(true);
    setExploded(false);
    setSpin(false);
    setPaused(false);
    setPhase(Math.max(0, Math.min(ACTIONS.length - 1, next)));
  }
  function editConfig(patch: Partial<FrameConfig>) {
    setConfig((old) => ({ ...old, ...patch }));
    setExploded(false);
    setSpin(false);
    setPaused(false);
    setPhase(0); // changing assumptions invalidates the illustrated connections
  }
  function zoom(direction: 1 | -1) {
    setZoomDirection(direction);
    setZoomKey((value) => value + 1);
  }
  const current = ACTIONS[phase]!;
  const photoId =
    phase === 0 ? "inventory" : phase <= 4 ? "pins" :
    phase === 5 ? "firstCrossbeam" : phase === 6 ? "uShape" : "rectangle";
  const photo = localPhotos[photoId] ?? photoUrls?.[photoId];
  return (
    <div className="w-full min-w-0 space-y-3 text-left">
      <AssemblyLessonHeader step={7} title="Photo-based frame preparation"
        actionIndex={phase} actionCount={ACTIONS.length}
        trailing={<span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">Physical fit not verified</span>} />
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-950">
        This is a supplementary photo-based frame sequence, not the official Step 7 instruction.
        Check the official manual before continuing to Step 8.
      </p>
      <AssemblyStage
        scene={<MarksmanFrameScene phase={phase} config={config} replayKey={replayKey}
          resetCameraKey={resetCameraKey} zoomKey={zoomKey} zoomDirection={zoomDirection}
          paused={paused} spin={false} exploded={false} labels={false}
          reducedMotion={reducedMotion} onMotionComplete={() => setBusy(false)} />}
        status={finished ? <span className="rounded-xl bg-emerald-50/95 p-2 text-xs font-bold text-emerald-900">Frame tutorial complete</span> : null}
        tools={<AssemblyUtilityControls step={7} manualShown={showManual}
          onResetView={()=>setResetCameraKey(v=>v+1)}
          onToggleManual={()=>setShowManual(v=>!v)}
          onRestart={()=>{go(0);setResetCameraKey(v=>v+1);}} />}
        dock={<>
          <AssemblyActionCard actionIndex={phase} actionCount={ACTIONS.length}
            title={current.title} instruction={current.text} />
          <AssemblyPlaybackControls paused={paused} previousDisabled={phase===0||busy}
            replayDisabled={busy} nextDisabled={busy}
            isFinalAction={phase === ACTIONS.length - 1} completeDisabled={!finished} onComplete={onCompleteStep}
            onPrevious={()=>go(phase-1)}
            onReplay={()=>{setPaused(false);setBusy(true);setReplayKey(value=>value+1);}}
            onTogglePause={()=>setPaused(v=>!v)}
            onNext={()=>go(phase+1)} />
        </>}
      />
      {showManual && (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-sm font-bold text-[#132654]">Official Step 7 manual (authoritative)</p>
          <img src="/marksmanship/steps/7.png" alt="Official Marksmanship Step 7 instructions" className="mx-auto max-h-80 w-full object-contain"/>
        </div>
      )}
      <Button type="button" variant="ghost" className="min-h-11 w-fit rounded-xl text-xs"
        onClick={()=>setShowReference(v=>!v)} aria-expanded={showReference}>
        <Eye className="size-4"/> {showReference ? "Hide" : "Compare"} reference photos
      </Button>
      {showReference && (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <label className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs font-bold text-[#132654]">
            <Upload className="size-4" /> Choose your original {photoId} photo for side-by-side comparison
            <input aria-label={"Select real " + photoId + " photograph"} type="file" accept="image/*"
              className="block min-w-0 max-w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2"
              onChange={(event) => attachOriginalPhoto(photoId, event.target.files?.[0])} />
          </label>
          {photo ? (
            <div>
              <p className="mb-2 text-xs font-bold">Original assembly photograph · {photoId}</p>
              <img src={photo} alt={"User's real " + photoId + " frame preparation photograph"}
                className="max-h-96 w-full object-contain" />
            </div>
          ) : (
            <div role="status" className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <TriangleAlert className="mr-1 inline size-4" />
              The original photo for this stage is not bundled in the repository.
              Select that real photo above to compare locally in the viewer; it stays
              on your device and is not uploaded. The official manual pictures below
              are different references and are not used as photo-based geometry proof.
            </div>
          )}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <figure>
              <img src="/marksmanship/steps/9.png" alt="Official manual Step 9, 7-hole beams at holes 2 and 5"
                className="mx-auto max-h-52 w-full object-contain" loading="lazy" />
              <figcaption className="mt-1 text-[11px] text-slate-500">
                Official Step 9 · 7-hole connectors at holes 2 and 5
              </figcaption>
            </figure>
            <figure>
              <img src="/marksmanship/steps/11.png" alt="Official manual Step 11, 15-hole beam"
                className="mx-auto max-h-52 w-full object-contain" loading="lazy" />
              <figcaption className="mt-1 text-[11px] text-slate-500">
                Official Step 11 · separate 15-hole beam, holes 5 and 8
              </figcaption>
            </figure>
          </div>
        </div>
      )}

      <p className="text-[11px] leading-5 text-slate-500">
        <TriangleAlert className="mr-1 inline size-3.5" />
        Original STL meshes and 8 mm pitch are used. The 7-hole photo indices, collar seating
        clearance, exact black-pin model, and 15-hole mounting indices are not physically verified.
        {VERIFICATION.mechanicallyVerified ? " Measured fit verified." : " Physical dry fit is required before classroom use."}
      </p>

    </div>
  );
}
