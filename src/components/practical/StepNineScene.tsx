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
import {
  STEP_NINE_CAMERA_DURATION, STEP_NINE_FINAL_PHASE,
  STEP_NINE_PREP_DURATION, STEP_NINE_PREP_ENTRANCE_OFFSET,
  STEP_NINE_STEP_SEVEN_YAW, STEP_NINE_OPPOSITE_FACE_YAW,
  stepNineStepSevenPose, stepNineFramePose, stepNineMating, stepNineTurnedPoint,
} from "./stepNineGeometry";
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
function stepEightMeshName(id:StepEightPart):"five"|"seven"|"fifteen"|"blue"|"black"{
  return id.startsWith("FIVE")?"five":id.startsWith("SEVEN")?"seven":
    id==="FIFTEEN"?"fifteen":id.startsWith("BLUE")?"blue":"black";
}
/** Step 8 local +Z points shared -Y = WORLD UP through the shared
 * outer scene root. A horizontal yaw around shared Y reverses X and Z
 * while preserving -Y: the four mounting blue pins remain upright.
 * Rotate the ENTIRE Step 8 root during Action 1, never its individual parts.
 */
const INITIAL_ALIGNMENT=new Quaternion().setFromRotationMatrix(new Matrix4().set(
  0,-1,0,0,
  0,0,-1,0,
  1,0,0,0,
  0,0,0,1,
));
const OPPOSITE_FACE_ALIGNMENT=new Quaternion()
  .setFromAxisAngle(new Vector3(0,1,0),STEP_NINE_OPPOSITE_FACE_YAW)
  .multiply(INITIAL_ALIGNMENT);
const ease=motionEase;
function StepNineStage({phase,config,frameConfig,stepSixConfig,prepared,replayKey,paused,resetCameraKey,reducedMotion,cameraView,onMotionComplete}:{
  phase:number;config:StepSevenRailConfig;frameConfig:StepEightConfig;
  stepSixConfig:StepSixMountConfig;prepared:StepSixStepFiveTransforms;
  replayKey:number;paused:boolean;resetCameraKey:number;reducedMotion:boolean;
  cameraView:"iso"|"top"|"side"|"front"|"bottom";
  onMotionComplete?:()=>void;
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
  const stepSeven=useRef<Group>(null);
  const orbit=useRef<OrbitControlsImpl>(null);
  const motionDone=useRef(onMotionComplete);
  motionDone.current=onMotionComplete;
  const prepEntrance=useRef<{
    stepSevenFrom:V3;stepEightFrom:V3;stepEightTo:V3;
    elapsed:number;duration:number;
  }|null>(null);
  const firstCamera=useRef(true);
  const prior=useRef({phase,replayKey});
  const mounted=useRef(false);
  const movement=useRef<{
    fromEight:V3;toEight:V3;
    fromSeven:V3;toSeven:V3;
    fromQuat:Quaternion;toQuat:Quaternion;
    action:number;reverse:boolean;time:number;duration:number;
  }|null>(null);
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
    // Action 0 deliberately includes the two WHOLE completed structures,
    // not Step 8's earlier layout of eleven loose parts.
    const aspect=size.width/Math.max(1,size.height);
    const prepScale=phase===0?Math.max(1,0.9/Math.max(0.45,aspect)):1;
    const look=phase===0
      ?localFocus.clone().add(new Vector3(8.5,0,0))
      :phase===1
        ?localFocus.clone().add(new Vector3(narrow?5.5:6,0,0))
        :localFocus.clone();
    const delta=cameraView==="top"
      ?new Vector3(0.01,(phase===0?33:27)*prepScale,0.01):
      cameraView==="bottom"
        ?new Vector3(0.01,-(phase===0?33:27)*prepScale,0.01):
      cameraView==="side"
        ?new Vector3(0,(phase===0?12:6)*prepScale,(phase===0?36:24)*prepScale):
      cameraView==="front"
        ?new Vector3(0,(phase===0?10:7)*prepScale,(phase===0?36:23)*prepScale):
      phase===0
        ?new Vector3(16*prepScale,20*prepScale,32*prepScale):
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
    const fromSeven=stepNineStepSevenPose(old);
    const toSeven=stepNineStepSevenPose(phase);
    const fromQuat=old>=1?OPPOSITE_FACE_ALIGNMENT:INITIAL_ALIGNMENT;
    const toQuat=phase>=1?OPPOSITE_FACE_ALIGNMENT:INITIAL_ALIGNMENT;
    const enterPreparation=phase===0&&(!mounted.current||replay)&&!reducedMotion;
    prepEntrance.current=null;
    if(enterPreparation){
      // Step 7 and Step 8 enter separately, as in the original reference photo.
      const fromStart:V3=[STEP_NINE_PREP_ENTRANCE_OFFSET,0,0];
      const fromEight:V3=[
        to.position[0]-STEP_NINE_PREP_ENTRANCE_OFFSET,to.position[1],to.position[2],
      ];
      stepSeven.current?.position.set(...fromStart);
      frame.current?.position.set(...fromEight);
      frame.current?.quaternion.copy(toQuat);
      movement.current=null;
      prepEntrance.current={
        stepSevenFrom:fromStart,stepEightFrom:fromEight,
        stepEightTo:to.position,elapsed:0,duration:STEP_NINE_PREP_DURATION,
      };
    }else{
      const movesEight=from.position.some((v,i)=>Math.abs(v-to.position[i]!)>0.00001)||
        !fromQuat.equals(toQuat);
      const movesSeven=fromSeven.some((v,i)=>Math.abs(v-toSeven[i]!)>0.00001);
      const animate=mounted.current&&changed&&adjacent&&!reducedMotion&&
        (movesEight||movesSeven);
      stepSeven.current?.position.set(...(animate?fromSeven:toSeven));
      frame.current?.position.set(...(animate?from.position:to.position));
      frame.current?.quaternion.copy(animate?fromQuat:toQuat);
      movement.current=animate?{
        fromEight:from.position,toEight:to.position,
        fromSeven,toSeven,fromQuat:fromQuat.clone(),toQuat:toQuat.clone(),
        action:Math.max(old,phase),reverse:old>phase,
        time:0,duration:Math.max(old,phase)===2||Math.max(old,phase)===3?1.8:1.45,
      }:null;
      if(!animate)motionDone.current?.();
    }
    prior.current={phase,replayKey};mounted.current=true;
  },[phase,replayKey,reducedMotion,target[0],target[1],target[2]]);
  useLayoutEffect(()=>{
    const ctrl=orbit.current;if(!ctrl)return;
    const destination=view();
    if(firstCamera.current||reducedMotion){
      ctrl.target.copy(destination.look);camera.position.copy(destination.position);ctrl.update();flight.current=null;
    }else{
      flight.current={
        start:camera.position.clone(),end:destination.position,
        lookStart:ctrl.target.clone(),lookEnd:destination.look,time:0,
      };
    }
    firstCamera.current=false;
  },[phase,cameraView,narrow,size.width,size.height,reducedMotion,target[0],target[1],target[2],camera]);
  useLayoutEffect(()=>{
    if(!resetCameraKey)return;
    const destination=view();camera.position.copy(destination.position);
    orbit.current?.target.copy(destination.look);orbit.current?.update();
    flight.current=null;
  },[resetCameraKey]);
  useFrame((state,dt)=>{
    if(paused)return;
    const delta=Math.min(dt,0.06);
    const entrance=prepEntrance.current;
    if(entrance){
      entrance.elapsed=Math.min(entrance.duration,entrance.elapsed+delta);
      const t=entrance.elapsed/entrance.duration;
      stepSeven.current?.position.set(...motionLerp(entrance.stepSevenFrom,[0,0,0],t));
      // Slightly stagger Step 8's arrival so the learner can distinguish
      // the two completed structures without overlapping their movements.
      const stepEightT=Math.max(0,Math.min(1,(t-0.10)/0.90));
      frame.current?.position.set(...motionLerp(
        entrance.stepEightFrom,entrance.stepEightTo,stepEightT));
      if(t===1){prepEntrance.current=null;motionDone.current?.();}
    }
    const m=movement.current;
    if(m&&frame.current&&stepSeven.current){
      m.time=Math.min(m.duration,m.time+delta);
      const t=m.time/m.duration;
      let stepEightPosition=motionLerp(m.fromEight,m.toEight,t);
      let stepSevenPosition=motionLerp(m.fromSeven,m.toSeven,t);
      if(m.action===2){
        // Approach without overlap: raise the complete Step 7 structure
        // FIRST (42%), then position Step 8 UNDER it (58%).
        // Reversing extracts the lower Step 8 before lowering Step 7.
        if(!m.reverse){
          const clearanceT=Math.min(1,t/0.42);
          const parkingT=Math.max(0,Math.min(1,(t-0.42)/0.58));
          stepSevenPosition=motionLerp(m.fromSeven,m.toSeven,clearanceT);
          stepEightPosition=motionLerp(m.fromEight,m.toEight,parkingT);
        }else{
          const parkingT=Math.min(1,t/0.58);
          const clearanceT=Math.max(0,Math.min(1,(t-0.58)/0.42));
          stepEightPosition=motionLerp(m.fromEight,m.toEight,parkingT);
          stepSevenPosition=motionLerp(m.fromSeven,m.toSeven,clearanceT);
        }
      }else if(m.action===3){
        // Photo-based assembly: Step 8 is absolutely STATIONARY.
        // Lower the rigid Step 7 assembly onto all four upward blue pins.
        // Split the VERTICAL movement into approach (42%) and seat (58%).
        // The exact seating depth is provisional, not mechanically certified.
        const halfway:V3=[
          m.toSeven[0],(m.fromSeven[1]+m.toSeven[1])/2,m.toSeven[2],
        ];
        const approach=t<0.42?t/0.42:(t-0.42)/0.58;
        stepSevenPosition=t<0.42
          ?motionLerp(m.fromSeven,halfway,approach)
          :motionLerp(halfway,m.toSeven,approach);
        stepEightPosition=m.toEight;
      }
      // Action 1: horizontal rigid yaw to Step 8's opposite attachment side.
      // Other actions keep this corrected orientation; pin axes stay WORLD UP.
      // No individual beam, pin, or installed connector ever shifts.
      stepSeven.current.position.set(...stepSevenPosition);
      frame.current.position.set(...stepEightPosition);
      frame.current.quaternion.copy(m.fromQuat).slerp(m.toQuat,ease(t));
      if(m.time===m.duration){movement.current=null;motionDone.current?.();}
    }
    const f=flight.current;
    if(f&&orbit.current){
      f.time=Math.min(1,f.time+delta/STEP_NINE_CAMERA_DURATION);
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
      {/* Step 7 stays horizontally turned 180°, and ONLY its whole root
          lowers onto the already parked Step 8 during Action 3. */}
      <group ref={stepSeven} name="STEP9_STEP7_COMPLETE_ASSEMBLY"
        position={stepNineStepSevenPose(phase)}
        rotation={[0,STEP_NINE_STEP_SEVEN_YAW,0]}>
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
            <mesh geometry={meshes.railBlue}>
              <meshStandardMaterial color="#1676d5" roughness={0.5}/>
            </mesh>
          </group>;
        })}
        {/* One guide per target, parented to the moving Step 7 assembly,
            so the lines follow the real receiving holes while it lowers. */}
        {guideVisible&&mating.joints.map(j=>{
          const local=stepNineTurnedPoint(j.stepSevenLocalTarget);
          return <Line key={j.stepEightPin}
            points={[
              [local[0],local[1]+0.35,local[2]],
              [local[0],local[1]+2.6,local[2]],
            ]}
            color={j.alreadyOccupiedByStepSeven?"#d97706":"#168eea"}
            dashed dashSize={0.18} gapSize={0.12} lineWidth={2}/>;
        })}
      </group>
      <group name="STEP9_STEP8_COMPLETE_ASSEMBLY" ref={frame}
        position={first.position}
        quaternion={phase>=1?OPPOSITE_FACE_ALIGNMENT:INITIAL_ALIGNMENT}>
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
    </group>
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.08}
      enablePan={false} minDistance={7} maxDistance={110}
      onStart={()=>{flight.current=null;}}
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
  cameraView:"iso"|"top"|"side"|"front"|"bottom";
  onMotionComplete?:()=>void;
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
