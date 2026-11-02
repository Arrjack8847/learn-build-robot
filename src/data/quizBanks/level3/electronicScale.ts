/** Verified against original Level 3 Learning PDF, with 1-based source slides. */
import type { QuizBank } from "../../quizStudio";

export const electronicScaleBank: QuizBank = {
  "projectId": "level-3-electronic-scale",
  "title": "Electronic Scale",
  "sourcePdfPath": "public/Level 3/Learning/Manipulators/Electronic scale.pdf",
  "sourcePageCount": 27,
  "questions": [
    {
      "id": "electronicsca-01",
      "topic": "levers",
      "learningSlide": 4,
      "prompt": "Which physical principle does a steelyard scale use?",
      "choices": [
        "Leverage",
        "Ultrasonic reflection",
        "Gear acceleration only",
        "Magnetic induction only"
      ],
      "correctIndex": 0,
      "hint": "Compare equal-arm balances with unequal-arm steelyards.",
      "explanation": "Slide 4 describes the steelyard as a lever-based weighing instrument."
    },
    {
      "id": "electronicsca-02",
      "topic": "levers",
      "learningSlide": 5,
      "prompt": "How does a steelyard differ from an equal-arm balance?",
      "choices": [
        "Both arms are exactly equal",
        "Its lever arms are unequal",
        "It uses no counterweight",
        "It operates without a fulcrum"
      ],
      "correctIndex": 1,
      "hint": "Compare equal-arm balances with unequal-arm steelyards.",
      "explanation": "Slide 5 distinguishes unequal-arm steelyards from equal-arm balances."
    },
    {
      "id": "electronicsca-03",
      "topic": "weights",
      "learningSlide": 5,
      "prompt": "What is adjusted to balance the object on a steelyard?",
      "choices": [
        "The controller's speaker volume",
        "The object's color",
        "The position of a known weight",
        "The number of gear teeth"
      ],
      "correctIndex": 2,
      "hint": "Think about how a sliding counterweight changes balance.",
      "explanation": "Slide 5 explains sliding known weights to balance the scale."
    },
    {
      "id": "electronicsca-04",
      "topic": "weights",
      "learningSlide": 4,
      "prompt": "How many known counterweight objects does the simple steelyard example need?",
      "choices": [
        "Two on each end",
        "Six",
        "None",
        "One"
      ],
      "correctIndex": 3,
      "hint": "Think about how a sliding counterweight changes balance.",
      "explanation": "Slide 4 says it uses one known weight object."
    },
    {
      "id": "electronicsca-05",
      "topic": "infrared",
      "learningSlide": 6,
      "prompt": "Which sensor detects the movable counterweight's position in the electronic model?",
      "choices": [
        "Infrared sensor",
        "Barometric sensor",
        "Microphone",
        "Temperature sensor"
      ],
      "correctIndex": 0,
      "hint": "A sensor can track the position of a movable part.",
      "explanation": "Slide 6 proposes an infrared sensor to detect the moving weight position."
    },
    {
      "id": "electronicsca-06",
      "topic": "infrared",
      "learningSlide": 23,
      "prompt": "What is measured first using the debugger before programming the scale?",
      "choices": [
        "The battery's manufacture date",
        "The infrared sensor's reading range",
        "The number of speaker tones",
        "The motor's maximum altitude"
      ],
      "correctIndex": 1,
      "hint": "A sensor can track the position of a movable part.",
      "explanation": "Slide 23 instructs finding the infrared sensor's reading range."
    },
    {
      "id": "electronicsca-07",
      "topic": "program",
      "learningSlide": 24,
      "prompt": "Which programming block stores the measured infrared reading?",
      "choices": [
        "Sound waveform block",
        "Motor reverse block",
        "Variable block",
        "Robot reset block"
      ],
      "correctIndex": 2,
      "hint": "The lesson stores a reading before showing it.",
      "explanation": "Slide 24 stores infrared sensor data in a variable."
    },
    {
      "id": "electronicsca-08",
      "topic": "program",
      "learningSlide": 24,
      "prompt": "Which output presents the scale's sensor reading to the learner?",
      "choices": [
        "Drive motor shaft",
        "Wheel axle",
        "Infrared emitting diode",
        "Controller screen"
      ],
      "correctIndex": 3,
      "hint": "The lesson stores a reading before showing it.",
      "explanation": "Slide 24 displays the stored reading using a screen-display module."
    },
    {
      "id": "electronicsca-09",
      "topic": "calibration",
      "learningSlide": 5,
      "prompt": "When should a steelyard's reading be taken?",
      "choices": [
        "When the lever is balanced",
        "During uncontrolled swinging",
        "Before the weight is placed",
        "While the counterweight is removed"
      ],
      "correctIndex": 0,
      "hint": "The model needs a measured range before useful display.",
      "explanation": "Slide 5 states that mass is read from the scale after reaching balance."
    },
    {
      "id": "electronicsca-10",
      "topic": "calibration",
      "learningSlide": 26,
      "prompt": "What additional feedback task is suggested for the expression screen?",
      "choices": [
        "Disable all readings",
        "Show a symbol when the sensor reading exceeds a selected value",
        "Stop the robot without conditions",
        "Record the color of the counterweight"
      ],
      "correctIndex": 1,
      "hint": "The model needs a measured range before useful display.",
      "explanation": "Slide 26 proposes showing symbols after checking a threshold."
    }
  ]
};
