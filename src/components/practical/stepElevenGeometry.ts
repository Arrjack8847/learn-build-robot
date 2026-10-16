import { railPose, STEP_SEVEN_FINAL_PHASE, STEP_SEVEN_RAIL_IDS, type StepSevenRailConfig } from "./stepSevenRailGeometry";
import type { StepSixMountConfig } from "./StepSixGeometry";
import { STEP_NINE_RAIL_FACE_SEATING } from "./stepNineGeometry";
import { stepTenPoses, whiteHoleX, STEP_TEN_FINAL_PHASE } from "./stepTenGeometry";

/**
 * Step 11 joins TWO previously completed assemblies; it never creates or
 * deletes connector meshes. The physical photos show the last three holes
 * on each of Step 9's outer 15-hole white rails. Counting from the free
 * bottom end, use the first and third holes and leave the middle empty.
 *
 * Step 9's 15-hole mesh is indexed from the OPPOSITE end, so the exposed
 * three-hole group is mesh holes 13, 14, 15. The Step 10 end has its blue
 * through-pin in WHITE Hole 1 and its black opposite-gray pin in Hole 3.
 */
export const STEP_ELEVEN_ASSEMBLY_ID = "marksman-step11-step9-step10-four-pin-join-v1";
export const STEP_ELEVEN_RESULT_KEY = "robot:marksmanship:step11:joined:v1";
export const STEP_ELEVEN_STEP_NINE_MESH_HOLES = { blue: 13, empty: 14, black: 15 } as const;
export const STEP_ELEVEN_STEP_TEN_HOLES = { blue: 1, black: 3 } as const;
export const STEP_ELEVEN_PIN_IDS = [
  "BLUE_A_1", "BLACK_A_3", "BLUE_B_1", "BLACK_B_3",
] as const;
export const STEP_ELEVEN_FINAL_PHASE = 4;
export const STEP_ELEVEN_ACTIONS = [
  { title: "Prepare both finished assemblies",
    instruction: "Place the completed Step 9 assembly on the left and the finished Step 10 twin-rail assembly on the right. Keep all original white and gray beams, black pins, blue pins and the black 3-hole bridge installed." },
  { title: "Locate the four connector ends",
    instruction: "Find Step 10's blue Hole 1 and black Hole 3 pins on EACH white beam. Locate the last three free holes of each outer Step 9 white rail; the center receiving hole stays empty." },
  { title: "Align Step 10 with Step 9",
    instruction: "Rotate the whole Step 10 assembly as one rigid unit so the black Hole 3 pins face Step 9 and the gray beams face away. Align both blue pins with the top hole of each three-hole group and both black pins with the bottom hole; approach with clearance." },
  { title: "Seat all four existing connectors",
    instruction: "Move the entire Step 10 assembly straight toward Step 9 along the hole axes. Blue and black pins stay attached to the Step 10 white beams and enter their matching holes together. The middle receiving holes remain empty." },
  { title: "Inspect front, back and underside",
    instruction: "Check that the upper and lower receivers on BOTH white rails contain their matching original connectors. Verify that the pins have not been hidden or shortened, the middle holes are unused, and no shaft protrudes unexpectedly." },
] as const;
export type V3 = [number, number, number];
export type StepElevenPlacement = {
  target: V3;
  sideRailZ: readonly [number, number];
  railX: number;
  warnings: string[];
};
/**
 * Coordinates are in Step 9's shared reference BEFORE its 180-degree outer
 * Z rotation. Step 7's finished 15-hole rails are already yawed 180 degrees.
 *
 * Rigid Step 10 orientation: local (x,y,z) -> shared (-x,y,z) with
 * components rearranged as (-x, z, y): its Hole 3 black pins on -Z then
 * point upward (-shared-Y) toward the Step 9 receiving beams, while gray
 * beams on +Z stay on the outside. Both blue Hole 1 pins remain two-sided.
 */
export function stepElevenPlacement(
  railConfig: StepSevenRailConfig, sixConfig: StepSixMountConfig, beamY: number,
): StepElevenPlacement {
  const rails = STEP_SEVEN_RAIL_IDS.map(id =>
    railPose(id, STEP_SEVEN_FINAL_PHASE, railConfig, beamY, sixConfig));
  const sharedX = rails.map(rail => -rail.position[0]);
  const sharedZ = rails.map(rail => -rail.position[2]).sort((a, b) => a - b);
  const sharedY = rails.map(rail => rail.position[1]);
  const railX = (sharedX[0]! + sharedX[1]!) / 2;
  // The Step 10 blue pin is local x = -7 and maps to shared x = +7.
  // The Step 9 exposed third-from-bottom receiving hole is mesh #13:
  // after Step 7 yaw that hole is shared railX - 5. Therefore the
  // Step 10 rigid root must be at shared railX - 12.
  const x = railX - 12;
  const y = (sharedY[0]! + sharedY[1]!) / 2 + STEP_NINE_RAIL_FACE_SEATING;
  const z = (sharedZ[0]! + sharedZ[1]!) / 2;
  const warnings: string[] = [];
  if (Math.abs(sharedX[0]! - sharedX[1]!) > 0.10)
    warnings.push("The two Step 9 side rails have different lengthwise origins; confirm which free-end holes are aligned.");
  if (Math.abs(sharedY[0]! - sharedY[1]!) > 0.10)
    warnings.push("The two Step 9 side-rail faces are at different heights.");
  if (Math.abs(sharedZ[1]! - sharedZ[0]!) - 2 > 0.15 ||
      2 - Math.abs(sharedZ[1]! - sharedZ[0]!) > 0.15)
    warnings.push("The Step 9 rail spacing differs from Step 10's two white beams. Do not force a physical connection.");
  const ready = stepTenPoses(STEP_TEN_FINAL_PHASE);
  if (whiteHoleX(STEP_ELEVEN_STEP_TEN_HOLES.black) -
      whiteHoleX(STEP_ELEVEN_STEP_TEN_HOLES.blue) !== 2)
    warnings.push("The Step 10 end connectors are not separated by two holes.");
  if (Math.abs(ready.BLACK_A_3.position[2] - ready.WHITE_A.position[2]) < 0.1)
    warnings.push("The black connector is not facing the opposite side to the gray beam.");
  return { target: [x, y, z], railX, sideRailZ: [sharedZ[0]!, sharedZ[1]!], warnings };
}
export function stepElevenPose(phase: number, target: V3): V3 {
  if (!Number.isInteger(phase) || phase < 0 || phase > STEP_ELEVEN_FINAL_PHASE)
    throw Error("Invalid Step 11 action");
  if (phase <= 1) return [target[0] - 22, target[1] + 2.4, target[2]];
  if (phase === 2) return [target[0], target[1] + 2.4, target[2]];
  return [...target];
}
