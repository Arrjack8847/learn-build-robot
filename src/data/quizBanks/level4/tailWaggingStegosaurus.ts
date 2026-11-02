import type { QuizBank } from "../../quizStudio";
/** Level 4 source-backed Tail-Wagging Stegosaurus quiz. */
export const tailWaggingStegosaurusBank: QuizBank = {
  "projectId": "level-4-tail-wagging-stegosaurus",
  "title": "Tail-Wagging Stegosaurus",
  "sourcePdfPath": "public/Level 4/Characters & Structures/Tail-Wagging Stegosaurus/18. Tail-Wagging Stegosaurus-Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "l4-tail-wagging-stegosaurus-01",
      "topic": "dinosaur-anatomy",
      "learningSlide": 4,
      "prompt": "What kind of diet did Stegosaurus have?",
      "choices": [
        "Herbivorous",
        "Carnivorous only",
        "Omnivorous fish-based",
        "Insect-only"
      ],
      "correctIndex": 0,
      "explanation": "The lesson describes Stegosaurus as a plant-eating dinosaur.",
      "hint": "Recall the biological details in the introduction."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-02",
      "topic": "dinosaur-anatomy",
      "learningSlide": 5,
      "prompt": "What distinctive feature does the lesson describe on Stegosaurus's back?",
      "choices": [
        "Feathers only",
        "Rows of plates",
        "A pair of wings",
        "A long fur coat"
      ],
      "correctIndex": 1,
      "explanation": "The lesson describes dorsal plates along its back.",
      "hint": "Recall the biological details in the introduction."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-03",
      "topic": "audio-playback",
      "learningSlide": 8,
      "prompt": "Why does the model use an external audio file?",
      "choices": [
        "To read motor ports",
        "To connect a new sensor",
        "To create richer sounds than the buzzer",
        "To control screen brightness"
      ],
      "correctIndex": 2,
      "explanation": "Audio playback is used because a simple buzzer cannot reproduce the chosen sounds well.",
      "hint": "Consider why an audio file is used instead of a simple beep."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-04",
      "topic": "audio-playback",
      "learningSlide": 9,
      "prompt": "Which controller system setting is tested for external sound?",
      "choices": [
        "GPS",
        "Wi-Fi",
        "Barometer",
        "MP3"
      ],
      "correctIndex": 3,
      "explanation": "Slide 9 tests MP3 playback in the controller settings.",
      "hint": "Consider why an audio file is used instead of a simple beep."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-05",
      "topic": "retrigger-protection",
      "learningSlide": 10,
      "prompt": "What can happen if a program restarts an audio file repeatedly?",
      "choices": [
        "The audio may not play properly",
        "The motor runs faster",
        "The controller gains more memory",
        "The sensor reads negative distance"
      ],
      "correctIndex": 0,
      "explanation": "The lesson warns that continuous restarts can interrupt playback.",
      "hint": "Think about repeated loop execution while audio is playing."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-06",
      "topic": "retrigger-protection",
      "learningSlide": 14,
      "prompt": "What does playback status 1 initially indicate?",
      "choices": [
        "The battery is charging",
        "Playback is allowed",
        "Playback is forbidden",
        "No sensor is connected"
      ],
      "correctIndex": 1,
      "explanation": "The program initializes the playback-status variable to 1.",
      "hint": "Think about repeated loop execution while audio is playing."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-07",
      "topic": "distance-reaction",
      "learningSlide": 12,
      "prompt": "What input makes the model produce a sound while moving?",
      "choices": [
        "Temperature below zero",
        "Keyboard typing",
        "Obstacle detection",
        "GPS arrival"
      ],
      "correctIndex": 2,
      "explanation": "The Stegosaurus uses obstacle detection to trigger sound.",
      "hint": "Follow the motor movement conditions."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-08",
      "topic": "distance-reaction",
      "learningSlide": 13,
      "prompt": "What does the model do when an obstacle is too close?",
      "choices": [
        "Speed forward",
        "Change its source PDF",
        "Disable its wheels",
        "Move backward"
      ],
      "correctIndex": 3,
      "explanation": "The basic movement flow backs away from a nearby obstacle.",
      "hint": "Follow the motor movement conditions."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-09",
      "topic": "program-state",
      "learningSlide": 15,
      "prompt": "Which two conditions must be met to start the lesson's audio?",
      "choices": [
        "Distance within 100 and playback status 1",
        "Distance over 1000 and status 0",
        "Touchscreen pressed and battery low",
        "GPS active and motor off"
      ],
      "correctIndex": 0,
      "explanation": "Slide 15 combines a distance condition with the playback-status flag.",
      "hint": "Remember what the playback-status variable records."
    },
    {
      "id": "l4-tail-wagging-stegosaurus-10",
      "topic": "program-state",
      "learningSlide": 16,
      "prompt": "What happens to the playback flag after the roughly two-second clip finishes?",
      "choices": [
        "The ultrasonic sensor is erased",
        "It returns to 1",
        "It becomes permanently negative",
        "The microphone is disconnected"
      ],
      "correctIndex": 1,
      "explanation": "The program allows another audio trigger after the clip duration has passed.",
      "hint": "Remember what the playback-status variable records."
    }
  ]
};
