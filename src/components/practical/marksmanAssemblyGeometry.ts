/**
 * Geometry-derived anchors for the Step 1–2 motor assembly.
 *
 * STL coordinates are in millimetres. The disc and beam centre/openings below
 * were inspected by slicing the actual STL meshes; do not edit to "look right".
 *
 * The motor GLB has metres as units. Its FRONT axle hub is part 10095.dat;
 * part 10091.dat is the REAR cable retainer and must never anchor an axle.
 * The front hub datum is inferred from LDraw nodes, not physically verified.
 * Likewise the reference
 * photograph does not provide a calibrated measurement of axle insertion
 * depth, disc offset, or gold connector identity.
 */
export type Pt3 = readonly [number, number, number];
export type PartName = "motor" | "axle" | "disc" | "beam" | "pin";
export const MM_TO_SCENE = 0.05;
export const METERS_TO_SCENE = 1000 * MM_TO_SCENE;

export const STL_MEASUREMENTS_MM = {
  axle: { length: 24, lengthAxis: "+X" },
  disc: {
    outerDiameter: 23.846, thickness: 4, throughAxis: "+Z",
    centerAxleHole: [0, 0, 0] as Pt3,
    // Actual section at z=2 mm: six outer holes on an 8 mm radius.
    outerHoleCentres: [
      [0, 8, 0], [-6.928, 4, 0], [-6.928, -4, 0],
      [0, -8, 0], [6.928, -4, 0], [6.928, 4, 0],
    ] as Pt3[],
  },
  beam: {
    length: 39.3, holePitch: 8, throughAxis: "+Z",
    // Geometry is centered at raw-model bounds centre (16,3.65,3.9).
    holeCentresAfterCenter: [
      [-16, 0, 0], [-8, 0, 0], [0, 0, 0], [8, 0, 0], [16, 0, 0],
    ] as Pt3[],
    thickness: 7.8,
  },
  pinPin: { length: 16, throughAxis: "+Z", stopCollarAtMidpoint: true, stopCollarThickness: 1.4934 },
} as const;

// These axial placements are explicitly provisional; do not label as verified.
export const UNVERIFIED_AXIAL_MM = {
  axleInsertedInsideMotor: 8,
  discRearFaceGapFromMotor: 8,
  stopCollarGap: 1.5, // measured flange approx. z=7.2533..8.7467 mm in pin_pin.stl
} as const;

/**
 * Candidate FRONT axle-hole entry in imported GLB scene metres.
 * GLTFLoader: 10095dat is the output axle hub, at (-.0076,.0158,.06494).
 * The 10091dat rear CABLE RETAINER is at (-.0076,.0158,.01134).
 * Their measured separation is 53.6 mm in GLB units and the REAL front
 * output points native +Z, AWAY from the cable retainer.
 * Actual insertion depth remains provisional.
 */
export const MOTOR_GLB_SOCKET_CANDIDATE_METERS: Pt3 = [-0.0076, 0.0158, 0.06494];
export const MOTOR_NATIVE_OUTPUT_AXIS: Pt3 = [0, 0, 1];
// Blender reference: the front X-shaped hub now faces right in world space.
// Internal assembly poses retain socket-local -Z and rotate together in the viewer.
export const MOTOR_SCENE_OUTPUT_AXIS: Pt3 = [1, 0, 0];

const unit = (mm: number) => mm * MM_TO_SCENE;
export const FRAME = {
  motorSocket: [0, 0, 0] as Pt3,
  axle: {
    // Socket-local -Z becomes world +X (right) after assembly rotation.
    // The axle is tentatively 8 mm inserted, 16 mm exposed outward (+X).
    center: [0, 0, -unit(4)] as Pt3,
    exposedLength: unit(16),
  },
  disc: {
    // Socket-local -Z becomes world +X; disc sits 10 mm toward the right.
    // Face spacing of 8 mm from the front socket remains provisional.
    center: [0, 0, -unit(10)] as Pt3,
  },
  // The physical reference has the beam connected at the lower-left outer
  // hole; -6.928,-4 mm is the geometric candidate. This hole selection and
  // beam orientation still require side-on reference verification.
  selectedDiscOuterHole: [unit(-6.928), unit(-4), 0] as Pt3,
  beamHoleLocalAfterCenter: [unit(-16), 0, 0] as Pt3,
  pin: {
    collarGap: unit(UNVERIFIED_AXIAL_MM.stopCollarGap),
  },
} as const;
export const DISC_CENTER_Z = FRAME.disc.center[2];
// All outward-facing attachments proceed toward -Z, away from the motor.
// These distances are constructed from measured part thicknesses and collar,
// NOT verified connection depths or precise optical photo measurements.
export const DISC_FRONT_Z = DISC_CENTER_Z - unit(STL_MEASUREMENTS_MM.disc.thickness) / 2;
export const BEAM_CENTRE_Z =
  DISC_FRONT_Z - FRAME.pin.collarGap - unit(STL_MEASUREMENTS_MM.beam.thickness) / 2;
export const CONNECTOR_COLLAR_Z = DISC_FRONT_Z - FRAME.pin.collarGap / 2;
export const BEAM_CENTRE_X =
  FRAME.selectedDiscOuterHole[0] - FRAME.beamHoleLocalAfterCenter[0];
export const BEAM_CENTRE_Y = FRAME.selectedDiscOuterHole[1];

export const VALIDATION_NOTES = [
  "STL dimensions and hole centres are mesh-derived.",
  "Sampled cross-sections show ~0.05 mm possible axle/disc X-profile interference on one transverse axis; press-fit tolerance must be checked physically.",
  "Blender-matched socket faces right (+X); short X axle approaches from right and inserts left (-X). All remaining components rotate together with its socket-local assembly axis.",
  "The axle targets LDraw front output hub 10095; rear cable retainer 10091 is explicitly excluded. The front datum is model-derived, and physical insertion depth still needs real-kit verification.",
  "Connector pin_pin has a central stop collar. It cannot be pushed fully through two flush parts after both have been joined.",
  "Photo's gold connector material and actual part number remain unverified.",
  "Motor insertion depth, disc spacing and outer-hole choice are provisional and cannot be certified from photos alone.",
] as const;
