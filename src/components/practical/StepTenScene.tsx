import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Text } from "@react-three/drei";
import { BufferGeometry, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { motionEase, motionGuidedPose, motionLerp } from "./marksmanLessonMotion";
import {
  STEP_TEN_ACTIVE_PART, STEP_TEN_FINAL_PHASE, STEP_TEN_MODELS, STEP_TEN_PARTS,
  STEP_TEN_BLACK_BRIDGE_CENTER_Z, STEP_TEN_BEAM_HALF_DEPTH,
  stepTenHighlight, stepTenPoses, whiteHoleX,
  type StepTenModel, type StepTenPart, type StepTenPose, type Vec3,
} from "./stepTenGeometry";

import beam15Url from "../../../3D for marksman/beams/15 beams.stl?url";
import beam9Url from "../../../3D for marksman/beams/9.stl?url";
import beam3Url from "../../../3D for marksman/beams/3.stl?url";
import blueUrl from "../../../3D for marksman/connector/long connector.stl?url";
import blackUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

const SOURCES = [beam15Url, beam9Url, beam3Url, blueUrl, blackUrl];
type View = "iso" | "top" | "front" | "back";
type Movement = {
  from: Record<StepTenPart, StepTenPose>;
  to: Record<StepTenPart, StepTenPose>;
  elapsed: number;
  duration: number;
  target: StepTenPart | null;
  phase: number;
  reverse: boolean;
};
type CameraFlight = { from: Vector3; to: Vector3; focusFrom: Vector3; focusTo: Vector3; elapsed: number };

function normalize(source: BufferGeometry, expectedLength: number | null, expectedPinHeight: number | null, label: string) {
  const geometry = source.clone();
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const dimensions = box.getSize(new Vector3());
  if (expectedLength !== null && Math.abs(dimensions.x - expectedLength) > 1.2)
    throw Error(label + " STL length does not match the 8 mm hole pitch.");
  if (expectedPinHeight !== null && Math.abs(dimensions.z - expectedPinHeight) > 2)
    throw Error(label + " connector axis is not the expected +Z axis.");
  const center = box.getCenter(new Vector3());
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.scale(1 / 8, 1 / 8, 1 / 8);
  geometry.computeVertexNormals();
  return geometry;
}
const lerpPose = (a: StepTenPose, b: StepTenPose, t: number): StepTenPose => ({
  position: motionLerp(a.position, b.position, t),
  rotation: motionLerp(a.rotation, b.rotation, t),
});
function guided(from: StepTenPose, to: StepTenPose, t: number, phase: number, part: StepTenPart): StepTenPose {
  // Backwards playback traverses the same center-aligned clearance waypoint.
  if (part === "BRIDGE_3" && phase === 17) return lerpPose(from, to, t);
  // Blue Hole 1 and BLACK Hole 3 insert from below the white rail.
  // BLACK Hole 15 and BLUE Hole 6/12 insert from ABOVE, toward the
  // +Z grey side. The complete brown stopper and its black connector
  // enter center bridge Hole 2 FROM BELOW, toward the robot interior.
  // Reversed actions use the same straight, hole-coaxial clearance path.
  const fromBelow = part === "BLUE_A_1" || part === "BLUE_B_1" ||
    part === "BLACK_A_3" || part === "BLACK_B_3" ||
    (phase === 18 && part === "CENTER_BLACK") ||
    (phase === 19 && (part === "CENTER_BLACK" || part === "BROWN_SPACER"));
  const offset = fromBelow ? -2.25 : 2.25;
  const aligned: StepTenPose = {
    position: [to.position[0], to.position[1], to.position[2] + offset],
    rotation: to.rotation,
  };
  return motionGuidedPose(from, aligned, to, t, 0.42);
}
function targetFocus(phase: number): Vec3 {
  if (phase === 0 || phase >= 15) return [0, 0, 0];
  const active = STEP_TEN_ACTIVE_PART[phase];
  const unit = phase <= 7 ? "A" : "B";
  const y = unit === "A" ? -4 : 4;
  const hole = active?.endsWith("_15") ? 15 : active?.endsWith("_12") ? 12 :
    active?.endsWith("_6") ? 6 : active?.endsWith("_3") ? 3 :
    active?.endsWith("_1") ? 1 : 8;
  return [whiteHoleX(hole) * 0.38, y * 0.55, 0.3];
}
function viewOffset(view: View, mobile: boolean, phase: number): Vec3 {
  const k = mobile ? 1.45 : 1.12;
  // Hole 1 blue and Hole 3 black insert FROM BELOW; the camera reveals -Z
  // without flipping the beams, hiding pins, or changing source meshes.
  if (view === "iso" && (phase === 2 || phase === 9 || phase === 5 || phase === 12 ||
      phase === 18 || phase === 19 || phase === 20))
    return [11 * k, -14 * k, -14 * k];
  if (view === "top") return [0.01, -0.01, 21 * k];
  if (view === "front") return [0.01, -18 * k, 5 * k];
  if (view === "back") return [0.01, 18 * k, 5 * k];
  return [11 * k, -17 * k, 16 * k];
}
function HoleGuide({ phase }: { phase: number }) {
  const focus = stepTenHighlight(phase);
  if (!focus) return null;
  const y = focus.unit === "A" ? -4 : 4;
  const z = focus.face > 0 ? 0.57 : -0.57;
  return <group>
    {focus.holes.map((hole) =>
      <group key={hole} position={[whiteHoleX(hole), y, phase === 7 || phase === 14 ? 1.72 : z]}>
        <mesh>
          <torusGeometry args={[0.32, 0.055, 9, 36]} />
          <meshBasicMaterial color="#efad26" depthTest={false} />
        </mesh>
        <Text position={[0, -0.73, 0.08]} fontSize={0.31} color="#8b4c00"
          anchorX="center" outlineWidth={0.025} outlineColor="#ffffff">
          {"Hole " + hole}
        </Text>
      </group>
    )}
  </group>;
}
function Spacer() {
  // This brown bushing has no verified standalone source STL. The shape is a
  // clearly marked procedural teaching approximation, not altered kit geometry.
  return <group name="BROWN_SPACER_VISUAL">
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.40, 0.40, 0.90, 32]} />
      <meshStandardMaterial color="#99816a" metalness={0.05} roughness={0.68} />
    </mesh>
    <mesh position={[0, 0, 0.455]}>
      <circleGeometry args={[0.235, 32]} />
      <meshStandardMaterial color="#25292d" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0, 0.46]}>
      <torusGeometry args={[0.29, 0.055, 8, 32]} />
      <meshStandardMaterial color="#ac9177" roughness={0.75} />
    </mesh>
  </group>;
}
function Stage({ phase, replayKey, paused, resetCameraKey, reducedMotion, view, onMotionComplete }: {
  phase: number; replayKey: number; paused: boolean; resetCameraKey: number;
  reducedMotion: boolean; view: View; onMotionComplete: () => void;
}) {
  const loaded = useLoader(STLLoader, SOURCES);
  const geometry = useMemo(() => ({
    white: normalize(loaded[0]!, 119.3, null, "15-hole beam"),
    gray: normalize(loaded[1]!, 71.3, null, "9-hole beam"),
    three: normalize(loaded[2]!, 23.3, null, "3-hole beam"),
    blue: normalize(loaded[3]!, null, 24, "blue long pin"),
    black: normalize(loaded[4]!, null, 16, "black double pin"),
  }), [loaded]);
  const nodes = useRef<Partial<Record<StepTenPart, Group>>>({});
  const motion = useRef<Movement | null>(null);
  const cameraFlight = useRef<CameraFlight | null>(null);
  const orbit = useRef<OrbitControlsImpl>(null);
  const previous = useRef({ phase, replayKey });
  const mounted = useRef(false);
  const firstCamera = useRef(true);
  const previousReset = useRef(resetCameraKey);
  const callback = useRef(onMotionComplete);
  callback.current = onMotionComplete;
  const { camera, size } = useThree();
  const mobile = size.width / Math.max(size.height, 1) < 0.9;
  const starting = useMemo(() => stepTenPoses(phase), []);

  useLayoutEffect(() => {
    const before = previous.current;
    const replaying = before.replayKey !== replayKey;
    const changed = before.phase !== phase || replaying;
    if (!changed && mounted.current) return;
    const prior = replaying ? Math.max(0, phase - 1) : before.phase;
    const from = stepTenPoses(prior);
    const to = stepTenPoses(phase);
    const target = STEP_TEN_ACTIVE_PART[replaying ? phase : Math.max(prior, phase)] ?? null;
    const running = mounted.current && changed && !reducedMotion && Math.abs(prior - phase) <= 1;
    for (const id of STEP_TEN_PARTS) {
      const node = nodes.current[id];
      if (!node) continue;
      const initial = running ? from[id] : to[id];
      node.position.set(...initial.position);
      node.rotation.set(...initial.rotation);
    }
    motion.current = running ? {
      from, to, elapsed: 0, duration: phase === 7 || phase === 14 || phase === 17 || phase === 19 ? 1.8 : 1.35,
      target, phase: replaying ? phase : Math.max(prior, phase), reverse: prior > phase,
    } : null;
    previous.current = { phase, replayKey };
    mounted.current = true;
    if (!running) callback.current();
  }, [phase, replayKey, reducedMotion]);

  useLayoutEffect(() => {
    const focus = new Vector3(...targetFocus(phase));
    const offset = new Vector3(...viewOffset(view, mobile, phase));
    const desired = focus.clone().add(offset);
    camera.up.set(0, 0, 1);
    if (!orbit.current) return;
    const explicitReset = previousReset.current !== resetCameraKey;
    previousReset.current = resetCameraKey;
    if (firstCamera.current || reducedMotion || explicitReset) {
      camera.position.copy(desired);
      orbit.current.target.copy(focus);
      cameraFlight.current = null;
      orbit.current.update();
    } else {
      cameraFlight.current = {
        from: camera.position.clone(), to: desired,
        focusFrom: orbit.current.target.clone(), focusTo: focus, elapsed: 0,
      };
    }
    firstCamera.current = false;
  }, [phase, view, mobile, resetCameraKey, camera, reducedMotion]);

  useFrame((state, rawDelta) => {
    if (paused) return;
    const delta = Math.min(rawDelta, 0.06);
    const moving = motion.current;
    if (moving) {
      moving.elapsed = Math.min(moving.duration, moving.elapsed + delta);
      const t = moving.elapsed / moving.duration;
      for (const id of STEP_TEN_PARTS) {
        const node = nodes.current[id];
        if (!node) continue;
        let result = lerpPose(moving.from[id], moving.to[id], t);
        if (id === moving.target && moving.phase !== 16 && moving.phase !== 17) {
          result = moving.reverse
            ? guided(moving.to[id], moving.from[id], 1 - t, moving.phase, id)
            : guided(moving.from[id], moving.to[id], t, moving.phase, id);
        }
        // The prepared stopper and pin travel UP from inside (-Z).
        if (moving.phase === 19 && id === "CENTER_BLACK") {
          result = moving.reverse
            ? guided(moving.to[id], moving.from[id], 1 - t, 19, id)
            : guided(moving.from[id], moving.to[id], t, 19, id);
        }
        node.position.set(...result.position);
        node.rotation.set(...result.rotation);
      }
      if (moving.elapsed >= moving.duration) {
        motion.current = null;
        callback.current();
      }
    }
    const flight = cameraFlight.current;
    if (flight) {
      flight.elapsed = Math.min(1, flight.elapsed + delta / 0.8);
      const t = motionEase(flight.elapsed);
      state.camera.position.lerpVectors(flight.from, flight.to, t);
      orbit.current?.target.lerpVectors(flight.focusFrom, flight.focusTo, t);
      if (flight.elapsed >= 1) cameraFlight.current = null;
    }
    orbit.current?.update();
  });

  const colours: Record<StepTenModel, string> = {
    white: "#f7f5ef", gray: "#9695a7", blue: "#1764ce",
    black: "#22232a", three: "#242327", spacer: "#a18469",
  };
  return <>
    <color attach="background" args={["#f4f8fc"]} />
    <ambientLight intensity={1.25} />
    <hemisphereLight args={["#ffffff", "#bdcddd", 1.35]} />
    <directionalLight position={[7, -6, 14]} intensity={2} />
    <gridHelper args={[32, 32, "#dbe7ee", "#edf1f6"]}
      rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2.6]}
      visible={![2, 5, 9, 12, 18, 19, 20].includes(phase)} />
    {STEP_TEN_PARTS.map((id) => {
      const model = STEP_TEN_MODELS[id];
      return <group key={id} name={"STEP10_" + id}
        ref={node => { if (node) nodes.current[id] = node; }}
        position={starting[id].position} rotation={starting[id].rotation}>
        {model === "spacer" ? <group rotation={[0, Math.PI, 0]}><Spacer /></group> :
          <mesh geometry={geometry[model]}>
            <meshStandardMaterial color={colours[model]} roughness={0.53} metalness={0.02} />
          </mesh>}
      </group>;
    })}
    <HoleGuide phase={phase} />
    {phase === 16 || phase === 17 ? <group position={[7, 0, 0.60]}>
      {([-1, 1] as const).map(y => <mesh key={y} position={[0, y, 0]}>
        <torusGeometry args={[0.31, 0.05, 8, 32]} />
        <meshBasicMaterial color="#e9a31a" depthTest={false} />
      </mesh>)}
    </group> : null}
    {phase === 19 ? <mesh position={[7, 0, STEP_TEN_BLACK_BRIDGE_CENTER_Z - STEP_TEN_BEAM_HALF_DEPTH - 0.06]}>
      <torusGeometry args={[0.31, 0.055, 8, 32]} />
      <meshBasicMaterial color="#e9a31a" depthTest={false} />
    </mesh> : null}
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.10}
      onStart={() => { cameraFlight.current = null; }}
      minDistance={8} maxDistance={58} enablePan={false} />
  </>;
}
export function StepTenScene(props: {
  phase: number; replayKey: number; paused: boolean; resetCameraKey: number;
  reducedMotion: boolean; view: View; onMotionComplete: () => void;
}) {
  return <Canvas dpr={[1, 1.8]}
    camera={{ position: [14, -19, 19], fov: 42, near: 0.1, far: 140 }}
    gl={{ antialias: true, powerPreference: "high-performance" }}>
    <Suspense fallback={<Html center><div className="rounded-xl bg-white p-3 text-xs font-semibold text-slate-600">Loading actual robot parts…</div></Html>}>
      <Stage {...props} />
    </Suspense>
  </Canvas>;
}
