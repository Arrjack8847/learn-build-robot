/** Verified against Level 2 Rotating flying chair Learning PDF source slides. */
import type { QuizBank } from "../../quizStudio";
export const rotatingFlyingChairBank: QuizBank = {
  "projectId": "level-2-rotating-flying-chair",
  "title": "Rotating flying chair",
  "sourcePdfPath": "public/Level 2/Learning/Action-Oriented/Rotating flying chair/Rotating flying chair_Powerpoint.pdf",
  "sourcePageCount": 15,
  "questions": [
    {
      "id": "fc01",
      "topic": "gear-ratio",
      "learningSlide": 6,
      "prompt": "What does a transmission gear ratio compare?",
      "choices": [
        "Input and output rotational speeds",
        "Motor colors and controller lights",
        "Battery charge and room temperature",
        "Mass and fluid volume"
      ],
      "correctIndex": 0,
      "hint": "The lesson defines a ratio between driving and driven rotation.",
      "explanation": "Slide 6 defines transmission ratio through input/output angular or rotational speeds."
    },
    {
      "id": "fc02",
      "topic": "gear-ratio",
      "learningSlide": 7,
      "prompt": "What gear ratio is specified for the lesson's rotating flying chair model?",
      "choices": [
        "1:1",
        "1:2",
        "2:1",
        "4:1"
      ],
      "correctIndex": 0,
      "hint": "A constant-speed transmission has a simple ratio.",
      "explanation": "Slide 7 specifies a 1:1 constant-speed gear ratio."
    },
    {
      "id": "fc03",
      "topic": "gear-size-effects",
      "learningSlide": 6,
      "prompt": "When a large gear drives a smaller gear, what generally happens to the smaller gear's speed?",
      "choices": [
        "It increases",
        "It always stops",
        "It becomes zero",
        "It remains fixed regardless of teeth"
      ],
      "correctIndex": 0,
      "hint": "Compare the number of revolutions needed to pass the same number of teeth.",
      "explanation": "Slide 6 describes a large gear driving a pinion to increase speed."
    },
    {
      "id": "fc04",
      "topic": "gear-size-effects",
      "learningSlide": 10,
      "prompt": "When a pinion drives a larger gear, what is the expected speed effect?",
      "choices": [
        "Deceleration",
        "Speed increase",
        "No force transmission",
        "Instant motor shutdown"
      ],
      "correctIndex": 0,
      "hint": "Think about how more teeth affect rotations per second.",
      "explanation": "Slide 10 calls a pinion driving a large gear a deceleration arrangement."
    },
    {
      "id": "fc05",
      "topic": "teeth-and-rotations",
      "learningSlide": 9,
      "prompt": "Which relationship between gear tooth count and revolutions is taught?",
      "choices": [
        "Inversely proportional",
        "Directly proportional",
        "Always identical",
        "Entirely unrelated"
      ],
      "correctIndex": 0,
      "hint": "A gear with more teeth needs more time for a full revolution.",
      "explanation": "Slide 9 says the number of revolutions and teeth are inversely proportional."
    },
    {
      "id": "fc06",
      "topic": "teeth-and-rotations",
      "learningSlide": 9,
      "prompt": "When two gear wheels mesh, which wheel generally makes more revolutions?",
      "choices": [
        "The wheel with fewer teeth",
        "The wheel with more teeth",
        "Both must complete the same number",
        "Neither can rotate"
      ],
      "correctIndex": 0,
      "hint": "Compare how many teeth each wheel needs to turn through.",
      "explanation": "Slide 9 explains that a smaller gear turns more often than a larger meshed gear."
    },
    {
      "id": "fc07",
      "topic": "design-goal",
      "learningSlide": 2,
      "prompt": "What mechanical concept is central to the lesson's knowledge goal?",
      "choices": [
        "Transmission of power and speed ratios",
        "Air-pressure lift",
        "Light-dependent resistance",
        "Thermal expansion"
      ],
      "correctIndex": 0,
      "hint": "Look at the relationship between connected rotating components.",
      "explanation": "Slide 2 names power transmission and rotational-speed ratio as lesson goals."
    },
    {
      "id": "fc08",
      "topic": "design-goal",
      "learningSlide": 3,
      "prompt": "What does the lesson specifically focus on learning?",
      "choices": [
        "Rotation-speed ratio",
        "Programming camera images",
        "Battery chemistry",
        "Thermal conductivity"
      ],
      "correctIndex": 0,
      "hint": "Think about comparing how fast two connected gears turn.",
      "explanation": "Slide 3 identifies the rotation-speed ratio as the learning focus."
    },
    {
      "id": "fc09",
      "topic": "assembly-review",
      "learningSlide": 12,
      "prompt": "Which condition must students check on the constructed model?",
      "choices": [
        "The structure is stable",
        "Every joint can fall apart",
        "The RCU remains unsupported",
        "The motor shaft is missing"
      ],
      "correctIndex": 0,
      "hint": "A spinning model needs a secure supporting structure.",
      "explanation": "Slide 12 includes a stable structure in the assembly checklist."
    },
    {
      "id": "fc10",
      "topic": "assembly-review",
      "learningSlide": 12,
      "prompt": "Besides stability, what should be verified when the model is assembled?",
      "choices": [
        "Its shape matches the design",
        "Its lights are always red",
        "Its parts all have equal weight",
        "Its gears have no teeth"
      ],
      "correctIndex": 0,
      "hint": "Compare the built model with the intended shape.",
      "explanation": "Slide 12 lists shape matching as an assembly requirement."
    }
  ]
};
