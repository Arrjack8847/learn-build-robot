import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 23-page Learning PDF. */
export const colorblindAssistantRobotBank: QuizBank = {
  "projectId": "level-6-colorblind-assistant-robot",
  "title": "Colorblind Assistant Robot",
  "sourcePdfPath": "public/Level 6/Learning/Sensor-Focused Robots/Colorblind Assistant Robot/25.Colorblind Assistant Robot-Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "cbar-01",
      "topic": "colour-recognition",
      "learningSlide": 10,
      "prompt": "What kind of value does the AI color recognition block return?",
      "choices": [
        "A Boolean 1 or 0",
        "An angle from 0 to 360",
        "A written paragraph",
        "A four-digit password"
      ],
      "correctIndex": 0,
      "hint": "Think about a yes/no recognition result.",
      "explanation": "The colour recognition block reports 1 or 0."
    },
    {
      "id": "cbar-02",
      "topic": "colour-recognition",
      "learningSlide": 10,
      "prompt": "What must the AI module do before it can recognize a chosen color ID?",
      "choices": [
        "Measure the object's weight",
        "Learn the color using its learning mode",
        "Calculate a road offset",
        "Enter a QR-code password"
      ],
      "correctIndex": 1,
      "hint": "The module first learns the appearance of a sample.",
      "explanation": "The lesson uses the AI module's colour-learning mode."
    },
    {
      "id": "cbar-03",
      "topic": "robot-hardware",
      "learningSlide": 13,
      "prompt": "Where is the AI vision module connected?",
      "choices": [
        "Motor port M1",
        "Battery terminal only",
        "Controller port P8",
        "A speaker output"
      ],
      "correctIndex": 2,
      "hint": "Separate the camera connector from the motor output.",
      "explanation": "The vision module connects to P8."
    },
    {
      "id": "cbar-04",
      "topic": "robot-hardware",
      "learningSlide": 13,
      "prompt": "Which port operates the pointer motor?",
      "choices": [
        "P8",
        "P2",
        "A USB display port",
        "M1"
      ],
      "correctIndex": 3,
      "hint": "The motor uses a motor-labelled connection.",
      "explanation": "The model connects its pointer motor to M1."
    },
    {
      "id": "cbar-05",
      "topic": "recognition-variables",
      "learningSlide": 17,
      "prompt": "What do the program variables X and Y hold?",
      "choices": [
        "The ID1 and ID2 recognition states",
        "The motor's weight and voltage",
        "The program's title and date",
        "Two page numbers"
      ],
      "correctIndex": 0,
      "hint": "They store two learned recognition results.",
      "explanation": "Slide 17 assigns X and Y to color recognition IDs 1 and 2."
    },
    {
      "id": "cbar-06",
      "topic": "recognition-variables",
      "learningSlide": 16,
      "prompt": "What happens before colour identification starts?",
      "choices": [
        "Erase the AI vision module",
        "Reset the pointer and enter colour-learning mode",
        "Run the motor at maximum speed forever",
        "Turn every sensor off"
      ],
      "correctIndex": 1,
      "hint": "The system needs a known starting position.",
      "explanation": "Slide 16 calls reset before setting colour learning mode."
    },
    {
      "id": "cbar-07",
      "topic": "pointer-response",
      "learningSlide": 18,
      "prompt": "What should the pointer do when ID 1 is recognized?",
      "choices": [
        "Point to green at 240 degrees",
        "Stop the controller completely",
        "Turn to the red block at 60 degrees",
        "Scan a QR code"
      ],
      "correctIndex": 2,
      "hint": "ID 1 is the first example colour.",
      "explanation": "Slide 18 maps X=1 to 60 degrees and red."
    },
    {
      "id": "cbar-08",
      "topic": "pointer-response",
      "learningSlide": 19,
      "prompt": "What angle does the green-block recognition use?",
      "choices": [
        "60 degrees",
        "30 degrees",
        "0 degrees",
        "240 degrees"
      ],
      "correctIndex": 3,
      "hint": "Use the second trained recognition ID.",
      "explanation": "Slide 19 points to green at 240 degrees."
    },
    {
      "id": "cbar-09",
      "topic": "extension",
      "learningSlide": 21,
      "prompt": "What does the lesson ask students to extend?",
      "choices": [
        "The number of colours the robot recognizes",
        "Only the colour of its controller case",
        "The number of road lanes",
        "The countdown timer's duration"
      ],
      "correctIndex": 0,
      "hint": "The expansion targets a larger recognition set.",
      "explanation": "Slide 21 asks for more recognized colours."
    },
    {
      "id": "cbar-10",
      "topic": "extension",
      "learningSlide": 22,
      "prompt": "Which three colour channels form the RGB model?",
      "choices": [
        "Red, gray and black",
        "Red, green and blue",
        "Orange, purple and yellow",
        "White, silver and black"
      ],
      "correctIndex": 1,
      "hint": "RGB is named for its three light channels.",
      "explanation": "Slide 22 defines RGB as red, green and blue."
    }
  ]
};
