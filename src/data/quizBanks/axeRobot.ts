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
        "Two drive wheels and a gear set",
        "A medium motor and gripper",
        "A sound sensor and lamp",
        "A large motor and an axe"
      ],
      "correctIndex": 3,
      "learningSlide": 7,
      "explanation": "The lesson focuses on combining a large motor with an axe-shaped mechanism.",
      "hint": "Think about the moving part and the component that drives it."
    },
    {
      "id": "axe-02",
      "topic": "robot-design",
      "prompt": "Which movement is associated with the axe in the lesson?",
      "choices": [
        "Sliding back and forth",
        "Swinging or slashing",
        "Rolling forward",
        "Moving straight up and down"
      ],
      "correctIndex": 1,
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
        "RCU and a small wheel motor",
        "Touch sensor and a medium motor",
        "RCU and an ultrasonic sensor"
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
        "It controls the swing angle automatically",
        "It makes the axe completely weightless",
        "It is relatively large",
        "It measures the swing's speed"
      ],
      "correctIndex": 2,
      "learningSlide": 10,
      "explanation": "The slide notes that the RCU's larger size makes it useful as a base.",
      "hint": "Think about which part needs enough surface to support the axe."
    },
    {
      "id": "axe-05",
      "topic": "assembly",
      "prompt": "What is especially important if the axe becomes heavier?",
      "choices": [
        "Sound sensor calibration",
        "The color of the axe part",
        "Base stability",
        "The number of display messages"
      ],
      "correctIndex": 2,
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
        "Increase the servo's speed",
        "Adjust the light sensor",
        "Add a sound indicator"
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
        "The program's battery level",
        "The allowed movement angles",
        "The RCU's number of ports",
        "The motor's maximum electrical current"
      ],
      "correctIndex": 1,
      "learningSlide": 16,
      "explanation": "The working range limits how far the servo moves in that robot structure.",
      "hint": "Think about how far a moving arm can safely swing."
    },
    {
      "id": "axe-08",
      "topic": "working-range",
      "prompt": "Why should the Axe Robot not exceed its servo's working angle?",
      "choices": [
        "The servo loses its code settings",
        "The RCU displays a wrong icon",
        "The battery reads a different voltage",
        "It may damage or overheat the servo gears"
      ],
      "correctIndex": 3,
      "learningSlide": 16,
      "explanation": "The slides warn that exceeding the angle limit can wear or heat the servo's internal gears.",
      "hint": "Think about the moving beam meeting the robot's physical limits."
    },
    {
      "id": "axe-09",
      "topic": "debugging",
      "prompt": "What should students observe when testing the axe's workspace?",
      "choices": [
        "Only the voltage and LED color",
        "Only the battery and sensor ports",
        "Only the frame length and motor weight",
        "Swing space, swing speed and code-value range"
      ],
      "correctIndex": 3,
      "learningSlide": 14,
      "explanation": "The workspace test records motor swing space, speed and the range of code values.",
      "hint": "Consider which measurements help avoid a collision as the axe swings."
    },
    {
      "id": "axe-10",
      "topic": "debugging",
      "prompt": "After checking swing space, what does the next test select?",
      "choices": [
        "The number of decorative parts",
        "The sound sensor's threshold",
        "A suitable servo angle and running speed",
        "The LCD's display text"
      ],
      "correctIndex": 2,
      "learningSlide": 15,
      "explanation": "The second test uses the first test's observations to find suitable movement settings.",
      "hint": "Use the first experiment's observations to choose safer settings."
    }
  ]
};
