/** Source text validated against the official Level 2 Push ups PDF (20 pages). */
import type { QuizBank } from "../../quizStudio";

export const pushUpsBank: QuizBank = {
  "projectId": "level-2-push-ups",
  "title": "Push ups",
  "sourcePdfPath": "public/Level 2/Learning/Action-Oriented/Push ups/Push ups_Powerpoint.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "pu01",
      "topic": "push-up-exercise",
      "learningSlide": 6,
      "prompt": "Which muscle group does the Push-ups lesson particularly emphasize?",
      "choices": [
        "Chest muscles",
        "Calf muscles",
        "Neck muscles",
        "Finger muscles"
      ],
      "correctIndex": 0,
      "hint": "Recall the main body area supporting the exercise.",
      "explanation": "Slide 6 explains that push-ups train upper-limb, waist, and abdominal muscles, especially the chest."
    },
    {
      "id": "pu02",
      "topic": "push-up-exercise",
      "learningSlide": 6,
      "prompt": "What does the lesson describe push-ups as?",
      "choices": [
        "A type of strength training",
        "A breathing sensor test",
        "A gear-size calculation only",
        "A programming language"
      ],
      "correctIndex": 0,
      "hint": "Think of the exercise's role in physical training.",
      "explanation": "Slide 6 describes push-ups as a simple and effective strength-training method."
    },
    {
      "id": "pu03",
      "topic": "lever-mechanics",
      "learningSlide": 9,
      "prompt": "In the lever diagram for push-ups, what does the label O represent?",
      "choices": [
        "Resistance",
        "Power",
        "Fulcrum",
        "Short arm"
      ],
      "correctIndex": 2,
      "hint": "Look for the reference point around which the lever acts.",
      "explanation": "Slide 9 explicitly labels O as the fulcrum."
    },
    {
      "id": "pu04",
      "topic": "lever-mechanics",
      "learningSlide": 9,
      "prompt": "What force is represented by G in the lesson's push-up lever diagram?",
      "choices": [
        "Gravity acting on the body",
        "Motor rotation",
        "Air pressure",
        "Electrical resistance"
      ],
      "correctIndex": 0,
      "hint": "Recall the load that works against the push-up motion.",
      "explanation": "Slide 9 identifies G as resistance from the body's gravity."
    },
    {
      "id": "pu05",
      "topic": "repeated-movement",
      "learningSlide": 10,
      "prompt": "Which device's motion is given as an example of mechanical reciprocation?",
      "choices": [
        "Piston",
        "Stationary wall",
        "Solar panel",
        "Printed book"
      ],
      "correctIndex": 0,
      "hint": "Think of machinery that repeatedly moves forward and back.",
      "explanation": "Slide 10 gives piston movement as an example of mechanical reciprocating motion."
    },
    {
      "id": "pu06",
      "topic": "repeated-movement",
      "learningSlide": 10,
      "prompt": "What describes the reciprocating mechanical movement discussed in the lesson?",
      "choices": [
        "Repeated back-and-forth strokes",
        "One unchanging stationary position",
        "Only a single unrepeatable motion",
        "A random movement with no cycle"
      ],
      "correctIndex": 0,
      "hint": "Compare the motion in a piston or pendulum to a one-time action.",
      "explanation": "Slide 10 discusses the positive and negative strokes of reciprocating cycles and gives pendulums and pistons as examples."
    },
    {
      "id": "pu07",
      "topic": "model-assembly",
      "learningSlide": 12,
      "prompt": "Which requirement does the Push-up Robot assembly checklist include?",
      "choices": [
        "Stable structure",
        "Disconnect the joints",
        "Make the model fall easily",
        "Avoid connecting the supports"
      ],
      "correctIndex": 0,
      "hint": "Think about what allows the model to move without collapsing.",
      "explanation": "Slide 12 lists a stable structure as an assembly requirement."
    },
    {
      "id": "pu08",
      "topic": "model-assembly",
      "learningSlide": 12,
      "prompt": "What should the completed Push-up Robot's shape do according to the checklist?",
      "choices": [
        "Match the intended design",
        "Ignore the planned model",
        "Always use extra wheels",
        "Depend only on the battery case"
      ],
      "correctIndex": 0,
      "hint": "Compare the finished model with the lesson's design.",
      "explanation": "Slide 12 lists shape matching among the assembly requirements."
    },
    {
      "id": "pu09",
      "topic": "loop-programming",
      "learningSlide": 2,
      "prompt": "Which programming module is identified as the main learning goal for Push-up Robot?",
      "choices": [
        "Loop module",
        "Camera recognition module",
        "Text formatting module",
        "Wireless GPS module"
      ],
      "correctIndex": 0,
      "hint": "Think about which kind of control helps repeat a robot's exercise.",
      "explanation": "Slide 2 identifies the loop module and its application as the knowledge goal."
    },
    {
      "id": "pu10",
      "topic": "loop-programming",
      "learningSlide": 16,
      "prompt": "How many push-ups should the robot repeat in the second programming task?",
      "choices": [
        "5",
        "10",
        "20",
        "30"
      ],
      "correctIndex": 1,
      "hint": "Read the repetition count requested by the middle programming challenge.",
      "explanation": "Slide 16 explicitly says the push-up robot repeats 10 push-ups."
    }
  ]
};
