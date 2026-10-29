/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const ferociousSnakeBank: QuizBank = {
  "projectId": "ferocious-snake",
  "title": "Ferocious Snake",
  "sourcePdfPath": "public/Level 1/Learning/Biomimicry/Ferocious snake.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "ferocious-snake-01",
      "topic": "snake-adaptations",
      "learningSlide": 3,
      "prompt": "According to the lesson, which statement about snakes is true?",
      "choices": [
        "Some snakes, such as pythons, are not poisonous",
        "Snakes can only live in jungles",
        "All snakes eat plants",
        "Every snake is poisonous"
      ],
      "correctIndex": 0,
      "hint": "Think about the different types of snakes described.",
      "explanation": "The lesson notes that not all snakes are poisonous and gives pythons as an example."
    },
    {
      "id": "ferocious-snake-02",
      "topic": "snake-adaptations",
      "learningSlide": 4,
      "prompt": "Which habitat is listed as a place where snakes can live?",
      "choices": [
        "Only grass fields",
        "Deserts, oceans and jungles",
        "Only inside caves",
        "Only snowy mountains"
      ],
      "correctIndex": 1,
      "hint": "Recall the variety of habitats named in the introduction.",
      "explanation": "The introduction lists deserts, oceans and jungles among snake habitats."
    },
    {
      "id": "ferocious-snake-03",
      "topic": "hunting-behaviour",
      "learningSlide": 5,
      "prompt": "What does the lesson say a snake often does before striking prey?",
      "choices": [
        "Flies above the prey",
        "Makes a loud warning sound",
        "Waits quietly while disguised",
        "Builds a shelter"
      ],
      "correctIndex": 2,
      "hint": "Consider how the snake approaches an animal it wants to catch.",
      "explanation": "The lesson describes snakes disguising themselves and quietly waiting before striking."
    },
    {
      "id": "ferocious-snake-04",
      "topic": "hunting-behaviour",
      "learningSlide": 5,
      "prompt": "Which animal is mentioned as possible prey for a snake?",
      "choices": [
        "Butterfly only",
        "Earthworm only",
        "Honeybee only",
        "Mouse"
      ],
      "correctIndex": 3,
      "hint": "Look for an example in the hunting passage.",
      "explanation": "Mice are listed with birds and frogs as animals snakes may prey on."
    },
    {
      "id": "ferocious-snake-05",
      "topic": "geometry",
      "learningSlide": 7,
      "prompt": "Which hinged structure is described as stable?",
      "choices": [
        "A hinged triangle",
        "A chain of separate rods",
        "A single loose beam",
        "A freely hinged quadrilateral"
      ],
      "correctIndex": 0,
      "hint": "Compare the two shapes explored in the lesson.",
      "explanation": "The lesson contrasts stable triangles with quadrilaterals that deform easily.",
      "image": {
        "src": "/quiz-visuals/level1/ferocious-snake.svg",
        "alt": "A hinged triangle beside a flexible four-sided frame."
      }
    },
    {
      "id": "ferocious-snake-06",
      "topic": "geometry",
      "learningSlide": 23,
      "prompt": "Why can the robot snake stretch and shrink?",
      "choices": [
        "It changes the length of each peg",
        "It uses deformable quadrilateral links",
        "Its triangle frame cannot move",
        "It melts its beams"
      ],
      "correctIndex": 1,
      "hint": "Recall which shape was chosen to make the body flexible.",
      "explanation": "The evaluation explains that quadrilaterals can deform, allowing the model to expand and contract.",
      "image": {
        "src": "/quiz-visuals/level1/ferocious-snake.svg",
        "alt": "A hinged triangle beside a flexible four-sided frame."
      }
    },
    {
      "id": "ferocious-snake-07",
      "topic": "sensing",
      "learningSlide": 8,
      "prompt": "Which sensor acts like the robot snake's eyes?",
      "choices": [
        "Touch sensor",
        "Sound sensor",
        "Infrared sensor",
        "Color sensor"
      ],
      "correctIndex": 2,
      "hint": "The robot needs to notice something ahead.",
      "explanation": "The lesson specifies an infrared sensor to detect prey ahead of the model."
    },
    {
      "id": "ferocious-snake-08",
      "topic": "sensing",
      "learningSlide": 8,
      "prompt": "What event is intended to make the snake robot attack?",
      "choices": [
        "The controller screen turns blue",
        "The tail is removed",
        "The battery reaches full charge",
        "Its sensor spots prey"
      ],
      "correctIndex": 3,
      "hint": "Think about the trigger for the hunting action.",
      "explanation": "The infrared sensor detecting prey is the intended attack trigger."
    },
    {
      "id": "ferocious-snake-09",
      "topic": "robot-programming",
      "learningSlide": 21,
      "prompt": "What does the snake robot's motor do when prey is detected?",
      "choices": [
        "Starts working",
        "Detaches from the controller",
        "Changes into a sensor",
        "Stops permanently"
      ],
      "correctIndex": 0,
      "hint": "Follow the conditional rule on the coding slide.",
      "explanation": "The lesson states that the motor starts when the infrared sensor detects prey."
    },
    {
      "id": "ferocious-snake-10",
      "topic": "robot-programming",
      "learningSlide": 22,
      "prompt": "Which features can be added to the snake's program?",
      "choices": [
        "Paint without any code",
        "Sounds and loops",
        "Only paper decorations",
        "An extra battery type only"
      ],
      "correctIndex": 1,
      "hint": "Recall the two optional coding additions.",
      "explanation": "The coding section explicitly says sounds and loops can be added to the program."
    }
  ]
};
