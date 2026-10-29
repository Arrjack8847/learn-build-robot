/** Verified against the registered Level 3 source PDF, pages are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const musicDoorbellBank: QuizBank = {
  "projectId": "level-3-music-doorbell",
  "title": "Music Doorbell",
  "sourcePdfPath": "public/Level 3/Learning/Sound & Voice Interaction/Music Doorbell/07.Music Doorbell- Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "musicdoorbell-01",
      "topic": "doorbell",
      "learningSlide": 3,
      "prompt": "What is the ordinary purpose of a doorbell?",
      "choices": [
        "Measure the weight of delivered packages",
        "Track the distance to a wall",
        "Control the house temperature",
        "Alert residents that a guest has arrived"
      ],
      "correctIndex": 3,
      "hint": "A doorbell tells people that someone is visiting.",
      "explanation": "Slide 3 introduces doorbells as guest-arrival alerts."
    },
    {
      "id": "musicdoorbell-02",
      "topic": "doorbell",
      "learningSlide": 4,
      "prompt": "Which kind of doorbell is among the types discussed?",
      "choices": [
        "Video intercom doorbell",
        "Hydraulic doorbell",
        "Gear-driven axle sensor",
        "Barometric alarm clock"
      ],
      "correctIndex": 0,
      "hint": "A doorbell tells people that someone is visiting.",
      "explanation": "Slide 4 lists video intercom among the doorbell types."
    },
    {
      "id": "musicdoorbell-03",
      "topic": "buzzer",
      "learningSlide": 7,
      "prompt": "What audio-producing component is already inside the controller?",
      "choices": [
        "External MP3 speaker only",
        "Buzzer",
        "Infrared receiver",
        "Ultrasonic echo processor"
      ],
      "correctIndex": 1,
      "hint": "The controller has a built-in sound component.",
      "explanation": "Slide 7 identifies the controller's built-in buzzer."
    },
    {
      "id": "musicdoorbell-04",
      "topic": "buzzer",
      "learningSlide": 7,
      "prompt": "What can the built-in buzzer vary in its sounds?",
      "choices": [
        "Weight of an object",
        "Number of gear teeth",
        "Tone or pitch",
        "Light-sensitive sensor range"
      ],
      "correctIndex": 2,
      "hint": "The controller has a built-in sound component.",
      "explanation": "Slide 7 describes producing sounds of different tones."
    },
    {
      "id": "musicdoorbell-05",
      "topic": "tone",
      "learningSlide": 16,
      "prompt": "What does the Set Audio Frequency programming block control?",
      "choices": [
        "Motor speed and gear ratio",
        "Color-sensor resolution",
        "Ultrasonic distance threshold",
        "Buzzer pitch and tone duration"
      ],
      "correctIndex": 3,
      "hint": "Both pitch and duration can be programmed.",
      "explanation": "Slide 16 defines tone and duration settings."
    },
    {
      "id": "musicdoorbell-06",
      "topic": "tone",
      "learningSlide": 16,
      "prompt": "How long is one beat according to this lesson's buzzer module?",
      "choices": [
        "One second",
        "One minute",
        "Half an hour",
        "Ten seconds"
      ],
      "correctIndex": 0,
      "hint": "Both pitch and duration can be programmed.",
      "explanation": "Slide 16 defines one beat as one second."
    },
    {
      "id": "musicdoorbell-07",
      "topic": "trigger",
      "learningSlide": 6,
      "prompt": "Which input should make the model doorbell play music?",
      "choices": [
        "Motor encoder angle",
        "Touch sensor press",
        "Photoelectric brightness",
        "Ambient pressure"
      ],
      "correctIndex": 1,
      "hint": "The model uses a touch input to request music.",
      "explanation": "Slide 6 uses a touch sensor press as the music trigger."
    },
    {
      "id": "musicdoorbell-08",
      "topic": "trigger",
      "learningSlide": 19,
      "prompt": "Which action does the first programming task perform if the touch sensor is pressed?",
      "choices": [
        "Stop every motor permanently",
        "Measure an object’s mass",
        "Play a piece of music",
        "Close window curtains"
      ],
      "correctIndex": 2,
      "hint": "The model uses a touch input to request music.",
      "explanation": "Slide 19 plays music after detecting a touch."
    },
    {
      "id": "musicdoorbell-09",
      "topic": "lights",
      "learningSlide": 20,
      "prompt": "Where are color-lamp commands inserted to accompany the doorbell notes?",
      "choices": [
        "Only before program startup",
        "Only after disconnecting the buzzer",
        "Inside a motor calibration block",
        "Above each Set Audio Frequency block"
      ],
      "correctIndex": 3,
      "hint": "The visual output can follow the notes being played.",
      "explanation": "Slide 20 adds color-lamp commands above the frequency blocks."
    },
    {
      "id": "musicdoorbell-10",
      "topic": "lights",
      "learningSlide": 20,
      "prompt": "What should happen to the color lamp at the end of the melody?",
      "choices": [
        "Turn off",
        "Remain flashing forever",
        "Turn on the infrared sensor",
        "Continue rotating a motor"
      ],
      "correctIndex": 0,
      "hint": "The visual output can follow the notes being played.",
      "explanation": "Slide 20 ends the color-lamp sequence by switching it off."
    }
  ]
};
