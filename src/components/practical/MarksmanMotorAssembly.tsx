import { useEffect, useRef, useState } from "react";
import { ArrowRight, Scan, Wrench } from "lucide-react";
import { AssemblyLessonHeader, AssemblyActionCard, AssemblyPlaybackControls } from "./AssemblyLessonUI";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import {
  BEAM_CENTRE_X, BEAM_CENTRE_Y, BEAM_CENTRE_Z, CONNECTOR_COLLAR_Z,
  DISC_CENTER_Z, FRAME, METERS_TO_SCENE, MM_TO_SCENE,
  MOTOR_GLB_SOCKET_CANDIDATE_METERS, VALIDATION_NOTES,
  type PartName, type Pt3,
} from "./marksmanAssemblyGeometry";

import motorUrl from "../../../3D for marksman/mortor.glb?url";
import axleUrl from "../../../3D for marksman/axles/short.stl?url";
import discUrl from "../../../3D for marksman/beams/ROUND DISC.stl?url";
import beamUrl from "../../../3D for marksman/beams/5.stl?url";
import pinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

type Pose = { position: Pt3; rotation?: Pt3 };
type Action = {
  id: string; title: string; instruction: string; duration: number;
  focus: Pt3; cameraOffset: Pt3; active: PartName[];
  target?: Pt3; guide?: readonly [Pt3, Pt3];
};
// Model poses are authored in a socket-local frame with the output pointing
// toward -Z. The shared assembly root below rotates this frame into the
// Blender reference orientation: socket faces world +X, axle approaches from
// the right, and insertion moves toward world -X. Camera setup is unchanged.
const step1Poses: Record<PartName, Pose> = {
  motor: { position: [0, 0, 0] },
  axle: { position: [0.45, -0.85, -2.6], rotation: [0, Math.PI / 2, 0] },
  disc: { position: [-1.5, 0.95, 2.2] },
  beam: { position: [1.8, 2.15, -1.2] },
  pin: { position: [-1.3, -1.9, 1.3] },
};

const discPos: Pt3 = [0, 0, DISC_CENTER_Z];
const axlePos: Pt3 = FRAME.axle.center;
const pinPos: Pt3 = [
  FRAME.selectedDiscOuterHole[0], FRAME.selectedDiscOuterHole[1], CONNECTOR_COLLAR_Z,
];
const beamPos: Pt3 = [BEAM_CENTRE_X, BEAM_CENTRE_Y, BEAM_CENTRE_Z];
// The socket-local -Z positions below become world +X after assembly-root
// rotation. Axle/disc/beam start to the RIGHT and move LEFT (world -X).
const alignedAxle: Pt3 = [0, 0, -1.75];
const alignedDisc: Pt3 = [0, 0, -1.65];
const alignedPin: Pt3 = [pinPos[0], pinPos[1], -1.6];
const alignedBeam: Pt3 = [beamPos[0], beamPos[1], -1.9];
const baselineRot = {
  motor: [0, 0, 0], axle: [0, Math.PI / 2, 0], disc: [0, 0, 0],
  beam: [0, 0, 0], pin: [0, 0, 0],
} as const satisfies Record<PartName, Pt3>;

const actions: Action[] = [
  {
    id: "2.1", title: "Insert the short axle",
    instruction: "Find the orange centre output socket on the motor's front face, as in the Blender reference. Align the black X-shaped axle from the RIGHT, then push it straight LEFT into the socket. Leave the end exposed for the disc.",
    duration: 3.0, active: ["motor", "axle"], focus: [0, 0, 0.5],
    cameraOffset: [2, -4, 3.2], target: [0, 0, 0],
    guide: [[0, 0, -2.1], [0, 0, 0.4]],
  },
  {
    id: "2.2", title: "Slide the disc onto the axle",
    instruction: "Align the disc's central X-shaped hole with the axle protruding to the RIGHT of the motor. Slide the disc LEFT along that same axis without tilting it.",
    duration: 3.0, active: ["motor", "axle", "disc"], focus: [0, 0, 0.6],
    cameraOffset: [1.5, -3.3, 3.6], target: [0, 0, 0.5],
    guide: [[0, 0, -2.2], [0, 0, -0.3]],
  },
  {
    id: "2.3a", title: "Seat the connector in the disc",
    instruction: "Locate the selected outer round hole of the disc (not its central X-hole). Insert the connector from below until its stop collar seats. Confirm this connector against your physical kit.",
    duration: 2.2, active: ["disc", "pin"], focus: [pinPos[0], pinPos[1], 0.75],
    cameraOffset: [1.8, -3.4, 3.2], target: [pinPos[0], pinPos[1], 0.55],
    guide: [[pinPos[0], pinPos[1], -1.7], [pinPos[0], pinPos[1], -0.3]],
  },
  {
    id: "2.3b", title: "Attach the 5-hole beam",
    instruction: "Align the first hole of the 5-hole beam with the connector protruding downward from the disc. Slide the beam toward the disc until it meets the central stop collar.",
    duration: 2.8, active: ["disc", "pin", "beam"], focus: [pinPos[0] + 0.35, pinPos[1], 0.9],
    cameraOffset: [1.8, -3.5, 3.6], target: [pinPos[0], pinPos[1], 0.85],
    guide: [[pinPos[0], pinPos[1], -2.1], [pinPos[0], pinPos[1], -0.55]],
  },
  {
    id: "2.4", title: "Inspect the motor subassembly",
    instruction: "Inspect the motor, axle, disc, connector and beam. Keep this motor assembly for Step 26. Confirm the physical connector and measured mounting depths before treating the result as exact.",
    duration: 3.0, active: ["motor", "axle", "disc", "beam", "pin"],
    focus: [0.36, 0, 0.2], cameraOffset: [3.3, -3.4, 3],
  },
];

const models: Array<{ id: Exclude<PartName, "motor">; url: string; color: number }> = [
  { id: "axle", url: axleUrl, color: 0x272e38 },
  { id: "disc", url: discUrl, color: 0xa5adb5 },
  { id: "beam", url: beamUrl, color: 0xd8dee3 },
  // A neutral physical-model colour is intentional: gold is not verified.
  { id: "pin", url: pinUrl, color: 0x8f989e },
];
const names: Record<PartName, string> = {
  motor: "DC motor", axle: "24 mm axle", disc: "Circular disc",
  beam: "5-hole beam", pin: "Connector (verify)",
};

const vec = (p: Pt3) => new THREE.Vector3(p[0], p[1], p[2]);
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
const pos = (from: Pt3, to: Pt3, t: number): Pt3 => {
  const p = vec(from).lerp(vec(to), ease(t));
  return [p.x, p.y, p.z];
};
const twoStage = (start: Pt3, aligned: Pt3, final: Pt3, t: number, alignFraction: number): Pt3 =>
  t <= alignFraction
    ? pos(start, aligned, t / alignFraction)
    : pos(aligned, final, (t - alignFraction) / (1 - alignFraction));

/**
 * Absolute pose at a given sub-action. No coordinates are inherited from the
 * previous animation frame, so reverse, scrubbing and replay are deterministic.
 * All motions after a connection leave that connection unchanged.
 */
function poseAt(index: number, fraction: number, id: PartName, step: number): Pose {
  if (id === "motor") return step1Poses.motor;
  if (step === 1) return step1Poses[id];
  const t = ease(fraction);
  if (id === "axle") {
    return {
      position: index === 0
        ? twoStage(step1Poses.axle.position, alignedAxle, axlePos, t, 0.32)
        : axlePos,
      rotation: baselineRot.axle,
    };
  }
  if (id === "disc") {
    return {
      position: index < 1
        ? step1Poses.disc.position
        : index === 1
          ? twoStage(step1Poses.disc.position, alignedDisc, discPos, t, 0.35)
          : discPos,
    };
  }
  if (id === "pin") {
    return {
      position: index < 2
        ? step1Poses.pin.position
        : index === 2
          ? twoStage(step1Poses.pin.position, alignedPin, pinPos, t, 0.35)
          : pinPos,
    };
  }
  return {
    position: index < 3
      ? step1Poses.beam.position
      : index === 3
        ? twoStage(step1Poses.beam.position, alignedBeam, beamPos, t, 0.42)
        : beamPos,
  };
}
const orbitAt = (cameraOffset: Pt3, target: Pt3, radians: number) => {
  const x = cameraOffset[0] * Math.cos(radians) - cameraOffset[1] * Math.sin(radians);
  const y = cameraOffset[0] * Math.sin(radians) + cameraOffset[1] * Math.cos(radians);
  return vec([target[0] + x, target[1] + y, target[2] + cameraOffset[2]]);
};

type Props = {
  step: number;
  referenceImage: string;
  onReadyChange?: ((finished: boolean) => void) | undefined;
  onBeginStep2?: (() => void) | undefined;
};

/** The same component and WebGL canvas is reused as the parent changes Step 1 to 2. */
export function MarksmanMotorAssembly({ step, referenceImage, onReadyChange, onBeginStep2 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReadyChange);
  const stageRef = useRef(step);
  const actionRef = useRef(0);
  const timeRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);
  const playingRef = useRef(false);
  const reverseRef = useRef<"previous" | "replay" | null>(null);
  const resetCameraRef = useRef(0);
  const [action, setAction] = useState(0);
  const [fraction, setFraction] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failure, setFailure] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [labels, setLabels] = useState<Array<{ id: PartName; x: number; y: number }>>([]);
  const [showOriginalCable, setShowOriginalCable] = useState(false);
  const cableNodesRef = useRef<THREE.Object3D[]>([]);
  const showCableRef = useRef(false);
  // Show the full original cable on demand without changing its geometry.
  useEffect(() => {
    showCableRef.current = showOriginalCable;
    for (const node of cableNodesRef.current) node.visible = showOriginalCable;
  }, [showOriginalCable]);

  useEffect(() => { onReadyRef.current = onReadyChange; }, [onReadyChange]);
  useEffect(() => {
    stageRef.current = step;
    actionRef.current = 0;
    timeRef.current = reducedMotion && step === 2 ? 1 : 0;
    directionRef.current = 1;
    reverseRef.current = null;
    playingRef.current = step === 2 && !reducedMotion;
    setPlaying(playingRef.current);
    setAction(0);
    setFraction(timeRef.current);
    onReadyRef.current?.(false);
    resetCameraRef.current += 1;
  }, [step, reducedMotion]);

  const moveTo = (newAction: number, newFraction: number, startPlayback: boolean, direction: 1 | -1 = 1) => {
    actionRef.current = newAction;
    timeRef.current = clamp(newFraction);
    directionRef.current = direction;
    reverseRef.current = null;
    playingRef.current = startPlayback;
    setAction(newAction);
    setFraction(timeRef.current);
    setPlaying(startPlayback);
    onReadyRef.current?.(newAction === actions.length - 1 && newFraction === 1);
    resetCameraRef.current += 1;
  };
  const goNext = () => {
    if (step !== 2 || !loaded || failure || timeRef.current < 1 || actionRef.current >= actions.length - 1) return;
    moveTo(actionRef.current + 1, reducedMotion ? 1 : 0, !reducedMotion);
  };
  const goPrevious = () => {
    if (step !== 2 || !loaded || failure) return;
    if (reducedMotion) {
      moveTo(Math.max(0, actionRef.current - 1), 1, false);
      return;
    }
    if (timeRef.current <= 0 && actionRef.current > 0) {
      actionRef.current -= 1;
      setAction(actionRef.current);
      timeRef.current = 1;
    }
    reverseRef.current = "previous";
    playingRef.current = true;
    directionRef.current = -1;
    setPlaying(true);
    onReadyRef.current?.(false);
  };
  const replay = () => {
    if (step !== 2 || !loaded || failure || reducedMotion) return;
    reverseRef.current = "replay";
    directionRef.current = -1;
    playingRef.current = true;
    setPlaying(true);
    onReadyRef.current?.(false);
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    let dead = false;
    let frame = 0;
    const scene = new THREE.Scene();
    const objects = new Map<PartName, THREE.Object3D>();
    const materials = new Map<PartName, THREE.MeshStandardMaterial[]>();
    // Physical tutorial models share one socket-local frame. A -90° world-Y
    // rotation maps socket-local -Z to world +X (Blender: motor front faces
    // right, X axle enters from right to left). Rotate every component and
    // guide together, never the camera or the imported source assets.
    const assemblyRoot = new THREE.Group();
    assemblyRoot.rotation.y = -Math.PI / 2;
    scene.add(assemblyRoot);
    const guide = new THREE.Group();
    assemblyRoot.add(guide);
    let guideLine: THREE.Line | undefined;
    let ring: THREE.Mesh | undefined;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "low-power" });
      renderer.setClearColor(0xf8f5ee);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);
    } catch {
      setFailure("WebGL is unavailable on this device. Use the original manual.");
      return;
    }
    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 200);
    camera.up.set(0, 0, 1);
    const introTarget = vec([0, 0, 0]);
    camera.position.copy(vec([4.2, -7.2, 4.0]));
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.target.copy(introTarget);
    orbit.enableDamping = true;
    orbit.minDistance = 2;
    orbit.maxDistance = 20;
    orbit.update();
    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(4, -5, 9);
    scene.add(keyLight, new THREE.HemisphereLight(0xffffff, 0xaeb9c4, 2));
    const floor = new THREE.GridHelper(10, 20, 0xdac9ab, 0xe9e2d8);
    floor.rotation.x = Math.PI / 2;
    floor.position.z = -3;
    scene.add(floor);

    // Never scale the motor by its total bounding box: the original cable
    // is long and would shrink the actual plastic body.
    const setup = async () => {
      const stl = new STLLoader(), gltf = new GLTFLoader();
      const [motor, ...shapes] = await Promise.all([
        gltf.loadAsync(motorUrl), ...models.map((item) => stl.loadAsync(item.url)),
      ]);
      if (dead) {
        for (const shape of shapes) shape.dispose();
        return;
      }
      const motorPivot = new THREE.Group();
      const correctedUnits = new THREE.Group();
      correctedUnits.scale.setScalar(METERS_TO_SCENE);

      // CRITICAL: LDraw 10095.dat is the FRONT CROSS-AXLE OUTPUT HUB.
      // 10091.dat is the REAR CABLE RETAINER, never an axle insertion hole!
      // In this real GLB, the front hub is at Z=.06494 metres and the
      // retainer at Z=.01134 metres. The native output points from rear
      // toward front (+Z), NOT outward from the cable retainer.
      motor.scene.updateMatrixWorld(true);
      let frontAxleHub: THREE.Object3D | undefined;
      let rearCableRetainer: THREE.Object3D | undefined;
      motor.scene.traverse((part) => {
        if (part.name.includes("10095")) frontAxleHub = part;
        if (part.name.includes("10091")) rearCableRetainer = part;
      });
      // Names can change during GLTF import. Use the measured front hub
      // position as a fallback so the whole viewer cannot go blank.
      const frontSocketDatum = frontAxleHub
        ? frontAxleHub.getWorldPosition(new THREE.Vector3())
        : vec(MOTOR_GLB_SOCKET_CANDIDATE_METERS);
      const rearDatum = rearCableRetainer?.getWorldPosition(new THREE.Vector3());
      const nativeFrontDirection = rearDatum
        ? frontSocketDatum.clone().sub(rearDatum).normalize()
        : new THREE.Vector3(0, 0, 1);
      // The shared assembly root maps its local -Z into world +X. Point
      // the ACTUAL FRONT hub along this axis; axle approaches from the right
      // and moves left into its cross-shaped opening.
      correctedUnits.quaternion.setFromUnitVectors(
        nativeFrontDirection,
        new THREE.Vector3(0, 0, -1),
      );
      correctedUnits.add(motor.scene);
      motorPivot.add(correctedUnits);
      scene.add(motorPivot);
      correctedUnits.updateMatrixWorld(true);

      // Calibrate the socket centre while the motor still has an unrotated
      // parent; afterwards reparent it under the rotated assembly root.
      // This prevents mixing world-space offset with socket-local position.
      const socket = correctedUnits.localToWorld(frontSocketDatum.clone());
      correctedUnits.position.sub(socket);
      assemblyRoot.add(motorPivot);
      objects.set("motor", motorPivot);

      // GLB exporter flattened the original LDraw colour palette to yellow
      // on every material. Correct the DISPLAY MATERIALS on cloned instances;
      // neither mortor.glb nor the geometry or child cable shapes are edited.
      const motorColors: Record<string, number> = {
        "4": 0xbac3cc,   // light motor housing
        "72": 0x59636e,  // dark cap
        "79": 0x7b858f,  // dark grey detail
        "0": 0x252a30,   // rubber and cable
        "25": 0xee8e26, // orange output detail
        "494": 0x4c5660, // metal/dark detail
      };
      const cableGroups: THREE.Object3D[] = [];
      motor.scene.traverse((node) => {
        if (node.name.toLowerCase().includes("u9190") &&
            !node.parent?.name.toLowerCase().includes("u9190")) {
          cableGroups.push(node);
        }
      });
      cableNodesRef.current = cableGroups;
      for (const node of cableGroups) node.visible = showCableRef.current;
      const motorMats: THREE.MeshStandardMaterial[] = [];
      motor.scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const old = Array.isArray(child.material) ? child.material : [child.material];
        const cloned = old.map((m) => {
          const copy = m.clone();
          if (copy instanceof THREE.MeshStandardMaterial) {
            const match = /^Material_(\d+)_c$/.exec(m.name);
            const replacement = match ? motorColors[match[1]!] : undefined;
            if (replacement !== undefined) copy.color.setHex(replacement);
          }
          return copy;
        });
        child.material = Array.isArray(child.material) ? cloned : cloned[0]!;
        for (const m of cloned) if (m instanceof THREE.MeshStandardMaterial) motorMats.push(m);
      });
      materials.set("motor", motorMats);
      shapes.forEach((shape, i) => {
        const definition = models[i];
        if (!definition) return;
        shape.center(); // preserve physical dimensions; only normalise origin
        shape.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({
          color: definition.color, roughness: 0.55, metalness: 0.04, side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(shape, mat);
        mesh.scale.setScalar(MM_TO_SCENE);
        assemblyRoot.add(mesh);
        objects.set(definition.id, mesh);
        materials.set(definition.id, [mat]);
      });
      setLoaded(true);
    };
    void setup().catch(() => {
      if (!dead) setFailure("A robot model did not load. Refer to the original manual.");
    });

    const guidesMat = new THREE.LineDashedMaterial({ color: 0xdb7a27, dashSize: 0.1, gapSize: 0.06 });
    const disposeGuide = () => {
      if (guideLine) { guide.remove(guideLine); guideLine.geometry.dispose(); guideLine = undefined; }
      if (ring) {
        guide.remove(ring);
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
        ring = undefined;
      }
    };
    const showGuide = (id: number, stepNow: number) => {
      disposeGuide();
      if (stepNow !== 2) return;
      const action = actions[id];
      if (!action) return;
      if (action.guide) {
        const shape = new THREE.BufferGeometry().setFromPoints([vec(action.guide[0]), vec(action.guide[1])]);
        guideLine = new THREE.Line(shape, guidesMat);
        guideLine.computeLineDistances();
        guide.add(guideLine);
      }
      if (action.target) {
        const mat = new THREE.MeshBasicMaterial({ color: 0xe8892e, transparent: true, opacity: 0.75, depthTest: false });
        ring = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.018, 8, 32), mat);
        ring.position.copy(vec(action.target));
        guide.add(ring);
      }
    };

    let cameraFrom = camera.position.clone();
    let focusFrom = orbit.target.clone();
    let cameraFraction = 1;
    let focusTarget = introTarget.clone();
    let offset = vec([4.2, -7.2, 4]);
    let manualOrbit = false;
    let lastCameraRequest = -1, lastAction = -1, lastStage = -1;
    const onOrbitStart = () => { manualOrbit = true; cameraFraction = 1; };
    orbit.addEventListener("start", onOrbitStart);
    const refreshCamera = (stepNow: number, actionId: number, reset: boolean) => {
      if (!reset && manualOrbit) return;
      cameraFrom = camera.position.clone();
      focusFrom = orbit.target.clone();
      cameraFraction = 0;
      manualOrbit = false;
      const a = stepNow === 2 ? actions[actionId] : undefined;
      // Translate the action's focus into world space; leave camera offset
      // and angle exactly as they were. Only the model's axis is rotated.
      focusTarget = vec(a?.focus ?? [0, 0, 0]).applyQuaternion(assemblyRoot.quaternion);
      offset = vec(a?.cameraOffset ?? [4.2, -7.2, 4]);
    };

    const resize = new ResizeObserver(() => {
      const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resize.observe(host);

    let last = performance.now(), lastReactUpdate = 0, completedSignal = false;
    const animate = (now: number) => {
      if (dead) return;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const currentStep = stageRef.current, id = actionRef.current;
      const a = actions[id];
      if (currentStep !== lastStage || id !== lastAction) {
        lastStage = currentStep;
        lastAction = id;
        showGuide(id, currentStep);
        refreshCamera(currentStep, id, true);
      }
      if (resetCameraRef.current !== lastCameraRequest) {
        lastCameraRequest = resetCameraRef.current;
        refreshCamera(currentStep, id, true);
      }
      if (playingRef.current && currentStep === 2 && a && objects.size === 5) {
        timeRef.current = clamp(timeRef.current + dt / a.duration * directionRef.current);
        if (timeRef.current === 0 && directionRef.current === -1) {
          if (reverseRef.current === "replay") {
            reverseRef.current = null;
            directionRef.current = 1;
          } else {
            reverseRef.current = null;
            playingRef.current = false;
            setPlaying(false);
            if (actionRef.current > 0) {
              actionRef.current -= 1;
              timeRef.current = 1;
              setAction(actionRef.current);
            }
          }
        } else if (timeRef.current === 1 && directionRef.current === 1) {
          playingRef.current = false;
          setPlaying(false);
          if (id === actions.length - 1 && !completedSignal) {
            completedSignal = true;
            onReadyRef.current?.(true);
          }
        }
      }
      if (id !== actions.length - 1 || timeRef.current < 1) completedSignal = false;
      const fractionNow = timeRef.current;
      for (const [part, object] of objects) {
        const pose = poseAt(actionRef.current, fractionNow, part, currentStep);
        object.position.copy(vec(pose.position));
        if (part !== "motor") {
          const rotation = pose.rotation ?? [0, 0, 0];
          object.rotation.set(rotation[0], rotation[1], rotation[2]);
        }
        const highlighted = currentStep === 1 || (actions[actionRef.current]?.active.includes(part) ?? false);
        for (const mat of materials.get(part) ?? []) {
          mat.transparent = !highlighted;
          mat.opacity = highlighted ? 1 : 0.78;
          mat.emissive.setHex(highlighted && currentStep === 2 ? 0x4b2605 : 0x000000);
          mat.emissiveIntensity = highlighted ? 0.11 : 0;
        }
      }
      if (cameraFraction < 1) {
        cameraFraction = clamp(cameraFraction + dt / 0.7);
        camera.position.lerpVectors(cameraFrom, focusTarget.clone().add(offset), ease(cameraFraction));
        orbit.target.lerpVectors(focusFrom, focusTarget, ease(cameraFraction));
      } else if (currentStep === 2 && id === actions.length - 1 && playingRef.current && !manualOrbit) {
        // Orbit ONLY the camera; all connected meshes remain still.
        const angle = clamp((fractionNow - 0.24) / 0.76) * Math.PI * 1.5;
        const rotatedFocus = vec(a?.focus ?? [0, 0, 0]).applyQuaternion(assemblyRoot.quaternion);
        const worldFocus: Pt3 = [rotatedFocus.x, rotatedFocus.y, rotatedFocus.z];
        camera.position.copy(orbitAt(a?.cameraOffset ?? [3, -3, 3], worldFocus, angle));
        orbit.target.copy(rotatedFocus);
      }
      orbit.update();
      renderer.render(scene, camera);
      if (now - lastReactUpdate > 125) {
        lastReactUpdate = now;
        setFraction(timeRef.current);
        camera.updateMatrixWorld();
        const markers: Array<{ id: PartName; x: number; y: number }> = [];
        const activeParts: PartName[] = ["motor", "axle", "disc", "beam", "pin"];
        for (const name of activeParts) {
          const obj = objects.get(name);
          if (!obj) continue;
          const point = obj.getWorldPosition(new THREE.Vector3());
          if (name !== "motor") point.z += 0.25;
          point.project(camera);
          if (point.z < -1 || point.z > 1 || Math.abs(point.x) > 1.1 || Math.abs(point.y) > 1.1) continue;
          markers.push({
            id: name,
            x: Math.max(12, Math.min(88, (point.x + 1) * 50)),
            y: Math.max(9, Math.min(93, (1 - point.y) * 50)),
          });
        }
        setLabels(markers);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      dead = true;
      cancelAnimationFrame(frame);
      resize?.disconnect();
      orbit.removeEventListener("start", onOrbitStart);
      orbit.dispose();
      cableNodesRef.current = [];
      disposeGuide();
      guidesMat.dispose();
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          for (const material of mats) material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  const currentAction = actions[action] ?? actions[0]!;
  const isFinal = step === 2 && action === actions.length - 1 && fraction >= 1;
  const finishedAction = fraction >= 1;
  return (
    <section aria-label="Step 1 and 2 connected motor assembly viewer" className="relative w-full min-w-0 space-y-2 text-left">
      <AssemblyLessonHeader step={step} title={step === 1 ? "Prepare the motor components" : "Build the motor assembly"}
        actionIndex={step === 2 ? action : undefined} actionCount={step === 2 ? actions.length : undefined}
        trailing={<button type="button" className="min-h-11 rounded-xl px-3 text-xs font-bold text-[#116eaf] underline underline-offset-2"
          onClick={() => setShowManual(v => !v)} aria-expanded={showManual}>
          {showManual ? "Hide manual" : "View manual"}
        </button>} />
      <div className="relative h-[270px] w-full overflow-hidden rounded-2xl border border-[#cddceb] bg-[#f6f9fc] sm:h-[360px] md:h-[430px]">
        <div ref={hostRef} className="absolute inset-0 touch-none" aria-label="Rotate 3D parts by dragging; pinch or scroll to zoom." />
        {!failure && loaded && <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {labels.map(label => (
            <span key={label.id} className="absolute whitespace-nowrap rounded-full border border-amber-300/80 bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-[#824718] shadow-sm" style={{ left: label.x + "%", top: label.y + "%", transform: "translate(-50%,-150%)" }}>
              {names[label.id]}
            </span>
          ))}
        </div>}
        {!loaded && !failure && <p className="absolute inset-0 grid place-items-center bg-[#f6f9fc] text-sm text-slate-600">Loading real motor, disc, axle, beam and connector models…</p>}
        {failure && <div className="absolute inset-0 grid place-items-center bg-[#f6f9fc] p-4 text-sm text-amber-900" role="alert">{failure}</div>}
      </div>
      <button type="button" onClick={() => setShowOriginalCable(v => !v)} className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600">
        {showOriginalCable ? "Hide full motor cable" : "Show original motor cable"}
      </button>
      {showManual && <img src={referenceImage} alt={"Original Marksman manual Step " + step} className="mx-auto max-h-[240px] w-full rounded-lg border border-slate-200 object-contain" />}
      {step === 1 ? (
        <div className="space-y-2">
          <p className="text-sm text-[#132654]">Inspect the five parts independently. None are connected. Rotate or zoom, then choose Start Assembly.</p>
          <button type="button" onClick={() => { resetCameraRef.current += 1; }} className="mb-2 inline-flex min-h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-[#132654]"><Scan className="size-4" /> Reset View</button>
          <button type="button" disabled={!loaded || Boolean(failure)} onClick={() => onBeginStep2?.()} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#168eea] px-4 text-sm font-bold text-white disabled:opacity-40">
            <Wrench className="size-4" /> Start Assembly — Step 2 <ArrowRight className="size-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1" aria-label="Step 2 assembly action progress">
            {actions.map((a, i) => <span key={a.id} className={"h-1.5 rounded-full " + (i <= action ? "bg-orange-500" : "bg-slate-200")} />)}
          </div>
          <AssemblyActionCard actionIndex={action} actionCount={actions.length}
            title={currentAction.title} instruction={currentAction.instruction} />
          {isFinal && <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
            Step 2 sequence complete. Keep the motor unit for Step 26; physical measurements still need checking.
          </p>}
          <AssemblyPlaybackControls paused={!playing}
            previousDisabled={!loaded||Boolean(failure)}
            replayDisabled={!loaded||Boolean(failure)||reducedMotion}
            pauseDisabled={!loaded||Boolean(failure)||reducedMotion}
            nextDisabled={!loaded||Boolean(failure)||!finishedAction||action===actions.length-1}
            onPrevious={goPrevious} onNext={goNext} onReplay={replay}
            onTogglePause={()=>{
              if(timeRef.current>=1) replay();
              else { playingRef.current=!playingRef.current; directionRef.current=1; setPlaying(playingRef.current); }
            }} />
          <button type="button" onClick={()=>{resetCameraRef.current+=1;}}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#132654]">
            <Scan aria-hidden="true" className="size-4" /> Reset view
          </button>
          <label className="flex items-center gap-2 px-1 text-xs text-slate-600">
            <span className="sr-only">Current action animation position</span>
            <input aria-label="Animation timeline" type="range" min={0} max={100} step={1} value={Math.round(fraction * 100)} disabled={!loaded || Boolean(failure)} onChange={event => {
              const progress = Number(event.target.value) / 100;
              timeRef.current = progress;
              playingRef.current = false;
              setPlaying(false);
              setFraction(progress);
              onReadyRef.current?.(actionRef.current === actions.length - 1 && progress === 1);
            }} className="min-w-0 flex-1 accent-orange-600" />
            <span className="w-9 text-right tabular-nums">{Math.round(fraction * 100)}%</span>
          </label>
        </div>
      )}
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-4 text-amber-950">
        Geometry-driven beta. Disc and beam hole centres are measured. Motor socket location, axle insertion depth, disc spacing, connector identity and outer-hole selection are not yet physically verified. Use the original manual when assembling your kit.
      </p>
      <details className="px-1 text-[11px] text-slate-600">
        <summary className="cursor-pointer font-semibold">Mechanical verification checklist</summary>
        <ul className="ml-4 mt-1 list-disc space-y-1">
          {VALIDATION_NOTES.map(note => <li key={note}>{note}</li>)}
        </ul>
      </details>
    </section>
  );
}
