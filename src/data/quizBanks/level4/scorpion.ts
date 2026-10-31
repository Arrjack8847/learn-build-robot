/** Level 4 — Scorpion. Questions checked against the 20-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const scorpionBank: QuizBank = {
  "projectId": "level-4-scorpion",
  "title": "Scorpion",
  "sourcePdfPath": "public/Level 4/Interactive Mechanisms/Scorpion/Scorpion_Powerpoint-update.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "l4-scorpion-01",
      "topic": "scorpion-behavior",
      "learningSlide": 7,
      "prompt": "What does the Scorpion robot do when its touch sensor is pressed by an obstacle?",
      "choices": [
        "Print a ticket",
        "Follow a QR code",
        "Measure the weather",
        "Perform a scorpion-like action"
      ],
      "correctIndex": 3,
      "explanation": "Slide 7 describes a touch sensor that triggers the scorpion's action.",
      "hint": "Think about the robot reacting to contact."
    },
    {
      "id": "l4-scorpion-02",
      "topic": "scorpion-behavior",
      "learningSlide": 9,
      "prompt": "What can the Scorpion robot do after finding an obstacle?",
      "choices": [
        "Open a curtain",
        "Back away and turn",
        "Keep driving into it",
        "Stop sensing forever"
      ],
      "correctIndex": 1,
      "explanation": "Slide 9 describes finding an obstacle, backing up, turning, and continuing.",
      "hint": "Think about a movement that avoids a collision."
    },
    {
      "id": "l4-scorpion-03",
      "topic": "contact-sensors",
      "learningSlide": 2,
      "prompt": "Which sensor is the main focus of the Scorpion lesson?",
      "choices": [
        "Ultrasonic sensor",
        "Temperature sensor",
        "Touch sensor",
        "Color sensor"
      ],
      "correctIndex": 2,
      "explanation": "Slide 2 explicitly names touch-sensor use as a learning goal.",
      "hint": "Think about a sensor that is activated by contact."
    },
    {
      "id": "l4-scorpion-04",
      "topic": "contact-sensors",
      "learningSlide": 7,
      "prompt": "When does a touch sensor signal an obstacle in this model?",
      "choices": [
        "When something presses it",
        "When the room gets brighter",
        "When a motor plays music",
        "When a QR code appears"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 says an obstacle presses the touch sensor.",
      "hint": "Think about how a physical switch reacts."
    },
    {
      "id": "l4-scorpion-05",
      "topic": "programmed-turns",
      "learningSlide": 16,
      "prompt": "In the P1 obstacle example, which direction does the robot turn after backing up?",
      "choices": [
        "Left",
        "Upward",
        "Right",
        "Straight"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 specifies back for one second, then turn left for a P1 signal.",
      "hint": "Recall the programmed response to P1."
    },
    {
      "id": "l4-scorpion-06",
      "topic": "programmed-turns",
      "learningSlide": 17,
      "prompt": "In the P2 obstacle example, which way does the robot turn?",
      "choices": [
        "No movement",
        "Left",
        "Right",
        "Backward only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 17 specifies backing up and then turning right for a P2 signal.",
      "hint": "Compare the responses for the two touch sensors."
    },
    {
      "id": "l4-scorpion-07",
      "topic": "conditional-decisions",
      "learningSlide": 10,
      "prompt": "Why does the Scorpion program check conditions from its sensors?",
      "choices": [
        "To reduce wheel size",
        "To choose the right movement",
        "To change its paint color",
        "To show a calendar"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 introduces multiple conditional judgments for different touch-sensor signals.",
      "hint": "The robot must decide what to do based on its inputs."
    },
    {
      "id": "l4-scorpion-08",
      "topic": "conditional-decisions",
      "learningSlide": 3,
      "prompt": "Which programming idea is identified as a learning difficulty?",
      "choices": [
        "Writing music lyrics",
        "Drawing photographs",
        "Reading weather maps",
        "Conditional judgments"
      ],
      "correctIndex": 3,
      "explanation": "Slide 3 explicitly names conditional judgments.",
      "hint": "Think about an instruction that checks whether something happened."
    },
    {
      "id": "l4-scorpion-09",
      "topic": "assembly-and-testing",
      "learningSlide": 12,
      "prompt": "Which requirement matters when building the Scorpion robot?",
      "choices": [
        "A loose motor",
        "An unstable frame",
        "A stable structure",
        "No support"
      ],
      "correctIndex": 2,
      "explanation": "Slide 12 lists structural stability as an assembly requirement.",
      "hint": "A moving model should hold together."
    },
    {
      "id": "l4-scorpion-10",
      "topic": "assembly-and-testing",
      "learningSlide": 15,
      "prompt": "In the first movement exercise, how long should the Scorpion robot move forward?",
      "choices": [
        "2 seconds",
        "5 seconds",
        "10 seconds",
        "1 second"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 specifies two seconds of forward movement before backing up.",
      "hint": "Recall the first timed motion in the task."
    }
  ]
};
