import type { TheoryModule } from "@/types/learning";

/**
 * Demonstration content only. Replace with a real content API later —
 * the shape of `theoryModules` is the integration contract.
 */

function lessonContent(topic: string): string[] {
  return [
    `This demonstration lesson introduces ${topic.toLowerCase()} in a way that connects directly to the robots you will build in the practical projects.`,
    `Start by looking at the whole system before the details. A robot senses its environment, decides what to do, and then acts. Every subject in this course fits into one of those three stages, and ${topic.toLowerCase()} is no exception.`,
    `As you read, keep asking yourself one question: what would break if this part were missing? Answering that question is the fastest way to build real understanding rather than memorised definitions.`,
  ];
}

export const theoryModules: TheoryModule[] = [
  {
    id: "m1",
    number: 1,
    title: "Introduction to Robotics",
    description:
      "What makes a machine a robot, where robots are used, and how the sense–think–act loop works.",
    icon: "Bot",
    durationMinutes: 45,
    difficulty: "Beginner",
    lessons: [
      {
        id: "m1-l1",
        moduleId: "m1",
        title: "What Is a Robot?",
        objectives: [
          "Define a robot using the sense–think–act loop",
          "Distinguish robots from simple automatic machines",
          "Name three everyday uses of robotics",
        ],
        content: lessonContent("the definition of a robot"),
        concept: {
          title: "Sense – Think – Act",
          body: "A robot gathers data with sensors, processes that data with a controller, and changes the world with actuators. Remove any one stage and you no longer have a robot.",
        },
        example: {
          title: "A line-following robot",
          body: "Two light sensors read the floor (sense), the controller compares the readings (think), and the two motors turn at different speeds to steer back onto the line (act).",
        },
      },
      {
        id: "m1-l2",
        moduleId: "m1",
        title: "Parts of a Robot System",
        objectives: [
          "Identify the four core subsystems of a robot",
          "Explain the role of the power subsystem",
          "Trace a signal from sensor to actuator",
        ],
        content: lessonContent("robot subsystems"),
        concept: {
          title: "Four subsystems",
          body: "Structure, power, electronics and software. A weakness in any one of them limits the whole robot, which is why testing is done subsystem by subsystem.",
        },
        example: {
          title: "Tracing a signal",
          body: "A button press becomes a voltage, the voltage becomes a digital 1, the program reads that 1, and the program sets a motor output. Four subsystems, one action.",
        },
      },
      {
        id: "m1-l3",
        moduleId: "m1",
        title: "Robots Around Us",
        objectives: [
          "Give examples of industrial, service and educational robots",
          "Describe one benefit and one limitation of automation",
        ],
        content: lessonContent("real-world robotics"),
        concept: {
          title: "Autonomy is a scale",
          body: "Very few robots are fully autonomous. Most sit somewhere between remote control and independent decision making.",
        },
        example: {
          title: "Warehouse robots",
          body: "They navigate a mapped floor independently but still ask a central system what to fetch next — shared autonomy in practice.",
        },
      },
    ],
  },
  {
    id: "m2",
    number: 2,
    title: "Safety in the Robotics Lab",
    description:
      "Working safely with tools, batteries and moving parts before you touch any hardware.",
    icon: "ShieldCheck",
    durationMinutes: 30,
    difficulty: "Beginner",
    lessons: [
      {
        id: "m2-l1",
        moduleId: "m2",
        title: "Lab Rules and Personal Safety",
        objectives: [
          "List the core lab rules",
          "Know when eye protection is required",
          "Explain why loose items are a hazard near motors",
        ],
        content: lessonContent("personal safety in the lab"),
        concept: {
          title: "Power down before you change anything",
          body: "Disconnect power before rewiring. Most damaged components in student labs are the result of live rewiring.",
        },
        example: {
          title: "The two-second check",
          body: "Before switching on: nothing loose, nothing touching, nothing hot. Two seconds prevents most incidents.",
        },
      },
      {
        id: "m2-l2",
        moduleId: "m2",
        title: "Handling Batteries and Power",
        objectives: [
          "Handle and store battery packs safely",
          "Recognise the signs of an overheating component",
          "Describe what a short circuit is",
        ],
        content: lessonContent("battery and power safety"),
        concept: {
          title: "A short circuit is a shortcut",
          body: "Current takes the easiest path. If that path skips the load, current rises fast and heat follows.",
        },
        example: {
          title: "The smell test",
          body: "Hot plastic smell means power off immediately, then investigate — never the other way around.",
        },
      },
    ],
  },
  {
    id: "m3",
    number: 3,
    title: "Basic Electronic Components",
    description:
      "Resistors, capacitors, LEDs and switches — what they do and how to read a simple circuit.",
    icon: "CircuitBoard",
    durationMinutes: 60,
    difficulty: "Beginner",
    lessons: [
      {
        id: "m3-l1",
        moduleId: "m3",
        title: "Voltage, Current and Resistance",
        objectives: [
          "State Ohm's law in words",
          "Predict what happens when resistance increases",
          "Use the correct units for each quantity",
        ],
        content: lessonContent("voltage, current and resistance"),
        concept: {
          title: "Ohm's law",
          body: "Voltage = Current × Resistance. Fix any two values and the third is decided for you.",
        },
        example: {
          title: "Sizing an LED resistor",
          body: "With 5 V supplied, about 2 V across the LED and 20 mA desired, the resistor must drop 3 V — roughly 150 Ω.",
        },
      },
      {
        id: "m3-l2",
        moduleId: "m3",
        title: "Reading a Simple Circuit",
        objectives: [
          "Identify common schematic symbols",
          "Follow a current path on a diagram",
          "Spot an obvious wiring mistake",
        ],
        content: lessonContent("circuit diagrams"),
        concept: {
          title: "Follow the loop",
          body: "Current must leave the supply and return to it. If you cannot trace a full loop, the circuit will not work.",
        },
        example: {
          title: "A missing ground",
          body: "The most common student fault is a sensor with power but no shared ground — readings jump randomly.",
        },
      },
    ],
  },
  {
    id: "m4",
    number: 4,
    title: "Sensors and Actuators",
    description:
      "How robots perceive the world and how they turn decisions into physical movement.",
    icon: "Radar",
    durationMinutes: 55,
    difficulty: "Intermediate",
    lessons: [
      {
        id: "m4-l1",
        moduleId: "m4",
        title: "How Sensors Work",
        objectives: [
          "Distinguish digital and analogue sensors",
          "Explain sensor noise and why filtering helps",
          "Choose a sensor for a simple task",
        ],
        content: lessonContent("sensors"),
        concept: {
          title: "Every sensor lies a little",
          body: "Readings always contain noise. Good robots average, filter or ignore outliers instead of trusting a single reading.",
        },
        example: {
          title: "Distance readings",
          body: "A distance sensor may report 21, 20, 47, 20 cm. The 47 is an echo error — a median of three readings removes it.",
        },
      },
      {
        id: "m4-l2",
        moduleId: "m4",
        title: "Actuators and Output",
        objectives: [
          "Compare motors, servos and simple indicators",
          "Explain why actuators need their own power path",
        ],
        content: lessonContent("actuators"),
        concept: {
          title: "Actuators are hungry",
          body: "Motors draw far more current than logic circuits, so they usually need a driver between the controller and the motor.",
        },
        example: {
          title: "The brown-out",
          body: "A robot that resets whenever it starts moving is almost always a power problem, not a code problem.",
        },
      },
    ],
  },
  {
    id: "m5",
    number: 5,
    title: "Motors and Movement",
    description: "Drive systems, turning, speed control and why robots rarely drive straight.",
    icon: "Cog",
    durationMinutes: 50,
    difficulty: "Intermediate",
    lessons: [
      {
        id: "m5-l1",
        moduleId: "m5",
        title: "Drive Systems and Steering",
        objectives: [
          "Describe differential drive",
          "Explain how speed difference creates a turn",
          "Identify causes of drift",
        ],
        content: lessonContent("drive systems"),
        concept: {
          title: "Differential drive",
          body: "Two independently driven wheels can move forward, reverse and turn on the spot — no steering mechanism needed.",
        },
        example: {
          title: "Turning on the spot",
          body: "Left wheel forward, right wheel reverse, equal speed: the robot rotates around its own centre.",
        },
      },
      {
        id: "m5-l2",
        moduleId: "m5",
        title: "Controlling Speed",
        objectives: [
          "Explain speed control by switching power quickly",
          "Describe the effect of friction and load on speed",
        ],
        content: lessonContent("speed control"),
        concept: {
          title: "Duty cycle",
          body: "Switching power on and off rapidly and changing the on-time ratio gives smooth, efficient speed control.",
        },
        example: {
          title: "Half speed",
          body: "Power on half the time gives roughly half speed — but on carpet the same setting may not move the robot at all.",
        },
      },
    ],
  },
  {
    id: "m6",
    number: 6,
    title: "Programming Fundamentals",
    description:
      "Sequences, conditions, loops and simple control logic used in every robot program.",
    icon: "Code2",
    durationMinutes: 70,
    difficulty: "Intermediate",
    lessons: [
      {
        id: "m6-l1",
        moduleId: "m6",
        title: "Sequence, Selection and Repetition",
        objectives: [
          "Use the three basic control structures",
          "Convert a task description into steps",
          "Predict the output of a short program",
        ],
        content: lessonContent("program control structures"),
        concept: {
          title: "Three structures are enough",
          body: "Any robot behaviour can be written with sequence, selection (if) and repetition (loop).",
        },
        example: {
          title: "Obstacle rule",
          body: "Repeat: read distance; if distance is small then turn, otherwise drive forward.",
        },
      },
      {
        id: "m6-l2",
        moduleId: "m6",
        title: "The Main Loop",
        objectives: [
          "Explain why robot programs loop forever",
          "Avoid blocking the loop with long waits",
        ],
        content: lessonContent("the robot main loop"),
        concept: {
          title: "Never block the loop",
          body: "While the program waits, the robot is blind. Short loop cycles mean faster reactions.",
        },
        example: {
          title: "A three-second wait",
          body: "A robot that waits three seconds after each turn will happily drive into a wall that appeared meanwhile.",
        },
      },
    ],
  },
];

export const allLessons = theoryModules.flatMap((m) => m.lessons);

export function getModule(id: string) {
  return theoryModules.find((m) => m.id === id);
}

export function getLesson(id: string) {
  return allLessons.find((l) => l.id === id);
}

export function getModuleForLesson(lessonId: string) {
  return theoryModules.find((m) => m.lessons.some((l) => l.id === lessonId));
}
