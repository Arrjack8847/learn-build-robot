import { stepTenPoses, STEP_TEN_FINAL_PHASE, STEP_TEN_BEAM_HALF_DEPTH,
  STEP_TEN_GRAY_CENTER_Z, STEP_TEN_BLUE_PIN_HALF_LENGTH } from "./stepTenGeometry";
import type { StepElevenPlacement, V3 } from "./stepElevenGeometry";

/**
 * Photo-guided Step 13. Reuse the completed Step 11 model and both fully
 * prepared Step 12 L-units. NO Step 11 or Step 12 connector is regenerated,
 * moved independently, shortened, or hidden.
 *
 * The two outward-facing pins on the photographed gray side rail correspond
 * to Step 10's BLUE_A_6 and BLUE_A_12. Its second gray rail is untouched.
 * The exact L receiving hole was not specified in the photograph, so the
 * free L corner hole is a provisional seating point for visual review.
 */
export const STEP_THIRTEEN_ASSEMBLY_ID = "marksman-step13-two-l-brackets-on-gray-rail-v1";
export const STEP_THIRTEEN_RESULT_KEY = "robot:marksmanship:step13:l-brackets:v1";
export const STEP_THIRTEEN_MOUNTS = ["BLUE_A_6", "BLUE_A_12"] as const;
export const STEP_THIRTEEN_RECEIVER = "free L corner hole (provisional)" as const;
export const STEP_THIRTEEN_FINAL_PHASE = 6;
export const STEP_THIRTEEN_ACTIONS = [
  { title: "Prepare the complete Step 11 and two Step 12 units",
    instruction: "Keep the entire finished Step 11 chassis fixed. Place both already completed Step 12 L-shaped assemblies beside it. Both black pins and tan bushings stay fitted to their respective L-pieces." },
  { title: "Find the two outward-facing blue connectors",
    instruction: "Locate the two blue pins projecting out of the same gray side rail. These are the existing blue connectors at White Holes 6 and 12 beneath that gray rail. Do not add or replace any blue pins." },
  { title: "Line up the first L-shaped assembly",
    instruction: "Move the first prepared L-piece near the first blue connector. Bring the free receiving hole directly onto the connector axis with a visible gap before insertion." },
  { title: "Seat the first L-shaped assembly",
    instruction: "Slide the first complete L-piece straight toward the gray rail along the blue connector axis. Keep its Hole 4 black pin and bushing installed and its connector visible wherever exposed." },
  { title: "Line up the opposite-face L-shaped assembly",
    instruction: "Bring the second, opposite-face L-piece to the other outward blue connector. Keep its mirrored orientation and bushing; align the free receiving hole coaxially before approaching." },
  { title: "Seat the second L-shaped assembly",
    instruction: "Slide the second complete L-piece straight along the blue connector axis until seated. Neither black connector nor brown bushing moves separately from its L-beam." },
  { title: "Inspect both mounted L-shaped assemblies",
    instruction: "Rotate the view to confirm that two prepared L-pieces are attached to two pre-existing blue pins on the same gray rail, nothing vanished, and no beam interpenetrates another. Confirm the receiving holes against the real kit." },
] as const;

export type StepThirteenUnit = "A" | "B";
export type StepThirteenMount = { pin: V3; seated: V3; clearance: V3; loose: V3 };
export type StepThirteenAnchors = Record<StepThirteenUnit, StepThirteenMount>;
export const STEP_THIRTEEN_SEATING_GAP = 0.05;

/** The Step 11 fixed join rotates original Step 10 local (x,y,z) to (-x,z,y). */
export function stepThirteenAnchors(join: StepElevenPlacement): StepThirteenAnchors {
  const stepTen = stepTenPoses(STEP_TEN_FINAL_PHASE);
  const make = (id: (typeof STEP_THIRTEEN_MOUNTS)[number], unit: StepThirteenUnit): StepThirteenMount => {
    const original = stepTen[id].position;
    const pin: V3 = [
      join.target[0] - original[0],
      join.target[1] + original[2],
      join.target[2] + original[1],
    ];
    // Center a full-thickness L over the portion of the 24-mm blue shaft
    // exposed above the existing gray rail, with a 0.05 pitch clearance.
    // Pin and gray meshes remain in exactly their previous positions.
    const offset = STEP_TEN_GRAY_CENTER_Z + 2 * STEP_TEN_BEAM_HALF_DEPTH +
      STEP_THIRTEEN_SEATING_GAP;
    const seated: V3 = [pin[0], join.target[1] + offset, pin[2]];
    const clearance: V3 = [seated[0], seated[1] + 3.1, seated[2]];
    const loose: V3 = [
      seated[0] + (unit === "A" ? 3.0 : -3.0),
      seated[1] + 7.2,
      seated[2] + (unit === "A" ? -4.0 : 4.0),
    ];
    return { pin, seated, clearance, loose };
  };
  return { A: make("BLUE_A_6", "A"), B: make("BLUE_A_12", "B") };
}

export function stepThirteenUnitPosition(
  phase: number, unit: StepThirteenUnit, anchors: StepThirteenAnchors,
): V3 {
  if (!Number.isInteger(phase) || phase < 0 || phase > STEP_THIRTEEN_FINAL_PHASE)
    throw Error("Invalid Step 13 action");
  const p = anchors[unit];
  if (unit === "A") return phase >= 3 ? [...p.seated] : phase >= 2 ? [...p.clearance] : [...p.loose];
  return phase >= 5 ? [...p.seated] : phase >= 4 ? [...p.clearance] : [...p.loose];
}

/** Coordinates for the existing viewer's outer 180-degree world Z rotation. */
export function stepThirteenCameraFocus(anchors: StepThirteenAnchors, beamY: number): V3 {
  const avg = (axis: 0 | 1 | 2) =>
    (anchors.A.seated[axis] + anchors.B.seated[axis]) / 2;
  return [-avg(0), beamY - avg(1), avg(2)];
}

export function stepThirteenWarnings(anchors: StepThirteenAnchors): string[] {
  const notes: string[] = [];
  if (Math.abs(anchors.A.pin[0] - anchors.B.pin[0]) !== 6)
    notes.push("Blue mounting pins must retain their original six-hole spacing.");
  if (Math.abs(anchors.A.pin[2] - anchors.B.pin[2]) > 0.01)
    notes.push("The two blue pins must be on the SAME gray rail.");
  const originalCenterZ = stepTenPoses(STEP_TEN_FINAL_PHASE).BLUE_A_6.position[2];
  const pinTipZ = originalCenterZ + STEP_TEN_BLUE_PIN_HALF_LENGTH;
  const receiverCenterZ = anchors.A.seated[1] - (anchors.A.pin[1] - originalCenterZ);
  if (receiverCenterZ > pinTipZ + STEP_TEN_BEAM_HALF_DEPTH)
    notes.push("Blue-pin shaft may not reach the new L receiver.");
  notes.push("L receiving corner holes and pin seating depth are photo-guided approximations, not measured fit tolerances.");
  return notes;
}
