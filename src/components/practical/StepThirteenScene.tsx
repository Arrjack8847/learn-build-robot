import { useLayoutEffect, useMemo, useRef, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { BufferGeometry, DoubleSide, Group, Quaternion, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { StepElevenScene } from "./StepElevenScene";
import type { StepSixMountConfig, StepSixStepFiveTransforms } from "./StepSixGeometry";
import type { StepSevenRailConfig } from "./stepSevenRailGeometry";
import type { StepEightConfig } from "./stepEightGeometry";
import { stepElevenPlacement } from "./stepElevenGeometry";
import { motionEase, motionLerp } from "./marksmanLessonMotion";
import { STEP_TWELVE_FINAL_PHASE, stepTwelvePoses } from "./stepTwelveGeometry";
import {
  stepThirteenAnchors, stepThirteenCameraFocus, stepThirteenUnitPosition,
  type StepThirteenAnchors, type StepThirteenUnit, type V3,
} from "./stepThirteenGeometry";

import lBeamUrl from "../../../3D for marksman/beams/L/BEAM L_.stl?url";
import blackPinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

export type StepThirteenView = "iso" | "top" | "front" | "side" | "bottom";
export type StepThirteenSceneProps = {
  phase: number;
  railConfig: StepSevenRailConfig;
  frameConfig: StepEightConfig;
  stepSixConfig: StepSixMountConfig;
  prepared: StepSixStepFiveTransforms;
  paused: boolean;
  replayKey: number;
  resetCameraKey: number;
  reducedMotion: boolean;
  view: StepThirteenView;
  onMotionComplete: () => void;
};

const BASE_ORIENTATION = new Quaternion()
  .setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2)
  .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2));
// One opposite-facing L uses the Step 12 physical half-turn; its bushing
// and black pin remain on the opposite face after the rigid rotation.
const OPPOSITE_ORIENTATION = BASE_ORIENTATION.clone()
  .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI));

function originalLGeometry(source: BufferGeometry): BufferGeometry {
  // Exact same source normalization as StepTwelveScene. Its free corner hole
  // is local (0,0), while the installed black pin remains at (0,-3).
  const geometry = source.clone();
  geometry.translate(0, 0, -4);
  geometry.scale(1 / 8, 1 / 8, 1 / 8);
  geometry.computeVertexNormals();
  return geometry;
}
function originalPinGeometry(source: BufferGeometry): BufferGeometry {
  const geometry = source.clone();
  geometry.computeBoundingBox();
  const center = geometry.boundingBox!.getCenter(new Vector3());
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.scale(1 / 8, 1 / 8, 1 / 8);
  geometry.computeVertexNormals();
  return geometry;
}
function HollowBushing() {
  // Reuse the hollow teaching approximation from Step 12. The black pin
  // is always a separate, visible original STL mesh, never a fake pin cap.
  return <group name="STEP13_PREPARED_TAN_BUSHING">
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.40, 0.40, 0.92, 32, 1, true]} />
      <meshStandardMaterial color="#9c8876" side={DoubleSide} roughness={0.72} />
    </mesh>
    {([-0.46, 0.46] as const).map(z => <mesh key={z} position={[0, 0, z]}>
      <torusGeometry args={[0.325, 0.075, 10, 32]} />
      <meshStandardMaterial color="#a99482" roughness={0.69} />
    </mesh>)}
  </group>;
}
type Transition = {
  from: Record<StepThirteenUnit, V3>;
  to: Record<StepThirteenUnit, V3>;
  elapsed: number;
  duration: number;
};

function StepThirteenAttachments({ anchors, phase, paused, replayKey, reducedMotion,
  onMotionComplete }: {
  anchors: StepThirteenAnchors; phase: number; paused: boolean; replayKey: number;
  reducedMotion: boolean; onMotionComplete: () => void;
}) {
  const meshes = useLoader(STLLoader, [lBeamUrl, blackPinUrl]);
  const geometry = useMemo(() => ({
    l: originalLGeometry(meshes[0]!),
    pin: originalPinGeometry(meshes[1]!),
  }), [meshes]);
  const seatedParts = useMemo(() => stepTwelvePoses(STEP_TWELVE_FINAL_PHASE), []);
  const refs = useRef<Partial<Record<StepThirteenUnit, Group>>>({});
  const movement = useRef<Transition | null>(null);
  const old = useRef({ phase, replayKey });
  const initialized = useRef(false);
  const done = useRef(onMotionComplete);
  done.current = onMotionComplete;

  useLayoutEffect(() => {
    const replaying = old.current.replayKey !== replayKey;
    const changed = replaying || old.current.phase !== phase;
    const previousPhase = replaying ? (phase === 6 ? 4 : Math.max(0, phase - 1)) : old.current.phase;
    const from = {
      A: stepThirteenUnitPosition(previousPhase, "A", anchors),
      B: stepThirteenUnitPosition(previousPhase, "B", anchors),
    };
    const to = {
      A: stepThirteenUnitPosition(phase, "A", anchors),
      B: stepThirteenUnitPosition(phase, "B", anchors),
    };
    const animate = initialized.current && changed && !reducedMotion &&
      Math.abs(previousPhase - phase) <= 2 &&
      (from.A.some((n, i) => n !== to.A[i]) || from.B.some((n, i) => n !== to.B[i]));
    for (const id of ["A", "B"] as const) {
      refs.current[id]?.position.set(...(animate ? from[id] : to[id]));
    }
    movement.current = animate ? { from, to, elapsed: 0,
      duration: phase === 3 || phase === 5 || previousPhase === 3 || previousPhase === 5 ? 1.55 : 1.3 } : null;
    old.current = { phase, replayKey };
    initialized.current = true;
    if (!movement.current) done.current();
  }, [phase, replayKey, reducedMotion, anchors]);

  useFrame((_, delta) => {
    if (paused || !movement.current) return;
    const transition = movement.current;
    transition.elapsed = Math.min(transition.duration, transition.elapsed + Math.min(delta, 0.06));
    const t = motionEase(transition.elapsed / transition.duration);
    for (const id of ["A", "B"] as const) {
      const next = motionLerp(transition.from[id], transition.to[id], t);
      refs.current[id]?.position.set(...next);
    }
    if (transition.elapsed >= transition.duration) {
      for (const id of ["A", "B"] as const) refs.current[id]?.position.set(...transition.to[id]);
      movement.current = null;
      done.current();
    }
  });

  return <group name="STEP13_TWO_COMPLETE_STEP12_L_UNITS">
    {(["A", "B"] as const).map(id => {
      const pose = stepThirteenUnitPosition(phase, id, anchors);
      return <group name={"STEP13_ASSEMBLY_" + id} key={id}
        ref={node => { if (node) refs.current[id] = node; }}
        position={pose}
        quaternion={id === "A" ? BASE_ORIENTATION : OPPOSITE_ORIENTATION}>
        <mesh name={"STEP12_L_" + id} geometry={geometry.l}>
          <meshStandardMaterial color="#abb0b8" roughness={0.57} side={DoubleSide} />
        </mesh>
        <group name={"STEP12_PIN_" + id}
          position={seatedParts[("PIN_" + id) as "PIN_A" | "PIN_B"].position}>
          <mesh geometry={geometry.pin}>
            <meshStandardMaterial color="#24262d" roughness={0.6} />
          </mesh>
        </group>
        <group name={"STEP12_BUSHING_" + id}
          position={seatedParts[("BUSHING_" + id) as "BUSHING_A" | "BUSHING_B"].position}>
          <HollowBushing />
        </group>
      </group>;
    })}
    {(phase === 1 || phase === 2 || phase === 4) &&
      (phase === 1 ? (["A", "B"] as const) : phase === 2 ? (["A"] as const) : (["B"] as const))
        .map(id => <mesh name={"STEP13_RECEIVING_HOLE_" + id} key={id}
          position={anchors[id].seated} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.37, 0.06, 10, 32]} />
          <meshBasicMaterial color="#168eea" depthTest={false} />
        </mesh>)}
  </group>;
}

export function StepThirteenScene(props: StepThirteenSceneProps) {
  const beamY = props.prepared["STEP5_BEAM_11"]?.position[1] ?? 4.1;
  const join = useMemo(() => stepElevenPlacement(props.railConfig, props.stepSixConfig, beamY),
    [props.railConfig, props.stepSixConfig, beamY]);
  const anchors = useMemo(() => stepThirteenAnchors(join), [join]);
  const focus = useMemo(() => stepThirteenCameraFocus(anchors, beamY), [anchors, beamY]);
  // Step 11's original geometry, including every pin, remains intact and
  // stationary. Render both L units in the SAME original shared 3D space.
  return <StepElevenScene phase={4} railConfig={props.railConfig}
    frameConfig={props.frameConfig} stepSixConfig={props.stepSixConfig}
    prepared={props.prepared} paused={props.paused} replayKey={0}
    resetCameraKey={props.resetCameraKey} reducedMotion={props.reducedMotion}
    view={props.view} onMotionComplete={() => {}}
    skipEntryAnimation extraFocus={focus} extraCameraOffset={[23, -17, 30]}
    extraScene={<Suspense fallback={null}>
      <StepThirteenAttachments phase={props.phase} anchors={anchors}
        paused={props.paused} replayKey={props.replayKey}
        reducedMotion={props.reducedMotion} onMotionComplete={props.onMotionComplete} />
    </Suspense>} />;
}
