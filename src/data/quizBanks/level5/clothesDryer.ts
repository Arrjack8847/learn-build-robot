/** Ten questions checked against the official 22-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const clothesDryerBank: QuizBank = {
  "projectId": "level-5-clothes-dryer",
  "title": "Clothes Dryer",
  "sourcePdfPath": "public/Level 5/Learning/Programming & Precise Control/Clothes Dryer/30. Clothes Dryer-Teaching Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "level-5-clothes-dryer-01",
      "topic": "humidity-and-condensation",
      "learningSlide": 5,
      "prompt": "Why can water droplets form on a cold surface during very humid weather?",
      "choices": [
        "Warm humid air meets the cold surface and condenses",
        "The cold surface creates water from metal",
        "The motor generates water vapor inside the surface",
        "Dry air always produces water drops"
      ],
      "correctIndex": 0,
      "hint": "Think about what humid air does when cooled.",
      "explanation": "Slide 5 explains that warm, moist air condenses into droplets on colder surfaces."
    },
    {
      "id": "level-5-clothes-dryer-02",
      "topic": "humidity-and-condensation",
      "learningSlide": 5,
      "prompt": "What problem can prolonged humid weather cause for clothes left to dry?",
      "choices": [
        "They dry instantly without airflow",
        "They may stay damp or become wetter",
        "They automatically lose all their water",
        "They become electrically charged"
      ],
      "correctIndex": 1,
      "hint": "Imagine drying clothes when the air is already very wet.",
      "explanation": "Slide 5 notes that clothes may become wetter during persistently humid conditions."
    },
    {
      "id": "level-5-clothes-dryer-03",
      "topic": "drying-mechanisms",
      "learningSlide": 7,
      "prompt": "How does a centrifugal clothes dryer mainly remove water?",
      "choices": [
        "By freezing the clothes",
        "By shining a flashlight at them",
        "By rotating rapidly to throw water outward",
        "By using a magnetic field to absorb water"
      ],
      "correctIndex": 2,
      "hint": "Think about what happens in a fast-spinning drum.",
      "explanation": "Slide 7 describes centrifugal dehydration as shaking or throwing water from clothes through rapid rotation."
    },
    {
      "id": "level-5-clothes-dryer-04",
      "topic": "drying-mechanisms",
      "learningSlide": 8,
      "prompt": "What helps a hot-air clothes dryer remove moisture?",
      "choices": [
        "A heated flow of air",
        "A slowly rotating magnet",
        "A pressure sensor alone",
        "A completely sealed still-air chamber"
      ],
      "correctIndex": 0,
      "hint": "The slide compares a hot-air dryer to a large blower.",
      "explanation": "Slide 8 explains that heated moving air speeds the drying process."
    },
    {
      "id": "level-5-clothes-dryer-05",
      "topic": "sensor-characteristics",
      "learningSlide": 10,
      "prompt": "Which two environmental quantities does the lesson's sensor measure?",
      "choices": [
        "Distance and color",
        "Temperature and humidity",
        "Speed and acceleration",
        "Magnetic direction and sound"
      ],
      "correctIndex": 1,
      "hint": "The name of the sensor includes both quantities.",
      "explanation": "Slide 10 introduces a combined temperature-and-humidity digital sensor."
    },
    {
      "id": "level-5-clothes-dryer-06",
      "topic": "sensor-characteristics",
      "learningSlide": 10,
      "prompt": "What relative-humidity measurement range is stated for the sensor?",
      "choices": [
        "0% to 10% RH",
        "10% to 50% RH",
        "0% to 100% RH",
        "100% to 200% RH"
      ],
      "correctIndex": 2,
      "hint": "Look at the humidity range, not the temperature range.",
      "explanation": "Slide 10 states a relative-humidity detection range of 0 to 100% RH."
    },
    {
      "id": "level-5-clothes-dryer-07",
      "topic": "model-design",
      "learningSlide": 12,
      "prompt": "What should the classroom dryer model do when humidity becomes too high?",
      "choices": [
        "Shake or rotate the drum to simulate dehydration",
        "Open a classroom door automatically",
        "Measure the car's speed",
        "Count people entering a room"
      ],
      "correctIndex": 0,
      "hint": "Think about which drying method the model imitates.",
      "explanation": "Slide 12 directs students to shake the drum under high humidity to simulate dehydration."
    },
    {
      "id": "level-5-clothes-dryer-08",
      "topic": "model-design",
      "learningSlide": 13,
      "prompt": "Why does the program set the drum's speed before any rotation begins?",
      "choices": [
        "The speed is required only to change the display font",
        "The program needs a prepared speed value for later motor control",
        "It is used to measure laser distance",
        "It prevents the humidity sensor from reading"
      ],
      "correctIndex": 1,
      "hint": "A motor can have a configured speed while temporarily stopped.",
      "explanation": "Slide 13 says to pre-set the rotation speed even when the drum does not immediately rotate."
    },
    {
      "id": "level-5-clothes-dryer-09",
      "topic": "humidity-logic",
      "learningSlide": 16,
      "prompt": "What happens when measured humidity rises above the programmed threshold?",
      "choices": [
        "The motor is never allowed to run",
        "The drum rotates and reverses direction every 2 seconds",
        "The infrared counter adds a visitor",
        "The program removes the humidity sensor"
      ],
      "correctIndex": 1,
      "hint": "The motor changes direction on a timed cycle.",
      "explanation": "Slide 16 specifies rotation above the humidity threshold and a reversal every two seconds."
    },
    {
      "id": "level-5-clothes-dryer-10",
      "topic": "humidity-logic",
      "learningSlide": 20,
      "prompt": "What extra control condition is proposed in the lesson's optimization activity?",
      "choices": [
        "Begin dehydration when the temperature is too low",
        "Stop reading all sensor values",
        "Run the drum only when light is bright",
        "Replace temperature readings with time of day"
      ],
      "correctIndex": 0,
      "hint": "The extension uses the other value from the same sensor.",
      "explanation": "Slide 20 proposes also triggering dehydration when the sensed temperature is too low."
    }
  ]
};
