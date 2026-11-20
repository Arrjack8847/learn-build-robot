/** Level 4 — Turbo Drop. Questions checked against the 24-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const turboDropBank: QuizBank = {
  "projectId": "level-4-turbo-drop",
  "title": "Turbo Drop",
  "sourcePdfPath": "public/Level 4/Mechanisms & Simulators/Turbo Drop/28. Turbo Drop-Teaching Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "l4-turbodrop-01",
      "topic": "ride-sequence",
      "learningSlide": 5,
      "prompt": "What does the Turbo Drop ride do before falling?",
      "choices": [
        "Moves along a road",
        "Spins like a wheel only",
        "Goes under water",
        "Lifts riders up and waits"
      ],
      "correctIndex": 3,
      "explanation": "Slide 5 describes lifting passengers and waiting before the vertical drop.",
      "hint": "Think about how the ride builds excitement."
    },
    {
      "id": "l4-turbodrop-02",
      "topic": "ride-sequence",
      "learningSlide": 5,
      "prompt": "What happens to the cabin before it reaches the ground?",
      "choices": [
        "It turns into a boat",
        "It stops safely",
        "It keeps falling through the ground",
        "It becomes a car"
      ],
      "correctIndex": 1,
      "explanation": "Slide 5 says the seat cabin stops before landing.",
      "hint": "Think about what is needed to finish the ride."
    },
    {
      "id": "l4-turbodrop-03",
      "topic": "free-fall-concept",
      "learningSlide": 8,
      "prompt": "What force makes an object fall in the lesson's free-fall model?",
      "choices": [
        "Sound",
        "Friction only",
        "Gravity",
        "Magnetism only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 8 defines free fall as motion under gravity without resistance.",
      "hint": "Think about what pulls objects toward Earth."
    },
    {
      "id": "l4-turbodrop-04",
      "topic": "free-fall-concept",
      "learningSlide": 11,
      "prompt": "Without air resistance, how do two objects dropped together from the same height behave?",
      "choices": [
        "They fall with the same acceleration",
        "The heavier one always falls first",
        "The lighter one always falls first",
        "Neither object moves"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 explains that free fall without resistance does not depend on object weight.",
      "hint": "Think about an experiment in a vacuum."
    },
    {
      "id": "l4-turbodrop-05",
      "topic": "color-control",
      "learningSlide": 13,
      "prompt": "Which sensor starts the Turbo Drop model's movement program?",
      "choices": [
        "Color sensor",
        "Touch sensor",
        "Ultrasonic sensor",
        "Magnetic sensor"
      ],
      "correctIndex": 0,
      "explanation": "Slide 13 identifies a color sensor as the trigger.",
      "hint": "Think about recognizing a colored block."
    },
    {
      "id": "l4-turbodrop-06",
      "topic": "color-control",
      "learningSlide": 15,
      "prompt": "Which detected color starts the lifting procedure?",
      "choices": [
        "Blue",
        "Yellow",
        "Red",
        "Green"
      ],
      "correctIndex": 2,
      "explanation": "Slide 15 specifies red as the lifting trigger.",
      "hint": "Remember the color programmed to start the ride."
    },
    {
      "id": "l4-turbodrop-07",
      "topic": "lift-safety",
      "learningSlide": 16,
      "prompt": "What happens to lifting time when the motor's lifting speed becomes faster?",
      "choices": [
        "The cabin cannot move",
        "It becomes shorter",
        "It always becomes longer",
        "It is not affected at all"
      ],
      "correctIndex": 1,
      "explanation": "Slide 16 relates higher lifting speed to shorter lifting time.",
      "hint": "Think about covering the same height more quickly."
    },
    {
      "id": "l4-turbodrop-08",
      "topic": "lift-safety",
      "learningSlide": 16,
      "prompt": "Why should the Turbo Drop not lift at excessive speed?",
      "choices": [
        "The color sensor changes color",
        "The screen gets too bright",
        "The motor reads a QR code",
        "The rope could break"
      ],
      "correctIndex": 3,
      "explanation": "Slide 16 warns that excessive speed may break the rope.",
      "hint": "Think about a mechanical part carrying the cabin."
    },
    {
      "id": "l4-turbodrop-09",
      "topic": "timing-and-drop",
      "learningSlide": 17,
      "prompt": "Why does the program choose a random waiting time before dropping?",
      "choices": [
        "To measure the weather",
        "To print a ticket",
        "To make the ride less predictable",
        "To stop sensing colors forever"
      ],
      "correctIndex": 2,
      "explanation": "Slide 17 randomizes the timing for excitement.",
      "hint": "Think about why an unpredictable pause is thrilling."
    },
    {
      "id": "l4-turbodrop-10",
      "topic": "timing-and-drop",
      "learningSlide": 18,
      "prompt": "What happens when the gear train disengages during the drop step?",
      "choices": [
        "The cabin is released",
        "The cabin moves sideways only",
        "The color sensor turns off",
        "The controller changes its name"
      ],
      "correctIndex": 0,
      "explanation": "Slide 18 says the motor turns and the gear train disengages, freeing the cabin.",
      "hint": "Think about what lets the cabin descend."
    }
  ]
};
