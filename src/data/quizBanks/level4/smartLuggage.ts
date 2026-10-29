/** Level 4 — Smart Luggage. Questions checked against the 21-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const smartLuggageBank: QuizBank = {
  "projectId": "level-4-smart-luggage",
  "title": "Smart Luggage",
  "sourcePdfPath": "public/Level 4/Interactive Mechanisms/Smart Luggage/16. Smart Luggage-Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "l4-smartluggage-01",
      "topic": "following-purpose",
      "learningSlide": 6,
      "prompt": "What extra feature does smart luggage add to a normal suitcase?",
      "choices": [
        "Following its owner",
        "Making coffee",
        "Charging road lights",
        "Reading road signs"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 introduces luggage that can follow its owner.",
      "hint": "Think about making travel easier without carrying the suitcase."
    },
    {
      "id": "l4-smartluggage-02",
      "topic": "following-purpose",
      "learningSlide": 8,
      "prompt": "How does smart luggage decide how fast to move?",
      "choices": [
        "By checking distance to the object",
        "By choosing a random color",
        "By counting songs",
        "By reading the date"
      ],
      "correctIndex": 0,
      "explanation": "Slide 8 says speed is controlled according to distance from the followed object.",
      "hint": "Think about how close the suitcase is to the person."
    },
    {
      "id": "l4-smartluggage-03",
      "topic": "infrared-distance",
      "learningSlide": 9,
      "prompt": "Which sensor is used for the lesson's following robot?",
      "choices": [
        "Infrared ranging sensor",
        "Touch sensor only",
        "Barometric sensor",
        "Magnetic compass"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 explicitly chooses infrared ranging for the project.",
      "hint": "Think about the kind of distance measurement taught in this lesson."
    },
    {
      "id": "l4-smartluggage-04",
      "topic": "infrared-distance",
      "learningSlide": 11,
      "prompt": "Where is the distance sensor placed in the build shown?",
      "choices": [
        "On the following robot",
        "Inside a telephone",
        "On an airplane wing",
        "Under a classroom desk"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 labels an infrared ranging sensor as part of the follower robot.",
      "hint": "The robot needs to sense the object it follows."
    },
    {
      "id": "l4-smartluggage-05",
      "topic": "basic-motion",
      "learningSlide": 12,
      "prompt": "What does the Smart Luggage do when the object ahead is too far away?",
      "choices": [
        "Move forward",
        "Move backward immediately",
        "Turn off forever",
        "Open its lid"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 says the basic program moves forward when the object is too far.",
      "hint": "The luggage needs to catch up."
    },
    {
      "id": "l4-smartluggage-06",
      "topic": "basic-motion",
      "learningSlide": 12,
      "prompt": "What does the basic Smart Luggage program do once it gets close enough?",
      "choices": [
        "Keep speeding up",
        "Stop moving",
        "Reverse continuously",
        "Spin in place"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 says it stops at the chosen following distance.",
      "hint": "Think about not bumping into the object."
    },
    {
      "id": "l4-smartluggage-07",
      "topic": "status-lights",
      "learningSlide": 14,
      "prompt": "Which light signals that the luggage should stop?",
      "choices": [
        "Green",
        "Blue",
        "Red",
        "Yellow"
      ],
      "correctIndex": 2,
      "explanation": "Slide 14 uses a red light for the within-distance stop signal.",
      "hint": "Think about the indicator used when the target is close."
    },
    {
      "id": "l4-smartluggage-08",
      "topic": "status-lights",
      "learningSlide": 15,
      "prompt": "What does the green light signal in the lesson's program?",
      "choices": [
        "Move forward",
        "Disconnect the sensor",
        "Close the suitcase",
        "Stop permanently"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 uses a green light when the object is out of range and movement should continue.",
      "hint": "The target needs to be caught up with."
    },
    {
      "id": "l4-smartluggage-09",
      "topic": "program-monitoring",
      "learningSlide": 13,
      "prompt": "What information does the program repeatedly save into a variable?",
      "choices": [
        "The infrared sensor's reading",
        "The luggage's paint color",
        "The room's name",
        "The battery brand"
      ],
      "correctIndex": 0,
      "explanation": "Slide 13 instructs the robot to store infrared ranging data repeatedly.",
      "hint": "The program needs fresh distance information."
    },
    {
      "id": "l4-smartluggage-10",
      "topic": "program-monitoring",
      "learningSlide": 16,
      "prompt": "How are the program sections completed in the lesson?",
      "choices": [
        "By integrating them using a flowchart",
        "By removing all conditions",
        "By leaving out the sensor",
        "By connecting only a light"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 says to integrate the program parts according to the flowchart.",
      "hint": "Think about combining separate steps into one working program."
    }
  ]
};
