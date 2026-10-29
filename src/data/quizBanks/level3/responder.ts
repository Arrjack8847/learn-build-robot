/** Text verified against official Level 3 teaching manual (Learning fallback). */
import type { QuizBank } from "../../quizStudio";

export const responderBank: QuizBank = {
  "projectId": "level-3-responder",
  "title": "Responder",
  "sourcePdfPath": "public/Responder.pdf",
  "sourcePageCount": 12,
  "questions": [
    {
      "id": "responder-01",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "For what classroom activity is the responder introduced?",
      "choices": [
        "A bicycle repair task",
        "A laundry program",
        "A drawbridge crossing",
        "A debate or answering contest"
      ],
      "correctIndex": 3,
      "hint": "A classroom contest needs to identify who answers first.",
      "explanation": "Page 4 describes a school debate contest requiring a response button."
    },
    {
      "id": "responder-02",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "Why would contestants press a responder before speaking?",
      "choices": [
        "To signal that they want to answer",
        "To accelerate a robot wheel",
        "To count banknotes",
        "To adjust a lamp's light threshold"
      ],
      "correctIndex": 0,
      "hint": "A classroom contest needs to identify who answers first.",
      "explanation": "Page 4 explains pressing the responder before answering."
    },
    {
      "id": "responder-03",
      "topic": "touch",
      "learningSlide": 3,
      "prompt": "Which sensor is part of the responder's learning objectives?",
      "choices": [
        "Barometric sensor",
        "Touch sensor",
        "Infrared distance-only sensor",
        "Microphone volume meter"
      ],
      "correctIndex": 1,
      "hint": "An input button detects a press.",
      "explanation": "Page 3 explicitly lists the touch sensor."
    },
    {
      "id": "responder-04",
      "topic": "touch",
      "learningSlide": 4,
      "prompt": "Which input action is the responder designed to receive from a contestant?",
      "choices": [
        "Changing the position of a banknote",
        "Moving a curtain into sunlight",
        "Pressing a response button",
        "Turning a mechanical crank manually"
      ],
      "correctIndex": 2,
      "hint": "An input button detects a press.",
      "explanation": "Page 4 describes participants pressing before answering."
    },
    {
      "id": "responder-05",
      "topic": "display",
      "learningSlide": 3,
      "prompt": "Which electronic display is named among the responder components?",
      "choices": [
        "MP3 audio disk",
        "Ultrasonic probe",
        "Motor encoder only",
        "LED lattice screen"
      ],
      "correctIndex": 3,
      "hint": "A screen can show the responder's outcome.",
      "explanation": "Page 3 includes the LED lattice screen."
    },
    {
      "id": "responder-06",
      "topic": "display",
      "learningSlide": 3,
      "prompt": "What is a lesson objective alongside the touch sensor?",
      "choices": [
        "Understanding the LED lattice screen",
        "Increasing a gear ratio",
        "Measuring air pressure",
        "Using a paper scoreboard only"
      ],
      "correctIndex": 0,
      "hint": "A screen can show the responder's outcome.",
      "explanation": "Page 3 pairs learning about touch sensing with the LED lattice screen."
    },
    {
      "id": "responder-07",
      "topic": "motor",
      "learningSlide": 3,
      "prompt": "Which motor concept is taught in the responder lesson?",
      "choices": [
        "Steam-powered piston",
        "Closed-loop motor",
        "Mechanical spring-only drive",
        "Sound-powered fan"
      ],
      "correctIndex": 1,
      "hint": "Review how motors can be controlled and what feedback changes about their behavior.",
      "explanation": "Page 3 identifies application of a closed-loop motor."
    },
    {
      "id": "responder-08",
      "topic": "motor",
      "learningSlide": 5,
      "prompt": "What is adjusted in the responder's debugging exercise?",
      "choices": [
        "Wavelength of ultraviolet light",
        "Mass of blood cells",
        "Motor speed",
        "Bicycle wheel diameter"
      ],
      "correctIndex": 2,
      "hint": "The lesson includes control of a closed-loop motor.",
      "explanation": "Page 5 describes adjusting the speed value by debugging."
    },
    {
      "id": "responder-09",
      "topic": "build",
      "learningSlide": 3,
      "prompt": "Which two beam-hole shapes must be used correctly while building?",
      "choices": [
        "Triangle and oval holes",
        "Hexagon and star holes",
        "Only square holes",
        "Square and round holes"
      ],
      "correctIndex": 3,
      "hint": "Mechanical holes and program order are part of the work.",
      "explanation": "Page 3 emphasizes correct use of beam square and round holes."
    },
    {
      "id": "responder-10",
      "topic": "build",
      "learningSlide": 3,
      "prompt": "Which program structure is included as a learning difficulty?",
      "choices": [
        "Sequential structure",
        "No execution order",
        "Only random instruction selection",
        "Only manual switching without code"
      ],
      "correctIndex": 0,
      "hint": "Mechanical holes and program order are part of the work.",
      "explanation": "Page 3 emphasizes correct programming sequence."
    }
  ]
};
