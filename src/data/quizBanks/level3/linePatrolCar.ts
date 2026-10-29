/** Source-checked Level 3 Learning PDF questions; slides are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const linePatrolCarBank: QuizBank = {
  "projectId": "level-3-line-patrol-car",
  "title": "Line Patrol Car",
  "sourcePdfPath": "public/Level 3/Learning/Foundational Robots/Line patrol car.pdf",
  "sourcePageCount": 12,
  "questions": [
    {
      "id": "line-01",
      "topic": "path-following",
      "learningSlide": 2,
      "prompt": "Which route is used as an example of a vehicle following a fixed track?",
      "choices": [
        "A train on a railway",
        "A boat across open sea",
        "A balloon blown by wind",
        "A loose ball rolling"
      ],
      "correctIndex": 0,
      "hint": "Think about vehicles with a marked route.",
      "explanation": "Slide 2 compares a train's railway with a vehicle's track."
    },
    {
      "id": "line-02",
      "topic": "path-following",
      "learningSlide": 3,
      "prompt": "What does the line patrol car do in the factory example?",
      "choices": [
        "Travels along a drawn route",
        "Measures rainfall",
        "Produces music on demand",
        "Sorts objects by weight"
      ],
      "correctIndex": 0,
      "hint": "The lesson compares its route with train tracks.",
      "explanation": "Slide 3 describes a line patrol car traveling along a drawn route."
    },
    {
      "id": "line-03",
      "topic": "grayscale-sensing",
      "learningSlide": 5,
      "prompt": "Which component detects the target's gray value?",
      "choices": [
        "Grayscale Integration Sensor",
        "Ultrasonic distance module",
        "Microphone",
        "Touch switch"
      ],
      "correctIndex": 0,
      "hint": "Look for the part named in the lesson's parts list.",
      "explanation": "Slide 5 names the Grayscale Integration Sensor."
    },
    {
      "id": "line-04",
      "topic": "grayscale-sensing",
      "learningSlide": 5,
      "prompt": "According to the lesson's sensor description, what happens to the gray value when the surface is darker?",
      "choices": [
        "It is higher",
        "It is always zero",
        "It does not change",
        "It becomes a sound measurement"
      ],
      "correctIndex": 0,
      "hint": "The slide directly compares darker and lighter surfaces.",
      "explanation": "Slide 5 states that darker surfaces give a higher gray value."
    },
    {
      "id": "line-05",
      "topic": "line-vs-field",
      "learningSlide": 11,
      "prompt": "What does a reading above the boundary standard value indicate in this lesson?",
      "choices": [
        "The car is biased toward the black line",
        "The controller has shut down",
        "The sound is too loud",
        "The path is completely white"
      ],
      "correctIndex": 0,
      "hint": "The evaluation compares readings with the black line boundary.",
      "explanation": "Slide 11 says above-boundary gray values indicate bias toward the black line."
    },
    {
      "id": "line-06",
      "topic": "line-vs-field",
      "learningSlide": 11,
      "prompt": "What does a reading below the boundary standard value indicate?",
      "choices": [
        "Bias toward the surrounding field",
        "An unavoidable collision",
        "A low battery alarm",
        "The motor has been removed"
      ],
      "correctIndex": 0,
      "hint": "Compare black-line readings with the field readings.",
      "explanation": "Slide 11 assigns lower values to bias toward the field."
    },
    {
      "id": "line-07",
      "topic": "tracking-program",
      "learningSlide": 10,
      "prompt": "What behavior is the coding task trying to make continuous?",
      "choices": [
        "Following the black line",
        "Circling at random",
        "Playing music",
        "Detecting faces"
      ],
      "correctIndex": 0,
      "hint": "The goal is to remain on the marked route.",
      "explanation": "Slide 10 asks students to program the car to keep walking along the black line."
    },
    {
      "id": "line-08",
      "topic": "tracking-program",
      "learningSlide": 4,
      "prompt": "What color are the competition lines described in the exploration?",
      "choices": [
        "Black",
        "Red",
        "Yellow",
        "Blue"
      ],
      "correctIndex": 0,
      "hint": "The line contrast matters to the sensor.",
      "explanation": "Slide 4 describes the game lines as black."
    },
    {
      "id": "line-09",
      "topic": "controller-motors",
      "learningSlide": 12,
      "prompt": "What type of motor control does the project summary mention?",
      "choices": [
        "Single and double motor rotation",
        "Airplane engines only",
        "Hydraulic lifting only",
        "No motor control"
      ],
      "correctIndex": 0,
      "hint": "The summary names two types of rotation control.",
      "explanation": "Slide 12 says the program controls single-motor and double-motor rotation."
    },
    {
      "id": "line-10",
      "topic": "controller-motors",
      "learningSlide": 12,
      "prompt": "After building, what should students do to try a new route?",
      "choices": [
        "Customize a map for the car to follow",
        "Remove all lines from the map",
        "Turn off all motors",
        "Change the controller to a microphone"
      ],
      "correctIndex": 0,
      "hint": "The show activity extends the line-following route.",
      "explanation": "Slide 12 instructs students to customize a map and let the car follow the line."
    }
  ]
};
