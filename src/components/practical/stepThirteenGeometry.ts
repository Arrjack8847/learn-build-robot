import { seatedPose, type StepSixMountConfig, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import { STEP_NINE_STEP_SEVEN_YAW } from "./stepNineGeometry";
import type { V3 } from "./stepElevenGeometry";

/**
 * Step 13 uses BOTH pre-existing long blue pins on EACH original Step 5/6
 * gray bridge. The photograph's circled pair is one of these bridges, not
 * Step 10's distant BLUE_A_6 / BLUE_A_12 rail-mounting connectors.
 *
 * Each pre-built Step 12 L unit receives a WHOLE pin pair through holes 1
 * and 3 of its short three-hole arm; short-arm hole 2 remains empty.
 * The prepared black pin and tan bushing in long-arm Hole 4 stay installed.
 *
 * The gray bridges, their child pins and Step 11 chassis never move.
 */
export const STEP_THIRTEEN_ASSEMBLY_ID = "marksman-step13-two-l-brackets-two-pin-pairs-inward-stoppers-v3";
export const STEP_THIRTEEN_RESULT_KEY = "robot:marksmanship:step13:l-brackets:v3";
export const STEP_THIRTEEN_MOUNTS = {
  A: ["STEP5_LONG_PIN_01", "STEP5_LONG_PIN_02"],
  B: ["STEP5_LONG_PIN_03", "STEP5_LONG_PIN_04"],
} as const;
export const STEP_THIRTEEN_RECEIVER = {
  first: 1, empty: 2, third: 3, preparedBlackPin: 4,
} as const;
export const STEP_THIRTEEN_FINAL_PHASE = 6;
export const STEP_THIRTEEN_ACTIONS = [
  { title: "Prepare the chassis and two complete L assemblies",
    instruction: "Keep the completed Step 11 frame stationary. Set out both completely prepared Step 12 L-pieces, with each Hole 4 black pin and tan bushing retained." },
  { title: "Locate TWO PAIRS of original blue pins",
    instruction: "Find both closely spaced blue connectors protruding from the first gray bridge (the circled pair), then the matching two from the other gray bridge. These are the original four Step 5 long blue pins, not Step 10's widely separated white-rail pins." },
  { title: "Align FIRST L with BOTH blue pins",
    instruction: "Rotate the first complete L bracket onto its gray bridge's outer mounting face, with its long arm pointing downward and its brown stopper facing INWARD toward the robot center. Align short-arm Holes 1 and 3 with BOTH blue pins; Hole 2 stays empty." },
  { title: "Insert both pins into the FIRST L",
    instruction: "After the turn, keep the first L rotation LOCKED. Slide the whole pre-built unit straight inward along both blue-pin axes. Both original blue pins enter short-arm Holes 1 and 3 simultaneously." },
  { title: "Align SECOND mirrored L with its two pins",
    instruction: "Rotate the second complete L bracket onto the opposite gray-bridge mounting face. Its long arm points downward and its brown stopper faces INWARD toward the first stopper. Align short-arm Holes 1 and 3 with both original pins; Hole 2 stays empty." },
  { title: "Insert both pins into the SECOND L",
    instruction: "After the second turn, keep the mirrored L rotation LOCKED. Slide it straight inward to seat both pins simultaneously, keeping its original black pin and brown bushing rigidly attached." },
  { title: "Inspect all four connections",
    instruction: "Verify that each L receives TWO existing blue pins at short-arm Holes 1 and 3, both middle Holes 2 are empty, and both long-arm Hole 4 brown stoppers point INWARD toward one another. The black pins and bushings remain attached and nothing protrudes unexpectedly." },
] as const;

export type StepThirteenUnit = "A" | "B";
export type StepThirteenPinId = (typeof STEP_THIRTEEN_MOUNTS)[StepThirteenUnit][number];
export type StepThirteenMount = {
  pinIds: readonly [StepThirteenPinId, StepThirteenPinId];
  /** Corresponding axes of short-arm Hole 1 and Hole 3 (world shared Step 11 space). */
  pins: readonly [V3, V3];
  outward: 1 | -1;
  /** Rigid L pivot/short-arm Hole 1 location at final seating. */
  seated: V3;
  clearance: V3;
  loose: V3;
  /** Final rigid orientation: first rotate Y, then flip 180 degrees about local X. */
  rotationY: number;
};
export type StepThirteenAnchors = Record<StepThirteenUnit, StepThirteenMount>;

/** Illustrative 8-mm pitch scene spacing; kit's physical pin depth remains unverified. */
export const STEP_THIRTEEN_SEATING_GAP = 0.04;
export const STEP_THIRTEEN_BRIDGE_HALF_DEPTH = 7.8 / 16;
export const STEP_THIRTEEN_L_HALF_DEPTH = 8 / 16;

function rotateY(v: V3, angle: number): V3 {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [v[0] * c + v[2] * s, v[1], v[2] * c - v[0] * s];
}
function add(a: V3, b: V3): V3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/**
 * Reconstruct the exact world positions of the four Step 5 child connector
 * meshes from the saved Step 5 positions and the Step 6/11 parent rotations.
 *
 * Stage in StepElevenScene:
 *   STEP11_SHARED_ASSEMBLY_SPACE
 *     STEP11_EXACT_STEP9_COMPLETE [Y yaw STEP_NINE_STEP_SEVEN_YAW]
 *       STEP5_BRIDGE_{A,B} [seatedPose Euler]
 *         STEP5_LONG_PIN_01 ... 04 [saved local Step 5 transforms]
 */
export function stepThirteenAnchors(
  sixConfig: StepSixMountConfig, prepared: StepSixStepFiveTransforms,
  beamY: number,
): StepThirteenAnchors {
  const make = (unit: StepThirteenUnit): StepThirteenMount => {
    const bridgeId = unit === "A" ? "STEP5_BRIDGE_A" : "STEP5_BRIDGE_B";
    const parent = seatedPose(bridgeId, sixConfig, beamY);
    const bridgeAt = rotateY(parent.position, STEP_NINE_STEP_SEVEN_YAW);
    const yaw = STEP_NINE_STEP_SEVEN_YAW + parent.rotation[1];
    const pinIds = STEP_THIRTEEN_MOUNTS[unit];
    const positions = pinIds.map(id => {
      const saved = prepared[id];
      if (!saved || saved.parent !== bridgeId)
        throw new Error("Missing original " + id + " mounted to " + bridgeId);
      return add(bridgeAt, rotateY(saved.position, yaw));
    }) as [V3, V3];

    // In Step 6, gray bridge sign +Z faces the outside on the FRONT,
    // sign -Z on the BACK. Step 9 yaw makes that normal cos(yaw).
    // The old -cos(yaw) put BOTH brackets on the wrong side.
    const outward = (Math.cos(yaw) >= 0 ? 1 : -1) as 1 | -1;
    // The Step 12 L short arm runs local +X (Hole 1 at the corner,
    // Hole 3 at +2). Its long arm runs local -Y, and its Hole 4 brown
    // stopper projects along local +Z. The rigid Step 13 orientation
    // Y(rotationY) * X(180°) makes:
    //   long arm: +shared Y (downward after the viewer's outer Z flip)
    //   stopper: -outward Z (INWARD toward the center, on BOTH sides)
    //   short arm 1 -> 3: outward X (two pitches along pin pair)
    // Reversing the short-arm pin order is NECESSARY to flip the L face
    // without moving any already-installed blue connector.
    const xSign = outward;
    const ordered = [...positions].sort((a, b) =>
      xSign === 1 ? a[0] - b[0] : b[0] - a[0]) as [V3, V3];
    const rotationY = outward === 1 ? 0 : Math.PI;
    const normalGap = STEP_THIRTEEN_BRIDGE_HALF_DEPTH +
      STEP_THIRTEEN_L_HALF_DEPTH + STEP_THIRTEEN_SEATING_GAP;
    const first = ordered[0];
    const seated: V3 = [first[0], first[1], first[2] + outward * normalGap];
    const clearance: V3 = [seated[0], seated[1], seated[2] + outward * 3.1];
    const loose: V3 = [
      clearance[0] + (unit === "A" ? 3.5 : -3.5),
      clearance[1] + (unit === "A" ? -3 : 3),
      clearance[2] + outward * 2.1,
    ];
    return { pinIds, pins: ordered, outward, seated, clearance, loose, rotationY };
  };
  return { A: make("A"), B: make("B") };
}

/** Turn each loose, complete L-piece in free space during its alignment.
 * When the insertion phase starts, its angle is already locked and only
 * axial translation remains. No independent black pin/bushing rotation.
 */
export function stepThirteenUnitTwist(phase: number, unit: StepThirteenUnit): number {
  if (!Number.isInteger(phase) || phase < 0 || phase > STEP_THIRTEEN_FINAL_PHASE)
    throw Error("Invalid Step 13 action");
  if (unit === "A") return phase < 2 ? -Math.PI / 2 : 0;
  return phase < 4 ? Math.PI / 2 : 0;
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

/** Coordinate transform of viewer outer 180-degree rotation about Z. */
export function stepThirteenCameraFocus(anchors: StepThirteenAnchors, beamY: number): V3 {
  const avg = (axis: 0 | 1 | 2) =>
    (anchors.A.seated[axis] + anchors.B.seated[axis]) / 2;
  return [-avg(0), beamY - avg(1), avg(2)];
}

export function stepThirteenWarnings(anchors: StepThirteenAnchors): string[] {
  const notes: string[] = [];
  for (const unit of ["A", "B"] as const) {
    const { pins, outward, seated } = anchors[unit];
    const gapX = pins[1][0] - pins[0][0];
    if (Math.abs(Math.abs(gapX) - 2) > 0.001 ||
        Math.abs(pins[1][1] - pins[0][1]) > 0.001 ||
        Math.abs(pins[1][2] - pins[0][2]) > 0.001)
      notes.push(unit + ": pin pair does not match short-arm Holes 1 and 3.");
    if (Math.sign(gapX) !== outward)
      notes.push(unit + ": inward-facing L short-arm direction does not match the connector pair.");
    // Normal of the complete L's Hole 4 stopper after Y(rotationY)*X(PI).
    // It must point toward the center, opposite this gray bridge's
    // outward face, without rotating the black pin/bushing independently.
    const stopperZ = -Math.cos(anchors[unit].rotationY);
    if (Math.abs(stopperZ + outward) > 0.001)
      notes.push(unit + ": brown stopper must point inward toward the robot center.");
    if (Math.abs(seated[2] - pins[0][2]) < STEP_THIRTEEN_BRIDGE_HALF_DEPTH)
      notes.push(unit + ": L beam intersects the gray bridge face.");
  }
  if (anchors.A.outward === anchors.B.outward)
    notes.push("The gray bridges have the same outward pin direction; check saved Step 6 face configuration.");
  notes.push("The exact receiving-hole geometry and connector seating depth need real-kit verification.");
  return notes;
}
