import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 26-page Learning PDF. */
export const punchHardBank: QuizBank = {
  "projectId": "level-6-punch-hard",
  "title": "Punch Hard",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/Punch Hard/7. Punch Hard - Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "ph-01",
      "topic": "four-bar-linkage",
      "learningSlide": 6,
      "prompt": "What geometric shape is formed by the parallel four-bar mechanism?",
      "choices": [
        "A parallelogram",
        "A pentagon",
        "A circle",
        "A triangle"
      ],
      "correctIndex": 0,
      "hint": "Opposing rods stay parallel.",
      "explanation": "Slide 6 describes a four-rod parallelogram structure."
    },
    {
      "id": "ph-02",
      "topic": "four-bar-linkage",
      "learningSlide": 6,
      "prompt": "What can a parallel four-bar linkage transmit between rods?",
      "choices": [
        "A digital password",
        "Rotation or swinging motion",
        "A colour label",
        "Temperature readings"
      ],
      "correctIndex": 1,
      "hint": "The linkage transfers movement mechanically.",
      "explanation": "Slide 6 says the structure transmits rotation or swinging."
    },
    {
      "id": "ph-03",
      "topic": "motion-sequence",
      "learningSlide": 9,
      "prompt": "What powers the boxing robot's movement?",
      "choices": [
        "A temperature sensor",
        "A barcode camera",
        "Large motors",
        "A dot-matrix pattern"
      ],
      "correctIndex": 2,
      "hint": "The model needs mechanical actuation.",
      "explanation": "Slide 9 identifies large motors as power for movement."
    },
    {
      "id": "ph-04",
      "topic": "motion-sequence",
      "learningSlide": 10,
      "prompt": "What is the planned order of the basic boxing robot program?",
      "choices": [
        "Return, stop, then learn a colour",
        "Show a QR code, lock, then beep",
        "Fly, turn, then land",
        "Move forward, punch, then return"
      ],
      "correctIndex": 3,
      "hint": "The robot performs an attack and returns to position.",
      "explanation": "Slide 10 shows forward movement, punch attack and return."
    },
    {
      "id": "ph-05",
      "topic": "custom-functions",
      "learningSlide": 15,
      "prompt": "Why would students create a custom function block?",
      "choices": [
        "To reuse repeated program steps and simplify the main program",
        "To disable sensor input permanently",
        "To erase all parameter values",
        "To make a gearbox mechanically larger"
      ],
      "correctIndex": 0,
      "hint": "Repeated operations should be reusable.",
      "explanation": "Slide 15 describes grouping repeated instructions into custom functions."
    },
    {
      "id": "ph-06",
      "topic": "custom-functions",
      "learningSlide": 17,
      "prompt": "What advantage comes from adding parameters to a custom forward-motion function?",
      "choices": [
        "It can run without a controller",
        "Its motion can be changed when called",
        "It stops supporting repeated calls",
        "It turns a motor into a colour sensor"
      ],
      "correctIndex": 1,
      "hint": "Parameters make a function adjustable.",
      "explanation": "Slide 17 asks for a callable forward program with modifiable parameters."
    },
    {
      "id": "ph-07",
      "topic": "robot-reliability",
      "learningSlide": 13,
      "prompt": "Which mechanical problem does the lesson ask students to investigate?",
      "choices": [
        "A missing QR code",
        "An overflowing item list",
        "An arm getting stuck",
        "An inaccurate weather forecast"
      ],
      "correctIndex": 2,
      "hint": "The robot's physical motion may become jammed.",
      "explanation": "Slide 13 raises stuck arms and unstable structures."
    },
    {
      "id": "ph-08",
      "topic": "robot-reliability",
      "learningSlide": 19,
      "prompt": "What gear change is proposed during optimization?",
      "choices": [
        "Remove every gear from the model",
        "Turn a gear into a camera lens",
        "Replace the motor with a paper wheel",
        "Replace an acceleration gear with a reduction gear"
      ],
      "correctIndex": 3,
      "hint": "The task explores changing the transmission.",
      "explanation": "Slide 19 asks students to change an acceleration gear to reduction."
    },
    {
      "id": "ph-09",
      "topic": "advanced-moves",
      "learningSlide": 20,
      "prompt": "How can different punches and movements be combined more easily?",
      "choices": [
        "Use custom blocks for movement and punching actions",
        "Write every motion only as one fixed endless command",
        "Ignore all program functions",
        "Let the joystick send QR payments"
      ],
      "correctIndex": 0,
      "hint": "Separate reusable behaviours into actions.",
      "explanation": "Slide 20 uses custom blocks to combine movements and punches."
    },
    {
      "id": "ph-10",
      "topic": "advanced-moves",
      "learningSlide": 24,
      "prompt": "What should students explain while presenting their improved boxer?",
      "choices": [
        "Only the workbook page number",
        "Building and programming problems and solutions",
        "Only the school address",
        "Only which sport is on TV"
      ],
      "correctIndex": 1,
      "hint": "A good demonstration includes design reasoning.",
      "explanation": "Slide 24 asks for problems, solutions and a running demonstration."
    }
  ]
};
