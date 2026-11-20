/** Verified against the Level 2 Bee Learning PDF's 20 pages (text-supported facts). */
import type { QuizBank } from "../../quizStudio";

export const beeBank: QuizBank = {
  "projectId": "level-2-bee",
  "title": "Bee",
  "sourcePdfPath": "public/Level 2/Learning/Biomimicry/Bee.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "bee-01",
      "topic": "bee-lifecycle",
      "learningSlide": 2,
      "prompt": "In which seasons does the lesson say bees actively work?",
      "choices": [
        "Spring, summer and autumn",
        "Winter and spring only",
        "Summer and winter only",
        "Autumn and winter only"
      ],
      "correctIndex": 0,
      "hint": "Recall when plants are most active and flowers are available.",
      "explanation": "Slide 2 says bees work during spring, summer and autumn and rest in winter."
    },
    {
      "id": "bee-02",
      "topic": "bee-lifecycle",
      "learningSlide": 3,
      "prompt": "Which three types of honeybees make up a colony in the lesson?",
      "choices": [
        "Workers, queens and drones",
        "Queens, butterflies and drones",
        "Drones, ants and workers",
        "Workers, beetles and queens"
      ],
      "correctIndex": 0,
      "hint": "A colony has different bee roles rather than different insect species.",
      "explanation": "Slide 3 identifies queen bees, worker bees and drones as the colony's three bee types."
    },
    {
      "id": "bee-03",
      "topic": "gear-reduction",
      "learningSlide": 5,
      "prompt": "When a small driving gear turns a large driven gear, what happens to the driven gear's speed?",
      "choices": [
        "It decreases",
        "It increases",
        "It stays unchanged",
        "It cannot turn"
      ],
      "correctIndex": 0,
      "hint": "Compare how many teeth each gear must move for a complete turn.",
      "explanation": "Slide 5 says a small driving gear turning a large driven gear reduces the large gear's speed."
    },
    {
      "id": "bee-04",
      "topic": "gear-reduction",
      "learningSlide": 5,
      "prompt": "What happens to torque when the lesson's small gear drives a larger gear?",
      "choices": [
        "Torque decreases",
        "Torque increases",
        "Torque becomes zero",
        "Torque is unaffected by gear size"
      ],
      "correctIndex": 1,
      "hint": "Think about the trade-off between turning speed and turning force.",
      "explanation": "Slide 5 states that this gear reduction increases torque while decreasing speed."
    },
    {
      "id": "bee-05",
      "topic": "infrared-detection",
      "learningSlide": 6,
      "prompt": "Which device does the Bee Robot lesson use to detect an obstacle ahead?",
      "choices": [
        "Infrared sensor",
        "Touch sensor",
        "Temperature sensor",
        "Sound sensor"
      ],
      "correctIndex": 0,
      "hint": "Find the component that allows sensing without physical contact.",
      "explanation": "Slide 6 explains that an infrared sensor can detect obstacles in front of the robot."
    },
    {
      "id": "bee-06",
      "topic": "infrared-detection",
      "learningSlide": 14,
      "prompt": "Which programming module does the lesson use to decide whether the bee has landed on a flower?",
      "choices": [
        "If condition",
        "Play sound",
        "Set text color",
        "Draw a circle"
      ],
      "correctIndex": 0,
      "hint": "The robot needs to choose an action based on a detected condition.",
      "explanation": "Slide 14 instructs students to use an 'if' module to determine whether the robot has landed on a flower."
    },
    {
      "id": "bee-07",
      "topic": "assembly-ports",
      "learningSlide": 11,
      "prompt": "Which controller port should the Bee Robot's motor connect to?",
      "choices": [
        "Port A",
        "Port 1",
        "Port 3",
        "Port D"
      ],
      "correctIndex": 0,
      "hint": "The lesson uses lettered and numbered connections for different components.",
      "explanation": "Slide 11 explicitly says to connect the motor to Port A."
    },
    {
      "id": "bee-08",
      "topic": "assembly-ports",
      "learningSlide": 11,
      "prompt": "Which port should the Bee Robot's infrared sensor connect to?",
      "choices": [
        "Port B",
        "Port 2",
        "Port 1",
        "Port C"
      ],
      "correctIndex": 2,
      "hint": "Look for the numbered connector assigned to the detecting component.",
      "explanation": "Slide 11 explicitly says to connect the infrared sensor to Port 1."
    },
    {
      "id": "bee-09",
      "topic": "programming-behavior",
      "learningSlide": 16,
      "prompt": "How long does the lesson challenge students to keep the bee on a flower each time it lands?",
      "choices": [
        "One second",
        "Two seconds",
        "Three seconds",
        "Five seconds"
      ],
      "correctIndex": 1,
      "hint": "Focus on the brief timed pause requested on the coding slide.",
      "explanation": "Slide 16 asks students to make the bee stay on a flower for two seconds."
    },
    {
      "id": "bee-10",
      "topic": "programming-behavior",
      "learningSlide": 19,
      "prompt": "Besides turning one or two motors, which output does the lesson's project summary say the controller can produce?",
      "choices": [
        "Sound",
        "Water spray",
        "Printed paper",
        "Heated air"
      ],
      "correctIndex": 0,
      "hint": "Recall the additional controller ability named in the lesson summary.",
      "explanation": "Slide 19 says students can control single and double motor rotation and make sound with the controller."
    }
  ]
};
