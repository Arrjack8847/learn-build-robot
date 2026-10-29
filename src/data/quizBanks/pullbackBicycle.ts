/** Phase 3 source-text questions. Manual diagram and educational QA still required. */
import type { QuizBank } from "../quizStudio";
export const pullbackBicycleBank: QuizBank = {
  "projectId": "pullback-bicycle",
  "title": "Pullback Bicycle",
  "sourcePdfPath": "public/Pullback Bicycle.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "pullback-bicycle-01",
      "topic": "project-goal",
      "prompt": "What is the special challenge explored with the pullback bicycle?",
      "choices": [
        "Making a toy bicycle move without pedaling",
        "Making a boat float",
        "Making a bird fly",
        "Making a lamp change colour"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "hint": "Remember what makes this bicycle different from one that must be pedaled.",
      "explanation": "The introduction asks how a bicycle can move without pedaling."
    },
    {
      "id": "pullback-bicycle-02",
      "topic": "project-goal",
      "prompt": "Which other toys are discussed as examples of movement without continuous pedaling?",
      "choices": [
        "Paper fans",
        "Pullback toy vehicles",
        "Toy telescopes",
        "Picture frames"
      ],
      "correctIndex": 1,
      "learningSlide": 4,
      "hint": "Recall the other small wheeled toys students are asked to compare.",
      "explanation": "The introduction asks students to recall pullback toy vehicles."
    },
    {
      "id": "pullback-bicycle-03",
      "topic": "elastic-force",
      "prompt": "What material supplies the elastic force studied in this model?",
      "choices": [
        "Glass lens",
        "Paper flower",
        "Rubber band",
        "Metal screen"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "hint": "Think about the part that can store energy by being stretched.",
      "explanation": "The objectives identify the elastic force of a rubber band.",
      "image": {
        "src": "/quiz-visuals/level1/pullback-bicycle.svg",
        "alt": "Bicycle wheels and gears with an elastic-band energy schematic."
      }
    },
    {
      "id": "pullback-bicycle-04",
      "topic": "elastic-force",
      "prompt": "Which stored-force concept should students identify in the working model?",
      "choices": [
        "Light refraction",
        "Sound vibration",
        "Magnetic induction",
        "Elastic force"
      ],
      "correctIndex": 3,
      "learningSlide": 5,
      "hint": "Focus on the type of force that a flexible, stretched component provides.",
      "explanation": "The final review focuses on the rubber band's elastic force.",
      "image": {
        "src": "/quiz-visuals/level1/pullback-bicycle.svg",
        "alt": "Bicycle wheels and gears with an elastic-band energy schematic."
      }
    },
    {
      "id": "pullback-bicycle-05",
      "topic": "gear-transmission",
      "prompt": "What mechanism is another major learning objective?",
      "choices": [
        "Gear drive",
        "Optical persistence",
        "Solar heating",
        "Hydraulic braking"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "hint": "Recall which mechanical pieces pass rotation from one part to another.",
      "explanation": "The teaching objectives explicitly list gear-driven mechanisms."
    },
    {
      "id": "pullback-bicycle-06",
      "topic": "gear-transmission",
      "prompt": "Which pair of principles is named as making the bicycle move?",
      "choices": [
        "Sound and a speaker",
        "Rubber-band elasticity and gear drive",
        "Water buoyancy and a sail",
        "Light and a camera"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "hint": "Think about how a stored force and a moving transmission can work together.",
      "explanation": "The presentation combines rubber-band elastic force and gear drive."
    },
    {
      "id": "pullback-bicycle-07",
      "topic": "assembly-parts",
      "prompt": "Which attachment detail receives special emphasis during construction?",
      "choices": [
        "Writing software for a touchscreen",
        "Placing a camera on a tripod",
        "Fixing the rubber band",
        "Charging a motor battery"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "hint": "Remember which elastic part needs a secure connection in the assembly.",
      "explanation": "The key points include fixing the rubber band."
    },
    {
      "id": "pullback-bicycle-08",
      "topic": "assembly-parts",
      "prompt": "Which small connection pieces are explicitly named in the building difficulties?",
      "choices": [
        "LEDs",
        "Microphones",
        "Speakers",
        "Pins"
      ],
      "correctIndex": 3,
      "learningSlide": 3,
      "hint": "Consider the small pieces used to join structural building components.",
      "explanation": "The lesson highlights connecting the pins correctly."
    },
    {
      "id": "pullback-bicycle-09",
      "topic": "reflection",
      "prompt": "Where should students initially draw their pullback bicycle design?",
      "choices": [
        "On the blackboard",
        "On the USB port",
        "On a motor axle",
        "On the printer cable"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "hint": "Think about the first design step students perform before handling components.",
      "explanation": "The topic analysis asks students to design a bicycle on the blackboard."
    },
    {
      "id": "pullback-bicycle-10",
      "topic": "reflection",
      "prompt": "What should students explain when presenting the finished bicycle?",
      "choices": [
        "How an owl moves its wings",
        "How rubber-band force and gears make it move",
        "How a colour screen creates light",
        "How a fan produces airflow"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "hint": "Recall both the source of stored energy and the mechanism that transfers motion.",
      "explanation": "The outcome questions ask how it runs using elastic force and gearing."
    }
  ]
};
