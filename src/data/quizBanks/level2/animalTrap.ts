/** Source-checked against the official Level 2 Learning PDF, including illustrated pages. */
import type { QuizBank } from "../../quizStudio";

export const animalTrapBank: QuizBank = {
  "projectId": "level-2-animal-trap",
  "title": "Animal Trap",
  "sourcePdfPath": "public/Level 2/Learning/Mechanisms and Concepts/Animal trap.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "at01",
      "topic": "traps-and-food",
      "learningSlide": 3,
      "prompt": "Before supermarkets were common, which activity did the lesson show people using to obtain food?",
      "choices": [
        "Tracking satellites",
        "Fishing and hunting",
        "Typing on computers",
        "Printing photographs"
      ],
      "correctIndex": 1,
      "hint": "Think about the ways people obtained meat long ago.",
      "explanation": "Slide 3 shows fishing, hunting and traps as earlier ways to obtain food."
    },
    {
      "id": "at02",
      "topic": "traps-and-food",
      "learningSlide": 4,
      "prompt": "Where does the lesson suggest setting a trap?",
      "choices": [
        "Where prey often appears",
        "At the highest point of a roof",
        "Anywhere without checking",
        "Inside a locked classroom"
      ],
      "correctIndex": 0,
      "hint": "Consider where the animal is likely to travel.",
      "explanation": "Slide 4 says to place a trap where the prey often appears and use food as bait."
    },
    {
      "id": "at03",
      "topic": "spring-trigger",
      "learningSlide": 5,
      "prompt": "What makes the mechanical trap in the example close around its prey?",
      "choices": [
        "A screen changing color",
        "A spring mechanism triggered by contact",
        "A wheel rolling downhill",
        "A loudspeaker playing music"
      ],
      "correctIndex": 1,
      "hint": "Look at what happens once the pictured trap is touched.",
      "explanation": "Slide 5 explains that contact triggers a spring mechanism, which clamps the trap."
    },
    {
      "id": "at04",
      "topic": "spring-trigger",
      "learningSlide": 5,
      "prompt": "Why does the trap need to close quickly after it is triggered?",
      "choices": [
        "To make the trap brighter",
        "To recharge its controller",
        "To help prevent the prey from escaping",
        "To make the gears disappear"
      ],
      "correctIndex": 2,
      "hint": "Think about what could happen if the jaws moved slowly.",
      "explanation": "Slide 5 lists quick jaw closure as a key requirement for catching prey."
    },
    {
      "id": "at05",
      "topic": "gear-acceleration",
      "learningSlide": 6,
      "prompt": "A large gear turns a smaller gear. According to the lesson, what happens to the smaller gear?",
      "choices": [
        "It always stops",
        "It spins faster",
        "It stores water",
        "It becomes larger"
      ],
      "correctIndex": 1,
      "hint": "Compare how the teeth of different-sized gears move.",
      "explanation": "Slide 6 explains that when a big gear drives a pinion, the pinion turns quickly."
    },
    {
      "id": "at06",
      "topic": "gear-acceleration",
      "learningSlide": 6,
      "prompt": "Why is a large-gear-to-small-gear arrangement useful for this robot?",
      "choices": [
        "It makes the trap close quickly",
        "It replaces the infrared sensor",
        "It provides a place to store food",
        "It removes the need for any moving parts"
      ],
      "correctIndex": 0,
      "hint": "Think about which part must move fast after the trigger.",
      "explanation": "Slide 6 applies gear acceleration to make the trap's gripping movement fast."
    },
    {
      "id": "at07",
      "topic": "clip-construction",
      "learningSlide": 7,
      "prompt": "What are the clip or jaw pieces made from in the proposed robot?",
      "choices": [
        "Sheets of paper",
        "Only rubber bands",
        "Connecting beams",
        "Glass panels"
      ],
      "correctIndex": 2,
      "hint": "Look at the pictured orange pieces used to build the clip.",
      "explanation": "Slide 7 says beams can be used to build the trap's clips."
    },
    {
      "id": "at08",
      "topic": "clip-construction",
      "learningSlide": 7,
      "prompt": "Which parts must be linked to the clip to make it move?",
      "choices": [
        "The axle and power structure",
        "A painting and a window",
        "A microphone and headphones",
        "A solar panel and a kite"
      ],
      "correctIndex": 0,
      "hint": "Think about what transfers movement into the gripping pieces.",
      "explanation": "Slide 7 directs students to connect the axle structure, clip and power structure before adding the motor and controller."
    },
    {
      "id": "at09",
      "topic": "sensor-control",
      "learningSlide": 17,
      "prompt": "Which sensor does the lesson use to detect an object at the trap?",
      "choices": [
        "Humidity sensor",
        "Temperature sensor",
        "Infrared sensor",
        "Compass"
      ],
      "correctIndex": 2,
      "hint": "Look at the evaluation slide about detecting nearby objects.",
      "explanation": "Slide 17 identifies the infrared sensor and explains that it informs the controller when an object is in front of it."
    },
    {
      "id": "at10",
      "topic": "sensor-control",
      "learningSlide": 15,
      "prompt": "What does the example program make the motor do when the infrared sensor detects an obstacle?",
      "choices": [
        "Turn to close the trap",
        "Play a welcome message only",
        "Switch off the whole robot permanently",
        "Ignore the sensor"
      ],
      "correctIndex": 0,
      "hint": "Follow the 'if obstacle detected' branch on the coding slide.",
      "explanation": "Slide 15 shows an obstacle-detection condition that activates Motor A to clamp the trap; its other branch stops the motor."
    }
  ]
};
