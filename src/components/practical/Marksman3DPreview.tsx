import { useEffect, useRef, useState } from "react";
import { MarksmanMotorAssembly } from "./MarksmanMotorAssembly";
import { Pause, Play, RotateCcw } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import motorUrl from "../../../3D for marksman/mortor.glb?url";
import beam5Url from "../../../3D for marksman/beams/5.stl?url";
import beam15Url from "../../../3D for marksman/beams/15 beams.stl?url";
import discUrl from "../../../3D for marksman/beams/ROUND DISC.stl?url";
import shortAxleUrl from "../../../3D for marksman/axles/short.stl?url";
import middleAxleUrl from "../../../3D for marksman/axles/middle.stl?url";
import lBeamUrl from "../../../3D for marksman/beams/L/beam L small.stl?url";
import pinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";
import longPinUrl from "../../../3D for marksman/connector/long connector.stl?url";
import axleConnectorUrl from "../../../3D for marksman/connector/axle connector.stl?url";

type PartId = "motor" | "beam5" | "beam15" | "disc" | "shortAxle" | "middleAxle" | "lBeam" | "pin" | "longPin" | "axleConnector";
type V3 = [number, number, number];
type Piece = { part: PartId; end: V3; begin?: V3; rotation?: V3; colour?: number };
const MODEL_URLS: Record<Exclude<PartId, "motor">, string> = {
  beam5: beam5Url, beam15: beam15Url, disc: discUrl, shortAxle: shortAxleUrl,
  middleAxle: middleAxleUrl, lBeam: lBeamUrl, pin: pinUrl,
  longPin: longPinUrl, axleConnector: axleConnectorUrl,
};

// These are hand-authored teaching poses, NOT validated physical assembly coordinates.
// The guide gives reference pictures but no 3D transforms. Keep this limitation visible.
const PREVIEW: Record<1 | 2 | 3 | 4, Piece[]> = {
  1: [
    { part: "motor", end: [-2.1, 0.3, 0] },
    { part: "beam5", end: [0.75, -0.9, 0] },
    { part: "disc", end: [1.0, 0.8, 0] },
    { part: "shortAxle", end: [2.3, 0.7, 0] },
    { part: "pin", end: [2.3, -0.8, 0] },
  ],
  2: [
    { part: "motor", begin: [-3.5, 1, 0], end: [-1.35, 0, 0] },
    { part: "shortAxle", begin: [-3.0, 2.2, 0.5], end: [-0.05, 0, 0.3] },
    { part: "beam5", begin: [3.2, -1.8, 0], end: [1.6, -0.5, 0] },
    { part: "disc", begin: [3.3, 1.8, 0.8], end: [1.6, 0.1, 0.6] },
    { part: "pin", begin: [3.8, -0.2, 0.8], end: [1.6, -0.5, 0.5] },
  ],
  3: [
    { part: "beam15", end: [0, 0, 0] },
    { part: "longPin", end: [-2.65, -0.55, 0.65] },
    { part: "middleAxle", end: [0.6, 1.5, 0] },
    { part: "axleConnector", end: [-0.95, 1.4, 0] },
    { part: "lBeam", end: [-2.4, -1.65, 0], rotation: [0, 0, 0.45] },
    { part: "lBeam", end: [2.4, -1.65, 0], rotation: [0, 0, -0.45] },
    { part: "pin", end: [-3.2, 1.1, 0] },
    { part: "pin", end: [3.2, 1.1, 0] },
  ],
  4: [
    { part: "beam15", end: [0, 0, 0] },
    { part: "longPin", end: [-2.65, 0, 0.4], begin: [-3.4, 1.1, 2] },
    { part: "lBeam", begin: [-3.9, -2.7, 1], end: [-2.7, -0.6, 0.3], rotation: [0, 0, 0.55] },
    { part: "lBeam", begin: [3.9, -2.7, 1], end: [2.7, -0.6, 0.3], rotation: [0, 0, -0.55] },
    { part: "pin", begin: [-3.8, 1.5, 2], end: [-2.7, -0.55, 0.75] },
    { part: "pin", begin: [3.8, 1.5, 2], end: [2.7, -0.55, 0.75] },
    { part: "middleAxle", begin: [1.5, 3, 1], end: [1.5, 0.1, 0.65] },
    { part: "axleConnector", begin: [3.5, 2.6, 0.8], end: [2.6, 0.1, 0.65] },
  ],
};

function eased(t: number) { return t * t * (3 - 2 * t); }
function vector(v: V3) { return new THREE.Vector3(v[0], v[1], v[2]); }

export function Marksman3DPreview({
  step, referenceImage, onReadyChange, onBeginStep2, onCompleteStep,
}: {
  step: number; referenceImage: string;
  onReadyChange?: ((ready: boolean) => void) | undefined;
  onBeginStep2?: (() => void) | undefined;
  onCompleteStep?: (() => void) | undefined;
}) {
  if (step <= 2) {
    return (
      <MarksmanMotorAssembly
        step={step}
        referenceImage={referenceImage}
        onReadyChange={onReadyChange}
        onBeginStep2={onBeginStep2}
        onCompleteStep={onCompleteStep}
      />
    );
  }
  return <LegacyMarksmanPreview step={step} referenceImage={referenceImage} />;
}

function LegacyMarksmanPreview({ step, referenceImage }: { step: number; referenceImage: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const playingRef = useRef(true);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [referenceVisible, setReferenceVisible] = useState(false);
  const validStep = step >= 1 && step <= 4;
  const pieces = validStep ? PREVIEW[step as 1 | 2 | 3 | 4] : [];

  useEffect(() => {
    const host = containerRef.current;
    if (!host || !validStep) return;
    let cancelled = false;
    let frame = 0;
    let observer: ResizeObserver | undefined;
    let renderer: THREE.WebGLRenderer | undefined;
    let controls: OrbitControls | undefined;
    const scene = new THREE.Scene();
    const entries: Array<{ object: THREE.Object3D; from: THREE.Vector3; to: THREE.Vector3; rotation: V3 }> = [];

    setError(null);
    setLoading(true);
    progressRef.current = 0;
    setProgress(0);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    playingRef.current = !reducedMotion;
    setPlaying(!reducedMotion);

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
      renderer.setClearColor(0xf3f8fd);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      host.appendChild(renderer.domElement);
    } catch {
      setError("3D rendering is not available on this device.");
      setLoading(false);
      return;
    }
    const activeRenderer = renderer;
    const camera = new THREE.PerspectiveCamera(43, 1, 0.01, 200);
    camera.position.set(4.7, -8.0, 9.2);
    camera.up.set(0, 0, 1);
    controls = new OrbitControls(camera, renderer.domElement);
    const activeControls = controls;
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 24;
    controls.update();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8da4b9, 2.4));
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(4, -5, 10);
    scene.add(key);
    const grid = new THREE.GridHelper(12, 24, 0xc5d5e4, 0xe1ebf3);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -1.4;
    scene.add(grid);

    const used = [...new Set(pieces.map((piece) => piece.part))];
    const stlLoader = new STLLoader();
    const gltfLoader = new GLTFLoader();

    const setup = async () => {
      const geometryMap = new Map<PartId, THREE.BufferGeometry>();
      let motorModel: THREE.Object3D | null = null;
      await Promise.all(used.map(async (part) => {
        if (part === "motor") {
          const gltf = await gltfLoader.loadAsync(motorUrl);
          motorModel = gltf.scene;
        } else {
          const geometry = await stlLoader.loadAsync(MODEL_URLS[part]);
          geometry.computeVertexNormals();
          geometry.center(); // critical: several source STL pins are offset far from origin
          geometryMap.set(part, geometry);
        }
      }));
      if (cancelled) return;
      for (const [index, piece] of pieces.entries()) {
        let object: THREE.Object3D;
        if (piece.part === "motor") {
          if (!motorModel) continue;
          const clone = (motorModel as THREE.Object3D).clone(true);
          const bounds = new THREE.Box3().setFromObject(clone);
          const centre = bounds.getCenter(new THREE.Vector3());
          const size = bounds.getSize(new THREE.Vector3());
          clone.position.sub(centre);
          const wrap = new THREE.Group();
          wrap.add(clone);
          wrap.scale.setScalar(2.2 / Math.max(size.x, size.y, size.z, 0.001));
          object = wrap;
        } else {
          const source = geometryMap.get(piece.part);
          if (!source) continue;
          const color = piece.colour ?? (
            piece.part === "pin" || piece.part === "longPin" ? 0x246ee8
            : piece.part.includes("Axle") || piece.part === "middleAxle" || piece.part === "shortAxle" ? 0x354a5e
            : 0xd6dfe8
          );
          const mesh = new THREE.Mesh(source, new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0.07, side: THREE.DoubleSide }));
          mesh.scale.setScalar(0.05); // source STL units are millimetres; 8 mm hole pitch -> 0.4 scene units
          object = mesh;
        }
        object.rotation.set(...(piece.rotation ?? [0, 0, 0]));
        scene.add(object);
        const to = vector(piece.end);
        const from = vector(piece.begin ?? [piece.end[0] + (index % 2 ? 0.6 : -0.6), piece.end[1] + 0.8, piece.end[2] + 1.5]);
        if (step === 1 || step === 3) from.copy(to);
        entries.push({ object, from, to, rotation: piece.rotation ?? [0, 0, 0] });
      }
      setLoading(false);
    };
    setup().catch(() => {
      if (!cancelled) {
        setError("The 3D assets could not be loaded. Use the manual image below.");
        setLoading(false);
      }
    });

    observer = new ResizeObserver(() => {
      const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
      activeRenderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    observer.observe(host);

    let lastTime = performance.now(), lastStateUpdate = 0;
    const tick = (time: number) => {
      if (cancelled) return;
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      if (playingRef.current) {
        progressRef.current = Math.min(1, progressRef.current + delta / 4.5);
        if (progressRef.current === 1) {
          playingRef.current = false;
          setPlaying(false);
        }
      }
      const t = eased(progressRef.current);
      for (const entry of entries) {
        entry.object.position.lerpVectors(entry.from, entry.to, t);
        entry.object.rotation.set(...entry.rotation);
      }
      if (time - lastStateUpdate > 100) {
        setProgress(progressRef.current);
        lastStateUpdate = time;
      }
      activeControls.update();
      activeRenderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      activeControls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((mat) => mat.dispose());
        }
      });
      activeRenderer.dispose();
      if (activeRenderer.domElement.parentNode === host) host.removeChild(activeRenderer.domElement);
    };
  }, [step]);

  const togglePlayback = () => {
    if (progressRef.current >= 1) progressRef.current = 0;
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  };
  const replay = () => {
    progressRef.current = 0;
    setProgress(0);
    playingRef.current = true;
    setPlaying(true);
  };

  if (!validStep) return null;

  return (
    <section aria-label={`3D assembly preview for step ${step}`} className="relative flex w-full flex-col gap-2 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <span className="text-xs font-black uppercase tracking-wider text-[#0f69bd]">3D instruction preview · Beta</span>
        <button type="button" className="text-xs font-bold text-[#0f69bd] underline underline-offset-2" onClick={() => setReferenceVisible((v) => !v)}>
          {referenceVisible ? "Hide manual reference" : "Compare manual reference"}
        </button>
      </div>
      <div className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#f3f8fd] sm:h-[345px] md:h-[410px]">
        <div ref={containerRef} className="absolute inset-0 touch-pan-y" aria-label="3D viewport. Drag to orbit, pinch or scroll to zoom." />
        {loading && !error && <p className="absolute inset-0 grid place-items-center bg-[#f3f8fd] text-sm font-bold text-slate-600">Loading actual 3D robot parts…</p>}
        {error && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f3f8fd] p-4"><p role="alert" className="text-sm text-slate-600">{error}</p><img className="max-h-[205px] object-contain" src={referenceImage} alt={`Manual reference step ${step}`} /></div>}
      </div>
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold leading-4 text-amber-900">
        Illustrative 3D preview — assembly placement pending verification against the real robot. Use the manual picture for exact positioning.
      </p>
      {referenceVisible && <img src={referenceImage} alt={`Original assembly manual, step ${step}`} className="mx-auto max-h-[250px] w-full rounded-xl border border-slate-200 object-contain" />}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <button className="inline-flex min-h-10 items-center gap-1 rounded-full bg-[#168eea] px-4 text-sm font-bold text-white" type="button" onClick={togglePlayback} disabled={Boolean(error) || loading}>
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}{playing ? "Pause" : "Play"}
        </button>
        <button className="inline-flex min-h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-[#132654]" type="button" onClick={replay} disabled={Boolean(error) || loading}>
          <RotateCcw className="size-4" /> Replay
        </button>
        <label className="flex min-w-[95px] flex-1 items-center gap-2 text-xs text-slate-600">
          <span className="sr-only">Assembly animation position</span>
          <input type="range" min={0} max={100} step={1} value={Math.round(progress * 100)} onChange={(event) => {
            const value = Number(event.target.value) / 100;
            progressRef.current = value;
            setProgress(value);
            playingRef.current = false;
            setPlaying(false);
          }} className="w-full accent-[#168eea]" disabled={Boolean(error) || loading} aria-label="Assembly timeline" />
          <span className="w-8 text-right tabular-nums">{Math.round(progress * 100)}%</span>
        </label>
      </div>
      <p className="px-1 text-[11px] text-slate-500">Orbit: drag on the model · Zoom: scroll or pinch · Animation is a demonstration, not an interactive placement check.</p>
    </section>
  );
}
