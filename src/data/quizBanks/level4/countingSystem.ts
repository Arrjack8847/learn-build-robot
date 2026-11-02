/** Level 4 Learning PDF text checked page by page; questions do not depend on unreviewed diagrams. */
import type { QuizBank } from "../../quizStudio";

export const countingSystemBank: QuizBank = {
  "projectId": "level-4-counting-system",
  "title": "Counting system",
  "sourcePdfPath": "public/Level 4/Sensors/Counting system.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "l4-cs-01",
      "topic": "crowd-safety",
      "learningSlide": 3,
      "prompt": "Why does the lesson say many public places use crowd-control systems?",
      "choices": [
        "To change wall colors",
        "To broadcast more music",
        "To replace all seats",
        "To reduce dangerous overcrowding"
      ],
      "correctIndex": 3,
      "explanation": "Slide 3 discusses crowd control after stampede incidents.",
      "hint": "Think about safe numbers in a limited space."
    },
    {
      "id": "l4-cs-02",
      "topic": "crowd-safety",
      "learningSlide": 4,
      "prompt": "What problem can an elevator's counting system help detect?",
      "choices": [
        "The color of passengers' clothes",
        "Too many people inside",
        "The temperature outside",
        "The color of the elevator"
      ],
      "correctIndex": 1,
      "explanation": "Slide 4 describes warning alarms for overcrowding.",
      "hint": "What happens if too many people get into a small space?"
    },
    {
      "id": "l4-cs-03",
      "topic": "people-sensing",
      "learningSlide": 5,
      "prompt": "What two capabilities does the lesson say are required to count people?",
      "choices": [
        "Detection and increasing a numerical count",
        "Painting and drawing",
        "Heating and cooling",
        "Playing and recording music"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 compares these needs to eyes and a brain that counts.",
      "hint": "One component sees; another keeps the total."
    },
    {
      "id": "l4-cs-04",
      "topic": "people-sensing",
      "learningSlide": 6,
      "prompt": "Which sensor does the example system use to count people?",
      "choices": [
        "Humidity sensor",
        "Magnetic sensor",
        "Infrared sensor",
        "Barometric sensor"
      ],
      "correctIndex": 2,
      "explanation": "Slide 6 explicitly uses an infrared sensor.",
      "hint": "Find the detector named in the amusement-ride example."
    },
    {
      "id": "l4-cs-05",
      "topic": "capacity",
      "learningSlide": 6,
      "prompt": "What is the example amusement facility's capacity per round?",
      "choices": [
        "5 people",
        "10 people",
        "25 people",
        "100 people"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 sets the example limit at 10 people.",
      "hint": "Remember the number before the next round begins."
    },
    {
      "id": "l4-cs-06",
      "topic": "capacity",
      "learningSlide": 14,
      "prompt": "What does Task 1 ask the program to do when the infrared count reaches ten?",
      "choices": [
        "Erase every saved file",
        "Switch off all power",
        "Replace the sensor",
        "Read the people count"
      ],
      "correctIndex": 3,
      "explanation": "Slide 14 asks students to read the number once it reaches 10.",
      "hint": "The program must recognize that the limit has been reached."
    },
    {
      "id": "l4-cs-07",
      "topic": "reset-and-gate",
      "learningSlide": 15,
      "prompt": "Which sensor does Task 2 use to reset the count?",
      "choices": [
        "Touch sensor",
        "Gyroscope",
        "Ultrasonic sensor",
        "Color sensor"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 uses the touch sensor to reset the number.",
      "hint": "Think of the sensor that responds when pressed."
    },
    {
      "id": "l4-cs-08",
      "topic": "reset-and-gate",
      "learningSlide": 15,
      "prompt": "What other physical system may Task 2 control?",
      "choices": [
        "A robot's wings",
        "A musical instrument",
        "A gate opening and closing",
        "A weather balloon"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 adds gate opening and closing control.",
      "hint": "What controls whether people can enter?"
    },
    {
      "id": "l4-cs-09",
      "topic": "avoid-double-counts",
      "learningSlide": 16,
      "prompt": "What problem appears if the counting-control module described in Slide 16 is removed?",
      "choices": [
        "The sensor detects air pressure instead",
        "One person may be detected repeatedly",
        "The robot immediately learns colors",
        "A touch sensor becomes a camera"
      ],
      "correctIndex": 1,
      "explanation": "Slide 16 warns that the infrared sensor continues to detect the same object.",
      "hint": "Can one stationary person be counted more than once?"
    },
    {
      "id": "l4-cs-10",
      "topic": "avoid-double-counts",
      "learningSlide": 16,
      "prompt": "What must happen before the infrared sensor completes another count in the described design?",
      "choices": [
        "The display must change color",
        "The controller must be replaced",
        "The buzzer must ring three times",
        "The currently detected person must leave"
      ],
      "correctIndex": 3,
      "explanation": "Slide 16 explains that the module delays a completed count until the person leaves.",
      "hint": "Wait for the first object to move away."
    }
  ]
};
