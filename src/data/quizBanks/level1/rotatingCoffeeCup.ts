/**
 * Grounded in the official Rotating Coffee Cup teaching PDF text, with 1-based pages.
 * Requires visual page and educator review before registration for students.
 */
import type { QuizBank } from "../../quizStudio";

export const rotatingCoffeeCupBank: QuizBank = {
  "projectId": "rotating-coffee-cup",
  "title": "Rotating Coffee Cup",
  "sourcePdfPath": "public/Rotating Coffee Cup.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "rotating-coffee-cup-01",
      "topic": "rotating-ride",
      "learningSlide": 4,
      "prompt": "What movement is the coffee-cup ride model meant to copy?",
      "choices": [
        "Turning around",
        "Sliding down a hill",
        "Flying through the sky",
        "Climbing a ladder"
      ],
      "correctIndex": 0,
      "hint": "Think of the main action of the amusement-park cup.",
      "explanation": "The introduction describes a cup-shaped ride that rotates."
    },
    {
      "id": "rotating-coffee-cup-02",
      "topic": "rotating-ride",
      "learningSlide": 4,
      "prompt": "What everyday object gives the amusement-park ride its name?",
      "choices": [
        "A bicycle",
        "A drum",
        "A bridge",
        "A cup"
      ],
      "correctIndex": 3,
      "hint": "Imagine the shape riders sit inside.",
      "explanation": "The introductory lesson points out the ride's large cup shape."
    },
    {
      "id": "rotating-coffee-cup-03",
      "topic": "gear-drive",
      "learningSlide": 3,
      "prompt": "Which mechanical system is a main learning topic for the ride?",
      "choices": [
        "Sound sensor",
        "Solar charger",
        "Paper hinge",
        "Gear drive"
      ],
      "correctIndex": 3,
      "hint": "Think about toothed parts transmitting rotation.",
      "explanation": "The teaching objectives explicitly name gear-driven motion."
    },
    {
      "id": "rotating-coffee-cup-04",
      "topic": "gear-drive",
      "learningSlide": 5,
      "prompt": "Which drive structure does the teacher explain after students build the model?",
      "choices": [
        "Battery charging circuit",
        "Cooling pipe",
        "Gear-driven structure",
        "Camera focusing system"
      ],
      "correctIndex": 2,
      "hint": "Recall the mechanism discussed during hands-on work.",
      "explanation": "The teacher guidance calls for explaining the gear-driven structure."
    },
    {
      "id": "rotating-coffee-cup-05",
      "topic": "linkage",
      "learningSlide": 3,
      "prompt": "Which other mechanism is included alongside gears in the teaching objectives?",
      "choices": [
        "Computer keyboard",
        "GPS aerial",
        "Linkage",
        "Water filter"
      ],
      "correctIndex": 2,
      "hint": "It involves connected mechanical parts.",
      "explanation": "The lesson explicitly includes the application and learning of linkage."
    },
    {
      "id": "rotating-coffee-cup-06",
      "topic": "linkage",
      "learningSlide": 6,
      "prompt": "What moving-part principle does the lesson ask students about when reviewing the model?",
      "choices": [
        "A musical note",
        "A linkage",
        "A thermometer",
        "A light sensor"
      ],
      "correctIndex": 1,
      "hint": "The end-of-lesson question asks how the cup is made to move.",
      "explanation": "The display section asks whether the cup's motion is produced through a linkage."
    },
    {
      "id": "rotating-coffee-cup-07",
      "topic": "motor-control",
      "learningSlide": 5,
      "prompt": "Which program setting can change how quickly the cup turns?",
      "choices": [
        "File name",
        "Motor speed value",
        "Project title",
        "Screen background colour"
      ],
      "correctIndex": 1,
      "hint": "Look for the number that sets the motor's movement.",
      "explanation": "The lesson says to adjust the speed by debugging the motor speed value."
    },
    {
      "id": "rotating-coffee-cup-08",
      "topic": "motor-control",
      "learningSlide": 5,
      "prompt": "Which module should a student set to control the cup's motor?",
      "choices": [
        "Motor module",
        "Calendar module",
        "Camera module",
        "Photo album module"
      ],
      "correctIndex": 0,
      "hint": "A turning model needs a command for its moving electrical part.",
      "explanation": "The hands-on notes explicitly require setting the motor module."
    },
    {
      "id": "rotating-coffee-cup-09",
      "topic": "program-steps",
      "learningSlide": 3,
      "prompt": "Which programming idea is highlighted in this lesson?",
      "choices": [
        "Following a sequence of instructions",
        "Picking every instruction at random",
        "Only writing names on paper",
        "Never using programming blocks"
      ],
      "correctIndex": 0,
      "hint": "Think about commands placed in an intended order.",
      "explanation": "The objectives specifically include understanding sequential programming."
    },
    {
      "id": "rotating-coffee-cup-10",
      "topic": "program-steps",
      "learningSlide": 5,
      "prompt": "How does the lesson connect the robot controller for computer programming?",
      "choices": [
        "A gear tooth",
        "A fan blade",
        "A rubber tyre",
        "USB cable"
      ],
      "correctIndex": 3,
      "hint": "Look for the physical connection used before programming.",
      "explanation": "The hands-on instructions describe connecting controller and computer via USB."
    }
  ]
};
