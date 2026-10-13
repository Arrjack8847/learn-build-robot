
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { ArrowLeft, ArrowRight, Eye, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEP_FOUR = "robot:marksmanship:step4:assembled:v1";
const RESULT = "robot:marksmanship:step5:prepared:v1";
const ROOT = "/marksmanship/models/";
const MODEL_PATHS = [ROOT + "beam11.stl", ROOT + "pin-long-step5.stl", ROOT + "pin-short-step5.stl"];
const PIN_POSITIONS: [number,number,number][] = [
  [-4,-0.85,0], [-2.6,-0.85,0], [-4,-2.75,0], [-2.6,-2.75,0],
  [2,-0.85,0], [3.5,-0.85,0],
];
const PHASES = [
  ["Identify the 11-hole beam","Place the empty 11-hole beam horizontally. Count all eleven circular holes. Do not attach anything to it."],
  ["Prepare bridge connector 1","Using your real bridge body, insert one long pin into each of its two mounting openings until both are parallel. The missing bridge body cannot be animated accurately."],
  ["Prepare bridge connector 2","Repeat with the second real bridge body and the remaining two long pins. Keep this assembly separate from the beam."],
  ["Prepare hollow connector 1","Insert one short pin into the first real hollow right-angle connector following the reference photograph. Its original 3D body is missing."],
  ["Prepare hollow connector 2","Prepare the second right-angle connector with its short pin. Place both physical connector units alongside the bridge units."],
  ["Check your prepared parts","Place the empty 11-hole beam at the top. Below it place two prepared bridge units and two prepared hollow right-angle units. These five units remain apart until Step 6."],
] as const;

function prepare(mesh: BufferGeometry, beam: boolean) {
  const result = mesh.clone();
  result.computeBoundingBox();
  if (beam) result.translate(-40,-3.65,-3.9);
  else {
    const center = result.boundingBox!.getCenter(new Vector3());
    result.translate(-center.x,-center.y,-center.z);
  }
  result.scale(0.125,0.125,0.125);
  result.computeVertexNormals();
  return result;
}
function SceneContents({phase,replay}:{phase:number,replay:number}) {
  const files = useLoader(STLLoader,MODEL_PATHS);
  const geometries = useMemo(() => [
    prepare(files[0]!,true),prepare(files[1]!,false),prepare(files[2]!,false),
  ],[files]);
  const refs = useRef<(Group|null)[]>([]);
  const clock = useRef(0);
  useEffect(() => {clock.current = 0;},[phase,replay]);
  useFrame((_,delta) => {
    clock.current = Math.min(2,clock.current+Math.min(delta,0.06));
    const lift = Math.sin(Math.PI*clock.current/2);
    refs.current.forEach((part,i) => {
      if (!part) return;
      const active = (phase===1 && i<2) || (phase===2 && i>=2 && i<4)
        || (phase===3 && i===4) || (phase===4 && i===5);
      const pos = PIN_POSITIONS[i]!;
      part.position.set(pos[0],pos[1],active ? lift*0.6 : 0);
      part.rotation.y = active ? lift*0.35 : 0;
    });
  });
  return <>
    <color attach="background" args={["#f6f9fc"]}/>
    <ambientLight intensity={1.6}/>
    <hemisphereLight args={["#ffffff","#c8dae9",1.3]}/>
    <directionalLight position={[4,8,12]} intensity={2}/>
    <gridHelper args={[18,18,"#dce7f0","#eef3f7"]} rotation={[Math.PI/2,0,0]} position={[0,0,-1.6]}/>
    <group position={[0,2.65,0]}>
      <mesh geometry={geometries[0]}><meshStandardMaterial color="#eee5d5" roughness={0.7}/></mesh>
    </group>
    {(phase===0 || phase===5) && Array.from({length:11},(_,i)=>
      <Html key={i} position={[i-5,1.72,0.7]} center style={{pointerEvents:"none"}}>
        <span style={{fontSize:10,fontWeight:800,background:"white",padding:"2px 4px",borderRadius:5,color:"#174c79",border:"1px solid #d9e0e5"}}>{i+1}</span>
      </Html>
    )}
    {PIN_POSITIONS.map((position,i) =>
      <group key={i} ref={node=>{refs.current[i]=node;}} position={position}>
        <mesh geometry={geometries[i<4?1:2]}>
          <meshStandardMaterial color={i<4?"#2279c9":"#353d49"} roughness={0.58}/>
        </mesh>
      </group>
    )}
    <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={6} maxDistance={33}/>
  </>;
}
function Scene({phase,replay}:{phase:number,replay:number}) {
  return <Canvas aria-label="11-hole beam and six loose pins, source STL inspection only"
    camera={{position:[3,7,19],fov:43,near:0.1,far:100}}
    dpr={[1,1.6]} gl={{antialias:true,powerPreference:"high-performance"}}
    style={{width:"100%",height:"100%",touchAction:"none"}}>
    <Suspense fallback={null}><SceneContents phase={phase} replay={replay}/></Suspense>
  </Canvas>;
}
export function StepFiveAssembly({onReadyChange}:{onReadyChange:(value:boolean)=>void}) {
  const [phase,setPhase]=useState(0);
  const [replay,setReplay]=useState(0);
  const [showManual,setShowManual]=useState(false);
  const [physicalDone,setPhysicalDone]=useState(false);
  const [savedFour,setSavedFour]=useState(false);
  const ready=phase===5 && physicalDone;
  useEffect(()=>{
    try {setSavedFour(Boolean(window.localStorage.getItem(STEP_FOUR)));}
    catch { /* Storage is optional. */ }
  },[]);
  useEffect(()=>{
    onReadyChange(ready);
    try {
      if(ready) window.localStorage.setItem(RESULT,JSON.stringify({
        version:1,beam:"beams/11.stl",longPins:4,shortPins:2,
        doubleSidedBodies:2,hollowRightAngleBodies:2,
        beamUnattached:true,physicallySelfConfirmed:true,
        full3DMeshesAvailable:false,mechanicallyVerified:false
      }));
      else window.localStorage.removeItem(RESULT);
    } catch { /* Storage is optional. */ }
    // Step 4 snapshot is NEVER altered.
  },[ready,onReadyChange]);
  return <div className="relative z-10 w-full space-y-3">
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-left text-xs leading-5 text-amber-950" role="status">
      <TriangleAlert className="mr-1 inline size-4" aria-hidden="true"/>
      <strong>Missing original STL bodies:</strong> two double-sided bridges and two hollow right-angle connectors.
      This 3D inspection shows the genuine 11-hole beam plus four long and two short candidate pins,
      all loose. No connector insertions are simulated or mechanically verified.
    </div>
    <div className="relative h-[295px] overflow-hidden rounded-2xl border border-slate-200 sm:h-[360px] md:h-[410px]">
      <Scene phase={phase} replay={replay}/>
      {savedFour && <span className="pointer-events-none absolute left-2 top-2 rounded-lg bg-white/90 p-2 text-[10px] font-bold text-slate-700">Step 4 shooting assembly saved separately</span>}
    </div>
    <div aria-live="polite" className="rounded-xl border border-sky-100 bg-white p-3 text-left sm:p-4">
      <p className="text-xs font-extrabold uppercase tracking-wider text-[#116eaf]">Step 5 · Inspection {phase+1} of 6</p>
      <h3 className="mt-1 text-base font-bold text-[#132654]">{PHASES[phase]![0]}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-700">{PHASES[phase]![1]}</p>
    </div>
    <div className="grid gap-2 rounded-xl bg-sky-50 p-3 text-xs font-semibold text-sky-900 sm:grid-cols-3">
      <span>1 empty 11-hole beam</span>
      <span>2 bridge bodies + 4 long pins</span>
      <span>2 hollow bodies + 2 short pins</span>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex gap-2">
        <Button size="sm" type="button" variant="outline" disabled={phase===0}
          onClick={()=>setPhase(p=>Math.max(0,p-1))}><ArrowLeft className="size-4"/> Previous</Button>
        <Button size="sm" type="button" variant="outline" onClick={()=>setReplay(k=>k+1)}>
          <RotateCcw className="size-4"/> Replay inspection
        </Button>
      </div>
      <Button size="sm" type="button" disabled={phase===5}
        onClick={()=>setPhase(p=>Math.min(5,p+1))} className="bg-[#168eea] text-white">
        Next inspection <ArrowRight className="size-4"/>
      </Button>
    </div>
    <Button size="sm" type="button" variant="ghost" onClick={()=>setShowManual(v=>!v)}>
      <Eye className="size-4"/> {showManual?"Hide":"Show"} official Steps 5–6
    </Button>
    {showManual && <div className="grid gap-2 sm:grid-cols-2">
      <img src="/marksmanship/steps/5.png" alt="Official Step 5 separate components" className="w-full rounded-lg bg-white object-contain"/>
      <img src="/marksmanship/steps/6.png" alt="Official Step 6 placement, not to be performed until next step" className="w-full rounded-lg bg-white object-contain"/>
    </div>}
    {phase===5 && <label className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700">
      <input type="checkbox" className="mt-1 size-4 accent-[#168eea]"
        checked={physicalDone} onChange={e=>setPhysicalDone(e.target.checked)}/>
      <span>I have prepared the two bridge units and two hollow units using the <strong>real physical pieces and manual</strong>, and kept them separate from the empty beam. This is manual self-confirmation, not 3D mechanical verification.</span>
    </label>}
    <p className="text-xs leading-5 text-slate-500">Source models are never substituted with inaccurate solids. Full Step 5 assembly animations must wait for the correct two connector-body meshes and seating references.</p>
  </div>;
}
