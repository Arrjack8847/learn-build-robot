import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { MeshStandardMaterial, Vector3, type Mesh, type BufferGeometry } from "three";
import { ChevronLeft, ChevronRight, CircleAlert, Pause, Play, RotateCcw, ScanSearch } from "lucide-react";

type PartId = "long-beam" | "beam-pin-a" | "beam-pin-b" | "left-l" | "right-l" | "axle" | "axle-connector";
type InspectPart = { id: PartId; src: string; color: string; position: [number, number, number] };

// These coordinates ONLY spread the original STL assets across an inspection tray.
// They are NOT attachment transforms, and must never be reused as final assembly poses.
const PARTS: InspectPart[] = [
  { id: "long-beam", src: "/marksmanship/models/beam-15.stl", color: "#ddc78f", position: [-0.7, 0, -0.1] },
  { id: "beam-pin-a", src: "/marksmanship/models/connector-long.stl", color: "#2274d4", position: [3.0, 0, -2.4] },
  { id: "beam-pin-b", src: "/marksmanship/models/connector-long.stl", color: "#2274d4", position: [4.0, 0, -2.4] },
  { id: "left-l", src: "/marksmanship/models/beam-l-small.stl", color: "#d5dce4", position: [1.9, 0, 2.5] },
  { id: "right-l", src: "/marksmanship/models/beam-l-small.stl", color: "#d5dce4", position: [4.0, 0, 2.5] },
  { id: "axle", src: "/marksmanship/models/axle-medium.stl", color: "#343b48", position: [-2.8, 0, -2.2] },
  { id: "axle-connector", src: "/marksmanship/models/connector-axle.stl", color: "#929da9", position: [-0.2, 0, -2.3] },
];

const INSPECTION = [
  {
    title: "4.1 — Identify attachment points",
    instruction: "Find the two connectors on the prepared 15-hole beam. Compare their positions with the Step 3 photograph before attaching anything.",
    focus: ["long-beam", "beam-pin-a", "beam-pin-b"],
  },
  {
    title: "4.2 — First L-shaped beam",
    instruction: "Find the mounting hole on the first prepared L-beam. Align that hole with the Step 3 connector and keep its own connector facing outward.",
    focus: ["long-beam", "beam-pin-a", "left-l"],
  },
  {
    title: "4.3 — Second L-shaped beam",
    instruction: "Repeat on the opposite side. The L-beam connectors must both face outward, not inward toward each other.",
    focus: ["long-beam", "beam-pin-b", "left-l", "right-l"],
  },
  {
    title: "4.4 — Examine axle connection",
    instruction: "Inspect the medium axle and small axle connector. Confirm the matching cross-shaped opening and installation order with a physical reference.",
    focus: ["axle", "axle-connector"],
  },
  {
    title: "4.5 — Insert medium axle",
    instruction: "When the correct cross-shaped opening is verified, line up the medium axle and insert it straight along the shared axis. Leave its free length extending outward.",
    focus: ["axle", "axle-connector", "left-l", "right-l"],
  },
  {
    title: "4.6 — Compare against the manual",
    instruction: "Compare the physical result with the official Step 4 illustration. Keep the full subassembly for Steps 29–30; do not connect it to the Step 2 motor now.",
    focus: PARTS.map((part) => part.id),
  },
] as const;

function InspectMesh({ part, selected, replay }: { part: InspectPart; selected: boolean; replay: number }) {
  const loaded = useLoader(STLLoader, part.src);
  const geometry = useMemo(() => {
    const clone: BufferGeometry = loaded.clone();
    clone.computeBoundingBox();
    const center = clone.boundingBox?.getCenter(new Vector3());
    if (center) clone.translate(-center.x, -center.y, -center.z);
    return clone;
  }, [loaded]);
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    // Only the light emphasis changes. Never distort the original STL geometry.
    const material = mesh.current?.material;
    if (material instanceof MeshStandardMaterial) {
      material.emissiveIntensity = selected ? 0.18 + 0.10 * Math.sin(clock.elapsedTime * 3 + replay) : 0;
    }
  });
  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      position={part.position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={0.065}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={part.color} emissive="#168eea" transparent opacity={selected ? 1 : 0.48} roughness={0.66} metalness={0.08} />
    </mesh>
  );
}

function PartsStage({ phase, replay }: { phase: number; replay: number }) {
  const selection: ReadonlyArray<string> = INSPECTION[phase]?.focus ?? [];
  return (
    <>
      <ambientLight intensity={1.75} />
      <directionalLight position={[5, 10, 8]} intensity={2} />
      <directionalLight position={[-6, 3, -5]} intensity={0.65} />
      <gridHelper args={[16, 16, "#d3e0f0", "#e8edf4"]} position={[0, -0.12, 0]} />
      {PARTS.map((part) => (
        <InspectMesh key={part.id} part={part} selected={selection.includes(part.id)} replay={replay} />
      ))}
      <OrbitControls makeDefault enableDamping dampingFactor={0.09} minDistance={5} maxDistance={32} />
    </>
  );
}

export function Step4Inspector({ onStep3, onStep5 }: { onStep3: () => void; onStep5: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [replay, setReplay] = useState(0);
  const [viewKey, setViewKey] = useState(0);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!playing) return;
    const timeout = window.setTimeout(() => {
      if (phase < INSPECTION.length - 1) setPhase(phase + 1);
      else setPlaying(false);
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [phase, playing]);

  const current = INSPECTION[phase] ?? INSPECTION[0];
  const buttonClass = "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#132654] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168eea] disabled:opacity-40";

  return (
    <div className="relative z-10 w-full" aria-label="Marksmanship Step 4 3D part inspection">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f69bd]">Step 4 · STL inspection</p>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900">
          Mounting geometry needs verification
        </span>
      </div>

      <div className="relative h-[260px] overflow-hidden rounded-2xl border border-sky-100 bg-[linear-gradient(160deg,#ffffff,#eaf5ff)] sm:h-[355px] md:h-[380px]">
        {mounted ? (
          <Canvas key={viewKey} camera={{ position: [9, 10, 11], fov: 42, near: 0.1, far: 100 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
            <Suspense fallback={null}>
              <PartsStage phase={phase} replay={replay} />
            </Suspense>
          </Canvas>
        ) : (
          <img src="/marksmanship/steps/4.png" alt="Official Step 4 reference" className="h-full w-full object-contain" />
        )}
        <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#132654] shadow-sm">
          Drag to rotate · scroll/pinch to zoom
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <button className={buttonClass} type="button" onClick={() => { setPlaying(false); setPhase((p) => Math.max(0, p - 1)); }} disabled={phase === 0}>
          <ChevronLeft className="size-3.5" /> Previous
        </button>
        <button className={buttonClass} type="button" onClick={() => { setPlaying(false); setPhase((p) => Math.min(INSPECTION.length - 1, p + 1)); }} disabled={phase === INSPECTION.length - 1}>
          Next <ChevronRight className="size-3.5" />
        </button>
        <button className={buttonClass} type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause instructions" : "Play instructions"}>
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />} {playing ? "Pause" : "Play"}
        </button>
        <button className={buttonClass} type="button" onClick={() => { setPlaying(false); setReplay((n) => n + 1); }}><RotateCcw className="size-3.5" /> Replay focus</button>
        <button className={buttonClass} type="button" onClick={() => setViewKey((n) => n + 1)}><ScanSearch className="size-3.5" /> Reset view</button>
      </div>

      <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3 text-left">
        <p className="font-extrabold text-[#132654]">{current.title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">{current.instruction}</p>
        <p className="mt-2 text-[11px] font-semibold text-[#0f69bd]">Instruction {phase + 1} of {INSPECTION.length}</p>
      </div>

      <div role="status" className="mt-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-xs leading-5 text-amber-950">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          This viewer displays authentic STL parts in a separated inspection layout. There is no verified Step 3 3D pose or axle-connector mounting order in the repository, so it deliberately does <strong>not</strong> animate a speculative final attachment. Refer to the manual while performing the physical step.
        </span>
      </div>

      <div className="mt-2 flex justify-between gap-2 text-xs font-semibold text-[#0f69bd]">
        <button className="underline underline-offset-4" type="button" onClick={onStep3}>← Step 3 reference</button>
        <button className="underline underline-offset-4" type="button" onClick={onStep5}>Step 5 reference →</button>
      </div>
    </div>
  );
}
