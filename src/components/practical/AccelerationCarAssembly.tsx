import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Info, RotateCcw, ScanSearch, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AssemblyActionCard, AssemblyPlaybackControls, AssemblyStage,
} from "./AssemblyLessonUI";
import {
  AccelerationCarScene, ACCELERATION_ACTIONS, ACCELERATION_TITLES,
} from "./AccelerationCarScene";

const MANUAL_DETAILS = [
  "Step 1: Connector-first rule. Insert the blue pin into Hole 2 of the loose silver arm FIRST, keeping its free end exposed. Then align that pin with Black Block Hole 2 and align Arm Hole 1 with the upper bushing. Lower the arm and attached pin together.",
  "Step 2: Upper gray gear travels down along the same vertical cross axle.",
  "Step 3: Opposing red L-beams surround the silver arm; the connecting axle travels horizontally.",
  "Step 4: First large gray L-beam stands upright, short foot inward; black pin enters the top joint from outside.",
  "Step 5: The manual calls for a yellow gear on its own axle. The 8-tooth STL shown is a provisional stand-in; tooth size and axle receiver have not been validated.",
] as const;

export function AccelerationCarAssembly({ step, onCompleteStep }: {
  step: number; onCompleteStep: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motionComplete, setMotionComplete] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [cameraKey, setCameraKey] = useState(0);
  const [manualShown, setManualShown] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  const actions = ACCELERATION_ACTIONS[step - 1] ?? ACCELERATION_ACTIONS[0]!;
  const instruction = actions[phase] ?? actions[0]!;
  const lastAction = phase === actions.length - 1;

  function nextAction() {
    if (!motionComplete || lastAction) return;
    setMotionComplete(false);
    setPaused(false);
    setPhase(n => Math.min(actions.length - 1, n + 1));
  }
  function previousAction() {
    if (phase === 0) return;
    setMotionComplete(false);
    setPaused(false);
    setPhase(n => Math.max(0, n - 1));
    setReplayKey(n => n + 1);
  }
  function replay() {
    setMotionComplete(false);
    setPaused(false);
    setReplayKey(n => n + 1);
  }
  function restart() {
    setPhase(0);
    setMotionComplete(false);
    setPaused(false);
    setReplayKey(n => n + 1);
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[.14em] text-[#168eea]">
            Acceleration Car · Review build 1–5
          </p>
          <h2 className="text-sm font-extrabold text-[#132654] sm:text-lg">
            Step {step}: {ACCELERATION_TITLES[step - 1]}
          </h2>
        </div>
        <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-bold text-[#0f69bd]">
          Action {phase + 1} / {actions.length}
        </span>
      </div>
      <AssemblyStage
        scene={
          <AccelerationCarScene step={step} phase={phase} paused={paused}
            reducedMotion={reducedMotion} replayKey={replayKey}
            cameraKey={cameraKey} onDone={() => setMotionComplete(true)}/>
        }
        status={
          <div className="rounded-xl border border-amber-200 bg-white/95 px-3 py-2 text-[11px] font-semibold leading-4 text-amber-800 shadow-sm">
            <Info aria-hidden="true" className="mr-1 inline size-3.5"/>
            Prototype: hole positions and press-fit depths need checking against the kit.
          </div>
        }
        tools={
          <div className="flex gap-1.5">
            <Button type="button" variant="outline" title="Reset camera" aria-label="Reset 3D camera"
              className="size-11 rounded-xl bg-white/95 p-0" onClick={() => setCameraKey(n => n + 1)}>
              <ScanSearch aria-hidden="true" className="size-4"/>
            </Button>
            <Button type="button" variant="outline" title="Show PDF instructions" aria-label="Toggle instructions"
              aria-expanded={manualShown} className="size-11 rounded-xl bg-white/95 p-0"
              onClick={() => setManualShown(x => !x)}>
              <BookOpen aria-hidden="true" className="size-4"/>
            </Button>
            <Button type="button" variant="outline" title="Restart current step" aria-label="Restart current step"
              className="size-11 rounded-xl bg-white/95 p-0" onClick={restart}>
              <RotateCcw aria-hidden="true" className="size-4"/>
            </Button>
          </div>
        }
        dock={
          <div className="space-y-2.5">
            <AssemblyActionCard actionIndex={phase} actionCount={actions.length}
              title={instruction.title} instruction={instruction.instruction} note={instruction.direction}/>
            <section aria-label="Connection details" className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs leading-5 text-[#132654]">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {instruction.sourceHole && <span><strong>Source:</strong> {instruction.sourceHole}</span>}
                {instruction.targetHole && <span><strong>Target:</strong> {instruction.targetHole}</span>}
                {instruction.connector && <span><strong>Part:</strong> {instruction.connector}</span>}
              </div>
              <p className="mt-1"><strong>Check:</strong> {instruction.check}</p>
              <p className="mt-1 flex items-start gap-1 font-semibold text-amber-800">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0"/>
                Teaching labels only — actual hole centers and seating depth remain unverified.
              </p>
            </section>
            {manualShown && (
              <p className="rounded-lg bg-sky-50 p-2 text-xs leading-5 text-slate-700">
                {MANUAL_DETAILS[step - 1]}
              </p>
            )}
            <div aria-live="polite" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <CheckCircle2 aria-hidden="true" className={`size-4 ${motionComplete ? "text-emerald-500" : "text-slate-300"}`}/>
              {motionComplete ? "Movement finished — inspect the connection." :
                paused ? "Paused — resume to continue." : "Watch the component align and seat."}
            </div>
            <AssemblyPlaybackControls
              onPrevious={previousAction} previousDisabled={phase === 0}
              onReplay={replay} onTogglePause={() => setPaused(x => !x)}
              paused={paused} pauseDisabled={motionComplete}
              onNext={nextAction} nextDisabled={!motionComplete}
              isFinalAction={lastAction} onComplete={() => motionComplete && onCompleteStep()}
              completeDisabled={!motionComplete}
              nextLabel="Next Action"
            />
          </div>
        }
      />
      <p className="px-1 text-center text-[11px] leading-4 text-slate-500">
        Drag to rotate · Pinch or scroll to zoom · Use Previous Action to review. Previously connected parts remain in place.
      </p>
    </div>
  );
}
