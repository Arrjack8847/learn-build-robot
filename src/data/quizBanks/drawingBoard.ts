/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const drawingBoardBank: QuizBank = {
  "projectId": "drawing-board",
  "title": "Drawing Board",
  "sourcePdfPath": "public/Level 1/Learning/Display & Movement/Drawing board/Drawing board_Powerpoint.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "drawing-board-01",
      "topic": "project-purpose",
      "learningSlide": 7,
      "prompt": "What does the Drawing Board robot use to display drawings?",
      "choices": [
        "The main controller's screen",
        "The motor axle",
        "The ultrasonic sensor",
        "The charging cable"
      ],
      "correctIndex": 0,
      "hint": "Think about where images appear in this lesson.",
      "explanation": "The lesson uses the main controller screen as the drawing board."
    },
    {
      "id": "drawing-board-02",
      "topic": "project-purpose",
      "learningSlide": 7,
      "prompt": "What is one aim of the Drawing Board project?",
      "choices": [
        "Learning how to operate the controller",
        "Training a robot to swim",
        "Using a gearbox to lift a car",
        "Building an outdoor windmill"
      ],
      "correctIndex": 0,
      "hint": "Consider which device is introduced during the project.",
      "explanation": "The lesson teaches the main controller's interface and basic operation."
    },
    {
      "id": "drawing-board-03",
      "topic": "rcu-and-hardware",
      "learningSlide": 9,
      "prompt": "Which part is described as the robot's controller?",
      "choices": [
        "E6 RCU",
        "Large motor",
        "Touch sensor",
        "LED module"
      ],
      "correctIndex": 0,
      "hint": "Look at the part in the equipment list that stores programs.",
      "explanation": "The slide names the E6 RCU as the controller."
    },
    {
      "id": "drawing-board-04",
      "topic": "rcu-and-hardware",
      "learningSlide": 10,
      "prompt": "What is one function of the RCU?",
      "choices": [
        "Store and process program and signal data",
        "Replace every motor mechanically",
        "Change the size of building beams",
        "Generate wind for a sailboat"
      ],
      "correctIndex": 0,
      "hint": "Think about information handling in the controller.",
      "explanation": "The RCU can store and process data through its input and output connections."
    },
    {
      "id": "drawing-board-05",
      "topic": "controller-ports",
      "learningSlide": 11,
      "prompt": "Which RCU ports are used for connecting motors?",
      "choices": [
        "M1–M4",
        "P1–P8 only",
        "The speaker holes",
        "The power button"
      ],
      "correctIndex": 0,
      "hint": "Compare the two port groups listed.",
      "explanation": "The lesson assigns motor connections to ports M1–M4."
    },
    {
      "id": "drawing-board-06",
      "topic": "controller-ports",
      "learningSlide": 11,
      "prompt": "What does the Type-C port do in this controller lesson?",
      "choices": [
        "Connects to a computer and supports charging",
        "Acts as a wheel axle",
        "Holds a gear onto a beam",
        "Measures light colour directly"
      ],
      "correctIndex": 0,
      "hint": "Recall which connector is for the computer.",
      "explanation": "The Type-C port connects the RCU to a computer and is used for charging."
    },
    {
      "id": "drawing-board-07",
      "topic": "controller-controls",
      "learningSlide": 12,
      "prompt": "What does the Run button do?",
      "choices": [
        "Runs a selected program",
        "Removes all programs",
        "Unplugs the motors",
        "Changes the robot's physical shape"
      ],
      "correctIndex": 0,
      "hint": "Think about an already-downloaded program.",
      "explanation": "The Run key runs the chosen program on the RCU."
    },
    {
      "id": "drawing-board-08",
      "topic": "controller-controls",
      "learningSlide": 13,
      "prompt": "Which icon opens a list of previously used programs?",
      "choices": [
        "Select Program",
        "Audio Download",
        "Power Off",
        "Built-in Test"
      ],
      "correctIndex": 0,
      "hint": "Look for the interface action used to choose an earlier program.",
      "explanation": "The Select Program control displays a list of previous programs."
    },
    {
      "id": "drawing-board-09",
      "topic": "power-and-operation",
      "learningSlide": 14,
      "prompt": "Where is the RCU's power supply slot located?",
      "choices": [
        "At the back of the RCU",
        "Inside the motor shaft",
        "On the robot's display glass",
        "At the tip of the sensor cable"
      ],
      "correctIndex": 0,
      "hint": "Recall the device's rear-side component.",
      "explanation": "The source states that the RCU power supply slot is on its back."
    },
    {
      "id": "drawing-board-10",
      "topic": "power-and-operation",
      "learningSlide": 14,
      "prompt": "Which power source is used in this RCU?",
      "choices": [
        "An integrated rechargeable lithium battery",
        "A wind-up spring",
        "A solar-only cell with no battery",
        "A hand-crank generator"
      ],
      "correctIndex": 0,
      "hint": "The charging instruction identifies the stored power source.",
      "explanation": "The lesson uses an integrated lithium battery and describes charging via Type-C."
    }
  ]
};
