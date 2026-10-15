import { STEP_EIGHT_LEVEL, stepEightPoses, type StepEightConfig, type V3 } from "./stepEightGeometry";
import { STEP_SEVEN_FINAL_PHASE, STEP_SEVEN_RAIL_IDS, railMounts, railPose, type StepSevenRailConfig } from "./stepSevenRailGeometry";
import type { StepSixMountConfig } from "./StepSixGeometry";

/**
 * Photo references IMG_1769, IMG_1773, IMG_1774 and IMG_1775.
 * Both Step 7 side rails are viewed from their blue-pinned free ends.
 * The marked free holes are 7 and 11 on EACH rail (1-based).
 * This mapping is photographic evidence, not a measured press-fit depth.
 */
export const STEP_NINE_RECEIVERS = [7, 11] as const;
/**
 * Step 7 is turned around horizontally ONLY in Step 9.
 * The Step 7 group's Y axis is vertical (the enclosing assembly root
 * flips the sign of world Y). A 180-degree yaw reverses local X and Z,
 * not local Y, so it never turns the assembly upside down.
 */
export const STEP_NINE_STEP_SEVEN_YAW = Math.PI;
/** Flip Step 8 around its horizontal long-beam axis in Step 9 only. */
export const STEP_NINE_STEP_EIGHT_FLIP = Math.PI;
/** The shared scene is turned 180° around Z, so local -Y is world UP.
 * This is the FINAL oriented Step 8 pin transform: (x,y,z) -> (-y,-z,x).
 * Its original +Z pins therefore point UP, as photographed.
 * Action 1 still rotates the complete Step 8 assembly through 180°.
 */
export function stepNineFlippedPinOffset(point:V3):V3 {
  return [-point[1],-point[2],point[0]];
}
/** Step 7 is raised vertically in shared space (-Y == upward on screen).
 * No constituent rails or previously installed connectors are moved.
 */
export const STEP_NINE_STEP_SEVEN_ALIGN_LIFT = 3.3;
export function stepNineStepSevenPose(phase:number):V3 {
  return phase===2?[0,-STEP_NINE_STEP_SEVEN_ALIGN_LIFT,0]:[0,0,0];
}
export function stepNineTurnedPoint(point:V3):V3 {
  return [-point[0],point[1],-point[2]];
}
export const STEP_NINE_ASSEMBLY_ID = "marksman-step9-four-blue-pin-join-v1";
export const STEP_NINE_MECHANICALLY_VERIFIED = false;
/** Step 7 timing profile: guided prepare 1.45 seconds, camera travel 0.85 seconds. */
export const STEP_NINE_PREP_DURATION = 1.45;
export const STEP_NINE_CAMERA_DURATION = 0.85;
/** Both completed assemblies enter the preparation workspace from opposite sides. */
export const STEP_NINE_PREP_ENTRANCE_OFFSET = 8.5;
/** The photographed underside-to-upper-beam mounting depth is not measured. */
export const STEP_NINE_ESTIMATED_PIN_CENTRE_CLEARANCE = 0.55;
export const STEP_NINE_ACTIONS = [
  { number:"0", title:"Prepare the two completed assemblies",
    instruction:"Place Step 7 on the left turned 180° horizontally, facing its correct attachment side toward Step 8 on the right. Keep every existing connector installed." },
  { number:"1", title:"Flip Step 8 upside down",
    instruction:"Rotate the entire completed Step 8 frame 180° about the horizontal long-beam axis. Keep all eleven parts attached and the longest white beam at the front." },
  { number:"2", title:"Align four pins below Step 7",
    instruction:"Lift the whole Step 7 assembly above Step 8 and bring the four upward-facing Step 8 blue pins directly beneath holes 7 and 11 on each outer Step 7 rail. Hold the lower frame ready." },
  { number:"3", title:"Lower Step 7 onto all four pins",
    instruction:"Keep the completed Step 8 frame stationary below. Lower the entire Step 7 assembly straight down along the four upward-facing pins, seating all four connections at once." },
  { number:"4", title:"Inspect the completed join",
    instruction:"Confirm Step 8 remains upside down, the longest white beam faces front and all four pins are secured. Compare with the real side-view photo." },
] as const;
export const STEP_NINE_FINAL_PHASE = STEP_NINE_ACTIONS.length - 1;

export type StepNinePinJoin = {
  stepEightPin:"BLUE_1"|"BLUE_2"|"BLUE_3"|"BLUE_4";
  stepSevenRail:(typeof STEP_SEVEN_RAIL_IDS)[number];
  receivingHole:7|11;
  stepSevenLocalTarget:V3;
  alreadyOccupiedByStepSeven:boolean;
};
export function stepNineMating(
  railConfig:StepSevenRailConfig, six:StepSixMountConfig, beamY:number,
) {
  const rails = STEP_SEVEN_RAIL_IDS.map(id=>railPose(id,STEP_SEVEN_FINAL_PHASE,railConfig,beamY,six));
  const first=rails[0]!,second=rails[1]!;
  // Step 7 retains its previously confirmed 180° horizontal turn.
  // The original four Step 8 pins stay attached to their own beams;
  // their physical UP-facing orientation determines this side mapping.
  const labels = [
    {stepEightPin:"BLUE_1",rail:1,hole:7},
    {stepEightPin:"BLUE_2",rail:0,hole:7},
    {stepEightPin:"BLUE_3",rail:1,hole:11},
    {stepEightPin:"BLUE_4",rail:0,hole:11},
  ] as const;
  const joints:StepNinePinJoin[]=labels.map(item=>{
    const rail=rails[item.rail]!;
    const mount=railMounts(STEP_SEVEN_RAIL_IDS[item.rail]!,six,railConfig);
    return {
      stepEightPin:item.stepEightPin,
      stepSevenRail:STEP_SEVEN_RAIL_IDS[item.rail]!,
      receivingHole:item.hole,
      stepSevenLocalTarget:stepNineTurnedPoint([
        rail.position[0]+item.hole-8,rail.position[1],rail.position[2],
      ]),
      alreadyOccupiedByStepSeven:[mount.receivingBlackHole,...mount.receivingGreyHoles].includes(item.hole),
    };
  });
  // With the outer Step 9 root rotated 180° around Z, Step 8 +Z must
  // become shared -Y (world UP). Park Step 8 BELOW the receiving rails,
  // then move only Step 7 down to finish.
  const level=STEP_EIGHT_LEVEL/2;
  const target:V3=[
    -(first.position[0]+second.position[0])/2 - 1,
    (first.position[1]+second.position[1])/2 + STEP_NINE_ESTIMATED_PIN_CENTRE_CLEARANCE + level,
    -(first.position[2]+second.position[2])/2,
  ];
  const geometryWarnings:string[]=[];
  if(Math.abs(first.position[0]-second.position[0])>0.2)
    geometryWarnings.push("The saved Step 7 rails have different longitudinal origins; the four pins cannot all align rigidly.");
  if(Math.abs((first.position[2]-second.position[2])-2)>0.3)
    geometryWarnings.push("The saved Step 7 rail spacing/orientation does not match the Step 8 blue-pin spacing.");
  const stepEightPinOffsets = [
    stepNineFlippedPinOffset([-1,-2,level]),
    stepNineFlippedPinOffset([ 1,-2,level]),
    stepNineFlippedPinOffset([-1, 2,level]),
    stepNineFlippedPinOffset([ 1, 2,level]),
  ] as const;
  joints.forEach((joint,index)=>{
    const [pinX,,pinZ]=stepEightPinOffsets[index]!;
    if(Math.abs(target[0]+pinX-joint.stepSevenLocalTarget[0])>0.3 ||
       Math.abs(target[2]+pinZ-joint.stepSevenLocalTarget[2])>0.3)
      geometryWarnings.push("After flipping Step 8 upside down, "+joint.stepEightPin+
        " does not match its selected receiving hole with a rigid transform.");
  });
  if(joints.some(joint=>joint.alreadyOccupiedByStepSeven))
    geometryWarnings.push("A photo-marked hole overlaps a connector in the saved Step 7 configuration. Verify the real hole positions before completing.");
  return {joints,target,geometryWarnings,mechanicallyVerified:false as const};
}
export type StepNineFramePose = { position:V3; orient:boolean };
/** Only rigid-group movements. No beam/pin meshes are stretched or reattached. */
export function stepNineFramePose(phase:number,target:V3):StepNineFramePose {
  const [x,y,z]=target;
  if(phase<=0)return {position:[x-17,y+3.5,z],orient:false};
  if(phase===1)return {position:[x-10,y+1.8,z],orient:true};
  // Step 8 reaches its final stationary lower position in Action 2;
  // Actions 3 and 4 must not move it a single millimetre.
  return {position:[x,y,z],orient:true};
}
/** The correct four pin centres in the original Step 8 local coordinate frame. */
export function stepNineOriginalPinPositions(config:StepEightConfig) {
  const poses=stepEightPoses(11,config);
  return (["BLUE_1","BLUE_2","BLUE_3","BLUE_4"] as const).map(id=>({id,position:poses[id].position}));
}
