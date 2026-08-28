import type { PracticalProject } from "@/types/learning";

const marksmanshipSteps: PracticalProject["steps"] = [
  {
    id: "marksmanship-s1",
    number: 1,
    title: "Prepare the parts",
    description:
      "Prepare the motor, DC 5-hole beam, circle piece, 3-hole long axle and pin connector.",
    image: "/marksmanship/steps/1.png",
  },
  {
    id: "marksmanship-s2",
    number: 2,
    title: "Build the motor assembly",
    description:
      "Insert the short axle into the motor. Attach the circular piece to the beam using the connector and combine them. Keep this assembly for later.",
    image: "/marksmanship/steps/2.png",
  },
  {
    id: "marksmanship-s3",
    number: 3,
    title: "Prepare the long beam assembly",
    description:
      "Attach the long connector to the end of a 15-hole beam. Prepare the medium axle, axle connector, and two short L-beams with a connector on each.",
    image: "/marksmanship/steps/3.png",
  },
  {
    id: "marksmanship-s4",
    number: 4,
    title: "Attach the L-beams",
    description:
      "Connect both L-beams to the connectors on the 15-hole beam, with each L-beam connector facing outward. Then insert the axle at the end. Keep this assembly for later.",
    image: "/marksmanship/steps/4.png",
  },
  {
    id: "marksmanship-s5",
    number: 5,
    title: "Gather the next parts",
    description:
      "Gather an 11-hole beam, a 2-sided connector with long connector, and a hollow connector with connector pre-attached.",
    image: "/marksmanship/steps/5.png",
  },
  {
    id: "marksmanship-s6",
    number: 6,
    title: "Attach the connectors",
    description:
      "Attach the 2-sided connector at the edge and middle of the beam, and the hollow connector to holes 1 and 2.",
    image: "/marksmanship/steps/6.png",
  },
  {
    id: "marksmanship-s7",
    number: 7,
    title: "Prepare two 15-hole beams",
    description:
      "Take two 15-hole beams and attach a long connector at the 3rd hole of each.",
    image: "/marksmanship/steps/7.png",
  },
  {
    id: "marksmanship-s8",
    number: 8,
    title: "Connect the long beams",
    description:
      "Connect both 15-hole beams to the previous assembly as shown in the picture.",
    image: "/marksmanship/steps/8.png",
  },
  {
    id: "marksmanship-s9",
    number: 9,
    title: "Flip and prepare the 7-hole beams",
    description:
      "Flip the main assembly over. Prepare two 7-hole beams and attach two long connectors to each at holes 2 and 5.",
    image: "/marksmanship/steps/9.png",
  },
  {
    id: "marksmanship-s10",
    number: 10,
    title: "Attach the 7-hole beams",
    description:
      "Attach both 7-hole beams to the middle of the main assembly as shown.",
    image: "/marksmanship/steps/10.png",
  },
  {
    id: "marksmanship-s11",
    number: 11,
    title: "Prepare another 15-hole beam",
    description:
      "Take another 15-hole beam and attach connectors at holes 5 and 8.",
    image: "/marksmanship/steps/11.png",
  },
  {
    id: "marksmanship-s12",
    number: 12,
    title: "Place the 15-hole beam",
    description:
      "Temporarily place the 15-hole beam between the grey pieces attached in Step 10.",
    image: "/marksmanship/steps/12.png",
  },
  {
    id: "marksmanship-s13",
    number: 13,
    title: "Prepare two 5-hole beams",
    description:
      "Prepare two 5-hole beams to secure the 15-hole beam in place.",
    image: "/marksmanship/steps/13.png",
  },
  {
    id: "marksmanship-s14",
    number: 14,
    title: "Secure the 15-hole beam",
    description:
      "Attach the two 5-hole beams to both the main assembly and the 15-hole beam.",
    image: "/marksmanship/steps/14.png",
  },
  {
    id: "marksmanship-s15",
    number: 15,
    title: "Prepare the 13-hole beam",
    description:
      "Take a 13-hole beam, attach a long connector at the end and a connector at hole 3.",
    image: "/marksmanship/steps/15.png",
  },
  {
    id: "marksmanship-s16",
    number: 16,
    title: "Attach the 13-hole beams",
    description:
      "Attach both 13-hole beams to the back of the main part at holes 1 and 3, one hole apart from the existing grey piece.",
    image: "/marksmanship/steps/16.png",
  },
  {
    id: "marksmanship-s17",
    number: 17,
    title: "Prepare the L-shaped beams",
    description:
      "Take two 7-hole L-shaped beams and attach a connector with stopper at the 2nd hole on the long side of each.",
    image: "/marksmanship/steps/17.png",
  },
  {
    id: "marksmanship-s18",
    number: 18,
    title: "Attach the L-shaped beams",
    description:
      "Attach both L-beams to the main assembly with the right side facing forward and the left side facing backward.",
    image: "/marksmanship/steps/18.png",
  },
  {
    id: "marksmanship-s19",
    number: 19,
    title: "Prepare the T-shaped beam",
    description:
      "Take the 4-hole T-shaped beam and attach a connector at the end.",
    image: "/marksmanship/steps/19.png",
  },
  {
    id: "marksmanship-s20",
    number: 20,
    title: "Attach the T-beam",
    description:
      "Attach the T-beam to the long connector on the main assembly from Step 16.",
    image: "/marksmanship/steps/20.png",
  },
  {
    id: "marksmanship-s21",
    number: 21,
    title: "Prepare the small parts",
    description:
      "Prepare three connectors, one stopper, and a 3-hole beam.",
    image: "/marksmanship/steps/21.png",
  },
  {
    id: "marksmanship-s22",
    number: 22,
    title: "Build the small unit",
    description:
      "Combine the three connectors, stopper, and 3-hole beam into one unit.",
    image: "/marksmanship/steps/22.png",
  },
  {
    id: "marksmanship-s23",
    number: 23,
    title: "Attach the rear unit",
    description:
      "Attach the assembled unit to the very back end of the main assembly.",
    image: "/marksmanship/steps/23.png",
  },
  {
    id: "marksmanship-s24",
    number: 24,
    title: "Prepare two 9-hole beams",
    description:
      "Take two 9-hole beams and attach a long connector at holes 1 and 7 on each.",
    image: "/marksmanship/steps/24.png",
  },
  {
    id: "marksmanship-s25",
    number: 25,
    title: "Attach the 9-hole beams",
    description:
      "Attach both 9-hole beams to the main body, positioned close to the T-beam assembled earlier.",
    image: "/marksmanship/steps/25.png",
  },
  {
    id: "marksmanship-s26",
    number: 26,
    title: "Prepare the motor and controller",
    description:
      "Take the motor assembly from Step 2 and a microcontroller box with two connectors attached at holes 2 and 4 on one side.",
    image: "/marksmanship/steps/26.png",
  },
  {
    id: "marksmanship-s27",
    number: 27,
    title: "Mount the motor",
    description:
      "Mount the motor onto the main body's connectors, facing toward the back.",
    image: "/marksmanship/steps/27.png",
  },
  {
    id: "marksmanship-s28",
    number: 28,
    title: "Attach the microcontroller",
    description:
      "Attach the microcontroller box underneath the motor as shown in the picture.",
    image: "/marksmanship/steps/28.png",
  },
  {
    id: "marksmanship-s29",
    number: 29,
    title: "Bring back the Step 4 assembly",
    description: "Now take the assembly from Step 4.",
    image: "/marksmanship/steps/29.png",
  },
  {
    id: "marksmanship-s30",
    number: 30,
    title: "Install the shooting mechanism",
    description:
      "Slide the Step 4 assembly into the main body. This serves as the shooting mechanism.",
    image: "/marksmanship/steps/30.png",
  },
  {
    id: "marksmanship-s31",
    number: 31,
    title: "Attach the rubber band",
    description:
      "Attach a rubber band to the main body to assist the spring mechanism on the Step 4 part.",
    image: "/marksmanship/steps/31.png",
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
      "Complete the 31-step assembly and prepare the microcontroller so the motor can act as the trigger for the spring mechanism.",
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
