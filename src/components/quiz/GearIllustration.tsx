import type {GearDiagram} from "@/data/quizStudio";

export function GearIllustration({ variant }: { variant: GearDiagram }) {
  const firstLarge = variant === "large-to-small";
  const gearPoints = (x: number, y: number, radius: number, teeth: number) =>
    Array.from({length: teeth * 4}, (_, point) => {
      const angle = (point / (teeth * 4)) * Math.PI * 2;
      const r = point % 4 === 0 || point % 4 === 3 ? radius : radius - 5;
      return `${x + Math.cos(angle) * r},${y + Math.sin(angle) * r}`;
    }).join(" ");
  return (
    <figure className="mx-auto mt-4 w-full max-w-sm rounded-2xl bg-sky-50 p-3 text-center">
      <svg role="img" aria-label={firstLarge ? "Large driving gear A touching smaller driven gear B" : "Small driving gear A touching larger driven gear B"}
        viewBox="0 0 320 160" className="mx-auto h-auto w-full max-h-[24dvh] min-h-20">
        <polygon points={gearPoints(116, 72, firstLarge ? 48 : 25, firstLarge ? 16 : 10)} fill="#e1f1ff" stroke="#168eea" strokeWidth="2"/>
        <circle cx="116" cy="72" r="11" fill="#168eea"/>
        <polygon points={gearPoints(189, 72, firstLarge ? 25 : 48, firstLarge ? 10 : 16)} fill="#fff1d2" stroke="#d59a2b" strokeWidth="2"/>
        <circle cx="189" cy="72" r="11" fill="#d59a2b"/>
        <text x="116" y="76" fill="#ffffff" textAnchor="middle" fontSize="13" fontWeight="bold">A</text>
        <text x="189" y="76" fill="#ffffff" textAnchor="middle" fontSize="13" fontWeight="bold">B</text>
        <text x="116" y="145" fill="#132654" textAnchor="middle" fontSize="12">Gear A · Driving</text>
        <text x="208" y="158" fill="#132654" textAnchor="middle" fontSize="12">Gear B · Driven</text>
      </svg>
      <figcaption className="text-xs font-semibold text-slate-600">Look at the sizes of the two gears.</figcaption>
    </figure>
  );
}
