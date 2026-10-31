/** Reconciled Level 1 official Learning-PDF bank. */
import type { QuizBank } from "../../quizStudio";
export const skatingBank: QuizBank = {
  "projectId": "skating",
  "title": "Skating",
  "sourcePdfPath": "public/Level 1/Learning/Manipulators/Skating.pdf",
  "sourcePageCount": 11,
  "questions": [
    {
      "id": "skating-01",
      "topic": "skating",
      "learningSlide": 3,
      "prompt": "Which movement does the skating lesson say skaters can perform?",
      "choices": [
        "Only jump vertically",
        "Turn left and right",
        "Only move backward",
        "Only turn the head"
      ],
      "correctIndex": 1,
      "explanation": "The introduction includes moving forward and turning in both directions.",
      "hint": "Think about changing direction on the ice."
    },
    {
      "id": "skating-02",
      "topic": "skating",
      "learningSlide": 3,
      "prompt": "What circular movement is also mentioned in the skating introduction?",
      "choices": [
        "Climbing stairs",
        "Rolling a ball down a ramp",
        "Moving under water",
        "Turning in circles"
      ],
      "correctIndex": 3,
      "explanation": "Slide 3 says skaters can turn in circles.",
      "hint": "Think about skating around a point."
    },
    {
      "id": "skating-03",
      "topic": "ice",
      "learningSlide": 4,
      "prompt": "What layer does the lesson suggest may help skates move across ice?",
      "choices": [
        "A thick layer of sand",
        "A layer of rubber",
        "A thin water layer",
        "A layer of dry dust"
      ],
      "correctIndex": 2,
      "explanation": "The exploration mentions a thin water lubricating layer on ice.",
      "hint": "Think about the material reducing resistance beneath a skate."
    },
    {
      "id": "skating-04",
      "topic": "ice",
      "learningSlide": 4,
      "prompt": "What is the proposed function of the water layer in the skating explanation?",
      "choices": [
        "Lubrication",
        "Electrical insulation",
        "Sound amplification",
        "Magnetic attraction"
      ],
      "correctIndex": 0,
      "explanation": "The slide describes water as a lubricating layer.",
      "hint": "Think about making two contacting surfaces slide more easily."
    },
    {
      "id": "skating-05",
      "topic": "model",
      "learningSlide": 5,
      "prompt": "Which model from the earlier lesson is reused to imitate skating?",
      "choices": [
        "Car model",
        "House model",
        "Bird model",
        "Lighthouse model"
      ],
      "correctIndex": 0,
      "explanation": "The lesson reuses a previously made car for its skating program.",
      "hint": "Remember the two-motor vehicle built earlier."
    },
    {
      "id": "skating-06",
      "topic": "model",
      "learningSlide": 5,
      "prompt": "What activity does the reused model help students explore?",
      "choices": [
        "Calculating barometric pressure",
        "Designing a traffic signal",
        "Programming skating-style movements",
        "Drawing a building blueprint"
      ],
      "correctIndex": 2,
      "explanation": "The lesson programs the car to imitate movements on ice.",
      "hint": "Think about translating a skating motion into wheel motor commands."
    },
    {
      "id": "skating-07",
      "topic": "motors",
      "learningSlide": 10,
      "prompt": "Why does the example car fail to travel straight?",
      "choices": [
        "Both wheels are the same size",
        "It has too many program names",
        "The color sensor is off",
        "Its two motors have different speeds"
      ],
      "correctIndex": 3,
      "explanation": "The evaluation says unequal motor speeds cause a nonstraight path.",
      "hint": "Think about what happens when one side turns faster."
    },
    {
      "id": "skating-08",
      "topic": "motors",
      "learningSlide": 10,
      "prompt": "What motor-speed relationship would help the car move straight in the illustrated example?",
      "choices": [
        "One drive motor stopped permanently",
        "Both drive motors moving at matching effective speeds",
        "The left motor at twice the right speed",
        "Both motors alternating between forward and reverse every instant"
      ],
      "correctIndex": 1,
      "explanation": "The evaluation identifies unequal speeds as the cause of turning.",
      "hint": "Compare the distance each side travels in the same time."
    },
    {
      "id": "skating-09",
      "topic": "reflection",
      "learningSlide": 9,
      "prompt": "What does the coding slide ask students to do after running the skating program?",
      "choices": [
        "Discard the code without observing",
        "Record and share the car's action",
        "Remove the motors",
        "Change the PDF's title"
      ],
      "correctIndex": 1,
      "explanation": "Slide 9 asks students to observe, record and share the motion.",
      "hint": "Think about what you should do in an experiment."
    },
    {
      "id": "skating-10",
      "topic": "reflection",
      "learningSlide": 11,
      "prompt": "What does the final challenge encourage?",
      "choices": [
        "Try additional interesting car movements",
        "Only repeat the program without changes",
        "Stop using the car model",
        "Replace the wheels with pressure sensors"
      ],
      "correctIndex": 0,
      "explanation": "The challenge invites students to make more interesting actions.",
      "hint": "Think about designing a new movement using the same car."
    }
  ]
};
