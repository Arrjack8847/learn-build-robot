/** Source-checked Level 3 Learning PDF questions; page references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const automaticSeesawBank: QuizBank = {
  "projectId": "level-3-automatic-seesaw",
  "title": "Automatic Seesaw",
  "sourcePdfPath": "public/Level 3/Learning/Automation & Security/Automatic Seesaw/24. Automatic Seesaw.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "seesaw-01",
      "topic": "seesaw-use",
      "learningSlide": 4,
      "prompt": "How many people does the lesson describe cooperating on a traditional seesaw?",
      "choices": [
        "Two",
        "One",
        "Four",
        "Ten"
      ],
      "correctIndex": 0,
      "hint": "Think about riders on opposite sides.",
      "explanation": "Slide 4 describes a seesaw game that requires two people."
    },
    {
      "id": "seesaw-02",
      "topic": "seesaw-use",
      "learningSlide": 6,
      "prompt": "What helps riders take turns moving up and down?",
      "choices": [
        "Keeping their feet raised forever",
        "Pushing against the ground with their feet",
        "Removing the central support",
        "Sitting together on one end"
      ],
      "correctIndex": 1,
      "hint": "The lower person pushes to rise.",
      "explanation": "Slide 6 explains that riders push against the ground in turn."
    },
    {
      "id": "seesaw-03",
      "topic": "leverage",
      "learningSlide": 8,
      "prompt": "Which mechanical principle makes a seesaw work?",
      "choices": [
        "Magnetic induction",
        "Light reflection",
        "Leverage",
        "Sound amplification"
      ],
      "correctIndex": 2,
      "hint": "A seesaw is a simple lever.",
      "explanation": "Slide 8 states the seesaw works on the principle of leverage."
    },
    {
      "id": "seesaw-04",
      "topic": "leverage",
      "learningSlide": 8,
      "prompt": "What is one benefit of the lever principle?",
      "choices": [
        "Making objects permanently weightless",
        "Creating fuel",
        "Removing all support points",
        "Helping move heavy objects"
      ],
      "correctIndex": 3,
      "hint": "Think about lifting a heavy load with a lever.",
      "explanation": "Slide 8 says leverage can help people transport heavy objects."
    },
    {
      "id": "seesaw-05",
      "topic": "lever-parts",
      "learningSlide": 10,
      "prompt": "What do we call the support point around which a lever turns?",
      "choices": [
        "Fulcrum",
        "Threshold",
        "Battery port",
        "Encoder"
      ],
      "correctIndex": 0,
      "hint": "The lever rotates around a pivot.",
      "explanation": "Slide 10 names the fulcrum as the pivot point."
    },
    {
      "id": "seesaw-06",
      "topic": "lever-parts",
      "learningSlide": 10,
      "prompt": "How are the power arm and resistance arm described in this model?",
      "choices": [
        "Only one arm exists",
        "Equal in length",
        "Resistance arm is always twice as long",
        "They are separate from the lever"
      ],
      "correctIndex": 1,
      "hint": "The lesson specifies an equal-armed lever.",
      "explanation": "Slide 10 says the model uses equal-length power and resistance arms."
    },
    {
      "id": "seesaw-07",
      "topic": "touch-sensor",
      "learningSlide": 13,
      "prompt": "What triggers the motor rotation in the automatic seesaw?",
      "choices": [
        "A microphone",
        "A color screen",
        "A touch sensor",
        "A light bulb"
      ],
      "correctIndex": 2,
      "hint": "The model detects contact with the table.",
      "explanation": "Slide 13 says contact triggers the touch sensor and then the motor."
    },
    {
      "id": "seesaw-08",
      "topic": "touch-sensor",
      "learningSlide": 13,
      "prompt": "What does the motor do after the touch sensor is triggered?",
      "choices": [
        "Measures temperature",
        "Plays a music file",
        "Keeps the mechanism still",
        "Rotates a connecting rod downward for a kicking action"
      ],
      "correctIndex": 3,
      "hint": "Think about the moving link attached to the motor.",
      "explanation": "Slide 13 describes the rod rotating downward to produce a kicking motion."
    },
    {
      "id": "seesaw-09",
      "topic": "motor-programming",
      "learningSlide": 14,
      "prompt": "Why should the first program avoid setting the motor speed too high?",
      "choices": [
        "To allow normal operation",
        "To stop the sensor detecting contact",
        "To erase the program",
        "To lengthen the lever arm"
      ],
      "correctIndex": 0,
      "hint": "The slide connects sensible speed with proper operation.",
      "explanation": "Slide 14 cautions against too-high motor speed for normal operation."
    },
    {
      "id": "seesaw-10",
      "topic": "motor-programming",
      "learningSlide": 15,
      "prompt": "What change turns kicking into retraction?",
      "choices": [
        "Removing the fulcrum",
        "Reversing motor rotation direction",
        "Changing the table color",
        "Permanently disabling the touch sensor"
      ],
      "correctIndex": 1,
      "hint": "The lesson reverses the moving mechanism.",
      "explanation": "Slide 15 instructs reversing motor direction to switch kicking and retracting."
    }
  ]
};
