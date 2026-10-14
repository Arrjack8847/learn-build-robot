import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { STEP5_MODEL_PATHS } from "./StepFiveScene";
import { beamHoleX, seatedPose, type StepSixMountConfig, type StepSixPose, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import {
  STEP_SEVEN_END_PIN_HOLE, STEP_SEVEN_FINAL_PHASE, STEP_SEVEN_PIN_IDS, STEP_SEVEN_RAIL_IDS,
  endPinPose, railBridge, railPose, stepSevenPose,
  type StepSevenMovingPart, type StepSevenRailConfig, type StepSevenRailId,
} from "./stepSevenRailGeometry";
import beam15Url from "../../../3D for marksman/beams/15 beams.stl?url";
import longConnectorUrl from "../../../3D for marksman/connector/long connector.stl?url";

const SOURCES=[...STEP5_MODEL_PATHS,beam15Url,longConnectorUrl];
const PART_IDS=["STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"] as const;
const CHILD_PINS:Record<(typeof PART_IDS)[number],readonly string[]>={
  STEP5_HOLLOW_A:["STEP5_SHORT_PIN_01"],STEP5_HOLLOW_B:["STEP5_SHORT_PIN_02"],
  STEP5_BRIDGE_A:["STEP5_LONG_PIN_01","STEP5_LONG_PIN_02"],
  STEP5_BRIDGE_B:["STEP5_LONG_PIN_03","STEP5_LONG_PIN_04"],
};
function normalized(source:BufferGeometry,kind:"beam11"|"bridge"|"hollow"|"pin"|"beam15"){
  const g=source.clone();g.computeBoundingBox();
  if(kind==="beam11")g.translate(-40,-3.65,-3.9);
  else if(kind==="bridge")g.translate(0,-4,-3.9);
  else if(kind==="hollow")g.translate(0,0,-4);
  else{const p=g.boundingBox!.getCenter(new Vector3());g.translate(-p.x,-p.y,-p.z);}
  g.scale(1/8,1/8,1/8);g.computeVertexNormals();return g;
}
const ease=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
function lerp(a:StepSixPose,b:StepSixPose,t:number):StepSixPose{
  const k=ease(t);
  return {
    position:[0,1,2].map(i=>a.position[i]!+(b.position[i]!-a.position[i]!)*k) as [number,number,number],
    rotation:[0,1,2].map(i=>a.rotation[i]!+(b.rotation[i]!-a.rotation[i]!)*k) as [number,number,number],
  };
}
type Movement={id:StepSevenMovingPart;from:StepSixPose;to:StepSixPose;time:number;duration:number;pinInsertion:boolean};
function activePart(phase:number):StepSevenMovingPart|null{
  if(phase===1||phase===2)return STEP_SEVEN_RAIL_IDS[0];
  if(phase===3)return STEP_SEVEN_PIN_IDS[0];
  if(phase===4||phase===5)return STEP_SEVEN_RAIL_IDS[1];
  if(phase===6)return STEP_SEVEN_PIN_IDS[1];
  return null;
}
function Stage({phase,config,stepSixConfig,prepared,replayKey,paused,resetCameraKey,reducedMotion,onMotionComplete}:{
  phase:number;config:StepSevenRailConfig;stepSixConfig:StepSixMountConfig;
  prepared:StepSixStepFiveTransforms;replayKey:number;paused:boolean;resetCameraKey:number;
  reducedMotion:boolean;onMotionComplete:()=>void;
}){
  const loaded=useLoader(STLLoader,SOURCES);
  const meshes=useMemo(()=>({
    beam11:normalized(loaded[0]!,"beam11"),bridge:normalized(loaded[1]!,"bridge"),
    hollow:normalized(loaded[2]!,"hollow"),long:normalized(loaded[3]!,"pin"),
    short:normalized(loaded[4]!,"pin"),beam15:normalized(loaded[5]!,"beam15"),
    blue:normalized(loaded[6]!,"pin"),
  }),[loaded]);
  const nodes=useRef<Partial<Record<StepSevenMovingPart,Group>>>({});
  const orbit=useRef<OrbitControlsImpl>(null);
  const previous=useRef({phase,replayKey});
  const mounted=useRef(false);
  const movement=useRef<Movement|null>(null);
  const flight=useRef<{from:Vector3;to:Vector3;fromPos:Vector3;toPos:Vector3;elapsed:number}|null>(null);
  const callback=useRef(onMotionComplete);callback.current=onMotionComplete;
  const {size,camera}=useThree();
  const mobile=size.width/Math.max(1,size.height)<0.95;
  const beamY=prepared["STEP5_BEAM_11"]?.position[1]??4.1;
  const configKey=JSON.stringify(config);
  const firstFinal=railPose(STEP_SEVEN_RAIL_IDS[0],STEP_SEVEN_FINAL_PHASE,config,beamY,stepSixConfig);
  const secondFinal=railPose(STEP_SEVEN_RAIL_IDS[1],STEP_SEVEN_FINAL_PHASE,config,beamY,stepSixConfig);

  useLayoutEffect(()=>{
    const was=previous.current.phase;
    const replay=replayKey!==previous.current.replayKey;
    const adjacent=Math.abs(phase-was)<=1;
    const active=adjacent?(phase<was?activePart(was):activePart(phase)):null;
    const oldPhase=replay?Math.max(0,phase-1):was;
    const canAnimate=mounted.current&&!reducedMotion&&Boolean(active)&&(phase!==was||replay);
    for(const id of [...STEP_SEVEN_RAIL_IDS,...STEP_SEVEN_PIN_IDS]){
      const node=nodes.current[id];if(!node)continue;
      const destination=stepSevenPose(id,phase,config,beamY,stepSixConfig);
      if(!canAnimate||active!==id){
        node.position.set(...destination.position);node.rotation.set(...destination.rotation);
      }
    }
    const current=active?nodes.current[active]:undefined;
    if(canAnimate&&active&&current){
      const from=replay?stepSevenPose(active,oldPhase,config,beamY,stepSixConfig):{
        position:[current.position.x,current.position.y,current.position.z] as [number,number,number],
        rotation:[current.rotation.x,current.rotation.y,current.rotation.z] as [number,number,number],
      };
      current.position.set(...from.position);current.rotation.set(...from.rotation);
      const pinInsertion=active===STEP_SEVEN_PIN_IDS[0]||active===STEP_SEVEN_PIN_IDS[1];
      movement.current={
        id:active,from,to:stepSevenPose(active,phase,config,beamY,stepSixConfig),
        time:0,duration:pinInsertion?1.2:(phase===2||phase===5)?1.6:1.4,pinInsertion:pinInsertion&&phase>was,
      };
    }else{
      movement.current=null;callback.current();
    }
    previous.current={phase,replayKey};mounted.current=true;
  },[phase,replayKey,configKey,beamY,reducedMotion,stepSixConfig]);

  useLayoutEffect(()=>{
    const ctrl=orbit.current;if(!ctrl)return;
    const first=phase<=3;
    const pinPhase=phase===3||phase===6;
    const activeRail=first?firstFinal:secondFinal;
    const interest=pinPhase
      ?new Vector3(activeRail.position[0]+STEP_SEVEN_END_PIN_HOLE-8,0,activeRail.position[2])
      :phase===STEP_SEVEN_FINAL_PHASE||phase===0
        ?new Vector3((firstFinal.position[0]+secondFinal.position[0])/2+1,0,0)
        :new Vector3(activeRail.position[0],0,activeRail.position[2]);
    const reach=phase===0||phase===STEP_SEVEN_FINAL_PHASE?(mobile?29:23):(mobile?21:15);
    const sign=railBridge(first?STEP_SEVEN_RAIL_IDS[0]:STEP_SEVEN_RAIL_IDS[1],stepSixConfig).side==="front"?1:-1;
    const destination=interest.clone().add(new Vector3(8,9,(phase===0||phase===STEP_SEVEN_FINAL_PHASE?1:sign)*reach));
    if(!mounted.current||reducedMotion){
      ctrl.target.copy(interest);camera.position.copy(destination);ctrl.update();flight.current=null;
    }else{
      flight.current={
        from:ctrl.target.clone(),to:interest,fromPos:camera.position.clone(),toPos:destination,elapsed:0,
      };
    }
  },[phase,mobile,reducedMotion,configKey,stepSixConfig,camera]);
  useLayoutEffect(()=>{
    if(resetCameraKey===0)return;
    const ctrl=orbit.current;if(!ctrl)return;
    ctrl.target.set((firstFinal.position[0]+secondFinal.position[0])/2+1,0,0);
    camera.position.copy(ctrl.target).add(new Vector3(8,10,mobile?26:20));
    flight.current=null;ctrl.update();
  },[resetCameraKey]);

  useFrame((state,dt)=>{
    if(paused)return;
    const delta=Math.min(dt,0.06);
    if(flight.current&&orbit.current){
      const f=flight.current;f.elapsed=Math.min(1,f.elapsed+delta/0.85);
      const t=ease(f.elapsed);
      orbit.current.target.lerpVectors(f.from,f.to,t);
      state.camera.position.lerpVectors(f.fromPos,f.toPos,t);
      orbit.current.update();if(f.elapsed===1)flight.current=null;
    }
    const m=movement.current;if(!m)return;
    m.time=Math.min(m.duration,m.time+delta);
    const t=m.time/m.duration;
    let pose=lerp(m.from,m.to,t);
    if(m.pinInsertion){
      // First approach the hole coaxially, then insert straight down the original STL Z axis.
      const hover:StepSixPose={
        position:[m.to.position[0],m.to.position[1],m.to.position[2]+2.25],rotation:m.to.rotation,
      };
      pose=t<0.45?lerp(m.from,hover,t/0.45):lerp(hover,m.to,(t-0.45)/0.55);
    }
    nodes.current[m.id]?.position.set(...pose.position);
    nodes.current[m.id]?.rotation.set(...pose.rotation);
    if(m.time===m.duration){movement.current=null;callback.current();}
  });
  const pin=(id:string)=>{
    const p=prepared[id];if(!p)return null;
    return <group key={id} name={id} position={p.position} rotation={p.rotation}>
      <mesh geometry={id.includes("LONG")?meshes.long:meshes.short}>
        <meshStandardMaterial color={id.includes("LONG")?"#2582d7":"#303744"} roughness={0.55}/>
      </mesh>
    </group>;
  };
  const highlighted=phase===1||phase===2?STEP_SEVEN_RAIL_IDS[0]:
    phase===4||phase===5?STEP_SEVEN_RAIL_IDS[1]:null;
  return <>
    <color attach="background" args={["#f6f9fc"]}/>
    <ambientLight intensity={1.6}/>
    <hemisphereLight args={["#ffffff","#c5d9e8",1.5]}/>
    <directionalLight position={[8,9,14]} intensity={2}/>
    <gridHelper args={[29,29,"#d1dfed","#eaf0f5"]} position={[0,-2,0]}/>
    <group name="STEP7_ASSEMBLY_A" position={[0,-beamY,0]}>
      <group name="STEP5_BEAM_11" position={prepared["STEP5_BEAM_11"]!.position} rotation={prepared["STEP5_BEAM_11"]!.rotation}>
        <mesh geometry={meshes.beam11}><meshStandardMaterial color="#adb8c4" roughness={0.63}/></mesh>
      </group>
      {PART_IDS.map(id=>{
        const pose=seatedPose(id,stepSixConfig,beamY);
        return <group key={id} name={id} position={pose.position} rotation={pose.rotation}>
          <mesh geometry={id.includes("BRIDGE")?meshes.bridge:meshes.hollow}>
            <meshStandardMaterial color="#a3aeb9" roughness={0.6}/>
          </mesh>
          {CHILD_PINS[id].map(pin)}
        </group>;
      })}
      {STEP_SEVEN_RAIL_IDS.map(id=>{
        const initial=railPose(id,phase,config,beamY,stepSixConfig);
        const selected=highlighted===id;
        const receiving=id===STEP_SEVEN_RAIL_IDS[0]?config.firstRailHole:config.secondRailHole;
        return <group key={id} name={id} position={initial.position} rotation={initial.rotation}
          ref={node=>{if(node)nodes.current[id]=node;else delete nodes.current[id];}}>
          <mesh geometry={meshes.beam15}><meshStandardMaterial color="#f2f0ea" roughness={0.65}/></mesh>
          {selected&&[receiving,receiving+2].map(hole=><mesh key={hole} position={[hole-8,0,0.54]}>
            <torusGeometry args={[0.32,0.055,8,30]}/>
            <meshBasicMaterial color="#18a4f5" depthTest={false}/>
          </mesh>)}
        </group>;
      })}
      {STEP_SEVEN_PIN_IDS.map((id,i)=>{
        const initial=endPinPose(id,phase,config,beamY,stepSixConfig);
        const selected=phase===(i===0?3:6);
        return <group key={id} name={id} position={initial.position} rotation={initial.rotation}
          ref={node=>{if(node)nodes.current[id]=node;else delete nodes.current[id];}}>
          <mesh geometry={meshes.blue}>
            <meshStandardMaterial color="#1676d5" roughness={0.5}
              emissive={selected?"#1568bc":"#000000"} emissiveIntensity={selected?0.24:0}/>
          </mesh>
        </group>;
      })}
    </group>
    {highlighted&&[0,2].map((n)=>{
      const pair=railBridge(highlighted,stepSixConfig);
      const sign=pair.side==="front"?1:-1;
      const x=beamHoleX(pair.start+n);
      return <Line key={n} points={[[x,0,sign*0.9],[x,0,sign*(config.railCenterDistance+1.7)]]}
        dashed dashSize={0.18} gapSize={0.12} lineWidth={1.6} color="#e6a418"/>;
    })}
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.08}
      enablePan={false} minDistance={5} maxDistance={60}
      autoRotate={phase===STEP_SEVEN_FINAL_PHASE&&!paused&&!reducedMotion}
      autoRotateSpeed={0.5}/>
  </>;
}
export function StepSevenRailsScene(props:{
  phase:number;config:StepSevenRailConfig;stepSixConfig:StepSixMountConfig;
  prepared:StepSixStepFiveTransforms;replayKey:number;paused:boolean;
  resetCameraKey:number;reducedMotion:boolean;onMotionComplete:()=>void;
}){
  return <Canvas aria-label="Step 7 original STL two-rail assembly with photographed receiving holes and blue end pins"
    camera={{position:[10,12,29],fov:45,near:0.1,far:150}}
    dpr={[1,1.6]} gl={{antialias:true,powerPreference:"low-power"}}
    style={{width:"100%",height:"100%",touchAction:"none"}}>
    <Suspense fallback={null}><Stage {...props}/></Suspense>
  </Canvas>;
}
