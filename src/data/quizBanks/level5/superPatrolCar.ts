/** Verified against the official 13-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const superPatrolCarBank: QuizBank = {
  "projectId": "level-5-super-patrol-car",
  "title": "Super Patrol Car",
  "sourcePdfPath": "public/Level 5/Learning/Vehicles & Motion/Super patrol car.pdf",
  "sourcePageCount": 13,
  "questions": [
    {
      "id": "level-5-super-patrol-car-01",
      "topic": "grayscale-sensing",
      "learningSlide": 3,
      "prompt": "How many grayscale sensors are built into the integrated grayscale sensor in the lesson?",
      "choices": [
        "One",
        "Three",
        "Five",
        "Eight"
      ],
      "correctIndex": 2,
      "hint": "The module contains several detection channels.",
      "explanation": "Slide 3 explicitly identifies five grayscale sensors."
    },
    {
      "id": "level-5-super-patrol-car-02",
      "topic": "grayscale-sensing",
      "learningSlide": 3,
      "prompt": "How many grayscale sensors did the previous basic line-patrol car use?",
      "choices": [
        "One",
        "Two",
        "Five",
        "Ten"
      ],
      "correctIndex": 0,
      "hint": "The lesson contrasts the old car with the new five-sensor module.",
      "explanation": "Slide 3 says the earlier patrol car used just one grayscale sensor."
    },
    {
      "id": "level-5-super-patrol-car-03",
      "topic": "initial-setup",
      "learningSlide": 8,
      "prompt": "Which items must be set during initial programming for the super patrol car?",
      "choices": [
        "Motor ports, motor power and positions of the grayscale channels",
        "Only the robot's display wallpaper",
        "Only the vehicle's paint color",
        "The number of passengers entering a shop"
      ],
      "correctIndex": 0,
      "hint": "The setup includes drive settings and sensor locations.",
      "explanation": "Slide 8 requires initialization of motor ports and power plus positions of the five grayscale channels."
    },
    {
      "id": "level-5-super-patrol-car-04",
      "topic": "initial-setup",
      "learningSlide": 8,
      "prompt": "How are the five grayscale sensor channels numbered from left to right?",
      "choices": [
        "5, 4, 3, 2, 1",
        "1, 2, 3, 4, 5",
        "0, 2, 4, 6, 8",
        "2, 3, 4, 5, 6"
      ],
      "correctIndex": 1,
      "hint": "The numbering increases from the left edge.",
      "explanation": "Slide 8 identifies the five channels as 1, 2, 3, 4, 5 from left to right."
    },
    {
      "id": "level-5-super-patrol-car-05",
      "topic": "turn-detection",
      "learningSlide": 10,
      "prompt": "Which grayscale sensor is used to detect a left turn in the example?",
      "choices": [
        "Sensor 1",
        "Sensor 2",
        "Sensor 4",
        "Sensor 5"
      ],
      "correctIndex": 0,
      "hint": "The leftmost sensor watches for a left bend.",
      "explanation": "Slide 10 assigns left-turn detection to grayscale sensor 1."
    },
    {
      "id": "level-5-super-patrol-car-06",
      "topic": "turn-detection",
      "learningSlide": 11,
      "prompt": "Which grayscale sensor is used to detect a right turn?",
      "choices": [
        "Sensor 1",
        "Sensor 2",
        "Sensor 3",
        "Sensor 5"
      ],
      "correctIndex": 3,
      "hint": "The rightmost sensor watches for a right bend.",
      "explanation": "Slide 11 assigns right-turn detection to grayscale sensor 5."
    },
    {
      "id": "level-5-super-patrol-car-07",
      "topic": "straight-and-intersection",
      "learningSlide": 12,
      "prompt": "Which grayscale sensors are used to keep the car going straight?",
      "choices": [
        "Sensors 1 and 5 only",
        "Sensors 2, 3 and 4",
        "Only sensor 5",
        "No grayscale sensors"
      ],
      "correctIndex": 1,
      "hint": "The center sensors help follow a straight path.",
      "explanation": "Slide 12 identifies sensors 2–4 for straight-line following."
    },
    {
      "id": "level-5-super-patrol-car-08",
      "topic": "straight-and-intersection",
      "learningSlide": 12,
      "prompt": "What does it indicate when both grayscale sensors 1 and 5 detect the black line?",
      "choices": [
        "A completed battery charge",
        "A temperature alarm",
        "An intersection",
        "A QR-code password"
      ],
      "correctIndex": 2,
      "hint": "Both outer edges see dark line at once.",
      "explanation": "Slide 12 states that simultaneous black-line detection by sensors 1 and 5 marks an intersection."
    },
    {
      "id": "level-5-super-patrol-car-09",
      "topic": "route-and-testing",
      "learningSlide": 9,
      "prompt": "What route does the lesson suggest for testing the patrol car?",
      "choices": [
        "Turn left, then right, then stop at the route's end",
        "Drive only backward without stopping",
        "Move through a door whenever it sees a face",
        "Spin continuously without following a line"
      ],
      "correctIndex": 0,
      "hint": "The suggested path includes two corners.",
      "explanation": "Slide 9 specifies navigating a left corner, then a right corner, before stopping at the end."
    },
    {
      "id": "level-5-super-patrol-car-10",
      "topic": "route-and-testing",
      "learningSlide": 13,
      "prompt": "What can students create themselves for the car to follow after building and programming it?",
      "choices": [
        "A route or map",
        "A wireless telephone network",
        "A barometric pressure chamber",
        "An employee face database"
      ],
      "correctIndex": 0,
      "hint": "The final slide asks students to design the path.",
      "explanation": "Slide 13 invites students to design their own map for the line-patrol car."
    }
  ]
};
