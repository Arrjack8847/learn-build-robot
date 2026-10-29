/** Official Learning PDF text checked, source slides use 1-based page numbers. */
import type { QuizBank } from "../../quizStudio";

export const fireLadderBank: QuizBank = {
  "projectId": "level-3-fire-ladder",
  "title": "Fire Ladder",
  "sourcePdfPath": "public/Level 3/Learning/Mechanisms and Concepts/Fire ladder.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "fireladder-01",
      "topic": "purpose",
      "learningSlide": 6,
      "prompt": "What is a ladder fire truck particularly useful for?",
      "choices": [
        "Reaching high-rise fire locations",
        "Measuring water quality",
        "Transporting goods underground",
        "Creating road markings"
      ],
      "correctIndex": 0,
      "hint": "Consider reaching places above street level.",
      "explanation": "Slide 6 highlights ladder fire trucks for high-rise fires."
    },
    {
      "id": "fireladder-02",
      "topic": "purpose",
      "learningSlide": 6,
      "prompt": "Why does a high-rise fire require an extendable ladder rather than an ordinary low vehicle?",
      "choices": [
        "Its wheels need to become lighter",
        "The ladder must reach an elevated location",
        "The vehicle must avoid any moving mechanism",
        "A color sensor cannot read the building"
      ],
      "correctIndex": 1,
      "hint": "Consider reaching places above street level.",
      "explanation": "Slide 6 connects fire ladders with reaching tall-building fire locations."
    },
    {
      "id": "fireladder-03",
      "topic": "structure",
      "learningSlide": 7,
      "prompt": "Which geometric linkage property is used to build an adjustable fire ladder?",
      "choices": [
        "A rigid triangle changes angle without moving joints",
        "A square cannot change any angle",
        "A quadrilateral can change shape",
        "A circle has four hinged corners"
      ],
      "correctIndex": 2,
      "hint": "Think about the movable shape of a four-sided frame.",
      "explanation": "Slide 7 proposes deformable quadrilateral linkages for raising and lowering."
    },
    {
      "id": "fireladder-04",
      "topic": "structure",
      "learningSlide": 7,
      "prompt": "What movement should the quadrilateral ladder structure allow?",
      "choices": [
        "Only side-to-side steering",
        "Continuous wheel rotation with no elevation",
        "Rotating a fan without moving the ladder",
        "Raising and lowering"
      ],
      "correctIndex": 3,
      "hint": "Think about the movable shape of a four-sided frame.",
      "explanation": "Slide 7 explores a movable quadrilateral structure for changing ladder height."
    },
    {
      "id": "fireladder-05",
      "topic": "movement",
      "learningSlide": 22,
      "prompt": "Which two methods does Task 1 use to control ladder movement?",
      "choices": [
        "Time control and angle control",
        "Brightness and temperature only",
        "Buzzer volume and music length",
        "Color selection and text size"
      ],
      "correctIndex": 0,
      "hint": "The lesson uses programming to control ladder position.",
      "explanation": "Slide 22 names time and angle control for operating the ladder."
    },
    {
      "id": "fireladder-06",
      "topic": "movement",
      "learningSlide": 22,
      "prompt": "How can a programmer limit the motion of a motor-driven ladder?",
      "choices": [
        "Let the motor run without any condition",
        "Use timed or angle-limited movement",
        "Disconnect the motor controller",
        "Use random speed commands only"
      ],
      "correctIndex": 1,
      "hint": "The lesson uses programming to control ladder position.",
      "explanation": "Slide 22 demonstrates time and angle control for ladder operation."
    },
    {
      "id": "fireladder-07",
      "topic": "sensor",
      "learningSlide": 23,
      "prompt": "Which sensor is suggested to stop the ladder at a specified height?",
      "choices": [
        "Touch display",
        "Microphone only",
        "Infrared sensor",
        "Temperature gauge"
      ],
      "correctIndex": 2,
      "hint": "An external distance or position cue can end an operation.",
      "explanation": "Slide 23 adds an infrared sensor to detect when the ladder reaches a height."
    },
    {
      "id": "fireladder-08",
      "topic": "sensor",
      "learningSlide": 23,
      "prompt": "What should the ladder do when the selected height is reached?",
      "choices": [
        "Accelerate upward",
        "Ignore the height reading",
        "Begin spinning its wheels",
        "Stop rising"
      ],
      "correctIndex": 3,
      "hint": "An external distance or position cue can end an operation.",
      "explanation": "Slide 23 asks for an infrared-based stop at a selected height."
    },
    {
      "id": "fireladder-09",
      "topic": "test",
      "learningSlide": 24,
      "prompt": "What does the lesson's evaluation ask learners to identify?",
      "choices": [
        "The mechanisms and sensors used in the design",
        "Only the number of pictures on the screen",
        "Only the project's name",
        "Only the battery color"
      ],
      "correctIndex": 0,
      "hint": "The model's movement should be reviewed against its target.",
      "explanation": "Slide 24 assesses the structure and sensors used."
    },
    {
      "id": "fireladder-10",
      "topic": "test",
      "learningSlide": 25,
      "prompt": "What does the project summary say the downloaded program controls?",
      "choices": [
        "The ladder's printed page",
        "Motor rotation",
        "Building illumination only",
        "The fire truck's real fuel system"
      ],
      "correctIndex": 1,
      "hint": "The model's movement should be reviewed against its target.",
      "explanation": "Slide 25 summarizes programmed motor rotation."
    }
  ]
};
