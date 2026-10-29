/** Level 4 — Voice Control. Questions checked against the 19-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const voiceControlBank: QuizBank = {
  "projectId": "level-4-voice-control",
  "title": "Voice Control",
  "sourcePdfPath": "public/Level 4/Interactive Mechanisms/Voice Control/01.Voice Control.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "l4-voicecontrol-01",
      "topic": "speech-recognition",
      "learningSlide": 3,
      "prompt": "What makes a home appliance respond to spoken words?",
      "choices": [
        "Voice recognition technology",
        "A wheel encoder",
        "A color sensor",
        "A mechanical pulley"
      ],
      "correctIndex": 0,
      "explanation": "Slide 3 explains that voice recognition makes appliances respond to spoken commands.",
      "hint": "Think about a device understanding what someone says."
    },
    {
      "id": "l4-voicecontrol-02",
      "topic": "speech-recognition",
      "learningSlide": 7,
      "prompt": "What can voice recognition turn speech into?",
      "choices": [
        "Text or commands",
        "Wheel size",
        "Motor weight",
        "Colored stickers"
      ],
      "correctIndex": 0,
      "explanation": "Slide 7 defines speech recognition as converting speech into text or commands.",
      "hint": "Think about how sound can become an instruction."
    },
    {
      "id": "l4-voicecontrol-03",
      "topic": "voice-module",
      "learningSlide": 6,
      "prompt": "Which part of the AI audio-visual module captures speech?",
      "choices": [
        "The wheel",
        "The voice collector",
        "The gear",
        "The motor shaft"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 labels the module's voice collector as the speech input component.",
      "hint": "The robot needs a way to listen."
    },
    {
      "id": "l4-voicecontrol-04",
      "topic": "voice-module",
      "learningSlide": 10,
      "prompt": "Which controller port is used for the AI audio-visual module?",
      "choices": [
        "M1",
        "M2",
        "P8",
        "P1"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 connects the AI audio-visual module to P8.",
      "hint": "Remember the port used by the sensing module rather than the motors."
    },
    {
      "id": "l4-voicecontrol-05",
      "topic": "motor-commands",
      "learningSlide": 12,
      "prompt": "What does the robot do for the 'forward' voice command in the first movement task?",
      "choices": [
        "Moves forward",
        "Turns right",
        "Stops forever",
        "Opens a box"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 programs both motors forward for the forward command.",
      "hint": "Think about an instruction telling the robot where to travel."
    },
    {
      "id": "l4-voicecontrol-06",
      "topic": "motor-commands",
      "learningSlide": 16,
      "prompt": "What happens when the robot hears 'stop running'?",
      "choices": [
        "Both motors are set to zero speed",
        "Both motors speed up",
        "The robot changes its color",
        "The controller disconnects"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 sets M1 and M2 speeds to zero to stop.",
      "hint": "Think about a motor value that means no movement."
    },
    {
      "id": "l4-voicecontrol-07",
      "topic": "turning-commands",
      "learningSlide": 14,
      "prompt": "For the 'turn left' command, which motor is set to speed 0?",
      "choices": [
        "M1",
        "M2",
        "Both are set to 50",
        "Neither motor"
      ],
      "correctIndex": 0,
      "explanation": "Slide 14 gives M1 speed 0 and M2 speed 50 for a left turn.",
      "hint": "The motors run at different speeds to turn."
    },
    {
      "id": "l4-voicecontrol-08",
      "topic": "turning-commands",
      "learningSlide": 15,
      "prompt": "Which motor runs at speed 50 for the 'turn right' command?",
      "choices": [
        "M2 only",
        "M1",
        "Neither motor",
        "Both reverse"
      ],
      "correctIndex": 1,
      "explanation": "Slide 15 sets M1 to 50 and M2 to 0 for right turns.",
      "hint": "Compare the left and right turning settings."
    },
    {
      "id": "l4-voicecontrol-09",
      "topic": "program-flow",
      "learningSlide": 11,
      "prompt": "What should the program do when no voice command is recognized?",
      "choices": [
        "Perform no action",
        "Always move forward",
        "Always turn left",
        "Always turn right"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 says the robot does not execute an action when no voice is recognized.",
      "hint": "The robot needs a recognized instruction before acting."
    },
    {
      "id": "l4-voicecontrol-10",
      "topic": "program-flow",
      "learningSlide": 17,
      "prompt": "Which program block keeps voice recognition running continuously?",
      "choices": [
        "Repeat",
        "Print",
        "Wait forever without listening",
        "Delete variables"
      ],
      "correctIndex": 0,
      "explanation": "Slide 17 adds a repeat module so the program keeps executing.",
      "hint": "Think about making the robot listen for more than one command."
    }
  ]
};
