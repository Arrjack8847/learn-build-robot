import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Euler, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type StepThreeConfig = {
  firstHole: number;
  longConnector: "long" | "pinLong";
};

export type StepThreePartId =
  | "beam15" | "longPinA" | "longPinB"
  | "leftL" | "rightL" | "leftLPin" | "rightLPin"
  | "mediumAxle" | "axleConnector";

export type PartTransform = { position: [number, number, number]; rotation: [number, number, number] };

const ROOT = "/marksmanship/models/";
const PATHS = [
  ROOT + "beam15.stl",
  ROOT + "beam-l-small.stl",
  ROOT + "connector-long.stl",
  ROOT + "pin-long-pin.stl",
  ROOT + "pin-pin.stl",
  ROOT + "axle-middle.stl",
  ROOT + "axle-connector.stl",
];

const HOLE_PITCH_MM = 8;
const holeX = (index: number) => index - 7;
const LEFT_L: [number, number, number] = [-4.1, -3.15, 0];
const RIGHT_L: [number, number, number] = [4.1, -3.15, 0];
const LEFT_ANGLE = 0;
const RIGHT_ANGLE = 0;

function lPinAt(origin: [number, number, number], angle: number) {
  // Original L-beam STL: corner (0, 0) mm; short arm's free-end hole (8, 0) mm.
  // Geometry is uniformly scaled to 8 mm per world unit.
  const local = new Vector3(1, 0, 0);
  local.applyEuler(new Euler(0, 0, angle));
  return new Vector3(...origin).add(local);
}

function poses(phase: number, config: StepThreeConfig): Record<StepThreePartId, PartTransform> {
  const first = holeX(config.firstHole);
  const second = holeX(config.firstHole + 1);
  const lp = lPinAt(LEFT_L, LEFT_ANGLE);
  const rp = lPinAt(RIGHT_L, RIGHT_ANGLE);
  const getPos = (vector: Vector3): [number, number, number] => [vector.x, vector.y, vector.z];
  const zRotation = (angle: number): [number, number, number] => [0, 0, angle];
  return {
    beam15: { position: [0, 0, 0], rotation: [0, 0, 0] },
    longPinA: { position: [first, 0, phase >= 1 ? 0 : 2.8], rotation: [0, 0, 0] },
    longPinB: { position: [second, 0, phase >= 2 ? 0 : 2.8], rotation: [0, 0, 0] },
    leftL: { position: LEFT_L, rotation: zRotation(LEFT_ANGLE) },
    rightL: { position: RIGHT_L, rotation: zRotation(RIGHT_ANGLE) },
    leftLPin: { position: getPos(lp.clone().add(new Vector3(0, 0, phase >= 3 ? 0 : 2.4))), rotation: [0, 0, 0] },
    rightLPin: { position: getPos(rp.clone().add(new Vector3(0, 0, phase >= 4 ? 0 : 2.4))), rotation: [0, Math.PI, 0] },
    mediumAxle: { position: [-1.8, 3.1, 0], rotation: [0, 0, 0] },
    axleConnector: { position: [4.8, 3.1, 0], rotation: [0, Math.PI / 2, 0] },
  };
}

/** Millimetre-based, stable assembly poses for the future Step 4 module. */
export function getPreparedStepThreeTransforms(config: StepThreeConfig) {
  return {
    version: 1,
    units: "8 mm per world unit",
    models: {
      beam15: "beam15.stl",
      longPinA: config.longConnector === "long" ? "connector-long.stl" : "pin-long-pin.stl",
      longPinB: config.longConnector === "long" ? "connector-long.stl" : "pin-long-pin.stl",
      leftL: "beam-l-small.stl",
      rightL: "beam-l-small.stl",
      leftLPin: "pin-pin.stl",
      rightLPin: "pin-pin.stl",
      mediumAxle: "axle-middle.stl",
      axleConnector: "axle-connector.stl",
    },
    selectedHoles: {
      beam: [config.firstHole + 1, config.firstHole + 2],
      l: "short arm free-end hole (x=8 mm, y=0 mm)",
    },
    transforms: poses(7, config),
    // Remains false until the physical photo/manual comparison is performed.
    mechanicallyVerified: false,
    step4Applied: false,
  };
}

function preparedGeometry(source: BufferGeometry, anchor: "beam" | "lBeam" | "center"): BufferGeometry {
  const copy = source.clone();
  copy.computeBoundingBox();
  const bounds = copy.boundingBox!;
  if (anchor === "beam") {
    // Verified STL: holes at x = 0, 8, ... 112 mm; through-thickness z = 0 .. 7.8.
    copy.translate(-56, -3.65, -3.9);
  } else if (anchor === "lBeam") {
    // Verified STL: corner hole x=0,y=0; other holes on x=8 and y=-8,-16,-24.
    copy.translate(0, 0, -4);
  } else {
    const center = bounds.getCenter(new Vector3());
    copy.translate(-center.x, -center.y, -center.z);
  }
  copy.scale(1 / HOLE_PITCH_MM, 1 / HOLE_PITCH_MM, 1 / HOLE_PITCH_MM);
  copy.computeVertexNormals();
  return copy;
}

const MOVING: StepThreePartId[] = ["longPinA", "longPinB", "leftLPin", "rightLPin"];

function focusFor(phase: number, config: StepThreeConfig): Vector3 {
  if (phase === 1) return new Vector3(holeX(config.firstHole), 0, 0);
  if (phase === 2) return new Vector3(holeX(config.firstHole + 1), 0, 0);
  if (phase === 3) return lPinAt(LEFT_L, LEFT_ANGLE);
  if (phase === 4) return lPinAt(RIGHT_L, RIGHT_ANGLE);
  if (phase === 5) return new Vector3(-1.8, 3.1, 0);
  if (phase === 6) return new Vector3(4.8, 3.1, 0);
  return new Vector3(0, 0, 0);
}

function ModelStage({
  phase, paused, replayKey, resetCameraKey, config, onMotionComplete,
}: {
  phase: number;
  paused: boolean;
  replayKey: number;
  resetCameraKey: number;
  config: StepThreeConfig;
  onMotionComplete: () => void;
}) {
  const sources = useLoader(STLLoader, PATHS);
  const geometry = useMemo(() => ({
    beam: preparedGeometry(sources[0]!, "beam"),
    lBeam: preparedGeometry(sources[1]!, "lBeam"),
    long: preparedGeometry(sources[2]!, "center"),
    pinLong: preparedGeometry(sources[3]!, "center"),
    pin: preparedGeometry(sources[4]!, "center"),
    axle: preparedGeometry(sources[5]!, "center"),
    axleConnector: preparedGeometry(sources[6]!, "center"),
  }), [sources]);
  const connectorGeometry = config.longConnector === "long" ? geometry.long : geometry.pinLong;
  const controls = useRef<OrbitControlsImpl>(null);
  const completed = useRef(onMotionComplete);
  completed.current = onMotionComplete;
  const moving = useRef<Partial<Record<StepThreePartId, Group>>>({});
  const axleRef = useRef<Group>(null);
  const axleConnectorRef = useRef<Group>(null);
  const inspectionClock = useRef(0);
  const cameraTravel = useRef<{
    elapsed: number; fromTarget: Vector3; toTarget: Vector3;
    fromPosition: Vector3; toPosition: Vector3;
  } | null>(null);
  const initialized = useRef(false);
  const previous = useRef({ phase, replayKey, configKey: "" });
  const travel = useRef<{
    elapsed: number;
    duration: number;
    from: Record<string, Vector3>;
    to: Record<string, Vector3>;
  } | null>(null);
  const configKey = [config.firstHole, config.longConnector].join(":");

  useLayoutEffect(() => {
    const next = poses(phase, config);
    const change = previous.current;
    const configChanged = change.configKey !== "" && configKey !== change.configKey;
    if (!initialized.current || configChanged) {
      for (const part of MOVING) moving.current[part]?.position.set(...next[part].position);
      travel.current = null;
      initialized.current = true;
    } else if (phase !== change.phase || replayKey !== change.replayKey) {
      const replay = phase === change.phase;
      const start = replay ? poses(Math.max(0, phase - 1), config) : null;
      const from: Record<string, Vector3> = {};
      const to: Record<string, Vector3> = {};
      for (const part of MOVING) {
        const item = moving.current[part];
        if (!item) continue;
        if (start) item.position.set(...start[part].position);
        from[part] = item.position.clone();
        to[part] = new Vector3(...next[part].position);
      }
      travel.current = {
        elapsed: 0, duration: phase === 0 ? 1 : 1.5, from, to,
      };
    }
    previous.current = { phase, replayKey, configKey };
  }, [phase, replayKey, configKey, config]);

  useLayoutEffect(() => {
    const current = controls.current;
    if (!current) return;
    const target = focusFor(phase, config);
    const direction = current.object.position.clone().sub(current.target).normalize();
    const distance = phase >= 1 && phase <= 4 ? 16 : phase === 5 || phase === 6 ? 12 : 27;
    cameraTravel.current = {
      elapsed: 0,
      fromTarget: current.target.clone(),
      toTarget: target,
      fromPosition: current.object.position.clone(),
      toPosition: target.clone().addScaledVector(direction, distance),
    };
  }, [phase, configKey, config]);

  useLayoutEffect(() => {
    controls.current?.reset();
    cameraTravel.current = null;
  }, [resetCameraKey]);

  useFrame((state, delta) => {
    if (paused) return;
    const dt = Math.min(delta, 0.08);
    const cameraAnimation = cameraTravel.current;
    if (cameraAnimation && controls.current) {
      cameraAnimation.elapsed = Math.min(0.9, cameraAnimation.elapsed + dt);
      const q = cameraAnimation.elapsed / 0.9;
      const smooth = q * q * (3 - 2 * q);
      controls.current.target.lerpVectors(cameraAnimation.fromTarget, cameraAnimation.toTarget, smooth);
      state.camera.position.lerpVectors(cameraAnimation.fromPosition, cameraAnimation.toPosition, smooth);
      controls.current.update();
      if (q >= 1) cameraTravel.current = null;
    }
    const animation = travel.current;
    if (animation) {
      animation.elapsed = Math.min(animation.duration, animation.elapsed + dt);
      const t = animation.elapsed / animation.duration;
      const eased = t * t * (3 - 2 * t);
      for (const part of MOVING) {
        const item = moving.current[part], from = animation.from[part], to = animation.to[part];
        if (item && from && to) item.position.lerpVectors(from, to, eased);
      }
      if (t >= 1) { travel.current = null; completed.current(); }
    }
    inspectionClock.current += dt;
    if (axleRef.current) axleRef.current.rotation.x = phase === 5 ? Math.sin(inspectionClock.current * 1.3) * 0.35 : 0;
    if (axleConnectorRef.current) axleConnectorRef.current.rotation.x = phase === 6 ? Math.sin(inspectionClock.current * 1.3) * 0.35 : 0;
  });

  const positions = poses(phase, config);
  const activeBeamHole = phase === 1 ? config.firstHole : phase === 2 ? config.firstHole + 1 : -1;
  const activeL = phase === 3 ? "left" : phase === 4 ? "right" : null;
  const lSpotL = lPinAt(LEFT_L, LEFT_ANGLE);
  const lSpotR = lPinAt(RIGHT_L, RIGHT_ANGLE);

  return (
    <>
      <color attach="background" args={["#f8fbfd"]} />
      <ambientLight intensity={1.7} />
      <hemisphereLight args={["#ffffff", "#c5d3dd", 2.2]} />
      <directionalLight position={[6, 10, 13]} intensity={2.1} />
      <directionalLight position={[-8, -4, 5]} intensity={0.8} />
      <mesh position={[0, 0, -2.2]} receiveShadow>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#eff4f8" roughness={1} />
      </mesh>
      <gridHelper args={[24, 24, "#d3e0ea", "#e2eaf0"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2.15]} />

      <mesh geometry={geometry.beam} castShadow receiveShadow>
        <meshStandardMaterial color="#e7e9eb" metalness={0.15} roughness={0.65} />
      </mesh>
      {[...Array(15)].map((_, i) => (
        <mesh key={i} position={[holeX(i), 0, 0.51]}>
          <torusGeometry args={[0.31, i === activeBeamHole ? 0.065 : 0.017, 8, 28]} />
          <meshBasicMaterial color={i === activeBeamHole ? "#f59e0b" : "#7f97a6"} transparent opacity={i === activeBeamHole ? 0.95 : 0.32} depthTest={false} />
        </mesh>
      ))}
      {activeBeamHole >= 0 && (
        <Line points={[[holeX(activeBeamHole), 0, 0.55], [holeX(activeBeamHole), 0, 3.5]]} color="#f59e0b" lineWidth={2} dashed dashSize={0.15} gapSize={0.13} />
      )}

      {(["longPinA", "longPinB"] as const).map((part) => (
        <group key={part} ref={(node) => { if (node) moving.current[part] = node; }}>
          <mesh geometry={connectorGeometry} castShadow>
            <meshStandardMaterial color="#3b4653" metalness={0.1} roughness={0.62} />
          </mesh>
        </group>
      ))}

      <group position={LEFT_L} rotation={[0, 0, LEFT_ANGLE]}>
        <mesh geometry={geometry.lBeam} castShadow receiveShadow>
          <meshStandardMaterial color="#e3e8ec" metalness={0.08} roughness={0.68} />
        </mesh>
      </group>
      <group position={RIGHT_L} rotation={[0, 0, RIGHT_ANGLE]}>
        <mesh geometry={geometry.lBeam} castShadow receiveShadow>
          <meshStandardMaterial color="#e3e8ec" metalness={0.08} roughness={0.68} />
        </mesh>
      </group>
      {activeL && (
        <mesh position={[activeL === "left" ? lSpotL.x : lSpotR.x, activeL === "left" ? lSpotL.y : lSpotR.y, 0.54]}>
          <torusGeometry args={[0.33, 0.065, 10, 36]} />
          <meshBasicMaterial color="#f59e0b" depthTest={false} />
        </mesh>
      )}
      {(["leftLPin", "rightLPin"] as const).map((part) => (
        <group key={part} rotation={positions[part].rotation} ref={(node) => { if (node) moving.current[part] = node; }}>
          <mesh geometry={geometry.pin} castShadow>
            <meshStandardMaterial color="#3e4b5a" roughness={0.56} />
          </mesh>
        </group>
      ))}
      {activeL && (
        <Line points={[
          [activeL === "left" ? lSpotL.x : lSpotR.x, activeL === "left" ? lSpotL.y : lSpotR.y, 0.6],
          [activeL === "left" ? lSpotL.x : lSpotR.x, activeL === "left" ? lSpotL.y : lSpotR.y, 3.2],
        ]} color="#f59e0b" lineWidth={2} dashed />
      )}

      <group ref={axleRef} position={positions.mediumAxle.position} rotation={positions.mediumAxle.rotation}>
        <mesh geometry={geometry.axle} castShadow>
          <meshStandardMaterial color={phase === 5 ? "#de932b" : "#67798a"} roughness={0.53} />
        </mesh>
      </group>
      <group ref={axleConnectorRef} position={positions.axleConnector.position} rotation={positions.axleConnector.rotation}>
        <mesh geometry={geometry.axleConnector} castShadow>
          <meshStandardMaterial color={phase === 6 ? "#de932b" : "#3d4a56"} roughness={0.58} />
        </mesh>
      </group>
      <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.075} enablePan maxDistance={42} minDistance={9} onStart={() => { cameraTravel.current = null; }} autoRotate={false} autoRotateSpeed={0.35} />
    </>
  );
}

export function StepThreeScene({
  phase, paused, replayKey, resetCameraKey, config, onMotionComplete,
}: {
  phase: number;
  paused: boolean;
  replayKey: number;
  resetCameraKey: number;
  config: StepThreeConfig;
  onMotionComplete: () => void;
}) {
  return (
    <Canvas
      aria-label="Interactive 3D assembly of the Marksmanship robot Step 3"
      camera={{ position: [10, 11, 24], fov: 46, near: 0.1, far: 120 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ height: "100%", width: "100%", touchAction: "none" }}
    >
      <Suspense fallback={null}>
        <ModelStage phase={phase} paused={paused} replayKey={replayKey} resetCameraKey={resetCameraKey} config={config} onMotionComplete={onMotionComplete} />
      </Suspense>
    </Canvas>
  );
}
