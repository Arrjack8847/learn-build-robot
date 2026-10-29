/** Level 4 — Swimming Plesiosaur. Questions checked against the 21-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const swimmingPlesiosaurBank: QuizBank = {
  "projectId": "level-4-swimming-plesiosaur",
  "title": "Swimming Plesiosaur",
  "sourcePdfPath": "public/Level 4/Characters & Structures/Swimming Plesiosaur/19. Swimming Plesiosaur-Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "l4-swimmingplesiosaur-01",
      "topic": "plesiosaur-shape",
      "learningSlide": 5,
      "prompt": "Which body part of a plesiosaur is especially long?",
      "choices": [
        "Its neck",
        "Its tail only",
        "Its legs",
        "Its beak"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 describes the plesiosaur's long neck.",
      "hint": "Remember the animal shape this robot copies."
    },
    {
      "id": "l4-swimmingplesiosaur-02",
      "topic": "plesiosaur-shape",
      "learningSlide": 5,
      "prompt": "What helps a plesiosaur swim in the lesson's description?",
      "choices": [
        "Four long flippers",
        "Four car wheels",
        "Two metal wings",
        "One large propeller"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 describes two pairs of large flippers.",
      "hint": "Think about the animal's swimming parts."
    },
    {
      "id": "l4-swimmingplesiosaur-03",
      "topic": "crank-rocker",
      "learningSlide": 8,
      "prompt": "What motion does the crank-rocker mechanism make from a rotating crank?",
      "choices": [
        "Back-and-forth swinging",
        "Only sound waves",
        "Only a straight fall",
        "Light flashes"
      ],
      "correctIndex": 0,
      "explanation": "Slide 8 says a crank-rocker changes rotation into reciprocating motion.",
      "hint": "Think about turning motion becoming repeated swinging."
    },
    {
      "id": "l4-swimmingplesiosaur-04",
      "topic": "crank-rocker",
      "learningSlide": 8,
      "prompt": "Which part of the robot does the crank-rocker mechanism move back and forth?",
      "choices": [
        "Its neck",
        "Its camera lens",
        "Its controller screen",
        "Its battery"
      ],
      "correctIndex": 0,
      "explanation": "Slide 8 uses the mechanism to move the model's neck.",
      "hint": "Think about the movement that makes the robot resemble the animal."
    },
    {
      "id": "l4-swimmingplesiosaur-05",
      "topic": "laser-distance",
      "learningSlide": 9,
      "prompt": "Which sensor does the lesson use to control forward speed?",
      "choices": [
        "Touch sensor",
        "Laser ranging sensor",
        "Magnetic switch",
        "Microphone"
      ],
      "correctIndex": 1,
      "explanation": "Slide 9 names laser sensing for controlling the robot's forward speed.",
      "hint": "The robot must measure how close an object is."
    },
    {
      "id": "l4-swimmingplesiosaur-06",
      "topic": "laser-distance",
      "learningSlide": 9,
      "prompt": "Which reading can mean the laser sensor exceeded its measurement distance?",
      "choices": [
        "10",
        "50",
        "300",
        "8888"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 states that 8888 is an out-of-range reading.",
      "hint": "Look for the unusual special value."
    },
    {
      "id": "l4-swimmingplesiosaur-07",
      "topic": "speed-by-distance",
      "learningSlide": 12,
      "prompt": "What should happen to the robot's speed when an obstacle is closer?",
      "choices": [
        "It slows down",
        "It speeds up",
        "It changes its name",
        "It ignores all readings"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 describes slower motion as the distance decreases.",
      "hint": "The robot should be careful near an obstacle."
    },
    {
      "id": "l4-swimmingplesiosaur-08",
      "topic": "speed-by-distance",
      "learningSlide": 15,
      "prompt": "What speed is used when the measured distance is less than 50?",
      "choices": [
        "70",
        "50",
        "20",
        "0"
      ],
      "correctIndex": 3,
      "explanation": "Slide 15 sets speed zero for distances below 50.",
      "hint": "The robot stops when the obstacle is too close."
    },
    {
      "id": "l4-swimmingplesiosaur-09",
      "topic": "program-data",
      "learningSlide": 13,
      "prompt": "Which data should the program read first?",
      "choices": [
        "Laser distance value",
        "Room temperature",
        "Motor color",
        "Current date"
      ],
      "correctIndex": 0,
      "explanation": "Slide 13 says to read the laser distance sensor.",
      "hint": "A decision needs a fresh reading."
    },
    {
      "id": "l4-swimmingplesiosaur-10",
      "topic": "program-data",
      "learningSlide": 14,
      "prompt": "What should the program do when the laser reading is invalid?",
      "choices": [
        "Read the data again",
        "Increase speed immediately",
        "Ignore every reading forever",
        "Turn off the controller"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 instructs students to re-read invalid sensor data.",
      "hint": "Think about how to get a reliable measurement."
    }
  ]
};
