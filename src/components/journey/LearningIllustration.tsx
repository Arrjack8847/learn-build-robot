import {
  Bot,
  CircuitBoard,
  Code2,
  Cog,
  Lightbulb,
  Radar,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const topicIcons: Record<string, LucideIcon> = {
  Bot,
  ShieldCheck,
  CircuitBoard,
  Radar,
  Cog,
  Code2,
};

const accentClasses = [
  "bg-primary text-primary-foreground",
  "bg-success text-success-foreground",
  "bg-warning text-warning-foreground",
  "bg-chart-5 text-primary-foreground",
] as const;

export function LearningIllustration({
  icon,
  variant = 0,
  className,
}: {
  icon: string;
  variant?: number;
  className?: string;
}) {
  const Icon = topicIcons[icon] ?? Lightbulb;
  const accent = accentClasses[variant % accentClasses.length] ?? accentClasses[0];

  return (
    <div
      aria-label="Illustration for this robotics learning topic"
      className={cn(
        "relative grid min-h-52 place-items-center overflow-hidden rounded-[2rem] bg-primary-soft sm:min-h-64",
        className,
      )}
      role="img"
    >
      <div aria-hidden="true" className="circuit-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden="true"
        className={cn(
          "relative grid size-32 place-items-center rounded-[2.25rem] shadow-lift sm:size-40 sm:rounded-[2.75rem]",
          accent,
        )}
      >
        <Icon className="size-16 sm:size-20" strokeWidth={1.5} />
        <span className="absolute -right-3 -top-3 grid size-12 place-items-center rounded-2xl bg-card text-warning shadow-card">
          <Lightbulb className="size-6" />
        </span>
      </div>
    </div>
  );
}
