import {
  STEP_EIGHT_SEVEN_RAIL_SEATED_Z, STEP_EIGHT_THICKNESS_MM, STEP_EIGHT_PITCH_MM,
  STEP_EIGHT_BLUE_CONNECTOR_LENGTH_MM, stepEightPoses, type StepEightConfig, type V3,
} from "./stepEightGeometry";
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
/** Step 8 already installs all four joining blue pins toward +local Z.
 * The enclosing Step 9 scene is rotated 180° around Z; the original
 * unflipped Step 8 alignment sends +local Z -> -shared Y -> +world Y, UP
 * toward Step 7. The OLD final face flip sent that same direction DOWN.
 *
 * Begin the preparation pose on the opposite (incorrect) face and rotate
 * the WHOLE assembled frame 180° during Action 1 to restore the original,
 * physically upward connector face. Never turn the pin meshes separately.
 */
export const STEP_NINE_STEP_EIGHT_FACE_FLIP = Math.PI;
/** Before Action 1: presentation (wrong) face; local (x,y,z)->(-y,z,-x). */
export function stepNineInitialPinOffset(point:V3):V3 {
  return [-point[1],point[2],-point[0]];
}
/** After Action 1: correct original Step 8 pin face; +local Z -> -shared Y.
 * The Step 9 parent rotation maps -shared Y into +world Y (toward Step 7).
 */
export function stepNineOrientedPinOffset(point:V3):V3 {
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
/** Face-to-face centre spacing: Step 8's white 7-hole rails stay just
 * BELOW Step 7's white 15-hole rails (one 7.8 mm beam thickness).
 * The original Step 8 grey crossbeams must remain UNDER its white rails.
 * Blue connector tip depth and any occupied receiving holes remain
 * provisional pending real-kit measurement.
 */
export const STEP_NINE_RAIL_FACE_SEATING = STEP_EIGHT_THICKNESS_MM / STEP_EIGHT_PITCH_MM;
export const STEP_NINE_ACTIONS = [
  { number:"0", title:"Prepare the two completed assemblies",
    instruction:"Place Step 7 on the left turned 180° horizontally, facing its correct attachment side toward Step 8 on the right. Keep every existing connector installed." },
  { number:"1", title:"Turn Step 8 over to its opposite face",
    instruction:"Flip the entire completed Step 8 assembly 180° around its horizontal long-beam axis, switching its TOP and BOTTOM faces toward Step 7. Do not yaw it horizontally or detach its four installed blue connectors." },
  { number:"2", title:"Align four mounting connectors beneath Step 7",
    instruction:"Raise Step 7 for clearance and slide the flipped Step 8 frame underneath. Align the four opposite-side connector shafts with holes 7 and 11 on both outer Step 7 white rails." },
  { number:"3", title:"Lower Step 7 onto four real connectors",
    instruction:"Keep Step 8 stationary. Lower the entire Step 7 assembly onto all four original blue connector shafts together. The connectors remain physically present, opaque, and unchanged throughout the seating motion." },
  { number:"4", title:"Inspect four real seated connectors",
    instruction:"Inspect the top, side and underside views. Check that the shafts enter Step 7 holes 7 and 11 and are naturally covered by the assembled beams, not artificially hidden. If blue shafts still protrude, flag the alignment or seating-depth issue." },
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
  frameConfig:StepEightConfig,
) {
  const rails = STEP_SEVEN_RAIL_IDS.map(id=>railPose(id,STEP_SEVEN_FINAL_PHASE,railConfig,beamY,six));
  const first=rails[0]!,second=rails[1]!;
  // Reusing Step 8's ORIGINAL top connector face reverses the old
  // (incorrectly flipped) lateral mapping. Step 7 yaw stays UNCHANGED.
  // Under the correctly oriented root, BLUE_1/3 align with the second rail
  // and BLUE_2/4 with the first. Hole numbers 7 and 11 never change.
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
  // Derive the four ORIGINAL pin centres from the finished Step 8 pose,
  // not an approximated mid-plane. Apply a single rigid rotation to every
  // beam and pin; only the frame-root translation is solved here.
  const completedStepEight=stepEightPoses(11,frameConfig);
  const stepEightPinOffsets=(["BLUE_1","BLUE_2","BLUE_3","BLUE_4"] as const)
    .map(id=>stepNineOrientedPinOffset(completedStepEight[id].position));
  const centreOf=(coordinate:0|2):number=>joints.reduce((sum,joint,index)=>
    sum+joint.stepSevenLocalTarget[coordinate]-stepEightPinOffsets[index]![coordinate],0)/joints.length;
  // Shared +Y points DOWN after the enclosing 180° Z root rotation.
  // The correct unflipped Step 8 has its finished 7-hole rails at
  // root Y = -STEP_EIGHT_SEVEN_RAIL_SEATED_Z. Add this height when placing
  // the entire frame; the old target was calibrated for the upside-down face.
  const railCenterY=(first.position[1]+second.position[1])/2;
  const target:V3=[
    centreOf(0),
    railCenterY + STEP_NINE_RAIL_FACE_SEATING + STEP_EIGHT_SEVEN_RAIL_SEATED_Z,
    centreOf(2),
  ];
  const geometryWarnings:string[]=[];
  if(Math.abs(first.position[0]-second.position[0])>0.2)
    geometryWarnings.push("The saved Step 7 rails have different longitudinal origins; the four pins cannot all align rigidly.");
  // The Step 7 rails may have reversed z signs after its 180-degree yaw:
  // compare ABSOLUTE centre spacing with the Step 8 two-rail distance.
  if(Math.abs(Math.abs(first.position[2]-second.position[2])-2)>0.3)
    geometryWarnings.push("The saved Step 7 rail spacing does not match the Step 8 blue-pin spacing.");
  joints.forEach((joint,index)=>{
    const [pinX,,pinZ]=stepEightPinOffsets[index]!;
    if(Math.abs(target[0]+pinX-joint.stepSevenLocalTarget[0])>0.3 ||
       Math.abs(target[2]+pinZ-joint.stepSevenLocalTarget[2])>0.3)
      geometryWarnings.push("After Step 8's corrected joining-face orientation, "+joint.stepEightPin+
        " does not match its selected receiving hole with a rigid transform.");
  });
  // Compute the exposed blue-pin tip against Step 7's far surface using
  // the real 24 mm connector STL length. Do not hide a projected overhang:
  // a slight one means the seating depth needs physical verification.
  const firstPinCenterSharedY=target[1]-completedStepEight.BLUE_1.position[2];
  const tipSharedY=firstPinCenterSharedY-
    STEP_EIGHT_BLUE_CONNECTOR_LENGTH_MM/(2*STEP_EIGHT_PITCH_MM);
  const upperReceivingFaceY=railCenterY-STEP_NINE_RAIL_FACE_SEATING/2;
  if(tipSharedY < upperReceivingFaceY-0.02)
    geometryWarnings.push("A blue connector may extend "+
      ((upperReceivingFaceY-tipSharedY)*STEP_EIGHT_PITCH_MM).toFixed(2)+
      " mm beyond the Step 7 upper face with the saved Step 8 pin seating. Verify physical depth; no shaft is hidden or shortened.");
  if(joints.some(joint=>joint.alreadyOccupiedByStepSeven))
    geometryWarnings.push("A photo-marked hole overlaps a connector in the saved Step 7 configuration. Verify the real hole positions before completing.");
  return {joints,target,geometryWarnings,mechanicallyVerified:false as const};
}
export type StepNineFramePose = { position:V3 };
/** Only rigid-group movements. No beam/pin meshes are stretched or reattached. */
export function stepNineFramePose(phase:number,target:V3):StepNineFramePose {
  const [x,y,z]=target;
  if(phase<=0)return {position:[x-17,y+3.5,z]};
  if(phase===1)return {position:[x-10,y+1.8,z]};
  // Step 8 translates during Actions 0-2, returning to the ORIGINAL
  // upward pin face during Action 1. It is stationary in Actions 3-4.
  return {position:[x,y,z]};
}
/** The correct four pin centres in the original Step 8 local coordinate frame. */
export function stepNineOriginalPinPositions(config:StepEightConfig) {
  const poses=stepEightPoses(11,config);
  return (["BLUE_1","BLUE_2","BLUE_3","BLUE_4"] as const).map(id=>({id,position:poses[id].position}));
}
