/** Question facts and 1-based slide references reviewed against the official 22-page Level 6 Learning PDF text. */
import type { QuizBank } from "../../quizStudio";

export const fingerGuessingRobotBank: QuizBank = {
  "projectId": "level-6-finger-guessing-robot",
  "title": "Finger-guessing Robot",
  "sourcePdfPath": "public/Level 6/Learning/Interactive Mechanisms/Finger-guessing Robot/04.Finger-guessing Robot.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "fingerg-01",
      "learningSlide": 4,
      "topic": "gesture-types",
      "prompt": "Which example is a dynamic gesture in the lesson?",
      "choices": [
        "A fixed scissors pose",
        "A stationary hand sign",
        "Waving a hand",
        "Holding a still fist"
      ],
      "correctIndex": 2,
      "hint": "Dynamic gestures involve change over time.",
      "explanation": "Slide 4 identifies waving as a changing, dynamic gesture."
    },
    {
      "id": "fingerg-02",
      "learningSlide": 4,
      "topic": "gesture-types",
      "prompt": "Which gesture is described as static in the lesson?",
      "choices": [
        "Waving an arm repeatedly",
        "Holding a scissors hand sign",
        "Moving a hand in a circle",
        "Repeatedly raising a hand"
      ],
      "correctIndex": 1,
      "hint": "Think about whether the hand maintains a fixed shape.",
      "explanation": "Slide 4 uses the scissors hand pose as an example of a static gesture."
    },
    {
      "id": "fingerg-03",
      "learningSlide": 7,
      "topic": "gesture-recognition",
      "prompt": "What does the AI audio-visual module send back after it recognizes a supported hand gesture?",
      "choices": [
        "The controller's current temperature",
        "The motor's rotation count",
        "A saved photograph only",
        "A gesture ID value"
      ],
      "correctIndex": 3,
      "hint": "The program needs a compact value it can compare against other data.",
      "explanation": "Slide 7 says the module returns an ID value corresponding to the recognized gesture."
    },
    {
      "id": "fingerg-04",
      "learningSlide": 7,
      "topic": "gesture-recognition",
      "prompt": "Which three gestures are built into the lesson's recognition model?",
      "choices": [
        "Rock, paper and scissors",
        "Stop, slow and turn left",
        "Up, down and rotate",
        "Jump, crouch and wave"
      ],
      "correctIndex": 0,
      "hint": "Think about the traditional three-choice hand game.",
      "explanation": "Slide 7 lists rock, paper and scissors as the module's three built-in gesture models."
    },
    {
      "id": "fingerg-05",
      "learningSlide": 10,
      "topic": "robot-hardware",
      "prompt": "Which ports connect the two motors used by the finger-guessing robot?",
      "choices": [
        "P1 and P2",
        "M1 and M2",
        "USB1 and USB2",
        "P7 and P8"
      ],
      "correctIndex": 1,
      "hint": "Motor port labels differ from the AI module's sensor port.",
      "explanation": "Slide 10 specifies M1 and M2 as the two motor connections."
    },
    {
      "id": "fingerg-06",
      "learningSlide": 10,
      "topic": "robot-hardware",
      "prompt": "To which controller port does the AI audio-visual module connect?",
      "choices": [
        "M1",
        "M2",
        "P8",
        "P1"
      ],
      "correctIndex": 2,
      "hint": "Find the separate port given for the vision-based module.",
      "explanation": "Slide 10 specifies port P8 for the AI audio-visual module."
    },
    {
      "id": "fingerg-07",
      "learningSlide": 11,
      "topic": "opponent-simulation",
      "prompt": "What range of random numbers represents the second player's hand choice?",
      "choices": [
        "1 through 3",
        "0 through 9",
        "10 through 20",
        "100 through 200"
      ],
      "correctIndex": 0,
      "hint": "The game's possible choices are represented by a small number of values.",
      "explanation": "Slide 11 says the controller creates a random number from 1 to 3 for comparison with the gesture ID."
    },
    {
      "id": "fingerg-08",
      "learningSlide": 11,
      "topic": "opponent-simulation",
      "prompt": "How does the game calculate its result value X according to the lesson?",
      "choices": [
        "Random number plus motor speed",
        "Motor speed minus temperature",
        "ID multiplied by light level",
        "Recognized gesture ID minus the random number"
      ],
      "correctIndex": 3,
      "hint": "The two comparison amounts are the recognized ID and the computer's selected value.",
      "explanation": "Slide 11 gives the calculation as gesture ID minus the random number."
    },
    {
      "id": "fingerg-09",
      "learningSlide": 13,
      "topic": "outcome-decision",
      "prompt": "What outcome does the robot show when the comparison result equals zero?",
      "choices": [
        "You won",
        "You lost",
        "A draw",
        "Sensor error"
      ],
      "correctIndex": 2,
      "hint": "Two identical game choices have no winner.",
      "explanation": "Slide 13 defines a result of 0 as a draw."
    },
    {
      "id": "fingerg-10",
      "learningSlide": 13,
      "topic": "outcome-decision",
      "prompt": "According to the lesson's comparison rules, which result values mean the user won?",
      "choices": [
        "1 or -2",
        "-1 or 2",
        "0 or 1",
        "0 or -2"
      ],
      "correctIndex": 1,
      "hint": "The slide groups the two nonzero winning cases together.",
      "explanation": "Slide 13 states that results of -1 or 2 represent a win. The slide's ID table is internally inconsistent, so this item tests only the stated result rule."
    }
  ]
};
