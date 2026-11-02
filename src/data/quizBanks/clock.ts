/** Checked against Clock Learning PDF slide text. */
import type { QuizBank } from "../quizStudio";
export const clockBank: QuizBank = {
  "projectId": "clock",
  "title": "Clock",
  "sourcePdfPath": "public/Level 1/Learning/Display & Movement/Clock/Clock_Powerpoint.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "c01",
      "topic": "music",
      "learningSlide": 7,
      "prompt": "Which audio format does the Clock lesson use for stored music?",
      "choices": [
        "WAV only",
        "MIDI only",
        "MP3",
        "FLAC only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 7 says the RCU can play built-in MP3 files.",
      "hint": "Recall the music format named in the lesson."
    },
    {
      "id": "c02",
      "topic": "music",
      "learningSlide": 7,
      "prompt": "According to the Clock PDF, can the RCU's music-box example play several songs?",
      "choices": [
        "Yes, several songs",
        "No, exactly one song",
        "Only a buzzer tone",
        "Only music sent over Bluetooth"
      ],
      "correctIndex": 0,
      "explanation": "The lesson says more than one song can be played.",
      "hint": "Think about whether the example is restricted to a single recording."
    },
    {
      "id": "c03",
      "topic": "design",
      "learningSlide": 9,
      "prompt": "What is the Clock robot's listed structure?",
      "choices": [
        "Wheels and steering",
        "Claw and gripper",
        "Tracks and suspension",
        "Pointer and reminder"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 names a pointer and reminder style.",
      "hint": "Think about the visible feature of a reminder or clock."
    },
    {
      "id": "c04",
      "topic": "design",
      "learningSlide": 9,
      "prompt": "How strictly does the lesson limit the Clock robot's appearance?",
      "choices": [
        "It must be shaped like a tower",
        "It has no fixed appearance limit",
        "It must have two wheels",
        "It must look like a human"
      ],
      "correctIndex": 1,
      "explanation": "The slide gives no fixed appearance limit.",
      "hint": "Consider whether the brief allows multiple designs."
    },
    {
      "id": "c05",
      "topic": "hardware",
      "learningSlide": 10,
      "prompt": "Which controller is identified for the Clock robot?",
      "choices": [
        "GPS module",
        "RCU",
        "Ultrasonic module",
        "Camera module"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 lists the RCU as an electronic component.",
      "hint": "Think of the device that holds the example's music files."
    },
    {
      "id": "c06",
      "topic": "hardware",
      "learningSlide": 10,
      "prompt": "Which optional visual component may be added to the Clock model?",
      "choices": [
        "Distance-measuring sonar",
        "Pressure sensor",
        "Wheel encoder",
        "Colored lantern lights"
      ],
      "correctIndex": 3,
      "explanation": "The equipment list says lantern lights can be added.",
      "hint": "Think about a visual output that can accompany sounds."
    },
    {
      "id": "c07",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "Which assembly requirement helps the model remain upright?",
      "choices": [
        "Stable structure",
        "Loose joints",
        "Long unsupported arms",
        "Unbalanced weight"
      ],
      "correctIndex": 0,
      "explanation": "Stability is an explicit assembly requirement.",
      "hint": "Think about how to stop a model from toppling."
    },
    {
      "id": "c08",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "Which assembly check compares the robot to its planned design?",
      "choices": [
        "Sensor calibration",
        "Motor speed",
        "Shape match",
        "Music volume"
      ],
      "correctIndex": 2,
      "explanation": "The lesson checks that the assembled shape matches the plan.",
      "hint": "Compare the completed model with your sketch."
    },
    {
      "id": "c09",
      "topic": "goals",
      "learningSlide": 3,
      "prompt": "What audio-related module is named in the Clock lesson's learning focus?",
      "choices": [
        "Servo control module",
        "Pressure reading module",
        "Buzzer module",
        "Ultrasonic ranging module"
      ],
      "correctIndex": 2,
      "explanation": "Slide 3 mentions the buzzer module and importing music.",
      "hint": "Think of a module used to make audible tones."
    },
    {
      "id": "c10",
      "topic": "goals",
      "learningSlide": 2,
      "prompt": "Which programming topic is part of the Clock lesson's goals?",
      "choices": [
        "Barometric altitude calculation",
        "The order of commands",
        "Servo angle calibration",
        "Ultrasonic echo timing"
      ],
      "correctIndex": 1,
      "explanation": "The slide introduces program concepts and sequence structure.",
      "hint": "Think about why command order changes the result."
    }
  ]
};
