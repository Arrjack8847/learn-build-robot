/** Verified against public/Level 2/Learning/Foundational Robots/Tightrope walk.pdf (14 pages); slide numbers are 1-based. */
import type { QuizBank } from "../../quizStudio";
export const tightropeWalkBank: QuizBank = {
  "projectId": "level-2-tightrope-walk",
  "title": "Tightrope walk",
  "sourcePdfPath": "public/Level 2/Learning/Foundational Robots/Tightrope walk.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "tw01",
      "topic": "tightrope-task",
      "learningSlide": 3,
      "prompt": "What is the challenge of a tightrope performer?",
      "choices": [
        "Lifting a heavy cargo box",
        "Projecting pictures on a wall",
        "Steering a racing car",
        "Keeping balance on a narrow rope"
      ],
      "correctIndex": 3,
      "explanation": "Slide 3 introduces the narrow-rope balancing act.",
      "hint": "Think about avoiding a fall."
    },
    {
      "id": "tw02",
      "topic": "tightrope-task",
      "learningSlide": 3,
      "prompt": "What does the clown in the lesson carry while walking?",
      "choices": [
        "A long stick",
        "A large screen",
        "A propeller",
        "A bucket"
      ],
      "correctIndex": 0,
      "explanation": "The introduction shows the performer with a long balance stick.",
      "hint": "The object is held across the body."
    },
    {
      "id": "tw03",
      "topic": "balance-aids",
      "learningSlide": 4,
      "prompt": "Why does the tightrope walker hold a long stick?",
      "choices": [
        "To light the stage",
        "To help maintain balance",
        "To generate electricity",
        "To measure humidity"
      ],
      "correctIndex": 1,
      "explanation": "Slide 4 explicitly identifies the stick as a balancing aid.",
      "hint": "What problem would the performer face without it?"
    },
    {
      "id": "tw04",
      "topic": "balance-aids",
      "learningSlide": 4,
      "prompt": "Which human movement does the exploration compare to using the long stick?",
      "choices": [
        "Jumping in place",
        "Running faster",
        "Stretching both arms outward",
        "Closing both eyes"
      ],
      "correctIndex": 2,
      "explanation": "The lesson says spreading the arms can also aid balance.",
      "hint": "Imagine balancing on one foot."
    },
    {
      "id": "tw05",
      "topic": "center-of-gravity",
      "learningSlide": 5,
      "prompt": "What does the lesson say the balancing stick helps adjust?",
      "choices": [
        "The motor's voltage rating",
        "The speaker volume",
        "The wheel tread",
        "The center of gravity"
      ],
      "correctIndex": 3,
      "explanation": "Slide 5 connects the stick with adjusting the center of gravity.",
      "hint": "Think about where weight is distributed."
    },
    {
      "id": "tw06",
      "topic": "center-of-gravity",
      "learningSlide": 5,
      "prompt": "Which stick does the lesson recommend for a useful balancing effect?",
      "choices": [
        "One heavy enough to influence balance",
        "An extremely light decorative straw",
        "A stick with no mass",
        "A stick that never moves"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 says the stick must have sufficient weight rather than be very light.",
      "hint": "Consider whether the stick affects weight distribution."
    },
    {
      "id": "tw07",
      "topic": "bevel-transmission",
      "learningSlide": 6,
      "prompt": "What transmission is used to mount and drive the clown's motor arrangement?",
      "choices": [
        "A solar cell",
        "Bevel gears",
        "A rope-only elevator",
        "Hydraulic pistons"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 explicitly specifies bevel-gear transmission.",
      "hint": "Which gear mechanism can change motion direction?"
    },
    {
      "id": "tw08",
      "topic": "bevel-transmission",
      "learningSlide": 6,
      "prompt": "Why does the model need a transmission structure?",
      "choices": [
        "To turn a battery into a lens",
        "To measure wind speed",
        "To pass motor motion into the moving model",
        "To replace all supports"
      ],
      "correctIndex": 2,
      "explanation": "The bevel-gear structure links motor motion to the clown mechanism.",
      "hint": "Think about how the motor's rotation reaches the model."
    },
    {
      "id": "tw09",
      "topic": "expression-programming",
      "learningSlide": 11,
      "prompt": "What is asked in the first coding task?",
      "choices": [
        "Make the clown fly",
        "Make the clown drive a truck",
        "Make the clown measure distance",
        "Make the clown move and show different expressions"
      ],
      "correctIndex": 3,
      "explanation": "Slide 11 specifies movement and changing facial expressions.",
      "hint": "Which behaviors are programmed together?"
    },
    {
      "id": "tw10",
      "topic": "expression-programming",
      "learningSlide": 12,
      "prompt": "In the second task, when should the expressions change?",
      "choices": [
        "While the clown walks the tightrope",
        "Only after all movement stops",
        "Only when the battery is unplugged",
        "While the robot is underwater"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 combines expression changes with tightrope walking.",
      "hint": "Pay attention to whether both actions occur together."
    }
  ]
};
