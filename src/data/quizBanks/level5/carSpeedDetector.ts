/** Ten questions checked against the official 23-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const carSpeedDetectorBank: QuizBank = {
  "projectId": "level-5-car-speed-detector",
  "title": "Car Speed Detector",
  "sourcePdfPath": "public/Level 5/Learning/Sensor-Focused Robots/Car Speed Detector/11. Car Speed Detector-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "level-5-car-speed-detector-01",
      "topic": "laser-measurement",
      "learningSlide": 6,
      "prompt": "What signal does the described laser ranging method use to estimate distance?",
      "choices": [
        "The time taken by a laser reflection to return",
        "The sound of a passing car's horn",
        "The temperature of the laser",
        "The brightness of the car's headlights"
      ],
      "correctIndex": 0,
      "hint": "The laser travels to the target and comes back.",
      "explanation": "Slide 6 describes measuring the travel time between emitting laser light and receiving its reflection."
    },
    {
      "id": "level-5-car-speed-detector-02",
      "topic": "laser-measurement",
      "learningSlide": 9,
      "prompt": "How does the lesson describe measuring a moving object's speed using laser distance readings?",
      "choices": [
        "Take one reading and guess the speed",
        "Measure the distance twice with a known time interval",
        "Measure only the object's color",
        "Count the wheels without measuring time"
      ],
      "correctIndex": 1,
      "hint": "Speed needs a change in distance over time.",
      "explanation": "Slide 9 explains comparing two distance measurements separated by a known interval."
    },
    {
      "id": "level-5-car-speed-detector-03",
      "topic": "speed-formula",
      "learningSlide": 10,
      "prompt": "What is the formula for speed taught in this lesson?",
      "choices": [
        "Time divided by distance",
        "Distance multiplied by time",
        "Distance divided by time",
        "Distance plus time"
      ],
      "correctIndex": 2,
      "hint": "Ask how far the object moves during each second.",
      "explanation": "Slide 10 explicitly gives speed = distance ÷ time."
    },
    {
      "id": "level-5-car-speed-detector-04",
      "topic": "speed-formula",
      "learningSlide": 10,
      "prompt": "A car moves 10 meters in 2 seconds. What is its average speed?",
      "choices": [
        "10 meters per second",
        "20 meters per second",
        "2 meters per second",
        "5 meters per second"
      ],
      "correctIndex": 3,
      "hint": "Divide the distance by the elapsed time.",
      "explanation": "Using slide 10's speed formula, 10 meters ÷ 2 seconds = 5 meters per second."
    },
    {
      "id": "level-5-car-speed-detector-05",
      "topic": "round-trip-time",
      "learningSlide": 7,
      "prompt": "A laser takes 2.56 seconds to travel to a target and reflect back. What is the one-way travel time?",
      "choices": [
        "1.28 seconds",
        "2.56 seconds",
        "5.12 seconds",
        "0.64 seconds"
      ],
      "correctIndex": 0,
      "hint": "The full journey includes going and returning.",
      "explanation": "Slide 7 halves the round-trip laser time: 2.56 ÷ 2 = 1.28 seconds."
    },
    {
      "id": "level-5-car-speed-detector-06",
      "topic": "round-trip-time",
      "learningSlide": 7,
      "prompt": "Using the lesson's example of 300,000 km/s, how far does light travel in 1.28 seconds?",
      "choices": [
        "300,000 kilometers",
        "384,000 kilometers",
        "768,000 kilometers",
        "234,375 kilometers"
      ],
      "correctIndex": 1,
      "hint": "Multiply the given speed by the one-way travel time.",
      "explanation": "Slide 7 calculates 300,000 × 1.28 = 384,000 kilometers for the example distance to the Moon."
    },
    {
      "id": "level-5-car-speed-detector-07",
      "topic": "measurement-sequence",
      "learningSlide": 13,
      "prompt": "Which data are needed after the object enters the speed-measurement stage?",
      "choices": [
        "The weather and current date",
        "Only the object's color",
        "Two distance measurements and the elapsed interval",
        "Only the car's number plate"
      ],
      "correctIndex": 2,
      "hint": "Recall what changes between two readings.",
      "explanation": "Slide 13 describes storing two distance readings and the time between them to calculate speed."
    },
    {
      "id": "level-5-car-speed-detector-08",
      "topic": "measurement-sequence",
      "learningSlide": 15,
      "prompt": "Why does the lesson clear the display before showing new speed data?",
      "choices": [
        "To switch off the motor permanently",
        "To make the car move faster",
        "To increase the laser's physical range",
        "To avoid leftover data causing display errors"
      ],
      "correctIndex": 3,
      "hint": "Think about old values left on the screen.",
      "explanation": "Slide 15 directs students to clear the display before presenting the two new measurements."
    },
    {
      "id": "level-5-car-speed-detector-09",
      "topic": "conversion-and-accuracy",
      "learningSlide": 16,
      "prompt": "How does the program convert speed from meters per second to kilometers per hour?",
      "choices": [
        "Multiply by 3.6",
        "Add 3.6",
        "Divide by 100",
        "Multiply by 0.001"
      ],
      "correctIndex": 0,
      "hint": "The conversion factor is shown on the programming slide.",
      "explanation": "Slide 16 instructs multiplying speed in meters per second by 3.6 to obtain kilometers per hour."
    },
    {
      "id": "level-5-car-speed-detector-10",
      "topic": "conversion-and-accuracy",
      "learningSlide": 21,
      "prompt": "What does the lesson propose changing to improve the detector's measurement results?",
      "choices": [
        "The order of answer labels",
        "The speed-measurement interval",
        "The robot's name on screen",
        "The detector's paint color"
      ],
      "correctIndex": 1,
      "hint": "The time between two sensor readings matters.",
      "explanation": "Slide 21 proposes adjusting the interval between readings to obtain more accurate, reasonable results."
    }
  ]
};
