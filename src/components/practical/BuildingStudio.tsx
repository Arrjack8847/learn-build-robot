import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronUp, List, Sparkles, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

/**
 * Universal BE STEM READY Building Studio. No assumptions about levels, categories,
 * robot geometry or manual contents: every project supplies its own steps and viewer.
 */
export function BuildingStudioHeader({
  title, step, total, onOpenSteps, onPreviousStep, previousDisabled = false, positionLabel,
}: {
  title: string; step: number; total: number; onOpenSteps: () => void;
  onPreviousStep?: () => void; previousDisabled?: boolean; positionLabel?: string;
}) {
  const progress = total ? Math.max(0, Math.min(100, step / total * 100)) : 0;
  return (
    <div className="relative z-20 shrink-0 border-b border-sky-100 bg-white/95 text-slate-800">
      <header className="mx-auto flex h-14 w-full max-w-[1720px] items-center gap-2 px-3 sm:h-16 sm:px-5">
        <Link to="/practical" aria-label="Back to robot selection"
          className="flex min-h-11 shrink-0 items-center gap-1 rounded-2xl border border-sky-100 bg-white px-3 text-sm font-bold text-[#168eea] shadow-sm transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
          <ArrowLeft className="size-4" aria-hidden="true" /><span className="hidden sm:inline">Robots</span>
        </Link>
        {onPreviousStep && <Button type="button" variant="outline" disabled={previousDisabled} onClick={onPreviousStep}
          aria-label="Previous building step" className="min-h-11 shrink-0 rounded-2xl border-sky-100 px-2 font-bold text-[#168eea] sm:px-3">
          <ChevronLeft className="size-4"/><span className="hidden md:inline">Previous step</span>
        </Button>}
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center">
          <p className="max-w-full truncate text-[15px] font-extrabold tracking-tight text-slate-800 sm:text-lg">{title}</p>
          <p className="text-[11px] font-bold text-[#168eea]">{positionLabel ?? (step ? `Step ${step} of ${total}` : "Manual cover")}</p>
        </div>
        <Button type="button" variant="outline" aria-label="Choose a building step" onClick={onOpenSteps}
          className="min-h-11 shrink-0 gap-1 rounded-2xl border-sky-100 px-3 font-bold text-[#168eea] shadow-sm hover:bg-sky-50">
          <List className="size-4" aria-hidden="true"/><span className="hidden min-[390px]:inline">Steps</span>
        </Button>
      </header>
      <div role="progressbar" aria-label="Building step position" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}
        className="h-1.5 w-full bg-[#eaf5ff]">
        <div className="h-full rounded-r-full bg-[#168eea] transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export type BuildingStepItem = { id: string; label: string; completed?: boolean };

export function BuildingStepDrawer({
  open, onOpenChange, title, items, activeIndex, onSelect,
}: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string;
  items: BuildingStepItem[]; activeIndex: number; onSelect: (index: number) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-auto right-0 top-0 h-[100dvh] w-full max-w-sm translate-x-0 translate-y-0 overflow-hidden rounded-none border-l border-sky-100 bg-white p-0 shadow-2xl sm:rounded-l-3xl [&>button]:hidden">
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-sky-100 px-5 py-4">
            <div className="min-w-0">
              <DialogTitle className="text-lg font-extrabold text-slate-800">Choose a step</DialogTitle>
              <DialogDescription className="mt-1 truncate text-xs text-slate-500">{title} · {items.length} pages or steps</DialogDescription>
            </div>
            <Button type="button" aria-label="Close step list" variant="outline" onClick={() => onOpenChange(false)}
              className="size-11 rounded-2xl border-sky-100 p-0"><X className="size-5"/></Button>
          </div>
          <nav aria-label="Building steps" className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain px-3 py-4">
            {items.map((item, index) => (
              <button key={item.id} type="button"
                aria-current={index === activeIndex ? "step" : undefined}
                onClick={() => { onSelect(index); onOpenChange(false); }}
                className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-[#168eea] ${index === activeIndex ? "border-[#168eea] bg-[#eaf5ff] text-[#0877ca]" : "border-transparent bg-slate-50 text-slate-700 hover:bg-sky-50"}`}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-xl text-xs font-extrabold ${index === activeIndex ? "bg-[#168eea] text-white" : item.completed ? "bg-green-100 text-green-700" : "bg-white text-slate-600"}`}>
                  {item.completed ? <Check className="size-4" aria-label="Complete"/> : index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Place inside a relative viewer, with the viewer reserving space beneath it. */
export function BuildingFloatingDock({
  label, instruction, expanded, onExpandedChange, onPrevious, onNext,
  previousDisabled = false, nextDisabled = false, nextLabel = "Done & Next",
  details, children,
}: {
  label: string; instruction: string; expanded: boolean;
  onExpandedChange: (value: boolean) => void; onPrevious: () => void; onNext: () => void;
  previousDisabled?: boolean; nextDisabled?: boolean; nextLabel?: string;
  details?: ReactNode; children?: ReactNode;
}) {
  return (
    <section aria-label="Building guidance and navigation"
      className="absolute inset-x-2 bottom-[max(8px,env(safe-area-inset-bottom))] z-10 mx-auto max-w-[680px] rounded-[22px] border border-sky-100 bg-white/98 p-2.5 shadow-[0_10px_35px_rgba(50,110,155,0.17)] backdrop-blur-sm sm:inset-x-4 sm:p-3">
      <div className="flex min-w-0 items-center gap-2 px-1 pb-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eaf5ff] text-lg" aria-hidden="true">🧩</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-slate-800">{label}</p>
          {!expanded && <p className="truncate text-xs leading-5 text-slate-600">{instruction}</p>}
        </div>
        <Button type="button" variant="outline" aria-label={expanded ? "Collapse instructions" : "Expand instructions"}
          aria-expanded={expanded} onClick={() => onExpandedChange(!expanded)}
          className="size-11 shrink-0 rounded-2xl border-sky-100 p-0 text-[#168eea]">
          {expanded ? <ChevronDown className="size-5"/> : <ChevronUp className="size-5"/>}
        </Button>
      </div>
      {expanded && (
        <div className="max-h-[min(30dvh,230px)] overflow-y-auto overscroll-contain rounded-xl bg-[#f5faff] px-3 py-2.5 text-sm leading-6 text-slate-700">
          <p>{instruction}</p>{details}{children}
        </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-2">
        <Button type="button" variant="outline" onClick={onPrevious} disabled={previousDisabled}
          className="min-h-12 min-w-0 rounded-2xl border-sky-200 px-2 text-xs font-extrabold text-[#168eea] sm:text-sm">
          <ChevronLeft className="size-4 shrink-0"/>Previous
        </Button>
        <Button type="button" onClick={onNext} disabled={nextDisabled}
          className="min-h-12 min-w-0 rounded-2xl bg-[#168eea] px-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#0d7fda] sm:text-sm">
          {nextLabel}<ArrowRight className="size-4 shrink-0"/>
        </Button>
      </div>
    </section>
  );
}

export function BuildingStudioCompletion({
  title, onReview, children, mode = "building",
}: {
  title: string; onReview: () => void; children?: ReactNode; mode?: "building" | "presentation";
}) {
  return (
    <div className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-gradient-to-b from-[#eaf5ff] to-white px-4 py-10 text-center">
      <div className="pointer-events-none absolute left-[8%] top-[12%] text-3xl" aria-hidden="true">⭐</div>
      <div className="pointer-events-none absolute right-[10%] bottom-[16%] text-3xl" aria-hidden="true">✨</div>
      <div className="relative w-full max-w-md rounded-[32px] border border-sky-100 bg-white px-6 py-8 shadow-[0_16px_48px_rgba(22,142,234,.12)]">
        <div className="mx-auto grid size-20 place-items-center rounded-[26px] bg-amber-100 text-amber-500">
          <Trophy className="size-11" aria-hidden="true"/>
        </div>
        <Sparkles className="mx-auto mt-4 size-6 text-[#f5a400]" aria-hidden="true"/>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Amazing work!</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{mode === "presentation" ? `You finished reviewing the ${title} slides. You can now choose a building lesson.` : `You finished building ${title}. Ready for your next adventure?`}</p>
        <div className="mt-6 flex flex-col gap-2">
          {children ?? <Button asChild className="min-h-12 rounded-2xl bg-[#168eea] font-bold"><Link to="/practical">Choose another robot <ArrowRight className="size-4"/></Link></Button>}
          <Button type="button" variant="outline" onClick={onReview} className="min-h-12 rounded-2xl border-sky-200 font-bold text-[#168eea]">{mode === "presentation" ? "Review slides" : "Review building steps"}</Button>
        </div>
      </div>
    </div>
  );
}
