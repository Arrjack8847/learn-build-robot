/** Level 4 — Probe Vehicle. Questions checked against the 17-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const probeVehicleBank: QuizBank = {
  "projectId": "level-4-probe-vehicle",
  "title": "Probe Vehicle",
  "sourcePdfPath": "public/Level 4/Autonomous Navigation & Ranging/Probe Vehicle/02.Probe Vehicle.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "l4-probevehicle-01",
      "topic": "rescue-purpose",
      "learningSlide": 3,
      "prompt": "When might a Probe Vehicle be useful?",
      "choices": [
        "After a natural disaster",
        "At a swimming race",
        "While painting a wall",
        "During a music lesson"
      ],
      "correctIndex": 0,
      "explanation": "Slide 3 introduces using probe vehicles during disaster rescue.",
      "hint": "Think about exploring places that may be dangerous for people."
    },
    {
      "id": "l4-probevehicle-02",
      "topic": "rescue-purpose",
      "learningSlide": 4,
      "prompt": "How can a Probe Vehicle help rescuers understand rubble inside a damaged building?",
      "choices": [
        "By sending camera images",
        "By playing music",
        "By printing a receipt",
        "By shining a colored sticker"
      ],
      "correctIndex": 0,
      "explanation": "Slide 4 describes transmitting images from inside ruins to rescuers.",
      "hint": "Think about seeing an area that is hard to enter."
    },
    {
      "id": "l4-probevehicle-03",
      "topic": "color-detection",
      "learningSlide": 6,
      "prompt": "Which group of colors can the AI audio-visual module recognize in this lesson?",
      "choices": [
        "Red, yellow, green, and blue",
        "Black, white, gray, and brown",
        "Pink, purple, gold, and silver",
        "Orange, beige, teal, and maroon"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 lists red, yellow, green, and blue.",
      "hint": "Think about the four colors named in the sensing lesson."
    },
    {
      "id": "l4-probevehicle-04",
      "topic": "color-detection",
      "learningSlide": 7,
      "prompt": "Which recognition mode should the Probe Vehicle use?",
      "choices": [
        "Tag recognition",
        "Color detection",
        "Speech recording",
        "Weather measuring"
      ],
      "correctIndex": 1,
      "explanation": "Slide 7 describes selecting color detection mode.",
      "hint": "The robot must recognize a color-coded signal."
    },
    {
      "id": "l4-probevehicle-05",
      "topic": "robot-hardware",
      "learningSlide": 9,
      "prompt": "Which controller ports are used for the Probe Vehicle's two motors?",
      "choices": [
        "P1 and P2",
        "M1 and M2",
        "P7 and P8",
        "USB and HDMI"
      ],
      "correctIndex": 1,
      "explanation": "Slide 9 connects the two motors to M1 and M2.",
      "hint": "Look for the ports named for motors."
    },
    {
      "id": "l4-probevehicle-06",
      "topic": "robot-hardware",
      "learningSlide": 9,
      "prompt": "Where is the AI audio-visual module connected?",
      "choices": [
        "P8",
        "M1",
        "M2",
        "P2"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 connects the module to P8.",
      "hint": "The camera module uses a sensing port."
    },
    {
      "id": "l4-probevehicle-07",
      "topic": "hazard-response",
      "learningSlide": 11,
      "prompt": "Which color is the Probe Vehicle programmed to recognize as a hazard?",
      "choices": [
        "Green",
        "Blue",
        "Red",
        "Yellow"
      ],
      "correctIndex": 2,
      "explanation": "Slide 11 describes recognizing hazards in red.",
      "hint": "Think about a color often used as a warning."
    },
    {
      "id": "l4-probevehicle-08",
      "topic": "hazard-response",
      "learningSlide": 12,
      "prompt": "What happens when the Probe Vehicle detects a hazardous environment?",
      "choices": [
        "It sounds an alarm and stops",
        "It always speeds up",
        "It plays music and keeps moving",
        "It opens a suitcase"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 specifies an alarm and stop when danger is detected.",
      "hint": "Safety comes before continuing into a dangerous area."
    },
    {
      "id": "l4-probevehicle-09",
      "topic": "repeating-detection",
      "learningSlide": 10,
      "prompt": "What does the robot use detected colors to choose?",
      "choices": [
        "Different actions",
        "A new paint job",
        "A larger wheel",
        "A different battery"
      ],
      "correctIndex": 0,
      "explanation": "Slide 10 says different detected colors lead to corresponding actions.",
      "hint": "The program makes choices from sensor readings."
    },
    {
      "id": "l4-probevehicle-10",
      "topic": "repeating-detection",
      "learningSlide": 15,
      "prompt": "Why does the complete Probe Vehicle program include a repeat block?",
      "choices": [
        "To keep checking for colors",
        "To stop all sensing after one try",
        "To remove the controller",
        "To make the robot heavier"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 adds repeat execution for ongoing recognition.",
      "hint": "A moving rescue robot needs to check more than once."
    }
  ]
};
