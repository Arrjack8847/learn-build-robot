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
  { number: "2", title: "First end blue pin — Hole 1", instruction: "Insert the blue connector through White A Hole 1. Its two ends must remain visible on both faces of the white beam." },
  { number: "3", title: "First gray mounting pin — Hole 6", instruction: "Insert the next blue pin through White A Hole 6 from the gray-beam side. Leave enough connector exposed to receive Gray Hole 3." },
  { number: "4", title: "Second gray mounting pin — Hole 12", instruction: "Insert the third blue pin through White A Hole 12, in the same direction as the Hole 6 pin. This will engage Gray Hole 9." },
  { number: "5", title: "First black pin — Hole 3", instruction: "Insert a black connector into White A Hole 3, counting from the blue end. This is Hole 3, NOT Hole 2." },
  { number: "6", title: "Bridge black pin — Hole 15", instruction: "Insert the black connector into White A Hole 15 from the underside. Preserve its outward-facing end for the later 3-hole bridge." },
  { number: "7", title: "Seat first gray 9-hole beam", instruction: "Line Gray A Hole 3 up with White A Hole 6, and Gray A Hole 9 with White A Hole 12. Slide the gray beam onto both blue pins simultaneously until parallel and seated." },
  { number: "8", title: "Position second white beam", instruction: "Place the second white 15-hole beam separately. Use the same hole numbering, counted from its through-blue-pin end." },
  { number: "9", title: "Second end blue pin — Hole 1", instruction: "Insert the blue through-pin into White B Hole 1, leaving it visible on both sides." },
  { number: "10", title: "Second unit — Blue Hole 6", instruction: "Install a blue pin at White B Hole 6 to receive Gray B Hole 3." },
  { number: "11", title: "Second unit — Blue Hole 12", instruction: "Install the second gray mounting pin at White B Hole 12 to receive Gray B Hole 9." },
  { number: "12", title: "Second unit — Black Hole 3", instruction: "Insert the black pin into White B Hole 3, never Hole 2." },
  { number: "13", title: "Second unit — Black Hole 15", instruction: "Insert the final outer black pin at White B Hole 15, pointing toward the future black 3-hole bridge." },
  { number: "14", title: "Seat second gray 9-hole beam", instruction: "Mount Gray B: its Hole 3 meets White B Hole 6, and its Hole 9 meets White B Hole 12. Both blue tips must protrude on the gray side." },
  { number: "15", title: "Align both completed side assemblies", instruction: "Bring the two identical white-and-gray units beside each other with gray faces upward. Their White Hole 15 ends face the common black bridge; free Hole 1 ends stay apart." },
  { number: "16", title: "Align the black 3-hole bridge", instruction: "Position the short black beam across the two White Hole 15 black pins. The bridge's outer holes 1 and 3 receive those pins; its center hole 2 stays free." },
  { number: "17", title: "Seat the bridge into both ends", instruction: "Press the short black 3-hole beam along the two black pin axes so Bridge Hole 1 joins White A Hole 15 and Bridge Hole 3 joins White B Hole 15." },
  { number: "18", title: "Prepare the brown spacer", instruction: "Insert the remaining black pin into the brown cylindrical spacer, leaving the exposed end ready for the center bridge hole." },
  { number: "19", title: "Install the middle spacer", instruction: "Bring the prepared brown spacer above the black bridge and insert its exposed black pin into Bridge Hole 2, in the middle between the white beams." },
  { number: "20", title: "Inspect the finished Step 10", instruction: "Confirm the two matching white/gray assemblies, six blue and four outer black pins, the 3-hole black bridge at both Hole 15 ends, and the upright brown spacer in the center." },
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
  return issues;
}
const startY = (unit: "A" | "B") => unit === "A" ? -4 : 4;
const finalY = (unit: "A" | "B") => unit === "A" ? -1 : 1;
const activeY = (unit: "A" | "B", phase: number) => phase >= 15 ? finalY(unit) : startY(unit);
const bluePhases = { BLUE_A_1: 2, BLUE_A_6: 3, BLUE_A_12: 4,
  BLUE_B_1: 9, BLUE_B_6: 10, BLUE_B_12: 11 } as const;
const blackPhases = { BLACK_A_3: 5, BLACK_A_15: 6, BLACK_B_3: 12, BLACK_B_15: 13 } as const;
const loose = (unit: "A" | "B", x: number, index: number): Vec3 =>
  [x, unit === "A" ? -9 : 9, 0.9 + index * 0.02];

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
      grayReady ? pose([0, y, 1.12])
      : pose([0, unit === "A" ? -6.9 : 6.9, 0]);
    for (const [hole, index] of ([1, 6, 12] as const).map((h, i) => [h, i] as const)) {
      const id = ("BLUE_" + unit + "_" + hole) as keyof typeof bluePhases;
      const mounted = phase >= bluePhases[id];
      result[id] = mounted
        ? pose([whiteHoleX(hole), y, hole === 1 ? 0 : 1.03])
        : pose(loose(unit, whiteHoleX(hole), index));
    }
    for (const [hole, index] of ([3, 15] as const).map((h, i) => [h, i] as const)) {
      const id = ("BLACK_" + unit + "_" + hole) as keyof typeof blackPhases;
      result[id] = phase >= blackPhases[id]
        ? pose([whiteHoleX(hole), y, hole === 3 ? 0.68 : -0.66])
        : pose(loose(unit, whiteHoleX(hole), 3 + index));
    }
  }
  // The short black beam is perpendicular to the white rails: 3 holes along Y.
  result.BRIDGE_3 = phase >= 17 ? pose([7, 0, -1.08], [0, 0, Math.PI / 2])
    : phase === 16 ? pose([7, 0, -3.4], [0, 0, Math.PI / 2])
    : pose([9.5, -4.5, -0.3], [0, 0, Math.PI / 2]);
  // Spacer + center pin move as a prepared unit in the final installation.
  result.BROWN_SPACER = phase >= 19 ? pose([7, 0, -0.12]) : pose([9.7, 5.4, 1.1]);
  result.CENTER_BLACK = phase >= 19 ? pose([7, 0, -0.40])
    : phase >= 18 ? pose([9.7, 5.4, 0.77])
    : pose([10.8, 7.6, 0.9]);
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
  return { unit: isA ? "A" : "B", holes: hole ? [hole] : [6, 12], face: phase === 6 || phase === 13 ? -1 : 1 };
}
