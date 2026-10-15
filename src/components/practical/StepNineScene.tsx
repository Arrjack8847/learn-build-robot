import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Component, Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, DoubleSide, Group, Matrix4, Quaternion, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { STEP5_MODEL_PATHS } from "./StepFiveScene";
import { seatedPose, type StepSixMountConfig, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import { STEP_EIGHT_PARTS, stepEightPoses, type StepEightConfig, type StepEightPart, type V3 } from "./stepEightGeometry";
import { STEP_SEVEN_FINAL_PHASE, STEP_SEVEN_PIN_IDS, STEP_SEVEN_RAIL_IDS, endPinPose, railPose, type StepSevenRailConfig } from "./stepSevenRailGeometry";
import { STEP_NINE_FINAL_PHASE, stepNineFramePose, stepNineMating } from "./stepNineGeometry";
import { motionEase, motionLerp } from "./marksmanLessonMotion";

import beam15Url from "../../../3D for marksman/beams/15 beams.stl?url";
import longConnectorUrl from "../../../3D for marksman/connector/long connector.stl?url";
import beam5Url from "../../../3D for marksman/beams/5.stl?url";
import beam7Url from "../../../3D for marksman/beams/7.stl?url";
import blackPinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

const SOURCES=[...STEP5_MODEL_PATHS,beam15Url,longConnectorUrl,beam5Url,beam7Url,blackPinUrl];
const CORE_IDS=["STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"] as const;
const CHILD_PINS:Record<(typeof CORE_IDS)[number],readonly string[]>={
  STEP5_HOLLOW_A:["STEP5_SHORT_PIN_01"],STEP5_HOLLOW_B:["STEP5_SHORT_PIN_02"],
  STEP5_BRIDGE_A:["STEP5_LONG_PIN_01","STEP5_LONG_PIN_02"],
  STEP5_BRIDGE_B:["STEP5_LONG_PIN_03","STEP5_LONG_PIN_04"],
};
function stepSevenMesh(source:BufferGeometry,kind:"beam11"|"bridge"|"hollow"|"pin"|"beam15"){
  const g=source.clone();g.computeBoundingBox();
  if(kind==="beam11")g.translate(-40,-3.65,-3.9);
  else if(kind==="bridge")g.translate(0,-4,-3.9);
  else if(kind==="hollow")g.translate(0,0,-4);
  else{const center=g.boundingBox!.getCenter(new Vector3());g.translate(-center.x,-center.y,-center.z);}
  g.scale(1/8,1/8,1/8);g.computeVertexNormals();return g;
}
function stepEightMesh(source:BufferGeometry){
  const g=source.clone();g.computeBoundingBox();
  const center=g.boundingBox!.getCenter(new Vector3());
  g.translate(-center.x,-center.y,-center.z);
  g.scale(1/8,1/8,1/8);g.computeVertexNormals();return g;
}
function stepEightMeshName(id:StepEightPart){
  return id.startsWith("FIVE")?"five":id.startsWith("SEVEN")?"seven":
    id==="FIFTEEN"?"fifteen":id.startsWith("BLUE")?"blue":"black";
}
/** Rigid axis mapping: Step 8 (x,y,z) -> Step 7 (-y,-z,x).
 * It puts the longest Step 8 beam lengthwise and in front/below the
 * Step 7 white rails, with all four blue pins pointing at their holes.
 */
const ALIGNMENT=new Quaternion().setFromRotationMatrix(new Matrix4().set(
  0,-1,0,0,
  0,0,-1,0,
  1,0,0,0,
  0,0,0,1,
));
const LOOSE=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),0.26).multiply(ALIGNMENT);
const ease=motionEase;
function StepNineStage({phase,config,frameConfig,stepSixConfig,prepared,replayKey,paused,resetCameraKey,reducedMotion,cameraView}:{
  phase:number;config:StepSevenRailConfig;frameConfig:StepEightConfig;
  stepSixConfig:StepSixMountConfig;prepared:StepSixStepFiveTransforms;
  replayKey:number;paused:boolean;resetCameraKey:number;reducedMotion:boolean;
  cameraView:"iso"|"top"|"side"|"front";
}){
  const loaded=useLoader(STLLoader,SOURCES);
  const meshes=useMemo(()=>({
    beam11:stepSevenMesh(loaded[0]!,"beam11"),
    bridge:stepSevenMesh(loaded[1]!,"bridge"),
    hollow:stepSevenMesh(loaded[2]!,"hollow"),
    long:stepSevenMesh(loaded[3]!,"pin"),
    short:stepSevenMesh(loaded[4]!,"pin"),
    rail15:stepSevenMesh(loaded[5]!,"beam15"),
    railBlue:stepSevenMesh(loaded[6]!,"pin"),
    five:stepEightMesh(loaded[7]!),
    seven:stepEightMesh(loaded[8]!),
    fifteen:stepEightMesh(loaded[5]!),
    blue:stepEightMesh(loaded[6]!),
    black:stepEightMesh(loaded[9]!),
  }),[loaded]);
  const frame=useRef<Group>(null);
  const orbit=useRef<OrbitControlsImpl>(null);
  const prior=useRef({phase,replayKey});
  const mounted=useRef(false);
  const movement=useRef<{from:V3;to:V3;fromQuat:Quaternion;toQuat:Quaternion;time:number;duration:number}|null>(null);
  const flight=useRef<{start:Vector3;end:Vector3;lookStart:Vector3;lookEnd:Vector3;time:number}|null>(null);
  const {camera,size}=useThree();
  const narrow=size.width/Math.max(1,size.height)<0.95;
  const beamY=prepared["STEP5_BEAM_11"]?.position[1]??4.1;
  const mating=useMemo(()=>stepNineMating(config,stepSixConfig,beamY),[config,stepSixConfig,beamY]);
  const completed=useMemo(()=>stepEightPoses(11,frameConfig),[frameConfig]);
  const target=mating.target;
  const pose=(p:number)=>stepNineFramePose(p,target);
  const first=pose(phase);
  const localFocus=new Vector3(-(target[0]),beamY-target[1],target[2]);
  const view=()=>{
    const look=phase<=1
      ?localFocus.clone().add(new Vector3(narrow?5.5:6,0,0))
      :localFocus.clone().add(new Vector3(0,0,0));
    const delta=cameraView==="top"?new Vector3(0.01,narrow?34:27,0.01):
      cameraView==="side"?new Vector3(0,narrow?8:6,narrow?32:24):
      cameraView==="front"?new Vector3(0,narrow?9:7,narrow?32:23):
      new Vector3(narrow?20:15,narrow?19:14,narrow?25:20);
    return {look,position:look.clone().add(delta)};
  };
  useLayoutEffect(()=>{
    const previous=prior.current;
    const replay=previous.replayKey!==replayKey;
    const changed=previous.phase!==phase||replay;
    const adjacent=Math.abs(previous.phase-phase)<=1;
    const old=replay?Math.max(0,phase-1):previous.phase;
    const from=pose(old),to=pose(phase);
    const fromQuat=from.orient?ALIGNMENT:LOOSE;
    const toQuat=to.orient?ALIGNMENT:LOOSE;
    if(!mounted.current||!changed||!adjacent||reducedMotion){
      movement.current=null;
      frame.current?.position.set(...to.position);
      frame.current?.quaternion.copy(toQuat);
    }else{
      frame.current?.position.set(...from.position);
      frame.current?.quaternion.copy(fromQuat);
      movement.current={
        from:from.position,to:to.position,fromQuat:fromQuat.clone(),toQuat:toQuat.clone(),
        time:0,duration:phase===2||phase===3?1.8:phase===4?1:1.45,
      };
    }
    prior.current={phase,replayKey};mounted.current=true;
  },[phase,replayKey,reducedMotion,target[0],target[1],target[2]]);
  useLayoutEffect(()=>{
    const ctrl=orbit.current;if(!ctrl)return;
    const destination=view();
    if(!mounted.current||reducedMotion){
      ctrl.target.copy(destination.look);camera.position.copy(destination.position);ctrl.update();flight.current=null;
    }else{
      flight.current={
        start:camera.position.clone(),end:destination.position,
        lookStart:ctrl.target.clone(),lookEnd:destination.look,time:0,
      };
    }
  },[phase,cameraView,narrow,reducedMotion,target[0],target[1],target[2],camera]);
  useLayoutEffect(()=>{
    if(!resetCameraKey)return;
    const destination=view();camera.position.copy(destination.position);
    orbit.current?.target.copy(destination.look);orbit.current?.update();
    flight.current=null;
  },[resetCameraKey]);
  useFrame((state,dt)=>{
    if(paused)return;
    const delta=Math.min(dt,0.06);
    const m=movement.current;
    if(m&&frame.current){
      m.time=Math.min(m.duration,m.time+delta);
      const t=m.time/m.duration;
      // The insertion action approaches on the actual blue pin axis:
      // Step 8 z becomes negative Step 7 Y, so its pins rise into Step 7.
      const position=phase===3
        ?(t<0.38?motionLerp(m.from,[m.to[0],m.to[1]+1.4,m.to[2]],t/0.38)
          :motionLerp([m.to[0],m.to[1]+1.4,m.to[2]],m.to,(t-0.38)/0.62))
        :motionLerp(m.from,m.to,t);
      frame.current.position.set(...position);
      frame.current.quaternion.copy(m.fromQuat).slerp(m.toQuat,ease(t));
      if(m.time===m.duration)movement.current=null;
    }
    const f=flight.current;
    if(f&&orbit.current){
      f.time=Math.min(1,f.time+delta/0.85);
      const t=ease(f.time);
      state.camera.position.lerpVectors(f.start,f.end,t);
      orbit.current.target.lerpVectors(f.lookStart,f.lookEnd,t);
      orbit.current.update();
      if(f.time===1)flight.current=null;
    }
  });
  const preparedPin=(id:string)=>{
    const saved=prepared[id];if(!saved)return null;
    return <group key={id} name={id} position={saved.position} rotation={saved.rotation}>
      <mesh geometry={id.includes("LONG")?meshes.long:meshes.short}>
        <meshStandardMaterial color={id.includes("LONG")?"#2582d7":"#303744"} roughness={0.55}/>
      </mesh>
    </group>;
  };
  const guideVisible=phase===2||phase===3;
  return <>
    <color attach="background" args={["#f3f6fa"]}/>
    <ambientLight intensity={0.95}/>
    <hemisphereLight args={["#ffffff","#b9d1e5",1.0]}/>
    <directionalLight position={[8,13,15]} intensity={1.4}/>
    <gridHelper args={[36,36,"#e3eaf1","#f1f4f7"]} position={[0,-3.8,0]}/>
    <group name="STEP9_SHARED_REFERENCE" position={[0,beamY,0]} rotation={[0,0,Math.PI]}>
      <group name="STEP9_STEP7_COMPLETE_ASSEMBLY">
        <group name="STEP5_BEAM_11" position={prepared["STEP5_BEAM_11"]!.position}
          rotation={prepared["STEP5_BEAM_11"]!.rotation}>
          <mesh geometry={meshes.beam11}><meshStandardMaterial color="#97a4b4" roughness={0.63}/></mesh>
        </group>
        {CORE_IDS.map(id=>{
          const part=seatedPose(id,stepSixConfig,beamY);
          return <group key={id} name={id} position={part.position} rotation={part.rotation}>
            <mesh geometry={id.includes("BRIDGE")?meshes.bridge:meshes.hollow}>
              <meshStandardMaterial color="#8d9cae" roughness={0.6}/>
            </mesh>
            {CHILD_PINS[id].map(preparedPin)}
          </group>;
        })}
        {STEP_SEVEN_RAIL_IDS.map(id=>{
          const rail=railPose(id,STEP_SEVEN_FINAL_PHASE,config,beamY,stepSixConfig);
          const holes=mating.joints.filter(j=>j.stepSevenRail===id);
          return <group key={id} name={id} position={rail.position} rotation={rail.rotation}>
            <mesh geometry={meshes.rail15}><meshStandardMaterial color="#e9e6df" roughness={0.65}/></mesh>
            {guideVisible&&holes.map(j=><mesh key={j.stepEightPin}
              name={"STEP9_TARGET_"+j.stepEightPin}
              position={[j.receivingHole-8,0,-0.55]}>
              <torusGeometry args={[0.34,0.075,10,32]}/>
              <meshBasicMaterial color={j.alreadyOccupiedByStepSeven?"#d97706":"#168eea"}
                side={DoubleSide} depthTest={false}/>
            </mesh>)}
          </group>;
        })}
        {STEP_SEVEN_PIN_IDS.map(id=>{
          const pin=endPinPose(id,STEP_SEVEN_FINAL_PHASE,config,beamY,stepSixConfig);
          return <group key={id} name={id} position={pin.position} rotation={pin.rotation}>
            <mesh geometry={meshes.railBlue}><meshStandardMaterial color="#1676d5" roughness={0.5}/></mesh>
          </group>;
        })}
      </group>
      <group name="STEP9_STEP8_COMPLETE_ASSEMBLY" ref={frame}
        position={first.position} quaternion={first.orient?ALIGNMENT:LOOSE}>
        {STEP_EIGHT_PARTS.map(id=>{
          const p=completed[id],model=stepEightMeshName(id);
          const color=model==="blue"?"#1576ce":model==="black"?"#293544":
            model==="five"?"#e6ebf1":model==="seven"?"#bac9d9":"#f1f3f7";
          return <group key={id} name={"STEP8_"+id} position={p.position} rotation={p.rotation}>
            <mesh geometry={meshes[model]} castShadow receiveShadow>
              <meshStandardMaterial color={color} roughness={0.54} side={DoubleSide}
                emissive={guideVisible&&id.startsWith("BLUE")?"#1568bc":"#000000"}
                emissiveIntensity={guideVisible&&id.startsWith("BLUE")?0.2:0}/>
            </mesh>
          </group>;
        })}
      </group>
      {guideVisible&&mating.joints.map(j=><Line key={j.stepEightPin}
        points={[
          [j.stepSevenLocalTarget[0],j.stepSevenLocalTarget[1]+0.5,j.stepSevenLocalTarget[2]],
          [j.stepSevenLocalTarget[0],j.stepSevenLocalTarget[1]+2.4,j.stepSevenLocalTarget[2]],
        ]}
        color={j.alreadyOccupiedByStepSeven?"#d97706":"#168eea"}
        dashed dashSize={0.18} gapSize={0.12} lineWidth={2}/>)}
    </group>
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.08}
      enablePan={false} minDistance={7} maxDistance={74}
      autoRotate={phase===STEP_NINE_FINAL_PHASE&&!paused&&!reducedMotion&&cameraView==="iso"}
      autoRotateSpeed={0.4}/>
  </>;
}
class ViewerBoundary extends Component<{children:React.ReactNode},{message:string|null}>{
  override state={message:null as string|null};
  static getDerivedStateFromError(error:Error){return {message:error.message};}
  override render(){
    return this.state.message
      ?<div role="alert" className="grid h-full place-items-center p-5 text-center text-sm text-red-800">
        The Step 9 real-STL viewer could not load: {this.state.message}
      </div>:this.props.children;
  }
}
export function StepNineScene(props:{
  phase:number;config:StepSevenRailConfig;frameConfig:StepEightConfig;
  stepSixConfig:StepSixMountConfig;prepared:StepSixStepFiveTransforms;
  replayKey:number;paused:boolean;resetCameraKey:number;reducedMotion:boolean;
  cameraView:"iso"|"top"|"side"|"front";
}){
  return <ViewerBoundary>
    <Canvas camera={{position:[13,13,25],fov:44,near:0.1,far:180}}
      dpr={[1,1.6]} gl={{antialias:true,powerPreference:"low-power"}}
      style={{width:"100%",height:"100%",touchAction:"none"}}
      aria-label="Step 9 joins the completed Step 8 frame to Step 7 at four photographed blue-pin targets">
      <Suspense fallback={null}><StepNineStage {...props}/></Suspense>
    </Canvas>
  </ViewerBoundary>;
}
