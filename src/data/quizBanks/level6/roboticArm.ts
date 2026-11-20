import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 23-page Learning PDF. */
export const roboticArmBank: QuizBank = {
  "projectId": "level-6-robotic-arm",
  "title": "Robotic Arm",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/Robotic Arm/32. The Robotic Arm-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "rba-01",
      "topic": "freedom",
      "learningSlide": 9,
      "prompt": "How many degrees of freedom does the classroom robotic arm use?",
      "choices": [
        "Three",
        "Seven",
        "One",
        "Ten"
      ],
      "correctIndex": 0,
      "hint": "The simple teaching model has fewer degrees than a human arm.",
      "explanation": "Slide 9 specifies a three-degree-of-freedom robotic arm."
    },
    {
      "id": "rba-02",
      "topic": "freedom",
      "learningSlide": 8,
      "prompt": "What does a higher degree of freedom generally allow?",
      "choices": [
        "A larger PDF file",
        "More independent movement possibilities",
        "Fewer moving joints for every action",
        "A weaker motor without control"
      ],
      "correctIndex": 1,
      "hint": "Independent directions make motion more flexible.",
      "explanation": "Slide 8 links flexibility to degrees of freedom."
    },
    {
      "id": "rba-03",
      "topic": "model-components",
      "learningSlide": 11,
      "prompt": "What mechanism holds an object during transport?",
      "choices": [
        "A QR-code camera",
        "A rain gauge",
        "The robotic clip or claw",
        "A traffic lamp"
      ],
      "correctIndex": 2,
      "hint": "The end of the arm grips the item.",
      "explanation": "Slide 11 labels the clip used for grabbing."
    },
    {
      "id": "rba-04",
      "topic": "model-components",
      "learningSlide": 12,
      "prompt": "Which motor type drives opening and closing of the claws?",
      "choices": [
        "Laser sensor",
        "Dot matrix display",
        "Camera input",
        "Medium motor"
      ],
      "correctIndex": 3,
      "hint": "The lesson separates claw motion from large-motor movements.",
      "explanation": "Slide 12 uses a medium motor for grasping."
    },
    {
      "id": "rba-05",
      "topic": "movement-functions",
      "learningSlide": 12,
      "prompt": "Which three function groups are needed for the arm?",
      "choices": [
        "Up/down, left/right, grasp/release",
        "Heat, humidity and wind",
        "Play, pause and print",
        "Unlock, pay and charge"
      ],
      "correctIndex": 0,
      "hint": "Each degree controls a different part of the task.",
      "explanation": "Slide 12 organizes the three motion functions."
    },
    {
      "id": "rba-06",
      "topic": "movement-functions",
      "learningSlide": 14,
      "prompt": "How does the main program organize arm control?",
      "choices": [
        "Execute only one movement once",
        "Repeatedly call its three movement sub-functions",
        "Ignore all sensor triggers",
        "Set all motors permanently to maximum"
      ],
      "correctIndex": 1,
      "hint": "The main loop continually checks the controls.",
      "explanation": "Slide 14 repeats the three motion functions."
    },
    {
      "id": "rba-07",
      "topic": "sensor-controls",
      "learningSlide": 15,
      "prompt": "What is checked before the grasp/release function operates?",
      "choices": [
        "Whether the date changed",
        "Whether a QR product was paid for",
        "Whether a touch sensor was pressed",
        "Whether it is raining"
      ],
      "correctIndex": 2,
      "hint": "A trigger indicates the user requested action.",
      "explanation": "Slide 15 tests touch-sensor activation."
    },
    {
      "id": "rba-08",
      "topic": "sensor-controls",
      "learningSlide": 17,
      "prompt": "What does the program check to choose a left or right turn?",
      "choices": [
        "The number of saved image files",
        "The number of controller batteries",
        "The motor's colour",
        "Which side of the touch screen was touched"
      ],
      "correctIndex": 3,
      "hint": "Touch position determines the turn direction.",
      "explanation": "Slide 17 judges the touch coordinates."
    },
    {
      "id": "rba-09",
      "topic": "stability",
      "learningSlide": 21,
      "prompt": "What problem is the robotic-arm optimization meant to solve?",
      "choices": [
        "Unstable or jerky vertical movement",
        "Missing checkout prices",
        "Colour sensor recognition of bananas",
        "Traffic signal flashing"
      ],
      "correctIndex": 0,
      "hint": "The arm should lift smoothly.",
      "explanation": "Slide 21 asks for a steadier upward and downward motion."
    },
    {
      "id": "rba-10",
      "topic": "stability",
      "learningSlide": 21,
      "prompt": "Which adjustment is allowed in the optimization task?",
      "choices": [
        "Remove all arm joints",
        "Change the program or modify the structure",
        "Use an unrelated PDF",
        "Disable the motor encoder"
      ],
      "correctIndex": 1,
      "hint": "Both software and mechanical changes may improve stability.",
      "explanation": "Slide 21 permits program and structural modifications."
    }
  ]
};
