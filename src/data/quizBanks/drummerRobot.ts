/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const drummerRobotBank: QuizBank = {
  "projectId": "drummer-robot",
  "title": "Drummer Robot",
  "sourcePdfPath": "public/Level 1/Learning/Foundational Robots/Drummer robot.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "drummer-robot-01",
      "topic": "project-goal",
      "learningSlide": 3,
      "prompt": "What robot is built in the drummer lesson?",
      "choices": [
        "A robotic sailboat",
        "A windmill generator",
        "An automatic drum-beating machine",
        "A picture-drawing robot"
      ],
      "correctIndex": 2,
      "hint": "Recall what the class concert needs.",
      "explanation": "The goal is to design a machine that beats a drum automatically."
    },
    {
      "id": "drummer-robot-02",
      "topic": "project-goal",
      "learningSlide": 4,
      "prompt": "Which two items must the drummer model include?",
      "choices": [
        "A sail and rudder",
        "A propeller and paddle",
        "A screen and camera only",
        "A drum and drumstick"
      ],
      "correctIndex": 3,
      "hint": "Think about what is needed to make a drumbeat.",
      "explanation": "The introduction says the drummer needs a drum and a drumstick to hit it."
    },
    {
      "id": "drummer-robot-03",
      "topic": "lever-mechanism",
      "learningSlide": 5,
      "prompt": "According to the exploration, what can make the drumbeat louder?",
      "choices": [
        "Lifting the drumstick higher",
        "Shortening every beam",
        "Removing the drum",
        "Keeping the stick completely still"
      ],
      "correctIndex": 0,
      "hint": "Think about the stick before it strikes.",
      "explanation": "The lesson connects a higher drumstick lift with a louder beat."
    },
    {
      "id": "drummer-robot-04",
      "topic": "lever-mechanism",
      "learningSlide": 6,
      "prompt": "Which principle is used to increase the drumstick's travel?",
      "choices": [
        "Light reflection",
        "Leverage",
        "Buoyancy",
        "Magnetism"
      ],
      "correctIndex": 1,
      "hint": "Recall the mechanical principle on the slide.",
      "explanation": "The exploration introduces the principle of leverage."
    },
    {
      "id": "drummer-robot-05",
      "topic": "assembly-and-connections",
      "learningSlide": 6,
      "prompt": "In the described lever, how does the load arm compare with the effort arm?",
      "choices": [
        "The load arm is shorter",
        "There is no load arm",
        "The load arm is longer",
        "Both arms must have zero length"
      ],
      "correctIndex": 2,
      "hint": "Consider which arm travels farther in this arrangement.",
      "explanation": "The lesson says the load/resistance arm is longer than the effort/power arm."
    },
    {
      "id": "drummer-robot-06",
      "topic": "assembly-and-connections",
      "learningSlide": 7,
      "prompt": "What movement should the drumstick beam make?",
      "choices": [
        "Rotate only on a flat table without lifting",
        "Move only sideways without striking",
        "Stay perfectly stationary",
        "Move up and down"
      ],
      "correctIndex": 3,
      "hint": "Imagine the end of a stick as the drum is played.",
      "explanation": "The construction discussion describes a beam moving up and down."
    },
    {
      "id": "drummer-robot-07",
      "topic": "rhythm-programming",
      "learningSlide": 17,
      "prompt": "Where is the drummer's motor connected?",
      "choices": [
        "Controller port A",
        "Controller port 4 only",
        "Audio output",
        "Charging port"
      ],
      "correctIndex": 0,
      "hint": "Recall the motor port in the construction stage.",
      "explanation": "The source says to connect the motor to port A."
    },
    {
      "id": "drummer-robot-08",
      "topic": "rhythm-programming",
      "learningSlide": 17,
      "prompt": "Which ports connect the emotion screen?",
      "choices": [
        "The motor axle",
        "Ports 1 and 2",
        "Ports A and B",
        "Only the charging port"
      ],
      "correctIndex": 1,
      "hint": "Look for the two numbered ports on the slide.",
      "explanation": "The emotion screen is connected to controller ports 1 and 2."
    },
    {
      "id": "drummer-robot-09",
      "topic": "speed-and-expressions",
      "learningSlide": 18,
      "prompt": "What is shown on the emotion screen during the first rhythm task?",
      "choices": [
        "A map of the world",
        "A battery error",
        "A smiling face",
        "A number countdown"
      ],
      "correctIndex": 2,
      "hint": "Recall the expression requested alongside four rhythms.",
      "explanation": "Task 1 asks the robot to display a smiling face."
    },
    {
      "id": "drummer-robot-10",
      "topic": "speed-and-expressions",
      "learningSlide": 20,
      "prompt": "Which speed pattern is used for the drummer's next task?",
      "choices": [
        "Fast, then off, then reverse",
        "Only the same high speed",
        "Fast, then medium, then slow",
        "Slow, then medium, then fast"
      ],
      "correctIndex": 3,
      "hint": "Think about how the rhythm changes in the exercise.",
      "explanation": "The lesson directs slow, medium and fast drumming in sequence, two seconds each."
    }
  ]
};
