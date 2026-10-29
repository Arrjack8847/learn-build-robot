/** Phase 3 source-text questions. Manual diagram and educational QA still required. */
import type { QuizBank } from "../quizStudio";
export const rotatingCoffeeCupBank: QuizBank = {
  "projectId": "rotating-coffee-cup",
  "title": "Rotating Coffee Cup",
  "sourcePdfPath": "public/Rotating Coffee Cup.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "rotating-coffee-cup-01",
      "topic": "amusement-ride",
      "prompt": "What amusement-park ride does the project model?",
      "choices": [
        "A sailboat trip",
        "A rotating coffee cup",
        "A train crossing",
        "A parachute jump"
      ],
      "correctIndex": 1,
      "learningSlide": 4,
      "hint": "Think about the amusement-park attraction that the project tries to imitate.",
      "explanation": "The introduction describes a spinning ride that looks like a large cup."
    },
    {
      "id": "rotating-coffee-cup-02",
      "topic": "amusement-ride",
      "prompt": "What distinctive shape helps identify this ride in the introduction?",
      "choices": [
        "A small airplane",
        "A four-wheeled car",
        "A giant cup",
        "A tall ladder"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "hint": "Remember what everyday drinking object inspired the ride's appearance.",
      "explanation": "The story says the ride looks like a cup big enough to hold people."
    },
    {
      "id": "rotating-coffee-cup-03",
      "topic": "project-design",
      "prompt": "Where are students asked to sketch their own version of the ride?",
      "choices": [
        "On the USB cable",
        "Inside a sensor",
        "On the battery label",
        "On the blackboard"
      ],
      "correctIndex": 3,
      "learningSlide": 4,
      "hint": "Recall what students draw before they choose model building parts.",
      "explanation": "The design analysis asks students to draw rotating coffee cups on the blackboard."
    },
    {
      "id": "rotating-coffee-cup-04",
      "topic": "project-design",
      "prompt": "Which question should be considered while planning the model?",
      "choices": [
        "What makes the cup rotate?",
        "How a bird builds its nest",
        "How a boat stays afloat",
        "Which colour the sky is"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "hint": "Think about the movement the passenger seat needs to make during the ride.",
      "explanation": "The topic analysis asks what makes the rotating coffee cup turn."
    },
    {
      "id": "rotating-coffee-cup-05",
      "topic": "gears-and-linkages",
      "prompt": "Which mechanical transmission is a main topic?",
      "choices": [
        "Wind-powered sail",
        "Gear drive",
        "Photoelectric sensor",
        "Hydraulic elevator"
      ],
      "correctIndex": 1,
      "learningSlide": 3,
      "hint": "Remember which toothed mechanical components can transfer rotation.",
      "explanation": "The learning objectives include understanding gear-driven mechanisms.",
      "image": {
        "src": "/quiz-visuals/level1/rotating-coffee-cup.svg",
        "alt": "Rotating cup ride mounted on a toothed gear drive."
      }
    },
    {
      "id": "rotating-coffee-cup-06",
      "topic": "gears-and-linkages",
      "prompt": "Which additional mechanism is also listed in the lesson objectives?",
      "choices": [
        "Radio broadcasting",
        "Optical lens",
        "Linkage",
        "Ultrasound scanning"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "hint": "Recall the additional connected moving structure taught with gear transmission.",
      "explanation": "The teaching objectives mention applying and learning linkage.",
      "image": {
        "src": "/quiz-visuals/level1/rotating-coffee-cup.svg",
        "alt": "Rotating cup ride mounted on a toothed gear drive."
      }
    },
    {
      "id": "rotating-coffee-cup-07",
      "topic": "motor-control",
      "prompt": "What structure does the teacher explain after building the model?",
      "choices": [
        "Rubber-band elasticity only",
        "Water turbine",
        "Fixed cage",
        "Gear-driven structure"
      ],
      "correctIndex": 3,
      "learningSlide": 5,
      "hint": "Focus on what makes one rotating part turn another during the assembly.",
      "explanation": "The hands-on instructions specifically explain the gear-driven structure."
    },
    {
      "id": "rotating-coffee-cup-08",
      "topic": "motor-control",
      "prompt": "Which construction challenge is highlighted?",
      "choices": [
        "Combining the drive parts correctly",
        "Connecting a telephone to an emergency line",
        "Shaping a bird's feathers",
        "Cutting paper to fit a cage"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "hint": "Consider how the transmission pieces must be joined for rotation to reach the cup.",
      "explanation": "The key difficulties include understanding the drive combination."
    },
    {
      "id": "rotating-coffee-cup-09",
      "topic": "programming",
      "prompt": "Which coding parameter changes how quickly the rotating cup turns?",
      "choices": [
        "Blackboard position",
        "Motor speed value",
        "Page number",
        "Motor casing colour"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "hint": "Think about the number in the motor-control program that affects rotational motion.",
      "explanation": "The teacher is told to adjust the speed by debugging the motor speed value."
    },
    {
      "id": "rotating-coffee-cup-10",
      "topic": "programming",
      "prompt": "Which computer connection is included in the programming activity?",
      "choices": [
        "Paper and glue",
        "A sail rope to an axle",
        "USB cable to the controller",
        "Rubber band to a pen"
      ],
      "correctIndex": 2,
      "learningSlide": 5,
      "hint": "Remember how instructions are transferred from a computer to the controller.",
      "explanation": "The lesson describes connecting the controller and computer using USB."
    }
  ]
};
