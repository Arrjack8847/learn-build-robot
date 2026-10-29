/**
 * Grounded in the official Dancing Music Box teaching PDF text, with 1-based pages.
 * Requires visual page and educator review before registration for students.
 */
import type { QuizBank } from "../../quizStudio";

export const dancingMusicBoxBank: QuizBank = {
  "projectId": "dancing-music-box",
  "title": "Dancing Music Box",
  "sourcePdfPath": "public/Dancing Music Box.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "dancing-music-box-01",
      "topic": "project-function",
      "learningSlide": 4,
      "prompt": "What two actions describe the dancing music box in the lesson?",
      "choices": [
        "It turns and makes music",
        "It measures distance",
        "It folds into a chair",
        "It cleans the classroom"
      ],
      "correctIndex": 0,
      "hint": "Think about the two activities named in the story.",
      "explanation": "The lesson introduces a music box that can dance and make music."
    },
    {
      "id": "dancing-music-box-02",
      "topic": "project-function",
      "learningSlide": 4,
      "prompt": "What should a builder think about before making the music box?",
      "choices": [
        "Which mountain it will climb",
        "How many sensors detect rain",
        "How to make it swim",
        "How its moving parts will rotate"
      ],
      "correctIndex": 3,
      "hint": "Think about the movement you want the finished model to show.",
      "explanation": "The design discussion asks how the music box works and what makes it rotate."
    },
    {
      "id": "dancing-music-box-03",
      "topic": "link-mechanism",
      "learningSlide": 3,
      "prompt": "Which mechanism is one of the main topics in the dancing music box lesson?",
      "choices": [
        "Water pump",
        "Infrared scanner",
        "Solar cell",
        "Link mechanism"
      ],
      "correctIndex": 3,
      "hint": "The lesson discusses parts that connect to make movement.",
      "explanation": "The teaching objectives explicitly include learning about a linkage mechanism."
    },
    {
      "id": "dancing-music-box-04",
      "topic": "link-mechanism",
      "learningSlide": 3,
      "prompt": "What should you check when putting the links together?",
      "choices": [
        "The sound from the computer",
        "The size of the paper cover",
        "Their intended spacing and building order",
        "The colour of the classroom walls"
      ],
      "correctIndex": 2,
      "hint": "The building guidance mentions distance and sequence.",
      "explanation": "The lesson stresses the links' fixed distance and correct building sequence."
    },
    {
      "id": "dancing-music-box-05",
      "topic": "gear-transmission",
      "learningSlide": 3,
      "prompt": "Which mechanism is taught alongside linkage?",
      "choices": [
        "Digital photography",
        "Magnet reading",
        "Gear transmission",
        "Water filtering"
      ],
      "correctIndex": 2,
      "hint": "Think about toothed parts passing turning motion.",
      "explanation": "Gear transmission is named as a core teaching objective for this model."
    },
    {
      "id": "dancing-music-box-06",
      "topic": "gear-transmission",
      "learningSlide": 5,
      "prompt": "Which structure should you be able to explain after building the dancing music box?",
      "choices": [
        "A wind direction flag",
        "Its gearing structure",
        "A bicycle brake cable",
        "A thermometer scale"
      ],
      "correctIndex": 1,
      "hint": "Recall the mechanism the teacher explains during hands-on work.",
      "explanation": "The hands-on section explicitly asks the teacher to explain the music box's gearing structure."
    },
    {
      "id": "dancing-music-box-07",
      "topic": "motor-controls",
      "learningSlide": 5,
      "prompt": "Which setting can you change to make the music box move faster or slower?",
      "choices": [
        "Model name",
        "Motor speed value",
        "Screen brightness only",
        "PDF page number"
      ],
      "correctIndex": 1,
      "hint": "Look for the value that controls how quickly a motor turns.",
      "explanation": "The lesson directs students to adjust the motor speed value."
    },
    {
      "id": "dancing-music-box-08",
      "topic": "motor-controls",
      "learningSlide": 5,
      "prompt": "Which programming module should you set to control the model's movement?",
      "choices": [
        "Motor module",
        "Weather report module",
        "Calendar module",
        "Camera album module"
      ],
      "correctIndex": 0,
      "hint": "A turning model needs instructions for its moving electrical part.",
      "explanation": "The hands-on lesson teaches students to set the motor module."
    },
    {
      "id": "dancing-music-box-09",
      "topic": "programming-workflow",
      "learningSlide": 3,
      "prompt": "What type of programming structure is a learning goal for this project?",
      "choices": [
        "Sequential programming",
        "Randomly skipping all steps",
        "No instructions at all",
        "Only drawing on paper"
      ],
      "correctIndex": 0,
      "hint": "Think of instructions that run in a planned order.",
      "explanation": "The teaching objectives specify understanding the sequential structure of programming."
    },
    {
      "id": "dancing-music-box-10",
      "topic": "programming-workflow",
      "learningSlide": 5,
      "prompt": "How does the lesson connect the controller to a computer for programming?",
      "choices": [
        "With a fan blade",
        "With a paper hinge",
        "With a rubber tire",
        "With a USB cable"
      ],
      "correctIndex": 3,
      "hint": "Think about the cable used to send code.",
      "explanation": "The instructions specifically describe connecting controller and computer using USB."
    }
  ]
};
