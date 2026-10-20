import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry, Group, Mesh, Vector3 } from "three";

import lowerGearUrl from "../../../3d components/Lego 20 teeth.stl?url";
import upperGearUrl from "../../../3d components/Lego 24 teeth.stl?url";
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
type Model = "lowerGear" | "upperGear" | "bush" | "longAxle" | "shortAxle" |
  "coupling" | "arm" | "bluePin" | "blackPin" | "smallL" | "largeL";
type Pose = { position: V3; rotation: V3 };
type Piece = {
  id: string; step: number; action: number; model: Model;
  color: string; pose: Pose; approach: V3;
};
const URLS: Record<Model, string> = {
  lowerGear: lowerGearUrl, upperGear: upperGearUrl, bush: bushUrl,
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
  { id: "upper-spur-gear", step: 2, action: 0, model: "upperGear", color: "#656d75",
    pose: pose([0, 3.48, 0], [-PI/2, 0, 0]), approach: [0, 3.2, 0] },
  { id: "red-left-support", step: 3, action: 0, model: "smallL", color: "#df3447",
    pose: pose([1.0, 1.52, -1.08]), approach: [-3.4, 0, -0.5] },
  { id: "red-right-support", step: 3, action: 1, model: "smallL", color: "#df3447",
    pose: pose([1.0, 1.52, 1.08], [0, PI, 0]), approach: [3.4, 0, 0.5] },
  { id: "cross-axle", step: 3, action: 2, model: "shortAxle", color: "#adb5bd",
    pose: pose([1.0, 1.68, 0]), approach: [0, 0, 4.0] },
  { id: "first-gray-l-support", step: 4, action: 0, model: "largeL", color: "#505d66",
    pose: pose([1.86, -0.38, -1.55]), approach: [0, 0, -3.8] },
  { id: "first-black-joining-pin", step: 4, action: 1, model: "blackPin", color: "#1c242e",
    pose: pose([1.18, 1.55, -1.25]), approach: [0, 0, -3.1] },
];

export const ACCELERATION_ACTIONS = [
  [
    ["Seat the lower bushing", "Lower the silver bushing into the black gear's center opening.", "Vertical, down into gear"],
    ["Insert the vertical axle", "Slide the long cross axle down through the bushing; leave it upright.", "Vertical, down"],
    ["Slide on the two-hole block", "Lower the black coupling block over the axle. Keep its adjacent round hole free.", "Vertical, down"],
    ["Seat the upper bushing", "Add the second silver bushing above the black coupling block.", "Vertical, down"],
    ["Align the silver mounting arm", "Lower the perpendicular silver arm so its inner mounting hole meets the block.", "Vertical, down"],
    ["Insert the blue connector", "Press the blue pin down through the arm and matching round hole in the black block.", "Top to bottom"],
  ],
  [
    ["Attach the upper gray gear", "Align its cross-shaped center with the existing vertical axle, then lower the gear onto the top.", "Vertical, down"],
  ],
  [
    ["Place the first red L-beam", "Bring the first small L-shaped red support alongside the silver arm.", "From the left"],
    ["Place the matching red L-beam", "Move its partner to the other side of the silver arm; line up the side-facing holes.", "From the right"],
    ["Slide through the horizontal axle", "Pass the silver cross axle horizontally through the aligned side holes.", "Horizontal, along the axle"],
  ],
  [
    ["Bring in the gray L-support", "Stand the larger L-beam upright, with its short foot directed inward.", "From outside the assembly"],
    ["Secure the top with a black pin", "Pass the black connector sideways through the gray support's upper hole and red beam.", "Horizontal, from outside"],
  ],
  [
    ["Fit the yellow axle collar", "Slide the yellow bushing onto the new horizontal cross axle while the axle is still separate.", "Along the loose axle"],
    ["Insert the prepared axle", "Carry the shaft and its yellow collar together toward the lower gear, keeping the axle horizontal.", "Horizontal, inward"],
  ],
] as const;

export const ACCELERATION_TITLES = [
  "Build the lower gear shaft", "Add the upper gear", "Join two red L-supports",
  "Mount the first gray support", "Insert the lower drive axle",
] as const;

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
    group.current?.position.set(...(phase === 1 ? shaftPrepare : phase > 1 ? shaftDock : shaftPrepare));
    collar.current?.position.set(0, 0, phase === 0 ? 2.2 : -0.9);
  }, [phase, replayKey, reducedMotion]);
  useFrame((_, delta) => {
    if (paused || notified.current) return;
    age.current = Math.min(1.5, age.current + Math.min(0.06, delta));
    const t = ease(age.current/1.5);
    if (phase === 0 && collar.current) {
      collar.current.position.z = 2.2 + (-0.9 - 2.2) * t;
    } else if (phase === 1 && group.current) {
      group.current.position.set(...blend(shaftPrepare, shaftDock, t));
    }
    if (age.current >= 1.5) { notified.current = true; onDone(); }
  });
  return (
    <group ref={group} position={phase > 1 ? shaftDock : shaftPrepare}>
      <ModelMesh model="longAxle" color="#afb9c4"/>
      <group ref={collar} position={[0, 0, phase === 0 ? 2.2 : -0.9]}>
        <ModelMesh model="bush" color="#e4be37"/>
      </group>
    </group>
  );
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
