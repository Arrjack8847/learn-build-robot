/** Official Learning PDF text checked, source slides use 1-based page numbers. */
import type { QuizBank } from "../../quizStudio";

export const lightSensitiveCurtainsBank: QuizBank = {
  "projectId": "level-3-light-sensitive-curtains",
  "title": "Light-sensitive Curtains",
  "sourcePdfPath": "public/Level 3/Learning/Illumination & Signals/Light-sensitive Curtains/14.Light-sensitive Curtains -Slides.pdf",
  "sourcePageCount": 38,
  "questions": [
    {
      "id": "lightsensitive-01",
      "topic": "automation",
      "learningSlide": 6,
      "prompt": "What should the curtains do when the surrounding light is too dark?",
      "choices": [
        "Close",
        "Open fully",
        "Spin continuously",
        "Turn the sensor off forever"
      ],
      "correctIndex": 0,
      "hint": "The goal is to react to the brightness of a room.",
      "explanation": "Slide 6 specifies closing when the light is too dark."
    },
    {
      "id": "lightsensitive-02",
      "topic": "automation",
      "learningSlide": 6,
      "prompt": "What is the model's response when the room becomes too bright?",
      "choices": [
        "Close the curtains",
        "Open the curtains",
        "Keep the motor spinning endlessly",
        "Ignore the light value"
      ],
      "correctIndex": 1,
      "hint": "The goal is to react to the brightness of a room.",
      "explanation": "Slide 6 specifies opening curtains when the light is too bright."
    },
    {
      "id": "lightsensitive-03",
      "topic": "sensor",
      "learningSlide": 7,
      "prompt": "Which two parts make up the lesson's photoelectric light sensor?",
      "choices": [
        "A microphone and a speaker",
        "A barometer and a wheel",
        "An LED light and a photoreceptor",
        "An ultrasonic emitter and a motor"
      ],
      "correctIndex": 2,
      "hint": "The photoreceptor can detect surrounding light.",
      "explanation": "Slide 7 identifies an LED and a photoreceptor."
    },
    {
      "id": "lightsensitive-04",
      "topic": "sensor",
      "learningSlide": 7,
      "prompt": "What can the sensor measure when its own LED light is switched off?",
      "choices": [
        "The controller's stored file size",
        "Water pressure",
        "Motor shaft torque",
        "Ambient light intensity"
      ],
      "correctIndex": 3,
      "hint": "The photoreceptor can detect surrounding light.",
      "explanation": "Slide 7 says it senses surrounding light when its LED is off."
    },
    {
      "id": "lightsensitive-05",
      "topic": "testing",
      "learningSlide": 9,
      "prompt": "Which built-in test screen lets students observe photoelectric readings?",
      "choices": [
        "Gray",
        "Ultrasonic",
        "Motor",
        "Audio"
      ],
      "correctIndex": 0,
      "hint": "Measurements should be compared in brighter and darker environments.",
      "explanation": "Slide 9 opens the Gray test and covers the photoreceptor."
    },
    {
      "id": "lightsensitive-06",
      "topic": "testing",
      "learningSlide": 28,
      "prompt": "How can students collect a darker reading for setting the curtain threshold?",
      "choices": [
        "Shine a brighter flashlight directly into it",
        "Cover the sensor with a hand",
        "Move it closer to a white lamp",
        "Increase controller screen brightness only"
      ],
      "correctIndex": 1,
      "hint": "Measurements should be compared in brighter and darker environments.",
      "explanation": "Slide 28 asks to cover the sensor with a hand to compare light readings."
    },
    {
      "id": "lightsensitive-07",
      "topic": "motor",
      "learningSlide": 25,
      "prompt": "Which three motor settings must be considered for opening and closing curtains?",
      "choices": [
        "Color, shape and weight",
        "Brightness, volume and pitch",
        "Direction, speed and time",
        "Temperature, pressure and altitude"
      ],
      "correctIndex": 2,
      "hint": "Direction and duration affect the curtain position.",
      "explanation": "Slide 25 explicitly lists motor rotation direction, speed and time."
    },
    {
      "id": "lightsensitive-08",
      "topic": "motor",
      "learningSlide": 6,
      "prompt": "What kind of output accompanies curtain motion in the model task?",
      "choices": [
        "A water pump",
        "A GPS coordinate",
        "A vibration camera",
        "A buzzer prompt"
      ],
      "correctIndex": 3,
      "hint": "Direction and duration affect the curtain position.",
      "explanation": "Slide 6 calls for buzzer prompts while opening and closing."
    },
    {
      "id": "lightsensitive-09",
      "topic": "threshold",
      "learningSlide": 29,
      "prompt": "Which approximate reading is treated as too dark in the example?",
      "choices": [
        "Less than 20",
        "Greater than 300",
        "Exactly 4095",
        "Between 300 and 4095 only"
      ],
      "correctIndex": 0,
      "hint": "The lesson uses two different boundaries for bright and dark.",
      "explanation": "Slide 29 identifies values less than 20 as too dark."
    },
    {
      "id": "lightsensitive-10",
      "topic": "threshold",
      "learningSlide": 29,
      "prompt": "Which approximate reading is treated as too bright?",
      "choices": [
        "Less than 20",
        "Greater than 300",
        "Exactly 0",
        "Less than 5"
      ],
      "correctIndex": 1,
      "hint": "The lesson uses two different boundaries for bright and dark.",
      "explanation": "Slide 29 identifies values greater than 300 as too bright."
    }
  ]
};
