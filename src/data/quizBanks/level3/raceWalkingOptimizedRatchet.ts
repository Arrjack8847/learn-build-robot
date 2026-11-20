/** Level 3 Learning PDF source-checked questions; slide numbers are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const raceWalkingOptimizedRatchetBank: QuizBank = {
  "projectId": "level-3-race-walking-optimized-ratchet",
  "title": "Race Walking — Optimized Ratchet",
  "sourcePdfPath": "public/Level 3/Learning/Display & Movement/Race Walking/1. Race Walking - Slides.pdf",
  "sourcePageCount": 29,
  "questions": [
    {
      "id": "racewalking-01",
      "topic": "race-walking",
      "learningSlide": 4,
      "prompt": "Which rule distinguishes race walking from running in the lesson?",
      "choices": [
        "Maintain contact with the ground while the legs alternate",
        "Allow both feet to leave the ground on every stride",
        "Keep both legs still between strides",
        "Use only one leg to move forward"
      ],
      "correctIndex": 0,
      "hint": "Consider how the athlete's feet meet the ground.",
      "explanation": "Slide 4 describes alternating leg steps with uninterrupted contact with the ground."
    },
    {
      "id": "racewalking-02",
      "topic": "race-walking",
      "learningSlide": 2,
      "prompt": "What movement should the lesson's race-walking robot imitate?",
      "choices": [
        "A bicycle's pedal rotation",
        "Human walking posture",
        "A vehicle's steering only",
        "A flying insect's wings"
      ],
      "correctIndex": 1,
      "hint": "The learning objective concerns a specific human motion.",
      "explanation": "Slide 2 asks learners to build a model that imitates human walking posture."
    },
    {
      "id": "racewalking-03",
      "topic": "race-linkage",
      "learningSlide": 6,
      "prompt": "What is the basic planar four-bar linkage made from?",
      "choices": [
        "Two pulleys and a rubber band",
        "One fixed wheel and a sensor",
        "Four connecting rods or components",
        "Six independent motor shafts"
      ],
      "correctIndex": 2,
      "hint": "The name of the mechanism includes its component count.",
      "explanation": "Slide 6 describes a planar four-bar mechanism composed of four connecting rods."
    },
    {
      "id": "racewalking-04",
      "topic": "race-linkage",
      "learningSlide": 7,
      "prompt": "What motion conversion does the linkage help achieve for a walking robot?",
      "choices": [
        "Motor rotation into sound waves",
        "Leg swing into a light reading",
        "Steering into screen brightness",
        "Motor rotation into back-and-forth leg swing"
      ],
      "correctIndex": 3,
      "hint": "Think about how continuous motor motion can move a robot leg.",
      "explanation": "Slide 7 says a linkage can convert rotation into reciprocating leg swing."
    },
    {
      "id": "racewalking-05",
      "topic": "race-building",
      "learningSlide": 9,
      "prompt": "Which support is shown in the walking robot building instructions?",
      "choices": [
        "Training wheels",
        "A boat hull",
        "A suspended cable",
        "A rotating camera mast"
      ],
      "correctIndex": 0,
      "hint": "The model needs help remaining balanced during steps.",
      "explanation": "Slide 9 lists training wheels in the robot build."
    },
    {
      "id": "racewalking-06",
      "topic": "race-building",
      "learningSlide": 10,
      "prompt": "What does the first programming task ask the walking robot to start together?",
      "choices": [
        "Two ultrasonic sensors",
        "Two motors",
        "Two displays",
        "Two speakers"
      ],
      "correctIndex": 1,
      "hint": "The aim is coordinated movement of two driving parts.",
      "explanation": "Slide 10 directs students to start two motors at the same time."
    },
    {
      "id": "racewalking-07",
      "topic": "race-ultrasonic",
      "learningSlide": 14,
      "prompt": "How does the ultrasonic sensor determine distance to an object?",
      "choices": [
        "By comparing the object's surface color",
        "By weighing the object",
        "Using the time difference of returning sound echoes",
        "By checking the wheel axle speed"
      ],
      "correctIndex": 2,
      "hint": "Think about a signal traveling out and returning.",
      "explanation": "Slide 14 explains that an ultrasonic sensor measures distance using echo timing."
    },
    {
      "id": "racewalking-08",
      "topic": "race-ultrasonic",
      "learningSlide": 16,
      "prompt": "Where should the robot display an ultrasonic reading during the sensor test?",
      "choices": [
        "On a printed paper label",
        "On its rubber wheels",
        "On the motor shaft",
        "On the controller screen"
      ],
      "correctIndex": 3,
      "hint": "This task is a program-based sensor check.",
      "explanation": "Slide 16 asks students to display the ultrasonic value on the controller screen."
    },
    {
      "id": "racewalking-09",
      "topic": "race-ratchet",
      "learningSlide": 17,
      "prompt": "What does a ratchet mechanism convert motion into?",
      "choices": [
        "Unidirectional step motion",
        "Back-and-forth motion of equal distance",
        "Continuous motion in both directions",
        "Vertical movement without any rotation"
      ],
      "correctIndex": 0,
      "hint": "The mechanism is designed to favor a single direction.",
      "explanation": "Slide 17 says the ratchet changes rotation or reciprocating motion into unidirectional step motion."
    },
    {
      "id": "racewalking-10",
      "topic": "race-ratchet",
      "learningSlide": 17,
      "prompt": "Why add a ratchet to the race-walking robot's legs?",
      "choices": [
        "To measure air pressure",
        "To allow movement forward but resist backward leg motion",
        "To make the legs move randomly in both directions",
        "To replace the ultrasonic sensor"
      ],
      "correctIndex": 1,
      "hint": "Think about the direction a walking leg should advance.",
      "explanation": "Slide 17 proposes adding a ratchet so the legs can move forward and not backward."
    }
  ]
};
