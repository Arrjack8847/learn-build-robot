/** Source: SHA-matched official Level 5 Learning PDF (25 pages). */
import type { QuizBank } from "../../quizStudio";

export const trafficRobotBank: QuizBank = {
  "projectId": "level-5-traffic-robot",
  "title": "Traffic Robot",
  "sourcePdfPath": "public/Level 5/Learning/Sensor-Focused Robots/Traffic Robot/20.Traffic Robot-Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "level-5-traffic-robot-01",
      "topic": "traffic-signs",
      "learningSlide": 5,
      "prompt": "What information do real traffic signs convey?",
      "choices": [
        "Guidance, restrictions, warnings and instructions",
        "Only vehicle prices",
        "Only the driver's name",
        "Only the current date"
      ],
      "correctIndex": 0,
      "hint": "Road signs communicate what drivers should do.",
      "explanation": "Slide 5 defines road signs as guidance, restriction, warning or instruction symbols."
    },
    {
      "id": "level-5-traffic-robot-02",
      "topic": "traffic-signs",
      "learningSlide": 7,
      "prompt": "Why are traffic signs important for road users?",
      "choices": [
        "They replace every driver",
        "They guide driving decisions and support safety",
        "They supply power to car engines",
        "They measure wheel friction"
      ],
      "correctIndex": 1,
      "hint": "Think of directions and warnings on roads.",
      "explanation": "Slide 7 describes signs helping drivers choose directions and drive safely."
    },
    {
      "id": "level-5-traffic-robot-03",
      "topic": "recognition-ids",
      "learningSlide": 8,
      "prompt": "How many traffic sign classes does the model's AI vision module recognize?",
      "choices": [
        "Ten",
        "None",
        "Five",
        "Two"
      ],
      "correctIndex": 2,
      "hint": "The lesson lists numbered Forward through Stop signs.",
      "explanation": "Slide 8 states the vision module has five built-in traffic sign classes."
    },
    {
      "id": "level-5-traffic-robot-04",
      "topic": "recognition-ids",
      "learningSlide": 9,
      "prompt": "What is the recognition ID when no traffic sign is identified?",
      "choices": [
        "1",
        "4",
        "5",
        "0"
      ],
      "correctIndex": 3,
      "hint": "The ID range includes an unrecognized value.",
      "explanation": "Slide 9 maps zero to unrecognized and one through five to named signs."
    },
    {
      "id": "level-5-traffic-robot-05",
      "topic": "hardware-setup",
      "learningSlide": 12,
      "prompt": "Which controller connection is used for the AI vision module?",
      "choices": [
        "P8",
        "M1",
        "M2",
        "The power switch"
      ],
      "correctIndex": 0,
      "hint": "The camera module uses a sensor port.",
      "explanation": "Slide 12 connects the AI module to controller port P8."
    },
    {
      "id": "level-5-traffic-robot-06",
      "topic": "hardware-setup",
      "learningSlide": 16,
      "prompt": "Where is the traffic-sign recognition result stored in the program?",
      "choices": [
        "A fixed color sensor casing",
        "Variable X",
        "A drawing-board motor",
        "A coin slot"
      ],
      "correctIndex": 1,
      "hint": "A variable stores the sign ID.",
      "explanation": "Slide 16 assigns the vision module's traffic-sign ID to X."
    },
    {
      "id": "level-5-traffic-robot-07",
      "topic": "direction-control",
      "learningSlide": 17,
      "prompt": "How does the robot respond when X equals 1?",
      "choices": [
        "Turn right",
        "Stop with a buzzer",
        "Drive forward",
        "Drive backward"
      ],
      "correctIndex": 2,
      "hint": "ID 1 is the Forward sign.",
      "explanation": "Slide 17 maps X = 1 to forward motor motion."
    },
    {
      "id": "level-5-traffic-robot-08",
      "topic": "direction-control",
      "learningSlide": 18,
      "prompt": "What is the motor command used for the Back sign, X = 2?",
      "choices": [
        "+50 for forward movement",
        "0 for a buzzer only",
        "An infrared code of 200",
        "−50 for backward movement"
      ],
      "correctIndex": 3,
      "hint": "Compare the speed sign with the forward case.",
      "explanation": "Slide 18 sets speed to −50 and drives backward when X = 2."
    },
    {
      "id": "level-5-traffic-robot-09",
      "topic": "stopping-and-expansion",
      "learningSlide": 21,
      "prompt": "What happens when the Stop sign with X = 5 is recognized?",
      "choices": [
        "The robot stops and buzzes for one second",
        "The robot runs faster",
        "The robot makes a left turn for five seconds",
        "The controller clears all colors"
      ],
      "correctIndex": 0,
      "hint": "The named traffic sign requests a halt.",
      "explanation": "Slide 21 stops the robot and sounds the buzzer for one second for ID 5."
    },
    {
      "id": "level-5-traffic-robot-10",
      "topic": "stopping-and-expansion",
      "learningSlide": 23,
      "prompt": "What safety-related change is proposed as an extension?",
      "choices": [
        "Disconnect the vision module",
        "Automatically stop after a period of forward or backward movement",
        "Never stop while driving",
        "Ignore all traffic signs"
      ],
      "correctIndex": 1,
      "hint": "The enhancement adds a time limit to movement.",
      "explanation": "Slide 23 asks students to stop the robot automatically after travelling for some time."
    }
  ]
};
