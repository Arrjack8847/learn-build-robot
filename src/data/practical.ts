import type { PracticalProject } from "@/types/learning";

const marksmanshipSteps: PracticalProject["steps"] = [
  {
    id: "marksmanship-s1",
    number: 1,
    title: "Prepare the parts",
    description:
      "Prepare the motor, DC 5-hole beam, circle piece, 3-hole long axle and pin connector.",
    image: "/marksmanship/steps/1.png",
    originalManualStepNumbers: [1],
  },
  {
    id: "marksmanship-s2",
    number: 2,
    title: "Build the motor assembly",
    description:
      "Insert the short axle into the motor. Attach the circular piece to the beam using the connector and combine them. Keep this assembly for later.",
    image: "/marksmanship/steps/2.png",
    originalManualStepNumbers: [2],
  },
  {
    id: "marksmanship-s3",
    number: 3,
    title: "Prepare the long beam assembly",
    description:
      "Attach the long connector to the end of a 15-hole beam. Prepare the medium axle, axle connector, and two short L-beams with a connector on each.",
    image: "/marksmanship/steps/3.png",
    originalManualStepNumbers: [3],
  },
  {
    id: "marksmanship-s4",
    number: 4,
    title: "Connect the L-beams and medium axle",
    description:
      "First slide the small grey axle connector to the middle of the black medium axle. Use the two blue pins in holes 1 and 2 at the prepared end of the white 15-hole beam to mount the two circular holes nearest each grey L-beam's corner. Attach the first L-beam, slide the prepared axle through its far cross-shaped X hole, then attach the second L-beam on the opposite side using the same hole pair. Keep both L-beam connectors facing outward. Save the finished subassembly for Steps 29–30.",
    image: "/marksmanship/steps/4.png",
    originalManualStepNumbers: [4],
  },
  {
    id: "marksmanship-s5",
    number: 5,
    title: "Prepare the 11-hole beam and connector units",
    description:
      "Keep one empty 11-hole beam separate. Prepare two double-sided bridge connectors with two long pins each, and two hollow right-angle connectors with one short pin each. Attach them to the beam only in Step 6. The 3D viewer uses genuine beam and connector models; check the physical press-fit before continuing.",
    image: "/marksmanship/steps/5.png",
    originalManualStepNumbers: [5],
  },
  {
    id: "marksmanship-s6",
    number: 6,
    title: "Attach the connectors",
    description:
      "Attach the 2-sided connector at the edge and middle of the beam, and the hollow connector to holes 1 and 2.",
    image: "/marksmanship/steps/6.png",
    originalManualStepNumbers: [6],
  },
  {
    id: "marksmanship-side-rails-v1",
    number: 7,
    title: "Connect Two 15-Hole Side Beams",
    description: "Start with the completed Step 6 structure. Align and securely attach two parallel 15-hole side rails; original manual Steps 7 and 8 are combined into this interactive lesson. Physical fit must be confirmed with the real kit.",
    originalManualStepNumbers: [7, 8],
    assemblyOutputId: "marksman-assembly-a-side-rails-v1",
  },
  {
    id: "marksmanship-rectangular-frame-v1",
    number: 8,
    title: "Assemble and Lock the Rectangular Frame",
    description: "Install four blue pins at Holes 2 and 4 on the two 5-hole beams, attach both 7-hole beams, then lock the central 15-hole beam using the two black connectors. Verify all unmeasured joints with your kit.",
    originalManualStepNumbers: [],
    assemblyOutputId: "marksman-assembly-b-rectangular-frame-v1",
  },
  {
    id: "marksmanship-inspect-assemblies-v1",
    number: 9,
    title: "Connect Step 8 to Step 7 using four blue pins",
    description: "Prepare both completed structures separately, orient Step 8 with its longest white beam at the front, then align and insert its four original blue pins into holes 7 and 11 of each Step 7 rail (counting from the blue-pinned free end). Inspect the real fit.",
    originalManualStepNumbers: [],
  },
  {
    id: "marksmanship-photo-step10-v1",
    number: 10,
    title: "Build the Twin Side Beams and Center Bridge",
    description: "Photo-guided Step 10: build two matching 15-hole white/9-hole gray rail units. For each white beam use blue pins at holes 1, 6 and 12, black pins at holes 3 and 15; mate gray holes 3 and 9 to white holes 6 and 12. Join the hole-15 ends with the outer holes of a black 3-hole beam and attach the brown spacer to its center hole. This replaces the reference-only Step 10 teaching slot, without changing the original manual image numbering.",
    assemblyOutputId: "marksman-step10-twin-rail-end-bridge-v1",
    originalManualStepNumbers: [],
  },
  {
    id: "marksmanship-s10",
    number: 11,
    title: "Join Step 9 and Step 10 Assemblies",
    description: "Photo-guided Step 11: prepare the finished Step 9 and Step 10 setups separately, then join the two original blue Hole 1 pins and two black Hole 3 pins from Step 10 to the first and third holes of the bottom three-hole group on the two outer Step 9 white beams. The middle holes remain empty. Verify all four mechanical seats with the real kit.",
    assemblyOutputId: "marksman-step11-step9-step10-four-pin-join-v1",
    // Preserve the historic manual Step 10 slot association; the new photo-guided\n    // join is separate and must not be mistaken for an identical manual step.\n    originalManualStepNumbers: [10],
  },
  {
    id: "marksmanship-s11",
    number: 12,
    title: "Prepare another 15-hole beam",
    description: "Original manual Step 11: physical operation is pending reconciliation with interactive Step 8. Review the illustration only; do not repeat an already completed attachment.",
    image: "/marksmanship/steps/11.png",
    referenceOnly: true,
    note: { type: "warning", text: "Original manual operation may overlap the separate rectangular-frame assembly. Do not repeat it until photo/kit mapping is verified." },
    originalManualStepNumbers: [11],
  },
  {
    id: "marksmanship-s12",
    number: 13,
    title: "Place the 15-hole beam",
    description: "Original manual Step 12: physical operation is pending reconciliation with interactive Step 8. Review the illustration only; do not repeat an already completed attachment.",
    image: "/marksmanship/steps/12.png",
    referenceOnly: true,
    note: { type: "warning", text: "Original manual operation may overlap the separate rectangular-frame assembly. Do not repeat it until photo/kit mapping is verified." },
    originalManualStepNumbers: [12],
  },
  {
    id: "marksmanship-s13",
    number: 14,
    title: "Prepare two 5-hole beams",
    description: "Original manual Step 13: physical operation is pending reconciliation with interactive Step 8. Review the illustration only; do not repeat an already completed attachment.",
    image: "/marksmanship/steps/13.png",
    referenceOnly: true,
    note: { type: "warning", text: "Original manual operation may overlap the separate rectangular-frame assembly. Do not repeat it until photo/kit mapping is verified." },
    originalManualStepNumbers: [13],
  },
  {
    id: "marksmanship-s14",
    number: 15,
    title: "Secure the 15-hole beam",
    description: "Original manual Step 14: physical operation is pending reconciliation with interactive Step 8. Review the illustration only; do not repeat an already completed attachment.",
    image: "/marksmanship/steps/14.png",
    referenceOnly: true,
    note: { type: "warning", text: "Original manual operation may overlap the separate rectangular-frame assembly. Do not repeat it until photo/kit mapping is verified." },
    originalManualStepNumbers: [14],
  },
  {
    id: "marksmanship-s15",
    number: 16,
    title: "Prepare the 13-hole beam",
    description:
      "Take a 13-hole beam, attach a long connector at the end and a connector at hole 3.",
    image: "/marksmanship/steps/15.png",
    originalManualStepNumbers: [15],
  },
  {
    id: "marksmanship-s16",
    number: 17,
    title: "Attach the 13-hole beams",
    description:
      "Attach both 13-hole beams to the back of the main part at holes 1 and 3, one hole apart from the existing grey piece.",
    image: "/marksmanship/steps/16.png",
    originalManualStepNumbers: [16],
  },
  {
    id: "marksmanship-s17",
    number: 18,
    title: "Prepare the L-shaped beams",
    description:
      "Take two 7-hole L-shaped beams and attach a connector with stopper at the 2nd hole on the long side of each.",
    image: "/marksmanship/steps/17.png",
    originalManualStepNumbers: [17],
  },
  {
    id: "marksmanship-s18",
    number: 19,
    title: "Attach the L-shaped beams",
    description:
      "Attach both L-beams to the main assembly with the right side facing forward and the left side facing backward.",
    image: "/marksmanship/steps/18.png",
    originalManualStepNumbers: [18],
  },
  {
    id: "marksmanship-s19",
    number: 20,
    title: "Prepare the T-shaped beam",
    description:
      "Take the 4-hole T-shaped beam and attach a connector at the end.",
    image: "/marksmanship/steps/19.png",
    originalManualStepNumbers: [19],
  },
  {
    id: "marksmanship-s20",
    number: 21,
    title: "Attach the T-beam",
    description:
      "Attach the T-beam to the long connector on the main assembly from Step 16.",
    image: "/marksmanship/steps/20.png",
    originalManualStepNumbers: [20],
  },
  {
    id: "marksmanship-s21",
    number: 22,
    title: "Prepare the small parts",
    description:
      "Prepare three connectors, one stopper, and a 3-hole beam.",
    image: "/marksmanship/steps/21.png",
    originalManualStepNumbers: [21],
  },
  {
    id: "marksmanship-s22",
    number: 23,
    title: "Build the small unit",
    description:
      "Combine the three connectors, stopper, and 3-hole beam into one unit.",
    image: "/marksmanship/steps/22.png",
    originalManualStepNumbers: [22],
  },
  {
    id: "marksmanship-s23",
    number: 24,
    title: "Attach the rear unit",
    description:
      "Attach the assembled unit to the very back end of the main assembly.",
    image: "/marksmanship/steps/23.png",
    originalManualStepNumbers: [23],
  },
  {
    id: "marksmanship-s24",
    number: 25,
    title: "Prepare two 9-hole beams",
    description:
      "Take two 9-hole beams and attach a long connector at holes 1 and 7 on each.",
    image: "/marksmanship/steps/24.png",
    originalManualStepNumbers: [24],
  },
  {
    id: "marksmanship-s25",
    number: 26,
    title: "Attach the 9-hole beams",
    description:
      "Attach both 9-hole beams to the main body, positioned close to the T-beam assembled earlier.",
    image: "/marksmanship/steps/25.png",
    originalManualStepNumbers: [25],
  },
  {
    id: "marksmanship-s26",
    number: 27,
    title: "Prepare the motor and controller",
    description:
      "Take the motor assembly from Step 2 and a microcontroller box with two connectors attached at holes 2 and 4 on one side.",
    image: "/marksmanship/steps/26.png",
    originalManualStepNumbers: [26],
  },
  {
    id: "marksmanship-s27",
    number: 28,
    title: "Mount the motor",
    description:
      "Mount the motor onto the main body's connectors, facing toward the back.",
    image: "/marksmanship/steps/27.png",
    originalManualStepNumbers: [27],
  },
  {
    id: "marksmanship-s28",
    number: 29,
    title: "Attach the microcontroller",
    description:
      "Attach the microcontroller box underneath the motor as shown in the picture.",
    image: "/marksmanship/steps/28.png",
    originalManualStepNumbers: [28],
  },
  {
    id: "marksmanship-s29",
    number: 30,
    title: "Bring back the Step 4 assembly",
    description: "Now take the assembly from Step 4.",
    image: "/marksmanship/steps/29.png",
    originalManualStepNumbers: [29],
  },
  {
    id: "marksmanship-s30",
    number: 31,
    title: "Install the shooting mechanism",
    description:
      "Slide the Step 4 assembly into the main body. This serves as the shooting mechanism.",
    image: "/marksmanship/steps/30.png",
    originalManualStepNumbers: [30],
  },
  {
    id: "marksmanship-s31",
    number: 32,
    title: "Attach the rubber band",
    description:
      "Attach a rubber band to the main body to assist the spring mechanism on the Step 4 part.",
    image: "/marksmanship/steps/31.png",
    originalManualStepNumbers: [31],
  },
];

export const practicalProjects: PracticalProject[] = [
  {
    id: "marksmanship",
    number: 1,
    title: "Marksmanship Robot",
    description:
      "Build the Marksmanship robot one step at a time, then prepare its motor and spring shooting mechanism.",
    objective:
      "Complete the revised 32-entry interactive assembly and prepare the microcontroller so the motor can act as the trigger for the spring mechanism.",
    components: [
      "DC motor",
      "Microcontroller box",
      "3-hole, 4-hole, 5-hole, 7-hole, 9-hole, 11-hole, 13-hole and 15-hole beams",
      "Short and 7-hole L-shaped beams",
      "4-hole T-shaped beam",
      "Circular piece",
      "Short, medium and long axles",
      "Pin, long, 2-sided and hollow connectors",
      "Axle connector and stoppers",
      "Rubber band",
    ],
    relatedModuleIds: [],
    steps: marksmanshipSteps,
    troubleshooting: [],
  },
];

export function getProject(id: string) {
  return practicalProjects.find((project) => project.id === id);
}
