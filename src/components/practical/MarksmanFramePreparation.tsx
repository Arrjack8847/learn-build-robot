import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Eye, EyeOff, Maximize2,
  Minus, Pause, Play, Plus, Rotate3D, RotateCcw, ScanSearch, SkipBack,
  SlidersHorizontal, TriangleAlert, Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssemblyLessonHeader, AssemblyActionCard, AssemblyPlaybackControls, AssemblyUtilityControls } from "./AssemblyLessonUI";
import { MarksmanFrameScene } from "./MarksmanFrameScene";
import { DEFAULT_FRAME_CONFIG, VERIFICATION } from "./marksmanFrameGeometry";
import type { FrameConfig } from "./marksmanFrameGeometry";

/**
 * Step 7-only photo-based animation. The photographed frame sequence differs
 * from the official Step 7 diagram, and does not alter manual Steps 9 or 11.
 * No progress is written into the official progress-tracking system.
 */
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
  photoUrls,
}: {
  /** Real user photos can be wired here when their actual repository URLs are available. */
  photoUrls?: Partial<Record<PhotoStage, string>>;
}) {
  const [phase, setPhase] = useState(0);
  const [localPhotos, setLocalPhotos] = useState<Partial<Record<PhotoStage, string>>>({});
  const transientPhotoUrls = useRef<string[]>([]);
  const [config, setConfig] = useState<FrameConfig>(DEFAULT_FRAME_CONFIG);
  const [paused, setPaused] = useState(false);
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
  const finished = phase === ACTIONS.length - 1;

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
      <div className="relative h-[330px] min-h-[280px] overflow-hidden rounded-2xl border border-[#cadbe8] bg-[#f5f9fd] sm:h-[450px] lg:h-[520px]">
        <MarksmanFrameScene phase={phase} config={config} replayKey={replayKey}
          resetCameraKey={resetCameraKey} zoomKey={zoomKey} zoomDirection={zoomDirection}
          paused={paused} spin={spin} exploded={exploded} labels={labels}
          reducedMotion={reducedMotion} />
        <div className="pointer-events-none absolute left-2 top-2 rounded-lg bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm sm:left-3 sm:top-3">
          One-finger orbit · pinch/scroll zoom
        </div>
        {finished && (
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-xl bg-white/95 p-3 text-center shadow-md">
            <span className="block text-sm font-black tracking-wider text-emerald-900">
              RECTANGULAR FRAME PREPARED
            </span>
            <span className="mt-0.5 block text-xs text-slate-700">
              The frame and separate long beam are ready for their next operations.
            </span>
          </div>
        )}
      </div>

      <AssemblyActionCard actionIndex={phase} actionCount={ACTIONS.length}
        title={current.title} instruction={current.text} />
      <AssemblyPlaybackControls paused={paused} previousDisabled={phase===0}
        replayDisabled={phase===0} nextDisabled={finished}
        onPrevious={()=>go(phase-1)}
        onReplay={()=>{setPaused(false);setReplayKey(value=>value+1);}}
        onTogglePause={()=>setPaused(v=>!v)}
        onNext={()=>go(phase+1)} />
      <AssemblyUtilityControls step={7} manualShown={showManual}
        onResetView={()=>setResetCameraKey(v=>v+1)}
        onToggleManual={()=>setShowManual(v=>!v)}
        onRestart={()=>{go(0);setResetCameraKey(v=>v+1);}} />
      {showManual && (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-sm font-bold text-[#132654]">Official Step 7 manual (authoritative)</p>
          <img src="/marksmanship/steps/7.png" alt="Official Marksmanship Step 7 instructions" className="mx-auto max-h-80 w-full object-contain"/>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        <Button type="button" size="sm" variant={spin ? "secondary" : "ghost"}
          className="min-h-10 rounded-lg" aria-pressed={spin}
          onClick={() => setSpin((value) => !value)} title="Auto-rotate during final inspection">
          <Rotate3D className="size-4" /> Rotate 360°
        </Button>
        <Button type="button" size="sm" variant="ghost" className="min-h-10 rounded-lg"
          onClick={() => zoom(1)}><Plus className="size-4" /> Zoom in</Button>
        <Button type="button" size="sm" variant="ghost" className="min-h-10 rounded-lg"
          onClick={() => zoom(-1)}><Minus className="size-4" /> Zoom out</Button>

        <Button type="button" size="sm" variant={exploded ? "secondary" : "ghost"}
          className="min-h-10 rounded-lg" aria-pressed={exploded}
          onClick={() => setExploded((value) => !value)}>
          <Maximize2 className="size-4" /> {exploded ? "Assembled" : "Exploded"}
        </Button>
        <Button type="button" size="sm" variant={labels ? "secondary" : "ghost"}
          className="min-h-10 rounded-lg" aria-pressed={labels}
          onClick={() => setLabels((value) => !value)}>
          {labels ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {labels ? "Hide holes" : "Hole labels"}
        </Button>
        <Button type="button" size="sm" variant="ghost" className="min-h-10 rounded-lg"
          aria-expanded={showReference} onClick={() => setShowReference((value) => !value)}>
          <Eye className="size-4" /> {showReference ? "Hide" : "View"} reference photos
        </Button>
      </div>

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

      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3">
        <button type="button" className="flex w-full items-center justify-between gap-2 text-left text-xs font-bold text-amber-950"
          aria-expanded={showCalibration} onClick={() => setShowCalibration((value) => !value)}>
          <span><SlidersHorizontal className="mr-1.5 inline size-4" /> Calibration choices (unverified)</span>
          <ChevronDown className={"size-4 transition-transform " + (showCalibration ? "rotate-180" : "")} />
        </button>
        {showCalibration && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              7-hole near-end connector
              <select className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white p-2"
                value={config.firstMount} onChange={(event) => editConfig({ firstMount: Number(event.target.value) as 0 | 1 })}>
                <option value={0}>Hole 1 — photo candidate</option>
                <option value={1}>Hole 2 — official Step 9</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Long connector STL
              <select className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white p-2"
                value={config.longConnector} onChange={(event) => editConfig({ longConnector: event.target.value as FrameConfig["longConnector"] })}>
                <option value="long">long connector.stl (24 mm)</option>
                <option value="pinLong">pin_long_pin.stl (24 mm)</option>
              </select>
            </label>
            {([0, 1] as const).map((i) => (
              <label key={i} className="text-xs font-semibold text-slate-700">
                Separate 15-hole beam · black pin {i + 1}
                <select className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white p-2"
                  value={config.beam15Holes[i]}
                  onChange={(event) => {
                    const holes = [...config.beam15Holes] as [number, number];
                    holes[i] = Number(event.target.value);
                    editConfig({ beam15Holes: holes });
                  }}>
                  {Array.from({ length: 15 }, (_, index) => (
                    <option key={index} value={index}>Hole {index + 1}{index === (i === 0 ? 4 : 7) ? " · manual candidate" : ""}</option>
                  ))}
                </select>
              </label>
            ))}
            <p className="sm:col-span-2 text-xs leading-5 text-amber-950">
              These choices affect only the Step 7 animation, never the official manual.
              Pin holes 5/8 on the separate beam are borrowed as editable candidates,
              not claimed as verified matches to the uploaded photos.
              {config.beam15Holes[0] === config.beam15Holes[1] ? (
                <strong className="block">Choose two different 15-hole mounting positions.</strong>
              ) : null}
            </p>
          </div>
        )}
      </div>

      <p className="text-[11px] leading-5 text-slate-500">
        <TriangleAlert className="mr-1 inline size-3.5" />
        Original STL meshes and 8 mm pitch are used. The 7-hole photo indices, collar seating
        clearance, exact black-pin model, and 15-hole mounting indices are not physically verified.
        {VERIFICATION.mechanicallyVerified ? " Measured fit verified." : " Physical dry fit is required before classroom use."}
      </p>

    </div>
  );
}
