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
  endPinMount, endPinPose, railMounts, railPose, stepSevenCoreOffsetY, stepSevenPose,
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
type PoseSnapshot=Record<StepSevenMovingPart,StepSixPose>;
type Movement={
  from:PoseSnapshot;to:PoseSnapshot;fromCoreY:number;toCoreY:number;
  time:number;duration:number;pinInsertion:StepSevenMovingPart|null;
};
const MOVING_PARTS:readonly StepSevenMovingPart[]=[...STEP_SEVEN_RAIL_IDS,...STEP_SEVEN_PIN_IDS];
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
  const greyCore=useRef<Group>(null);
  const orbit=useRef<OrbitControlsImpl>(null);
  const previous=useRef({phase,replayKey,configKey:JSON.stringify(config)});
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
    const changed=was!==phase||replay;
    const configChanged=configKey!==previous.current.configKey;
    const adjacent=Math.abs(was-phase)<=1;
    const oldPhase=replay?Math.max(0,phase-1):was;
    const snapshot=(which:number):PoseSnapshot=>Object.fromEntries(
      MOVING_PARTS.map(id=>[id,stepSevenPose(id,which,config,beamY,stepSixConfig)])
    ) as PoseSnapshot;
    const apply=(poses:PoseSnapshot,coreY:number)=>{
      for(const id of MOVING_PARTS){
        const node=nodes.current[id];const pose=poses[id];if(!node)continue;
        node.position.set(...pose.position);node.rotation.set(...pose.rotation);
      }
      if(greyCore.current)greyCore.current.position.y=coreY;
    };
    const to=snapshot(phase);
    const toCoreY=stepSevenCoreOffsetY(phase);
    if(!mounted.current||!changed||configChanged||!adjacent||reducedMotion){
      movement.current=null;apply(to,toCoreY);callback.current();
    }else{
      // React Three Fiber may update group.position before layout effects run:
      // always reconstruct the OLD deterministic poses, rather than reading
      // the already-updated mesh positions. This fixes skipped/replayed moves.
      const from=snapshot(oldPhase);
      const fromCoreY=stepSevenCoreOffsetY(oldPhase);
      apply(from,fromCoreY);
      movement.current={
        from,to,fromCoreY,toCoreY,time:0,
        duration:phase===2||phase===4?1.8:phase===5||phase===6?1.25:1.45,
        pinInsertion:phase>oldPhase&&phase===5?STEP_SEVEN_PIN_IDS[0]
          :phase>oldPhase&&phase===6?STEP_SEVEN_PIN_IDS[1]:null,
      };
    }
    previous.current={phase,replayKey,configKey};mounted.current=true;
  },[phase,replayKey,configKey,beamY,reducedMotion,stepSixConfig]);

  useLayoutEffect(()=>{
    const ctrl=orbit.current;if(!ctrl)return;
    const first=phase<=2||phase===5;
    const pinPhase=phase===5||phase===6;
    const activeRail=first?firstFinal:secondFinal;
    const interest=pinPhase
      ?new Vector3(-(activeRail.position[0]+STEP_SEVEN_END_PIN_HOLE-8),-0.9,activeRail.position[2])
      :phase===STEP_SEVEN_FINAL_PHASE||phase===0
        ?new Vector3(-(firstFinal.position[0]+secondFinal.position[0])/2,-0.9,0)
        :new Vector3(-activeRail.position[0],-0.9,activeRail.position[2]);
    const reach=phase===0||phase===STEP_SEVEN_FINAL_PHASE?(mobile?20:17):(mobile?18:13.5);
    const sign=railMounts(first?STEP_SEVEN_RAIL_IDS[0]:STEP_SEVEN_RAIL_IDS[1],stepSixConfig,config).side==="front"?1:-1;
    const overview=phase===0||phase===STEP_SEVEN_FINAL_PHASE;
    const destination=interest.clone().add(new Vector3(overview?(mobile?14:10):8,overview?(mobile?13:10):9,(overview?1:sign)*reach));
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
    ctrl.target.set(-(firstFinal.position[0]+secondFinal.position[0])/2,-0.9,0);
    camera.position.copy(ctrl.target).add(new Vector3(mobile?14:10,mobile?13:10,mobile?20:17));
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
    for(const id of MOVING_PARTS){
      const node=nodes.current[id];if(!node)continue;
      let pose=lerp(m.from[id],m.to[id],t);
      if(id===m.pinInsertion){
        // Move the original long-connector STL above its actual free-end hole
        // on the BLACK-PIN-facing side of the white beam. After alignment the
        // pin travels along +local Y toward the beam, never through its back.
        const target=m.to[id];
        const hover:StepSixPose={
          position:[target.position[0],target.position[1]-2.25,target.position[2]],
          rotation:target.rotation,
        };
        pose=t<0.42?lerp(m.from[id],hover,t/0.42)
          :lerp(hover,target,(t-0.42)/0.58);
      }
      node.position.set(...pose.position);node.rotation.set(...pose.rotation);
    }
    if(greyCore.current){
      greyCore.current.position.y=m.fromCoreY+(m.toCoreY-m.fromCoreY)*ease(t);
    }
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
    phase===3||phase===4?STEP_SEVEN_RAIL_IDS[1]:null;
  return <>
    <color attach="background" args={["#f3f6fa"]}/>
    <ambientLight intensity={0.85}/>
    <hemisphereLight args={["#ffffff","#b9d1e5",0.9]}/>
    <directionalLight position={[8,9,14]} intensity={1.3}/>
    <gridHelper args={[29,29,"#e4eaf0","#f1f4f7"]} position={[0,-2,0]}/>
    <group name="STEP7_ASSEMBLY_A" position={[0,beamY,0]} rotation={[0,0,Math.PI]}>
      <group ref={greyCore} name="STEP7_GREY_CORE" position={[0,stepSevenCoreOffsetY(phase),0]}>
      <group name="STEP5_BEAM_11" position={prepared["STEP5_BEAM_11"]!.position} rotation={prepared["STEP5_BEAM_11"]!.rotation}>
        <mesh geometry={meshes.beam11}><meshStandardMaterial color="#97a4b4" roughness={0.63}/></mesh>
      </group>
      {PART_IDS.map(id=>{
        const pose=seatedPose(id,stepSixConfig,beamY);
        return <group key={id} name={id} position={pose.position} rotation={pose.rotation}>
          <mesh geometry={id.includes("BRIDGE")?meshes.bridge:meshes.hollow}>
            <meshStandardMaterial color="#8d9cae" roughness={0.6}/>
          </mesh>
          {CHILD_PINS[id].map(pin)}
        </group>;
      })}
      </group>
      {STEP_SEVEN_RAIL_IDS.map(id=>{
        const initial=railPose(id,phase,config,beamY,stepSixConfig);
        const selected=highlighted===id;
        const endSelected=phase===(id===STEP_SEVEN_RAIL_IDS[0]?5:6);
        const mount=railMounts(id,stepSixConfig,config);
        const receiving=[mount.receivingBlackHole,...mount.receivingGreyHoles];
        return <group key={id} name={id} position={initial.position} rotation={initial.rotation}
          ref={node=>{if(node)nodes.current[id]=node;else delete nodes.current[id];}}>
          <mesh geometry={meshes.beam15}><meshStandardMaterial color="#e9e6df" roughness={0.65}/></mesh>
          {selected&&receiving.map((hole,i)=><mesh key={hole} position={[hole-8,0,0.54]}>
            <torusGeometry args={[0.32,0.055,8,30]}/>
            <meshBasicMaterial color={i===0?"#253246":"#18a4f5"} depthTest={false}/>
          </mesh>)}
          {endSelected&&<mesh name={id+"-black-side-end-hole"} position={[STEP_SEVEN_END_PIN_HOLE-8,0,0.55]}>
            <torusGeometry args={[0.37,0.075,8,30]}/>
            <meshBasicMaterial color="#e4a51c" depthTest={false}/>
          </mesh>}
        </group>;
      })}
      {(phase===5||phase===6)&&(()=>{
        const id=STEP_SEVEN_PIN_IDS[phase===5?0:1];
        const mount=endPinMount(id,config,beamY,stepSixConfig);
        const [x,y,z]=mount.position;
        // Alignment line is intentionally on the same side as the black pin,
        // leading down +local Y to the seated blue end connector.
        return <Line key={id+"-insertion-axis"}
          points={[[x,y-2.2,z],[x,y-0.36,z]]}
          dashed dashSize={0.17} gapSize={0.12}
          lineWidth={2} color="#e4a51c"/>;
      })()}
      {STEP_SEVEN_PIN_IDS.map((id,i)=>{
        const initial=endPinPose(id,phase,config,beamY,stepSixConfig);
        const selected=phase===(i===0?5:6);
        return <group key={id} name={id} position={initial.position} rotation={initial.rotation}
          ref={node=>{if(node)nodes.current[id]=node;else delete nodes.current[id];}}>
          <mesh geometry={meshes.blue}>
            <meshStandardMaterial color="#1676d5" roughness={0.5}
              emissive={selected?"#1568bc":"#000000"} emissiveIntensity={selected?0.24:0}/>
          </mesh>
        </group>;
      })}
    </group>
    {highlighted&&[...railMounts(highlighted,stepSixConfig,config).sourceGreyHoles,
      railMounts(highlighted,stepSixConfig,config).sourceBlackHole].map((sourceHole,i)=>{
      const rail=railPose(highlighted,STEP_SEVEN_FINAL_PHASE,config,beamY,stepSixConfig);
      const x=-beamHoleX(sourceHole);
      return <Line key={sourceHole}
        points={[[x,1.3,rail.position[2]],[x,-config.railCenterDistance+0.1,rail.position[2]]]}
        dashed dashSize={0.18} gapSize={0.12} lineWidth={1.9}
        color={i===2?"#253246":"#168eea"}/>;
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
