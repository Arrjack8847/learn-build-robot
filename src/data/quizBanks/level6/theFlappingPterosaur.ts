import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 26-page Learning PDF. */
export const theFlappingPterosaurBank: QuizBank = {
  "projectId": "level-6-the-flapping-pterosaur",
  "title": "The Flapping Pterosaur",
  "sourcePdfPath": "public/Level 6/Learning/Action-Oriented/The Flapping Pterosaur/17. The Flapping Pterosaur-Teaching Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "pt-01",
      "topic": "pterosaur-model",
      "learningSlide": 8,
      "prompt": "What controls the flapping wings of the model pterosaur?",
      "choices": [
        "The motor's rotational position",
        "A scanned bank card",
        "A road-recognition camera",
        "The temperature of the classroom"
      ],
      "correctIndex": 0,
      "hint": "The model imitates wings through motor movement.",
      "explanation": "Slide 8 links wing speed and direction to motor position."
    },
    {
      "id": "pt-02",
      "topic": "pterosaur-model",
      "learningSlide": 14,
      "prompt": "What mechanical part helps transfer handle movement to the pterosaur wings?",
      "choices": [
        "A barcode scanner",
        "A linkage",
        "A rain gauge",
        "A dot-matrix password"
      ],
      "correctIndex": 1,
      "hint": "Connected moving parts drive the wings.",
      "explanation": "Slide 14 labels the linkage and wing-control handle."
    },
    {
      "id": "pt-03",
      "topic": "motor-encoder",
      "learningSlide": 10,
      "prompt": "What information does a motor encoder provide for this project?",
      "choices": [
        "A record of product names",
        "A colour classification list",
        "A record of motor rotation position",
        "The surrounding humidity"
      ],
      "correctIndex": 2,
      "hint": "The program uses angular positions for direction control.",
      "explanation": "Slide 10 explains controlling rotation through encoder values."
    },
    {
      "id": "pt-04",
      "topic": "motor-encoder",
      "learningSlide": 11,
      "prompt": "Why can restarting a motor without homing create problems?",
      "choices": [
        "The wing colour automatically changes",
        "Every sensor becomes a clock",
        "The motor must always stop working permanently",
        "The encoder's zero may correspond to a different physical position"
      ],
      "correctIndex": 3,
      "hint": "The reference position may shift between runs.",
      "explanation": "Slide 11 warns of inconsistent zero positions."
    },
    {
      "id": "pt-05",
      "topic": "initialization",
      "learningSlide": 12,
      "prompt": "Why initialize the motor when starting the program?",
      "choices": [
        "To begin each run from a consistent position and encoder value",
        "To remove every motor command",
        "To change the robot into a camera",
        "To measure road traffic"
      ],
      "correctIndex": 0,
      "hint": "A known reference makes movement repeatable.",
      "explanation": "Slide 12 recommends homing at each start."
    },
    {
      "id": "pt-06",
      "topic": "initialization",
      "learningSlide": 16,
      "prompt": "How does the initialization program know the motor has reached its starting position?",
      "choices": [
        "Wait for an unrelated QR-code payment",
        "Compare its encoder reading with the saved reference",
        "Use only the temperature reading",
        "Read a random image index"
      ],
      "correctIndex": 1,
      "hint": "Position feedback determines when homing is complete.",
      "explanation": "Slide 16 compares encoder values with a stored reference."
    },
    {
      "id": "pt-07",
      "topic": "flapping-speed",
      "learningSlide": 19,
      "prompt": "Why are absolute value and rounding operations used for stored encoder data?",
      "choices": [
        "To disable the motor entirely",
        "To increase the wingspan",
        "To produce a nonnegative integer value for storage",
        "To detect the colour yellow"
      ],
      "correctIndex": 2,
      "hint": "The controller cannot store negative encoded values as used here.",
      "explanation": "Slide 19 transforms the encoded value before saving."
    },
    {
      "id": "pt-08",
      "topic": "flapping-speed",
      "learningSlide": 20,
      "prompt": "Why is the final motor speed restricted to a range?",
      "choices": [
        "All motors must move at one fixed speed",
        "The program never reads an encoder",
        "The screen needs more pixels",
        "Encoder errors could push it above 100 or below -100"
      ],
      "correctIndex": 3,
      "hint": "Speed limits keep the command valid.",
      "explanation": "Slide 20 limits speeds because encoder error can exceed bounds."
    },
    {
      "id": "pt-09",
      "topic": "optimization",
      "learningSlide": 24,
      "prompt": "What does the pterosaur optimization task aim to improve?",
      "choices": [
        "Make wing flapping smoother and more regular",
        "Turn the project into a password lock",
        "Count paper tickets",
        "Sort products by barcode"
      ],
      "correctIndex": 0,
      "hint": "The task targets controlled wing motion.",
      "explanation": "Slide 24 calls for smoother, regular wing flapping."
    },
    {
      "id": "pt-10",
      "topic": "optimization",
      "learningSlide": 24,
      "prompt": "What speed setting is specifically mentioned in the optimization?",
      "choices": [
        "Fix motor speed permanently at zero",
        "Adjust speed to its maximum value",
        "Never use a speed variable",
        "Use only the slowest possible speed"
      ],
      "correctIndex": 1,
      "hint": "The task asks students to tune speed for suitable motion.",
      "explanation": "Slide 24 asks to adjust the speed to the maximum while keeping movement smooth."
    }
  ]
};
