import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

export function SyllabusHeader({ label = "Back to levels", level }: {
  label?: string;
  level?: number;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/95 px-3 backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3">
        <Link to={level ? "/practical/levels" : "/choose"} aria-label={label}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-3 text-sm font-bold text-[#168eea] shadow-sm hover:bg-[#eaf5ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]">
          <ArrowLeft className="size-5" aria-hidden="true"/>
          <span className="hidden sm:inline">{label}</span>
        </Link>
        <img alt="BE STEM READY" src="/home/be-stem-ready-logo.svg" className="h-11 w-auto max-w-[42%] object-contain sm:h-12"/>
        <div className="flex min-h-10 shrink-0 items-center gap-1 rounded-full bg-[#eaf5ff] px-3 text-xs font-extrabold text-[#168eea] sm:text-sm">
          <Sparkles className="size-4" aria-hidden="true" />
          {level ? `Level ${level} / 6` : "6 Levels"}
        </div>
      </div>
    </header>
  );
}
