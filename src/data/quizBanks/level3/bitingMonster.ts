/** Text verified against official Level 3 teaching manual (Learning fallback). */
import type { QuizBank } from "../../quizStudio";

export const bitingMonsterBank: QuizBank = {
  "projectId": "level-3-biting-monster",
  "title": "Biting Monster",
  "sourcePdfPath": "public/Biting Monster.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "bitingmonster-01",
      "topic": "theme",
      "learningSlide": 4,
      "prompt": "Which festival provides the theme for the biting monster lesson?",
      "choices": [
        "New Year's Day",
        "Halloween",
        "A bicycle race",
        "A robotics moon mission"
      ],
      "correctIndex": 1,
      "hint": "The lesson uses a festival as the design theme.",
      "explanation": "Page 4 introduces Halloween before the skull-monster task."
    },
    {
      "id": "bitingmonster-02",
      "topic": "theme",
      "learningSlide": 4,
      "prompt": "Which Halloween phrase is discussed in the introduction?",
      "choices": [
        "Ready, set, go",
        "Stop the motor",
        "Trick or Treat",
        "Open the curtains"
      ],
      "correctIndex": 2,
      "hint": "The lesson uses a festival as the design theme.",
      "explanation": "Page 4 mentions children asking for candy with 'Trick or Treat'."
    },
    {
      "id": "bitingmonster-03",
      "topic": "shape",
      "learningSlide": 3,
      "prompt": "What kind of figure are students asked to construct?",
      "choices": [
        "A banknote counter",
        "A bridge deck",
        "A laundry drum",
        "A skull monster"
      ],
      "correctIndex": 3,
      "hint": "The model imitates a skull-like creature that can bite.",
      "explanation": "Page 3 identifies the skull structure as a learning objective."
    },
    {
      "id": "bitingmonster-04",
      "topic": "shape",
      "learningSlide": 4,
      "prompt": "What moving action should the designed monster imitate?",
      "choices": [
        "Biting",
        "Swimming",
        "Racing a bicycle",
        "Lifting a fire ladder"
      ],
      "correctIndex": 0,
      "hint": "The model imitates a skull-like creature that can bite.",
      "explanation": "Page 4 asks how monsters bite while designing the model."
    },
    {
      "id": "bitingmonster-05",
      "topic": "hardware",
      "learningSlide": 3,
      "prompt": "Which motor type is specifically listed as a key lesson component?",
      "choices": [
        "Large generator",
        "Small motor",
        "Steam engine",
        "Hydraulic pump"
      ],
      "correctIndex": 1,
      "hint": "Motor and gearing are part of the mechanical build.",
      "explanation": "Page 3 highlights understanding a small motor."
    },
    {
      "id": "bitingmonster-06",
      "topic": "hardware",
      "learningSlide": 3,
      "prompt": "Which gear type is named among the lesson's mechanical elements?",
      "choices": [
        "Worm-only gear train",
        "Long belt conveyor",
        "Half-height bevel gear",
        "Differential planetary gear only"
      ],
      "correctIndex": 2,
      "hint": "Motor and gearing are part of the mechanical build.",
      "explanation": "Page 3 names the half-height bevel gear."
    },
    {
      "id": "bitingmonster-07",
      "topic": "control",
      "learningSlide": 5,
      "prompt": "How can students adjust how far the monster's mouth opens or closes?",
      "choices": [
        "Change the screen background only",
        "Increase the number of controller buttons",
        "Switch off every output",
        "Debug motor speed and time settings"
      ],
      "correctIndex": 3,
      "hint": "Programmed motor settings affect how far and how long the mouth moves.",
      "explanation": "Page 5 links the monster's occlusion degree to motor speed and time."
    },
    {
      "id": "bitingmonster-08",
      "topic": "control",
      "learningSlide": 5,
      "prompt": "Which programming module do students practice setting for the jaw motion?",
      "choices": [
        "Motor module",
        "Ultrasonic ranging chart",
        "MP3 playback folder",
        "Color sensor only"
      ],
      "correctIndex": 0,
      "hint": "Programmed motor settings affect how far and how long the mouth moves.",
      "explanation": "Page 5 directs learners to set the motor module."
    },
    {
      "id": "bitingmonster-09",
      "topic": "sequence",
      "learningSlide": 3,
      "prompt": "What programming arrangement is listed as a central learning difficulty?",
      "choices": [
        "Random order of unrelated blocks",
        "Sequential structure",
        "No control-flow order",
        "Only infinite loops"
      ],
      "correctIndex": 1,
      "hint": "The controller executes action blocks in order.",
      "explanation": "Page 3 requires understanding programming sequence."
    },
    {
      "id": "bitingmonster-10",
      "topic": "sequence",
      "learningSlide": 3,
      "prompt": "Which kind of programming blocks should students learn to use for the monster's movement?",
      "choices": [
        "Only text formatting",
        "Only video editing",
        "Action directives",
        "Only GPS mapping"
      ],
      "correctIndex": 2,
      "hint": "The controller executes action blocks in order.",
      "explanation": "Page 3 emphasizes action programming directive blocks."
    }
  ]
};
