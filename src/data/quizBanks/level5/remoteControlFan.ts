/** Source: hash-matched official Level 5 Learning PDF (25 pages). */
import type { QuizBank } from "../../quizStudio";

export const remoteControlFanBank: QuizBank = {
  "projectId": "level-5-remote-control-fan",
  "title": "Remote Control Fan",
  "sourcePdfPath": "public/Level 5/Learning/Programming & Precise Control/Remote Control Fan/26. Remote Control Fan-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "level-5-remote-control-fan-01",
      "topic": "infrared-basics",
      "learningSlide": 6,
      "prompt": "Which part of an infrared remote transmits the control signal?",
      "choices": [
        "Infrared emitter",
        "Motor encoder",
        "Photoelectric floor sensor",
        "Mechanical crank"
      ],
      "correctIndex": 0,
      "hint": "The handheld device sends information outward.",
      "explanation": "Slide 6 explains that the remote contains an infrared emitter."
    },
    {
      "id": "level-5-remote-control-fan-02",
      "topic": "infrared-basics",
      "learningSlide": 6,
      "prompt": "What does the controlled television or device use to detect the transmitted signal?",
      "choices": [
        "Coin slot",
        "Infrared receiver",
        "Speed button",
        "Speaker coil"
      ],
      "correctIndex": 1,
      "hint": "The receiving device detects infrared light.",
      "explanation": "Slide 6 describes the receiving device's infrared receiver."
    },
    {
      "id": "level-5-remote-control-fan-03",
      "topic": "intelligent-eye",
      "learningSlide": 8,
      "prompt": "Which two infrared capabilities does the Intelligent Eye module provide?",
      "choices": [
        "Only display QR codes",
        "Only rotate a wheel",
        "Send and receive signals",
        "Only measure air pressure"
      ],
      "correctIndex": 2,
      "hint": "The module communicates in both directions.",
      "explanation": "Slide 8 states the Intelligent Eye incorporates an IR emitter and receiver."
    },
    {
      "id": "level-5-remote-control-fan-04",
      "topic": "intelligent-eye",
      "learningSlide": 9,
      "prompt": "Which side of the Intelligent Eye contains the infrared receiving head?",
      "choices": [
        "Right side",
        "Inside the motor",
        "Under the battery",
        "Left side"
      ],
      "correctIndex": 3,
      "hint": "The lesson labels symmetric infrared heads.",
      "explanation": "Slide 9 places the infrared receiver on the left and emitter on the right."
    },
    {
      "id": "level-5-remote-control-fan-05",
      "topic": "remote-program",
      "learningSlide": 16,
      "prompt": "What numeric infrared command is sent when the remote's left button is pressed?",
      "choices": [
        "100",
        "200",
        "999",
        "65488"
      ],
      "correctIndex": 0,
      "hint": "Read the first IR send example.",
      "explanation": "Slide 16 sends infrared data 100 with the left button."
    },
    {
      "id": "level-5-remote-control-fan-06",
      "topic": "remote-program",
      "learningSlide": 17,
      "prompt": "What numeric infrared command is sent when the remote's right button is pressed?",
      "choices": [
        "0",
        "200",
        "100",
        "4095"
      ],
      "correctIndex": 1,
      "hint": "Read the other IR send example.",
      "explanation": "Slide 17 sends infrared data 200 with the right button."
    },
    {
      "id": "level-5-remote-control-fan-07",
      "topic": "fan-decisions",
      "learningSlide": 15,
      "prompt": "How does the fan controller decide whether to turn the motor on or off?",
      "choices": [
        "Listen for a random sound",
        "Ignore the received remote signal",
        "Compare the received infrared variable with command values",
        "Measure the fan blade's color"
      ],
      "correctIndex": 2,
      "hint": "The program reads data and judges its value.",
      "explanation": "Slide 15 stores IR data in a variable and tests whether the command means start or stop."
    },
    {
      "id": "level-5-remote-control-fan-08",
      "topic": "fan-decisions",
      "learningSlide": 19,
      "prompt": "What action is associated with received infrared value 100?",
      "choices": [
        "Turn the fan off",
        "Change the scanner port",
        "Reset the Bluetooth host",
        "Turn the fan on"
      ],
      "correctIndex": 3,
      "hint": "Compare the two assigned codes.",
      "explanation": "Slide 19 defines 100 as on and 200 as off."
    },
    {
      "id": "level-5-remote-control-fan-09",
      "topic": "secure-code",
      "learningSlide": 23,
      "prompt": "What is the goal of the lesson's remote-control optimization?",
      "choices": [
        "Make the fan respond only to your chosen control code",
        "Make every nearby remote activate the fan",
        "Remove the receiver",
        "Stop using IR entirely"
      ],
      "correctIndex": 0,
      "hint": "The program should recognize authorized commands.",
      "explanation": "Slide 23 asks for a modified code that makes the fan respond only to the user's control."
    },
    {
      "id": "level-5-remote-control-fan-10",
      "topic": "secure-code",
      "learningSlide": 24,
      "prompt": "Which benefit of infrared remote control is mentioned in the reading?",
      "choices": [
        "Dependence on mobile internet service",
        "Low power use and reliable non-contact transmission",
        "The need for a physical cable to the fan",
        "Unlimited range through solid walls"
      ],
      "correctIndex": 1,
      "hint": "The final slide lists reasons IR is popular.",
      "explanation": "Slide 24 describes IR as wireless, low-cost and low-power remote control."
    }
  ]
};
