import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import { Component, Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  BEAM_THICKNESS_MM, DEFAULT_FRAME_CONFIG, INSERTING_PART, PART_IDS,
  PHASE_DURATION, PITCH_MM, crossbeamHole, frameFocus, framePoses,
  longPinAnchor, railHole,
} from "./marksmanFrameGeometry";
import type { FrameConfig, FramePartId, Pose, Pt3 } from "./marksmanFrameGeometry";

// Vite fingerprints the unmodified source STLs; no boxes or generated proxy meshes.
import beam7Url from "../../../3D for marksman/beams/7.stl?url";
import beam5Url from "../../../3D for marksman/beams/5.stl?url";
import beam15Url from "../../../3D for marksman/beams/15 beams.stl?url";
import longUrl from "../../../3D for marksman/connector/long connector.stl?url";
import pinLongUrl from "../../../3D for marksman/connector/pin_long_pin.stl?url";
import blackUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

const URLS = [beam7Url, beam5Url, beam15Url, longUrl, pinLongUrl, blackUrl];
type Models = Record<FramePartId, BufferGeometry>;
type Poses = Record<FramePartId, Pose>;
type Travel = { from: Poses; to: Poses; duration: number; elapsed: number; inserting: FramePartId | undefined; reverse: boolean };
type CameraTravel = {
  from: Vector3; to: Vector3; fromTarget: Vector3; toTarget: Vector3;
  elapsed: number; duration: number;
};

function normalizedMesh(source: BufferGeometry, expectedX: number | null, expectedZ: number | null, name: string) {
  const mesh = source.clone();
  mesh.computeBoundingBox();
  const bounds = mesh.boundingBox!;
  const size = bounds.getSize(new Vector3());
  // Fail openly on incompatible source models instead of distorting individual parts.
  if ((expectedX !== null && Math.abs(size.x - expectedX) > 0.65) ||
      (expectedZ !== null && Math.abs(size.z - expectedZ) > 0.65)) {
    throw new Error(name + " STL dimensions do not match the expected hole-pitch/connector geometry.");
  }
  const center = bounds.getCenter(new Vector3());
  mesh.translate(-center.x, -center.y, -center.z);
  mesh.scale(1 / PITCH_MM, 1 / PITCH_MM, 1 / PITCH_MM);
  mesh.computeVertexNormals();
  return mesh;
}
const ease = (x: number) => x * x * (3 - 2 * x);
function blend(a: Pose, b: Pose, t: number): Pose {
  const f = ease(Math.max(0, Math.min(1, t)));
  return {
    position: [
      a.position[0] + (b.position[0] - a.position[0]) * f,
      a.position[1] + (b.position[1] - a.position[1]) * f,
      a.position[2] + (b.position[2] - a.position[2]) * f,
    ],
    rotation: [
      a.rotation[0] + (b.rotation[0] - a.rotation[0]) * f,
      a.rotation[1] + (b.rotation[1] - a.rotation[1]) * f,
      a.rotation[2] + (b.rotation[2] - a.rotation[2]) * f,
    ],
  };
}
function insertedTravel(a: Pose, b: Pose, amount: number, reverse: boolean): Pose {
  // Align at a clearance height first, then translate along the shared hole
  // axis with no rotation during insertion. Backward navigation reverses it.
  const seated = reverse ? a : b;
  const raised: Pose = {
    position: [seated.position[0], seated.position[1], seated.position[2] + 3],
    rotation: b.rotation,
  };
  return amount < 0.46
    ? blend(a, raised, amount / 0.46)
    : blend(raised, b, (amount - 0.46) / 0.54);
}
const ID_TO_MESH = (id: FramePartId) =>
  id.startsWith("FRAME_BEAM_7") ? "beam7" :
  id.startsWith("FRAME_BEAM_5") ? "beam5" :
  id === "FRAME_BEAM_15" ? "beam15" :
  id.startsWith("FRAME_LONG_PIN") ? "long" : "black";

function HoleMarkers({
  id, phase, config, labels,
}: { id: FramePartId; phase: number; config: FrameConfig; labels: boolean }) {
  const beam = id.startsWith("FRAME_BEAM_7") ? 7 : id.startsWith("FRAME_BEAM_5") ? 5 : id === "FRAME_BEAM_15" ? 15 : 0;
  if (!beam) return null;
  const target = (() => {
    if (id === "FRAME_BEAM_7_A" && (phase === 1 || phase === 2)) return phase === 1 ? config.firstMount : 4;
    if (id === "FRAME_BEAM_7_B" && (phase === 3 || phase === 4)) return phase === 3 ? config.firstMount : 4;
    if (id === "FRAME_BEAM_5_A" && phase === 5) return -2;
    if (id === "FRAME_BEAM_5_B" && phase === 7) return -2;
    if (id === "FRAME_BEAM_15" && (phase === 8 || phase === 9)) return config.beam15Holes[phase - 8];
    return -1;
  })();
  return (
    <group>
      {Array.from({ length: beam }, (_, i) => {
        const active = i === target || (target === -2 && (i === 0 || i === 4));
        const x = i - (beam - 1) / 2;
        return (
          <group key={i} position={[x, 0, BEAM_THICKNESS_MM / (2 * PITCH_MM) + 0.017]}>
            {(labels || active) && (
              <mesh>
                <torusGeometry args={[0.3, active ? 0.052 : 0.018, 7, 25]} />
                <meshBasicMaterial color={active ? "#f6a800" : "#4281b5"}
                  transparent opacity={active ? 1 : 0.55} depthTest={!active} />
              </mesh>
            )}
            {labels && (
              <Text position={[0, -0.57, 0.08]} fontSize={0.3} color={active ? "#b77700" : "#233c53"}
                outlineColor="#ffffff" outlineWidth={0.018} anchorX="center" anchorY="middle">
                {String(i + 1)}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}

function ModelStage({
  phase, config, replayKey, resetCameraKey, zoomKey, zoomDirection,
  paused, spin, exploded, labels, reducedMotion,
}: {
  phase: number; config: FrameConfig; replayKey: number; resetCameraKey: number;
  zoomKey: number; zoomDirection: 1 | -1; paused: boolean;
  spin: boolean; exploded: boolean; labels: boolean; reducedMotion: boolean;
}) {
  const sources = useLoader(STLLoader, URLS);
  const geometry = useMemo(() => ({
    beam7: normalizedMesh(sources[0]!, 55.3, 7.8, "7-hole beam"),
    beam5: normalizedMesh(sources[1]!, 39.3, 7.8, "5-hole beam"),
    beam15: normalizedMesh(sources[2]!, 119.3, 7.8, "15-hole beam"),
    long: normalizedMesh(sources[3]!, null, 24, "long connector"),
    pinLong: normalizedMesh(sources[4]!, null, 24, "alternate long connector"),
    black: normalizedMesh(sources[5]!, null, 16, "black connector candidate"),
  }), [sources]);
  const meshFor = (id: FramePartId): BufferGeometry => {
    const name = ID_TO_MESH(id);
    return name === "long" && config.longConnector === "pinLong"
      ? geometry.pinLong : geometry[name];
  };
  const start = useMemo(() => framePoses(phase, config, exploded), []);
  const refs = useRef<Partial<Record<FramePartId, Group>>>({});
  const orbit = useRef<OrbitControlsImpl>(null);
  const previousPhase = useRef(phase);
  const lastReplayKey = useRef(replayKey);
  const first = useRef(true);
  const movement = useRef<Travel | null>(null);
  const cameraMovement = useRef<CameraTravel | null>(null);
  const { camera } = useThree();
  const configKey = [config.firstMount, ...config.beam15Holes, config.longConnector].join(":");

  useLayoutEffect(() => {
    const target = framePoses(phase, config, exploded);
    const replaying = !first.current && replayKey !== lastReplayKey.current;
    const oldPhase = previousPhase.current;
    const reverse = phase < oldPhase;
    const from = {} as Poses;
    const replayFrom = framePoses(Math.max(0, phase - 1), config, exploded);
    for (const id of PART_IDS) {
      const obj = refs.current[id];
      const p = obj ? [obj.position.x, obj.position.y, obj.position.z] as Pt3 : target[id].position;
      const rot = obj ? [obj.rotation.x, obj.rotation.y, obj.rotation.z] as Pt3 : target[id].rotation;
      from[id] = replaying ? replayFrom[id] : { position: p, rotation: rot };
      if (replaying && obj) {
        obj.position.set(...from[id].position);
        obj.rotation.set(...from[id].rotation);
      }
    }
    const changed = !first.current;
    const activeAction = replaying ? phase : reverse ? oldPhase : phase;
    movement.current = changed && !reducedMotion
      ? { from, to: target, duration: PHASE_DURATION[activeAction] ?? 1.2,
          elapsed: 0, reverse, inserting: INSERTING_PART[activeAction] }
      : null;
    if (!movement.current) {
      for (const id of PART_IDS) {
        const obj = refs.current[id];
        obj?.position.set(...target[id].position);
        obj?.rotation.set(...target[id].rotation);
      }
    }
    const focal = new Vector3(...frameFocus(phase, config));
    const initialOverview = phase === 0 || phase === 10;
    const frameOverview = phase >= 5 && phase <= 7;
    const offset = new Vector3(
      frameOverview ? 9 : initialOverview ? 12 : 6.5,
      frameOverview ? -11 : initialOverview ? -17 : -7.5,
      frameOverview ? 16 : initialOverview ? 19 : 10.5,
    );
    const destination = focal.clone().add(offset);
    if (first.current) {
      camera.up.set(0, 0, 1);
      camera.position.copy(destination);
      orbit.current?.target.copy(focal);
      orbit.current?.update();
    } else {
      cameraMovement.current = {
        from: camera.position.clone(), to: destination,
        fromTarget: orbit.current?.target.clone() ?? focal.clone(),
        toTarget: focal,
        duration: reducedMotion ? 0 : 0.9, elapsed: 0,
      };
    }
    first.current = false;
    previousPhase.current = phase;
    lastReplayKey.current = replayKey;
  }, [phase, configKey, config, replayKey, exploded, reducedMotion, camera]);

  useLayoutEffect(() => {
    if (resetCameraKey === 0) return;
    const focus = new Vector3(...frameFocus(phase, config));
    const wide = phase === 0 || phase === 10;
    const frame = phase >= 5 && phase <= 7;
    camera.position.copy(focus).add(new Vector3(
      frame ? 9 : wide ? 12 : 6.5,
      frame ? -11 : wide ? -17 : -7.5,
      frame ? 16 : wide ? 19 : 10.5,
    ));
    orbit.current?.target.copy(focus);
    cameraMovement.current = null;
    orbit.current?.update();
  }, [resetCameraKey]); // Intentionally only executes on explicit reset action.

  useLayoutEffect(() => {
    if (zoomKey === 0 || !orbit.current) return;
    const target = orbit.current.target;
    camera.position.sub(target).multiplyScalar(zoomDirection === 1 ? 0.78 : 1.28).add(target);
    orbit.current.update();
  }, [zoomKey, zoomDirection, camera]);

  useFrame((_, delta) => {
    if (!paused) {
      const animation = movement.current;
      if (animation) {
        animation.elapsed += Math.min(delta, 0.08);
        const fraction = Math.min(1, animation.elapsed / Math.max(animation.duration, 0.01));
        for (const id of PART_IDS) {
          const obj = refs.current[id];
          if (!obj) continue;
          const movingRail = (animation.inserting === "FRAME_LONG_PIN_01" && id === "FRAME_BEAM_7_A") ||
            (animation.inserting === "FRAME_LONG_PIN_03" && id === "FRAME_BEAM_7_B");
          // The rail settles before the connector starts its downward insertion.
          const p = id === animation.inserting
            ? insertedTravel(animation.from[id], animation.to[id], fraction, animation.reverse)
            : blend(animation.from[id], animation.to[id],
                movingRail && !animation.reverse ? Math.min(1, fraction / 0.35) : fraction);
          obj.position.set(...p.position);
          obj.rotation.set(...p.rotation);
        }
        if (fraction === 1) movement.current = null;
      }
      const c = cameraMovement.current;
      if (c) {
        c.elapsed += Math.min(delta, 0.08);
        const t = c.duration ? ease(Math.min(1, c.elapsed / c.duration)) : 1;
        camera.position.lerpVectors(c.from, c.to, t);
        orbit.current?.target.lerpVectors(c.fromTarget, c.toTarget, t);
        if (t === 1) cameraMovement.current = null;
      }
    }
    orbit.current?.update();
  });

  const active = INSERTING_PART[phase];
  const destination = active ? framePoses(phase, config)[active].position : null;
  const colorFor = (id: FramePartId) => {
    if (id.startsWith("FRAME_LONG_PIN")) return "#293b56";
    if (id.startsWith("FRAME_BLACK_PIN")) return "#202b3a";
    if (id.startsWith("FRAME_BEAM_7")) return "#e8edf3";
    if (id.startsWith("FRAME_BEAM_5")) return "#b6c7dc";
    return "#e2e7ec";
  };
  return (
    <>
      <color attach="background" args={["#f5f9fd"]} />
      <ambientLight intensity={1.6} />
      <hemisphereLight args={["#ffffff", "#aec3d3", 2.0]} />
      <directionalLight position={[8, -6, 15]} intensity={2.4} />
      <gridHelper args={[28, 28, "#d4e0eb", "#e5edf4"]} rotation={[Math.PI / 2, 0, 0]} position={[1, 0, -1.2]} />
      {PART_IDS.map((id) => (
        <group key={id} ref={(node) => { if (node) refs.current[id] = node; else delete refs.current[id]; }}
          position={start[id].position} rotation={start[id].rotation}>
          <mesh geometry={meshFor(id)} castShadow>
            <meshStandardMaterial color={colorFor(id)} roughness={0.48} metalness={0.07} side={2}
              emissive={id === active ? "#563500" : "#000000"} emissiveIntensity={id === active ? 0.2 : 0} />
          </mesh>
          <HoleMarkers id={id} phase={phase} config={config} labels={labels} />
        </group>
      ))}
      {!exploded && destination && (
        <>
          <Line points={[[destination[0], destination[1], destination[2] + 3.1],
            [destination[0], destination[1], destination[2] - 0.55]]}
            color="#e5a217" lineWidth={1.8} dashed dashSize={0.16} gapSize={0.1} />
          {active === "FRAME_BEAM_5_A" || active === "FRAME_BEAM_5_B" ? (
            <>
              {(["A", "B"] as const).map((side) => {
                const h = crossbeamHole(side, active === "FRAME_BEAM_5_A" ? 0 : 1, config);
                return <Line key={side} points={[[h[0], h[1], h[2] + 3], h]}
                  color="#f6b431" dashed dashSize={0.1} gapSize={0.1} />;
              })}
            </>
          ) : null}
        </>
      )}
      <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.075}
        enablePan={false} minDistance={2.6} maxDistance={40}
        autoRotate={spin && !paused && !exploded}
        autoRotateSpeed={0.42} />
    </>
  );
}

class FrameErrorBoundary extends Component<
  { children: React.ReactNode }, { error: string | null }
> {
  override state = { error: null as string | null };
  static getDerivedStateFromError(error: Error) { return { error: error.message }; }
  override render() {
    if (this.state.error) return (
      <div role="alert" className="grid h-full place-items-center p-5 text-center text-sm text-red-800">
        3D models could not be displayed: {this.state.error}. Check the source STL files.
      </div>
    );
    return this.props.children;
  }
}

export function MarksmanFrameScene({
  phase, config = DEFAULT_FRAME_CONFIG, replayKey, resetCameraKey,
  zoomKey, zoomDirection, paused, spin, exploded, labels, reducedMotion,
}: {
  phase: number; config?: FrameConfig; replayKey: number; resetCameraKey: number;
  zoomKey: number; zoomDirection: 1 | -1; paused: boolean;
  spin: boolean; exploded: boolean; labels: boolean; reducedMotion: boolean;
}) {
  return (
    <FrameErrorBoundary>
      <Canvas aria-label="Interactive photo-based Marksmanship frame assembly 3D viewer"
        camera={{ fov: 43, near: 0.1, far: 150, position: [14, -16, 20], up: [0, 0, 1] }}
        dpr={[1, 1.6]} gl={{ antialias: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%", touchAction: "none" }}>
        <Suspense fallback={null}>
          <ModelStage phase={phase} config={config} replayKey={replayKey}
            resetCameraKey={resetCameraKey} zoomKey={zoomKey}
            zoomDirection={zoomDirection} paused={paused} spin={spin}
            exploded={exploded} labels={labels} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </FrameErrorBoundary>
  );
}
