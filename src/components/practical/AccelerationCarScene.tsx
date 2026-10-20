import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry, Group, Mesh, Vector3 } from "three";

import lowerGearUrl from "../../../3d components/Lego 20 teeth.stl?url";
import upperGearUrl from "../../../3d components/Lego 24 teeth.stl?url";
import yellowGearUrl from "../../../3d components/Lego 8 teeth.stl?url";
import bushUrl from "../../../3d components/reform/lego-technic-axle-connectors-reformy/3713_Bush.stl?url";
import longAxleUrl from "../../../3d components/reform/lego-technic-axle-connectors-reformy/3706_axle_6.stl?url";
import shortAxleUrl from "../../../3d components/reform/lego-technic-axle-connectors-reformy/3705_axle_4.stl?url";
import couplingUrl from "../../../3d components/reform/lego-technic-beams/60483_Beam_1x2_+O.stl?url";
import silverArmUrl from "../../../3d components/32184_fixed.stl?url";
import bluePinUrl from "../../../3d components/reform/lego-technic-axle-connectors-reformy/3749_Axle_Pin_without_Friction_Ridges_Lengthwise.stl?url";
import blackPinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";
import smallLUrl from "../../../3D for marksman/beams/L/beam L small.stl?url";
import largeLUrl from "../../../3D for marksman/beams/L/BEAM L_.stl?url";

type V3 = [number, number, number];
type Model = "lowerGear" | "upperGear" | "yellowGear" | "bush" | "longAxle" | "shortAxle" |
  "coupling" | "arm" | "bluePin" | "blackPin" | "smallL" | "largeL";
type Pose = { position: V3; rotation: V3 };
type Piece = {
  id: string; step: number; action: number; model: Model;
  color: string; pose: Pose; approach: V3;
};
const URLS: Record<Model, string> = {
  lowerGear: lowerGearUrl, upperGear: upperGearUrl, yellowGear: yellowGearUrl, bush: bushUrl,
  longAxle: longAxleUrl, shortAxle: shortAxleUrl,
  coupling: couplingUrl, arm: silverArmUrl,
  bluePin: bluePinUrl, blackPin: blackPinUrl,
  smallL: smallLUrl, largeL: largeLUrl,
};
const PI = Math.PI;
const pose = (position: V3, rotation: V3 = [0, 0, 0]): Pose => ({ position, rotation });
/**
 * Review-stage placement data (world units = 8 mm).
 * These placements reproduce the illustrated order and axis directions.
 * The manual DOES NOT specify CAD hole coordinates or seating depth, so all
 * offsets must be checked against physical-kit measurements before certification.
 *
 * Lower 20-tooth gear native axis is Y. Axles/bushes/24-tooth gear native axis
 * is Z. Small/L beams lie in the XY plane with their holes along Z.
 */
export const ACCELERATION_PIECES: readonly Piece[] = [
  { id: "lower-bush", step: 1, action: 0, model: "bush", color: "#bec8d2",
    pose: pose([0, 0.35, 0], [-PI/2, 0, 0]), approach: [0, 2.5, 0] },
  { id: "vertical-axle", step: 1, action: 1, model: "longAxle", color: "#a8b2bc",
    pose: pose([0, 1.65, 0], [-PI/2, 0, 0]), approach: [0, 2.8, 0] },
  { id: "two-hole-coupler", step: 1, action: 2, model: "coupling", color: "#202833",
    pose: pose([0.5, 1.18, 0], [-PI/2, 0, 0]), approach: [0, 2.6, 0] },
  { id: "top-bush", step: 1, action: 3, model: "bush", color: "#bec8d2",
    pose: pose([0, 2.25, 0], [-PI/2, 0, 0]), approach: [0, 2.2, 0] },
  { id: "silver-mounting-arm", step: 1, action: 4, model: "arm", color: "#c4cbd3",
    pose: pose([2, 2.10, 0], [-PI/2, 0, 0]), approach: [0, 2.0, 0] },
  { id: "blue-pin", step: 1, action: 5, model: "bluePin", color: "#1865c6",
    pose: pose([1, 1.65, 0], [-PI/2, 0, 0]), approach: [0, 2.6, 0] },
  { id: "upper-spur-gear", step: 2, action: 2, model: "upperGear", color: "#656d75",
    pose: pose([0, 3.48, 0], [-PI/2, 0, 0]), approach: [0, 3.2, 0] },
  { id: "red-left-support", step: 3, action: 1, model: "smallL", color: "#df3447",
    pose: pose([1.0, 1.52, -1.08]), approach: [-3.4, 0, -0.5] },
  { id: "red-right-support", step: 3, action: 2, model: "smallL", color: "#df3447",
    pose: pose([1.0, 1.52, 1.08], [0, PI, 0]), approach: [3.4, 0, 0.5] },
  { id: "cross-axle", step: 3, action: 4, model: "shortAxle", color: "#adb5bd",
    pose: pose([1.0, 1.68, 0]), approach: [0, 0, 4.0] },
  { id: "first-gray-l-support", step: 4, action: 3, model: "largeL", color: "#505d66",
    pose: pose([1.86, -0.38, -1.55]), approach: [0, 0, -3.8] },
  { id: "first-black-joining-pin", step: 4, action: 2, model: "blackPin", color: "#1c242e",
    pose: pose([1.18, 1.55, -1.25]), approach: [0, 0, -3.1] },
];

export { ACCELERATION_ACTIONS, ACCELERATION_TITLES } from "./AccelerationCarActionSpec";

const ease = (t: number) => t * t * (3 - 2 * t);
function add(a: V3, b: V3): V3 { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
function blend(a: V3, b: V3, t: number): V3 {
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
}
function ModelMesh({ model, color, position = [0, 0, 0], rotation = [0, 0, 0] }: {
  model: Model; color: string; position?: V3; rotation?: V3;
}) {
  const source = useLoader(STLLoader, URLS[model]);
  const geometry = useMemo(() => {
    const mesh = source.clone();
    mesh.center();
    mesh.scale(1/8, 1/8, 1/8);
    mesh.computeVertexNormals();
    return mesh;
  }, [source]);
  return (
    <mesh position={position} rotation={rotation} geometry={geometry}
      castShadow receiveShadow name={model}>
      <meshStandardMaterial color={color} roughness={0.58} metalness={model.includes("Axle") || model === "bush" ? 0.55 : 0.14} />
    </mesh>
  );
}

/** A fresh moving component is present from its preparation pose to its dock.
 * No opacity tricks, teleporting or hiding existing components. */
function MovingPiece({ piece, active, paused, reducedMotion, replayKey, onDone }: {
  piece: Piece; active: boolean; paused: boolean; reducedMotion: boolean;
  replayKey: number; onDone: () => void;
}) {
  const holder = useRef<Group>(null);
  const age = useRef(0);
  const notified = useRef(false);
  const from = add(piece.pose.position, piece.approach);
  useEffect(() => {
    age.current = reducedMotion ? 1.5 : 0;
    notified.current = false;
    holder.current?.position.set(...(active ? from : piece.pose.position));
  }, [active, replayKey, reducedMotion, piece.id]);
  useFrame((_, delta) => {
    if (!active || !holder.current || notified.current || paused) return;
    age.current = Math.min(1.5, age.current + Math.min(0.06, delta));
    holder.current.position.set(...blend(from, piece.pose.position, ease(age.current/1.5)));
    if (age.current >= 1.5) { notified.current = true; onDone(); }
  });
  return (
    <group ref={holder} position={active ? from : piece.pose.position} rotation={piece.pose.rotation}>
      <ModelMesh model={piece.model} color={piece.color} />
    </group>
  );
}

const shaftPrepare: V3 = [0, -0.78, 5.3];
const shaftDock: V3 = [0, -0.78, 1.7];

/** Step 5 keeps the yellow collar attached while the whole axle enters the car. */
function StepFiveAxle({ phase, paused, reducedMotion, replayKey, onDone }: {
  phase: number; paused: boolean; reducedMotion: boolean; replayKey: number;
  onDone: () => void;
}) {
  const group = useRef<Group>(null);
  const collar = useRef<Group>(null);
  const age = useRef(0);
  const notified = useRef(false);
  useEffect(() => {
    age.current = reducedMotion ? 1.5 : 0;
    notified.current = false;
    group.current?.position.set(...shaftPrepare);
    collar.current?.position.set(0, 0, phase < 2 ? 2.2 : -0.9);
  }, [phase, replayKey, reducedMotion]);
  useFrame((_, delta) => {
    if (paused || notified.current || (phase !== 1 && phase !== 3)) return;
    age.current = Math.min(1.5, age.current + Math.min(0.06, delta));
    const t = ease(age.current/1.5);
    if (phase === 1 && collar.current) {
      collar.current.position.z = 2.2 + (-0.9 - 2.2) * t;
    } else if (phase === 3 && group.current) {
      group.current.position.set(...blend(shaftPrepare, shaftDock, t));
    }
    if (age.current >= 1.5) { notified.current = true; onDone(); }
  });
  return (
    <group ref={group} position={shaftPrepare}>
      <ModelMesh model="longAxle" color="#afb9c4"/>
      <group ref={collar} position={[0, 0, phase < 2 ? 2.2 : -0.9]}>
        <ModelMesh model="yellowGear" color="#e4be37" rotation={[-PI/2, 0, 0]}/>
      </group>
    </group>
  );
}


/**
 * Orientation / inspection stages have no physical connector insertion.
 * Finish them after a deliberate viewing period so the user controls the
 * next action, rather than inventing a fake mechanical movement.
 */
function InspectionAction({ paused, reducedMotion, replayKey, onDone }: {
  paused: boolean; reducedMotion: boolean; replayKey: number; onDone: () => void;
}) {
  const age = useRef(0);
  const called = useRef(false);
  useEffect(() => { age.current = 0; called.current = false; }, [replayKey]);
  useFrame((_, delta) => {
    if (paused || called.current) return;
    age.current = Math.min(1.25, age.current + (reducedMotion ? 1.25 : Math.min(0.06, delta)));
    if (age.current >= 1.25) { called.current = true; onDone(); }
  });
  return null;
}

function LoadingScene() {
  return <div className="grid h-full place-items-center text-center text-sm font-semibold text-slate-500">Loading 3D component meshes…</div>;
}
function Parts({ step, phase, paused, reducedMotion, replayKey, onDone }: {
  step: number; phase: number; paused: boolean; reducedMotion: boolean; replayKey: number;
  onDone: () => void;
}) {
  return (
    <group>
      <ModelMesh model="lowerGear" color="#202831" position={[0, 0, 0]}/>
      {/* Preparation stages keep the part visible WITHOUT assuming a mounting
          coordinate is known before the physical kit can be inspected. */}
      {step === 2 && phase < 2 &&
        <ModelMesh model="upperGear" color="#656d75" position={[0, 6.4 - phase * 0.65, 0]}
          rotation={[-PI/2, 0, 0]}/>}
      {step === 3 && phase === 0 &&
        <ModelMesh model="smallL" color="#df3447" position={[-3.1, 2.5, -2.9]}/>}
      {step === 4 && phase < 3 &&
        <ModelMesh model="largeL" color="#505d66" position={[4, -0.38, -4.0]}/>}
      {(step === 2 && phase < 2 || step === 3 && (phase === 0 || phase === 3) ||
        step === 4 && phase < 2 || step === 5 && (phase === 0 || phase === 2)) &&
        <InspectionAction key={`${step}-${phase}-${replayKey}`}
          paused={paused} reducedMotion={reducedMotion} replayKey={replayKey} onDone={onDone}/>}

      {ACCELERATION_PIECES.filter(part => part.step < step || (part.step === step && part.action <= phase))
        .map(part =>
          <MovingPiece key={part.id + (part.step === step && part.action === phase ? "-"+replayKey : "")}
            piece={part} active={part.step === step && part.action === phase}
            paused={paused} reducedMotion={reducedMotion} replayKey={replayKey} onDone={onDone} />)}
      {step === 5 &&
        <StepFiveAxle phase={phase} paused={paused} reducedMotion={reducedMotion}
          replayKey={replayKey} onDone={onDone}/>}
    </group>
  );
}
export function AccelerationCarScene({ step, phase, paused, reducedMotion, replayKey, cameraKey, onDone }: {
  step: number; phase: number; paused: boolean; reducedMotion: boolean;
  replayKey: number; cameraKey: number; onDone: () => void;
}) {
  return (
    <div className="h-full w-full" aria-label="Rotatable three-dimensional Acceleration Car prototype">
      <Suspense fallback={<LoadingScene/>}>
        <Canvas shadows dpr={[1, 1.7]} camera={{ position: [7, 5.2, 9], fov: 42, near: 0.1, far: 150 }}
          gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={["#f4f8fc"]}/>
          <ambientLight intensity={1.45}/>
          <directionalLight position={[6, 11, 7]} intensity={2.3} castShadow
            shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
          <gridHelper args={[22, 22, "#dce8f1", "#e7eef5"]} position={[0, -3.4, 0]}/>
          <group position={[-0.4, 0.35, 0]}>
            <Parts step={step} phase={phase} paused={paused} reducedMotion={reducedMotion}
              replayKey={replayKey} onDone={onDone}/>
          </group>
          <OrbitControls key={cameraKey} makeDefault target={[0.5, 0.5, 0]}
            minDistance={5} maxDistance={29} enablePan enableDamping
            minPolarAngle={0.15} maxPolarAngle={Math.PI-0.12}/>
        </Canvas>
      </Suspense>
    </div>
  );
}
