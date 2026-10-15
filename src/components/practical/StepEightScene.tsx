import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import { Component, Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { motionEase } from "./marksmanLessonMotion";
import {
  STEP_EIGHT_PARTS, STEP_EIGHT_PITCH_MM, STEP_EIGHT_THICKNESS_MM,
  STEP_EIGHT_LEVEL, STEP_EIGHT_SEVEN_RAIL_SEATED_Z,
  stepEightGuide, stepEightPoses,
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
/** Same category timings as Step 7. No extra pauses between actions. */
function actionDuration(phase:number):number {
  if(phase===5||phase===6||phase===10)return 1.8; // Press a beam onto its joints
  if((phase>=1&&phase<=4)||phase===7||phase===8)return 1.25; // Insert one connector
  return 1.45; // Prepare/align; camera itself always uses 0.85 seconds
}
function posesDiffer(a:Poses,b:Poses):boolean {
  return STEP_EIGHT_PARTS.some(id=>
    a[id].position.some((coordinate,i)=>coordinate!==b[id].position[i])||
    a[id].rotation.some((angle,i)=>angle!==b[id].rotation[i]));
}
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
  // Only the two BLACK connectors (phases 7 and 8) insert from BELOW
  // into the underside of the loose 15-hole beam. Blue pins and all white
  // beams retain their confirmed downward insertion direction.
  const sign=phase===7||phase===8?-1:1;
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
/** Camera-only focus groups. None of these change any physical target pose. */
function focusParts(phase:number):readonly StepEightPart[] {
  if(phase===0||phase===11)return STEP_EIGHT_PARTS;
  if(phase<=2)return ["FIVE_A","BLUE_1","BLUE_2"];
  if(phase<=4)return ["FIVE_B","BLUE_3","BLUE_4"];
  if(phase===5)return ["FIVE_A","FIVE_B","SEVEN_A","BLUE_1","BLUE_2","BLUE_3","BLUE_4"];
  if(phase===6)return ["FIVE_A","FIVE_B","SEVEN_A","SEVEN_B","BLUE_1","BLUE_2","BLUE_3","BLUE_4"];
  if(phase<=8)return ["FIFTEEN","BLACK_1","BLACK_2"];
  return STEP_EIGHT_PARTS;
}
function partHalfSize(id:StepEightPart):V3 {
  if(id.startsWith("FIVE"))return [2.55,0.65,0.6];
  if(id.startsWith("SEVEN"))return [0.65,3.65,0.6];
  if(id==="FIFTEEN")return [0.65,7.65,0.6];
  return id.startsWith("BLUE")?[0.82,0.82,1.65]:[0.75,0.75,1.05];
}
/**
 * Fit both the old and new instructional poses inside the ACTUAL viewport.
 * Perspective fit uses horizontal AND vertical FOV; narrow phones cannot
 * silently crop a pin or receiving hole, even during a camera flight.
 * Pure camera maths — does not affect hole coordinates or STEP8 geometry.
 */
function fittedCamera(phase:number,config:StepEightConfig,width:number,height:number,
  cameraView:"iso"|"top"|"side"|"bottom") {
  const aspect=Math.max(0.3,width/Math.max(height,1));
  const direction=(
    phase===0?[0,-0.26,1]:
    // During blue insertion show the TOP face and the exposed connector tips.
    // Framing still fits both the loose and seated positions on phone/tablet.
    phase>=1&&phase<=4?[0.75,-1.2,1.15]:
    // For the two black-pin actions inspect the WHITE beam's underside.
    phase===7||phase===8?[0.85,-1.1,-0.9]:
    cameraView==="top"?[0.05,-0.1,1]:
    cameraView==="bottom"?[0.05,0.1,-1]:
    cameraView==="side"?[0,-1,0.18]:
    [0.9,-1.1,1.4]
  ) as V3;
  const out=new Vector3(...direction).normalize();
  const right=new Vector3().crossVectors(new Vector3(0,0,1),out).normalize();
  const up=new Vector3().crossVectors(out,right).normalize();
  const poses=[stepEightPoses(phase,config)];
  if(phase>0)poses.push(stepEightPoses(phase-1,config));
  const points:Vector3[]=[];
  for(const pose of poses)for(const id of focusParts(phase)){
    const p=pose[id].position;const [hx,hy,hz]=partHalfSize(id);
    for(const dx of [-hx,hx])for(const dy of [-hy,hy])for(const dz of [-hz,hz]){
      points.push(new Vector3(p[0]+dx,p[1]+dy,p[2]+dz));
    }
  }
  const boxCenter=points.reduce((sum,p)=>sum.add(p),new Vector3()).divideScalar(points.length);
  let halfWidth=0,halfHeight=0,depth=0;
  for(const p of points){
    const v=p.clone().sub(boxCenter);
    halfWidth=Math.max(halfWidth,Math.abs(v.dot(right)));
    halfHeight=Math.max(halfHeight,Math.abs(v.dot(up)));
    depth=Math.max(depth,Math.abs(v.dot(out)));
  }
  const halfVFov=43*Math.PI/360;
  const distance=Math.max(halfHeight/Math.tan(halfVFov),
    halfWidth/(Math.tan(halfVFov)*aspect))*1.28+depth+2.5;
  return {point:boxCenter,position:boxCenter.clone().addScaledVector(out,
    Math.max(10,Math.min(190,distance)))};
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
  // The blue pins descend through the top of the grey beams. The two
  // black pins approach the white 15-hole beam from the UNDERSIDE.
  const underside=id==="FIFTEEN"&&(phase===7||phase===8);
  const faceZ=(STEP_EIGHT_THICKNESS_MM/(2*STEP_EIGHT_PITCH_MM)+0.04)*
    (underside?-1:1);
  return <group>
    {Array.from({length},(_,i)=>{
      const active=i+1===mark ||
        (id==="SEVEN_A"&&phase===5&&i+1===config.sevenNearHole+4) ||
        (id==="SEVEN_B"&&phase===6&&i+1===config.sevenNearHole+4);
      if(!showAll&&!active)return null;
      const x=i-(length-1)/2;
      return <group key={i} position={[x,0,faceZ]}
        rotation={underside?[Math.PI,0,0]:[0,0,0]}>
        {/* The blue tips enter the 7-hole rails from the UNDERSIDE while
            the white rails themselves descend from above. Mark both faces. */}
        {active&&((id==="SEVEN_A"&&phase===5)||(id==="SEVEN_B"&&phase===6))&&
          <mesh position={[0,0,-2*faceZ]}>
            <torusGeometry args={[0.305,0.055,7,26]}/>
            <meshBasicMaterial color="#f6aa19" depthTest={false}
              transparent opacity={0.85}/>
          </mesh>}
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
function Stage({phase,config,paused,replayKey,resetCameraKey,reducedMotion,autoInspect,cameraView,onMotionComplete,onUserCameraInteraction}:{
  phase:number;config:StepEightConfig;paused:boolean;replayKey:number;
  resetCameraKey:number;reducedMotion:boolean;autoInspect:boolean;
  cameraView:"iso"|"top"|"side"|"bottom";onMotionComplete:(()=>void)|undefined;
  onUserCameraInteraction:(()=>void)|undefined;
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
  const guideGroup=useRef<Group>(null);
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
  const {camera,size,setDpr}=useThree();
  const lastViewport=useRef({width:size.width,height:size.height});
  const setupCamera=()=>fittedCamera(phase,config,size.width,size.height,cameraView);
  // Adaptive fidelity: high quality on desktop; protect mobile GPUs from
  // excess fill-rate while keeping antialiasing and the original STL detail.
  useLayoutEffect(()=>{
    const density=Math.min(typeof window==="undefined"?1:window.devicePixelRatio||1,
      size.width<520?1.25:size.width<900?1.5:1.75);
    setDpr(Math.max(1,density));
  },[size.width,setDpr]);
  const configKey=config.sevenNearHole+":"+config.fifteenNearHole;
  // Retain real 3D materials; update opacity in the render loop rather than
  // triggering a React render for each animation frame on mobile.
  useLayoutEffect(()=>{
    guideGroup.current?.traverse(child=>{
      const line=child as unknown as {material?:{transparent:boolean;depthWrite:boolean;opacity:number;needsUpdate:boolean}};
      if(line.material){
        line.material.transparent=true;
        line.material.depthWrite=false;
        line.material.needsUpdate=true;
      }
    });
  },[phase,configKey]);
  useLayoutEffect(()=>{
    const destination=stepEightPoses(phase,config);
    const replaying=!first.current&&replayKey!==priorReplay.current;
    const recalibrated=previousConfigKey.current!==configKey;
    const prior=priorPhase.current;
    const reverse=prior>phase;
    // Step 7 rebuilds the exact OLD phase before every move. R3F may have
    // already applied the new JSX position by the time this effect runs;
    // reading the rendered mesh instead would silently skip animations.
    const oldPhase=replaying?Math.max(0,phase-1):prior;
    const from=stepEightPoses(oldPhase,config);
    for(const id of STEP_EIGHT_PARTS){
      const part=parts.current[id];
      part?.position.set(...from[id].position);
      part?.rotation.set(...from[id].rotation);
    }
    const active=replaying?phase:reverse?prior:phase;
    const activePart:StepEightPart|null =
      active>=1&&active<=4?("BLUE_"+active) as StepEightPart:
      active===5?"SEVEN_A":active===6?"SEVEN_B":
      active===7?"BLACK_1":active===8?"BLACK_2":active>=9&&active<=10?"FIFTEEN":null;
    const animated=!first.current&&!reducedMotion&&!recalibrated&&
      (replaying||Math.abs(prior-phase)===1)&&posesDiffer(from,destination);
    movement.current=animated?{
      from,to:destination,elapsed:0,duration:actionDuration(active),
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
    const viewportChanged=lastViewport.current.width!==size.width||
      lastViewport.current.height!==size.height;
    lastViewport.current={width:size.width,height:size.height};
    if(firstCamera.current||reducedMotion||viewportChanged){
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
  },[phase,configKey,cameraView,camera,size.width,size.height,reducedMotion]);
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
        travel.elapsed=Math.min(travel.duration,travel.elapsed+Math.min(delta,0.06));
        const t=Math.min(1,travel.elapsed/travel.duration);
        for(const id of STEP_EIGHT_PARTS){
          const part=parts.current[id];if(!part)continue;
          const guided=(id===travel.target&&travel.phase>=1&&travel.phase<=8)||
            (travel.phase===10&&(id==="FIFTEEN"||id==="BLACK_1"||id==="BLACK_2"));
          // Action 6: reposition the two completed 5-hole beam+pin groups
          // during the 42% approach. Keep them stationary during the 58%
          // two-point insertion, so receiving holes never chase the beam.
          const preparingFirstRail=travel.phase===5&&(
            id==="FIVE_A"||id==="FIVE_B"||id.startsWith("BLUE_"));
          const relocationT=travel.reverse
            ?Math.max(0,(t-0.58)/0.42)
            :Math.min(1,t/0.42);
          const pose=preparingFirstRail
            ?interpolate(travel.from[id],travel.to[id],relocationT)
            :guided
              ?insertion(travel.from[id],travel.to[id],t,travel.phase,travel.reverse)
              :interpolate(travel.from[id],travel.to[id],t);
          part.position.set(...pose.position);
          part.rotation.set(...pose.rotation);
        }
        if(t>=1){movement.current=null;completed.current?.();}
      }
      const flight=cameraFlight.current;
      if(flight){
        flight.t=Math.min(1,flight.t+Math.min(delta,0.06)/0.85);
        const t=smooth(flight.t);
        camera.position.lerpVectors(flight.a,flight.b,t);
        orbit.current?.target.lerpVectors(flight.ta,flight.tb,t);
        if(flight.t===1)cameraFlight.current=null;
      }
    }
    const current=movement.current;
    const pct=current?Math.min(1,current.elapsed/current.duration):1;
    // Guides are strongest while students identify and align a hole, then
    // fade over the last 18% of insertion without extending Step 7 timing.
    const opacity=Math.min(1,Math.max(0,(1-pct)/0.18))*0.88;
    guideGroup.current?.traverse(child=>{
      const line=child as unknown as {material?:{opacity:number}};
      if(line.material)line.material.opacity=opacity;
    });
    // The active pin settles into its genuine STL color at the end;
    // completed connectors are not left with a distracting permanent glow.
    const active=phase>=1&&phase<=4?parts.current[("BLUE_"+phase) as StepEightPart]:null;
    const pin=active?.children.find(child=>child instanceof Mesh) as Mesh|undefined;
    const material=pin?.material as MeshStandardMaterial|undefined;
    if(material)material.emissiveIntensity=0.12+0.22*Math.min(1,Math.max(0,(1-pct)/0.15));
    if(orbit.current){
      orbit.current.autoRotate=phase===11&&cameraView==="iso"&&autoInspect&&
        !paused&&!reducedMotion&&!cameraFlight.current;
      orbit.current.update();
    }
  });
  const guide=phase>0&&phase<11?stepEightGuide(phase,config):null;
  const start=stepEightPoses(phase,config);
  const activeBlue=phase>=1&&phase<=4?("BLUE_"+phase) as StepEightPart:null;
  const fromBlue=activeBlue?stepEightPoses(phase-1,config)[activeBlue].position:null;
  const toBlue=activeBlue?start[activeBlue].position:null;
  const blueClearance:V3|null=toBlue
    ?[toBlue[0],toBlue[1],toBlue[2]+2.15]:null;
  const activeBlack=phase===7?"BLACK_1":phase===8?"BLACK_2":null;
  const fromBlack=activeBlack?stepEightPoses(phase-1,config)[activeBlack].position:null;
  const toBlack=activeBlack?start[activeBlack].position:null;
  const blackClearance:V3|null=toBlack
    ?[toBlack[0],toBlack[1],toBlack[2]-2.15]:null;
  const twoPointPins=phase===5?["BLUE_1","BLUE_3"] as const:
    phase===6?["BLUE_2","BLUE_4"] as const:
    phase===9||phase===10?["BLACK_1","BLACK_2"] as const:null;
  return <>
    <color attach="background" args={["#f5f8fc"]}/>
    <ambientLight intensity={1.5}/>
    <hemisphereLight args={["#ffffff","#acc2d6",1.7]}/>
    <directionalLight position={[8,-6,13]} intensity={2.0}/>
    <gridHelper args={[25,25,"#d9e4ed","#e9eff6"]}
      rotation={[Math.PI/2,0,0]} position={[0,0,-4.9]}/>
    <group name="STEP8_RIGID_INSPECTION_GROUP">
      {STEP_EIGHT_PARTS.map(id=>{
        const model=modelName(id);
        const color=model==="blue"?"#1576ce":
          model==="black"?"#293544":
          model==="five"?"#e6ebf1":
          model==="seven"?"#bac9d9":"#f1f3f7";
        const activeConnector=activeBlue===id||activeBlack===id;
        const activeReceiver=phase>=1&&phase<=4&&id===(phase<=2?"FIVE_A":"FIVE_B");
        return <group key={id} name={id} visible={true}
          ref={node=>{if(node)parts.current[id]=node;else delete parts.current[id];}}
          position={start[id].position} rotation={start[id].rotation}>
          <mesh geometry={geometries[model]} castShadow receiveShadow
            frustumCulled={false}>
            <meshStandardMaterial color={color} roughness={0.5}
              metalness={0.06} side={DoubleSide} transparent={false} opacity={1}
              emissive={activeConnector?"#155a96":activeReceiver?"#32577d":"#000000"}
              emissiveIntensity={activeConnector?0.34:activeReceiver?0.11:0}/>
          </mesh>
          <NumberedHoles id={id} phase={phase} config={config}/>
        </group>;
      })}
    </group>
    <group ref={guideGroup}>
    {fromBlue&&blueClearance&&toBlue&&<>
      <Line points={[fromBlue,blueClearance]}
        color="#168eea" lineWidth={1.6} dashed dashSize={0.20} gapSize={0.12}/>
      <Line points={[blueClearance,toBlue]}
        color="#e2a315" lineWidth={2} dashed dashSize={0.15} gapSize={0.10}/>
    </>}
    {fromBlack&&blackClearance&&toBlack&&<>
      <Line points={[fromBlack,blackClearance]}
        color="#168eea" lineWidth={1.6} dashed dashSize={0.20} gapSize={0.12}/>
      <Line points={[blackClearance,toBlack]}
        color="#e2a315" lineWidth={2} dashed dashSize={0.15} gapSize={0.10}/>
    </>}
    {twoPointPins&&twoPointPins.map(id=>{
      const target=stepEightPoses(phase===9?10:phase,config)[id].position;
      const descendingWhiteRail=phase===5||phase===6||phase===9||phase===10;
      return <Line key={id+"-two-joint-guide"}
        points={descendingWhiteRail
          // The outer 7-hole rails descend onto the blue-pin pairs;
          // the CENTER 15-hole rail also descends onto the two black pins.
          // Keep every guide ABOVE the grey-beam mating surface.
          ?[[target[0],target[1],STEP_EIGHT_LEVEL+
              STEP_EIGHT_THICKNESS_MM/(2*STEP_EIGHT_PITCH_MM)+0.05],
            [target[0],target[1],STEP_EIGHT_SEVEN_RAIL_SEATED_Z+2.15]]
          :[[target[0],target[1],target[2]-2.1],
            [target[0],target[1],target[2]+2.1]]}
        color="#e2a315" lineWidth={1.6} dashed dashSize={0.15} gapSize={0.12}/>;
    })}
    {guide&&!activeBlue&&!activeBlack&&!twoPointPins&&<Line points={[[guide[0],guide[1],guide[2]-2.1],
      [guide[0],guide[1],guide[2]+2.1]]}
      color="#e2a315" lineWidth={1.5} dashed dashSize={0.12} gapSize={0.12}/>}
    </group>
    <OrbitControls ref={orbit} makeDefault enableDamping dampingFactor={0.08}
      enablePan={false} minDistance={4.5} maxDistance={210}
      onStart={()=>{cameraFlight.current=null;onUserCameraInteraction?.();}}
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
export function StepEightScene({phase,config,paused,replayKey,resetCameraKey,reducedMotion,autoInspect,cameraView,onMotionComplete,onUserCameraInteraction}:{
  phase:number;config:StepEightConfig;paused:boolean;replayKey:number;
  resetCameraKey:number;reducedMotion:boolean;autoInspect:boolean;
  cameraView:"iso"|"top"|"side"|"bottom";onMotionComplete?:()=>void;
  onUserCameraInteraction?:()=>void;
}){
  return <ViewerBoundary>
    <Canvas camera={{fov:43,near:0.1,far:400,position:[12,-16,19],up:[0,0,1]}}
      dpr={[1,1.75]} gl={{antialias:true,powerPreference:"high-performance"}}
      style={{height:"100%",width:"100%",touchAction:"none"}}
      aria-label="Step 8 real STL 3D frame and 15-hole beam locking demonstration">
      <Suspense fallback={null}>
        <Stage phase={phase} config={config} paused={paused} replayKey={replayKey}
          resetCameraKey={resetCameraKey} reducedMotion={reducedMotion}
          autoInspect={autoInspect} cameraView={cameraView}
          onMotionComplete={onMotionComplete}
          onUserCameraInteraction={onUserCameraInteraction}/>
      </Suspense>
    </Canvas>
  </ViewerBoundary>;
}
