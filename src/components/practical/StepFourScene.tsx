import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { StepThreeConfig } from "./StepThreeScene";

export type StepFourPart =
  | "beam15" | "longPinA" | "longPinB" | "firstL" | "secondL"
  | "mediumAxle" | "axleConnector";

type Transform = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const ROOT = "/marksmanship/models/";
const FILES = [
  ROOT + "beam15.stl", ROOT + "beam-l-small.stl",
  ROOT + "connector-long.stl", ROOT + "pin-long-pin.stl",
  ROOT + "pin-pin.stl", ROOT + "axle-middle.stl", ROOT + "axle-connector.stl",
];

// STL-native coordinates are millimetres. Every model is rendered at 1 unit / 8 mm.
// On the original small L STL the mounting holes are (0,0) and (0,-8) mm,
// the unused round hole is (0,-16), the X-hole is (0,-24), and the
// preinstalled short-arm pin remains at (8,0) mm.
// Rotate the arm -90°: holes (0,0), (0,-8) align with the beam's
// holes 2 and 1, respectively. Both beams face outward across the Z axis.
export const STEP_FOUR_HOLES = {
  beam: [1, 2] as const,
  lMount: [[0, 0], [0, -8]] as const,
  lAxle: [0, -24] as const,
  lPreinstalledPin: [8, 0] as const,
  axleConnectorMidpoint: 0,
  assemblyId: "marksman-step4-shooting-assembly",
};

const L_END: [number, number, number] = [-6, 0, 1];
const R_END: [number, number, number] = [-6, 0, -1];
const AXLE_X = -9; // Three 8-mm pitches beyond beam hole 2, at the L-beam X-hole.
const AXLE_START_Z = 6; // Clear approach distance once the prepared axle is reoriented
const L_TURN = -Math.PI / 2;

function xyz(x: number, y: number, z: number): [number, number, number] {
  return [x, y, z];
}
function makePose(position: [number, number, number], turn = 0): Transform {
  return { position, rotation: [0, 0, turn] };
}
function poses(phase: number): Record<StepFourPart, Transform> {
  return {
    beam15: makePose([0, 0, 0]),
    longPinA: makePose([-7, 0, 0]),
    longPinB: makePose([-6, 0, 0]),
    firstL: makePose(phase >= 2 ? L_END : [-4.1, -3.15, 0], phase >= 2 ? L_TURN : 0),
    secondL: makePose(phase >= 4 ? R_END : [4.1, -3.15, 0], phase >= 4 ? L_TURN : 0),
    // Begin at the SAME loose axle/connector poses as the completed Step 3 viewer.
    // Phase 1 pushes the grey connector along the axle's original X axis to its midpoint.
    mediumAxle: {
      position: phase >= 3 ? [AXLE_X, 0, 0] : [-1.8, 3.1, 0],
      rotation: [0, phase >= 3 ? -Math.PI / 2 : 0, 0],
    },
    axleConnector: {
      position: phase >= 3 ? [AXLE_X, 0, 0] : phase >= 1 ? [-1.8, 3.1, 0] : [4.8, 3.1, 0],
      rotation: [0, phase >= 3 ? 0 : Math.PI / 2, 0],
    },
  };
}
export function getStepFourTransforms() {
  return {
    version: 1,
    units: "8 mm per world unit",
    ...STEP_FOUR_HOLES,
    transforms: poses(5),
    // Photo-based positions are not a substitute for a physical collision/fit inspection.
    mechanicallyVerified: false,
  };
}

function preparedGeometry(source: BufferGeometry, kind: "beam" | "l" | "center"): BufferGeometry {
  const copy = source.clone();
  copy.computeBoundingBox();
  if (kind === "beam") copy.translate(-56, -3.65, -3.9);
  else if (kind === "l") copy.translate(0, 0, -4);
  else {
    const center = copy.boundingBox!.getCenter(new Vector3());
    copy.translate(-center.x, -center.y, -center.z);
  }
  copy.scale(0.125, 0.125, 0.125);
  copy.computeVertexNormals();
  return copy;
}
function smooth(t: number) {
  const v = Math.min(1, Math.max(0, t));
  return v * v * (3 - 2 * v);
}
function lerpPose(from: Transform, to: Transform, amount: number): Transform {
  const t = smooth(amount);
  return {
    position: xyz(
      from.position[0] + (to.position[0] - from.position[0]) * t,
      from.position[1] + (to.position[1] - from.position[1]) * t,
      from.position[2] + (to.position[2] - from.position[2]) * t,
    ),
    rotation: xyz(
      from.rotation[0] + (to.rotation[0] - from.rotation[0]) * t,
      from.rotation[1] + (to.rotation[1] - from.rotation[1]) * t,
      from.rotation[2] + (to.rotation[2] - from.rotation[2]) * t,
    ),
  };
}
function animatedPose(part: StepFourPart, from: Transform, to: Transform, amount: number, action: number): Transform {
  // L-beams rotate into an axial alignment plane first, then slide onto
  // the pins without sweeping through the long beam's solid plastic.
  if ((part === "mediumAxle" || part === "axleConnector") && action === 3) {
    // Move the paired axle/connector together to the X-hole axis, rotate both
    // into coaxial alignment, then insert straight along the Z axis.
    const aligned: Transform = {
      position: [AXLE_X, 0, AXLE_START_Z],
      rotation: part === "mediumAxle" ? [0, -Math.PI / 2, 0] : [0, 0, 0],
    };
    if (amount < 0.5) return lerpPose(from, aligned, amount * 2);
    return lerpPose(aligned, to, (amount - 0.5) * 2);
  }
  if ((part === "firstL" && action === 2) || (part === "secondL" && action === 4)) {
    const guide: Transform = makePose(
      [to.position[0], to.position[1], part === "firstL" ? 3.4 : -3.4], L_TURN,
    );
    if (amount < 0.5) return lerpPose(from, guide, amount * 2);
    return lerpPose(guide, to, (amount - 0.5) * 2);
  }
  return lerpPose(from, to, amount);
}
const MOVERS: StepFourPart[] = ["firstL", "secondL", "mediumAxle", "axleConnector"];
function focusAt(phase: number) {
  if (phase === 1) return new Vector3(-1.8, 3.1, 0);
  if (phase === 2) return new Vector3(-6.5, 0, 1.5);
  if (phase === 3) return new Vector3(AXLE_X, 0, 1);
  if (phase === 4) return new Vector3(-6.5, 0, -1.5);
  return new Vector3(-3.5, 0, 0);
}

function Stage({
  phase, replayKey, paused, resetCameraKey, connector,
  onMotionComplete,
}: {
  phase: number;
  replayKey: number;
  paused: boolean;
  resetCameraKey: number;
  connector: StepThreeConfig["longConnector"];
  onMotionComplete: () => void;
}) {
  const sources = useLoader(STLLoader, FILES);
  const meshes = useMemo(() => ({
    beam: preparedGeometry(sources[0]!, "beam"),
    l: preparedGeometry(sources[1]!, "l"),
    long: preparedGeometry(sources[2]!, "center"),
    alternate: preparedGeometry(sources[3]!, "center"),
    pin: preparedGeometry(sources[4]!, "center"),
    axle: preparedGeometry(sources[5]!, "center"),
    axleConnector: preparedGeometry(sources[6]!, "center"),
  }), [sources]);
  const longPin = connector === "pinLong" ? meshes.alternate : meshes.long;
  const refs = useRef<Partial<Record<StepFourPart, Group>>>({});
  const orbit = useRef<OrbitControlsImpl>(null);
  const initialized = useRef(false);
  const previous = useRef({ phase, replayKey });
  const motion = useRef<{
    action: number; elapsed: number; duration: number;
    from: Record<StepFourPart, Transform>; to: Record<StepFourPart, Transform>;
  } | null>(null);
  const completed = useRef(onMotionComplete);
  completed.current = onMotionComplete;
  const cameraMove = useRef<{
    elapsed: number; fromTarget: Vector3; toTarget: Vector3; fromPosition: Vector3; toPosition: Vector3;
  } | null>(null);

  useLayoutEffect(() => {
    const next = poses(phase);
    if (!initialized.current) {
      for (const id of MOVERS) {
        refs.current[id]?.position.set(...next[id].position);
        refs.current[id]?.rotation.set(...next[id].rotation);
      }
      initialized.current = true;
      completed.current();
    } else if (phase !== previous.current.phase || replayKey !== previous.current.replayKey) {
      const prev = previous.current.phase;
      const replay = prev === phase;
      const beginning = poses(replay ? Math.max(0, phase - 1) : prev);
      const from = {} as Record<StepFourPart, Transform>;
      for (const id of MOVERS) {
        const part = refs.current[id];
        from[id] = part
          ? { position: xyz(part.position.x, part.position.y, part.position.z),
              rotation: xyz(part.rotation.x, part.rotation.y, part.rotation.z) }
          : beginning[id];
        if (replay) {
          from[id] = beginning[id];
          part?.position.set(...beginning[id].position);
          part?.rotation.set(...beginning[id].rotation);
        }
      }
      // Rewind the same alignment/insertion path on Previous, rather than cutting through parts.
      motion.current = { action: Math.max(prev, phase), elapsed: 0, duration: 1.65, from, to: next };
    }
    previous.current = { phase, replayKey };
  }, [phase, replayKey]);

  useLayoutEffect(() => {
    const ctrl = orbit.current;
    if (!ctrl) return;
    const target = focusAt(phase);
    const offset = ctrl.object.position.clone().sub(ctrl.target).normalize();
    cameraMove.current = {
      elapsed: 0,
      fromTarget: ctrl.target.clone(),
      toTarget: target,
      fromPosition: ctrl.object.position.clone(),
      toPosition: target.clone().addScaledVector(offset, phase === 0 || phase === 5 ? 23 : 13),
    };
  }, [phase]);
  useLayoutEffect(() => {
    orbit.current?.reset();
    cameraMove.current = null;
  }, [resetCameraKey]);

  useFrame((state, rawDelta) => {
    if (paused) return;
    const delta = Math.min(0.08, rawDelta);
    if (cameraMove.current && orbit.current) {
      const m = cameraMove.current;
      m.elapsed = Math.min(0.95, m.elapsed + delta);
      const a = smooth(m.elapsed / 0.95);
      orbit.current.target.lerpVectors(m.fromTarget, m.toTarget, a);
      state.camera.position.lerpVectors(m.fromPosition, m.toPosition, a);
      orbit.current.update();
      if (a >= 1) cameraMove.current = null;
    }
    if (motion.current) {
      const m = motion.current;
      m.elapsed = Math.min(m.duration, m.elapsed + delta);
      const t = m.elapsed / m.duration;
      for (const id of MOVERS) {
        const group = refs.current[id];
        if (!group) continue;
        const next = animatedPose(id, m.from[id], m.to[id], t, m.action);
        group.position.set(...next.position);
        group.rotation.set(...next.rotation);
      }
      if (t >= 1) {
        motion.current = null;
        completed.current();
      }
    }
  });

  const first = phase === 2 || phase === 3;
  const second = phase === 4;
  const mkPin = (id: "longPinA" | "longPinB", x: number) => (
    <group key={id} position={[x, 0, 0]}>
      <mesh geometry={longPin} castShadow>
        <meshStandardMaterial color="#2476d2" roughness={0.59} />
      </mesh>
    </group>
  );
  const lBeam = (id: "firstL" | "secondL", front: boolean) => (
    <group key={id} ref={(node) => { if (node) refs.current[id] = node; }}>
      <mesh geometry={meshes.l} castShadow receiveShadow>
        <meshStandardMaterial color="#b6bec8" metalness={0.04} roughness={0.69} />
      </mesh>
      {/* The pin is parented to its host L-beam, never left floating. */}
      <group position={[1, 0, 0]} rotation={front ? [0, 0, 0] : [0, Math.PI, 0]}>
        <mesh geometry={meshes.pin} castShadow>
          <meshStandardMaterial color="#303946" roughness={0.62} />
        </mesh>
      </group>
      {(front ? first : second) && (
        <>
          <mesh position={[0, 0, front ? 0.53 : -0.53]}>
            <torusGeometry args={[0.33, 0.06, 8, 32]} />
            <meshBasicMaterial color="#f59e0b" depthTest={false} />
          </mesh>
          <mesh position={[0, -1, front ? 0.53 : -0.53]}>
            <torusGeometry args={[0.33, 0.06, 8, 32]} />
            <meshBasicMaterial color="#f59e0b" depthTest={false} />
          </mesh>
          {phase === 3 && (
            <mesh position={[0, -3, front ? 0.54 : -0.54]}>
              <torusGeometry args={[0.33, 0.065, 8, 32]} />
              <meshBasicMaterial color="#23a0d9" depthTest={false} />
            </mesh>
          )}
        </>
      )}
    </group>
  );

  return (
    <>
      <color attach="background" args={["#f8fbfd"]} />
      <ambientLight intensity={1.6} />
      <hemisphereLight args={["#ffffff", "#c6d8e8", 2]} />
      <directionalLight position={[2, 9, 12]} intensity={2} />
      <directionalLight position={[-10, -8, 4]} intensity={0.7} />
      <gridHelper args={[24, 24, "#d5e2ee", "#e7eef4"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -3.3]} />
      <mesh geometry={meshes.beam} castShadow receiveShadow>
        <meshStandardMaterial color="#f1e8d5" metalness={0.04} roughness={0.66} />
      </mesh>
      {mkPin("longPinA", -7)}
      {mkPin("longPinB", -6)}
      {lBeam("firstL", true)}
      {lBeam("secondL", false)}
      <group ref={(node) => { if (node) refs.current.mediumAxle = node; }}>
        <mesh geometry={meshes.axle} castShadow>
          <meshStandardMaterial color="#25292f" roughness={0.54} />
        </mesh>
      </group>
      <group ref={(node) => { if (node) refs.current.axleConnector = node; }}>
        <mesh geometry={meshes.axleConnector} castShadow>
          <meshStandardMaterial color="#abb2bc" roughness={0.65} />
        </mesh>
      </group>
      {phase === 3 && (
        <Line points={[[AXLE_X, 0, AXLE_START_Z + 4.5], [AXLE_X, 0, -4.5]]}
          color="#23a0d9" lineWidth={1.7} dashed dashSize={0.15} gapSize={0.12} />
      )}
      <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.07}
        minDistance={7} maxDistance={36} enablePan onStart={() => { cameraMove.current = null; }} autoRotate={false}
        autoRotateSpeed={0.35} />
    </>
  );
}

export function StepFourScene(props: {
  phase: number;
  replayKey: number;
  paused: boolean;
  resetCameraKey: number;
  connector: StepThreeConfig["longConnector"];
  onMotionComplete: () => void;
}) {
  return (
    <Canvas aria-label="Interactive 3D Marksmanship Step 4 assembly"
      camera={{ position: [8, 11, 22], fov: 46, near: 0.1, far: 130 }}
      dpr={[1, 1.65]} gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ height: "100%", width: "100%", touchAction: "none" }}>
      <Suspense fallback={null}><Stage {...props} /></Suspense>
    </Canvas>
  );
}
