/** Level 4 — Radar vehicle. Questions checked against the 18-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const radarVehicleBank: QuizBank = {
  "projectId": "level-4-radar-vehicle",
  "title": "Radar vehicle",
  "sourcePdfPath": "public/Level 4/Autonomous Navigation & Ranging/Radar vehicle/Radar vehicle_Powerpoint.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "l4-radarvehicle-01",
      "topic": "radar-concepts",
      "learningSlide": 6,
      "prompt": "What can radar help measure about a target?",
      "choices": [
        "Distance and position",
        "Only its smell",
        "Only its color",
        "Only its temperature"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 explains that radar finds targets and their positions.",
      "hint": "Think about information that helps locate something."
    },
    {
      "id": "l4-radarvehicle-02",
      "topic": "radar-concepts",
      "learningSlide": 6,
      "prompt": "What does conventional radio radar send out to find targets?",
      "choices": [
        "Electromagnetic waves",
        "Water drops",
        "Plastic pins",
        "Paint"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 describes radar emitting electromagnetic waves and receiving echoes.",
      "hint": "Think about signals that travel away and return."
    },
    {
      "id": "l4-radarvehicle-03",
      "topic": "robot-sensors",
      "learningSlide": 2,
      "prompt": "Which type of sensing does this robot lesson focus on?",
      "choices": [
        "Ultrasonic sensing",
        "Pressure sensing",
        "Color sensing",
        "Temperature sensing"
      ],
      "correctIndex": 0,
      "explanation": "Slide 2 identifies ultrasound and motor use as its learning objective.",
      "hint": "The model uses an approach different from conventional radio radar."
    },
    {
      "id": "l4-radarvehicle-04",
      "topic": "robot-sensors",
      "learningSlide": 7,
      "prompt": "What is the purpose of the radar robot built in this lesson?",
      "choices": [
        "Measure distance",
        "Count tickets",
        "Open blinds",
        "Play piano notes"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 says the class builds a distance-measuring radar robot.",
      "hint": "Think about detecting obstacles."
    },
    {
      "id": "l4-radarvehicle-05",
      "topic": "planning-and-building",
      "learningSlide": 9,
      "prompt": "What should happen before making a complicated model?",
      "choices": [
        "Careful design and planning",
        "Randomly removing parts",
        "Avoiding all tests",
        "Ignoring the instructions"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 describes design as careful pre-planning.",
      "hint": "Think about choosing a plan before building."
    },
    {
      "id": "l4-radarvehicle-06",
      "topic": "planning-and-building",
      "learningSlide": 12,
      "prompt": "Which rule appears in the Radar Vehicle assembly checklist?",
      "choices": [
        "A stable structure",
        "No support under the motor",
        "A loose controller",
        "No planned shape"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 lists a stable structure.",
      "hint": "A moving robot needs a secure build."
    },
    {
      "id": "l4-radarvehicle-07",
      "topic": "alarm-response",
      "learningSlide": 14,
      "prompt": "What output is triggered when the program detects an obstacle closer than 15 in the given threshold check?",
      "choices": [
        "Buzzer sound",
        "Curtain opening",
        "Screen printing a QR code",
        "Music streaming"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 shows a buzzer when the obstacle reading is below 15.",
      "hint": "Think about how a robot alerts someone."
    },
    {
      "id": "l4-radarvehicle-08",
      "topic": "alarm-response",
      "learningSlide": 15,
      "prompt": "What does the radar car do when it detects an obstacle in Task 1?",
      "choices": [
        "Sounds an alarm",
        "Always opens a door",
        "Counts people",
        "Changes the weather"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 states the rotating car detects obstacles and sounds an alarm.",
      "hint": "Think about a warning to the operator."
    },
    {
      "id": "l4-radarvehicle-09",
      "topic": "movement-and-scan",
      "learningSlide": 15,
      "prompt": "How does the radar car move while scanning in the lesson's task?",
      "choices": [
        "Rotates in place",
        "Only moves straight forward",
        "Climbs stairs",
        "Jumps over obstacles"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 says the radar car rotates in place.",
      "hint": "Turning can help check multiple directions."
    },
    {
      "id": "l4-radarvehicle-10",
      "topic": "movement-and-scan",
      "learningSlide": 14,
      "prompt": "Which kind of decision is shown in the radar program?",
      "choices": [
        "Compare distance with a set limit",
        "Compare the robot's paint color",
        "Choose a random name",
        "Count the days of the week"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 branches on the measured obstacle distance being less than a set value.",
      "hint": "Think about using a measured number to decide."
    }
  ]
};
