import { getStepSixAttachments, seatedPose, validateMountConfig, type StepSixMountConfig, type StepSixPose } from "./StepSixGeometry";

/** Assembly A is distinct from the frame (Assembly B). All units use 8 mm per scene unit. */
export const STEP_SEVEN_ASSEMBLY_ID = "marksman-assembly-a-side-rails-v1";
export const STEP_SEVEN_RESULT_KEY = "robot:marksmanship:step7:assembly-a:v1";
export const STEP_EIGHT_RESULT_KEY = "robot:marksmanship:step8:assembly-b:v1";
export const STEP_SEVEN_RAIL_IDS = ["STEP7_RAIL_FRONT_15","STEP7_RAIL_BACK_15"] as const;
export type StepSevenRailId = (typeof STEP_SEVEN_RAIL_IDS)[number];
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
export const STEP_SEVEN_ACTIONS = [
  { title:"Prepare two long side rails", instruction:"Keep both 15-hole beams and the two loose blue connectors separate. Inspect the completed Step 6 connector beam in the center." },
  { title:"Align the first 15-hole rail", instruction:"Bring the first rail toward one side. Align the candidate mounting holes with the installed bridge connectors; confirm hole indices against your physical kit." },
  { title:"Seat the first side rail", instruction:"Move the rigid beam straight along the candidate insertion axis. Check that the real pins enter the correct holes and are securely seated before proceeding." },
  { title:"Align and connect the opposite rail", instruction:"Repeat on the opposite side. Keep both 15-hole rails parallel and verify the real connector engagement." },
  { title:"Inspect Assembly A", instruction:"Orbit to inspect both side rails and the 11-hole support. Confirm the physical build separately; two additional blue connector positions remain unverified." },
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
  const seated=first?phase>=2:phase>=3;
  const position:[number,number,number] = !positioned
    ? [offsetX,beamY+(first?-4:4),sign*(c.railCenterDistance+3.7)]
    : [offsetX,beamY,sign*(c.railCenterDistance+(seated?0:1.9))];
  return {position,rotation:[0,0,0]};
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
