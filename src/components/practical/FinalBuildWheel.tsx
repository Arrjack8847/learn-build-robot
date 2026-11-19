import { useEffect, useState } from "react";
import { LEVEL_ONE_CATEGORIES } from "@/data/levelOneCategories";
import { getLevelOneProjects } from "@/data/levelOneProjects";

const COLORS = [
  "#BFE8FF", "#C9F0D3", "#FFD4E7", "#FFE9A6", "#C6DDFC",
  "#FFE3AB", "#EAD4FF", "#C9F0E3", "#B8E5FF", "#FFD6E9",
  "#FFEAA9", "#D8F3CA", "#CCD7FF", "#FFD9C2",
] as const;
const SHORT_NAMES = [
  "Navigation", "Animals", "Characters", "Display", "Robots",
  "Lights", "Interactive", "Machines", "Arms", "Simulators",
  "Mechanisms", "Sensors", "Vehicles", "Motion",
] as const;
const EMOJI = [
  "📡", "🐾", "🤖", "🖥️", "🦾", "💡", "🎮", "⚙️",
  "🛠️", "🎡", "🧩", "📟", "🏍️", "🚗",
] as const;

const categories = LEVEL_ONE_CATEGORIES.map((category, i) => ({
  id: category.id,
  name: category.name,
  label: SHORT_NAMES[i],
  icon: EMOJI[i],
  count: getLevelOneProjects(category.id).length,
  color: COLORS[i],
}));
const projectCount = categories.reduce((sum, item) => sum + item.count, 0);

function point(angle: number, radius: number) {
  const radians = angle * Math.PI / 180;
  return { x: 200 + radius * Math.sin(radians), y: 200 - radius * Math.cos(radians) };
}
function wedge(start: number, end: number) {
  const a = point(start, 180);
  const b = point(end, 180);
  return "M 200 200 L " + a.x + " " + a.y + " A 180 180 0 " +
    (end - start > 180 ? 1 : 0) + " 1 " + b.x + " " + b.y + " Z";
}
const sectors = (() => {
  let cursor = 0;
  return categories.map(item => {
    const start = cursor * 360 / projectCount;
    cursor += item.count;
    return { ...item, start, end: cursor * 360 / projectCount };
  });
})();

type Props = {
  spinning: boolean;
  targetRotation: number | null;
  finishAt: number | null;
  onFinish: () => void;
};

export function FinalBuildWheel({ spinning, targetRotation, finishAt, onFinish }: Props) {
  const [angle, setAngle] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [duration, setDuration] = useState(5200);

  useEffect(() => {
    if (!spinning || targetRotation === null || finishAt === null) return;
    const remaining = Math.max(0, finishAt - Date.now());
    if (remaining === 0 || (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      setAngle(targetRotation);
      onFinish();
      return;
    }
    setDuration(remaining);
    setAnimated(false);
    setAngle(0);
    // Two frames ensure the browser paints the stationary wheel before rotating.
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setAnimated(true);
        setAngle(targetRotation);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [spinning, targetRotation, finishAt, onFinish]);

  return (
    <div className="mx-auto w-full max-w-[min(350px,43dvh)]">
      <div className="relative mx-auto aspect-square w-full">
        <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible drop-shadow-[0_10px_12px_rgba(42,108,152,0.18)]"
          role="img" aria-label="Colorful spinning wheel with 59 equally sized project spaces across 14 STEM categories">
          <g style={{
            transform: "rotate(" + angle + "deg)",
            transformOrigin: "200px 200px",
            transition: animated ? "transform " + duration + "ms cubic-bezier(0.12, 0.72, 0.12, 1)" : "none",
          }} onTransitionEnd={event => { if (event.propertyName === "transform" && spinning) onFinish(); }}>
            <circle cx="200" cy="200" r="187" fill="#fff" stroke="#93D3F3" strokeWidth="5" />
            {sectors.map(item => (
              <path key={item.id} d={wedge(item.start, item.end)} fill={item.color} stroke="#ffffff" strokeWidth="2" />
            ))}
            {/* Each radial boundary marks one of the 59 equally likely projects. */}
            {Array.from({ length: projectCount }, (_, i) => {
              const p = point(i * 360 / projectCount, 180);
              const inner = point(i * 360 / projectCount, 159);
              return <line key={i} x1={inner.x} y1={inner.y} x2={p.x} y2={p.y}
                stroke="#ffffff" strokeOpacity=".8" strokeWidth="1.7" />;
            })}
            {sectors.map(item => {
              const middle = (item.start + item.end) / 2;
              const iconPosition = point(middle, item.count >= 5 ? 118 : 145);
              const labelPosition = point(middle, 143);
              return (
                <g key={item.id}>
                  {item.count >= 3 && (
                    <text x={iconPosition.x} y={iconPosition.y} fontSize={item.count >= 5 ? "21" : "14"}
                      textAnchor="middle" dominantBaseline="middle">{item.icon}</text>
                  )}
                  {item.count >= 5 && (
                    <text x={labelPosition.x} y={labelPosition.y} fontSize="10" fontWeight="800"
                      textAnchor="middle" dominantBaseline="middle" fill="#334155">{item.label}</text>
                  )}
                </g>
              );
            })}
            <circle cx="200" cy="200" r="69" fill="#ffffff" stroke="#ffffff" strokeWidth="5" />
            <circle cx="200" cy="200" r="61" fill="#F0F9FF" stroke="#86CCF2" strokeWidth="3" />
            <text x="200" y="189" textAnchor="middle" fontSize="31" fontWeight="900" fill="#127DC3">59</text>
            <text x="200" y="210" textAnchor="middle" fontSize="12" fontWeight="900" fill="#127DC3">ROBOTS</text>
            <text x="200" y="227" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748B">LEVEL 1</text>
          </g>
          {/* Fixed pointer: whichever segment finishes here is the chosen project. */}
          <path d="M 200 23 L 184 0 L 216 0 Z" fill="#EC5676" stroke="#ffffff" strokeWidth="3" />
          <circle cx="200" cy="6" r="5" fill="#ffffff" />
        </svg>
      </div>
      <p className="mt-1 text-center text-xs font-bold text-sky-800" aria-live="polite">
        {spinning ? "Round and round… let's see your robot!" : "14 STEM worlds · 59 robot challenges"}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-1.5"
        aria-label="Wheel category colors and names">
        {categories.map(item => (
          <div key={item.id} className="flex items-center gap-1 rounded-xl bg-slate-50 px-1.5 py-1 text-left">
            <span className="grid size-6 shrink-0 place-items-center rounded-lg text-xs"
              style={{ backgroundColor: item.color }} aria-hidden="true">{item.icon}</span>
            <span className="truncate text-[10px] font-bold text-slate-700" title={item.name}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
