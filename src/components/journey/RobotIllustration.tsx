import { cn } from "@/lib/utils";

const accentClasses = [
  "bg-primary",
  "bg-success",
  "bg-warning",
  "bg-chart-5",
] as const;

export function RobotIllustration({
  variant = 0,
  className,
}: {
  variant?: number;
  className?: string;
}) {
  const accent = accentClasses[variant % accentClasses.length] ?? accentClasses[0];

  return (
    <div
      aria-label="Friendly illustration of the robot project"
      className={cn(
        "relative grid min-h-52 place-items-center overflow-hidden rounded-[2rem] bg-primary-soft sm:min-h-64",
        className,
      )}
      role="img"
    >
      <div aria-hidden="true" className="circuit-grid absolute inset-0 opacity-60" />
      <div aria-hidden="true" className="relative h-44 w-72 max-w-[82%] sm:h-52 sm:w-80">
        <div
          className={cn(
            "absolute bottom-10 left-[10%] right-[10%] h-20 rounded-[1.75rem] shadow-lift sm:h-24",
            accent,
          )}
        />
        <div className="absolute bottom-24 left-[35%] h-16 w-[30%] rounded-2xl bg-success shadow-card sm:bottom-28 sm:h-20">
          <span className="absolute left-[22%] top-[42%] size-2.5 rounded-full bg-card" />
          <span className="absolute right-[22%] top-[42%] size-2.5 rounded-full bg-card" />
        </div>
        <div className="absolute bottom-0 left-[2%] size-20 rounded-full border-[0.8rem] border-foreground bg-card sm:size-24" />
        <div className="absolute bottom-0 right-[2%] size-20 rounded-full border-[0.8rem] border-foreground bg-card sm:size-24" />
        {variant >= 1 ? (
          <div className="absolute left-1/2 top-0 h-12 w-20 -translate-x-1/2 rounded-2xl bg-card shadow-card">
            <span className="absolute left-3 top-4 size-3 rounded-full bg-primary" />
            <span className="absolute right-3 top-4 size-3 rounded-full bg-primary" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
