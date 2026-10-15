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
export const STEP_NINE_ASSEMBLY_ID = "marksman-step9-four-blue-pin-join-v1";
export const STEP_NINE_MECHANICALLY_VERIFIED = false;
/** The photographed underside-to-upper-beam mounting depth is not measured. */
export const STEP_NINE_ESTIMATED_PIN_CENTRE_CLEARANCE = 0.55;
export const STEP_NINE_ACTIONS = [
  { number:"0", title:"Prepare the two completed assemblies",
    instruction:"Place the complete Step 7 assembly on the left and the complete Step 8 assembly on the right. Keep every existing connector installed." },
  { number:"1", title:"Face the longest Step 8 beam forward",
    instruction:"Lift and orient the complete Step 8 structure. Its longest white beam must face the front, as in the side-view reference." },
  { number:"2", title:"Align all four blue pins",
    instruction:"Match the four projecting Step 8 blue pins with holes 7 and 11 on EACH Step 7 white side rail, counted from its blue-pinned free end." },
  { number:"3", title:"Insert all four connectors",
    instruction:"Move the entire Step 8 structure as one rigid unit along the pin axes to seat the four blue pins in the Step 7 rails." },
  { number:"4", title:"Inspect the completed join",
    instruction:"Check all four joints and confirm the longest white Step 8 beam remains at the front. Compare the full model with the real side-view photo." },
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
  const labels = [
    {stepEightPin:"BLUE_1",rail:0,hole:11},
    {stepEightPin:"BLUE_2",rail:1,hole:11},
    {stepEightPin:"BLUE_3",rail:0,hole:7},
    {stepEightPin:"BLUE_4",rail:1,hole:7},
  ] as const;
  const joints:StepNinePinJoin[]=labels.map(item=>{
    const rail=rails[item.rail]!;
    const mount=railMounts(STEP_SEVEN_RAIL_IDS[item.rail]!,six,railConfig);
    return {
      stepEightPin:item.stepEightPin,
      stepSevenRail:STEP_SEVEN_RAIL_IDS[item.rail]!,
      receivingHole:item.hole,
      stepSevenLocalTarget:[rail.position[0]+item.hole-8,rail.position[1],rail.position[2]],
      alreadyOccupiedByStepSeven:[mount.receivingBlackHole,...mount.receivingGreyHoles].includes(item.hole),
    };
  });
  // STEP8 pin coordinates are (-1/-1),(+1/-1),(-1/+1),(+1/+1)
  // in its own (x,y) frame. A rigid quarter-turn axis permutation maps
  // Step8 (x,y,z) -> Step7 (-y,-z,x), so blue pins face toward the two rails.
  const level=STEP_EIGHT_LEVEL/2;
  const target:V3=[
    (first.position[0]+second.position[0])/2 + 1,
    (first.position[1]+second.position[1])/2 + STEP_NINE_ESTIMATED_PIN_CENTRE_CLEARANCE + level,
    (first.position[2]+second.position[2])/2,
  ];
  const geometryWarnings:string[]=[];
  if(Math.abs(first.position[0]-second.position[0])>0.2)
    geometryWarnings.push("The saved Step 7 rails have different longitudinal origins; the four pins cannot all align rigidly.");
  if(Math.abs((second.position[2]-first.position[2])-2)>0.3)
    geometryWarnings.push("The saved Step 7 rail spacing/orientation does not match the Step 8 blue-pin spacing.");
  if(joints.some(joint=>joint.alreadyOccupiedByStepSeven))
    geometryWarnings.push("A photo-marked hole overlaps a connector in the saved Step 7 configuration. Verify the real hole positions before completing.");
  return {joints,target,geometryWarnings,mechanicallyVerified:false as const};
}
export type StepNineFramePose = { position:V3; orient:boolean };
/** Only rigid-group movements. No beam/pin meshes are stretched or reattached. */
export function stepNineFramePose(phase:number,target:V3):StepNineFramePose {
  const [x,y,z]=target;
  if(phase<=0)return {position:[x-17,y+3.5,z],orient:false};
  if(phase===1)return {position:[x-10,y+2.8,z],orient:true};
  if(phase===2)return {position:[x,y+2.3,z],orient:true};
  return {position:[x,y,z],orient:true};
}
/** The correct four pin centres in the original Step 8 local coordinate frame. */
export function stepNineOriginalPinPositions(config:StepEightConfig) {
  const poses=stepEightPoses(11,config);
  return (["BLUE_1","BLUE_2","BLUE_3","BLUE_4"] as const).map(id=>({id,position:poses[id].position}));
}
