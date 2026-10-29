/** Verified against official Level 3 PDF; references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const washingMachineBank: QuizBank = {
  "projectId": "level-3-washing-machine",
  "title": "Washing Machine",
  "sourcePdfPath": "public/Level 3/Learning/Interactive Systems/Washing Machine/08.Washing Machine-Slides.pdf",
  "sourcePageCount": 30,
  "questions": [
    {
      "id": "washingmachine-01",
      "topic": "purpose",
      "learningSlide": 3,
      "prompt": "What two functions are associated with a household washing machine in the lesson?",
      "choices": [
        "Cleaning and drying clothes",
        "Weighing groceries and printing labels",
        "Opening and closing garage doors",
        "Counting banknotes and playing music"
      ],
      "correctIndex": 0,
      "hint": "A washing machine includes cleaning and spinning functions.",
      "explanation": "Slide 3 discusses cleaning and drying clothes."
    },
    {
      "id": "washingmachine-02",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "Which washing-machine type is named in the lesson?",
      "choices": [
        "Ultrasonic bridge machine",
        "Drum washing machine",
        "Electric ladder machine",
        "Photoelectric scale machine"
      ],
      "correctIndex": 1,
      "hint": "A washing machine includes cleaning and spinning functions.",
      "explanation": "Slide 4 lists drum washing machines among the types."
    },
    {
      "id": "washingmachine-03",
      "topic": "motors",
      "learningSlide": 7,
      "prompt": "Which motions can a large motor perform under controller commands?",
      "choices": [
        "Only continuous forward motion",
        "Only audio playback",
        "Forward, reverse and stop",
        "Only grayscale detection"
      ],
      "correctIndex": 2,
      "hint": "Compare power and speed properties of large versus medium motors.",
      "explanation": "Slide 7 lists forward rotation, reverse rotation and braking."
    },
    {
      "id": "washingmachine-04",
      "topic": "motors",
      "learningSlide": 8,
      "prompt": "Which description matches the large motor compared with a medium motor?",
      "choices": [
        "Higher speed and lower power",
        "No rotation capability",
        "The same output arrangement and speed in all cases",
        "Lower speed and higher power"
      ],
      "correctIndex": 3,
      "hint": "Compare power and speed properties of large versus medium motors.",
      "explanation": "Slide 8 characterizes the large motor as slower and more powerful."
    },
    {
      "id": "washingmachine-05",
      "topic": "ports",
      "learningSlide": 10,
      "prompt": "Which controller ports can power the model's large motor?",
      "choices": [
        "M1–M4",
        "P1–P8 sensor ports only",
        "The speaker jack",
        "The screen connector only"
      ],
      "correctIndex": 0,
      "hint": "The controller has dedicated motor connections.",
      "explanation": "Slide 10 lists motor connections M1–M4."
    },
    {
      "id": "washingmachine-06",
      "topic": "ports",
      "learningSlide": 11,
      "prompt": "Which built-in interface checks large motor movement?",
      "choices": [
        "Gray",
        "Motor",
        "Ultrasonic",
        "Color"
      ],
      "correctIndex": 1,
      "hint": "The controller has dedicated motor connections.",
      "explanation": "Slide 11 opens the Motor test."
    },
    {
      "id": "washingmachine-07",
      "topic": "controls",
      "learningSlide": 6,
      "prompt": "Which input starts the slow washing state?",
      "choices": [
        "Right button",
        "Color-sensor green detection",
        "Left button",
        "Touch sensor only"
      ],
      "correctIndex": 2,
      "hint": "Each input selects a distinct working state.",
      "explanation": "Slide 6 maps the left button to slow washing."
    },
    {
      "id": "washingmachine-08",
      "topic": "controls",
      "learningSlide": 6,
      "prompt": "What should a touch-sensor press do in the model washing machine?",
      "choices": [
        "Start faster spinning",
        "Run the motor slowly",
        "Reverse forever",
        "Stop the motor"
      ],
      "correctIndex": 3,
      "hint": "Each input selects a distinct working state.",
      "explanation": "Slide 6 stops motor operation when the touch sensor is pressed."
    },
    {
      "id": "washingmachine-09",
      "topic": "feedback",
      "learningSlide": 6,
      "prompt": "What should the screen display during fast spinning?",
      "choices": [
        "Dehydrating",
        "Washing",
        "Stopped working",
        "Waiting"
      ],
      "correctIndex": 0,
      "hint": "Screen text communicates the machine's state.",
      "explanation": "Slide 6 displays 'Dehydrating' when the right button runs the motor quickly."
    },
    {
      "id": "washingmachine-10",
      "topic": "feedback",
      "learningSlide": 24,
      "prompt": "Which programming block can display a washing-status message?",
      "choices": [
        "Get ultrasonic distance",
        "Display character",
        "Set gear ratio",
        "Play MP3 folder"
      ],
      "correctIndex": 1,
      "hint": "Screen text communicates the machine's state.",
      "explanation": "Slide 24 adds a display-character block above motor speed commands."
    }
  ]
};
