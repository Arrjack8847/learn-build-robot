import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import { Component, Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, DoubleSide, Group, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { motionEase } from "./marksmanLessonMotion";
import {
  STEP_EIGHT_PARTS, STEP_EIGHT_PITCH_MM, STEP_EIGHT_THICKNESS_MM,
  STEP_EIGHT_LEVEL, stepEightGuide, stepEightPoses,
  type StepEightPart, type StepEightConfig, type StepEightPose, type V3,
} from "./stepEightGeometry";

import beam5Url from "../../../3D for marksman/beams/5.stl?url";
import beam7Url from "../../../3D for marksman/beams/7.stl?url";
import beam15Url from "../../../3D for marksman/beams/15 beams.stl?url";
import longPinUrl from "../../../3D for marksman/connector/long connector.stl?url";
import blackPinUrl from "../../../3D for marksman/connector/pin_pin.stl?url";

const SOURCES = [beam5Url,beam7Url,beam15Url,longPinUrl,blackPinUrl];
type ModelName = "five"|"seven"|"fifteen"|"blue"|"black";
type Poses = Record<StepEightPart,StepEightPose>;
type Travel = {
  from:Poses; to:Poses; elapsed:number; duration:number;
  target:StepEightPart|null; phase:number; reverse:boolean;
};
function modelName(id:StepEightPart):ModelName {
  if(id.startsWith("FIVE"))return "five";
  if(id.startsWith("SEVEN"))return "seven";
  if(id==="FIFTEEN")return "fifteen";
  if(id.startsWith("BLUE"))return "blue";
  return "black";
}
function normalize(source:BufferGeometry,length:number|null,depth:number,name:string) {
  const result=source.clone();result.computeBoundingBox();
  const box=result.boundingBox!;
  const size=box.getSize(new Vector3());
  if((length!==null&&Math.abs(size.x-length)>0.7)||Math.abs(size.z-depth)>0.7)
    throw Error(name+" STL dimensions differ from expected original part.");
  const center=box.getCenter(new Vector3());
  result.translate(-center.x,-center.y,-center.z);
  result.scale(1/STEP_EIGHT_PITCH_MM,1/STEP_EIGHT_PITCH_MM,1/STEP_EIGHT_PITCH_MM);
  result.computeVertexNormals();
  return result;
}
const smooth=motionEase;
function interpolate(a:StepEightPose,b:StepEightPose,t:number):StepEightPose {
  const k=smooth(t);
  return {
    position:[0,1,2].map(i=>a.position[i]!+(b.position[i]!-a.position[i]!)*k) as V3,
    rotation:[0,1,2].map(i=>a.rotation[i]!+(b.rotation[i]!-a.rotation[i]!)*k) as V3,
  };
}
/**
 * Keep the connector coaxial with its target during the final motion.
 * Reversing retracts from the seated pose to the SAME clearance axis first,
 * then returns to the loose pose; no endpoint snap or inverted path.
 * Phase 10 moves the long beam and its two attached black pins together.
 */
function insertion(a:StepEightPose,b:StepEightPose,t:number,phase:number,reverse:boolean):StepEightPose {
  const seated=reverse?a:b;
  const sign=phase===5||phase===6||phase===10?-1:1;
  const clearance=phase===10?2.2:2.15;
  const aligned:StepEightPose={
    position:[seated.position[0],seated.position[1],seated.position[2]+sign*clearance],
    rotation:seated.rotation,
  };
  if(reverse)return t<0.58
    ?interpolate(a,aligned,t/0.58)
    :interpolate(aligned,b,(t-0.58)/0.42);
  return t<0.42
    ?interpolate(a,aligned,t/0.42)
    :interpolate(aligned,b,(t-0.42)/0.58);
}
function interest(phase:number,config:StepEightConfig):V3 {
  if(phase<=2)return [-0.6,-8.3,0];
  if(phase<=4)return [0.6,8.3,0];
  if(phase<=6)return [0,0,STEP_EIGHT_LEVEL/2];
  if(phase<=8)return [6.4,0,0];
  return [0,0,STEP_EIGHT_LEVEL/2];
}
function focusDistance(phase:number,narrow:boolean):V3 {
  const scale=narrow?1.4:1;
  if(phase===0)return [12*scale,-17*scale,19*scale];
  if(phase<=4)return [5.5*scale,-8*scale,10*scale];
  if(phase<=8)return [6.5*scale,-8.5*scale,12*scale];
  return [8*scale,-10*scale,13*scale];
}
function NumberedHoles({id,phase,config}:{
  id:StepEightPart;phase:number;config:StepEightConfig;
}) {
  const length=id.startsWith("FIVE")?5:id.startsWith("SEVEN")?7:id==="FIFTEEN"?15:0;
  if(!length)return null;
  const mark = id==="FIVE_A"&&(phase===1||phase===2)?(phase===1?2:4):
    id==="FIVE_B"&&(phase===3||phase===4)?(phase===3?2:4):
    id==="SEVEN_A"&&phase===5?config.sevenNearHole:
    id==="SEVEN_B"&&phase===6?config.sevenNearHole:
    id==="FIFTEEN"&&(phase===7||phase===8)?config.fifteenNearHole+(phase===8?4:0):
    0;
  const showAll=Boolean(mark);
  return <group>
    {Array.from({length},(_,i)=>{
      const active=i+1===mark ||
        (id==="SEVEN_A"&&phase===5&&i+1===config.sevenNearHole+4) ||
        (id==="SEVEN_B"&&phase===6&&i+1===config.sevenNearHole+4);
      if(!showAll&&!active)return null;
      const x=i-(length-1)/2;
      return <group key={i} position={[x,0,STEP_EIGHT_THICKNESS_MM/(2*STEP_EIGHT_PITCH_MM)+0.04]}>
        <mesh>
          <torusGeometry args={[0.305,active?0.06:0.025,7,26]} />
          <meshBasicMaterial color={active?"#f6aa19":"#6386a2"} depthTest={false} transparent opacity={active?1:0.42} />
        </mesh>
        {showAll&&length!==15&&
          <Text position={[0,-0.55,0.07]} fontSize={0.29}
            color={active?"#8c5500":"#4c6276"} anchorX="center"
            outlineWidth={0.015} outlineColor="#ffffff">{i+1}</Text>}
        {showAll&&length===15&&active&&
          <Text position={[0,-0.55,0.07]} fontSize={0.29}
            color="#8c5500" anchorX="center">{i+1}</Text>}
      </group>;
    })}
  </group>;
}
function Stage({phase,config,paused,replayKey,resetCameraKey,reducedMotion,autoInspect,cameraView,onMotionComplete}:{
  phase:number;config:StepEightConfig;paused:boolean;replayKey:number;
  resetCameraKey:number;reducedMotion:boolean;autoInspect:boolean;
  cameraView:"iso"|"top"|"side"|"bottom";onMotionComplete:(()=>void)|undefined;
}) {
  const loaded=useLoader(STLLoader,SOURCES);
  const geometries=useMemo(()=>({
    five:normalize(loaded[0]!,39.3,7.8,"5-hole beam"),
    seven:normalize(loaded[1]!,55.3,7.8,"7-hole beam"),
    fifteen:normalize(loaded[2]!,119.3,7.8,"15-hole beam"),
    blue:normalize(loaded[3]!,null,24,"blue long connector"),
    black:normalize(loaded[4]!,null,16,"black connector candidate"),
  }),[loaded]);
  const parts=useRef<Partial<Record<StepEightPart,Group>>>({});
  const orbit=useRef<OrbitControlsImpl>(null);
  const movement=useRef<Travel|null>(null);
  const priorPhase=useRef(phase);
  const priorReplay=useRef(replayKey);
  const first=useRef(true);
  const firstCamera=useRef(true);
  const previousConfigKey=useRef(config.sevenNearHole+":"+config.fifteenNearHole);
  const cameraFlight=useRef<{a:Vector3;b:Vector3;ta:Vector3;tb:Vector3;t:number}|null>(null);
  const completed=useRef(onMotionComplete);
  completed.current=onMotionComplete;
  const {camera,size}=useThree();
  const narrow=size.width/size.height<0.85;
  const setupCamera=()=>{
    const point=new Vector3(...interest(phase,config));
    const offset=phase!==11?new Vector3(...focusDistance(phase,narrow)):
      cameraView==="top"?new Vector3(0.01,0.01,21):
      cameraView==="bottom"?new Vector3(0.01,0.01,-21):
      cameraView==="side"?new Vector3(0,-21,3):
      new Vector3(...focusDistance(phase,narrow));
    return {point,position:point.clone().add(offset)};
  };
  const configKey=config.sevenNearHole+":"+config.fifteenNearHole;
  useLayoutEffect(()=>{
    const destination=stepEightPoses(phase,config);
    const replaying=!first.current&&replayKey!==priorReplay.current;
    const recalibrated=previousConfigKey.current!==configKey;
    const prior=priorPhase.current;
    const reverse=prior>phase;
    const from={} as Poses;
    const rewind=stepEightPoses(Math.max(0,phase-1),config);
    for(const id of STEP_EIGHT_PARTS) {
      const part=parts.current[id];
      from[id]=replaying?rewind[id]:part?{
        position:[part.position.x,part.position.y,part.position.z],
        rotation:[part.rotation.x,part.rotation.y,part.rotation.z],
      }:destination[id];
      if(replaying&&part){
        part.position.set(...from[id].position);
        part.rotation.set(...from[id].rotation);
      }
    }
    const active=replaying?phase:reverse?prior:phase;
    const activePart:StepEightPart|null =
      active>=1&&active<=4?("BLUE_"+active) as StepEightPart:
      active===5?"SEVEN_A":active===6?"SEVEN_B":
      active===7?"BLACK_1":active===8?"BLACK_2":active>=9&&active<=10?"FIFTEEN":null;
    const animated=!first.current&&!reducedMotion&&!recalibrated&&
      (replaying||Math.abs(prior-phase)===1);
    movement.current=animated?{
      from,to:destination,elapsed:0,
      duration:active===10?2.1:active===5||active===6?1.95:
        active>=7&&active<=9?1.8:1.55,
      target:activePart,phase:active,reverse,
    }:null;
    if(!movement.current){
      for(const id of STEP_EIGHT_PARTS){
        parts.current[id]?.position.set(...destination[id].position);
        parts.current[id]?.rotation.set(...destination[id].rotation);
      }
      completed.current?.();
    }
    previousConfigKey.current=configKey;
    priorPhase.current=phase;
    priorReplay.current=replayKey;
    first.current=false;
  },[phase,configKey,config,replayKey,reducedMotion]);

  // Camera controls are independent from part movement: selecting Top/Side/Bottom
  // must never reset, skip or replay an in-progress connector insertion.
  useLayoutEffect(()=>{
    const view=setupCamera();
    if(firstCamera.current||reducedMotion){
      camera.up.set(0,0,1);
      camera.position.copy(view.position);
      orbit.current?.target.copy(view.point);
      orbit.current?.update();
      cameraFlight.current=null;
    }else{
      cameraFlight.current={
        a:camera.position.clone(),b:view.position,
        ta:orbit.current?.target.clone()??view.point,tb:view.point,t:0,
      };
    }
    firstCamera.current=false;
  },[phase,configKey,cameraView,camera,narrow,reducedMotion]);
  useLayoutEffect(()=>{
    if(resetCameraKey===0)return;
    const view=setupCamera();
    camera.position.copy(view.position);
    orbit.current?.target.copy(view.point);
    cameraFlight.current=null;
    orbit.current?.update();
  },[resetCameraKey]);
  useFrame((_,delta)=>{
    if(!paused){
      const travel=movement.current;
      if(travel){
        travel.elapsed+=Math.min(delta,0.065);
        const t=Math.min(1,travel.elapsed/travel.duration);
        for(const id of STEP_EIGHT_PARTS){
          const part=parts.current[id];if(!part)continue;
          const guided=(id===travel.target&&travel.phase>=1&&travel.phase<=8)||
            (travel.phase===10&&(id==="FIFTEEN"||id==="BLACK_1"||id==="BLACK_2"));
          const pose=guided
            ?insertion(travel.from[id],travel.to[id],t,travel.phase,travel.reverse)
            :interpolate(travel.from[id],travel.to[id],t);
          part.position.set(...pose.position);
          part.rotation.set(...pose.rotation);
        }
        if(t>=1){movement.current=null;completed.current?.();}
      }
      const flight=cameraFlight.current;
      if(flight){
        flight.t=Math.min(1,flight.t+Math.min(delta,0.08)/(reducedMotion?0.01:0.85));
        const t=smooth(flight.t);
        camera.position.lerpVectors(flight.a,flight.b,t);
        orbit.current?.target.lerpVectors(flight.ta,flight.tb,t);
        if(flight.t===1)cameraFlight.current=null;
      }
    }
    if(orbit.current){
      orbit.current.autoRotate=phase===11&&cameraView==="iso"&&autoInspect&&
        !paused&&!reducedMotion&&!cameraFlight.current;
      orbit.current.update();
    }
  });
  const guide=phase>0&&phase<11?stepEightGuide(phase,config):null;
  const start=stepEightPoses(phase,config);
  return <>
    <color attach="background" args={["#f5f8fc"]}/>
    <ambientLight intensity={1.5}/>
    <hemisphereLight args={["#ffffff","#acc2d6",1.7]}/>
    <directionalLight position={[8,-6,13]} intensity={2.0}/>
    <gridHelper args={[25,25,"#d9e4ed","#e9eff6"]}
      rotation={[Math.PI/2,0,0]} position={[0,0,-1.2]}/>
    <group name="STEP8_RIGID_INSPECTION_GROUP">
      {STEP_EIGHT_PARTS.map(id=>{
        const model=modelName(id);
        const color=model==="blue"?"#1576ce":
          model==="black"?"#293544":
          model==="five"?"#e6ebf1":
          model==="seven"?"#bac9d9":"#f1f3f7";
        return <group key={id} name={id}
          ref={node=>{if(node)parts.current[id]=node;else delete parts.current[id];}}
          position={start[id].position} rotation={start[id].rotation}>
          <mesh geometry={geometries[model]} castShadow receiveShadow>
            <meshStandardMaterial color={color} roughness={0.5}
              metalness={0.06} side={DoubleSide}
              emissive={phase>=1&&phase<=4&&id==="BLUE_"+phase?"#664300":"#000000"}
              emissiveIntensity={0.17}/>
          </mesh>
          <NumberedHoles id={id} phase={phase} config={config}/>
        </group>;
      })}
    </group>
    {guide&&<Line points={[[guide[0],guide[1],guide[2]-2.1],
      [guide[0],guide[1],guide[2]+2.1]]}
      color="#e2a315" lineWidth={1.5} dashed dashSize={0.12} gapSize={0.12}/>}
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.08}
      enablePan={false} minDistance={4.5} maxDistance={48}
      onStart={()=>{cameraFlight.current=null;}}
      autoRotateSpeed={0.5}/>
  </>;
}
class ViewerBoundary extends Component<{children:React.ReactNode},{message:string|null}> {
  override state={message:null as string|null};
  static getDerivedStateFromError(error:Error){return {message:error.message};}
  override render(){
    return this.state.message
      ?<div role="alert" className="grid h-full place-items-center p-6 text-center text-sm text-red-800">
        3D viewer could not load the genuine STL models: {this.state.message}
      </div>:this.props.children;
  }
}
export function StepEightScene({phase,config,paused,replayKey,resetCameraKey,reducedMotion,autoInspect,cameraView,onMotionComplete}:{
  phase:number;config:StepEightConfig;paused:boolean;replayKey:number;
  resetCameraKey:number;reducedMotion:boolean;autoInspect:boolean;
  cameraView:"iso"|"top"|"side"|"bottom";onMotionComplete?:()=>void;
}){
  return <ViewerBoundary>
    <Canvas camera={{fov:43,near:0.1,far:120,position:[12,-16,19],up:[0,0,1]}}
      dpr={[1,1.6]} gl={{antialias:true,powerPreference:"low-power"}}
      style={{height:"100%",width:"100%",touchAction:"none"}}
      aria-label="Step 8 real STL 3D frame and 15-hole beam locking demonstration">
      <Suspense fallback={null}>
        <Stage phase={phase} config={config} paused={paused} replayKey={replayKey}
          resetCameraKey={resetCameraKey} reducedMotion={reducedMotion}
          autoInspect={autoInspect} cameraView={cameraView}
          onMotionComplete={onMotionComplete}/>
      </Suspense>
    </Canvas>
  </ViewerBoundary>;
}
