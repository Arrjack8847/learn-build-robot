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
  {title:"Prepare the Step 6 support and side beams",instruction:"Keep the finished grey Step 6 connector support centered. Prepare two white 15-hole beams and two additional blue long connectors."},
  {title:"Align the first 15-hole beam · holes 6 & 8",instruction:"On the rail with the two visible blue-head holes, count from the grey-connector end. Align holes 6 and 8 with the later Step 6 bridge's two pins. Approach along the connector axis."},
  {title:"Seat the first 15-hole beam",instruction:"Press the first rail straight onto its two matching pins until securely seated. Do not bend the connectors or move the completed Step 6 support."},
  {title:"Insert the first blue end connector · hole 15",instruction:"From the grey-connector end, count to the opposite free end (hole 15). Insert the new blue long connector there with its exposed tip facing out, as photographed."},
  {title:"Align the opposite beam · holes 1 & 3",instruction:"Move to the opposite side. From the grey-connector end, align the second white beam's holes 1 and 3 with the earlier Step 6 bridge."},
  {title:"Seat the second 15-hole beam",instruction:"Move the second beam along its connector axis to its seated position. Both rails should be parallel, with the central grey support between them."},
  {title:"Insert the second blue end connector · hole 15",instruction:"At the second beam's free end, insert the second blue long connector into hole 15 (hole 1 if counting from the free end). Both exposed end pins should point the same way."},
  {title:"Inspect the finished two-rail assembly",instruction:"Orbit the completed rigid assembly. Compare with IMG_1716: two parallel white rails, the original grey support and connectors, plus two blue pins at the free ends."},
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
export function railPose(id:StepSevenRailId,phase:number,c:StepSevenRailConfig,
  beamY:number,stepSixConfig:StepSixMountConfig):StepSixPose {
  const first=id===STEP_SEVEN_RAIL_IDS[0];
  const bridge=railBridge(id,stepSixConfig);
  const sign=bridge.side==="front"?1:-1;
  const receiving=first?c.firstRailHole:c.secondRailHole;
  // Both sets of physical receiving holes share the same 8 mm pitch.
  // The calculated X offset aligns both pairs without stretching the STLs.
  const offsetX=beamHoleX(bridge.start)-(receiving-8);
  const alignmentPhase=first?1:4, seatedPhase=first?2:5;
  if(phase<alignmentPhase) {
    return {position:[offsetX,beamY-2.7,sign*(c.railCenterDistance+4.6)],rotation:[0,0,0]};
  }
  if(phase<seatedPhase){
    return {position:[offsetX,beamY,sign*(c.railCenterDistance+1.65)],rotation:[0,0,0]};
  }
  return {position:[offsetX,beamY,sign*c.railCenterDistance],rotation:[0,0,0]};
}
export function endPinPose(id:StepSevenPinId,phase:number,c:StepSevenRailConfig,
  beamY:number,stepSixConfig:StepSixMountConfig):StepSixPose {
  const first=id===STEP_SEVEN_PIN_IDS[0];
  const railId=STEP_SEVEN_RAIL_IDS[first?0:1];
  const rail=railPose(railId,STEP_SEVEN_FINAL_PHASE,c,beamY,stepSixConfig);
  const x=rail.position[0]+STEP_SEVEN_END_PIN_HOLE-8;
  // Original long-connector STL is centered with its length along native Z.
  // Its photographic seating offset is provisional pending measured shoulders.
  if(phase<(first?3:6)) return {
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
    insertionAxis:bridge.side==="front"?"-Z":"+Z",
    mechanicallyVerified:false as const,seatingDepthMm:null as null,
  };
}
export function completedStepSixPoses(config:StepSixMountConfig,beamY:number){
  const ids=["STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"] as const;
  return Object.fromEntries(ids.map(id=>[id,seatedPose(id,config,beamY)]));
}
