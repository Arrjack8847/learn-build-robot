import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { BufferGeometry, DoubleSide, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { motionEase, motionGuidedPose, motionLerp } from "./marksmanLessonMotion";
import {
  STEP_TWELVE_ACTIVE, STEP_TWELVE_FINAL_PHASE, STEP_TWELVE_HOLE,
  STEP_TWELVE_PARTS, STEP_TWELVE_ROOTS,
  stepTwelvePoses, type Pose, type StepTwelvePart, type V3,
} from "./stepTwelveGeometry";

import lBeamUrl from "../../../3D for marksman/beams/L/BEAM L_.stl?url";
import blackPinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

export type StepTwelveView = "iso" | "top" | "bottom" | "front";
type Motion = {
  from: Record<StepTwelvePart, Pose>;
  to: Record<StepTwelvePart, Pose>;
  active: StepTwelvePart;
  direction: "forward" | "reverse";
  phase: number;
  elapsed: number;
  duration: number;
};
type CameraMove = {
  from: Vector3; to: Vector3; oldTarget: Vector3; newTarget: Vector3; elapsed: number;
};
const SEATED_CLEARANCE = 2.65;

// The original large L file is used directly: the corner is (0,0), the
// long arm runs along local -Y, and its Hole 4 is (0,-3) in 8-mm units.
// Never recenter this STL or the highlighted hole will no longer line up.
function makeL(source: BufferGeometry) {
  const mesh = source.clone();
  mesh.translate(0, 0, -4);
  mesh.scale(1 / 8, 1 / 8, 1 / 8);
  mesh.computeVertexNormals();
  return mesh;
}
function makePin(source: BufferGeometry) {
  const mesh = source.clone();
  mesh.computeBoundingBox();
  const center = mesh.boundingBox!.getCenter(new Vector3());
  mesh.translate(-center.x, -center.y, -center.z);
  mesh.scale(1 / 8, 1 / 8, 1 / 8);
  mesh.computeVertexNormals();
  return mesh;
}
function Bushing() {
  // Hollow teaching approximation. Unlike a solid cylinder, the connector
  // inside stays visible from either side throughout the motion.
  return <group name="STEP12_HOLLOW_TAN_BUSHING">
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.40, 0.40, 0.92, 32, 1, true]} />
      <meshStandardMaterial color="#9c8876" roughness={0.72} side={DoubleSide} />
    </mesh>
    {([-0.46, 0.46] as const).map(z => <mesh key={z} position={[0, 0, z]}>
      <torusGeometry args={[0.325, 0.075, 10, 32]} />
      <meshStandardMaterial color="#a99482" roughness={0.69} />
    </mesh>)}
  </group>;
}
function interpolate(a: Pose, b: Pose, progress: number): Pose {
  return { position: motionLerp(a.position, b.position, progress),
    rotation: motionLerp(a.rotation, b.rotation, progress) };
}
function insertion(from: Pose, to: Pose, progress: number): Pose {
  // Reversible L-local +Z coaxial approach. The second L is physically
  // rotated 180° around Y, so local +Z becomes world -Z: bottom -> up.
  const aligned: Pose = {
    position: [to.position[0], to.position[1], SEATED_CLEARANCE],
    rotation: to.rotation,
  };
  return motionGuidedPose(from, aligned, to, progress, 0.35);
}
function StepTwelveStage({ phase, paused, replayKey, resetCameraKey, reducedMotion,
  view, onMotionComplete }: StepTwelveSceneProps) {
  const loaded = useLoader(STLLoader, [lBeamUrl, blackPinUrl]);
  const geometry = useMemo(() => ({
    l: makeL(loaded[0]!),
    pin: makePin(loaded[1]!),
  }), [loaded]);
  const refs = useRef<Partial<Record<StepTwelvePart, Group>>>({});
  const motion = useRef<Motion | null>(null);
  const cameraMove = useRef<CameraMove | null>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  const previous = useRef({ phase, replayKey });
  const started = useRef(false);
  const previousCameraKey = useRef(resetCameraKey);
  const firstCamera = useRef(true);
  const finished = useRef(onMotionComplete);
  finished.current = onMotionComplete;
  const { camera, size } = useThree();
  const narrow = size.width < size.height * 0.94;
  const initial = useMemo(() => stepTwelvePoses(phase), []);

  useLayoutEffect(() => {
    const old = previous.current;
    const replay = replayKey !== old.replayKey;
    const change = replay || phase !== old.phase;
    if (!change && started.current) return;
    const fromPhase = replay ? Math.max(0, phase - 1) : old.phase;
    const activePhase = Math.max(phase, fromPhase);
    const active = STEP_TWELVE_ACTIVE[activePhase] ?? null;
    const from = stepTwelvePoses(fromPhase);
    const to = stepTwelvePoses(phase);
    const shouldMove = started.current && change && !reducedMotion &&
      Math.abs(fromPhase - phase) <= 1 && active !== null &&
      JSON.stringify(from[active]) !== JSON.stringify(to[active]);
    for (const id of STEP_TWELVE_PARTS) {
      const node = refs.current[id];
      if (!node) continue;
      const next = shouldMove ? from[id] : to[id];
      node.position.set(...next.position);
      node.rotation.set(...next.rotation);
    }
    motion.current = shouldMove && active ? {
      from, to, active,
      direction: phase < fromPhase ? "reverse" : "forward",
      phase: activePhase, elapsed: 0, duration: reducedMotion ? 0 : 1.45,
    } : null;
    previous.current = { phase, replayKey };
    started.current = true;
    if (!motion.current) finished.current();
  }, [phase, replayKey, reducedMotion]);

  useLayoutEffect(() => {
    if (!controls.current) return;
    const scale = narrow ? 1.43 : 1;
    const focus = new Vector3(0, -0.7, 0);
    // Automatically show the underside during the second connector and
    // bushing sequence, but allow a manual Top/Bottom camera inspection.
    const underside = phase === 4 || phase === 5;
    const direction = view === "top" ? [0.01, 0.01, 19] :
      view === "bottom" ? [0.01, 0.01, -19] :
      view === "front" ? [0.01, -18, 3] :
      underside ? [9, -13, -15] : [9, -13, 15];
    const target = new Vector3(...(direction as V3)).multiplyScalar(scale).add(focus);
    camera.up.set(0, 0, 1);
    const reset = resetCameraKey !== previousCameraKey.current;
    previousCameraKey.current = resetCameraKey;
    if (firstCamera.current || reducedMotion || reset) {
      camera.position.copy(target);
      controls.current.target.copy(focus);
      cameraMove.current = null;
      controls.current.update();
    } else {
      cameraMove.current = {
        from: camera.position.clone(), to: target,
        oldTarget: controls.current.target.clone(), newTarget: focus,
        elapsed: 0,
      };
    }
    firstCamera.current = false;
  }, [phase, view, narrow, resetCameraKey, reducedMotion, camera]);

  useFrame((_, deltaRaw) => {
    const delta = Math.min(deltaRaw, 0.06);
    const travel = motion.current;
    if (!paused && travel) {
      travel.elapsed = Math.min(travel.duration, travel.elapsed + delta);
      const t = travel.elapsed / travel.duration;
      for (const id of STEP_TWELVE_PARTS) {
        const node = refs.current[id];
        if (!node) continue;
        const a = travel.from[id], b = travel.to[id];
        const next = id === travel.active
          ? travel.direction === "reverse"
            ? insertion(b, a, 1 - t)
            : insertion(a, b, t)
          : interpolate(a, b, t);
        node.position.set(...next.position);
        node.rotation.set(...next.rotation);
      }
      if (travel.elapsed >= travel.duration) {
        // Force exact final pose, avoiding floating error after reverse.
        const poses = stepTwelvePoses(phase);
        for (const id of STEP_TWELVE_PARTS) {
          refs.current[id]?.position.set(...poses[id].position);
          refs.current[id]?.rotation.set(...poses[id].rotation);
        }
        motion.current = null;
        finished.current();
      }
    }
    const flight = cameraMove.current;
    if (flight && !paused) {
      flight.elapsed = Math.min(1, flight.elapsed + delta / 0.85);
      const ease = motionEase(flight.elapsed);
      camera.position.lerpVectors(flight.from, flight.to, ease);
      controls.current?.target.lerpVectors(flight.oldTarget, flight.newTarget, ease);
      if (flight.elapsed === 1) cameraMove.current = null;
    }
    controls.current?.update();
  });

  function piece(id: StepTwelvePart) {
    const kind = id.startsWith("L_") ? "beam" : id.startsWith("PIN_") ? "pin" : "bushing";
    const poses = initial[id];
    return <group key={id} name={"STEP12_" + id}
      position={poses.position} rotation={poses.rotation}
      ref={node => { if (node) refs.current[id] = node; }}>
      {kind === "beam" ? <mesh geometry={geometry.l} castShadow receiveShadow>
          <meshStandardMaterial color="#aa99c9" roughness={0.58} />
        </mesh>
        : kind === "pin" ? <mesh geometry={geometry.pin} castShadow>
          <meshStandardMaterial color="#22242b" roughness={0.62} />
        </mesh> : <Bushing />}
    </group>;
  }
  const highlighted = phase === 1 || phase === 2 || phase === 4;
  function unit(side: "A" | "B") {
    const { position, rotation } = STEP_TWELVE_ROOTS[side];
    return <group key={side} name={"STEP12_UNIT_" + side} position={position} rotation={rotation}>
      {piece("L_" + side as StepTwelvePart)}
      {piece("PIN_" + side as StepTwelvePart)}
      {piece("BUSHING_" + side as StepTwelvePart)}
      {highlighted && (phase === 1 || (phase === 2 ? side === "A" : side === "B")) &&
        <group position={[0, -3, 0.57]}>
          <mesh><torusGeometry args={[0.34, 0.05, 10, 36]} />
            <meshBasicMaterial color="#ffbe3d" depthTest={false} /></mesh>
          <Text position={[0, -0.7, 0.04]} fontSize={0.29} color="#7b4500"
            anchorX="center" outlineWidth={0.02} outlineColor="#ffffff">
            {"Hole " + STEP_TWELVE_HOLE}
          </Text>
        </group>}
    </group>;
  }
  return <>
    <color attach="background" args={["#f5f7fc"]} />
    <ambientLight intensity={1.2} />
    <hemisphereLight args={["#ffffff", "#c6d1e0", 1.25]} />
    <directionalLight position={[9, -8, 15]} intensity={1.8} />
    <directionalLight position={[-5, 6, -12]} intensity={0.9} />
    <gridHelper args={[26, 26, "#dbe4ef", "#edf1f8"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -3.2]} />
    {unit("A")}
    {unit("B")}
    <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.1}
      enablePan={false} minDistance={7} maxDistance={52}
      onStart={() => { cameraMove.current = null; }} />
  </>;
}
export type StepTwelveSceneProps = {
  phase: number;
  paused: boolean;
  replayKey: number;
  resetCameraKey: number;
  reducedMotion: boolean;
  view: StepTwelveView;
  onMotionComplete: () => void;
};
export function StepTwelveScene(props: StepTwelveSceneProps) {
  return <Canvas dpr={[1, 1.7]}
    camera={{ position: [9, -13, 15], fov: 44, near: 0.1, far: 120 }}
    gl={{ antialias: true, powerPreference: "high-performance" }}>
    <Suspense fallback={<Html center><div className="rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-700">Loading Step 12 STL components…</div></Html>}>
      <StepTwelveStage {...props} />
    </Suspense>
  </Canvas>;
}
