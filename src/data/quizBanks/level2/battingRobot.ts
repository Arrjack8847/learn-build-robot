/** Source-checked against the official Level 2 Learning PDF, including illustrated pages. */
import type { QuizBank } from "../../quizStudio";

export const battingRobotBank: QuizBank = {
  "projectId": "level-2-batting-robot",
  "title": "Batting Robot",
  "sourcePdfPath": "public/Level 2/Learning/Action-Oriented/Batting robot/Batting robot_Powerpoint.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "bt01",
      "topic": "batting-motion",
      "learningSlide": 6,
      "prompt": "Which activity is an example of batting as described in the lesson?",
      "choices": [
        "Swinging a bat to hit a ball",
        "Counting the motor's ports",
        "Measuring air humidity",
        "Printing a page"
      ],
      "correctIndex": 0,
      "hint": "Think about the sporting action shown in the introduction.",
      "explanation": "Slide 6 describes batting as striking in sports using a racket, bat, club or hand."
    },
    {
      "id": "bt02",
      "topic": "batting-motion",
      "learningSlide": 6,
      "prompt": "Which combination can affect how far the ball travels when it is hit?",
      "choices": [
        "Screen brightness, color and cable length",
        "Shot angle, contact area and strength",
        "Robot name, paint color and battery label",
        "Number of windows, speakers and lights"
      ],
      "correctIndex": 1,
      "hint": "Consider what changes how the ball is struck.",
      "explanation": "Slide 6 names the angle of the shot, the contact area and the strength as factors related to hitting distance."
    },
    {
      "id": "bt03",
      "topic": "robot-design",
      "learningSlide": 7,
      "prompt": "Which part of the robot acts as the swinging joint for its bat?",
      "choices": [
        "The RCU's display",
        "A loose beam with no connection",
        "The medium-sized motor",
        "An infrared sensor"
      ],
      "correctIndex": 2,
      "hint": "Look for the component that gives the bat an active swing.",
      "explanation": "Slide 7 says the medium-sized motor is the swing joint controlling the bat's angle and strength."
    },
    {
      "id": "bt04",
      "topic": "robot-design",
      "learningSlide": 7,
      "prompt": "Why are the RCU and beams used under the model?",
      "choices": [
        "To create water pressure",
        "To act as a balanced base",
        "To replace the programming software",
        "To store sports balls electronically"
      ],
      "correctIndex": 1,
      "hint": "Think about keeping the robot upright as the bat moves.",
      "explanation": "Slide 7 explains that the RCU and beams make up the base to maintain balance."
    },
    {
      "id": "bt05",
      "topic": "servo-vs-dc-motion",
      "learningSlide": 9,
      "prompt": "How does the lesson contrast ordinary DC motor rotation with a servo motor's working angle?",
      "choices": [
        "An ordinary DC motor can rotate through 360 degrees, while a servo's working range is limited",
        "A servo must always rotate infinitely without stopping",
        "An ordinary DC motor can only move through five degrees",
        "Both motors can only rotate once per day"
      ],
      "correctIndex": 0,
      "hint": "Think about continuous turning versus moving to a bounded angle.",
      "explanation": "Slide 9 describes ordinary DC motor rotation through 360 degrees and a servo's limited working angle."
    },
    {
      "id": "bt06",
      "topic": "servo-vs-dc-motion",
      "learningSlide": 9,
      "prompt": "What determines the working angle available to a servo in a robot?",
      "choices": [
        "The day of the week",
        "Only the shape of a computer screen",
        "The structure and function of the mechanical device",
        "How loud the classroom is"
      ],
      "correctIndex": 2,
      "hint": "Consider the physical space around a moving arm.",
      "explanation": "Slide 9 says the servo's available working range depends on the mechanical device's structure and function."
    },
    {
      "id": "bt07",
      "topic": "servo-position-control",
      "learningSlide": 10,
      "prompt": "Which pair of movement properties can a servo control accurately, according to the lesson?",
      "choices": [
        "Paint color and volume",
        "Position and speed",
        "Temperature and light level",
        "Internet speed and storage"
      ],
      "correctIndex": 1,
      "hint": "Think about where the motor points and how quickly it moves.",
      "explanation": "Slide 10 explains that a servo can control speed and achieve accurate positioning."
    },
    {
      "id": "bt08",
      "topic": "servo-position-control",
      "learningSlide": 10,
      "prompt": "How can students control the rotation angle of the lesson's medium and large servo-capable motors?",
      "choices": [
        "By programming the motors",
        "By moving the classroom furniture",
        "By adding paper decorations",
        "By changing the robot's name"
      ],
      "correctIndex": 0,
      "hint": "Look for the method of setting an intended angle.",
      "explanation": "Slide 10 states that the rotation-angle range of the lesson's motors can be controlled by programming."
    },
    {
      "id": "bt09",
      "topic": "programming-sequence",
      "learningSlide": 14,
      "prompt": "According to the lesson's motion flow, what happens after the timed motor rotation?",
      "choices": [
        "The robot closes a window",
        "The controller turns into a speaker",
        "The motor returns to its original position",
        "A sensor measures room temperature"
      ],
      "correctIndex": 2,
      "hint": "Follow the flowchart from left to right.",
      "explanation": "Slide 14 shows Start → motor rotation → time → motor restored to its original position."
    },
    {
      "id": "bt10",
      "topic": "programming-sequence",
      "learningSlide": 17,
      "prompt": "Which motor-control block replaces 'Set Servo Motor' in the final programming improvement?",
      "choices": [
        "Set Screen Brightness",
        "Wait for Servo Motor",
        "Read Temperature",
        "Take Photo"
      ],
      "correctIndex": 1,
      "hint": "Compare the block name in the last program with the preceding slide.",
      "explanation": "Slide 17 explicitly replaces the 'Set Servo Motor' module with the 'Wait for Servo Motor' module."
    }
  ]
};
