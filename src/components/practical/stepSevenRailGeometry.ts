import { beamHoleX, getStepSixAttachments, seatedPose, validateMountConfig, type StepSixMountConfig, type StepSixPose } from "./StepSixGeometry";

/** Assembly A stays independent of Step 8's rectangular frame (Assembly B). */
export const STEP_SEVEN_ASSEMBLY_ID = "marksman-assembly-a-side-rails-v1";
export const STEP_SEVEN_RESULT_KEY = "robot:marksmanship:step7:assembly-a:v1";
export const STEP_EIGHT_RESULT_KEY = "robot:marksmanship:step8:assembly-b:v1";
export const STEP_SEVEN_RAIL_IDS = ["STEP7_RAIL_FRONT_15","STEP7_RAIL_BACK_15"] as const;
export const STEP_SEVEN_PIN_IDS = ["STEP7_END_BLUE_FIRST","STEP7_END_BLUE_SECOND"] as const;
export type StepSevenRailId = (typeof STEP_SEVEN_RAIL_IDS)[number];
export type StepSevenPinId = (typeof STEP_SEVEN_PIN_IDS)[number];
export type StepSevenMovingPart = StepSevenRailId | StepSevenPinId;
export type StepSevenRailConfig = {
  railCenterDistance:number;
  firstRailHole:number;
  secondRailHole:number;
};
/** Approved Step 7 mounting configuration (October 15 screenshot).
 * Lock the calibration values visible in the approved local viewer:
 * vertical offset 0.9, first rail's grey holes 12/14 and second rail's 7/9.
 * With the pictured Step 6 preset, black+grey holes become first 5/12/14,
 * second 4/7/9. The user-approved scene arrangement is retained when the
 * calibration controls are hidden; physical press-fit depth is not measured.
 */
export const STEP_SEVEN_PHOTO_CONFIG:ReadOnlyRailConfig = {
  railCenterDistance:0.9,firstRailHole:12,secondRailHole:7,
};
type ReadOnlyRailConfig = Readonly<StepSevenRailConfig>;
/** Compatibility alias for existing stored demo configurations. */
export const STEP_SEVEN_PROVISIONAL = STEP_SEVEN_PHOTO_CONFIG;
/** Original beam STL is centred with Hole 1 at local x=-7 and Hole 15
 * at local x=+7. The Step 7 assembly root rotates 180 degrees about Z:
 * local x=-7 is therefore the exposed RIGHT end in the learner's view.
 * The previous index 15 incorrectly placed both blue pins on the LEFT.
 * Keep the beams and all three-point mounting transforms unchanged.
 */
export const STEP_SEVEN_END_PIN_HOLE = 1;
/** Both extra blue pins enter from the same beam face as the black mounting
 * connector (the -Y face in this Step 7 local frame). The stage's 180 degree
 * Z rotation changes screen direction, never the physically defined face.
 */
export const STEP_SEVEN_END_PIN_FACE = "black-connector-side" as const;
export const STEP_SEVEN_END_PIN_INSERTION_AXIS = "+local-Y" as const;
export const STEP_SEVEN_END_PIN_OUTWARD_NORMAL = [0,-1,0] as const;
/** Photo-based placement measured in normalized 8 mm-pitch scene units;
 * collar/penetration depth still requires physical validation.
 */
export const STEP_SEVEN_END_PIN_PROJECTION_OFFSET = 0.82;
export const STEP_SEVEN_MECHANICALLY_VERIFIED = false;
export const STEP_SEVEN_ACTIONS = [
  {title:"Prepare all parts",instruction:"Keep the completed Step 6 assembly and its two black pins, four grey mounting shafts and original blue pins intact. Prepare two white 15-hole beams and two extra blue end pins."},
  {title:"Align first beam · black and two grey joints",instruction:"Position the first white beam UNDER the Step 6 assembly, matching ONE black connector and TWO grey shafts to three receiving holes. Leave all sideways blue pins exposed."},
  {title:"Lower all three joints into the first beam",instruction:"Press the grey assembly downward so its black connector and two grey connector shafts engage the first white beam together. Do not move the sideways blue pins."},
  {title:"Align the second beam · three joints",instruction:"Keep the first beam attached. Position the second beam under the opposite black connector and two grey shafts."},
  {title:"Lower all three joints into the second beam",instruction:"Lower the connected assembly and first rail together onto the second beam, seating one black and two grey mounting shafts simultaneously."},
  {title:"Insert first blue free-end pin · black side",instruction:"At the first beam’s exposed free end, highlight Hole 1. Insert a blue long pin from the SAME SIDE as its black mounting connector, leaving the pin projecting from that face."},
  {title:"Insert second blue free-end pin · black side",instruction:"Repeat at Hole 1 of the second white beam’s exposed end, again entering from its BLACK-CONNECTOR SIDE. Do not reverse either pin or move the existing sideways blue pins."},
  {title:"Inspect Assembly A",instruction:"Orbit the final model: each side uses THREE connectors (one black, two grey), both blue free-end pins are installed, and existing sideways pins remain unchanged."},
] as const;
export const STEP_SEVEN_FINAL_PHASE = STEP_SEVEN_ACTIONS.length-1;

/** The native Step 6 grey bridge carries two integrated +Y shafts.
 * A same-side hollow unit contains the black pin, also pointing +Y.
 * A rail must match ALL THREE shafts under one rigid X translation.
 */
export function railMounts(id:StepSevenRailId,cfg:StepSixMountConfig,c:StepSevenRailConfig){
  if(validateMountConfig(cfg).length)throw Error("Step 6 mount configuration is incomplete");
  const first=id===STEP_SEVEN_RAIL_IDS[0];
  const items=getStepSixAttachments(cfg);
  const bridge=items.find(v=>v.id===(first?"STEP5_BRIDGE_B":"STEP5_BRIDGE_A"))!;
  const black=items.find(v=>v.id.includes("HOLLOW")&&v.side===bridge.side);
  if(!black)throw Error("A matching black pin is missing from this side of Step 6");
  const receiving=first?c.firstRailHole:c.secondRailHole;
  return {
    bridgeId:bridge.id as "STEP5_BRIDGE_A"|"STEP5_BRIDGE_B",
    side:bridge.side,
    sourceGreyHoles:bridge.beamHoles,
    sourceBlackHole:black.beamHoles[0]!,
    receivingGreyHoles:[receiving,receiving+2] as const,
    receivingBlackHole:receiving+black.beamHoles[0]!-bridge.beamHoles[0]!,
    offsetX:beamHoleX(bridge.beamHoles[0]!)-(receiving-8),
    insertionAxis:"+Y" as const,
    mechanicallyVerified:false as const,seatingDepthMm:null as null,
  };
}
export function railConfigurationErrors(c:StepSevenRailConfig,cfg?:StepSixMountConfig):string[]{
  const errors:string[]=[];
  if(!Number.isFinite(c.railCenterDistance)||c.railCenterDistance<0.9||c.railCenterDistance>2.5)
    errors.push("Vertical mounting offset must be between 0.9 and 2.5 provisional scene units");
  for(const n of [c.firstRailHole,c.secondRailHole])
    if(!Number.isInteger(n)||n<1||n>13)errors.push("Grey receiving pair must fit a 15-hole beam");
  if(!errors.length&&cfg&&!validateMountConfig(cfg).length)
    for(const id of STEP_SEVEN_RAIL_IDS){
      const m=railMounts(id,cfg,c);
      if(m.receivingBlackHole<1||m.receivingBlackHole>15)
        errors.push("The black pin misses "+id+". Adjust this rail's grey receiving pair.");
      const occupied=[m.receivingBlackHole,...m.receivingGreyHoles];
      if(new Set(occupied).size!==3)
        errors.push("The black and two grey shafts must occupy three distinct holes on "+id+".");
      if(occupied.includes(STEP_SEVEN_END_PIN_HOLE))
        errors.push("The exposed Hole 1 end-pin position overlaps an existing mounting shaft on "+id+".");
    }
  return errors;
}
/** Stage root rotates 180 degrees about Z so the source +Y shafts face DOWN.
 * Both beams rotate 90 degrees about X to make their through-holes vertical.
 * Moving core offset -Y in local coordinates means raising it on screen.
 */
export const STEP_SEVEN_PRESS_CLEARANCE=1.85;
export function stepSevenCoreOffsetY(phase:number):number{
  return phase===1||phase===3?-STEP_SEVEN_PRESS_CLEARANCE:0;
}
export function railPose(id:StepSevenRailId,phase:number,c:StepSevenRailConfig,
  beamY:number,cfg:StepSixMountConfig):StepSixPose{
  const m=railMounts(id,cfg,c),first=id===STEP_SEVEN_RAIL_IDS[0];
  const mount=seatedPose(m.bridgeId,cfg,beamY);
  const y=beamY+c.railCenterDistance;
  const rotation:StepSixPose["rotation"]=[Math.PI/2,0,0];
  if(phase<(first?1:3))return {
    position:[m.offsetX,y+0.7,mount.position[2]+(m.side==="front"?3.5:-3.5)],
    rotation,
  };
  if(first&&phase===3)return {
    position:[m.offsetX,y+stepSevenCoreOffsetY(phase),mount.position[2]],rotation,
  };
  return {position:[m.offsetX,y,mount.position[2]],rotation};
}
/** The black mounting pin and both grey shafts are on the same entry face.
 * The extra blue pin projects from that face, at the RIGHT/free end of
 * each existing 15-hole rail (STL local hole #1, before root rotation).
 */
export function endPinMount(id:StepSevenPinId,c:StepSevenRailConfig,
  beamY:number,cfg:StepSixMountConfig){
  const first=id===STEP_SEVEN_PIN_IDS[0];
  const railId=STEP_SEVEN_RAIL_IDS[first?0:1];
  const rail=railPose(railId,STEP_SEVEN_FINAL_PHASE,c,beamY,cfg);
  const x=rail.position[0]+STEP_SEVEN_END_PIN_HOLE-8;
  return {
    railId,
    holeFromExposedEnd:1 as const,
    holeFromMeshStart:STEP_SEVEN_END_PIN_HOLE,
    holeFromOppositeEnd:16-STEP_SEVEN_END_PIN_HOLE,
    insertionFace:STEP_SEVEN_END_PIN_FACE,
    insertionAxis:STEP_SEVEN_END_PIN_INSERTION_AXIS,
    outwardNormal:STEP_SEVEN_END_PIN_OUTWARD_NORMAL,
    position:[x,rail.position[1]-STEP_SEVEN_END_PIN_PROJECTION_OFFSET,rail.position[2]] as StepSixPose["position"],
    rotation:[Math.PI/2,0,0] as StepSixPose["rotation"],
  };
}
export function endPinPose(id:StepSevenPinId,phase:number,c:StepSevenRailConfig,
  beamY:number,cfg:StepSixMountConfig):StepSixPose{
  const mount=endPinMount(id,c,beamY,cfg);
  const first=id===STEP_SEVEN_PIN_IDS[0];
  const final=mount.position;
  // First approach from the black-facing (-local Y) side, then move down
  // the shared mounting axis (+local Y) into the end hole.
  return phase<(first?5:6)
    ?{position:[final[0]+1.7,final[1]-2.5,final[2]],rotation:mount.rotation}
    :{position:[...final],rotation:mount.rotation};
}
export function stepSevenPose(id:StepSevenMovingPart,phase:number,c:StepSevenRailConfig,
  beamY:number,cfg:StepSixMountConfig):StepSixPose{
  return id===STEP_SEVEN_PIN_IDS[0]||id===STEP_SEVEN_PIN_IDS[1]
    ?endPinPose(id,phase,c,beamY,cfg):railPose(id,phase,c,beamY,cfg);
}
export function railGuide(cfg:StepSixMountConfig,id:StepSevenRailId,c:StepSevenRailConfig){
  if(validateMountConfig(cfg).length)return null;
  const m=railMounts(id,cfg,c);
  return {
    sourceMountingHoles:[m.sourceBlackHole,...m.sourceGreyHoles],
    candidateReceivingHoles:[m.receivingBlackHole,...m.receivingGreyHoles],
    blackSourceHole:m.sourceBlackHole,
    blackReceivingHole:m.receivingBlackHole,
    insertionAxis:m.insertionAxis,
    mechanicallyVerified:false as const,seatingDepthMm:null as null,
  };
}
export function completedStepSixPoses(config:StepSixMountConfig,beamY:number){
  const ids=["STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"] as const;
  return Object.fromEntries(ids.map(id=>[id,seatedPose(id,config,beamY)]));
}
