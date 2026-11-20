/** Verified against official Level 3 PDF; references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const stagBeetleBank: QuizBank = {
  "projectId": "level-3-stag-beetle",
  "title": "Stag Beetle",
  "sourcePdfPath": "public/Level 3/Learning/Biomimicry/Stag beetle.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "stagbeetle-01",
      "topic": "biology",
      "learningSlide": 3,
      "prompt": "Which feature is highlighted as a stag beetle's weapon?",
      "choices": [
        "Long ears",
        "A water-filled tail",
        "Transparent wings only",
        "Powerful upper jaws"
      ],
      "correctIndex": 3,
      "hint": "The insect has prominent jaws and a protective outer body.",
      "explanation": "Slide 3 identifies the upper jaw as a weapon."
    },
    {
      "id": "stagbeetle-02",
      "topic": "biology",
      "learningSlide": 4,
      "prompt": "What visible body feature should the robotic stag beetle imitate?",
      "choices": [
        "An armored body and head horns",
        "A long bird beak",
        "A turtle shell with fins",
        "A single rubber wheel"
      ],
      "correctIndex": 0,
      "hint": "The insect has prominent jaws and a protective outer body.",
      "explanation": "Slide 4 describes armor and two head horns."
    },
    {
      "id": "stagbeetle-03",
      "topic": "structure",
      "learningSlide": 5,
      "prompt": "Which two actions must the stag beetle model perform?",
      "choices": [
        "Swim and play music",
        "Walk and move its mandibles",
        "Weigh objects and climb stairs",
        "Measure sound and spin a fan"
      ],
      "correctIndex": 1,
      "hint": "Think about the two distinct types of movement used in the lesson's animal model.",
      "explanation": "Slide 5 requires walking and movable mandibles."
    },
    {
      "id": "stagbeetle-04",
      "topic": "structure",
      "learningSlide": 5,
      "prompt": "How many motors are proposed for these movement functions?",
      "choices": [
        "One",
        "Two",
        "Three",
        "Six"
      ],
      "correctIndex": 2,
      "hint": "The model must both walk and move its mandibles.",
      "explanation": "Slide 5 explicitly specifies three motors."
    },
    {
      "id": "stagbeetle-05",
      "topic": "motion",
      "learningSlide": 22,
      "prompt": "Which motor control positions drive crawling in the lesson?",
      "choices": [
        "B only",
        "B and C only",
        "A only",
        "A and D"
      ],
      "correctIndex": 3,
      "hint": "Multiple motors provide independent movements.",
      "explanation": "Slide 22 assigns crawling to A and D."
    },
    {
      "id": "stagbeetle-06",
      "topic": "motion",
      "learningSlide": 22,
      "prompt": "Which motor control position drives the mandible?",
      "choices": [
        "B",
        "A and D",
        "C and D",
        "A only"
      ],
      "correctIndex": 0,
      "hint": "Multiple motors provide independent movements.",
      "explanation": "Slide 22 assigns the mandible movement to B."
    },
    {
      "id": "stagbeetle-07",
      "topic": "coding",
      "learningSlide": 21,
      "prompt": "In what position does the mandible start the first coding task?",
      "choices": [
        "Fully open",
        "Closed",
        "Disconnected",
        "Rotating continuously"
      ],
      "correctIndex": 1,
      "hint": "The exercise begins with the jaws closed.",
      "explanation": "Slide 21 specifies a closed starting position."
    },
    {
      "id": "stagbeetle-08",
      "topic": "coding",
      "learningSlide": 21,
      "prompt": "What is the objective of Task 1?",
      "choices": [
        "Measure sunlight intensity",
        "Program an ultrasonic alarm",
        "Program the beetle's mandible to move",
        "Display a random number"
      ],
      "correctIndex": 2,
      "hint": "The exercise begins with the jaws closed.",
      "explanation": "Slide 21 instructs programming mandible movement."
    },
    {
      "id": "stagbeetle-09",
      "topic": "speed",
      "learningSlide": 22,
      "prompt": "How can students adjust the model's crawling speed?",
      "choices": [
        "Change the color sensor's LED",
        "Increase speaker volume",
        "Change the displayed font size",
        "Change the motor speed setting"
      ],
      "correctIndex": 3,
      "hint": "Repeated commands and motor speed settings adjust crawling.",
      "explanation": "Slide 22 calls for adjusting motor speed to control crawling."
    },
    {
      "id": "stagbeetle-10",
      "topic": "speed",
      "learningSlide": 22,
      "prompt": "Which concept is reviewed while programming crawling?",
      "choices": [
        "Repeated execution modules",
        "MP3 file folders",
        "Infrared currency detection",
        "Single-use manual commands only"
      ],
      "correctIndex": 0,
      "hint": "Repeated commands and motor speed settings adjust crawling.",
      "explanation": "Slide 22 explicitly reviews repetitive execution modules."
    }
  ]
};
