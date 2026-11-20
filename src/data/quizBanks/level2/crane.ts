/** Derived from the supplied Level 2 Building PDF used as Learning fallback. Source uses a teacher guide plus illustrated construction steps. */
import type { QuizBank } from "../../quizStudio";
export const craneBank: QuizBank = {
  "projectId": "level-2-crane",
  "title": "Crane",
  "sourcePdfPath": "public/Crane.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "crane-01",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "Why do construction sites use cranes?",
      "choices": [
        "To measure classroom noise",
        "To display pictures",
        "To generate sunlight",
        "To raise heavy materials"
      ],
      "correctIndex": 3,
      "explanation": "The Crane teaching manual identifies this in its purpose lesson (page 4): to raise heavy materials.",
      "hint": "Think about the role of purpose in the model."
    },
    {
      "id": "crane-02",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "Which materials are given as examples of heavy loads at a construction site?",
      "choices": [
        "Pencils",
        "Cement and steel",
        "Paper and cotton only",
        "Plastic buttons"
      ],
      "correctIndex": 1,
      "explanation": "The Crane teaching manual identifies this in its purpose lesson (page 4): cement and steel.",
      "hint": "Think about the role of purpose in the model."
    },
    {
      "id": "crane-03",
      "topic": "pulley-blocks",
      "learningSlide": 3,
      "prompt": "Which pulley types are studied together in the crane's pulley block?",
      "choices": [
        "Only gears",
        "Only glass lenses",
        "Only electrical switches",
        "Fixed and movable pulleys"
      ],
      "correctIndex": 3,
      "explanation": "The Crane teaching manual identifies this in its pulley blocks lesson (page 3): fixed and movable pulleys.",
      "hint": "Think about the role of pulley blocks in the model."
    },
    {
      "id": "crane-04",
      "topic": "pulley-blocks",
      "learningSlide": 3,
      "prompt": "What can the pulley block do with an applied pulling force?",
      "choices": [
        "Make the load weightless",
        "Help pull the load and change force direction",
        "Remove all gravity",
        "Turn the rope into a light"
      ],
      "correctIndex": 1,
      "explanation": "The Crane teaching manual identifies this in its pulley blocks lesson (page 3): help pull the load and change force direction.",
      "hint": "Think about the role of pulley blocks in the model."
    },
    {
      "id": "crane-05",
      "topic": "motor-control",
      "learningSlide": 3,
      "prompt": "What kind of motor operation is explicitly a learning focus?",
      "choices": [
        "Only a wind-powered fan",
        "Only a hand crank",
        "Only one passive wheel",
        "Dual-motor use"
      ],
      "correctIndex": 3,
      "explanation": "The Crane teaching manual identifies this in its motor control lesson (page 3): dual-motor use.",
      "hint": "Think about the role of motor control in the model."
    },
    {
      "id": "crane-06",
      "topic": "motor-control",
      "learningSlide": 4,
      "prompt": "Which crane motion does the topic analysis ask students to design?",
      "choices": [
        "Measuring room temperature",
        "Slewing or turning the crane arm",
        "Flashing a road light",
        "Changing a screen's color"
      ],
      "correctIndex": 1,
      "explanation": "The Crane teaching manual identifies this in its motor control lesson (page 4): slewing or turning the crane arm.",
      "hint": "Think about the role of motor control in the model."
    },
    {
      "id": "crane-07",
      "topic": "programming",
      "learningSlide": 3,
      "prompt": "Which programming blocks are taught for crane movement?",
      "choices": [
        "Only a drawing brush",
        "A music-only loop",
        "A photo editor",
        "Motor and delay/wait blocks"
      ],
      "correctIndex": 3,
      "explanation": "The Crane teaching manual identifies this in its programming lesson (page 3): motor and delay/wait blocks.",
      "hint": "Think about the role of programming in the model."
    },
    {
      "id": "crane-08",
      "topic": "programming",
      "learningSlide": 5,
      "prompt": "Which numeric value should learners debug to adjust crane operation?",
      "choices": [
        "Battery color",
        "Motor speed",
        "Screen brightness only",
        "Font size"
      ],
      "correctIndex": 1,
      "explanation": "The Crane teaching manual identifies this in its programming lesson (page 5): motor speed.",
      "hint": "Think about the role of programming in the model."
    },
    {
      "id": "crane-09",
      "topic": "building",
      "learningSlide": 5,
      "prompt": "What is a recommended hands-on task?",
      "choices": [
        "Keep all parts disconnected",
        "Use only a software image",
        "Never check movement",
        "Build the crane and examine its gearing"
      ],
      "correctIndex": 3,
      "explanation": "The Crane teaching manual identifies this in its building lesson (page 5): build the crane and examine its gearing.",
      "hint": "Think about the role of building in the model."
    },
    {
      "id": "crane-10",
      "topic": "building",
      "learningSlide": 6,
      "prompt": "What post-class check is explicitly suggested?",
      "choices": [
        "Can it grow new wheels?",
        "Can the crane arm turn left and right?",
        "Can the robot fly to the Moon?",
        "Can it print a newspaper?"
      ],
      "correctIndex": 1,
      "explanation": "The Crane teaching manual identifies this in its building lesson (page 6): can the crane arm turn left and right?.",
      "hint": "Think about the role of building in the model."
    }
  ]
};
