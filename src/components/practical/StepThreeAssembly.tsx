import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { AssemblyLessonHeader, AssemblyActionCard, AssemblyPlaybackControls, AssemblyUtilityControls, AssemblyStage } from "./AssemblyLessonUI";
import {
  getPreparedStepThreeTransforms, StepThreeScene,
  type StepThreeConfig,
} from "@/components/practical/StepThreeScene";

// A new phase key makes returning students replay the corrected connector placement.
const STORAGE_PHASE = "robot:marksmanship:step3:phase:v2";
const STORAGE_CONFIG = "robot:marksmanship:step3:config:v1";
export const STEP_THREE_SNAPSHOT = "robot:marksmanship:step3:prepared:v1";

const INSTRUCTIONS = [
  {
    title: "Inspect all six groups of components",
    text: "Keep the completed motor assembly from Step 2 aside. Find the 15-hole beam, two long pins, two short L-beams, two L-beam pins, the medium axle and its connector. None should be attached yet.",
  },
  {
    title: "Insert long connector 1",
    text: "Count from the selected end of the 15-hole beam. Line up the first 24 mm connector perpendicular to the beam, then push it straight through the highlighted circular hole. The pin remains visible on both faces.",
  },
  {
    title: "Insert long connector 2",
    text: "Choose the immediately adjacent hole. Align the second connector parallel to the first and push it through until both connectors are seated.",
  },
  {
    title: "Prepare L-beam 1",
    text: "Find the free-end hole of the short arm (8 mm from the corner) on the first small L-shaped beam. Insert the pin through that hole; keep the L-beam separate from the long beam.",
  },
  {
    title: "Prepare L-beam 2",
    text: "Insert the second pin into the free-end hole of the short arm (8 mm from the corner). Keep the existing connector direction and leave both prepared L-shaped beams separate.",
  },
  {
    title: "Inspect the medium axle",
    text: "Find the separate 64 mm medium axle. Examine its + cross-shaped profile and do not insert it into the beam or another part.",
  },
  {
    title: "Inspect the axle connector",
    text: "Locate the separate axle connector and its matching cross-shaped opening. Keep it beside the axle; the axle and connector do not join in Step 3.",
  },
  {
    title: "Inspect the final preparation layout",
    text: "Check: two pins in the 15-hole beam, one pin in each separate L-beam, one loose medium axle and one loose axle connector. Nothing else should be connected.",
  },
] as const;

function readPhase(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = Number(window.localStorage.getItem(STORAGE_PHASE) ?? "0");
    return Number.isInteger(stored) && stored >= 0 && stored <= 7 ? stored : 0;
  } catch { return 0; }
}
function readConfig(): StepThreeConfig {
  const fallback: StepThreeConfig = { firstHole: 0, longConnector: "long" };
  if (typeof window === "undefined") return fallback;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_CONFIG) ?? "null");
    if (
      saved && Number.isInteger(saved.firstHole) && saved.firstHole >= 0 && saved.firstHole <= 13 &&
      (saved.longConnector === "long" || saved.longConnector === "pinLong")
    ) return { firstHole: saved.firstHole, longConnector: saved.longConnector };
  } catch { /* Invalid local demo storage is harmless. */ }
  return fallback;
}

export function StepThreeAssembly({ onReadyChange, onCompleteStep }: { onReadyChange: (ready: boolean) => void; onCompleteStep: () => void }) {
  const [phase, setPhase] = useState(readPhase);
  const [config, setConfig] = useState<StepThreeConfig>(readConfig);
  const [replayKey, setReplayKey] = useState(0);
  const [resetCameraKey, setResetCameraKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const instruction = INSTRUCTIONS[phase] ?? INSTRUCTIONS[0];
  const ready = phase === 7 && !busy;

  useEffect(() => {
    onReadyChange(ready);
    try {
      window.localStorage.setItem(STORAGE_PHASE, String(phase));
      window.localStorage.setItem(STORAGE_CONFIG, JSON.stringify(config));
      if (ready) {
        window.localStorage.setItem(STEP_THREE_SNAPSHOT, JSON.stringify(getPreparedStepThreeTransforms(config)));
      } else {
        window.localStorage.removeItem(STEP_THREE_SNAPSHOT);
      }
    } catch { /* State still works when browser storage is unavailable. */ }
  }, [phase, config, ready, onReadyChange]);

  function updateConfig(patch: Partial<StepThreeConfig>) {
    // A changed part or hole invalidates previously saved inserted positions.
    setConfig((old) => ({ ...old, ...patch }));
    setPaused(false);
    setPhase(0);
    setReplayKey((key) => key + 1);
  }

  return (
    <div className="relative z-10 w-full space-y-3">
      <AssemblyLessonHeader step={3} title="Prepare the long beam assembly" actionIndex={phase} actionCount={INSTRUCTIONS.length} />
      <AssemblyStage
        scene={<StepThreeScene config={config} paused={paused} phase={phase}
          replayKey={replayKey} resetCameraKey={resetCameraKey}
          onMotionComplete={() => setBusy(false)} />}
        status={ready ? <span className="rounded-xl bg-emerald-50/95 p-2 text-xs font-bold text-emerald-900">Step 3 demonstration complete</span> : null}
        tools={<AssemblyUtilityControls step={3} manualShown={showReference}
          onResetView={() => setResetCameraKey(k => k + 1)}
          onToggleManual={() => setShowReference(v => !v)}
          onRestart={() => { setPhase(0); setBusy(false); setPaused(false); setResetCameraKey(k => k + 1); }} />}
        dock={<>
          <AssemblyActionCard actionIndex={phase} actionCount={INSTRUCTIONS.length}
            title={instruction.title} instruction={instruction.text} />
          <AssemblyPlaybackControls paused={paused}
            previousDisabled={phase === 0 || busy} nextDisabled={busy} isFinalAction={phase === INSTRUCTIONS.length - 1}
            completeDisabled={!ready}
            onComplete={onCompleteStep} nextLabel="Next Action"
            onPrevious={() => { setPaused(false); setBusy(true); setPhase(p => Math.max(0, p - 1)); }}
            onReplay={() => { setPaused(false); setBusy(true); setReplayKey(k => k + 1); }}
            onTogglePause={() => setPaused(value => !value)}
            onNext={() => { setPaused(false); setBusy(true); setPhase(p => Math.min(7, p + 1)); }} />
        </>}
      />
      {showReference && (
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-bold text-slate-600">Manual reference · compare the holes and pin orientation</p>
          <img className="mx-auto max-h-72 w-full object-contain" src="/marksmanship/steps/3.png" alt="Marksmanship instruction manual Step 3 reference" />
        </div>
      )}

      <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-950">The displayed 15-hole beam positions are teaching references based on the saved Step 3 configuration. Physical fit and long-pin variant are not yet certified.</p>
      <p className="text-[11px] leading-4 text-slate-500">
        Uses original repository STL meshes. Final state is saved in this browser for reuse by a future Step 4 3D module. A manual image comparison is required before physical acceptance.
      </p>
    </div>
  );
}
