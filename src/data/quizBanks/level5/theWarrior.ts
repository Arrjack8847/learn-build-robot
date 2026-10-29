/** Questions checked against the official 21-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const theWarriorBank: QuizBank = {
  "projectId": "level-5-the-warrior",
  "title": "The Warrior",
  "sourcePdfPath": "public/Level 5/Learning/Action-Oriented/The Warrior/22. The Warrior-Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "level-5-the-warrior-01",
      "topic": "arm-motion",
      "learningSlide": 8,
      "prompt": "What path does the lesson describe for the modeled sword-swinging action?",
      "choices": [
        "An arc rather than a straight vertical line",
        "A horizontal rail that never curves",
        "A perfect circle of the whole robot base",
        "An unmoving arm"
      ],
      "correctIndex": 0,
      "hint": "Think about how an arm swings around a shoulder.",
      "explanation": "Slide 8 describes the action as an arc and proposes simulating it using a gear-connected turntable."
    },
    {
      "id": "level-5-the-warrior-02",
      "topic": "arm-motion",
      "learningSlide": 9,
      "prompt": "What mechanism rotates the robot's shoulder in the classroom model?",
      "choices": [
        "A laser beam from a phone",
        "A turntable driving a gear",
        "A barometric sensor connected to a speaker",
        "A sliding screen with no motor"
      ],
      "correctIndex": 1,
      "hint": "The motion uses rotating mechanical parts.",
      "explanation": "Slide 9 explains that the turntable drives a gear to rotate the shoulder and move the arm."
    },
    {
      "id": "level-5-the-warrior-03",
      "topic": "ultrasonic-patrol",
      "learningSlide": 11,
      "prompt": "Which two behaviors should the completed warrior robot demonstrate?",
      "choices": [
        "Measuring humidity and playing music",
        "Recognizing QR codes and opening a turnstile",
        "Patrolling in circles and moving its arm when a target is detected",
        "Flying and measuring cloud height"
      ],
      "correctIndex": 2,
      "hint": "The model first patrols and then reacts to an obstacle.",
      "explanation": "Slide 11 sets the goal of moving in circles and wielding the modeled sword when a target is detected."
    },
    {
      "id": "level-5-the-warrior-04",
      "topic": "ultrasonic-patrol",
      "learningSlide": 12,
      "prompt": "What sensor value tells the robot when an obstacle is close during patrol?",
      "choices": [
        "Barometric pressure reading",
        "A QR tag-code value",
        "A temperature color code",
        "Ultrasonic distance reading"
      ],
      "correctIndex": 3,
      "hint": "The program needs to know how far away an object is.",
      "explanation": "Slide 12 says the robot judges an ultrasonic reading to decide when to activate the arm."
    },
    {
      "id": "level-5-the-warrior-05",
      "topic": "arm-program",
      "learningSlide": 13,
      "prompt": "Into which two actions does the lesson divide the arm movement?",
      "choices": [
        "Raise the arm, then lower it in the simulated swing",
        "Move the whole robot forward, then move backward only",
        "Turn the wheels on and switch lights off",
        "Scan a QR code, then read humidity"
      ],
      "correctIndex": 0,
      "hint": "The activity follows two stages of motion.",
      "explanation": "Slide 13 divides the action into raising the sword and then bringing it down."
    },
    {
      "id": "level-5-the-warrior-06",
      "topic": "arm-program",
      "learningSlide": 13,
      "prompt": "What pause is specified between the arm movement stages?",
      "choices": [
        "2 hours",
        "0.5 seconds",
        "5 minutes",
        "30 seconds"
      ],
      "correctIndex": 1,
      "hint": "The slide gives a short half-second interval.",
      "explanation": "Slide 13 specifies a 0.5-second interval in the two-part arm movement."
    },
    {
      "id": "level-5-the-warrior-07",
      "topic": "drive-control",
      "learningSlide": 14,
      "prompt": "Which two motor labels are used to control movement?",
      "choices": [
        "X and Y sensor coordinates",
        "A and B temperature sensors",
        "M1 and M2",
        "P8 and P9"
      ],
      "correctIndex": 2,
      "hint": "They are the two motor-control parameters.",
      "explanation": "Slide 14 names M1 and M2 as the two motor rotation parameters."
    },
    {
      "id": "level-5-the-warrior-08",
      "topic": "drive-control",
      "learningSlide": 15,
      "prompt": "How does the example make the warrior robot move slowly in a circle?",
      "choices": [
        "Stop both motors permanently",
        "Make both wheels vanish",
        "Use only a camera and no drive motors",
        "Set the two drive motors to different speeds"
      ],
      "correctIndex": 3,
      "hint": "Different wheel speeds cause a gradual turn.",
      "explanation": "Slide 15 says to use different motor speeds for slow circular patrol."
    },
    {
      "id": "level-5-the-warrior-09",
      "topic": "safety-and-balance",
      "learningSlide": 15,
      "prompt": "What should the robot's driving motors do while it performs the arm swing?",
      "choices": [
        "Stop moving until the swing is complete",
        "Accelerate without limit",
        "Ignore nearby objects",
        "Reverse continuously at maximum speed"
      ],
      "correctIndex": 0,
      "hint": "The program separates patrolling from the arm action.",
      "explanation": "Slide 15 instructs the robot to stop moving while wielding the sword and resume afterward."
    },
    {
      "id": "level-5-the-warrior-10",
      "topic": "safety-and-balance",
      "learningSlide": 19,
      "prompt": "How does the extension suggest improving the model's stability during repeated arm motion?",
      "choices": [
        "Disable every mechanical joint",
        "Adjust the center of gravity or support-wheel position",
        "Raise the center of gravity without testing",
        "Remove all supports from the robot"
      ],
      "correctIndex": 1,
      "hint": "A moving arm changes the model's balance.",
      "explanation": "Slide 19 suggests changing the center of gravity or training-wheel positions to keep the robot balanced."
    }
  ]
};
