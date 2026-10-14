import { getStepSixAttachments, seatedPose, validateMountConfig, type StepSixMountConfig, type StepSixPose } from "./StepSixGeometry";

/** Assembly A is distinct from the frame (Assembly B). All units use 8 mm per scene unit. */
export const STEP_SEVEN_ASSEMBLY_ID = "marksman-assembly-a-side-rails-v1";
export const STEP_SEVEN_RESULT_KEY = "robot:marksmanship:step7:assembly-a:v1";
export const STEP_EIGHT_RESULT_KEY = "robot:marksmanship:step8:assembly-b:v1";
export const STEP_SEVEN_RAIL_IDS = ["STEP7_RAIL_FRONT_15","STEP7_RAIL_BACK_15"] as const;
export type StepSevenRailId = (typeof STEP_SEVEN_RAIL_IDS)[number];
/** IMG_1716: one blue connector in each free end hole, same facing direction. */
export const STEP_SEVEN_END_PIN_IDS = ["STEP7_END_BLUE_A","STEP7_END_BLUE_B"] as const;
export type StepSevenEndPinId = (typeof STEP_SEVEN_END_PIN_IDS)[number];
export const STEP_SEVEN_END_HOLE = 1;
export const STEP_SEVEN_END_PIN_AXIS = "+Z" as const;
/** Provisional connector collar depth: not measured from the real kit. */
export const STEP_SEVEN_END_PIN_UNVERIFIED_OFFSET = 1;
export type StepSevenRailConfig = {
  /** Physical photo/kit calibration required before certifying the rail engagement. */
  railCenterDistance: number;
  /** The prospective hole index on each 15-hole beam opposite the selected first 11-hole mounting hole. */
  firstRailHole: number;
  secondRailHole: number;
};
export const STEP_SEVEN_PROVISIONAL: StepSevenRailConfig = {
  railCenterDistance: 2.1,
  firstRailHole: 6,
  secondRailHole: 11,
};
export const STEP_SEVEN_MECHANICALLY_VERIFIED = false;
/** Rotate all unmodified original STLs together: local -Z (pin insertion)
 * becomes world +Y, so the first rail comes from underneath and rises.
 * Hole choices and depth remain provisional until physically checked. */
export const STEP_SEVEN_UPWARD_PRESENTATION_ROTATION_X = Math.PI / 2;
export const STEP_SEVEN_ACTIONS = [
  {title:"Prepare both side rails",instruction:"Start with completed Step 6. Lay out two disconnected 15-hole white beams and two separate blue long connectors."},
  {title:"Align the first rail underneath",instruction:"Place the first 15-hole white beam underneath the grey Step 6 structure. Line up its receiving holes directly below the existing connector pins without attaching it yet."},
  {title:"Push the first rail upward",instruction:"Push the first white 15-hole beam UP from underneath along the existing pin axes until the mounting holes engage. Confirm the actual fit before continuing."},
  {title:"Align the opposite rail",instruction:"Rotate the camera to the opposite side. Align the second white beam parallel to the first without inserting it yet."},
  {title:"Secure the second rail",instruction:"Slide the second rail onto the receiving connectors, leaving two parallel secured white beams."},
  {title:"Insert both blue end connectors",instruction:"At the exposed end of each white 15-hole beam, insert one blue long connector into the endmost hole. Both pins face the same direction, matching IMG_1716. Inspect the completed structure before continuing."},
] as const;

export function railConfigurationErrors(c: StepSevenRailConfig): string[] {
  const errors: string[]=[];
  if (!Number.isFinite(c.railCenterDistance) || c.railCenterDistance < 1.4 || c.railCenterDistance > 4)
    errors.push("Rail separation outside the inspection range.");
  if (!Number.isInteger(c.firstRailHole) || c.firstRailHole<1 || c.firstRailHole>13)
    errors.push("First rail hole must be within 1–15.");
  if (!Number.isInteger(c.secondRailHole) || c.secondRailHole<1 || c.secondRailHole>13)
    errors.push("Second rail hole must be within 1–15.");
  return errors;
}
export function railPose(id: StepSevenRailId, phase: number, c:StepSevenRailConfig,
  beamY:number, stepSixConfig:StepSixMountConfig): StepSixPose {
  const first=id===STEP_SEVEN_RAIL_IDS[0], sign=first?1:-1;
  const side=first?"front":"back";
  const bridgeIndex=stepSixConfig.bridgeASide===side
    ?stepSixConfig.bridgeAStart:stepSixConfig.bridgeBStart;
  const receivingIndex=first?c.firstRailHole:c.secondRailHole;
  // 11-hole beam #1 is x=-5, centered 15-hole beam #1 is x=-7.
  // Align matching first bridge and receiving holes; indices remain provisional.
  const offsetX=(bridgeIndex-6)-(receivingIndex-8);
  const positioned=first?phase>=1:phase>=3;
  const seated=first?phase>=2:phase>=4;
  const position:[number,number,number] = !positioned
    ? [offsetX,beamY+(first?-4:4),sign*(c.railCenterDistance+3.7)]
    : [offsetX,beamY,sign*(c.railCenterDistance+(seated?0:1.9))];
  return {position,rotation:[0,0,0]};
}
/** Exact end-hole identity is photo-supported; collar depth and axis sign are unverified.
 * Both rail STLs have native hole-centres at x=-7..7 in 8mm world units. */
export function endPinPose(id:StepSevenEndPinId,phase:number,c:StepSevenRailConfig,
  beamY:number,stepSixConfig:StepSixMountConfig):StepSixPose {
  const rail=id===STEP_SEVEN_END_PIN_IDS[0]?STEP_SEVEN_RAIL_IDS[0]:STEP_SEVEN_RAIL_IDS[1];
  const beam=railPose(rail,4,c,beamY,stepSixConfig);
  const x=beam.position[0]-7+(STEP_SEVEN_END_HOLE-1);
  const z=beam.position[2]+STEP_SEVEN_END_PIN_UNVERIFIED_OFFSET;
  if(phase>=5)return {position:[x,beamY,z],rotation:[0,0,0]};
  return {position:[x+1.1,beamY-3.4,z+5.5],rotation:[0,0,0]};
}
export function endPinGuidedPose(id:StepSevenEndPinId,t:number,c:StepSevenRailConfig,
  beamY:number,stepSixConfig:StepSixMountConfig):StepSixPose {
  const loose=endPinPose(id,4,c,beamY,stepSixConfig);
  const end=endPinPose(id,5,c,beamY,stepSixConfig);
  const align:StepSixPose={position:[end.position[0],end.position[1],end.position[2]+3.2],rotation:end.rotation};
  const amount=Math.max(0,Math.min(1,t));
  const start=amount<=0.42?loose:align, finish=amount<=0.42?align:end;
  const part=amount<=0.42?amount/0.42:(amount-0.42)/0.58;
  const ease=part*part*(3-2*part);
  return {position:[0,1,2].map(i=>start.position[i]!+(finish.position[i]!-start.position[i]!)*ease) as [number,number,number],
    rotation:[0,0,0]};
}
export function railGuide(config:StepSixMountConfig,rail:StepSevenRailId,c:StepSevenRailConfig) {
  if(validateMountConfig(config).length) return null;
  const side=rail===STEP_SEVEN_RAIL_IDS[0]?"front":"back";
  const bridges=getStepSixAttachments(config).filter(a=>a.id.includes("BRIDGE")&&a.side===side);
  return {sourceMountingHoles:bridges.flatMap(a=>a.beamHoles),
    candidateReceivingHoles:rail===STEP_SEVEN_RAIL_IDS[0]?[c.firstRailHole,c.firstRailHole+2]:[c.secondRailHole,c.secondRailHole+2],
    insertionAxis:side==="front"?"-Z":"+Z",
    mechanicallyVerified:false as const,
    seatingDepthMm:null as null};
}
export function completedStepSixPoses(config:StepSixMountConfig,beamY:number) {
  const ids=["STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"] as const;
  return Object.fromEntries(ids.map(id=>[id,seatedPose(id,config,beamY)]));
}
