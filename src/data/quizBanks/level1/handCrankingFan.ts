/**
 * Grounded in the official Hand-Cranking Fan teaching PDF text, with 1-based pages.
 * Requires visual page and educator review before registration for students.
 */
import type { QuizBank } from "../../quizStudio";

export const handCrankingFanBank: QuizBank = {
  "projectId": "hand-cranking-fan",
  "title": "Hand-Cranking Fan",
  "sourcePdfPath": "public/Hand-cranking Fan.pdf",
  "sourcePageCount": 12,
  "questions": [
    {
      "id": "hand-cranking-fan-01",
      "topic": "human-powered-cooling",
      "learningSlide": 4,
      "prompt": "Which fan can help when there is no electricity?",
      "choices": [
        "A fan moved by hand",
        "A switched-off ceiling fan",
        "A lamp",
        "A thermometer"
      ],
      "correctIndex": 0,
      "hint": "Think about using your own movement to create airflow.",
      "explanation": "The lesson asks students to find a manual cooling solution when electricity is unavailable."
    },
    {
      "id": "hand-cranking-fan-02",
      "topic": "human-powered-cooling",
      "learningSlide": 4,
      "prompt": "Why does the lesson introduce a hand-operated fan?",
      "choices": [
        "To provide cooling without an electric supply",
        "To measure sound",
        "To check battery charge",
        "To show the weather on a screen"
      ],
      "correctIndex": 0,
      "hint": "Remember the problem in the example about cooling down.",
      "explanation": "The introductory example describes a child in an area without electricity who still needs cooling."
    },
    {
      "id": "hand-cranking-fan-03",
      "topic": "gear-awareness",
      "learningSlide": 3,
      "prompt": "Which kind of mechanical part is the main focus of this lesson?",
      "choices": [
        "Gears",
        "Magnets",
        "Water sensors",
        "Lenses"
      ],
      "correctIndex": 0,
      "hint": "They are toothed parts that can work together.",
      "explanation": "The learning objectives repeatedly focus on gear characteristics, types and roles."
    },
    {
      "id": "hand-cranking-fan-04",
      "topic": "gear-awareness",
      "learningSlide": 3,
      "prompt": "What should students learn about the gears used in machines?",
      "choices": [
        "Their types and characteristics",
        "The names of all animals",
        "How to paint a window",
        "The weather forecast"
      ],
      "correctIndex": 0,
      "hint": "Think about why two gears might not be exactly the same.",
      "explanation": "The lesson explicitly lists understanding the types and characteristics of gears."
    },
    {
      "id": "hand-cranking-fan-05",
      "topic": "transmission",
      "learningSlide": 3,
      "prompt": "What is the purpose of studying gears in the hand-cranking fan?",
      "choices": [
        "Understanding mechanical transmission",
        "Finding GPS coordinates",
        "Playing recorded voices",
        "Detecting light levels"
      ],
      "correctIndex": 0,
      "hint": "Think about how turning one part makes another part move.",
      "explanation": "The lesson introduces the use of gears in mechanical transmission."
    },
    {
      "id": "hand-cranking-fan-06",
      "topic": "transmission",
      "learningSlide": 5,
      "prompt": "Which principle should students discuss when presenting the fan?",
      "choices": [
        "Gear transmission",
        "Air-pressure sensing",
        "Image recognition",
        "Battery charging"
      ],
      "correctIndex": 0,
      "hint": "The presentation instructions name the motion-transfer principle.",
      "explanation": "The assessment and display section names transmission as the main principle."
    },
    {
      "id": "hand-cranking-fan-07",
      "topic": "mechanism-explanation",
      "learningSlide": 5,
      "prompt": "What structure does the teacher explain while students build the fan?",
      "choices": [
        "The gearing structure",
        "An infrared sensor circuit",
        "A camera lens",
        "A hydraulic water line"
      ],
      "correctIndex": 0,
      "hint": "Look for the moving parts taught during the hands-on activity.",
      "explanation": "The lesson calls for an explanation of the fan's gearing structure."
    },
    {
      "id": "hand-cranking-fan-08",
      "topic": "mechanism-explanation",
      "learningSlide": 3,
      "prompt": "What should you investigate when two gears work together?",
      "choices": [
        "How movement passes between them",
        "How to print a poster",
        "How to record a song",
        "How to open a web browser"
      ],
      "correctIndex": 0,
      "hint": "The lesson highlights the function between gears.",
      "explanation": "The key learning points include the transmission principle and function between gears."
    },
    {
      "id": "hand-cranking-fan-09",
      "topic": "assembly-planning",
      "learningSlide": 4,
      "prompt": "What should you decide while designing your own hand-cranking fan?",
      "choices": [
        "Which parts are needed to build it",
        "What the next lesson's title will be",
        "Which sports team to watch",
        "The temperature on another planet"
      ],
      "correctIndex": 0,
      "hint": "Think about choosing materials before assembly.",
      "explanation": "The planning questions ask what pieces can be used to build the fan."
    },
    {
      "id": "hand-cranking-fan-10",
      "topic": "assembly-planning",
      "learningSlide": 3,
      "prompt": "Why should a builder follow the correct order of steps?",
      "choices": [
        "To assemble the fan as intended",
        "To make the computer louder",
        "To change the PDF's title",
        "To turn a wheel into a lamp"
      ],
      "correctIndex": 0,
      "hint": "The lesson names building sequence as an important difficulty.",
      "explanation": "Correct building sequence is explicitly stated as a key point of the hand-cranking fan lesson."
    }
  ]
};
