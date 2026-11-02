/** Official Level 5 Learning PDF: 25 pages, Git blob identity verified. */
import type { QuizBank } from "../../quizStudio";

export const kiddieRideBank: QuizBank = {
  "projectId": "level-5-kiddie-ride",
  "title": "Kiddie Ride",
  "sourcePdfPath": "public/Level 5/Learning/Mechanisms & Simulators/Kiddie Ride/16. Kiddie Ride-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "level-5-kiddie-ride-01",
      "topic": "ride-purpose",
      "learningSlide": 4,
      "prompt": "Where does the lesson say coin-operated kiddie rides are often found?",
      "choices": [
        "Playgrounds and other busy public areas",
        "Only on highways",
        "Only on construction sites",
        "Underwater laboratories"
      ],
      "correctIndex": 0,
      "hint": "Think about areas visited by families.",
      "explanation": "Slide 4 mentions playgrounds, shops and public squares as common locations for kiddie rides."
    },
    {
      "id": "level-5-kiddie-ride-02",
      "topic": "ride-purpose",
      "learningSlide": 5,
      "prompt": "What sensory features are commonly active while the kiddie ride moves?",
      "choices": [
        "A weather radar",
        "Music and lights",
        "A black-and-white TV only",
        "An alarm siren with no movement"
      ],
      "correctIndex": 1,
      "hint": "Recall what accompanies the up-and-down shaking.",
      "explanation": "Slide 5 says kiddie rides often play music and turn on lights as they rock."
    },
    {
      "id": "level-5-kiddie-ride-03",
      "topic": "crank-linkage",
      "learningSlide": 8,
      "prompt": "What part does the motor turn to create the rocking motion?",
      "choices": [
        "A touchscreen only",
        "The coin slot's lid",
        "The crankshaft",
        "A keyboard"
      ],
      "correctIndex": 2,
      "hint": "Look for the rotating component linked to a rocker.",
      "explanation": "Slide 8 identifies a rotating crankshaft connected through a rod to a rocker arm."
    },
    {
      "id": "level-5-kiddie-ride-04",
      "topic": "crank-linkage",
      "learningSlide": 8,
      "prompt": "Which part transmits movement from the crankshaft to the rocker arm?",
      "choices": [
        "Light sensor",
        "Speaker cone",
        "Battery indicator",
        "Connecting rod"
      ],
      "correctIndex": 3,
      "hint": "Find the link between rotating and rocking elements.",
      "explanation": "Slide 8 says a connecting rod drives the front rocker arm."
    },
    {
      "id": "level-5-kiddie-ride-05",
      "topic": "coin-detection",
      "learningSlide": 12,
      "prompt": "What starts the ride's movement in the main-program flowchart?",
      "choices": [
        "Detecting a coin insertion",
        "Hearing a whistle",
        "Detecting rainfall",
        "The rider changing the date"
      ],
      "correctIndex": 0,
      "hint": "Think of the payment condition.",
      "explanation": "Slide 12 starts the ride sequence after detecting a coin."
    },
    {
      "id": "level-5-kiddie-ride-06",
      "topic": "coin-detection",
      "learningSlide": 17,
      "prompt": "What color-sensor sequence represents a coin passing through?",
      "choices": [
        "Blue–green–blue",
        "White–yellow–white",
        "Black–red–blue",
        "Yellow–yellow–yellow"
      ],
      "correctIndex": 1,
      "hint": "It starts and ends at the same background color.",
      "explanation": "Slide 17 specifies sensor values 6 (white), 4 (yellow), and 6 (white)."
    },
    {
      "id": "level-5-kiddie-ride-07",
      "topic": "ride-program",
      "learningSlide": 15,
      "prompt": "Into which two functions is the main program divided?",
      "choices": [
        "Measure temperature and draw maps",
        "Camera and steering",
        "Insert coins and kiddie ride",
        "Turn headlights and count cars"
      ],
      "correctIndex": 2,
      "hint": "Read the two named sub-functions.",
      "explanation": "Slide 15 names the insert-coins and kiddie-ride functions."
    },
    {
      "id": "level-5-kiddie-ride-08",
      "topic": "ride-program",
      "learningSlide": 19,
      "prompt": "What does the ride function do after a coin is accepted?",
      "choices": [
        "Disable the rocker forever",
        "Ignore all stored coins",
        "Stop the color sensor and alarm",
        "Begin rocking and deduct a fee for each ride"
      ],
      "correctIndex": 3,
      "hint": "Follow how payment authorizes motion.",
      "explanation": "Slide 19 starts rocking after insertion and deducts payment with each shake or ride."
    },
    {
      "id": "level-5-kiddie-ride-09",
      "topic": "reliability",
      "learningSlide": 13,
      "prompt": "Why is a short delay needed between coin-detection events?",
      "choices": [
        "To help separate coin arrivals and departures",
        "To double-count every coin",
        "To permanently turn off the sensor",
        "To reverse the crankshaft every tenth of a second"
      ],
      "correctIndex": 0,
      "hint": "Think about avoiding a single coin being counted twice.",
      "explanation": "Slide 13 introduces waiting intervals between detection steps to distinguish complete coin passages."
    },
    {
      "id": "level-5-kiddie-ride-10",
      "topic": "reliability",
      "learningSlide": 23,
      "prompt": "What is the focus of the lesson's optimization challenge?",
      "choices": [
        "Making the motor run without a switch",
        "Making coin detection more stable",
        "Replacing the whole ride with an airplane",
        "Removing the payment logic"
      ],
      "correctIndex": 1,
      "hint": "Identify the unreliable part of the model.",
      "explanation": "Slide 23 requests improving the reliability of coin detection."
    }
  ]
};
