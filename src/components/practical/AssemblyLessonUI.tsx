import type { ReactNode } from "react";
import { ArrowRight, Eye, Pause, Play, RotateCcw, ScanSearch, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shared student-facing presentation for Marksmanship Steps 1–7.
 * Keep geometry, playback state and physical verification in each lesson.
 */
export function AssemblyLessonHeader({
  step, title, actionIndex, actionCount, hint = "Drag to orbit · pinch to zoom", trailing,
}: {
  step: number; title: string; actionIndex?: number; actionCount?: number;
  hint?: string; trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1">
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.13em] text-[#116eaf]">
          Step {step} · Interactive 3D
        </p>
        <p className="mt-0.5 text-sm font-extrabold text-[#132654] sm:text-base">{title}</p>
        {actionCount !== undefined && actionIndex !== undefined && (
          <p className="mt-0.5 text-xs font-semibold text-slate-600" aria-label={`Action ${actionIndex + 1} of ${actionCount}`}>
            Action {actionIndex + 1} of {actionCount}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
          <Eye aria-hidden="true" className="size-3.5" />
          {hint}
        </span>
        {trailing}
      </div>
    </div>
  );
}

export function AssemblyActionCard({
  actionIndex, actionCount, title, instruction, note,
}: {
  actionIndex: number; actionCount: number; title: string;
  instruction: string; note?: string;
}) {
  return (
    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-sky-100 bg-white p-3.5 text-left shadow-sm sm:p-4">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf5ff] text-sm font-black text-[#116eaf]">
          {actionIndex + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#116eaf]">
            Action {actionIndex + 1} of {actionCount}
          </p>
          <h3 className="mt-0.5 text-base font-extrabold leading-snug text-[#132654]">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-700">{instruction}</p>
          {note && <p className="mt-2 text-xs leading-5 text-slate-600">{note}</p>}
        </div>
      </div>
    </section>
  );
}

export function AssemblyPlaybackControls({
  onPrevious, onReplay, onTogglePause, onNext,
  paused, previousDisabled = false, replayDisabled = false,
  pauseDisabled = false, nextDisabled = false, nextLabel = "Next action",
}: {
  onPrevious: () => void; onReplay: () => void; onTogglePause: () => void;
  onNext: () => void; paused: boolean;
  previousDisabled?: boolean; replayDisabled?: boolean; pauseDisabled?: boolean;
  nextDisabled?: boolean; nextLabel?: string;
}) {
  return (
    <nav aria-label="3D action playback" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
      <Button type="button" variant="outline" className="min-h-11 rounded-xl px-2 sm:px-4"
        disabled={previousDisabled} onClick={onPrevious}>
        <SkipBack aria-hidden="true" /> <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Back</span>
      </Button>
      <Button type="button" variant="outline" className="min-h-11 rounded-xl px-2 sm:px-4"
        disabled={replayDisabled} onClick={onReplay}>
        <RotateCcw aria-hidden="true" /> Replay
      </Button>
      <Button type="button" variant="outline" className="min-h-11 rounded-xl px-2 sm:px-4"
        disabled={pauseDisabled} onClick={onTogglePause}>
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        {paused ? "Resume" : "Pause"}
      </Button>
      <Button type="button" className="col-span-3 min-h-11 rounded-xl bg-[#168eea] px-5 font-bold text-white hover:bg-[#0e82dd] sm:ml-auto"
        disabled={nextDisabled} onClick={onNext}>
        {nextLabel} <ArrowRight aria-hidden="true" />
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
    <div className="flex flex-wrap gap-2" aria-label="3D viewer tools">
      <Button className="min-h-11 rounded-xl" type="button" variant="ghost" onClick={onResetView}>
        <ScanSearch aria-hidden="true" /> Reset view
      </Button>
      <Button className="min-h-11 rounded-xl" type="button" variant="ghost" onClick={onToggleManual}
        aria-expanded={manualShown}>
        <Eye aria-hidden="true" /> {manualShown ? "Hide" : "View"} manual
      </Button>
      <Button className="min-h-11 rounded-xl" type="button" variant="ghost" onClick={onRestart}>
        <RotateCcw aria-hidden="true" /> Restart Step {step}
      </Button>
    </div>
  );
}
