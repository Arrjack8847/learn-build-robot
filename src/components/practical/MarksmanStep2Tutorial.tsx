import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import motorUrl from "../../../3D for marksman/mortor.glb?url";
import beamUrl from "../../../3D for marksman/beams/5.stl?url";
import discUrl from "../../../3D for marksman/beams/ROUND DISC.stl?url";
import axleUrl from "../../../3D for marksman/axles/short.stl?url";
import pinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

/**
 * Four separate teacher-controlled actions for manual Step 2.
 * Beam geometry and pitch are measured from the uploaded STL:
 * beam5 39.3 mm long, 8 mm pitch; disc 23.84 mm across;
 * short axle 24 mm long; pin-pin connector 16 mm long.
 * Attachment faces on the MOTOR are not confirmed. The motor/axle
 * relation and final union remain illustrative until checked physically.
 */
type Part = "motor" | "axle" | "beam" | "disc" | "pin";
type Vec = [number, number, number];
type Pose = { position: Vec; rotation?: Vec };
type AssemblyAction = {
  title: string;
  caption: string;
  duration: number;
  active: Part[];
  camera: Vec;
  focus: Vec;
  guide?: { from: Vec; to: Vec };
};
type ObjectEntry = { node: THREE.Object3D; initialScale: THREE.Vector3; materials: THREE.Material[] };
const RAD = Math.PI / 2;
const scaleMm = 0.05; // All STL assets share millimetre units.
const actions: AssemblyAction[] = [
  {
    title: "Identify the five components",
    caption: "Inspect the motor, 24 mm short axle, 5-hole beam, circular disc and pin connector. This is a parts overview.",
    duration: 0, active: ["motor", "axle", "beam", "disc", "pin"],
    camera: [3.2, -7.5, 5.0], focus: [0, 0, 0],
  },
  {
    title: "Insert the short axle",
    caption: "Focus on the motor output. Align the short axle with the output axis, then slide it in. Motor socket position is still being calibrated.",
    duration: 3, active: ["motor", "axle"],
    camera: [-0.6, -4.7, 2.6], focus: [-1.25, -0.18, 0.22],
    guide: { from: [-1.15, -1.65, 0.3], to: [-1.15, 0.2, 0.3] },
  },
  {
    title: "Attach the circular disc",
    caption: "Align the disc with the first hole of the 5-hole beam, then insert the connector along the hole axis. Each component enters in sequence.",
    duration: 3, active: ["beam", "disc", "pin"],
    camera: [2.3, -4.6, 2.7], focus: [1.2, -0.3, -0.4],
    guide: { from: [1.2, -1.8, -0.4], to: [1.2, 0.55, -0.4] },
  },
  {
    title: "Combine and inspect",
    caption: "Bring the beam-and-disc subassembly toward the motor. The final motor coupling is a teaching approximation pending socket and hole verification.",
    duration: 4, active: ["motor", "axle", "beam", "disc", "pin"],
    camera: [1.8, -5.6, 3.5], focus: [-0.2, 0.05, 0.0],
    guide: { from: [1.2, -0.3, -0.4], to: [-0.9, -0.15, -0.35] },
  },
];

const start: Record<Part, Pose> = {
  motor: { position: [-1.8, 0.2, 0.2] },
  axle: { position: [-1.15, -1.9, 0.3], rotation: [0, 0, RAD] },
  beam: { position: [2.0, 0.2, -0.4] },
  // A beam STL is centred on its midspan. Hole 1 = -16 mm = -0.8 scene units.
  disc: { position: [1.2, -1.45, -0.4], rotation: [RAD, 0, 0] },
  pin: { position: [1.75, -1.9, 0.3] },
};
const axleInserted: Vec = [-1.15, -0.52, 0.3];
const discAttached: Vec = [1.2, -0.44, -0.4];
const pinAttached: Vec = [1.2, -0.11, -0.4];
const joinedOffset = new THREE.Vector3(-2.1, 0.15, 0.05);
const subjects: Part[] = ["motor", "axle", "beam", "disc", "pin"];
const modelUrl: Record<Exclude<Part, "motor">, string> = { beam: beamUrl, disc: discUrl, axle: axleUrl, pin: pinUrl };
const palette: Record<Exclude<Part, "motor">, number> = {
  beam: 0xdde4e9, disc: 0x9cabb9, axle: 0x354154, pin: 0x2972d2,
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const vector = (value: Vec) => new THREE.Vector3(...value);
const interpolate = (startPose: Vec, endPose: Vec, t: number) =>
  vector(startPose).lerp(vector(endPose), ease(t));

/** Compute the full assembly from an action index and local action time. */
function poseAt(action: number, progress: number, part: Part): Pose {
  const t = ease(progress);
  const base = start[part];
  if (part === "motor") return base;
  if (part === "axle") {
    return {
      position: action < 1 ? base.position
        : action === 1 ? interpolate(base.position, axleInserted, t).toArray() as Vec
        : axleInserted,
      rotation: base.rotation,
    };
  }
  const isJoinAction = action >= 3;
  const joinT = isJoinAction ? (action === 3 ? t : 1) : 0;
  if (part === "beam") {
    return { position: vector(base.position).addScaledVector(joinedOffset, joinT).toArray() as Vec };
  }
  if (part === "disc") {
    const attached = action < 2 ? vector(base.position)
      : action === 2 ? interpolate(base.position, discAttached, clamp(progress / 0.52))
      : vector(discAttached);
    return { position: attached.addScaledVector(joinedOffset, joinT).toArray() as Vec, rotation: base.rotation };
  }
  // Pin first rotates into alignment, then slides along the beam hole axis.
  const phase = clamp((progress - 0.50) / 0.50);
  let pinPosition = vector(base.position);
  let pinRotation: Vec = [0, 0, 0];
  if (action > 2) {
    pinPosition = vector(pinAttached);
    pinRotation = [RAD, 0, 0];
  } else if (action === 2) {
    if (phase <= 0.30) {
      const align = ease(phase / 0.30);
      pinPosition.lerp(vector([1.2, -1.5, -0.4]), align);
      pinRotation = [RAD * align, 0, 0];
    } else {
      pinPosition = interpolate([1.2, -1.5, -0.4], pinAttached, (phase - 0.30) / 0.70);
      pinRotation = [RAD, 0, 0];
    }
  }
  return { position: pinPosition.addScaledVector(joinedOffset, joinT).toArray() as Vec, rotation: pinRotation };
}

function playSnap(muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    const AudioContextType = window.AudioContext;
    if (!AudioContextType) return;
    const context = new AudioContextType();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(630, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(370, context.currentTime + 0.065);
    gain.gain.setValueAtTime(0.025, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.095);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.11);
    oscillator.onended = () => { void context.close(); };
  } catch {
    // Sound is optional. Never block assembly instruction playback.
  }
}

export function MarksmanStep2Tutorial({
  referenceImage,
  onReadyChange,
}: {
  referenceImage: string;
  onReadyChange?: (ready: boolean) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef(0);
  const animationRef = useRef(1);
  const playingRef = useRef(false);
  const soundRef = useRef(true);
  const onReadyRef = useRef(onReadyChange);
  const [action, setAction] = useState(0);
  const [animation, setAnimation] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => { onReadyRef.current = onReadyChange; }, [onReadyChange]);
  useEffect(() => { soundRef.current = muted; }, [muted]);

  const seek = (index: number, progress: number, play = false) => {
    actionRef.current = index;
    animationRef.current = progress;
    playingRef.current = play;
    setAction(index);
    setAnimation(progress);
    setPlaying(play);
    onReadyRef.current?.(index === actions.length - 1 && progress >= 1);
  };
  const next = () => {
    if (actionRef.current < actions.length - 1 && animationRef.current >= 1) {
      seek(actionRef.current + 1, 0, true);
    }
  };
  const previous = () => {
    if (actionRef.current > 0) seek(actionRef.current - 1, 1);
  };
  const replay = () => seek(actionRef.current, actionRef.current === 0 ? 1 : 0, actionRef.current !== 0);

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;
    let disposed = false;
    let frame = 0;
    let resize: ResizeObserver | undefined;
    const entries = new Map<Part, ObjectEntry>();
    const scene = new THREE.Scene();
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    setError(null);
    setLoading(true);
    seek(0, 1);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
      renderer.setClearColor(0xf2f8fd);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      host.append(renderer.domElement);
    } catch {
      setError("WebGL is unavailable. The original manual remains available.");
      setLoading(false);
      return;
    }
    const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200);
    camera.up.set(0, 0, 1);
    camera.position.copy(vector(actions[0].camera));
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(vector(actions[0].focus));
    controls.enableDamping = true;
    controls.minDistance = 2.3;
    controls.maxDistance = 18;
    controls.update();
    const light = new THREE.DirectionalLight(0xffffff, 2.8);
    light.position.set(3, -6, 9);
    scene.add(light, new THREE.HemisphereLight(0xffffff, 0x9aafbb, 2.2));
    const grid = new THREE.GridHelper(11, 22, 0xbbcedc, 0xdce7ef);
    grid.rotation.x = RAD;
    grid.position.z = -1.35;
    scene.add(grid);

    // Camera transitions can be interrupted instantly by manual orbit/pan.
    let lastAction = -1;
    let cameraStart = camera.position.clone();
    let targetStart = controls.target.clone();
    let cameraProgress = 1;
    const stopCamera = () => { cameraProgress = 1; };
    controls.addEventListener("start", stopCamera);

    const guides = new THREE.Group();
    scene.add(guides);
    const guideMaterial = new THREE.LineDashedMaterial({
      color: 0x168eea, dashSize: 0.16, gapSize: 0.09, transparent: true, opacity: 0.85,
    });
    const paintGuide = (index: number) => {
      while (guides.children.length) {
        const child = guides.children[0];
        guides.remove(child);
        if (child instanceof THREE.Line) child.geometry.dispose();
      }
      const guide = actions[index].guide;
      if (!guide) return;
      const geometry = new THREE.BufferGeometry().setFromPoints([vector(guide.from), vector(guide.to)]);
      const line = new THREE.Line(geometry, guideMaterial);
      line.computeLineDistances();
      guides.add(line);
    };

    const setActiveMaterials = (index: number) => {
      const active = actions[index].active;
      for (const [part, item] of entries) {
        const highlighted = active.includes(part);
        for (const material of item.materials) {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.transparent = !highlighted;
            material.opacity = highlighted ? 1 : 0.4;
            material.emissive.setHex(highlighted ? 0x10345b : 0x000000);
            material.emissiveIntensity = highlighted ? 0.08 : 0;
            material.needsUpdate = true;
          }
        }
      }
    };

    const loadScene = async () => {
      const stl = new STLLoader();
      const gltf = new GLTFLoader();
      const geometries = await Promise.all([
        stl.loadAsync(axleUrl), stl.loadAsync(beamUrl), stl.loadAsync(discUrl), stl.loadAsync(pinUrl),
      ]);
      const motor = await gltf.loadAsync(motorUrl);
      if (disposed) {
        for (const geometry of geometries) geometry.dispose();
        return;
      }
      const motorVisual = motor.scene.clone(true);
      // The GLB includes its cable; bounding-box fit is display-only, not a physical calibration.
      const box = new THREE.Box3().setFromObject(motorVisual);
      const centre = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      motorVisual.position.sub(centre);
      const motorGroup = new THREE.Group();
      motorGroup.add(motorVisual);
      motorGroup.scale.setScalar(2.2 / Math.max(size.x, size.y, size.z, 0.001));
      scene.add(motorGroup);
      const motorMaterials: THREE.Material[] = [];
      motorVisual.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          const list = Array.isArray(node.material) ? node.material : [node.material];
          node.material = Array.isArray(node.material) ? list.map((m) => m.clone()) : list[0].clone();
          const cloneList = Array.isArray(node.material) ? node.material : [node.material];
          motorMaterials.push(...cloneList);
        }
      });
      entries.set("motor", { node: motorGroup, initialScale: motorGroup.scale.clone(), materials: motorMaterials });

      const ids: Array<Exclude<Part, "motor">> = ["axle", "beam", "disc", "pin"];
      for (let i = 0; i < geometries.length; i++) {
        const id = ids[i];
        const geometry = geometries[i];
        // Recentring the STL doesn't change the calibrated hole pitch.
        geometry.center();
        geometry.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({ color: palette[id], roughness: 0.43, metalness: 0.06, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.scale.setScalar(scaleMm);
        scene.add(mesh);
        entries.set(id, { node: mesh, initialScale: mesh.scale.clone(), materials: [mat] });
      }
      paintGuide(0);
      setActiveMaterials(0);
      setLoading(false);
    };
    void loadScene().catch(() => {
      if (!disposed) {
        setError("One or more robot 3D models failed to load. Use the original manual.");
        setLoading(false);
      }
    });
    resize = new ResizeObserver(() => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resize.observe(host);

    let previousFrame = performance.now();
    let previousUpdate = 0;
    let wasPlaying = false;
    const tick = (now: number) => {
      if (disposed) return;
      const delta = Math.min(0.08, (now - previousFrame) / 1000);
      previousFrame = now;
      const index = actionRef.current;
      if (index !== lastAction) {
        lastAction = index;
        cameraStart = camera.position.clone();
        targetStart = controls.target.clone();
        cameraProgress = 0;
        paintGuide(index);
        setActiveMaterials(index);
      }
      const current = actions[index];
      if (playingRef.current && entries.size === subjects.length) {
        animationRef.current = clamp(animationRef.current + delta / current.duration);
        if (animationRef.current >= 1) {
          playingRef.current = false;
          setPlaying(false);
          if (index === actions.length - 1) onReadyRef.current?.(true);
          if (!wasPlaying) playSnap(soundRef.current);
        }
      }
      wasPlaying = playingRef.current;
      const easedFrame = animationRef.current;
      for (const [part, entry] of entries) {
        const pose = poseAt(index, easedFrame, part);
        entry.node.position.copy(vector(pose.position));
        const rotation = pose.rotation ?? [0, 0, 0];
        entry.node.rotation.set(...rotation);
        entry.node.scale.copy(entry.initialScale);
      }
      if (cameraProgress < 1) {
        cameraProgress = Math.min(1, cameraProgress + delta / 0.8);
        camera.position.lerpVectors(cameraStart, vector(current.camera), ease(cameraProgress));
        controls.target.lerpVectors(targetStart, vector(current.focus), ease(cameraProgress));
      }
      controls.update();
      renderer.render(scene, camera);
      if (now - previousUpdate > 70) {
        setAnimation(animationRef.current);
        previousUpdate = now;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resize?.disconnect();
      controls.removeEventListener("start", stopCamera);
      controls.dispose();
      guideMaterial.dispose();
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          for (const mat of (Array.isArray(node.material) ? node.material : [node.material])) mat.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  const current = actions[action];
  const finished = animation >= 1;
  return (
    <section aria-label="Step 2 interactive assembly instructions" className="relative flex w-full min-w-0 flex-col gap-2 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <span className="text-xs font-black uppercase tracking-wide text-[#0f69bd]">Step 2 · Guided 3D assembly · Beta</span>
        <button type="button" className="text-xs font-semibold text-[#0f69bd] underline" onClick={() => setReferenceOpen((v) => !v)}>
          {referenceOpen ? "Hide" : "Compare"} manual
        </button>
      </div>
      <div className="relative h-[250px] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#f2f8fd] sm:h-[330px] md:h-[380px]">
        <div ref={canvasRef} className="absolute inset-0 touch-none" aria-label="Three-dimensional robot viewer. Drag to rotate, pinch to zoom."/>
        {loading && !error && <div className="absolute inset-0 grid place-items-center bg-[#f2f8fd] text-sm font-semibold text-slate-600">Loading the real STL and GLB files…</div>}
        {error && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#f2f8fd] px-3"><p role="alert" className="text-sm text-amber-900">{error}</p><img src={referenceImage} alt="Manual step 2" className="max-h-[175px] max-w-full object-contain" /></div>}
      </div>
      <div className="grid grid-cols-4 gap-1" aria-label="Assembly action progress">
        {actions.map((item, index) => (
          <div key={item.title} className={"h-1.5 rounded-full " + (index <= action ? "bg-[#168eea]" : "bg-slate-200")} />
        ))}
      </div>
      <div className="rounded-xl bg-[#eaf5ff] px-3 py-2">
        <p className="text-xs font-bold text-[#0f69bd]">Action {action + 1} of {actions.length} · {current.title}</p>
        <p className="mt-1 text-xs leading-5 text-[#132654]">{current.caption}</p>
        {finished && action === actions.length - 1 && <p role="status" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-green-700"><CheckCircle2 className="size-4" /> All four animation actions completed. Verify the real parts before marking Step 2 done.</p>}
      </div>
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-4 text-amber-900">
        Illustrative tutorial: beam hole spacing is measured from STL, but the motor socket and final coupling are not verified. Follow the original instruction image for physically accurate assembly.
      </p>
      {referenceOpen && <img src={referenceImage} alt="Original manual, Step 2" className="mx-auto max-h-[240px] max-w-full rounded-xl border border-slate-200 object-contain" />}
      <div className="flex flex-wrap items-center gap-2">
        <button className="inline-flex min-h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-[#132654] disabled:opacity-40" type="button" onClick={previous} disabled={action === 0 || loading || Boolean(error)}><ArrowLeft className="size-4"/> Previous action</button>
        <button className="inline-flex min-h-10 flex-1 items-center justify-center gap-1 rounded-full bg-[#168eea] px-3 text-xs font-bold text-white disabled:opacity-40" type="button" onClick={next} disabled={!finished || action === actions.length - 1 || loading || Boolean(error)}>Next action <ArrowRight className="size-4"/></button>
        <button className="inline-flex min-h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-[#132654] disabled:opacity-40" type="button" onClick={replay} disabled={action === 0 || loading || Boolean(error)}><RotateCcw className="size-4"/> Replay</button>
        <button className="inline-flex min-h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-[#132654] disabled:opacity-40" type="button" onClick={() => {
          if (animationRef.current >= 1) seek(actionRef.current, 0, true);
          else { playingRef.current = !playingRef.current; setPlaying(playingRef.current); }
        }} disabled={action === 0 || loading || Boolean(error) || reducedMotion} aria-label={playing ? "Pause current action" : "Play current action"}>
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-[#132654]" type="button" onClick={() => setMuted((v) => !v)} aria-label={muted ? "Enable snap sound" : "Mute snap sound"}>{muted ? <VolumeX className="size-4"/> : <Volume2 className="size-4"/>}</button>
      </div>
      {action !== 0 && <label className="flex items-center gap-2 text-xs text-slate-600">
        <span className="sr-only">Current action timeline</span>
        <input aria-label="Current action timeline" type="range" min="0" max="100" step="1" value={Math.round(animation * 100)} disabled={loading || Boolean(error)} className="min-w-0 flex-1 accent-[#168eea]" onChange={(e) => seek(actionRef.current, Number(e.target.value) / 100)}/>
        <span className="w-8 text-right tabular-nums">{Math.round(animation * 100)}%</span>
      </label>}
      <p className="px-1 text-[11px] text-slate-500">Drag to rotate · Scroll or pinch to zoom · Inspect between actions. If reduced motion is enabled, use the timeline to review the movements.</p>
    </section>
  );
}
