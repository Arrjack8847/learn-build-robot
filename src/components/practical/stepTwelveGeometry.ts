/**
 * Step 12: two separately prepared 5-by-3 L beams.
 * The user's photos confirm Hole 4 counted from the long-arm corner.
 * The second L is a physical Y-axis flip, NOT a negative-scale mirror.
 * This maps local +Z to world -Z: the same local pin path becomes
 * a genuinely bottom-to-top insertion on the other face.
 *
 * The bushing is illustrative pending discovery of an exact original STL.
 * Dimensions are 8-mm hole-pitch teaching approximations.
 */
export type V3 = [number, number, number];
export type Pose = { position: V3; rotation: V3 };
export const STEP_TWELVE_ASSEMBLY_ID = "marksman-step12-opposite-face-l-beams-v1";
export const STEP_TWELVE_RESULT_KEY = "robot:marksmanship:step12:mirroredL:v1";
export const STEP_TWELVE_HOLE = 4;
export const STEP_TWELVE_LONG_HOLES = 5;
export const STEP_TWELVE_SHORT_HOLES = 3;
export const STEP_TWELVE_HOLE_CENTER: V3 = [0, -(STEP_TWELVE_HOLE - 1), 0];
export const STEP_TWELVE_PIN_SEATED_Z = 0.52;
export const STEP_TWELVE_BUSHING_SEATED_Z = 0.96;
export const STEP_TWELVE_COMPONENTS = { lBeams: 2, blackPins: 2, bushings: 2 } as const;
export const STEP_TWELVE_FINAL_PHASE = 6;
export const STEP_TWELVE_ACTIONS = [
  { title: "Prepare two matching L-shaped beams", instruction: "Lay out two 5-hole-long by 3-hole-short purple L-beams, two black connectors, and two tan/grey bushings. They form TWO separate assemblies." },
  { title: "Find Hole 4 on both long arms", instruction: "Count 1, 2, 3, 4 from each L corner along its five-hole long arm. Leave the other holes free. The second L faces the opposite direction." },
  { title: "First connector — top to downward", instruction: "Align the first black connector over Hole 4. Insert vertically from the TOP face DOWN into the first L-beam. Keep the upper black tip visible." },
  { title: "Fit the first tan bushing", instruction: "Slide the tan/grey hollow bushing from ABOVE downward over the exposed first black connector until seated on the beam." },
  { title: "Second connector — below to upward", instruction: "On the separately mirrored second L-beam, align at Hole 4 and insert the black connector from BELOW upward, through the OPPOSITE face. Do not flip or fade the pin during its straight approach." },
  { title: "Fit the second tan bushing from below", instruction: "Slide the second tan/grey bushing from BELOW upward over the protruding lower-side black connector until seated against the mirrored beam." },
  { title: "Inspect both opposite-face assemblies", instruction: "Check that both Hole 4 connectors remain visible and retained, with the first bushing above and the second bushing below. The L pieces stay separate for the next construction step." },
] as const;
export type StepTwelvePart = "L_A" | "PIN_A" | "BUSHING_A" | "L_B" | "PIN_B" | "BUSHING_B";
export const STEP_TWELVE_PARTS: readonly StepTwelvePart[] =
  ["L_A", "PIN_A", "BUSHING_A", "L_B", "PIN_B", "BUSHING_B"] as const;
export const STEP_TWELVE_ROOTS = {
  A: { position: [-3.7, 1.4, 0] as V3, rotation: [0, 0, 0] as V3 },
  B: { position: [3.7, 1.4, 0] as V3, rotation: [0, Math.PI, 0] as V3 },
} as const;
export const STEP_TWELVE_ACTIVE: Record<number, StepTwelvePart | null> = {
  0: null, 1: null, 2: "PIN_A", 3: "BUSHING_A",
  4: "PIN_B", 5: "BUSHING_B", 6: null,
};
const pose = (position: V3): Pose => ({ position, rotation: [0, 0, 0] });
export function stepTwelvePoses(phase: number): Record<StepTwelvePart, Pose> {
  if (!Number.isInteger(phase) || phase < 0 || phase > STEP_TWELVE_FINAL_PHASE)
    throw Error("Invalid Step 12 phase");
  const [x, y] = STEP_TWELVE_HOLE_CENTER;
  return {
    L_A: pose([0, 0, 0]),
    PIN_A: pose(phase >= 2 ? [x, y, STEP_TWELVE_PIN_SEATED_Z] : [x + 1.6, y, 3.15]),
    BUSHING_A: pose(phase >= 3 ? [x, y, STEP_TWELVE_BUSHING_SEATED_Z] : [x + 2.4, y, 3.60]),
    L_B: pose([0, 0, 0]),
    PIN_B: pose(phase >= 4 ? [x, y, STEP_TWELVE_PIN_SEATED_Z] : [x + 1.6, y, 3.15]),
    BUSHING_B: pose(phase >= 5 ? [x, y, STEP_TWELVE_BUSHING_SEATED_Z] : [x + 2.4, y, 3.60]),
  };
}
export function stepTwelveValidate(): string[] {
  const warnings: string[] = [];
  if (STEP_TWELVE_HOLE !== 4 || STEP_TWELVE_HOLE_CENTER[1] !== -3)
    warnings.push("Incorrect Hole 4 position");
  if (STEP_TWELVE_ROOTS.A.rotation[1] !== 0 ||
      STEP_TWELVE_ROOTS.B.rotation[1] !== Math.PI)
    warnings.push("Second L must flip across Y for opposite-side insertion");
  const finish = stepTwelvePoses(STEP_TWELVE_FINAL_PHASE);
  for (const part of ["PIN_A", "PIN_B", "BUSHING_A", "BUSHING_B"] as const) {
    if (finish[part].position[0] !== STEP_TWELVE_HOLE_CENTER[0] ||
        finish[part].position[1] !== STEP_TWELVE_HOLE_CENTER[1])
      warnings.push(part + " is not coaxial with Hole 4");
  }
  return warnings;
}
