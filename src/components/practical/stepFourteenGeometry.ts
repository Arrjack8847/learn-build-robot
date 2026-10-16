import { STEP_TEN_FINAL_PHASE, STEP_TEN_GRAY_CENTER_Z, STEP_TEN_BEAM_HALF_DEPTH, stepTenPoses, type StepTenPart } from "./stepTenGeometry";
import { stepElevenPlacement } from "./stepElevenGeometry";
import type { StepSevenRailConfig } from "./stepSevenRailGeometry";
import type { StepSixMountConfig } from "./StepSixGeometry";
import type { V3 } from "./stepElevenGeometry";

/**
 * Step 14 adds the COMPLETE Step 2 motor unit onto the UNMODIFIED Step 13
 * chassis. These four pin identifiers belong to Step 10's two 9-hole GREY
 * rails (their holes 3 and 9), not Step 13's L-bracket bridge pins.
 *
 * Measured directly from the ORIGINAL motor GLB: circular mounting rims on
 * the housing's ±12 mm side faces lie at 4 and 52 mm behind the FRONT
 * output datum, each at transverse ±8 mm (48 x 16 mm rectangle). The
 * real-kit press-fit and insertion depth still need physical confirmation.
 */
export const STEP_FOURTEEN_ASSEMBLY_ID = "marksman-step14-step2-motor-step13-four-gray-pins-v1";
export const STEP_FOURTEEN_RESULT_KEY = "robot:marksmanship:step14:mounted-motor:v1";
export const STEP_FOURTEEN_MOUNT_PIN_IDS = [
  "BLUE_A_6", "BLUE_A_12", "BLUE_B_6", "BLUE_B_12",
] as const satisfies readonly StepTenPart[];
export const STEP_FOURTEEN_GREY_HOLES = {
  BLUE_A_6: 3, BLUE_A_12: 9, BLUE_B_6: 3, BLUE_B_12: 9,
} as const;
/** GLB vertex rings: local body front hole at Y=4, rear at Y=52,
 * with lateral Z=±8mm; housing side faces X=±12mm. Exact motor part
 * physical tolerance is NOT implied by these model measurements. */
export const STEP_FOURTEEN_MOTOR_HOLES_MM = {
  frontBehindAxleHub: 4, rearBehindAxleHub: 52,
  transverseOffset: 8, housingFaceOffset: 12,
} as const;
export const STEP_FOURTEEN_FINAL_PHASE = 5;
export const STEP_FOURTEEN_ACTIONS = [
  { title: "Prepare completed Steps 2 and 13",
    instruction: "Keep Step 13 fully assembled and stationary, including both inward-facing L stoppers. Bring over the WHOLE completed Step 2 motor, with its short axle, disc, connector and 5-hole beam already attached." },
  { title: "Identify four original grey-beam pins",
    instruction: "Locate two BLUE pins at grey Holes 3 and 9 on each of the TWO 9-hole grey beams, immediately below the black 3-hole crossbeam. These four pins were installed in Step 10; do not move or replace them." },
  { title: "Orient motor output toward black crossbeam",
    instruction: "Rotate the complete motor assembly until its axle, round disc and 5-hole beam face TOWARD the black 3-hole crossbeam. Keep the four motor mounting holes directed toward the four blue pins." },
  { title: "Align all four mounting holes",
    instruction: "Center the motor over the rectangular four-pin pattern, aligning BOTH holes on each side. Approach with clearance. The four motor mounting-hole centers were measured from the GLB and share the pins' 48 x 16 mm pattern; verify the real physical press-fit and seating depth." },
  { title: "Lower motor straight onto all four pins",
    instruction: "With orientation fixed, lower the whole prepared Step 2 assembly toward the grey beams on a single straight mounting axis. All four existing blue pins should enter their corresponding motor mounting holes together. Do not fade or remove pins." },
  { title: "Inspect motor and four retained blue pins",
    instruction: "Check all FOUR positions, grey beams and black 3-hole crossbeam. The axle and disc must still face TOWARD the black crossbeam. Check the real motor holes and press-fit before confirming this step." },
] as const;
export type StepFourteenPose = { position: V3; rotationZ: number };

/** Positions in the final Step 10 LOCAL coordinate system, not Step 13's
 * separate STEP5 bridge coordinates. The BLUE pins point along local +Z.
 */
export function stepFourteenPins(): Array<{ id: (typeof STEP_FOURTEEN_MOUNT_PIN_IDS)[number]; greyHole: 3 | 9; position: V3 }> {
  const result = stepTenPoses(STEP_TEN_FINAL_PHASE);
  return STEP_FOURTEEN_MOUNT_PIN_IDS.map(id => ({
    id, greyHole: STEP_FOURTEEN_GREY_HOLES[id],
    position: [...result[id].position] as V3,
  }));
}
export function stepFourteenPinWarnings(): string[] {
  const pins = stepFourteenPins(), issues: string[] = [];
  const coordinates = pins.map(p => p.position);
  const xs = [...new Set(coordinates.map(p => p[0]))].sort((a,b) => a-b);
  const ys = [...new Set(coordinates.map(p => p[1]))].sort((a,b) => a-b);
  if (xs.length !== 2 || ys.length !== 2 ||
      Math.abs(xs[1]! - xs[0]! - 6) > 1e-5 ||
      Math.abs(ys[1]! - ys[0]! - 2) > 1e-5 ||
      !coordinates.every(p => Math.abs(p[2] - coordinates[0]![2]) < 1e-5)) {
    issues.push("The four original grey-rail connectors do not form the expected 48 x 16 mm footprint.");
  }
  issues.push("GLB mounting holes and four frame pins share a 48 x 16 mm pattern; actual connector seating depth and kit tolerance need physical confirmation.");
  return issues;
}

/** The motor visual is calibrated at runtime using the visible real GLB body
 * underside. seatZ seats the measured ±12 mm housing face on the grey beam top.
 * Four receiving-hole centers are mesh-measured, but press-fit tolerance is not certified.
 */
export function stepFourteenPose(phase: number, seatZ: number): StepFourteenPose {
  if (!Number.isInteger(phase) || phase < 0 || phase > STEP_FOURTEEN_FINAL_PHASE)
    throw Error("Invalid Step 14 phase");
  if (phase <= 1) return { position: [-1.5, -5.5, seatZ + 7], rotationZ: -Math.PI / 2 };
  if (phase === 2) return { position: [0, 0, seatZ + 5.5], rotationZ: 0 };
  if (phase === 3) return { position: [0, 0, seatZ + 3.2], rotationZ: 0 };
  return { position: [0, 0, seatZ], rotationZ: 0 };
}
export function stepFourteenGreyTop(): number {
  return STEP_TEN_GRAY_CENTER_Z + STEP_TEN_BEAM_HALF_DEPTH;
}

/** Focus in the world viewer coordinate system (Step 11 outer 180° yaw). */
export function stepFourteenFocusWorld(
  rails: StepSevenRailConfig, six: StepSixMountConfig, beamY: number,
): V3 {
  const join = stepElevenPlacement(rails, six, beamY);
  // The motor spans Step 10 local x[-2,+4], y[-1,+1], over its grey beams.
  // Step 10 local (x,y,z) maps to shared (-x,z,y).
  return [-(join.target[0] - 1), beamY - (join.target[1] + 3), join.target[2]];
}
