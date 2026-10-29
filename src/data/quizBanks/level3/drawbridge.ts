/** Verified against original Level 3 Learning PDF, with 1-based source slides. */
import type { QuizBank } from "../../quizStudio";

export const drawbridgeBank: QuizBank = {
  "projectId": "level-3-drawbridge",
  "title": "Drawbridge",
  "sourcePdfPath": "public/Level 3/Learning/Mechanisms and Concepts/Drawbridge.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "drawbridge-01",
      "topic": "bridge",
      "learningSlide": 2,
      "prompt": "Why would a low fixed bridge block a large ship?",
      "choices": [
        "It does not provide sufficient clearance",
        "It weighs less than a tall bridge",
        "The water becomes shallow at the bridge",
        "Its roadway changes the ship's engine speed"
      ],
      "correctIndex": 0,
      "hint": "Think about why ships need an opening through the crossing.",
      "explanation": "Slide 2 discusses low bridges that allow only smaller boats to pass."
    },
    {
      "id": "drawbridge-02",
      "topic": "bridge",
      "learningSlide": 3,
      "prompt": "What does a drawbridge do to permit larger vessels to pass?",
      "choices": [
        "Raise the river water level",
        "Open its movable decks",
        "Move the ship by a motor",
        "Change the number of road lanes"
      ],
      "correctIndex": 1,
      "hint": "Think about why ships need an opening through the crossing.",
      "explanation": "Slide 3 explains that opening the bridge decks allows larger ships through."
    },
    {
      "id": "drawbridge-03",
      "topic": "control",
      "learningSlide": 5,
      "prompt": "How many motors does the model require to operate the two separate decks?",
      "choices": [
        "One shared motor without any linkage",
        "Three per deck",
        "Two",
        "No motor"
      ],
      "correctIndex": 2,
      "hint": "Consider independent control of the movable bridge decks.",
      "explanation": "Slide 5 specifies two motors to control the two decks."
    },
    {
      "id": "drawbridge-04",
      "topic": "control",
      "learningSlide": 5,
      "prompt": "Why should the two bridge decks have independent motor control?",
      "choices": [
        "Only the river current moves the decks",
        "Both decks are fixed permanently",
        "Motors are used only as lights",
        "Each deck must be opened and closed as needed"
      ],
      "correctIndex": 3,
      "hint": "Consider independent control of the movable bridge decks.",
      "explanation": "Slide 5 assigns separate motors to control different bridge decks."
    },
    {
      "id": "drawbridge-05",
      "topic": "gears",
      "learningSlide": 6,
      "prompt": "Why is a speed-reducing structure useful in a drawbridge?",
      "choices": [
        "The decks should not open and close too quickly",
        "It makes the bridge unable to move",
        "It forces cars to accelerate",
        "It eliminates the need for safe timing"
      ],
      "correctIndex": 0,
      "hint": "Think about controlling the speed of a heavy moving structure.",
      "explanation": "Slide 6 explicitly warns that the drawbridge must not move too fast."
    },
    {
      "id": "drawbridge-06",
      "topic": "gears",
      "learningSlide": 7,
      "prompt": "What mechanism is introduced to slow rotation in this drawbridge model?",
      "choices": [
        "Belt-only transmission",
        "Worm-gear mechanism",
        "A simple axle without gears",
        "An ultrasonic sensor assembly"
      ],
      "correctIndex": 1,
      "hint": "Think about controlling the speed of a heavy moving structure.",
      "explanation": "Slide 7 introduces the worm-gear mechanism and describes slow driven rotation."
    },
    {
      "id": "drawbridge-07",
      "topic": "program",
      "learningSlide": 18,
      "prompt": "What does the first coding task ask students to implement?",
      "choices": [
        "Continuous movement without stopping",
        "Only music playback",
        "Timer-based bridge switching",
        "A color-sorting routine"
      ],
      "correctIndex": 2,
      "hint": "The code must coordinate sensing and opening/closing.",
      "explanation": "Slide 18 calls for a timer-controlled bridge switch."
    },
    {
      "id": "drawbridge-08",
      "topic": "program",
      "learningSlide": 19,
      "prompt": "Which sensor should detect a ship approaching to trigger automatic drawbridge operation?",
      "choices": [
        "Barometric sensor",
        "Temperature sensor",
        "Sound volume meter",
        "Infrared sensor"
      ],
      "correctIndex": 3,
      "hint": "The code must coordinate sensing and opening/closing.",
      "explanation": "Slide 19 uses the infrared sensor to initiate automatic opening and closing."
    },
    {
      "id": "drawbridge-09",
      "topic": "build",
      "learningSlide": 7,
      "prompt": "How does the driven gear respond when the worm mechanism is turned in the lesson?",
      "choices": [
        "It turns slowly",
        "It spins infinitely faster",
        "It cannot move in either direction",
        "It moves without transmitting torque"
      ],
      "correctIndex": 0,
      "hint": "Look at the trade-off between smooth motion and safety.",
      "explanation": "Slide 7 describes slow gear movement driven by the worm."
    },
    {
      "id": "drawbridge-10",
      "topic": "build",
      "learningSlide": 21,
      "prompt": "What can the downloaded program control on the finished model?",
      "choices": [
        "Only the paper illustration",
        "Rotation of motors",
        "Only a separate phone screen",
        "Only the river's water speed"
      ],
      "correctIndex": 1,
      "hint": "Look at the trade-off between smooth motion and safety.",
      "explanation": "Slide 21 summarizes programming motor rotations on the model."
    }
  ]
};
