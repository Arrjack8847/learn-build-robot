/**
 * Step 7 custom photo-based frame. All coordinates are in one 8 mm hole pitch.
 * The genuine source STLs remain unchanged. A mathematically coaxial teaching
 * layout is NOT proof that the unprovided photos or physical press-fit match.
 */
export type V3 = [number, number, number];
export type StepSevenPose = { position: V3; rotation: V3 };
export type StepSevenPart =
  | "FIVE_A" | "FIVE_B" | "SEVEN_A" | "SEVEN_B" | "FIFTEEN"
  | "BLUE_1" | "BLUE_2" | "BLUE_3" | "BLUE_4"
  | "BLACK_1" | "BLACK_2";
export const STEP_SEVEN_PARTS: readonly StepSevenPart[] = [
  "FIVE_A","FIVE_B","SEVEN_A","SEVEN_B","FIFTEEN",
  "BLUE_1","BLUE_2","BLUE_3","BLUE_4","BLACK_1","BLACK_2",
] as const;
export const STEP_SEVEN_PITCH_MM = 8;
export const STEP_SEVEN_THICKNESS_MM = 7.8;
/** Demonstration clearance only; the actual collar must be physically measured. */
export const STEP_SEVEN_UNVERIFIED_CLEARANCE_MM = 1.5;
export const STEP_SEVEN_LEVEL =
  (STEP_SEVEN_THICKNESS_MM + STEP_SEVEN_UNVERIFIED_CLEARANCE_MM) / STEP_SEVEN_PITCH_MM;
export type StepSevenConfig = {
  /** First receiving hole in each 7-hole beam; second is four holes later. */
  sevenNearHole: 1 | 2 | 3;
  /** First black pin hole on the 15-hole beam; second is four holes later. */
  fifteenNearHole: number;
};
export const STEP_SEVEN_DEMO_CONFIG: StepSevenConfig = {
  sevenNearHole: 2,
  fifteenNearHole: 6,
};
export const STEP_SEVEN_MECHANICALLY_VERIFIED = false;

export function stepSevenConfigurationErrors(config: StepSevenConfig): string[] {
  const issues: string[] = [];
  if (![1,2,3].includes(config.sevenNearHole))
    issues.push("The 7-hole beam receiving holes must be 1/5, 2/6 or 3/7.");
  if (!Number.isInteger(config.fifteenNearHole) ||
      config.fifteenNearHole < 1 || config.fifteenNearHole > 11)
    issues.push("The 15-hole beam mounting pair must be within holes 1–15.");
  return issues;
}
export function fiveHoleAnchor(beam: "A" | "B", hole: number): V3 {
  if (hole < 1 || hole > 5 || !Number.isInteger(hole)) throw Error("Invalid 5-hole index");
  return [hole - 3, beam === "A" ? -2 : 2, STEP_SEVEN_LEVEL];
}
export function sevenHoleAnchor(rail: "A" | "B", hole: number, config: StepSevenConfig): V3 {
  if (hole < 1 || hole > 7 || !Number.isInteger(hole)) throw Error("Invalid 7-hole index");
  return [rail === "A" ? -1 : 1, hole - 4 + 2 - config.sevenNearHole, 0];
}
export function fifteenHoleAnchor(hole: number, config: StepSevenConfig): V3 {
  if (hole < 1 || hole > 15 || !Number.isInteger(hole)) throw Error("Invalid 15-hole index");
  return [0, hole - 8 + 6 - config.fifteenNearHole, 0];
}
export function stepSevenMating(config: StepSevenConfig) {
  const errors = stepSevenConfigurationErrors(config);
  if (errors.length) throw Error(errors.join(" "));
  const blue = [
    { beam:"A" as const, hole5:2, rail:"A" as const, hole7:config.sevenNearHole },
    { beam:"A" as const, hole5:4, rail:"B" as const, hole7:config.sevenNearHole },
    { beam:"B" as const, hole5:2, rail:"A" as const, hole7:config.sevenNearHole+4 },
    { beam:"B" as const, hole5:4, rail:"B" as const, hole7:config.sevenNearHole+4 },
  ];
  const black = [
    { beam15Hole:config.fifteenNearHole, beam5:"A" as const, receiverHole:3 },
    { beam15Hole:config.fifteenNearHole+4, beam5:"B" as const, receiverHole:3 },
  ];
  return {blue,black, mechanicallyVerified:false};
}
const xyz = (x:number,y:number,z:number,rotation:V3=[0,0,0]):StepSevenPose =>
  ({position:[x,y,z],rotation});
const blueLoose:V3[] = [
  [-3.5,-8,1.3],[-2.3,-8,1.3],[2.3,8,1.3],[3.5,8,1.3],
];
const phasesBlue = [1,2,3,4];
/** Deterministic full poses: backward/replay never duplicate any components. */
export function stepSevenPoses(phase:number,config:StepSevenConfig):Record<StepSevenPart,StepSevenPose> {
  if (stepSevenConfigurationErrors(config).length)
    throw Error(stepSevenConfigurationErrors(config).join(" "));
  const movedFrame = phase >= 5;
  const frameA = movedFrame ? -2 : -7.3;
  const frameB = movedFrame ? 2 : 7.3;
  const longAtFrame = phase >= 10;
  const longAligned = phase >= 9;
  const longX = longAligned ? 0 : 6.4;
  const longZ = longAtFrame ? 0 : longAligned ? -3.2 : 0;
  const beam15Y = 6 - config.fifteenNearHole;
  const poses = {
    FIVE_A: xyz(0,frameA,STEP_SEVEN_LEVEL),
    FIVE_B: xyz(0,frameB,STEP_SEVEN_LEVEL),
    SEVEN_A: xyz(phase>=5?-1:-4.5,phase>=5?2-config.sevenNearHole:0,0,[0,0,Math.PI/2]),
    SEVEN_B: xyz(phase>=6?1:4.5,phase>=6?2-config.sevenNearHole:0,0,[0,0,Math.PI/2]),
    FIFTEEN: xyz(longX,longAligned?beam15Y:0,longZ,[0,0,Math.PI/2]),
    BLUE_1: xyz(0,0,0),
    BLUE_2: xyz(0,0,0),
    BLUE_3: xyz(0,0,0),
    BLUE_4: xyz(0,0,0),
    BLACK_1: xyz(0,0,0),
    BLACK_2: xyz(0,0,0),
  } satisfies Record<StepSevenPart,StepSevenPose>;
  phasesBlue.forEach((activation,i) => {
    const beam=i<2?"A":"B";
    const hole=i%2===0?2:4;
    const beamY=beam==="A"?frameA:frameB;
    const seated = phase>=activation;
    const p=seated ? [hole-3,beamY,STEP_SEVEN_LEVEL/2] as V3 : blueLoose[i]!;
    poses[("BLUE_"+(i+1)) as "BLUE_1"|"BLUE_2"|"BLUE_3"|"BLUE_4"] =
      xyz(p[0],p[1],p[2]);
  });
  const blackY1 = -2;
  const blackY2 = 2;
  const firstY = longAligned ? blackY1 : blackY1;
  const secondY = longAligned ? blackY2 : blackY2;
  poses.BLACK_1=phase>=7
    ? xyz(longX,firstY,longZ+STEP_SEVEN_LEVEL/2)
    : xyz(5.6,-5.4,1.3);
  poses.BLACK_2=phase>=8
    ? xyz(longX,secondY,longZ+STEP_SEVEN_LEVEL/2)
    : xyz(7.2,-5.4,1.3);
  return poses;
}
/** Shared centerline anchors, not a claim of verified plastic-to-plastic fit. */
export function stepSevenGuide(phase:number,config:StepSevenConfig):V3|null {
  const blueIndex=phase-1;
  if(blueIndex>=0&&blueIndex<4) {
    const item=stepSevenMating(config).blue[blueIndex]!;
    return fiveHoleAnchor(item.beam,item.hole5);
  }
  if(phase===5||phase===6)return [phase===5?-1:1,0,STEP_SEVEN_LEVEL/2];
  if(phase===7||phase===8) return fifteenHoleAnchor(
    config.fifteenNearHole+(phase===8?4:0),config);
  if(phase===9||phase===10)return [0,0,STEP_SEVEN_LEVEL/2];
  return null;
}
export const STEP_SEVEN_SEQUENCE = [
  {number:"7.1",title:"Prepare all 11 parts",instruction:"Lay out the two 5-hole beams, two 7-hole beams, four blue pins, one 15-hole beam and two black pins."},
  {number:"7.2",title:"First blue connector",instruction:"Insert a blue connector into Hole 2 of the first 5-hole beam."},
  {number:"7.2",title:"Second blue connector",instruction:"Insert another blue connector into Hole 4, facing the same direction."},
  {number:"7.3",title:"Third blue connector",instruction:"Insert a blue connector into Hole 2 of the second 5-hole beam."},
  {number:"7.3",title:"Fourth blue connector",instruction:"Insert the final blue connector into Hole 4 of the second beam."},
  {number:"7.4",title:"Connect the first 7-hole beam",instruction:"Line up the two exposed blue pins with the first 7-hole beam's highlighted receiving holes and seat the beam underneath."},
  {number:"7.5",title:"Close the rectangular frame",instruction:"Attach the second 7-hole beam to the remaining two pins and inspect all four joints."},
  {number:"7.6",title:"Fit the first black connector",instruction:"Insert the first black connector into the selected hole of the separate 15-hole beam."},
  {number:"7.6",title:"Fit the second black connector",instruction:"Install the second black connector four holes away; confirm the exact pair with the real photograph."},
  {number:"7.7",title:"Align the center beam",instruction:"Move the prepared 15-hole beam lengthwise beneath the frame, aligning its two black pins with the center holes of both 5-hole beams."},
  {number:"7.7",title:"Seat both black locks",instruction:"Move the long beam along the two pin axes until both connections seat at the frame's 5-hole beams."},
  {number:"7.7",title:"Inspect the assembled frame",instruction:"Orbit around the connected 11-part demonstration. The exact connector fit still requires comparison with the original photos and physical parts."},
] as const;
