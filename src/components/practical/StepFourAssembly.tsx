import { useEffect, useState } from "react";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Eye, Pause, Play,
  RotateCcw, ScanSearch, SkipBack, TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { STEP_THREE_SNAPSHOT } from "./StepThreeAssembly";
import type { StepThreeConfig } from "./StepThreeScene";
import { getStepFourTransforms, StepFourScene } from "./StepFourScene";

const STORAGE_PHASE = "robot:marksmanship:step4:phase:v1";
const STORAGE_RESULT = "robot:marksmanship:step4:assembled:v1";
const STEPS = [
  {
    title: "Check the prepared Step 3 components",
    text: "The 15-hole beam has two blue pins in holes 1 and 2 (counting from its prepared end). Each grey L-shaped beam already has a pin at the free end of its short arm. Keep the L-beams separate and locate the black medium axle and grey axle connector.",
  },
  {
    title: "Slide the grey axle connector to the middle",
    text: "Match the medium black axle's + profile with the one cross-shaped hole in the grey axle connector. Slide the connector along the axle until it rests at approximately the midpoint, leaving axle length on both sides.",
  },
  {
    title: "Fit the first L-beam onto white beam holes 1 and 2",
    text: "Count along the grey L-beam's longer arm FROM ITS CORNER: hole 1 (at the corner) and hole 2 (the next circular hole) receive the two blue pins on the white 15-hole beam. Align both holes, then push straight onto the pins. The pin already attached to the L-beam must point outward.",
  },
  {
    title: "Insert the prepared axle through the first L-beam",
    text: "The far end of the grey L-beam has a cross-shaped X hole. Align the prepared black axle and its grey connector with this opening, then slide the axle through it. Keep the grey connector at the middle of the axle.",
  },
  {
    title: "Fit the second L-beam on the other side",
    text: "Bring the second grey L-beam in from the opposite side. Slide its far X hole along the protruding axle while lining up its circular holes 1 and 2 (counted from the corner) with the same two blue connector positions. Seat it completely; its preinstalled pin must face outward.",
  },
  {
    title: "Inspect and keep the completed Step 4 unit",
    text: "Check that the two grey L-beams are parallel, the white beam enters their center, blue pins pass through circular holes 1 and 2 of each L-beam, the medium axle passes through both X holes, and the grey axle connector sits between them. Store this assembly for Steps 29–30.",
  },
] as const;
type Prep = { valid: boolean; reason: string; connector: StepThreeConfig["longConnector"] };

function readPreparation(): Prep {
  const fallback: Prep = {
    valid: false, connector: "long",
    reason: "Step 3 is not marked prepared in this browser. Complete Step 3 first.",
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STEP_THREE_SNAPSHOT);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const selected = parsed?.selectedHoles?.beam;
    const connector = parsed?.models?.longPinA === "pin-long-pin.stl" ? "pinLong" : "long";
    if (!Array.isArray(selected) || selected[0] !== 1 || selected[1] !== 2) {
      return {
        valid: false, connector,
        reason: "The saved Step 3 assembly uses a different beam hole pair. Return to Step 3 and choose holes 1 and 2.",
      };
    }
    if (!parsed?.transforms?.leftL || !parsed?.transforms?.rightL || !parsed?.transforms?.axleConnector) return fallback;
    return { valid: true, connector, reason: "" };
  } catch { return fallback; }
}
function readPhase() {
  if (typeof window === "undefined") return 0;
  try {
    const value = Number(window.localStorage.getItem(STORAGE_PHASE));
    return Number.isInteger(value) && value >= 0 && value < STEPS.length ? value : 0;
  } catch { return 0; }
}

export function StepFourAssembly({
  onReadyChange, onBackToStep3,
}: {
  onReadyChange: (ready: boolean) => void;
  onBackToStep3: () => void;
}) {
  const [prep, setPrep] = useState<Prep>(() => ({valid: false, reason: "", connector: "long"}));
  const [phase, setPhase] = useState(readPhase);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [resetCameraKey, setResetCameraKey] = useState(0);
  const [showReference, setShowReference] = useState(false);
  const ready = prep.valid && phase === STEPS.length - 1 && !busy;
  const step = STEPS[phase] ?? STEPS[0];

  useEffect(() => { setPrep(readPreparation()); }, []);
  useEffect(() => {
    onReadyChange(ready);
    try {
      window.localStorage.setItem(STORAGE_PHASE, String(phase));
      if (ready) {
        window.localStorage.setItem(STORAGE_RESULT, JSON.stringify({
          ...getStepFourTransforms(),
          stepThreeSource: STEP_THREE_SNAPSHOT,
          connectorModel: prep.connector === "long" ? "connector-long.stl" : "pin-long-pin.stl",
          completedAt: new Date().toISOString(),
        }));
      } else {
        window.localStorage.removeItem(STORAGE_RESULT);
      }
    } catch { /* Storage optional: 3D still works offline without progress persistence. */ }
  }, [phase, ready, prep.connector, onReadyChange]);

  function changePhase(next: number) {
    if (busy || !prep.valid) return;
    setPaused(false);
    setBusy(true);
    setPhase(Math.max(0, Math.min(STEPS.length - 1, next)));
  }
  function restart() {
    setPaused(false);
    setBusy(false);
    setPhase(0);
    setResetCameraKey((n) => n + 1);
  }

  return (
    <div className="relative z-10 w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#116eaf]">
          Interactive 3D · Step 4 · {phase}/5 actions
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          <Eye aria-hidden="true" className="size-3.5" /> Drag to orbit · pinch to zoom
        </span>
      </div>
      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl border border-[#ccdcea] bg-[#f8fbfd] sm:h-[350px] md:h-[410px]">
        <StepFourScene
          phase={phase} replayKey={replayKey} paused={paused}
          resetCameraKey={resetCameraKey} connector={prep.connector}
          onMotionComplete={() => setBusy(false)}
        />
        {ready && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-xl bg-emerald-50/95 px-3 py-2 text-xs font-extrabold text-emerald-800">
            Step 4 sequence complete · keep for Steps 29–30
          </span>
        )}
      </div>
      <div aria-live="polite" className="rounded-xl border border-blue-100 bg-white p-3 text-left sm:p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eaf5ff] text-sm font-black text-[#116eaf]">
            {ready ? <CheckCircle2 aria-hidden="true" className="size-5" /> : phase + 1}
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-[#132654] sm:text-base">{step.title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{step.text}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-xl" size="sm" variant="outline" type="button"
            disabled={phase === 0 || busy || !prep.valid}
            onClick={() => changePhase(phase - 1)}>
            <SkipBack aria-hidden="true" className="size-3.5" /> Previous
          </Button>
          <Button className="rounded-xl" size="sm" variant="outline" type="button"
            disabled={phase === 0 || busy || !prep.valid}
            onClick={() => { setPaused(false); setBusy(true); setReplayKey((n) => n + 1); }}>
            <RotateCcw aria-hidden="true" className="size-3.5" /> Replay action
          </Button>
          <Button className="rounded-xl" size="sm" variant="outline" type="button"
            disabled={!prep.valid} onClick={() => setPaused((v) => !v)}>
            {paused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
            {paused ? "Resume" : "Pause"}
          </Button>
        </div>
        <Button className="rounded-xl bg-[#168eea] text-white hover:bg-[#0e82dd]"
          size="sm" type="button" disabled={phase >= STEPS.length - 1 || busy || !prep.valid}
          onClick={() => changePhase(phase + 1)}>
          {phase === STEPS.length - 2 ? "Inspect assembly" : "Next action"}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className="rounded-lg" size="sm" type="button" variant="ghost"
          onClick={() => setResetCameraKey((n) => n + 1)}>
          <ScanSearch aria-hidden="true" className="size-4" /> Reset view
        </Button>
        <Button className="rounded-lg" size="sm" type="button" variant="ghost"
          onClick={() => setShowReference((v) => !v)}>
          <Eye aria-hidden="true" className="size-4" />
          {showReference ? "Hide" : "Show"} manual Step 4
        </Button>
        <Button className="rounded-lg" size="sm" type="button" variant="ghost"
          onClick={restart}><ArrowLeft aria-hidden="true" className="size-4" /> Restart Step 4
        </Button>
      </div>
      {showReference && (
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <img className="mx-auto max-h-72 w-full object-contain" src="/marksmanship/steps/4.png"
            alt="Official manual illustration of the completed Step 4 assembly" />
        </div>
      )}
      {!prep.valid && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-xs leading-5 text-amber-950" role="alert">
          <TriangleAlert aria-hidden="true" className="mr-2 inline size-4" />
          {prep.reason || "Checking prepared Step 3 parts…"}
          <button className="ml-2 font-extrabold underline underline-offset-2" type="button"
            onClick={onBackToStep3}>Return to Step 3</button>
        </div>
      )}
      <p className="text-[11px] leading-4 text-slate-500">
        The model uses the original STL geometry and the agreed hole positions: white beam 1–2,
        both circular L-beam holes nearest the corner, and the far cross-shaped X hole for the axle.
        Final physical fit and insertion depths should be confirmed against your robot photos.
      </p>
    </div>
  );
}
