/** Source: 14-page Car Learning PDF. Diagrams await visual QA. */
import type { QuizBank } from "../quizStudio";
export const carBank: QuizBank = {
  "projectId": "car",
  "title": "Car",
  "sourcePdfPath": "public/Level 1/Learning/Manipulators/Car.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "car-01",
      "topic": "car-features",
      "learningSlide": 4,
      "prompt": "Which pair of movements is mentioned for the lesson's car?",
      "choices": [
        "Forward and backward",
        "Only upward and downward",
        "Only clockwise and anticlockwise spinning",
        "Only opening and closing a claw"
      ],
      "correctIndex": 0,
      "explanation": "The exploration describes moving the car forward and backward.",
      "hint": "Think about driving in two opposite directions."
    },
    {
      "id": "car-02",
      "topic": "car-features",
      "learningSlide": 4,
      "prompt": "What additional motion besides driving straight does the lesson's car perform?",
      "choices": [
        "Flying upward",
        "Climbing a wall",
        "Turning left or right",
        "Swimming underwater"
      ],
      "correctIndex": 2,
      "explanation": "The slide states the model can turn left and right.",
      "hint": "Think about steering around a corner."
    },
    {
      "id": "car-03",
      "topic": "motor-control",
      "learningSlide": 5,
      "prompt": "How many motors does the lesson say are needed to make the car turn?",
      "choices": [
        "Exactly one",
        "At least two",
        "At least five",
        "None"
      ],
      "correctIndex": 1,
      "explanation": "The exploration says one motor is not enough for left and right turns.",
      "hint": "Think about controlling two sides of a small car."
    },
    {
      "id": "car-04",
      "topic": "motor-control",
      "learningSlide": 11,
      "prompt": "What does Coding Task 2 ask students to run separately?",
      "choices": [
        "The buzzer and the screen",
        "Two light sensors",
        "The camera and the microphone",
        "Motor A and Motor B"
      ],
      "correctIndex": 3,
      "explanation": "The task compares separately running the A and B motors.",
      "hint": "Think about testing what each drive motor does on its own."
    },
    {
      "id": "car-05",
      "topic": "wheels",
      "learningSlide": 6,
      "prompt": "What part is used as a third wheel when the kit has only two tires?",
      "choices": [
        "Bevel gear",
        "Sensor housing",
        "Control screen",
        "Universal wheel"
      ],
      "correctIndex": 3,
      "explanation": "The construction slide uses a universal wheel as the third wheel.",
      "hint": "Think of a rolling support that can point in different directions."
    },
    {
      "id": "car-06",
      "topic": "wheels",
      "learningSlide": 6,
      "prompt": "How many tires does the lesson say are available in its parts list?",
      "choices": [
        "Three",
        "Two",
        "Four",
        "Six"
      ],
      "correctIndex": 1,
      "explanation": "The construction page says there are only two tires in the parts list.",
      "hint": "Count the regular tires before adding the universal wheel."
    },
    {
      "id": "car-07",
      "topic": "program",
      "learningSlide": 13,
      "prompt": "What should students explain during the car evaluation?",
      "choices": [
        "How to measure atmospheric pressure",
        "How to draw a house",
        "How the two motors move and turn the car",
        "How to make a warning sound only"
      ],
      "correctIndex": 2,
      "explanation": "The evaluation asks how a car moves forward, backward, and turns with two motors.",
      "hint": "Think about how the motors cooperate for steering."
    },
    {
      "id": "car-08",
      "topic": "program",
      "learningSlide": 11,
      "prompt": "Why does the lesson run the A and B motors one at a time?",
      "choices": [
        "To compare their effects on the car",
        "To measure the sensor's temperature",
        "To display a light pattern",
        "To reset a clock"
      ],
      "correctIndex": 0,
      "explanation": "Task 2 compares separate motor actions against the earlier task.",
      "hint": "Consider how you can discover what each motor controls."
    },
    {
      "id": "car-09",
      "topic": "challenge",
      "learningSlide": 14,
      "prompt": "What speed change does the car's final challenge suggest?",
      "choices": [
        "Go faster straight and slower while turning",
        "Go slower straight and faster while turning",
        "Keep every motion at maximum speed",
        "Only move in reverse"
      ],
      "correctIndex": 0,
      "explanation": "The challenge proposes faster forward travel and slower turns.",
      "hint": "Think about which movement may need a more careful speed."
    },
    {
      "id": "car-10",
      "topic": "challenge",
      "learningSlide": 14,
      "prompt": "Which component's rotation can students control by downloading the example program?",
      "choices": [
        "A pressure gauge",
        "A color camera",
        "A hydraulic piston",
        "Single or paired drive motors"
      ],
      "correctIndex": 3,
      "explanation": "The project summary describes controlling one motor or two motors by programming.",
      "hint": "Think about the moving parts whose speeds are controlled."
    }
  ]
};
