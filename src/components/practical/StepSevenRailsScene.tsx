import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { STEP5_MODEL_PATHS } from "./StepFiveScene";
import { seatedPose, type StepSixMountConfig, type StepSixPose, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import { STEP_SEVEN_RAIL_IDS, STEP_SEVEN_END_PIN_IDS, endPinPose, endPinGuidedPose, railPose, type StepSevenEndPinId, type StepSevenRailConfig, type StepSevenRailId } from "./stepSevenRailGeometry";
import beam15Url from "../../../3D for marksman/beams/15 beams.stl?url";
import longConnectorUrl from "../../../3D for marksman/connector/long connector.stl?url";

const SOURCES = [...STEP5_MODEL_PATHS,beam15Url,longConnectorUrl];
const PART_IDS = ["STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"] as const;
const CHILD_PINS: Record<(typeof PART_IDS)[number],readonly string[]> = {
  STEP5_HOLLOW_A:["STEP5_SHORT_PIN_01"],
  STEP5_HOLLOW_B:["STEP5_SHORT_PIN_02"],
  STEP5_BRIDGE_A:["STEP5_LONG_PIN_01","STEP5_LONG_PIN_02"],
  STEP5_BRIDGE_B:["STEP5_LONG_PIN_03","STEP5_LONG_PIN_04"],
};
function normalized(source:BufferGeometry,kind:"beam11"|"bridge"|"hollow"|"pin"|"beam15") {
  const g=source.clone();g.computeBoundingBox();
  if(kind==="beam11")g.translate(-40,-3.65,-3.9);
  else if(kind==="bridge")g.translate(0,-4,-3.9);
  else if(kind==="hollow")g.translate(0,0,-4);
  else {const p=g.boundingBox!.getCenter(new Vector3());g.translate(-p.x,-p.y,-p.z);}
  g.scale(1/8,1/8,1/8);g.computeVertexNormals();
  return g;
}
const easing=(t:number)=>{const v=Math.max(0,Math.min(1,t));return v*v*(3-2*v);};
function lerp(a:StepSixPose,b:StepSixPose,t:number):StepSixPose {
  const p=easing(t);
  return {
    position:[0,1,2].map(i=>a.position[i]!+(b.position[i]!-a.position[i]!)*p) as [number,number,number],
    rotation:[0,1,2].map(i=>a.rotation[i]!+(b.rotation[i]!-a.rotation[i]!)*p) as [number,number,number],
  };
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
    looseBlue:normalized(loaded[6]!,"pin"),
  }),[loaded]);
  const railGroups=useRef<Partial<Record<StepSevenRailId,Group>>>({});
  const blueGroups=useRef<Partial<Record<StepSevenEndPinId,Group>>>({});
  const orbit=useRef<OrbitControlsImpl>(null);
  const previous=useRef({phase,replayKey});
  const initial=useRef(false);
  const moving=useRef<{id:StepSevenRailId;from:StepSixPose;to:StepSixPose;time:number;duration:number}|null>(null);
  const cameraFlight=useRef<{from:Vector3;to:Vector3;fromPos:Vector3;toPos:Vector3;elapsed:number}|null>(null);
  const blueMotion=useRef<{time:number;duration:number;reverse:boolean}|null>(null);
  const callback=useRef(onMotionComplete);callback.current=onMotionComplete;
  const {size}=useThree();
  const mobile=size.width/Math.max(1,size.height)<0.95;
  const beamY=prepared["STEP5_BEAM_11"]?.position[1]??4.1;
  const configKey=JSON.stringify(config);

  useLayoutEffect(()=>{
    const was=previous.current.phase;
    const replay=replayKey!==previous.current.replayKey;
    const reversingBlue=was===5&&phase===4;
    const animBlue=(phase===5&&(was===4||replay))||reversingBlue;
    const active:StepSevenRailId|null=!reversingBlue&&phase>=1&&phase<=4
      ?phase<=2?STEP_SEVEN_RAIL_IDS[0]:STEP_SEVEN_RAIL_IDS[1]:null;
    for(const id of STEP_SEVEN_RAIL_IDS){
      const node=railGroups.current[id];if(!node)continue;
      const target=railPose(id,phase,config,beamY,stepSixConfig);
      if(!initial.current||id!==active||Math.abs(phase-was)>1||reducedMotion){
        node.position.set(...target.position);node.rotation.set(...target.rotation);
      }
    }
    const current=active&&railGroups.current[active];
    if(initial.current&&current&&active&&(phase!==was||replay)&&!reducedMotion){
      const start=replay?railPose(active,Math.max(0,phase-1),config,beamY,stepSixConfig):{
        position:[current.position.x,current.position.y,current.position.z] as [number,number,number],
        rotation:[current.rotation.x,current.rotation.y,current.rotation.z] as [number,number,number],
      };
      if(replay){current.position.set(...start.position);current.rotation.set(...start.rotation);}
      moving.current={id:active,from:start,to:railPose(active,phase,config,beamY,stepSixConfig),time:0,duration:1.55};
    }else moving.current=null;
    STEP_SEVEN_END_PIN_IDS.forEach(id=>{
      const node=blueGroups.current[id];if(!node)return;
      const p=endPinPose(id,animBlue&&!reducedMotion?(reversingBlue?5:4):phase,config,beamY,stepSixConfig);
      node.position.set(...p.position);node.rotation.set(...p.rotation);
    });
    blueMotion.current=animBlue&&!reducedMotion?{time:0,duration:3.2,reverse:reversingBlue}:null;
    if(!blueMotion.current&&!moving.current)callback.current();
    previous.current={phase,replayKey};initial.current=true;
  },[phase,replayKey,configKey,config,beamY,reducedMotion,stepSixConfig]);

  useLayoutEffect(()=>{
    const ctrl=orbit.current;if(!ctrl)return;
    const pinA=endPinPose(STEP_SEVEN_END_PIN_IDS[0],5,config,beamY,stepSixConfig).position;
    const pinB=endPinPose(STEP_SEVEN_END_PIN_IDS[1],5,config,beamY,stepSixConfig).position;
    // On a resize after the final pins are seated, retain the completed
    // assembly overview. Otherwise mobile resizing re-focuses on the tiny
    // insertion point and clips the far ends of both 15-hole rails.
    const finalOverview=phase===5&&!blueMotion.current;
    const focus=phase===5&&!finalOverview
      ?new Vector3((pinA[0]+pinB[0])/2,0,(pinA[2]+pinB[2])/2)
      :new Vector3(0,0,phase>=3&&phase<=4?-1:phase>=1&&phase<=2?1:0);
    const distance=finalOverview?(mobile?68:36):
      phase===0?(mobile?62:31):(mobile?28:17);
    const camera=focus.clone().add(new Vector3(8,9,distance));
    if(reducedMotion){
      ctrl.target.copy(focus);ctrl.object.position.copy(camera);ctrl.update();cameraFlight.current=null;
    }else cameraFlight.current={
      from:ctrl.target.clone(),to:focus,fromPos:ctrl.object.position.clone(),toPos:camera,elapsed:0,
    };
  },[phase,mobile,reducedMotion,beamY,config,stepSixConfig]);
  useLayoutEffect(()=>{
    if(resetCameraKey!==0){orbit.current?.reset();cameraFlight.current=null;}
  },[resetCameraKey]);
  useFrame((state,dt)=>{
    if(paused)return;
    const delta=Math.min(dt,0.06);
    if(cameraFlight.current&&orbit.current){
      const c=cameraFlight.current;c.elapsed=Math.min(1,c.elapsed+delta/0.85);
      const t=easing(c.elapsed);
      orbit.current.target.lerpVectors(c.from,c.to,t);
      state.camera.position.lerpVectors(c.fromPos,c.toPos,t);
      orbit.current.update();
      if(c.elapsed===1)cameraFlight.current=null;
    }
    const insert=blueMotion.current;
    if(insert){
      insert.time=Math.min(insert.duration,insert.time+delta);
      const progress=insert.time/insert.duration;
      STEP_SEVEN_END_PIN_IDS.forEach((id,i)=>{
        // Connectors move one at a time. Reverse undoes the second first.
        const amount=insert.reverse
          ?1-Math.max(0,Math.min(1,progress*2-(1-i)))
          :Math.max(0,Math.min(1,progress*2-i));
        const pose=endPinGuidedPose(id,amount,config,beamY,stepSixConfig);
        blueGroups.current[id]?.position.set(...pose.position);
      });
      if(insert.time===insert.duration){
        blueMotion.current=null;
        if(!moving.current){
          if(phase===5&&orbit.current){
            cameraFlight.current={from:orbit.current.target.clone(),to:new Vector3(0,0,0),
              fromPos:state.camera.position.clone(),toPos:new Vector3(8,9,mobile?68:36),elapsed:0};
          }
          callback.current();
        }
      }
    }
    const move=moving.current;
    if(move){
      move.time=Math.min(move.duration,move.time+delta);
      const next=lerp(move.from,move.to,move.time/move.duration);
      railGroups.current[move.id]?.position.set(...next.position);
      railGroups.current[move.id]?.rotation.set(...next.rotation);
      if(move.time===move.duration){moving.current=null;if(!blueMotion.current)callback.current();}
    }
  });
  function pin(id:string){
    const p=prepared[id];if(!p)return null;
    return <group key={id} name={id} position={p.position} rotation={p.rotation}>
      <mesh geometry={id.includes("LONG")?meshes.long:meshes.short}>
        <meshStandardMaterial color={id.includes("LONG")?"#2582d7":"#303744"} roughness={0.55}/>
      </mesh>
    </group>;
  }
  return <>
    <color attach="background" args={["#f6f9fc"]}/>
    <ambientLight intensity={1.6}/>
    <hemisphereLight args={["#ffffff","#c5d9e8",1.5]}/>
    <directionalLight position={[8,9,14]} intensity={2}/>
    <gridHelper args={[25,25,"#d1dfed","#eaf0f5"]} position={[0,-2,0]}/>
    <group name="STEP7_ASSEMBLY_A" position={[0,-beamY,0]}>
      <group name="STEP5_BEAM_11" position={prepared["STEP5_BEAM_11"]!.position} rotation={prepared["STEP5_BEAM_11"]!.rotation}>
        <mesh geometry={meshes.beam11}><meshStandardMaterial color="#9daab7" roughness={0.7}/></mesh>
      </group>
      {PART_IDS.map(id=>{
        const p=seatedPose(id,stepSixConfig,beamY);
        return <group key={id} name={id} position={p.position} rotation={p.rotation}>
          <mesh geometry={id.includes("BRIDGE")?meshes.bridge:meshes.hollow}>
            <meshStandardMaterial color="#909eab" roughness={0.65}/>
          </mesh>
          {CHILD_PINS[id].map(pin)}
        </group>;
      })}
      {STEP_SEVEN_RAIL_IDS.map((id,i)=>{
        const initialPose=railPose(id,phase,config,beamY,stepSixConfig);
        return <group key={id} name={id} position={initialPose.position} rotation={initialPose.rotation}
          ref={node=>{if(node)railGroups.current[id]=node;else delete railGroups.current[id];}}>
          <mesh geometry={meshes.beam15}>
            <meshStandardMaterial color={i===0?"#f0eee8":"#e3e8ed"} roughness={0.65}/>
          </mesh>
        </group>;
      })}
      {STEP_SEVEN_END_PIN_IDS.map((id,i)=>{
        const pose=endPinPose(id,phase,config,beamY,stepSixConfig);
        const end=endPinPose(id,5,config,beamY,stepSixConfig).position;
        return <group key={id}>
          <group name={id} position={pose.position} rotation={pose.rotation}
            ref={node=>{if(node)blueGroups.current[id]=node;else delete blueGroups.current[id];}}>
            <mesh geometry={meshes.looseBlue} castShadow>
              <meshStandardMaterial color="#1478d3" roughness={0.5}/>
            </mesh>
          </group>
          {phase===5&&<group>
            <mesh position={[end[0],end[1],end[2]-0.9]}>
              <torusGeometry args={[0.34,0.05,8,32]}/>
              <meshBasicMaterial color="#168eea" depthTest={false}/>
            </mesh>
            <Line points={[[end[0],end[1],end[2]+3.2],[end[0],end[1],end[2]-0.7]]}
              dashed dashSize={0.16} gapSize={0.12} lineWidth={1.6}
              color={i===0?"#168eea":"#239ec6"}/>
          </group>}
        </group>;
      })}
    </group>
    {(phase>=1&&phase<=4)&&<Line
      points={[[0,0,phase>=3?-4.5:4.5],[0,0,phase>=3?-1.3:1.3]]}
      dashed dashSize={0.16} gapSize={0.12} lineWidth={1.6} color="#e4a51c"/>}
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.08}
      enablePan={false} minDistance={5} maxDistance={90} autoRotate={false}
      onStart={()=>{cameraFlight.current=null;}}/>
  </>;
}
export function StepSevenRailsScene(props:{
  phase:number;config:StepSevenRailConfig;stepSixConfig:StepSixMountConfig;
  prepared:StepSixStepFiveTransforms;replayKey:number;paused:boolean;
  resetCameraKey:number;reducedMotion:boolean;onMotionComplete:()=>void;
}){
  return <Canvas aria-label="Step 7 actual STL side-rail assembly, provisional connector calibration"
    camera={{position:[8,9,30],fov:45,near:0.1,far:140}}
    dpr={[1,1.6]} gl={{antialias:true,powerPreference:"low-power"}}
    style={{width:"100%",height:"100%",touchAction:"none"}}>
    <Suspense fallback={null}><Stage {...props}/></Suspense>
  </Canvas>;
}
