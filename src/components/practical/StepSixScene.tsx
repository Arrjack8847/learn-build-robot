import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { STEP5_MODEL_PATHS, STEP5_PART_IDS } from "./StepFiveScene";
import {
  approachPose, beamHoleX, configComplete, getStepSixAttachments, loosePose,
  poseAtPhase, seatedPose,
  type StepSixMountConfig, type StepSixPart, type StepSixPose,
  type StepSixStepFiveTransforms,
} from "./StepSixGeometry";

const UNITS = 1/8;
const PARTS: readonly StepSixPart[] =
  ["STEP5_HOLLOW_A", "STEP5_HOLLOW_B", "STEP5_BRIDGE_A", "STEP5_BRIDGE_B"];
const ACTIVE_BY_PHASE: Partial<Record<number,StepSixPart>> = {
  1:"STEP5_HOLLOW_A",2:"STEP5_HOLLOW_B",
  3:"STEP5_BRIDGE_A",4:"STEP5_BRIDGE_A",
  5:"STEP5_BRIDGE_B",6:"STEP5_BRIDGE_B",
};
const PINS: Record<StepSixPart,readonly string[]> = {
  STEP5_HOLLOW_A:["STEP5_SHORT_PIN_01"],
  STEP5_HOLLOW_B:["STEP5_SHORT_PIN_02"],
  STEP5_BRIDGE_A:["STEP5_LONG_PIN_01","STEP5_LONG_PIN_02"],
  STEP5_BRIDGE_B:["STEP5_LONG_PIN_03","STEP5_LONG_PIN_04"],
};

export type StepSixPreparedSnapshot = {
  version:number; assemblyId:string; beamHoleCount:number; beamUnattached:boolean;
  physicallySelfConfirmed?:boolean;
  transforms:StepSixStepFiveTransforms;
};

function geometryFor(source:BufferGeometry, kind:"beam"|"bridge"|"hollow"|"pin"){
  // These are EXACTLY the native pivot/scale normalizations used in Step 5.
  const copy=source.clone();copy.computeBoundingBox();
  if(kind==="beam")copy.translate(-40,-3.65,-3.9);
  else if(kind==="bridge")copy.translate(0,-4,-3.9);
  else if(kind==="hollow")copy.translate(0,0,-4);
  else{
    const center=copy.boundingBox!.getCenter(new Vector3());
    copy.translate(-center.x,-center.y,-center.z);
  }
  copy.scale(UNITS,UNITS,UNITS);copy.computeVertexNormals();
  return copy;
}
function smooth(v:number){const a=Math.min(1,Math.max(0,v));return a*a*(3-2*a);}
function interpolate(a:StepSixPose,b:StepSixPose,t:number):StepSixPose{
  const k=smooth(t);
  return {
    position:[
      a.position[0]+(b.position[0]-a.position[0])*k,
      a.position[1]+(b.position[1]-a.position[1])*k,
      a.position[2]+(b.position[2]-a.position[2])*k,
    ],
    rotation:[
      a.rotation[0]+(b.rotation[0]-a.rotation[0])*k,
      a.rotation[1]+(b.rotation[1]-a.rotation[1])*k,
      a.rotation[2]+(b.rotation[2]-a.rotation[2])*k,
    ],
  };
}
function isLayoutToInsert(phase:number,from:number){
  return (phase===1 && from===0)||(phase===2 && from===1)
    || (phase===0 && from===1)||(phase===1 && from===2);
}
function guidePose(a:StepSixPose,b:StepSixPose,
  config:StepSixMountConfig,id:StepSixPart,beamY:number,
  phase:number,fromPhase:number,t:number):StepSixPose {
  if(isLayoutToInsert(phase,fromPhase)){
    const mid=approachPose(id,config,beamY);
    const forward=phase>fromPhase;
    const first=forward?a:b, last=forward?b:a;
    const forwardPose=t<0.36
      ?interpolate(first,mid,t/0.36)
      :interpolate(mid,last,(t-0.36)/0.64);
    return forward?forwardPose:guidePoseReverse(a,b,mid,t);
  }
  return interpolate(a,b,t);
}
function guidePoseReverse(a:StepSixPose,b:StepSixPose,
  mid:StepSixPose,t:number):StepSixPose {
  if(t<0.64)return interpolate(a,mid,t/0.64);
  return interpolate(mid,b,(t-0.64)/0.36);
}
function focusFor(phase:number,config:StepSixMountConfig,beamY:number):Vector3{
  let x=0;
  if(phase===1)x=beamHoleX(1);
  else if(phase===2)x=beamHoleX(2);
  else if(phase===3||phase===4)x=beamHoleX(config.bridgeAStart+1);
  else if(phase===5||phase===6)x=beamHoleX(config.bridgeBStart+1);
  return new Vector3(x,phase===0?1.5:beamY,0);
}
function ModelStage({phase,config,prepared,replayKey,paused,resetCameraKey,
  reducedMotion,onMotionComplete}:{
  phase:number;config:StepSixMountConfig;prepared:StepSixPreparedSnapshot;
  replayKey:number;paused:boolean;resetCameraKey:number;reducedMotion:boolean;
  onMotionComplete:()=>void;
}){
  const models=useLoader(STLLoader,[...STEP5_MODEL_PATHS]);
  const meshes=useMemo(()=>({
    beam:geometryFor(models[0]!,"beam"),bridge:geometryFor(models[1]!,"bridge"),
    hollow:geometryFor(models[2]!,"hollow"),long:geometryFor(models[3]!,"pin"),
    short:geometryFor(models[4]!,"pin"),
  }),[models]);
  const {size}=useThree();
  const portrait=size.width<650;
  const beam=prepared.transforms["STEP5_BEAM_11"]!;
  const beamY=beam.position[1];
  const groups=useRef<Partial<Record<StepSixPart,Group>>>({});
  const orbit=useRef<OrbitControlsImpl>(null);
  const previous=useRef({phase,replayKey});
  const previousConfig=useRef(config);
  const initialized=useRef(false);
  const motion=useRef<{
    id:StepSixPart;from:StepSixPose;to:StepSixPose;
    phase:number;fromPhase:number;time:number;duration:number;
  }|null>(null);
  const cameraMotion=useRef<{
    from:Vector3;to:Vector3;fromPosition:Vector3;toPosition:Vector3;time:number;
  }|null>(null);
  const complete=useRef(onMotionComplete);complete.current=onMotionComplete;
  const configured=configComplete(config);

  useLayoutEffect(()=>{
    const configChanged=previousConfig.current!==config;
    previousConfig.current=config;
    if(!initialized.current || configChanged ||
      Math.abs(phase-previous.current.phase)>1){
      // A different physical-photo calibration or Restart must reset
      // ALL four prepared groups, not leave older mounted units on the beam.
      motion.current=null;
      PARTS.forEach(id=>{
        const pose=poseAtPhase(id,phase,config,prepared.transforms,beamY);
        const part=groups.current[id];
        part?.position.set(...pose.position);part?.rotation.set(...pose.rotation);
      });
      initialized.current=true;
      complete.current();
    }else if(phase!==previous.current.phase || replayKey!==previous.current.replayKey){
      const replay=previous.current.replayKey!==replayKey;
      const fromPhase=previous.current.phase;
      const relevantAction=replay?phase:Math.max(phase,fromPhase);
      const id=ACTIVE_BY_PHASE[relevantAction];
      if(id && configured) {
        // Non-active connectors are stable at their exact Step 5 or
        // previously seated pose; preserve every pin's child transform.
        PARTS.forEach(other=>{
          if(other===id)return;
          const pose=poseAtPhase(other,phase,config,prepared.transforms,beamY);
          groups.current[other]?.position.set(...pose.position);
          groups.current[other]?.rotation.set(...pose.rotation);
        });
        const target=poseAtPhase(id,phase,config,prepared.transforms,beamY);
        const part=groups.current[id];
        const start=replay
          ?poseAtPhase(id,Math.max(0,phase-1),config,prepared.transforms,beamY)
          :part?{position:[part.position.x,part.position.y,part.position.z],
            rotation:[part.rotation.x,part.rotation.y,part.rotation.z]} as StepSixPose
            :poseAtPhase(id,fromPhase,config,prepared.transforms,beamY);
        if(replay){part?.position.set(...start.position);part?.rotation.set(...start.rotation);}
        motion.current={id,from:start,to:target,phase,
          fromPhase:replay?phase-1:fromPhase,
          time:0,duration:reducedMotion?0.12:(phase===3||phase===5?1.25:2.05)};
      }else {
        motion.current=null;
        complete.current();
      }
    }
    previous.current={phase,replayKey};
  },[phase,replayKey,configured,config,prepared,beamY,reducedMotion]);

  useLayoutEffect(()=>{
    const ctrl=orbit.current;if(!ctrl)return;
    const center=focusFor(phase,config,beamY);
    const wide=phase===0||phase===7;
    const cameraDistance=wide?(portrait?31:24):(portrait?17:12.5);
    const toPosition=center.clone().add(new Vector3(wide?8:4.7,wide?8:5,cameraDistance));
    if(reducedMotion){
      ctrl.target.copy(center);ctrl.object.position.copy(toPosition);
      ctrl.update();cameraMotion.current=null;
    }else{
      cameraMotion.current={from:ctrl.target.clone(),to:center,
        fromPosition:ctrl.object.position.clone(),toPosition,time:0};
    }
  },[phase,portrait,beamY,config,reducedMotion]);
  useLayoutEffect(()=>{orbit.current?.reset();cameraMotion.current=null;},[resetCameraKey]);
  useFrame((state,dt)=>{
    if(paused)return;
    const delta=Math.min(0.07,dt);
    if(cameraMotion.current && orbit.current){
      const c=cameraMotion.current;c.time=Math.min(1,c.time+delta);
      const v=smooth(c.time);
      orbit.current.target.lerpVectors(c.from,c.to,v);
      state.camera.position.lerpVectors(c.fromPosition,c.toPosition,v);
      orbit.current.update();
      if(v===1)cameraMotion.current=null;
    }
    const step=motion.current;if(!step)return;
    step.time=Math.min(step.duration,step.time+delta);
    const ratio=step.time/step.duration;
    const p=guidePose(step.from,step.to,config,step.id,beamY,
      step.phase,step.fromPhase,ratio);
    groups.current[step.id]?.position.set(...p.position);
    groups.current[step.id]?.rotation.set(...p.rotation);
    if(ratio>=1){motion.current=null;complete.current();}
  });

  const pin=(id:string)=>{
    const saved=prepared.transforms[id];
    if(!saved) return null;
    const isLong=id.includes("LONG");
    return <group key={id} name={id} position={saved.position} rotation={saved.rotation}>
      <mesh geometry={isLong?meshes.long:meshes.short} castShadow>
        <meshStandardMaterial color={isLong?"#2780ce":"#2f3b49"} roughness={0.56}/>
      </mesh>
    </group>;
  };
  const activeId=ACTIVE_BY_PHASE[phase];
  const highlighted=configured && activeId
    ?getStepSixAttachments(config).find(a=>a.id===activeId)
    :null;
  return <>
    <color attach="background" args={["#f7fafc"]}/>
    <ambientLight intensity={1.6}/>
    <hemisphereLight args={["#ffffff","#c6d9e9",1.4]}/>
    <directionalLight position={[4,10,13]} intensity={2.2}/>
    <directionalLight position={[-8,-5,6]} intensity={0.8}/>
    <gridHelper args={[22,22,"#d6e3ee","#eaf0f6"]}
      rotation={[Math.PI/2,0,0]} position={[0,0,-2.3]}/>
    <group name="STEP5_BEAM_11" position={beam.position} rotation={beam.rotation}>
      <mesh geometry={meshes.beam} castShadow receiveShadow>
        <meshStandardMaterial color="#efe9df" roughness={0.7}/>
      </mesh>
          </group>
    {PARTS.map(id=><group key={id} name={id}
      ref={node=>{if(node)groups.current[id]=node;else delete groups.current[id];}}>
      <mesh geometry={id.includes("BRIDGE")?meshes.bridge:meshes.hollow}
        castShadow receiveShadow>
        <meshStandardMaterial color="#bdc5ce" roughness={0.67}/>
      </mesh>
      {PINS[id].map(pin)}
    </group>)}
    {highlighted?.beamHoles.map((hole,i)=>{
      const sign=highlighted.side==="front"?1:-1;
      const x=beamHoleX(hole);
      return <group key={hole}>
        <mesh position={[x,beamY,sign*0.55]}>
          <torusGeometry args={[0.34,0.055,8,38]}/>
          <meshBasicMaterial color="#168eea" depthTest={false}/>
        </mesh>
        <Html center position={[x,beamY,sign*1.3]} style={{pointerEvents:"none"}}>
          <span style={{display:"inline-block",whiteSpace:"nowrap",fontSize:10,padding:"3px 6px",background:"rgba(255,255,255,0.95)",border:"1px solid #cbd9e8",borderRadius:6,fontWeight:800,color:"#145e9f"}}>Hole {hole} · estimated</span>
        </Html>
        <Line points={[[x,beamY,sign*3.8],[x,beamY,sign*0.1]]}
          dashed dashSize={0.2} gapSize={0.14} lineWidth={1.7}
          color={i===0?"#168eea":"#2298bd"}/>
      </group>;
    })}
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.08}
      enablePan minDistance={6} maxDistance={46}
      onStart={() => { cameraMotion.current = null; }} autoRotate={false} autoRotateSpeed={0.3}/>
  </>;
}
export function StepSixScene(props:{
  phase:number;config:StepSixMountConfig;prepared:StepSixPreparedSnapshot;
  replayKey:number;paused:boolean;resetCameraKey:number;reducedMotion:boolean;
  onMotionComplete:()=>void;
}){
  return <Canvas aria-label="Interactive 3D Step 6 using saved Step 5 connector assemblies"
    camera={{position:[8,10,31],fov:45,near:0.1,far:150}}
    dpr={[1,1.6]} gl={{antialias:true,powerPreference:"high-performance"}}
    style={{width:"100%",height:"100%",touchAction:"none"}}>
    <Suspense fallback={<Html center><span>Loading verified STL meshes…</span></Html>}>
      <ModelStage {...props}/>
    </Suspense>
  </Canvas>;
}
