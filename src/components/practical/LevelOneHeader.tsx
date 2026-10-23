import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

export const categoryTones = {
  blue: { panel: "#eaf5ff", ink: "#168eea", border: "#cce6fb" },
  green: { panel: "#ebf9ed", ink: "#259a41", border: "#d0efd6" },
  yellow: { panel: "#fff5dc", ink: "#b47a00", border: "#fce5a4" },
  pink: { panel: "#fff0f8", ink: "#d4217f", border: "#fad2e7" },
} as const;

export function LevelOneHeader({ backTo, backLabel = "Back" }: {
  backTo: "/practical/levels" | "/practical/level-1";
  backLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/95 px-3 backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3">
        <Link to={backTo} aria-label={backLabel}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-3 text-sm font-bold text-[#168eea] shadow-sm transition hover:bg-[#eaf5ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
          <ArrowLeft className="size-5" aria-hidden="true"/>
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
        <img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-11 w-auto max-w-[42%] object-contain sm:h-12" />
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#eaf5ff] px-3 py-2 text-xs font-extrabold text-[#168eea] sm:text-sm">
          <Sparkles aria-hidden="true" className="size-4" />
          Level 1 <span className="font-medium text-slate-500">/ 6</span>
        </span>
      </div>
    </header>
  );
}

export function LevelOneBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-20 top-[12%] size-64 rounded-full bg-sky-100/50 blur-3xl"/>
      <div className="absolute -right-20 top-[40%] size-60 rounded-full bg-pink-100/40 blur-3xl"/>
      <div className="absolute bottom-0 left-[25%] size-52 rounded-full bg-amber-100/30 blur-3xl"/>
    </div>
  );
}
