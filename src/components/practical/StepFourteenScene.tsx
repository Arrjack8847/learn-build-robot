import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Box3, BufferGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { StepThirteenScene, type StepThirteenSceneProps } from "./StepThirteenScene";
import { STEP_THIRTEEN_FINAL_PHASE } from "./stepThirteenGeometry";
import {
  STEP_FOURTEEN_MOTOR_HOLES_MM, stepFourteenFocusWorld, stepFourteenGreyTop,
  stepFourteenPins, stepFourteenPose, type StepFourteenPose,
} from "./stepFourteenGeometry";
import {
  FRAME, DISC_CENTER_Z, BEAM_CENTRE_X, BEAM_CENTRE_Y, BEAM_CENTRE_Z,
  CONNECTOR_COLLAR_Z, MOTOR_GLB_SOCKET_CANDIDATE_METERS,
} from "./marksmanAssemblyGeometry";
import { motionEase, motionLerp } from "./marksmanLessonMotion";

import motorUrl from "../../../3D for marksman/mortor.glb?url";
import axleUrl from "../../../3D for marksman/axles/short.stl?url";
import discUrl from "../../../3D for marksman/beams/ROUND DISC.stl?url";
import beamUrl from "../../../3D for marksman/beams/5.stl?url";
import pinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

export type StepFourteenSceneProps = Omit<StepThirteenSceneProps,
  "phase" | "stepTenExtraScene" | "focusOverride"> & { phase: number };

const MM_TO_TEN_UNITS = 1 / 8;
const STEP_TWO_TO_TEN_UNITS = 2.5; // Step 2 is 0.05 units/mm; Step 10 is 0.125.
const METERS_TO_TEN_UNITS = 125;
// GLB front mounting row is 4 mm behind its output hub.
// Step 10 front blue connector (grey Hole 9) sits at x=+4, so put the
// original motor output hub at +4 + 4/8 = +4.5. Rear motor holes then
// fall exactly at +4.5 - 52/8 = -2, matching grey Hole 3 on both rails.
const SOCKET_X = 4 + STEP_FOURTEEN_MOTOR_HOLES_MM.frontBehindAxleHub / 8;
const Z_AXIS = new Vector3(0, 0, -1);
type DockMovement = { from: StepFourteenPose; to: StepFourteenPose; elapsed: number; duration: number };

function pointFromStepTwo(p: readonly number[]): [number, number, number] {
  return [p[0]! * STEP_TWO_TO_TEN_UNITS,
    p[1]! * STEP_TWO_TO_TEN_UNITS, p[2]! * STEP_TWO_TO_TEN_UNITS];
}
function normalizeStl(source: BufferGeometry): BufferGeometry {
  const g = source.clone();
  g.center();
  g.computeVertexNormals();
  return g;
}

/** Reconstruct exactly the five Step 2 parts, using the real motor GLB
 * and the original Step 2 final subassembly placements. A single outer group
 * owns every part so rotation and four-pin docking never detach the axle,
 * disc, connector or five-hole beam.
 */
function StepFourteenMotor({ phase, paused, replayKey, reducedMotion, onMotionComplete }: {
  phase: number; paused: boolean; replayKey: number; reducedMotion: boolean;
  onMotionComplete: () => void;
}) {
  const gltf = useLoader(GLTFLoader, motorUrl);
  const loaded = useLoader(STLLoader, [axleUrl, discUrl, beamUrl, pinUrl]);
  const model = useMemo(() => {
    const realMotor = gltf.scene.clone(true);
    realMotor.updateMatrixWorld(true);
    let frontHub: Object3D | undefined;
    let rearRetainer: Object3D | undefined;
    realMotor.traverse(node => {
      if (node.name.includes("10095")) frontHub = node;
      if (node.name.includes("10091")) rearRetainer = node;
    });
    const front = frontHub
      ? frontHub.getWorldPosition(new Vector3())
      : new Vector3(...MOTOR_GLB_SOCKET_CANDIDATE_METERS);
    const rear = rearRetainer?.getWorldPosition(new Vector3());
    const nativeOutput = rear ? front.clone().sub(rear).normalize() : new Vector3(0, 0, 1);
    const alignToStepTwo = new Quaternion().setFromUnitVectors(nativeOutput, Z_AXIS);
    const scaled = new Group();
    scaled.scale.setScalar(METERS_TO_TEN_UNITS);
    scaled.quaternion.copy(alignToStepTwo);
    scaled.position.copy(front.clone().applyQuaternion(alignToStepTwo)
      .multiplyScalar(-METERS_TO_TEN_UNITS));
    const palette: Record<string, number> = {
      "4": 0xbac3cc, "72": 0x59636e, "79": 0x7b858f,
      "0": 0x252a30, "25": 0xee8e26, "494": 0x4c5660,
    };
    realMotor.traverse(node => {
      // The imported giant cable coil obscures the mounting area, as in Step 2;
      // only its display is hidden. The source GLB is never altered.
      if (/u9190|cable|wire|cord/i.test(node.name)) node.visible = false;
      if (!(node instanceof Mesh)) return;
      const original = Array.isArray(node.material) ? node.material : [node.material];
      const materials = original.map(item => {
        const clone = item.clone();
        if (clone instanceof MeshStandardMaterial) {
          const label = /^Material_(\d+)_c$/.exec(item.name);
          const color = label ? palette[label[1]!] : undefined;
          if (color !== undefined) clone.color.setHex(color);
        }
        return clone;
      });
      node.material = Array.isArray(node.material) ? materials : materials[0]!;
    });
    scaled.add(realMotor);

    // The body bounds are measured AFTER the same socket-to-+X rotation as
    // Step 2, with cable meshes omitted; never use cable-inclusive bounds.
    const inspection = new Group();
    inspection.position.x = SOCKET_X;
    inspection.rotation.y = -Math.PI / 2;
    inspection.add(scaled);
    inspection.updateMatrixWorld(true);
    const bounds = new Box3().makeEmpty();
    inspection.traverseVisible(node => {
      if (node instanceof Mesh) bounds.union(new Box3().setFromObject(node));
    });
    const motorBottom = bounds.isEmpty() ? 0 : bounds.min.z;
    const lateralCenter = bounds.isEmpty() ? 0 : (bounds.min.y + bounds.max.y) / 2;
    const seatZ = stepFourteenGreyTop() - motorBottom;
    const geometries = loaded.map(normalizeStl);
    return { motor: scaled, geometries, seatZ, lateralCenter };
  }, [gltf, loaded]);

  const holder = useRef<Group>(null);
  const transition = useRef<DockMovement | null>(null);
  const old = useRef({ phase, replayKey });
  const mounted = useRef(false);
  const done = useRef(onMotionComplete);
  done.current = onMotionComplete;
  const pins = useMemo(stepFourteenPins, []);

  useLayoutEffect(() => {
    const replaying = old.current.replayKey !== replayKey;
    const changed = replaying || old.current.phase !== phase;
    const fromPhase = replaying ? Math.max(0, phase - 1) : old.current.phase;
    const from = stepFourteenPose(fromPhase, model.seatZ);
    const to = stepFourteenPose(phase, model.seatZ);
    const moving = from.rotationZ !== to.rotationZ ||
      from.position.some((v, i) => Math.abs(v - to.position[i]!) > 1e-6);
    const animate = mounted.current && changed && !reducedMotion &&
      Math.abs(fromPhase - phase) <= 1 && moving;
    const initial = animate ? from : to;
    holder.current?.position.set(...initial.position);
    if (holder.current) holder.current.rotation.z = initial.rotationZ;
    transition.current = animate
      ? { from, to, elapsed: 0, duration: phase === 4 || fromPhase === 4 ? 1.7 : 1.25 }
      : null;
    old.current = { phase, replayKey };
    mounted.current = true;
    if (!transition.current) done.current();
  }, [phase, replayKey, reducedMotion, model.seatZ]);

  useFrame((_, elapsed) => {
    if (paused || !transition.current || !holder.current) return;
    const move = transition.current;
    move.elapsed = Math.min(move.duration, move.elapsed + Math.min(elapsed, 0.06));
    const t = motionEase(move.elapsed / move.duration);
    holder.current.position.set(...motionLerp(move.from.position, move.to.position, t));
    holder.current.rotation.z = move.from.rotationZ +
      (move.to.rotationZ - move.from.rotationZ) * t;
    if (move.elapsed >= move.duration) {
      holder.current.position.set(...move.to.position);
      holder.current.rotation.z = move.to.rotationZ;
      transition.current = null;
      done.current();
    }
  });

  const axlePos = pointFromStepTwo(FRAME.axle.center);
  const discPos = pointFromStepTwo([0, 0, DISC_CENTER_Z]);
  const pinPos = pointFromStepTwo([
    FRAME.selectedDiscOuterHole[0], FRAME.selectedDiscOuterHole[1], CONNECTOR_COLLAR_Z,
  ]);
  const beamPos = pointFromStepTwo([BEAM_CENTRE_X, BEAM_CENTRE_Y, BEAM_CENTRE_Z]);
  const p = stepFourteenPose(phase, model.seatZ);

  return <group name="STEP14_MOTOR_DOCKING_LOCAL_STEP10">
    {/* Guides are only overlays: the original Step 10 blue connector meshes
        continue rendering at full opacity below the motor. */}
    {(phase >= 1 && phase <= 3) && pins.map(pin =>
      <group key={pin.id} name={"STEP14_TARGET_" + pin.id}
        position={[pin.position[0], pin.position[1], pin.position[2] + 1.5]}>
        <mesh>
          <torusGeometry args={[0.35, 0.055, 10, 28]} />
          <meshBasicMaterial color="#168eea" depthTest={false} />
        </mesh>
      </group>)}
    <group ref={holder} name="STEP14_COMPLETE_STEP2_RIGID_UNIT"
      position={p.position} rotation={[0, 0, p.rotationZ]}>
      <group position={[SOCKET_X, -model.lateralCenter, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={model.motor} />
        <mesh name="STEP2_SHORT_AXLE" geometry={model.geometries[0]}
          position={axlePos} rotation={[0, Math.PI / 2, 0]} scale={MM_TO_TEN_UNITS}>
          <meshStandardMaterial color="#272e38" roughness={0.55} side={DoubleSide} />
        </mesh>
        <mesh name="STEP2_CIRCULAR_DISC" geometry={model.geometries[1]}
          position={discPos} scale={MM_TO_TEN_UNITS}>
          <meshStandardMaterial color="#a5adb5" roughness={0.55} side={DoubleSide} />
        </mesh>
        <mesh name="STEP2_FIVE_HOLE_BEAM" geometry={model.geometries[2]}
          position={beamPos} scale={MM_TO_TEN_UNITS}>
          <meshStandardMaterial color="#d8dee3" roughness={0.55} side={DoubleSide} />
        </mesh>
        <mesh name="STEP2_DISC_PIN" geometry={model.geometries[3]}
          position={pinPos} scale={MM_TO_TEN_UNITS}>
          <meshStandardMaterial color="#8f989e" roughness={0.55} side={DoubleSide} />
        </mesh>
      </group>
    </group>
  </group>;
}

export function StepFourteenScene(props: StepFourteenSceneProps) {
  const beamY = props.prepared["STEP5_BEAM_11"]?.position[1] ?? 4.1;
  const focus = useMemo(() =>
    stepFourteenFocusWorld(props.railConfig, props.stepSixConfig, beamY),
    [props.railConfig, props.stepSixConfig, beamY]);
  return <StepThirteenScene {...props} phase={STEP_THIRTEEN_FINAL_PHASE}
    focusOverride={focus}
    onMotionComplete={() => {}}
    stepTenExtraScene={<Suspense fallback={null}>
      <StepFourteenMotor phase={props.phase} paused={props.paused}
        replayKey={props.replayKey} reducedMotion={props.reducedMotion}
        onMotionComplete={props.onMotionComplete} />
    </Suspense>} />;
}
