/** Source-checked Learning PDF questions for Axe Robot. */
import type { QuizBank } from "../quizStudio";

export const axeRobotBank: QuizBank = {
  "projectId": "level-2-axe-robot",
  "title": "Axe Robot",
  "sourcePdfPath": "public/Level 2/Learning/Action-Oriented/Axe robot/Axe robot_Powerpoint.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "axe-01",
      "topic": "robot-design",
      "prompt": "Which two main features does the Axe Robot lesson emphasize?",
      "choices": [
        "A large motor and an axe",
        "A color sensor and a camera",
        "A speaker and an antenna",
        "Two walking legs and a tail"
      ],
      "correctIndex": 0,
      "learningSlide": 7,
      "explanation": "The lesson focuses on combining a large motor with an axe-shaped mechanism.",
      "hint": "Think about the moving part and the component that drives it."
    },
    {
      "id": "axe-02",
      "topic": "robot-design",
      "prompt": "Which movement is associated with the axe in the lesson?",
      "choices": [
        "Swinging or slashing",
        "Flying straight up",
        "Rolling on wheels",
        "Climbing a ladder"
      ],
      "correctIndex": 0,
      "learningSlide": 9,
      "explanation": "The lesson describes the axe's direction as a slash.",
      "hint": "Picture how the end of an axe can move through its workspace."
    },
    {
      "id": "axe-03",
      "topic": "components",
      "prompt": "Which electronic components does the lesson list?",
      "choices": [
        "RCU and a large motor",
        "Camera and GPS",
        "Two microphones",
        "A fan and heater"
      ],
      "correctIndex": 0,
      "learningSlide": 10,
      "explanation": "Slide 10 lists the RCU and large motor as the electronic components.",
      "hint": "Recall what controls the motor and what makes the axe move."
    },
    {
      "id": "axe-04",
      "topic": "components",
      "prompt": "Why can the RCU be used as the Axe Robot's base?",
      "choices": [
        "It is relatively large",
        "It is the sharpest part",
        "It measures light intensity",
        "It replaces the motor"
      ],
      "correctIndex": 0,
      "learningSlide": 10,
      "explanation": "The slide notes that the RCU's larger size makes it useful as a base.",
      "hint": "Think about which part needs enough surface to support the axe."
    },
    {
      "id": "axe-05",
      "topic": "assembly",
      "prompt": "What is especially important if the axe becomes heavier?",
      "choices": [
        "Base stability",
        "Screen brightness",
        "Sound volume",
        "Cable color"
      ],
      "correctIndex": 0,
      "learningSlide": 10,
      "explanation": "Slide 10 specifically asks students to consider base stability when the axe is heavy.",
      "hint": "Imagine how the weight of a moving axe affects its support."
    },
    {
      "id": "axe-06",
      "topic": "assembly",
      "prompt": "Which item appears in the lesson's assembly checklist?",
      "choices": [
        "Match the intended shape",
        "Remove every support beam",
        "Make the structure unstable",
        "Keep parts unconnected"
      ],
      "correctIndex": 0,
      "learningSlide": 12,
      "explanation": "Slide 12 includes 'shape match' among the assembly requirements.",
      "hint": "Compare your planned axe shape with the finished model."
    },
    {
      "id": "axe-07",
      "topic": "working-range",
      "prompt": "What does a servo motor's working range describe in this lesson?",
      "choices": [
        "The allowed movement angles",
        "The battery's color",
        "The length of a computer cable",
        "The total weight of the classroom"
      ],
      "correctIndex": 0,
      "learningSlide": 16,
      "explanation": "The working range limits how far the servo moves in that robot structure.",
      "hint": "Think about how far a moving arm can safely swing."
    },
    {
      "id": "axe-08",
      "topic": "working-range",
      "prompt": "Why should the Axe Robot not exceed its servo's working angle?",
      "choices": [
        "It may damage or overheat the servo gears",
        "It will automatically improve accuracy",
        "It will make the base heavier",
        "It will permanently increase battery capacity"
      ],
      "correctIndex": 0,
      "learningSlide": 16,
      "explanation": "The slides warn that exceeding the angle limit can wear or heat the servo's internal gears.",
      "hint": "Think about the moving beam meeting the robot's physical limits."
    },
    {
      "id": "axe-09",
      "topic": "debugging",
      "prompt": "What should students observe when testing the axe's workspace?",
      "choices": [
        "Swing space, swing speed and code-value range",
        "Only the classroom lighting",
        "Only the motor's color",
        "Only the length of the PDF"
      ],
      "correctIndex": 0,
      "learningSlide": 14,
      "explanation": "The workspace test records motor swing space, speed and the range of code values.",
      "hint": "Consider which measurements help avoid a collision as the axe swings."
    },
    {
      "id": "axe-10",
      "topic": "debugging",
      "prompt": "After checking swing space, what does the next test select?",
      "choices": [
        "A suitable servo angle and running speed",
        "A completely different project",
        "The teacher's timetable",
        "An unrelated sensor location"
      ],
      "correctIndex": 0,
      "learningSlide": 15,
      "explanation": "The second test uses the first test's observations to find suitable movement settings.",
      "hint": "Use the first experiment's observations to choose safer settings."
    }
  ]
};
