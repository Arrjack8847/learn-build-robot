/** Exact original Level 2 PowerPoint uploads; not converted to a PDF or simulated as a building lesson. */
import level2CarSteeringPptxUrl from "../../Car Steering.pptx?url";
import level2CliffWalkPptxUrl from "../../Cliff walk.pptx?url";
import level2FerrisWheelPptxUrl from "../../Ferris wheel.pptx?url";
import level2RoundTripTransportationPptxUrl from "../../Round-trip transportation.pptx?url";
import level2ShiftGearsPptxUrl from "../../Shift gears.pptx?url";

/** Only source-verified, nonempty PowerPoints. Syllabus sourceEntry is the key. */
export const levelTwoPowerPointSources: Readonly<Record<string, string>> = {
  "Car Steering.pptx": level2CarSteeringPptxUrl,
  "Cliff walk.pptx": level2CliffWalkPptxUrl,
  "Ferris wheel.pptx": level2FerrisWheelPptxUrl,
  "Round-trip transportation.pptx": level2RoundTripTransportationPptxUrl,
  "Shift gears.pptx": level2ShiftGearsPptxUrl,
};
