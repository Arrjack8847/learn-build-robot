/**
 * Photo-based frame tutorial; independent of the official 31 numbered steps.
 * Source STL coordinates are millimetres. The straight-beam models are aligned
 * along native +X; their round-hole centres are x = 0, 8, ... (n-1)*8 mm.
 * Scene coordinates use one 8 mm hole pitch per unit.
 *
 * The proposed 7-hole mounting pattern (1, 5) is PHOTO-INFERRED, not verified.
 * The official Step 9 says (2, 5). Neither is silently substituted for the other.
 * Connector collar clearance and the separate 15-hole pin locations are
 * provisional until a physical side-view/part-number check is available.
 */
export type Pt3 = [number, number, number];
export type Pose = { position: Pt3; rotation: Pt3 };
export const PART_IDS = [
  "FRAME_BEAM_7_A", "FRAME_BEAM_7_B",
  "FRAME_BEAM_5_A", "FRAME_BEAM_5_B",
  "FRAME_LONG_PIN_01", "FRAME_LONG_PIN_02",
  "FRAME_LONG_PIN_03", "FRAME_LONG_PIN_04",
  "FRAME_BEAM_15", "FRAME_BLACK_PIN_01", "FRAME_BLACK_PIN_02",
] as const;
export type FramePartId = (typeof PART_IDS)[number];

export type FrameConfig = {
  /** zero-based photo candidate, 0 = Hole 1; 1 = official Step 9 Hole 2 */
  firstMount: 0 | 1;
  /** zero-based, separate beam, photo position is unverified */
  beam15Holes: [number, number];
  longConnector: "long" | "pinLong";
};
export const DEFAULT_FRAME_CONFIG: FrameConfig = {
  firstMount: 0, beam15Holes: [4, 7], longConnector: "long",
};
export const PITCH_MM = 8;
export const BEAM_THICKNESS_MM = 7.8;
export const LONG_PIN_LENGTH_MM = 24;
export const SHORT_PIN_LENGTH_MM = 16;
/** Placeholder collar width: to be checked on actual long connector and kit. */
export const PROVISIONAL_COLLAR_GAP_MM = 1.5;
export const BEAM_LEVEL_Z = (BEAM_THICKNESS_MM + PROVISIONAL_COLLAR_GAP_MM) / PITCH_MM;
export const LONG_PIN_CENTRE_Z = BEAM_LEVEL_Z / 2;
export const BLACK_PIN_CENTRE_Z = (BEAM_THICKNESS_MM / 2 + PROVISIONAL_COLLAR_GAP_MM / 2) / PITCH_MM;

/** Left/right hole anchor on each 7-hole rail, measured from first mounting hole. */
export function railHole(side: "A" | "B", index: number, config: FrameConfig): Pt3 {
  return [side === "A" ? -2 : 2, index - config.firstMount, 0];
}
/** A 5-hole crossbeam spans four 8 mm pitches: exactly the rail separation. */
export function crossbeamHole(side: "A" | "B", row: 0 | 1, config: FrameConfig): Pt3 {
  return [side === "A" ? -2 : 2, row === 0 ? 0 : 4 - config.firstMount, BEAM_LEVEL_Z];
}
export function longPinAnchor(side: "A" | "B", row: 0 | 1, config: FrameConfig): Pt3 {
  const hole = railHole(side, row === 0 ? config.firstMount : 4, config);
  return [hole[0], hole[1], LONG_PIN_CENTRE_Z];
}
export function beam15Hole(index: number): Pt3 {
  // Separate 15-hole beam has its native +X axis turned toward world +Y.
  return [7.5, 1.5 + index - 7, BLACK_PIN_CENTRE_Z];
}
const pose = (position: Pt3, rz = 0): Pose => ({ position, rotation: [0, 0, rz] });
const railZ = Math.PI / 2;
const loosePins: Pt3[] = [
  [-5.2, -5.7, 1.4], [-3.5, -5.7, 1.4],
  [3.5, -5.7, 1.4], [5.2, -5.7, 1.4],
];

export function framePoses(phase: number, config: FrameConfig, exploded = false): Record<FramePartId, Pose> {
  const first = config.firstMount;
  const base: Record<FramePartId, Pose> = {
    FRAME_BEAM_7_A: pose(phase >= 1 ? [-2, 3 - first, 0] : [-5.3, 0, 0], railZ),
    FRAME_BEAM_7_B: pose(phase >= 3 ? [2, 3 - first, 0] : [4.6, 0, 0], railZ),
    FRAME_BEAM_5_A: pose(phase >= 5 ? [0, 0, BEAM_LEVEL_Z] : [-2.5, -7, BEAM_LEVEL_Z]),
    FRAME_BEAM_5_B: pose(phase >= 7 ? [0, 4 - first, BEAM_LEVEL_Z] : [2.5, -7, BEAM_LEVEL_Z]),
    FRAME_LONG_PIN_01: pose(phase >= 1 ? longPinAnchor("A", 0, config) : loosePins[0]!),
    FRAME_LONG_PIN_02: pose(phase >= 2 ? longPinAnchor("A", 1, config) : loosePins[1]!),
    FRAME_LONG_PIN_03: pose(phase >= 3 ? longPinAnchor("B", 0, config) : loosePins[2]!),
    FRAME_LONG_PIN_04: pose(phase >= 4 ? longPinAnchor("B", 1, config) : loosePins[3]!),
    FRAME_BEAM_15: pose([7.5, 1.5, 0], railZ),
    FRAME_BLACK_PIN_01: pose(phase >= 8 ? beam15Hole(config.beam15Holes[0]) : [6.6, -7.5, 1.3]),
    FRAME_BLACK_PIN_02: pose(phase >= 9 ? beam15Hole(config.beam15Holes[1]) : [8.5, -7.5, 1.3]),
  };
  if (!exploded) return base;
  // Exploded offsets only. Component scale and STL geometry never change.
  const offsets: Partial<Record<FramePartId, Pt3>> = {
    FRAME_BEAM_7_A: [-0.8, 0, -0.5],
    FRAME_BEAM_7_B: [0.8, 0, -0.5],
    FRAME_BEAM_5_A: [0, -0.8, 1.1],
    FRAME_BEAM_5_B: [0, 0.8, 1.1],
    FRAME_LONG_PIN_01: [-0.8, 0, 0.4],
    FRAME_LONG_PIN_02: [-0.8, 0, 0.4],
    FRAME_LONG_PIN_03: [0.8, 0, 0.4],
    FRAME_LONG_PIN_04: [0.8, 0, 0.4],
    FRAME_BEAM_15: [0.9, 0, -0.4],
    FRAME_BLACK_PIN_01: [0.9, 0, 1.2],
    FRAME_BLACK_PIN_02: [0.9, 0, 1.2],
  };
  for (const id of PART_IDS) {
    const d = offsets[id];
    if (d) {
      const p = base[id].position;
      base[id] = pose([p[0] + d[0], p[1] + d[1], p[2] + d[2]], base[id].rotation[2]);
    }
  }
  return base;
}

export const INSERTING_PART: Readonly<Record<number, FramePartId | undefined>> = {
  1: "FRAME_LONG_PIN_01", 2: "FRAME_LONG_PIN_02",
  3: "FRAME_LONG_PIN_03", 4: "FRAME_LONG_PIN_04",
  5: "FRAME_BEAM_5_A", 7: "FRAME_BEAM_5_B",
  8: "FRAME_BLACK_PIN_01", 9: "FRAME_BLACK_PIN_02",
};
export const PHASE_DURATION: Readonly<Record<number, number>> = {
  0: 0, 1: 1.2, 2: 1.2, 3: 1.5, 4: 1.2,
  5: 2, 6: 0.7, 7: 1.8, 8: 1.2, 9: 1.2, 10: 1.1,
};
/** Camera interest follows holes, never legacy preview teaching coordinates. */
export function frameFocus(phase: number, config: FrameConfig): Pt3 {
  if (phase === 1) return longPinAnchor("A", 0, config);
  if (phase === 2) return longPinAnchor("A", 1, config);
  if (phase === 3) return longPinAnchor("B", 0, config);
  if (phase === 4) return longPinAnchor("B", 1, config);
  if (phase === 5 || phase === 6) return [0, 1.5, BEAM_LEVEL_Z / 2];
  if (phase === 7) return [0, 4 - config.firstMount, BEAM_LEVEL_Z / 2];
  if (phase === 8) return beam15Hole(config.beam15Holes[0]);
  if (phase === 9) return beam15Hole(config.beam15Holes[1]);
  return [3, 1.5, 0];
}
export const VERIFICATION = {
  meshPitch: "8 mm, inferred from repository straight-beam STL pattern and existing calibrated modules",
  holes7Photo: "1 and 5: candidate only; reference photos need orthographic hole count",
  holes7Manual: "Official Step 9 states 2 and 5; manual unchanged",
  crossbeamHoles: "5-hole crossbeam endpoints 1 and 5 geometrically span four pitches",
  longPin: "24 mm mesh axis +Z; seating depth/collar clearance not physically verified",
  beam15: "5 and 8 are selectable manual candidates, NOT verified photo locations",
  blackPin: "pin_pin.stl 16 mm candidate; actual black connector model remains unverified",
  mechanicallyVerified: false,
} as const;
