/**
 * Step 10 — photo-based twin side rails and three-hole end bridge.
 * Coordinates use the real 8 mm Technic hole pitch from the original STLs.
 * User-confirmed HOLE NUMBERS must not be re-indexed or silently changed.
 * Insertion depths and brown spacer dimensions are visual approximations,
 * not an assertion of mechanically certified fit.
 */
export type Vec3 = [number, number, number];
export type StepTenPose = { position: Vec3; rotation: Vec3 };
export const STEP_TEN_ASSEMBLY_ID = "marksman-step10-twin-rail-end-bridge-v1";
export const STEP_TEN_RESULT_KEY = "marksman.step10.twinRailEndBridge.v1";
export const STEP_TEN_PITCH_MM = 8;
/** Gray beam is on +Z; Hole 3 black pins extend from the opposite, -Z face. */
export const STEP_TEN_GRAY_CENTER_Z = 1.12;
/** 7.8 mm white-beam thickness, 24 mm blue-pin length, both in pitch units.
 * The bottom tip of each Hole 6/12 pin stops at the white underside (not below it).
 * The remainder passes upward through the gray beam and remains visible on top.
 */
export const STEP_TEN_BEAM_HALF_DEPTH = 7.8 / (2 * STEP_TEN_PITCH_MM);
export const STEP_TEN_BLUE_PIN_HALF_LENGTH = 24 / (2 * STEP_TEN_PITCH_MM);
export const STEP_TEN_BLUE_TWO_BEAM_CENTER_Z = STEP_TEN_BLUE_PIN_HALF_LENGTH - STEP_TEN_BEAM_HALF_DEPTH;
/** User-confirmed: the black 3-hole bridge and grey 9-hole beams must
 * be on the SAME (+Z) side of their white 15-hole beams. The two Hole 15
 * black pins enter from +Z to meet the outer holes of the bridge.
 */
export const STEP_TEN_BLACK_BRIDGE_CENTER_Z = 1.08;
/** An 16 mm black pin at centre 0.55 has its outermost tip at 1.55,
 * just INSIDE the 3-hole bridge's outward (+Z) surface at 1.5675.
 */
export const STEP_TEN_BLACK_HOLE15_CENTER_Z = 0.55;
/** Brown stopper is inward (-Z) relative to the now-upper bridge,
 * between the side rails: place it BELOW the bridge and slide its black
 * connector UPWARD into Bridge Hole 2 from the robot interior.
 * Its outermost +Z pin tip is recessed beneath the bridge's top surface.
 */
export const STEP_TEN_SPACER_CENTER_Z = STEP_TEN_BLACK_BRIDGE_CENTER_Z -
  STEP_TEN_BEAM_HALF_DEPTH - 0.45;
export const STEP_TEN_CENTER_BLACK_PIN_Z = STEP_TEN_BLACK_BRIDGE_CENTER_Z +
  STEP_TEN_BEAM_HALF_DEPTH - 1 - 0.04;
export const STEP_TEN_BLACK_HOLE3_CENTER_Z = -0.68;
export const STEP_TEN_WHITE_HOLES = { endBlue: 1, blackFree: 3, grayBlueFirst: 6, grayBlueSecond: 12, blackBridge: 15 } as const;
export const STEP_TEN_GRAY_HOLES = { first: 3, second: 9 } as const;
export const STEP_TEN_GRAY_OVERLAP: readonly number[] = [4, 5, 6, 7, 8, 9, 10, 11, 12];
export const STEP_TEN_COMPONENT_COUNTS = {
  white15: 2, gray9: 2, bluePins: 6, blackPins: 5, blackBeam3: 1, brownSpacer: 1,
} as const;

export const STEP_TEN_PARTS = [
  "WHITE_A", "GRAY_A", "BLUE_A_1", "BLUE_A_6", "BLUE_A_12", "BLACK_A_3", "BLACK_A_15",
  "WHITE_B", "GRAY_B", "BLUE_B_1", "BLUE_B_6", "BLUE_B_12", "BLACK_B_3", "BLACK_B_15",
  "BRIDGE_3", "CENTER_BLACK", "BROWN_SPACER",
] as const;
export type StepTenPart = (typeof STEP_TEN_PARTS)[number];
export type StepTenModel = "white" | "gray" | "blue" | "black" | "three" | "spacer";
export const STEP_TEN_MODELS: Readonly<Record<StepTenPart, StepTenModel>> = {
  WHITE_A: "white", GRAY_A: "gray",
  BLUE_A_1: "blue", BLUE_A_6: "blue", BLUE_A_12: "blue",
  BLACK_A_3: "black", BLACK_A_15: "black",
  WHITE_B: "white", GRAY_B: "gray",
  BLUE_B_1: "blue", BLUE_B_6: "blue", BLUE_B_12: "blue",
  BLACK_B_3: "black", BLACK_B_15: "black",
  BRIDGE_3: "three", CENTER_BLACK: "black", BROWN_SPACER: "spacer",
};

export const STEP_TEN_ACTIONS = [
  { number: "0", title: "Prepare every part", instruction: "Lay out two white 15-hole beams, two gray 9-hole beams, six blue pins, five black pins, one black 3-hole beam, and one brown cylindrical spacer. Keep parts separated." },
  { number: "1", title: "Position first white beam", instruction: "Place the first white 15-hole beam with its holes visible. Count from the end which will receive the through-blue pin: that end is Hole 1." },
  { number: "2", title: "First end blue pin — Hole 1", instruction: "Insert the blue connector from BELOW to ABOVE through White A Hole 1. Stop centered so both the upper and lower ends remain visible." },
  { number: "3", title: "First gray mounting pin — Hole 6", instruction: "Insert the blue pin from ABOVE to BELOW into White A Hole 6. Stop with its bottom end FLUSH with the white underside, not sticking out. The upper end remains exposed for Gray Hole 3." },
  { number: "4", title: "Second gray mounting pin — Hole 12", instruction: "Insert the blue pin from ABOVE to BELOW into White A Hole 12. Keep its lower tip FLUSH with the white underside; its top end receives Gray Hole 9." },
  { number: "5", title: "First black pin — Hole 3", instruction: "From the OPPOSITE face of the white beam to its gray-beam mounting side, insert the black connector into White A Hole 3 (NOT Hole 2). Its free end must protrude below the white beam, away from the gray beam." },
  { number: "6", title: "Bridge black pin — Hole 15", instruction: "Insert the black pin at White A Hole 15 FROM ABOVE on the SAME (+Z) SIDE as the grey 9-hole beam. Stop without letting its far end extend beyond the black bridge's outward face." },
  { number: "7", title: "Seat first gray 9-hole beam", instruction: "Line Gray A Hole 3 up with White A Hole 6, and Gray A Hole 9 with White A Hole 12. Slide the gray beam onto both blue pins simultaneously until parallel and seated." },
  { number: "8", title: "Position second white beam", instruction: "Place the second white 15-hole beam separately. Use the same hole numbering, counted from its through-blue-pin end." },
  { number: "9", title: "Second end blue pin — Hole 1", instruction: "Insert the blue connector from BELOW to ABOVE into White B Hole 1. Stop centered so BOTH sides of the white beam show the pin." },
  { number: "10", title: "Second unit — Blue Hole 6", instruction: "Insert the blue pin from ABOVE to BELOW at White B Hole 6. The bottom must be FLUSH with the white underside; the upper end later receives Gray B Hole 3." },
  { number: "11", title: "Second unit — Blue Hole 12", instruction: "Insert the second mounting pin from ABOVE to BELOW at White B Hole 12. Its lower tip stays FLUSH with the white underside; the exposed top receives Gray B Hole 9." },
  { number: "12", title: "Second unit — Black Hole 3", instruction: "Insert the black pin into White B Hole 3 (never Hole 2) from the OPPOSITE face to Gray B, leaving its end exposed away from the gray beam." },
  { number: "13", title: "Second unit — Black Hole 15", instruction: "Insert the black pin at White B Hole 15 FROM ABOVE on the SAME (+Z) SIDE as its grey 9-hole beam. Leave its upper end available for the three-hole bridge." },
  { number: "14", title: "Seat second gray 9-hole beam", instruction: "Mount Gray B: its Hole 3 meets White B Hole 6, and its Hole 9 meets White B Hole 12. Both blue pin tops remain visible ABOVE gray; neither pin protrudes underneath white." },
  { number: "15", title: "Align both completed side assemblies", instruction: "Bring the two identical white-and-gray units beside each other with gray faces upward. Their White Hole 15 ends face the common black bridge; free Hole 1 ends stay apart." },
  { number: "16", title: "Align the black 3-hole bridge", instruction: "Bring the black 3-hole crossbeam ABOVE the white beams onto the SAME SIDE as both grey 9-hole rails. Align outer bridge holes 1 and 3 with the two White Hole 15 black pins; keep middle Hole 2 open for the inward stopper." },
  { number: "17", title: "Seat the bridge into both ends", instruction: "Lower the black 3-hole crossbeam FROM ABOVE onto both black connectors at White Hole 15. Bridge outer holes 1 and 3 attach the two white rails; the crossbeam stays on the SAME (+Z) face as the grey beams." },
  { number: "18", title: "Prepare the inward brown stopper", instruction: "Prepare the brown stopper with the last black connector on its INSIDE face. The pin must extend UPWARD from the stopper so it can enter middle Bridge Hole 2 from BELOW; the stopper itself stays toward the robot interior." },
  { number: "19", title: "Fit the stopper inward through Bridge Hole 2", instruction: "Bring the brown stopper and its pre-inserted black pin FROM BELOW (robot interior) and slide UPWARD into Bridge Hole 2. Stop with the brown stopper UNDER the black crossbeam, pointing INWARD, and the black pin not protruding above its outward face." },
  { number: "20", title: "Inspect the finished Step 10", instruction: "Verify the black 3-hole crossbeam and grey 9-hole beams are on the SAME side of the white beams. The black bridge's outer holes 1 and 3 connect both White Hole 15 pins. The brown stopper is BELOW/INWARD at bridge center Hole 2, not sticking out above the crossbeam. All four original blue motor-mounting pins on the grey beams remain unchanged." },
] as const;
export const STEP_TEN_FINAL_PHASE = STEP_TEN_ACTIONS.length - 1;

const ZERO: Vec3 = [0, 0, 0];
const pose = (position: Vec3, rotation: Vec3 = ZERO): StepTenPose => ({ position, rotation });
/** Original beam mesh is centered: 15-hole center index 8; 9-hole center index 5. */
export function whiteHoleX(hole: number): number {
  if (!Number.isInteger(hole) || hole < 1 || hole > 15) throw Error("White hole must be 1–15");
  return hole - 8;
}
export function grayHoleX(hole: number): number {
  if (!Number.isInteger(hole) || hole < 1 || hole > 9) throw Error("Gray hole must be 1–9");
  return hole - 5;
}
export function stepTenHolePairs() {
  return [{ white: 6, gray: 3 }, { white: 12, gray: 9 }] as const;
}
export function stepTenValidate(): string[] {
  const issues: string[] = [];
  for (const pair of stepTenHolePairs()) {
    if (whiteHoleX(pair.white) !== grayHoleX(pair.gray))
      issues.push("Gray/white mating holes are not coaxial.");
  }
  if (STEP_TEN_PARTS.length !== 17) issues.push("Step 10 must contain exactly 17 pieces.");
  // Same (+Z) face for grey and black three-hole beams; brown stopper BELOW
  // the bridge toward the robot (-Z). Do not move any grey-side blue pins.
  if (STEP_TEN_GRAY_CENTER_Z <= STEP_TEN_BEAM_HALF_DEPTH ||
      STEP_TEN_BLACK_BRIDGE_CENTER_Z <= STEP_TEN_BEAM_HALF_DEPTH)
    issues.push("Black 3-hole crossbeam must be on the SAME side as the grey beams.");
  if (STEP_TEN_SPACER_CENTER_Z >= STEP_TEN_BLACK_BRIDGE_CENTER_Z ||
      STEP_TEN_CENTER_BLACK_PIN_Z <= STEP_TEN_SPACER_CENTER_Z)
    issues.push("Brown stopper must face INWARD below the grey-side bridge.");
  const outwardBridgeFace = STEP_TEN_BLACK_BRIDGE_CENTER_Z + STEP_TEN_BEAM_HALF_DEPTH;
  if (STEP_TEN_CENTER_BLACK_PIN_Z + 1 > outwardBridgeFace ||
      STEP_TEN_BLACK_HOLE15_CENTER_Z + 1 > outwardBridgeFace)
    issues.push("A black bridge connector protrudes outward beyond the crossbeam.");
  return issues;
}
const startY = (unit: "A" | "B") => unit === "A" ? -4 : 4;
const finalY = (unit: "A" | "B") => unit === "A" ? -1 : 1;
const activeY = (unit: "A" | "B", phase: number) => phase >= 15 ? finalY(unit) : startY(unit);
const bluePhases = { BLUE_A_1: 2, BLUE_A_6: 3, BLUE_A_12: 4,
  BLUE_B_1: 9, BLUE_B_6: 10, BLUE_B_12: 11 } as const;
const blackPhases = { BLACK_A_3: 5, BLACK_A_15: 6, BLACK_B_3: 12, BLACK_B_15: 13 } as const;

export function stepTenPoses(phase: number): Record<StepTenPart, StepTenPose> {
  if (!Number.isInteger(phase) || phase < 0 || phase > STEP_TEN_FINAL_PHASE)
    throw Error("Invalid Step 10 action");
  const result = {} as Record<StepTenPart, StepTenPose>;
  for (const unit of ["A", "B"] as const) {
    const y = activeY(unit, phase);
    const whiteReady = phase >= (unit === "A" ? 1 : 8);
    result[("WHITE_" + unit) as "WHITE_A" | "WHITE_B"] =
      pose([whiteReady ? 0 : unit === "A" ? -0.8 : 0.8, y, 0]);
    const grayReady = phase >= (unit === "A" ? 7 : 14);
    result[("GRAY_" + unit) as "GRAY_A" | "GRAY_B"] =
      grayReady ? pose([0, y, STEP_TEN_GRAY_CENTER_Z])
      : pose([0, unit === "A" ? -6.9 : 6.9, 0]);
    for (const [hole, index] of ([1, 6, 12] as const).map((h, i) => [h, i] as const)) {
      const id = ("BLUE_" + unit + "_" + hole) as keyof typeof bluePhases;
      const mounted = phase >= bluePhases[id];
      result[id] = mounted
        // Hole 1 crosses the white beam with both tips visible.
        // Holes 6/12 stop exactly flush with the white underside and
        // expose only their TOP tips over the subsequently mounted gray beam.
        ? pose([whiteHoleX(hole), y, hole === 1 ? 0 : STEP_TEN_BLUE_TWO_BEAM_CENTER_Z])
        : pose([whiteHoleX(hole), unit === "A" ? -9 : 9,
          hole === 1 ? -2.15 : 3.3 + index * 0.16]);
    }
    for (const [hole, index] of ([3, 15] as const).map((h, i) => [h, i] as const)) {
      const id = ("BLACK_" + unit + "_" + hole) as keyof typeof blackPhases;
      result[id] = phase >= blackPhases[id]
        // Hole 3 pins remain on -Z (opposite grey). Hole 15 pins
        // sit on +Z, matching the grey beams and the black end crossbeam.
        ? pose([whiteHoleX(hole), y,
          hole === 3 ? STEP_TEN_BLACK_HOLE3_CENTER_Z : STEP_TEN_BLACK_HOLE15_CENTER_Z])
        : pose([whiteHoleX(hole), unit === "A" ? -9 : 9,
          hole === 3 ? -1.85 : 2.82]);
    }
  }
  // Crossbeam approaches FROM ABOVE, next to and on the same +Z face as
  // the grey beams, meeting White A/B Hole 15 via outer bridge holes 1/3.
  result.BRIDGE_3 = phase >= 17
    ? pose([7, 0, STEP_TEN_BLACK_BRIDGE_CENTER_Z], [0, 0, Math.PI / 2])
    : phase === 16
      ? pose([7, 0, STEP_TEN_BLACK_BRIDGE_CENTER_Z + 2.32], [0, 0, Math.PI / 2])
      : pose([9.5, -4.5, 3.1], [0, 0, Math.PI / 2]);
  // The inward brown stopper and black pin approach FROM BELOW the bridge.
  // During preparation its black pin sits slightly ABOVE the stopper.
  // On mounting, both move toward +Z into the middle bridge Hole 2.
  result.BROWN_SPACER = phase >= 19
    ? pose([7, 0, STEP_TEN_SPACER_CENTER_Z])
    : pose([9.7, 5.4, -3.1]);
  result.CENTER_BLACK = phase >= 19
    ? pose([7, 0, STEP_TEN_CENTER_BLACK_PIN_Z])
    : phase >= 18 ? pose([9.7, 5.4, -2.715])
      : pose([10.8, 7.6, -3.8]);
  return result;
}

export const STEP_TEN_ACTIVE_PART: Readonly<Partial<Record<number, StepTenPart>>> = {
  2: "BLUE_A_1", 3: "BLUE_A_6", 4: "BLUE_A_12", 5: "BLACK_A_3", 6: "BLACK_A_15", 7: "GRAY_A",
  9: "BLUE_B_1", 10: "BLUE_B_6", 11: "BLUE_B_12", 12: "BLACK_B_3", 13: "BLACK_B_15", 14: "GRAY_B",
  16: "BRIDGE_3", 17: "BRIDGE_3", 18: "CENTER_BLACK", 19: "BROWN_SPACER",
};
export function stepTenHighlight(phase: number): { unit: "A" | "B"; holes: number[]; face: number } | null {
  const isA = phase >= 2 && phase <= 7;
  const isB = phase >= 9 && phase <= 14;
  if (!isA && !isB) return null;
  const hole = ({ 2: 1, 3: 6, 4: 12, 5: 3, 6: 15, 9: 1, 10: 6, 11: 12, 12: 3, 13: 15 } as Record<number, number>)[phase];
  return { unit: isA ? "A" : "B", holes: hole ? [hole] : [6, 12],
    face: [2, 5, 9, 12].includes(phase) ? -1 : 1 };
}
