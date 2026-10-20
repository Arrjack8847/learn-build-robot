import { useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, Eye, Maximize2, Pause, Play, RotateCcw, ScanSearch, SkipBack, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shared, full-width learning stage; geometry and lesson state stay with each step. */
export function AssemblyStage({ scene, dock, tools, status }: {
  scene: ReactNode; dock: ReactNode; tools?: ReactNode; status?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section data-dock-expanded={expanded} className="assembly-lesson-stage" aria-label="Interactive robot assembly">
      <div className="assembly-lesson-canvas">{scene}</div>
      {status && <div className="assembly-lesson-status">{status}</div>}
      {tools && <div className="assembly-lesson-tools">{tools}</div>}
      <div className="assembly-lesson-dock-wrapper">
        <div className="assembly-lesson-dock">
          <div className="mb-1 flex justify-end">
            <Button type="button" variant="ghost" aria-expanded={expanded}
              aria-label={expanded ? "Collapse instructions" : "Expand instructions"}
              onClick={() => setExpanded(value => !value)}
              className="min-h-8 gap-1 rounded-xl px-2 text-[11px] font-bold text-[#168eea]">
              {expanded ? "Less" : "More"} instructions
              {expanded ? <ChevronDown className="size-3.5"/> : <ChevronUp className="size-3.5"/>}
            </Button>
          </div>
          {dock}
        </div>
      </div>
    </section>
  );
}

export function AssemblyLessonHeader({
  step, title, actionIndex, actionCount, trailing,
}: {
  step: number; title: string; actionIndex?: number | undefined;
  actionCount?: number | undefined; trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1">
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.13em] text-[#116eaf]">
          Marksmanship Robot · Step {step} of 32
        </p>
        <p className="mt-0.5 text-sm font-extrabold text-[#132654] sm:text-lg">{title}</p>
      </div>
      <div className="flex items-center gap-2">
        {actionCount !== undefined && actionIndex !== undefined && (
          <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-bold text-[#116eaf]">
            Action {actionIndex + 1} of {actionCount}
          </span>
        )}
        {trailing}
      </div>
    </div>
  );
}

export function AssemblyActionCard({
  actionIndex, actionCount, title, instruction, note,
}: {
  actionIndex: number; actionCount: number; title: string;
  instruction: string; note?: string | undefined;
}) {
  return (
    <div aria-live="polite" aria-atomic="true" className="assembly-action-card space-y-1 text-left">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#116eaf]">
          Action {actionIndex + 1} of {actionCount}
        </span>
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: Math.min(actionCount, 12) }, (_, index) => (
            <span key={index} className={`h-1.5 rounded-full transition-all ${index === actionIndex ? "w-3.5 bg-[#168eea]" : index < actionIndex ? "w-1.5 bg-sky-400" : "w-1.5 bg-slate-200"}`} />
          ))}
        </div>
      </div>
      <h2 className="text-sm font-extrabold leading-5 text-[#132654] sm:text-base">{title}</h2>
      <p className="text-sm leading-5 text-slate-700">{instruction}</p>
      {note && <p className="text-[11px] leading-4 text-slate-500">{note}</p>}
    </div>
  );
}

export function AssemblyPlaybackControls({
  onPrevious, onReplay, onTogglePause, onNext,
  paused, previousDisabled = false, replayDisabled = false,
  pauseDisabled = false, nextDisabled = false, nextLabel = "Next Action",
  isFinalAction = false, onComplete, completeDisabled = false,
}: {
  onPrevious: () => void; onReplay: () => void; onTogglePause: () => void;
  onNext: () => void; paused: boolean;
  previousDisabled?: boolean; replayDisabled?: boolean; pauseDisabled?: boolean;
  nextDisabled?: boolean; nextLabel?: string; replayLabel?: string;
  isFinalAction?: boolean; onComplete?: (() => void) | undefined; completeDisabled?: boolean;
}) {
  return (
    <nav aria-label="3D action playback" className="flex w-full items-center gap-1.5 border-t border-slate-100 pt-2 sm:gap-2">
      <Button title="Previous action" aria-label="Previous action" type="button" variant="ghost"
        className="min-h-11 min-w-11 rounded-xl px-2" disabled={previousDisabled} onClick={onPrevious}>
        <SkipBack aria-hidden="true" className="size-4.5" /><span className="sr-only">Previous</span>
      </Button>
      <Button title="Replay current action" aria-label="Replay current action" type="button" variant="ghost"
        className="min-h-11 min-w-11 rounded-xl px-2" disabled={replayDisabled} onClick={onReplay}>
        <RotateCcw aria-hidden="true" className="size-4.5" /><span className="sr-only">Replay</span>
      </Button>
      <Button title={paused ? "Resume" : "Pause"} aria-label={paused ? "Resume" : "Pause"} type="button" variant="ghost"
        className="min-h-11 min-w-11 rounded-xl px-2" disabled={pauseDisabled} onClick={onTogglePause}>
        {paused ? <Play aria-hidden="true" className="size-4.5" /> : <Pause aria-hidden="true" className="size-4.5" />}
      </Button>
      <Button type="button" className="ml-auto min-h-11 min-w-0 flex-1 rounded-xl bg-[#168eea] px-2 text-xs font-extrabold text-white hover:bg-[#0e82dd] sm:flex-none sm:px-5 sm:text-sm"
        disabled={isFinalAction ? completeDisabled : nextDisabled}
        onClick={isFinalAction ? onComplete : onNext}>
        <span className="hidden sm:inline">{isFinalAction ? "Complete Step" : nextLabel}</span>
        <span className="sm:hidden">{isFinalAction ? "Complete" : "Next"}</span>
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </nav>
  );
}

export function AssemblyUtilityControls({
  step, onResetView, onToggleManual, onRestart, manualShown,
}: {
  step: number; onResetView: () => void; onToggleManual: () => void;
  onRestart: () => void; manualShown: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1" aria-label="3D viewer tools">
      <Button title="Reset camera" aria-label="Reset view" className="min-h-11 rounded-xl bg-white/95 px-3 shadow-sm" type="button" variant="outline" onClick={onResetView}>
        <ScanSearch aria-hidden="true" className="size-4" /> <span className="hidden sm:inline">Reset view</span>
      </Button>
      <Button title="View original instructions (retained during development)" className="min-h-11 rounded-xl bg-white/95 px-3 shadow-sm" type="button" variant="outline" onClick={onToggleManual}
        aria-expanded={manualShown}>
        <BookOpen aria-hidden="true" className="size-4" /> <span className="hidden sm:inline">{manualShown ? "Hide" : "View"} manual</span>
      </Button>
      <Button title={`Restart Step ${step}`} aria-label={`Restart Step ${step}`} className="min-h-11 rounded-xl bg-white/95 px-3 shadow-sm" type="button" variant="outline" onClick={onRestart}>
        <RotateCcw aria-hidden="true" className="size-4" /> <span className="sr-only">Restart Step {step}</span>
      </Button>
    </div>
  );
}
