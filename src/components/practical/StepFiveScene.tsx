import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// All transforms share the native STL pitch: 8 mm per world unit.
// Native 48989: two Z-through bores at x=-8,+8, y=4, z=0..7.8.
// Native 15100: one Z-through bore at x=-4,y=0,z=0..8.
// No built-in bridge or right-angle posts are duplicated.
export const STEP5_MODEL_PATHS = [
  "/marksmanship/models/beam11.stl",
  "/marksmanship/models/bridge-48989.stl",
  "/marksmanship/models/hollow-15100.stl",
  "/marksmanship/models/pin-long-step5.stl",
  "/marksmanship/models/pin-pin-step5.stl",
] as const;
export const STEP5_PART_IDS = [
  "STEP5_BEAM_11", "STEP5_BRIDGE_A", "STEP5_BRIDGE_B",
  "STEP5_HOLLOW_A", "STEP5_HOLLOW_B",
  "STEP5_LONG_PIN_01", "STEP5_LONG_PIN_02",
  "STEP5_LONG_PIN_03", "STEP5_LONG_PIN_04",
  "STEP5_SHORT_PIN_01", "STEP5_SHORT_PIN_02",
] as const;
export const STEP5_SNAPSHOT_KEY = "robot:marksmanship:step5:prepared:v2";
export const STEP5_BRIDGE_HOLES_MM = [[-8, 4], [8, 4]] as const;
export const STEP5_HOLLOW_HOLE_MM = [-4, 0] as const;
export const STEP5_BRIDGE_THICKNESS_MM = 7.8;
export const STEP5_HOLLOW_THICKNESS_MM = 8;
export const STEP5_LONG_PIN_COLLAR_MM = 8.5;
export const STEP5_SHORT_PIN_COLLAR_MM = 8;
const UNITS = 1 / 8;
const BRIDGE_ORIGINS: [number, number, number][] = [[-4.6, -1.5, 0],[-0.9,-1.5,0]];
const HOLLOW_ORIGINS: [number, number, number][] = [[3.1,-1.5,0],[5.8,-1.5,0]];
const PIN_FINAL: [number,number,number][] = [
  [-1,0,0],[1,0,0],[-1,0,0],[1,0,0],[-0.5,0,0.5],[-0.5,0,0.5],
];
const PIN_LOOSE: [number,number,number][] = [
  [-1.5,-2.5,3],[0.5,-2.5,3],[-1.5,-2.5,3],[0.5,-2.5,3],
  [-0.5,-2.4,2.6],[-0.5,-2.4,2.6],
];
const PIN_APPROACH: [number,number,number][] = [
  [-1,0,3.1],[1,0,3.1],[-1,0,3.1],[1,0,3.1],
  [-0.5,0,2.6],[-0.5,0,2.6],
];

export function getStepFivePreparedSnapshot() {
  const transforms: Record<string, { parent: string | null; position: [number,number,number]; rotation: [number,number,number]; model: string }> = {
    STEP5_BEAM_11: {parent:null,position:[0,4.1,0],rotation:[0,0,0],model:"beam11.stl"},
  };
  for(let i=0;i<2;i++){
    transforms[STEP5_PART_IDS[1+i]!]={
      parent:null,position:BRIDGE_ORIGINS[i]!,rotation:[0,0,0],model:"bridge-48989.stl",
    };
    transforms[STEP5_PART_IDS[3+i]!]={
      parent:null,position:HOLLOW_ORIGINS[i]!,rotation:[0,0,0],model:"hollow-15100.stl",
    };
  }
  for(let i=0;i<6;i++){
    transforms[STEP5_PART_IDS[5+i]!]={
      parent:STEP5_PART_IDS[i<4?1+Math.floor(i/2):3+(i-4)]!,
      position:PIN_FINAL[i]!,
      rotation:i<4?[Math.PI,0,0]:[0,0,0],
      model:i<4?"pin-long-step5.stl":"pin-pin-step5.stl",
    };
  }
  return {
    version:2,
    assemblyId:"marksman-step5-prepared-connectors",
    units:"8 mm per scene unit",
    models:STEP5_MODEL_PATHS,
    beamHoleCount:11,
    bridgeBodyCount:2,hollowBodyCount:2,longPinCount:4,shortPinCount:2,
    bridgeHolesMM:STEP5_BRIDGE_HOLES_MM,
    hollowHoleMM:STEP5_HOLLOW_HOLE_MM,
    bridgeThicknessMM:STEP5_BRIDGE_THICKNESS_MM,
    hollowThicknessMM:STEP5_HOLLOW_THICKNESS_MM,
    transforms,
    beamUnattached:true,
    step6Applied:false,
    full3DMeshesAvailable:true,
    // STL geometry shows a tight push fit; a real-kit insertion test is
    // still required to certify stops, elastic deformation, and retention.
    mechanicallyVerified:false,
    requiresPhysicalFitConfirmation:true,
  };
}

function geometryFor(source:BufferGeometry, kind:"beam"|"bridge"|"hollow"|"pin"){
  const copy=source.clone();
  copy.computeBoundingBox();
  if(kind==="beam") copy.translate(-40,-3.65,-3.9);
  else if(kind==="bridge") copy.translate(0,-4,-3.9);
  else if(kind==="hollow") copy.translate(0,0,-4);
  else {
    const center=copy.boundingBox!.getCenter(new Vector3());
    copy.translate(-center.x,-center.y,-center.z);
  }
  copy.scale(UNITS,UNITS,UNITS);
  copy.computeVertexNormals();
  return copy;
}
function ease(v:number){
  const t=Math.max(0,Math.min(1,v));
  return t*t*(3-2*t);
}
function mix(a:number,b:number,t:number){return a+(b-a)*t;}
function interpolated(loose:[number,number,number],align:[number,number,number],
  done:[number,number,number],t:number):[number,number,number]{
  const first=t<0.35,p=first?ease(t/0.35):ease((t-0.35)/0.65);
  const from=first?loose:align,to=first?align:done;
  return [mix(from[0],to[0],p),mix(from[1],to[1],p),mix(from[2],to[2],p)];
}
function focusFor(phase:number):Vector3 {
  if(phase>=1 && phase<=4)return new Vector3(...BRIDGE_ORIGINS[Math.floor((phase-1)/2)]!);
  if(phase===5 || phase===6)return new Vector3(...HOLLOW_ORIGINS[phase-5]!);
  return new Vector3(0,0,0);
}
function StepFiveStage({phase,replayKey,paused,resetCameraKey,onMotionComplete}:{
  phase:number; replayKey:number; paused:boolean; resetCameraKey:number;
  onMotionComplete:()=>void;
}){
  const originals=useLoader(STLLoader,[...STEP5_MODEL_PATHS]);
  const meshes=useMemo(()=>({
    beam:geometryFor(originals[0]!,"beam"),
    bridge:geometryFor(originals[1]!,"bridge"),
    hollow:geometryFor(originals[2]!,"hollow"),
    long:geometryFor(originals[3]!,"pin"),
    short:geometryFor(originals[4]!,"pin"),
  }),[originals]);
  const pinRefs=useRef<(Group|null)[]>([]);
  const controls=useRef<OrbitControlsImpl>(null);
  const previous=useRef({phase,replayKey});
  const initialized=useRef(false);
  const animation=useRef<{index:number;forward:boolean;elapsed:number;duration:number}|null>(null);
  const cameraMotion=useRef<{from:Vector3;to:Vector3;fromPos:Vector3;toPos:Vector3;elapsed:number}|null>(null);
  const completion=useRef(onMotionComplete);
  completion.current=onMotionComplete;

  useLayoutEffect(()=>{
    const was=previous.current.phase, replay=replayKey!==previous.current.replayKey;
    if(!initialized.current){
      pinRefs.current.forEach((node,i)=>node?.position.set(...(i<phase?PIN_FINAL[i]!:PIN_LOOSE[i]!)));
      initialized.current=true;
      completion.current();
    }else if(was!==phase || replay){
      const index=replay?phase-1:Math.max(was,phase)-1;
      const forward=replay || phase>was;
      if(index>=0 && index<6){
        pinRefs.current.forEach((node,i)=>{
          if(!node)return;
          if(i!==index)node.position.set(...(i<phase?PIN_FINAL[i]!:PIN_LOOSE[i]!));
          else if(replay)node.position.set(...PIN_LOOSE[i]!);
        });
      }
      animation.current={index,forward,elapsed:0,duration:index>=0 && index<6?2.3:1.3};
    }
    previous.current={phase,replayKey};
  },[phase,replayKey]);
  useLayoutEffect(()=>{
    const ctrl=controls.current;
    if(!ctrl)return;
    const center=focusFor(phase);
    const pos=center.clone().add(new Vector3(phase===0||phase===7?7:4,phase===0||phase===7?8:5,phase===0||phase===7?23:12));
    cameraMotion.current={from:ctrl.target.clone(),to:center,fromPos:ctrl.object.position.clone(),toPos:pos,elapsed:0};
  },[phase]);
  useLayoutEffect(()=>{controls.current?.reset();cameraMotion.current=null;},[resetCameraKey]);

  useFrame((state,dt)=>{
    if(paused)return;
    const delta=Math.min(dt,0.06);
    if(cameraMotion.current && controls.current){
      const c=cameraMotion.current;c.elapsed=Math.min(1,c.elapsed+delta);
      const t=ease(c.elapsed);
      controls.current.target.lerpVectors(c.from,c.to,t);
      state.camera.position.lerpVectors(c.fromPos,c.toPos,t);
      controls.current.update();
      if(t>=1)cameraMotion.current=null;
    }
    const motion=animation.current;
    if(!motion)return;
    motion.elapsed=Math.min(motion.duration,motion.elapsed+delta);
    const t=motion.elapsed/motion.duration;
    if(motion.index>=0 && motion.index<6){
      const i=motion.index;
      const v=interpolated(PIN_LOOSE[i]!,PIN_APPROACH[i]!,PIN_FINAL[i]!,motion.forward?t:1-t);
      pinRefs.current[i]?.position.set(...v);
    }
    if(t>=1){animation.current=null;completion.current();}
  });
  const activePin=phase>=1 && phase<=6 ? phase-1:-1;

  const showPin=(index:number)=>{
    const current=PIN_LOOSE[index]!;
    return <group key={STEP5_PART_IDS[5+index]}
      name={STEP5_PART_IDS[5+index]!}
      ref={node=>{pinRefs.current[index]=node;}}
      position={current}>
      <mesh geometry={index<4?meshes.long:meshes.short}
        rotation={index<4?[Math.PI,0,0]:[0,0,0]} castShadow>
        <meshStandardMaterial color={index<4?"#227acc":"#283749"} roughness={0.52}/>
      </mesh>
    </group>;
  };
  return <>
    <color attach="background" args={["#f6f9fc"]}/>
    <ambientLight intensity={1.5}/>
    <hemisphereLight args={["#ffffff","#cbdbe9",1.4]}/>
    <directionalLight position={[3,9,12]} intensity={2.1} castShadow/>
    <directionalLight position={[-7,-8,3]} intensity={0.75}/>
    <gridHelper args={[22,22,"#d8e4ee","#eaf0f5"]} rotation={[Math.PI/2,0,0]}
      position={[0,0,-2]}/>
    <group name="STEP5_BEAM_11" position={[0,4.1,0]}>
      <mesh geometry={meshes.beam} castShadow receiveShadow>
        <meshStandardMaterial color="#eee5d8" roughness={0.7}/>
      </mesh>
      {(phase===0 || phase===7) && Array.from({length:11},(_,i)=>
        <Html key={i} center position={[i-5,0.91,0.55]}
          style={{pointerEvents:"none"}}>
          <span style={{fontSize:10,fontWeight:800,color:"#185a92",background:"#fff",
            borderRadius:5,padding:"2px 4px",border:"1px solid #d8e2ec"}}>{i+1}</span>
        </Html>
      )}
    </group>
    {BRIDGE_ORIGINS.map((position,i)=>{
      const targetIndex=i*2;
      return <group key={i} name={STEP5_PART_IDS[i+1]} position={position}>
        <mesh geometry={meshes.bridge} castShadow receiveShadow>
          <meshStandardMaterial color="#b8c2ce" metalness={0.06} roughness={0.63}/>
        </mesh>
        {showPin(targetIndex)}{showPin(targetIndex+1)}
        {(activePin===targetIndex || activePin===targetIndex+1) && <>
          <mesh position={[activePin===targetIndex?-1:1,0,0.52]}>
            <torusGeometry args={[0.38,0.055,9,40]}/>
            <meshBasicMaterial color="#f7a600" depthTest={false}/>
          </mesh>
          <Line points={[[activePin===targetIndex?-1:1,0,3.2],
            [activePin===targetIndex?-1:1,0,-0.6]]}
            color="#168eea" dashed dashSize={0.17} gapSize={0.11} lineWidth={1.6}/>
        </>}
      </group>;
    })}
    {HOLLOW_ORIGINS.map((position,i)=>{
      const pinIndex=i+4;
      return <group key={i} name={STEP5_PART_IDS[i+3]} position={position}>
        <mesh geometry={meshes.hollow} castShadow receiveShadow>
          <meshStandardMaterial color="#b8c2ce" metalness={0.06} roughness={0.63}/>
        </mesh>
        {showPin(pinIndex)}
        {activePin===pinIndex && <>
          <mesh position={[-0.5,0,0.52]}>
            <torusGeometry args={[0.35,0.05,9,40]}/>
            <meshBasicMaterial color="#f7a600" depthTest={false}/>
          </mesh>
          <Line points={[[-0.5,0,2.7],[-0.5,0,-0.6]]}
            color="#168eea" dashed dashSize={0.17} gapSize={0.11} lineWidth={1.6}/>
        </>}
      </group>;
    })}
    <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.075}
      enablePan minDistance={5} maxDistance={40}
      autoRotate={phase===7&&!paused} autoRotateSpeed={0.28}/>
  </>;
}
export function StepFiveScene(props:{
  phase:number;replayKey:number;paused:boolean;resetCameraKey:number;
  onMotionComplete:()=>void;
}){
  return <Canvas aria-label="Step 5 real STL 3D connector insertion tutorial"
    camera={{position:[7,8,23],fov:45,near:0.1,far:130}}
    dpr={[1,1.6]}
    gl={{antialias:true,powerPreference:"high-performance"}}
    style={{height:"100%",width:"100%",touchAction:"none"}}>
    <Suspense fallback={null}><StepFiveStage {...props}/></Suspense>
  </Canvas>;
}
