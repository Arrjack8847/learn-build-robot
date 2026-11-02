import type { QuizBank } from "../../quizStudio";
/** Verified against the 14-slide Chimpanzees Learning PDF. */
export const chimpanzeesBank: QuizBank = {
  "projectId": "level-2-chimpanzees",
  "title": "Chimpanzees",
  "sourcePdfPath": "public/Level 2/Learning/Biomimicry/Chimpanzees.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "ch1",
      "topic": "animal-movement",
      "learningSlide": 4,
      "prompt": "How does the lesson describe the way chimpanzees walk?",
      "choices": [
        "On all fours",
        "Using wheels",
        "Only on their tails",
        "Using wings"
      ],
      "correctIndex": 0,
      "hint": "Picture how a primate supports itself when moving.",
      "explanation": "Slide 4 says chimpanzees walk on all fours."
    },
    {
      "id": "ch2",
      "topic": "animal-movement",
      "learningSlide": 3,
      "prompt": "How does the lesson describe the evolutionary relationship between chimpanzees and humans?",
      "choices": [
        "They share a common ancestor",
        "Chimpanzees were built as robots",
        "They are different types of birds",
        "They evolved from today's monkeys separately"
      ],
      "correctIndex": 0,
      "hint": "Consider a family tree with branching lines.",
      "explanation": "Slide 3 describes humans and chimpanzees sharing an evolutionary ancestor."
    },
    {
      "id": "ch3",
      "topic": "motor-and-joints",
      "learningSlide": 5,
      "prompt": "What form of motion does the robot's motor initially provide?",
      "choices": [
        "Rotation",
        "Only vertical sliding",
        "No motion",
        "Only vibration"
      ],
      "correctIndex": 0,
      "hint": "A motor has a spinning shaft.",
      "explanation": "Slide 5 introduces the motor's rotating motion."
    },
    {
      "id": "ch4",
      "topic": "motor-and-joints",
      "learningSlide": 6,
      "prompt": "Which mechanism makes a motor's rotation act like a walking limb?",
      "choices": [
        "Crank-rocker",
        "Hydraulic cylinder",
        "Loudspeaker",
        "Optical shutter"
      ],
      "correctIndex": 0,
      "hint": "The lesson changes circular motion into back-and-forth motion.",
      "explanation": "Slide 6 identifies the crank-rocker mechanism."
    },
    {
      "id": "ch5",
      "topic": "motion-transmission",
      "learningSlide": 6,
      "prompt": "What kind of motion can the crank-rocker mechanism produce?",
      "choices": [
        "Up-and-down or side-to-side",
        "Only straight forward",
        "Only light pulses",
        "Only air currents"
      ],
      "correctIndex": 0,
      "hint": "Think of how an animal's legs swing during walking.",
      "explanation": "Slide 6 states the mechanism can create vertical or sideways motion."
    },
    {
      "id": "ch6",
      "topic": "motion-transmission",
      "learningSlide": 6,
      "prompt": "Which gear structure is reviewed in construction?",
      "choices": [
        "Bevel-gear transmission",
        "Water-pump chain",
        "Fan-blade transmission",
        "Bicycle brake linkage"
      ],
      "correctIndex": 0,
      "hint": "Look for the gearing topic mentioned in the construction introduction.",
      "explanation": "Slide 6 names bevel gear transmission."
    },
    {
      "id": "ch7",
      "topic": "timing-and-loops",
      "learningSlide": 11,
      "prompt": "Which movement sequence is required in the first programming task?",
      "choices": [
        "Walk, rest, repeat",
        "Walk once then power off",
        "Only rest forever",
        "Run a camera scan without motion"
      ],
      "correctIndex": 0,
      "hint": "The sequence combines activity and a pause.",
      "explanation": "Slide 11 asks for walking a few seconds, resting a few seconds, and repeating."
    },
    {
      "id": "ch8",
      "topic": "timing-and-loops",
      "learningSlide": 11,
      "prompt": "After the pause in the first programming task, what happens next?",
      "choices": [
        "The walking cycle begins again",
        "The robot is permanently disabled",
        "All motors disconnect",
        "The robot stops for the rest of the lesson"
      ],
      "correctIndex": 0,
      "hint": "The lesson specifically requests repetition.",
      "explanation": "Slide 11 says the walking and resting actions repeat."
    },
    {
      "id": "ch9",
      "topic": "obstacle-control",
      "learningSlide": 12,
      "prompt": "Which input device is added to detect an obstacle ahead?",
      "choices": [
        "Infrared sensor",
        "Humidity sensor",
        "Temperature probe",
        "Pressure gauge"
      ],
      "correctIndex": 0,
      "hint": "A noncontact sensor can detect something in the path.",
      "explanation": "Slide 12 asks students to install an infrared sensor."
    },
    {
      "id": "ch10",
      "topic": "obstacle-control",
      "learningSlide": 12,
      "prompt": "What should happen when the chimpanzee robot detects an object in front of it?",
      "choices": [
        "Stop walking",
        "Speed up without limit",
        "Ignore the obstacle",
        "Detach the controller"
      ],
      "correctIndex": 0,
      "hint": "Consider how to avoid bumping into the object.",
      "explanation": "Slide 12 instructs the robot to stop when an obstacle is detected."
    }
  ]
};
