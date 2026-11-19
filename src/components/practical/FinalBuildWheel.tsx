import { useEffect, useState } from "react";
import { LEVEL_ONE_CATEGORIES } from "@/data/levelOneCategories";
import { getLevelOneProjects } from "@/data/levelOneProjects";

// A visible category gets one color, but every project has its OWN equally-sized slot.
const COLORS = [
  "#FF79A8", "#6AE0B7", "#A991FC", "#FFC85E", "#79B9FF",
  "#FFE17A", "#FF9185", "#68D7EF", "#FFB675", "#B1DEFF",
  "#EE9EE8", "#95E48E", "#9EBDFF", "#FFC08C",
] as const;
const ICONS = ["📡", "🐾", "🤖", "🖥️", "🦾", "💡", "🎮", "⚙️", "🛠️", "🎡", "🧩", "📟", "🏍️", "🚗"] as const;

const categories = LEVEL_ONE_CATEGORIES.map((category, i) => ({
  id: category.id,
  color: COLORS[i],
  icon: ICONS[i],
  count: getLevelOneProjects(category.id).length,
}));
const projectCount = categories.reduce((n, c) => n + c.count, 0);
const CENTER = 220;
const RADIUS = 193;

function point(angle: number, radius: number) {
  const radians = angle * Math.PI / 180;
  return { x: CENTER + radius * Math.sin(radians), y: CENTER - radius * Math.cos(radians) };
}
function wedge(start: number, end: number) {
  const a = point(start, RADIUS);
  const b = point(end, RADIUS);
  return `M ${CENTER} ${CENTER} L ${a.x} ${a.y} A ${RADIUS} ${RADIUS} 0 ${end - start > 180 ? 1 : 0} 1 ${b.x} ${b.y} Z`;
}
const sectors = (() => {
  let cursor = 0;
  return categories.map(category => {
    const start = cursor * 360 / projectCount;
    cursor += category.count;
    return { ...category, start, end: cursor * 360 / projectCount };
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
  const [animate, setAnimate] = useState(false);
  const [duration, setDuration] = useState(5200);

  useEffect(() => {
    if (!spinning || targetRotation === null || finishAt === null) return;
    const remaining = Math.max(0, finishAt - Date.now());
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (remaining === 0 || reducedMotion) {
      setAnimate(false);
      setAngle(targetRotation);
      onFinish();
      return;
    }
    setDuration(remaining);
    setAnimate(false);
    setAngle(0);
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setAnimate(true);
        setAngle(targetRotation);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [spinning, targetRotation, finishAt, onFinish]);

  return (
    <div className="relative mx-auto w-[min(86vw,42dvh)] max-w-[470px] lg:w-[min(39vw,58dvh)]">
      <style>{`
        @keyframes carnival-pointer-tick {
          0%, 100% { transform: rotate(0deg); }
          45% { transform: rotate(9deg); }
        }
        @keyframes carnival-wheel-glow {
          0%, 100% { opacity: .8; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .carnival-pointer { animation: none !important; }
          .carnival-lights { animation: none !important; }
        }
      `}</style>
      <span aria-hidden="true" className="pointer-events-none absolute -left-4 top-[23%] rotate-[-17deg] text-2xl text-[#f7b02f] lg:text-3xl">✦</span>
      <span aria-hidden="true" className="pointer-events-none absolute -right-3 bottom-[22%] rotate-12 text-2xl text-[#f26a9e] lg:text-3xl">✦</span>
      <svg viewBox="0 0 440 440" className="relative aspect-square w-full overflow-visible drop-shadow-[0_13px_13px_rgba(97,57,143,0.22)]"
        role="img" aria-label="Carnival prize wheel with 59 equally likely robot projects, grouped into 14 colorful STEM worlds">
        <defs>
          <radialGradient id="carnivalHub" cx="32%" cy="20%" r="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFE29A" />
          </radialGradient>
        </defs>
        <g style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: "220px 220px",
          transition: animate ? `transform ${duration}ms cubic-bezier(0.11, 0.71, 0.08, 1)` : "none",
        }} onTransitionEnd={event => { if (event.propertyName === "transform" && spinning) onFinish(); }}>
          <circle cx="220" cy="220" r="214" fill="#FFDA6B" stroke="#D77A31" strokeWidth="7" />
          <circle cx="220" cy="220" r="197" fill="#FFF8ED" stroke="white" strokeWidth="4" />
          {sectors.map(item => (
            <path key={item.id} d={wedge(item.start, item.end)}
              fill={item.color} stroke="#fffaf1" strokeWidth="2.7" />
          ))}
          {/* Thin radial lines divide each category sector into the actual project slots. */}
          {Array.from({ length: projectCount }, (_, i) => {
            const inner = point(i * 360 / projectCount, 173);
            const outer = point(i * 360 / projectCount, 193);
            return <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="#FFFFFF" strokeWidth="2" strokeOpacity=".9" />;
          })}
          {/* Big category emojis only: no tiny overlapping words inside the wheel. */}
          {sectors.filter(item => item.count >= 4).map(item => {
            const pos = point((item.start + item.end) / 2, 141);
            return <text key={item.id} x={pos.x} y={pos.y} textAnchor="middle"
              dominantBaseline="central" fontSize={item.count >= 6 ? "27" : "22"}>{item.icon}</text>;
          })}
          {Array.from({ length: 30 }, (_, i) => {
            const dot = point(i * 12, 206);
            return <circle key={i} cx={dot.x} cy={dot.y} r="4.7"
              fill={i % 2 === 0 ? "#FFFBDE" : "#F8729F"}
              className={spinning ? "carnival-lights" : ""}
              style={spinning ? { animation: `carnival-wheel-glow ${i % 2 === 0 ? 350 : 430}ms ease-in-out infinite` } : undefined} />;
          })}
          <circle cx="220" cy="220" r="73" fill="#FFFDF6" stroke="#D77A31" strokeWidth="6" />
          <circle cx="220" cy="220" r="65" fill="url(#carnivalHub)" stroke="#FFFFFF" strokeWidth="5" />
          <text x="220" y="211" textAnchor="middle" fontSize="37" fontWeight="900" fill="#6742AC">59</text>
          <text x="220" y="232" textAnchor="middle" fontSize="14" fontWeight="900" fill="#6742AC">ROBOTS!</text>
          <text x="220" y="250" textAnchor="middle" fontSize="10" fontWeight="800" fill="#BC5E63">LEVEL 1</text>
        </g>
        {/* The pointer stays in place while the 59 equal slots spin underneath. */}
        <g className="carnival-pointer" style={spinning ? {
          transformOrigin: "220px 25px",
          animation: "carnival-pointer-tick 130ms ease-in-out infinite",
        } : undefined}>
          <path d="M 220 60 L 202 11 Q 220 -1 238 11 Z" fill="#FF477B" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round"/>
          <circle cx="220" cy="13" r="8" fill="#FFF5C8" stroke="#BC3E6A" strokeWidth="3"/>
        </g>
      </svg>
    </div>
  );
}
