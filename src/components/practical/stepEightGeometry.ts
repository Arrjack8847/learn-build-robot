/**
 * Step 8 custom photo-based frame. All coordinates are in one 8 mm hole pitch.
 * The genuine source STLs remain unchanged. A mathematically coaxial teaching
 * layout is NOT proof that the unprovided photos or physical press-fit match.
 */
export type V3 = [number, number, number];
export type StepEightPose = { position: V3; rotation: V3 };
export type StepEightPart =
  | "FIVE_A" | "FIVE_B" | "SEVEN_A" | "SEVEN_B" | "FIFTEEN"
  | "BLUE_1" | "BLUE_2" | "BLUE_3" | "BLUE_4"
  | "BLACK_1" | "BLACK_2";
export const STEP_EIGHT_PARTS: readonly StepEightPart[] = [
  "FIVE_A","FIVE_B","SEVEN_A","SEVEN_B","FIFTEEN",
  "BLUE_1","BLUE_2","BLUE_3","BLUE_4","BLACK_1","BLACK_2",
] as const;
export const STEP_EIGHT_PITCH_MM = 8;
export const STEP_EIGHT_THICKNESS_MM = 7.8;
/** Demonstration clearance only; the actual collar must be physically measured. */
export const STEP_EIGHT_UNVERIFIED_CLEARANCE_MM = 1.5;
export const STEP_EIGHT_LEVEL =
  (STEP_EIGHT_THICKNESS_MM + STEP_EIGHT_UNVERIFIED_CLEARANCE_MM) / STEP_EIGHT_PITCH_MM;
/**
 * 24 mm is the original blue connector STL's Z extent. Its lowest point
 * seats flush with (a hair above) the BOTTOM of a 5-hole beam. The exposed
 * portion stays ABOVE the beam, as in the photographed assembly.
 * This deliberately changes blue-pin seating; receiving hole indices do not change.
 */
export const STEP_EIGHT_BLUE_CONNECTOR_LENGTH_MM = 24;
export const STEP_EIGHT_BLUE_PIN_SEATED_Z =
  STEP_EIGHT_LEVEL - STEP_EIGHT_THICKNESS_MM/(2*STEP_EIGHT_PITCH_MM) +
  STEP_EIGHT_BLUE_CONNECTOR_LENGTH_MM/(2*STEP_EIGHT_PITCH_MM) + 0.02;
/**
 * The 7-hole rails descend ONTO the four exposed blue pin ends.
 * Their lower faces meet the upper faces of the 5-hole beams; the pins do
 * not need to protrude from the underside of any 5-hole beam.
 */
export const STEP_EIGHT_SEVEN_RAIL_SEATED_Z =
  STEP_EIGHT_LEVEL + STEP_EIGHT_THICKNESS_MM/STEP_EIGHT_PITCH_MM;
export const STEP_EIGHT_SEVEN_RAIL_PREPARATION_Z =
  STEP_EIGHT_SEVEN_RAIL_SEATED_Z + 2.7;
/**
 * The 15-hole white beam lies on the SAME upper face of the two grey
 * 5-hole beams as the two outer 7-hole white rails. All three white beams
 * seat downward and share the same upper-rail height.
 */
export const STEP_EIGHT_FIFTEEN_BEAM_SEATED_Z =
  STEP_EIGHT_SEVEN_RAIL_SEATED_Z;
/**
 * The 16 mm black-pin STL is centered on the mating interface between
 * the central white beam ABOVE and the two grey beams BELOW.
 * Its local offset is negative, so it engages from the underside of
 * the upper white beam rather than penetrating below the grey beams.
 */
export const STEP_EIGHT_BLACK_PIN_INTERFACE_OFFSET_Z =
  -STEP_EIGHT_THICKNESS_MM/(2*STEP_EIGHT_PITCH_MM);
/** Above-frame registration before the final top-down locking stroke. */
export const STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z =
  STEP_EIGHT_FIFTEEN_BEAM_SEATED_Z + 2.2;
export type StepEightConfig = {
  /** First receiving hole in each 7-hole beam; second is four holes later. */
  sevenNearHole: 1 | 2 | 3;
  /** First black pin hole on the 15-hole beam; second is four holes later. */
  fifteenNearHole: number;
};
export const STEP_EIGHT_DEMO_CONFIG: StepEightConfig = {
  sevenNearHole: 2,
  fifteenNearHole: 7, // Approved photographed configuration: black pins in Holes 7 and 11
};
export const STEP_EIGHT_MECHANICALLY_VERIFIED = false;

export function stepEightConfigurationErrors(config: StepEightConfig): string[] {
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
  return [hole - 3, beam === "A" ? -2 : 2, STEP_EIGHT_LEVEL];
}
export function sevenHoleAnchor(rail: "A" | "B", hole: number, config: StepEightConfig): V3 {
  if (hole < 1 || hole > 7 || !Number.isInteger(hole)) throw Error("Invalid 7-hole index");
  return [rail === "A" ? -1 : 1, hole - 4 + 2 - config.sevenNearHole,
    STEP_EIGHT_SEVEN_RAIL_SEATED_Z];
}
export function fifteenHoleAnchor(hole: number, config: StepEightConfig): V3 {
  if (hole < 1 || hole > 15 || !Number.isInteger(hole)) throw Error("Invalid 15-hole index");
  return [0, hole - 8 + 6 - config.fifteenNearHole, 0];
}
export function stepEightMating(config: StepEightConfig) {
  const errors = stepEightConfigurationErrors(config);
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
const xyz = (x:number,y:number,z:number,rotation:V3=[0,0,0]):StepEightPose =>
  ({position:[x,y,z],rotation});
/**
 * Preparation-only layout: each genuine STL has a separate footprint when
 * presented from the near-overhead camera. All approved hole indices remain
 * unchanged; the two 7-hole rails now start above and seat from above.
 */
export const STEP_EIGHT_PREPARATION_LAYOUT: Readonly<Record<StepEightPart,V3>> = {
  FIVE_A: [0,-8.3,STEP_EIGHT_LEVEL],
  FIVE_B: [0,8.3,STEP_EIGHT_LEVEL],
  // All four blue pins start ABOVE the beams. The guided path inserts them
  // downward; the installed part stays opaque and clear of the bottom face.
  BLUE_1: [-5.7,-10.2,5.7],
  BLUE_2: [-5.7,-6.5,5.7],
  BLUE_3: [5.7,10.2,5.7],
  BLUE_4: [5.7,6.5,5.7],
  SEVEN_A: [-8.5,0,STEP_EIGHT_SEVEN_RAIL_PREPARATION_Z],
  SEVEN_B: [4,0,STEP_EIGHT_SEVEN_RAIL_PREPARATION_Z],
  // Keep the long center rail above the grey frame throughout preparation
  // and alignment; it must never travel up THROUGH the already-built frame.
  FIFTEEN: [9,0,STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z],
  BLACK_1: [6.5,-10.6,1.3],
  BLACK_2: [10.7,-10.6,1.3],
};
const blueLoose:readonly V3[] = [
  STEP_EIGHT_PREPARATION_LAYOUT.BLUE_1,
  STEP_EIGHT_PREPARATION_LAYOUT.BLUE_2,
  STEP_EIGHT_PREPARATION_LAYOUT.BLUE_3,
  STEP_EIGHT_PREPARATION_LAYOUT.BLUE_4,
];
const phasesBlue = [1,2,3,4];
/** Deterministic full poses: backward/replay never duplicate any components. */
export function stepEightPoses(phase:number,config:StepEightConfig):Record<StepEightPart,StepEightPose> {
  if (stepEightConfigurationErrors(config).length)
    throw Error(stepEightConfigurationErrors(config).join(" "));
  const movedFrame = phase >= 5;
  const frameA = movedFrame ? -2 : STEP_EIGHT_PREPARATION_LAYOUT.FIVE_A[1];
  const frameB = movedFrame ? 2 : STEP_EIGHT_PREPARATION_LAYOUT.FIVE_B[1];
  const longAtFrame = phase >= 10;
  const longAligned = phase >= 9;
  const longX = longAligned ? 0 : STEP_EIGHT_PREPARATION_LAYOUT.FIFTEEN[0];
  const longZ = longAtFrame ? STEP_EIGHT_FIFTEEN_BEAM_SEATED_Z
    : STEP_EIGHT_FIFTEEN_BEAM_ALIGNMENT_Z;
  const beam15Y = 6 - config.fifteenNearHole;
  const poses = {
    FIVE_A: xyz(0,frameA,STEP_EIGHT_LEVEL),
    FIVE_B: xyz(0,frameB,STEP_EIGHT_LEVEL),
    SEVEN_A: xyz(phase>=5?-1:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_A[0],
      phase>=5?2-config.sevenNearHole:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_A[1],
      phase>=5?STEP_EIGHT_SEVEN_RAIL_SEATED_Z:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_A[2],
      [0,0,Math.PI/2]),
    SEVEN_B: xyz(phase>=6?1:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_B[0],
      phase>=6?2-config.sevenNearHole:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_B[1],
      phase>=6?STEP_EIGHT_SEVEN_RAIL_SEATED_Z:STEP_EIGHT_PREPARATION_LAYOUT.SEVEN_B[2],
      [0,0,Math.PI/2]),
    FIFTEEN: xyz(longX,longAligned?beam15Y:0,longZ,[0,0,Math.PI/2]),
    BLUE_1: xyz(0,0,0),
    BLUE_2: xyz(0,0,0),
    BLUE_3: xyz(0,0,0),
    BLUE_4: xyz(0,0,0),
    BLACK_1: xyz(0,0,0),
    BLACK_2: xyz(0,0,0),
  } satisfies Record<StepEightPart,StepEightPose>;
  // Preserve all four REAL blue connector STL poses in every action.
  // Once seated, their centers continue travelling rigidly with their
  // corresponding 5-hole beam, rather than hiding or changing scale.
  // The blue tip remains exposed on TOP; no blue STL geometry pokes out
  // through the bottom of the 5-hole beam.
  phasesBlue.forEach((activation,i) => {
    const beam=i<2?"A":"B";
    const hole=i%2===0?2:4;
    const beamY=beam==="A"?frameA:frameB;
    const seated = phase>=activation;
    const p=seated ? [hole-3,beamY,STEP_EIGHT_BLUE_PIN_SEATED_Z] as V3 : blueLoose[i]!;
    poses[("BLUE_"+(i+1)) as "BLUE_1"|"BLUE_2"|"BLUE_3"|"BLUE_4"] =
      xyz(p[0],p[1],p[2]);
  });
  const firstY = longAligned ? -2 : config.fifteenNearHole - 8;
  const secondY = firstY + 4;
  poses.BLACK_1=phase>=7
    ? xyz(longX,firstY,longZ+STEP_EIGHT_BLACK_PIN_INTERFACE_OFFSET_Z)
    : xyz(...STEP_EIGHT_PREPARATION_LAYOUT.BLACK_1);
  poses.BLACK_2=phase>=8
    ? xyz(longX,secondY,longZ+STEP_EIGHT_BLACK_PIN_INTERFACE_OFFSET_Z)
    : xyz(...STEP_EIGHT_PREPARATION_LAYOUT.BLACK_2);
  return poses;
}
/** Shared centerline anchors, not a claim of verified plastic-to-plastic fit. */
export function stepEightGuide(phase:number,config:StepEightConfig):V3|null {
  const blueIndex=phase-1;
  if(blueIndex>=0&&blueIndex<4) {
    const item=stepEightMating(config).blue[blueIndex]!;
    return fiveHoleAnchor(item.beam,item.hole5);
  }
  if(phase===5||phase===6)return [phase===5?-1:1,0,STEP_EIGHT_SEVEN_RAIL_SEATED_Z];
  if(phase===7||phase===8) return fifteenHoleAnchor(
    config.fifteenNearHole+(phase===8?4:0),config);
  if(phase===9||phase===10)return [0,0,
    STEP_EIGHT_LEVEL+STEP_EIGHT_THICKNESS_MM/(2*STEP_EIGHT_PITCH_MM)];
  return null;
}
export const STEP_EIGHT_SEQUENCE = [
  {number:"8.1",title:"Prepare two matching 5-hole beam groups",instruction:"Group A: one 5-hole beam and two blue connectors. Group B: the other 5-hole beam and two blue connectors. Keep the two 7-hole beams, long beam and black connectors nearby for later."},
  {number:"8.2",title:"Beam A · insert blue connector 1",instruction:"Position blue connector 1 ABOVE Beam A. Align with Hole 2 and push DOWNWARD into the top face. The blue end stays visible above; no shaft protrudes below."},
  {number:"8.2",title:"Beam A · insert blue connector 2",instruction:"Keep connector 1 in Hole 2. Place connector 2 ABOVE Beam A, align with Hole 4 and push DOWNWARD. Both exposed blue ends remain visible."},
  {number:"8.3",title:"Beam B · insert blue connector 3",instruction:"Move to Beam B. From ABOVE, align blue connector 3 with Hole 2 and push DOWNWARD. Do not disturb the two installed connectors in Beam A."},
  {number:"8.3",title:"Beam B · insert blue connector 4",instruction:"Align connector 4 ABOVE Hole 4 of Beam B and push DOWNWARD. Keep all four blue connectors visible from above, with nothing protruding underneath."},
  {number:"8.4",title:"Connect the first 7-hole beam",instruction:"Bring the first white 7-hole beam from ABOVE. Line up its Holes 2 and 6 with the two exposed blue pins, then lower the beam straight DOWNWARD until it seats on the 5-hole beams. Keep both blue tips visible from the top."},
  {number:"8.5",title:"Close the rectangular frame",instruction:"Bring the second white 7-hole beam from ABOVE, align Holes 2 and 6 with the remaining exposed blue pins and lower it straight DOWNWARD. Check that both long rails are parallel, all four connectors remain visible, and nothing sticks out below the 5-hole beams."},
  {number:"8.6",title:"Fit the first black connector",instruction:"Insert the first black connector into the selected hole of the separate 15-hole beam."},
  {number:"8.6",title:"Fit the second black connector",instruction:"Install the second black connector four holes away; confirm the exact pair with the real photograph."},
  {number:"8.7",title:"Align the center beam",instruction:"Position the long 15-hole white beam ABOVE the two grey 5-hole beams, on the SAME TOP SIDE as the pair of 7-hole white beams. Center it between the two outer white rails. Match its black connectors in Holes 7 and 11 to Hole 3 of each grey beam."},
  {number:"8.7",title:"Seat both black locks",instruction:"Lower the long 15-hole white beam DOWNWARD from ABOVE as one rigid group with both installed black connectors. Seat it flush against the TOP faces of both grey 5-hole beams. All three white beams stay on top; nothing disappears or detaches."},
  {number:"8.7",title:"Inspect the assembled frame",instruction:"Orbit around the connected 11-part demonstration. The exact connector fit still requires comparison with the original photos and physical parts."},
] as const;
