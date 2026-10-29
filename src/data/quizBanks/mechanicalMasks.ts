/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const mechanicalMasksBank: QuizBank = {
  "projectId": "mechanical-masks",
  "title": "Mechanical Masks",
  "sourcePdfPath": "public/Level 1/Learning/Display & Movement/Mechanical masks/Mechanical masks_PowerPoint-R.pdf",
  "sourcePageCount": 15,
  "questions": [
    {
      "id": "mechanical-masks-01",
      "topic": "project-theme",
      "learningSlide": 5,
      "prompt": "What is a mask described as in the lesson?",
      "choices": [
        "A machine for measuring speed",
        "A robot's charging connector",
        "A kind of gear axle",
        "A covering for all or part of the face"
      ],
      "correctIndex": 3,
      "hint": "Recall what people wear or place over the face.",
      "explanation": "The lesson defines a mask as a covering for all or part of the face."
    },
    {
      "id": "mechanical-masks-02",
      "topic": "project-theme",
      "learningSlide": 6,
      "prompt": "Why might a mask include a special pattern?",
      "choices": [
        "Camouflage or decoration",
        "Motor cooling",
        "Battery recharging",
        "Ultrasonic measurement"
      ],
      "correctIndex": 0,
      "hint": "Think about the appearance-related purposes in the introduction.",
      "explanation": "The mask design discussion names camouflage and decorative appearance."
    },
    {
      "id": "mechanical-masks-03",
      "topic": "design-features",
      "learningSlide": 6,
      "prompt": "Which part of a person's appearance should the model mask resemble?",
      "choices": [
        "Elbow position",
        "Facial features",
        "Shoe size",
        "Fingerprints only"
      ],
      "correctIndex": 1,
      "hint": "Think about how the model looks like a face.",
      "explanation": "The lesson asks students to represent facial features of the wearer."
    },
    {
      "id": "mechanical-masks-04",
      "topic": "design-features",
      "learningSlide": 8,
      "prompt": "Which is a category of mask type mentioned in the lesson?",
      "choices": [
        "Engine type",
        "Crane type",
        "Placed type",
        "Submarine type"
      ],
      "correctIndex": 2,
      "hint": "Recall the lesson's two ways a mask can be used.",
      "explanation": "The slide lists placed and wearing types."
    },
    {
      "id": "mechanical-masks-05",
      "topic": "mask-types",
      "learningSlide": 8,
      "prompt": "Which component helps hold a wearable mask in place?",
      "choices": [
        "A large drive motor",
        "A water propeller",
        "An infrared distance sensor",
        "A wearing fixture"
      ],
      "correctIndex": 3,
      "hint": "Think about how the mask stays attached to the wearer.",
      "explanation": "The teaching slide includes a wearing fixture as a mask structure."
    },
    {
      "id": "mechanical-masks-06",
      "topic": "mask-types",
      "learningSlide": 9,
      "prompt": "Which part is suggested for making a stable mask base?",
      "choices": [
        "Large beam parts",
        "Small loose paper scraps",
        "Only tiny gears with no support",
        "A bare power cord"
      ],
      "correctIndex": 0,
      "hint": "Think about keeping the model's center of gravity stable.",
      "explanation": "The mask lesson recommends larger beam parts for the base."
    },
    {
      "id": "mechanical-masks-07",
      "topic": "part-roles",
      "learningSlide": 9,
      "prompt": "What can connect the neck to the head while changing connection direction?",
      "choices": [
        "A loudspeaker",
        "Blocks and peg parts",
        "Only the display screen",
        "A paint brush"
      ],
      "correctIndex": 1,
      "hint": "Recall the connecting components named on the slide.",
      "explanation": "Blocks and pegs are suggested to change direction at the neck connection.",
      "image": {
        "src": "/quiz-visuals/level1/mechanical-masks.svg",
        "alt": "Robot mask with two round gears used as eyes."
      }
    },
    {
      "id": "mechanical-masks-08",
      "topic": "part-roles",
      "learningSlide": 9,
      "prompt": "Which part might represent the eyes in a mechanical mask?",
      "choices": [
        "Battery labels",
        "Flat power switches",
        "Gear parts",
        "Charging ports"
      ],
      "correctIndex": 2,
      "hint": "The model uses similarly shaped construction pieces.",
      "explanation": "The lesson gives gears as parts that can represent eyes.",
      "image": {
        "src": "/quiz-visuals/level1/mechanical-masks.svg",
        "alt": "Robot mask with two round gears used as eyes."
      }
    },
    {
      "id": "mechanical-masks-09",
      "topic": "assembly-quality",
      "learningSlide": 11,
      "prompt": "What is an assembly requirement for the mask model?",
      "choices": [
        "Unsecured supports",
        "Any shape regardless of the design",
        "Deliberately poor balance",
        "Stable structure"
      ],
      "correctIndex": 3,
      "hint": "Think about the standard building checklist.",
      "explanation": "The task asks for a stable model."
    },
    {
      "id": "mechanical-masks-10",
      "topic": "assembly-quality",
      "learningSlide": 11,
      "prompt": "What does the lesson require besides stability and shape matching?",
      "choices": [
        "Proper gravity/balance",
        "Maximum movement speed",
        "Bluetooth pairing",
        "A camera feed"
      ],
      "correctIndex": 0,
      "hint": "Recall the middle quality requirement for building.",
      "explanation": "The checklist names proper gravity/balance alongside stability and shape."
    }
  ]
};
