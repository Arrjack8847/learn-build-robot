/** Level 4 Learning PDF text checked page by page; no unreviewed diagrams assumed. */
import type { QuizBank } from "../../quizStudio";

export const laserRangefinderBank: QuizBank = {
  "projectId": "level-4-laser-rangefinder",
  "title": "Laser Rangefinder",
  "sourcePdfPath": "public/Level 4/Autonomous Navigation & Ranging/Laser Rangefinder/10. Laser Rangefinder - Teaching Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "l4-lr-01",
      "topic": "laser-uses",
      "learningSlide": 7,
      "prompt": "Why does the lesson describe laser rangefinders as useful in house measurement?",
      "choices": [
        "They play music at each wall",
        "They reduce measurement errors and improve efficiency",
        "They replace building drawings",
        "They make a house smaller"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 compares laser rangefinders favorably with tape measurements.",
      "hint": "Think about measuring long spaces accurately."
    },
    {
      "id": "l4-lr-02",
      "topic": "laser-uses",
      "learningSlide": 10,
      "prompt": "Which task is a real application of laser ranging mentioned in the lesson?",
      "choices": [
        "Measuring a room or surveying terrain",
        "Measuring the taste of food",
        "Listening for a spoken name",
        "Changing a light's color randomly"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 lists survey and industrial measurement applications.",
      "hint": "Laser rangefinding is about physical distances."
    },
    {
      "id": "l4-lr-03",
      "topic": "time-of-flight",
      "learningSlide": 10,
      "prompt": "What observation helps a laser rangefinder calculate a target's distance?",
      "choices": [
        "The target's smell",
        "The brightness of a speaker",
        "The room's humidity",
        "Time between emitting and receiving reflected laser light"
      ],
      "correctIndex": 3,
      "explanation": "Slide 10 explains determining distance from light's outgoing-and-return travel time.",
      "hint": "The device emits light and detects its reflection."
    },
    {
      "id": "l4-lr-04",
      "topic": "time-of-flight",
      "learningSlide": 11,
      "prompt": "Which component measures the gap between itself and an object in this lesson?",
      "choices": [
        "A color sensor",
        "An ultrasonic buzzer",
        "A laser ranging sensor",
        "A magnetic switch"
      ],
      "correctIndex": 2,
      "explanation": "Slide 11 defines a laser ranging sensor as a distance-measuring component.",
      "hint": "It uses laser light to measure a range."
    },
    {
      "id": "l4-lr-05",
      "topic": "measurement-modes",
      "learningSlide": 11,
      "prompt": "What maximum range is given for the sensor's standard mode?",
      "choices": [
        "1.2 metres",
        "2 metres",
        "10 metres",
        "100 metres"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 gives 1.2 m as the standard-mode maximum.",
      "hint": "It is shorter than the long-distance mode."
    },
    {
      "id": "l4-lr-06",
      "topic": "measurement-modes",
      "learningSlide": 11,
      "prompt": "What maximum range is given for long-distance mode?",
      "choices": [
        "50 centimetres",
        "2 metres",
        "20 metres",
        "200 metres"
      ],
      "correctIndex": 1,
      "explanation": "Slide 11 gives 2 m for long-distance mode.",
      "hint": "This mode measures farther than standard mode."
    },
    {
      "id": "l4-lr-07",
      "topic": "invalid-readings",
      "learningSlide": 12,
      "prompt": "What value indicates an out-of-range measurement?",
      "choices": [
        "0",
        "100",
        "888",
        "8888"
      ],
      "correctIndex": 3,
      "explanation": "Slide 12 states that 8888 represents invalid sensor data.",
      "hint": "Find the repeated four-digit sentinel."
    },
    {
      "id": "l4-lr-08",
      "topic": "invalid-readings",
      "learningSlide": 17,
      "prompt": "How does the sample program display an invalid measurement?",
      "choices": [
        "As the last password",
        "As 8888 metres",
        "As 0",
        "As a negative temperature"
      ],
      "correctIndex": 2,
      "explanation": "Slide 17 instructs the program to show invalid data as zero.",
      "hint": "Which replacement value makes an invalid reading obvious?"
    },
    {
      "id": "l4-lr-09",
      "topic": "recording-data",
      "learningSlide": 18,
      "prompt": "How does the student record the current distance measurement?",
      "choices": [
        "Press a button to save it in the controller",
        "Remove the sensor cable",
        "Change the motor speed",
        "Turn the lamp off"
      ],
      "correctIndex": 0,
      "explanation": "Slide 18 specifies pressing a button to store the measured value.",
      "hint": "The controller has a method to save a reading."
    },
    {
      "id": "l4-lr-10",
      "topic": "recording-data",
      "learningSlide": 22,
      "prompt": "What is the goal of the program-optimization activity?",
      "choices": [
        "Remove the controller's display",
        "Show the last recorded measurement while allowing new recording",
        "Stop using distance values",
        "Display only motor temperatures"
      ],
      "correctIndex": 1,
      "explanation": "Slide 22 requests the last recorded data to be displayed and new data recorded with the right button.",
      "hint": "Think about remembering and reviewing a previous reading."
    }
  ]
};
