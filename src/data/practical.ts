import type { PracticalProject } from "@/types/learning";

/**
 * Demonstration content only. Steps are intentionally platform-neutral —
 * no specific robotics kit is assumed.
 */

function baseSteps(prefix: string, titles: [string, string][]): PracticalProject["steps"] {
  return titles.map(([title, description], i) => ({
    id: `${prefix}-s${i + 1}`,
    number: i + 1,
    title,
    description,
    ...(i === 1
      ? {
          note: {
            type: "warning" as const,
            text: "Keep the power disconnected while you build this part.",
          },
        }
      : i === 4
        ? {
            note: {
              type: "tip" as const,
              text: "Test this stage on its own before continuing — it is much easier to debug now.",
            },
          }
        : {}),
  }));
}

export const practicalProjects: PracticalProject[] = [
  {
    id: "p1",
    number: 1,
    title: "Your First Moving Robot",
    description: "Assemble a simple two-wheel platform and make it drive forward in a straight line.",
    objective:
      "Build a stable driving base and confirm that both drive motors respond correctly to the controller.",
    difficulty: "Beginner",
    buildMinutes: 60,
    components: [
      "Chassis plate (demo part)",
      "2 × drive motor with wheel (demo part)",
      "1 × support wheel (demo part)",
      "Controller board (demo part)",
      "Battery holder and battery pack (demo part)",
      "Connection cables (demo part)",
    ],
    safetyNote:
      "Keep the battery disconnected while assembling. Lift the robot off the table before the first motor test so it cannot drive off the edge.",
    relatedModuleIds: ["m2", "m5"],
    steps: baseSteps("p1", [
      ["Lay out and check your parts", "Sort every component on the table and confirm nothing is missing or damaged before you begin."],
      ["Mount the drive motors", "Attach the two drive motors to the underside of the chassis so the axles are aligned with each other."],
      ["Fit the wheels and support", "Push a wheel onto each motor axle and fix the support wheel at the opposite end of the chassis."],
      ["Mount the controller", "Fix the controller board to the top of the chassis with the connection points facing outward."],
      ["Connect motors and power", "Route the motor cables to the controller, then add the battery holder last and keep it switched off."],
      ["First movement test", "Lift the robot, switch on, and confirm both wheels turn forward together. Correct any wheel spinning backwards."],
    ]),
    troubleshooting: [
      { question: "Only one wheel turns", answer: "Check that both motor cables are fully seated and that the loose motor is connected to a working output." },
      { question: "The robot curves instead of driving straight", answer: "Usually uneven friction or a loose wheel. Check the wheels sit flat and the support wheel rolls freely." },
      { question: "Nothing happens at all", answer: "Confirm the battery is charged and connected, then check the power switch and the ground connection." },
    ],
  },
  {
    id: "p2",
    number: 2,
    title: "Sensor Reaction Robot",
    description: "Add an input sensor and make the robot respond immediately to what it detects.",
    objective:
      "Connect a sensor, read reliable values from it and trigger a visible reaction on the robot.",
    difficulty: "Beginner",
    buildMinutes: 75,
    components: [
      "Completed driving base from Project 1 (demo part)",
      "1 × input sensor module (demo part)",
      "1 × indicator light (demo part)",
      "Mounting bracket (demo part)",
      "Connection cables (demo part)",
    ],
    safetyNote:
      "Disconnect power before adding the sensor. Never force a connector — a reversed connection can damage the module.",
    relatedModuleIds: ["m3", "m4"],
    steps: baseSteps("p2", [
      ["Prepare the driving base", "Start from your working robot from Project 1 and confirm it still drives before adding anything."],
      ["Mount the sensor bracket", "Fix the bracket to the front of the chassis so the sensor will face forward and slightly downward."],
      ["Attach the sensor module", "Secure the sensor in the bracket and make sure nothing blocks its view."],
      ["Wire the sensor", "Connect power, ground and the signal line, checking each one against your wiring notes."],
      ["Add the indicator light", "Fit the indicator where you can see it while the robot moves, and connect it to a free output."],
      ["Test the reaction", "Move your hand in front of the sensor and confirm the indicator responds instantly and consistently."],
    ]),
    troubleshooting: [
      { question: "Readings jump around randomly", answer: "Almost always a missing shared ground or a loose signal wire. Reseat the connections first." },
      { question: "The indicator never lights", answer: "Test the indicator on its own output first to separate a wiring fault from a sensor fault." },
      { question: "The sensor reacts too late", answer: "Long waits in the program block the loop. Shorten them so the sensor is read more often." },
    ],
  },
  {
    id: "p3",
    number: 3,
    title: "Obstacle Detection Robot",
    description: "Combine driving and sensing so the robot stops and turns away from obstacles.",
    objective:
      "Integrate the drive system with distance sensing so the robot avoids collisions on its own.",
    difficulty: "Intermediate",
    buildMinutes: 90,
    components: [
      "Sensor robot from Project 2 (demo part)",
      "1 × distance sensor (demo part)",
      "Front mounting plate (demo part)",
      "Cable ties (demo part)",
      "Connection cables (demo part)",
    ],
    safetyNote:
      "Test in a clear area on the floor, not on a table. Keep fingers away from the wheels while the robot is powered.",
    relatedModuleIds: ["m4", "m5", "m6"],
    steps: baseSteps("p3", [
      ["Review the existing build", "Confirm both driving and sensing still work before adding the distance sensor."],
      ["Fit the front plate", "Mount the plate at the front of the chassis, level and firmly attached."],
      ["Install the distance sensor", "Mount the distance sensor facing directly forward at a consistent height."],
      ["Tidy the wiring", "Route and tie the cables so nothing can reach the wheels while the robot is moving."],
      ["Set a stopping distance", "Choose a stopping distance and verify the robot detects an obstacle reliably at that range."],
      ["Test avoidance behaviour", "Place an obstacle in the path and confirm the robot stops, turns away and continues."],
    ]),
    troubleshooting: [
      { question: "The robot stops far too early", answer: "Your stopping distance is too large, or the sensor is picking up the chassis. Raise or angle the sensor." },
      { question: "It detects walls but not table legs", answer: "Narrow objects reflect less. Slow the robot down so it gets more readings per second." },
      { question: "It reverses forever", answer: "The turn is too short to clear the obstacle. Increase the turn before driving forward again." },
    ],
  },
  {
    id: "p4",
    number: 4,
    title: "Autonomous Navigation Challenge",
    description: "Bring everything together so the robot crosses a marked course without help.",
    objective:
      "Design, build and tune a robot that completes a short course autonomously and repeatably.",
    difficulty: "Advanced",
    buildMinutes: 120,
    components: [
      "Obstacle robot from Project 3 (demo part)",
      "2 × additional sensors of your choice (demo part)",
      "Adjustable sensor mounts (demo part)",
      "Course markers (demo part)",
      "Connection cables (demo part)",
    ],
    safetyNote:
      "Run the course on the floor with a clear area around it. Always keep a way to switch the robot off within reach.",
    relatedModuleIds: ["m4", "m5", "m6"],
    steps: baseSteps("p4", [
      ["Plan the course strategy", "Sketch the course and write down what the robot must sense and decide at each section."],
      ["Add the extra sensors", "Mount your chosen sensors where they give the clearest view of the course features."],
      ["Balance the robot", "Redistribute weight so the robot does not tip or drag during fast turns."],
      ["Tune the driving speed", "Find the fastest speed at which the robot still reacts in time to every course feature."],
      ["Run section tests", "Test each section of the course separately and record what fails before running the whole course."],
      ["Full autonomous run", "Complete the whole course three times without touching the robot and note the results."],
    ]),
    troubleshooting: [
      { question: "It works once then fails", answer: "Repeatability usually means power or friction. Check battery level and clean the wheels." },
      { question: "It behaves differently on the floor", answer: "Surface and light conditions change sensor readings. Re-tune on the surface you will be tested on." },
      { question: "Turns are inconsistent", answer: "Use a sensor to decide when the turn is finished instead of a fixed time." },
    ],
  },
];

export function getProject(id: string) {
  return practicalProjects.find((p) => p.id === id);
}
