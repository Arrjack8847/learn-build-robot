import { Component, Suspense, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { BufferGeometry, DoubleSide, Group, Matrix4, Quaternion, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { STEP5_MODEL_PATHS } from "./StepFiveScene";
import { seatedPose, type StepSixMountConfig, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import { STEP_SEVEN_FINAL_PHASE, STEP_SEVEN_RAIL_IDS, STEP_SEVEN_PIN_IDS, endPinPose, railPose, type StepSevenRailConfig } from "./stepSevenRailGeometry";
import { STEP_EIGHT_PARTS, stepEightPoses, type StepEightConfig, type StepEightPart } from "./stepEightGeometry";
import { STEP_NINE_STEP_SEVEN_YAW, STEP_NINE_STEP_EIGHT_FACE_FLIP, stepNineFramePose, stepNineMating } from "./stepNineGeometry";
import { STEP_TEN_FINAL_PHASE, STEP_TEN_MODELS, STEP_TEN_PARTS, stepTenPoses, type StepTenModel } from "./stepTenGeometry";
import { STEP_ELEVEN_STEP_NINE_MESH_HOLES, stepElevenPlacement, stepElevenPose, type V3 } from "./stepElevenGeometry";
import { motionEase, motionLerp } from "./marksmanLessonMotion";

import beam15Url from "../../../3D for marksman/beams/15 beams.stl?url";
import longPinUrl from "../../../3D for marksman/connector/long connector.stl?url";
import beam5Url from "../../../3D for marksman/beams/5.stl?url";
import beam7Url from "../../../3D for marksman/beams/7.stl?url";
import blackPinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";
import beam9Url from "../../../3D for marksman/beams/9.stl?url";
import beam3Url from "../../../3D for marksman/beams/3.stl?url";

const SOURCES = [...STEP5_MODEL_PATHS, beam15Url, longPinUrl, beam5Url, beam7Url, blackPinUrl, beam9Url, beam3Url];
const CORE_IDS = ["STEP5_HOLLOW_A", "STEP5_HOLLOW_B", "STEP5_BRIDGE_A", "STEP5_BRIDGE_B"] as const;
const CHILD_PINS: Record<(typeof CORE_IDS)[number], readonly string[]> = {
  STEP5_HOLLOW_A: ["STEP5_SHORT_PIN_01"], STEP5_HOLLOW_B: ["STEP5_SHORT_PIN_02"],
  STEP5_BRIDGE_A: ["STEP5_LONG_PIN_01", "STEP5_LONG_PIN_02"],
  STEP5_BRIDGE_B: ["STEP5_LONG_PIN_03", "STEP5_LONG_PIN_04"],
};
function normalize(source: BufferGeometry, kind: "beam11" | "bridge" | "hollow" | "center") {
  const g = source.clone();
  g.computeBoundingBox();
  if (kind === "beam11") g.translate(-40, -3.65, -3.9);
  else if (kind === "bridge") g.translate(0, -4, -3.9);
  else if (kind === "hollow") g.translate(0, 0, -4);
  else {
    const center = g.boundingBox!.getCenter(new Vector3());
    g.translate(-center.x, -center.y, -center.z);
  }
  g.scale(1 / 8, 1 / 8, 1 / 8);
  g.computeVertexNormals();
  return g;
}
function eightModel(id: StepEightPart): "five" | "seven" | "fifteen" | "blue" | "black" {
  if (id.startsWith("FIVE")) return "five";
  if (id.startsWith("SEVEN")) return "seven";
  if (id === "FIFTEEN") return "fifteen";
  return id.startsWith("BLUE") ? "blue" : "black";
}
const STEPTEN_COLORS: Record<StepTenModel, string> = {
  white: "#f7f5ef", gray: "#9695a7", blue: "#1764ce",
  black: "#22232a", three: "#242327", spacer: "#a18469",
};
// Rotation maps Step 10 local (x, y, z) to Step 9 shared (-x, z, y).
// Both black Hole 3 pins on local -Z therefore point toward Step 9 (-Y).
const STEP_TEN_JOIN_ROTATION = new Quaternion()
  .setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2)
  .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI));
const STEP_EIGHT_FINAL_ROTATION = new Quaternion()
  .setFromAxisAngle(new Vector3(1, 0, 0), STEP_NINE_STEP_EIGHT_FACE_FLIP)
  .multiply(new Quaternion().setFromRotationMatrix(new Matrix4().set(
    0, -1, 0, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0, 0, 1,
  )));

function Spacer() {
  // Kept as the same clearly illustrative bushing from Step 10.
  return <group name="STEP10_BROWN_SPACER">
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.40, 0.40, 0.90, 32]} />
      <meshStandardMaterial color="#99816a" roughness={0.68} />
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

export type StepElevenSceneProps = {
  phase: number;
  railConfig: StepSevenRailConfig;
  frameConfig: StepEightConfig;
  stepSixConfig: StepSixMountConfig;
  prepared: StepSixStepFiveTransforms;
  paused: boolean;
  replayKey: number;
  resetCameraKey: number;
  reducedMotion: boolean;
  view: "iso" | "top" | "front" | "side" | "bottom";
  onMotionComplete: () => void;
};
function Stage({ phase, railConfig, frameConfig, stepSixConfig, prepared, paused,
  replayKey, resetCameraKey, reducedMotion, view, onMotionComplete }: StepElevenSceneProps) {
  const loaded = useLoader(STLLoader, SOURCES);
  const mesh = useMemo(() => ({
    beam11: normalize(loaded[0]!, "beam11"),
    bridge: normalize(loaded[1]!, "bridge"),
    hollow: normalize(loaded[2]!, "hollow"),
    long: normalize(loaded[3]!, "center"),
    short: normalize(loaded[4]!, "center"),
    rail15: normalize(loaded[5]!, "center"),
    railBlue: normalize(loaded[6]!, "center"),
    five: normalize(loaded[7]!, "center"),
    seven: normalize(loaded[8]!, "center"),
    fifteen: normalize(loaded[5]!, "center"),
    blue: normalize(loaded[6]!, "center"),
    black: normalize(loaded[9]!, "center"),
    white: normalize(loaded[5]!, "center"),
    gray: normalize(loaded[10]!, "center"),
    three: normalize(loaded[11]!, "center"),
  }), [loaded]);
  const beamY = prepared["STEP5_BEAM_11"]?.position[1] ?? 4.1;
  const matingNine = useMemo(() =>
    stepNineMating(railConfig, stepSixConfig, beamY), [railConfig, stepSixConfig, beamY]);
  const join = useMemo(() =>
    stepElevenPlacement(railConfig, stepSixConfig, beamY), [railConfig, stepSixConfig, beamY]);
  const finishedNineFrame = useMemo(() => stepEightPoses(11, frameConfig), [frameConfig]);
  const finishedTen = useMemo(() => stepTenPoses(STEP_TEN_FINAL_PHASE), []);
  const stepTen = useRef<Group>(null);
  const orbit = useRef<OrbitControlsImpl>(null);
  const movement = useRef<{ from: V3; to: V3; elapsed: number; duration: number } | null>(null);
  const last = useRef({ phase, replayKey });
  const initialized = useRef(false);
  const motionDone = useRef(onMotionComplete);
  motionDone.current = onMotionComplete;
  const { camera, size } = useThree();
  const narrow = size.width / Math.max(1, size.height) < 0.95;
  const target = join.target;
  const position = stepElevenPose(phase, target);
  const guideVisible = phase === 1 || phase === 2;
  const nineFramePosition = stepNineFramePose(4, matingNine.target).position;

  useLayoutEffect(() => {
    const old = last.current;
    const replaying = replayKey !== old.replayKey;
    const changed = replaying || phase !== old.phase;
    const fromPhase = replaying ? Math.max(0, phase - 1) : old.phase;
    const from = stepElevenPose(fromPhase, target);
    const to = stepElevenPose(phase, target);
    const animate = initialized.current && changed && !reducedMotion &&
      Math.abs(fromPhase - phase) <= 1;
    if (stepTen.current) stepTen.current.position.set(...(animate ? from : to));
    movement.current = animate ? { from, to, elapsed: 0,
      duration: phase === 3 || fromPhase === 3 ? 2.0 : 1.65 } : null;
    // Preparation entrances move the two whole subassemblies, never their pins.
    if (!initialized.current && !reducedMotion) {
      const enter: V3 = [to[0] - 5, to[1], to[2]];
      stepTen.current?.position.set(...enter);
      movement.current = { from: enter, to, elapsed: 0, duration: 1.4 };
    }
    initialized.current = true;
    last.current = { phase, replayKey };
    if (!movement.current) motionDone.current();
  }, [phase, replayKey, reducedMotion, target[0], target[1], target[2]]);

  useLayoutEffect(() => {
    // Look at the joined holes, widening the initial camera for two separate assemblies.
    const focus = new Vector3(-(join.railX - 6) + (phase <= 1 ? 10 : 0),
      beamY - target[1], target[2]);
    const k = narrow ? 1.42 : 1;
    const expanded = phase <= 1 ? 1.20 : 1;
    const offset = view === "top" ? new Vector3(0.01, 39 * k, 0.01) :
      view === "bottom" ? new Vector3(0.01, -39 * k, 0.01) :
      view === "front" ? new Vector3(0.01, 12 * k, 42 * k) :
      view === "side" ? new Vector3(42 * k, 12 * k, 0.01) :
      new Vector3(22 * k, 29 * k, 36 * k);
    offset.multiplyScalar(expanded);
    orbit.current?.target.copy(focus);
    camera.position.copy(focus.clone().add(offset));
    orbit.current?.update();
  }, [phase, view, reducedMotion, resetCameraKey, camera, narrow, beamY, join.railX, target[1], target[2]]);

  useFrame((_, rawDelta) => {
    if (paused) return;
    const motion = movement.current;
    if (motion && stepTen.current) {
      motion.elapsed = Math.min(motion.duration, motion.elapsed + Math.min(rawDelta, 0.06));
      const t = motionEase(motion.elapsed / motion.duration);
      // Straight axial seating (Action 3): the entire Step 10 group translates
      // along shared Y while all original connector meshes stay fully opaque.
      stepTen.current.position.set(...motionLerp(motion.from, motion.to, t));
      if (motion.elapsed === motion.duration) {
        movement.current = null;
        motionDone.current();
      }
    }
    orbit.current?.update();
  });

  const preparedPin = (id: string) => {
    const saved = prepared[id];
    if (!saved) return null;
    return <group key={id} name={id} position={saved.position} rotation={saved.rotation}>
      <mesh geometry={id.includes("LONG") ? mesh.long : mesh.short}>
        <meshStandardMaterial color={id.includes("LONG") ? "#2582d7" : "#303744"} roughness={0.55} />
      </mesh>
    </group>;
  };
  return <>
    <color attach="background" args={["#f3f6fa"]} />
    <ambientLight intensity={1.12} />
    <hemisphereLight args={["#ffffff", "#c1d2e1", 1.2]} />
    <directionalLight position={[9, 16, 15]} intensity={1.7} />
    <gridHelper args={[52, 52, "#dfe7ee", "#edf1f6"]} position={[0, -5, 0]} />
    <group name="STEP11_SHARED_ASSEMBLY_SPACE" position={[0, beamY, 0]} rotation={[0, 0, Math.PI]}>
      <group name="STEP11_EXACT_STEP9_COMPLETE" rotation={[0, STEP_NINE_STEP_SEVEN_YAW, 0]}>
        <group name="STEP5_BEAM_11" position={prepared["STEP5_BEAM_11"]!.position}
          rotation={prepared["STEP5_BEAM_11"]!.rotation}>
          <mesh geometry={mesh.beam11}><meshStandardMaterial color="#97a4b4" roughness={0.63} /></mesh>
        </group>
        {CORE_IDS.map(id => {
          const pose = seatedPose(id, stepSixConfig, beamY);
          return <group key={id} name={id} position={pose.position} rotation={pose.rotation}>
            <mesh geometry={id.includes("BRIDGE") ? mesh.bridge : mesh.hollow}>
              <meshStandardMaterial color="#8d9cae" roughness={0.6} />
            </mesh>
            {CHILD_PINS[id].map(preparedPin)}
          </group>;
        })}
        {STEP_SEVEN_RAIL_IDS.map(id => {
          const pose = railPose(id, STEP_SEVEN_FINAL_PHASE, railConfig, beamY, stepSixConfig);
          return <group key={id} name={id} position={pose.position} rotation={pose.rotation}>
            <mesh geometry={mesh.rail15}>
              <meshStandardMaterial color="#e9e6df" roughness={0.65} />
            </mesh>
            {guideVisible && [STEP_ELEVEN_STEP_NINE_MESH_HOLES.blue,
              STEP_ELEVEN_STEP_NINE_MESH_HOLES.black].map(hole =>
              <mesh key={hole} name={"STEP11_RECEIVER_" + hole}
                position={[hole - 8, 0, -0.56]}>
                <torusGeometry args={[0.34, 0.065, 10, 32]} />
                <meshBasicMaterial color={hole === 13 ? "#168eea" : "#22232a"}
                  depthTest={false} side={DoubleSide} />
              </mesh>)}
          </group>;
        })}
        {STEP_SEVEN_PIN_IDS.map(id => {
          const pose = endPinPose(id, STEP_SEVEN_FINAL_PHASE, railConfig, beamY, stepSixConfig);
          return <group key={id} position={pose.position} rotation={pose.rotation}>
            <mesh geometry={mesh.railBlue}>
              <meshStandardMaterial color="#1676d5" roughness={0.5} />
            </mesh>
          </group>;
        })}
      </group>
      {/* Original Step 8 remains physically attached to Step 7 as in the saved Step 9 result. */}
      <group name="STEP11_STEP9_PREVIOUS_STEP8_FRAME"
        position={nineFramePosition} quaternion={STEP_EIGHT_FINAL_ROTATION}>
        {STEP_EIGHT_PARTS.map(id => {
          const p = finishedNineFrame[id], model = eightModel(id);
          const color = model === "blue" ? "#1576ce" : model === "black" ? "#293544" :
            model === "five" ? "#e6ebf1" : model === "seven" ? "#bac9d9" : "#f1f3f7";
          return <group key={id} name={"STEP8_" + id} position={p.position} rotation={p.rotation}>
            <mesh geometry={mesh[model]}>
              <meshStandardMaterial color={color} side={DoubleSide} roughness={0.54} />
            </mesh>
          </group>;
        })}
      </group>
      <group ref={stepTen} name="STEP11_EXACT_STEP10_COMPLETE"
        position={position} quaternion={STEP_TEN_JOIN_ROTATION}>
        {STEP_TEN_PARTS.map(id => {
          const p = finishedTen[id], model = STEP_TEN_MODELS[id];
          return <group key={id} name={"STEP10_" + id} position={p.position} rotation={p.rotation}>
            {model === "spacer" ? <Spacer /> :
              <mesh geometry={mesh[model]}>
                <meshStandardMaterial color={STEPTEN_COLORS[model]} roughness={0.53}
                  emissive={guideVisible && (id.endsWith("_1") && id.startsWith("BLUE") ||
                    id.endsWith("_3") && id.startsWith("BLACK")) ? "#154e8a" : "#000000"}
                  emissiveIntensity={guideVisible ? 0.18 : 0} />
              </mesh>}
          </group>;
        })}
      </group>
    </group>
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.09}
      minDistance={10} maxDistance={120} enablePan={false} />
  </>;
}
class ViewerErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  override state = { message: null as string | null };
  static getDerivedStateFromError(error: Error) { return { message: error.message }; }
  override render() {
    return this.state.message
      ? <div role="alert" className="grid h-full place-items-center p-4 text-sm text-red-800">
        Step 11 real-STL preview could not load: {this.state.message}
      </div>
      : this.props.children;
  }
}
export function StepElevenScene(props: StepElevenSceneProps) {
  return <ViewerErrorBoundary>
    <Canvas dpr={[1, 1.55]} camera={{ position: [24, 27, 39], fov: 44, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
      aria-label="Step 11 joins both previously completed assemblies at two blue and two black pins; middle holes remain unused">
      <Suspense fallback={<Html center><div className="rounded-xl bg-white p-3 text-xs font-semibold">Loading original kit geometry…</div></Html>}>
        <Stage {...props} />
      </Suspense>
    </Canvas>
  </ViewerErrorBoundary>;
}
