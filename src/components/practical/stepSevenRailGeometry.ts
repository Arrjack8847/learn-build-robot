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
/**
 * Photo reference: IMG_1713/1714, holes counted from the bridge-connector end
 * toward the two free ends. The rail with two visible blue heads receives
 * the LATER Step 6 bridge at holes 6 and 8. The opposite rail receives the
 * EARLIER bridge at holes 1 and 3. Compare the photo, not the UI perspective.
 */
export const STEP_SEVEN_PHOTO_CONFIG:ReadOnlyRailConfig = {
  railCenterDistance:2.1,firstRailHole:6,secondRailHole:1,
};
type ReadOnlyRailConfig = Readonly<StepSevenRailConfig>;
/** Compatibility alias for existing stored demo configurations. */
export const STEP_SEVEN_PROVISIONAL = STEP_SEVEN_PHOTO_CONFIG;
/** Hole 15 when counted from the grey/bridge end = Hole 1 from the free end. */
export const STEP_SEVEN_END_PIN_HOLE = 15;
export const STEP_SEVEN_MECHANICALLY_VERIFIED = false;
export const STEP_SEVEN_ACTIONS = [
  {title:"Prepare the Step 6 support and side beams",instruction:"Keep the finished grey Step 6 connector support intact. Lay out the two separate white 15-hole beams and two additional blue long connectors."},
  {title:"Align the first white beam · candidate holes 6 & 8",instruction:"Place the first white beam below its grey mounting shafts. The first rail's photographed candidate holes are 6 and 8, counted from the connector end. Move the grey assembly up to expose the insertion path."},
  {title:"Press the first grey joints into the white beam",instruction:"Support the first white beam and lower the grey assembly straight along the connector shafts, seating its existing joints into the matching white-beam holes. Existing blue side pins stay outward."},
  {title:"Align the second white beam · candidate holes 1 & 3",instruction:"Keep the first rail attached to the grey assembly. Position the second white rail below the opposite connector units; its photographed candidate receiving pair is holes 1 and 3."},
  {title:"Press the second grey joints into the white beam",instruction:"Lower the connected grey assembly and first rail together onto the second white beam. Seat all matching grey mounting shafts vertically; leave the first beam firmly attached."},
  {title:"Insert the first blue end pin · free-end hole 1",instruction:"After BOTH white beams are mounted, insert the first additional long blue connector vertically into the exposed free-end hole of the first rail (hole 15 from the grey-connector end)."},
  {title:"Insert the second blue end pin · free-end hole 1",instruction:"Insert the second blue long connector into the matching exposed end hole of the opposite rail. Keep both pins upright, with their projecting ends exposed."},
  {title:"Inspect the completed two-rail assembly",instruction:"Orbit Assembly A, comparing with IMG_1716, IMG_1724–1727 and IMG_1731–1733. All connector shafts and both end pins should stay rigidly attached; physically confirm the joints."},
] as const;
export const STEP_SEVEN_FINAL_PHASE = STEP_SEVEN_ACTIONS.length-1;

export function railConfigurationErrors(c:StepSevenRailConfig):string[]{
  const errors:string[]=[];
  if(!Number.isFinite(c.railCenterDistance)||c.railCenterDistance<1.4||c.railCenterDistance>4)
    errors.push("Rail separation outside the inspection range.");
  if(!Number.isInteger(c.firstRailHole)||c.firstRailHole<1||c.firstRailHole>13)
    errors.push("First rail receiving pair must fit holes 1–15.");
  if(!Number.isInteger(c.secondRailHole)||c.secondRailHole<1||c.secondRailHole>13)
    errors.push("Second rail receiving pair must fit holes 1–15.");
  return errors;
}
export function railBridge(id:StepSevenRailId,cfg:StepSixMountConfig){
  // The two photos reveal the opposite pairing to the old front/back demo.
  const first=id===STEP_SEVEN_RAIL_IDS[0];
  return first
    ? {start:cfg.bridgeBStart,side:cfg.bridgeBSide}
    : {start:cfg.bridgeAStart,side:cfg.bridgeASide};
}
/**
 * The photographs show a hand lowering the GREY Step 6 structure onto each
 * supported white rail. Both operations are normal to the beam hole faces
 * (beam-local Z). The clearance is a demonstration value, NOT a measured pin
 * seating depth. During the second operation, the first rail travels rigidly
 * with the Step 6 core.
 */
export const STEP_SEVEN_PRESS_CLEARANCE = 1.65;
export function stepSevenCoreOffsetZ(phase:number,stepSixConfig:StepSixMountConfig):number {
  if(phase!==1&&phase!==3)return 0;
  const railId=phase===1?STEP_SEVEN_RAIL_IDS[0]:STEP_SEVEN_RAIL_IDS[1];
  const side=railBridge(railId,stepSixConfig).side;
  return (side==="front"?-1:1)*STEP_SEVEN_PRESS_CLEARANCE;
}
export function railPose(id:StepSevenRailId,phase:number,c:StepSevenRailConfig,
  beamY:number,stepSixConfig:StepSixMountConfig):StepSixPose {
  const first=id===STEP_SEVEN_RAIL_IDS[0];
  const bridge=railBridge(id,stepSixConfig);
  const sign=bridge.side==="front"?1:-1;
  const receiving=first?c.firstRailHole:c.secondRailHole;
  const offsetX=beamHoleX(bridge.start)-(receiving-8);
  const alignPhase=first?1:3;
  const finalZ=sign*c.railCenterDistance;
  if(phase<alignPhase){
    // Stage the rail loosely away from the connected grey body.
    return {position:[offsetX,beamY-2.7,finalZ+sign*4.6],rotation:[0,0,0]};
  }
  if(first&&phase===3) {
    // While lowering the core onto rail #2, rail #1 is already attached.
    return {position:[offsetX,beamY,finalZ+stepSevenCoreOffsetZ(phase,stepSixConfig)],rotation:[0,0,0]};
  }
  // The target rail is held still while the GREY assembly is pressed in.
  return {position:[offsetX,beamY,finalZ],rotation:[0,0,0]};
}
export function endPinPose(id:StepSevenPinId,phase:number,c:StepSevenRailConfig,
  beamY:number,stepSixConfig:StepSixMountConfig):StepSixPose {
  const first=id===STEP_SEVEN_PIN_IDS[0];
  const railId=STEP_SEVEN_RAIL_IDS[first?0:1];
  const rail=railPose(railId,STEP_SEVEN_FINAL_PHASE,c,beamY,stepSixConfig);
  const x=rail.position[0]+STEP_SEVEN_END_PIN_HOLE-8;
  // Both blue end pins use the same upward world-Z orientation in the photo.
  // The shaft shoulder overlap remains provisional until a real kit fit check.
  const insertionPhase=first?5:6;
  if(phase<insertionPhase) return {
    position:[x+1.7,beamY-1.9,rail.position[2]+3.8],rotation:[0,0,0],
  };
  return {position:[x,beamY,rail.position[2]+0.95],rotation:[0,0,0]};
}
export function stepSevenPose(id:StepSevenMovingPart,phase:number,c:StepSevenRailConfig,
  beamY:number,stepSixConfig:StepSixMountConfig):StepSixPose {
  return id===STEP_SEVEN_PIN_IDS[0]||id===STEP_SEVEN_PIN_IDS[1]
    ?endPinPose(id,phase,c,beamY,stepSixConfig)
    :railPose(id,phase,c,beamY,stepSixConfig);
}
export function railGuide(config:StepSixMountConfig,rail:StepSevenRailId,c:StepSevenRailConfig){
  if(validateMountConfig(config).length)return null;
  const bridge=railBridge(rail,config);
  const first=rail===STEP_SEVEN_RAIL_IDS[0];
  const sourceMountingHoles=[bridge.start,bridge.start+2];
  const receiving=first?c.firstRailHole:c.secondRailHole;
  return {
    sourceMountingHoles,candidateReceivingHoles:[receiving,receiving+2],
    insertionAxis:bridge.side==="front"?"+Z":"-Z",
    mechanicallyVerified:false as const,seatingDepthMm:null as null,
  };
}
export function completedStepSixPoses(config:StepSixMountConfig,beamY:number){
  const ids=["STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"] as const;
  return Object.fromEntries(ids.map(id=>[id,seatedPose(id,config,beamY)]));
}
