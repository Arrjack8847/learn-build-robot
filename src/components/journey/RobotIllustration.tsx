import { Cog, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";

const palettes = [
  { chassis: "#168eea", head: "#72b846", module: "#f5a400", accent: "#ec168c" },
  { chassis: "#f5a400", head: "#168eea", module: "#39b54a", accent: "#ec168c" },
  { chassis: "#39b54a", head: "#f5a400", module: "#168eea", accent: "#ec168c" },
] as const;

export function RobotIllustration({
  variant = 0,
  className,
}: {
  variant?: number;
  className?: string;
}) {
  const palette = palettes[variant % palettes.length] ?? palettes[0];

  return (
    <div
      aria-label="Friendly build illustration of the robot project"
      className={cn(
        "relative grid min-h-52 place-items-center overflow-hidden rounded-[2rem] bg-[#168eea] sm:min-h-64",
        className,
      )}
      role="img"
    >
      <div aria-hidden="true" className="circuit-grid absolute inset-0 opacity-35" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.24),transparent_42%)]" />

      <Cog aria-hidden="true" className="absolute left-[7%] top-[14%] size-12 text-white/30 sm:size-16" strokeWidth={1.6} />
      <Cog aria-hidden="true" className="absolute bottom-[10%] right-[8%] size-10 text-[#9bd44d]/80 sm:size-14" strokeWidth={2} />
      <Cog aria-hidden="true" className="absolute bottom-[9%] left-[9%] size-9 text-[#f5a400] sm:size-12" strokeWidth={2.2} />

      <span className="absolute right-4 top-4 grid size-12 place-items-center rounded-[18px] bg-[#f5a400] text-white shadow-[0_10px_24px_rgba(245,164,0,0.35)] sm:right-6 sm:top-5 sm:size-14 sm:rounded-[20px]">
        <Lightbulb className="size-6 sm:size-7" />
      </span>

      <div aria-hidden="true" className="relative h-[150px] w-[270px] max-w-[88%] sm:h-[190px] sm:w-[340px]">
        <div className="absolute bottom-8 left-[16%] right-[16%] h-[62px] rounded-[24px] border-4 border-white/80 shadow-[0_18px_28px_rgba(12,49,103,0.24)]" style={{ backgroundColor: palette.chassis }} />

        <div className="absolute bottom-[48px] left-[25%] h-8 w-[50%] rounded-xl border-[3px] border-white/80 bg-white/85" />
        <div className="absolute bottom-[55px] left-[32%] h-3 w-[10%] rounded-full" style={{ backgroundColor: palette.module }} />
        <div className="absolute bottom-[55px] right-[32%] h-3 w-[10%] rounded-full" style={{ backgroundColor: palette.accent }} />

        <div className="absolute bottom-[78px] left-1/2 h-[62px] w-[90px] -translate-x-1/2 rounded-[24px] border-4 border-white/85 shadow-[0_10px_22px_rgba(12,49,103,0.22)] sm:h-[72px] sm:w-[106px]" style={{ backgroundColor: palette.head }}>
          <span className="absolute left-[23%] top-[40%] size-3 rounded-full bg-white shadow-inner sm:size-3.5" />
          <span className="absolute right-[23%] top-[40%] size-3 rounded-full bg-white shadow-inner sm:size-3.5" />
        </div>

        <div className="absolute bottom-[22px] left-[5%] size-[62px] rounded-full border-[11px] border-[#132654] bg-white shadow-[0_8px_16px_rgba(19,38,84,0.22)] sm:size-[78px] sm:border-[13px]" />
        <div className="absolute bottom-[22px] right-[5%] size-[62px] rounded-full border-[11px] border-[#132654] bg-white shadow-[0_8px_16px_rgba(19,38,84,0.22)] sm:size-[78px] sm:border-[13px]" />

        <div className="absolute bottom-2 left-1/2 h-4 w-[36%] -translate-x-1/2 rounded-full bg-[#0d4f98]/35 blur-[2px]" />
      </div>
    </div>
  );
}
