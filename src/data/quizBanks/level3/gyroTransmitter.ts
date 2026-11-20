/** Official Learning PDF text checked, source slides use 1-based page numbers. */
import type { QuizBank } from "../../quizStudio";

export const gyroTransmitterBank: QuizBank = {
  "projectId": "level-3-gyro-transmitter",
  "title": "Gyro Transmitter",
  "sourcePdfPath": "public/Level 3/Learning/Manipulators/Gyro transmitter.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "gyrotransmitte-01",
      "topic": "top",
      "learningSlide": 4,
      "prompt": "Why does the spinning top in the lesson have a very small contact point?",
      "choices": [
        "To create a wider base for sliding",
        "To increase resistance during spin",
        "To reduce friction with the ground",
        "To make the top permanently stationary"
      ],
      "correctIndex": 2,
      "hint": "The spinning body's geometry affects stability and friction.",
      "explanation": "Slide 4 explains the small bottom reduces friction."
    },
    {
      "id": "gyrotransmitte-02",
      "topic": "top",
      "learningSlide": 4,
      "prompt": "What does the lesson say about the top's body shape?",
      "choices": [
        "It is a tall flat plate",
        "Its bottom is wider than its body",
        "It has no point of contact",
        "It is relatively low and has a small bottom"
      ],
      "correctIndex": 3,
      "hint": "The spinning body's geometry affects stability and friction.",
      "explanation": "Slide 4 describes a low, chubby body and a small bottom."
    },
    {
      "id": "gyrotransmitte-03",
      "topic": "gear",
      "learningSlide": 5,
      "prompt": "Which gear arrangement is used to speed up the launcher?",
      "choices": [
        "Large driving gear to small driven gear",
        "Small driving gear to large driven gear",
        "Two disconnected gears",
        "Two fixed gears of equal speed"
      ],
      "correctIndex": 0,
      "hint": "Compare gear sizes when passing movement.",
      "explanation": "Slide 5 identifies a large gear driving a small one for acceleration."
    },
    {
      "id": "gyrotransmitte-04",
      "topic": "gear",
      "learningSlide": 20,
      "prompt": "When a big gear drives a small gear, what happens to the small gear's speed?",
      "choices": [
        "It becomes zero",
        "It increases",
        "It decreases compared with the large gear",
        "It cannot turn"
      ],
      "correctIndex": 1,
      "hint": "Compare gear sizes when passing movement.",
      "explanation": "Slide 20 tests the acceleration effect of large-to-small gearing."
    },
    {
      "id": "gyrotransmitte-05",
      "topic": "stages",
      "learningSlide": 6,
      "prompt": "What upgrade to gear transmission is proposed for a faster launcher?",
      "choices": [
        "Remove all gear connections",
        "Use only stationary gears",
        "Move from first-stage to second-stage acceleration",
        "Replace the gear train with a sound sensor"
      ],
      "correctIndex": 2,
      "hint": "The lesson considers more than one acceleration stage.",
      "explanation": "Slide 6 asks learners to upgrade first-stage acceleration to second-stage."
    },
    {
      "id": "gyrotransmitte-06",
      "topic": "stages",
      "learningSlide": 5,
      "prompt": "Why does the launcher need a high rotational speed?",
      "choices": [
        "To measure the surrounding color",
        "To lower a vehicle's bucket",
        "To detect humidity",
        "To start the top spinning rapidly"
      ],
      "correctIndex": 3,
      "hint": "The lesson considers more than one acceleration stage.",
      "explanation": "Slide 5 explains that the launcher must spin fast to drive the spinning top."
    },
    {
      "id": "gyrotransmitte-07",
      "topic": "touch",
      "learningSlide": 18,
      "prompt": "What should the first press of the touch sensor make the launcher do?",
      "choices": [
        "Start spinning",
        "Stop every motor permanently",
        "Play a warning without movement",
        "Reset the controller"
      ],
      "correctIndex": 0,
      "hint": "A physical input alternates operating states.",
      "explanation": "Slide 18 starts the launcher after the first touch."
    },
    {
      "id": "gyrotransmitte-08",
      "topic": "touch",
      "learningSlide": 18,
      "prompt": "What does the next touch-sensor press do?",
      "choices": [
        "Increase brightness",
        "Stop the launcher",
        "Move the robot forward",
        "Turn on an ultrasonic alarm"
      ],
      "correctIndex": 1,
      "hint": "A physical input alternates operating states.",
      "explanation": "Slide 18 uses the second touch to stop the launcher."
    },
    {
      "id": "gyrotransmitte-09",
      "topic": "infrared",
      "learningSlide": 19,
      "prompt": "What sensor is substituted for the touch sensor in the extension task?",
      "choices": [
        "Barometer",
        "Temperature probe",
        "Infrared sensor",
        "Microphone"
      ],
      "correctIndex": 2,
      "hint": "The upgraded task uses proximity instead of a button.",
      "explanation": "Slide 19 explicitly replaces touch sensing with an infrared sensor."
    },
    {
      "id": "gyrotransmitte-10",
      "topic": "infrared",
      "learningSlide": 19,
      "prompt": "When should the infrared-controlled launcher start automatically?",
      "choices": [
        "Only after the operator holds the top far from the ground",
        "Only when the touch sensor is unplugged",
        "When the controller's clock reaches midnight",
        "When the launcher is close to the ground"
      ],
      "correctIndex": 3,
      "hint": "The upgraded task uses proximity instead of a button.",
      "explanation": "Slide 19 starts the motor when the infrared sensor finds the launcher near the ground."
    }
  ]
};
