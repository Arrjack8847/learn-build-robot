/** Questions grounded in A Timid Mouse Learning PDF. */
import type { QuizBank } from "../quizStudio";
export const timidMouseBank: QuizBank = {
  "projectId": "level-4-a-timid-mouse",
  "title": "A Timid Mouse",
  "sourcePdfPath": "public/Level 4/Characters & Structures/A Timid Mouse/Lesson 25. A Timid Mouse-Teaching Slides.pdf",
  "sourcePageCount": 27,
  "questions": [
    {
      "id": "tm01",
      "topic": "intelligent-eye",
      "learningSlide": 8,
      "prompt": "What two capabilities does the Intelligent Eye provide in this lesson?",
      "choices": [
        "Sound playback and air-pressure measurement",
        "Colored LED lighting and infrared obstacle sensing",
        "Ultrasonic distance and GPS location",
        "Motor speed and wheel angle readings"
      ],
      "correctIndex": 1,
      "explanation": "Slide 8 describes LEDs and infrared obstacle detection.",
      "hint": "Think about how the robot can notice an object and respond visually."
    },
    {
      "id": "tm02",
      "topic": "intelligent-eye",
      "learningSlide": 8,
      "prompt": "How many built-in LED lights does the Intelligent Eye have?",
      "choices": [
        "4",
        "12",
        "16",
        "8"
      ],
      "correctIndex": 3,
      "explanation": "The lesson lists eight built-in 24-bit LED lights.",
      "hint": "Look for the number of light elements inside the eye module."
    },
    {
      "id": "tm03",
      "topic": "obstacle-detection",
      "learningSlide": 9,
      "prompt": "What is the longest object-detection distance listed for the Intelligent Eye?",
      "choices": [
        "5 cm",
        "30 cm",
        "15 cm",
        "100 cm"
      ],
      "correctIndex": 2,
      "explanation": "The lesson states a maximum infrared detection distance of 15 cm.",
      "hint": "Think about the short distance used for this mouse's obstacle detection."
    },
    {
      "id": "tm04",
      "topic": "obstacle-detection",
      "learningSlide": 14,
      "prompt": "What sensor value means an object has been detected?",
      "choices": [
        "1",
        "0",
        "-1",
        "2"
      ],
      "correctIndex": 0,
      "explanation": "The slide defines 1 as detected and 0 as not detected.",
      "hint": "Think about the two-state result returned by the detector."
    },
    {
      "id": "tm05",
      "topic": "lights",
      "learningSlide": 10,
      "prompt": "Which lighting effect is available in the Intelligent Eye?",
      "choices": [
        "Breathing light",
        "Radar distance graph",
        "GPS route map",
        "Motor-rotation chart"
      ],
      "correctIndex": 0,
      "explanation": "The module's demonstration modes include breathing light.",
      "hint": "Consider the visual animation modes of the LED elements."
    },
    {
      "id": "tm06",
      "topic": "lights",
      "learningSlide": 13,
      "prompt": "How does the lesson change an Intelligent Eye light's color?",
      "choices": [
        "Change the motor port number",
        "Reverse wheel direction",
        "Select a color block",
        "Reset the distance threshold"
      ],
      "correctIndex": 2,
      "explanation": "Slide 13 describes clicking a color block to choose a light color.",
      "hint": "Think about the control used for changing colored LEDs."
    },
    {
      "id": "tm07",
      "topic": "avoidance",
      "learningSlide": 16,
      "prompt": "What does the Timid Mouse do when an obstacle is detected in front?",
      "choices": [
        "Speeds forward and sounds an alarm",
        "Stops all sensors permanently",
        "Changes its body shape",
        "Moves backward and changes light color"
      ],
      "correctIndex": 3,
      "explanation": "The assembly objective is to retreat and change LED color when an object appears.",
      "hint": "Think about why the mouse might move away from an approaching object."
    },
    {
      "id": "tm08",
      "topic": "avoidance",
      "learningSlide": 20,
      "prompt": "In the P7 obstacle-detection program, which motor reverses to back away?",
      "choices": [
        "M2",
        "M1",
        "M3",
        "M4"
      ],
      "correctIndex": 1,
      "explanation": "Slide 20 says P7 detection reverses motor M1.",
      "hint": "Look for the motor paired with the P7 eye."
    },
    {
      "id": "tm09",
      "topic": "startup-and-improve",
      "learningSlide": 18,
      "prompt": "What must happen before the mouse's white startup lights appear?",
      "choices": [
        "The power module is removed",
        "An object activates the eye",
        "The motor is reversed for ten seconds",
        "The sensor is reset to zero pressure"
      ],
      "correctIndex": 1,
      "explanation": "Slide 18 activates the robot when an object is in front of the eye.",
      "hint": "Think about what event starts this lesson's robot."
    },
    {
      "id": "tm10",
      "topic": "startup-and-improve",
      "learningSlide": 25,
      "prompt": "What does the optimization task change the robot to do after detecting an object?",
      "choices": [
        "Move forward with a green eye light",
        "Reverse with a red eye light",
        "Stop moving with the LEDs off",
        "Move sideways with a blue eye light"
      ],
      "correctIndex": 0,
      "explanation": "The extension asks the robot to move forward while its eye glows green.",
      "hint": "Think about how the extension differs from the original retreat behavior."
    }
  ]
};
