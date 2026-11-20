/** Ten Level 5 questions sourced from the official 25-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const carLightsBank: QuizBank = {
  "projectId": "level-5-car-lights",
  "title": "Car Lights",
  "sourcePdfPath": "public/Level 5/Learning/Illumination & Signals/Car Lights/11. Car Lights-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "level-5-car-lights-01",
      "topic": "car-light-types",
      "learningSlide": 4,
      "prompt": "Which two broad groups does the lesson use for vehicle lamps?",
      "choices": [
        "Lighting lamps and signal lamps",
        "Headlights and windows",
        "Motors and sensors",
        "Front wheels and rear wheels"
      ],
      "correctIndex": 0,
      "hint": "Look at why a light is switched on.",
      "explanation": "Slide 4 divides vehicle lamps into lights used for illumination and lights used to signal other road users."
    },
    {
      "id": "level-5-car-lights-02",
      "topic": "car-light-types",
      "learningSlide": 4,
      "prompt": "Which lamp is listed as a signal light rather than a lighting lamp?",
      "choices": [
        "License-plate light",
        "Brake light",
        "Fog light",
        "Headlight"
      ],
      "correctIndex": 1,
      "hint": "Think about a message sent to another driver.",
      "explanation": "Slide 4 categorizes brake lights among the vehicle's signal lights."
    },
    {
      "id": "level-5-car-lights-03",
      "topic": "beam-use",
      "learningSlide": 5,
      "prompt": "Which beam is intended to illuminate farther and wider ahead?",
      "choices": [
        "Brake lamp",
        "Turn signal",
        "High beam",
        "Low beam"
      ],
      "correctIndex": 2,
      "hint": "Compare the distances described for the two beams.",
      "explanation": "Slide 5 describes the high beam as reaching farther and wider than the low beam."
    },
    {
      "id": "level-5-car-lights-04",
      "topic": "beam-use",
      "learningSlide": 5,
      "prompt": "Why should a driver avoid leaving high beams on continuously near other vehicles?",
      "choices": [
        "They stop the vehicle's rear lights",
        "They make turn indicators impossible",
        "They automatically turn off the engine",
        "They can impair other drivers' visibility"
      ],
      "correctIndex": 3,
      "hint": "Think about what a bright light does to oncoming traffic.",
      "explanation": "Slide 5 warns that prolonged high beams can affect drivers in oncoming or preceding vehicles."
    },
    {
      "id": "level-5-car-lights-05",
      "topic": "road-signals",
      "learningSlide": 6,
      "prompt": "Who is the main audience for a car's brake lights?",
      "choices": [
        "Drivers travelling behind the car",
        "Only the driver inside the car",
        "Passengers in the back seat",
        "People inspecting the engine"
      ],
      "correctIndex": 0,
      "hint": "Picture a following vehicle.",
      "explanation": "Slide 6 explains that rear brake lights alert vehicles behind when slowing is needed."
    },
    {
      "id": "level-5-car-lights-06",
      "topic": "road-signals",
      "learningSlide": 7,
      "prompt": "Why should turn signals be used before a turn?",
      "choices": [
        "They make the headlights brighter",
        "They let other road users plan for the change",
        "They improve the car's engine power",
        "They replace the rear-view mirror"
      ],
      "correctIndex": 1,
      "hint": "Think about when a signal becomes useful to observers.",
      "explanation": "Slide 7 explains that turn signals give people outside the car advance notice of a route change."
    },
    {
      "id": "level-5-car-lights-07",
      "topic": "random-modes",
      "learningSlide": 14,
      "prompt": "How often does the practice program select a different random lighting mode?",
      "choices": [
        "Once a day",
        "After every wheel rotation",
        "Every two seconds",
        "Every tenth of a second"
      ],
      "correctIndex": 2,
      "hint": "Read the timing in the main-program flowchart.",
      "explanation": "Slide 14 says the main program changes to a randomly chosen mode every two seconds."
    },
    {
      "id": "level-5-car-lights-08",
      "topic": "random-modes",
      "learningSlide": 19,
      "prompt": "Which programmed mode represents braking?",
      "choices": [
        "Mode 1",
        "Mode 2",
        "Mode 3",
        "Mode 5"
      ],
      "correctIndex": 3,
      "hint": "Read the list of five modes.",
      "explanation": "Slide 19 maps mode 5 to brake, mode 1 to forward, mode 2 to failure, mode 3 to left, and mode 4 to right."
    },
    {
      "id": "level-5-car-lights-09",
      "topic": "improvements",
      "learningSlide": 23,
      "prompt": "What change does the lesson's optimization task request for left and right turns?",
      "choices": [
        "Switch on the turn light for a while before turning",
        "Remove the turn lights entirely",
        "Keep braking throughout each turn",
        "Turn off all headlights permanently"
      ],
      "correctIndex": 0,
      "hint": "Think about warning others ahead of movement.",
      "explanation": "Slide 23 asks students to illuminate the appropriate indicators in advance of each turn."
    },
    {
      "id": "level-5-car-lights-10",
      "topic": "improvements",
      "learningSlide": 18,
      "prompt": "What must the main program do after a lighting-mode function finishes?",
      "choices": [
        "Forget the randomly selected modes",
        "Clear the screen and restart timing",
        "Stop all future modes",
        "Reverse the motor immediately"
      ],
      "correctIndex": 1,
      "hint": "Look for how the next mode begins.",
      "explanation": "Slide 18 says the main program clears the display and restarts timing after a mode runs."
    }
  ]
};
