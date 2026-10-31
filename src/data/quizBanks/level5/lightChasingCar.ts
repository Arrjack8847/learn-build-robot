/** Official Level 5 Learning PDF: 31 pages, Git blob identity verified. */
import type { QuizBank } from "../../quizStudio";

export const lightChasingCarBank: QuizBank = {
  "projectId": "level-5-light-chasing-car",
  "title": "Light Chasing Car",
  "sourcePdfPath": "public/Level 5/Learning/Vehicles & Complex Movers/Light Chasing Car/08.Light Chasing Car -Slides.pdf",
  "sourcePageCount": 31,
  "questions": [
    {
      "id": "level-5-light-chasing-car-01",
      "topic": "phototaxis",
      "learningSlide": 4,
      "prompt": "What is phototaxis?",
      "choices": [
        "An insect's tendency to move toward light",
        "An object's response to gravity only",
        "The storage of electrical charge",
        "The reflection of sound waves"
      ],
      "correctIndex": 0,
      "hint": "The moth-to-flame example illustrates the response.",
      "explanation": "Slide 4 defines phototaxis as attraction toward light sources."
    },
    {
      "id": "level-5-light-chasing-car-02",
      "topic": "phototaxis",
      "learningSlide": 3,
      "prompt": "Which example introduces the light-seeking behavior in this lesson?",
      "choices": [
        "A barometer showing altitude",
        "A moth flying toward a flame",
        "A curling stone sliding on ice",
        "A frog responding to sound"
      ],
      "correctIndex": 1,
      "hint": "Think of the lesson's opening insect story.",
      "explanation": "Slide 3 introduces moths drawn toward flame."
    },
    {
      "id": "level-5-light-chasing-car-03",
      "topic": "sensor-layout",
      "learningSlide": 6,
      "prompt": "How many photoelectric sensors are used to locate the light source?",
      "choices": [
        "Four",
        "None",
        "Two",
        "One"
      ],
      "correctIndex": 2,
      "hint": "The robot compares its left and right sides.",
      "explanation": "Slide 6 specifies using two photoelectric sensors to detect the light source's direction."
    },
    {
      "id": "level-5-light-chasing-car-04",
      "topic": "sensor-layout",
      "learningSlide": 22,
      "prompt": "What does the lesson suggest displaying while testing the two sensors?",
      "choices": [
        "Only battery price",
        "The robot's paint color",
        "The time at a neighboring school",
        "Both sensors' light values"
      ],
      "correctIndex": 3,
      "hint": "Read and compare the two measurements.",
      "explanation": "Slide 22 recommends obtaining and displaying left and right photoelectric readings."
    },
    {
      "id": "level-5-light-chasing-car-05",
      "topic": "and-logic",
      "learningSlide": 20,
      "prompt": "When is an AND condition true?",
      "choices": [
        "Only when both conditions are true",
        "When exactly one condition is true",
        "When neither condition is true",
        "Whenever a random number is even"
      ],
      "correctIndex": 0,
      "hint": "Compare a pair of required conditions.",
      "explanation": "Slide 20 introduces AND logic and the truth table requiring two satisfied conditions."
    },
    {
      "id": "level-5-light-chasing-car-06",
      "topic": "and-logic",
      "learningSlide": 21,
      "prompt": "What happens if one of two checks in an AND block is false?",
      "choices": [
        "Both checks are automatically deleted",
        "The overall AND condition is false",
        "The condition always becomes true",
        "The robot changes its source file"
      ],
      "correctIndex": 1,
      "hint": "Both conditions must be satisfied together.",
      "explanation": "Slide 21 explains the AND judgment requires simultaneous satisfaction."
    },
    {
      "id": "level-5-light-chasing-car-07",
      "topic": "navigation-thresholds",
      "learningSlide": 24,
      "prompt": "What should the car do if both light readings are above the threshold?",
      "choices": [
        "Turn left in place",
        "Turn right in place",
        "Move forward",
        "Stop immediately"
      ],
      "correctIndex": 2,
      "hint": "A centered nearby light reaches both sensors.",
      "explanation": "Slide 24 commands forward motion when both sensor values exceed the threshold."
    },
    {
      "id": "level-5-light-chasing-car-08",
      "topic": "navigation-thresholds",
      "learningSlide": 25,
      "prompt": "What should the car do when only the left reading exceeds the threshold?",
      "choices": [
        "Move straight backward",
        "Stop with no turn",
        "Turn right on the spot",
        "Turn left on the spot"
      ],
      "correctIndex": 3,
      "hint": "It follows the brighter side.",
      "explanation": "Slide 25 commands a left turn when left is above threshold and right is below."
    },
    {
      "id": "level-5-light-chasing-car-09",
      "topic": "strong-light-response",
      "learningSlide": 26,
      "prompt": "What extra behavior is proposed when the light is too strong?",
      "choices": [
        "Back away from the light",
        "Flash the emergency lights only",
        "Always speed up toward it",
        "Stop displaying sensor values forever"
      ],
      "correctIndex": 0,
      "hint": "Very bright light is treated differently from normal pursuit.",
      "explanation": "Slide 26 proposes retreating when the light source becomes too strong."
    },
    {
      "id": "level-5-light-chasing-car-10",
      "topic": "strong-light-response",
      "learningSlide": 27,
      "prompt": "In the extension, when do both sensor values trigger a brief backward move?",
      "choices": [
        "Only after the program stops",
        "When both exceed 2000",
        "When both are exactly 0",
        "When left is below 1 and right is 5"
      ],
      "correctIndex": 1,
      "hint": "Read the numeric extension threshold.",
      "explanation": "Slide 27 uses both readings above 2000 to move backward for 0.5 seconds."
    }
  ]
};
