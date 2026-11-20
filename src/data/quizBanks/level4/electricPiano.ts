/** Level 4 quiz: reviewed official 35-page Learning PDF text. */
import type { QuizBank } from "../../quizStudio";
export const electricPianoBank: QuizBank = {
  "projectId": "level-4-electric-piano",
  "title": "Electric Piano",
  "sourcePdfPath": "public/Level 4/Sound & Voice Interaction/Electric Piano/32.Electric Piano-Slides.pdf",
  "sourcePageCount": 35,
  "questions": [
    {
      "id": "l4-electric-piano-01",
      "topic": "piano-basics",
      "learningSlide": 3,
      "prompt": "What type of instrument is a piano?",
      "choices": [
        "A wind instrument",
        "A keyboard instrument",
        "A percussion-only drum",
        "A stringless horn"
      ],
      "correctIndex": 1,
      "explanation": "The lesson introduces the piano as a keyboard instrument.",
      "hint": "Think about how keys produce sound in different pianos."
    },
    {
      "id": "l4-electric-piano-02",
      "topic": "piano-basics",
      "learningSlide": 4,
      "prompt": "How do the lesson's electric piano keys differ from a traditional piano's mechanical keys?",
      "choices": [
        "They are electronically controlled",
        "They must be made of wood",
        "They only work outdoors",
        "They use gears to strike a wheel"
      ],
      "correctIndex": 0,
      "explanation": "The electric piano uses electronic controls instead of traditional mechanical key action.",
      "hint": "Think about how keys produce sound in different pianos."
    },
    {
      "id": "l4-electric-piano-03",
      "topic": "touchscreen-layout",
      "learningSlide": 5,
      "prompt": "How many colored touchscreen keys does the project display?",
      "choices": [
        "Two",
        "Three",
        "Five",
        "Eight"
      ],
      "correctIndex": 2,
      "explanation": "The project requires five differently colored keys.",
      "hint": "Remember how the project uses colored touch areas."
    },
    {
      "id": "l4-electric-piano-04",
      "topic": "touchscreen-layout",
      "learningSlide": 26,
      "prompt": "How are the five piano keys arranged on the display?",
      "choices": [
        "Across the bottom only",
        "In a random pattern",
        "In a circle",
        "From top to bottom"
      ],
      "correctIndex": 3,
      "explanation": "Slide 26 instructs students to draw five colored rectangles vertically.",
      "hint": "Remember how the project uses colored touch areas."
    },
    {
      "id": "l4-electric-piano-05",
      "topic": "touch-position",
      "learningSlide": 21,
      "prompt": "Which drawing block is used to create a piano key?",
      "choices": [
        "Solid rectangle",
        "Circle outline",
        "Sound waveform",
        "Triangle mesh"
      ],
      "correctIndex": 0,
      "explanation": "The lesson uses solid-rectangle blocks for touch keys.",
      "hint": "Consider which coordinate changes when a point moves along the screen."
    },
    {
      "id": "l4-electric-piano-06",
      "topic": "touch-position",
      "learningSlide": 21,
      "prompt": "Which range is listed for the rectangle's screen X coordinate?",
      "choices": [
        "0 to 31",
        "0 to 239",
        "0 to 1000",
        "1 to 320"
      ],
      "correctIndex": 1,
      "explanation": "The solid-rectangle block uses X values from 0 to 239.",
      "hint": "Consider which coordinate changes when a point moves along the screen."
    },
    {
      "id": "l4-electric-piano-07",
      "topic": "touch-detection",
      "learningSlide": 23,
      "prompt": "What does the touch-point Y-axis block read?",
      "choices": [
        "Motor torque",
        "Sound frequency",
        "Vertical touch position",
        "Battery percentage"
      ],
      "correctIndex": 2,
      "explanation": "Slide 23 introduces the Y coordinate of a screen touch.",
      "hint": "Think about a program that checks for finger contact."
    },
    {
      "id": "l4-electric-piano-08",
      "topic": "touch-detection",
      "learningSlide": 24,
      "prompt": "What is the purpose of displaying the touch point's Y coordinate during testing?",
      "choices": [
        "Identify which vertical area is touched",
        "Adjust the room light",
        "Change the motor direction",
        "Measure distance to a wall"
      ],
      "correctIndex": 0,
      "explanation": "The test shows the Y coordinate so touch locations can be interpreted.",
      "hint": "Think about a program that checks for finger contact."
    },
    {
      "id": "l4-electric-piano-09",
      "topic": "play-and-improve",
      "learningSlide": 25,
      "prompt": "What does the screen-touch check return when the screen is touched?",
      "choices": [
        "100",
        "-1",
        "0",
        "1"
      ],
      "correctIndex": 3,
      "explanation": "The touch-detection block reports 1 when touch is detected.",
      "hint": "Follow the drawing and note-playing steps."
    },
    {
      "id": "l4-electric-piano-10",
      "topic": "play-and-improve",
      "learningSlide": 27,
      "prompt": "What controls which tone the electric piano's buzzer plays?",
      "choices": [
        "The color of the battery",
        "Which screen key is touched",
        "The temperature",
        "Wheel speed"
      ],
      "correctIndex": 1,
      "explanation": "The program reads touch position and produces the tone assigned to that key.",
      "hint": "Follow the drawing and note-playing steps."
    }
  ]
};
