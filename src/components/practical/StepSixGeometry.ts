import type { Vector3Tuple } from "three";

/**
 * Step 6 operates on the SAME logical component IDs and STEP 5 saved
 * relative child transforms. Each component is rehydrated from that state
 * on the next lesson screen, never invented as a loose replacement.
 */
export type StepSixSide = "front" | "back";
export type StepSixMountConfig = {
  hollowASide: StepSixSide | "";
  hollowBSide: StepSixSide | "";
  bridgeAStart: number;
  bridgeASide: StepSixSide | "";
  bridgeBStart: number;
  bridgeBSide: StepSixSide | "";
};
export type StepSixPose = {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
};
export type StepSixPart = "STEP5_HOLLOW_A" | "STEP5_HOLLOW_B"
  | "STEP5_BRIDGE_A" | "STEP5_BRIDGE_B";
export type StepSixStepFiveTransforms = Record<string, {
  parent: string | null;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  model: string;
}>;
export const STEP_SIX_RESULT = "robot:marksmanship:step6:assembled:v1";
export const STEP_SIX_DRAFT = "robot:marksmanship:step6:draft:v1";
export const STEP_SIX_ASSEMBLY_ID = "marksman-step6-main-connector-beam";
export const BEAM_HOLE_COUNT = 11;
export const HOLE_PITCH_MM = 8;
export const BRIDGE_SPACING_MM = 16;
export const BEAM_THICKNESS_MM = 7.8;
export const BEAM_FACE_WORLD = (BEAM_THICKNESS_MM / 8) / 2;
export const BRIDGE_BODY_FACE_WORLD = (7.8 / 8) / 2;
export const HOLLOW_PROJECTING_END_MM = 8;
/** Hole numbering begins at the 15100 end: native x = 0 mm is hole #1. */
export const beamHoleX = (hole: number): number => {
  if (!Number.isInteger(hole) || hole < 1 || hole > BEAM_HOLE_COUNT)
    throw new Error("11-hole beam index outside 1..11");
  return hole - 6; // STL is centered by -40 mm, 1 world unit per 8 mm.
};

export const EMPTY_MOUNT_CONFIG: StepSixMountConfig = {
  hollowASide: "", hollowBSide: "",
  bridgeAStart: 0, bridgeASide: "",
  bridgeBStart: 0, bridgeBSide: "",
};

export function validateMountConfig(config: StepSixMountConfig): string[] {
  const errors: string[] = [];
  if (!config.hollowASide || !config.hollowBSide)
    errors.push("Choose the installation face for both hollow connectors.");
  if (config.hollowASide && config.hollowBSide && config.hollowASide === config.hollowBSide)
    errors.push("The hollow connectors must face opposite sides, matching the supplied assembly description.");
  if (!Number.isInteger(config.bridgeAStart) || config.bridgeAStart < 3 || config.bridgeAStart > 7)
    errors.push("Choose the first bridge's measured two-hole mounting pair.");
  if (!Number.isInteger(config.bridgeBStart) || config.bridgeBStart < 6 || config.bridgeBStart > 9)
    errors.push("Choose the second bridge's measured two-hole mounting pair.");
  if (config.bridgeAStart >= 3 && config.bridgeBStart >= 6
      && config.bridgeBStart <= config.bridgeAStart + 2)
    errors.push("The two bridge mounting pairs must be ordered and non-overlapping.");
  if (!config.bridgeASide || !config.bridgeBSide)
    errors.push("Choose the installation face for both bridges.");
  return errors;
}
export const configComplete = (config: StepSixMountConfig) =>
  validateMountConfig(config).length === 0;

export type StepSixAttachment = {
  id: StepSixPart;
  beamHoles: number[];
  sourceHolesMm: number[][];
  axis: "beamZ";
  side: StepSixSide;
  seatingDepthMm: number;
  mechanicallyVerified: false;
  confirmationSource: "user-reference-selection";
};

export function getStepSixAttachments(config: StepSixMountConfig): StepSixAttachment[] {
  if (!configComplete(config)) throw new Error("Configure all Step 6 mounting holes and faces first.");
  return [
    {id:"STEP5_HOLLOW_A",beamHoles:[1],sourceHolesMm:[[0,0]],
      axis:"beamZ",side:config.hollowASide as StepSixSide,seatingDepthMm:8,
      mechanicallyVerified:false,confirmationSource:"user-reference-selection"},
    {id:"STEP5_HOLLOW_B",beamHoles:[2],sourceHolesMm:[[0,0]],
      axis:"beamZ",side:config.hollowBSide as StepSixSide,seatingDepthMm:8,
      mechanicallyVerified:false,confirmationSource:"user-reference-selection"},
    {id:"STEP5_BRIDGE_A",beamHoles:[config.bridgeAStart,config.bridgeAStart+2],
      sourceHolesMm:[[-8,4],[8,4]],axis:"beamZ",
      side:config.bridgeASide as StepSixSide,seatingDepthMm:7.8,
      mechanicallyVerified:false,confirmationSource:"user-reference-selection"},
    {id:"STEP5_BRIDGE_B",beamHoles:[config.bridgeBStart,config.bridgeBStart+2],
      sourceHolesMm:[[-8,4],[8,4]],axis:"beamZ",
      side:config.bridgeBSide as StepSixSide,seatingDepthMm:7.8,
      mechanicallyVerified:false,confirmationSource:"user-reference-selection"},
  ];
}
const idOrder: readonly StepSixPart[] =
  ["STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"];

/** Keep the exact Step 5 layout and the beam at its saved height until moved. */
export function loosePose(id: StepSixPart, transforms: StepSixStepFiveTransforms): StepSixPose {
  const saved = transforms[id];
  if(!saved)throw new Error("Missing Step 5 prepared assembly: "+id);
  return {position:[...saved.position] as Vector3Tuple,
    rotation:[...saved.rotation] as Vector3Tuple};
}
export function seatedPose(id: StepSixPart, config: StepSixMountConfig,
  beamY: number): StepSixPose {
  const attachment=getStepSixAttachments(config).find(a=>a.id===id)!;
  const sign=attachment.side==="front"?1:-1;
  if(id==="STEP5_HOLLOW_A" || id==="STEP5_HOLLOW_B"){
    // Native 15100 built-in +X projecting peg enters the beam along Z.
    // +X -> -Z on the front face, +X -> +Z on the back face.
    // Its shoulder is at native X≈0; the tip reaches ~8 mm into the beam.
    return {
      position:[beamHoleX(attachment.beamHoles[0]!),beamY,sign*BEAM_FACE_WORLD],
      rotation:[0,sign*Math.PI/2,0],
    };
  }
  const start=attachment.beamHoles[0]!;
  // Bridge's native ±8 mm Z-through openings are 16 mm apart, so beam
  // mounting hole indices differ by two. Its face is flush to beam Z.
  return {
    position:[(beamHoleX(start)+beamHoleX(start+2))/2,beamY,
      sign*(BEAM_FACE_WORLD+BRIDGE_BODY_FACE_WORLD)],
    rotation:[0,0,0],
  };
}
export function approachPose(id:StepSixPart,config:StepSixMountConfig,
  beamY:number): StepSixPose {
  const finished=seatedPose(id,config,beamY);
  const attachment=getStepSixAttachments(config).find(a=>a.id===id)!;
  const sign=attachment.side==="front"?1:-1;
  return {position:[finished.position[0],finished.position[1],
    finished.position[2]+sign*2.6],rotation:[...finished.rotation] as Vector3Tuple};
}
export function poseAtPhase(id:StepSixPart,phase:number,config:StepSixMountConfig,
  transforms:StepSixStepFiveTransforms,beamY:number):StepSixPose {
  if(!configComplete(config))return loosePose(id,transforms);
  const index=idOrder.indexOf(id);
  if(index===0 && phase>=1 || index===1 && phase>=2
    || index===2 && phase>=4 || index===3 && phase>=6)
    return seatedPose(id,config,beamY);
  if(index===2 && phase>=3 || index===3 && phase>=5)
    return approachPose(id,config,beamY);
  return loosePose(id,transforms);
}
export function getStepSixSnapshot(config:StepSixMountConfig,
  priorStepFiveAssemblyId:string) {
  const attachments=getStepSixAttachments(config);
  return {
    version:1, assemblyId:STEP_SIX_ASSEMBLY_ID,
    stepFiveAssemblyId:priorStepFiveAssemblyId,
    storedStepFiveSnapshotKey:"robot:marksmanship:step5:prepared:v2",
    beamModel:"beam11.stl", beamHoles:11,
    attachments,
    independentConnectorUnitCount:4,
    originalPinCount:6, geometryUnchanged:true,
    holePositionsSelectedByUser:true,
    mechanicallyVerified:false,
    physicalFitCertification:false,
    readyForStep8:true,
  };
}
