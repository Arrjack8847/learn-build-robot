/** Ten Level 5 questions sourced from the official 25-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const chairoplaneBank: QuizBank = {
  "projectId": "level-5-chairoplane",
  "title": "Chairoplane",
  "sourcePdfPath": "public/Level 5/Learning/Mechanisms & Simulators/Chairoplane/27. Chairoplane-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "level-5-chairoplane-01",
      "topic": "flight-history",
      "learningSlide": 6,
      "prompt": "How did Wan Hu hope to lift his chair into the sky, according to the story?",
      "choices": [
        "With rockets and two kites",
        "With a bicycle chain and pulley",
        "With a hot-air balloon and propeller",
        "With a single electric motor"
      ],
      "correctIndex": 0,
      "hint": "Recall the two flight aids in the historical story.",
      "explanation": "Slide 6 describes Wan Hu's rockets attached to his chair and the two kites he held."
    },
    {
      "id": "level-5-chairoplane-02",
      "topic": "flight-history",
      "learningSlide": 5,
      "prompt": "What other name is associated with Tao Chengdao in the lesson?",
      "choices": [
        "Newton",
        "Wan Hu",
        "Zhuge Liang",
        "Galileo"
      ],
      "correctIndex": 1,
      "hint": "Look for his title in the background section.",
      "explanation": "Slide 5 identifies Tao Chengdao as Wan Hu."
    },
    {
      "id": "level-5-chairoplane-03",
      "topic": "ride-motion",
      "learningSlide": 8,
      "prompt": "Around which part do the chairoplane's passenger seats rotate?",
      "choices": [
        "A horizontal road",
        "A pair of rails",
        "A fixed central column",
        "A moving conveyor belt"
      ],
      "correctIndex": 2,
      "hint": "Think about the center of a rotating amusement ride.",
      "explanation": "Slide 8 explains that seats turn around the ride's fixed central column."
    },
    {
      "id": "level-5-chairoplane-04",
      "topic": "ride-motion",
      "learningSlide": 11,
      "prompt": "Which mechanism helps the model seats rotate and move up and down when the motor turns?",
      "choices": [
        "Ratchet-only latch",
        "Rack and pinion steering",
        "Belt-driven conveyor",
        "Crank-rocker mechanism"
      ],
      "correctIndex": 3,
      "hint": "Read the linkage named next to the seat model.",
      "explanation": "Slide 11 identifies a crank-rocker mechanism linking motor rotation to seat movement."
    },
    {
      "id": "level-5-chairoplane-05",
      "topic": "speed-control",
      "learningSlide": 12,
      "prompt": "What happens to the speed while the speed button is held down?",
      "choices": [
        "It gradually increases",
        "It immediately stays at zero",
        "It alternates randomly with no input",
        "It always reverses direction"
      ],
      "correctIndex": 0,
      "hint": "Observe what holding the control is meant to do.",
      "explanation": "Slide 12 specifies that holding the button increases the simulated power or speed."
    },
    {
      "id": "level-5-chairoplane-06",
      "topic": "speed-control",
      "learningSlide": 17,
      "prompt": "At what interval does the release-controlled speed reduction occur?",
      "choices": [
        "Once per full rotation",
        "Every 0.1 second",
        "Every 10 seconds",
        "Only once when released"
      ],
      "correctIndex": 1,
      "hint": "Find the deceleration timing.",
      "explanation": "Slide 17 reduces speed by one point every 0.1 second when the button is not pressed."
    },
    {
      "id": "level-5-chairoplane-07",
      "topic": "direction-control",
      "learningSlide": 14,
      "prompt": "What button action is needed to switch the rotation direction?",
      "choices": [
        "Hold the button indefinitely without release",
        "Disconnect the controller",
        "Press and then release the button",
        "Touch the motor shaft only"
      ],
      "correctIndex": 2,
      "hint": "A complete button action contains two stages.",
      "explanation": "Slide 14 defines the direction-switch action as pressing then releasing a button."
    },
    {
      "id": "level-5-chairoplane-08",
      "topic": "direction-control",
      "learningSlide": 19,
      "prompt": "Why does the Switch Direction function return speed to zero before reversing?",
      "choices": [
        "To switch off every sensor",
        "To erase the initial direction setting",
        "To recharge the battery",
        "To avoid an abrupt reversal at high speed"
      ],
      "correctIndex": 3,
      "hint": "Think about reversing a rapidly moving ride.",
      "explanation": "Slide 19 resets speed before changing direction so the model reverses more reasonably."
    },
    {
      "id": "level-5-chairoplane-09",
      "topic": "program-design",
      "learningSlide": 16,
      "prompt": "What upper speed limit is set in the Adjust Speed function?",
      "choices": [
        "100",
        "10",
        "1",
        "1,000"
      ],
      "correctIndex": 0,
      "hint": "Read the number after 'maximum speed'.",
      "explanation": "Slide 16 caps the speed variable at 100."
    },
    {
      "id": "level-5-chairoplane-10",
      "topic": "program-design",
      "learningSlide": 15,
      "prompt": "What must the main program set at initialization so the rotation direction can operate?",
      "choices": [
        "The passenger's body weight",
        "A nonzero direction value",
        "A permanently zero direction value",
        "An empty motor-port list"
      ],
      "correctIndex": 1,
      "hint": "The slide warns about a value that must not be zero.",
      "explanation": "Slide 15 instructs programmers not to initialize the rotation direction to zero."
    }
  ]
};
