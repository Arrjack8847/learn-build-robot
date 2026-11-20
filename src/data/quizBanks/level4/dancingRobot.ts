/** Level 4 quiz: authored from the official 32-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const dancingRobotBank: QuizBank = {
  "projectId": "level-4-dancing-robot",
  "title": "Dancing Robot",
  "sourcePdfPath": "public/Level 4/Display & Movement/Dancing Robot/31.Dancing Robot-Slides.pdf",
  "sourcePageCount": 32,
  "questions": [
    {
      "id": "l4-dancing-robot-01",
      "topic": "robot-behavior",
      "learningSlide": 5,
      "prompt": "What sensor triggers the dancing robot when someone approaches?",
      "choices": [
        "Ultrasonic distance sensor",
        "Touchscreen",
        "Gyroscope",
        "Barometric sensor"
      ],
      "correctIndex": 0,
      "explanation": "The project requirements name an ultrasonic sensor.",
      "hint": "Recall how the robot responds to people."
    },
    {
      "id": "l4-dancing-robot-02",
      "topic": "robot-behavior",
      "learningSlide": 4,
      "prompt": "What allows the dancing robot to perform repeated routines?",
      "choices": [
        "A paper ticket",
        "Stored instructions and electrical power",
        "A measuring tape",
        "A camera lens alone"
      ],
      "correctIndex": 1,
      "explanation": "The lesson describes powered robots dancing to music using programmed movements.",
      "hint": "Recall how the robot responds to people."
    },
    {
      "id": "l4-dancing-robot-03",
      "topic": "display-images",
      "learningSlide": 21,
      "prompt": "What does the Show Image block display?",
      "choices": [
        "An image at a chosen screen position",
        "A live GPS route",
        "Motor voltage only",
        "An audio waveform"
      ],
      "correctIndex": 0,
      "explanation": "The image block places a stored picture at screen coordinates.",
      "hint": "Think about the screen's image coordinates."
    },
    {
      "id": "l4-dancing-robot-04",
      "topic": "display-images",
      "learningSlide": 21,
      "prompt": "Where must the picture be stored for the Show Image block?",
      "choices": [
        "On paper",
        "In a photo album",
        "On the controller disk",
        "Inside a motor"
      ],
      "correctIndex": 2,
      "explanation": "The slide specifies an image file saved to the controller disk.",
      "hint": "Think about the screen's image coordinates."
    },
    {
      "id": "l4-dancing-robot-05",
      "topic": "screen-clearing",
      "learningSlide": 22,
      "prompt": "What is the purpose of the Clear Screen block?",
      "choices": [
        "Reverse a motor",
        "Erase current display contents",
        "Start the ultrasonic sensor",
        "Reset the battery"
      ],
      "correctIndex": 1,
      "explanation": "The block removes what is currently shown on the display.",
      "hint": "Consider what it means to remove a picture from a display."
    },
    {
      "id": "l4-dancing-robot-06",
      "topic": "screen-clearing",
      "learningSlide": 23,
      "prompt": "How long is the picture displayed in the lesson's alternating screen test?",
      "choices": [
        "1 second",
        "10 seconds",
        "2 seconds",
        "20 seconds"
      ],
      "correctIndex": 2,
      "explanation": "Slide 23 holds the picture for two seconds before clearing.",
      "hint": "Consider what it means to remove a picture from a display."
    },
    {
      "id": "l4-dancing-robot-07",
      "topic": "sensor-triggered-dance",
      "learningSlide": 24,
      "prompt": "What happens when the ultrasonic reading is below the specified distance?",
      "choices": [
        "Music and dancing begin",
        "The battery turns off",
        "A QR code opens",
        "The robot is disassembled"
      ],
      "correctIndex": 0,
      "explanation": "Approach detection starts picture display, motor movement and music.",
      "hint": "Follow the order of sensing, music and motion."
    },
    {
      "id": "l4-dancing-robot-08",
      "topic": "sensor-triggered-dance",
      "learningSlide": 24,
      "prompt": "Which part moves to produce the initial dancing motion?",
      "choices": [
        "A paper feeder",
        "A door latch",
        "A wheel encoder only",
        "A motor connected to the leg"
      ],
      "correctIndex": 3,
      "explanation": "The lesson's triggered program rotates the leg motor.",
      "hint": "Follow the order of sensing, music and motion."
    },
    {
      "id": "l4-dancing-robot-09",
      "topic": "timing-and-retrigger",
      "learningSlide": 25,
      "prompt": "What variable is reset before the arm-swinging period?",
      "choices": [
        "Controller time",
        "Screen width",
        "Photoelectric threshold",
        "Temperature"
      ],
      "correctIndex": 0,
      "explanation": "Slide 25 resets controller time before the arm-motor sequence.",
      "hint": "Recall what happens after a dance ends."
    },
    {
      "id": "l4-dancing-robot-10",
      "topic": "timing-and-retrigger",
      "learningSlide": 26,
      "prompt": "What must happen before a person can trigger another dance after the routine ends?",
      "choices": [
        "The controller must be replaced",
        "The person must move away and approach again",
        "The robot must change its name",
        "The ultrasonic sensor must be removed"
      ],
      "correctIndex": 1,
      "explanation": "The program waits for the distance to become large again before retriggering.",
      "hint": "Recall what happens after a dance ends."
    }
  ]
};
