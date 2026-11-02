/** Verified against official Level 3 PDF; references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const soundLevelMeterBank: QuizBank = {
  "projectId": "level-3-sound-level-meter",
  "title": "Sound Level Meter",
  "sourcePdfPath": "public/Level 3/Learning/Sound & Voice Interaction/Sound Level Meter/16.Sound Level Meter -Slides.pdf",
  "sourcePageCount": 34,
  "questions": [
    {
      "id": "soundlevelmeter-01",
      "topic": "sound",
      "learningSlide": 6,
      "prompt": "Which built-in controller component measures the surrounding sound level?",
      "choices": [
        "Photoelectric grayscale sensor",
        "Motor encoder",
        "Microphone",
        "Ultrasonic transmitter"
      ],
      "correctIndex": 2,
      "hint": "The meter detects noise using a component in the controller.",
      "explanation": "Slide 6 specifies the built-in microphone for sound measurement."
    },
    {
      "id": "soundlevelmeter-02",
      "topic": "sound",
      "learningSlide": 3,
      "prompt": "Which description matches noise in the lesson?",
      "choices": [
        "Any quiet room",
        "Only sounds above human hearing",
        "Only a musical note",
        "Sounds that disturb or make people uncomfortable"
      ],
      "correctIndex": 3,
      "hint": "The meter detects noise using a component in the controller.",
      "explanation": "Slide 3 describes uncomfortable or disturbing sounds as noise."
    },
    {
      "id": "soundlevelmeter-03",
      "topic": "reading",
      "learningSlide": 23,
      "prompt": "What does the microphone-volume programming block return?",
      "choices": [
        "A numeric sound-level value",
        "Distance in centimeters",
        "Motor angle in degrees",
        "An identified color name"
      ],
      "correctIndex": 0,
      "hint": "The software uses a numeric measurement rather than a named color.",
      "explanation": "Slide 23 reads a numeric microphone volume value."
    },
    {
      "id": "soundlevelmeter-04",
      "topic": "reading",
      "learningSlide": 23,
      "prompt": "What is the maximum return value listed for the microphone volume block?",
      "choices": [
        "100",
        "4095",
        "300",
        "140"
      ],
      "correctIndex": 1,
      "hint": "The software uses a numeric measurement rather than a named color.",
      "explanation": "Slide 23 defines the block's reading range as 0–4095."
    },
    {
      "id": "soundlevelmeter-05",
      "topic": "calibration",
      "learningSlide": 8,
      "prompt": "Which controller test can display the microphone's changing readings?",
      "choices": [
        "Color",
        "Motor",
        "Sound",
        "Gray"
      ],
      "correctIndex": 2,
      "hint": "Test in quiet and loud conditions to choose boundaries.",
      "explanation": "Slide 8 directs learners to the Sound built-in test."
    },
    {
      "id": "soundlevelmeter-06",
      "topic": "calibration",
      "learningSlide": 20,
      "prompt": "Which measurements help set useful low/medium/high sound thresholds?",
      "choices": [
        "Only one constant reading",
        "Motor rotation with no sound",
        "Color-sensor readings alone",
        "Quiet, normal speech and relatively loud sounds"
      ],
      "correctIndex": 3,
      "hint": "Test in quiet and loud conditions to choose boundaries.",
      "explanation": "Slide 20 compares readings for quiet, speaking and loud sounds."
    },
    {
      "id": "soundlevelmeter-07",
      "topic": "levels",
      "learningSlide": 21,
      "prompt": "Which approximate reading does the lesson classify as low noise?",
      "choices": [
        "Below 140",
        "Above 300",
        "Exactly 4095",
        "Between 140 and 300"
      ],
      "correctIndex": 0,
      "hint": "The lesson divides volume into three ranges.",
      "explanation": "Slide 21 uses values below 140 for low noise."
    },
    {
      "id": "soundlevelmeter-08",
      "topic": "levels",
      "learningSlide": 21,
      "prompt": "Which approximate reading does the lesson classify as high noise?",
      "choices": [
        "Below 140",
        "Above 300",
        "Exactly zero",
        "140–300"
      ],
      "correctIndex": 1,
      "hint": "The lesson divides volume into three ranges.",
      "explanation": "Slide 21 sets the high category above 300."
    },
    {
      "id": "soundlevelmeter-09",
      "topic": "display",
      "learningSlide": 6,
      "prompt": "Which lamp color represents a medium sound level?",
      "choices": [
        "Green",
        "Red",
        "Yellow",
        "Purple"
      ],
      "correctIndex": 2,
      "hint": "The screen and colored lamp communicate the result.",
      "explanation": "Slide 6 maps medium sound level to yellow."
    },
    {
      "id": "soundlevelmeter-10",
      "topic": "display",
      "learningSlide": 25,
      "prompt": "How does the meter continuously show the current volume?",
      "choices": [
        "Display one fixed value at startup",
        "Print the reading on paper",
        "Change the motor's direction to indicate sound",
        "Read the microphone repeatedly and update the screen"
      ],
      "correctIndex": 3,
      "hint": "The screen and colored lamp communicate the result.",
      "explanation": "Slide 25 displays repeated microphone readings on the controller."
    }
  ]
};
